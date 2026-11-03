'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { ShieldCheck, Store, Building2, FileCheck } from 'lucide-react';
import SimulatedBadge from '@/components/SimulatedBadge';

export default function CafeOwnerProfilePage() {
  const { user } = useAuth();
  const [businessName, setBusinessName] = useState('NCR Specialty Hospitality Partners LLP');
  const [gst, setGst] = useState('09AABCN1234F1Z3');
  const [pan, setPan] = useState('AABCN1234F');
  const [bankAccount, setBankAccount] = useState('HDFC Bank Current A/C ***8921');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200/50 pb-6">
        <div>
          <h1 className="font-serif text-3xl font-bold text-[#181514]">
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
        <div className="md:col-span-4 glass-panel p-6 space-y-5 text-center">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 text-[#B84A22] flex items-center justify-center mx-auto border border-amber-200/60 shadow-sm">
            <Store className="w-8 h-8" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-lg text-[#181514]">Bon Amigos Cafe & Kitchen</h3>
            <p className="text-xs text-stone-500">Aarav Sharma • Partner Operator • Ghaziabad</p>
          </div>

          <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200/60 text-xs text-emerald-800 space-y-1">
            <div className="font-semibold flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              Verified Cafe Operator
            </div>
            <div className="text-[11px] text-emerald-700/80">Entity documents audited & cleared</div>
          </div>

          <div className="text-left text-xs space-y-2.5 pt-3 border-t border-[#F3EFE7] font-mono">
            <div className="flex items-center justify-between">
              <span className="text-[#7B746F]">FSSAI License:</span>
              <span className="font-semibold text-[#2D6A4F]">Active & Verified</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#7B746F]">GSTIN Filing:</span>
              <span className="font-semibold text-[#2D6A4F]">Up to date</span>
            </div>
          </div>
        </div>

        {/* Corporate Form (8 cols) */}
        <div className="md:col-span-8 glass-panel p-6 sm:p-8 space-y-6">
          <h3 className="font-serif font-bold text-xl text-[#181514]">Business Information</h3>

          <form onSubmit={handleSave} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-[#5A5450] mb-1.5">Registered Legal Entity Name</label>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-[#E2DCD2] bg-white text-[#181514] font-medium focus:outline-none focus:border-[#181514]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-[#5A5450] mb-1.5">Company PAN</label>
                <input
                  type="text"
                  value={pan}
                  onChange={(e) => setPan(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-[#E2DCD2] bg-white text-[#181514] font-mono focus:outline-none focus:border-[#181514]"
                />
              </div>
              <div>
                <label className="block font-semibold text-[#5A5450] mb-1.5">GSTIN Number</label>
                <input
                  type="text"
                  value={gst}
                  onChange={(e) => setGst(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-[#E2DCD2] bg-white text-[#181514] font-mono focus:outline-none focus:border-[#181514]"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-[#5A5450] mb-1.5">Simulated Escrow Disbursement Account</label>
              <input
                type="text"
                value={bankAccount}
                onChange={(e) => setBankAccount(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-[#E2DCD2] bg-white text-[#181514] font-mono focus:outline-none focus:border-[#181514]"
              />
            </div>

            <div className="pt-2 flex items-center gap-3">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-lg text-xs font-semibold bg-[#181514] text-white hover:bg-[#262220] transition-colors"
              >
                Save Entity Profile
              </button>
              {saved && (
                <span className="text-xs font-mono text-[#2D6A4F] flex items-center gap-1">
                  ✓ Verification record updated
                </span>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
