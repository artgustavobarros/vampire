## Why

Hoje todo usuário é só um jogador que vê e edita a própria ficha, e nada impede que, depois de criado o personagem, o jogador mude Atributos e Habilidades à vontade. A mesa precisa de um Mestre que consulte e ajuste as fichas de todos, e as Características precisam ficar travadas para o jogador depois da criação — só o Mestre pode mexer nelas.

## What Changes

- **API — papéis**: `users` ganha a coluna `role` (`player` | `dm`), padrão `player`. Todo cadastro continua nascendo `player`; não há rota para mudar papel.
- **API — conta do Mestre**: uma migração cria (ou promove) a conta `admin@admin.com` com a senha `!@#ASD123asd` e papel `dm`.
- **API — usuário público**: `POST /auth/signup`, `POST /auth/login` e `GET /auth/me` passam a devolver `role` junto de `id`, `email` e `name`.
- **API — rotas do Mestre**: `GET /api/sheets` (lista de todos os jogadores com suas fichas), `GET /api/sheets/:userId` e `PATCH /api/sheets/:userId`, todas só para `dm` (`403` para `player`).
- **API — trava das Características**: **BREAKING** — `PATCH`/`PUT /api/me/sheet` responde `403` quando a ficha gravada já está criada (`criada: true`) e o corpo muda `attrs` ou `skills`. O Mestre, pelas rotas `/sheets/:userId`, não tem essa trava.
- **Web — trava na aba Características**: com o personagem criado, os pontos de Atributos e Habilidades ficam somente leitura para o jogador; para o Mestre continuam editáveis.
- **Web — refazer personagem**: **BREAKING** — o modo refazer do assistente é removido por completo (`/criar?refazer=true` passa a ser só `/criar`, que com ficha criada vai para a ficha), junto com a lógica de desfazer o Predador (`removePredator`) e os campos de `predBonus` que só serviam para isso.
- **Web — Lista de personagens**: nova página `/personagens`, só para o Mestre, com um cartão por jogador (nome do personagem, clã, e-mail, Fome, Vitalidade e Vontade atuais/máximas e botão "Ver ficha"), no estilo da referência enviada. Jogadores sem personagem criado aparecem como "Ainda sem personagem", sem botão.
- **Web — ficha aberta pelo Mestre**: `/personagens/:userId/:aba` reaproveita o layout e as abas da ficha, lendo e gravando pela API do Mestre. O menu lateral ganha "Lista de personagens" (antes de "Sair") quando o usuário é o Mestre.
- **Web — cabeçalho**: sai o rótulo da aba atual ao lado do nome do personagem; quando o usuário é o Mestre, no lugar aparece "MESTRE" em vermelho sangue (`blood`).
- **Web — rotas por papel**: o Mestre entra direto na Lista de personagens e não tem ficha própria (`/ficha` e `/criar` o levam para `/personagens`); jogador que abre `/personagens` volta para `/ficha`.

## Capabilities

### New Capabilities

- `dm-mode`: papel de Mestre no web — Lista de personagens, abrir e editar a ficha de qualquer jogador, indicação "MESTRE" no cabeçalho e rotas por papel.

### Modified Capabilities

- `api-auth`: usuários passam a ter papel (`player` padrão, `dm` semeado), o usuário público inclui `role`, e nasce a verificação de papel nas rotas (`403`).
- `api-sheets`: novas rotas do Mestre sobre a ficha de qualquer jogador; `PATCH`/`PUT /me/sheet` recusa mudar Atributos e Habilidades de ficha já criada.
- `app-state`: o store do jogador guarda o papel; o store do personagem sabe de quem é a ficha aberta e grava na rota certa (`/me/sheet` ou `/sheets/:userId`).
- `character-sheet`: cabeçalho sem rótulo da aba e com "MESTRE" para o Mestre; menu com "Lista de personagens" para o Mestre e sem "Refazer personagem"; aba Características somente leitura para o jogador depois da criação.
- `character-wizard`: sai o modo refazer (e o requisito "Refazer sem o Predador aplicado"); `predBonus` guarda só a Potência.

## Impact

- **API**: `api/src/db/schema.ts`, nova migração em `api/drizzle/` (coluna `role` + conta do Mestre), `api/src/users/*` (`role` no usuário público e listagem), `api/src/auth/*` (decorator `@Roles` e guard de papel), `api/src/sheets/*` (controller do Mestre e trava das Características), testes unitários e e2e.
- **Web**: `web/src/lib/api.ts` (tipos com `role`, rotas `/sheets`), `web/src/stores/player-store.ts`, `web/src/stores/character-store.ts` e `sheet-sync.ts` (destino da gravação), `web/src/features/sheet/sheet-layout.tsx` (cabeçalho e menu), `web/src/features/sheet/tabs.ts` (`tabLabel` deixa de ter uso), `web/src/components/vtm/trait-grid.tsx` (modo somente leitura), `web/src/features/sheet/tabs/caracteristicas-tab.tsx`, `web/src/features/auth/home-path.ts`, rotas `index`, `ficha`, `criar` e as novas `personagens*`, nova feature `web/src/features/dm/`.
- **Banco**: migração não destrutiva (coluna com padrão); a conta `admin@admin.com` é criada ou promovida a `dm` se já existir.
- **Segurança**: a senha do Mestre fica fixa no repositório (como hash bcrypt na migração); deve ser trocada fora de desenvolvimento.
