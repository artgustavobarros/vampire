## MODIFIED Requirements

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
