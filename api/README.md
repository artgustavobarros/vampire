# API — Vampiro: A Máscara

Backend do app `web`: contas com JWT e a ficha de cada jogador no PostgreSQL.
NestJS 12 (ESM), Drizzle ORM, zod, Vitest e Docker.

## Subir com Docker

O `docker-compose.yml` fica na raiz do repositório e sobe o Postgres, a API e o `web` (veja o `README.md` da raiz):

```bash
docker compose up --build   # na raiz
```

A API fica em `http://localhost:3333/api`, e o container dela aplica as migrações antes de iniciar. Os dados ficam no volume `vampire_pgdata` e sobrevivem a `docker compose down`; `docker compose down -v` apaga tudo. As variáveis do serviço `api` (`JWT_SECRET`, `JWT_EXPIRES_IN`, `CORS_ORIGIN`, `API_PORT`, `DB_PORT`) podem ser trocadas num `.env` da raiz (modelo em `.env.example` da raiz).

## Desenvolver

```bash
pnpm install              # na raiz: instala o workspace inteiro
docker compose up -d db   # na raiz: só o banco
cd api
cp .env.example .env
pnpm db:migrate
pnpm start:dev            # http://localhost:3333/api, recarrega ao salvar
```

| Script | O que faz |
|---|---|
| `pnpm start:dev` | servidor em modo watch |
| `pnpm build` / `pnpm start:prod` | compila em `dist/` e roda a versão compilada |
| `pnpm db:generate` | gera uma migração SQL em `drizzle/` a partir de `src/db/schema.ts` |
| `pnpm db:migrate` | aplica as migrações pendentes (`DATABASE_URL` do `.env`) |
| `pnpm test` | testes unitários |
| `pnpm test:e2e` | testes ponta a ponta; precisam do banco do compose no ar |
| `pnpm check` / `pnpm fix` | lint e formatação (Ultracite/Biome) |
| `pnpm typecheck` | TypeScript sem emitir |

Para mudar o banco: edite `src/db/schema.ts`, rode `pnpm db:generate`, revise o SQL gerado e versione a pasta `drizzle/`.

## Variáveis de ambiente

| Variável | Padrão | Observação |
|---|---|---|
| `DATABASE_URL` | — | obrigatória |
| `JWT_SECRET` | — | obrigatória, ≥ 32 caracteres |
| `JWT_EXPIRES_IN` | `7d` | ex.: `12h`, `30d` |
| `PORT` | `3333` | |
| `CORS_ORIGIN` | `http://localhost:3000` | várias origens separadas por vírgula |

A API não sobe se alguma variável for inválida.

## Endpoints

Todas as rotas ficam sob `/api`. As protegidas exigem `Authorization: Bearer <accessToken>`.

A documentação interativa (Swagger UI) fica em [`/api/docs`](http://localhost:3333/api/docs) e o OpenAPI em JSON em `/api/docs-json`, ambos públicos. Para testar as rotas protegidas por lá: chame `POST /api/auth/login`, copie o `accessToken` e cole em "Authorize". Os corpos são gerados dos mesmos schemas zod que validam as rotas.

| Método | Rota | Auth | Corpo | Resposta |
|---|---|---|---|---|
| `GET` | `/api/health` | — | — | `200 { status: "ok", db: "up" }` ou `503 { status: "error", db: "down" }` |
| `POST` | `/api/auth/signup` | — | `{ name, email, password }` | `201 { accessToken, user }` |
| `POST` | `/api/auth/login` | — | `{ email, password }` | `200 { accessToken, user }` |
| `GET` | `/api/auth/me` | ✓ | — | `200 { id, email, name, role }` |
| `GET` | `/api/me/sheet` | ✓ | — | `200 { sheet, updatedAt }` (`sheet: null` se ainda não existe) |
| `PUT` | `/api/me/sheet` | ✓ | `{ sheet }` | `200 { sheet, updatedAt }` — substitui a ficha inteira |
| `PATCH` | `/api/me/sheet` | ✓ | `{ patch }` | `200 { sheet, updatedAt }` — mescla os campos de primeiro nível |
| `GET` | `/api/sheets` | Mestre | — | `200 [{ user, sheet, updatedAt }]` — todos os jogadores, por nome |
| `GET` | `/api/sheets/:userId` | Mestre | — | `200 { user, sheet, updatedAt }` |
| `PATCH` | `/api/sheets/:userId` | Mestre | `{ patch }` | `200 { sheet, updatedAt }` — como o `PATCH /me/sheet`, sem a trava |

`user` é `{ id, email, name, role }`. A ficha é o JSON `Sheet` do web (`web/src/lib/types.ts`), guardado como veio: a API só confere que é um objeto e que o corpo tem até 1 MB. O `PATCH` faz a mesma mescla rasa do `patch` do character store (`attrs` enviado substitui o `attrs` inteiro).

### Papéis

Todo cadastro é `player`. A migração `0001_roles` cria a conta do Mestre (`role: "dm"`): **`admin@admin.com` / `!@#ASD123asd`**. Fora de desenvolvimento, troque a senha direto no banco (`UPDATE users SET password_hash = '<bcrypt>' WHERE email = 'admin@admin.com'`). O papel é lido do banco a cada requisição, então mudar `users.role` vale na hora.

Com a ficha criada (`criada: true`), o jogador não muda mais `attrs` nem `skills` pelo `/me/sheet` (`403`); valores iguais aos gravados passam. Só o Mestre, por `/api/sheets/:userId`, altera Atributos e Habilidades.

### Erros

Sempre `{ statusCode, message, error }`, com `message` em português pronta para o toast:

| Status | `message` |
|---|---|
| `400` | `Informe o e-mail.`, `E-mail inválido.`, `Informe a senha.`, `Informe o nome.`, `A senha precisa ter pelo menos 6 caracteres.`, `Ficha inválida.`, `JSON inválido.`, `Jogador inválido.` |
| `401` | `E-mail ou senha incorretos.`, `Entre para continuar.`, `Sessão expirada. Entre novamente.` |
| `403` | `Apenas o Mestre pode fazer isso.`, `Atributos e Habilidades só podem ser alterados pelo Mestre.` |
| `404` | `Jogador não encontrado.` |
| `409` | `E-mail já cadastrado. Use "Entrar".` |
| `413` | `A requisição passou do limite de 1 MB.` |
| `500` | `Algo deu errado. Tente novamente.` |

Sair é só descartar o token no cliente.
