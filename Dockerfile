# Multi-stage Dockerfile for Vite + React app
# Build stage
FROM node:18-alpine AS build

WORKDIR /app

# Install pnpm (v9 matches pnpm-lock.yaml lockfileVersion: '9.0')
RUN npm install -g pnpm@9

# Copy package manifests first to leverage Docker cache
COPY package.json pnpm-lock.yaml ./

# Install dependencies (allow updating lockfile if package.json changed)
RUN pnpm install --no-frozen-lockfile

# Copy rest of the source
COPY . .

# Build the app (produces /app/dist)
RUN pnpm run build

# Production stage: run a small Node server to serve static files
FROM node:18-alpine AS prod

WORKDIR /app

# Copy built assets
COPY --from=build /app/dist ./dist

# Copy server and package files to run the static server
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm@9 && pnpm install
COPY server.js ./

EXPOSE 80

CMD ["node", "server.js"]
