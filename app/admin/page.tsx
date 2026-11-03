'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import {
  ShieldCheck,
  CheckCircle2,
  FileText,
  Building,
} from 'lucide-react';
import SimulatedBadge from '@/components/SimulatedBadge';

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const [cafes, setCafes] = useState<any[]>([]);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState('');

  const loadData = () => {
    Promise.all([fetch('/api/cafes').then((r) => r.json()), fetch('/api/campaigns').then((r) => r.json())])
      .then(([cafeList, campList]) => {
        if (Array.isArray(cafeList)) setCafes(cafeList);
        if (Array.isArray(campList)) setCampaigns(campList);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleVerifyCafe = async (cafeId: string, isVerified: boolean) => {
    try {
      await fetch('/api/admin/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'CAFE',
          id: cafeId,
          isVerified,
          status: isVerified ? 'VERIFIED_COMMUNITY_CAFE' : 'UNVERIFIED',
        }),
      });
      setActionMessage(`Cafe verification status updated.`);
      setTimeout(() => setActionMessage(''), 3000);
      loadData();
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateCampaignStatus = async (campId: string, status: string) => {
    try {
      await fetch('/api/admin/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'CAMPAIGN',
          id: campId,
          status,
        }),
      });
      setActionMessage(`Campaign status updated to ${status}.`);
      setTimeout(() => setActionMessage(''), 3000);
      loadData();
    } catch (e) {
      console.error(e);
    }
  };

  const totalRaisedPlatform = campaigns.reduce((sum, c) => sum + (c.raisedAmount || 0), 0);
  const totalBackersPlatform = campaigns.reduce((sum, c) => sum + (c.investorCount || 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* 1. HEADER */}
      <div className="border-b border-[#E8E2D6] pb-6 flex flex-col md:flex-row md:items-baseline justify-between gap-4">
        <div>
          <div className="text-[11px] font-mono uppercase tracking-widest text-[#B84A22] font-semibold">
            PLATFORM GOVERNANCE
          </div>
          <h1 className="font-serif text-3xl font-bold text-[#181514] mt-1">
            Compliance & Verification Desk
          </h1>
          <p className="text-xs text-[#5A5450] mt-0.5">
            Admin: <strong>{user?.name || 'Vikram Mehta'}</strong> • Platform Compliance Lead
          </p>
        </div>

        <SimulatedBadge variant="pill" />
      </div>

      {actionMessage && (
        <div className="p-3 rounded-lg bg-[#EDF5F1] text-[#2D6A4F] text-xs font-semibold border border-emerald-200">
          ✓ {actionMessage}
        </div>
      )}

      {/* 2. PLATFORM METRICS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel p-5 space-y-1">
          <div className="text-[11px] font-mono uppercase text-[#7B746F]">Platform Capital Volume</div>
          <div className="text-2xl font-serif font-bold text-[#181514]">
            ₹{(totalRaisedPlatform / 100000).toFixed(2)}L
          </div>
          <div className="text-[11px] text-[#5A5450]">Across 3 active expansion rounds</div>
        </div>

        <div className="glass-panel p-5 space-y-1">
          <div className="text-[11px] font-mono uppercase text-[#7B746F]">Listed Cafes</div>
          <div className="text-2xl font-serif font-bold text-[#2D6A4F]">
            {cafes.length} Cafes
          </div>
          <div className="text-[11px] text-[#5A5450]">Ghaziabad & Delhi NCR Directory</div>
        </div>

        <div className="glass-panel p-5 space-y-1">
          <div className="text-[11px] font-mono uppercase text-[#7B746F]">Community Backers</div>
          <div className="text-2xl font-serif font-bold text-[#B84A22]">
            {totalBackersPlatform} Patrons
          </div>
          <div className="text-[11px] text-[#5A5450]">Active co-growth partners</div>
        </div>

        <div className="glass-panel p-5 space-y-1">
          <div className="text-[11px] font-mono uppercase text-[#7B746F]">Sandbox Health</div>
          <div className="text-2xl font-serif font-bold text-[#181514] flex items-center gap-1.5">
            Audit Ready <CheckCircle2 className="w-4 h-4 text-[#2D6A4F]" />
          </div>
          <div className="text-[11px] text-[#2D6A4F] font-medium">Compliance sandbox active</div>
        </div>
      </div>

      {/* 3. CAMPAIGN MODERATION TABLE */}
      <div className="glass-panel overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-[#E8E2D6]">
          <h2 className="font-serif font-bold text-lg text-[#181514]">
            Campaign Moderation Queue
          </h2>
          <p className="text-xs text-[#7B746F] mt-0.5">
            Audit, activate, or close expansion campaigns.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left data-table">
            <thead>
              <tr>
                <th>Campaign Title</th>
                <th>Cafe</th>
                <th>City & Area</th>
                <th>Target vs Raised</th>
                <th>Status</th>
                <th className="text-right">Moderation Action</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map((camp) => (
                <tr key={camp.id}>
                  <td className="font-medium text-[#181514]">
                    <Link href={`/campaigns/${camp.slug || camp.id}`} className="hover:text-[#B84A22]">
                      {camp.title}
                    </Link>
                  </td>
                  <td className="text-[#3D3835]">{camp.cafe?.name}</td>
                  <td className="text-[#5A5450] text-xs">{camp.expansionArea}, {camp.expansionCity}</td>
                  <td className="font-mono text-xs">
                    ₹{(camp.raisedAmount / 100000).toFixed(2)}L / ₹{(camp.targetAmount / 100000).toFixed(2)}L
                  </td>
                  <td>
                    <span
                      className={`font-mono text-[10px] px-2 py-0.5 rounded font-semibold ${
                        camp.status === 'ACTIVE'
                          ? 'bg-[#EDF5F1] text-[#2D6A4F]'
                          : 'bg-[#FDF6E9] text-[#B84A22]'
                      }`}
                    >
                      {camp.status}
                    </span>
                  </td>
                  <td className="text-right">
                    <button
                      onClick={() => handleUpdateCampaignStatus(camp.id, camp.status === 'ACTIVE' ? 'COMPLETED' : 'ACTIVE')}
                      className="px-2.5 py-1 rounded text-xs font-semibold bg-white border border-[#E2DCD2] hover:bg-[#F3EFE7] text-[#181514]"
                    >
                      {camp.status === 'ACTIVE' ? 'Close Round' : 'Reactivate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. CAFE VERIFICATION REGISTER */}
      <div className="glass-panel overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-[#E8E2D6]">
          <h2 className="font-serif font-bold text-lg text-[#181514]">
            Cafe Operator Verification Register
          </h2>
          <p className="text-xs text-[#7B746F] mt-0.5">
            Audit FSSAI licenses, GST filings, and registered lease deeds.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left data-table">
            <thead>
              <tr>
                <th>Cafe Entity</th>
                <th>City</th>
                <th>Outlets</th>
                <th>Verification Badge</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {cafes.map((c) => (
                <tr key={c.id}>
                  <td className="font-medium text-[#181514]">
                    <Link href={`/cafes/${c.slug}`} className="hover:text-[#B84A22]">
                      {c.name}
                    </Link>
                  </td>
                  <td className="text-[#3D3835]">{c.city}</td>
                  <td className="text-xs text-[#5A5450]">{c.branches?.length || 1} Outlets</td>
                  <td>
                    {c.isVerified ? (
                      <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#EDF5F1] text-[#2D6A4F] font-semibold">
                        Verified
                      </span>
                    ) : (
                      <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#FDF6E9] text-[#B84A22] font-semibold">
                        Pending
                      </span>
                    )}
                  </td>
                  <td className="text-right">
                    <button
                      onClick={() => handleVerifyCafe(c.id, !c.isVerified)}
                      className="px-2.5 py-1 rounded text-xs font-semibold bg-white border border-[#E2DCD2] hover:bg-[#F3EFE7] text-[#181514]"
                    >
                      Toggle Badge
                    </button>
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
