'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Campaign } from '@/lib/types';
import InvestModal from '@/components/InvestModal';
import {
  MapPin,
  Calendar,
  Star,
  ShieldCheck,
  CheckCircle2,
  FileText,
  Share2,
  Clock,
  Utensils,
  CreditCard,
  Building,
  Info,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import SimulatedBadge from '@/components/SimulatedBadge';

export default function CafeDetailsPage() {
  const params = useParams();
  const cafeId = params.id as string;
  const { user } = useAuth();

  const [cafe, setCafe] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'about' | 'branches' | 'reviews' | 'documents'>('about');
  const [investModalOpen, setInvestModalOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);

  const [copied, setCopied] = useState(false);
  const [simulatingVisit, setSimulatingVisit] = useState(false);
  const [visitRecorded, setVisitRecorded] = useState(false);

  useEffect(() => {
    if (!cafeId) return;
    fetch(`/api/cafes/${cafeId}`)
      .then((res) => res.json())
      .then((data) => {
        if (!data.error) setCafe(data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [cafeId]);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 space-y-8">
        <div className="h-80 rounded-2xl glass-panel animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 h-96 rounded-2xl glass-panel animate-pulse" />
          <div className="h-96 rounded-2xl glass-panel animate-pulse" />
        </div>
      </div>
    );
  }

  if (!cafe) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center space-y-4">
        <div className="glass-panel p-10 space-y-3">
          <h2 className="font-serif text-2xl font-bold text-[#181514]">Cafe Not Found</h2>
          <p className="text-xs text-stone-500">We couldn't locate this cafe in our Ghaziabad & Delhi NCR directory.</p>
          <Link href="/explore" className="inline-block mt-2 text-xs font-semibold text-[#B84A22] underline">
            &larr; Back to Cafe Discovery
          </Link>
        </div>
      </div>
    );
  }

  // Active verified campaign check
  const activeCampaign = cafe.campaigns?.find((c: any) => c.status === 'ACTIVE') || cafe.campaigns?.[0];
  const hasActiveCampaign = !!activeCampaign;

  const handleSimulateReferralVisit = async () => {
    setSimulatingVisit(true);
    try {
      const refCode = `${cafe.name.slice(0, 4).toUpperCase()}-TEST`;
      await fetch('/api/referrals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'CONVERT_VISIT',
          referralCode: cafe.referrals?.[0]?.referralCode || refCode,
          visitorName: `${user?.name || 'Guest'} (Simulated Visit)`,
          conversionType: 'CAFE_VISIT',
        }),
      });
      setVisitRecorded(true);
      setTimeout(() => setVisitRecorded(false), 4000);
    } catch (e) {
      console.error(e);
    } finally {
      setSimulatingVisit(false);
    }
  };

  const copyCafeLink = () => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* 1. BREADCRUMBS & TOP BAR */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 text-stone-500 font-mono">
          <Link href="/explore" className="hover:text-stone-900 transition-colors">Directory</Link>
          <span>/</span>
          <span className="text-stone-400">{cafe.city}</span>
          <span>/</span>
          <span className="text-stone-900 font-semibold">{cafe.name}</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={copyCafeLink}
            className="glass-pill px-3 py-1.5 text-xs text-stone-700 hover:text-stone-900 font-medium flex items-center gap-1.5"
          >
            <Share2 className="w-3.5 h-3.5 text-stone-500" />
            {copied ? 'Link Copied' : 'Share'}
          </button>
          <SimulatedBadge variant="pill" />
        </div>
      </div>

      {/* 2. AIRBNB-INSPIRED CAFE GALLERY (Glassmorphic Container) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 h-72 sm:h-96 rounded-2xl overflow-hidden glass-panel p-2">
        {/* Main Photo */}
        <div className="md:col-span-8 h-full rounded-xl overflow-hidden bg-stone-100">
          <img
            src={cafe.coverImage}
            alt={cafe.name}
            className="w-full h-full object-cover hover:scale-[1.02] transition-transform duration-500 ease-out"
          />
        </div>

        {/* Side Thumbnails */}
        <div className="hidden md:flex md:col-span-4 flex-col gap-2 h-full">
          <div className="flex-1 rounded-xl overflow-hidden bg-stone-100">
            <img
              src={cafe.images?.[1] || cafe.coverImage}
              alt={cafe.name}
              className="w-full h-full object-cover hover:scale-[1.02] transition-transform duration-500 ease-out"
            />
          </div>
          <div className="flex-1 rounded-xl overflow-hidden bg-stone-100">
            <img
              src={cafe.images?.[2] || cafe.coverImage}
              alt={cafe.name}
              className="w-full h-full object-cover hover:scale-[1.02] transition-transform duration-500 ease-out"
            />
          </div>
        </div>
      </div>

      {/* 3. CAFE IDENTITY STRIP */}
      <div className="glass-panel p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4 sm:gap-6">
          <img
            src={cafe.logo}
            alt={cafe.name}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border border-white/80 shadow-sm bg-white shrink-0"
          />
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#181514]">
                {cafe.name}
              </h1>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium bg-emerald-50 text-emerald-800 border border-emerald-200/60">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                Verified Listing
              </span>
            </div>

            <p className="text-xs sm:text-sm text-[#5A5450]">{cafe.tagline}</p>

            <div className="flex flex-wrap items-center gap-3 text-xs text-stone-500 pt-0.5">
              <span className="flex items-center gap-1 text-stone-800 font-semibold">
                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                {cafe.rating.toFixed(1)}
                <span className="text-stone-400 font-normal">({cafe.reviewCount} Reviews)</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#B84A22]" />
                {cafe.address}, {cafe.city}
              </span>
              <span>•</span>
              <span className="font-mono text-emerald-700 font-medium">
                {cafe.isOpen !== false ? '● Open Now' : '○ Closed'}
              </span>
            </div>
          </div>
        </div>

        {/* Source metadata pill */}
        <div className="text-right shrink-0 hidden lg:block">
          <div className="text-[10px] font-mono uppercase tracking-wider text-stone-400">Database Entry</div>
          <div className="text-xs font-mono text-stone-600 mt-0.5">{cafe.dataSource || 'Ghaziabad Seed Directory'}</div>
        </div>
      </div>

      {/* 4. INVESTMENT OPPORTUNITY (Strictly ONLY IF VERIFIED CAMPAIGN EXISTS) */}
      {hasActiveCampaign ? (
        <div className="glass-panel p-6 sm:p-8 border-amber-200/60 bg-gradient-to-r from-amber-50/40 via-white/70 to-stone-50/40 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-200/50 pb-5">
            <div>
              <div className="inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider font-semibold text-[#B84A22]">
                <Sparkles className="w-3 h-3" />
                Active Verified Community Expansion Round
              </div>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#181514] mt-1">
                {activeCampaign.title}
              </h2>
              <p className="text-xs text-stone-600 mt-1 max-w-2xl leading-relaxed">
                Raising community capital to open in {activeCampaign.expansionArea}, {activeCampaign.expansionCity}.
                Structure: <strong className="font-mono text-stone-900">{activeCampaign.investmentStructure.replace('_', ' ')}</strong> with projected yields of <strong className="text-emerald-700">{activeCampaign.projectedReturnRate}</strong>.
              </p>
            </div>

            {/* Investment Buttons */}
            <div className="flex items-center gap-2.5 shrink-0">
              <Link
                href={`/campaigns/${activeCampaign.slug || activeCampaign.id}`}
                className="btn-secondary px-4 py-2.5 text-xs shadow-sm"
              >
                View Offering Pitch
              </Link>
              <button
                onClick={() => {
                  setSelectedCampaign(activeCampaign);
                  setInvestModalOpen(true);
                }}
                className="btn-primary px-5 py-2.5 text-xs shadow-sm"
              >
                Back This Expansion (Simulated)
              </button>
            </div>
          </div>

          {/* Funding Progress Bar & Key Numbers */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
            <div className="p-3.5 rounded-xl bg-white/45 backdrop-blur-md border border-white/60">
              <div className="text-[10px] uppercase text-stone-400">Raised so far</div>
              <div className="text-lg font-bold text-stone-900 mt-0.5">
                ₹{(activeCampaign.raisedAmount / 100000).toFixed(2)}L
              </div>
              <div className="text-[10px] text-stone-500">of ₹{(activeCampaign.targetAmount / 100000).toFixed(2)}L target</div>
            </div>

            <div className="p-3.5 rounded-xl bg-white/45 backdrop-blur-md border border-white/60">
              <div className="text-[10px] uppercase text-stone-400">Community Backers</div>
              <div className="text-lg font-bold text-stone-900 mt-0.5">{activeCampaign.investorCount}</div>
              <div className="text-[10px] text-stone-500">co-growth advocates</div>
            </div>

            <div className="p-3.5 rounded-xl bg-white/45 backdrop-blur-md border border-white/60">
              <div className="text-[10px] uppercase text-stone-400">Min. Ticket</div>
              <div className="text-lg font-bold text-stone-900 mt-0.5">₹{activeCampaign.minInvestment.toLocaleString('en-IN')}</div>
              <div className="text-[10px] text-stone-500">simulated educational round</div>
            </div>

            <div className="p-3.5 rounded-xl bg-white/45 backdrop-blur-md border border-white/60">
              <div className="text-[10px] uppercase text-stone-400">Return Cap</div>
              <div className="text-lg font-bold text-emerald-700 mt-0.5">1.30x – 1.35x</div>
              <div className="text-[10px] text-emerald-800/80">quarterly revenue share</div>
            </div>
          </div>
        </div>
      ) : (
        /* NO CAMPAIGN STATE: Community Profile Notice (No investment buttons!) */
        <div className="glass-panel p-5 sm:p-6 border-stone-200/60 bg-white/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 font-semibold text-stone-800">
              <Info className="w-4 h-4 text-stone-500" />
              Community Discovery Listing • Not Currently Raising Funds
            </div>
            <p className="text-stone-500 leading-relaxed max-w-2xl">
              {cafe.name} is featured in the CafeCircle directory. This cafe has no open fundraising campaign at this time. Community investment opportunities open only when an expansion round is verified and approved.
            </p>
          </div>
          <Link
            href="/explore"
            className="text-xs font-semibold text-[#B84A22] hover:underline whitespace-nowrap self-start sm:self-center"
          >
            Explore Cafes Raising Funds &rarr;
          </Link>
        </div>
      )}

      {/* 5. MAIN CONTENT TABS & SIDEBAR */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (8 cols): Tabs & Details */}
        <div className="lg:col-span-8 space-y-6">
          {/* Tabs Navigation */}
          <div className="flex items-center gap-2 border-b border-stone-200/60 pb-2 text-xs font-medium">
            <button
              onClick={() => setActiveTab('about')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'about'
                  ? 'bg-[#181514] text-white font-semibold shadow-sm'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-white/60'
              }`}
            >
              About the Cafe
            </button>
            <button
              onClick={() => setActiveTab('branches')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'branches'
                  ? 'bg-[#181514] text-white font-semibold shadow-sm'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-white/60'
              }`}
            >
              Outlets ({cafe.branches?.length || 1})
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'reviews'
                  ? 'bg-[#181514] text-white font-semibold shadow-sm'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-white/60'
              }`}
            >
              Reviews ({cafe.reviews?.length || 0})
            </button>
            {cafe.documents && cafe.documents.length > 0 && (
              <button
                onClick={() => setActiveTab('documents')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  activeTab === 'documents'
                    ? 'bg-[#181514] text-white font-semibold shadow-sm'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-white/60'
                }`}
              >
                Documents ({cafe.documents.length})
              </button>
            )}
          </div>

          {/* TAB 1: About the Cafe */}
          {activeTab === 'about' && (
            <div className="glass-panel p-6 sm:p-8 space-y-6">
              <div className="space-y-3">
                <h3 className="font-serif font-bold text-xl text-[#181514]">
                  Story & Ambience
                </h3>
                <p className="text-xs sm:text-sm text-stone-700 leading-relaxed whitespace-pre-line">
                  {cafe.story || cafe.description}
                </p>
              </div>

              {/* Highlights & Features */}
              <div className="pt-4 border-t border-stone-200/50 space-y-3">
                <h4 className="font-serif font-bold text-sm text-stone-900">
                  Cafe Highlights
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-white/45 backdrop-blur-md border border-white/60">
                    <div className="text-stone-400 font-mono text-[10px] uppercase">Cuisine</div>
                    <div className="font-medium text-stone-900 mt-0.5">{cafe.cuisine || 'Continental & Bakes'}</div>
                  </div>
                  <div className="p-3 rounded-xl bg-white/45 backdrop-blur-md border border-white/60">
                    <div className="text-stone-400 font-mono text-[10px] uppercase">Established</div>
                    <div className="font-medium text-stone-900 mt-0.5">{cafe.establishedYear || '2021'}</div>
                  </div>
                  <div className="p-3 rounded-xl bg-white/45 backdrop-blur-md border border-white/60">
                    <div className="text-stone-400 font-mono text-[10px] uppercase">Pricing</div>
                    <div className="font-medium text-stone-900 mt-0.5">{cafe.priceForTwo || '₹800 for two'}</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Outlets */}
          {activeTab === 'branches' && (
            <div className="glass-panel p-6 sm:p-8 space-y-4">
              <h3 className="font-serif font-bold text-xl text-[#181514]">
                Operating & Expansion Outlets
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {cafe.branches && cafe.branches.length > 0 ? (
                  cafe.branches.map((b: any) => (
                    <div key={b.id} className="p-4 rounded-xl bg-white/45 backdrop-blur-md border border-white/60 space-y-1.5 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-stone-900">{b.name}</span>
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-semibold ${
                            b.status === 'OPERATING'
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200/60'
                              : 'bg-amber-50 text-amber-800 border border-amber-200/60'
                          }`}
                        >
                          {b.status}
                        </span>
                      </div>
                      <div className="text-stone-500 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-[#B84A22] shrink-0" />
                        <span>{b.address}, {b.city}</span>
                      </div>
                      <div className="text-[11px] text-stone-400 pt-1">
                        Capacity: {b.seatingCapacity} seats {b.monthlyFootfall > 0 && `• Footfall: ~${b.monthlyFootfall}/mo`}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 rounded-xl bg-white/45 backdrop-blur-md border border-white/60 text-xs text-stone-500">
                    Primary location: {cafe.address}, {cafe.city}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: Reviews */}
          {activeTab === 'reviews' && (
            <div className="glass-panel p-6 sm:p-8 space-y-4">
              <div className="flex items-baseline justify-between border-b border-stone-200/50 pb-3">
                <h3 className="font-serif font-bold text-xl text-[#181514]">
                  Customer & Community Reviews
                </h3>
                <div className="text-xs font-mono text-stone-500">
                  {cafe.rating.toFixed(1)} / 5.0 Rating
                </div>
              </div>

              <div className="space-y-3 pt-1">
                {cafe.reviews && cafe.reviews.length > 0 ? (
                  cafe.reviews.map((rev: any) => (
                    <div key={rev.id} className="p-4 rounded-xl bg-white/45 backdrop-blur-md border border-white/60 space-y-1.5 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-stone-900">{rev.user?.name || 'Verified Diner'}</span>
                        <div className="flex items-center gap-0.5 text-amber-500 font-semibold">
                          <Star className="w-3.5 h-3.5 fill-amber-500" />
                          <span>{rev.rating}</span>
                        </div>
                      </div>
                      <p className="text-stone-600 leading-relaxed">{rev.comment}</p>
                    </div>
                  ))
                ) : (
                  <div className="text-xs text-stone-500 py-6 text-center">
                    No community reviews recorded yet.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: Documents */}
          {activeTab === 'documents' && (
            <div className="glass-panel p-6 sm:p-8 space-y-4">
              <h3 className="font-serif font-bold text-xl text-[#181514]">
                Verified Business Documents
              </h3>
              <div className="space-y-2">
                {cafe.documents?.map((doc: any) => (
                  <div key={doc.id} className="p-3.5 rounded-xl bg-white/45 backdrop-blur-md border border-white/60 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <FileText className="w-4 h-4 text-[#B84A22]" />
                      <div>
                        <div className="font-semibold text-stone-900">{doc.title}</div>
                        <div className="text-[11px] text-stone-400">{doc.docType.replace('_', ' ')} • {doc.fileSize}</div>
                      </div>
                    </div>
                    <span className="font-mono text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/60 font-semibold">
                      Verified
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column (4 cols): Available Information & Community Engine */}
        <div className="lg:col-span-4 space-y-6">
          {/* AVAILABLE INFORMATION CARD */}
          <div className="glass-panel p-5 sm:p-6 space-y-4 text-xs">
            <h4 className="font-serif font-bold text-base text-[#181514] border-b border-stone-200/50 pb-2">
              Available Information
            </h4>

            <div className="space-y-3 text-stone-600">
              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-stone-400 mt-0.5 shrink-0" />
                <div>
                  <div className="font-semibold text-stone-900">Opening Hours</div>
                  <div className="text-[11px] text-stone-500">{cafe.openingHours || '10:00 AM – 11:00 PM'}</div>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Utensils className="w-4 h-4 text-stone-400 mt-0.5 shrink-0" />
                <div>
                  <div className="font-semibold text-stone-900">Cuisine & Fare</div>
                  <div className="text-[11px] text-stone-500">{cafe.cuisine || 'Continental, Bakery & Specialty Coffee'}</div>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <CreditCard className="w-4 h-4 text-stone-400 mt-0.5 shrink-0" />
                <div>
                  <div className="font-semibold text-stone-900">Average Cost</div>
                  <div className="text-[11px] text-stone-500">{cafe.priceForTwo || '₹800 for two people'}</div>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-stone-400 mt-0.5 shrink-0" />
                <div>
                  <div className="font-semibold text-stone-900">Address</div>
                  <div className="text-[11px] text-stone-500">{cafe.address}, {cafe.city}, {cafe.state} {cafe.pincode}</div>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Building className="w-4 h-4 text-stone-400 mt-0.5 shrink-0" />
                <div>
                  <div className="font-semibold text-stone-900">Entity & Operator</div>
                  <div className="text-[11px] text-stone-500">{cafe.owner?.businessName || 'Verified Partner Operator'}</div>
                </div>
              </div>
            </div>
          </div>

          {/* COMMUNITY GROWTH ENGINE CARD */}
          <div className="glass-panel p-5 sm:p-6 space-y-3 text-xs">
            <div className="text-[10px] font-mono uppercase font-bold text-[#B84A22]">
              COMMUNITY GROWTH ENGINE
            </div>
            <h4 className="font-serif font-bold text-base text-[#181514]">
              Recommend {cafe.name}
            </h4>
            <p className="text-stone-500 leading-relaxed text-xs">
              Share this cafe with friends. When they visit, track guest footfall and earn advocate recognition.
            </p>

            <button
              onClick={handleSimulateReferralVisit}
              disabled={simulatingVisit}
              className="btn-primary w-full py-2.5 px-3 text-xs shadow-sm"
            >
              {simulatingVisit ? 'Recording...' : 'Simulate a Friend Visiting'}
            </button>

            {visitRecorded && (
              <p className="text-emerald-700 font-semibold text-center text-[11px] font-mono">
                ✓ Friend visit recorded! Advocate points awarded.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Simulated Investment Modal */}
      {selectedCampaign && (
        <InvestModal
          campaign={selectedCampaign}
          isOpen={investModalOpen}
          onClose={() => setInvestModalOpen(false)}
        />
      )}
    </div>
  );
}
