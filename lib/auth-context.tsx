'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserRole, UserSession } from './types';

// Default Demo Users
export const DEMO_USERS: Record<UserRole, UserSession> = {
  INVESTOR: {
    id: 'usr_investor_priya',
    name: 'Priya Patel',
    email: 'priya@investor.com',
    role: 'INVESTOR',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
    referralCode: 'PRIYACOFFEE',
    bio: 'Fintech product lead & specialty coffee enthusiast. Backing neighbourhood third-wave cafes.',
    city: 'Bengaluru',
    investor: {
      id: 'inv_priya',
      kycStatus: 'VERIFIED',
      totalInvested: 75000,
      totalReturnsReceived: 6200,
      activeInvestmentsCount: 3,
      ambassadorTier: 'Espresso Patron',
    },
  },
  CAFE_OWNER: {
    id: 'usr_owner_aarav',
    name: 'Aarav Sharma',
    email: 'aarav@roasterycoffee.com',
    role: 'CAFE_OWNER',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    referralCode: 'AARAVROAST',
    bio: 'Q-grader, artisanal roaster, and founder of Roastery Coffee House.',
    city: 'Bengaluru',
    cafeOwner: {
      id: 'owner_aarav',
      businessName: 'Roastery Coffee House India Pvt Ltd',
      isVerified: true,
      verificationStatus: 'VERIFIED',
    },
  },
  CUSTOMER: {
    id: 'usr_customer_rohan',
    name: 'Rohan Sen',
    email: 'rohan@customer.com',
    role: 'CUSTOMER',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    referralCode: 'ROHANBREW',
    bio: 'Freelance UX designer and daily pour-over drinker. Community advocate.',
    city: 'Bengaluru',
  },
  ADMIN: {
    id: 'usr_admin_vikram',
    name: 'Vikram Mehta',
    email: 'admin@cafecircle.com',
    role: 'ADMIN',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    referralCode: 'ADMINCIRCLE',
    bio: 'Compliance Officer & Platform Operations Lead at CafeCircle.',
    city: 'Mumbai',
  },
};

interface AuthContextType {
  user: UserSession | null;
  role: UserRole;
  switchRole: (role: UserRole) => void;
  login: (email: string, role?: UserRole) => void;
  logout: () => void;
  register: (userData: Partial<UserSession>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserSession | null>(DEMO_USERS.INVESTOR);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem('cafecircle_user');
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch (e) {
        setUser(DEMO_USERS.INVESTOR);
      }
    }
  }, []);

  const switchRole = (newRole: UserRole) => {
    const selected = DEMO_USERS[newRole];
    setUser(selected);
    if (typeof window !== 'undefined') {
      localStorage.setItem('cafecircle_user', JSON.stringify(selected));
    }
  };

  const login = (email: string, explicitRole?: UserRole) => {
    // Check if matches demo email
    const match = Object.values(DEMO_USERS).find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (match) {
      setUser(match);
      localStorage.setItem('cafecircle_user', JSON.stringify(match));
      return;
    }

    const assignedRole = explicitRole || 'INVESTOR';
    const newUser: UserSession = {
      id: `usr_${Date.now()}`,
      name: email.split('@')[0],
      email,
      role: assignedRole,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
      referralCode: `CC${Math.floor(1000 + Math.random() * 9000)}`,
      city: 'Bengaluru',
      investor: assignedRole === 'INVESTOR' ? {
        id: `inv_${Date.now()}`,
        kycStatus: 'VERIFIED',
        totalInvested: 0,
        totalReturnsReceived: 0,
        activeInvestmentsCount: 0,
        ambassadorTier: 'Bronze Patron',
      } : undefined,
    };
    setUser(newUser);
    localStorage.setItem('cafecircle_user', JSON.stringify(newUser));
  };

  const register = (userData: Partial<UserSession>) => {
    const created: UserSession = {
      id: `usr_${Date.now()}`,
      name: userData.name || 'Coffee Enthusiast',
      email: userData.email || 'user@example.com',
      role: userData.role || 'INVESTOR',
      avatar: userData.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
      referralCode: `CC${Math.floor(1000 + Math.random() * 9000)}`,
      city: userData.city || 'Bengaluru',
      investor: userData.role === 'INVESTOR' ? {
        id: `inv_${Date.now()}`,
        kycStatus: 'VERIFIED',
        totalInvested: 0,
        totalReturnsReceived: 0,
        activeInvestmentsCount: 0,
        ambassadorTier: 'Bronze Patron',
      } : undefined,
      cafeOwner: userData.role === 'CAFE_OWNER' ? {
        id: `owner_${Date.now()}`,
        businessName: userData.name + "'s Cafe",
        isVerified: false,
        verificationStatus: 'PENDING',
      } : undefined,
    };
    setUser(created);
    localStorage.setItem('cafecircle_user', JSON.stringify(created));
  };

  const logout = () => {
    setUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('cafecircle_user');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user: user || DEMO_USERS.INVESTOR,
        role: user?.role || 'INVESTOR',
        switchRole,
        login,
        logout,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
