# Ficha · Vampiro: A Máscara V5

Ficha de personagem V5 com contas e fichas guardadas numa API. Monorepo pnpm:

```
api/        backend NestJS + PostgreSQL (veja api/README.md)
web/        app TanStack Start (veja web/README.md)
openspec/   specs e changes do OpenSpec
design/     referências visuais do app
```

## Subir tudo com Docker

```bash
docker compose up --build
```

| Serviço | Endereço |
|---|---|
| `web` | http://localhost:3000 |
| `api` | http://localhost:3333/api (Swagger em `/api/docs`) |
| `db` | `localhost:5432` (usuário, senha e banco `vampire`) |

A imagem do `web` é a build de produção (servidor Node do Nitro). Como é o navegador que chama a API, a URL dela (`VITE_API_URL`) entra na imagem durante o build.

Para trocar portas ou o segredo do JWT, copie `.env.example` para `.env` nesta pasta. Se você mudar `API_PORT` ou `WEB_PORT`, o compose ajusta sozinho a `VITE_API_URL` do `web` e o `CORS_ORIGIN` da API; rode `docker compose up --build` de novo para refazer a imagem do `web`.

Os dados ficam no volume `vampire_pgdata`: `docker compose down` mantém, `docker compose down -v` apaga.

## Desenvolver

```bash
pnpm install                 # instala api e web
docker compose up -d db      # só o banco
cp api/.env.example api/.env
pnpm --filter api db:migrate
pnpm dev                     # API em :3333 (watch) e web em :3000 (Vite)
```

| Script (na raiz) | O que faz |
|---|---|
| `pnpm dev` | API em modo watch e `web` em dev, em paralelo |
| `pnpm build` | build dos dois pacotes |
| `pnpm test` | testes unitários dos dois pacotes |
| `pnpm typecheck` | TypeScript sem emitir, nos dois |
| `pnpm check` / `pnpm fix` | lint e formatação (Ultracite/Biome), nos dois |

Para rodar um script de um pacote só: `pnpm --filter api test:e2e`, `pnpm --filter web generate-routes`…
