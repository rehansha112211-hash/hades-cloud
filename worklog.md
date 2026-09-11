---
Task ID: 1
Agent: Super Z (main)
Task: Build complete production-quality HADES CLOUD Minecraft server hosting platform — public website + private admin panel + database + auth + dynamic plans/categories + secure backend

Work Log:
- Initialized fullstack project (Next.js 16 + TypeScript + Prisma + SQLite + shadcn/ui + Tailwind 4)
- Designed Prisma schema: AdminUser (bcrypt password), Category, Plan, Customer, Order, Faq, Setting
- Configured environment: AUTH_SECRET, DATABASE_URL, PAYMENT_PROVIDER=none, NEXT_PUBLIC_SITE_URL, NEXT_PUBLIC_SUPPORT_EMAIL, NEXT_PUBLIC_DISCORD_URL
- Wrote seed script (scripts/seed.ts) — idempotent: creates admin user (admin@hadescloud.local / hadescloud123), 5 categories (DIRT/STONE/IRON/DIAMOND/NETHERITE), 5 demo plans, 7 FAQ entries, 5 demo customers + orders
- Set up NextAuth credentials provider with bcrypt password verification, JWT sessions, login rate limiting (8 attempts / 10 min per IP), httpOnly secure cookies
- Built 18 API routes under /api (public plans/faqs/orders, contact, admin plans/categories/orders/customers/stats/settings, auth/session-check/logout)
- Designed dark Minecraft glass theme: oklch color palette (emerald + amber accents on deep night background), Space Grotesk display font + Geist Sans body, glass-card / glass-panel utilities, glow-emerald / glow-amber shadows, text-gradient-hades, bg-pixel-grid, bg-hades-hero, particle field with reduced-motion respect
- Built public site (9 sections): sticky glass navbar with mobile hamburger, cinematic hero with Minecraft landscape bg + particles + 2 CTAs, Why Hades Cloud (6 feature cards), dynamic Plans section (fetches from /api/public/plans, skeleton + empty + error states, no hard-coded plans), Control Panel marketing mockup with realistic console/stat-cards/sidebar, Features section (6 detailed cards), FAQ accordion (loads from DB with fallback), Contact form with rate limiting, dark Nether-inspired footer with legal links + Mojang trademark disclaimer
- Built order flow: clean order page with plan summary + checkout form → POST /api/orders creates PENDING_PAYMENT order → success page with order number + status + "what happens next" steps. No fake payment — explicit "payment gateway not configured yet" message in order response.
- Built admin login: glass card with show/hide password, loading + error states, session-check redirects to dashboard if already authed
- Built admin shell: responsive sidebar (drawer on mobile via Sheet), 9 nav items (Dashboard, Plans, Categories, Orders, Customers, Settings + 3 "coming soon" stubs: Servers, Billing, Invoices), top bar with View Site + Logout
- Built admin Dashboard: 5 stat cards (Total/Visible/Hidden Plans, Total Orders, Customers) + 3 secondary stats (Pending payment, Paid, Revenue) + quick actions panel
- Built Plans Manager: searchable table on desktop / cards on mobile, Add New Plan modal with 9 required fields exactly per spec (Plan Name, Category, Price, Duration, RAM, Storage, Storage Type, CPU/vCPU, Processor + visibility checkbox), Edit modal reusing same form, Hide/Show toggle with optimistic update, Delete with confirmation modal that blocks if orders reference the plan
- Built Categories Manager: grid of category cards with plan count, Create/Edit/Delete with safe-delete (refuses if plans use the category), new categories auto-available in plan form
- Built Orders Manager: searchable + status-filterable table, inline status dropdown (PENDING_PAYMENT → PAID etc.), mobile cards
- Built Customers Manager: searchable customer list with avatar initials, order count, last order info
- Built Settings Manager: public site settings form (support email, Discord URL, contact phone) + integration status panel (auth active, AUTH_SECRET loaded, payment gateway status) + secret credentials reminder
- Added SEO: metadata with template, OpenGraph, Twitter card, robots.txt (admin disallowed), sitemap.ts, manifest.ts, favicon.svg
- Created /admin and /login route wrappers so direct URL access works (mirrors home page with view state)

Bug fixes during verification:
- Fixed "Object with keys {id,name,slug,...}" React error: admin plans API was returning nested category object, frontend expected string. Created flattenPlan serializer and applied to all admin plan endpoints.
- Added @unique constraint to Customer.email (was missing — caused findUnique to fail)
- Created /admin and /login route pages so URL-based navigation works (sandbox constraint says only `/` is visible, but mirroring page.tsx allows direct /admin access)

Stage Summary:
- Public site + admin panel + DB + auth + dynamic plans/categories + orders/customers/settings all working end-to-end
- Verified with agent-browser: public site renders all sections, order flow creates real order in DB and shows confirmation page, admin login works, all 6 admin sections render and load real DB data
- Verified live admin→website sync: created OBSIDIAN plan in admin → instantly appeared on public plans API; hid it → instantly disappeared from public
- Mobile-responsive verified (375px viewport) — drawer sidebar works, plan cards stack, no horizontal scroll
- Lint clean (0 errors, 0 warnings)
- Dev server runs on port 3000 with no runtime errors
- Production-ready foundation for future payment gateway (env vars wired, order status state machine in place) and Minecraft panel integration (admin Servers page stubbed with "coming soon")
