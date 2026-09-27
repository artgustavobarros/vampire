## MODIFIED Requirements

### Requirement: Gatilhos do painel
O painel SHALL abrir a partir de: o nome de cada atributo e habilidade (ficha e assistente); cada selo de especialidade na seção Habilidades da aba Ficha; um botão **?** de 40×40px ao lado do nome de cada disciplina; a linha de cada poder na aba Disciplinas; o nome de cada poder nos cartões dos passos 5 e 6 do assistente; um botão **?** em cada linha de vantagem/defeito do passo 7; o nome de cada vantagem e defeito no painel "Vantagens & Defeitos" da aba Registros (passando tipo e pontos atuais); os rótulos dos blocos Fome, Humanidade, Vitalidade, Força de Vontade, Ressonância e Potência de Sangue (este último no rodapé preto da aba Registros); os títulos da Perdição e da Compulsão do clã no passo 1 do assistente; e o rótulo da Geração no passo 1. O passo 5 MUST NOT ter gatilhos de Geração nem de Potência de Sangue. Todo gatilho MUST ser um `<button>` acessível por teclado, e um gatilho dentro de um cartão selecionável MUST NOT alternar a seleção do cartão.

#### Scenario: Abrir pelo nome
- **WHEN** o usuário clica em "Manipulação" na aba Ficha
- **THEN** o painel de Manipulação abre sem alterar os pontos

#### Scenario: Selo de especialidade
- **WHEN** o usuário clica no selo "Direito" abaixo de Erudição na aba Ficha
- **THEN** o painel da especialidade "Direito" abre sem alterar os pontos de Erudição

#### Scenario: Nome do mérito na aba Registros
- **WHEN** o usuário clica em "Recursos" (3 pontos) no painel Vantagens & Defeitos
- **THEN** o painel lateral abre pela direita com o kicker "Vantagem", o selo "3 pontos", os textos de Recursos para cada ponto e a linha "•••" destacada, sem alterar os pontos

#### Scenario: Botão de disciplina
- **WHEN** o usuário toca no **?** ao lado de "Presença"
- **THEN** o painel mostra os poderes de Presença por nível com o nível atual destacado

#### Scenario: Linha de poder na aba Disciplinas
- **WHEN** o usuário toca na linha do poder "Compelir" na aba Disciplinas
- **THEN** o painel do poder "Compelir" abre pela direita

#### Scenario: Título da Compulsão
- **WHEN** o clã "Toreador" está escolhido no passo 1 e o usuário clica em "Obsessão"
- **THEN** o painel abre com o kicker "Compulsão · Toreador"

#### Scenario: Rótulo da Geração no passo 1
- **WHEN** o usuário clica no rótulo "Geração" no passo 1
- **THEN** o painel da Geração abre e o seletor de Geração não muda

#### Scenario: Potência de Sangue na aba Registros
- **WHEN** o usuário clica em "Potência de Sangue" no rodapé preto da aba Registros
- **THEN** o painel da Potência de Sangue abre com a tabela do livro e a linha do personagem destacada

#### Scenario: Nome do poder em cartão selecionado
- **WHEN** o poder "Compelir" está selecionado no passo 5 e o usuário clica no nome dele
- **THEN** o painel do poder abre e "Compelir" continua selecionado

#### Scenario: Nome do poder do Predador
- **WHEN** o usuário clica no nome "Toque Letal" num cartão do painel "Poder do Predador" no passo 6
- **THEN** o painel do poder abre e o poder do Predador escolhido não muda
