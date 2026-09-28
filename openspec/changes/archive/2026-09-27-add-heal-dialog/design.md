## Context

O fluxo "Sofrer dano" já estabeleceu o modelo: `flowView` devolve para o estágio `ask` uma view sem botões, o `RuleDialogProvider` desenha o `DamageForm` no lugar deles, e ao confirmar aplica `patchSheet(result.patch)` e muda para `done` com a nota. O `DamageForm` usa `SegmentedControl` para a trilha, o `Stepper` compartilhado, dois cartões de tipo com `DamageIcon`, a `DamagePreview` clicável (`onCycle`) e o `CYCLE_HINT`. A regra pura é `takeDamage(sheet, track, level, amount, base?)` em `rules/tracks.ts`, que devolve `{ changed, marks, note, patch }`.

Para curar, só existem hoje `healSuperficial` (usada por `sleep`, apaga superficiais da última caixa para a primeira) e `healAggravated` (fluxo "Curar dano agravado", troca 1 agravado por superficial e cobra Fome pelas checagens que falharam).

## Goals / Non-Goals

**Goals:**
- Fluxo "heal" no diálogo de regras com o mesmo formato, estados e comportamento de cliques do "Sofrer dano".
- Regra pura de cura por tipo, testada, usada tanto na pré-visualização quanto na gravação.
- Reaproveitar as peças do `DamageForm` em vez de duplicá-las.

**Non-Goals:**
- Cobrar o custo da cura (checagens de sangue, Fome, noites). O custo aparece só como dica, como a divisão do Superficial no dano.
- Mudar os fluxos "Dormir" e "Curar dano agravado (3 checagens de sangue)".
- Reordenar as caixas da trilha depois da cura (a trilha pode ficar com buracos, como já acontece ao dormir).

## Decisions

### `healMarks` substitui `healSuperficial`
`healMarks(marks, level: 1 | 2, amount)` → `{ marks, healed }`: percorre da última caixa para a primeira e zera até `amount` caixas iguais a `level`. `sleep` passa a chamar `healMarks(..., 1, mend)` e `healSuperficial` sai do código e dos testes (vira caso de `healMarks`).
- Alternativa: manter `healSuperficial` e criar `healAggravatedMarks`. Rejeitada: duas funções iguais exceto pelo valor comparado.
- Agravado curado vira vazio, não superficial. O fluxo antigo "Curar dano agravado" continua convertendo para superficial; o formulário é a ferramenta direta ("tirar a marca que está ali"), e quem quiser o passo intermediário clica na caixa.

### `healDamage` em `rules/tracks.ts`, irmã de `takeDamage`
Assinatura igual: `healDamage(sheet, track, level, amount, base?)` → `TakeDamageResult` (renomeado para `TrackChangeResult`, já que serve às duas). A parte comum — `before`, `changed`, contagem, nota "<Trilha> atualizada: …" e os sufixos Debilitado/torpor — vai para um helper interno `trackChange(sheet, track, marks, base, freshNote)` usado pelas duas. Nota sem cliques: "R de dano <superficial|agravado> curado na <Trilha>.".
- `healable(marks, level)` (contagem de marcas do tipo) exportada para o formulário calcular o limite do stepper a partir do ponto de partida.

### Dicas de custo em função pura
`healHint(sheet, track, level)` em `rules/tracks.ts` (ou `actions.ts`, perto de `sleep`) monta os quatro textos da spec, usando `bloodPotencyRow(bloodPotency(sheet)).mend` e `max(Autocontrole, Determinação)` — os mesmos números de `sleep`, para a dica não divergir do que "Dormir" faz. O cálculo de `W` sai de `sleep` para um helper compartilhado (`willpowerRecovery(sheet)`).

### Partes comuns do formulário
Extrair de `damage-form.tsx` para `features/actions/track-form.tsx`:
- `TRACKS`/`TrackTabs` (o `SegmentedControl` Vitalidade | Força de Vontade);
- `LevelCards` (os dois cartões Superficial/Agravado com `aria-pressed` e `DamageIcon`);
- `trackLabel(track)`.
`DamageForm` passa a usar essas peças sem mudar comportamento; `HealForm` (novo `heal-form.tsx`) monta o mesmo layout com `Stepper` "Dano curado" (`min 0`, `max = healable(base ?? ficha, level)`), `DamagePreview` com `onCycle`, `CYCLE_HINT`, a dica de custo e os botões "Curar R de dano"/"Curar dano" e "Cancelar".
- Alternativa: um único `TrackForm` com `mode: "damage" | "heal"`. Rejeitada: os textos, limites e dicas divergem o suficiente para o componente virar uma sequência de ternários; peças pequenas compostas mantêm cada formulário legível.
- Limite do stepper: calculado no render; ao trocar tipo ou trilha, e ao clicar numa caixa, o valor é ajustado com `Math.min(received, max)` no handler (clique já zera). Botão principal desativado quando `!result.changed.some(Boolean)`.

### Fluxo e diálogo
`FlowKind` ganha `"heal"` e `healView` em `flows.ts` (ask: kicker "Cura", título "Curar-se", corpo "Escolha a trilha, a cura e o tipo.", sem botões; done: "Dano curado", "Anotado na ficha.", "Fechar"). Com o terceiro formulário, `rule-dialog.tsx` troca os condicionais por um mapa `FORMS: Partial<Record<FlowKind, FormComponent>>` (`feed`, `damage`, `heal`), como o design do dano previa; a descrição fica `sr-only` para `damage` e `heal`.

### Cartão na aba Ações
Segundo cartão em `acoes-tab.tsx`: título "Curar-se", descrição "Remove dano de Vitalidade ou Força de Vontade, com a dica do custo da cura.", CTA "Curar dano", `run: () => dialog.open("heal")`, `red: false`.

## Risks / Trade-offs

- [O jogador pode curar sem pagar as checagens de sangue] → é o mesmo contrato do "Sofrer dano": o app anota, o jogador aplica a regra; a dica mostra o custo e a checagem de sangue continua disponível no diálogo próprio.
- [Agravado vira vazio aqui e superficial em "Curar dano agravado"] → comportamentos diferentes para fluxos diferentes; documentado na spec. Se incomodar, o fluxo antigo pode ser revisto numa mudança à parte.
- [Renomear `TakeDamageResult` e remover `healSuperficial` mexe em código já testado] → os testes de `sleep` e `takeDamage` continuam e cobrem a refatoração.
