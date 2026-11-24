'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { ShieldCheck, Store, Building2, Check, AlertCircle, MapPin } from 'lucide-react';
import SimulatedBadge from '@/components/SimulatedBadge';

export default function CafeOwnerProfilePage() {
  const { user } = useAuth();
  const [businessName, setBusinessName] = useState('');
  const [gst, setGst] = useState('');
  const [pan, setPan] = useState('');
  const [bankAccount, setBankAccount] = useState('');
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
        if (data.cafeOwner) {
          setBusinessName(data.cafeOwner.businessName || '');
          setGst(data.cafeOwner.gstNumber || '');
          setPan(data.cafeOwner.businessPan || '');
          setBankAccount(data.cafeOwner.bankAccountDetails || '');
        }
      }
    } catch (err) {
      console.error('Failed to load owner profile:', err);
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
          businessName,
          gstNumber: gst,
          businessPan: pan,
          bankAccountDetails: bankAccount,
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

  const registeredCafes = profileData?.cafeOwner?.cafes || [];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* 1. HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200/50 pb-6">
        <div>
          <h1 className="font-serif text-3xl font-bold text-[#211A17]">
            Operator Profile & Compliance
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Registered corporate entity details, verified licenses, and commercial escrow account in Ghaziabad.
          </p>
        </div>
        <SimulatedBadge variant="pill" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Verification Card (4 cols) */}
        <div className="md:col-span-4 glass-panel p-6 space-y-5 text-center border border-white/70 shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-[#B84A22] flex items-center justify-center mx-auto border border-amber-300/40 shadow-xs">
            <Store className="w-8 h-8" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-lg text-[#211A17]">{businessName || 'Cafe Hospitality LLP'}</h3>
            <p className="text-xs text-stone-500">{user?.name} • Managing Partner • Ghaziabad</p>
          </div>

          <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200/60 text-xs text-emerald-800 space-y-1 shadow-2xs">
            <div className="font-semibold flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              Verified Cafe Operator
            </div>
            <div className="text-[11px] text-emerald-700/80">Entity documents audited & cleared</div>
          </div>

          <div className="text-left text-xs space-y-2.5 pt-3 border-t border-stone-200/50 font-mono">
            <div className="flex items-center justify-between">
              <span className="text-stone-500">Registered Outlets:</span>
              <span className="font-semibold text-[#211A17]">{registeredCafes.length} Locations</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-stone-500">GSTIN Status:</span>
              <span className="font-semibold text-emerald-700">Active & Verified</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-stone-500">FSSAI Filing:</span>
              <span className="font-semibold text-emerald-700">Up to date</span>
            </div>
          </div>

          {/* List of registered cafes */}
          {registeredCafes.length > 0 && (
            <div className="pt-3 border-t border-stone-200/50 text-left">
              <div className="text-[10px] uppercase font-mono text-stone-400 font-semibold mb-2">
                Managed Branches ({registeredCafes.length})
              </div>
              <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                {registeredCafes.map((c: any) => (
                  <div key={c.id} className="p-2 rounded-lg bg-white/60 border border-white/80 text-[11px] flex items-center justify-between">
                    <span className="font-medium text-stone-900 truncate">{c.name}</span>
                    <span className="text-[10px] font-mono text-stone-400 shrink-0 ml-1">{c.city}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Corporate Form (8 cols) */}
        <div className="md:col-span-8 glass-panel p-6 sm:p-8 space-y-6 border border-white/70 shadow-sm">
          <div className="flex items-center justify-between border-b border-stone-200/50 pb-3">
            <h3 className="font-serif font-bold text-xl text-[#211A17]">Business & Tax Information</h3>
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
              <label className="block font-semibold text-stone-700 mb-1.5">Registered Legal Entity Name</label>
              <input
                type="text"
                required
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-white/80 bg-white/70 text-[#211A17] font-medium focus:outline-none focus:ring-2 focus:ring-[#211A17]/10"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-stone-700 mb-1.5">Company PAN</label>
                <input
                  type="text"
                  required
                  value={pan}
                  onChange={(e) => setPan(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-white/80 bg-white/70 text-[#211A17] font-mono uppercase focus:outline-none focus:ring-2 focus:ring-[#211A17]/10"
                />
              </div>
              <div>
                <label className="block font-semibold text-stone-700 mb-1.5">GSTIN Number</label>
                <input
                  type="text"
                  required
                  value={gst}
                  onChange={(e) => setGst(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-white/80 bg-white/70 text-[#211A17] font-mono uppercase focus:outline-none focus:ring-2 focus:ring-[#211A17]/10"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1.5">Commercial Escrow Disbursement Account</label>
              <input
                type="text"
                value={bankAccount}
                onChange={(e) => setBankAccount(e.target.value)}
                placeholder="Bank Name, Branch & Account Number..."
                className="w-full p-2.5 rounded-xl border border-white/80 bg-white/70 text-[#211A17] font-mono focus:outline-none focus:ring-2 focus:ring-[#211A17]/10"
              />
            </div>

            <div className="pt-2 flex items-center gap-3">
              <button
                type="submit"
                disabled={saving}
                className="btn-primary text-xs py-2.5 px-5 shadow-sm disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Entity Profile'}
              </button>
              {saved && (
                <span className="text-xs font-mono text-emerald-700 flex items-center gap-1 font-semibold">
                  <Check className="w-3.5 h-3.5" /> Entity record updated
                </span>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
