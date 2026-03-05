FROM node:23-bookworm-slim AS base

WORKDIR /app

RUN apt-get update && \
    apt-get purge -y --auto-remove -o Apt::AutoRemove::RecommendsImportant=false && \
    rm -rf /var/lib/apt/lists/*

RUN useradd -r -s /bin/false nodejs

FROM base AS build

WORKDIR /app
COPY uql/package*.json ./
COPY uql/tsconfig.json ./

RUN npm ci

COPY uql/src ./src
RUN npm run build

FROM base AS production

WORKDIR /app
ENV NODE_ENV=production

COPY uql/package*.json ./

RUN npm ci --omit=dev

COPY --from=build /app/dist ./dist

RUN chown -R nodejs:nodejs /app

USER nodejs

CMD ["node", "dist/index.js"]