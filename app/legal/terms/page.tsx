import React from 'react';
import Link from 'next/link';
import { FileText, ShieldCheck, ArrowRight } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#FAF6EE] text-[#C85A32] border border-[#F4C8B6]">
          <FileText className="w-4 h-4" />
          Terms & Platform Policies
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#220F07]">
          Terms of Service & Privacy Policy
        </h1>
        <p className="text-xs sm:text-sm text-[#7B4226]">
          CafeCircle Platform Architecture & Usage Guidelines
        </p>
      </div>

      <div className="warm-card rounded-3xl p-6 sm:p-8 space-y-6 text-xs sm:text-sm text-[#482414] leading-relaxed">
        <section className="space-y-2">
          <h2 className="font-serif font-bold text-lg text-[#220F07]">1. Platform Acceptance</h2>
          <p>
            By accessing or using the CafeCircle platform, users acknowledge that they are exploring a functional technology prototype designed to foster community co-growth for specialty cafes.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif font-bold text-lg text-[#220F07]">2. User Roles & Accounts</h2>
          <p>
            Users may register as Customer Investors, Cafe Owners, or Regular Customers. All account information must be accurate. Cafe owners represent and warrant that all uploaded business licenses, balance sheets, and lease deeds are authentic.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif font-bold text-lg text-[#220F07]">3. Community Growth Engine & Referrals</h2>
          <p>
            The referral system tracks customer advocacy, footfall visits, and community points. Referral rewards are structured as cafe store credit, loyalty points, and patron community recognition. Referrals are strictly independent of legal investment yields.
          </p>
        </section>

        <section className="space-y-2" id="privacy">
          <h2 className="font-serif font-bold text-lg text-[#220F07]">4. Privacy & Data Handling</h2>
          <p>
            CafeCircle respects user privacy. Contact details are never sold to third-party advertisers. Cafe owners only receive anonymized patron analytics unless a backer explicitly opts into direct owner communications.
          </p>
        </section>
      </div>

      <div className="pt-4 flex justify-between items-center text-xs">
        <Link href="/" className="font-semibold text-[#7B4226] hover:text-[#220F07]">
          &larr; Return to Home
        </Link>
        <Link href="/legal/risk-disclosure" className="font-bold text-[#C85A32] flex items-center gap-1">
          Review Risk Disclosures <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
