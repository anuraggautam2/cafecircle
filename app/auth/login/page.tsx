'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth, DEMO_USERS } from '@/lib/auth-context';
import { TrendingUp, Store, Users, Shield, ArrowRight } from 'lucide-react';
import SimulatedBadge from '@/components/SimulatedBadge';

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
      <div className="text-center space-y-2">
        <Link href="/" className="inline-block">
          <span className="font-serif text-2xl font-bold tracking-tight text-[#181514]">
            Cafe<span className="text-[#B84A22]">Circle</span>
          </span>
        </Link>
        <h1 className="font-serif text-2xl font-bold text-[#181514]">
          Sign in to your account
        </h1>
        <p className="text-xs text-[#7B746F]">
          Select an instant test account or enter your credentials.
        </p>
      </div>

      {/* ONE-CLICK TEST PERSONAS (Linear/Stripe style) */}
      <div className="stripe-card p-4 space-y-2.5 bg-[#FDFCFB]">
        <div className="text-[11px] font-mono uppercase tracking-wider text-[#7B746F] font-semibold text-center">
          Instant Test Personas
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <button
            onClick={() => handleDemoSelect('INVESTOR')}
            className="p-2.5 rounded-lg bg-white border border-[#E2DCD2] hover:border-[#181514] text-left transition-colors"
          >
            <div className="font-semibold text-[#181514] flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-[#B84A22]" /> Priya Patel
            </div>
            <div className="text-[10px] text-[#7B746F] mt-0.5 font-mono">Investor Persona</div>
          </button>

          <button
            onClick={() => handleDemoSelect('CAFE_OWNER')}
            className="p-2.5 rounded-lg bg-white border border-[#E2DCD2] hover:border-[#181514] text-left transition-colors"
          >
            <div className="font-semibold text-[#181514] flex items-center gap-1.5">
              <Store className="w-3.5 h-3.5 text-[#B84A22]" /> Aarav Sharma
            </div>
            <div className="text-[10px] text-[#7B746F] mt-0.5 font-mono">Cafe Operator</div>
          </button>

          <button
            onClick={() => handleDemoSelect('CUSTOMER')}
            className="p-2.5 rounded-lg bg-white border border-[#E2DCD2] hover:border-[#181514] text-left transition-colors"
          >
            <div className="font-semibold text-[#181514] flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-[#B84A22]" /> Rohan Sen
            </div>
            <div className="text-[10px] text-[#7B746F] mt-0.5 font-mono">Regular Patron</div>
          </button>

          <button
            onClick={() => handleDemoSelect('ADMIN')}
            className="p-2.5 rounded-lg bg-white border border-[#E2DCD2] hover:border-[#181514] text-left transition-colors"
          >
            <div className="font-semibold text-[#181514] flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-[#B84A22]" /> Vikram Mehta
            </div>
            <div className="text-[10px] text-[#7B746F] mt-0.5 font-mono">Compliance Admin</div>
          </button>
        </div>
      </div>

      {/* Standard Form */}
      <div className="stripe-card p-6 space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-[#181514] mb-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2.5 rounded-lg border border-[#E2DCD2] bg-[#F9F7F3] text-[#181514] focus:outline-none focus:border-[#181514]"
            />
          </div>

          <div>
            <label className="block font-semibold text-[#181514] mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2.5 rounded-lg border border-[#E2DCD2] bg-[#F9F7F3] text-[#181514] focus:outline-none focus:border-[#181514]"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-lg font-semibold bg-[#181514] text-white hover:bg-[#262220] transition-colors"
          >
            Sign In &rarr;
          </button>
        </form>

        <div className="text-center text-xs text-[#7B746F] pt-2 border-t border-[#F3EFE7]">
          Don't have an account?{' '}
          <Link href="/auth/register" className="font-semibold text-[#B84A22] hover:underline">
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
}
