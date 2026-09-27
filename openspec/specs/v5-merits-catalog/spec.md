# v5-merits-catalog Specification

## Purpose
Catálogo canônico de Vantagens, Defeitos, Antecedentes e características exclusivas de Sangue-ralo (V5 PT-BR), com sugestões e autopreenchimento no assistente e suporte ao painel de informações.

## Requirements
### Requirement: Catálogo de Qualidades e Defeitos de Sangue-ralo
O catálogo em `web/src/data/merits.ts` SHALL fornecer as 16 Qualidades de Sangue-ralo (`THIN_BLOOD_MERITS`) e os 14 Defeitos de Sangue-ralo (`THIN_BLOOD_FLAWS`) oficiais do livro básico V5 em Português Brasileiro (PT-BR), contendo `name` (nome canônico), `tipo` ("qualidade-sr" ou "defeito-sr"), `description` (texto explicativo da regra) e `points` (1 ponto/custo binário).

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
O Passo 7 do assistente de criação (`web/src/features/wizard/step7-merits.tsx`) SHALL oferecer as opções do catálogo num combobox de busca (ver `character-wizard`, "Passo 7 — Vantagens e defeitos") no lugar do `<datalist>` por tipo. O catálogo MUST expor, para cada item, os valores de pontos permitidos (`[points]` para custo fixo, a lista de `points` para faixa) e o rótulo do grupo da categoria ("Antecedente" → "Antecedentes"; demais categorias como estão). As opções MUST incluir `BACKGROUNDS`, `COMMON_MERITS` e `COMMON_FLAWS` para todos os clãs, e `THIN_BLOOD_MERITS` e `THIN_BLOOD_FLAWS` só para Sangue Fraco. Ao escolher um item, os pontos MUST ser preenchidos com o menor valor permitido, e o `DotRating` da linha MUST aceitar só os valores permitidos.

#### Scenario: Qualidades SR para Sangue Fraco
- **WHEN** o clã é "Sangue Fraco" e o usuário ativa a aba "Vantagens" do combobox
- **THEN** as opções do grupo "Sangue-ralo" correspondem às 16 Qualidades de Sangue-ralo do catálogo

#### Scenario: Autopreenchimento de pontuação de mérito fixo
- **WHEN** o usuário escolhe "Bonito" no combobox
- **THEN** a linha é criada com 2 pontos

#### Scenario: Faixa de pontos de antecedente
- **WHEN** o usuário escolhe "Recursos" no combobox
- **THEN** a linha é criada com 1 ponto e aceita de 1 a 5

