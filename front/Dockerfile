# Stage 1: Base system setup
FROM node:23-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV NODE_ENV=production
ARG COOLIFY_FQDN
ENV NUXT_PUBLIC_HOSTNAME=$COOLIFY_FQDN

# enable pnpm
RUN corepack enable pnpm

# Stage 2: Dependencies installation
FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
# Use BuildKit cache for pnpm packages
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile --prod

# Stage 3: Build stage
FROM deps AS build
WORKDIR /app
COPY . .
RUN pnpm build

# Stage 4: Production stage
FROM base
WORKDIR /app
COPY --from=build /app/.output .output
EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
