'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { PlusCircle, ArrowRight, Check } from 'lucide-react';
import SimulatedBadge from '@/components/SimulatedBadge';

export default function CafeOwnerDashboardPage() {
  const { user } = useAuth();
  const [cafe, setCafe] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Progressive disclosure for posting updates & financials
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [showFinancialForm, setShowFinancialForm] = useState(false);

  // Form states
  const [updateTitle, setUpdateTitle] = useState('');
  const [updateContent, setUpdateContent] = useState('');
  const [publishingUpdate, setPublishingUpdate] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  const [revGross, setRevGross] = useState('');
  const [revProfit, setRevProfit] = useState('');
  const [publishingFinancial, setPublishingFinancial] = useState(false);
  const [financialSuccess, setFinancialSuccess] = useState(false);

  const fetchCafeData = () => {
    fetch('/api/cafes/bon-amigos-cafe-and-kitchen')
      .then((res) => res.json())
      .then((data) => {
        if (!data.error) setCafe(data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCafeData();
  }, []);

  const activeCampaign = cafe?.campaigns?.[0] || {
    title: 'Bon Amigos: Vaishali Courtyard Kitchen & Pizzeria',
    targetAmount: 2200000,
    raisedAmount: 1760000,
    investorCount: 34,
    status: 'ACTIVE',
  };

  const percentFunded = Math.min(
    100,
    Math.round((activeCampaign.raisedAmount / activeCampaign.targetAmount) * 100)
  );

  const handlePublishUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!updateTitle || !updateContent) return;
    setPublishingUpdate(true);
    try {
      await fetch('/api/updates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cafeId: cafe?.id || 'cafe_roastery',
          title: updateTitle,
          content: updateContent,
          milestoneTag: 'Expansion Progress',
        }),
      });
      setUpdateTitle('');
      setUpdateContent('');
      setUpdateSuccess(true);
      setTimeout(() => {
        setUpdateSuccess(false);
        setShowUpdateForm(false);
      }, 2000);
      fetchCafeData();
    } catch (e) {
      console.error(e);
    } finally {
      setPublishingUpdate(false);
    }
  };

  const handlePublishFinancial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!revGross || !revProfit) return;
    setPublishingFinancial(true);
    try {
      await fetch('/api/financials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cafeId: cafe?.id || 'cafe_roastery',
          month: 'November',
          year: 2026,
          grossRevenue: revGross,
          netProfit: revProfit,
          customerFootfall: '7200',
        }),
      });
      setRevGross('');
      setRevProfit('');
      setFinancialSuccess(true);
      setTimeout(() => {
        setFinancialSuccess(false);
        setShowFinancialForm(false);
      }, 2000);
      fetchCafeData();
    } catch (e) {
      console.error(e);
    } finally {
      setPublishingFinancial(false);
    }
  };

  const recentActivity = [
    { title: 'Priya Patel contributed ₹40,000 to HSR expansion', time: '2 hours ago', type: 'investment' },
    { title: 'Arjun Nair visited HSR Courtyard via community referral link', time: '5 hours ago', type: 'referral' },
    { title: 'Milestone update posted: Interior Masonry 70% Complete', time: '2 days ago', type: 'update' },
    { title: 'Verified monthly revenue disclosure recorded for October', time: '4 days ago', type: 'financial' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-10">
      {/* 1. Header: Minimal */}
      <div className="border-b border-stone-200/50 pb-6 flex items-baseline justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-[#181514]">
            {cafe?.name || 'Bon Amigos Cafe & Kitchen'}
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Owner Dashboard • Founder: Aarav Sharma • {cafe?.city || 'Ghaziabad'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/campaigns/create"
            className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-[#181514] text-white hover:bg-stone-800 transition-colors shadow-sm"
          >
            Launch Campaign
          </Link>
          <SimulatedBadge variant="pill" />
        </div>
      </div>

      {/* 2. Focused Core Stats: Funding progress, Number of investors, Campaign status */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Funding Progress */}
        <div className="p-6 rounded-2xl glass-panel space-y-2">
          <div className="text-[11px] font-mono uppercase text-stone-400">Funding Progress</div>
          <div className="text-2xl font-serif font-bold text-[#181514]">
            ₹{(activeCampaign.raisedAmount / 100000).toFixed(2)}L
          </div>
          <div className="space-y-1">
            <div className="w-full bg-stone-200/60 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-[#B84A22] h-full rounded-full transition-all duration-300"
                style={{ width: `${percentFunded}%` }}
              />
            </div>
            <div className="text-[11px] font-mono text-stone-500 flex justify-between">
              <span>{percentFunded}% funded</span>
              <span>Goal: ₹{(activeCampaign.targetAmount / 100000).toFixed(2)}L</span>
            </div>
          </div>
        </div>

        {/* Number of Investors */}
        <div className="p-6 rounded-2xl glass-panel space-y-1">
          <div className="text-[11px] font-mono uppercase text-stone-400">Community Investors</div>
          <div className="text-2xl font-serif font-bold text-[#181514]">
            {activeCampaign.investorCount} Backers
          </div>
          <div className="text-xs text-stone-500">
            Avg: ₹{Math.round(activeCampaign.raisedAmount / (activeCampaign.investorCount || 1)).toLocaleString('en-IN')}
          </div>
        </div>

        {/* Campaign Status */}
        <div className="p-6 rounded-2xl glass-panel space-y-1">
          <div className="text-[11px] font-mono uppercase text-stone-400">Campaign Status</div>
          <div className="text-2xl font-serif font-bold text-emerald-700 flex items-center gap-1.5">
            Active Round
          </div>
          <div className="text-xs text-stone-500">18 days remaining in round</div>
        </div>
      </div>

      {/* 3. Progressive Disclosure Actions (Only when needed) */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => {
            setShowUpdateForm(!showUpdateForm);
            setShowFinancialForm(false);
          }}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
            showUpdateForm
              ? 'bg-[#181514] text-white border-[#181514]'
              : 'bg-white text-[#181514] border-[#EAE6DE] hover:bg-[#F5F2EB]'
          }`}
        >
          {showUpdateForm ? 'Close Update Form' : '+ Post Update'}
        </button>

        <button
          onClick={() => {
            setShowFinancialForm(!showFinancialForm);
            setShowUpdateForm(false);
          }}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
            showFinancialForm
              ? 'bg-[#181514] text-white border-[#181514]'
              : 'bg-white text-[#181514] border-[#EAE6DE] hover:bg-[#F5F2EB]'
          }`}
        >
          {showFinancialForm ? 'Close Revenue Form' : '+ Report Revenue'}
        </button>
      </div>

      {/* Collapsible Update Form */}
      {showUpdateForm && (
        <form onSubmit={handlePublishUpdate} className="p-5 rounded-xl bg-white border border-[#EAE6DE] space-y-3 text-xs">
          <div className="font-serif font-bold text-sm text-[#181514]">Broadcast Update to Backers</div>
          <div>
            <input
              type="text"
              required
              placeholder="Update title..."
              value={updateTitle}
              onChange={(e) => setUpdateTitle(e.target.value)}
              className="w-full p-2 rounded-lg border border-[#EAE6DE] text-xs text-[#181514] focus:outline-none focus:border-[#181514]"
            />
          </div>
          <div>
            <textarea
              rows={3}
              required
              placeholder="Share construction progress with your community..."
              value={updateContent}
              onChange={(e) => setUpdateContent(e.target.value)}
              className="w-full p-2 rounded-lg border border-[#EAE6DE] text-xs text-[#181514] focus:outline-none focus:border-[#181514]"
            />
          </div>
          <button
            type="submit"
            disabled={publishingUpdate}
            className="px-4 py-2 rounded-lg text-xs font-medium bg-[#181514] text-white hover:bg-[#262220]"
          >
            {publishingUpdate ? 'Posting...' : 'Publish Update'}
          </button>
          {updateSuccess && <span className="text-[#2D6A4F] ml-3">✓ Update posted</span>}
        </form>
      )}

      {/* Collapsible Financial Form */}
      {showFinancialForm && (
        <form onSubmit={handlePublishFinancial} className="p-5 rounded-xl bg-white border border-[#EAE6DE] space-y-3 text-xs">
          <div className="font-serif font-bold text-sm text-[#181514]">Submit Monthly Revenue Disclosure</div>
          <div className="grid grid-cols-2 gap-3">
            <input
              type="number"
              required
              placeholder="Gross Revenue (₹)..."
              value={revGross}
              onChange={(e) => setRevGross(e.target.value)}
              className="p-2 rounded-lg border border-[#EAE6DE] text-xs"
            />
            <input
              type="number"
              required
              placeholder="Net Profit (₹)..."
              value={revProfit}
              onChange={(e) => setRevProfit(e.target.value)}
              className="p-2 rounded-lg border border-[#EAE6DE] text-xs"
            />
          </div>
          <button
            type="submit"
            disabled={publishingFinancial}
            className="px-4 py-2 rounded-lg text-xs font-medium bg-[#181514] text-white hover:bg-[#262220]"
          >
            {publishingFinancial ? 'Submitting...' : 'Record Revenue Statement'}
          </button>
          {financialSuccess && <span className="text-[#2D6A4F] ml-3">✓ Statement recorded</span>}
        </form>
      )}

      {/* 4. Recent Activity Feed */}
      <div className="space-y-3">
        <h2 className="font-serif text-lg font-bold text-[#181514]">
          Recent Activity
        </h2>

        <div className="bg-white border border-[#EAE6DE] rounded-xl divide-y divide-[#F5F2EB] overflow-hidden text-xs">
          {recentActivity.map((act, idx) => (
            <div key={idx} className="p-4 flex items-center justify-between text-[#181514]">
              <div>
                <span className="font-medium">{act.title}</span>
              </div>
              <span className="text-[11px] font-mono text-[#8C857B] shrink-0">{act.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
