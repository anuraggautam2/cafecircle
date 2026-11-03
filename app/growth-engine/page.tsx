'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import {
  Sparkles,
  Share2,
  Users,
  Award,
  Copy,
  Check,
  TrendingUp,
  Store,
  CheckCircle2,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import SimulatedBadge from '@/components/SimulatedBadge';

export default function GrowthEnginePage() {
  const { user } = useAuth();
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [referrals, setReferrals] = useState<any[]>([]);
  const [copied, setCopied] = useState(false);
  const [simulating, setSimulating] = useState(false);
  const [simMessage, setSimMessage] = useState('');

  const fetchReferralData = () => {
    fetch('/api/referrals')
      .then((res) => res.json())
      .then((data) => {
        if (data.leaderboard) setLeaderboard(data.leaderboard);
        if (data.referrals) setReferrals(data.referrals);
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchReferralData();
  }, []);

  const activeReferral = referrals.find((r) => r.referrerId === user?.id) || referrals[0] || {
    referralCode: 'PRIYA-ALMA-GZB',
    totalClicks: 164,
    totalVisits: 28,
    totalConversions: 8,
    totalShares: 38,
    advocatePoints: 780,
    cafe: { name: 'Alma Bakery & Cafe', slug: 'alma-bakery-and-cafe' },
  };

  const referralUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/cafes/${activeReferral.cafe?.slug || 'alma-bakery-and-cafe'}?ref=${activeReferral.referralCode}`
    : `https://cafecircle.com/cafes/alma-bakery-and-cafe?ref=${activeReferral.referralCode}`;

  const copyLink = () => {
    navigator.clipboard.writeText(referralUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Live simulation action that hits database API
  const triggerSimulation = async (type: 'SHARE' | 'CLICK' | 'CONVERT_VISIT', isInvest?: boolean) => {
    setSimulating(true);
    try {
      const res = await fetch('/api/referrals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: type,
          referralCode: activeReferral.referralCode,
          visitorName: isInvest ? 'Rohan Sen (Co-Investor)' : 'Arjun Nair (Friend)',
          conversionType: isInvest ? 'INVESTMENT' : 'CAFE_VISIT',
        }),
      });
      const data = await res.json();
      if (res.ok) {
        if (type === 'SHARE') setSimMessage('✓ Share tracked: +10 advocate points awarded to your profile.');
        if (type === 'CLICK') setSimMessage('✓ Link click tracked: +2 advocate points awarded.');
        if (type === 'CONVERT_VISIT') {
          setSimMessage(
            isInvest
              ? '✓ Friend co-invested in the cafe! +150 advocate points awarded.'
              : '✓ Friend visited the cafe courtyard! +40 advocate points awarded.'
          );
        }
        fetchReferralData();
        setTimeout(() => setSimMessage(''), 5000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSimulating(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* 1. HEADER */}
      <div className="border-b border-[#E8E2D6] pb-6 space-y-2">
        <div className="text-[11px] font-mono uppercase tracking-widest text-[#B84A22] font-semibold">
          COMMUNITY GROWTH FLYWHEEL
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#181514]">
          The Community Growth Engine
        </h1>
        <p className="text-xs sm:text-sm text-[#5A5450] max-w-2xl leading-relaxed">
          Turning loyal customers into brand champions. Every investor receives a unique referral link for their backed cafe, driving real customer visits and earning community recognition.
        </p>
      </div>

      {/* 2. ADVOCATE CONTROL PANEL (Glassmorphism design) */}
      <div className="glass-panel p-6 sm:p-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-4 border-b border-stone-200/50 pb-6">
          <div>
            <div className="text-[11px] font-mono uppercase text-stone-400">
              Your Active Community Referral Code
            </div>
            <h2 className="font-serif text-2xl font-bold text-[#181514] mt-1">
              {activeReferral.cafe?.name || 'Alma Bakery & Cafe'}
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Code: <strong className="font-mono text-[#B84A22]">{activeReferral.referralCode}</strong> • Tier: <span className="text-emerald-700 font-semibold">Espresso Patron</span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={referralUrl}
              className="text-xs py-2 px-3 rounded-lg border border-[#E2DCD2] bg-[#F9F7F3] text-[#181514] font-mono focus:outline-none w-64"
            />
            <button
              onClick={copyLink}
              className="py-2 px-4 rounded-lg text-xs font-semibold bg-[#181514] text-white hover:bg-[#262220] transition-colors flex items-center gap-1.5 shrink-0 shadow-sm"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied' : 'Copy Link'}
            </button>
          </div>
        </div>

        {/* Real-time stats grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-lg bg-[#F9F7F3] border border-[#E8E2D6]">
            <div className="text-[10px] uppercase font-mono text-[#7B746F]">Campaign Shares</div>
            <div className="text-2xl font-bold font-mono text-[#181514] mt-0.5">{activeReferral.totalShares}</div>
          </div>
          <div className="p-4 rounded-lg bg-[#F9F7F3] border border-[#E8E2D6]">
            <div className="text-[10px] uppercase font-mono text-[#7B746F]">Link Clicks Tracked</div>
            <div className="text-2xl font-bold font-mono text-[#181514] mt-0.5">{activeReferral.totalClicks}</div>
          </div>
          <div className="p-4 rounded-lg bg-[#F9F7F3] border border-[#E8E2D6]">
            <div className="text-[10px] uppercase font-mono text-[#7B746F]">Verified Cafe Visits</div>
            <div className="text-2xl font-bold font-mono text-[#B84A22] mt-0.5">{activeReferral.totalVisits}</div>
          </div>
          <div className="p-4 rounded-lg bg-[#F9F7F3] border border-[#E8E2D6]">
            <div className="text-[10px] uppercase font-mono text-[#7B746F]">Advocate Score</div>
            <div className="text-2xl font-bold font-mono text-[#2D6A4F] mt-0.5">{activeReferral.advocatePoints} Pts</div>
          </div>
        </div>

        {/* Live Interactive Simulator */}
        <div className="p-5 rounded-lg bg-[#FDFCFB] border border-[#E8E2D6] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase font-bold text-[#181514]">
              Live Engine Simulator (Test Growth Metrics Live)
            </span>
            <span className="text-[10px] font-mono text-[#7B746F]">
              Directly increments SQLite DB
            </span>
          </div>

          <p className="text-xs text-[#5A5450] leading-relaxed">
            Test how real customer referrals trigger events on CafeCircle:
          </p>

          <div className="flex flex-wrap gap-2 pt-1">
            <button
              onClick={() => triggerSimulation('SHARE')}
              disabled={simulating}
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-white border border-[#E2DCD2] hover:bg-[#F3EFE7] text-[#181514] transition-colors"
            >
              📤 Simulate Link Share (+10 pts)
            </button>
            <button
              onClick={() => triggerSimulation('CLICK')}
              disabled={simulating}
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-white border border-[#E2DCD2] hover:bg-[#F3EFE7] text-[#181514] transition-colors"
            >
              👆 Simulate Link Click (+2 pts)
            </button>
            <button
              onClick={() => triggerSimulation('CONVERT_VISIT', false)}
              disabled={simulating}
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-[#181514] hover:bg-[#262220] text-white transition-colors"
            >
              ☕ Simulate Friend Visiting Cafe (+40 pts)
            </button>
            <button
              onClick={() => triggerSimulation('CONVERT_VISIT', true)}
              disabled={simulating}
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-[#B84A22] hover:bg-[#963916] text-white transition-colors"
            >
              💼 Simulate Friend Co-Investing (+150 pts)
            </button>
          </div>

          {simMessage && (
            <div className="p-2.5 rounded-md bg-[#EDF5F1] text-[#2D6A4F] text-xs font-semibold border border-emerald-200">
              {simMessage}
            </div>
          )}
        </div>

        {/* Regulatory Distinction Note */}
        <div className="p-3 bg-[#F9F7F3] rounded-lg border border-[#E8E2D6] text-[11px] text-[#7B746F] leading-relaxed flex items-start gap-2">
          <ShieldAlert className="w-3.5 h-3.5 text-[#B84A22] shrink-0 mt-0.5" />
          <span>
            <strong>Legal Distinction:</strong> Advocate points and referral credits represent store perks, cupping invitations, and community recognition. In compliance with financial regulations, referral rewards are strictly separate from investment yield arrangements.
          </span>
        </div>
      </div>

      {/* 3. COMMUNITY ADVOCATE LEADERBOARD */}
      <div className="stripe-card overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-[#E8E2D6] flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
          <div>
            <h2 className="font-serif font-bold text-xl text-[#181514]">
              Top Customer Advocate Leaderboard
            </h2>
            <p className="text-xs text-[#7B746F] mt-0.5">
              Ranked by verified customer footfall visits driven to community roasteries.
            </p>
          </div>
          <span className="text-[11px] font-mono text-[#7B746F]">
            Updated in real-time
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left data-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Patron</th>
                <th>Cafe Backed</th>
                <th>Patron Tier</th>
                <th>Visits Driven</th>
                <th className="text-right">Advocate Score</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((item) => (
                <tr key={item.rank} className={item.rank === 1 ? 'bg-[#FDFCFB] font-medium' : ''}>
                  <td className="font-mono font-bold text-[#181514]">
                    #{item.rank}
                  </td>
                  <td>
                    <div className="flex items-center gap-2.5">
                      <img
                        src={item.avatar}
                        alt={item.name}
                        className="w-7 h-7 rounded-full object-cover border border-[#E8E2D6]"
                      />
                      <span className="font-semibold text-[#181514]">{item.name}</span>
                    </div>
                  </td>
                  <td className="text-[#3D3835]">{item.cafeSupported}</td>
                  <td>
                    <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#F3EFE7] text-[#5A5450] font-semibold">
                      {item.tier}
                    </span>
                  </td>
                  <td className="font-mono font-bold text-[#B84A22]">
                    {item.visitsDriven} Guests
                  </td>
                  <td className="text-right font-mono font-bold text-[#181514]">
                    {item.advocateScore} pts
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
