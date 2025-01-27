# Stage 1: Base system setup
FROM node:22-slim AS base

# Install system dependencies
RUN --mount=type=cache,sharing=locked,target=/var/cache/apt \
    apt-get update -y && \
    apt-get install -y openssl

# Set environment variables
ENV NODE_ENV=production
ARG COOLIFY_FQDN
ENV NUXT_PUBLIC_HOSTNAME=$COOLIFY_FQDN
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
