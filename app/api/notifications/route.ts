import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/auth-server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { user: authUser, error } = await requireAuth(request);
    if (error || !authUser) {
      return error || NextResponse.json({ error: 'Unauthorized: Session required' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const requestedUserId = searchParams.get('userId');

    // Enforce user isolation: non-admins can only see their own notifications
    let targetUserId = authUser.id;
    if (authUser.role === 'ADMIN' && requestedUserId) {
      targetUserId = requestedUserId;
    } else if (requestedUserId && requestedUserId !== authUser.id) {
      return NextResponse.json(
        { error: 'Forbidden: You can only view your own notifications.' },
        { status: 403 }
      );
    }

    const notifications = await prisma.notification.findMany({
      where: { userId: targetUserId },
      orderBy: { createdAt: 'desc' },
      take: 30,
    });

    return NextResponse.json(notifications);
  } catch (error: any) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json({ error: error?.message || 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { user: authUser, error } = await requireAuth(request);
    if (error || !authUser) {
      return error || NextResponse.json({ error: 'Unauthorized: Session required' }, { status: 401 });
    }

    const body = await request.json();
    const { id, userId } = body;

    if (id) {
      // Verify notification belongs to caller
      const notif = await prisma.notification.findUnique({
        where: { id },
      });

      if (!notif) {
        return NextResponse.json({ error: 'Notification not found' }, { status: 404 });
      }

      if (authUser.role !== 'ADMIN' && notif.userId !== authUser.id) {
        return NextResponse.json(
          { error: 'Forbidden: You cannot modify notifications belonging to another user.' },
          { status: 403 }
        );
      }

      const updated = await prisma.notification.update({
        where: { id },
        data: { isRead: true },
      });
      return NextResponse.json(updated);
    }

    if (userId) {
      if (authUser.role !== 'ADMIN' && userId !== authUser.id) {
        return NextResponse.json(
          { error: 'Forbidden: You cannot mark notifications for another user.' },
          { status: 403 }
        );
      }

      await prisma.notification.updateMany({
        where: { userId, isRead: false },
        data: { isRead: true },
      });
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Missing id or userId' }, { status: 400 });
  } catch (error: any) {
    console.error('Error updating notification:', error);
    return NextResponse.json({ error: error?.message || 'Internal server error' }, { status: 500 });
  }
}
