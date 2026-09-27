## ADDED Requirements

### Requirement: Painel de especialidade
O painel de descrição SHALL ter o tipo **Especialidade**, montado pela função pura a partir do nome da especialidade, da habilidade, do nível atual da habilidade e de se ela é a especialidade pendente do Predador:
- kicker "Especialidade · <Habilidade>";
- título com o nome da especialidade;
- selo "<Habilidade> N" com o nível atual da habilidade;
- descrição "Um foco dentro de <Habilidade>. Quando a rolagem de <Habilidade> se encaixa nesta especialidade, some 1 dado à parada.";
- sem lista de níveis e sem tabelas.

Quando a especialidade é a pendente do Predador, a nota MUST ser "Veio do seu Tipo de Predador (<Predador>). Você pode renomear ou manter o nome atual uma única vez. Depois de confirmar, ela vira uma especialidade comum." e, abaixo da nota, separado por um filete, o painel MUST mostrar o campo "Nome da especialidade" (rótulo Karla maiúsculo, campo pré-preenchido com o nome atual) e dois botões lado a lado: **Confirmar nome** (fundo tinta, texto branco) e **Manter atual** (borda, fundo transparente). "Confirmar nome" MUST ficar desabilitado com o campo vazio ou só com espaços. Sem cantos arredondados. Especialidade não pendente MUST NOT ter nota nem formulário.

#### Scenario: Especialidade comum
- **WHEN** o painel abre para "Direito" de Erudição com Erudição 1
- **THEN** o kicker é "Especialidade · Erudição", o título é "Direito", o selo é "Erudição 1", a descrição é a de foco em Erudição e não há formulário

#### Scenario: Especialidade pendente do Predador
- **WHEN** o Predador é "Extorsionário", a ficha tem Intimidação 3 e o painel abre para a especialidade pendente "Chantagem"
- **THEN** o selo é "Intimidação 3", a nota cita "(Extorsionário)" e o campo "Nome da especialidade" mostra "Chantagem" com os botões "Confirmar nome" e "Manter atual"

#### Scenario: Nome vazio
- **WHEN** o usuário apaga todo o texto do campo "Nome da especialidade"
- **THEN** "Confirmar nome" fica desabilitado e "Manter atual" continua disponível

## MODIFIED Requirements

### Requirement: Gatilhos do painel
O painel SHALL abrir a partir de: o nome de cada atributo e habilidade (ficha e assistente); cada selo de especialidade na seção Habilidades da aba Ficha; um botão **?** de 40×40px ao lado do nome de cada disciplina; o link "Sobre este poder" dentro de um poder expandido; o nome de cada poder nos cartões do passo 5 do assistente; um botão **?** em cada linha de vantagem/defeito do passo 7; o nome de cada vantagem e defeito no painel "Vantagens & Defeitos" da aba Registros (passando tipo e pontos atuais); os rótulos dos blocos Fome, Humanidade, Vitalidade, Força de Vontade, Ressonância e Potência de Sangue (este último no rodapé preto da aba Registros); os títulos da Perdição e da Compulsão do clã no passo 1 do assistente; e o rótulo da Geração no passo 1. O passo 5 MUST NOT ter gatilhos de Geração nem de Potência de Sangue. Todo gatilho MUST ser um `<button>` acessível por teclado, e um gatilho dentro de um cartão selecionável MUST NOT alternar a seleção do cartão.

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
