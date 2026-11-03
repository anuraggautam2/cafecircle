'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { UserRole } from '@/lib/types';
import { ChevronDown, Check, Menu, X, Coffee } from 'lucide-react';
import SimulatedBadge from './SimulatedBadge';

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
    <header className="sticky top-0 z-50 glass-nav">
      <SimulatedBadge variant="banner" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          {/* Logo & Navigation */}
          <div className="flex items-center gap-8">
            <Link href="/" className="font-serif text-lg font-bold tracking-tight text-[#181514] flex items-center gap-1.5">
              <span>Cafe</span>
              <span className="text-[#B84A22]">Circle</span>
            </Link>

            <nav className="hidden md:flex items-center gap-6 text-[13px] text-stone-600">
              <Link
                href="/explore"
                className={`transition-colors hover:text-stone-900 ${
                  pathname.startsWith('/explore') ? 'text-[#181514] font-semibold' : ''
                }`}
              >
                Discover Cafes
              </Link>
              <Link
                href="/growth-engine"
                className={`transition-colors hover:text-stone-900 ${
                  pathname.startsWith('/growth-engine') ? 'text-[#181514] font-semibold' : ''
                }`}
              >
                Growth Engine
              </Link>
              <Link
                href="/how-it-works"
                className={`transition-colors hover:text-stone-900 ${
                  pathname.startsWith('/how-it-works') ? 'text-[#181514] font-semibold' : ''
                }`}
              >
                How It Works
              </Link>

              {role === 'INVESTOR' && (
                <Link
                  href="/dashboard/investor"
                  className={`transition-colors hover:text-stone-900 ${
                    pathname.startsWith('/dashboard/investor') ? 'text-[#B84A22] font-semibold' : ''
                  }`}
                >
                  Portfolio
                </Link>
              )}
              {role === 'CAFE_OWNER' && (
                <Link
                  href="/dashboard/owner"
                  className={`transition-colors hover:text-stone-900 ${
                    pathname.startsWith('/dashboard/owner') ? 'text-[#B84A22] font-semibold' : ''
                  }`}
                >
                  Dashboard
                </Link>
              )}
              {role === 'ADMIN' && (
                <Link
                  href="/admin"
                  className={`transition-colors hover:text-stone-900 ${
                    pathname.startsWith('/admin') ? 'text-[#B84A22] font-semibold' : ''
                  }`}
                >
                  Compliance
                </Link>
              )}
            </nav>
          </div>

          {/* Right Controls: Persona Switcher */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <button
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs text-[#181514] bg-white/80 border border-stone-200/80 hover:bg-white transition-all shadow-sm"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-stone-500 font-mono text-[11px]">{role.replace('_', ' ')}:</span>
                <span className="font-semibold">{user?.name?.split(' ')[0]}</span>
                <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
              </button>

              {roleDropdownOpen && (
                <div className="absolute right-0 mt-1.5 w-56 rounded-2xl glass-panel p-1.5 z-50 shadow-xl border border-white/90">
                  <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider text-stone-400">
                    Switch Test Persona
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
                            ? 'bg-stone-900 text-white font-medium shadow-sm'
                            : 'text-stone-700 hover:bg-white/80'
                        }`}
                      >
                        <div>
                          <div className={isCurrent ? 'text-white' : 'text-stone-900'}>{r.name}</div>
                          <div className={`text-[10px] font-mono ${isCurrent ? 'text-stone-300' : 'text-stone-400'}`}>
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

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 md:hidden text-stone-600 hover:text-stone-900 rounded-lg hover:bg-white/60 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-stone-200/50 glass-panel mx-3 my-2 p-3 space-y-1 text-xs">
          <Link href="/explore" className="block py-2 px-3 rounded-lg hover:bg-white/70 text-stone-900 font-medium">
            Discover Cafes
          </Link>
          <Link href="/growth-engine" className="block py-2 px-3 rounded-lg hover:bg-white/70 text-stone-900 font-medium">
            Growth Engine
          </Link>
          <Link href="/how-it-works" className="block py-2 px-3 rounded-lg hover:bg-white/70 text-stone-900 font-medium">
            How It Works
          </Link>
          <Link href="/dashboard/investor" className="block py-2 px-3 rounded-lg hover:bg-white/70 text-stone-900 font-medium">
            Investor Portfolio
          </Link>
          <Link href="/dashboard/owner" className="block py-2 px-3 rounded-lg hover:bg-white/70 text-stone-900 font-medium">
            Cafe Owner Dashboard
          </Link>
        </div>
      )}
    </header>
  );
}
