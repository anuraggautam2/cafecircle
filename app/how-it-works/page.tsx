'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, ArrowRight } from 'lucide-react';
import SimulatedBadge from '@/components/SimulatedBadge';

export default function HowItWorksPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How does the Community Revenue-Share structure work in practice?',
      a: 'A verified cafe sets an expansion funding target. Customers contribute simulated capital starting from ₹5,000. In exchange, the cafe shares a fixed percentage (typically 4.5% to 6%) of gross monthly branch revenue paid quarterly until a capped return is met (e.g. 1.30x to 1.35x principal). Repayments flexibly scale with actual seasonal turnover.',
    },
    {
      q: 'How is CafeCircle different from traditional bank debt or venture capital?',
      a: 'Banks require heavy collateral, fixed interest payments, and offer zero marketing value. Venture capitalists often demand equity and aggressive exit timelines. CafeCircle enables cafes to raise capital from regular guests who become brand champions.',
    },
    {
      q: 'Is real money collected on this platform?',
      a: 'No. CafeCircle is operating in an educational and regulatory sandbox demonstration mode. All transactions, agreements, and returns are simulated to demonstrate the co-growth model prior to regulatory licensing.',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-12">
      {/* Header */}
      <div className="border-b border-[#EAE6DE] pb-6 space-y-2">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#181514]">
          How CafeCircle Works
        </h1>
        <p className="text-xs sm:text-sm text-[#6E685F]">
          A community-first alternative to bank debt and dilutive equity for independent cafes.
        </p>
      </div>

      {/* 3 Step Process */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-xs">
        <div className="space-y-2">
          <div className="font-mono text-xs font-bold text-[#B84A22]">01</div>
          <h2 className="font-serif font-bold text-base text-[#181514]">
            Discover Opportunities
          </h2>
          <p className="text-[#6E685F] leading-relaxed">
            Browse verified roasteries planning new branches in your city. Review unit economics and expansion plans.
          </p>
        </div>

        <div className="space-y-2">
          <div className="font-mono text-xs font-bold text-[#B84A22]">02</div>
          <h2 className="font-serif font-bold text-base text-[#181514]">
            Contribute Under Defined Terms
          </h2>
          <p className="text-[#6E685F] leading-relaxed">
            Back campaigns starting from ₹5,000 under clearly structured quarterly revenue-share arrangements.
          </p>
        </div>

        <div className="space-y-2">
          <div className="font-mono text-xs font-bold text-[#B84A22]">03</div>
          <h2 className="font-serif font-bold text-base text-[#181514]">
            Share in Growth
          </h2>
          <p className="text-[#6E685F] leading-relaxed">
            Introduce friends, support footfall, and receive quarterly distributions as the cafe grows.
          </p>
        </div>
      </div>

      {/* Frequently Asked Questions */}
      <div className="space-y-4 pt-4 border-t border-[#EAE6DE]">
        <h2 className="font-serif text-xl font-bold text-[#181514]">
          Frequently Asked Questions
        </h2>

        <div className="divide-y divide-[#EAE6DE] border border-[#EAE6DE] rounded-xl bg-white overflow-hidden text-xs">
          {faqs.map((faq, idx) => (
            <div key={idx} className="p-4 space-y-2">
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full text-left font-semibold text-sm text-[#181514] flex items-center justify-between gap-4"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-[#8C857B] shrink-0 transition-transform ${
                    openFaq === idx ? 'rotate-180 text-[#B84A22]' : ''
                  }`}
                />
              </button>
              {openFaq === idx && (
                <p className="text-[#6E685F] leading-relaxed pt-1">
                  {faq.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
