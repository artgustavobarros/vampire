## MODIFIED Requirements

### Requirement: Aba Disciplinas
A aba SHALL listar as disciplinas com nome editável, nível por `DotRating`, botão **?** que abre o painel de descrição (ver `trait-info`) e remoção, e seus poderes como linhas (nível, nome, resumo da descrição). Tocar na linha de um poder MUST abrir o painel lateral direito do poder (ver `trait-info`), com a descrição gravada do poder quando ele não está no catálogo; a linha MUST NOT expandir nem mostrar editor em linha. Cada linha MUST ter, à direita, um botão "×" com rótulo acessível "Remover <nome do poder>" que remove o poder sem abrir o painel. Um diálogo "Adicionar disciplina ou poder" MUST oferecer disciplinas sugeridas (existentes e do clã) ou nome livre, e opcionalmente um poder com nível, custo e descrição.

#### Scenario: Estado vazio
- **WHEN** não há disciplinas
- **THEN** aparece "Nenhuma disciplina registrada" com a orientação e o botão "+ Adicionar disciplina ou poder"

#### Scenario: Adicionar poder a disciplina existente
- **WHEN** o usuário escolhe "Presença" (já na ficha) e informa o poder "Temor" nível 1
- **THEN** o poder é acrescentado à disciplina Presença existente, sem duplicar a disciplina

#### Scenario: Adicionar sem nome
- **WHEN** o usuário confirma sem escolher nem digitar uma disciplina
- **THEN** um toast de erro "Selecione ou digite uma disciplina." aparece, o diálogo continua aberto, nenhum texto de erro é renderizado dentro do diálogo e nada é salvo

#### Scenario: Linha do poder abre o painel
- **WHEN** Domínio tem o poder "Compelir" e o usuário toca na linha dele
- **THEN** o painel lateral abre pela direita com o kicker "Domínio · nível 1", o título "Compelir", a descrição e a lista de rolagem, custo e duração, e nenhum editor aparece dentro do cartão da disciplina

#### Scenario: Poder fora do catálogo
- **WHEN** a disciplina "Necromancia" tem o poder "Sussurros" com descrição "Fala com os mortos" e o usuário toca na linha
- **THEN** o painel lateral mostra "Sussurros" com a descrição "Fala com os mortos"

#### Scenario: Remover poder pela linha
- **WHEN** o usuário toca no "×" da linha de "Compelir"
- **THEN** "Compelir" sai da lista de poderes de Domínio e o painel lateral não abre
