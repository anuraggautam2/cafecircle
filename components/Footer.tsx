import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-white/60 bg-white/30 backdrop-blur-xl text-stone-600 py-12 text-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="flex flex-col sm:flex-row items-baseline justify-between gap-6">
          <div className="space-y-1">
            <Link href="/" className="font-serif text-base font-bold text-[#181514]">
              Cafe<span className="text-[#B84A22]">Circle</span>
            </Link>
            <p className="text-[11px] text-stone-500">
              Community-powered cafe funding & discovery platform • Ghaziabad & Delhi NCR.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs text-stone-600">
            <Link href="/explore" className="hover:text-stone-900 transition-colors">
              Discover Cafes
            </Link>
            <Link href="/growth-engine" className="hover:text-stone-900 transition-colors">
              Growth Engine
            </Link>
            <Link href="/how-it-works" className="hover:text-stone-900 transition-colors">
              How It Works
            </Link>
            <Link href="/legal/risk-disclosure" className="hover:text-stone-900 transition-colors">
              Risk Disclosures
            </Link>
            <Link href="/legal/terms" className="hover:text-stone-900 transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>

        <div className="border-t border-stone-200/30 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-stone-400 font-mono">
          <p>&copy; {new Date().getFullYear()} CafeCircle Technologies. Verified Community Seed Directory.</p>
          <p>Educational Simulation Prototype • No real banking debits</p>
        </div>
      </div>
    </footer>
  );
}
