## ADDED Requirements

### Requirement: Documentação OpenAPI
A API SHALL gerar um documento OpenAPI 3 a partir dos próprios controllers e schemas, e SHALL servi-lo em `GET /api/docs-json` e na interface do Swagger UI em `GET /api/docs`. As duas rotas MUST ser públicas (sem `Authorization`). O documento MUST listar todas as rotas da API com o prefixo `/api`, o corpo de requisição de cada rota que recebe corpo (derivado do mesmo schema usado na validação), as respostas de sucesso e as respostas de erro no formato `{ "statusCode": number, "message": string, "error": string }`.

#### Scenario: Interface do Swagger
- **WHEN** um cliente chama `GET /api/docs` sem token
- **THEN** a API responde `200` com a página HTML do Swagger UI

#### Scenario: Documento JSON
- **WHEN** um cliente chama `GET /api/docs-json` sem token
- **THEN** a API responde `200` com um documento OpenAPI 3 em JSON

#### Scenario: Todas as rotas documentadas
- **WHEN** o documento é gerado
- **THEN** ele contém `POST /api/auth/signup`, `POST /api/auth/login`, `GET /api/auth/me`, `GET /api/me/sheet`, `PUT /api/me/sheet`, `PATCH /api/me/sheet` e `GET /api/health`

#### Scenario: Corpo vindo do schema de validação
- **WHEN** o documento descreve `POST /api/auth/signup`
- **THEN** o corpo exige `email`, `name` e `password`, com `password` de no mínimo 6 caracteres, igual ao schema Zod que valida a rota

#### Scenario: Respostas de erro
- **WHEN** o documento descreve `POST /api/auth/login`
- **THEN** ele lista as respostas `400` e `401` com o schema de erro `{ statusCode, message, error }`

### Requirement: Autenticação Bearer na documentação
O documento OpenAPI SHALL declarar um esquema de segurança HTTP Bearer (JWT) e MUST associá-lo a toda rota protegida pelo guarda global; rotas marcadas com `@Public()` MUST NOT exigir esse esquema. O Swagger UI SHALL permitir informar o token uma vez e reutilizá-lo nas chamadas.

#### Scenario: Rota protegida
- **WHEN** o documento descreve `GET /api/me/sheet`
- **THEN** a operação exige o esquema Bearer e lista a resposta `401`

#### Scenario: Rota pública
- **WHEN** o documento descreve `POST /api/auth/login` ou `GET /api/health`
- **THEN** a operação não exige o esquema Bearer

#### Scenario: Testar pelo Swagger UI
- **WHEN** o desenvolvedor faz login pelo Swagger UI, cola o `accessToken` em "Authorize" e executa `GET /api/auth/me`
- **THEN** a requisição sai com `Authorization: Bearer <token>` e a API responde `200` com o usuário
