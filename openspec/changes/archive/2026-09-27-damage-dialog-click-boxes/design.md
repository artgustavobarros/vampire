## Context

O `DamageForm` (`web/src/features/actions/damage-form.tsx`) guarda `track`, `received` e `level` e chama `takeDamage(sheet, track, level, received)` (`web/src/rules/tracks.ts`), que parte das marcas da ficha (`trackBoxes(sheet[track], trackMax(...))`), aplica `addDamage` e devolve `{ changed, marks, note, patch }`. A pré-visualização é o `DamagePreview` (`web/src/components/vtm/tracks.tsx`): `div role="img"` com caixas somente leitura e um resumo no `aria-label`.

Na ficha, o `TrackPanel` (`web/src/features/sheet/track-panels.tsx`) usa `DamageTrack` com `onCycle` e a regra pura `cycleBox` (vazio → superficial → agravado → vazio), e mostra a dica `CYCLE_HINT`.

## Goals / Non-Goals

**Goals:**
- Marcar dano no diálogo clicando nas caixas da pré-visualização, com o mesmo ciclo da ficha.
- Clique e stepper convivem sem ambiguidade: o clique sempre age na caixa que o jogador está vendo.
- Destaque, botão e nota refletem o que vai ser gravado.

**Non-Goals:**
- Guardar cliques de mais de uma trilha ao mesmo tempo: só a trilha escolhida é gravada.
- Mudar a regra de transbordo, a dica de divisão ou a trilha da ficha.
- Desfazer clique a clique (o ciclo de 3 toques já volta a caixa ao estado anterior).

## Decisions

### Estado "caixas clicadas" (`base`) no formulário
O formulário ganha `base: DamageMark[] | null`. `null` = sem cliques, o ponto de partida é a ficha. No clique na caixa `i`: `setBase(cycleBox(result.marks, i))` e `setReceived(0)`. Ou seja, a pré-visualização atual (com o stepper aplicado) é "congelada" como ponto de partida e o clique avança a caixa. Trocar a trilha faz `setBase(null)`. "Cancelar" já desmonta o formulário, então nada é gravado.
- Alternativa: camada de cliques separada, com o stepper sempre aplicado por cima e sem zerar. Rejeitada: uma caixa pintada pelo stepper, ao ser clicada, mudaria a camada de baixo e o stepper a repintaria, então o clique pareceria não fazer nada ou pularia caixas.
- Alternativa: manter o stepper no valor e só congelar. Rejeitada: o número mostrado deixaria de ser o "dano novo por cima do ponto de partida" e somaria duas vezes.

### `takeDamage` aceita ponto de partida
Assinatura: `takeDamage(sheet, track, level, amount, base?)`. `before` continua sendo a trilha da ficha (para `changed` e para a nota); `addDamage` parte de `base ?? before`. Sem `base`, a nota é a atual ("R de dano … marcado na …"). Com `base`, a nota é "<Trilha> atualizada: S superficial(is), A agravado(s)." contando as marcas finais. Os acréscimos "Trilha cheia: Debilitado." / "Vitalidade toda agravada: torpor." seguem valendo nos dois casos. Continua função pura, testada em `rules.test.ts`.
- Alternativa: montar a nota no formulário. Rejeitada: notas de resultado ficam nas regras, como nos outros fluxos.

### Botão principal
Rótulo: `base === null ? "Marcar ${received} de dano" : "Marcar dano"`. Desativado quando `received === 0 && !result.changed.some(Boolean)`. Sem cliques, isso equivale à regra atual (desativado só em 0); com cliques, desativa quando o jogador desfaz tudo.

### `DamagePreview` interativo
`DamagePreview` recebe `onCycle?: (index: number) => void`. Com `onCycle`, as caixas viram `<button type="button">` num `fieldset` com o mesmo `aria-label` de resumo (papel `group`), cada uma com `aria-label` "<label> N: <vazio|superficial|agravado>" e o mesmo visual (tracejado vermelho quando alterada, `data-changed`), mais `cursor-pointer` e foco visível igual ao `DamageTrack`. Sem `onCycle`, fica como hoje (`role="img"`). Estilo só com classes Tailwind no `className`.
- Alternativa: usar o `DamageTrack` da ficha. Rejeitada: ele não tem o destaque de alteradas nem o tamanho da pré-visualização.

### Dica de toque
Reusar `CYCLE_HINT` de `track-panels.tsx`, renderizado logo abaixo da pré-visualização e antes da dica de divisão, com o mesmo estilo de texto suave da ficha.

## Risks / Trade-offs

- [Clicar zera o "Dano recebido" e pode surpreender] → a pré-visualização não muda além da caixa clicada, e o botão passa a "Marcar dano", deixando claro que agora vale o que está nas caixas.
- [Clique pode apagar dano já gravado (agravado → vazio)] → é o mesmo comportamento da trilha da ficha; a caixa fica tracejada em vermelho e nada é gravado antes de confirmar.
- [Testes que buscam a pré-visualização por `role="img"`] → no formulário ela passa a `group`; os testes de `damage-form.test.tsx` são atualizados, e os de `components.test.tsx` cobrem os dois modos.
