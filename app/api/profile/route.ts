import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/auth-server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { user: authUser, error } = await requireAuth(request);
    if (error || !authUser) {
      return error || NextResponse.json({ error: 'Unauthorized: Session required' }, { status: 401 });
    }

    const fullUser = await prisma.user.findUnique({
      where: { id: authUser.id },
      include: {
        cafeOwner: {
          include: {
            cafes: {
              select: {
                id: true,
                name: true,
                slug: true,
                city: true,
              },
            },
          },
        },
        investor: true,
      },
    });

    if (!fullUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(fullUser);
  } catch (error: any) {
    console.error('Error fetching profile:', error);
    return NextResponse.json({ error: error?.message || 'Failed to fetch profile' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { user: authUser, error } = await requireAuth(request);
    if (error || !authUser) {
      return error || NextResponse.json({ error: 'Unauthorized: Session required' }, { status: 401 });
    }

    const body = await request.json();
    const {
      name,
      city,
      bio,
      phone,
      businessName,
      businessPan,
      gstNumber,
      bankAccountDetails,
    } = body;

    // Update User base fields
    const updatedUser = await prisma.user.update({
      where: { id: authUser.id },
      data: {
        ...(name ? { name: name.trim() } : {}),
        ...(city !== undefined ? { city: city.trim() } : {}),
        ...(bio !== undefined ? { bio: bio.trim() } : {}),
        ...(phone !== undefined ? { phone: phone.trim() } : {}),
      },
    });

    // If Cafe Owner, update business entity records
    let updatedOwner = null;
    if (authUser.role === 'CAFE_OWNER' && authUser.cafeOwner) {
      updatedOwner = await prisma.cafeOwner.update({
        where: { id: authUser.cafeOwner.id },
        data: {
          ...(businessName ? { businessName: businessName.trim() } : {}),
          ...(businessPan !== undefined ? { businessPan: businessPan.trim() } : {}),
          ...(gstNumber !== undefined ? { gstNumber: gstNumber.trim() } : {}),
          ...(bankAccountDetails !== undefined ? { bankAccountDetails: bankAccountDetails.trim() } : {}),
        },
      });
    }

    return NextResponse.json({
      success: true,
      user: {
        ...updatedUser,
        cafeOwner: updatedOwner || authUser.cafeOwner,
      },
    });
  } catch (error: any) {
    console.error('Error updating profile:', error);
    return NextResponse.json({ error: error?.message || 'Failed to update profile' }, { status: 500 });
  }
}
