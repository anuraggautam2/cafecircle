import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/auth-server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const cafeId = searchParams.get('cafeId');

    if (!cafeId) {
      return NextResponse.json({ error: 'cafeId query parameter is required' }, { status: 400 });
    }

    const reviews = await prisma.review.findMany({
      where: { cafeId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
            role: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(reviews);
  } catch (error: any) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json({ error: error?.message || 'Failed to fetch reviews' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { user, error } = await requireAuth(request);
    if (error || !user) {
      return error || NextResponse.json({ error: 'Unauthorized: Sign in required to submit a review' }, { status: 401 });
    }

    const body = await request.json();
    const { cafeId, rating, comment } = body;

    if (!cafeId || !comment || !comment.trim()) {
      return NextResponse.json({ error: 'cafeId and comment text are required' }, { status: 400 });
    }

    const numRating = parseFloat(rating);
    if (isNaN(numRating) || numRating < 1 || numRating > 5) {
      return NextResponse.json({ error: 'Rating must be a number between 1.0 and 5.0' }, { status: 400 });
    }

    // Verify Cafe exists
    const cafe = await prisma.cafe.findUnique({
      where: { id: cafeId },
      include: {
        campaigns: {
          include: {
            investments: {
              where: {
                investor: {
                  userId: user.id,
                },
              },
            },
          },
        },
      },
    });

    if (!cafe) {
      return NextResponse.json({ error: 'Cafe not found' }, { status: 404 });
    }

    // Determine if the reviewer is an investor in this cafe
    const hasInvested = cafe.campaigns.some((camp) => camp.investments.length > 0);

    // Create the Review
    const review = await prisma.review.create({
      data: {
        cafeId: cafe.id,
        userId: user.id,
        rating: Math.round(numRating * 10) / 10,
        comment: comment.trim(),
        isInvestor: hasInvested,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
            role: true,
          },
        },
      },
    });

    // Recalculate Cafe average rating and review count
    const allReviews = await prisma.review.findMany({
      where: { cafeId: cafe.id },
      select: { rating: true },
    });

    const totalScore = allReviews.reduce((sum, r) => sum + r.rating, 0);
    const avgRating = allReviews.length > 0 ? Math.round((totalScore / allReviews.length) * 10) / 10 : numRating;

    await prisma.cafe.update({
      where: { id: cafe.id },
      data: {
        rating: avgRating,
        reviewCount: { increment: 1 },
      },
    });

    return NextResponse.json({
      success: true,
      review,
      newAverageRating: avgRating,
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating review:', error);
    return NextResponse.json({ error: error?.message || 'Failed to submit review' }, { status: 500 });
  }
}
