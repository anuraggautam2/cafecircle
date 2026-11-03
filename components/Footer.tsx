import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-stone-300/40 bg-white/40 backdrop-blur-xl text-[#49352B] py-14 text-xs font-sans">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="flex flex-col sm:flex-row items-baseline justify-between gap-6">
          <div className="space-y-1.5">
            <Link href="/" className="font-serif text-lg font-bold text-[#211A17]">
              Cafe<span className="text-[#49352B]">Circle</span>
            </Link>
            <p className="text-[12px] text-[#49352B]/75 max-w-sm leading-relaxed">
              Community-powered cafe funding & exploration platform. Connecting patrons with artisanal coffee roasters in Delhi NCR & Ghaziabad.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs text-[#49352B] font-medium">
            <Link href="/explore" className="hover:text-[#211A17] transition-colors">
              Discover
            </Link>
            <Link href="/how-it-works" className="hover:text-[#211A17] transition-colors">
              How It Works
            </Link>
            <Link href="/#for-cafe-owners" className="hover:text-[#211A17] transition-colors">
              For Cafe Owners
            </Link>
            <Link href="/growth-engine" className="hover:text-[#211A17] transition-colors">
              Growth Engine
            </Link>
            <Link href="/legal/risk-disclosure" className="hover:text-[#211A17] transition-colors">
              Risk Disclosure
            </Link>
            <Link href="/legal/terms" className="hover:text-[#211A17] transition-colors">
              Terms
            </Link>
          </div>
        </div>

        <div className="border-t border-stone-300/30 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#49352B]/60 font-mono">
          <p>&copy; {new Date().getFullYear()} CafeCircle Technologies Inc. All rights reserved.</p>
          <p>Educational Simulation Prototype • No real banking transactions</p>
        </div>
      </div>
    </footer>
  );
}
