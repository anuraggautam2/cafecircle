'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Campaign } from '@/lib/types';
import CampaignCard from '@/components/CampaignCard';
import { ArrowRight, Sparkles, MapPin, ShieldCheck } from 'lucide-react';

export default function HomePage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/campaigns')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setCampaigns(data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-20 py-10 md:py-16">
      {/* 1. HERO SECTION: Apple-inspired clean typography & translucent glass container */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono font-medium text-stone-700 bg-white/70 border border-white/80 shadow-sm backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-[#B84A22]" />
          Community-Powered Expansion • Ghaziabad & Delhi NCR
        </div>

        <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold text-[#181514] tracking-tight leading-[1.1]">
          Invest in the cafes you love.
        </h1>

        <p className="text-base sm:text-lg text-[#6E685F] max-w-xl mx-auto leading-relaxed">
          CafeCircle enables beloved neighborhood cafes and specialty bakehouses to fund new branches directly from their loyal regulars.
        </p>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/explore"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold bg-[#181514] hover:bg-stone-800 text-white transition-all shadow-sm hover:shadow-md"
          >
            Discover Cafes Around You
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/how-it-works"
            className="glass-pill px-5 py-3 text-sm font-semibold text-stone-800 hover:text-stone-900"
          >
            How Co-Growth Works
          </Link>
        </div>

        {/* Hero Photography (Glass Framed) */}
        <div className="pt-6 max-w-5xl mx-auto">
          <div className="glass-panel p-2.5 sm:p-3 shadow-lg">
            <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-stone-100">
              <img
                src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1400&q=80"
                alt="Artisanal Cafe Interior"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white text-xs font-mono">
                <span className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  RDC Raj Nagar, Ghaziabad
                </span>
                <span className="hidden sm:inline bg-black/40 backdrop-blur-md px-3 py-1 rounded-full">
                  Verified Community Seed Network
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FEATURED CAMPAIGNS (Glass Cards Grid) */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 space-y-6">
        <div className="flex items-baseline justify-between border-b border-stone-200/50 pb-4">
          <div>
            <h2 className="font-serif text-2xl font-bold text-[#181514]">
              Active Community Offerings
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Verified independent cafes raising expansion capital in Ghaziabad & Delhi NCR.
            </p>
          </div>
          <Link
            href="/explore"
            className="text-xs font-semibold text-[#B84A22] hover:underline"
          >
            Explore all cafes &rarr;
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="glass-card h-80 animate-pulse bg-white/40" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {campaigns.slice(0, 3).map((camp) => (
              <CampaignCard key={camp.id} campaign={camp} />
            ))}
          </div>
        )}
      </section>

      {/* 3. SIMPLE 3-STEP HOW IT WORKS (Glass Panels) */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#181514]">
            How Co-Growth Works
          </h2>
          <p className="text-xs text-stone-500">
            A transparent framework turning regulars into brand advocates and growth partners.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          <div className="glass-panel p-6 space-y-3">
            <span className="font-mono text-xs font-bold text-[#B84A22] bg-amber-50 px-2 py-0.5 rounded border border-amber-200/60">
              01 • DISCOVER
            </span>
            <h3 className="font-serif font-bold text-base text-[#181514]">Explore Vetted Cafes</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Browse authentic local coffeehouses and bakehouses seeking expansion capital for new branches.
            </p>
          </div>

          <div className="glass-panel p-6 space-y-3">
            <span className="font-mono text-xs font-bold text-[#B84A22] bg-amber-50 px-2 py-0.5 rounded border border-amber-200/60">
              02 • CONTRIBUTE
            </span>
            <h3 className="font-serif font-bold text-base text-[#181514]">Transparent Terms</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Review disclosed unit economics, branch lease documents, and support campaigns under verified revenue-share structures.
            </p>
          </div>

          <div className="glass-panel p-6 space-y-3">
            <span className="font-mono text-xs font-bold text-[#B84A22] bg-amber-50 px-2 py-0.5 rounded border border-amber-200/60">
              03 • ADVOCATE
            </span>
            <h3 className="font-serif font-bold text-base text-[#181514]">Grow Together</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Use your unique referral link to bring friends to the cafe courtyard, climb the patron leaderboard, and track performance.
            </p>
          </div>
        </div>
      </section>

      {/* 4. REFINED BOTTOM ACTION */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-3 pt-6">
        <h3 className="font-serif text-xl font-bold text-[#181514]">
          Ready to discover your neighborhood cafes?
        </h3>
        <div>
          <Link
            href="/explore"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#B84A22] hover:underline"
          >
            Explore all 12 Ghaziabad & Delhi NCR cafes &rarr;
          </Link>
        </div>
      </section>
    </div>
  );
}
