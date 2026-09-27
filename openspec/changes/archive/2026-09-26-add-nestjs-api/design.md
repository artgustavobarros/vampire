## Context

O `web` (TanStack Start + Zustand) não tem servidor de dados: `web/src/lib/storage.ts` lê e grava tudo no `localStorage`, `web/src/lib/auth.ts` compara senhas em texto puro e o `useCharacterStore.patch` mescla campos de primeiro nível da `Sheet` e grava a ficha inteira a cada mudança. Existe um personagem por jogador (a rota `/criar` só permite refazer depois que a ficha foi criada), e toda regra de Vampiro (pontos, Geração, Predador, Fome) roda no cliente.

O que o `web` faz com o armazenamento, e o endpoint que o substitui:

| Hoje no `web`                                        | Endpoint                  |
|------------------------------------------------------|---------------------------|
| `authenticate({ mode: "signup" })` → `vtm5.accounts` | `POST /api/auth/signup`   |
| `authenticate({ mode: "login" })`                    | `POST /api/auth/login`    |
| `restore()` → `vtm5.session` + `vtm5.name.<email>`   | `GET /api/auth/me`        |
| `load(email)` → `vtm5.sheet.<email>`                 | `GET /api/me/sheet`       |
| `patch(partial)` → `writeSheet`                      | `PATCH /api/me/sheet`     |
| (ficha de exemplo no cadastro, refazer a ficha)      | `PUT /api/me/sheet`       |
| `logout()` → remove `vtm5.session`                   | nenhum (cliente descarta o token) |

A pasta `api/` já existe, mas pertence ao `root` e só contém `data/pg` vazio, sobra de um bind mount do Postgres. O usuário não consegue escrever nela sem corrigir a permissão.

## Goals / Non-Goals

**Goals:**
- Backend NestJS rodando com `docker compose up --build`, com Postgres, migrações automáticas e `/api/health` respondendo.
- Cadastro, login e sessão com JWT, com senhas em hash.
- Persistência da ficha por jogador com o mesmo formato JSON do `web`, pronta para trocar o `localStorage` numa próxima mudança.
- Mensagens de erro em português, iguais às do `web` onde o caso existe, para caberem direto nos toasts.

**Non-Goals:**
- Integrar o `web` com a API (trocar `storage.ts`, `auth.ts` e os stores).
- Importar contas ou fichas que já estão no `localStorage`.
- Refresh token, cookies httpOnly, revogação de token, recuperação de senha, verificação de e-mail.
- Rate limiting e proteção contra força bruta no login.
- Validar as regras de Vampiro no servidor ou normalizar a ficha em tabelas.
- Mais de um personagem por jogador.
- Deploy em produção, HTTPS, CI.

## Decisions

### 1. Estrutura de módulos Nest

```
api/
  src/
    main.ts              cria o app e escuta a porta
    app.setup.ts         prefixo /api, CORS, limite de corpo, validação, filtro de erros (reusado nos e2e)
    app.module.ts
    config/env.ts        schema zod das variáveis de ambiente
    db/
      schema.ts          tabelas Drizzle (users, sheets)
      db.module.ts       provider global DRIZZLE (Pool do pg + drizzle())
      migrate.ts         aplica drizzle/ com o migrator do drizzle-orm
    common/              @Public(), @CurrentUser(), filtro de exceções
    auth/                AuthController, AuthService, JwtAuthGuard (global)
    users/               UsersService (busca e criação de jogador)
    sheets/              SheetsController, SheetsService
    health/              HealthController
  drizzle/               migrações SQL geradas (versionadas)
  drizzle.config.ts
  test/                  e2e com supertest
  Dockerfile, .dockerignore, docker-compose.yml, .env.example, .gitignore
```

Um módulo por recurso, seguindo o padrão do Nest. `users` fica separado de `auth` porque `sheets` e o guard também precisam buscar jogador.

### 2. Drizzle com `node-postgres` e migrações geradas

- `drizzle-orm` + `pg` (`Pool`), exposto como provider global com token `DRIZZLE`, e o `Pool` fechado em `onApplicationShutdown`. O `Pool` tem um ouvinte de `error`: sem ele, o banco derrubar uma conexão ociosa (reinício, `docker compose stop db`) derruba o processo da API.
- Schema em TypeScript (`src/db/schema.ts`); `drizzle-kit generate` gera o SQL em `api/drizzle/`, que é versionado e revisado.
- As migrações rodam com `migrate()` de `drizzle-orm/node-postgres/migrator` num script sem imports locais: em dev, `pnpm db:migrate` roda `node src/db/migrate.ts` direto (o Node 24 remove os tipos); no container, `node dist/db/migrate.js`. A imagem de produção não precisa do `drizzle-kit`.
- Alternativas: `drizzle-kit push` (sem histórico, arriscado fora do dev); Prisma/TypeORM (o usuário pediu Drizzle).

Tabelas:

```
users
  id             uuid pk default gen_random_uuid()
  email          text not null unique      -- já normalizado
  name           text not null
  password_hash  text not null
  created_at     timestamptz not null default now()
  updated_at     timestamptz not null default now()

sheets
  id          uuid pk default gen_random_uuid()
  user_id     uuid not null unique references users(id) on delete cascade
  data        jsonb not null
  created_at  timestamptz not null default now()
  updated_at  timestamptz not null default now()
```

`user_id unique` garante uma ficha por jogador e permite upsert por `ON CONFLICT (user_id)`.

### 3. Ficha como `jsonb` opaco

A `Sheet` do `web` tem dezenas de campos opcionais e muda a cada mudança de regra (`predBonus`, `meritos`, `espec`…). Normalizar isso em tabelas agora obrigaria a migrar o banco a cada ajuste no `web`. A API guarda o JSON como veio e só confere que é um objeto. As regras continuam no `web`, que já tem `normalizeSheet` para completar campos ausentes.
- Alternativa: tabelas por atributo/disciplina — melhor para consultas, mas nada no produto precisa consultar dentro da ficha hoje.

### 4. `PATCH` atômico com o operador `||` do Postgres

O `patch` do `web` é uma mescla rasa (`{ ...prev, ...partial }`). O `jsonb || jsonb` do Postgres faz exatamente isso. O `PATCH` vira um único comando:

```sql
insert into sheets (user_id, data) values ($1, $2)
on conflict (user_id) do update
  set data = sheets.data || excluded.data, updated_at = now()
returning data, updated_at
```

Sem ler e escrever em duas etapas, dois `PATCH` seguidos (o `web` manda um a cada clique) não se sobrescrevem. O `PUT` usa o mesmo upsert com `set data = excluded.data`.

### 5. JWT sem Passport

- `@nestjs/jwt` para assinar e verificar (HS256, `JWT_SECRET` com pelo menos 32 caracteres, `JWT_EXPIRES_IN` padrão `7d`). Payload: `{ sub: userId, email }`.
- Um `JwtAuthGuard` registrado como `APP_GUARD`: protege tudo por padrão; `@Public()` libera `signup`, `login` e `health`. O guard busca o jogador no banco a cada requisição, para um token de jogador apagado não valer, e o coloca em `request.user`, lido pelo decorator `@CurrentUser()`.
- Token devolvido no corpo; o `web` vai guardá-lo e mandá-lo em `Authorization: Bearer`.
- Alternativas: `@nestjs/passport` + `passport-jwt` (mais camadas para um único esquema); cookie httpOnly (mais seguro contra XSS, mas exige CSRF e ajuste de CORS com credenciais — fica para a integração, se quisermos).

### 6. Hash de senha com `bcryptjs`

`bcryptjs` (custo 10) é JavaScript puro, então a imagem `node:alpine` não precisa de toolchain nativo. No login com e-mail desconhecido, a API compara contra um hash fixo para o tempo de resposta não revelar se o e-mail existe.
- Alternativa: `argon2` (mais moderno, mas binário nativo que complica o build no Alpine).

### 7. Validação com zod via Standard Schema

O `web` já usa zod 4, e o Nest 12 aceita schemas [Standard Schema](https://standardschema.dev/) nativamente: `@Body({ schema })` com o `StandardSchemaValidationPipe` global, cujo `exceptionFactory` lança `BadRequestException` com a primeira mensagem em português (por exemplo `Informe o nome.`). A ordem das chaves no `z.object` define qual mensagem sai primeiro. As variáveis de ambiente usam `ConfigModule.forRoot({ validationSchema })` com zod. Assim os schemas podem, no futuro, ir para um pacote compartilhado com o `web`.
- Alternativas: um `ZodValidationPipe` próprio (desnecessário no Nest 12); `class-validator` + `class-transformer` (duplicaria as validações que o `web` já escreve em zod).

### 8. Erros

O formato padrão do Nest (`{ statusCode, message, error }`) já serve. Um filtro global só garante que `message` seja sempre string e que exceções desconhecidas virem `500` genérico com log. Erro de e-mail duplicado vem do índice único (código `23505` do Postgres) traduzido para `409`, cobrindo cadastros simultâneos. O `413` do body-parser (limite de 1 MB via `app.useBodyParser("json", { limit: "1mb" })`) chega ao filtro como erro `http-errors` e é convertido lá. JSON malformado vira `SyntaxError`, que o `ExpressAdapter` do Nest transforma em `400` com a mensagem em inglês do `JSON.parse`; um `ApiExpressAdapter` (subclasse com `mapException`) troca por `JSON inválido.`.

### 9. Docker

- `Dockerfile` multi-stage em `node:24-alpine` com pnpm via corepack: `deps` (instala tudo) → `build` (`nest build`) → `prod-deps` (`pnpm install --prod`) → `runtime` (só `dist/`, `drizzle/`, `node_modules` de produção, usuário `node`).
- `docker-compose.yml` em `api/`: `db` (`postgres:17-alpine`, volume nomeado `pgdata`, `pg_isready` como healthcheck, porta `5432`) e `api` (build local, `depends_on: db: condition: service_healthy`, comando `node dist/db/migrate.js && node dist/main.js`, porta `3333`).
- Volume nomeado em vez de bind mount (`./data/pg`), que foi o que deixou `api/data/pg` com dono `root`.
- Para desenvolver: `docker compose up db` e `pnpm start:dev` fora do container.

### 10. Ferramentas

NestJS 12, que é ESM (`"type": "module"`, imports com `.js`) e exige TypeScript 6. pnpm e Biome/Ultracite, como no `web`, no lugar do oxlint que o `nest new` gera; no Biome da API ficam desligadas `noParameterProperties` (injeção pelo construtor) e `useImportType` (o `import type` de uma classe injetada apaga o metadado que a DI do Nest lê). Testes com Vitest, como no `web` e padrão do Nest 12, compilados pelo `unplugin-swc` para manter `emitDecoratorMetadata`: unitários em `src/**/*.spec.ts` e e2e com `supertest` contra o Postgres do compose.

## Risks / Trade-offs

- [Pasta `api/` com dono `root`] → primeira tarefa é `sudo chown -R $USER:$USER api` e apagar `api/data`; a compose nova usa volume nomeado para não repetir o problema.
- [Token no `localStorage` do web fica exposto a XSS] → aceitável nesta fase (o app hoje guarda a senha em texto puro no mesmo lugar); cookie httpOnly fica como questão em aberto para a integração.
- [Sem refresh token, sessão cai quando o JWT expira] → validade de 7 dias; o `web` trata `401` voltando para `/entrar`.
- [Ficha opaca aceita qualquer JSON] → limite de 1 MB e só objetos; o `web` continua normalizando ao carregar.
- [Sem rate limiting, o login aceita força bruta] → fora do escopo; `@nestjs/throttler` é a saída natural depois.
- [Biome com decorators do Nest acusa regras] → desligadas só `noParameterProperties` e `useImportType` no `biome.json` da API.
- [E2E usa o mesmo banco do dev] → os testes criam e-mails únicos por execução e não apagam dados de outros.

## Migration Plan

1. Corrigir a permissão de `api/` e criar o projeto.
2. `docker compose up --build` em `api/` sobe banco e API; as migrações rodam sozinhas.
3. Rollback: `docker compose down` (com `-v` para apagar o volume). Nada no `web` depende da API ainda.

## Open Questions

- Na integração, o token fica no `localStorage` ou migramos para cookie httpOnly?
- A ficha de exemplo no cadastro deve ser gravada pelo `web` (via `PUT`) ou pela API? A proposta atual deixa com o `web`, que já tem o JSON.
- Vamos oferecer importar a ficha do `localStorage` para a conta nova na primeira entrada?
