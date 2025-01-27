# Stage 1: Base system setup
FROM node:23-slim AS base
RUN --mount=type=cache,sharing=locked,target=/var/cache/apt \
    apt-get update -y && \
    apt-get install -y openssl

# Stage 2: Dependencies installation
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
# Use BuildKit cache for npm packages
RUN --mount=type=cache,sharing=locked,id=npm,target=/root/.npm npm ci

# Stage 3: Build stage
FROM deps AS build
WORKDIR /app
COPY . .

# Stage 4: Production stage
FROM base
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app .
RUN npm run prisma:prod:generate
EXPOSE 5555
CMD ["npm", "start"]

