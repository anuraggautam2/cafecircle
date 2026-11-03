import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: { id: string } | Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await Promise.resolve(params);
    const id = resolvedParams?.id;

    if (!id) {
      return NextResponse.json({ error: 'Cafe ID or slug is required' }, { status: 400 });
    }

    const cafe = await prisma.cafe.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
      },
      include: {
        owner: {
          include: {
            user: true,
          },
        },
        branches: true,
        campaigns: {
          orderBy: { createdAt: 'desc' },
        },
        businessUpdates: {
          orderBy: { createdAt: 'desc' },
        },
        financialReports: {
          orderBy: { createdAt: 'desc' },
        },
        documents: true,
        reviews: {
          include: {
            user: true,
          },
          orderBy: { createdAt: 'desc' },
        },
        referrals: {
          include: {
            referrer: true,
          },
          orderBy: { totalVisits: 'desc' },
          take: 5,
        },
      },
    });

    if (!cafe) {
      return NextResponse.json({ error: 'Cafe not found' }, { status: 404 });
    }

    let parsedImages: string[] = [];
    try {
      if (typeof cafe.images === 'string') {
        parsedImages = JSON.parse(cafe.images);
      } else if (Array.isArray(cafe.images)) {
        parsedImages = cafe.images;
      }
    } catch {
      parsedImages = [];
    }

    return NextResponse.json({
      ...cafe,
      images: parsedImages,
    });
  } catch (error: any) {
    console.error('Error fetching cafe detail:', error);
    return NextResponse.json({ error: error?.message || 'Internal server error' }, { status: 500 });
  }
}
