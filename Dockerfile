# syntax=docker/dockerfile:1.7

FROM node:20-slim AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM node:20-slim AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Dépendances nécessaires à Chromium (utilisé par react-snap/puppeteer)
RUN apt-get update && apt-get install -y --no-install-recommends \
  libx11-xcb1 libnss3 libatk1.0-0 libatk-bridge2.0-0 libxss1 \
  libgtk-3-0 libasound2 libxshmfence1 libgbm1 libglu1-mesa \
  libpangocairo-1.0-0 libxrandr2 libxcomposite1 libxcursor1 \
  libxi6 libxdamage1 libx11-6 libxcb1 libxext6 libxfixes3 \
  fonts-dejavu-core ca-certificates && rm -rf /var/lib/apt/lists/*
RUN npm run build

# --- au choix: servir statique ou via ton serveur Express ---
# 1) statique (vite + "serve")
FROM node:20-slim AS runner
WORKDIR /app
RUN npm i -g serve
COPY --from=build /app/dist ./dist
EXPOSE 8080
CMD ["serve", "-s", "dist", "-l", "8080"]

# 2) si tu utilises ton server Express, remplace le bloc runner par:
# FROM node:20-slim AS runner
# WORKDIR /app
# COPY --from=build /app . 
# ENV NODE_ENV=production PORT=8080
# EXPOSE 8080
# CMD ["node","server/server.js"]
