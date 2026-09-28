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

## Deploy (Hostinger)

Produção roda no VPS Hostinger com o `docker-compose.prod.yml`, atrás do Traefik do Docker Manager. Tudo fica num domínio só: `https://<APP_HOST>/api` vai para a `api` e o resto para o `web`. Nenhuma porta é publicada, e o banco só existe na rede interna.

O workflow `.github/workflows/ci.yml` roda lint, tipos, testes, build, os e2e da API (contra um Postgres de serviço) e o build das imagens de produção, em todo pull request e push fora da `main`. A cada push na `main`, o `.github/workflows/deploy.yml` roda esse mesmo CI e, se ele passar, pede à Hostinger que o VPS clone o commit e suba o projeto `vampire`. O build acontece no VPS. Para reimplantar sem commit, rode o workflow **Deploy** pela aba Actions.

Pré-requisitos, feitos uma vez:

1. **Traefik** rodando no VPS como projeto próprio do Docker Manager (catálogo → Traefik), com o entrypoint `websecure` e o cert resolver `letsencrypt`. O template da Hostinger usa `network_mode: host`, então o compose do vampire não entra em rede nenhuma do Traefik.
2. **DNS**: registro `A` do subdomínio (`APP_HOST`) apontando para o IP do VPS. O HTTPS sai sozinho no primeiro acesso.
3. **GitHub** (Settings → Secrets and variables → Actions → aba Secrets):

| Secret | Valor |
|---|---|
| `HOSTINGER_API_KEY` | chave em hPanel → Perfil → API |
| `JWT_SECRET` | `openssl rand -hex 32` |
| `POSTGRES_PASSWORD` | `openssl rand -hex 32` (não troque depois do primeiro deploy) |
| `ADMIN_PASSWORD` | senha do Mestre, 8+ caracteres (letras, números e `!@#%^&*()_+=.,:;?/~-`) |
| `HOSTINGER_VM_ID` | número do `srvNNNNNN.hstgr.cloud` |
| `APP_HOST` | o subdomínio, ex. `vampiro.artbarros.tech` |
| `ADMIN_EMAIL` | e-mail da conta do Mestre |

`JWT_SECRET` e `POSTGRES_PASSWORD` precisam ter só letras e números: a action os coloca numa linha de shell e a senha entra na `DATABASE_URL`. O workflow confere isso antes de chamar a Hostinger.

A conta do Mestre (`role: dm`) é criada pela API ao subir, a partir de `ADMIN_EMAIL` e `ADMIN_PASSWORD`. Para trocar a senha, mude o secret e rode o deploy de novo.

O workflow fica verde quando a Hostinger aceita o pedido, não quando o app sobe. Acompanhe build e logs no Docker Manager, no projeto `vampire`. Os dados ficam no volume `vampire_pgdata` do VPS e sobrevivem aos redeploys. Para voltar atrás, reverta o commit na `main`.

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
