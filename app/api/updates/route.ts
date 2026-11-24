import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireRole } from '@/lib/auth-server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const cafeId = searchParams.get('cafeId');

    const where: any = {};

    if (cafeId) {
      where.cafeId = cafeId;
    } else if (userId) {
      // Find all cafes where the investor holds active investments
      const investor = await prisma.investor.findFirst({
        where: { userId },
      });

      if (investor) {
        const userInvestments = await prisma.investment.findMany({
          where: { investorId: investor.id },
          include: { campaign: true },
        });

        const backedCafeIds = Array.from(new Set(userInvestments.map((i) => i.campaign?.cafeId).filter(Boolean))) as string[];

        if (backedCafeIds.length > 0) {
          where.cafeId = { in: backedCafeIds };
        } else {
          // Fallback: If user hasn't backed any campaigns yet, return public community updates
          where.isPublic = true;
        }
      } else {
        where.isPublic = true;
      }
    } else {
      where.isPublic = true;
    }

    const updates = await prisma.businessUpdate.findMany({
      where,
      include: {
        cafe: {
          select: {
            id: true,
            name: true,
            slug: true,
            coverImage: true,
            city: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    const parsed = updates.map((u) => {
      let parsedImages = [];
      try {
        parsedImages = JSON.parse(u.images || '[]');
      } catch {
        parsedImages = [];
      }
      return {
        ...u,
        images: parsedImages,
      };
    });

    return NextResponse.json(parsed);
  } catch (error: any) {
    console.error('Error fetching updates:', error);
    return NextResponse.json({ error: error?.message || 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { user, error } = await requireRole(request, ['CAFE_OWNER', 'ADMIN']);
    if (error || !user) {
      return error || NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await request.json();
    const { cafeId, title, content, milestoneTag, imageUrl } = body;

    if (!cafeId || !title || !content) {
      return NextResponse.json({ error: 'cafeId, title, and content are required' }, { status: 400 });
    }

    // Verify cafe existence and ownership
    const cafe = await prisma.cafe.findUnique({
      where: { id: cafeId },
      include: {
        owner: true,
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

    if (!cafe) {
      return NextResponse.json({ error: 'Cafe not found' }, { status: 404 });
    }

    if (user.role !== 'ADMIN') {
      const isOwner = cafe.owner?.userId === user.id || cafe.ownerId === user.cafeOwner?.id;
      if (!isOwner) {
        return NextResponse.json({ error: 'Forbidden: You can only publish updates for cafes you own' }, { status: 403 });
      }
    }

    const images = imageUrl ? [imageUrl] : [];

    const update = await prisma.businessUpdate.create({
      data: {
        cafeId: cafe.id,
        title,
        content,
        milestoneTag: milestoneTag || 'Expansion Progress',
        images: JSON.stringify(images),
        isPublic: true,
        authorRole: 'Founder & Head Roaster',
      },
    });

    // Notify all investors of this cafe
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

    return NextResponse.json(update, { status: 201 });
  } catch (error: any) {
    console.error('Error creating business update:', error);
    return NextResponse.json({ error: error?.message || 'Internal server error' }, { status: 500 });
  }
}
