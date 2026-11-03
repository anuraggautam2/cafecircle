import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { cafeId, title, content, milestoneTag, imageUrl } = body;

    const images = imageUrl ? [imageUrl] : [];

    const update = await prisma.businessUpdate.create({
      data: {
        cafeId: cafeId || 'cafe_roastery',
        title,
        content,
        milestoneTag: milestoneTag || 'Expansion Progress',
        images: JSON.stringify(images),
        isPublic: true,
        authorRole: 'Founder & Head Roaster',
      },
    });

    // Notify all investors of this cafe
    const cafe = await prisma.cafe.findUnique({
      where: { id: cafeId || 'cafe_roastery' },
      include: {
        campaigns: {
          include: {
            investments: {
              include: {
                investor: true,
              },
            },
          },
        },
      },
    });

    if (cafe) {
      for (const camp of cafe.campaigns) {
        for (const inv of camp.investments) {
          await prisma.notification.create({
            data: {
              userId: inv.investor.userId,
              title: `Update from ${cafe.name}`,
              message: `${title}: ${content.slice(0, 100)}...`,
              type: 'UPDATE',
              link: `/cafes/${cafe.slug || cafe.id}`,
            },
          });
        }
      }
    }

    return NextResponse.json(update, { status: 201 });
  } catch (error: any) {
    console.error('Error creating business update:', error);
    return NextResponse.json({ error: error?.message || 'Internal server error' }, { status: 500 });
  }
}
