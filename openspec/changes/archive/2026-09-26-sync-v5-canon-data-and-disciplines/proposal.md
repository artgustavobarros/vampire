## Why

O catálogo de disciplinas e poderes em `web/src/data/disciplines.ts` contém duplicações de termos antigos, inconsistências de nomenclatura e poderes incompletos herdados de migrações parciais. Além disso, os dados de clãs (`web/src/data/clans.ts`), predadores (`web/src/data/predators.ts`) e méritos/defeitos precisam ser confirmados em relação ao cânone oficial de Vampiro: A Máscara 5ª Edição (V5) em Português Brasileiro (PT-BR).

A identificação do compêndio oficial comunitário de V5 para Foundry VTT (`pixshadoow-beep/vtm5e-compendio-ptbr`), do sistema de regras (`WoD5E-Developers/wod5e`) e da base de termos da Galápagos Jogos (`albacrux/vtm5_regras_e_matrizes`) fornece uma fonte de verdade consolidada para auditar, padronizar e completar todos os dados do projeto, além de documentar essas referências canônicas no `README.md`.

## What Changes

- **Saneamento e Padronização de `web/src/data/disciplines.ts`**:
  - Eliminar duplicações de poderes (ex.: unificar *Corpo Letal*/*Toque Letal*, *Salto Elevado*/*Força Prodigiosa*, *Expulsar a Fera*/*Expelir a Fera*/*Desfazer a Fera*).
  - Alinhar todos os poderes, rituais de Feitiçaria de Sangue, fórmulas de Alquimia de Sangue-ralo e poderes de Oblívio com as traduções e regras oficiais do V5 extraídas do compêndio PT-BR (`vtm5e-compendio-ptbr`).
  - Preencher e padronizar campos `cost`, `description`, `system`, `dicePool`, `duration`, `rouse`, `amalgam` e `prerequisite`.
  - Manter compatibilidade com testes existentes em `build-info.test.ts` por meio de suporte a aliases transparentes.
- **Auditoria de Dados de Clãs, Predadores e Méritos**:
  - Validar e alinhar `web/src/data/clans.ts` com `clas.json` (perdições, compulsões e disciplinas de clã).
  - Validar e alinhar `web/src/data/predators.ts` com `tipos-de-predador.json` (disciplinas oferecidas e ajustes).
  - Validar referências de vantagens/defeitos e ressonâncias em `trait-info.ts` com `vantagens-e-defeitos.json` e `ressonancias.json`.
- **Documentação de Fontes Canônicas no `web/README.md`**:
  - Adicionar seção dedicada de referências canônicas no `web/README.md`, citando o `WoD5E-Developers/wod5e`, o compêndio `vtm5e-compendio-ptbr` e o repositório `albacrux/vtm5_regras_e_matrizes`.

## Capabilities

### New Capabilities
<!-- Nenhuma nova capacidade fora do escopo de dados e regras V5 -->

### Modified Capabilities
- `v5-disciplines-catalog`: Ampliar os requisitos do catálogo para incluir auditoria de integridade com o compêndio oficial V5 PT-BR (`vtm5e-compendio-ptbr`), eliminação de duplicatas e alinhamento cruzado com clãs, predadores e documentação de fontes no README.

## Impact

- `web/src/data/disciplines.ts`: Atualização profunda de listas e mapeamentos de poderes, eliminando entradas redundantes e enriquecendo descrições e testes de sistema.
- `web/src/data/clans.ts`, `web/src/data/predators.ts` e `web/src/data/trait-info.ts`: Conferência e ajuste de termos para paridade 100% canônica.
- `web/README.md`: Inclusão das fontes de dados canônicos e documentação de referência.
- `web/src/features/info/build-info.ts` e suíte de testes Vitest: Garantia de aprovação contínua em todos os testes unitários e de integração.
