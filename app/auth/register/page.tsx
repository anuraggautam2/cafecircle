'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Coffee, ArrowRight, Store, TrendingUp, Users } from 'lucide-react';
import { UserRole } from '@/lib/types';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [role, setRole] = useState<UserRole>('INVESTOR');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('Ghaziabad');

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    register({
      name: name || 'Coffee Patron',
      email: email || 'patron@example.com',
      role,
      city,
    });
    if (role === 'CAFE_OWNER') router.push('/dashboard/owner');
    else router.push('/dashboard/investor');
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-[#211A17] flex items-center justify-center text-white mx-auto shadow-md">
          <Coffee className="w-6 h-6 text-[#D8C6AE]" />
        </div>
        <h1 className="font-serif text-3xl font-bold text-[#211A17]">
          Join CafeCircle
        </h1>
        <p className="text-xs text-[#49352B]/80 max-w-xs mx-auto">
          Create an account and choose your role in the cafe co-growth network.
        </p>
      </div>

      {/* Register Form */}
      <div className="glass-panel p-6 sm:p-8 space-y-5 border border-white/70 shadow-sm">
        {/* Role Selector Tabs */}
        <div>
          <label className="block text-[11px] font-mono uppercase tracking-wider text-[#49352B]/80 font-semibold mb-2">
            I am joining as:
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setRole('INVESTOR')}
              className={`p-2.5 rounded-xl border text-center text-xs font-semibold transition-all flex flex-col items-center gap-1 ${
                role === 'INVESTOR'
                  ? 'bg-[#211A17] text-white border-[#211A17] shadow-sm'
                  : 'bg-white/60 text-[#49352B] border-white/80 hover:bg-white'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Investor</span>
            </button>
            <button
              type="button"
              onClick={() => setRole('CAFE_OWNER')}
              className={`p-2.5 rounded-xl border text-center text-xs font-semibold transition-all flex flex-col items-center gap-1 ${
                role === 'CAFE_OWNER'
                  ? 'bg-[#211A17] text-white border-[#211A17] shadow-sm'
                  : 'bg-white/60 text-[#49352B] border-white/80 hover:bg-white'
              }`}
            >
              <Store className="w-3.5 h-3.5" />
              <span>Cafe Owner</span>
            </button>
            <button
              type="button"
              onClick={() => setRole('CUSTOMER')}
              className={`p-2.5 rounded-xl border text-center text-xs font-semibold transition-all flex flex-col items-center gap-1 ${
                role === 'CUSTOMER'
                  ? 'bg-[#211A17] text-white border-[#211A17] shadow-sm'
                  : 'bg-white/60 text-[#49352B] border-white/80 hover:bg-white'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Customer</span>
            </button>
          </div>
        </div>

        <form onSubmit={handleRegister} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-[#211A17] mb-1">Full Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Siddharth Rao"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-white/70 bg-white/70 text-[#211A17] placeholder:text-[#49352B]/40 focus:outline-none focus:ring-2 focus:ring-[#211A17]/10"
            />
          </div>

          <div>
            <label className="block font-semibold text-[#211A17] mb-1">Email Address</label>
            <input
              type="email"
              required
              placeholder="siddharth@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-white/70 bg-white/70 text-[#211A17] placeholder:text-[#49352B]/40 focus:outline-none focus:ring-2 focus:ring-[#211A17]/10"
            />
          </div>

          <div>
            <label className="block font-semibold text-[#211A17] mb-1">City / Region</label>
            <input
              type="text"
              placeholder="Ghaziabad / Delhi NCR"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-white/70 bg-white/70 text-[#211A17] placeholder:text-[#49352B]/40 focus:outline-none focus:ring-2 focus:ring-[#211A17]/10"
            />
          </div>

          <button
            type="submit"
            className="btn-primary w-full py-3 text-xs shadow-sm"
          >
            <span>Create Account & Continue</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-xs text-[#49352B]/80 pt-3 border-t border-stone-200/50">
          Already have an account?{' '}
          <Link href="/auth/login" className="font-semibold text-[#211A17] hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
