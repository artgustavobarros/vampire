# api-platform Specification

## Purpose
Projeto NestJS em `api/` que serve de backend do `web`: configuração por variáveis de ambiente, PostgreSQL via Drizzle com migrações versionadas, Docker/Compose, CORS, formato de erros e endpoint de saúde.
## Requirements
### Requirement: Projeto da API
O repositório SHALL ter um projeto NestJS em `api/`, como pacote do workspace pnpm da raiz, sem dependências de código do `web/`, com scripts para desenvolvimento (`start:dev`), build (`build`), produção (`start:prod`), testes (`test`, `test:e2e`), geração de migrações (`db:generate`) e aplicação de migrações (`db:migrate`). Todas as rotas MUST ficar sob o prefixo global `/api`.

#### Scenario: Subir em desenvolvimento
- **WHEN** o Postgres está no ar, o `.env` existe e o desenvolvedor roda `pnpm db:migrate` e `pnpm start:dev` em `api/`
- **THEN** a API escuta na porta configurada (padrão `3333`) e responde em `/api/health`

#### Scenario: Prefixo global
- **WHEN** um cliente chama `GET /health` sem o prefixo
- **THEN** a API responde `404`

### Requirement: Configuração por ambiente
A API SHALL ler a configuração de variáveis de ambiente: `PORT`, `DATABASE_URL`, `JWT_SECRET`, `JWT_EXPIRES_IN` e `CORS_ORIGIN`. As variáveis MUST ser validadas na inicialização, e o repositório MUST trazer um `api/.env.example` com valores de desenvolvimento.

#### Scenario: Variável obrigatória ausente
- **WHEN** a API inicia sem `DATABASE_URL` ou sem `JWT_SECRET`
- **THEN** o processo termina com erro indicando qual variável falta, sem abrir a porta

#### Scenario: Segredo fraco
- **WHEN** `JWT_SECRET` tem menos de 32 caracteres
- **THEN** a inicialização falha com erro de configuração

#### Scenario: Valores padrão
- **WHEN** `PORT`, `JWT_EXPIRES_IN` ou `CORS_ORIGIN` não são informados
- **THEN** a API usa `3333`, `7d` e `http://localhost:3000`, respectivamente

### Requirement: Banco com Drizzle e migrações
A API SHALL acessar o PostgreSQL pelo Drizzle ORM, com o schema das tabelas em TypeScript dentro de `api/src/`. As migrações MUST ser arquivos SQL gerados pelo `drizzle-kit` e versionados em `api/drizzle/`, e MUST poder ser aplicadas sem as dependências de desenvolvimento.

#### Scenario: Banco vazio
- **WHEN** as migrações são aplicadas num banco vazio
- **THEN** as tabelas `users` e `sheets` são criadas com seus índices e chaves

#### Scenario: Migrações já aplicadas
- **WHEN** as migrações são aplicadas de novo no mesmo banco
- **THEN** nada muda e o comando termina com sucesso

### Requirement: Docker e Compose
O projeto SHALL ter um `api/Dockerfile` multi-stage, construído com a raiz do repositório como contexto, que gera uma imagem de produção sem dependências de desenvolvimento, e um `docker-compose.yml` na raiz (projeto `vampire`) com os serviços `db` (PostgreSQL com volume nomeado e healthcheck), `api` e `web`. O serviço `api` MUST esperar o `db` ficar saudável e aplicar as migrações antes de iniciar o servidor. O serviço `web` MUST ser construído com `VITE_API_URL` apontando para a porta publicada da API e publicado na porta `3000`, que é a origem padrão do `CORS_ORIGIN`. As portas publicadas MUST poder ser trocadas por `DB_PORT`, `API_PORT` e `WEB_PORT` num `.env` da raiz.

#### Scenario: Subir tudo
- **WHEN** o desenvolvedor roda `docker compose up --build` na raiz
- **THEN** o Postgres sobe, as migrações são aplicadas, `GET http://localhost:3333/api/health` responde `200` e `http://localhost:3000` abre o app, que consegue criar conta e salvar a ficha na API

#### Scenario: Só o banco
- **WHEN** o desenvolvedor roda `docker compose up db` na raiz
- **THEN** o Postgres fica acessível em `localhost:5432` para a API rodar fora do Docker

#### Scenario: Dados persistem
- **WHEN** os containers são recriados com `docker compose down` e `docker compose up`
- **THEN** contas e fichas continuam no banco

#### Scenario: Outras portas
- **WHEN** o `.env` da raiz define `API_PORT=4444` e `WEB_PORT=4000`
- **THEN** a API fica em `http://localhost:4444/api`, o app em `http://localhost:4000` chama essa URL, e o CORS libera `http://localhost:4000`

### Requirement: Saúde do serviço
A API SHALL expor `GET /api/health`, público, que confere a conexão com o banco.

#### Scenario: Tudo no ar
- **WHEN** o banco responde a uma consulta simples
- **THEN** a API responde `200` com `{ "status": "ok", "db": "up" }`

#### Scenario: Banco fora do ar
- **WHEN** a consulta ao banco falha
- **THEN** a API responde `503` com `{ "status": "error", "db": "down" }`

### Requirement: CORS para o web
A API SHALL aceitar requisições com CORS apenas das origens listadas em `CORS_ORIGIN` (separadas por vírgula), permitindo o cabeçalho `Authorization`.

#### Scenario: Origem do web
- **WHEN** o navegador em `http://localhost:3000` faz uma requisição preflight para a API
- **THEN** a resposta inclui `Access-Control-Allow-Origin: http://localhost:3000`

#### Scenario: Origem desconhecida
- **WHEN** a requisição vem de uma origem fora da lista
- **THEN** a resposta não inclui `Access-Control-Allow-Origin`

### Requirement: Formato de erros e validação
Todo corpo de requisição SHALL ser validado antes de chegar ao serviço. Erros MUST ser respondidos em JSON no formato `{ "statusCode": number, "message": string, "error": string }`, com `message` em português pronta para ser exibida num toast do `web`. Erros inesperados MUST responder `500` sem expor detalhes internos.

#### Scenario: Corpo inválido
- **WHEN** um corpo não passa na validação
- **THEN** a API responde `400` com a primeira mensagem de validação em `message`

#### Scenario: Erro inesperado
- **WHEN** ocorre uma exceção não tratada
- **THEN** a API responde `500` com `message` genérica e registra o erro no log

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

