# Base system setup
FROM node:23-slim

# Install system dependencies
RUN --mount=type=cache,sharing=locked,target=/var/cache/apt \
    apt-get update -y && \
    apt-get install -y openssl

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN --mount=type=cache,sharing=locked,target=/root/.npm \
    npm ci

# Copy the rest of the application code
COPY . .

# Generate Prisma client and build the application
RUN npm run prisma:prod:generate

# Expose the application port
EXPOSE 5555

# Start the application
CMD ["npm", "start"]

