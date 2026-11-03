import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/lib/auth-context';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'CafeCircle | Invest in What You Love. Grow Together.',
  description:
    'Community-powered cafe funding and growth platform. Turn loyal customers into community investors, brand advocates, and expansion partners.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col font-sans text-[#1C1917] relative">
        {/* Ambient Warm Gradient Orbs for Authentic Transparent Glass Refraction */}
        <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
          <div className="absolute -top-32 -left-28 w-[38rem] h-[38rem] bg-gradient-to-br from-[#EAC4A4]/40 to-[#D4A373]/20 rounded-full blur-3xl opacity-75" />
          <div className="absolute top-1/4 -right-28 w-[36rem] h-[36rem] bg-gradient-to-bl from-[#E4BA96]/35 to-[#EBD5C2]/20 rounded-full blur-3xl opacity-70" />
          <div className="absolute top-2/3 left-10 w-[32rem] h-[32rem] bg-gradient-to-tr from-[#EED9C4]/40 to-[#DEB887]/20 rounded-full blur-3xl opacity-65" />
          <div className="absolute -bottom-24 right-1/4 w-[40rem] h-[40rem] bg-gradient-to-t from-[#E6CCA8]/35 to-transparent rounded-full blur-3xl opacity-55" />
        </div>

        <AuthProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
