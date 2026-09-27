## ADDED Requirements

### Requirement: Formatação do texto do painel
Os textos exibidos no painel de descrição — descrição, texto de cada nível da lista, nota e células de tabela — SHALL aceitar uma marcação mínima escrita nas strings do catálogo:
- `**texto**` MUST aparecer em negrito (`<strong>`);
- `*texto*` MUST aparecer em itálico (`<em>`);
- `**` e `*` podem ser combinados (ex.: `***texto***` em negrito e itálico), mas não se cruzam;
- uma quebra `\n` MUST virar quebra de linha;
- na descrição e na nota, uma linha em branco (`\n\n`) MUST separar parágrafos.

Um `*` ou `**` sem par MUST aparecer como texto literal. Texto sem marcação MUST ser exibido exatamente como antes. A marcação MUST ser convertida em elementos React (sem HTML cru, sem `dangerouslySetInnerHTML`) e nenhum asterisco de marcação MUST aparecer na tela. A descrição acessível do diálogo MUST conter o texto sem os marcadores. O estilo de negrito e itálico MUST vir de classes Tailwind no componente, sem CSS global.

#### Scenario: Palavra em negrito
- **WHEN** a descrição do catálogo é "Exige um **Rouse Check** ao ativar."
- **THEN** o painel mostra "Rouse Check" dentro de um `<strong>` e nenhum `*` aparece

#### Scenario: Palavra em itálico
- **WHEN** o texto de um nível é "Você sente a *Besta* acordar."
- **THEN** "Besta" aparece dentro de um `<em>`

#### Scenario: Quebra de linha e parágrafo
- **WHEN** a descrição é "Primeira linha.\nSegunda linha.\n\nOutro parágrafo."
- **THEN** "Primeira linha." e "Segunda linha." ficam em linhas separadas do mesmo parágrafo e "Outro parágrafo." fica num parágrafo próprio

#### Scenario: Asterisco sem par
- **WHEN** a descrição é "Custa 2* pontos."
- **THEN** o painel mostra "Custa 2* pontos." literalmente

#### Scenario: Texto sem marcação
- **WHEN** o painel abre para "Força"
- **THEN** a descrição aparece igual à de antes da mudança

#### Scenario: Rolagem extraída com marcação
- **WHEN** a descrição de um poder é "Comunica-se com *animais*. Manipulação + Animalismo vs. resistência do animal."
- **THEN** a linha Rolagem mostra "Manipulação + Animalismo vs. resistência do animal" e a descrição mostra "animais" em itálico
