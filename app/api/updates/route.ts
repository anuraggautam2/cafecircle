import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

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
      const investorUserIds = new Set<string>();
      cafe.campaigns.forEach((camp) => {
        camp.investments.forEach((inv) => {
          investorUserIds.add(inv.investor.userId);
        });
      });

      for (const userId of Array.from(investorUserIds)) {
        await prisma.notification.create({
          data: {
            userId,
            title: `📢 Update from ${cafe.name}`,
            message: title,
            type: 'UPDATE',
            link: `/cafes/${cafe.slug}`,
          },
        });
      }
    }

    return NextResponse.json(update, { status: 201 });
  } catch (error: any) {
    console.error('Error creating business update:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
