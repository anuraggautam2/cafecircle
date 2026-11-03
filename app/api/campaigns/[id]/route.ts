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
      return NextResponse.json({ error: 'Campaign ID or slug is required' }, { status: 400 });
    }

    const campaign = await prisma.campaign.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
      },
      include: {
        cafe: {
          include: {
            owner: {
              include: {
                user: true,
              },
            },
            branches: true,
            businessUpdates: {
              orderBy: { createdAt: 'desc' },
              take: 3,
            },
            financialReports: {
              orderBy: { createdAt: 'desc' },
              take: 3,
            },
            documents: true,
          },
        },
        investments: {
          include: {
            investor: {
              include: {
                user: true,
              },
            },
            agreement: true,
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!campaign) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
    }

    let parsedImages: string[] = [];
    try {
      if (typeof campaign.cafe?.images === 'string') {
        parsedImages = JSON.parse(campaign.cafe.images);
      } else if (Array.isArray(campaign.cafe?.images)) {
        parsedImages = campaign.cafe.images;
      }
    } catch {
      parsedImages = [];
    }

    return NextResponse.json({
      ...campaign,
      cafe: {
        ...campaign.cafe,
        images: parsedImages,
      },
    });
  } catch (error: any) {
    console.error('Error fetching campaign detail:', error);
    return NextResponse.json({ error: error?.message || 'Internal server error' }, { status: 500 });
  }
}
