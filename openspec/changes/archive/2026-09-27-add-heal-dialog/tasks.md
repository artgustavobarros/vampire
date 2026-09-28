## 1. Regras puras

- [x] 1.1 Trocar `healSuperficial` por `healMarks(marks, level, amount)` em `web/src/rules/tracks.ts` (última caixa para a primeira, caixa curada vira vazia); atualizar `sleep` em `web/src/rules/actions.ts` e remover `healSuperficial`
- [x] 1.2 Extrair de `takeDamage` o helper interno de resultado (`before`, `changed`, nota "<Trilha> atualizada: …", sufixos Debilitado/torpor, `patch`) e renomear `TakeDamageResult` para `TrackChangeResult`
- [x] 1.3 Adicionar `healDamage(sheet, track, level, amount, base?)` e `healable(marks, level)` em `web/src/rules/tracks.ts`, com a nota "R de dano <superficial|agravado> curado na <Trilha>."
- [x] 1.4 Extrair `willpowerRecovery(sheet)` (maior entre Autocontrole e Determinação) usado por `sleep`, e criar `healHint(sheet, track, level)` com os quatro textos da spec (Potência de Sangue e cura da tabela, três checagens para Agravado, W ao dormir, Narrador)
- [x] 1.5 Testes em `web/src/rules/rules.test.ts`: `healMarks` (última para a primeira, agravado esvazia, sem marcas do tipo), `healDamage` (nota sem cliques, nota com `base`, `changed`), `healable`, `healHint` para as quatro combinações; `sleep` continua passando

## 2. Partes comuns do formulário

- [x] 2.1 Criar `web/src/features/actions/track-form.tsx` com `TrackTabs`, `LevelCards` e `trackLabel`, extraídos de `damage-form.tsx`
- [x] 2.2 Fazer `DamageForm` usar essas peças sem mudar comportamento; `damage-form.test.tsx` continua passando

## 3. Formulário e fluxo de cura

- [x] 3.1 Criar `web/src/features/actions/heal-form.tsx`: `TrackTabs`, `Stepper` "Dano curado" (0 até `healable` do ponto de partida, reduzindo o valor ao trocar tipo/trilha), `LevelCards`, "<Trilha> depois" com `DamagePreview` clicável, `CYCLE_HINT`, dica de `healHint`, botões "Curar R de dano"/"Curar dano" (desativado sem diferença da ficha) e "Cancelar"
- [x] 3.2 Adicionar `"heal"` a `FlowKind` e `healView` em `web/src/features/actions/flows.ts` (ask: kicker "Cura", título "Curar-se", sem botões; done: "Dano curado", "Anotado na ficha.", "Fechar")
- [x] 3.3 Em `rule-dialog.tsx`, trocar os condicionais de formulário por um mapa `kind → formulário` (`feed`, `damage`, `heal`) e deixar a descrição `sr-only` para `damage` e `heal`
- [x] 3.4 Adicionar o cartão "Curar-se" (CTA "Curar dano") como segundo cartão em `web/src/features/sheet/tabs/acoes-tab.tsx`

## 4. Testes de integração e verificação

- [x] 4.1 Criar `web/src/features/actions/heal-form.test.tsx` cobrindo os cenários da spec: abrir pela aba, curar superficial, agravado esvazia, limites e redução ao trocar o tipo, nada do tipo, dicas de Potência e de Força de Vontade, confirmar grava (Fome inalterada) com a nota, cliques nas caixas e limite a partir delas, confirmar depois de clicar, trocar a trilha, cancelar e reabrir
- [x] 4.2 Rodar testes, typecheck e lint (Ultracite) do `web` e corrigir o que aparecer
- [x] 4.3 Conferir visualmente o diálogo "Curar-se" ao lado do "Sofrer dano" em largura de celular
