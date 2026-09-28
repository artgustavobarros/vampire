## Context

- **API**: NestJS 12 + Drizzle/Postgres. Tem `users` e `sheets` (ficha em `jsonb`), `RolesGuard` com `@Roles("dm")`, schemas zod que geram o Swagger, e migrações em `api/drizzle/` (geradas e, quando preciso, completadas à mão, como a `0001_roles.sql` com o insert do Mestre).
- **Web**: TanStack Router, com o painel do Mestre em `personagens._painel.*` (`DmShell` com as abas "Lista de personagens" e "Ações"). As páginas do Mestre buscam dados direto por `lib/api.ts` com estado local; o `CharacterList` é o modelo. A ficha do jogador tem as abas em `features/sheet/tabs.ts`, que valem igual para `/ficha` e `/personagens/$id`. Não existe editor de texto rico. `DamageTrack` exige `onCycle`, então sempre é interativo.
- **Gerador de NPC**: hoje é a planilha `Gerador_NPC_Sertao_Alagoano_1936_V10.xlsx`, fora do repositório (OneDrive do Mestre, `/mnt/c/Users/arthu/OneDrive/Documentos/RPG/Vampiro/` no WSL). A aba `Listas` tem 76 colunas, com repetição como peso. A aba `NPC` tem as fórmulas: ordem dos sorteios, estrato antes da ocupação, ocupações letradas e ativas, virtude e falha sem repetir, ressonância ligada ao temperamento, alcunha em d10, gancho composto em d10, objeto composto e o texto do resumo. A aba `Referência` tem os pesos de estrato (62/30/8) e de exposição (60/20/12/6/2) e os créditos.

## Goals / Non-Goals

**Goals:**
- Coteries, bestiário e rodada persistidos na API. Os dados ocultos de inimigos são filtrados **no servidor**.
- O jogador acompanha a rodada quase em tempo real sem nova infraestrutura.
- Regras da rodada e do gerador de NPC como funções puras, testáveis com dado injetado.
- As listas do NPC fiéis à planilha e regeráveis por script.

**Non-Goals:**
- Tempo real de verdade (WebSocket/SSE), edição simultânea por dois Mestres, histórico de rodadas.
- Aplicar dano de inimigo em ficha de jogador pela Rodada: o dano de jogador continua na ficha.
- Salvar NPCs gerados, ou transformar NPC em inimigo.
- Várias rodadas ou várias crônicas: há uma rodada só.
- Editar as listas do NPC dentro do app: a fonte continua sendo a planilha.

## Decisions

### API: módulo `chronicle` com três tabelas novas e uma de linha única
`api/src/chronicle/` tem:
- controllers `coteries.controller.ts` (`/coteries`, Mestre), `enemies.controller.ts` (`/enemies`, Mestre), `round.controller.ts` (`GET /round` para todos, `PUT /round` com `@Roles("dm")` no método) e `my-coterie.controller.ts` (`/me/coterie`);
- serviços `coteries.service.ts`, `enemies.service.ts` e `round.service.ts`;
- o módulo importa `UsersModule`.

Tabelas em `db/schema.ts`:
- `coteries(id uuid pk, name text not null default '', timestamps)`;
- `coterie_members(user_id uuid pk → users on delete cascade, coterie_id uuid → coteries on delete cascade, created_at)`. `user_id` como chave primária garante uma coterie por jogador no banco;
- `enemies(id uuid pk, data jsonb not null, timestamps)`;
- `rounds(id smallint pk check (id = 1), data jsonb not null, updated_at)`. A migração insere a linha `{ "rodada": 1, "vez": 0, "ordem": [] }`.

Migração `0002_chronicle.sql` gerada por `drizzle-kit generate` e completada à mão com o `CHECK` e o `INSERT`, como a `0001`.

*Alternativas*:
- (a) `coterie_id` em `users`: mistura conta com mesa e perde a data de entrada.
- (b) Rodada relacional (`round_entries`): mais tabelas e ordenação por coluna, sem ganho. Há um só escritor (o Mestre) e o estado inteiro é pequeno.

### Rodada: estado inteiro por `PUT`, visão enriquecida no `GET`
O web calcula o novo estado com `rules/round.ts` e envia `{ rodada, vez, ordem }` inteiro. O servidor valida: participantes existentes e sem repetição, e `vez` dentro da ordem. `GET /round` monta a visão, juntando cada participante com a projeção da ficha ou com o inimigo, e **remove `dados` de inimigos ocultos quando quem pede não é Mestre**. Participantes que sumiram são omitidos na leitura e `vez` é recortada, então não há gatilho nem limpeza periódica. O `DELETE /enemies/:id` também os tira da ordem gravada, na mesma transação.

*Alternativa*: rotas de ação (`POST /round/proximo` e afins). Duplicaria as regras no servidor. Com estado inteiro, as regras ficam só no web, testadas como funções puras, e o servidor só garante a consistência.

### Projeção da ficha para jogadores
`chronicle/sheet-projection.ts` exporta `projectSheet(data)`, que devolve só `nome`, `cla`, `criada`, `fome`, `vit`, `fdv` e `attrs.{Vigor, Autocontrole, Determinação}`. É usada em `GET /me/coterie` e nos jogadores de `GET /round`, para que um jogador não receba a ficha inteira nem o e-mail de outro. No web, `summarize()` (de `features/dm/summary.ts`) já funciona com essa projeção, porque `normalizeSheet` completa o resto. A visão do Mestre em `GET /coteries` usa a ficha inteira, como `GET /sheets`.

### Jogador acompanha por polling de 5 s
`hooks/use-polling.ts` chama a função ao montar e a cada 5 s enquanto `document.visibilityState === "visible"`, e de novo no `visibilitychange` para visível. Erros depois da primeira carga são engolidos. A resposta tem poucos KB e a mesa tem poucos jogadores.

*Alternativa*: SSE ou WebSocket. Pede infraestrutura nova (gateway, proxy, reconexão) para um ganho que a mesa não sente.

### Regras puras da rodada
`rules/round.ts` exporta:
- o tipo `RoundState = { rodada, vez, ordem: RoundEntry[] }`;
- as funções `next`, `prev`, `canPrev`, `restart`, `sortByInitiative`, `move(state, i, ±1)`, `remove(state, i)`, `add(state, entry)`, `clear`, `setInitiative(state, i, n | null)` e `currentEntry`.

Todas imutáveis. Nas que reordenam, a vez segue o participante, localizado por `tipo + id` antes e depois. Testes em `rules/round.test.ts`.

### Páginas do Mestre: estado local, sem store novo
Seguem o `CharacterList`: `useEffect` com `attempt` para tentar de novo, e erros por `apiError`. Cada página busca o que precisa:
- **Coteries**: `GET /coteries` e `GET /sheets` (para o seletor).
- **Bestiário**: `GET /enemies` e `GET /round` (para "Na rodada").
- **Rodada**: `GET /round`, `GET /sheets` e `GET /enemies`.

Após cada mutação, a página usa a resposta da API como novo estado. Não há cache entre as abas: um store global só serviria para evitar alguns GETs.

**Autosave** do inimigo e do nome da coterie: `hooks/use-debounced-save.ts` (500 ms; envia o pendente no `unmount` e em `pagehide` com `keepalive`). Cada editor de inimigo tem o seu.

### Abas da ficha por contexto
`tabs.ts` passa a exportar `tabsFor(context: "jogador" | "mestre")`. O contexto `mestre` filtra `coterie` e `rodada`. `isSheetTab` e `resolveTab` recebem o contexto. `SheetLayout` deriva o contexto de `tabs.to`, e as rotas `ficha.$aba` e `personagens.$id.$aba` passam o seu. Com isso, `/personagens/<id>/rodada` cai no redirecionamento padrão para `caracteristicas`.

### Texto rico sem dependência
`components/vtm/rich-text-editor.tsx` usa `contentEditable` e `document.execCommand` (`bold`, `italic`, `underline`, `insertUnorderedList`, `insertOrderedList`), com `aria-pressed` pelo `queryCommandState`. `lib/rich-text.ts` exporta `sanitizeRichText(html)`:
- faz o parse num `<template>`;
- percorre os nós e mantém só `p, br, strong, b, em, i, u, ul, ol, li`, sem atributos;
- troca qualquer outro elemento pelos filhos e descarta `script`/`style` com o conteúdo.

É aplicada no `input` e no `paste` do editor, ao gravar, e de novo em `RichText` (`dangerouslySetInnerHTML` só com HTML limpo), que é o único caminho de exibição. A API só limita o tamanho. Isso protege o jogador mesmo se o banco receber HTML por outro caminho.

*Alternativas*:
- TipTap ou Lexical: mais de 100 KB e dependência nova para cinco botões.
- Markdown: o Mestre teria de digitar a sintaxe, e a referência mostra formatação visual.

`execCommand` é obsoleto, mas funciona em todos os navegadores atuais. O risco fica isolado num componente.

### Componentes compartilhados
- `DamageTrack` ganha `onCycle` opcional. Sem ele, as caixas são `span` com `role="img"` e `aria-label` ("Vitalidade: 3 de 5, 1 superficial, 1 agravado").
- `features/dm/status-card.tsx` (`CharacterStatusCard`) mostra nome, clã, Fome e as duas trilhas, com `footer` opcional. É usado na Coterie do Mestre (com "Ver ficha"/"Retirar"), na Coterie do jogador e nos cartões de jogador da Rodada.
- `features/round/round-view.tsx` mostra o título e a grade de cartões a partir da visão de `GET /round`, com `mode: "mestre" | "jogador"` e um `onCycleEnemy` opcional. É usado nas duas abas Rodada. Fica fora de `features/dm/` porque o jogador também usa.
- `ConfirmDialog` sobre o `Dialog` existente, usado para excluir coterie, excluir inimigo e esvaziar a rodada.

### Gerador de NPC: script de conversão + regras puras
- **`web/scripts/npc-lists-from-xlsx.py <caminho.xlsx>`**: usa só a biblioteca padrão (`zipfile` + `xml.etree`). Lê `sharedStrings` e a aba `Listas`, usa a linha 1 como nome da coluna e grava `web/src/data/npc-lists.ts`, com o cabeçalho "gerado por scripts/npc-lists-from-xlsx.py — não editar". O arquivo tem `export const NPC_LISTS = { Nomes_H: [...], … } as const` com as colunas usadas, e também lê os pesos da aba `Referência`. Fica no repositório como fonte versionada; a planilha não entra no repositório.
- **`rules/npc.ts`**:
  - `generateNpc(filtros, d: Die): Npc`, que segue a ordem da aba `NPC`. A segunda virtude e a segunda falha usam o deslocamento da planilha: `((i1 − 1 + d(n − 1)) mod n) + 1`.
  - `npcSummary(npc)`, com o texto do resumo copiado da fórmula `A35`.
  - `moodOf("fleumática") → "Fleumática"`.
  - `Die` e `rollDie` são reaproveitados de `rules/resonance.ts`.
- **`features/dm/npc-generator.tsx`**: filtros com `Chip`, NPC em `useState`, "Copiar" com `navigator.clipboard.writeText` e `notify`. "Rolar intensidade" chama `rollResonance({ tipo: moodOf(npc.ressonancia), intensidade: RANDOM, sangueFraco: false }, d)` e mostra `ResonanceResult`, que passa a ser exportado de `resonance-roll.tsx`. Entra em `ResonanceRollTab` abaixo da grade atual.

*Alternativa*: ler o `.xlsx` no navegador (SheetJS). Seria dependência pesada, e o Mestre teria de subir a planilha a cada sessão.

### Painel do Mestre
`DmShell` ganha as abas Coteries, Rodada e Bestiário (rotas `personagens._painel.coteries.tsx`, `personagens._painel.rodada.tsx` e `personagens._painel.bestiario.tsx`). A `nav` passa a `overflow-x-auto` com os links `whitespace-nowrap`, para caber no celular.

### Testes
- **Web**: o `test/fake-api.ts` ganha coteries, inimigos e rodada em memória, com as mesmas validações e mensagens, e a filtragem por papel. Há testes de regras (`round.test.ts`, `npc.test.ts`), de `sanitizeRichText` e das páginas com Testing Library.
- **API**: testes de schema e de serviço (projeção, filtragem por papel, `409` de coterie, `DELETE` de inimigo limpando a rodada, validação de `vez`) e rotas novas no e2e.

## Risks / Trade-offs

- [Dois navegadores do Mestre gravando a rodada ao mesmo tempo: a última gravação vence] → aceitável para um Mestre só. `updatedAt` volta na resposta para um controle otimista futuro.
- [O polling de 5 s atrasa a vez para o jogador] → atraso de até 5 s é aceitável à mesa, e o intervalo fica numa constante.
- [`execCommand` pode sumir de algum navegador] → isolado em `rich-text-editor.tsx`, trocável sem mudar o formato gravado (HTML restrito).
- [HTML malicioso nos especiais chegando ao jogador] → sanitização por lista de permissões em toda exibição, não só na entrada, e a API limita o tamanho.
- [O nome do inimigo oculto ainda aparece para o jogador] → decisão consciente: o jogador vê *quem* está na luta, não *o quê*. O Mestre pode dar um nome genérico ("Vulto").
- [A planilha muda e o módulo gerado fica velho] → basta rodar o script de novo. Um teste confere que as colunas exigidas por `rules/npc.ts` existem e não estão vazias.
- [Os textos da planilha trazem descrições sensíveis (cor e traços)] → a própria `Referência` pede uso cuidadoso. O gerador reproduz as listas sem alteração, e a curadoria continua do Mestre, na planilha.
- [`GET /round` com muitos jogadores e inimigos] → no máximo 50 participantes, com duas consultas `IN` (fichas e inimigos) por leitura.

## Migration Plan

1. API: `db:generate` → completar `0002_chronicle.sql` (`CHECK` e linha inicial da rodada) → `db:migrate`. As tabelas são novas, sem mudança nas existentes.
2. Publicar a API antes do web: as rotas novas não afetam o web atual.
3. Web: rodar `python3 web/scripts/npc-lists-from-xlsx.py "/mnt/c/Users/arthu/OneDrive/Documentos/RPG/Vampiro/Gerador_NPC_Sertao_Alagoano_1936_V10.xlsx"` e versionar o `npc-lists.ts` gerado. `routeTree.gen.ts` é regenerado no dev/build.
4. Reversão: publicar o web anterior. Na API, uma migração de reversão com `DROP TABLE rounds, enemies, coterie_members, coteries`. Nada nas fichas depende das tabelas novas.

## Open Questions

- Nenhuma que bloqueie. A exibição do nome de inimigo oculto (acima) pode ser revista depois; se for, basta omitir `nome` na filtragem do servidor.
