## ADDED Requirements

### Requirement: Servidor de produção do web
O build do `web` (`pnpm build`) SHALL gerar, pelo plugin `nitro/vite`, um servidor Node autocontido em `web/.output/` (com as poucas dependências que o Nitro rastreia dentro de `.output/server/node_modules`), que roda sem o `node_modules` do workspace e é iniciado por `pnpm start` (`node .output/server/index.mjs`). O servidor MUST escutar na porta da variável `PORT`, com padrão `3000`, e MUST servir a renderização no servidor e os assets do cliente.

#### Scenario: Rodar a build
- **WHEN** o desenvolvedor roda `pnpm build` e depois `pnpm start` em `web/`
- **THEN** `GET http://localhost:3000/` responde `200` com o HTML do app

#### Scenario: Assets do cliente
- **WHEN** o navegador pede um arquivo de `/assets/` referenciado pelo HTML
- **THEN** o servidor responde `200` com o arquivo

### Requirement: Imagem Docker do web
O projeto SHALL ter um `web/Dockerfile` multi-stage, construído com a raiz do repositório como contexto, cuja imagem final contém só `web/.output/` sobre `node:24-alpine`, roda como usuário não root e expõe a porta `3000`. A URL da API MUST ser informada no build pelo argumento `VITE_API_URL`, com padrão `http://localhost:3333/api`, porque é o navegador que chama a API.

#### Scenario: Build com a URL padrão
- **WHEN** a imagem é construída sem `VITE_API_URL`
- **THEN** o app no navegador chama a API em `http://localhost:3333/api`

#### Scenario: Build com outra URL
- **WHEN** a imagem é construída com `--build-arg VITE_API_URL=https://vtm.exemplo.com/api`
- **THEN** o app no navegador chama a API em `https://vtm.exemplo.com/api`

#### Scenario: Imagem enxuta
- **WHEN** a imagem final é inspecionada
- **THEN** ela contém só `.output/` (sem o `node_modules` do workspace nem o código-fonte do `web`), e o processo roda como o usuário `node`
