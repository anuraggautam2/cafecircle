import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireRole } from '@/lib/auth-server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const city = searchParams.get('city');
    const search = searchParams.get('search');
    const status = searchParams.get('status');
    const cuisine = searchParams.get('cuisine');
    const minRating = searchParams.get('minRating');
    const openNow = searchParams.get('openNow');
    const ownerId = searchParams.get('ownerId');

    const where: any = {};

    if (ownerId) {
      where.owner = {
        OR: [
          { id: ownerId },
          { userId: ownerId },
        ],
      };
    }

    if (city && city !== 'All') {
      where.city = { contains: city };
    }

    if (cuisine && cuisine !== 'All') {
      where.cuisine = { contains: cuisine };
    }

    if (minRating && parseFloat(minRating) > 0) {
      where.rating = { gte: parseFloat(minRating) };
    }

    if (openNow === 'true') {
      where.isOpen = true;
    }

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
        { city: { contains: search } },
        { address: { contains: search } },
        { tagline: { contains: search } },
        { cuisine: { contains: search } },
      ];
    }

    const cafes = await prisma.cafe.findMany({
      where,
      include: {
        campaigns: {
          where: status ? { status } : undefined,
        },
        branches: true,
        businessUpdates: {
          orderBy: { createdAt: 'desc' },
          take: 2,
        },
        reviews: {
          take: 3,
          orderBy: { createdAt: 'desc' },
        },
      },
      orderBy: { rating: 'desc' },
    });

    const parsedCafes = cafes.map((cafe) => ({
      ...cafe,
      images: JSON.parse(cafe.images || '[]'),
    }));

    return NextResponse.json(parsedCafes);
  } catch (error: any) {
    console.error('Error fetching cafes:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    // 1. Server-side role guard: only verified CAFE_OWNER or ADMIN can register new cafes
    const { user, error } = await requireRole(request, ['CAFE_OWNER', 'ADMIN']);
    if (error || !user) {
      return error || NextResponse.json(
        { error: 'Forbidden: Cafe Owner or Admin role required to register a cafe' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { name, tagline, description, story, logo, coverImage, address, city, state, ownerId } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'Cafe name is required' }, { status: 400 });
    }

    if (!address || !address.trim()) {
      return NextResponse.json({ error: 'Cafe physical address is required' }, { status: 400 });
    }

    // Determine target ownerId
    let targetOwnerId = user.cafeOwner?.id;
    if (user.role === 'ADMIN' && ownerId) {
      targetOwnerId = ownerId;
    }

    if (!targetOwnerId) {
      // Find or create cafe owner profile for this user
      let owner = await prisma.cafeOwner.findFirst({
        where: { userId: user.id },
      });
      if (!owner) {
        owner = await prisma.cafeOwner.create({
          data: {
            userId: user.id,
            businessName: `${name} Hospitality`,
            isVerified: user.role === 'ADMIN',
            verificationStatus: user.role === 'ADMIN' ? 'VERIFIED' : 'PENDING',
          },
        });
      }
      targetOwnerId = owner.id;
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const cafe = await prisma.cafe.create({
      data: {
        name: name.trim(),
        slug: `${slug}-${Date.now().toString().slice(-4)}`,
        tagline: tagline || 'Craft Specialty Coffee & Community Hub',
        description: description || 'Specialty cafe and community roastery.',
        story: story || description || 'Handcrafted coffee and artisanal bakes.',
        logo: logo || 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=200&q=80',
        coverImage: coverImage || 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1200&q=80',
        images: JSON.stringify([coverImage || 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80']),
        address: address.trim(),
        city: city || 'Ghaziabad',
        state: state || 'Uttar Pradesh',
        ownerId: targetOwnerId,
        isVerified: user.role === 'ADMIN',
        verificationBadge: user.role === 'ADMIN' ? 'VERIFIED_COMMUNITY_CAFE' : 'PENDING_VERIFICATION',
      },
    });

    return NextResponse.json(cafe, { status: 201 });
  } catch (error: any) {
    console.error('Error creating cafe:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
