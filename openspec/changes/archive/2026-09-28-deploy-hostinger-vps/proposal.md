## Why

O app só roda em `localhost`. Para os jogadores usarem de verdade, ele precisa estar num endereço público com HTTPS. Já existe um VPS Hostinger (KVM 1, `srv1631900.hstgr.cloud`, `177.7.51.113`) com Traefik nas portas 80/443 e um domínio próprio (`artbarros.tech`). O `docker-compose.yml` atual não serve para produção: publica o Postgres com senha fixa e tem `JWT_SECRET` de desenvolvimento como padrão.

## What Changes

- Novo `docker-compose.prod.yml` na raiz para rodar `db`, `api` e `web` atrás do Traefik do VPS, num subdomínio definido por `APP_HOST`:
  - um domínio só: `/api/*` vai para a `api` e o resto para o `web`, que é construído com `VITE_API_URL=/api` (mesma origem, sem CORS)
  - nenhuma porta publicada no host; o `db` fica só na rede interna
  - `APP_HOST`, `POSTGRES_PASSWORD` e `JWT_SECRET` obrigatórios, sem valor padrão
  - `restart: unless-stopped` e healthcheck nos três serviços
- Novo workflow `.github/workflows/deploy.yml`: a cada push na `main`, a action `hostinger/deploy-on-vps` manda o VPS clonar o commit e subir o `docker-compose.prod.yml`, com as variáveis vindas dos secrets do GitHub.
- Novo workflow `.github/workflows/ci.yml` (lint, tipos, testes, build, e2e e imagens), em PRs e chamado pelo deploy: só implanta se passar.
- README com a seção de deploy: pré-requisitos no VPS, DNS, secrets e como acompanhar.
- **Conta do Mestre por variável:** a migração `0001_roles` deixa de inserir `admin@admin.com` com senha conhecida (o repositório é público); a API cria ou atualiza o Mestre ao subir a partir de `ADMIN_EMAIL` e `ADMIN_PASSWORD`. Bancos que já aplicaram a migração não mudam.
- `docker-compose.yml` de desenvolvimento só ganha as variáveis do Mestre, com os valores de sempre como padrão.

## Capabilities

### New Capabilities
- `production-deploy`: compose de produção atrás do Traefik do VPS, roteamento por caminho num domínio só, segredos obrigatórios e deploy contínuo via GitHub Actions para o VPS Hostinger.

### Modified Capabilities
- `api-auth`: a conta do Mestre deixa de vir de uma migração com senha fixa e passa a ser garantida pela API a partir de `ADMIN_EMAIL` e `ADMIN_PASSWORD`.

## Impact

- Arquivos novos: `docker-compose.prod.yml`, `.github/workflows/deploy.yml`; README e `.env.example` ganham a parte de produção.
- `api/`: `AdminBootstrap` no módulo de auth, `UsersService.upsertDm`, `ADMIN_EMAIL`/`ADMIN_PASSWORD` na validação de ambiente, seed removido da `0001_roles.sql` e a config dos e2e fixando o Mestre de teste. `web/` não muda: o cliente já aceita `VITE_API_URL` relativa.
- Infra fora do repositório (feita pelo usuário): registro DNS A do subdomínio, repositório público no GitHub, chave de API da Hostinger e secrets, Traefik como projeto próprio no Docker Manager.
- O build roda no próprio VPS a cada deploy.
