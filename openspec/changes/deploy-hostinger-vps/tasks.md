## 1. Compose de produção

- [x] 1.1 Criar `docker-compose.prod.yml` com `db`, `api` e `web`, sem `ports`, `restart: unless-stopped`, só a rede padrão do projeto (o Traefik do VPS roda em `network_mode: host`)
- [x] 1.2 Exigir `APP_HOST`, `POSTGRES_PASSWORD` e `JWT_SECRET` com `${VAR:?mensagem}` e montar `DATABASE_URL` e `CORS_ORIGIN` a partir deles
- [x] 1.3 Labels do Traefik: routers `vampire-api` (`Host && PathPrefix(/api)`) e `vampire-web` (`Host`), entrypoint `websecure`, cert resolver `letsencrypt`, services com as portas 3333 e 3000
- [x] 1.4 Build do `web` com `VITE_API_URL=/api`
- [x] 1.5 Healthchecks: `pg_isready` no `db`, `wget` em `/api/health` na `api` e em `/` no `web`
- [x] 1.6 Validar com `docker compose -f docker-compose.prod.yml config` (com e sem as variáveis obrigatórias)

## 2. Verificação local

- [x] 2.1 Subir o compose de produção localmente com um Traefik de teste em `network_mode: host` e conferir `/`, `/api/health` e o login pelo mesmo host
- [x] 2.2 Conferir que o `db` não tem porta publicada e derrubar o ambiente de teste

## 3. Deploy contínuo

- [x] 3.1 Criar `.github/workflows/deploy.yml`: push na `main` e `workflow_dispatch`, `concurrency`, passo que valida secrets e variables, `hostinger/deploy-on-vps@v2` com `project-name: vampire` e `docker-compose-path: docker-compose.prod.yml`

- [x] 3.2 Criar `.github/workflows/ci.yml` (lint, tipos, testes, build, e2e com Postgres de serviço e build das imagens de produção) em PRs e pushes fora da `main`, chamado pelo `deploy.yml` antes do deploy

## 3a. Conta do Mestre por variável

- [x] 3a.1 `ADMIN_EMAIL` e `ADMIN_PASSWORD` opcionais na validação de ambiente, exigidas juntas
- [x] 3a.2 `UsersService.upsertDm` e `AdminBootstrap` (upsert do Mestre ao subir), com teste unitário
- [x] 3a.3 Tirar o `INSERT` do Mestre da `0001_roles.sql`; e2e fixam o Mestre de teste pela config
- [x] 3a.4 Variáveis no compose de dev (padrão de sempre), no de produção (obrigatórias), no CI e no deploy, com validação da senha

## 4. Documentação

- [x] 4.1 README: seção "Deploy (Hostinger)" com pré-requisitos no VPS, DNS, secrets e variables do GitHub, como acompanhar e reverter
- [x] 4.2 `.env.example`: citar as variáveis de produção e onde elas ficam

## 5. Infra (feito pelo usuário, fora do repositório)

- [x] 5.1 Conferir no Docker Manager se o Traefik é projeto próprio (é: `/docker/traefik-5k2e`, template da Hostinger)
- [x] 5.2 Conferir rede, entrypoint e cert resolver do Traefik (`network_mode: host`, `websecure`, `letsencrypt`)
- [x] 5.2a Ligar o projeto `traefik-5k2e` (está parado) e conferir que responde nas portas 80/443
- [x] 5.3 Criar o registro A do subdomínio de `artbarros.tech` para `177.7.51.113`
- [ ] 5.4 Criar o repositório público no GitHub e fazer o push
- [ ] 5.5 Gerar a chave de API da Hostinger e cadastrar secrets (`HOSTINGER_API_KEY`, `JWT_SECRET`, `POSTGRES_PASSWORD`, `ADMIN_PASSWORD`) e variables (`HOSTINGER_VM_ID`, `APP_HOST`, `ADMIN_EMAIL`)
- [ ] 5.6 Rodar o primeiro deploy e conferir `https://<APP_HOST>` e `https://<APP_HOST>/api/health`
