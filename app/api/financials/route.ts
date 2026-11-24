import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireRole } from '@/lib/auth-server';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const { user, error } = await requireRole(request, ['CAFE_OWNER', 'ADMIN']);
    if (error || !user) {
      return error || NextResponse.json({ error: 'Unauthorized: Owner authorization required.' }, { status: 403 });
    }

    const body = await request.json();
    const { cafeId, month, year, grossRevenue, netProfit, customerFootfall, notes } = body;

    if (!cafeId) {
      return NextResponse.json({ error: 'A valid cafeId is required.' }, { status: 400 });
    }

    const cafe = await prisma.cafe.findUnique({
      where: { id: cafeId },
      include: { owner: true },
    });

    if (!cafe) {
      return NextResponse.json({ error: 'Cafe not found.' }, { status: 404 });
    }

    if (user.role !== 'ADMIN') {
      const isOwner = cafe.owner?.userId === user.id || cafe.ownerId === user.cafeOwner?.id;
      if (!isOwner) {
        return NextResponse.json(
          { error: 'Forbidden: You can only publish financial records for your own cafes.' },
          { status: 403 }
        );
      }
    }

    const parsedGross = parseFloat(grossRevenue);
    const parsedNet = parseFloat(netProfit);

    if (isNaN(parsedGross) || isNaN(parsedNet)) {
      return NextResponse.json({ error: 'Valid gross revenue and net profit numbers are required.' }, { status: 400 });
    }

    const report = await prisma.financialReport.create({
      data: {
        cafeId: cafe.id,
        month: month || new Date().toLocaleString('en-US', { month: 'long' }),
        year: parseInt(year || new Date().getFullYear().toString(), 10),
        grossRevenue: parsedGross,
        netProfit: parsedNet,
        customerFootfall: parseInt(customerFootfall || '0', 10),
        notes: notes || 'Monthly performance report published for verified community investors.',
        isVerified: true,
      },
    });

    return NextResponse.json(report, { status: 201 });
  } catch (error: any) {
    console.error('Error recording financial report:', error);
    return NextResponse.json({ error: error?.message || 'Internal server error' }, { status: 500 });
  }
}
