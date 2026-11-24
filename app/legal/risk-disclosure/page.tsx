import React from 'react';
import Link from 'next/link';
import { ShieldAlert, AlertTriangle, Scale, CheckCircle2, ArrowRight } from 'lucide-react';

export default function RiskDisclosurePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-900 border border-amber-300/40">
          <ShieldAlert className="w-4 h-4 text-amber-700" />
          Regulatory Sandbox & Risk Disclosures
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#211A17]">
          Risk Disclosure & Regulatory Notice
        </h1>
        <p className="text-xs sm:text-sm text-[#49352B]/80 font-sans">
          Last revised: November 2026 • Platform Version 1.0 (MVP Simulated Sandbox)
        </p>
      </div>

      {/* Main Notice Box */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-amber-300/60 bg-amber-50/50 text-xs sm:text-sm text-[#211A17] space-y-3 leading-relaxed shadow-sm">
        <h3 className="font-serif font-bold text-base text-amber-950 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0" />
          Simulated Demonstration Architecture
        </h3>
        <p className="text-[#49352B]/90">
          CafeCircle is currently operating in an educational prototype demonstration mode. No real investment funds, bank debits, or guaranteed securities offerings are conducted on this website. All financial figures, certificates, transactions, and term sheets are simulated for user experience testing and regulatory architecture modeling.
        </p>
      </div>

      {/* Legal Pillars */}
      <div className="space-y-6 text-xs sm:text-sm text-[#49352B] leading-relaxed">
        <section className="glass-card rounded-3xl p-6 sm:p-8 space-y-3 border border-white/70">
          <h2 className="font-serif font-bold text-lg text-[#211A17] flex items-center gap-2">
            <Scale className="w-5 h-5 text-[#B84A22] shrink-0" />
            1. Legal & Regulatory Framework
          </h2>
          <p>
            Under prevailing securities regulations (including the Securities and Exchange Board of India / SEBI regulations and the Companies Act 2013), public crowdfunding of equity or profit-sharing from retail customers requires specific exemptions, regulatory sandboxes, or private placement structures (Rule 14 of Companies Prospectus and Allotment of Securities Rules).
          </p>
          <p>
            CafeCircle is designed from the ground up to accommodate compliant financial instruments—including verified private placement SPVs, non-convertible debentures, store credit debt instruments, and regulatory sandbox structures—upon completing formal legal and licensing approvals.
          </p>
        </section>

        <section className="glass-card rounded-3xl p-6 sm:p-8 space-y-3 border border-white/70">
          <h2 className="font-serif font-bold text-lg text-[#211A17] flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-[#B84A22] shrink-0" />
            2. Business Operational Risks
          </h2>
          <p>
            Food and beverage businesses inherently face operational uncertainties, including:
          </p>
          <ul className="list-disc list-inside space-y-1.5 pl-2">
            <li><strong>Lease & Real Estate Risks:</strong> Fluctuations in commercial rental rates, municipal zoning clearances, and lease contract terminations.</li>
            <li><strong>Supply Chain Volatility:</strong> Green coffee commodity price swings, climate impacts on single-estate harvests, and equipment import tariffs.</li>
            <li><strong>Regulatory & Licensing Clearances:</strong> Municipal health licenses, fire NOCs, and FSSAI audits.</li>
            <li><strong>Competition & Footfall Dynamics:</strong> Neighbourhood competition and consumer preference shifts.</li>
          </ul>
        </section>

        <section className="glass-card rounded-3xl p-6 sm:p-8 space-y-3 border border-white/70">
          <h2 className="font-serif font-bold text-lg text-[#211A17] flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
            3. Transparency & Verification Commitment
          </h2>
          <p>
            CafeCircle strictly enforces that:
          </p>
          <ul className="list-disc list-inside space-y-1.5 pl-2">
            <li>No fabricated verification badges or fake audit numbers are displayed.</li>
            <li>All cafe operators undergo identity, PAN, GST, and lease verification.</li>
            <li>Simulated contracts explicitly state their demonstration status.</li>
            <li>Community referral points are strictly disassociated from guaranteed financial returns.</li>
          </ul>
        </section>
      </div>

      <div className="pt-4 flex justify-between items-center text-xs">
        <Link href="/" className="font-semibold text-[#49352B] hover:text-[#211A17]">
          &larr; Return to Home
        </Link>
        <Link href="/legal/terms" className="btn-secondary text-xs py-2 px-4">
          <span>View Terms of Service</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
