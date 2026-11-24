# Security & Governance Report — CafeCircle

**Audit Status:** SECURED FOR HACKATHON & DEMO STAGE ✅  
**Last Updated:** 2026-11-21 00:26 IST  

---

## 1. Authentication & Session Architecture
- **Server Guard (`lib/auth-server.ts`):**
  - All protected endpoints invoke `requireAuth(request)` or `requireRole(request, roles)`.
  - Identity is extracted from either `x-cafecircle-user-id` header or the `cc_user_id` cookie.
  - The ID is queried against the SQLite database using `prisma.user.findUnique()`.
  - Roles are enforced strictly from the database record—client-supplied roles in request bodies are ignored.
- **Client Session Synchronization (`lib/auth-context.tsx`):**
  - Active user persona is automatically synchronized to `cc_user_id` cookie on switch, login, or registration.
  - UI components attach `'x-cafecircle-user-id'` in headers for defense-in-depth across browsers.

---

## 2. API Endpoint Protection Matrix

| Route | Method | Access Level | Authorization Mechanism | Audit Result |
| :--- | :--- | :--- | :--- | :--- |
| `/api/admin/verify` | `POST` | Restricted (`ADMIN`) | `requireRole(request, 'ADMIN')` | **SECURED**. Rejects non-admin (403) and unauthenticated (401). |
| `/api/investments` | `GET` | Authenticated | `getAuthenticatedUser` | **SECURED**. User isolation enforced; portfolio querying restricted to owner. |
| `/api/investments` | `POST` | Authenticated | `requireAuth(request)` | **SECURED**. Server enforces authenticated backer ID; sanitized URL-safe referral codes. |
| `/api/campaigns` | `GET` | Public | Public Directory | **INTENTIONAL PUBLIC**. Supports search & discovery filters. |
| `/api/campaigns` | `POST` | Restricted (`CAFE_OWNER`, `ADMIN`) | `requireRole` + Cafe Ownership | **SECURED**. Enforces that caller owns the cafe. |
| `/api/cafes` | `GET` | Public | Public Directory | **INTENTIONAL PUBLIC**. Public exploration. |
| `/api/cafes` | `POST` | Restricted (`CAFE_OWNER`, `ADMIN`) | `requireRole(['CAFE_OWNER', 'ADMIN'])` | **SECURED**. Unauthenticated (401) and customer attempts (403) blocked. |
| `/api/updates` | `POST` | Restricted (`CAFE_OWNER`, `ADMIN`) | `requireRole` + Cafe Ownership | **SECURED**. Cafe ownership verified before posting. |
| `/api/financials` | `POST` | Restricted (`CAFE_OWNER`, `ADMIN`) | `requireRole` + Cafe Ownership | **SECURED**. Cafe ownership verified before posting. |
| `/api/reviews` | `POST` | Authenticated | `requireAuth(request)` | **SECURED**. Validates user session; auto-verifies investor badge. |
| `/api/profile` | `GET`, `PUT` | Authenticated | `requireAuth(request)` | **SECURED**. Users can only read and mutate their own profile. |
| `/api/notifications`| `GET`, `PUT` | Authenticated | `requireAuth(request)` | **SECURED**. Cross-user notification snooping and modification blocked. |

---

## 3. Remaining Security Limitations (Hackathon vs. Production)

1. **Demo Session Transport:**
   * *Current Status:* Header/cookie tokens match user IDs in SQLite.
   * *Production Recommendation:* Transition to cryptographically signed JWTs or encrypted HTTP-only session cookies via Auth.js (NextAuth) or Supabase Auth.
2. **Password Storage:**
   * *Current Status:* Seed accounts retain plain-text passwords for development convenience.
   * *Production Recommendation:* Hash all credentials using `argon2id` or `bcrypt` (cost factor $\ge 12$).
3. **Anti-Abuse & Rate Limiting:**
   * *Current Status:* Public referral link visits (`POST /api/referrals`) are recorded without IP deduplication.
   * *Production Recommendation:* Add Upstash/Redis token bucket rate-limiting on public click and visit endpoints to prevent gamification inflation.
4. **Anti-CSRF Protection:**
   * *Current Status:* Browser cookies use `SameSite=Lax`.
   * *Production Recommendation:* Add double-submit CSRF tokens for state-modifying POST/PUT requests in non-GET endpoints.
