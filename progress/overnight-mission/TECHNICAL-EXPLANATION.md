# Technical Architecture & System Explanation

## 1. System Overview
CafeCircle is a community-powered cafe discovery and growth platform connecting:
1. **Patrons & Customers:** Discover local cafes, write reviews, and track community activity.
2. **Community Investors:** Participate in simulated revenue-share expansions starting from ₹5,000.
3. **Cafe Founders:** Launch expansion campaigns, raise non-dilutive capital, and publish monthly financials.
4. **Platform Admins:** Verify business compliance, licenses (FSSAI, GST, PAN), and approve campaigns.

## 2. Technical Stack
- **Frontend:** Next.js 14 App Router, React 18, Tailwind CSS, Recharts for financial curves.
- **Backend:** Next.js Route Handlers (`app/api/**/route.ts`).
- **Database:** SQLite via Prisma ORM (`prisma/schema.prisma` -> `prisma/dev.db`).
- **Auth Strategy:** Server-side identity validation (`lib/auth-server.ts`) resolving session headers and cookies against the SQLite database, with client-side persona switching for interactive demonstration.

## 3. Data Model
- `User` — Base identity (Name, Email, Password, Role, ReferralCode).
- `CafeOwner` — Business verification details (Business PAN, GST, bank details).
- `Investor` — Backer portfolio (KYC status, total invested, accrued returns).
- `Cafe` — Profile, branches, updates, financials, legal documents, reviews.
- `Campaign` — Investment offering (target amount, raised amount, structure, terms, projections).
- `Investment` — Backer commitment, certificate number, simulated agreement snapshot.
- `Referral` — Growth tracking with URL-safe codes, visits, conversions, advocate points.
- `Review` — Customer ratings, comments, verified investor badge.
