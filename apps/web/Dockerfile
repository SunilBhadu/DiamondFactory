# ── Stage 1: Install dependencies ─────────────────────────────────────────────
FROM node:18-alpine AS deps
WORKDIR /app

RUN apk add --no-cache libc6-compat

COPY package*.json ./
COPY apps/web/package*.json ./apps/web/
COPY packages/types/package*.json ./packages/types/

RUN npm ci --workspace=apps/web --workspace=packages/types --if-present

# ── Stage 2: Build ────────────────────────────────────────────────────────────
FROM node:18-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/web/node_modules ./apps/web/node_modules
COPY packages/types ./packages/types
COPY apps/web ./apps/web
COPY tsconfig.base.json ./

# Build-time public env vars
ARG NEXT_PUBLIC_APP_URL
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
ARG NEXT_PUBLIC_RAZORPAY_KEY_ID

ENV NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL \
  NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL \
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=$NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY \
  NEXT_PUBLIC_RAZORPAY_KEY_ID=$NEXT_PUBLIC_RAZORPAY_KEY_ID

RUN cd apps/web && npm run build

# ── Stage 3: Production runner ─────────────────────────────────────────────────
FROM node:18-alpine AS runner
WORKDIR /app

RUN apk add --no-cache dumb-init

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

# Copy Next.js standalone output
COPY --from=builder /app/apps/web/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static

USER nextjs

EXPOSE 3001

ENV NODE_ENV=production \
  PORT=3001 \
  HOSTNAME=0.0.0.0

ENTRYPOINT ["/usr/bin/dumb-init", "--"]
CMD ["node", "apps/web/server.js"]
