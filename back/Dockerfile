# Stage 1: Base system setup
FROM node:23-slim AS base
RUN --mount=type=cache,target=/var/cache/apt \
    apt-get update -y && \
    apt-get install -y openssl

# enable pnpm
RUN corepack enable pnpm

# Stage 2: Dependencies installation
FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
# Use BuildKit cache for pnpm packages
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# Stage 3: Build stage
FROM deps AS build
WORKDIR /app
COPY . .

# Stage 4: Production stage
FROM base
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app .
RUN pnpm prisma:prod:generate   
EXPOSE 5555
CMD ["pnpm", "start"]

