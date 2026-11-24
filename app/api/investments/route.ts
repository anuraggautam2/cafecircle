import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthenticatedUser, requireAuth } from '@/lib/auth-server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const requestedUserId = searchParams.get('userId');
    const authUser = await getAuthenticatedUser(request);

    // If caller has an active session, enforce authorization boundary
    let targetUserId = requestedUserId;
    if (authUser) {
      if (authUser.role !== 'ADMIN') {
        // Non-admin callers can only view their own investments
        if (requestedUserId && requestedUserId !== authUser.id) {
          return NextResponse.json(
            { error: 'Forbidden: You can only view your own investment portfolio.' },
            { status: 403 }
          );
        }
        targetUserId = authUser.id;
      }
    }

    let investorId: string | undefined;
    if (targetUserId) {
      const inv = await prisma.investor.findFirst({
        where: { userId: targetUserId },
      });
      if (inv) investorId = inv.id;
    }

    const investments = await prisma.investment.findMany({
      where: investorId ? { investorId } : undefined,
      include: {
        campaign: {
          include: {
            cafe: true,
          },
        },
        agreement: true,
        transactions: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(investments);
  } catch (error: any) {
    console.error('Error fetching investments:', error);
    return NextResponse.json({ error: error?.message || 'Failed to fetch investments' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    // Server-side authentication check
    const { user: authUser, error: authError } = await requireAuth(request);
    if (authError || !authUser) {
      return authError || NextResponse.json(
        { error: 'Unauthorized: An authenticated session is required to participate in campaigns.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { campaignId, userId: requestedUserId, amount, paymentMethod } = body;

    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      return NextResponse.json({ error: 'A valid positive investment amount is required.' }, { status: 400 });
    }

    // 1. Fetch Campaign
    const campaign = await prisma.campaign.findUnique({
      where: { id: campaignId },
      include: { cafe: { include: { owner: true } } },
    });

    if (!campaign) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
    }

    if (campaign.status !== 'ACTIVE') {
      return NextResponse.json({ error: 'This campaign is not currently accepting investments.' }, { status: 400 });
    }

    if (campaign.minInvestment && numericAmount < campaign.minInvestment) {
      return NextResponse.json(
        { error: `Minimum contribution for this campaign is ₹${campaign.minInvestment.toLocaleString('en-IN')}` },
        { status: 400 }
      );
    }

    // 2. Identity Verification: Server never trusts spoofed browser client userId
    // Admin can test on behalf of an explicit user; otherwise force authenticated user id
    let targetUserId = authUser.id;
    if (authUser.role === 'ADMIN' && requestedUserId) {
      targetUserId = requestedUserId;
    }

    let investor = await prisma.investor.findFirst({
      where: { userId: targetUserId },
    });

    if (!investor) {
      investor = await prisma.investor.create({
        data: {
          userId: targetUserId,
          kycStatus: 'VERIFIED',
          totalInvested: 0,
          totalReturnsReceived: 0,
          activeInvestmentsCount: 0,
          ambassadorTier: 'Bronze Patron',
        },
      });
    }

    // 3. Generate Agreement & Certificate details
    const certNumber = `CC-CERT-${Date.now().toString().slice(-6)}`;
    const agreementNumber = `CC-AGR-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
    const txnRef = `TXN-SIM-${Date.now().toString().slice(-8)}`;

    // 4. Create Investment Record
    const investment = await prisma.investment.create({
      data: {
        campaignId: campaign.id,
        investorId: investor.id,
        amount: numericAmount,
        status: 'CONFIRMED',
        certificateNumber: certNumber,
        paymentMethod: paymentMethod || 'UPI_SIMULATED',
        paymentReference: txnRef,
        isSimulated: true,
        returnsAccrued: 0,
      },
    });

    // 5. Create Investment Agreement
    const agreement = await prisma.investmentAgreement.create({
      data: {
        investmentId: investment.id,
        agreementNumber,
        termSheetSnapshot: `${campaign.title} - ${campaign.investmentStructure} (${campaign.returnTerms}). Simulated agreement executed digitally.`,
        signedAt: new Date(),
        termsAccepted: true,
        pdfUrl: `https://storage.googleapis.com/cafecircle/agreements/${agreementNumber}.pdf`,
        status: 'ACTIVE',
      },
    });

    // 6. Create Transaction
    const transaction = await prisma.transaction.create({
      data: {
        userId: targetUserId,
        investmentId: investment.id,
        type: 'INVESTMENT_SIMULATED',
        amount: numericAmount,
        status: 'COMPLETED',
        referenceId: txnRef,
        notes: `Simulated investment in ${campaign.cafe.name} (${campaign.title})`,
        isSimulated: true,
      },
    });

    // 7. Update Campaign
    await prisma.campaign.update({
      where: { id: campaign.id },
      data: {
        raisedAmount: { increment: numericAmount },
        investorCount: { increment: 1 },
      },
    });

    // 8. Update Investor
    await prisma.investor.update({
      where: { id: investor.id },
      data: {
        totalInvested: { increment: numericAmount },
        activeInvestmentsCount: { increment: 1 },
      },
    });

    // 9. Generate or ensure unique, sanitized, URL-safe referral record
    // Check if the backer already has a referral record for this cafe
    let referral = await prisma.referral.findFirst({
      where: {
        referrerId: targetUserId,
        cafeId: campaign.cafe.id,
      },
    });

    if (!referral) {
      // Clean cafe prefix: alphanumeric only, uppercase, 4-6 chars
      const cafeBase = (campaign.cafe.slug || campaign.cafe.name)
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, '')
        .slice(0, 6) || 'CAFE';

      // Clean user prefix: alphanumeric only, uppercase, last 4 chars
      const userBase = targetUserId
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, '')
        .slice(-4) || 'USER';

      // Ensure code uniqueness and URL-safety
      let refCode = `${cafeBase}-${userBase}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
      let collision = await prisma.referral.findUnique({ where: { referralCode: refCode } });
      while (collision) {
        const freshSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
        refCode = `${cafeBase}-${userBase}-${freshSuffix}`;
        collision = await prisma.referral.findUnique({ where: { referralCode: refCode } });
      }

      referral = await prisma.referral.create({
        data: {
          referrerId: targetUserId,
          cafeId: campaign.cafe.id,
          referralCode: refCode,
          totalClicks: 0,
          totalVisits: 0,
          totalConversions: 0,
          totalShares: 0,
          advocatePoints: 100, // Welcome points
        },
      });
    }

    // 10. Send Notifications
    await prisma.notification.create({
      data: {
        userId: targetUserId,
        title: '🎉 Investment Confirmed (Simulated)',
        message: `Successfully contributed ₹${numericAmount.toLocaleString('en-IN')} to ${campaign.cafe.name}. Certificate ${certNumber} generated!`,
        type: 'INVESTMENT',
        link: '/dashboard/investor',
      },
    });

    // Notify cafe owner if owner user exists
    if (campaign.cafe.owner?.userId) {
      await prisma.notification.create({
        data: {
          userId: campaign.cafe.owner.userId,
          title: '💼 New Community Backer',
          message: `A community investor contributed ₹${numericAmount.toLocaleString('en-IN')} to "${campaign.title}".`,
          type: 'INVESTMENT',
          link: '/dashboard/owner',
        },
      });
    }

    return NextResponse.json({
      success: true,
      investment,
      agreement,
      transaction,
      referralCode: referral.referralCode,
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error processing investment:', error);
    return NextResponse.json({ error: error?.message || 'Failed to process investment' }, { status: 500 });
  }
}
