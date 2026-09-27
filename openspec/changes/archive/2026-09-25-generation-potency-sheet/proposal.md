## Why

O standalone de referência foi atualizado ("Mudanças na criação de personagem", `Ficha de Vampiro V5 (offline).html`). A Geração passou a ser a única fonte da Potência de Sangue, com a tabela inicial do livro (4ª 5 · 5ª 4 · 6ª–7ª 3 · 8ª–9ª 2 · 10ª–13ª 1 · 14ª–16ª 0), e ganhou um painel novo com a tabela de Potência de Sangue 0–10 do livro. O web ainda usa a tabela antiga (4ª = 6, 14ª = 1…), textos antigos da Potência e o painel de Geração em lista. Além disso, o commit "minor fixes" retirou o bloco de Potência do passo 5 apagando o componente `Step5Disciplines` inteiro, e o `wizard-shell` ainda o importa: o assistente não compila.

## What Changes

- **Tabela Geração → Potência inicial** trocada pela do livro: 16ª–14ª 0, 13ª–10ª 1, 9ª–8ª 2, 7ª–6ª 3, 5ª 4, 4ª 5; Geração abaixo da 4ª resulta em 5. **BREAKING**: fichas de 14ª, 10ª, 8ª, 6ª, 5ª e 4ª Geração passam a ter Potência menor (a Potência é sempre derivada da Geração).
- **Tabela de Potência de Sangue 0–10** trocada pelos valores e textos do livro (ex.: Potência 1 = Surto "Adicione 2 dados", Bônus de poder "Nenhum", Rerrolagem "Nível 1", Gravidade 2; cura "N pontos de dano Superficial por Checagem de Sangue"; penalidade de alimentação em lista). Muda o que a aba Registros, a nota do Surto de Sangue e a Gravidade da Perdição mostram. **BREAKING** nos números de Gravidade, Surto e Bônus por nível.
- **Painel novo de Geração e de Potência de Sangue**: os dois mostram a tabela de Potência de Sangue do livro (7 colunas: Potência, Surto de Sangue, Dano recuperado, Bônus de poder de Disciplina, Rerrolagem de Checagem para Disciplinas, Gravidade da Perdição, Penalidade de alimentação), com a linha do personagem destacada, rolagem horizontal e painel mais largo (760px). Mudam descrição, selo e nota. Sai a lista "Geração e Potência de Sangue" com categorias (Neófito, Ancilla…).
- **Passo 1**: abaixo do seletor de Geração, além da nota "Geração 9ª — Potência de Sangue 2.", aparece a linha do senhor: "Seu senhor é da 8ª Geração (você é sempre uma Geração acima do senhor)." ou, sem Geração, "Você é sempre uma Geração acima do seu senhor.".
- **Passo 5 sem Potência de Sangue**: o bloco de Potência (10 pontos, rótulo "Geração Nª" e nota) sai; o passo termina na linha de status da distribuição. O componente `Step5Disciplines` (aviso, dois slots, status) volta a existir sem o bloco. A dica do passo passa a ser "Duas Disciplinas do clã: dois pontos em uma, um na outra.".
- **Gatilhos**: a Potência de Sangue e a Geração deixam de ter gatilho no passo 5. A Potência continua clicável no rodapé preto da aba Registros e a Geração no rótulo do passo 1.
- **Referência**: `design/reference` passa a conter o novo standalone e a lógica/template extraídos dele.
- Fora do escopo: outras diferenças de layout do standalone que não tratam de Geração/Potência; o campo "Geração" dos Detalhes finais já não existe no web.

## Capabilities

### New Capabilities
<!-- nenhuma -->

### Modified Capabilities
- `character-wizard`: passo 1 ganha a linha do senhor e a tabela nova de Potência inicial; passo 5 perde o bloco de Potência de Sangue e muda a dica.
- `trait-info`: conteúdo de Geração e Potência de Sangue vira painel com a tabela do livro; lista de gatilhos perde os do passo 5; o painel ganha largura para tabelas.
- `character-sheet`: a tabela de Potência da aba Registros passa a usar os valores do livro.
- `vampire-actions`: a nota do Surto de Sangue passa a usar o texto do livro ("Surto de Sangue: adicione 2 dados ao teste.").

## Impact

- Dados: `data/generations.ts` (Potência inicial), `data/blood-potency.ts` (valores e textos do livro, `feedingList`), `data/trait-info.ts` (sai o estado `potencia`).
- Regras: `rules/generation.ts` (limite abaixo da 4ª, nota do senhor; saem `generationCategory` e o modo `inWizard` de `potencyNote`), `rules/actions.ts` (nota do Surto).
- Painel: `features/info/build-info.ts` (tabelas, alvo `geracao`/`potencia`), `features/info/info-sheet.tsx` (renderização da tabela e largura).
- UI: `features/wizard/step1-clan.tsx`, `features/wizard/step5-disciplines.tsx`, `features/wizard/wizard-shell.tsx`, `features/sheet/tabs/registros-tab.tsx`.
- Referência: `design/reference/{ficha-v5-standalone.html,logic.js,template.html}`.
- Testes: `rules.test.ts`, `build-info.test.ts`, `info-sheet.test.tsx`, `wizard.test.tsx`, `schema.test.ts`/fixtures que dependem da Potência.
