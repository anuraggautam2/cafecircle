import React from 'react';
import Link from 'next/link';
import { FileText, ArrowRight } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/60 text-[#49352B] border border-white/80">
          <FileText className="w-4 h-4 text-[#B84A22]" />
          Terms & Platform Policies
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#211A17]">
          Terms of Service & Privacy Policy
        </h1>
        <p className="text-xs sm:text-sm text-[#49352B]/80 font-sans">
          CafeCircle Platform Architecture & Usage Guidelines
        </p>
      </div>

      <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6 text-xs sm:text-sm text-[#49352B] leading-relaxed border border-white/70 shadow-sm">
        <section className="space-y-2">
          <h2 className="font-serif font-bold text-lg text-[#211A17]">1. Platform Acceptance</h2>
          <p>
            By accessing or using the CafeCircle platform, users acknowledge that they are exploring a functional technology prototype designed to foster community co-growth for specialty cafes.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif font-bold text-lg text-[#211A17]">2. User Roles & Accounts</h2>
          <p>
            Users may register as Customer Investors, Cafe Owners, or Regular Customers. All account information must be accurate. Cafe owners represent and warrant that all uploaded business licenses, balance sheets, and lease deeds are authentic.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif font-bold text-lg text-[#211A17]">3. Community Growth Engine & Referrals</h2>
          <p>
            The referral system tracks customer advocacy, footfall visits, and community points. Referral rewards are structured as cafe store credit, loyalty points, and patron community recognition. Referrals are strictly independent of legal investment yields.
          </p>
        </section>

        <section className="space-y-2" id="privacy">
          <h2 className="font-serif font-bold text-lg text-[#211A17]">4. Privacy & Data Handling</h2>
          <p>
            CafeCircle respects user privacy. Contact details are never sold to third-party advertisers. Cafe owners only receive anonymized patron analytics unless a backer explicitly opts into direct owner communications.
          </p>
        </section>
      </div>

      <div className="pt-4 flex justify-between items-center text-xs">
        <Link href="/" className="font-semibold text-[#49352B] hover:text-[#211A17]">
          &larr; Return to Home
        </Link>
        <Link href="/legal/risk-disclosure" className="btn-secondary text-xs py-2 px-4">
          <span>Review Risk Disclosures</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
