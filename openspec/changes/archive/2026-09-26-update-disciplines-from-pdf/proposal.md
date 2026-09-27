## Why

O catálogo atual de disciplinas e poderes em `web/src/data/disciplines.ts` possui nomes e descrições provisórios e resumidos, sem o detalhamento de regras, testes de sistema, custos e durações canônicos da 5ª Edição de Vampiro: A Máscara (V5). O usuário forneceu o livro de regras oficial em PDF (`disciplines and powers.pdf`) para atualizar e enriquecer todas as disciplinas e poderes com suas descrições completas, regras de rolagem, custos de Rouse Check e durações traduzidas fielmente para o português brasileiro (PT-BR).

Essa atualização é necessária para garantir fidelidade às regras do V5, permitir que os painéis informativos (`trait-info`) e assistentes de criação exibam instruções mecânicas e narrativas claras aos jogadores, e alinhar a nomenclatura entre clãs, predadores e poderes.

## What Changes

- **Tradução e Enriquecimento Canônico (PT-BR)**: Ler todas as disciplinas, poderes e rituais do livro oficial V5 (`disciplines and powers.pdf`) e estruturar o catálogo em português brasileiro.
- **Atualização de `web/src/data/disciplines.ts`**:
  - Atualizar os poderes das 10 disciplinas básicas do livro base (Animalismo, Auspícios, Celeridade, Dominação/Domínio, Feitiçaria de Sangue, Fortitude, Ofuscação, Potência, Presença, Protean).
  - Incluir rituais de Feitiçaria de Sangue (níveis 1 a 5) descritos no livro oficial.
  - Atualizar as fórmulas e regras de Alquimia de Sangue-fraco (níveis 1 a 5).
  - Preservar e padronizar os poderes de Oblívio (introduzidos em suplementos V5 para Lasombra/Hecata).
- **Mecânicas Detalhadas em Cada Poder**:
  - Incorporar nos campos `description` a síntese narrativa e as paradas de dados/regras de sistema no formato canônico reconhecido por `splitRoll` (ex.: `Manipulação + Animalismo vs. Autocontrole + Dissimulação`).
  - Preencher `cost` ("Sem custo", "Um Rouse Check", "Dois Rouse Checks"), `duration` ("Passiva", "Uma cena", "Um turno", "Instantânea", etc.) e `rouse` booleano com precisão.
  - Documentar amálgamas e pré-requisitos quando aplicável.
- **Harmonização de Nomenclatura**:
  - Garantir compatibilidade entre as referências de disciplinas nos clãs (`Dominação`/`Domínio`, `Protean`/`Proteanismo`, `Alquimia de Sangue-fraco`/`Alquimia de Sangue-ralo`) e nos predadores, evitando quebras na seleção do assistente e ficha.

## Capabilities

### New Capabilities
- `v5-disciplines-catalog`: Catálogo completo e canônico de disciplinas, poderes, rituais e fórmulas de Vampiro: A Máscara 5ª Edição traduzidos para PT-BR, com dados mecânicos (paradas de dados, dificuldades, custos de Rouse Check, durações e descrições aprofundadas).

### Modified Capabilities
<!-- Nenhuma especificação existente teve seus requisitos de sistema alterados; o consumo por trait-info e character-wizard segue as interfaces existentes -->

## Impact

- `web/src/data/disciplines.ts`: Atualização profunda de tipos, lista `DISCIPLINES` e dicionário `POWERS`.
- `web/src/data/clans.ts` e `web/src/data/predators.ts`: Garantia de paridade nos nomes de disciplinas referenciados pelos clãs e tipos de predadores.
- `web/src/features/info/build-info.ts`: Benefício imediato da extração de rolagens via `splitRoll` para exibir no painel lateral de informações (`trait-info`).
- `web/src/features/wizard/step5-disciplines.tsx` e `web/src/components/vtm/power-card.tsx`: Apresentação dos poderes atualizados no assistente de criação e na ficha.
