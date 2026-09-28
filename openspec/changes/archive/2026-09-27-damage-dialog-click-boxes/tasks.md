## 1. Regra de dano

- [x] 1.1 Em `web/src/rules/tracks.ts`, `takeDamage(sheet, track, level, amount, base?)`: `addDamage` parte de `base ?? before`, `changed` e `patch` seguem comparando com a trilha da ficha; com `base`, a nota vira "<Trilha> atualizada: S superficial(is), A agravado(s)." contando as marcas finais, mantendo os acréscimos de Debilitado e torpor
- [x] 1.2 Em `web/src/rules/rules.test.ts`, testar: com `base`, o dano soma por cima dela; `changed` marca caixa desmarcada em relação à ficha; nota "Vitalidade atualizada: 1 superficial, 1 agravado."; plural com 0/2+; acréscimo de torpor com `base`

## 2. Pré-visualização clicável

- [x] 2.1 Em `web/src/components/vtm/tracks.tsx`, `DamagePreview` aceita `onCycle?`; com ele, renderiza um `fieldset` com o `aria-label` de resumo e cada caixa como `button type="button"` com `aria-label` "<label> N: <marca>", `data-changed`, tracejado vermelho quando alterada, `cursor-pointer` e foco visível (só classes Tailwind); sem `onCycle`, mantém o `role="img"` atual
- [x] 2.2 Em `components.test.tsx`, cobrir o modo interativo: botões com os rótulos por caixa e `onCycle` chamado com o índice clicado

## 3. Formulário Sofrer dano

- [x] 3.1 Em `damage-form.tsx`, estado `base: DamageMark[] | null`; `takeDamage(..., base ?? undefined)`; clique na caixa `i` faz `setBase(cycleBox(result.marks, i))` e `setReceived(0)`; trocar a trilha faz `setBase(null)`
- [x] 3.2 Botão principal: "Marcar {received} de dano" com `base === null`, "Marcar dano" depois; desativado quando `received === 0` e nenhuma caixa em `result.changed`
- [x] 3.3 Renderizar `CYCLE_HINT` (de `features/sheet/track-panels.tsx`) logo abaixo da pré-visualização, antes da dica de divisão

## 4. Testes do diálogo

- [x] 4.1 Ajustar os testes existentes de `damage-form.test.tsx` que buscam a pré-visualização por `role="img"` para o novo papel `group`
- [x] 4.2 Cenários de clique: dois cliques na 3ª caixa vazia → agravado tracejado, "Dano recebido" 0, "Marcar dano" ativo; três cliques → volta a vazio e botão desativado; clique em agravado gravado → vazio tracejado
- [x] 4.3 Cenários de convivência: stepper 2 Superficial + clique na 1ª → "Dano recebido" 0, `[2, 1, 0, 0, 0]`; clique na 1ª + stepper 1 Agravado → `[1, 2, 0, 0, 0]`
- [x] 4.4 Confirmar depois de clicar (`vit: [1]`, dois cliques na 2ª) grava `[1, 2, 0, 0, 0]` com a nota "Vitalidade atualizada: 1 superficial, 1 agravado."; trocar a trilha descarta os cliques; cancelar depois de clicar não grava nada

## 5. Verificação

- [x] 5.1 Rodar os testes e o lint do `web` e conferir o diálogo no app, clicando nas caixas com e sem o stepper
