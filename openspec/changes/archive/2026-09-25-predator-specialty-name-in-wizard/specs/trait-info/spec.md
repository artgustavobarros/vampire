## MODIFIED Requirements

### Requirement: Painel de especialidade
O painel de descrição SHALL ter o tipo **Especialidade**, montado pela função pura a partir do nome da especialidade, da habilidade e do nível atual da habilidade:
- kicker "Especialidade · <Habilidade>";
- título com o nome da especialidade;
- selo "<Habilidade> N" com o nível atual da habilidade;
- descrição "Um foco dentro de <Habilidade>. Quando a rolagem de <Habilidade> se encaixa nesta especialidade, some 1 dado à parada.";
- sem lista de níveis e sem tabelas.

O painel MUST NOT ter nota nem formulário, inclusive para a especialidade do Predador.

#### Scenario: Especialidade comum
- **WHEN** o painel abre para "Direito" de Erudição com Erudição 1
- **THEN** o kicker é "Especialidade · Erudição", o título é "Direito", o selo é "Erudição 1", a descrição é a de foco em Erudição e não há formulário

#### Scenario: Especialidade do Predador
- **WHEN** o Predador é "Extorsionário", a ficha tem Intimidação 3 e o painel abre para a especialidade "Chantagem" do Predador
- **THEN** o selo é "Intimidação 3", a descrição é a de foco em Intimidação, e não há nota do Predador nem campo "Nome da especialidade"
