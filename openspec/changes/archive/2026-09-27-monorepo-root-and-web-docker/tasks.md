## 1. Raiz do repositório

- [x] 1.1 Criar `.gitignore` na raiz (node_modules, dist, .output, coverage, .env, *.tsbuildinfo, `openspec/*.py`, `openspec/*.txt`, `__pycache__/`) e remover `api/.gitignore`, que fica coberto
- [x] 1.2 Criar `pnpm-workspace.yaml` na raiz com `packages: [api, web]` e a união dos `allowBuilds`; remover `api/pnpm-workspace.yaml` e `web/pnpm-workspace.yaml`
- [x] 1.3 Criar `package.json` na raiz (`private`, `packageManager: pnpm@11.22.0`, scripts `dev`, `dev:api`, `dev:web`, `build`, `test`, `typecheck`, `check`, `fix`) e tirar `packageManager` de `api/package.json`
- [x] 1.4 Remover `api/pnpm-lock.yaml`, `web/pnpm-lock.yaml`, os `node_modules` antigos, `node_modules/.vite` da raiz e `api/data/`; rodar `pnpm install` na raiz e conferir que só existe o lockfile da raiz

## 2. Servidor de produção do web

- [x] 2.1 Adicionar a dev dependency `nitro` (versão exata) ao `web` e `nitro()` aos plugins de `web/vite.config.ts`
- [x] 2.2 Adicionar o script `start` (`node .output/server/index.mjs`) em `web/package.json`
- [x] 2.3 Rodar `pnpm --filter web build` e `pnpm --filter web start`, e conferir que `/` e um asset de `/assets/` respondem `200`

## 3. Docker

- [x] 3.1 Criar `.dockerignore` na raiz e remover `api/.dockerignore`
- [x] 3.2 Reescrever `api/Dockerfile` para usar a raiz como contexto (install filtrado com lockfile congelado, build, `pnpm deploy --prod`, runtime igual ao atual)
- [x] 3.3 Criar `web/Dockerfile` (install filtrado, build com `ARG VITE_API_URL`, runtime `node:24-alpine` só com `.output/`, usuário `node`, porta 3000)
- [x] 3.4 Criar `docker-compose.yml` na raiz (`name: vampire`, `db`, `api`, `web`, portas `DB_PORT`/`API_PORT`/`WEB_PORT`, `VITE_API_URL` e `CORS_ORIGIN` derivados das portas) e `.env.example` na raiz; remover `api/docker-compose.yml`
- [x] 3.5 Derrubar os containers do compose antigo sem apagar o volume, rodar `docker compose up --build -d` na raiz e conferir `/api/health` = 200, `http://localhost:3000` = 200, o preflight de CORS vindo de `http://localhost:3000` e a imagem do web só com `.output/`, rodando como `node`

## 4. Documentação e verificação

- [x] 4.1 Criar `README.md` na raiz (estrutura, `pnpm install`, `pnpm dev`, `docker compose up --build`, variáveis do `.env` da raiz)
- [x] 4.2 Atualizar as seções de Docker e de desenvolvimento de `api/README.md` e `web/README.md` (compose e install na raiz, `pnpm start` no lugar de `pnpm preview`)
- [x] 4.3 Rodar `pnpm test`, `pnpm typecheck` e `pnpm check` na raiz sem erros
- [x] 4.4 Conferir que nada ficou órfão: nenhuma referência a `api/docker-compose.yml`, `cd api && docker compose`, lockfiles ou workspaces dos pacotes, e `git status` sem `node_modules/`, `dist/` nem `.output/`
