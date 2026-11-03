# CafeCircle ☕
### *Invest in What You Love. Grow Together.*

**CafeCircle** is a modern, community-powered cafe funding and viral growth platform built for the specialty coffee ecosystem. Instead of relying solely on traditional debt or dilutive venture capital, independent cafe owners raise expansion funds directly from loyal customers who already love their craft.

In turn, customer investors receive structured investment arrangements (such as simulated quarterly revenue shares or store credit perks) and become genuine brand advocates using the platform's **Community Growth Engine**.

---

## 🌟 Key Product Pillars

### 1. Three Distinct User Experiences
- **☕ Cafe Owners**: Register verified cafe profiles, define branch expansion goals, publish audited financial reports & construction milestones, track backer footfall analytics, and manage investors.
- **📈 Customer Investors**: Explore vetted campaigns, review digital term sheets & disclosed risks, contribute simulated investments (₹5,000 to ₹1,00,000), download signed certificates, track quarterly dividend yields, and view transaction ledgers.
- **👤 Regular Customers**: Discover trending local cafes, explore newly opened branches, view community-supported roasteries, and follow events.
- **🛡️ Platform Compliance Admins**: Verify business entities, audit FSSAI & lease documents, approve campaigns, and monitor platform health.

### 2. The Community Growth Engine (Viral Flywheel)
- Every community backer receives a **unique cafe referral link** upon backing a campaign.
- The platform tracks:
  - Total shares across social media & messaging
  - Unique visitor link clicks
  - Verified cafe guest visits
  - Conversion to new community backers
- **Advocate Leaderboard**: Backers earn advocate points and climb the community leaderboard (unlocking *Espresso Patron* and *Gold Ambassador* perks).
- Includes an **interactive live simulation tool** to test link shares and customer visits on the fly!

### 3. Trust & Transparency Framework
- Verified business badges based on FSSAI food licensing, GST registration, and registered commercial lease deeds.
- Monthly gross revenue, net profit, and footfall disclosures directly on cafe profiles.
- Cryptographically numbered digital term sheets and investment certificates.
- Disclosed business risk factors for every expansion campaign.

### 4. Regulatory Sandbox Safeguards
- Operates under a compliant **Simulated Investment Sandbox Mode** for the MVP.
- All payments, yields, and term sheets are educational simulations. No real banking debits occur.

---

## 🛠️ Technology Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router, React 18, TypeScript)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with custom warm cream (`#FAF7F2`), coffee brown (`#34190D`), and terracotta (`#C85A32`) palette
- **Database & ORM**: [Prisma ORM](https://www.prisma.io/) with SQLite (out-of-the-box local zero-config, PostgreSQL production ready)
- **Visual Analytics & Charts**: [Recharts](https://recharts.org/) for portfolio asset allocation and funding velocity curves
- **Icons**: [Lucide React](https://lucide.dev/)

---

## 🗄️ Database Architecture (16 Models)

| Model | Purpose |
|---|---|
| `User` | User accounts, credentials, avatar, city, and referral code |
| `CafeOwner` | Corporate business details, PAN, GST, and verification status |
| `Cafe` | Cafe brand profiles, story, amenities, rating, cover media, and verification badges |
| `CafeBranch` | Operating, upcoming, and planned cafe outlets with footfall metrics |
| `Campaign` | Expansion fundraising campaigns, targets, investment terms, and return models |
| `Investor` | Investor accreditation, KYC status, portfolio totals, and patron tiers |
| `Investment` | Simulated investments, certificates, amounts, and accrued dividends |
| `InvestmentAgreement` | Signed digital term sheets, agreement numbers, and terms snapshots |
| `Transaction` | Transaction ledger records with reference IDs and audit notes |
| `Referral` | Backer referral links, clicks, shares, and advocate scores |
| `ReferralConversion` | Verified cafe guest visits and friend conversions |
| `BusinessUpdate` | Expansion milestones, construction photos, and roaster deliveries |
| `FinancialReport` | Monthly gross revenue, net profit, and customer footfall reports |
| `Notification` | Real-time simulated alerts for payouts, milestones, and visits |
| `Document` | Vetted FSSAI licenses, GST filings, 3-year audits, and lease deeds |
| `Review` | Customer & investor tasting reviews and ratings |

---

## 🚀 Getting Started Locally

### Prerequisites
- Node.js (v18 or higher)
- npm or pnpm

### Setup Instructions

1. **Clone or navigate to the repository**:
   ```bash
   cd d:\Downloads\kuro
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Database Setup**:
   The SQLite database is pre-configured in `.env`:
   ```bash
   # Generate Prisma Client
   npx prisma generate

   # Sync database schema
   npx prisma db push

   # Seed database with realistic demo cafes & accounts
   node prisma/seed.js
   ```

4. **Start Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Demo Login Credentials

You can test all user journeys using the **One-Click Demo Role Switcher** in the top navigation bar, or log in with these pre-seeded credentials:

| Role | Name | Email | Password | Pre-seeded Context |
|---|---|---|---|---|
| **Investor** | Priya Patel | `priya@investor.com` | `password123` | Backed Roastery & Subko (₹75k invested, #1 Advocate) |
| **Cafe Owner** | Aarav Sharma | `aarav@roasterycoffee.com` | `password123` | Founder of Roastery Coffee House (raising ₹35L for HSR) |
| **Customer** | Rohan Sen | `rohan@customer.com` | `password123` | Active cafe hopper & regular advocate |
| **Admin** | Vikram Mehta | `admin@cafecircle.com` | `password123` | Platform Compliance & Verification Lead |

---

## 📂 Application Routes

1. **`/`** - Landing Page (Hero, live metrics, featured campaigns, Growth Engine showcase)
2. **`/explore`** - Cafe Discovery & Campaigns Filter (City & status filters, search, sorting)
3. **`/cafes/[id]`** - Cafe Profile (Story, branches, updates, financials, documents, reviews)
4. **`/campaigns/[id]`** - Campaign Details & Simulated Investment Flow
5. **`/how-it-works`** - Comprehensive Guide & FAQ (Traditional Debt vs CafeCircle)
6. **`/dashboard/investor`** - Investor Portfolio Dashboard with Recharts
7. **`/dashboard/owner`** - Cafe Owner Dashboard with funding analytics & milestone publisher
8. **`/growth-engine`** - Community Growth Engine & Referral Leaderboard
9. **`/campaigns/create`** - 5-Step Campaign Creation Wizard for Cafe Owners
10. **`/notifications`** - Real-time Simulated Notification Center
11. **`/admin`** - Platform Compliance & Verification Desk
12. **`/profile/investor`** - Investor Profile & Wallet Settings
13. **`/profile/owner`** - Cafe Business Profile & Entity Verification
14. **`/auth/login`** - Authentication with One-Click Demo Switcher
15. **`/auth/register`** - Registration for Investors, Cafe Owners & Regular Customers
16. **`/legal/risk-disclosure`** - Regulatory Sandbox & Risk Notices
17. **`/legal/terms`** - Terms of Service & Privacy Policies
