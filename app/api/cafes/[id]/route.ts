import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

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

    return NextResponse.json({
      ...cafe,
      images: JSON.parse(cafe.images || '[]'),
    });
  } catch (error: any) {
    console.error('Error fetching cafe detail:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
