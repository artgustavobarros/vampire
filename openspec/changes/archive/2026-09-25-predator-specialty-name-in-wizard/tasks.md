## 1. Regras

- [x] 1.1 Em `rules/specialties.ts`, criar `splitPredatorSpecialty(predEspec)` → `{ skill, nome } | null` com a regex atual
- [x] 1.2 Reescrever `predatorSpecialty` para devolver `{ skill, nome }` com `nome = predEspecNome?.trim() || sugestão`, sem `pendente`
- [x] 1.3 Tirar `pendente` de `SpecialtyEntry`/`specialtiesBySkill` e remover `confirmPredatorSpecialty`
- [x] 1.4 Atualizar o comentário de `predEspecNome` em `lib/types.ts` (nome definido no passo 6)

## 2. Assistente — dados e validação

- [x] 2.1 Em `features/wizard/schema.ts`, adicionar `predEspecNome` a `WizardValues` e ao schema do passo 6
- [x] 2.2 Em `sheetToWizard`, iniciar `predEspecNome` com `sheet.predEspecNome` ou, sem ele, a sugestão de `predEspec`
- [x] 2.3 No `superRefine` do passo 6, exigir `predEspecNome.trim()` com a mensagem "Informe o nome da especialidade do Predador" no caminho `predEspecNome`
- [x] 2.4 Em `wizardToPatch`, gravar `predEspecNome` aparado, gravá-lo vazio para Sangue Fraco e remover a limpeza antiga ao trocar `predEspec`

## 3. Assistente — passo 6

- [x] 3.1 Trocar de Predador limpa `predEspecNome`; escolher outra especialidade grava a sugestão em `predEspecNome` (sem mexer quando a opção não muda)
- [x] 3.2 Criar `SpecialtyNamePanel` abaixo dos botões: borda tinta, fundo branco, marca 40×40 (tinta com ✓ / tracejado Blood vazio), rótulo "Especialidade em <Habilidade>", `Input` ligado por `useId` e a dica "Sugestão do Predador: <Nome>. Renomeie se quiser; na ficha ela fica fixa."
- [x] 3.3 Linha de resumo do passo usa o nome digitado

## 4. Ficha e painel — remover o fluxo pendente

- [x] 4.1 Em `components/vtm/trait-grid.tsx`, remover o estilo Blood do selo e a prop `predador` (e quem a passa)
- [x] 4.2 Em `features/info/build-info.ts`, remover `predador` do alvo `espec`, `renomear` de `InfoContent` e a nota do Predador em `specialtyInfo`
- [x] 4.3 Remover `features/info/specialty-rename.tsx` e o seu uso em `features/info/info-sheet.tsx` (imports e estado órfãos incluídos)

## 5. Testes

- [x] 5.1 `rules.test.ts`: `splitPredatorSpecialty`, `predatorSpecialty` com e sem `predEspecNome`, sem `pendente`; remover testes de `confirmPredatorSpecialty`
- [x] 5.2 `schema.test.ts`: validação do nome vazio, sugestão em `sheetToWizard`, Sangue Fraco grava vazio, sem limpeza por troca de `predEspec`
- [x] 5.3 `wizard.test.tsx`: escolher "Ofícios (Armadilhas)" mostra o painel com "Armadilhas"; renomear e concluir grava `predEspecNome`; trocar de especialidade repõe a sugestão
- [x] 5.4 `build-info.test.ts`, `info-sheet.test.tsx`, `components.test.tsx`: remover os casos pendente/renomear e cobrir o selo do Predador comum
- [x] 5.5 Rodar testes, typecheck e lint (Ultracite) no `web`
