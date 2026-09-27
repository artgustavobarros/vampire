## Why

Hoje o app `web` guarda contas (com senha em texto puro) e fichas só no `localStorage` do navegador (`vtm5.accounts`, `vtm5.session`, `vtm5.name.<email>`, `vtm5.sheet.<email>`). Isso prende o jogador a um único dispositivo, perde tudo se o navegador for limpo e não tem autenticação de verdade. Precisamos de um backend para, numa próxima etapa, trocar esse armazenamento local por uma API. Esta mudança foca em deixar o backend de pé e rodando; a integração com o `web` fica para depois.

## What Changes

- Nova pasta `api/` com um projeto NestJS (TypeScript, pnpm), independente do `web/`.
- Banco PostgreSQL controlado pelo Drizzle ORM (schema em TypeScript, migrações SQL geradas pelo `drizzle-kit` e versionadas).
- Autenticação JWT (access token Bearer), com senha guardada como hash.
- Endpoints que espelham o que o `web` faz hoje com o `localStorage`:
  - `POST /api/auth/signup` — criar conta (nome, e-mail, senha) e já devolver o token.
  - `POST /api/auth/login` — entrar e receber o token.
  - `GET /api/auth/me` — jogador da sessão (substitui `vtm5.session` + `vtm5.name.<email>`).
  - `GET /api/me/sheet` — ficha do jogador (um personagem por jogador, como no `web`).
  - `PUT /api/me/sheet` — grava a ficha inteira.
  - `PATCH /api/me/sheet` — mescla campos de primeiro nível, como o `patch` do character store.
  - `GET /api/health` — saúde do serviço e do banco.
- Docker: `Dockerfile` multi-stage da API e `docker-compose.yml` com Postgres + API; as migrações rodam ao subir o container.
- Configuração por variáveis de ambiente validadas na inicialização, com `.env.example`.
- Correção de permissão da pasta `api/` existente (hoje pertence ao `root` e contém só um `data/pg` vazio, sobra de um volume Docker).

## Capabilities

### New Capabilities
- `api-platform`: projeto NestJS em `api/`, configuração por ambiente, conexão Drizzle/Postgres com migrações, Docker/Compose, CORS para o `web`, formato de erros e endpoint de saúde.
- `api-auth`: cadastro, login e sessão com JWT; hash de senha; guarda global que protege as rotas por padrão.
- `api-sheets`: leitura, gravação completa e mescla parcial da ficha do jogador autenticado, guardada como JSON sem aplicar as regras do jogo.

### Modified Capabilities
<!-- nenhuma: o `web` continua usando o `localStorage` nesta mudança -->

## Impact

- Código novo: `api/` inteiro (`src/`, `drizzle/`, `Dockerfile`, `docker-compose.yml`, `.env.example`, `package.json`).
- Nenhuma mudança em `web/` nesta etapa; o contrato dos endpoints já segue o formato `Sheet` de `web/src/lib/types.ts` para a integração futura.
- Dependências novas (só em `api/`): `@nestjs/*`, `@nestjs/jwt`, `@nestjs/config`, `drizzle-orm`, `drizzle-kit`, `pg`, `bcryptjs`, `zod`.
- Infra: Docker e Docker Compose necessários para subir Postgres e a API; portas padrão `3333` (API) e `5432` (Postgres).
