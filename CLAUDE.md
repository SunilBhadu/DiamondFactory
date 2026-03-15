# CLAUDE.md — Diamond Factory Development Guide

This file provides complete context for AI-assisted development of the Diamond Factory ecommerce platform.
Read this file before making any changes to the codebase.

---

## Project Overview

**Diamond Factory Pvt Ltd** builds a production-grade luxury diamond & jewelry ecommerce platform
competing with Blue Nile, Brilliant Earth, and Grown Brilliance. The platform allows customers to:

- Search 50,000+ GIA/IGI certified diamonds with real-time filtering
- Build custom engagement rings (choose diamond → choose setting → 3D preview → checkout)
- Purchase fine jewelry (necklaces, earrings, bracelets, pendants)
- Use AI-powered visual search and virtual try-on (Phase 3)

**Company:** Diamond Factory Pvt Ltd, Dhanlaxmi Estate, 3/2 Vasta Devdi Rd, Surat, Gujarat 395004, India

---

## Repository Structure

```
DiamondFactory/                    ← monorepo root
├── apps/
│   └── web/                       ← Next.js 15 frontend (Vercel)
│       └── src/
│           ├── app/               ← App Router pages (file-based routing)
│           │   ├── (auth)/        ← login, register (route group, no shared layout)
│           │   ├── (account)/     ← dashboard, orders, wishlist, profile (protected)
│           │   ├── admin/         ← admin panel (role-gated)
│           │   ├── diamonds/      ← search + [id] detail pages
│           │   ├── engagement-rings/
│           │   ├── build-your-ring/
│           │   ├── jewelry/
│           │   ├── cart/
│           │   ├── checkout/
│           │   ├── layout.tsx     ← root layout (Header + Footer + Providers)
│           │   ├── page.tsx       ← homepage
│           │   └── sitemap.ts     ← auto-generated sitemap
│           ├── components/
│           │   ├── ui/            ← base design system (Button, Input, Card, Dialog…)
│           │   ├── layout/        ← Header, Footer
│           │   ├── diamonds/      ← DiamondCard, DiamondFilters, DiamondComparison
│           │   └── ring-builder/  ← RingSettingCard
│           ├── stores/            ← Zustand global state
│           │   ├── auth.store.ts
│           │   ├── cart.store.ts
│           │   ├── ring-builder.store.ts
│           │   └── diamond-comparison.store.ts
│           └── lib/
│               ├── api-client.ts  ← axios instance with interceptors
│               ├── api/           ← typed API call functions (one file per domain)
│               ├── hooks/         ← custom React hooks
│               └── utils.ts       ← formatPrice, cn, formatCarat, etc.
│
├── packages/
│   └── types/                     ← shared TypeScript interfaces (consumed by web + api)
│       └── src/
│           ├── diamond.types.ts
│           ├── user.types.ts
│           ├── order.types.ts
│           ├── product.types.ts
│           └── index.ts           ← barrel export
│
├── services/
│   └── api/                       ← NestJS backend (Docker → EKS)
│       ├── prisma/
│       │   ├── schema.prisma      ← PostgreSQL schema (source of truth)
│       │   └── seed.ts            ← dev seed (50 diamonds, 12 settings, admin user)
│       └── src/
│           ├── main.ts            ← bootstrap, global pipes, Swagger, CORS
│           ├── app.module.ts      ← root module, imports all feature modules
│           ├── config/            ← typed configuration factory
│           ├── database/          ← PrismaService (global)
│           ├── redis/             ← RedisService (global)
│           ├── elasticsearch/     ← ElasticsearchService (global)
│           ├── auth/              ← JWT + Google OAuth, guards, decorators
│           ├── users/             ← profile, addresses
│           ├── diamonds/          ← catalog, search (Elasticsearch DSL builder)
│           ├── orders/            ← order lifecycle state machine
│           ├── payments/          ← Stripe + Razorpay + webhook handlers
│           ├── cart/              ← Redis-backed cart
│           ├── wishlist/          ← wishlist + public share links
│           └── health/            ← /health + /health/ready probes
│
├── .github/workflows/
│   ├── ci.yml                     ← quality → test → build → Vercel deploy
│   └── docker.yml                 ← build + push API image to GHCR
│
├── docker-compose.yml             ← local dev: postgres, mongo, redis, elasticsearch
├── .npmrc                         ← legacy-peer-deps=true (three.js ecosystem)
├── turbo.json                     ← Turborepo task pipeline
├── tsconfig.base.json             ← shared TS config extended by all packages
└── package.json                   ← npm workspace root
```

---

## Development Rules

### Critical — never violate these

1. **Never use `workspace:*` syntax.** This repo uses npm workspaces. The correct specifier
   for internal packages is `"*"` (e.g., `"@diamond-factory/types": "*"`). `workspace:*` is
   pnpm-only and will break `npm install`.

2. **Never store JWTs in localStorage.** Access tokens live in memory (Zustand store, not
   persisted). Refresh tokens are in HttpOnly cookies only. This is security-critical.

3. **Never touch raw card data.** Stripe Elements and Razorpay hosted fields handle all card
   input directly. Our servers only receive `payment_intent_id` / `razorpay_order_id`.
   PCI SAQ-A compliance depends on this.

4. **Never hardcode secrets.** All credentials come from environment variables via
   `ConfigService`. Use `this.configService.get<string>('path.to.key')` in NestJS.

5. **Never reindex Elasticsearch from scratch on every update.** Diamond catalog changes
   use targeted `index()` or `delete()` calls on individual documents. Full reindex
   only runs via a scheduled job, never synchronously in a request handler.

6. **Always validate ownership before returning order/payment data.** Orders belong to users.
   Check `order.userId === currentUser.sub` before returning. Admin routes use `@Roles()` guard.

7. **The `packages/types` package is the contract between frontend and backend.** If you
   change a type, update both the Prisma schema (if DB-backed) AND the type definition.
   Never diverge them silently.

---

## Tech Stack — Decisions & Rationale

| Technology | Why chosen |
|---|---|
| **Next.js 15 App Router** | Per-page rendering strategy (ISR for catalog, SSR for personalized, SSG for content). Server Components reduce JS bundle. Native image optimization. |
| **Tailwind CSS 4** | JIT, design tokens, pairs with shadcn/ui. Zero runtime CSS. |
| **Zustand** | Minimal boilerplate for cart/auth/comparison state. Persists to localStorage selectively. |
| **TanStack Query** | Handles server state, background refetch, staleTime, optimistic updates for cart. |
| **NestJS** | Enterprise structure (DI, guards, interceptors), native microservice transport, TypeScript-first. |
| **Prisma** | Type-safe ORM, migration-as-code, generated client matches schema exactly. |
| **Elasticsearch** | Powers diamond search: range queries on carat/price, faceted aggregations for filter counts, sub-50ms on 200K diamonds. |
| **Redis** | Cart (sub-ms reads), inventory reservation locking (SET NX), rate limiting, JWT blacklist. |
| **MongoDB** | Jewelry product catalog has variable attributes — document model handles this without nullable columns. |
| **Stripe** | PCI Level 1, Radar fraud, best DX, 135+ currencies. Primary for international. |
| **Razorpay** | UPI, netbanking, EMI on cards — mandatory for India customers. |

---

## Code Style Expectations

### TypeScript

- **Strict mode on** (`strict: true` in all tsconfigs). No `any` except explicitly justified.
- Use `interface` for object shapes, `type` for unions/intersections.
- Prefer `readonly` arrays on function parameters that shouldn't be mutated.
- All async functions must handle errors — use try/catch or NestJS exception filters.

### NestJS conventions

```typescript
// Module structure (always follow this pattern):
// module.ts → imports providers, exports for other modules to use
// service.ts → business logic, injected dependencies
// controller.ts → HTTP layer only, delegates to service
// dto/ → class-validator DTOs for all request bodies

// Guards order: JwtAuthGuard first, then RolesGuard
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(CustomerRole.admin)

// Always use @CurrentUser() decorator to get the authenticated user
@CurrentUser() user: JwtPayload

// DTOs must use class-validator decorators
class CreateThingDto {
  @ApiProperty()
  @IsString()
  @MinLength(1)
  name!: string;
}
```

### React / Next.js conventions

```typescript
// 'use client' only when strictly needed (hooks, browser APIs, event handlers)
// Prefer Server Components for data fetching
// Route groups use parentheses: (auth), (account) — no URL segment

// Zustand stores follow this pattern:
interface StoreState { value: string }
interface StoreActions { setValue: (v: string) => void }
const useStore = create<StoreState & StoreActions>()((set) => ({
  value: '',
  setValue: (v) => set({ value: v }),
}));

// API calls go through lib/api/ files, never fetch() directly in components
// Use TanStack Query for all server data
const { data, isLoading } = useQuery({
  queryKey: ['diamonds', filters],
  queryFn: () => diamondsApi.search(filters),
});
```

### Styling

- Use `cn()` utility (clsx + tailwind-merge) for conditional classes — never string concatenation.
- Custom colors: `gold-*` (brand), `charcoal-*` (text/backgrounds), `diamond-*` (accents).
- Luxury aesthetic: use `font-display` (Playfair Display) for headings, `font-sans` (Inter) for body.
- Animations should feel premium — slow, smooth, intentional. Max 300ms for UI transitions.

### File naming

- Components: `PascalCase.tsx`
- Hooks: `use-kebab-case.ts`
- Utilities: `kebab-case.ts`
- NestJS files: `kebab-case.module.ts`, `kebab-case.service.ts`, etc.

---

## How to Run the Project

### Prerequisites
- Node.js ≥ 18, npm ≥ 10, Docker + Docker Compose

### First-time setup
```bash
# 1. Install all dependencies
npm install

# 2. Copy and fill environment variables
cp .env.example .env

# 3. Start infrastructure
npm run docker:up          # waits for postgres, mongo, redis, elasticsearch

# 4. Run DB migrations + seed
cd services/api
npx prisma migrate dev --name init
npx ts-node prisma/seed.ts
cd ../..

# 5. Start all dev servers
npm run dev
```

### Running individually
```bash
# Frontend only
cd apps/web && npm run dev       # http://localhost:3000

# Backend only
cd services/api && npm run start:dev   # http://localhost:4000

# Swagger UI
open http://localhost:4000/api/docs

# Prisma Studio (DB GUI)
cd services/api && npx prisma studio
```

### Default dev credentials (from seed)
| Role | Email | Password |
|---|---|---|
| Admin | admin@diamondfactory.in | Admin@1234 |
| Customer | customer@test.com | Customer@1234 |

---

## Adding New Features

### New backend module

```bash
# 1. Create the directory structure manually:
services/api/src/my-feature/
  my-feature.module.ts
  my-feature.service.ts
  my-feature.controller.ts
  dto/create-my-feature.dto.ts

# 2. Register in app.module.ts — add to imports array
# 3. Add Prisma model to prisma/schema.prisma if DB-backed
# 4. Run: cd services/api && npx prisma migrate dev --name add_my_feature
# 5. Add types to packages/types/src/ if shared with frontend
```

### New frontend page

```bash
# Create file in apps/web/src/app/path/page.tsx
# Server Components by default (no 'use client')
# Add 'use client' only if using hooks/events
# Add generateMetadata() for SEO on every public page
# Add to sitemap.ts if it's a public-facing URL
```

### New shared type

```bash
# Add to packages/types/src/relevant-file.types.ts
# Export from packages/types/src/index.ts
# No build step needed — consumers resolve .ts source directly
```

### New API endpoint

```bash
# 1. Add route to controller with correct guards
# 2. Implement logic in service
# 3. Add DTO for request body validation
# 4. Add to Swagger with @ApiOperation, @ApiTags
# 5. Add corresponding API function in apps/web/src/lib/api/domain.api.ts
```

---

## Modifying Backend Modules

### Changing the database schema

```bash
# 1. Edit services/api/prisma/schema.prisma
# 2. Generate migration:
cd services/api && npx prisma migrate dev --name describe_your_change
# 3. If you add/remove fields used in TypeScript, update packages/types/ accordingly
# 4. Regenerate client: npx prisma generate
```

**Never edit migration files manually after they've been applied.** Create a new migration instead.

### Adding a new Elasticsearch field to diamond search

```bash
# 1. Add field to DIAMOND_MAPPINGS in elasticsearch.service.ts
# 2. Add corresponding filter logic in diamonds.service.ts → buildSearchQuery()
# 3. Add DTO field in diamonds/dto/search-diamonds.dto.ts
# 4. Add UI filter in apps/web/src/components/diamonds/diamond-filters.tsx
# 5. Reindex: DELETE the diamonds index in Kibana, then restart the API
#    (onModuleInit re-creates it with new mappings)
```

### Adding a new payment gateway

```bash
# 1. Add credentials to config/configuration.ts
# 2. Add to .env.example
# 3. Create handler methods in payments.service.ts
# 4. Add webhook endpoint in payments.controller.ts
#    IMPORTANT: webhook routes need raw body (no global JSON transform)
# 5. Add gateway to PaymentGateway enum in prisma/schema.prisma
```

---

## Modifying Frontend Modules

### Adding to the cart

The cart has two layers:
1. **Zustand store** (`stores/cart.store.ts`) — client-side UI state
2. **Redis via API** (`services/api/src/cart/`) — persistent server state

When a user adds a ring, call `POST /cart/items` via `lib/api/cart.api.ts`, then update the
Zustand store. **Don't use the Zustand store as the source of truth** — it mirrors the server.

### Adding a new admin page

```bash
# File goes in: apps/web/src/app/admin/feature/page.tsx
# The admin layout (apps/web/src/app/admin/layout.tsx) wraps it automatically
# Admin pages should use 'use client' (they use TanStack Query)
# All admin API calls must hit endpoints guarded by @Roles(CustomerRole.admin)
```

### Changing the diamond search URL structure

Diamond search filters live in the URL (`/diamonds?shape=round&caratMin=1`).
State management is in `apps/web/src/lib/hooks/use-diamond-search.ts`.
URL parsing/building utilities are in `apps/web/src/lib/utils.ts` (`buildDiamondSearchUrl`,
`parseDiamondSearchUrl`). Change both together or the filter UI will desync from the URL.

---

## CI/CD Pipeline

### Flow on PR
```
git push → GitHub Actions (ci.yml)
  ├── quality job: tsc --noEmit + eslint + prettier check
  ├── test-backend job: jest with real postgres + redis (via services:)
  ├── build-web job: next build (fails on type errors or missing env vars)
  └── deploy-preview: vercel preview deploy → posts URL as PR comment
```

### Flow on merge to main
```
merge to main → GitHub Actions (ci.yml)
  ├── (same quality + test + build jobs)
  └── deploy-production: vercel --prod
      → live at https://diamondfactory.in

Also triggers docker.yml (if services/api/ changed):
  └── builds API Docker image → pushes to ghcr.io with SHA tag + latest
```

### Required GitHub Secrets
```
VERCEL_TOKEN               # Vercel personal access token
VERCEL_ORG_ID              # From vercel.com project settings
VERCEL_PROJECT_ID          # From vercel.com project settings
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
NEXT_PUBLIC_RAZORPAY_KEY_ID
```

### Failing CI
- TypeScript errors block all deploys — fix them, don't use `// @ts-ignore`.
- Test failures block deploy — fix the test or the code, not the test runner config.
- If Prettier check fails: run `npm run format` locally and push.

---

## Docker & Infrastructure

### Local development (docker-compose.yml)
```yaml
# Services started by npm run docker:up:
postgres    → localhost:5432   (user: postgres, pass: postgres, db: diamondfactory)
mongo       → localhost:27017  (user: mongo, pass: mongo)
redis       → localhost:6379
elasticsearch → localhost:9200 (no auth in dev, security.enabled=false)
kibana      → localhost:5601   (ES visualizer, dev only)
```

All data is persisted to named Docker volumes. To reset:
```bash
npm run docker:down
docker volume rm diamondfactory_postgres_data diamondfactory_mongo_data \
  diamondfactory_redis_data diamondfactory_es_data
npm run docker:up
```

### API Dockerfile (3-stage)
```
Stage 1 (deps):    install all npm deps
Stage 2 (builder): prisma generate + nest build → /dist
Stage 3 (runner):  non-root user, production deps only, dumb-init PID 1
```
Build context is the **repo root**, not `services/api/`, because it needs `packages/types/`.
Always build from root: `docker build -f services/api/Dockerfile .`

### Production infrastructure (planned)
- Frontend: Vercel (auto-scales, edge network, zero config)
- Backend: AWS EKS (Kubernetes), deployed via ArgoCD GitOps (Phase 2)
- Primary region: ap-south-1 (Mumbai) — closest to Surat operations
- RDS PostgreSQL Multi-AZ for order database
- MSK (Managed Kafka) for event streaming (Phase 2)

---

## Important Architecture Decisions

### Diamond availability & reservation
When a customer adds a diamond to cart, we do `SET NX cart:reservation:{diamondId} userId EX 1800`
in Redis. This gives a 30-minute exclusive reservation. On checkout completion (payment webhook),
`isAvailable` is set to false in PostgreSQL and the reservation key is deleted.
On cart abandonment or session expiry, the reservation key auto-expires and the diamond returns
to the available pool. **Never mark a diamond unavailable until payment is confirmed.**

### Cart architecture (two-layer)
- Redis cart: full cart object, 7-day TTL, sub-millisecond reads, used during browsing/checkout
- PostgreSQL `CartSnapshot`: periodic persistence for abandoned cart email recovery
- Zustand store: UI-only mirror, not persisted beyond page reload for non-critical state

### JWT security model
```
Access token:  15-minute TTL, signed with JWT_ACCESS_SECRET, stored in memory (Zustand)
Refresh token: 7-day TTL, signed with JWT_REFRESH_SECRET, stored HttpOnly cookie
Rotation:      Each refresh issues a new refresh token and invalidates the old one (hash stored in DB)
Blacklist:     Logged-out access tokens added to Redis SET (checked in JwtStrategy)
```

### Price computation
All prices stored in the DB in **INR as integers (paise)**. Display formatting via `formatPrice()`
in `lib/utils.ts`. GST is 3% on jewelry/diamonds (Indian tax law). Shipping is free above ₹50,000.
International currencies converted at checkout time via Stripe's currency conversion.

### Elasticsearch vs PostgreSQL for diamonds
Elasticsearch is the **search index** (read-only, eventually consistent).
PostgreSQL is the **source of truth** (availability, price). Diamond detail pages read from
PostgreSQL (via Redis cache). Search results come from Elasticsearch. If they diverge briefly,
that's acceptable — the PostgreSQL check at checkout is authoritative.

---

## Packages & Imports

### Absolute imports in Next.js
The `@/*` alias maps to `apps/web/src/*`:
```typescript
import { Button } from '@/components/ui/button';     // ✅
import { formatPrice } from '@/lib/utils';            // ✅
import { Diamond } from '@diamond-factory/types';     // ✅ (workspace package)
import { Button } from '../../../components/ui/button'; // ❌ never use relative paths
```

### Absolute imports in NestJS
The `@/*` alias maps to `services/api/src/*`:
```typescript
import { PrismaService } from '../database/prisma.service'; // ✅ relative within service
import { Diamond } from '@diamond-factory/types';           // ✅ workspace package
```

---

## Environment Variable Conventions

- Variables prefixed `NEXT_PUBLIC_` are bundled into the browser JS. **Never put secrets there.**
- All secrets (Stripe secret key, DB password, JWT secrets) are server-side only (no prefix).
- NestJS reads env via `ConfigService` using the `config/configuration.ts` factory.
- Default values in `configuration.ts` are for development only — production always uses secrets manager.
- Add every new env var to `.env.example` with a placeholder value and a comment explaining it.

---

## Common Pitfalls

| Pitfall | Solution |
|---|---|
| `workspace:*` in package.json | Use `"*"` instead — this is npm, not pnpm |
| Prisma client not updated after schema change | Run `npx prisma generate` in `services/api/` |
| Diamond search returns stale results after import | The ES index refreshes every 30s — normal |
| `@types/react` version mismatch | Keep `@types/react` aligned with `react` major version |
| Cart desync between Redis and Zustand | Always update server first, then update Zustand on success |
| `rootDir` error in NestJS build | Don't import files outside `services/api/src/` in TS compilation — workspace packages resolve via node_modules symlinks, not relative paths |
| Webhook signature validation fails | Stripe/Razorpay webhooks need raw body — the webhook controller must use `@RawBody()` or disable the global body transform for those routes |
