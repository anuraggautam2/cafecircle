import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { cafeId, month, year, grossRevenue, netProfit, customerFootfall, notes } = body;

    const report = await prisma.financialReport.create({
      data: {
        cafeId: cafeId || 'cafe_roastery',
        month: month || 'November',
        year: parseInt(year || '2026', 10),
        grossRevenue: parseFloat(grossRevenue),
        netProfit: parseFloat(netProfit),
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
