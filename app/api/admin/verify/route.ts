import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, id, status, isVerified } = body;

    if (type === 'CAFE') {
      const updated = await prisma.cafe.update({
        where: { id },
        data: {
          isVerified: isVerified !== undefined ? isVerified : true,
          verificationBadge: status || 'VERIFIED_COMMUNITY_CAFE',
        },
      });
      return NextResponse.json({ success: true, cafe: updated });
    }

    if (type === 'CAMPAIGN') {
      const updated = await prisma.campaign.update({
        where: { id },
        data: {
          status: status || 'ACTIVE',
        },
      });
      return NextResponse.json({ success: true, campaign: updated });
    }

    if (type === 'CAFE_OWNER') {
      const updated = await prisma.cafeOwner.update({
        where: { id },
        data: {
          isVerified: isVerified !== undefined ? isVerified : true,
          verificationStatus: status || 'VERIFIED',
        },
      });
      return NextResponse.json({ success: true, owner: updated });
    }

    return NextResponse.json({ error: 'Invalid entity type' }, { status: 400 });
  } catch (error: any) {
    console.error('Error in admin verify:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
