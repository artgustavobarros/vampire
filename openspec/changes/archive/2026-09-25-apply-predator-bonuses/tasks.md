## 1. Dados e tipos

- [x] 1.1 Em `data/predators.ts`, criar `PredatorAdjustment` (`humanidade`, `potencia`, `merito`, `escolha`, `nota`) e trocar `adjustments: string[]` por `adjustments: PredatorAdjustment[]`
- [x] 1.2 Reescrever os 12 Predadores com ajustes estruturados, mantendo os rótulos atuais e seguindo o mapeamento do design (Extorsionário, Sanguessuga com Presa Excluída ••, Osíris, Fazendeiro com `nota`)
- [x] 1.3 Em `lib/types.ts`, acrescentar `origem?: "predador"` ao `Merit`, e `predEscolhas?: Record<string, Record<string, number>>` e `predBonus?: { disciplina; novaDisciplina; humanidade; potencia }` à `Sheet`

## 2. Regras puras

- [x] 2.1 Criar `rules/predator.ts` com `predatorChoiceStatus(predator, predEscolhas)` (ids incompletos e mensagens "Escolha uma opção: …" / "Distribua N pontos entre A e B")
- [x] 2.2 Criar `predatorMerits(predator, predEscolhas)` com as linhas de `merito` e das opções escolhidas (`origem: "predador"`, nome com detalhe entre parênteses)
- [x] 2.3 Criar `applyPredator(sheet)` (Disciplina +1 ou nova, Humanidade 0–10, `predBonus`, méritos; sem efeito se já aplicado, sem Predador ou Sangue Fraco) e `removePredator(sheet)` (inverso)
- [x] 2.4 Em `rules/generation.ts`, fazer `bloodPotency` somar `predBonus.potencia` (limite 10) e `potencyNote` terminar com " (+N do Predador)"; incluir `predBonus` em `PotencySource`
- [x] 2.5 Em `rules/wizard.ts`, fazer `meritTotals` ignorar linhas com `origem: "predador"`
- [x] 2.6 Testes em `rules/rules.test.ts`: status das escolhas (`uma`, `dividir` incompleto e completo), méritos de Sereia e Osíris, Gato de Rua em Disciplina do clã, Sereia com Disciplina nova, Humanidade nos limites, Sanguessuga +1 Potência e nota, aplicação dupla sem efeito, Sangue Fraco sem efeito, `removePredator(applyPredator(s))` igual a `s`, `meritTotals` sem linhas do Predador

## 3. Passo 6

- [x] 3.1 Em `step6-predator.tsx`, exibir `label` de cada ajuste e colorir o filete pelo tipo; remover `COST`, `GAIN` e `adjustmentTone` por regex
- [x] 3.2 Seletor de `escolha`: botões para `uma`; `DotRating` por opção para `dividir`, limitado ao que sobra do total; ligado a `predEscolhas` e marcado inválido pelo erro do id
- [x] 3.3 Ao trocar de Predador, limpar também `predEscolhas`

## 4. Schema e assistente

- [x] 4.1 Em `schema.ts`, acrescentar `predEscolhas` a `WizardValues`, `sheetToWizard` e ao schema do passo 6, validando com `predatorChoiceStatus`; em `wizardToPatch`, esvaziar `predEscolhas` para Sangue Fraco
- [x] 4.2 Fazer `sheetToWizard` ler `removePredator(sheet)`
- [x] 4.3 Em `wizard-shell.tsx`, fazer `commit` partir de `removePredator` da ficha atual e gravar `disc`, `humanidade`, `meritos` e `predBonus: undefined` junto com o patch
- [x] 4.4 No "Concluir", gravar `applyPredator` da ficha final; no "Voltar" do passo 1 em modo refazer, gravar `applyPredator` depois do `commit`
- [x] 4.5 Atualizar `test-fixtures.ts` com `predEscolhas` e ampliar `schema.test.ts`: escolha incompleta bloqueia o passo 6; `sheetToWizard` de ficha com o Predador aplicado devolve 2 + 1 e só as linhas do passo 7; `firstIncompleteStep` dessa ficha é 8
- [x] 4.6 Testes em `wizard.test.tsx`: seletores de Sanguessuga e Osíris; concluir aplica Disciplina, Humanidade e méritos; refazer sem trocar Predador não duplica; refazer trocando "Sereia" por "Consensualista"; sair do refazer pelo passo 1 mantém o Predador aplicado

## 5. Verificação

- [x] 5.1 Rodar `pnpm test` e `pnpm check` em `web/` e corrigir o que aparecer
- [ ] 5.2 Conferir no app: criar com "Osíris" dividindo pontos e concluir; ver Humanidade, Disciplina e `meritos` gravados; refazer e ver os passos 5 e 7 sem o Predador aplicado
