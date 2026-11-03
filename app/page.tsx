'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Campaign, Cafe } from '@/lib/types';
import { Search, MapPin, Star, ArrowRight, Coffee, Users, TrendingUp, CheckCircle2 } from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('All');

  const locations = [
    'All Locations',
    'Ghaziabad',
    'Delhi NCR',
    'Raj Nagar',
    'Indirapuram',
    'Vaishali',
    'Connaught Place',
  ];

  useEffect(() => {
    fetch('/api/campaigns')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setCampaigns(data);
      })
      .catch((err) => console.error('Error fetching campaigns:', err))
      .finally(() => setLoading(false));
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set('search', searchQuery.trim());
    if (selectedLocation && selectedLocation !== 'All Locations') {
      params.set('city', selectedLocation);
    }
    const queryString = params.toString();
    router.push(queryString ? `/explore?${queryString}` : '/explore');
  };

  return (
    <div className="space-y-28 pb-24">
      {/* ========================================================= */}
      {/* 1. HERO SECTION – FULL-WIDTH, VISUALLY IMMERSIVE HERO     */}
      {/* ========================================================= */}
      <section className="relative -mt-20 pt-20 min-h-[90vh] sm:min-h-[92vh] flex items-center justify-center overflow-hidden">
        {/* Background High-Resolution Cafe Photograph */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=2400&q=85"
            alt="Warm sunlit artisanal cafe interior with wooden furniture and people enjoying coffee"
            className="w-full h-full object-cover object-center"
            fetchPriority="high"
          />
          {/* Subtle Dark Gradient Overlay for Pristine Readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/45 to-black/80" />
          {/* Subtle Film Grain Noise Overlay */}
          <div className="absolute inset-0 noise-overlay pointer-events-none opacity-40" />
        </div>

        {/* Hero Content Container */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-8 py-20 sm:py-28">
          {/* Subtle Community Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono font-medium text-white/90 bg-white/10 backdrop-blur-md border border-white/20 shadow-lg">
            <span className="w-2 h-2 rounded-full bg-[#D8C6AE] animate-pulse" />
            <span>Community-Powered Cafe Expansion • Delhi NCR & Ghaziabad</span>
          </div>

          {/* Headline */}
          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-bold text-white tracking-tight leading-[1.12] drop-shadow-sm">
            Your Favourite Cafe. <br className="hidden sm:inline" />
            <span className="text-[#D8C6AE]">Your Community.</span> <br className="hidden sm:inline" />
            Your Growth.
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-xl text-[#F5F1E8]/90 max-w-2xl mx-auto font-sans leading-relaxed font-normal drop-shadow">
            Discover remarkable cafes, support the businesses you love, and become part of their growth story.
          </p>

          {/* ========================================================= */}
          {/* PREMIUM TEXTURED GLASS SEARCH BAR                        */}
          {/* ========================================================= */}
          <form
            onSubmit={handleSearchSubmit}
            className="pt-2 max-w-2xl mx-auto w-full"
          >
            <div className="hero-glass rounded-2xl p-2 sm:p-2.5 flex flex-col sm:flex-row items-center gap-2 shadow-2xl">
              {/* Search Icon & Text Input */}
              <div className="relative flex-1 w-full flex items-center">
                <Search className="w-5 h-5 text-white/60 absolute left-3.5 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Find cafes, coffee shops or locations..."
                  className="w-full pl-11 pr-3 py-3 text-sm text-white bg-transparent placeholder:text-white/60 focus:outline-none font-sans"
                />
              </div>

              {/* Location Selector Dropdown */}
              <div className="relative w-full sm:w-48 shrink-0">
                <div className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-white/10 border border-white/20 text-xs text-white">
                  <MapPin className="w-4 h-4 text-[#D8C6AE] shrink-0" />
                  <select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="w-full bg-transparent text-xs text-white font-medium focus:outline-none cursor-pointer"
                  >
                    {locations.map((loc) => (
                      <option key={loc} value={loc} className="bg-[#211A17] text-white">
                        {loc}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Search Button */}
              <button
                type="submit"
                className="w-full sm:w-auto btn-primary px-7 py-3 text-xs font-semibold shrink-0 flex items-center justify-center gap-2 bg-[#49352B] hover:bg-[#211A17] text-white rounded-xl shadow-md border border-white/20 transition-all"
              >
                <span>Search</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Trending Suggestions */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-3.5 text-xs text-white/80">
              <span className="text-white/60 text-[11px] font-medium">Trending:</span>
              <button
                type="button"
                onClick={() => router.push('/explore?search=Raj+Nagar')}
                className="px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/15 backdrop-blur-md transition-all text-[11px]"
              >
                Raj Nagar
              </button>
              <button
                type="button"
                onClick={() => router.push('/explore?search=Bakery')}
                className="px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/15 backdrop-blur-md transition-all text-[11px]"
              >
                Artisanal Bakery
              </button>
              <button
                type="button"
                onClick={() => router.push('/explore?search=Roastery')}
                className="px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/15 backdrop-blur-md transition-all text-[11px]"
              >
                Specialty Roasters
              </button>
            </div>
          </form>
        </div>

        {/* Ambient bottom fade into warm ivory base */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#F5F1E8] to-transparent pointer-events-none" />
      </section>

      {/* ========================================================= */}
      {/* 2. SECTION 1: FEATURED CAFES                              */}
      {/* ========================================================= */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-stone-300/40 pb-5 gap-4">
          <div className="space-y-1">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#211A17]">
              Featured Cafes
            </h2>
            <p className="text-sm text-[#49352B]/80 font-sans">
              Handpicked neighborhood cafes and bakehouses actively funded by their patrons.
            </p>
          </div>
          <Link
            href="/explore"
            className="text-xs font-semibold text-[#49352B] hover:text-[#211A17] hover:underline inline-flex items-center gap-1.5"
          >
            Explore all cafes &rarr;
          </Link>
        </div>

        {/* Cafe Cards Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="glass-card h-96 animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
            {campaigns.slice(0, 3).map((camp) => {
              const cafe = camp.cafe;
              return (
                <div
                  key={camp.id}
                  className="glass-card rounded-2xl overflow-hidden flex flex-col group border border-white/70"
                >
                  {/* Large Cafe Photography */}
                  <Link
                    href={`/cafes/${cafe?.slug || camp.cafeId}`}
                    className="block relative aspect-[16/10] overflow-hidden bg-stone-200/40"
                  >
                    <img
                      src={cafe?.coverImage || 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80'}
                      alt={cafe?.name || camp.title}
                      className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500 ease-out"
                    />
                    <div className="absolute top-3 right-3">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-white/80 backdrop-blur-md text-[#211A17] border border-white/80 shadow-sm">
                        <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                        <span>{cafe?.rating ? cafe.rating.toFixed(1) : '4.8'}</span>
                      </span>
                    </div>
                  </Link>

                  {/* Cafe Details */}
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-1.5">
                      <Link href={`/cafes/${cafe?.slug || camp.cafeId}`}>
                        <h3 className="font-serif font-bold text-lg text-[#211A17] group-hover:text-[#49352B] transition-colors line-clamp-1">
                          {cafe?.name}
                        </h3>
                      </Link>
                      <div className="flex items-center gap-1.5 text-xs text-[#49352B]/75">
                        <MapPin className="w-3.5 h-3.5 text-[#49352B] shrink-0" />
                        <span className="truncate">{camp.expansionArea}, {camp.expansionCity}</span>
                      </div>
                      <p className="text-xs text-[#49352B]/80 line-clamp-2 pt-1 font-sans leading-relaxed">
                        {camp.pitch || cafe?.tagline}
                      </p>
                    </div>

                    {/* View Cafe Button */}
                    <div className="pt-2">
                      <Link
                        href={`/cafes/${cafe?.slug || camp.cafeId}`}
                        className="btn-primary w-full text-center py-2.5 px-4 text-xs font-semibold block rounded-xl shadow-sm"
                      >
                        View Cafe
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ========================================================= */}
      {/* 3. SECTION 2: HOW CAFECIRCLE WORKS                        */}
      {/* ========================================================= */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 space-y-10" id="how-it-works">
        <div className="text-center space-y-2.5 max-w-xl mx-auto">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#211A17]">
            How CafeCircle Works
          </h2>
          <p className="text-sm text-[#49352B]/80 font-sans">
            A simple, transparent framework turning patrons into growth partners.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          {/* Step 1 */}
          <div className="glass-panel p-7 rounded-2xl space-y-3.5 border border-white/70">
            <div className="w-10 h-10 rounded-xl bg-[#211A17] text-white flex items-center justify-center font-mono font-bold text-sm shadow-sm">
              01
            </div>
            <h3 className="font-serif font-bold text-lg text-[#211A17]">
              Discover your favourite cafe.
            </h3>
            <p className="text-xs text-[#49352B]/85 leading-relaxed font-sans">
              Explore authentic local coffee houses and artisanal bakeries in your neighborhood planning new branch expansions.
            </p>
          </div>

          {/* Step 2 */}
          <div className="glass-panel p-7 rounded-2xl space-y-3.5 border border-white/70">
            <div className="w-10 h-10 rounded-xl bg-[#211A17] text-white flex items-center justify-center font-mono font-bold text-sm shadow-sm">
              02
            </div>
            <h3 className="font-serif font-bold text-lg text-[#211A17]">
              Support its growth.
            </h3>
            <p className="text-xs text-[#49352B]/85 leading-relaxed font-sans">
              Back upcoming branches under transparent revenue-share arrangements starting from ₹5,000 with clear unit economics.
            </p>
          </div>

          {/* Step 3 */}
          <div className="glass-panel p-7 rounded-2xl space-y-3.5 border border-white/70">
            <div className="w-10 h-10 rounded-xl bg-[#211A17] text-white flex items-center justify-center font-mono font-bold text-sm shadow-sm">
              03
            </div>
            <h3 className="font-serif font-bold text-lg text-[#211A17]">
              Grow together.
            </h3>
            <p className="text-xs text-[#49352B]/85 leading-relaxed font-sans">
              Receive quarterly returns as branch footfall scales, bring friends to the courtyard, and celebrate neighborhood success.
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 4. SECTION 3: FOR CAFE OWNERS                             */}
      {/* ========================================================= */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6" id="for-cafe-owners">
        <div className="glass-panel rounded-3xl p-8 sm:p-12 border border-white/80 shadow-xl overflow-hidden relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            {/* Left Narrative */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold text-[#49352B] bg-white/60 border border-white/80">
                <Coffee className="w-3.5 h-3.5 text-[#49352B]" />
                <span>For Cafe Founders & Operators</span>
              </div>

              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#211A17] leading-tight">
                Raise Expansion Capital From Loyal Guests.
              </h2>

              <p className="text-sm text-[#49352B]/90 font-sans leading-relaxed">
                Opening a new branch? Instead of giving away equity or taking rigid bank loans with collateral, raise community capital directly from the people who already love your coffee.
              </p>

              <div className="space-y-3 pt-2 text-xs text-[#211A17]">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <span><strong>Zero Equity Dilution:</strong> Retain 100% control of your brand and business decisions.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <span><strong>Revenue-Linked Repayment:</strong> Repayments flexibly scale with your branch's seasonal turnover.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <span><strong>Built-In Brand Champions:</strong> Backers actively promote your cafe to friends, family, and colleagues.</span>
                </div>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row items-center gap-3">
                <Link
                  href="/campaigns/create"
                  className="btn-primary w-full sm:w-auto text-xs py-3 px-6 shadow-sm"
                >
                  <span>Launch Your Campaign</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/how-it-works"
                  className="btn-secondary w-full sm:w-auto text-xs py-3 px-6 text-center"
                >
                  Learn About Co-Growth
                </Link>
              </div>
            </div>

            {/* Right Visual Card */}
            <div className="relative">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-stone-100 shadow-md border border-white/80">
                <img
                  src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1200&q=80"
                  alt="Cafe founder brewing coffee in a sunlit cafe"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-4 -left-4 sm:left-4 glass-card p-4 rounded-xl border border-white/90 shadow-lg text-xs max-w-xs">
                <div className="font-serif font-bold text-[#211A17]">Verified Campaign Seed Data</div>
                <p className="text-[11px] text-[#49352B]/80 mt-0.5">
                  Join 12 specialty roasters across Raj Nagar, Indirapuram, and Delhi NCR.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 5. ABOUT SECTION                                          */}
      {/* ========================================================= */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-4 pt-4" id="about">
        <h3 className="font-serif text-2xl font-bold text-[#211A17]">
          Connecting Neighborhoods Through Coffee
        </h3>
        <p className="text-xs sm:text-sm text-[#49352B]/80 leading-relaxed max-w-xl mx-auto font-sans">
          CafeCircle exists to bridge passionate coffee lovers with visionary cafe founders. We celebrate authentic food culture, transparent local economics, and neighborhood camaraderie.
        </p>
        <div className="pt-2">
          <Link
            href="/explore"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#49352B] hover:text-[#211A17] hover:underline"
          >
            Browse all 12 Delhi NCR verified places &rarr;
          </Link>
        </div>
      </section>
    </div>
  );
}
