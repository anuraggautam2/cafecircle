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
  Users,
  TrendingUp,
  FileText,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Building,
  Check,
  Download,
  AlertTriangle,
} from 'lucide-react';
import SimulatedBadge from '@/components/SimulatedBadge';

export default function CampaignDetailsPage() {
  const params = useParams();
  const campaignId = params.id as string;
  const { user } = useAuth();

  const [campaign, setCampaign] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [investModalOpen, setInvestModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'pitch' | 'economics' | 'documents' | 'risks' | 'backers'>('pitch');

  // Pledge tier selector
  const [selectedTierAmount, setSelectedTierAmount] = useState<number>(10000);

  useEffect(() => {
    if (!campaignId) return;
    fetch(`/api/campaigns/${campaignId}`)
      .then((res) => res.json())
      .then((data) => {
        if (!data.error) setCampaign(data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [campaignId]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="h-96 rounded-xl bg-[#E8E2D6]/40 animate-pulse mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 h-96 rounded-xl bg-[#E8E2D6]/40 animate-pulse" />
          <div className="h-96 rounded-xl bg-[#E8E2D6]/40 animate-pulse" />
        </div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-3">
        <h2 className="font-serif text-2xl font-bold text-[#181514]">Campaign not found</h2>
        <Link href="/explore" className="text-xs font-semibold text-[#B84A22] underline">
          &larr; Return to directory
        </Link>
      </div>
    );
  }

  const percentFunded = Math.min(
    100,
    Math.round((campaign.raisedAmount / campaign.targetAmount) * 100)
  );

  const daysLeft = Math.max(
    0,
    Math.ceil((new Date(campaign.endDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24))
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* 1. KICKSTARTER-INSPIRED PROJECT HEADER */}
      <div className="border-b border-[#E8E2D6] pb-6 space-y-4">
        <div className="flex items-center gap-2 text-xs font-mono text-[#7B746F]">
          <Link href="/explore" className="hover:text-[#181514]">Directory</Link>
          <span>/</span>
          <Link href={`/cafes/${campaign.cafe?.slug}`} className="hover:text-[#181514]">
            {campaign.cafe?.name}
          </Link>
          <span>/</span>
          <span className="text-[#181514] font-semibold">Offering</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="space-y-2 max-w-3xl">
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#181514] leading-tight">
              {campaign.title}
            </h1>
            <div className="flex flex-wrap items-center gap-3 text-xs text-[#5A5450]">
              <span className="font-semibold text-[#181514] flex items-center gap-1">
                <Building className="w-3.5 h-3.5 text-[#B84A22]" />
                {campaign.cafe?.name}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#7B746F]" />
                {campaign.expansionArea}, {campaign.expansionCity}
              </span>
              <span>•</span>
              <span className="font-mono text-[#2D6A4F] bg-[#EDF5F1] px-2 py-0.5 rounded font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Due Diligence Cleared
              </span>
            </div>
          </div>

          <SimulatedBadge variant="pill" />
        </div>
      </div>

      {/* 2. PHOTO + TOP NUMBERS HERO (Kickstarter / Airbnb layout) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Large Media (7 cols) */}
        <div className="lg:col-span-7">
          <div className="glass-panel p-2 shadow-sm">
            <div className="rounded-xl overflow-hidden aspect-[16/10] bg-stone-100">
              <img
                src={campaign.cafe?.coverImage}
                alt={campaign.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Campaign Metrics & Primary Pledge Box (5 cols) */}
        <div className="lg:col-span-5 glass-panel p-6 sm:p-8 space-y-6">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="w-full bg-[#EAE2D6] h-2 rounded-full overflow-hidden">
              <div
                className="bg-[#B84A22] h-full rounded-full transition-all duration-300"
                style={{ width: `${percentFunded}%` }}
              />
            </div>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 gap-4 border-b border-[#F3EFE7] pb-6">
            <div>
              <div className="text-2xl sm:text-3xl font-serif font-bold text-[#181514]">
                ₹{(campaign.raisedAmount / 100000).toFixed(2)}L
              </div>
              <div className="text-xs text-[#7B746F] mt-0.5">
                raised of ₹{(campaign.targetAmount / 100000).toFixed(2)}L goal
              </div>
            </div>

            <div>
              <div className="text-2xl sm:text-3xl font-serif font-bold text-[#181514]">
                {campaign.investorCount}
              </div>
              <div className="text-xs text-[#7B746F] mt-0.5">Community Backers</div>
            </div>

            <div>
              <div className="text-xl sm:text-2xl font-serif font-bold text-[#181514]">
                {percentFunded}%
              </div>
              <div className="text-xs text-[#7B746F] mt-0.5">Funded so far</div>
            </div>

            <div>
              <div className="text-xl sm:text-2xl font-serif font-bold text-[#181514]">
                {daysLeft} Days
              </div>
              <div className="text-xs text-[#7B746F] mt-0.5">Remaining in round</div>
            </div>
          </div>

          {/* Term Sheet Overview */}
          <div className="space-y-2 text-xs">
            <div className="text-[11px] font-mono uppercase tracking-wider text-[#7B746F]">
              Disclosed Term Structure
            </div>
            <div className="p-3 rounded-lg bg-[#F9F7F3] border border-[#E8E2D6] space-y-1.5 font-mono text-[11px] text-[#262220]">
              <div className="flex justify-between">
                <span className="text-[#7B746F]">Structure:</span>
                <span className="font-semibold">{campaign.investmentStructure.replace('_', ' ')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#7B746F]">Yield Model:</span>
                <span className="font-semibold">{campaign.projectedReturnRate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#7B746F]">Tenure:</span>
                <span className="font-semibold">{campaign.repaymentPeriod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#7B746F]">Min. Ticket:</span>
                <span className="font-semibold">₹{campaign.minInvestment.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-2 space-y-2" id="invest">
            <button
              onClick={() => setInvestModalOpen(true)}
              className="btn-primary w-full py-3 px-4 text-sm shadow-sm"
            >
              Back This Expansion (Simulated)
            </button>
            <div className="text-[11px] text-center text-[#7B746F]">
              Cryptographic term sheet executed on submission • Demo sandbox
            </div>
          </div>
        </div>
      </div>

      {/* 3. EDITORIAL TABS (Airbnb / Linear clarity) */}
      <div className="border-b border-[#E8E2D6] flex items-center gap-6 text-xs sm:text-sm font-medium overflow-x-auto">
        <button
          onClick={() => setActiveTab('pitch')}
          className={`pb-3 border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'pitch'
              ? 'border-[#B84A22] text-[#B84A22] font-semibold'
              : 'border-transparent text-[#5A5450] hover:text-[#181514]'
          }`}
        >
          Offering Pitch
        </button>
        <button
          onClick={() => setActiveTab('economics')}
          className={`pb-3 border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'economics'
              ? 'border-[#B84A22] text-[#B84A22] font-semibold'
              : 'border-transparent text-[#5A5450] hover:text-[#181514]'
          }`}
        >
          Branch Economics
        </button>
        <button
          onClick={() => setActiveTab('documents')}
          className={`pb-3 border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'documents'
              ? 'border-[#B84A22] text-[#B84A22] font-semibold'
              : 'border-transparent text-[#5A5450] hover:text-[#181514]'
          }`}
        >
          Due Diligence Files
        </button>
        <button
          onClick={() => setActiveTab('risks')}
          className={`pb-3 border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'risks'
              ? 'border-[#B84A22] text-[#B84A22] font-semibold'
              : 'border-transparent text-[#5A5450] hover:text-[#181514]'
          }`}
        >
          Risk Disclosures
        </button>
        <button
          onClick={() => setActiveTab('backers')}
          className={`pb-3 border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'backers'
              ? 'border-[#B84A22] text-[#B84A22] font-semibold'
              : 'border-transparent text-[#5A5450] hover:text-[#181514]'
          }`}
        >
          Community Backers ({campaign.investments?.length || 0})
        </button>
      </div>

      {/* 4. TAB CONTENTS & PLEDGE REWARDS COLUMN */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Main Tab Details (8 cols) */}
        <div className="lg:col-span-8 space-y-8">
          {activeTab === 'pitch' && (
            <div className="space-y-6 text-sm text-[#3D3835] leading-relaxed">
              <div className="stripe-card p-6 sm:p-8 space-y-4">
                <h3 className="font-serif font-bold text-xl text-[#181514]">The Thesis</h3>
                <p className="whitespace-pre-line">{campaign.pitch}</p>

                <h4 className="font-serif font-bold text-base text-[#181514] pt-2">
                  Why Community Co-growth
                </h4>
                <p>{campaign.reasonForFunding}</p>
              </div>

              {/* Term structure explanation */}
              <div className="stripe-card p-6 sm:p-8 space-y-3">
                <h3 className="font-serif font-bold text-lg text-[#181514]">
                  Proposed Return Mechanism
                </h3>
                <p className="text-xs text-[#5A5450] leading-relaxed">
                  {campaign.returnTerms}
                </p>
                <div className="p-4 rounded-lg bg-[#F9F7F3] border border-[#E8E2D6] text-xs space-y-1.5">
                  <div className="font-semibold text-[#181514]">Patron Rights Included:</div>
                  <ul className="list-disc list-inside space-y-1 text-[#5A5450]">
                    <li>Quarterly verified pro-rata distributions to portfolio ledger</li>
                    <li>15% Lifetime Cafe Beverage Discount badge via digital QR</li>
                    <li>Invitation to quarterly private cupping tastings with Founder & Q-Graders</li>
                    <li>Name inscribed on the physical Community Founder Wall in the cafe courtyard</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'economics' && (
            <div className="stripe-card p-6 sm:p-8 space-y-6 text-xs text-[#3D3835]">
              <div>
                <h3 className="font-serif font-bold text-xl text-[#181514]">
                  Unit Economics & Branch Capital Plan
                </h3>
                <p className="text-[#5A5450] mt-1">
                  Budget allocation submitted by {campaign.cafe?.name} for the {campaign.expansionArea} outlet.
                </p>
              </div>

              <div className="whitespace-pre-line leading-relaxed text-sm">
                {campaign.expansionPlan}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4 border-t border-[#F3EFE7]">
                <div className="p-3 rounded-lg bg-[#F9F7F3] border border-[#E8E2D6]">
                  <div className="text-[10px] uppercase font-mono text-[#7B746F]">Planned Footfall</div>
                  <div className="text-base font-bold text-[#181514] mt-0.5">6,500+ / mo</div>
                </div>
                <div className="p-3 rounded-lg bg-[#F9F7F3] border border-[#E8E2D6]">
                  <div className="text-[10px] uppercase font-mono text-[#7B746F]">Avg Guest Ticket</div>
                  <div className="text-base font-bold text-[#181514] mt-0.5">₹340</div>
                </div>
                <div className="p-3 rounded-lg bg-[#F9F7F3] border border-[#E8E2D6]">
                  <div className="text-[10px] uppercase font-mono text-[#7B746F]">Target Monthly GMV</div>
                  <div className="text-base font-bold text-[#181514] mt-0.5">₹18.5 Lakhs</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'documents' && (
            <div className="stripe-card p-6 sm:p-8 space-y-4">
              <h3 className="font-serif font-bold text-xl text-[#181514]">
                Audited Due Diligence Package
              </h3>
              <p className="text-xs text-[#5A5450]">
                All files have been verified by the CafeCircle legal & compliance desk.
              </p>

              <div className="space-y-3 pt-2">
                <div className="p-4 rounded-lg bg-[#F9F7F3] border border-[#E8E2D6] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <FileText className="w-4 h-4 text-[#B84A22]" />
                    <div>
                      <div className="font-bold text-[#181514]">HSR Layout 9-Year Registered Lease Deed</div>
                      <div className="text-[11px] text-[#7B746F]">Sub-Registrar Office Bengaluru • 3.1 MB</div>
                    </div>
                  </div>
                  <span className="font-mono text-xs text-[#2D6A4F] font-semibold">Verified</span>
                </div>

                <div className="p-4 rounded-lg bg-[#F9F7F3] border border-[#E8E2D6] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <FileText className="w-4 h-4 text-[#B84A22]" />
                    <div>
                      <div className="font-bold text-[#181514]">3-Year Audited Balance Sheet (FY23 - FY25)</div>
                      <div className="text-[11px] text-[#7B746F]">Batliboi & Associates • 4.2 MB</div>
                    </div>
                  </div>
                  <span className="font-mono text-xs text-[#2D6A4F] font-semibold">Verified</span>
                </div>

                <div className="p-4 rounded-lg bg-[#F9F7F3] border border-[#E8E2D6] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <FileText className="w-4 h-4 text-[#B84A22]" />
                    <div>
                      <div className="font-bold text-[#181514]">Central FSSAI Food Safety License</div>
                      <div className="text-[11px] text-[#7B746F]">License #11222334000189 • 1.8 MB</div>
                    </div>
                  </div>
                  <span className="font-mono text-xs text-[#2D6A4F] font-semibold">Verified</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'risks' && (
            <div className="stripe-card p-6 sm:p-8 space-y-4 text-xs text-[#3D3835] border-amber-300 bg-[#FFFDF8]">
              <div className="flex items-center gap-2 font-mono text-xs font-bold text-amber-900 uppercase">
                <AlertTriangle className="w-4 h-4 text-amber-700" />
                Mandatory Risk Disclosures
              </div>
              <h3 className="font-serif font-bold text-lg text-[#181514]">
                Operational & Market Risk Assessment
              </h3>
              <p className="leading-relaxed text-sm">
                {campaign.riskFactors}
              </p>
              <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-xs text-amber-950 space-y-1">
                <strong>Investor Safeguard Notice:</strong> Community revenue-share arrangements do not guarantee absolute financial performance. Backers should only participate with discretionary capital and review the digital term sheet before confirmation.
              </div>
            </div>
          )}

          {activeTab === 'backers' && (
            <div className="stripe-card p-6 sm:p-8 space-y-4">
              <h3 className="font-serif font-bold text-xl text-[#181514]">
                Community Backers Roster ({campaign.investments?.length || 0})
              </h3>

              <div className="space-y-3">
                {campaign.investments?.map((inv: any) => (
                  <div
                    key={inv.id}
                    className="p-3 rounded-lg bg-[#F9F7F3] border border-[#E8E2D6] flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={inv.investor?.user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80'}
                        alt={inv.investor?.user?.name}
                        className="w-7 h-7 rounded-full object-cover"
                      />
                      <div>
                        <div className="font-bold text-[#181514]">{inv.investor?.user?.name}</div>
                        <div className="text-[10px] text-[#7B746F]">
                          Certificate #{inv.certificateNumber} • {new Date(inv.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <span className="font-mono font-bold text-sm text-[#181514]">
                      ₹{inv.amount.toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Kickstarter-style Reward Tiers Column (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="text-xs font-mono uppercase tracking-wider text-[#7B746F]">
            Select Contribution Tier
          </div>

          {/* Tier 1 */}
          <div
            onClick={() => {
              setSelectedTierAmount(5000);
              setInvestModalOpen(true);
            }}
            className="stripe-card p-5 cursor-pointer hover:border-[#181514] transition-all space-y-2.5 text-xs group"
          >
            <div className="flex justify-between items-baseline">
              <span className="font-serif font-bold text-base text-[#181514]">
                Pledge ₹5,000
              </span>
              <span className="text-[10px] font-mono text-[#B84A22] font-semibold">Tier 1</span>
            </div>
            <div className="font-semibold text-xs text-[#181514]">Community Supporter</div>
            <p className="text-[#5A5450] text-[11px] leading-relaxed">
              Quarterly pro-rata revenue-share distribution + 15% cafe discount card valid for 12 months.
            </p>
            <div className="pt-2 text-[11px] font-semibold text-[#181514] group-hover:text-[#B84A22] flex items-center gap-1">
              Select Tier &rarr;
            </div>
          </div>

          {/* Tier 2 */}
          <div
            onClick={() => {
              setSelectedTierAmount(25000);
              setInvestModalOpen(true);
            }}
            className="stripe-card p-5 cursor-pointer hover:border-[#181514] transition-all space-y-2.5 text-xs group border-[#D5CCBE]"
          >
            <div className="flex justify-between items-baseline">
              <span className="font-serif font-bold text-base text-[#181514]">
                Pledge ₹25,000
              </span>
              <span className="text-[10px] font-mono text-[#B84A22] font-semibold">Tier 2</span>
            </div>
            <div className="font-semibold text-xs text-[#181514]">Roastery Patron</div>
            <p className="text-[#5A5450] text-[11px] leading-relaxed">
              Above perks + invitation to private quarterly single-origin cupping workshops with the Head Roaster.
            </p>
            <div className="pt-2 text-[11px] font-semibold text-[#181514] group-hover:text-[#B84A22] flex items-center gap-1">
              Select Tier &rarr;
            </div>
          </div>

          {/* Tier 3 */}
          <div
            onClick={() => {
              setSelectedTierAmount(50000);
              setInvestModalOpen(true);
            }}
            className="stripe-card p-5 cursor-pointer hover:border-[#181514] transition-all space-y-2.5 text-xs group"
          >
            <div className="flex justify-between items-baseline">
              <span className="font-serif font-bold text-base text-[#181514]">
                Pledge ₹50,000
              </span>
              <span className="text-[10px] font-mono text-[#B84A22] font-semibold">Tier 3</span>
            </div>
            <div className="font-semibold text-xs text-[#181514]">Courtyard Founder</div>
            <p className="text-[#5A5450] text-[11px] leading-relaxed">
              All Tier 2 perks + permanent name inscription on the HSR Courtyard Founder Wall + annual reserve roast bean box.
            </p>
            <div className="pt-2 text-[11px] font-semibold text-[#181514] group-hover:text-[#B84A22] flex items-center gap-1">
              Select Tier &rarr;
            </div>
          </div>
        </div>
      </div>

      {/* Simulated Investment Modal */}
      <InvestModal
        campaign={campaign}
        isOpen={investModalOpen}
        onClose={() => setInvestModalOpen(false)}
        onSuccess={() => {
          fetch(`/api/campaigns/${campaignId}`)
            .then((res) => res.json())
            .then((data) => {
              if (!data.error) setCampaign(data);
            });
        }}
      />
    </div>
  );
}
