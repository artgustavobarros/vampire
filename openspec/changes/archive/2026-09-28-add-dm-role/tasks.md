## 1. API — papel e conta do Mestre

- [x] 1.1 Em `api/src/db/schema.ts`, criar `pgEnum("user_role", ["player", "dm"])` e a coluna `users.role` (`NOT NULL DEFAULT 'player'`); exportar o tipo `Role`
- [x] 1.2 Gerar a migração com `pnpm --filter api db:generate` e acrescentar o `INSERT … ON CONFLICT (email) DO UPDATE SET role = 'dm', password_hash = EXCLUDED.password_hash` de `admin@admin.com` / nome "Mestre", com o hash bcrypt (custo 10, `bcryptjs`) de `!@#ASD123asd` gerado uma vez e colado no SQL
- [x] 1.3 Rodar `db:migrate` num banco local e conferir que usuários existentes ficaram `player` e que `admin@admin.com` entra com a senha
- [x] 1.4 `publicUserSchema` e `toPublicUser` passam a incluir `role`; conferir que signup ignora `role` no corpo
- [x] 1.5 Criar `@Roles(...)` em `api/src/common/roles.decorator.ts` e `RolesGuard` em `api/src/auth/roles.guard.ts` (`403` "Apenas o Mestre pode fazer isso."), registrado como segundo `APP_GUARD` no `AuthModule`, depois do `JwtAuthGuard`
- [x] 1.6 Testes unitários: `RolesGuard` (sem metadata passa, `player` recebe `403`, `dm` passa) e `AuthService` devolvendo `role`

## 2. API — rotas do Mestre e trava das Características

- [x] 2.1 `UsersService.findPlayerById(id)` e `SheetsService.list()` (`users LEFT JOIN sheets`, só `player`, ordenado por nome)
- [x] 2.2 `SheetsService`: `list()`, `getFor(userId)` e `mergeFor(userId, patch)` com `404` "Jogador não encontrado." para inexistente ou `dm`
- [x] 2.3 `SheetsService.merge`/`replace` de `/me/sheet`: transação com `SELECT … FOR UPDATE`, recusa `403` "Atributos e Habilidades só podem ser alterados pelo Mestre." quando `criada === true` e `attrs`/`skills` diferem (`isDeepStrictEqual`); `mergeFor` não aplica a trava
- [x] 2.4 Schemas Zod de resposta: item da lista `{ user, sheet, updatedAt }` e a lista
- [x] 2.5 `DmSheetsController` (`@Controller("sheets")`, `@Roles("dm")`): `GET /`, `GET /:userId`, `PATCH /:userId` com `ParseUUIDPipe` e documentação Swagger (`403`/`404`)
- [x] 2.6 e2e: login do Mestre com `role: "dm"`; `player` recebe `403` em `/sheets`; Mestre lista, lê e mescla a ficha de um jogador (inclusive `attrs` com ficha criada); `404` para UUID inexistente; `400` para id inválido
- [x] 2.7 e2e da trava: `403` ao mudar `attrs`/`skills` com `criada: true`, aceito durante a criação, aceito no patch que conclui (`criada: true` + `attrs`), aceito com `attrs` idêntico; ajustar o teste "grava, mescla e substitui" se ele mexer em `attrs` de ficha criada
- [x] 2.8 `api/README.md`: papéis, rotas `/sheets` e aviso para trocar a senha do Mestre fora de desenvolvimento
- [x] 2.9 `pnpm --filter api check`, `typecheck`, `test` e `test:e2e` passando

## 3. Web — cliente da API e stores

- [x] 3.1 `web/src/lib/api.ts`: `ApiUser.role`, tipo `Role`, `listSheets()`, `getPlayerSheet(id)`, `patchPlayerSheet(id, patch, { keepalive })`; atualizar `web/src/test/fake-api.ts`
- [x] 3.2 `usePlayerStore`: campo `role`; `login` limpa o personagem para `dm`; `logout` zera `role`; restauração ignora a ficha do `dm`
- [x] 3.3 `authenticate()` em `web/src/lib/auth.ts`: no login só busca `getSheet()` quando `role === "player"`
- [x] 3.4 `createSheetSync(read, write)` recebe a função de envio; `useCharacterStore.owner` vira `{ email, userId | null } | null` e a `write` escolhe `/me/sheet` ou `/sheets/:userId` na hora do envio
- [x] 3.5 Ação `openPlayerSheet(userId)` no store do personagem: `flush()` antes, busca `getPlayerSheet`, `load` com o novo dono
- [x] 3.6 Testes em `stores.test.tsx`: papel no login/restauração/logout, gravação do Mestre em `PATCH /sheets/:id`, troca de ficha com pendência não vaza para a outra

## 4. Web — rotas por papel

- [x] 4.1 `homeTarget` recebe `role` (`dm` → `/personagens`); atualizar `routes/index.tsx`, `auth-card.tsx` e o teste
- [x] 4.2 `routes/ficha.tsx`: `dm` → `/personagens`
- [x] 4.3 `routes/criar.tsx`: `dm` → `/personagens`; ficha criada redireciona para Características
- [x] 4.3b Remover o modo refazer: parâmetro `refazer`, prop do `WizardShell`, `removePredator` e auxiliares, campos de desfazer de `predBonus`, testes e requisito da spec
- [x] 4.4 Extrair para `features/sheet/tabs.ts` a resolução de aba (legada/desconhecida) usada por `ficha.$aba.tsx` e pela nova rota do Mestre
- [x] 4.5 Rotas `personagens.tsx` (guarda: sem sessão → `/entrar`, `player` → `/ficha/caracteristicas`), `personagens.index.tsx`, `personagens.$id.tsx` (abre a ficha, "Abrindo a ficha…", `404`/não criada → toast + `/personagens`) e `personagens.$id.$aba.tsx`; regenerar `routeTree.gen.ts`
- [x] 4.6 `AppToaster` em `__root.tsx`: subir os toasts também em `/personagens/<id>…`

## 5. Web — ficha, cabeçalho e menu

- [x] 5.1 `SheetLayout` recebe a base de navegação das abas e usa nos links do nome e do menu; `ficha.tsx` passa `/ficha/$aba`, `personagens.$id.tsx` passa `/personagens/$id/$aba`
- [x] 5.2 Cabeçalho: remover o rótulo da aba; para `dm`, "Mestre" em `text-blood` Karla caixa-alta; remover `tabLabel` e seus testes (sem uso)
- [x] 5.3 Gaveta: e-mail do dono da ficha aberta; item "Lista de personagens" (`text-blood`) antes de "Sair" só para `dm`, que faz `flushSheet()` e navega para `/personagens`
- [x] 5.4 `TraitGrid`: `onChange` opcional; sem ele, `DotRating` somente leitura
- [x] 5.5 `CaracteristicasTab`: `useCanEditTraits()` (`dm` ou ficha não criada) decide se passa `onChange`
- [x] 5.6 Testes: cabeçalho sem rótulo de aba e com "Mestre" para `dm`; menu do jogador sem "Lista de personagens"; aba Características somente leitura para jogador e editável para `dm`

## 6. Web — Lista de personagens

- [x] 6.1 `features/dm/character-list.tsx`: busca `listSheets()`, estados carregando/erro/vazio, cabeçalho "Lista de personagens" com botão contornado "Sair"
- [x] 6.2 Cartão (`features/dm/character-card.tsx`): nome/clã/e-mail, Fome em sangue, Vitalidade e Vontade `restante/máximo` via `vitalityMax`/`willpowerMax`/`trackBoxes`, botão "Ver ficha"; variante "Ainda sem personagem" sem botão; estilos só com classes Tailwind
- [x] 6.3 Função pura para os valores do cartão (`restante/máximo`) com teste unitário, incluindo dano superficial e agravado
- [x] 6.4 Teste de componente da lista: cartões, jogador sem personagem, lista vazia e navegação do "Ver ficha"

## 7. Verificação final

- [x] 7.1 `pnpm --filter web check`, `typecheck` e `test` passando
- [x] 7.2 Rodar o app: jogador não consegue mudar Atributos/Habilidades depois de criar; Mestre entra, vê a lista, abre uma ficha, muda um atributo e a Fome, volta à lista e vê os valores atualizados; cabeçalho mostra "MESTRE"
