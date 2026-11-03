'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { ArrowRight, FileText, ExternalLink } from 'lucide-react';
import SimulatedBadge from '@/components/SimulatedBadge';

export default function InvestorDashboardPage() {
  const { user } = useAuth();
  const [investments, setInvestments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/investments?userId=${user?.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setInvestments(data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [user]);

  const totalInvested = investments.reduce((sum, i) => sum + (i.amount || 0), 0);
  const totalAccrued = investments.reduce((sum, i) => sum + (i.returnsAccrued || 0), 0);

  const recentUpdates = [
    {
      cafeName: 'Roastery Coffee House',
      title: 'Interior Masonry 70% Complete & Courtyard Koi Pond Installed',
      date: '3 days ago',
      link: '/cafes/roastery-coffee-house',
    },
    {
      cafeName: 'Subko Specialty Coffee',
      title: 'Loring S15 Kestrel Drum Roaster Docked at Mumbai Port',
      date: '6 days ago',
      link: '/cafes/subko-specialty-coffee',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-10">
      {/* 1. Header: Minimal & Clear */}
      <div className="border-b border-[#EAE6DE] pb-6 flex items-baseline justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-[#181514]">
            Investor Portfolio
          </h1>
          <p className="text-xs text-[#6E685F] mt-0.5">
            Overview of your active community investments and cafe updates.
          </p>
        </div>

        <SimulatedBadge variant="pill" />
      </div>

      {/* 2. Top Summary: Show only Total Invested & Accrued Yield */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-6 rounded-2xl glass-panel space-y-1">
          <div className="text-[11px] font-mono uppercase text-stone-400">Total Invested</div>
          <div className="text-3xl font-serif font-bold text-[#181514]">
            ₹{totalInvested.toLocaleString('en-IN')}
          </div>
          <div className="text-xs text-stone-500">Across {investments.length} {investments.length === 1 ? 'cafe' : 'cafes'}</div>
        </div>

        <div className="p-6 rounded-2xl glass-panel space-y-1">
          <div className="text-[11px] font-mono uppercase text-stone-400">Accrued Revenue Share</div>
          <div className="text-3xl font-serif font-bold text-emerald-700">
            ₹{totalAccrued.toLocaleString('en-IN')}
          </div>
          <div className="text-xs text-emerald-800/80">Simulated quarterly pro-rata payout</div>
        </div>
      </div>

      {/* 3. My Cafes (Portfolio Overview) */}
      <div className="space-y-3">
        <div className="flex items-baseline justify-between">
          <h2 className="font-serif text-lg font-bold text-[#181514]">
            My Cafes
          </h2>
          <Link href="/explore" className="text-xs text-[#B84A22] hover:underline font-semibold">
            Explore more &rarr;
          </Link>
        </div>

        <div className="glass-panel rounded-2xl divide-y divide-stone-200/50 overflow-hidden">
          {investments.length === 0 ? (
            <div className="p-8 text-center text-xs text-stone-500">
              No active investments found.{' '}
              <Link href="/explore" className="text-[#181514] underline font-medium">
                Browse open campaigns
              </Link>
            </div>
          ) : (
            investments.map((inv) => (
              <div
                key={inv.id}
                className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-1">
                  <div className="font-serif font-bold text-base text-[#181514]">
                    {inv.campaign?.cafe?.name || 'Alma Bakery & Cafe'}
                  </div>
                  <div className="text-stone-500">
                    {inv.campaign?.expansionArea || 'Indiranagar'}, {inv.campaign?.expansionCity || 'Ghaziabad'} • {inv.campaign?.investmentStructure?.replace('_', ' ') || 'Revenue Share'}
                  </div>
                </div>

                <div className="flex items-center gap-6 sm:text-right">
                  <div>
                    <div className="font-mono font-bold text-sm text-[#181514]">
                      ₹{inv.amount?.toLocaleString('en-IN')}
                    </div>
                    <div className="text-[11px] text-emerald-700 font-mono font-semibold">
                      +₹{inv.returnsAccrued?.toLocaleString('en-IN') || '0'} Accrued
                    </div>
                  </div>

                  <Link
                    href={`/campaigns/${inv.campaign?.slug || inv.campaignId}`}
                    className="p-2 rounded-xl border border-stone-200 bg-white/80 hover:bg-white text-stone-800 transition-colors shadow-sm"
                    title="View Cafe Details"
                  >
                    <ArrowRight className="w-4 h-4 text-stone-500" />
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 4. Recent Updates from Backed Cafes */}
      <div className="space-y-3">
        <h2 className="font-serif text-lg font-bold text-[#181514]">
          Recent Updates
        </h2>

        <div className="glass-panel rounded-2xl divide-y divide-stone-200/50 overflow-hidden">
          {recentUpdates.map((update, idx) => (
            <Link
              key={idx}
              href={update.link}
              className="p-5 flex items-center justify-between gap-4 hover:bg-white/60 transition-colors group block"
            >
              <div className="space-y-1">
                <div className="text-[11px] font-mono text-stone-400">
                  {update.cafeName} • {update.date}
                </div>
                <div className="text-xs sm:text-sm font-medium text-[#181514] group-hover:text-[#B84A22] transition-colors">
                  {update.title}
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-stone-400 shrink-0 group-hover:translate-x-1 transition-transform" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
