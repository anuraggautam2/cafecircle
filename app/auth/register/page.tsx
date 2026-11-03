'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Coffee, ShieldCheck, ArrowRight, Store, TrendingUp, Users } from 'lucide-react';
import { UserRole } from '@/lib/types';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [role, setRole] = useState<UserRole>('INVESTOR');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('Bengaluru');

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
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-[#34190D] flex items-center justify-center text-white mx-auto shadow-md">
          <Coffee className="w-6 h-6 text-[#E07A5F]" />
        </div>
        <h1 className="font-serif text-3xl font-extrabold text-[#220F07]">
          Join CafeCircle
        </h1>
        <p className="text-xs text-[#7B4226]">
          Create your account and choose your community role.
        </p>
      </div>

      <div className="warm-card rounded-3xl p-6 sm:p-8 space-y-5">
        {/* Role Selector Tabs */}
        <div>
          <label className="block text-xs font-bold uppercase text-[#7B4226] mb-2">
            I am joining as:
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setRole('INVESTOR')}
              className={`p-2.5 rounded-xl border text-center text-xs font-bold transition-all ${
                role === 'INVESTOR'
                  ? 'bg-[#C85A32] text-white border-[#C85A32] shadow-sm'
                  : 'bg-[#FAF7F2] text-[#482414] border-[#EAE0D0]'
              }`}
            >
              Investor
            </button>
            <button
              type="button"
              onClick={() => setRole('CAFE_OWNER')}
              className={`p-2.5 rounded-xl border text-center text-xs font-bold transition-all ${
                role === 'CAFE_OWNER'
                  ? 'bg-[#C85A32] text-white border-[#C85A32] shadow-sm'
                  : 'bg-[#FAF7F2] text-[#482414] border-[#EAE0D0]'
              }`}
            >
              Cafe Owner
            </button>
            <button
              type="button"
              onClick={() => setRole('CUSTOMER')}
              className={`p-2.5 rounded-xl border text-center text-xs font-bold transition-all ${
                role === 'CUSTOMER'
                  ? 'bg-[#C85A32] text-white border-[#C85A32] shadow-sm'
                  : 'bg-[#FAF7F2] text-[#482414] border-[#EAE0D0]'
              }`}
            >
              Customer
            </button>
          </div>
        </div>

        <form onSubmit={handleRegister} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-[#7B4226] mb-1">Full Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Siddharth Rao"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 rounded-xl border border-[#DCCBBA] bg-[#FAF7F2] text-[#220F07]"
            />
          </div>

          <div>
            <label className="block font-bold text-[#7B4226] mb-1">Email Address</label>
            <input
              type="email"
              required
              placeholder="siddharth@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded-xl border border-[#DCCBBA] bg-[#FAF7F2] text-[#220F07]"
            />
          </div>

          <div>
            <label className="block font-bold text-[#7B4226] mb-1">City</label>
            <input
              type="text"
              placeholder="Bengaluru"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full p-3 rounded-xl border border-[#DCCBBA] bg-[#FAF7F2] text-[#220F07]"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl font-bold bg-[#C85A32] text-white hover:bg-[#A94320] transition-colors shadow-warm-lg"
          >
            Create Account &rarr;
          </button>
        </form>

        <div className="text-center text-xs text-[#7B4226] pt-2 border-t border-[#F4ECE0]">
          Already have an account?{' '}
          <Link href="/auth/login" className="font-bold text-[#C85A32] hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
