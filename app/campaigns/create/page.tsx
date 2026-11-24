'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import {
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Building,
} from 'lucide-react';
import SimulatedBadge from '@/components/SimulatedBadge';

export default function CreateCampaignPage() {
  const router = useRouter();
  const { user } = useAuth();

  const [step, setStep] = useState<number>(1);
  const [submitting, setSubmitting] = useState(false);
  const [ownedCafes, setOwnedCafes] = useState<any[]>([]);
  const [selectedCafeId, setSelectedCafeId] = useState<string>('');
  const [loadingCafes, setLoadingCafes] = useState<boolean>(true);

  // Form states
  const [title, setTitle] = useState('');
  const [expansionCity, setExpansionCity] = useState('Ghaziabad');
  const [expansionArea, setExpansionArea] = useState('RDC, Raj Nagar');
  const [targetAmount, setTargetAmount] = useState('3000000');
  const [minInvestment, setMinInvestment] = useState('5000');
  const [maxInvestment, setMaxInvestment] = useState('100000');
  const [durationDays, setDurationDays] = useState('30');
  const [investmentStructure, setInvestmentStructure] = useState('REVENUE_SHARE');
  const [returnTerms, setReturnTerms] = useState(
    '5.0% of gross monthly branch revenue distributed pro-rata quarterly until 1.30x return cap.'
  );
  const [projectedReturnRate, setProjectedReturnRate] = useState('13% - 15% p.a. (Simulated)');
  const [repaymentPeriod, setRepaymentPeriod] = useState('24 - 36 Months');
  const [pitch, setPitch] = useState('');
  const [reasonForFunding, setReasonForFunding] = useState('');
  const [expansionPlan, setExpansionPlan] = useState('');
  const [riskFactors, setRiskFactors] = useState(
    'Commercial lease price escalation, delays in municipal health clearances, local specialty coffee bean price volatility.'
  );

  useEffect(() => {
    if (!user?.id) return;
    setLoadingCafes(true);
    fetch(`/api/cafes?ownerId=${user.cafeOwner?.id || user.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setOwnedCafes(data);
          if (data.length > 0) {
            setSelectedCafeId(data[0].id);
            if (data[0].city) setExpansionCity(data[0].city);
          }
        }
      })
      .catch((err) => console.error('Error fetching cafes for campaign:', err))
      .finally(() => setLoadingCafes(false));
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCafeId) {
      alert('Please select a registered cafe before submitting a campaign.');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch('/api/campaigns', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-cafecircle-user-id': user?.id || '',
        },
        body: JSON.stringify({
          cafeId: selectedCafeId,
          title: title || 'New Specialty Roastery Expansion',
          pitch: pitch || 'Expanding our artisanal estate coffee experience.',
          reasonForFunding: reasonForFunding || 'Capital needed for interior masonry and roasting gear.',
          expansionPlan: expansionPlan || 'Opening within 90 days of lease execution.',
          targetAmount,
          minInvestment,
          maxInvestment,
          durationDays,
          investmentStructure,
          returnTerms,
          riskFactors,
          expansionCity,
          expansionArea,
          projectedReturnRate,
          repaymentPeriod,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        router.push(`/campaigns/${data.slug || data.id}`);
      } else {
        alert(data.error || 'Failed to create campaign');
      }
    } catch (e) {
      console.error(e);
      alert('Error creating campaign');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="border-b border-[#E8E2D6] pb-6 flex items-baseline justify-between">
        <div>
          <div className="text-[11px] font-mono uppercase tracking-widest text-[#B84A22] font-semibold">
            EXPANSION LAUNCHPAD
          </div>
          <h1 className="font-serif text-3xl font-bold text-[#181514] mt-1">
            Create Campaign Offering
          </h1>
          <p className="text-xs text-[#5A5450] mt-0.5">
            Configure return terms, financial targets, and expansion economics.
          </p>
        </div>
        <SimulatedBadge variant="pill" />
      </div>

      {/* Progress Steps Header */}
      <div className="flex items-center justify-between border-b border-[#E8E2D6] pb-3 text-xs font-mono">
        {[
          { num: 1, label: 'Location' },
          { num: 2, label: 'Capital Goal' },
          { num: 3, label: 'Term Sheet' },
          { num: 4, label: 'Story & Risks' },
          { num: 5, label: 'Publish' },
        ].map((s) => (
          <button
            key={s.num}
            type="button"
            onClick={() => setStep(s.num)}
            className={`flex items-center gap-1.5 transition-colors ${
              step === s.num
                ? 'text-[#181514] font-bold'
                : step > s.num
                ? 'text-[#2D6A4F] font-semibold'
                : 'text-[#A39C95]'
            }`}
          >
            <span
              className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] ${
                step === s.num
                  ? 'bg-[#181514] text-white'
                  : step > s.num
                  ? 'bg-[#EDF5F1] text-[#2D6A4F]'
                  : 'bg-[#F3EFE7] text-[#7B746F]'
              }`}
            >
              {s.num}
            </span>
            <span className="hidden sm:inline">{s.label}</span>
          </button>
        ))}
      </div>

      {/* Form Wizard */}
      <div className="glass-panel p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* STEP 1: Location & Branch Info */}
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="font-serif font-bold text-lg text-[#181514]">
                Step 1: Associated Cafe & Expansion Location
              </h3>

              {/* Select Cafe Entity */}
              <div>
                <label className="block text-xs font-semibold text-[#181514] mb-1">
                  Select Associated Cafe Entity
                </label>
                {loadingCafes ? (
                  <div className="p-2.5 rounded-lg border border-[#E2DCD2] bg-[#F9F7F3] text-xs text-stone-400 font-mono animate-pulse">
                    Loading verified cafes...
                  </div>
                ) : ownedCafes.length === 0 ? (
                  <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-2">
                    <div className="flex items-center gap-2 font-semibold">
                      <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                      No registered cafe profiles found for this account.
                    </div>
                    <p className="text-[11px] text-amber-800 leading-relaxed">
                      You must operate a verified cafe to launch an expansion round. Switch to the <strong>Aarav Sharma (Cafe Owner)</strong> persona in the navbar or register a cafe entity first.
                    </p>
                  </div>
                ) : (
                  <div className="relative">
                    <select
                      value={selectedCafeId}
                      onChange={(e) => {
                        setSelectedCafeId(e.target.value);
                        const c = ownedCafes.find((item) => item.id === e.target.value);
                        if (c?.city) setExpansionCity(c.city);
                      }}
                      className="w-full p-2.5 rounded-lg border border-[#E2DCD2] bg-[#F9F7F3] text-xs text-[#181514] font-medium focus:outline-none focus:border-[#181514]"
                    >
                      {ownedCafes.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name} — {c.address ? c.address.split(',')[0] : c.city} ({c.city})
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#181514] mb-1">
                  Campaign Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bon Amigos: Vaishali Courtyard Kitchen & Pizzeria"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-[#E2DCD2] bg-[#F9F7F3] text-xs text-[#181514] focus:outline-none focus:border-[#181514]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#181514] mb-1">
                    Expansion City
                  </label>
                  <select
                    value={expansionCity}
                    onChange={(e) => setExpansionCity(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-[#E2DCD2] bg-[#F9F7F3] text-xs text-[#181514]"
                  >
                    <option value="Ghaziabad">Ghaziabad</option>
                    <option value="Delhi-NCR">Delhi-NCR</option>
                    <option value="Noida">Noida</option>
                    <option value="Bengaluru">Bengaluru</option>
                    <option value="Mumbai">Mumbai</option>
                    <option value="Pune">Pune</option>
                    <option value="Hyderabad">Hyderabad</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#181514] mb-1">
                    Locality / Neighbourhood
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Vaishali, Indirapuram, Raj Nagar RDC"
                    value={expansionArea}
                    onChange={(e) => setExpansionArea(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-[#E2DCD2] bg-[#F9F7F3] text-xs text-[#181514]"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="button"
                  disabled={ownedCafes.length === 0 || !title.trim()}
                  onClick={() => setStep(2)}
                  className="px-5 py-2 rounded-lg text-xs font-semibold bg-[#181514] text-white hover:bg-[#262220] transition-colors flex items-center gap-2 disabled:opacity-40"
                >
                  Next: Financial Goals &rarr;
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Financial Goal */}
          {step === 2 && (
            <div className="space-y-4">
              <h3 className="font-serif font-bold text-lg text-[#181514]">
                Step 2: Funding Target & Minimum Tickets
              </h3>

              <div>
                <label className="block text-xs font-semibold text-[#181514] mb-1">
                  Funding Target (₹)
                </label>
                <input
                  type="number"
                  step={50000}
                  required
                  value={targetAmount}
                  onChange={(e) => setTargetAmount(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-[#E2DCD2] bg-[#F9F7F3] text-xs text-[#181514] font-mono"
                />
                <span className="text-[11px] font-mono text-[#7B746F]">
                  ₹{(parseInt(targetAmount || '0') / 100000).toFixed(2)} Lakhs
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#181514] mb-1">
                    Minimum Ticket (₹)
                  </label>
                  <input
                    type="number"
                    value={minInvestment}
                    onChange={(e) => setMinInvestment(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-[#E2DCD2] bg-[#F9F7F3] text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#181514] mb-1">
                    Campaign Duration (Days)
                  </label>
                  <input
                    type="number"
                    value={durationDays}
                    onChange={(e) => setDurationDays(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-[#E2DCD2] bg-[#F9F7F3] text-xs font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold bg-[#F3EFE7] text-[#181514]"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-5 py-2 rounded-lg text-xs font-semibold bg-[#181514] text-white hover:bg-[#262220]"
                >
                  Next: Term Structure &rarr;
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Return Structure */}
          {step === 3 && (
            <div className="space-y-4">
              <h3 className="font-serif font-bold text-lg text-[#181514]">
                Step 3: Investment Terms & Return Model
              </h3>

              <div>
                <label className="block text-xs font-semibold text-[#181514] mb-1">
                  Investment Structure
                </label>
                <select
                  value={investmentStructure}
                  onChange={(e) => setInvestmentStructure(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-[#E2DCD2] bg-[#F9F7F3] text-xs text-[#181514]"
                >
                  <option value="REVENUE_SHARE">Revenue Share (Quarterly % of gross branch sales)</option>
                  <option value="STORE_CREDIT_PERKS">Store Credit + Annual Yield Perks</option>
                  <option value="HYBRID_GROWTH">Hybrid Growth (Revenue share + Store bonus)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#181514] mb-1">
                  Proposed Return Terms (Included in Digital Term Sheet)
                </label>
                <textarea
                  rows={2}
                  value={returnTerms}
                  onChange={(e) => setReturnTerms(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-[#E2DCD2] bg-[#F9F7F3] text-xs text-[#181514]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#181514] mb-1">
                    Projected Yield Rate
                  </label>
                  <input
                    type="text"
                    value={projectedReturnRate}
                    onChange={(e) => setProjectedReturnRate(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-[#E2DCD2] bg-[#F9F7F3] text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#181514] mb-1">
                    Repayment Horizon
                  </label>
                  <input
                    type="text"
                    value={repaymentPeriod}
                    onChange={(e) => setRepaymentPeriod(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-[#E2DCD2] bg-[#F9F7F3] text-xs font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold bg-[#F3EFE7] text-[#181514]"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(4)}
                  className="px-5 py-2 rounded-lg text-xs font-semibold bg-[#181514] text-white hover:bg-[#262220]"
                >
                  Next: Story & Risks &rarr;
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Story & Risks */}
          {step === 4 && (
            <div className="space-y-4">
              <h3 className="font-serif font-bold text-lg text-[#181514]">
                Step 4: The Pitch & Disclosed Risks
              </h3>

              <div>
                <label className="block text-xs font-semibold text-[#181514] mb-1">
                  Campaign Pitch
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Explain your vision for this new branch..."
                  value={pitch}
                  onChange={(e) => setPitch(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-[#E2DCD2] bg-[#F9F7F3] text-xs text-[#181514]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#181514] mb-1">
                  Capital Allocation Summary
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="Break down where capital will go (interior masonry, roaster machinery, solar power)..."
                  value={reasonForFunding}
                  onChange={(e) => setReasonForFunding(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-[#E2DCD2] bg-[#F9F7F3] text-xs text-[#181514]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#181514] mb-1">
                  Disclosed Risk Factors
                </label>
                <textarea
                  rows={2}
                  value={riskFactors}
                  onChange={(e) => setRiskFactors(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-[#E2DCD2] bg-[#F9F7F3] text-xs text-[#181514]"
                />
              </div>

              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold bg-[#F3EFE7] text-[#181514]"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(5)}
                  className="px-5 py-2 rounded-lg text-xs font-semibold bg-[#181514] text-white hover:bg-[#262220]"
                >
                  Review Summary &rarr;
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: Review & Submit */}
          {step === 5 && (
            <div className="space-y-4">
              <h3 className="font-serif font-bold text-lg text-[#181514]">
                Step 5: Review Offering Summary
              </h3>

              <div className="p-4 rounded-xl bg-[#F9F7F3] border border-[#E8E2D6] space-y-1.5 text-xs font-mono">
                <div><strong>Associated Cafe:</strong> {ownedCafes.find(c => c.id === selectedCafeId)?.name || 'Verified Cafe Entity'}</div>
                <div><strong>Title:</strong> {title || 'Community Expansion Offering'}</div>
                <div><strong>Location:</strong> {expansionArea}, {expansionCity}</div>
                <div><strong>Target:</strong> ₹{(parseInt(targetAmount || '0') / 100000).toFixed(2)} Lakhs</div>
                <div><strong>Structure:</strong> {investmentStructure} ({projectedReturnRate})</div>
                <div><strong>Horizon:</strong> {repaymentPeriod}</div>
              </div>

              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setStep(4)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold bg-[#F3EFE7] text-[#181514]"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-lg text-xs font-semibold bg-[#181514] text-white hover:bg-[#262220] transition-colors"
                >
                  {submitting ? 'Publishing...' : 'Launch Offering (Sandbox)'}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
