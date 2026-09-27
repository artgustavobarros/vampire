## Why

A API em `api/` já tem autenticação, fichas e saúde, mas o contrato só existe no código e nas specs. Para integrar o `web` (próxima etapa) e testar os endpoints à mão, precisamos de uma documentação navegável e de um documento OpenAPI gerado a partir do próprio código, que não fique desatualizado.

## What Changes

- Adicionar o `@nestjs/swagger` à API e gerar o documento OpenAPI a partir dos controllers e dos schemas Zod que já validam os corpos.
- Servir a interface do Swagger UI em `GET /api/docs` e o documento JSON em `GET /api/docs-json`, ambos públicos.
- Documentar todas as rotas atuais (`auth`, `me/sheet`, `health`) com resumo, tags, corpo de requisição, respostas de sucesso e respostas de erro no formato `{ statusCode, message, error }`.
- Declarar o esquema de segurança Bearer (JWT) e marcar as rotas protegidas, para que o botão "Authorize" do Swagger UI permita chamar `/api/auth/me` e `/api/me/sheet` com o token do login.
- Criar schemas Zod para as respostas (usuário público, resposta de autenticação, ficha, saúde e erro), usados só para documentação.
- Configurar o Swagger dentro de `configureApp`, para que os testes e2e também cubram o documento.

## Capabilities

### New Capabilities
<!-- nenhuma -->

### Modified Capabilities
- `api-platform`: novo requisito de documentação OpenAPI/Swagger servida pela própria API em `/api/docs` e `/api/docs-json`, cobrindo todas as rotas e o esquema Bearer.

## Impact

- Código: `api/src/app.setup.ts` (montagem do Swagger), controllers de `auth`, `sheets` e `health` (decorators `@ApiTags`, `@ApiOperation`, `@ApiBearerAuth`, respostas), novos schemas de resposta em `*.schemas.ts` e um schema de erro em `api/src/common/`.
- Testes: novos casos e2e em `api/test/app.e2e-spec.ts` para `/api/docs` e `/api/docs-json`.
- Dependência nova de produção em `api/`: `@nestjs/swagger` (traz o `swagger-ui-dist`).
- Nenhuma mudança de comportamento nas rotas existentes nem no `web/`.
