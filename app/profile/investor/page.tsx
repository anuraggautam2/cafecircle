'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { ShieldCheck, Award, Wallet, ArrowUpRight } from 'lucide-react';
import SimulatedBadge from '@/components/SimulatedBadge';

export default function InvestorProfilePage() {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || 'Priya Patel');
  const [city, setCity] = useState(user?.city || 'Bengaluru');
  const [bio, setBio] = useState(user?.bio || 'Fintech product lead & specialty coffee enthusiast.');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8E2D6] pb-6">
        <div>
          <h1 className="font-serif text-3xl font-bold text-[#181514]">
            Investor Profile
          </h1>
          <p className="text-xs sm:text-sm text-[#7B746F] mt-1">
            Accreditation status, simulated wallet allocation, and patron standing.
          </p>
        </div>
        <SimulatedBadge variant="pill" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Left card: Badge & Tier (4 cols) */}
        <div className="md:col-span-4 glass-panel p-6 space-y-5 text-center">
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80'}
            alt={user?.name || 'Investor Avatar'}
            className="w-20 h-20 rounded-full mx-auto object-cover border border-[#E8E2D6]"
          />
          <div>
            <h3 className="font-serif font-bold text-lg text-[#181514]">{user?.name}</h3>
            <p className="text-xs text-[#7B746F]">{user?.city} • Community Backer</p>
          </div>

          <div className="p-3.5 bg-[#FAF8F5] rounded-lg border border-[#E8E2D6] text-xs space-y-1">
            <div className="font-semibold text-[#B84A22] flex items-center justify-center gap-1.5">
              <Award className="w-4 h-4" />
              {user?.investor?.ambassadorTier || 'Espresso Patron'}
            </div>
            <div className="text-[11px] text-[#7B746F]">Ranked in Top 5% Advocates</div>
          </div>

          <div className="text-left text-xs space-y-2.5 pt-3 border-t border-[#F3EFE7] font-mono">
            <div className="flex items-center justify-between">
              <span className="text-[#7B746F]">KYC Diligence:</span>
              <span className="font-semibold text-[#2D6A4F] flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Verified
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#7B746F]">Sandbox Credit:</span>
              <span className="font-semibold text-[#181514]">₹15,000</span>
            </div>
          </div>
        </div>

        {/* Right card: Form settings (8 cols) */}
        <div className="md:col-span-8 glass-panel p-6 sm:p-8 space-y-6">
          <h3 className="font-serif font-bold text-xl text-[#181514]">Account Settings</h3>

          <form onSubmit={handleSave} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-[#5A5450] mb-1.5">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-[#E2DCD2] bg-white text-[#181514] font-medium focus:outline-none focus:border-[#181514]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-[#5A5450] mb-1.5">Email Address</label>
                <input
                  type="email"
                  disabled
                  value={user?.email || 'priya@investor.com'}
                  className="w-full p-2.5 rounded-lg border border-[#E2DCD2] bg-[#F7F5F0] text-[#7B746F] cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block font-semibold text-[#5A5450] mb-1.5">Location</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-[#E2DCD2] bg-white text-[#181514] focus:outline-none focus:border-[#181514]"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-[#5A5450] mb-1.5">Investor Bio</label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-[#E2DCD2] bg-white text-[#181514] focus:outline-none focus:border-[#181514]"
              />
            </div>

            <div className="pt-2 flex items-center gap-3">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-lg text-xs font-semibold bg-[#181514] text-white hover:bg-[#262220] transition-colors"
              >
                Save Profile
              </button>
              {saved && (
                <span className="text-xs font-mono text-[#2D6A4F] flex items-center gap-1">
                  ✓ Profile updated
                </span>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
