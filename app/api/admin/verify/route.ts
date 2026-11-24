import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireRole } from '@/lib/auth-server';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    // 1. Server-side role guard: require verified ADMIN role in the database
    const { user, error } = await requireRole(request, 'ADMIN');
    if (error || !user) {
      return error || NextResponse.json(
        { error: 'Forbidden: Admin authorization required to verify platform entities.' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { type, id, status, isVerified } = body;

    if (!id || !type) {
      return NextResponse.json({ error: 'Missing required parameters: entity type and id are mandatory.' }, { status: 400 });
    }

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

    return NextResponse.json({ error: 'Invalid entity type. Must be CAFE, CAMPAIGN, or CAFE_OWNER.' }, { status: 400 });
  } catch (error: any) {
    console.error('Error in admin verify:', error);
    return NextResponse.json({ error: error?.message || 'Internal server error' }, { status: 500 });
  }
}
