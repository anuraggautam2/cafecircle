import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

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

    return NextResponse.json({
      ...campaign,
      cafe: {
        ...campaign.cafe,
        images: JSON.parse(campaign.cafe.images || '[]'),
      },
    });
  } catch (error: any) {
    console.error('Error fetching campaign detail:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
