## MODIFIED Requirements

### Requirement: Surto de Sangue
A ação Surto de Sangue SHALL abrir o Rouse Check com a nota do bônus de surto da Potência atual, no formato "Surto de Sangue: <bônus em minúscula> ao teste.", usando o texto da tabela de Potência de Sangue do livro.

#### Scenario: Surto na Potência 1
- **WHEN** o usuário aciona "Rouse + surto" com Potência 1
- **THEN** o Rouse Check abre com a nota "Surto de Sangue: adicione 2 dados ao teste."

#### Scenario: Surto na Potência 0
- **WHEN** o usuário aciona "Rouse + surto" com uma ficha de 15ª Geração
- **THEN** o Rouse Check abre com a nota "Surto de Sangue: adicione 1 dado ao teste."
