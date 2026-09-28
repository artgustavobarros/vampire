## 1. Regra pura

- [x] 1.1 Adicionar `takeDamage(sheet, track, level, received)` em `web/src/rules/tracks.ts`: dano efetivo (Superficial em Vitalidade dividido por 2, arredondando para cima), aplicação via `addDamage` sobre `trackBoxes`, `changed[]` por caixa, `note` e `patch` compatíveis com `ActionResult`
- [x] 1.2 Montar a nota "N de dano superficial|agravado marcado na <Trilha>." com os sufixos " Trilha cheia: Debilitado." e " Vitalidade toda agravada: torpor."
- [x] 1.3 Testes em `web/src/rules/rules.test.ts`: 3→2 e 1→1 no Superficial de Vitalidade, Agravado e Força de Vontade sem divisão, `changed` no transbordo (4 superficiais + 1 agravado), notas de trilha cheia e Vitalidade toda agravada

## 2. Componentes

- [x] 2.1 Criar `DamagePreview` somente leitura em `web/src/components/vtm/tracks.tsx`: caixas com `DamageIcon`, borda tinta sólida nas não alteradas e tracejada vermelha (com a marca em vermelho) nas alteradas, `aria-label` com o estado final
- [x] 2.2 Teste do `DamagePreview` em `web/src/components/vtm/components.test.tsx` (marca `data-mark` e destaque das alteradas)
- [x] 2.3 Extrair o stepper (e a classe `FORM_LABEL`) do `FeedForm` para `web/src/features/actions/stepper.tsx` e usar nos dois formulários

## 3. Formulário e fluxo

- [x] 3.1 Criar `web/src/features/actions/damage-form.tsx`: `SegmentedControl` Vitalidade | Força de Vontade, stepper "Dano recebido" (1–20), cartões Superficial / Agravado com ícone (`aria-pressed`, borda tinta no marcado, borda clara e texto suave no outro), "<Trilha> depois" com `DamagePreview`, texto explicativo, botões "Marcar N de dano" e "Cancelar"
- [x] 3.2 Adicionar `"damage"` a `FlowKind` e `damageView` em `web/src/features/actions/flows.ts` (ask: kicker "Dano", título "Sofrer dano", sem botões; done: "Dano marcado", "Anotado na ficha.", "Fechar")
- [x] 3.3 Em `rule-dialog.tsx`, desenhar `DamageForm` no estágio `ask` do fluxo "damage" (aplicar `patchSheet` e ir a `done` com a nota) e deixar a descrição `sr-only` nesse estágio
- [x] 3.4 Adicionar o cartão "Sofrer dano" (CTA "Marcar dano") como primeiro cartão em `web/src/features/sheet/tabs/acoes-tab.tsx`

## 4. Testes de integração e verificação

- [x] 4.1 Criar `web/src/features/actions/damage-form.test.tsx` cobrindo os cenários da spec: abrir pela aba, divisão 3→2 com botão "Marcar 2 de dano", Agravado e Força de Vontade sem divisão, limites do stepper, confirmar grava igual à prévia com a nota, Vitalidade toda agravada, cancelar e reabrir volta ao estado inicial
- [x] 4.2 Rodar testes, typecheck e lint (Ultracite) do `web` e corrigir o que aparecer
- [x] 4.3 Conferir visualmente o diálogo contra a imagem de referência em largura de celular
