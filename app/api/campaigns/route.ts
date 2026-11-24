import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireRole } from '@/lib/auth-server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const city = searchParams.get('city');

    const where: any = {};
    if (status && status !== 'ALL') {
      where.status = status;
    }
    if (city && city !== 'All') {
      where.expansionCity = { contains: city };
    }

    const campaigns = await prisma.campaign.findMany({
      where,
      include: {
        cafe: {
          include: {
            owner: true,
          },
        },
        investments: {
          take: 5,
          orderBy: { createdAt: 'desc' },
          include: {
            investor: {
              include: {
                user: true,
              },
            },
          },
        },
      },
      orderBy: { raisedAmount: 'desc' },
    });

    const parsed = campaigns.map((c) => ({
      ...c,
      cafe: {
        ...c.cafe,
        images: JSON.parse(c.cafe.images || '[]'),
      },
    }));

    return NextResponse.json(parsed);
  } catch (error: any) {
    console.error('Error fetching campaigns:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    // 1. Enforce server-side role authorization
    const { user, error } = await requireRole(request, ['CAFE_OWNER', 'ADMIN']);
    if (error || !user) {
      return error || NextResponse.json(
        { error: 'Forbidden: Cafe Owner or Admin authorization required to create a campaign.' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      cafeId,
      title,
      pitch,
      reasonForFunding,
      expansionPlan,
      targetAmount,
      minInvestment,
      maxInvestment,
      durationDays,
      investmentStructure,
      returnTerms,
      riskFactors,
      expansionCity,
      expansionArea,
      projectedReturnRate,
      repaymentPeriod,
    } = body;

    if (!cafeId) {
      return NextResponse.json({ error: 'A valid cafeId is required to launch a campaign.' }, { status: 400 });
    }

    if (!title || !pitch) {
      return NextResponse.json({ error: 'Campaign title and pitch are required.' }, { status: 400 });
    }

    const parsedTarget = parseFloat(targetAmount);
    if (isNaN(parsedTarget) || parsedTarget <= 0) {
      return NextResponse.json({ error: 'A valid target funding amount is required.' }, { status: 400 });
    }

    // 2. Verify Cafe existence and ownership
    const cafe = await prisma.cafe.findUnique({
      where: { id: cafeId },
      include: { owner: true },
    });

    if (!cafe) {
      return NextResponse.json({ error: 'Cafe not found.' }, { status: 404 });
    }

    // If caller is not ADMIN, verify they actually own this cafe
    if (user.role !== 'ADMIN') {
      const isOwner = cafe.owner?.userId === user.id || cafe.ownerId === user.cafeOwner?.id;
      if (!isOwner) {
        return NextResponse.json(
          { error: 'Forbidden: You can only launch campaigns for cafes registered under your account.' },
          { status: 403 }
        );
      }
    }

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const days = parseInt(durationDays || '30', 10);
    const endDate = new Date(Date.now() + days * 86400000);

    const campaign = await prisma.campaign.create({
      data: {
        cafeId: cafe.id,
        title,
        slug: `${slug}-${Date.now().toString().slice(-4)}`,
        pitch,
        reasonForFunding: reasonForFunding || pitch,
        expansionPlan: expansionPlan || reasonForFunding || pitch,
        targetAmount: parsedTarget,
        minInvestment: parseFloat(minInvestment || '5000'),
        maxInvestment: parseFloat(maxInvestment || '100000'),
        startDate: new Date(),
        endDate,
        status: 'ACTIVE',
        investmentStructure: investmentStructure || 'REVENUE_SHARE',
        returnTerms: returnTerms || 'Quarterly simulated revenue share of 5% gross branch turnover.',
        riskFactors: riskFactors || 'General business operational and lease risks.',
        expansionCity: expansionCity || 'Bengaluru',
        expansionArea: expansionArea || 'Koramangala',
        projectedReturnRate: projectedReturnRate || '12% - 15% p.a. (Simulated)',
        repaymentPeriod: repaymentPeriod || '24 - 36 Months',
      },
    });

    return NextResponse.json(campaign, { status: 201 });
  } catch (error: any) {
    console.error('Error creating campaign:', error);
    return NextResponse.json({ error: error?.message || 'Failed to create campaign' }, { status: 500 });
  }
}
