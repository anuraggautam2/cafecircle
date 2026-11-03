'use client';

import React from 'react';
import Link from 'next/link';
import { MapPin } from 'lucide-react';
import { Campaign } from '@/lib/types';

interface CampaignCardProps {
  campaign: Campaign;
  onInvestClick?: (campaign: Campaign) => void;
}

export default function CampaignCard({ campaign }: CampaignCardProps) {
  const percentFunded = Math.min(
    100,
    Math.round((campaign.raisedAmount / campaign.targetAmount) * 100)
  );

  const formatLakhs = (amount: number) => {
    return `₹${(amount / 100000).toFixed(2)}L`;
  };

  return (
    <div className="glass-card rounded-2xl overflow-hidden flex flex-col group">
      {/* 1. Large Focus Photography */}
      <Link href={`/campaigns/${campaign.slug || campaign.id}`} className="block relative aspect-[16/10] overflow-hidden bg-stone-200/40">
        <img
          src={campaign.cafe?.coverImage || 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80'}
          alt={campaign.title}
          className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500 ease-out"
        />
        <div className="absolute top-3 right-3">
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-mono font-medium bg-white/50 backdrop-blur-md text-[#181514] border border-white/70 shadow-sm">
            {percentFunded}% funded
          </span>
        </div>
      </Link>

      {/* 2. Focused Cafe Information */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Cafe Name & Location */}
          <div className="space-y-1">
            <Link href={`/cafes/${campaign.cafe?.slug || campaign.cafeId}`}>
              <h3 className="font-serif font-bold text-base text-[#181514] group-hover:text-[#B84A22] transition-colors line-clamp-1">
                {campaign.cafe?.name}
              </h3>
            </Link>
            <div className="flex items-center gap-1.5 text-xs text-stone-500">
              <MapPin className="w-3.5 h-3.5 text-[#B84A22] shrink-0" />
              <span className="truncate">{campaign.expansionArea}, {campaign.expansionCity}</span>
            </div>
          </div>

          {/* Thin Progress Line */}
          <div className="mt-4 space-y-1.5">
            <div className="w-full bg-stone-300/35 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-[#2C1810] h-full rounded-full transition-all duration-300"
                style={{ width: `${percentFunded}%` }}
              />
            </div>
            <div className="flex items-baseline justify-between text-xs font-mono text-stone-800">
              <span className="font-semibold">{formatLakhs(campaign.raisedAmount)}</span>
              <span className="text-stone-400">Goal: {formatLakhs(campaign.targetAmount)}</span>
            </div>
          </div>
        </div>

        {/* 3. Primary Button */}
        <Link
          href={`/campaigns/${campaign.slug || campaign.id}`}
          className="btn-primary w-full text-center py-2.5 px-3 text-xs block shadow-sm"
        >
          View Cafe & Terms
        </Link>
      </div>
    </div>
  );
}
