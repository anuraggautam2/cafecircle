# Granular Task Checklist — CafeCircle Mission

## Phase 1: Discovery & Infrastructure
- [x] Confirm project root at `D:\Downloads\kuro`
- [x] Verify Git status and branch `main`
- [x] Create `progress/overnight-mission/` directory
- [x] Write baseline tracking documents (README, LIVE-PROGRESS, PROJECT-AUDIT, TASK-CHECKLIST)

## Phase 2: UI/UX & Design System Consistency
- [x] Align `app/auth/login/page.tsx` with Warm Glassmorphism & Ivory palette
- [x] Align `app/auth/register/page.tsx` with Warm Glassmorphism & Ivory palette
- [x] Align `app/legal/risk-disclosure/page.tsx` with Glassmorphic styling
- [x] Align `app/legal/terms/page.tsx` with Glassmorphic styling
- [x] Elevate empty/loading states across all routes to use unified pulse skeletons and warm tones
- [x] Verify typography hierarchy and contrast accessibility (WCAG AA)

## Phase 3: Core Functionality & Interactive Features
- [x] Create `POST /api/reviews` with server-side validation and DB insertion
- [x] Add interactive "Write a Review" modal on `app/cafes/[id]/page.tsx`
- [x] Create interactive Recharts yield projection calculator on `app/campaigns/[id]/page.tsx`
- [x] Create `PUT /api/profile` to support profile updates for investors and owners
- [x] Wire up `app/profile/investor/page.tsx` with live database save and toast feedback
- [x] Wire up `app/profile/owner/page.tsx` with live database save and toast feedback

## Phase 4: Backend Hardening & API Security
- [x] Protect `POST /api/cafes` with `requireRole(['CAFE_OWNER', 'ADMIN'])`
- [x] Secure `app/api/notifications/route.ts` with `requireAuth` and user identity matching
- [x] Add input sanitization and payload bounds checks to review and profile APIs
- [x] Ensure non-destructive DB operations (zero data loss on existing seeds)

## Phase 5: Responsiveness & Layout Stability
- [x] Validate responsive layouts on mobile (<640px), tablet (640px-1024px), desktop (>1024px)
- [x] Fix any horizontal overflow or button clipping in cards and navigation
- [x] Ensure touch-friendly tap targets (minimum 44x44px) on mobile

## Phase 6: Rigorous Testing & QA
- [x] Run `npx tsc --noEmit` and resolve any type errors
- [x] Run `npx next build` and verify all 18+ routes compile cleanly
- [x] Run comprehensive automated end-to-end API test suite
- [x] Verify seed data integrity (users, cafes, campaigns, referrals)

## Phase 7: Comprehensive Documentation & Handover
- [x] Update `CHANGELOG.md` with every modified file and explanation
- [x] Write `TECHNICAL-EXPLANATION.md` in accessible language
- [x] Write `TEST-REPORT.md` with real test output
- [x] Write `SECURITY-REPORT.md` detailing security architecture and remaining limitations
- [x] Write `KNOWN-ISSUES.md` and `FINAL-HANDOVER.md`
