'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import {
  Bell,
  ArrowRight,
  Check,
} from 'lucide-react';
import SimulatedBadge from '@/components/SimulatedBadge';

export default function NotificationsPage() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifs = () => {
    fetch(`/api/notifications?userId=${user?.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setNotifications(data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchNotifs();
  }, [user]);

  const markAllAsRead = async () => {
    await fetch('/api/notifications', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user?.id }),
    });
    fetchNotifs();
  };

  const markSingleRead = async (id: string) => {
    await fetch('/api/notifications', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    fetchNotifs();
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <div className="border-b border-[#E8E2D6] pb-6 flex items-baseline justify-between">
        <div>
          <div className="text-[11px] font-mono uppercase tracking-widest text-[#B84A22] font-semibold">
            ACTIVITY FEED
          </div>
          <h1 className="font-serif text-3xl font-bold text-[#181514] mt-1">
            Notifications
          </h1>
          <p className="text-xs text-[#5A5450] mt-0.5">
            Real-time simulated alerts for payouts, referral footfall, and cafe updates.
          </p>
        </div>

        <button
          onClick={markAllAsRead}
          className="text-xs font-semibold text-[#181514] hover:text-[#B84A22] transition-colors"
        >
          Mark all as read
        </button>
      </div>

      <div className="glass-panel divide-y divide-stone-200/50 overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-14 rounded-lg bg-[#E8E2D6]/40 animate-pulse" />
            ))}
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-10 text-xs text-[#7B746F]">
            No activity notifications at this time.
          </div>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => markSingleRead(n.id)}
              className={`p-4 sm:p-5 flex items-start justify-between gap-4 cursor-pointer transition-colors ${
                n.isRead ? 'bg-white hover:bg-[#FDFCFB]' : 'bg-[#F9F7F3] hover:bg-[#F3EFE7]'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-xs sm:text-sm text-[#181514]">{n.title}</span>
                  {!n.isRead && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#B84A22]" />
                  )}
                </div>
                <p className="text-xs text-[#5A5450] leading-relaxed">{n.message}</p>
                <span className="text-[10px] font-mono text-[#7B746F] block pt-1">
                  {new Date(n.createdAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>

              {n.link && (
                <Link
                  href={n.link}
                  className="p-1.5 rounded-md border border-[#E2DCD2] bg-white text-[#181514] hover:text-[#B84A22] shrink-0"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
