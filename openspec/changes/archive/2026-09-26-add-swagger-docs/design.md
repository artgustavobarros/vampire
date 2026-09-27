## Context

A API (`api/`) roda em NestJS 12 com Express, prefixo global `/api`, guarda JWT global (`JwtAuthGuard`, liberado por `@Public()`) e validação por `StandardSchemaValidationPipe` usando schemas Zod v4 passados em `@Body({ schema })`. Não existem classes DTO: os tipos saem de `z.infer`. As respostas são tipadas por interfaces TypeScript (`AuthResponse`, `PublicUser`, `SheetResponse`) e os erros sempre seguem `{ statusCode, message, error }` pelo `HttpExceptionFilter`. Toda a montagem do app fica em `configureApp` (`api/src/app.setup.ts`), chamada pelo `main.ts` e pelos e2e.

## Goals / Non-Goals

**Goals:**
- Documento OpenAPI gerado do código, sem duplicar à mão os schemas de validação.
- Swagger UI em `/api/docs` e JSON em `/api/docs-json`, com "Authorize" Bearer funcionando.
- Todas as rotas atuais documentadas com sucesso e erros.
- Cobertura por e2e, para o documento não quebrar em silêncio.

**Non-Goals:**
- Validar ou serializar respostas em runtime (sem `StandardSchemaSerializerInterceptor`); os schemas de resposta servem só à documentação.
- Gerar cliente TypeScript para o `web` a partir do documento.
- Esconder a documentação em produção ou protegê-la com senha.
- Versionamento da API.

## Decisions

### 1. `@nestjs/swagger` com os schemas Zod que já existem
O `@nestjs/swagger` lê o `schema` dos decorators de parâmetro (`@Body({ schema })`) e converte Standard Schemas em corpos de requisição. O Zod 4 expõe a extensão Standard JSON Schema, então a conversão nativa deve bastar.
- **Por quê**: o corpo documentado é o mesmo que valida a rota; nada de classes DTO nem `@ApiProperty` repetindo regras.
- **Plano B**: se a conversão nativa gerar algo errado para OpenAPI 3.0 (ex.: `$schema`, `const`, tipos 3.1), passar um `standardSchemaConverter` em `SwaggerDocumentOptions` que chama `z.toJSONSchema(schema, { target: "openapi-3.0", io: schemaType })` para schemas com `~standard.vendor === "zod"` e devolve `undefined` para o resto.
- **Alternativas**: `zod-openapi` (dependência extra que o `z.toJSONSchema` nativo já cobre); `nestjs-zod` (troca o pipe de validação, mudança maior que o necessário); classes DTO com o plugin do Nest CLI (duplicaria os schemas Zod).

### 2. Schemas Zod de resposta, só para documentação
Criar `publicUserSchema` (em `users/users.schemas.ts`), `authResponseSchema` (em `auth.schemas.ts`), `sheetResponseSchema` (em `sheets.schemas.ts`), `healthSchema` (em `health/health.schemas.ts`) e `errorResponseSchema` (em `api/src/common/`). `PublicUser`, `AuthResponse`, `Health` e `ErrorResponse` passam a ser `z.infer` desses schemas, para tipo e documentação não divergirem. As respostas usam a opção nativa `standardSchema` dos decorators (`@ApiOkResponse({ standardSchema })`, etc.), que o `@nestjs/swagger` 12 converte em OpenAPI 3.0.
- `updatedAt` da ficha é `Date` no serviço e sai como string ISO no JSON; o schema de resposta usa `z.iso.datetime().nullable()` para descrever o que o cliente recebe, e o `SheetResponse` do serviço continua com `Date`.
- `@ApiOkResponse` no nível da classe perde o schema (o `200` padrão do handler sobrescreve), então fica em cada handler; `@ApiUnauthorizedResponse` na classe funciona.
- O e-mail valida com `.pipe(z.email())`, e o OpenAPI do corpo só enxerga o lado de entrada do `pipe`; um `.meta({ format: "email" })` antes do `pipe` repõe o formato.
- **Alternativas**: helper com `z.toJSONSchema` + `@ApiResponse({ schema })` (desnecessário com `standardSchema`); escrever o `SchemaObject` à mão (diverge dos tipos).

### 3. Montagem em `configureApp`, com `useGlobalPrefix`
Uma função `setupSwagger(app)` em `app.setup.ts`, chamada ao fim de `configureApp`. Usa `DocumentBuilder` (título, descrição em português, versão do `package.json` ou fixa `0.1.0`, `addBearerAuth()`), `SwaggerModule.createDocument` e `SwaggerModule.setup("docs", app, factory, { useGlobalPrefix: true, jsonDocumentUrl: "docs-json", swaggerOptions: { persistAuthorization: true } })`.
- **Por quê**: os e2e já chamam `configureApp`, então testam o mesmo documento que roda em produção; `useGlobalPrefix` mantém tudo sob `/api`.
- As rotas do Swagger são montadas direto no Express, fora do pipeline de guardas do Nest, então não passam pelo `JwtAuthGuard` e ficam públicas sem `@Public()`.

### 4. Bearer por controller, não global
`@ApiBearerAuth()` nos controllers `SheetsController` e no handler `me` do `AuthController`; `signup`, `login` e `health` ficam sem. Espelha o `@Public()` existente.
- **Alternativa**: `addSecurityRequirements("bearer")` global e remover nas públicas — mais fácil de esquecer ao criar rota pública nova, e o Swagger não tem um "remover" limpo por operação.

### 5. Organização das operações
`@ApiTags("auth" | "sheets" | "health")` por controller e `@ApiOperation({ summary })` em português por handler. Respostas de erro por rota: `400` onde há corpo, `401` nas protegidas e no login, `409` no signup, `503` no health.

## Risks / Trade-offs

- [Conversão nativa Standard Schema → OpenAPI 3.0 gerar formato 3.1 ou campos inválidos] → e2e verifica o corpo do signup no `/api/docs-json`; se falhar, aplicar o plano B da decisão 1.
- [Mensagens de erro Zod (`{ error: ... }`) vazarem para o documento como campos estranhos] → aceitar se inofensivo; o documento é lido por humanos e pelo Swagger UI.
- [`z.record(z.string(), z.unknown())` da ficha virar um schema pouco útil] → aceitável: a API guarda a ficha como JSON opaco por design; descrever em `description` que o formato segue `Sheet` do `web`.
- [Documentação pública em produção expõe o formato das rotas] → baixo risco (sem segredos, rotas já são chamadas pelo `web`); se necessário, uma variável de ambiente para desligar pode vir depois.
- [`@nestjs/swagger` precisa estar em `dependencies`, não `devDependencies`] → a imagem Docker instala só produção; conferir no `package.json`.

## Migration Plan

Sem migração de dados. Instalar a dependência, subir a API e abrir `/api/docs`. Rollback: remover `setupSwagger`, os decorators `@Api*` e a dependência; nenhuma rota muda de comportamento.

## Open Questions

- Desligar a documentação em produção por variável de ambiente? Por ora fica sempre ligada.
