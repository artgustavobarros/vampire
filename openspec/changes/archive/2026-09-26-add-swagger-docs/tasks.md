## 1. Dependência

- [x] 1.1 Adicionar `@nestjs/swagger` (versão compatível com Nest 12) em `dependencies` de `api/package.json` com `pnpm add`, e conferir que o `pnpm-lock.yaml` foi atualizado

## 2. Schemas de resposta

- [x] 2.1 Documentar as respostas com a opção nativa `standardSchema` dos decorators `@Api*Response` (o `@nestjs/swagger` 12 converte o schema Zod em OpenAPI 3.0), sem helper próprio
- [x] 2.2 Criar `errorResponseSchema` (`statusCode`, `message`, `error`) em `api/src/common/` e usá-lo como tipo do corpo no `HttpExceptionFilter`
- [x] 2.3 Criar `publicUserSchema` em `users/users.schemas.ts` e `authResponseSchema` em `auth.schemas.ts`; trocar as interfaces `PublicUser` e `AuthResponse` por `z.infer` desses schemas
- [x] 2.4 Em `sheets.schemas.ts`, criar `sheetResponseSchema` (`sheet` nulo ou objeto, `updatedAt` datetime ISO nulo); o `SheetResponse` do serviço continua com `Date`, que vira string ISO no JSON
- [x] 2.5 Criar o schema da resposta de saúde (`status`, `db`) no módulo `health`

## 3. Montagem do Swagger

- [x] 3.1 Criar `setupSwagger(app)` em `api/src/app.setup.ts` com `DocumentBuilder` (título, descrição em português, versão, `addBearerAuth()`) e `SwaggerModule.setup("docs", ...)` com `useGlobalPrefix: true`, `jsonDocumentUrl: "docs-json"` e `persistAuthorization: true`
- [x] 3.2 Chamar `setupSwagger` ao fim de `configureApp`
- [x] 3.3 Subir a API e conferir no `/api/docs-json` o corpo gerado para `POST /api/auth/signup` (a conversão nativa já sai em OpenAPI 3.0; o plano B não foi necessário)

## 4. Documentar as rotas

- [x] 4.1 `AuthController`: `@ApiTags("auth")`, `@ApiOperation` em cada handler, respostas `201`/`200` com `authResponseSchema`, `400` em signup e login, `409` no signup, `401` no login
- [x] 4.2 `AuthController.me`: `@ApiBearerAuth()`, resposta `200` com `publicUserSchema` e `401`
- [x] 4.3 `SheetsController`: `@ApiTags("sheets")`, `@ApiBearerAuth()` no controller, `@ApiOperation` em GET/PUT/PATCH, respostas `200` com `sheetResponseSchema`, `400` em PUT/PATCH e `401` em todas; descrever que a ficha segue o tipo `Sheet` do `web`
- [x] 4.4 `HealthController`: `@ApiTags("health")`, `@ApiOperation`, respostas `200` e `503` com o schema de saúde
- [x] 4.5 Usar `errorResponseSchema` em todas as respostas de erro

## 5. Testes e verificação

- [x] 5.1 E2e: `GET /api/docs` sem token responde `200` com HTML
- [x] 5.2 E2e: `GET /api/docs-json` sem token responde `200` e contém as 7 rotas com prefixo `/api`
- [x] 5.3 E2e: no documento, `POST /api/auth/signup` exige `email`, `name` e `password` (mínimo 6), `GET /api/me/sheet` exige o esquema Bearer e `POST /api/auth/login` e `GET /api/health` não exigem
- [x] 5.4 Rodar `pnpm typecheck`, `pnpm check`, `pnpm test` e `pnpm test:e2e` em `api/` sem erros
- [x] 5.5 Conferir que o Swagger UI e seus assets carregam e que o fluxo login → `Authorization: Bearer` → `GET /api/auth/me` funciona (verificado por HTTP; clique na interface fica com o desenvolvedor)
- [x] 5.6 Mencionar `/api/docs` no `api/README.md`
