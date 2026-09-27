# monorepo-workspace Specification

## Purpose
A raiz do repositório como workspace pnpm com os pacotes `api` e `web`: lockfile único, scripts que rodam nos dois pacotes e `.gitignore` compartilhado.
## Requirements
### Requirement: Workspace pnpm na raiz
A raiz do repositório SHALL ser um workspace pnpm cujos pacotes são `api` e `web`, com um único `pnpm-lock.yaml` e um único `pnpm-workspace.yaml`, ambos na raiz. Os pacotes MUST NOT ter lockfile nem `pnpm-workspace.yaml` próprios. O `package.json` da raiz MUST fixar o pnpm em `packageManager`.

#### Scenario: Instalar tudo
- **WHEN** o desenvolvedor roda `pnpm install` na raiz de um clone limpo
- **THEN** as dependências de `api` e de `web` são instaladas e só existe o `pnpm-lock.yaml` da raiz

#### Scenario: Lockfile congelado
- **WHEN** alguém roda `pnpm install --frozen-lockfile` na raiz sem ter mudado nenhum `package.json`
- **THEN** a instalação termina sem erro e sem alterar o lockfile

### Requirement: Scripts da raiz
O `package.json` da raiz SHALL ter os scripts `dev` (API em modo watch e `web` em dev, em paralelo), `build`, `test`, `typecheck`, `check` e `fix`, que rodam o script de mesmo nome nos dois pacotes.

#### Scenario: Verificar tudo
- **WHEN** o desenvolvedor roda `pnpm test`, `pnpm typecheck` ou `pnpm check` na raiz
- **THEN** o comando roda em `api` e em `web` e falha se falhar em qualquer um deles

#### Scenario: Desenvolver os dois juntos
- **WHEN** o banco está no ar, `api/.env` existe e o desenvolvedor roda `pnpm dev` na raiz
- **THEN** a API sobe em `http://localhost:3333/api` com recarga ao salvar e o `web` em `http://localhost:3000`

### Requirement: Arquivos ignorados pelo git
O repositório SHALL ter um `.gitignore` na raiz que ignora dependências (`node_modules`), saídas de build (`dist`, `.output`), cobertura, arquivos `.env` e `*.tsbuildinfo` em qualquer pasta, além de `openspec/*.py`, `openspec/*.txt` e `__pycache__/`. As pastas de ferramentas `.claude/`, `.agent/`, `.agents/`, `.codex/` e o arquivo `skills-lock.json` MUST NOT ser ignorados.

#### Scenario: Depois de instalar e buildar
- **WHEN** o desenvolvedor roda `pnpm install` e `pnpm build` na raiz
- **THEN** `git status` não lista nenhum `node_modules/`, `dist/` nem `.output/`

#### Scenario: Ferramentas versionáveis
- **WHEN** o desenvolvedor roda `git status` com as pastas de ferramentas presentes
- **THEN** `.claude/`, `.agent/`, `.agents/`, `.codex/` e `skills-lock.json` aparecem como não versionados (e podem ser adicionados), e os `.py` e `.txt` de `openspec/` não aparecem

