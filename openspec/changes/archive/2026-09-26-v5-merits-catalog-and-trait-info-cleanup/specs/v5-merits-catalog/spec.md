## ADDED Requirements

### Requirement: Catálogo de Qualidades e Defeitos de Sangue-ralo
O catálogo em `web/src/data/merits.ts` SHALL fornecer as 16 Qualidades de Sangue-ralo (`THIN_BLOOD_MERITS`) e os 14 Defeitos de Sangue-ralo (`THIN_BLOOD_FLAWS`) oficiais do livro básico V5 em Português Brasileiro (PT-BR), contendo `name` (nome canônico), `type` ("qualidade-sr" ou "defeito-sr"), `description` (texto explicativo da regra) e `points` (1 ponto/custo binário).

#### Scenario: Consulta a Qualidades de Sangue-ralo
- **WHEN** a aplicação consulta `THIN_BLOOD_MERITS`
- **THEN** a lista contém opções como "Bebedor Diurno", "Alquimista de Sangue-ralo", "Afinidade com Disciplina" e "Resiliência Vampírica", cada uma com sua descrição oficial

#### Scenario: Consulta a Defeitos de Sangue-ralo
- **WHEN** a aplicação consulta `THIN_BLOOD_FLAWS`
- **THEN** a lista contém opções como "Fragilidade Mortal", "Dentes de Leite", "Desbotado pelo Sol" e "Temperamento Bestial", cada uma com sua descrição oficial

### Requirement: Catálogo de Vantagens, Defeitos e Antecedentes Gerais
O catálogo em `web/src/data/merits.ts` SHALL listar as Vantagens comuns com opções de pontos (`COMMON_MERITS`), os Defeitos com custos fixos (`COMMON_FLAWS`) e os Antecedentes canônicos (`BACKGROUNDS`: Aliados, Contatos, Fama, Influência, Mentor/Mawla, Rebanho, Recursos, Refúgio, Lacaios, Máscara, Status) com suas descrições de níveis 1 a 5.

#### Scenario: Consulta de mérito com custo fixo
- **WHEN** a aplicação busca pelo mérito "Estômago de Ferro" em `findMerit("Estômago de Ferro")`
- **THEN** o mérito é retornado com tipo "vantagem", custo fixo de 3 pontos e descrição das regras de alimentação

#### Scenario: Consulta de antecedente escalonado
- **WHEN** a aplicação busca por "Recursos" em `findMerit("Recursos")`
- **THEN** o antecedente é retornado contendo os textos descritivos dos níveis 1 a 5

### Requirement: Sugestões e preenchimento de pontos no Assistente
O Passo 7 do assistente de criação (`web/src/features/wizard/step7-merits.tsx`) SHALL oferecer sugestões (`<datalist>`) baseadas no tipo selecionado pelo usuário (`vantagem`, `defeito`, `qualidade-sr`, `defeito-sr`). Ao selecionar um mérito com custo definido no catálogo, os pontos MUST ser pré-preenchidos automaticamente com o valor canônico.

#### Scenario: Sugestão para Qualidade de Sangue-ralo
- **WHEN** o usuário seleciona o tipo "Qualidade SR" no Passo 7
- **THEN** as opções sugeridas no campo de nome correspondem às 16 Qualidades de Sangue-ralo do catálogo

#### Scenario: Autopreenchimento de pontuação de mérito fixo
- **WHEN** o usuário seleciona "Bonito" no campo de nome de uma vantagem
- **THEN** a pontuação é preenchida automaticamente com 2 pontos
