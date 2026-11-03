'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { UserRole } from '@/lib/types';
import { ChevronDown, Check, Menu, X, ArrowRight } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const { user, role, switchRole } = useAuth();
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setRoleDropdownOpen(false);
    setMobileMenuOpen(false);
  }, [pathname]);

  const roles: { key: UserRole; name: string; roleLabel: string }[] = [
    { key: 'INVESTOR', name: 'Priya Patel', roleLabel: 'Customer Investor' },
    { key: 'CAFE_OWNER', name: 'Aarav Sharma', roleLabel: 'Cafe Owner' },
    { key: 'CUSTOMER', name: 'Rohan Sen', roleLabel: 'Regular Customer' },
    { key: 'ADMIN', name: 'Vikram Mehta', roleLabel: 'Compliance Admin' },
  ];

  return (
    <header className="sticky top-3.5 z-50 px-3 sm:px-6 max-w-6xl mx-auto w-full transition-all duration-300">
      {/* Floating Transparent Glass Capsule */}
      <div className="glass-nav rounded-2xl px-4 sm:px-6 shadow-sm border border-white/60">
        <div className="flex items-center justify-between h-14">
          {/* Brand: CafeCircle */}
          <Link
            href="/"
            className="font-serif text-xl font-bold tracking-tight text-[#211A17] flex items-center gap-1 group"
          >
            <span>Cafe</span>
            <span className="text-[#49352B] group-hover:text-[#B84A22] transition-colors">Circle</span>
          </Link>

          {/* Navigation Links: Discover, How It Works, For Cafe Owners, About */}
          <nav className="hidden md:flex items-center gap-7 text-[13px] text-[#49352B] font-medium">
            <Link
              href="/explore"
              className={`transition-colors hover:text-[#211A17] ${
                pathname === '/explore' ? 'text-[#211A17] font-semibold' : ''
              }`}
            >
              Discover
            </Link>
            <Link
              href="/how-it-works"
              className={`transition-colors hover:text-[#211A17] ${
                pathname === '/how-it-works' ? 'text-[#211A17] font-semibold' : ''
              }`}
            >
              How It Works
            </Link>
            <Link
              href="/#for-cafe-owners"
              className="transition-colors hover:text-[#211A17]"
            >
              For Cafe Owners
            </Link>
            <Link
              href="/#about"
              className="transition-colors hover:text-[#211A17]"
            >
              About
            </Link>

            {/* Contextual dashboard shortcut if logged in */}
            {role === 'INVESTOR' && (
              <Link
                href="/dashboard/investor"
                className="text-[#49352B] hover:text-[#211A17] text-xs font-semibold px-2 py-0.5 rounded-md bg-stone-200/50"
              >
                Portfolio
              </Link>
            )}
            {role === 'CAFE_OWNER' && (
              <Link
                href="/dashboard/owner"
                className="text-[#49352B] hover:text-[#211A17] text-xs font-semibold px-2 py-0.5 rounded-md bg-stone-200/50"
              >
                Dashboard
              </Link>
            )}
          </nav>

          {/* Right side: Log In & Get Started + Test Persona Switcher */}
          <div className="flex items-center gap-2.5">
            {/* Quick Test Persona Switcher (Discreet) */}
            <div className="relative">
              <button
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                title="Switch Demo Persona"
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[11px] text-[#211A17] bg-white/50 border border-white/70 hover:bg-white/80 transition-all"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span className="font-mono text-stone-500 hidden sm:inline">{user?.name?.split(' ')[0]}</span>
                <ChevronDown className="w-3 h-3 text-stone-500" />
              </button>

              {roleDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl glass-panel p-1.5 z-50 shadow-xl border border-white/80">
                  <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider text-stone-400">
                    Switch Persona (Demo)
                  </div>
                  {roles.map((r) => {
                    const isCurrent = role === r.key;
                    return (
                      <button
                        key={r.key}
                        onClick={() => {
                          switchRole(r.key);
                          setRoleDropdownOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-left transition-all ${
                          isCurrent
                            ? 'bg-[#211A17] text-white font-medium shadow-sm'
                            : 'text-stone-700 hover:bg-white/60'
                        }`}
                      >
                        <div>
                          <div className={isCurrent ? 'text-white' : 'text-stone-900'}>{r.name}</div>
                          <div className={`text-[10px] font-mono ${isCurrent ? 'text-amber-200/80' : 'text-stone-400'}`}>
                            {r.roleLabel}
                          </div>
                        </div>
                        {isCurrent && <Check className="w-3.5 h-3.5 text-white" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Log In */}
            <Link
              href="/auth/login"
              className="text-[13px] font-medium text-[#49352B] hover:text-[#211A17] px-2.5 py-1.5 rounded-xl transition-colors hidden sm:inline-block"
            >
              Log In
            </Link>

            {/* Get Started Button */}
            <Link
              href="/explore"
              className="btn-primary text-xs py-2 px-4 shadow-sm"
            >
              <span>Get Started</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 md:hidden text-stone-700 hover:text-stone-900 rounded-lg bg-white/40 border border-white/60 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-2 glass-panel p-4 rounded-2xl shadow-lg border border-white/80 space-y-2 text-xs">
          <Link href="/explore" className="block py-2 px-3 rounded-xl hover:bg-white/60 text-[#211A17] font-medium">
            Discover
          </Link>
          <Link href="/how-it-works" className="block py-2 px-3 rounded-xl hover:bg-white/60 text-[#211A17] font-medium">
            How It Works
          </Link>
          <Link href="/#for-cafe-owners" className="block py-2 px-3 rounded-xl hover:bg-white/60 text-[#211A17] font-medium">
            For Cafe Owners
          </Link>
          <Link href="/#about" className="block py-2 px-3 rounded-xl hover:bg-white/60 text-[#211A17] font-medium">
            About
          </Link>
          <div className="pt-2 border-t border-stone-200/50 flex items-center justify-between">
            <Link href="/auth/login" className="py-2 px-3 text-[#49352B] font-medium">
              Log In
            </Link>
            <Link href="/explore" className="btn-primary text-xs py-2 px-4">
              Get Started
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
