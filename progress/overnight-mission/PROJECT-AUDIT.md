# Comprehensive Project Audit — CafeCircle

## 1. Architecture & Framework Discovery
- **Next.js:** 14.2.21 / 14.2.35 with App Router (`app/` directory).
- **React:** 18.3.1 with Client Components (`'use client'`) and Server Actions / API Route handlers.
- **ORM / Database:** Prisma 5.22.0 connected to SQLite file database `prisma/dev.db`.
- **CSS / Styling:** Tailwind CSS 3.4.15 with custom ivory (`#F5F1E8`), espresso (`#211A17`), warm beige (`#D8C6AE`), coffee brown (`#49352B`), and bespoke backdrop glass classes (`glass-card`, `glass-panel`, `glass-nav`, `hero-glass`).
- **Icons:** `lucide-react` 0.460.0.
- **Charts / Visualizations:** `recharts` 2.13.3 (installed in `package.json`).
- **Animations:** `framer-motion` 11.11.17 (installed in `package.json`).

## 2. Directory & Route Map
- `/` — Homepage / Landing Experience (Hero, Featured Cafes, How It Works, For Cafe Owners, About).
- `/explore` — Search & Filter Directory with live query parameters.
- `/cafes/[id]` — Individual Cafe Profile (details, story, branches, business updates, financials, legal documents, reviews, active campaigns).
- `/campaigns/[id]` — Campaign Details & simulated investment entry.
- `/campaigns/create` — 3-step Campaign Launch Wizard for Cafe Owners.
- `/dashboard/owner` — Cafe Operator Portal (metrics, multi-branch selector, campaign progress, financial publisher, update publisher, activity log).
- `/dashboard/investor` — Backer Portfolio (total invested, accrued returns, backed campaigns, investment certificates, live updates feed).
- `/admin` — Platform Governance & Compliance Desk (verify cafes, approve campaigns, review business owners).
- `/growth-engine` — Community Referral & Ambassador Leaderboard.
- `/how-it-works` — Co-growth model explanation.
- `/notifications` — User notification hub.
- `/profile/investor` — Backer account settings.
- `/profile/owner` — Cafe operator account settings.
- `/auth/login` — Sign-in page with instant test persona switcher.
- `/auth/register` — Account registration.
- `/legal/risk-disclosure` — Financial risk statement for simulated investments.
- `/legal/terms` — Terms of service.

## 3. Discovered Flaws & Improvement Opportunities
1. **Design System Inconsistencies:**
   - `auth/login`, `auth/register`, `legal/risk-disclosure`, `legal/terms` use legacy dark/stripe cards with `#FDFCFB` / `#181514` rather than the warm ivory / glassmorphic aesthetic established in `globals.css` and the homepage.
2. **Missing Interactive Feature — Customer Reviews:**
   - Cafe profile pages display reviews, but visitors/patrons have no UI form or API endpoint to submit new ratings or reviews.
3. **Missing Interactive Feature — Return Simulation Chart:**
   - `recharts` is installed in `package.json`, but `app/campaigns/[id]/page.tsx` lacks an interactive visual yield curve showing projected returns over 12–36 months based on custom investment amounts.
4. **Missing Profile Persistence:**
   - `app/profile/investor/page.tsx` and `app/profile/owner/page.tsx` have mock form fields that do not persist changes back to the database.
5. **Backend Authorization Gaps:**
   - `POST /api/cafes` allows unauthenticated creation and defaults to `owner_aarav`.
   - `app/api/notifications/route.ts` does not check caller identity, permitting any user to view or dismiss notifications for arbitrary `userId` parameters.
6. **Mobile Polish:**
   - Modals and filter drawers require responsive validation on small viewports (<375px).
