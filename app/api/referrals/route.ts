import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const cafeId = searchParams.get('cafeId');

    const where: any = {};
    if (userId) where.referrerId = userId;
    if (cafeId) where.cafeId = cafeId;

    const referrals = await prisma.referral.findMany({
      where,
      include: {
        cafe: true,
        referrer: true,
        conversions: {
          orderBy: { verifiedAt: 'desc' },
          take: 10,
        },
      },
      orderBy: { totalVisits: 'desc' },
    });

    // Also get top advocates for community leaderboard
    const allReferrals = await prisma.referral.findMany({
      include: {
        referrer: {
          include: {
            investor: true,
          },
        },
        cafe: true,
      },
      orderBy: { advocatePoints: 'desc' },
      take: 10,
    });

    const leaderboard = allReferrals.map((r, index) => ({
      rank: index + 1,
      name: r.referrer.name,
      avatar: r.referrer.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      tier: r.referrer.investor?.ambassadorTier || 'Patron Ambassador',
      cafeSupported: r.cafe.name,
      visitsDriven: r.totalVisits,
      advocateScore: r.advocatePoints,
      totalInvested: r.referrer.investor?.totalInvested || 15000,
    }));

    return NextResponse.json({
      referrals,
      leaderboard,
    });
  } catch (error: any) {
    console.error('Error fetching referrals:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Record a share, click, or simulated customer visit
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, referralCode, visitorName, conversionType } = body;

    const referral = await prisma.referral.findUnique({
      where: { referralCode },
      include: { referrer: true, cafe: true },
    });

    if (!referral) {
      return NextResponse.json({ error: 'Referral code not found' }, { status: 404 });
    }

    if (action === 'SHARE') {
      const updated = await prisma.referral.update({
        where: { id: referral.id },
        data: {
          totalShares: { increment: 1 },
          advocatePoints: { increment: 10 },
        },
      });
      return NextResponse.json({ success: true, updated });
    }

    if (action === 'CLICK') {
      const updated = await prisma.referral.update({
        where: { id: referral.id },
        data: {
          totalClicks: { increment: 1 },
          advocatePoints: { increment: 2 },
        },
      });
      return NextResponse.json({ success: true, updated });
    }

    if (action === 'CONVERT_VISIT') {
      const guestName = visitorName || 'Community Guest';
      const cType = conversionType || 'CAFE_VISIT';

      const conversion = await prisma.referralConversion.create({
        data: {
          referralId: referral.id,
          visitorName: guestName,
          conversionType: cType,
          rewardCredits: cType === 'INVESTMENT' ? 200 : 50,
        },
      });

      const pointsGain = cType === 'INVESTMENT' ? 150 : 40;
      const updated = await prisma.referral.update({
        where: { id: referral.id },
        data: {
          totalVisits: { increment: 1 },
          totalConversions: { increment: 1 },
          advocatePoints: { increment: pointsGain },
        },
      });

      // Send notification to referrer
      await prisma.notification.create({
        data: {
          userId: referral.referrerId,
          title: '☕ Referral Visit Tracked!',
          message: `${guestName} visited ${referral.cafe.name} through your link. You earned +${pointsGain} advocate points!`,
          type: 'REFERRAL',
          link: '/growth-engine',
        },
      });

      return NextResponse.json({ success: true, conversion, referral: updated });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    console.error('Error recording referral activity:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
