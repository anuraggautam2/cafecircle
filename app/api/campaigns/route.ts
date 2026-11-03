import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

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

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const days = parseInt(durationDays || '30', 10);
    const endDate = new Date(Date.now() + days * 86400000);

    const campaign = await prisma.campaign.create({
      data: {
        cafeId: cafeId || 'cafe_roastery',
        title,
        slug: `${slug}-${Date.now().toString().slice(-4)}`,
        pitch,
        reasonForFunding,
        expansionPlan: expansionPlan || reasonForFunding,
        targetAmount: parseFloat(targetAmount),
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
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
