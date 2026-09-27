## Why

Atualmente, o assistente de criação de personagens (Passo 7 - Méritos) exige que os jogadores digitem manualmente os nomes e pontuações de vantagens, defeitos e características de Sangue-ralo em campos de texto vazios, sem sugestões ou preenchimento de pontos canônicos. Além disso, as 30 Qualidades e Defeitos oficiais de Sangue-ralo não possuem catálogo estruturado, fazendo com que o painel lateral de informações (`build-info.ts`) acuse constantemente *"fora do catálogo"*.

Paralelamente, o arquivo `web/src/data/trait-info.ts` contém um erro crítico no mapeamento de disciplinas (`DISC_INFO` usa termos antigos como "Domínio" e "Protean", fazendo com que "Dominação" e "Proteanismo" sejam consideradas fora do catálogo no painel lateral) e diversos erros ortográficos em atributos/estados. Por fim, o componente customizado de formatação Markdown `rich-text.tsx` tornou-se desnecessário, já que o catálogo utiliza dados limpos e o único uso de itálico no projeto inteiro era a palavra isolada "*sex appeal*", podendo ser substituído por renderização nativa direta com `whitespace-pre-line` ou parágrafos padrão.

## What Changes

- **Catálogo Canônico de Vantagens e Defeitos (`web/src/data/merits.ts`)**:
  - Compilar as 16 Qualidades de Sangue-ralo (`THIN_BLOOD_MERITS`) e 14 Defeitos de Sangue-ralo (`THIN_BLOOD_FLAWS`) a partir do compêndio oficial PT-BR da Galápagos Jogos.
  - Compilar as Vantagens e Defeitos comuns com pontuações fixas (`COMMON_MERITS`, `COMMON_FLAWS`) e os Antecedentes com progressão de 1 a 5 pontos (`BACKGROUNDS`).
  - Exportar função de busca `findMerit(name)` para resolução ágil no painel e na ficha.
- **Saneamento de `trait-info.ts`**:
  - Atualizar `DISC_INFO` com os nomes canônicos oficiais (`Dominação`, `Proteanismo`, `Alquimia de Sangue-ralo`) mantendo compatibilidade com variantes.
  - Corrigir erros ortográficos em `ATTR_INFO` e `TRAIT_INFO` (`qeu`, `pocucas`, `lavinha`, `Voc~e`, `mortor`, `Mediciona`, etc.).
- **Remoção de `rich-text.tsx`**:
  - Eliminar o componente regex de markdown `rich-text.tsx` e seus testes `rich-text.test.tsx`.
  - Simplificar `info-sheet.tsx` para renderizar `info.desc` e `info.nota` com elementos `<p>` nativos e classe `whitespace-pre-line`, e células/linhas com texto direto.
  - Remover marcadores `*` de `trait-info.ts`.
- **Melhoria de UX no Assistente (Passo 7)**:
  - Adicionar `<datalist>` / sugestões automáticas baseadas no tipo selecionado (`vantagem`, `defeito`, `qualidade-sr`, `defeito-sr`).
  - Preenchimento automático ou sugestão da pontuação ao selecionar méritos com custo fixo ou binário (como Sangue-ralo).
  - Integrar o painel de informações com o novo catálogo para exibir as regras completas oficiais.

## Capabilities

### New Capabilities
- `v5-merits-catalog`: Catálogo estruturado de vantagens, defeitos e características de sangue-ralo canônicas em PT-BR para uso no assistente, ficha e painel lateral.

### Modified Capabilities
- `trait-info`: Elimina a dependência de `rich-text.tsx`, sanea termos de disciplinas em `DISC_INFO` e integra a resolução de méritos ao novo catálogo.

## Impact

- `web/src/data/merits.ts`: Novo arquivo com catálogo tipado de méritos, defeitos e sangue-ralo.
- `web/src/data/trait-info.ts`: Correções ortográficas, normalização de chaves de disciplinas e remoção de sintaxe markdown.
- `web/src/features/info/rich-text.tsx` e `rich-text.test.tsx`: Removidos.
- `web/src/features/info/info-sheet.tsx`: Substituição de `RichParagraphs` e `RichText` por renderização nativa limpa.
- `web/src/features/info/build-info.ts`: Atualizado `meritInfo` para consultar `findMerit`.
- `web/src/features/wizard/step7-merits.tsx`: Sugestões de catálogo e autopreenchimento de pontos.
