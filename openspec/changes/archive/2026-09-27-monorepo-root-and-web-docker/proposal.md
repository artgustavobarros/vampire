## Why

`api/` e `web/` já estão no mesmo repositório git, mas a raiz não funciona como projeto: não há `.gitignore` (por isso `node_modules/` e as pastas de ferramentas aparecem como não versionadas), cada pasta tem seu próprio lockfile e workspace do pnpm, e o `docker compose` fica em `api/` e só sobe o banco e a API. Para ver o app inteiro rodando é preciso subir o Docker e, em outro terminal, o `web` na mão. Além disso, o build do `web` gera só um handler `fetch` (`dist/server/server.js`), que não abre porta nenhuma, então hoje nem dá para rodar o `web` num container.

## What Changes

- A raiz vira um workspace pnpm (`pnpm-workspace.yaml` com `api` e `web`), com um só `pnpm-lock.yaml` e um `package.json` com scripts que rodam nos dois pacotes (`dev`, `build`, `test`, `typecheck`, `check`, `fix`). **BREAKING** (para quem desenvolve): somem `api/pnpm-lock.yaml`, `api/pnpm-workspace.yaml`, `web/pnpm-lock.yaml` e `web/pnpm-workspace.yaml`, e o `pnpm install` passa a rodar na raiz.
- `.gitignore` na raiz. As pastas de ferramentas (`.claude/`, `.agent/`, `.agents/`, `.codex/`, `skills-lock.json`) ficam versionáveis; os scripts e textos soltos de `openspec/` (`*.py`, `*.txt`, `__pycache__/`) são ignorados.
- O `web` ganha o plugin `nitro/vite`: o build gera um servidor Node autocontido em `web/.output/`, iniciado com `pnpm start`.
- Novo `web/Dockerfile` multi-stage. A URL da API entra na imagem pelo build arg `VITE_API_URL`, e a imagem final contém só `.output/`.
- **BREAKING**: `api/docker-compose.yml` vai para `docker-compose.yml` na raiz, com os serviços `db`, `api` e `web`. `docker compose up --build` na raiz sobe o app inteiro. O `api/Dockerfile` passa a usar a raiz como contexto de build.
- Limpeza: `api/.dockerignore` e `api/.gitignore` são substituídos pelos da raiz; saem as sobras `api/data/` e `node_modules/.vite` da raiz. Os READMEs são atualizados e ganham um `README.md` na raiz.

## Capabilities

### New Capabilities
- `monorepo-workspace`: a raiz do repositório como workspace pnpm (pacotes, lockfile único, scripts da raiz, `.gitignore`).
- `web-platform`: build de produção do `web` como servidor Node (Nitro), imagem Docker do `web` e URL da API por build arg.

### Modified Capabilities
- `api-platform`: o projeto da API passa a ser um pacote do workspace (não mais independente, com lockfile próprio), e o requisito de Docker/Compose passa a descrever o compose da raiz, que também sobe o `web`.

## Impact

- Novos na raiz: `package.json`, `pnpm-workspace.yaml`, `pnpm-lock.yaml`, `.gitignore`, `.dockerignore`, `docker-compose.yml`, `.env.example`, `README.md`.
- `api/`: `Dockerfile` (contexto da raiz, `pnpm deploy`), `package.json` (sai `packageManager`), README; removidos `docker-compose.yml`, `.dockerignore`, `.gitignore`, `pnpm-lock.yaml`, `pnpm-workspace.yaml`.
- `web/`: `vite.config.ts` (plugin Nitro), `package.json` (dependência `nitro`, script `start`), novo `Dockerfile`, README; removidos `pnpm-lock.yaml` e `pnpm-workspace.yaml`.
- Dependências: nova dev dependency `nitro` no `web`. Unificar os lockfiles pode atualizar versões dentro dos ranges (`@tanstack/*` está em `latest`).
- Os containers e o volume `vampire_pgdata` continuam os mesmos: o compose da raiz mantém `name: vampire` e os nomes dos serviços.
