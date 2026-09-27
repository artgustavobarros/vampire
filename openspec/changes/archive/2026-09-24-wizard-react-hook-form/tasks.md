## 1. Dependências e componentes base

- [x] 1.1 Instalar `react-hook-form`, `zod` e `@hookform/resolvers` em `web/` (pnpm)
- [x] 1.2 Adicionar o componente shadcn `field` (`pnpm dlx shadcn@latest add field`) em `web/src/components/ui/field.tsx` e ajustar as classes aos tokens do design system (`text-ink-soft`, `text-blood`, `font-label`)
- [x] 1.3 Conferir se `label.tsx`/`separator.tsx` continuam compatíveis depois do add (sem sobrescrever customizações)

## 2. Schemas e mapeamento ficha ↔ formulário

- [x] 2.1 Criar `web/src/features/wizard/schema.ts` com o tipo `WizardValues`, `sheetToWizard(sheet)` e `wizardToPatch(values, fields)` (recalculando `potencia` pela geração)
- [x] 2.2 Escrever os schemas zod dos passos 1 (clã, geração) e 2 (cota de atributos via `attributeQuotas`, erro em `attrs`)
- [x] 2.3 Escrever os schemas dos passos 3 (distribuição escolhida e completa via `skillDistributionProgress`) e 4 (especialidades obrigatórias / livre, com `skills` como contexto)
- [x] 2.4 Escrever os schemas dos passos 5 (duas disciplinas diferentes, nível ≥ 1, poderes ≤ nível) e 6 (predador, `predEspec`, `predDisc`)
- [x] 2.5 Escrever os schemas dos passos 7 (méritos com nome e pontos 1–5) e 8 (nome obrigatório), com as mensagens em português do spec
- [x] 2.6 Exportar `STEP_SCHEMAS`, `STEP_FIELDS` (derivado dos shapes, sem campos de contexto) e `firstIncompleteStep(sheet)`
- [x] 2.7 Testes unitários em `schema.test.ts`: um caso válido e um inválido por passo, `firstIncompleteStep` e a ida e volta `sheetToWizard`/`wizardToPatch`

## 3. Shell do formulário

- [x] 3.1 Em `wizard-shell.tsx`, criar o `useForm<WizardValues>` com `defaultValues` da ficha, o resolver por passo via ref e o `FormProvider` em volta do corpo
- [x] 3.2 Implementar "Continuar" com `handleSubmit`: gravar `STEP_FIELDS[step]`, aplicar `initialAttributes` + `setValue` no passo 1 e navegar
- [x] 3.3 Implementar "Voltar" gravando o passo sem validar. No passo 1: ficha se `refazer`, senão `logout` + `/entrar`
- [x] 3.4 Implementar "Concluir": validar, gravar todos os campos com `criada: true` e `disc` filtrado, e navegar para `/ficha/ficha`
- [x] 3.5 Garantir o foco no primeiro campo com erro (`shouldFocusError`, com `ref` repassado pelos `Controller` dos controles próprios quando der)

## 4. Passos com `Controller` + `Field`

- [x] 4.1 Passo 1: cartões de clã, senhor e geração (com nota de potência derivada de `watch("geracao")`) com erros
- [x] 4.2 Passo 2: `TraitGrid`/`DotRating` de atributos por `Controller` em `attrs`, cartões de cota e derivados a partir de `watch`, e erro do grupo
- [x] 4.3 Passo 3: cartões de distribuição, progresso por `watch` e `TraitGrid` de habilidades, com erros de `dist`/`skills`
- [x] 4.4 Passo 4: campos de especialidade obrigatória (`espec.<habilidade>.0`) e modo livre (`especLivre` + especialidade), com erros
- [x] 4.5 Passo 5: duas linhas fixas de disciplina (`disc.0`, `disc.1`) com seletor, nível e poderes, mais a potência somente leitura por `watch`
- [x] 4.6 Passo 6: cartões de predador (zerando `predEspec`/`predDisc` ao trocar), grupos de opção com erro e ajustes obrigatórios
- [x] 4.7 Passo 7: `useFieldArray` em `meritos` (adicionar, remover, alternar tipo, nome, pontos), totais por `watch` e estado vazio
- [x] 4.8 Passo 8: campos de identidade por `Controller` + `Field`, com nome obrigatório

## 5. Rota e um personagem por jogador

- [x] 5.1 `routes/criar.tsx`: `validateSearch` com `refazer?: boolean`, redirecionar para `/ficha/ficha` quando `criada && !refazer` e para `firstIncompleteStep` quando `passo` passar dele
- [x] 5.2 Repassar `refazer` em toda navegação entre passos no shell
- [x] 5.3 `sheet-layout.tsx`: "Refazer personagem" navega com `search: { passo: 1, refazer: true }`
- [x] 5.4 Revisar outros pontos que navegam para `/criar` (`index.tsx`, `ficha.tsx`, `auth-card.tsx`) e ajustar o tipo do search

## 6. Testes de componente e verificação

- [x] 6.1 Testes do assistente (Testing Library): Continuar bloqueado mostra erro e mantém o passo; passo válido grava na ficha e avança; erro some ao corrigir
- [x] 6.2 Testes: Voltar grava sem validar; Concluir sem nome não marca `criada`; Concluir válido marca `criada` e descarta disciplinas vazias
- [x] 6.3 Testes da rota: `criada` sem `refazer` redireciona; `?passo=6` com passos incompletos cai no primeiro incompleto; refazer sobrescreve a mesma ficha
- [x] 6.4 Rodar `pnpm typecheck`, `pnpm check` e `pnpm test` em `web/` e corrigir o que falhar
- [ ] 6.5 Testar à mão no navegador: criar do zero até concluir, recarregar no meio, refazer e tentar `/criar` com ficha criada
