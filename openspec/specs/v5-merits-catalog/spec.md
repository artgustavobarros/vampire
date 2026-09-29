# v5-merits-catalog Specification

## Purpose
Catálogo canônico de Vantagens, Defeitos, Antecedentes e características exclusivas de Sangue-ralo (V5 PT-BR), com sugestões e autopreenchimento no assistente e suporte ao painel de informações.
## Requirements
### Requirement: Catálogo de Qualidades e Defeitos de Sangue-ralo
O catálogo em `web/src/data/merits/` SHALL fornecer as 14 Qualidades de Sangue-ralo (`THIN_BLOOD_MERITS`) e os 16 Defeitos de Sangue-ralo (`THIN_BLOOD_FLAWS`) do V5 (Corebook e Players Guide) em Português Brasileiro (PT-BR), contendo `name` (nome canônico), `aliases` (com o nome em inglês), `tipo` ("qualidade-sr" ou "defeito-sr"), `clans: ["Sangue-ralo"]` ("Sangue Fraco" é tratado como o mesmo clã), `source`, `description` (texto da regra só daquele item, sem trechos de outros itens nem cabeçalhos do livro) e `points` (1; a regra conta itens, não pontos). "Presença do Crepúsculo" (Twilight Presence) e "Fome Infinita" (Unending Hunger) MUST ser Defeitos SR. "Sinal Sobrenatural" (Supernatural Tell) MUST ter o alias "Conta Sobrenatural".

#### Scenario: Consulta a Qualidades de Sangue-ralo
- **WHEN** a aplicação consulta `THIN_BLOOD_MERITS`
- **THEN** a lista tem 14 itens, todos com tipo "qualidade-sr", entre eles "Bebedor Diurno", "Alquimista de Sangue-ralo", "Afinidade de Disciplina" e "Resiliência Vampírica"

#### Scenario: Consulta a Defeitos de Sangue-ralo
- **WHEN** a aplicação consulta `THIN_BLOOD_FLAWS`
- **THEN** a lista tem 16 itens, todos com tipo "defeito-sr", entre eles "Fragilidade Mortal", "Dentes de Leite", "Presença do Crepúsculo" e "Fome Infinita"

#### Scenario: Descrição sem texto de outro item
- **WHEN** a aplicação lê a descrição de "Fome Infinita"
- **THEN** o texto não contém "Méritos de", "Sangue Abominável" nem frases da regra de outro item

### Requirement: Catálogo de Vantagens, Defeitos e Antecedentes Gerais
O catálogo SHALL conter os itens de [Advantages and Flaws](https://vtm.paradoxwikis.com/Advantages_and_Flaws), exceto os de Children of the Blood, Cults of the Blood Gods, Forbidden Religions, Gehenna War, Blood Stained Love, Live from the Succubus Club e In Memoriam ("Segredo Obscuro" • e "Infâmia" •• são do Corebook; a Aparência mantém Semblante do Matusalém, Rosto Impassível, Virado na Noite e Da Cena, desses livros), agrupados por categoria: Linguística, Aparência, Uso de Substâncias, Arcaicos, Laço de Sangue, Alimentação, Míticos, Falhas de Disciplina Enraizada, Outros, Caitiff, Sangue-ralo e os 11 Antecedentes (`BACKGROUNDS`: Aliados, Contatos, Fama, Influência, Mawla, Rebanho, Recursos, Refúgio, Lacaios, Máscara, Status) com suas sub-vantagens e sub-defeitos. Os custos MUST seguir o V5:
- Aparência: Bonito ••, Deslumbrante ••••, Feio •, Repulsivo ••;
- Antecedentes: Aliados de 2 a 6, Contatos de 1 a 3, Refúgio de 1 a 3, Máscara de 1 a 2, Lacaios de 1 a 3, os demais de 1 a 5, cada um com um texto de nível por valor permitido;
- custo "• +" sem teto no livro vira de 1 a 5; "•• ou ••••" aceita só 2 e 4;
- Falhas de Disciplina Enraizada têm custo 0.

"Monstruoso", "Perseguido" e a Vantagem "Linguística" MUST NOT existir no catálogo; a categoria Linguística tem só o Defeito "Analfabeto" ••. "Vivendo no Passado" (Living in the Past) é do Corebook. "Segregado" (Shunned) MUST custar ••. O Defeito de alimentação Farmer MUST se chamar "Fazendeiro", com alias "Vegano".

#### Scenario: Consulta de mérito com custo fixo
- **WHEN** a aplicação busca pelo mérito "Esôfago de Ferro" em `findMerit("Esôfago de Ferro")`
- **THEN** o mérito é retornado com tipo "vantagem", custo fixo de 3 pontos e descrição das regras de alimentação

#### Scenario: Consulta de antecedente escalonado
- **WHEN** a aplicação busca por "Recursos" em `findMerit("Recursos")`
- **THEN** o antecedente é retornado com os pontos de 1 a 5 e um texto de nível para cada um

#### Scenario: Faixa de Aliados
- **WHEN** a aplicação busca por "Aliados"
- **THEN** os pontos permitidos são 2, 3, 4, 5 e 6, com cinco textos de nível

#### Scenario: Aparência do V5
- **WHEN** a aplicação busca "Feio" e "Repulsivo"
- **THEN** "Feio" custa 1 e "Repulsivo" custa 2, ambos Defeitos

#### Scenario: Itens removidos
- **WHEN** a aplicação busca "Monstruoso" ou "Perseguido"
- **THEN** `findMerit` retorna `undefined`

#### Scenario: Contagem por categoria
- **WHEN** o teste conta os itens por categoria
- **THEN** as contagens batem com o Inventário do `design.md` desta mudança (ex.: Míticos 18, Caitiff 12, Falhas de Disciplina Enraizada 11)

### Requirement: Sugestões e preenchimento de pontos no Assistente
O Passo 7 do assistente de criação (`web/src/features/wizard/step7-merits.tsx`) SHALL oferecer as opções do catálogo num combobox de busca (ver `character-wizard`, "Passo 7 — Vantagens e defeitos"). O catálogo MUST expor, para cada item, os valores de pontos permitidos (`[points]` para custo fixo, a lista de `points` para faixa) e o rótulo do grupo da categoria ("Antecedente" → "Antecedentes"; sub-itens de Antecedente como "Antecedente · <Antecedente>"; demais categorias como estão). `meritOptions({ cla, disciplinas })` MUST devolver os itens cujo `clans` (quando existe) inclui o clã, cujo `excludeClans` não inclui o clã e cujo `requires.discipline` (quando existe) está entre as Disciplinas informadas. Itens com `requires.merit` MUST aparecer mesmo sem o Antecedente. Ao escolher um item, os pontos MUST ser preenchidos com o menor valor permitido, e o `DotRating` da linha MUST aceitar só os valores permitidos.

#### Scenario: Qualidades SR para Sangue Fraco
- **WHEN** o clã é "Sangue Fraco" e o usuário ativa a aba "Vantagens" do combobox
- **THEN** as opções do grupo "Sangue-ralo" correspondem às 14 Qualidades de Sangue-ralo do catálogo

#### Scenario: Caitiff só para Caitiff
- **WHEN** `meritOptions` é chamado com o clã "Brujah" e depois com "Caitiff"
- **THEN** "Sangue Favorecido" só aparece na chamada com "Caitiff"

#### Scenario: Exclusão por clã
- **WHEN** `meritOptions` é chamado com o clã "Ventrue"
- **THEN** "Fazendeiro" não aparece

#### Scenario: Falha Enraizada exige a Disciplina
- **WHEN** `meritOptions` é chamado com as Disciplinas "Potência" e "Presença"
- **THEN** "Instinto Assassino" e "Egomaníaco" aparecem e "Indomado" (Animalismo) não aparece

#### Scenario: Autopreenchimento de pontuação de mérito fixo
- **WHEN** o usuário escolhe "Bonito" no combobox
- **THEN** a linha é criada com 2 pontos

#### Scenario: Faixa de pontos de antecedente
- **WHEN** o usuário escolhe "Recursos" no combobox
- **THEN** a linha é criada com 1 ponto e aceita de 1 a 5

### Requirement: Modelo do item do catálogo
Cada item SHALL ter `name`, `tipo`, `points`, `category`, `source` (livro de origem) e `description`, e MAY ter `aliases`, `parent` (Antecedente dono), `requires` (`{ merit, min }` ou `{ discipline }`), `clans`, `excludeClans`, `hidden` e `levels`. Quando `levels` existe, MUST ter um texto por valor permitido de `points`. Nomes e aliases MUST ser únicos no catálogo, sem diferença de maiúsculas e acentos. Todo item vindo do wiki MUST ter o nome em inglês entre os `aliases`.

#### Scenario: Unicidade
- **WHEN** o teste junta nomes e aliases de `ALL_MERIT_TEMPLATES` normalizados
- **THEN** não há repetição

#### Scenario: Sub-vantagem com pré-requisito
- **WHEN** a aplicação busca "Zerado"
- **THEN** o item tem `parent: "Máscara"` e `requires: { merit: "Máscara", min: 2 }`

#### Scenario: Níveis por valor permitido
- **WHEN** o teste percorre os itens com `levels`
- **THEN** cada um tem `levels.length` igual ao número de valores permitidos

### Requirement: Busca por nome, alias e detalhe
`findMerit(nome)` SHALL procurar, sem diferença de maiúsculas e acentos, nesta ordem: nome exato; alias exato; e, para "Nome (detalhe)", o nome-base exato ou alias exato. `findMerit` MUST NOT casar um nome com o início de um nome maior do catálogo. A busca do combobox (`filterMeritOptions`) MUST considerar também os aliases, com a mesma prioridade do nome.

#### Scenario: Nome antigo
- **WHEN** a ficha tem "Vegano" e a aplicação chama `findMerit("Vegano")`
- **THEN** o item retornado é "Fazendeiro"

#### Scenario: Nome em inglês
- **WHEN** o usuário digita "iron gullet" no combobox
- **THEN** "Esôfago de Ferro" aparece entre as primeiras opções

#### Scenario: Detalhe entre parênteses
- **WHEN** a aplicação chama `findMerit("Recursos (herança)")`
- **THEN** o item retornado é "Recursos"

#### Scenario: Sem prefixo reverso
- **WHEN** a aplicação chama `findMerit("Arsenal")`
- **THEN** o retorno é `undefined`, embora exista "Arsenal Escondido"

### Requirement: Predadores citam o catálogo
Todo nome de mérito em `web/src/data/predators.ts` SHALL existir no catálogo (nome ou alias), exceto o rótulo de escolha "Defeito Mítico". O Predador Fazendeiro MUST dar o Defeito "Fazendeiro" ••.

#### Scenario: Nomes do Predador
- **WHEN** o teste percorre os méritos de `PREDATORS`
- **THEN** `findMerit` encontra todos, exceto "Defeito Mítico"

