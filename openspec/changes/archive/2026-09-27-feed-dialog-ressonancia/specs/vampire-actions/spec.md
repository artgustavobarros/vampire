## MODIFIED Requirements

### Requirement: Diálogo de regras
As ações de regra SHALL abrir um diálogo modal com rótulo superior (kicker), título, texto, nota opcional e uma lista de botões de ação, fechando pelo botão de cancelar/fechar. No estágio de registro da alimentação, a lista de botões MUST ser trocada pelo formulário de alimentação, que traz os próprios botões de confirmar e cancelar. O resultado de cada ação MUST ser aplicado à ficha e salvo.

#### Scenario: Cancelar
- **WHEN** o usuário clica "Cancelar" em qualquer diálogo de regra
- **THEN** o diálogo fecha e a ficha não muda

#### Scenario: Cancelar a alimentação depois de mexer no formulário
- **WHEN** o usuário muda o "Saciar", marca uma Ressonância e clica "Cancelar"
- **THEN** o diálogo fecha, a Fome e a Ressonância da ficha não mudam, e ao reabrir o formulário volta ao estado inicial

### Requirement: Alimentação
O usuário SHALL registrar alimentação num formulário de uma tela, com kicker "Alimentação", título "Registrar alimentação" e texto "Fome atual: N.". O formulário MUST ter:
- um controle "Saciar" com botões − e +, de 1 até a Fome atual, começando na Fome atual;
- a seção "Ressonância da presa" com Colérica, Melancólica, Fleumática e Sanguínea como opções de escolha única, em que tocar na opção marcada a desmarca;
- a intensidade como controle segmentado com os mesmos valores do painel Ressonância da aba Ficha (Negligenciável, Difusa, Intensa, Aguçada), começando em Negligenciável e desativada enquanto nenhuma Ressonância estiver marcada;
- o botão principal "Alimentar · Fome X → Y", em que X é a Fome atual e Y é X menos o "Saciar", e o botão "Cancelar".

Ao confirmar, a Fome MUST cair pelo valor de "Saciar", sem nunca ficar abaixo de 0. Com uma Ressonância marcada, a ficha MUST gravar a Ressonância e a intensidade escolhidas nos mesmos campos do painel Ressonância da aba Ficha. Sem Ressonância marcada, a Ressonância e a intensidade da ficha MUST ficar como estavam. Depois de confirmar, o diálogo MUST mostrar o título "Fome Y", o texto "Anotado na ficha." e uma nota com o que mudou. A alimentação MUST NOT depender da fonte do sangue nem da Potência de Sangue.

#### Scenario: Alimentar com Ressonância
- **WHEN** a Fome é 2, o usuário deixa "Saciar" em 2, marca "Fleumática", escolhe "Intensa" e clica "Alimentar · Fome 2 → 0"
- **THEN** a Fome passa a 0 e o painel Ressonância da aba Ficha mostra "Fleumática" e "Intensa" marcadas

#### Scenario: Saciar parcial sem Ressonância
- **WHEN** a Fome é 3, a ficha tem Ressonância "Colérica · Difusa", o usuário baixa "Saciar" para 1 e confirma sem marcar Ressonância
- **THEN** a Fome passa a 2 e a Ressonância da ficha continua "Colérica · Difusa"

#### Scenario: Limites do Saciar
- **WHEN** a Fome é 3 e o "Saciar" está em 3
- **THEN** o botão + fica desativado; ao baixar até 1, o botão − fica desativado

#### Scenario: Botão acompanha o Saciar
- **WHEN** a Fome é 4 e o usuário baixa "Saciar" para 3
- **THEN** o botão principal passa a dizer "Alimentar · Fome 4 → 1"

#### Scenario: Intensidade só com Ressonância
- **WHEN** nenhuma Ressonância está marcada
- **THEN** o controle de intensidade fica desativado; ao marcar "Sanguínea", ele fica ativo com "Negligenciável" escolhida

#### Scenario: Desmarcar Ressonância
- **WHEN** "Melancólica" está marcada e o usuário toca nela de novo
- **THEN** nenhuma Ressonância fica marcada e o controle de intensidade fica desativado

#### Scenario: Já saciado
- **WHEN** a Fome é 0 ao abrir a alimentação
- **THEN** o texto diz "Você está saciado. Nada a reduzir.", o "Saciar" mostra 0 com − e + desativados, e o botão principal diz "Registrar ressonância" e só fica ativo com uma Ressonância marcada

#### Scenario: Registrar só a Ressonância
- **WHEN** a Fome é 0, o usuário marca "Colérica" com "Aguçada" e clica "Registrar ressonância"
- **THEN** a Fome continua 0 e a ficha grava a Ressonância "Colérica" com intensidade "Aguçada"

### Requirement: Aba Ações
A aba Ações SHALL mostrar Vitalidade, Força de Vontade e Humanidade (com contagem de manchas) e os cartões de ação Alimentar-se, Teste de Frenesi (sangue) e Surto de Sangue (sangue), cada um com descrição e botão.

#### Scenario: Abrir alimentação pela aba
- **WHEN** o usuário clica "Registrar" no cartão Alimentar-se
- **THEN** o diálogo "Registrar alimentação" abre

### Requirement: Regras como funções puras
As regras (máximos de trilhas, marcação e transbordo de dano, cura ao dormir, cura agravada, alimentação com Fome e Ressonância, Potência por geração, cotas de atributos e habilidades) SHALL ser implementadas como funções puras em TypeScript, sem dependência de React, cobertas por testes unitários.

#### Scenario: Transbordo de dano superficial
- **WHEN** uma trilha de 4 caixas está com 4 superficiais e recebe mais 1 superficial
- **THEN** a primeira caixa superficial vira agravada
