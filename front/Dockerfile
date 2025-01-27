# Stage 1: Base system setup
FROM node:22-slim AS base
RUN --mount=type=cache,sharing=locked,target=/var/cache/apt \
    apt-get update -y && \
    apt-get install -y openssl
ENV NODE_ENV=production
ARG COOLIFY_FQDN
ENV NUXT_PUBLIC_HOSTNAME=$COOLIFY_FQDN
ARG DATABASE_URL

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install -g nuxt
RUN npm install -g prisma
RUN npm ci
COPY . .
RUN prisma generate
RUN npm run build

EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
