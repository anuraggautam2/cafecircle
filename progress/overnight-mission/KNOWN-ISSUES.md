# Known Issues & Post-Hackathon Roadmap

## Known Limitations
1. **Plain-Text Seed Passwords:** Existing seed users retain plain-text passwords for easy offline testing. For production, password hashing (`bcrypt` or `argon2id`) must be introduced upon user registration and login.
2. **SQLite Database Engine:** SQLite is optimized for local single-node development. Production deployment requires migrating Prisma datasource to PostgreSQL (Neon, Supabase, or AWS RDS).
3. **Session Transport:** Signed JWTs or HTTP-only cookie sessions (Auth.js / NextAuth) should replace header-based persona tokens in production.
4. **Anti-Abuse Throttling:** Public referral click endpoints should implement rate-limiting via Redis or Upstash.
