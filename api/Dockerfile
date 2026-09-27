# syntax=docker/dockerfile:1
# contexto de build: a raiz do repositório (workspace pnpm)

FROM node:24-alpine AS base
RUN npm install -g pnpm@11.22.0
WORKDIR /app

# todas as dependências da api, para compilar
FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY api/package.json api/
RUN --mount=type=cache,id=pnpm-store,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile --filter api

FROM deps AS build
COPY api api
RUN pnpm --filter api build

# só as dependências de produção, fora do layout do workspace
FROM deps AS prod-deps
RUN --mount=type=cache,id=pnpm-store,target=/root/.local/share/pnpm/store \
    pnpm --filter api deploy --prod /prod/api

FROM node:24-alpine AS runtime
ENV NODE_ENV=production
WORKDIR /app
COPY --chown=node:node api/package.json ./
COPY --from=prod-deps --chown=node:node /prod/api/node_modules ./node_modules
COPY --from=build --chown=node:node /app/api/dist ./dist
COPY --chown=node:node api/drizzle ./drizzle
USER node
EXPOSE 3333
# aplica as migrações e sobe o servidor
CMD ["sh", "-c", "node dist/db/migrate.js && exec node dist/main.js"]
