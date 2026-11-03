'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Campaign } from '@/lib/types';
import CampaignCard from '@/components/CampaignCard';
import { ArrowRight, Search, MapPin, Sparkles, ShieldCheck } from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetch('/api/campaigns')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setCampaigns(data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/explore?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push('/explore');
    }
  };

  return (
    <div className="space-y-24 py-10 md:py-16">
      {/* 1. HERO SECTION: Large attractive hero with generous whitespace & strong headline */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-7">
        {/* Subtle pill tag */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-medium text-stone-700 bg-white/70 border border-white/80 shadow-sm backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-[#B84A22]" />
          Community-Powered Expansion • Ghaziabad & Delhi NCR
        </div>

        {/* Strong headline */}
        <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold text-[#181514] tracking-tight leading-[1.12]">
          Invest in What You Love. <br />
          <span className="text-[#B84A22]">Grow Together.</span>
        </h1>

        {/* Concise explanation */}
        <p className="text-base sm:text-lg text-[#5A5450] max-w-xl mx-auto leading-relaxed font-sans">
          Turn your favorite neighborhood cafes and artisanal bakehouses into community-funded growth stories. Support expansion, earn revenue returns, and become a brand partner.
        </p>

        {/* Integrated Simple Search Experience */}
        <form onSubmit={handleSearchSubmit} className="pt-2 max-w-xl mx-auto">
          <div className="glass-panel p-2 flex items-center gap-2 shadow-sm">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search cafes, coffee roasters, cuisines, or neighborhoods..."
                className="w-full pl-10 pr-3 py-2.5 text-xs text-[#181514] bg-white/70 border border-stone-200/60 rounded-xl placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#2C1810]/10 focus:bg-white transition-all"
              />
            </div>
            <button
              type="submit"
              className="btn-primary px-5 py-2.5 text-xs font-semibold shrink-0 flex items-center gap-1.5 shadow-sm"
            >
              Search
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="flex items-center justify-center gap-2 mt-2 text-[11px] text-stone-500">
            <span className="font-medium">Trending:</span>
            <button
              type="button"
              onClick={() => router.push('/explore?search=Raj Nagar')}
              className="hover:text-[#2C1810] hover:underline"
            >
              Raj Nagar
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => router.push('/explore?search=Bakery')}
              className="hover:text-[#2C1810] hover:underline"
            >
              Bakery
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => router.push('/explore?search=Blue Tokai')}
              className="hover:text-[#2C1810] hover:underline"
            >
              Blue Tokai
            </button>
          </div>
        </form>

        {/* Authentic Cafe Photography (Glass-Framed Editorial Visual) */}
        <div className="pt-6 max-w-5xl mx-auto">
          <div className="glass-panel p-2.5 sm:p-3 shadow-lg">
            <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-stone-100">
              <img
                src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1400&q=80"
                alt="Artisanal Cafe Interior"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white text-xs font-mono">
                <span className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  RDC Raj Nagar, Ghaziabad
                </span>
                <span className="hidden sm:inline bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">
                  12 Curated NCR Hubs • 3 Active Offerings
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. MINIMAL FEATURED CAFE SECTION */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 space-y-6">
        <div className="flex items-baseline justify-between border-b border-stone-200/50 pb-4">
          <div>
            <h2 className="font-serif text-2xl font-bold text-[#181514]">
              Active Expansion Offerings
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Verified independent cafes raising community growth capital in Ghaziabad & Delhi NCR.
            </p>
          </div>
          <Link
            href="/explore"
            className="text-xs font-semibold text-[#B84A22] hover:underline inline-flex items-center gap-1"
          >
            Explore all cafes &rarr;
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="glass-card h-80 animate-pulse bg-white/40 rounded-2xl" />
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

      {/* 3. SIMPLE 3-STEP HOW IT WORKS */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#181514]">
            How Co-Growth Works
          </h2>
          <p className="text-xs text-stone-500 max-w-md mx-auto">
            A transparent framework turning everyday patrons into brand advocates and verified growth partners.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          <div className="glass-panel p-6 space-y-3">
            <span className="font-mono text-xs font-bold text-[#2C1810] bg-amber-100/70 px-2 py-0.5 rounded border border-amber-300/60">
              01 • DISCOVER
            </span>
            <h3 className="font-serif font-bold text-base text-[#181514]">Explore Vetted Cafes</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Browse authentic local coffeehouses and bakehouses seeking expansion capital for new branches.
            </p>
          </div>

          <div className="glass-panel p-6 space-y-3">
            <span className="font-mono text-xs font-bold text-[#2C1810] bg-amber-100/70 px-2 py-0.5 rounded border border-amber-300/60">
              02 • CONTRIBUTE
            </span>
            <h3 className="font-serif font-bold text-base text-[#181514]">Transparent Terms</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Review disclosed unit economics, branch lease documents, and support campaigns under verified revenue-share structures.
            </p>
          </div>

          <div className="glass-panel p-6 space-y-3">
            <span className="font-mono text-xs font-bold text-[#2C1810] bg-amber-100/70 px-2 py-0.5 rounded border border-amber-300/60">
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
            className="btn-secondary inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold shadow-sm"
          >
            Explore all 12 Ghaziabad & Delhi NCR cafes
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
