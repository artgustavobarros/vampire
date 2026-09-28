## Context

A API (NestJS + Drizzle + Postgres) tem `users` e `sheets` (uma ficha `jsonb` por usuário) e só conhece o "usuário do token": `JwtAuthGuard` global carrega o usuário do banco a cada requisição e as rotas de ficha são `/api/me/sheet`. O web (TanStack Start + Zustand) guarda a sessão em `usePlayerStore` e a ficha aberta em `useCharacterStore`, que grava com `PATCH /me/sheet` agrupado por `createSheetSync`. Toda a ficha (`SheetLayout`, abas, barra inferior, diálogos) lê e escreve só pelo `useCharacterStore`, o que permite reaproveitá-la para qualquer ficha carregada nele.

Hoje nada impede o jogador de mudar Atributos e Habilidades depois de concluir o assistente, e não existe quem consulte as fichas dos outros. A referência visual da Lista de personagens (cartões com filete sangue, Fome/Vitalidade/Vontade e botão "Ver ficha") veio de uma versão local antiga; os nomes de abas atuais (Características, Disciplinas & Sangue, …) continuam valendo.

## Goals / Non-Goals

**Goals:**
- Papel por usuário (`player` padrão, `dm`) verificado na API, com a conta `admin@admin.com` semeada como `dm`.
- Mestre lista e edita a ficha de qualquer jogador reaproveitando a ficha existente.
- Atributos e Habilidades travados para o jogador depois da criação, na UI **e** na API.
- Cabeçalho sem rótulo de aba; "MESTRE" em `blood` para o Mestre.

**Non-Goals:**
- Tela ou rota para promover/rebaixar usuários, vários Mestres por mesa, crônicas/mesas separadas.
- Mestre com personagem próprio.
- Travar outras partes da ficha (Disciplinas, Vantagens, Humanidade etc.) — ver Open Questions.
- Trocar a senha do Mestre pela UI.

## Decisions

### 1. Papel como coluna `role` com enum no Postgres
`users.role` como `pgEnum("user_role", ["player", "dm"])`, `NOT NULL DEFAULT 'player'`. O `UsersService.create` não recebe papel; o schema de signup continua sem `role`, então um `role` extra no corpo é descartado pelo Zod.
- *Alternativa*: tabela `roles`/`user_roles` — excesso para dois papéis fixos.
- *Alternativa*: `is_dm boolean` — enum deixa claro o vocabulário e aceita um terceiro papel sem migração de tipo de coluna.

### 2. Conta do Mestre semeada numa migração SQL com hash pré-calculado
A migração `0001_*` (gerada com `drizzle-kit generate` para o enum/coluna e completada à mão, ou uma migração `--custom` separada) faz:
```sql
INSERT INTO users (email, name, password_hash, role)
VALUES ('admin@admin.com', 'Mestre', '<bcrypt cost 10 de !@#ASD123asd>', 'dm')
ON CONFLICT (email) DO UPDATE SET role = 'dm', password_hash = EXCLUDED.password_hash;
```
O hash é gerado uma vez com `bcryptjs` (mesma lib e custo do `AuthService`) e colado no SQL; o texto da senha não entra no repositório fora da spec/proposta.
- *Alternativa*: seed em `onApplicationBootstrap` — roda a cada boot, mistura dado com código e precisa de flag para não sobrescrever a senha. A migração roda uma vez e já faz parte do deploy (`db:migrate` / container).
- *Alternativa*: `pgcrypto` (`crypt(..., gen_salt('bf'))`) — exige extensão só para isso.

### 3. `role` no usuário público, lido do banco
`publicUserSchema` ganha `role: z.enum(["player","dm"])`; `toPublicUser` o repassa. O JWT **não** leva o papel: o `JwtAuthGuard` já busca o usuário a cada requisição, então o papel é sempre o atual e trocar papel no banco vale na hora sem invalidar tokens.

### 4. `@Roles("dm")` + `RolesGuard` global depois do `JwtAuthGuard`
Decorator `@Roles(...roles)` em `common/` (metadata via `Reflector`) e `RolesGuard` registrado como segundo `APP_GUARD` no `AuthModule` (a ordem de registro é a ordem de execução). Sem metadata, passa; com metadata, compara `request.user.role` e lança `ForbiddenException("Apenas o Mestre pode fazer isso.")`. O filtro de exceção existente já formata a mensagem.
- *Alternativa*: checar o papel dentro de cada handler — espalha a regra e é fácil de esquecer.

### 5. Controller do Mestre separado: `DmSheetsController` em `/sheets`
No `SheetsModule`, um controller novo `@Controller("sheets") @Roles("dm")` com `GET /`, `GET /:userId` e `PATCH /:userId` (`ParseUUIDPipe` para `400`). O `SheetsService` passa a trabalhar por `userId` com uma opção de trava:
- `list()`: `users LEFT JOIN sheets` onde `role = 'player'`, ordenado por `users.name`, devolvendo `{ user, sheet, updatedAt }`.
- `getFor(userId)`/`mergeFor(userId, patch)`: antes, confirmam que o usuário existe e é `player` (senão `404 "Jogador não encontrado."`), depois reusam `get`/`merge`.
Manter `/me/sheet` intacto evita mexer no cliente do jogador.
- *Alternativa*: `/me/sheet?userId=` — mistura "minha ficha" com "ficha de outro" e complica a documentação Swagger.

### 6. Trava das Características no service, com leitura sob `FOR UPDATE`
`merge`/`replace` de `/me/sheet` rodam numa transação: `SELECT data FROM sheets WHERE user_id = $1 FOR UPDATE`; se `data.criada === true` e o corpo traz `attrs` ou `skills` com `!isDeepStrictEqual(novo, gravado)` (`node:util`, indiferente à ordem das chaves), lança `ForbiddenException("Atributos e Habilidades só podem ser alterados pelo Mestre.")`; senão segue com o mesmo `upsert` de hoje (mescla `jsonb ||` numa instrução). A checagem usa o estado **gravado**, então o `patch` que conclui o assistente (`criada: true` + `attrs`) passa. O `FOR UPDATE` impede que um `patch` concorrente mude `criada` entre a checagem e a gravação; quando não há linha, não há o que travar.
- *Alternativa*: recusar pela simples presença da chave — quebraria o envio de `attrs` idênticos (ex.: `PUT` da ficha inteira) sem ganho.
- *Alternativa*: só travar no web — trivial de contornar com `curl`; a regra é da mesa, então a API decide.

### 7. Web: papel no `usePlayerStore`, destino da gravação no `useCharacterStore`
- `ApiUser.role` no `lib/api.ts`, mais `listSheets()`, `getPlayerSheet(id)` e `patchPlayerSheet(id, patch, opts)`.
- `usePlayerStore` ganha `role`. `login(user, sheet)`: se `dm`, limpa o personagem em vez de carregar. `authenticate()` (entrar) só chama `getSheet()` quando `res.user.role === "player"`; a restauração mantém `Promise.all([me(), getSheet()])` e ignora a ficha do `dm` (evita um ida-e-volta extra para o caso comum).
- `useCharacterStore.owner` deixa de ser só o e-mail e vira `{ email: string; userId: string | null } | null` (`userId: null` = a própria ficha). `createSheetSync(read, write)` recebe a função de envio; o store passa uma `write` que olha `owner` **na hora do envio** e chama `patchSheet` ou `patchPlayerSheet(userId, …)`.
- Nova ação `openPlayerSheet(userId)`: `await flush()` (as pendências vão para o dono anterior, pois `owner` ainda não mudou), `getPlayerSheet(userId)`, depois `load(owner, raw)` — que já faz `sync.reset()`. Isso cumpre "trocar de ficha não vaza mudanças".

### 8. Rotas do Mestre reaproveitando `SheetLayout`
Arquivos de rota novos:
- `personagens.tsx` — layout com guarda: sem sessão → `/entrar`; `player` → `/ficha/caracteristicas`; `dm` → `<Outlet />`.
- `personagens.index.tsx` — `DmCharacterList` (`features/dm/character-list.tsx`), que busca `listSheets()` num efeito a cada montagem (para refletir o que o Mestre acabou de editar), com estados carregando / erro (toast com "Tentar de novo", via `apiError`) / lista. O web não usa TanStack Query hoje e uma única busca não justifica a dependência.
- `personagens.$id.tsx` — chama `openPlayerSheet(id)` num efeito ao mudar `id`, mostra "Abrindo a ficha…" até o `owner.userId` bater com `id`, trata `404`/`criada !== true` com toast + `Navigate` para `/personagens`, e renderiza `<SheetLayout />`.
- `personagens.$id.$aba.tsx` — mesmo tratamento de abas legadas/desconhecidas de `ficha.$aba.tsx`, redirecionando dentro de `/personagens/$id/$aba`. A lógica de "resolver a aba" sai de `ficha.$aba.tsx` para um helper em `features/sheet/tabs.ts` usado pelas duas rotas.

`SheetLayout` passa a receber a base de navegação das abas (`{ to: "/ficha/$aba" }` ou `{ to: "/personagens/$id/$aba", id }`), usada no link do nome e nos itens do menu. O `AppToaster` do `__root` passa a subir os toasts também em `/personagens/<id>` (onde há barra inferior), mas não em `/personagens`.

`homeTarget` ganha `role`: `dm` → `/personagens`. `ficha.tsx` e `criar.tsx` redirecionam o `dm` para `/personagens`.

### 8b. Fim do modo refazer
Com Atributos e Habilidades travados para o jogador e o Mestre editando direto na ficha, o modo refazer não tem mais usuário (decisão tomada durante a implementação). Sai por completo: o parâmetro `refazer` de `/criar`, a prop `refazer` do `WizardShell`, `removePredator` e seus auxiliares, e os campos de `predBonus` que só serviam para desfazer (`disciplina`, `humanidade`, `novaDisciplina`, `poder`). `predBonus` fica `{ potencia }`, ainda lido pela Potência de Sangue e usado como marca de "Predador já aplicado".

### 9. Travar a aba Características pelo `TraitGrid`
`TraitGrid.onChange` fica opcional; sem ele, repassa `DotRating` sem `onChange` (o modo somente leitura que já existe, `role="img"` com o valor). `CaracteristicasTab` decide com um hook `useCanEditTraits()` = `role === "dm" || !sheet.criada`. O assistente continua passando `onChange`, então nada muda nos passos 2 e 3.

### 10. Cabeçalho e menu
- Remove o `<span>{tabLabel(current)}</span>` do cabeçalho e, como `tabLabel` fica sem uso, remove a função e seus testes.
- Para `dm`, no mesmo lugar: `<span className="… font-label font-semibold text-blood text-xs uppercase tracking-[.12em]">Mestre</span>` (classes Tailwind no JSX; nada novo em `styles.css`).
- Gaveta: e-mail mostrado é `owner.email` (o dono da ficha aberta). Para `dm`, item "Lista de personagens" (`text-blood`) antes de "Sair"; ao clicar, `await flushSheet()` e navega para `/personagens`.

### 11. Cartão da Lista de personagens
Valores calculados no web com as regras existentes, sobre a ficha normalizada (`normalizeSheet`): Vitalidade = `vitalityMax(sheet) − caixas marcadas de trackBoxes(sheet.vit, max)`, idem Vontade com `willpowerMax`/`fdv`. Clã vem de `sheet.cla`; e-mail e nome do jogador vêm de `user`. Layout segue a referência: grid de uma coluna no celular, `border-t-4 border-blood bg-surface border border-line`, botão `Button` sangue de largura total. Cabeçalho da página com o título Cormorant e botão contornado "Sair".

## Risks / Trade-offs

- [Senha fixa do Mestre no repositório (proposta/spec e hash na migração)] → Documentar no `api/README.md` que em produção a senha deve ser trocada (ex.: `UPDATE users SET password_hash = …`); o hash não expõe a senha, mas a spec sim, e isso foi pedido explicitamente.
- [`ON CONFLICT DO UPDATE` sobrescreve a senha de um `admin@admin.com` que já existisse] → Aceito: o e-mail é reservado para o Mestre; a migração roda uma única vez.
- [Jogador com ficha criada fica sem caminho para corrigir um erro de distribuição] → Intencional: pede ao Mestre, que edita direto na ficha.
- [e2e existente "grava, mescla e substitui" muda `attrs` numa ficha possivelmente criada] → Ajustar o teste para usar `criada: false` ou incluir casos da trava.
- [Mestre e jogador editando a mesma ficha ao mesmo tempo] → A mescla por chave de primeiro nível no banco evita perder campos diferentes; o mesmo campo fica com a última gravação (mesmo comportamento de hoje entre duas abas). Sem sincronização em tempo real nesta etapa.
- [Lista traz a ficha inteira de todos] → Aceitável para uma mesa (poucos jogadores); se crescer, criar um resumo no servidor.

## Migration Plan

1. `pnpm --filter api db:generate` para o enum/coluna; acrescentar o `INSERT … ON CONFLICT` do Mestre (mesma migração ou uma `--custom` logo depois).
2. Deploy da API: `db:migrate` roda antes de subir; usuários existentes ganham `role = 'player'` pelo padrão.
3. Deploy do web. Clientes antigos continuam funcionando (ignoram `role`); só perdem a edição de Atributos/Habilidades, agora recusada com `403` e mostrada como toast "Não salvou".
4. Rollback: reverter o código; a coluna e a conta podem ficar (não quebram a versão anterior). Se preciso, `ALTER TABLE users DROP COLUMN role; DROP TYPE user_role;`.

## Open Questions

- Além de Atributos e Habilidades, algo mais deve travar para o jogador depois da criação (Disciplinas e seus níveis, Vantagens & Defeitos, Potência do Sangue, Humanidade)? Esta mudança trava só o que está na aba Características.
