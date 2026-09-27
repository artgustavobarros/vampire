## 1. Preparar a pasta e o projeto

- [x] 1.1 Corrigir a permissão de `api/` (`sudo chown -R $USER:$USER api`) e apagar `api/data/` (sobra do bind mount antigo)
- [x] 1.2 Criar o projeto NestJS em `api/` com pnpm (Nest 12, ESM, TypeScript 6), sem git próprio e sem o exemplo `AppController`/`AppService`
- [x] 1.3 Usar Biome/Ultracite como no `web`, ajustando o `biome.json` para aceitar os decorators e a injeção do Nest
- [x] 1.4 Criar `api/.gitignore` (`node_modules`, `dist`, `.env`, `coverage`)
- [x] 1.5 Adicionar as dependências: `@nestjs/config`, `@nestjs/jwt`, `drizzle-orm`, `pg`, `bcryptjs`, `zod`; e de desenvolvimento: `drizzle-kit`, `@types/pg`, `vitest`, `unplugin-swc`, `@swc/core`, `supertest`, `@types/supertest`
- [x] 1.6 Adicionar os scripts `db:generate`, `db:migrate`, `test:e2e` ao `package.json`

## 2. Configuração

- [x] 2.1 Criar `src/config/env.ts` com o schema zod (`PORT`=3333, `DATABASE_URL` obrigatório, `JWT_SECRET` obrigatório com ≥ 32 caracteres, `JWT_EXPIRES_IN`=`7d`, `CORS_ORIGIN`=`http://localhost:3000`)
- [x] 2.2 Registrar `ConfigModule.forRoot({ isGlobal: true, validationSchema })` no `AppModule`
- [x] 2.3 Criar `api/.env.example` com valores de desenvolvimento que batem com o compose

## 3. Banco com Drizzle

- [x] 3.1 Criar `src/db/schema.ts` com as tabelas `users` e `sheets` (uuid, `email` único, `user_id` único com `on delete cascade`, `data jsonb`, timestamps)
- [x] 3.2 Criar `drizzle.config.ts` apontando para o schema, `out: "./drizzle"` e `DATABASE_URL`
- [x] 3.3 Criar `DbModule` global com provider `DRIZZLE` (Pool do `pg` + `drizzle()` com o schema), ouvir o `error` do Pool e fechá-lo no shutdown
- [x] 3.4 Criar `src/db/migrate.ts` usando o migrator do `drizzle-orm` (sem `drizzle-kit`) e ligar ao script `db:migrate`
- [x] 3.5 Gerar a primeira migração com `pnpm db:generate` e versionar `api/drizzle/`

## 4. Infra comum

- [x] 4.1 Em `main.ts`: prefixo global `api`, CORS pelas origens de `CORS_ORIGIN` com cabeçalho `Authorization`, limite de corpo JSON de 1 MB, `enableShutdownHooks()`
- [x] 4.2 Registrar o `StandardSchemaValidationPipe` global respondendo `400` com a primeira mensagem do zod
- [x] 4.3 Criar filtro global de exceções: `message` sempre string, `500` genérico com log para erros desconhecidos
- [x] 4.4 Garantir que o `413` de corpo grande e o JSON malformado saiam em JSON no mesmo formato, em português
- [x] 4.5 Criar os decorators `@Public()` e `@CurrentUser()`

## 5. Saúde

- [x] 5.1 Criar `HealthController` público em `GET /api/health` que roda `select 1` e responde `200 { status: "ok", db: "up" }` ou `503 { status: "error", db: "down" }`

## 6. Autenticação

- [x] 6.1 Criar `UsersService` (`findById`, `findByEmail`, `create`) sobre o Drizzle
- [x] 6.2 Criar os schemas zod de `signup` e `login` com normalização de e-mail/nome e as mensagens `Informe e-mail e senha.`, `E-mail inválido.`, `Informe o nome.`, `A senha precisa ter pelo menos 6 caracteres.`
- [x] 6.3 Criar `AuthService`: cadastro com hash `bcryptjs` (custo 10), `409` `E-mail já cadastrado. Use "Entrar".` (inclusive pelo erro `23505`), login com comparação contra hash fixo para e-mail desconhecido e `401` `E-mail ou senha incorretos.`, e emissão do token `{ sub, email }`
- [x] 6.4 Registrar `JwtModule` com segredo e validade vindos da configuração
- [x] 6.5 Criar `JwtAuthGuard` como `APP_GUARD`: libera `@Public()`, responde `401` `Entre para continuar.` sem token e `Sessão expirada. Entre novamente.` para token inválido/expirado ou jogador inexistente, e coloca o jogador em `request.user`
- [x] 6.6 Criar `AuthController` com `POST /auth/signup` (201), `POST /auth/login` (200) e `GET /auth/me`, sem nunca devolver `password_hash`

## 7. Fichas

- [x] 7.1 Criar os schemas zod de `{ sheet }` e `{ patch }` aceitando só objeto JSON, com a mensagem `Ficha inválida.`
- [x] 7.2 Criar `SheetsService` com `get(userId)`, `replace(userId, sheet)` (upsert com `data = excluded.data`) e `merge(userId, patch)` (upsert com `data = sheets.data || excluded.data`), sempre atualizando `updated_at`
- [x] 7.3 Criar `SheetsController` em `/me/sheet` com `GET`, `PUT` e `PATCH`, respondendo `{ sheet, updatedAt }` (ou `{ sheet: null, updatedAt: null }` sem ficha)

## 8. Docker

- [x] 8.1 Criar `api/Dockerfile` multi-stage (`node:24-alpine`, pnpm via corepack, estágios deps → build → prod-deps → runtime, usuário `node`, copiando `dist/` e `drizzle/`)
- [x] 8.2 Criar `api/.dockerignore` (`node_modules`, `dist`, `.env`, `coverage`, `test`)
- [x] 8.3 Criar `api/docker-compose.yml` com `db` (`postgres:17-alpine`, volume nomeado `pgdata`, healthcheck `pg_isready`, porta 5432) e `api` (depende do `db` saudável, roda `migrate.js` e depois `main.js`, porta 3333)
- [x] 8.4 Subir com `docker compose up --build` e conferir `GET http://localhost:3333/api/health` = `200`

## 9. Testes e verificação

- [x] 9.1 Testes unitários do `AuthService` (hash, e-mail duplicado, credenciais erradas) e dos schemas zod (mensagens em português)
- [x] 9.2 Teste e2e com `supertest` contra o Postgres do compose: cadastro → login → `me` → `GET` ficha nula → `PUT` → `PATCH` mesclando → isolamento entre dois jogadores → `401` sem token → `400` ficha inválida
- [x] 9.3 Conferir o cenário de `PATCH` concorrente (duas requisições em paralelo em campos diferentes mantêm as duas mudanças)
- [x] 9.4 Rodar `pnpm build`, `pnpm test`, `pnpm test:e2e` e `pnpm check` sem erros

## 10. Documentação

- [x] 10.1 Criar `api/README.md` com: subir tudo pelo compose, desenvolver com `docker compose up db` + `pnpm start:dev`, gerar/aplicar migrações e a tabela de endpoints (método, rota, corpo, resposta, erros)
