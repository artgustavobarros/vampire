# syntax=docker/dockerfile:1
# contexto de build: a raiz do repositório (workspace pnpm)

FROM node:24-alpine AS base
RUN npm install -g pnpm@11.22.0
WORKDIR /app

FROM base AS build
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY web/package.json web/
RUN --mount=type=cache,id=pnpm-store,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile --filter web
COPY web web
# o navegador chama a API direto, então a URL entra no bundle na hora do build
ARG VITE_API_URL=http://localhost:3333/api
ENV VITE_API_URL=$VITE_API_URL
RUN pnpm --filter web build

# o servidor do Nitro já traz as dependências que usa
FROM node:24-alpine AS runtime
ENV NODE_ENV=production
ENV PORT=3000
WORKDIR /app
COPY --from=build --chown=node:node /app/web/.output ./.output
USER node
EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
