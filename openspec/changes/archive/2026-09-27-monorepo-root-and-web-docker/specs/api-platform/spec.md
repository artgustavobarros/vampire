## MODIFIED Requirements

### Requirement: Projeto da API
O repositório SHALL ter um projeto NestJS em `api/`, como pacote do workspace pnpm da raiz, sem dependências de código do `web/`, com scripts para desenvolvimento (`start:dev`), build (`build`), produção (`start:prod`), testes (`test`, `test:e2e`), geração de migrações (`db:generate`) e aplicação de migrações (`db:migrate`). Todas as rotas MUST ficar sob o prefixo global `/api`.

#### Scenario: Subir em desenvolvimento
- **WHEN** o Postgres está no ar, o `.env` existe e o desenvolvedor roda `pnpm db:migrate` e `pnpm start:dev` em `api/`
- **THEN** a API escuta na porta configurada (padrão `3333`) e responde em `/api/health`

#### Scenario: Prefixo global
- **WHEN** um cliente chama `GET /health` sem o prefixo
- **THEN** a API responde `404`

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
