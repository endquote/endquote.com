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

# Set working directory
WORKDIR /app

# Install global npm packages
RUN npm install -g nuxt prisma

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN --mount=type=cache,sharing=locked,target=/root/.npm \
    npm ci

# Copy the rest of the application code
COPY . .

# Generate Prisma client and build the application
RUN prisma generate
RUN npm run build

# Expose the application port
EXPOSE 3000

# Start the application
CMD ["node", ".output/server/index.mjs"]
