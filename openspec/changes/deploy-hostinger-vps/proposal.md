## Why

O app só roda em `localhost`. Para os jogadores usarem de verdade, ele precisa estar num endereço público com HTTPS. Já existe um VPS Hostinger (KVM 1, `srv1631900.hstgr.cloud`, `177.7.51.113`) com Traefik nas portas 80/443 e um domínio próprio (`artbarros.tech`). O `docker-compose.yml` atual não serve para produção: publica o Postgres com senha fixa e tem `JWT_SECRET` de desenvolvimento como padrão.

## What Changes

- Novo `docker-compose.prod.yml` na raiz para rodar `db`, `api` e `web` atrás do Traefik do VPS, num subdomínio definido por `APP_HOST`:
  - um domínio só: `/api/*` vai para a `api` e o resto para o `web`, que é construído com `VITE_API_URL=/api` (mesma origem, sem CORS)
  - nenhuma porta publicada no host; o `db` fica só na rede interna
  - `APP_HOST`, `POSTGRES_PASSWORD` e `JWT_SECRET` obrigatórios, sem valor padrão
  - `restart: unless-stopped` e healthcheck nos três serviços
- Novo workflow `.github/workflows/deploy.yml`: a cada push na `main`, a action `hostinger/deploy-on-vps` manda o VPS clonar o commit e subir o `docker-compose.prod.yml`, com as variáveis vindas dos secrets do GitHub.
- README com a seção de deploy: pré-requisitos no VPS, DNS, secrets e como acompanhar.
- `docker-compose.yml` de desenvolvimento continua igual.

## Capabilities

### New Capabilities
- `production-deploy`: compose de produção atrás do Traefik do VPS, roteamento por caminho num domínio só, segredos obrigatórios e deploy contínuo via GitHub Actions para o VPS Hostinger.

### Modified Capabilities
<!-- nenhuma: o compose de dev, os Dockerfiles e o cliente da API continuam como estão -->

## Impact

- Arquivos novos: `docker-compose.prod.yml`, `.github/workflows/deploy.yml`; README e `.env.example` ganham a parte de produção.
- Sem mudança de código em `api/` ou `web/`: o cliente já aceita `VITE_API_URL` relativa e a API já exige `JWT_SECRET` com 32+ caracteres.
- Infra fora do repositório (feita pelo usuário): registro DNS A do subdomínio, repositório público no GitHub, chave de API da Hostinger e secrets, Traefik como projeto próprio no Docker Manager.
- O build roda no próprio VPS a cada deploy.
