'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth, DEMO_USERS } from '@/lib/auth-context';
import { TrendingUp, Store, Users, Shield, ArrowRight, Coffee, Lock } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login, switchRole } = useAuth();
  const [email, setEmail] = useState('priya@investor.com');
  const [password, setPassword] = useState('password123');

  const handleDemoSelect = (roleKey: any) => {
    switchRole(roleKey);
    const demo = DEMO_USERS[roleKey];
    if (demo) {
      setEmail(demo.email);
      setPassword('password123');
    }
    if (roleKey === 'CAFE_OWNER') router.push('/dashboard/owner');
    else if (roleKey === 'ADMIN') router.push('/admin');
    else router.push('/dashboard/investor');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email);
    router.push('/dashboard/investor');
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-[#211A17] flex items-center justify-center text-white mx-auto shadow-md">
          <Coffee className="w-6 h-6 text-[#D8C6AE]" />
        </div>
        <h1 className="font-serif text-3xl font-bold text-[#211A17]">
          Sign in to CafeCircle
        </h1>
        <p className="text-xs text-[#49352B]/80 max-w-xs mx-auto">
          Choose an instant role persona for rapid testing, or sign in with your credentials.
        </p>
      </div>

      {/* ONE-CLICK TEST PERSONAS (Glassmorphic) */}
      <div className="glass-panel p-5 space-y-3 border border-white/70 shadow-sm">
        <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-[#49352B]/80 font-semibold">
          <span>Instant Demo Personas</span>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <button
            type="button"
            onClick={() => handleDemoSelect('INVESTOR')}
            className="p-3 rounded-xl bg-white/60 hover:bg-white border border-white/80 hover:border-white text-left transition-all shadow-xs group"
          >
            <div className="font-semibold text-[#211A17] flex items-center gap-1.5 group-hover:text-[#49352B]">
              <TrendingUp className="w-3.5 h-3.5 text-[#B84A22]" /> Priya Patel
            </div>
            <div className="text-[10px] text-[#49352B]/70 mt-0.5 font-mono">Community Investor</div>
          </button>

          <button
            type="button"
            onClick={() => handleDemoSelect('CAFE_OWNER')}
            className="p-3 rounded-xl bg-white/60 hover:bg-white border border-white/80 hover:border-white text-left transition-all shadow-xs group"
          >
            <div className="font-semibold text-[#211A17] flex items-center gap-1.5 group-hover:text-[#49352B]">
              <Store className="w-3.5 h-3.5 text-[#B84A22]" /> Aarav Sharma
            </div>
            <div className="text-[10px] text-[#49352B]/70 mt-0.5 font-mono">Cafe Founder</div>
          </button>

          <button
            type="button"
            onClick={() => handleDemoSelect('CUSTOMER')}
            className="p-3 rounded-xl bg-white/60 hover:bg-white border border-white/80 hover:border-white text-left transition-all shadow-xs group"
          >
            <div className="font-semibold text-[#211A17] flex items-center gap-1.5 group-hover:text-[#49352B]">
              <Users className="w-3.5 h-3.5 text-[#B84A22]" /> Rohan Sen
            </div>
            <div className="text-[10px] text-[#49352B]/70 mt-0.5 font-mono">Loyal Patron</div>
          </button>

          <button
            type="button"
            onClick={() => handleDemoSelect('ADMIN')}
            className="p-3 rounded-xl bg-white/60 hover:bg-white border border-white/80 hover:border-white text-left transition-all shadow-xs group"
          >
            <div className="font-semibold text-[#211A17] flex items-center gap-1.5 group-hover:text-[#49352B]">
              <Shield className="w-3.5 h-3.5 text-[#B84A22]" /> Vikram Mehta
            </div>
            <div className="text-[10px] text-[#49352B]/70 mt-0.5 font-mono">Compliance Desk</div>
          </button>
        </div>
      </div>

      {/* Standard Form */}
      <div className="glass-panel p-6 space-y-4 border border-white/70 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-[#211A17] mb-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-white/70 bg-white/70 text-[#211A17] placeholder:text-[#49352B]/40 focus:outline-none focus:ring-2 focus:ring-[#211A17]/10"
            />
          </div>

          <div>
            <label className="block font-semibold text-[#211A17] mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-white/70 bg-white/70 text-[#211A17] placeholder:text-[#49352B]/40 focus:outline-none focus:ring-2 focus:ring-[#211A17]/10"
            />
          </div>

          <button
            type="submit"
            className="btn-primary w-full py-3 text-xs shadow-sm"
          >
            <span>Sign In to Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-xs text-[#49352B]/80 pt-3 border-t border-stone-200/50">
          Don't have an account?{' '}
          <Link href="/auth/register" className="font-semibold text-[#211A17] hover:underline">
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
}
