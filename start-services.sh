#!/bin/bash

# Create logs directory
mkdir -p /app/logs

# Start main server with logging
touch /app/logs/nuxt.log
node .output/server/index.mjs > /app/logs/nuxt.log 2>&1 &

# Start Prisma Studio with logging
touch /app/logs/prisma.log
npm run prisma:studio > /app/logs/prisma.log 2>&1 &

# Follow all logs
tail -f /app/logs/*.log
