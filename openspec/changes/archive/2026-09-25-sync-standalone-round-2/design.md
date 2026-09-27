## Context

O standalone (`design/reference`) é implementado com estado manual em `renderVals`; o web usa um formulário único `react-hook-form` com um schema zod por passo (`features/wizard/schema.ts`), `STEP_FIELDS` derivados das shapes e `CONTEXT_FIELDS` para campos só lidos. O painel lateral monta o conteúdo em `features/info/build-info.ts` a partir de um `InfoTarget` que cada gatilho preenche com o valor atual. `MeritKind` hoje é `"vantagem" | "defeito"` (o standalone usa `'V' | 'D' | 'Q' | 'R'`).

A regra do clã ("Sangue Fraco", "Caitiff") passa a condicionar os passos 5, 6 e 7, que hoje não leem o clã.

## Goals / Non-Goals

**Goals:**
- Passo 5 com dois slots filtrados por clã, distribuição 2 + 1 e status; Sangue-ralo sem slots.
- Passo 6 desativado para Sangue-ralo, apagando o Predador gravado.
- Passo 7 com cota 7/2, regra, status e tipos SR para Sangue-ralo.
- Perdição e Compulsão clicáveis, com o catálogo `CLAN_FULL`.
- Dicas dos passos 6 e 7.

**Non-Goals:**
- Somar os defeitos do Predador automaticamente ou aplicar os ajustes do Predador na ficha.
- Mostrar méritos na ficha em jogo.
- Migrar fichas gravadas; elas só passam a falhar no schema do passo e o assistente as leva até lá.

## Decisions

### 1. Clã como contexto dos passos 5, 6 e 7
`cla` entra na shape dos schemas 5, 6 e 7 e em `CONTEXT_FIELDS` desses passos, como `skills` no passo 4. Assim o schema do passo decide sozinho (via `superRefine`) e `isStepValid`/`firstIncompleteStep` continuam iguais. Alternativa: passar o clã por fora com `z.object(...).superRefine` fechado sobre uma variável — descartada porque os schemas são módulos estáticos e `firstIncompleteStep` valida a ficha gravada sem formulário.

### 2. Regras puras em `rules/wizard.ts`
- `clanDisciplineOptions(cla)` → `{ kind: "none" | "clan" | "free" | "thin", options, aviso }` (sem clã / clã normal / Caitiff / Sangue Fraco). Usado pelo passo e pelo schema.
- `disciplineDistribution(disc, cla)` → `{ ok, message }` com o texto "Distribuição completa: 2 e 1." / "Falta: …".
- `meritTotals(meritos, cla)` passa a devolver `{ vantagens, defeitos, qualidadesSR, defeitosSR }` com os tipos SR normalizados para fora do Sangue Fraco, e `meritStatus(meritos, cla)` → `{ ok, message, pending[] }`.
O schema reusa `message` dessas funções, para que o toast e a linha de status digam a mesma coisa. Os tipos exatos das mensagens do schema do passo 5 ficam curtos ("Escolha Disciplinas do clã", "Marque 2 pontos em uma Disciplina e 1 na outra"), porque o toast agrupa várias.

### 3. Tipos SR em `MeritKind`
`MeritKind = "vantagem" | "defeito" | "qualidade-sr" | "defeito-sr"`, seguindo o padrão por extenso do web em vez de `Q`/`R`. Um helper `effectiveMeritKind(tipo, ralo)` converte `qualidade-sr → vantagem` e `defeito-sr → defeito` fora do Sangue Fraco; o passo 7, `meritTotals` e o `InfoTarget` de mérito passam por ele. `build-info` trata `qualidade-sr` como vantagem e `defeito-sr` como defeito. O ciclo do selo usa a lista de tipos do clã e o índice do tipo efetivo.

### 4. Distribuição 2 + 1 no `DotRating`
Cada slot usa `DotRating count={2}`. O `onChange` do slot `i` grava `disc.i.nivel = v >= 2 ? 2 : 1` e `disc.(1-i).nivel` com o complemento via `setValue(..., { shouldValidate: false })`. Clicar no mesmo ponto que "zera" no `DotRating` também resulta em 1, como no standalone. Poderes acima do novo nível continuam visíveis e marcados (comportamento atual) e o schema acusa.

### 5. Opções dos slots
Cada slot lista `options.filter(n => n !== outraDisciplina)`. Ao trocar a Disciplina, os poderes do slot são limpos (como hoje). Uma Disciplina gravada que não está nas opções (clã trocado) é mantida no `<select>` como opção extra marcada, para não sumir silenciosamente; o schema a rejeita com "Escolha Disciplinas do clã".

### 6. Predador de Sangue-ralo
O passo 6 renderiza só o aviso. O schema do passo 6 aceita qualquer valor quando `cla === "Sangue Fraco"`, e `wizardToPatch` grava `predador`, `predEspec` e `predDisc` como `""` quando o passo 6 é salvo com esse clã. Alternativa: manter o valor e só ignorar na leitura (como o standalone) — descartada porque a ficha em jogo mostraria um Predador que o personagem não tem.

### 7. Sangue-ralo no passo 5
O schema aceita `disc` com nomes vazios quando `cla === "Sangue Fraco"`; ao salvar, as posições vazias continuam no formulário (sempre duas) e "Concluir" já descarta disciplinas sem nome. Disciplinas gravadas antes de trocar para Sangue Fraco não são apagadas pelo passo 5: o usuário não as vê no assistente, mas elas continuam na ficha. **Decisão**: limpar os dois slots em `wizardToPatch` quando o passo 5 é salvo com Sangue Fraco, pela mesma razão do Predador.

### 8. `CLAN_FULL` e o painel
Novo `data/clan-rules.ts` com `CLAN_FULL: Record<string, { bane: ClanRule; comp: ClanRule }>` e `ClanRule = readonly [desc, readonly (readonly [rotulo, texto])[]]`, portado da referência com o aviso "paráfrases, revisar com a mesa". `InfoTarget` ganha `{ kind: "bane" | "comp"; key: string; potencia: number }`: o gatilho do passo 1 calcula a potência com `bloodPotency({ geracao, potencia: 0 })` a partir da geração do formulário, porque a ficha só recebe `potencia` ao salvar o passo 1. A Gravidade sai de `bloodPotencyRow(potencia).baneSeverity`.

### 9. Gatilhos no passo 1
O título do `ClanTrait` vira `InfoTrigger` (já com hover Blood, sem sublinhado), mantendo Cormorant 600 24px.

## Risks / Trade-offs

- [Fichas existentes com Disciplinas fora do clã, níveis ≠ 2+1 ou méritos ≠ 7/2 passam a ter passo inválido] → `firstIncompleteStep` leva o usuário ao passo certo no "Refazer"; a ficha em jogo não é bloqueada.
- [Cota 7/2 obrigatória pode incomodar mesas com regras da casa] → o bloqueio segue o padrão dos passos 2 e 3; se a mesa pedir, vira aviso só na linha de status (ver Open Questions).
- [Textos de `CLAN_FULL` são paráfrases] → aviso no arquivo, como `trait-info.ts`.
- [`example-sheet` e fixtures de teste podem violar as novas regras] → ajustar os fixtures junto com os schemas.

## Open Questions

- A cota 7/2 do passo 7 deve bloquear "Continuar" ou só aparecer no status? Esta proposta bloqueia, para ficar igual aos passos 2, 3 e 5.
