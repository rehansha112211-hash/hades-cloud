# HADES CLOUD — Premium Minecraft Server Hosting

A complete, production-ready Minecraft server hosting platform with:
- 🎮 Minecraft-themed public website (real Minecraft images from internet)
- 🔐 Secure admin panel (NextAuth + bcrypt password hashing)
- 🗄️ Dynamic plans & categories management (admin creates/edits/deletes)
- 📦 Orders system (creates PENDING_PAYMENT orders, ready for payment gateway)
- 🎫 Discord redirect on buy (users join Discord to open a ticket)
- 🌍 SEO optimized (sitemap, robots.txt, Open Graph)
- 📱 Fully responsive (mobile + desktop)
- ✨ Cinematic animations (parallax, tilt cards, animated counters, live console)

## Tech Stack
- **Framework**: Next.js 16 (App Router) + TypeScript
- **Database**: Prisma ORM + SQLite (dev) / PostgreSQL (production)
- **Auth**: NextAuth.js v4 + bcryptjs
- **Styling**: Tailwind CSS 4 + shadcn/ui
- **Fonts**: Montserrat (body) + Poppins (headings) — matches premium SaaS aesthetic

## Quick Start

```bash
# Install dependencies
bun install

# Set up environment variables
cp .env.example .env
# Edit .env with your values (see below)

# Set up database
bun run db:push

# Seed admin user + demo data
bun run scripts/seed.ts

# Start dev server
bun run dev
```

Visit http://localhost:3000

## Admin Access
- URL: http://localhost:3000/?view=login
- Email: `admin@hadescloud.local`
- Password: `hadescloud123`

⚠️ **Change these credentials in production!** Update in `.env` (ADMIN_SEED_EMAIL/PASSWORD) and re-run the seed script, or edit directly in the database.

## Environment Variables

Create a `.env` file (see `.env.example`):

```env
DATABASE_URL="file:./dev.db"                    # SQLite for dev, postgresql://... for prod
AUTH_SECRET="your-secret-here"                  # Generate: openssl rand -base64 32
NEXTAUTH_URL="http://localhost:3000"

# Admin seed (first run only)
ADMIN_SEED_EMAIL="admin@hadescloud.local"
ADMIN_SEED_PASSWORD="hadescloud123"
ADMIN_SEED_NAME="Hades Cloud Admin"

# Payment gateway (future-ready, no fake success)
PAYMENT_PROVIDER="none"                         # none | razorpay | stripe
PAYMENT_SECRET="your-payment-secret"
RAZORPAY_KEY_ID=""
RAZORPAY_KEY_SECRET=""
STRIPE_SECRET_KEY=""
STRIPE_PUBLISHABLE_KEY=""

# Public site
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
NEXT_PUBLIC_SUPPORT_EMAIL="support@hadescloud.local"
NEXT_PUBLIC_DISCORD_URL="https://discord.gg/R8dR4t4qWf"
```

## Features

### Public Website
1. **Hero** — Cinematic Minecraft landscape with parallax + animated counters
2. **Why Hades Cloud** — 6 feature cards with 3D tilt
3. **Metrics** — Animated stat counters (45,000+ servers, 99.9% uptime)
4. **Plans** — Dynamic plans from database (admin manages)
5. **Control Panel** — Live typing console mockup + animated stat bars
6. **Features** — 6 detailed feature cards
7. **World Gallery** — Bento grid of Minecraft gameplay screenshots
8. **Testimonials** — 3 customer reviews with star ratings
9. **FAQ** — Accordion (editable from admin)
10. **Contact** — Form + Discord ticket button
11. **Footer** — Newsletter + Discord link

### Admin Panel
- **Dashboard** — Stats overview (total plans, orders, customers, revenue)
- **Plans** — Full CRUD (Create/Read/Update/Delete + Hide/Show)
- **Categories** — Full CRUD (DIRT/STONE/IRON/DIAMOND/NETHERITE + custom)
- **Orders** — View all orders, update status
- **Customers** — View customer list with order history
- **Settings** — Update support email, Discord URL, see integration status
- **Servers/Billing/Invoices** — Coming soon stubs (future integration)

### Security
- ✅ bcrypt password hashing (12 rounds)
- ✅ NextAuth JWT sessions with httpOnly secure cookies
- ✅ Server-side auth check on every /api/admin/* route
- ✅ Login rate limiting (8 attempts / 10 min per IP)
- ✅ Zod input validation on all API endpoints
- ✅ Confirmation modals before destructive actions
- ✅ All secrets in environment variables (never exposed)
- ✅ robots.txt disallows /admin

### Buy Flow → Discord
When a customer clicks "Order Now":
1. Toast notification shows "Opening Discord — open a ticket to complete your purchase!"
2. Discord server opens in new tab (https://discord.gg/R8dR4t4qWf)
3. Customer opens a ticket in Discord to complete purchase
4. No fake payment — fully transparent flow

## Deployment to Vercel

### 1. Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit — HADES CLOUD"
git branch -M main
git remote add origin https://github.com/yourusername/hades-cloud.git
git push -u origin main
```

### 2. Deploy on Vercel
1. Go to https://vercel.com/new
2. Import your GitHub repo
3. Add environment variables (see list above) — **generate a new AUTH_SECRET**:
   ```bash
   openssl rand -base64 32
   ```
4. Set `NEXTAUTH_URL` to your Vercel URL (e.g., `https://hades-cloud.vercel.app`)
5. Set `NEXT_PUBLIC_SITE_URL` to your Vercel URL
6. Deploy!

### 3. Database Setup (Production)
For production, use PostgreSQL:
1. Create a PostgreSQL database (Vercel Postgres, Supabase, Neon, etc.)
2. Update `DATABASE_URL` in Vercel env vars:
   ```
   DATABASE_URL="postgresql://user:pass@host:5432/dbname"
   ```
3. Run database push (Vercel CLI or add to build command):
   ```bash
   bun run db:push
   bun run scripts/seed.ts  # creates admin user + demo data
   ```

### 4. Post-Deployment
- Change admin password (update `.env` ADMIN_SEED_PASSWORD, re-run seed)
- Set up real payment gateway (Razorpay/Stripe) when ready
- Configure Discord bot for ticket automation (future)

## Project Structure
```
src/
├── app/
│   ├── api/                  # 18 API routes
│   │   ├── public/          # Public plans + FAQs
│   │   ├── auth/            # NextAuth + session check
│   │   ├── admin/           # Admin-only (plans, categories, orders, etc.)
│   │   ├── orders/          # Create order + lookup by number
│   │   └── contact/         # Contact form
│   ├── admin/page.tsx       # /admin route
│   ├── login/page.tsx       # /login route
│   ├── page.tsx             # Main view switcher
│   ├── layout.tsx           # Root layout + fonts
│   ├── globals.css          # Theme + animations
│   ├── sitemap.ts           # SEO sitemap
│   └── manifest.ts          # PWA manifest
├── components/
│   ├── public-site/         # 11 public sections
│   ├── admin/               # Admin shell + 7 sections
│   ├── enhanced/            # Cinematic components (tilt, parallax, etc.)
│   ├── brand/               # Logo, particles, reveal
│   └── ui/                  # shadcn/ui components
├── lib/                     # Auth, db, validators, helpers
├── hooks/                   # useCountUp, useTilt, useScrollProgress, etc.
└── stores/                  # Zustand nav store

prisma/
└── schema.prisma            # 7 models (AdminUser, Category, Plan, Customer, Order, Faq, Setting)

public/images/minecraft/     # 19 real Minecraft images (2.4MB total)

scripts/
├── seed.ts                  # Idempotent DB seeder
└── optimize-images.cjs      # Image compression
```

## Scripts
- `bun run dev` — Start dev server
- `bun run build` — Production build
- `bun run lint` — ESLint check
- `bun run db:push` — Push Prisma schema to DB
- `bun run db:generate` — Regenerate Prisma client
- `bun run scripts/seed.ts` — Seed admin + demo data

## License
© Hades Cloud. All rights reserved.

Minecraft is a trademark of Mojang AB. Hades Cloud is an independent hosting provider and is not affiliated with Mojang AB or Microsoft.
