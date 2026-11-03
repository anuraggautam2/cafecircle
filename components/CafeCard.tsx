'use client';

import React from 'react';
import Link from 'next/link';
import { MapPin, Star, Clock } from 'lucide-react';
import { Cafe } from '@/lib/types';

interface CafeCardProps {
  cafe: Cafe;
}

export default function CafeCard({ cafe }: CafeCardProps) {
  // Check if cafe has an active campaign
  const hasCampaign = cafe.campaigns && cafe.campaigns.length > 0;

  return (
    <Link
      href={`/cafes/${cafe.slug || cafe.id}`}
      className="glass-card rounded-2xl group overflow-hidden flex flex-col cursor-pointer block hover:-translate-y-1"
    >
      {/* 1. Cafe Photograph with subtle glass badge */}
      <div className="relative aspect-[16/11] overflow-hidden bg-stone-200/40">
        <img
          src={cafe.coverImage || 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80'}
          alt={cafe.name}
          className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500 ease-out"
        />

        {/* Status Pills Overlay with Frosted Glass */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-white/50 backdrop-blur-md text-[#181514] shadow-sm border border-white/70">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            {cafe.isOpen !== false ? 'Open Now' : 'Closed'}
          </span>

          {hasCampaign && (
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium bg-[#2C1810]/80 backdrop-blur-md text-amber-100 shadow-sm border border-amber-500/25">
              Community Offering
            </span>
          )}
        </div>
      </div>

      {/* 2. Cafe Information (Clean, Spacious, Glass Layered) */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-1.5">
          {/* Cafe Name & Rating */}
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-serif font-bold text-lg text-[#181514] group-hover:text-[#B84A22] transition-colors line-clamp-1">
              {cafe.name}
            </h3>

            <div className="flex items-center gap-1 shrink-0 text-xs font-semibold text-[#181514] bg-white/50 backdrop-blur-md px-2 py-0.5 rounded-md border border-white/70 shadow-xs">
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>{cafe.rating.toFixed(1)}</span>
              <span className="text-stone-500 font-normal text-[11px]">({cafe.reviewCount})</span>
            </div>
          </div>

          {/* Cuisine */}
          <div className="text-xs font-medium text-[#7B746F]">
            {cafe.cuisine || 'Specialty Coffee & Bakes'}
          </div>
        </div>

        {/* Location & Opening Status Footer */}
        <div className="pt-2 border-t border-stone-200/40 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-[#5A5450] gap-1.5">
          <div className="flex items-center gap-1.5 line-clamp-1">
            <MapPin className="w-3.5 h-3.5 text-[#B84A22] shrink-0" />
            <span className="truncate">{cafe.address ? cafe.address.split(',')[0] : cafe.city}, {cafe.city}</span>
          </div>

          <div className="flex items-center gap-1 text-[11px] text-stone-500 shrink-0">
            <Clock className="w-3 h-3 text-stone-400" />
            <span>{cafe.openingHours || '10:00 AM – 11:00 PM'}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
