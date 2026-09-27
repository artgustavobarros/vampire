## ADDED Requirements

### Requirement: Projeto da API
O repositório SHALL ter um projeto NestJS em `api/`, independente do `web/`, gerenciado com pnpm, com scripts para desenvolvimento (`start:dev`), build (`build`), produção (`start:prod`), testes (`test`, `test:e2e`), geração de migrações (`db:generate`) e aplicação de migrações (`db:migrate`). Todas as rotas MUST ficar sob o prefixo global `/api`.

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
O projeto SHALL ter um `api/Dockerfile` multi-stage que gera uma imagem de produção sem dependências de desenvolvimento, e um `api/docker-compose.yml` com os serviços `db` (PostgreSQL com volume nomeado e healthcheck) e `api`. O serviço `api` MUST esperar o `db` ficar saudável e aplicar as migrações antes de iniciar o servidor.

#### Scenario: Subir tudo
- **WHEN** o desenvolvedor roda `docker compose up --build` em `api/`
- **THEN** o Postgres sobe, as migrações são aplicadas e `GET http://localhost:3333/api/health` responde `200`

#### Scenario: Só o banco
- **WHEN** o desenvolvedor roda `docker compose up db`
- **THEN** o Postgres fica acessível em `localhost:5432` para a API rodar fora do Docker

#### Scenario: Dados persistem
- **WHEN** os containers são recriados com `docker compose down` e `docker compose up`
- **THEN** contas e fichas continuam no banco

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
