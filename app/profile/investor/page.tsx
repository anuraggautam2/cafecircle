'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { ShieldCheck, Award, Wallet, ArrowUpRight, Check, AlertCircle } from 'lucide-react';
import SimulatedBadge from '@/components/SimulatedBadge';

export default function InvestorProfilePage() {
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [bio, setBio] = useState('');
  const [phone, setPhone] = useState('');
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const loadProfile = async () => {
    try {
      const res = await fetch('/api/profile', {
        headers: {
          'x-cafecircle-user-id': user?.id || '',
        },
      });
      const data = await res.json();
      if (res.ok && data) {
        setProfileData(data);
        setName(data.name || '');
        setCity(data.city || 'Ghaziabad');
        setBio(data.bio || '');
        setPhone(data.phone || '');
      }
    } catch (err) {
      console.error('Failed to load profile:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, [user?.id]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg('');
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-cafecircle-user-id': user?.id || '',
        },
        body: JSON.stringify({
          name,
          city,
          bio,
          phone,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } else {
        setErrorMsg(data.error || 'Failed to update profile');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error connecting to server');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* 1. HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200/50 pb-6">
        <div>
          <h1 className="font-serif text-3xl font-bold text-[#211A17]">
            Investor Profile
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Accreditation status, simulated portfolio allocation, and patron standing.
          </p>
        </div>
        <SimulatedBadge variant="pill" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Left card: Badge & Tier (4 cols) */}
        <div className="md:col-span-4 glass-panel p-6 space-y-5 text-center border border-white/70 shadow-sm">
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80'}
            alt={user?.name || 'Investor Avatar'}
            className="w-20 h-20 rounded-full mx-auto object-cover border border-white/80 shadow-xs"
          />
          <div>
            <h3 className="font-serif font-bold text-lg text-[#211A17]">{name || user?.name}</h3>
            <p className="text-xs text-stone-500">{city || user?.city} • Community Backer</p>
          </div>

          <div className="p-3.5 bg-white/60 backdrop-blur-md rounded-xl border border-white/80 text-xs space-y-1 shadow-2xs">
            <div className="font-semibold text-[#B84A22] flex items-center justify-center gap-1.5">
              <Award className="w-4 h-4" />
              {profileData?.investor?.ambassadorTier || user?.investor?.ambassadorTier || 'Espresso Patron'}
            </div>
            <div className="text-[11px] text-stone-500">Ranked in Top 5% Advocates</div>
          </div>

          <div className="text-left text-xs space-y-2.5 pt-3 border-t border-stone-200/50 font-mono">
            <div className="flex items-center justify-between">
              <span className="text-stone-500">KYC Status:</span>
              <span className="font-semibold text-emerald-700 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> {profileData?.investor?.kycStatus || 'VERIFIED'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-stone-500">Total Invested:</span>
              <span className="font-semibold text-[#211A17]">
                ₹{(profileData?.investor?.totalInvested || 0).toLocaleString('en-IN')}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-stone-500">Active Deals:</span>
              <span className="font-semibold text-[#211A17]">
                {profileData?.investor?.activeInvestmentsCount || 0} Campaigns
              </span>
            </div>
          </div>
        </div>

        {/* Right card: Form settings (8 cols) */}
        <div className="md:col-span-8 glass-panel p-6 sm:p-8 space-y-6 border border-white/70 shadow-sm">
          <div className="flex items-center justify-between border-b border-stone-200/50 pb-3">
            <h3 className="font-serif font-bold text-xl text-[#211A17]">Account Settings</h3>
            <span className="text-xs font-mono text-stone-400">Database Persisted</span>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-stone-700 mb-1.5">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-white/80 bg-white/70 text-[#211A17] font-medium focus:outline-none focus:ring-2 focus:ring-[#211A17]/10"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-stone-700 mb-1.5">Email Address</label>
                <input
                  type="email"
                  disabled
                  value={user?.email || 'priya@investor.com'}
                  className="w-full p-2.5 rounded-xl border border-stone-200/60 bg-stone-100 text-stone-500 cursor-not-allowed font-mono text-xs"
                />
              </div>
              <div>
                <label className="block font-semibold text-stone-700 mb-1.5">Location / City</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-white/80 bg-white/70 text-[#211A17] focus:outline-none focus:ring-2 focus:ring-[#211A17]/10"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1.5">Phone Number</label>
              <input
                type="text"
                placeholder="+91 98101 22334"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-white/80 bg-white/70 text-[#211A17] focus:outline-none focus:ring-2 focus:ring-[#211A17]/10"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1.5">Investor Bio</label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Share your interest in specialty cafes or local business co-growth..."
                className="w-full p-2.5 rounded-xl border border-white/80 bg-white/70 text-[#211A17] focus:outline-none focus:ring-2 focus:ring-[#211A17]/10"
              />
            </div>

            <div className="pt-2 flex items-center gap-3">
              <button
                type="submit"
                disabled={saving}
                className="btn-primary text-xs py-2.5 px-5 shadow-sm disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Profile'}
              </button>
              {saved && (
                <span className="text-xs font-mono text-emerald-700 flex items-center gap-1 font-semibold">
                  <Check className="w-3.5 h-3.5" /> Saved to database
                </span>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
