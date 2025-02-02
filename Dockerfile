# Stage 1: Base system setup
FROM node:22-slim AS base

# Install system dependencies
ENV DEBIAN_FRONTEND=noninteractive
RUN --mount=type=cache,sharing=locked,target=/var/cache/apt \
    apt-get update -y && \
    apt-get install -y --no-install-recommends openssl wget && \
    rm -rf /var/lib/apt/lists/*

# Set environment variables
ENV NODE_ENV=production
ARG DATABASE_URL
ARG NUXT_PUBLIC_HOSTNAME

# Set working directory
WORKDIR /app

# Install global npm packages
RUN npm install -g nuxt prisma

# Copy dependency files first
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies with cache
RUN --mount=type=cache,sharing=locked,target=/root/.npm \
    npm ci

# Copy the rest of the application code
COPY . .

# Run build commands
RUN --mount=type=cache,target=/project/.nuxt/cache \
    --mount=type=cache,target=/project/node_modules/.cache \
    npm run prisma:generate && \
    npm run nuxt:build

# Expose the application ports
EXPOSE 3000 5555

COPY start-services.sh /start-services.sh
RUN chmod +x /start-services.sh
CMD ["/start-services.sh"]
