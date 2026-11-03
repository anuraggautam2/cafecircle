import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    let investorId: string | undefined;
    if (userId) {
      const inv = await prisma.investor.findFirst({
        where: { userId },
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
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { campaignId, userId, amount, paymentMethod } = body;

    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      return NextResponse.json({ error: 'Valid investment amount is required' }, { status: 400 });
    }

    // 1. Fetch Campaign
    const campaign = await prisma.campaign.findUnique({
      where: { id: campaignId },
      include: { cafe: { include: { owner: true } } },
    });

    if (!campaign) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
    }

    // 2. Fetch or create Investor
    let targetUserId = userId || 'usr_investor_priya';
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

    // 9. Generate or ensure unique referral record for this backer and this cafe
    const refCode = `${(campaign.cafe.name.slice(0, 4) + '-' + targetUserId.slice(-4)).toUpperCase()}`;
    const referral = await prisma.referral.upsert({
      where: { referralCode: refCode },
      update: {},
      create: {
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

    // Notify cafe owner
    await prisma.notification.create({
      data: {
        userId: campaign.cafe.owner.userId,
        title: '💼 New Community Backer',
        message: `A community investor contributed ₹${numericAmount.toLocaleString('en-IN')} to "${campaign.title}".`,
        type: 'INVESTMENT',
        link: '/dashboard/owner',
      },
    });

    return NextResponse.json({
      success: true,
      investment,
      agreement,
      transaction,
      referralCode: referral.referralCode,
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error processing investment:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
