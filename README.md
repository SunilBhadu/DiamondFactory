# Diamond Factory — Luxury Diamond & Jewelry Ecommerce Platform

**Diamond Factory Pvt Ltd** | Dhanlaxmi Estate, 3/2 Vasta Devdi Rd, Surat, Gujarat 395004

A production-grade luxury ecommerce platform built to compete with Blue Nile, Brilliant Earth, and Grown Brilliance.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS 4 |
| Backend | NestJS 10, TypeScript, Prisma ORM |
| Primary DB | PostgreSQL 17 |
| Document DB | MongoDB 7 |
| Search | Elasticsearch 8 |
| Cache | Redis 7 |
| Payments | Stripe + Razorpay |
| Auth | JWT (access + refresh), Google OAuth |
| Infrastructure | Docker, Kubernetes (EKS), Vercel (frontend), AWS |
| CI/CD | GitHub Actions → Vercel |

---

## Project Structure

```
DiamondFactory/
├── apps/
│   └── web/              # Next.js 15 frontend (deploys to Vercel)
├── packages/
│   └── types/            # Shared TypeScript interfaces
├── services/
│   └── api/              # NestJS backend API (deploys to EKS)
│       ├── prisma/       # Database schema & migrations
│       └── src/
│           ├── auth/     # JWT + Google OAuth
│           ├── users/    # User profiles & addresses
│           ├── diamonds/ # Diamond catalog + Elasticsearch search
│           ├── orders/   # Order lifecycle management
│           ├── payments/ # Stripe + Razorpay integration
│           ├── cart/     # Redis-based cart
│           ├── wishlist/ # Wishlist + share links
│           └── health/   # Readiness & liveness probes
├── .github/
│   └── workflows/        # CI/CD pipelines
├── docker-compose.yml    # Local development dependencies
└── turbo.json            # Turborepo task runner config
```

---

## Prerequisites

- **Node.js** >= 18.0.0
- **npm** >= 10.0.0
- **Docker** + **Docker Compose**
- A PostgreSQL client (optional, for direct DB access)

---

## Quick Start

### 1. Clone & install

```bash
git clone https://github.com/your-org/diamond-factory.git
cd diamond-factory
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
# Edit .env with your credentials (database, Stripe, Razorpay, etc.)
```

### 3. Start infrastructure (Docker)

```bash
npm run docker:up
# Starts: PostgreSQL, MongoDB, Redis, Elasticsearch, Kibana
```

Wait ~30 seconds for all services to become healthy:

```bash
docker-compose ps   # all should show "healthy"
```

### 4. Set up the database

```bash
cd services/api

# Run migrations
npx prisma migrate dev --name init

# Seed with sample data (50 diamonds, 12 ring settings, admin user)
npx ts-node prisma/seed.ts
```

### 5. Start development servers

```bash
# From repo root — starts all apps in parallel via Turborepo
npm run dev
```

| Service | URL |
|---|---|
| Frontend (Next.js) | http://localhost:3000 |
| Backend API | http://localhost:4000 |
| API Docs (Swagger) | http://localhost:4000/api/docs |
| Kibana | http://localhost:5601 |

---

## Default Credentials (seed data)

| Role | Email | Password |
|---|---|---|
| Admin | admin@diamondfactory.in | Admin@1234 |
| Customer | customer@test.com | Customer@1234 |

---

## Available Scripts

```bash
# Development
npm run dev               # Start all apps
npm run build             # Build all packages
npm run lint              # Lint all packages
npm run format            # Format all files with Prettier

# Database
npm run db:generate       # Regenerate Prisma client
npm run db:migrate        # Run pending migrations
npm run db:seed           # Seed database with sample data

# Docker
npm run docker:up         # Start infrastructure containers
npm run docker:down       # Stop containers
npm run docker:logs       # Tail container logs
```

---

## Environment Variables

See `.env.example` for the full list. Critical variables:

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `MONGODB_URI` | MongoDB connection string |
| `REDIS_URL` | Redis connection string |
| `ELASTICSEARCH_URL` | Elasticsearch endpoint |
| `JWT_ACCESS_SECRET` | Secret for signing access tokens |
| `JWT_REFRESH_SECRET` | Secret for signing refresh tokens |
| `STRIPE_SECRET_KEY` | Stripe secret key (backend) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key (frontend) |
| `RAZORPAY_KEY_ID` + `RAZORPAY_KEY_SECRET` | Razorpay credentials |
| `GOOGLE_CLIENT_ID` + `GOOGLE_CLIENT_SECRET` | Google OAuth app |

---

## Deployment

### Frontend — Vercel

The frontend deploys automatically on push to `main` via GitHub Actions.

**Manual deploy:**
```bash
cd apps/web
npx vercel --prod
```

**Required Vercel secrets:**
- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

### Backend — Docker / EKS

```bash
# Build API image
docker build -f services/api/Dockerfile -t diamond-factory-api .

# Run locally
docker run -p 4000:4000 --env-file .env diamond-factory-api
```

For Kubernetes deployment, see `infrastructure/helm/` (Phase 2).

---

## API Documentation

Interactive Swagger UI available at `/api/docs` when the backend is running.

Main API groups:
- `POST /auth/register` — Register new account
- `POST /auth/login` — Login
- `GET /diamonds` — Search diamonds with filters
- `GET /diamonds/:id` — Diamond detail
- `GET /cart` — Get cart
- `POST /cart/items` — Add to cart
- `POST /orders` — Create order
- `POST /payments/stripe/intent` — Create Stripe payment intent
- `GET /wishlist` — Get wishlist

---

## Development Workflow

1. Create a feature branch: `git checkout -b feature/my-feature`
2. Make changes
3. Push — GitHub Actions runs type check + lint + tests
4. Open PR — Vercel auto-deploys a preview URL
5. Merge to `main` — deploys to production automatically

---

## Architecture

See the full technical architecture document in [ARCHITECTURE.md](./ARCHITECTURE.md) (generated separately).

Key decisions:
- **PostgreSQL** for orders/payments (ACID compliance)
- **Elasticsearch** for diamond search (faceted filtering, range queries)
- **Redis** for cart + sessions (sub-millisecond reads)
- **JWT in-memory** (access tokens never stored in localStorage)
- **Stripe Elements** + **Razorpay hosted fields** (PCI SAQ-A compliance, card data never touches our servers)

---

## Contact

**Diamond Factory Pvt Ltd**
Dhanlaxmi Estate, 3/2 Vasta Devdi Rd, Tunki, Katargam
Surat, Gujarat 395004, India

Website: https://diamondfactory.in
