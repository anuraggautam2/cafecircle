'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { PlusCircle, ArrowRight, Check, Store, AlertCircle } from 'lucide-react';
import SimulatedBadge from '@/components/SimulatedBadge';

export default function CafeOwnerDashboardPage() {
  const { user } = useAuth();
  const [ownedCafes, setOwnedCafes] = useState<any[]>([]);
  const [selectedCafeId, setSelectedCafeId] = useState<string>('');
  const [cafe, setCafe] = useState<any>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
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
  const [customerFootfall, setCustomerFootfall] = useState('4500');
  const [publishingFinancial, setPublishingFinancial] = useState(false);
  const [financialSuccess, setFinancialSuccess] = useState(false);

  // 1. Fetch all cafes owned by the active user
  useEffect(() => {
    if (!user?.id) return;
    setLoading(true);

    fetch(`/api/cafes?ownerId=${user.cafeOwner?.id || user.id}`)
      .then((res) => res.json())
      .then((cafes) => {
        if (Array.isArray(cafes) && cafes.length > 0) {
          setOwnedCafes(cafes);
          // Default to Bon Amigos if available in user's cafes, otherwise first cafe
          const preferred = cafes.find((c: any) => c.slug === 'bon-amigos-cafe-and-kitchen') || cafes[0];
          setSelectedCafeId(preferred.id);
        } else {
          setOwnedCafes([]);
          setCafe(null);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error('Error fetching owner cafes:', err);
        setLoading(false);
      });
  }, [user]);

  // 2. Fetch specific cafe detail whenever selectedCafeId changes
  const fetchSelectedCafeDetail = (cafeId: string) => {
    if (!cafeId) return;
    setLoading(true);

    Promise.all([
      fetch(`/api/cafes/${cafeId}`).then((res) => res.json()),
      fetch(`/api/notifications?userId=${user?.id}`).then((res) => res.json()),
    ])
      .then(([cafeData, notifsData]) => {
        if (!cafeData.error) {
          setCafe(cafeData);
        }
        if (Array.isArray(notifsData)) {
          setNotifications(notifsData);
        }
      })
      .catch((err) => console.error('Error fetching cafe detail:', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (selectedCafeId) {
      fetchSelectedCafeDetail(selectedCafeId);
    }
  }, [selectedCafeId]);

  const activeCampaign = cafe?.campaigns?.find((c: any) => c.status === 'ACTIVE') || cafe?.campaigns?.[0];

  const percentFunded = activeCampaign && activeCampaign.targetAmount > 0
    ? Math.min(100, Math.round((activeCampaign.raisedAmount / activeCampaign.targetAmount) * 100))
    : 0;

  const handlePublishUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!updateTitle || !updateContent || !cafe?.id) return;
    setPublishingUpdate(true);
    try {
      const res = await fetch('/api/updates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-cafecircle-user-id': user?.id || '',
        },
        body: JSON.stringify({
          cafeId: cafe.id,
          title: updateTitle,
          content: updateContent,
          milestoneTag: 'Expansion Progress',
        }),
      });
      if (res.ok) {
        setUpdateTitle('');
        setUpdateContent('');
        setUpdateSuccess(true);
        setTimeout(() => {
          setUpdateSuccess(false);
          setShowUpdateForm(false);
        }, 2000);
        fetchSelectedCafeDetail(cafe.id);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setPublishingUpdate(false);
    }
  };

  const handlePublishFinancial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!revGross || !revProfit || !cafe?.id) return;
    setPublishingFinancial(true);
    try {
      const res = await fetch('/api/financials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-cafecircle-user-id': user?.id || '',
        },
        body: JSON.stringify({
          cafeId: cafe.id,
          month: new Date().toLocaleString('en-US', { month: 'long' }),
          year: new Date().getFullYear(),
          grossRevenue: revGross,
          netProfit: revProfit,
          customerFootfall: customerFootfall || '4800',
        }),
      });
      if (res.ok) {
        setRevGross('');
        setRevProfit('');
        setFinancialSuccess(true);
        setTimeout(() => {
          setFinancialSuccess(false);
          setShowFinancialForm(false);
        }, 2000);
        fetchSelectedCafeDetail(cafe.id);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setPublishingFinancial(false);
    }
  };

  // Compile real activity from cafe updates and user notifications
  const recentActivity = [
    ...(cafe?.businessUpdates || []).map((u: any) => ({
      title: `Update posted: "${u.title}"`,
      time: new Date(u.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
      type: 'update',
    })),
    ...notifications.map((n: any) => ({
      title: n.title ? `${n.title}: ${n.message.slice(0, 70)}...` : n.message,
      time: new Date(n.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
      type: n.type?.toLowerCase() || 'notification',
    })),
  ].slice(0, 5);

  if (!loading && ownedCafes.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 space-y-6">
        <div className="glass-panel p-8 sm:p-12 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center mx-auto">
            <Store className="w-7 h-7" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-[#181514]">
            No Registered Cafe Found
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 max-w-md mx-auto leading-relaxed">
            This account ({user?.name}) does not have an active cafe operator profile registered in the directory.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/profile/owner"
              className="btn-primary text-xs py-2 px-5 shadow-sm"
            >
              Configure Operator Entity
            </Link>
            <Link
              href="/explore"
              className="btn-secondary text-xs py-2 px-5"
            >
              Browse Directory
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-10">
      {/* 1. Header: Minimal with Cafe Switcher */}
      <div className="border-b border-stone-200/50 pb-6 flex flex-col sm:flex-row sm:items-baseline justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-3xl font-bold text-[#181514]">
              {cafe?.name || 'Cafe Operator Dashboard'}
            </h1>
          </div>
          <p className="text-xs text-stone-500">
            Owner Dashboard • Founder: {user?.name || 'Aarav Sharma'} • {cafe?.address ? `${cafe.address.split(',')[0]}, ${cafe.city}` : (cafe?.city || 'Delhi NCR')}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {ownedCafes.length > 1 && (
            <select
              value={selectedCafeId}
              onChange={(e) => setSelectedCafeId(e.target.value)}
              className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-white/70 bg-white/60 backdrop-blur-md text-[#181514] shadow-xs cursor-pointer focus:outline-none"
            >
              {ownedCafes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          )}

          <Link
            href="/campaigns/create"
            className="btn-primary px-3.5 py-1.5 text-xs shadow-sm"
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
            {activeCampaign ? `₹${(activeCampaign.raisedAmount / 100000).toFixed(2)}L` : '₹0.00L'}
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
              <span>Goal: {activeCampaign ? `₹${(activeCampaign.targetAmount / 100000).toFixed(2)}L` : 'No Active Goal'}</span>
            </div>
          </div>
        </div>

        {/* Number of Investors */}
        <div className="p-6 rounded-2xl glass-panel space-y-1">
          <div className="text-[11px] font-mono uppercase text-stone-400">Community Investors</div>
          <div className="text-2xl font-serif font-bold text-[#181514]">
            {activeCampaign ? `${activeCampaign.investorCount} Backers` : '0 Backers'}
          </div>
          <div className="text-xs text-stone-500">
            {activeCampaign && activeCampaign.investorCount > 0
              ? `Avg: ₹${Math.round(activeCampaign.raisedAmount / activeCampaign.investorCount).toLocaleString('en-IN')}`
              : 'Expansion round active'}
          </div>
        </div>

        {/* Campaign Status */}
        <div className="p-6 rounded-2xl glass-panel space-y-1">
          <div className="text-[11px] font-mono uppercase text-stone-400">Campaign Status</div>
          <div className="text-2xl font-serif font-bold text-emerald-700 flex items-center gap-1.5">
            {activeCampaign?.status === 'ACTIVE' ? 'Active Round' : (activeCampaign?.status || 'No Open Round')}
          </div>
          <div className="text-xs text-stone-500">
            {activeCampaign ? `${activeCampaign.expansionArea}, ${activeCampaign.expansionCity}` : 'Prepare expansion campaign'}
          </div>
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
              ? 'bg-[#2C1810] text-white border-[#2C1810] shadow-sm'
              : 'bg-white/45 backdrop-blur-md text-[#181514] border-white/60 hover:bg-white/65'
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
              ? 'bg-[#2C1810] text-white border-[#2C1810] shadow-sm'
              : 'bg-white/45 backdrop-blur-md text-[#181514] border-white/60 hover:bg-white/65'
          }`}
        >
          {showFinancialForm ? 'Close Revenue Form' : '+ Report Revenue'}
        </button>
      </div>

      {/* Collapsible Update Form */}
      {showUpdateForm && (
        <form onSubmit={handlePublishUpdate} className="p-5 rounded-2xl glass-panel space-y-3 text-xs">
          <div className="font-serif font-bold text-sm text-[#181514]">Broadcast Update to Backers ({cafe?.name})</div>
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
        <form onSubmit={handlePublishFinancial} className="p-5 rounded-2xl glass-panel space-y-3 text-xs">
          <div className="font-serif font-bold text-sm text-[#181514]">Submit Monthly Revenue Disclosure ({cafe?.name})</div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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
            <input
              type="number"
              placeholder="Monthly Footfall (e.g. 5200)..."
              value={customerFootfall}
              onChange={(e) => setCustomerFootfall(e.target.value)}
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
          Recent Activity & Updates
        </h2>

        <div className="glass-panel rounded-2xl divide-y divide-stone-200/40 overflow-hidden text-xs">
          {recentActivity.length === 0 ? (
            <div className="p-6 text-center text-xs text-stone-400 font-mono">
              No recent activity recorded yet for {cafe?.name || 'this cafe'}.
            </div>
          ) : (
            recentActivity.map((act, idx) => (
              <div key={idx} className="p-4 flex items-center justify-between text-[#181514]">
                <div>
                  <span className="font-medium">{act.title}</span>
                </div>
                <span className="text-[11px] font-mono text-[#8C857B] shrink-0">{act.time}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
