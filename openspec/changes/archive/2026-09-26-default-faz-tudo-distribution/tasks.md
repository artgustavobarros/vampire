## 1. Distribuição padrão

- [x] 1.1 Em `web/src/data/distributions.ts`, trocar `DEFAULT_DISTRIBUTION` para "Faz-tudo", buscado pelo nome em vez da posição, e atualizar o comentário
- [x] 1.2 Em `web/src/features/wizard/schema.ts`, fazer `sheetToWizard` usar `sheet.dist || DEFAULT_DISTRIBUTION.name`

## 2. Testes

- [x] 2.1 `web/src/rules/rules.test.ts`: cobrir o fallback de `skillDistributionProgress` sem `dist` (metas de Faz-tudo: 3→1, 2→8, 1→10)
- [x] 2.2 `web/src/features/wizard/schema.test.ts`: `sheetToWizard` de ficha sem `dist` devolve "Faz-tudo"; trocar a asserção `issues(3, values({ dist: "" }))` → `dist` por um nome inválido (ex.: `dist: "Inexistente"`)
- [x] 2.3 `schema.test.ts` (`firstIncompleteStep`) e `wizard.test.tsx:683` ("não deixa pular passos pela URL"): ajustar o fixture que força o passo 3 para não depender de `dist: ""` ser inválido
- [x] 2.4 `web/src/features/wizard/wizard.test.tsx`: cenário em que o passo 3 abre com "Faz-tudo" selecionado e o progresso "0 de 1 / 0 de 8 / 0 de 10"; cenário em que a distribuição gravada ("Especialista") é respeitada
- [x] 2.5 `wizard.test.tsx`: cenário em que, sem clicar em cartão, completar Faz-tudo e clicar "Continuar" grava `dist: "Faz-tudo"` na ficha

## 3. Verificação

- [x] 3.1 Rodar a suíte de testes do `web` e o lint (Ultracite) sem erros
- [ ] 3.2 Conferir no app que um personagem novo abre o passo 3 com "Faz-tudo" marcado
