# ── Stage 1: Install all dependencies ────────────────────────────────────────
FROM node:18-alpine AS deps
WORKDIR /app

# Install OpenSSL for Prisma
RUN apk add --no-cache openssl

COPY package*.json ./
COPY services/api/package*.json ./services/api/
COPY packages/types/package*.json ./packages/types/

RUN npm ci --workspace=services/api --workspace=packages/types --if-present

# ── Stage 2: Build ────────────────────────────────────────────────────────────
FROM node:18-alpine AS builder
WORKDIR /app

RUN apk add --no-cache openssl

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/services/api/node_modules ./services/api/node_modules
COPY packages/types ./packages/types
COPY services/api ./services/api
COPY tsconfig.base.json ./

# Generate Prisma client
RUN cd services/api && npx prisma generate

# Build the NestJS app
RUN cd services/api && npm run build

# ── Stage 3: Production runner ────────────────────────────────────────────────
FROM node:18-alpine AS runner
WORKDIR /app

RUN apk add --no-cache openssl dumb-init

# Run as non-root user
RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nestjs

# Copy production deps
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/services/api/node_modules ./services/api/node_modules
COPY --from=builder /app/services/api/dist ./services/api/dist
COPY --from=builder /app/services/api/prisma ./services/api/prisma

# Prisma client is generated into node_modules — already copied above
COPY services/api/package.json ./services/api/

USER nestjs

EXPOSE 4000

WORKDIR /app/services/api

ENV NODE_ENV=production

ENTRYPOINT ["/usr/bin/dumb-init", "--"]
CMD ["node", "dist/main.js"]
