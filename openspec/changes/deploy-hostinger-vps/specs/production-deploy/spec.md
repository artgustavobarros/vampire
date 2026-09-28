## ADDED Requirements

### Requirement: Compose de produção atrás do Traefik
O projeto SHALL ter um `docker-compose.prod.yml` na raiz (projeto `vampire`) com os serviços `db`, `api` e `web`, construídos a partir dos mesmos `api/Dockerfile` e `web/Dockerfile` do desenvolvimento. `api` e `web` MUST ser roteados pelo Traefik do VPS (que roda com `network_mode: host` e alcança os containers pelo IP na rede padrão do projeto) por labels, no entrypoint `websecure` com o cert resolver `letsencrypt`, com routers e services de nomes `vampire-api` e `vampire-web`. Nenhum serviço MUST publicar porta no host, e o projeto MUST NOT depender de rede externa.

#### Scenario: Subir em produção
- **WHEN** o compose de produção sobe num VPS com o Traefik rodando e `APP_HOST` apontando para o VPS no DNS
- **THEN** `https://<APP_HOST>/` abre o `web` com certificado válido e `https://<APP_HOST>/api/health` responde pela `api`

#### Scenario: Banco fechado
- **WHEN** alguém tenta conectar na porta `5432` do IP público do VPS
- **THEN** a conexão não chega ao Postgres do projeto

### Requirement: Um domínio com a API em /api
Em produção, `web` e `api` SHALL ficar na mesma origem: o Traefik MUST mandar os pedidos com caminho começando em `/api` para a `api` e todo o resto para o `web`. O `web` MUST ser construído com `VITE_API_URL=/api`, para o navegador chamar a API pela mesma origem, e o `CORS_ORIGIN` da API MUST ser `https://<APP_HOST>`.

#### Scenario: Login no navegador
- **WHEN** o jogador abre `https://<APP_HOST>` e entra com e-mail e senha
- **THEN** o navegador chama `https://<APP_HOST>/api/auth/login`, sem pedido cross-origin

#### Scenario: Trocar de domínio
- **WHEN** `APP_HOST` muda e o projeto é implantado de novo
- **THEN** o app passa a responder no novo domínio sem mudar código nem o argumento de build do `web`

### Requirement: Segredos obrigatórios em produção
O compose de produção MUST exigir `APP_HOST`, `POSTGRES_PASSWORD`, `JWT_SECRET`, `ADMIN_EMAIL` e `ADMIN_PASSWORD` sem valor padrão, e MUST NOT conter senha ou segredo fixo. A `DATABASE_URL` da API SHALL ser montada com o `POSTGRES_PASSWORD`.

#### Scenario: Esquecer um segredo
- **WHEN** o compose de produção é usado sem `JWT_SECRET` (ou sem `POSTGRES_PASSWORD`, ou sem `APP_HOST`)
- **THEN** o `docker compose` recusa subir e diz qual variável está faltando

### Requirement: Serviços se recuperam sozinhos
Os três serviços de produção SHALL ter `restart: unless-stopped` e healthcheck: `db` com `pg_isready`, `api` com `GET /api/health` e `web` com `GET /`. A `api` MUST esperar o `db` ficar saudável e aplicar as migrações antes de servir.

#### Scenario: VPS reinicia
- **WHEN** o VPS reinicia
- **THEN** `db`, `api` e `web` voltam sozinhos e os dados do volume `pgdata` continuam lá

### Requirement: Deploy contínuo pelo GitHub Actions
O repositório SHALL ter o workflow `.github/workflows/deploy.yml` que, a cada push na `main` (e manualmente pelo `workflow_dispatch`), usa a action `hostinger/deploy-on-vps` para implantar o `docker-compose.prod.yml` do commit no VPS, com o nome de projeto `vampire`. A chave da API da Hostinger, o ID do VPS, `APP_HOST`, `JWT_SECRET`, `POSTGRES_PASSWORD`, `ADMIN_EMAIL` e `ADMIN_PASSWORD` MUST vir de secrets do GitHub. Dois deploys MUST NOT rodar ao mesmo tempo.

#### Scenario: Push na main
- **WHEN** um commit chega na `main`
- **THEN** o workflow pede à Hostinger o deploy daquele commit e o VPS reconstrói e sobe o projeto `vampire`

#### Scenario: Configuração faltando
- **WHEN** o workflow roda sem algum dos secrets obrigatórios
- **THEN** ele falha antes de chamar a Hostinger, dizendo qual está faltando

### Requirement: CI antes do deploy
O repositório SHALL ter o workflow `.github/workflows/ci.yml`, que roda `pnpm check`, `pnpm typecheck`, `pnpm test`, `pnpm build`, os e2e da API contra um Postgres de serviço (depois de aplicar as migrações) e o build das imagens do `docker-compose.prod.yml`. Ele MUST rodar em pull requests e em pushes fora da `main`, e o workflow de deploy MUST chamá-lo e só implantar se ele passar.

#### Scenario: Teste quebrado na main
- **WHEN** um commit que quebra um teste chega na `main`
- **THEN** o CI falha e o deploy não é pedido à Hostinger

#### Scenario: Pull request
- **WHEN** alguém abre um pull request
- **THEN** o CI roda e mostra o resultado no PR, sem implantar nada
