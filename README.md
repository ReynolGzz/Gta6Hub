<div align="center">

# ViceHub

### The searchable GTA 6 intelligence platform

**Stop searching YouTube. Search GTA 6.**

IMDb · Notion · Google · MapGenie — for GTA 6, in one platform.

</div>

---

ViceHub turns scattered GTA 6 knowledge into a structured, instantly-searchable
database. Instead of watching 20-minute videos, players find the answer in
seconds: the fastest car, the best money method, the highest-ROI business,
hidden weapons, mission payouts, easter eggs and more.

## ✨ Features

- **Google-style global search** — instant fuzzy search (Cmd/Ctrl+K palette + homepage) across every entity, with a full results page.
- **Cars database** — full performance stats, filters (Super/Sports/Muscle/SUV/Bikes/Boats/Aircraft), sorting, and side-by-side **comparison**.
- **Money methods** — ranked by profit/hour and ROI, with solo/beginner filters, an ROI calculator and markdown guides.
- **13 entity types** — cars, money, weapons, businesses, properties, missions, characters, crews, locations, activities, races, easter eggs, achievements, collectibles.
- **GTA 6 AI assistant** — retrieval-augmented (RAG) answers grounded **only** in the database, with cited sources. Uses OpenAI when configured; falls back to a database-retrieval response otherwise.
- **Interactive map** — Mapbox with category layers and progress tracking (graceful placeholder + marker list when no token).
- **Giveaways / prizes** — a built-in, site-run giveaways hub (`/giveaways`) to drive recurring traffic: free entry, **bonus entries** for joining Discord or sharing, live countdowns, winners, and a featured-giveaway banner on the homepage.
- **Discord integration** — a configurable **Join Discord** button (navbar, footer, homepage) plus optional **"Continue with Discord"** OAuth login, both behind env flags.
- **Community** — Reddit-style votes and comments on every entity.
- **Progress tracker & builds** — track collected cars/weapons/properties; create collections, routes, portfolios and loadouts.
- **Premium tier ($4.99/mo)** — Stripe checkout with paywalled features (dev/free mode without keys).
- **Auth** — NextAuth credentials login; the first account created becomes the admin.
- **Admin panel** — analytics overview, car CRUD, community moderation view.
- **SEO engine** — per-page metadata, OpenGraph, Schema.org JSON-LD (Vehicle/Article/ItemList), dynamic `sitemap.xml` and `robots.txt`.
- **Design** — dark-mode-only Miami-neon / cyberpunk aesthetic: glassmorphism, gradients, massive display type, smooth animations.

## 🧱 Tech Stack

Next.js 15 (App Router) · TypeScript · Tailwind CSS · shadcn-style UI · Prisma ·
SQLite (dev) → Postgres/Supabase (prod) · NextAuth · Stripe · Mapbox
(react-map-gl) · OpenAI · Fuse.js · framer-motion · Zod · PostHog. Deployable on Vercel.

## 🚀 Getting Started

**Zero configuration required** — every integration is optional and degrades
gracefully when its key is missing.

```bash
pnpm install
pnpm prisma migrate dev      # creates the SQLite DB + schema
pnpm db:seed                 # loads illustrative data + builds the search index
pnpm dev                     # http://localhost:3000
```

> The first account you register becomes the **ADMIN** (so `/admin` works out of the box).

### Optional environment variables

Copy `.env.example` to `.env` and fill in any you want. All are optional:

| Variable | Enables | Without it |
|---|---|---|
| `OPENAI_API_KEY` | Conversational AI answers | AI uses database-retrieval responses |
| `NEXT_PUBLIC_MAPBOX_TOKEN` | Live Mapbox map | Styled placeholder + marker list |
| `STRIPE_SECRET_KEY` + `STRIPE_PRICE_ID` | Real subscriptions | Dev/free upgrade mode |
| `NEXT_PUBLIC_POSTHOG_KEY` | Product analytics | No-op |
| `NEXT_PUBLIC_DISCORD_URL` | "Join Discord" buttons | Buttons hidden |
| `DISCORD_CLIENT_ID` + `DISCORD_CLIENT_SECRET` | "Continue with Discord" login | Credentials-only auth |

## 🧪 Tests & CI

```bash
pnpm test            # Vitest unit suite (search, utils, entities, RAG fallback, env flags, giveaways)
```

GitHub Actions (`.github/workflows/ci.yml`) runs lint → tests → seed → build on
every push and PR, hermetically (SQLite + dummy secret, no integrations needed).

## 📂 Project Structure

```
prisma/            schema.prisma (PG-portable) + seed.ts (data + search index)
src/
  app/             routes: home, /cars, /money, /[kind] (11 generic types),
                   /search, /map, /ai, /pricing, /dashboard, /admin, (auth), /api/*
  components/      ui/ search/ entity/ cars/ money/ map/ ai/ admin/ layout/ ...
  lib/             db, env+flags, search (Fuse), seo, auth, stripe, entities, ai/rag
  data/            generated search-index.json
  styles/          neon design system
```

Key design decisions:
- **`lib/entities.ts`** is the single registry driving navigation, the generic
  list/detail templates, search labels, sitemap and internal linking.
- **`lib/env.ts`** exposes `features` flags so the UI/API degrade gracefully.
- Cars and Money have bespoke pages; the other 11 types render through shared
  generic templates keyed off `Entity.type` + a JSON `data` column.

## 🗄️ Switching to Postgres / Supabase (production)

1. In `prisma/schema.prisma`, set `provider = "postgresql"`.
2. Set `DATABASE_URL` to your Supabase/Postgres connection string.
3. `pnpm prisma migrate deploy && pnpm db:seed`.

The schema avoids native enums and scalar arrays (array-like fields are JSON
strings) specifically so it ports cleanly between SQLite and Postgres.

## 🗺️ Roadmap (MVP → Production)

**Now (this build):** search, cars + money (full depth), all 13 entity types,
AI RAG (OpenAI-optional), auth (+ optional Discord login), community,
progress/builds, map, Stripe, admin, SEO, **giveaways hub**, **Discord**, tests + CI.

**Next:**
- Postgres/Supabase + `pgvector` for true vector RAG retrieval
- Real OAuth providers (Google/Discord) + email verification
- Stripe live mode + customer portal + webhooks in production
- Full, sourced data backfill for all 13 entity types
- Postgres full-text search / Algolia at scale

**Later:**
- Social share-image generation pipeline + TikTok-style snippet generator
- Community reputation & moderation tooling
- Mobile app, analytics dashboards, i18n

## ⚠️ Data Disclaimer

GTA 6 is not fully documented, so the seeded stats, prices and locations are
**illustrative, community-style placeholders** for demonstration. They live in
`prisma/seed.ts` and are designed to be replaced with real data. ViceHub is a
fan project and is not affiliated with Rockstar Games or Take-Two Interactive.
