## Context

- Um único `.git` na raiz já versiona `api/` e `web/`, mas a raiz não tem `package.json`, `.gitignore` nem compose.
- Cada pacote tem seu `pnpm-lock.yaml` e um `pnpm-workspace.yaml` usado só para `allowBuilds`. As versões das ferramentas em comum são as mesmas (Biome 2.5.12, Ultracite 7.12.0, Vitest 5, TypeScript 6, zod 4.6.5).
- `api/docker-compose.yml` (projeto `vampire`, volume `vampire_pgdata`) sobe `db` e `api`. Os containers estão rodando.
- O `web` é TanStack Start sem adaptador de deploy: `vite build` gera `dist/server/server.js`, que só exporta `{ fetch }` e não abre porta.
- O `web` chama a API do navegador (token no `localStorage`, nenhuma rota busca dados no servidor), com a URL base vinda de `import.meta.env.VITE_API_URL`, que é fixada no build.

## Goals / Non-Goals

**Goals:**
- `pnpm install`, `pnpm test`, `pnpm typecheck`, `pnpm check` e `pnpm dev` na raiz.
- `docker compose up --build` na raiz sobe `db`, `api` e `web` como em produção.
- Manter o banco já existente (volume `vampire_pgdata`).

**Non-Goals:**
- Dev com hot reload dentro do Docker.
- Proxy `/api` pelo `web` (mesma origem, sem CORS). Fica para uma mudança futura.
- CI e pacotes compartilhados entre `api` e `web` (ex.: tipos da ficha).

## Decisions

### Workspace pnpm com lockfile único
`pnpm-workspace.yaml` na raiz com `packages: [api, web]` e a união dos `allowBuilds` dos dois (`@scarf/scarf: false`, `@swc/core`, `esbuild`, `lightningcss`). O lockfile é gerado de novo a partir dos `package.json`; os dois lockfiles antigos saem.
- Alternativa: só o compose na raiz, com dois lockfiles. Descartada pela escolha do usuário: cada pacote continuaria sendo instalado e verificado em separado.
- `packageManager` sai de `api/package.json` e vai para a raiz; o `engines.node` fica em `api`.

### Scripts da raiz
`build`, `test`, `typecheck`, `check` e `fix` usam `pnpm -r <script>`. `dev` usa `pnpm run "/^dev:/"` com `dev:api` (`pnpm --filter api start:dev`) e `dev:web` (`pnpm --filter web dev`). O pnpm roda em paralelo os scripts que casam com a regex, sem precisar criar um `dev` na API.

### Nitro como servidor do web
`nitro()` de `nitro/vite` entra nos plugins do `vite.config.ts` (é o caminho que a doc de hosting do TanStack Start recomenda para Node e Docker). O build gera `web/.output/server/index.mjs`, com as dependências dentro, e ganha o script `start`. O `vitest.config.ts` é separado e não carrega o plugin.
- Alternativa: `vite preview` no container. Descartada: precisa de todas as dependências na imagem e não serve para produção.
- Alternativa: embrulhar o `{ fetch }` com `srvx`. Descartada: mais uma peça que o framework não documenta como padrão.

### Dockerfiles com a raiz como contexto
Com um lockfile só, os dois Dockerfiles copiam primeiro `package.json`, `pnpm-lock.yaml`, `pnpm-workspace.yaml` e o `package.json` do pacote, rodam `pnpm install --frozen-lockfile --filter <pacote>` (camada em cache) e só depois o código.
- **web**: `pnpm --filter web build` com `ARG VITE_API_URL=http://localhost:3333/api`. A imagem final (`node:24-alpine`, usuário `node`) só tem `.output/`.
- **api**: `pnpm --filter api build`; as dependências de produção saem de `pnpm deploy --filter api --prod`. A imagem final tem `package.json`, `node_modules`, `dist` e `drizzle`, e o mesmo `CMD` de hoje (migra e sobe).
- Um `.dockerignore` na raiz (`**/node_modules`, `**/dist`, `**/.output`, `**/.env`, `.git`, `openspec`, `design`, pastas de ferramentas…) substitui o `api/.dockerignore`.

### URL da API por build arg
O `web` do compose recebe `VITE_API_URL=${VITE_API_URL:-http://localhost:${API_PORT:-3333}/api}` como build arg. O `CORS_ORIGIN` da API passa a ter o padrão `http://localhost:${WEB_PORT:-3000}`, para os dois lados continuarem batendo quando alguém troca as portas.
- Alternativa: proxy `/api` pelo Nitro. Fica para depois (Non-Goals).

### Compose na raiz com as mesmas identidades
`docker-compose.yml` na raiz mantém `name: vampire` e os serviços `db` e `api`, então o `docker compose up` na raiz reaproveita o volume `vampire_pgdata` e substitui os containers atuais. As portas publicadas viram `DB_PORT`, `API_PORT` e `WEB_PORT`; o antigo `PORT` do compose passa a se chamar `API_PORT`, porque na raiz ele não diz de qual serviço é. Um `.env.example` na raiz lista essas variáveis. O `api/.env` continua existindo, mas só para rodar a API fora do Docker.

### .gitignore na raiz
O `.gitignore` da raiz cobre o que o `api/.gitignore` cobria, então este sai. O `web/.gitignore` do scaffold fica, porque tem entradas próprias do TanStack/Nitro.

## Risks / Trade-offs

- [Lockfile novo pode subir versões, principalmente `@tanstack/*` em `latest`] → rodar `pnpm test`, `pnpm typecheck` e `pnpm check` na raiz depois da troca; se algo quebrar, fixar a versão.
- [Nitro 3 ainda é beta] → versão exata no `package.json`; o escopo do plugin é só o build de produção, e o dev continua sendo o Vite.
- [Comportamento do `pnpm deploy` no pnpm 11 com workspace] → validar construindo a imagem da API; se for preciso, ligar `injectWorkspacePackages` ou usar `--legacy`.
- [`VITE_API_URL` fica fixo na imagem] → trocar de ambiente exige rebuild; aceitável até existir o proxy `/api`.
- [Quem tinha `PORT` no `api/.env` para o compose] → documentado no README: no compose da raiz a porta da API é `API_PORT`.

## Migration Plan

1. Derrubar os containers atuais com `docker compose -f api/docker-compose.yml down` (sem `-v`, para manter o volume).
2. Aplicar a mudança e rodar `pnpm install` na raiz.
3. `docker compose up --build` na raiz. Como o volume é o mesmo, as contas e fichas continuam lá.
4. Rollback: `git checkout` dos arquivos antigos e `docker compose -f api/docker-compose.yml up --build`; o volume não é tocado.
