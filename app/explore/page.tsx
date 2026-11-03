'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Cafe } from '@/lib/types';
import CafeCard from '@/components/CafeCard';
import { Search, MapPin, SlidersHorizontal, Star, Check } from 'lucide-react';

export default function ExplorePage() {
  const [cafes, setCafes] = useState<Cafe[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [search, setSearch] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [selectedCuisine, setSelectedCuisine] = useState('All');
  const [selectedRating, setSelectedRating] = useState('All');
  const [openNowOnly, setOpenNowOnly] = useState(false);

  const locations = ['All', 'Ghaziabad', 'Delhi NCR', 'Raj Nagar', 'Indirapuram', 'Vaishali', 'Connaught Place'];
  const cuisines = ['All', 'Specialty Coffee', 'European Bakery', 'Continental', 'Italian', 'Chai', 'Modern Indian'];
  const ratings = ['All', '4.0+', '4.3+', '4.5+'];

  useEffect(() => {
    setLoading(true);
    fetch('/api/cafes')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setCafes(data);
      })
      .catch((err) => console.error('Error fetching cafes:', err))
      .finally(() => setLoading(false));
  }, []);

  // Filter logic
  const filteredCafes = useMemo(() => {
    return cafes.filter((cafe) => {
      // 1. Search Query
      if (search.trim()) {
        const query = search.toLowerCase();
        const matchesName = cafe.name.toLowerCase().includes(query);
        const matchesCuisine = (cafe.cuisine || '').toLowerCase().includes(query);
        const matchesAddress = (cafe.address || '').toLowerCase().includes(query);
        const matchesCity = (cafe.city || '').toLowerCase().includes(query);
        const matchesTagline = (cafe.tagline || '').toLowerCase().includes(query);
        if (!matchesName && !matchesCuisine && !matchesAddress && !matchesCity && !matchesTagline) {
          return false;
        }
      }

      // 2. Location
      if (selectedLocation !== 'All') {
        const loc = selectedLocation.toLowerCase();
        const matchesCity = (cafe.city || '').toLowerCase().includes(loc);
        const matchesAddress = (cafe.address || '').toLowerCase().includes(loc);
        if (!matchesCity && !matchesAddress) return false;
      }

      // 3. Cuisine
      if (selectedCuisine !== 'All') {
        const cuis = selectedCuisine.toLowerCase();
        const matchesCuisine = (cafe.cuisine || '').toLowerCase().includes(cuis);
        if (!matchesCuisine) return false;
      }

      // 4. Rating
      if (selectedRating !== 'All') {
        const threshold = parseFloat(selectedRating.replace('+', ''));
        if (cafe.rating < threshold) return false;
      }

      // 5. Open Now
      if (openNowOnly && cafe.isOpen === false) {
        return false;
      }

      return true;
    });
  }, [cafes, search, selectedLocation, selectedCuisine, selectedRating, openNowOnly]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* 1. TOP HERO SECTION */}
      <div className="text-center max-w-3xl mx-auto space-y-3 pt-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-medium text-stone-700 bg-white/70 border border-white/80 shadow-sm backdrop-blur-md">
          <span className="w-1.5 h-1.5 rounded-full bg-[#B84A22]" />
          Ghaziabad & Delhi NCR Directory • {cafes.length} Specialty Places
        </div>

        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#181514] tracking-tight">
          Discover Cafes Around You
        </h1>

        <p className="text-xs sm:text-sm text-[#6E685F] leading-relaxed max-w-xl mx-auto">
          Explore authentic bakeries, rooftop lounges, and community-supported specialty coffee houses across Raj Nagar, Indirapuram, and Delhi NCR.
        </p>

        {/* 2. SEARCH BAR & LOCATION SELECTOR (Glass Container) */}
        <div className="pt-4 max-w-2xl mx-auto">
          <div className="glass-panel p-2 sm:p-2.5 flex flex-col sm:flex-row items-center gap-2">
            {/* Search Input */}
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by cafe name, cuisine, or street..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-3 py-2 text-xs text-[#181514] bg-white/80 border border-stone-200/60 rounded-xl placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-900/5 focus:bg-white transition-all"
              />
            </div>

            {/* Location Selector Dropdown */}
            <div className="relative w-full sm:w-48 shrink-0">
              <div className="flex items-center gap-1.5 px-3 py-2 bg-white/80 border border-stone-200/60 rounded-xl text-xs text-[#181514]">
                <MapPin className="w-3.5 h-3.5 text-[#B84A22] shrink-0" />
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full bg-transparent text-xs text-[#181514] font-medium focus:outline-none cursor-pointer"
                >
                  {locations.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc === 'All' ? 'All Locations' : loc}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. FILTERS BAR (Cuisine, Rating, Open Now) */}
      <div className="glass-panel p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: Cuisine Pills */}
        <div className="space-y-1">
          <div className="text-[11px] font-mono uppercase tracking-wider text-stone-500">
            Cuisine Category
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {cuisines.map((c) => (
              <button
                key={c}
                onClick={() => setSelectedCuisine(c)}
                className={`px-3 py-1.5 rounded-full text-xs whitespace-nowrap transition-all ${
                  selectedCuisine === c
                    ? 'bg-[#181514] text-white font-medium shadow-sm'
                    : 'bg-white/80 text-stone-600 border border-stone-200/60 hover:bg-white hover:text-stone-900'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Right: Rating Filter & Open Now Toggle */}
        <div className="flex flex-wrap items-center gap-4 pt-2 md:pt-0 border-t md:border-t-0 border-stone-200/50">
          {/* Rating Pills */}
          <div className="space-y-1">
            <div className="text-[11px] font-mono uppercase tracking-wider text-stone-500">
              Rating
            </div>
            <div className="flex items-center gap-1">
              {ratings.map((r) => (
                <button
                  key={r}
                  onClick={() => setSelectedRating(r)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    selectedRating === r
                      ? 'bg-amber-600 text-white shadow-sm'
                      : 'bg-white/80 text-stone-600 border border-stone-200/60 hover:bg-white'
                  }`}
                >
                  {r === 'All' ? 'Any' : r}
                </button>
              ))}
            </div>
          </div>

          {/* Open Now Toggle */}
          <div className="space-y-1">
            <div className="text-[11px] font-mono uppercase tracking-wider text-stone-500">
              Status
            </div>
            <button
              onClick={() => setOpenNowOnly(!openNowOnly)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                openNowOnly
                  ? 'bg-emerald-700 text-white border-emerald-800 shadow-sm'
                  : 'bg-white/80 text-stone-600 border-stone-200/60 hover:bg-white'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${openNowOnly ? 'bg-white' : 'bg-emerald-500'}`} />
              Open Now
            </button>
          </div>
        </div>
      </div>

      {/* 4. ACTIVE FILTER SUMMARY */}
      {(selectedLocation !== 'All' || selectedCuisine !== 'All' || selectedRating !== 'All' || openNowOnly || search) && (
        <div className="flex items-center justify-between text-xs text-stone-600 px-1">
          <div>
            Showing <strong className="text-stone-900">{filteredCafes.length}</strong> {filteredCafes.length === 1 ? 'cafe' : 'cafes'}
          </div>
          <button
            onClick={() => {
              setSearch('');
              setSelectedLocation('All');
              setSelectedCuisine('All');
              setSelectedRating('All');
              setOpenNowOnly(false);
            }}
            className="text-[#B84A22] hover:underline font-medium"
          >
            Reset all filters
          </button>
        </div>
      )}

      {/* 5. CAFE CARDS GRID */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="glass-card h-80 animate-pulse bg-white/40" />
          ))}
        </div>
      ) : filteredCafes.length === 0 ? (
        <div className="glass-panel py-16 px-6 text-center space-y-3 max-w-lg mx-auto">
          <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center mx-auto text-stone-400">
            <Search className="w-5 h-5" />
          </div>
          <h3 className="font-serif font-bold text-lg text-[#181514]">No cafes found</h3>
          <p className="text-xs text-[#6E685F] leading-relaxed">
            We couldn't find any cafes matching your search and filter criteria. Try adjusting your filters or location.
          </p>
          <button
            onClick={() => {
              setSearch('');
              setSelectedLocation('All');
              setSelectedCuisine('All');
              setSelectedRating('All');
              setOpenNowOnly(false);
            }}
            className="mt-2 px-4 py-2 rounded-xl text-xs font-semibold bg-[#181514] text-white hover:bg-stone-800 transition-colors"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCafes.map((cafe) => (
            <CafeCard key={cafe.id} cafe={cafe} />
          ))}
        </div>
      )}

      {/* 6. SUBTLE FOOTNOTE ABOUT REAL SEED DATA */}
      <div className="pt-8 border-t border-stone-200/50 text-center text-[11px] text-stone-400 font-mono">
        Directory listings for Ghaziabad & Delhi NCR curated as verified community seed data.
      </div>
    </div>
  );
}
