## 1. Referência

- [x] 1.1 Copiar `Ficha de Vampiro V5 (offline).html` para `design/reference/ficha-v5-standalone.html` e extrair dele (script no scratchpad: manifest base64+gzip e template JSON) `template.html` e `logic.js` (trecho `class Component … </script>`)

## 2. Dados e regras

- [x] 2.1 `data/generations.ts`: Potências do livro (16ª–14ª 0, 13ª–10ª 1, 9ª–8ª 2, 7ª–6ª 3, 5ª 4, 4ª 5)
- [x] 2.2 `rules/generation.ts`: `potencyFromGeneration` devolve 5 abaixo da 4ª; nova `sireNote(geracao)`; remover `generationCategory` e o parâmetro `inWizard` de `potencyNote`
- [x] 2.3 `data/blood-potency.ts`: portar valores e textos do `static BP` da referência e adicionar `feedingList`
- [x] 2.4 `rules/actions.ts`: `bloodSurgeNote` no formato "Surto de Sangue: adicione N dados ao teste."
- [x] 2.5 `rules.test.ts`: Potência por Geração (4ª, 9ª, 14ª, 3ª), `sireNote` com e sem Geração, nota do Surto; remover testes de `generationCategory` e da nota curta do assistente

## 3. Painel de Geração e Potência

- [x] 3.1 `build-info.ts`: `InfoTable` e `tabelas?` em `InfoContent`; alvo `{ kind: "geracao" | "potencia"; geracao; potencia }`; `bloodInfo` com título, descrição, selo, nota e a tabela de 11 linhas × 7 colunas (dano sem " por Checagem de Sangue", penalidade com `feedingList` em linhas)
- [x] 3.2 `data/trait-info.ts`: remover `potencia` de `StateKind` e de `TRAIT_INFO`
- [x] 3.3 `info-sheet.tsx`: renderizar tabelas (título, `overflow-x-auto`, grid e `min-width` da tabela, cabeçalho, linha destacada branca com filete tinta, primeira coluna em 700, `whitespace-pre-line`); largura 760px com tabelas; omitir título e lista de níveis vazios — só classes Tailwind no JSX
- [x] 3.4 `registros-tab.tsx`: gatilho da Potência com `{ kind: "potencia", geracao: sheet.geracao, potencia }`
- [x] 3.5 `build-info.test.ts` e `info-sheet.test.tsx`: Geração 12ª, sem Geração, tabela da 9ª (linha 2), penalidade em linhas, largura com e sem tabela

## 4. Passo 1

- [x] 4.1 `step1-clan.tsx`: gatilho da Geração com o alvo novo e segunda linha de `sireNote` abaixo da nota de Potência
- [x] 4.2 `wizard.test.tsx`: nota "Geração 9ª — Potência de Sangue 2." e linha "Seu senhor é da 8ª Geração…"; rótulo Geração abre o painel com a tabela

## 5. Passo 5

- [x] 5.1 Recriar `Step5Disciplines` (aviso, dois `DisciplineRow`, linha de status em Moss) sem o bloco de Potência; `DisciplineRow` volta a ser interno; limpar imports órfãos
- [x] 5.2 Dica do passo 5 em `wizard-shell.tsx`: "Duas Disciplinas do clã: dois pontos em uma, um na outra."
- [x] 5.3 `wizard.test.tsx`: trocar o teste "Geração abre o painel nos passos 5 e 1" por um que confirma que o passo 5 não tem Potência nem "Geração 12ª"; teste da dica

## 6. Verificação

- [x] 6.1 Ajustar fixtures/testes que dependiam dos números antigos (`schema.test.ts`, `stores.test.ts`, `components.test.tsx`, cenário "Tabela de Potência")
- [x] 6.2 Rodar `pnpm test`, `pnpm exec tsc --noEmit` e `pnpm dlx ultracite check` em `web/` e corrigir o que falhar
