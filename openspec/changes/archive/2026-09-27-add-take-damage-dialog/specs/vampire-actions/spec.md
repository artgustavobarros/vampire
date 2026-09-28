## ADDED Requirements

### Requirement: Sofrer dano
O usuário SHALL registrar dano num formulário de uma tela dentro do diálogo de regras, com kicker "Dano" e título "Sofrer dano". O formulário MUST ter, nesta ordem:
- abas segmentadas "Vitalidade" e "Força de Vontade" para escolher a trilha, começando em "Vitalidade";
- o controle "Dano recebido" com botões − e +, de 1 a 20, começando em 1;
- dois cartões de escolha única, "Superficial" (com o ícone de traço) e "Agravado" (com o ícone de X), começando em "Superficial"; o cartão marcado tem borda tinta e texto tinta, o outro borda clara e texto suave;
- a pré-visualização "<Trilha> depois" (ex.: "Vitalidade depois"), com as caixas da trilha no tamanho atual já com o dano aplicado, em que cada caixa alterada por este dano MUST ter borda tracejada vermelha e a marca em vermelho;
- um texto explicativo da conta;
- o botão principal "Marcar N de dano", em que N é o dano efetivo, e o botão "Cancelar".

O dano efetivo MUST ser o dano recebido dividido por 2 e arredondado para cima quando a trilha for Vitalidade e o tipo for Superficial; em qualquer outro caso MUST ser igual ao dano recebido. O texto explicativo MUST ser:
- Vitalidade + Superficial: "Vampiros dividem dano Superficial por 2, arredondando para cima: R viram N." (com "1 vira 1." quando R é 1);
- Vitalidade + Agravado: "Dano Agravado não é dividido.";
- Força de Vontade: "Dano de Força de Vontade não é dividido.".

A aplicação MUST seguir a regra de marcação existente: cada ponto ocupa a primeira caixa vazia; sem caixa vazia, a primeira caixa superficial vira agravada. Ao confirmar, a trilha escolhida MUST ser gravada na ficha exatamente como na pré-visualização e o diálogo MUST mostrar o título "Dano marcado", o texto "Anotado na ficha." e uma nota "N de dano <superficial|agravado> marcado na <Trilha>.". Se todas as caixas da trilha ficarem marcadas, a nota MUST acrescentar " Trilha cheia: Debilitado."; se a trilha for Vitalidade e todas as caixas ficarem agravadas, MUST acrescentar " Vitalidade toda agravada: torpor." no lugar.

#### Scenario: Superficial em Vitalidade é dividido
- **WHEN** a Vitalidade tem 5 caixas com 1 superficial, o usuário deixa "Vitalidade", sobe "Dano recebido" para 3 e mantém "Superficial"
- **THEN** o texto diz "Vampiros dividem dano Superficial por 2, arredondando para cima: 3 viram 2.", a pré-visualização "Vitalidade depois" mostra 3 superficiais com a 2ª e a 3ª caixas tracejadas em vermelho, e o botão diz "Marcar 2 de dano"

#### Scenario: Agravado não é dividido
- **WHEN** o usuário escolhe "Agravado" com "Dano recebido" 3 em Vitalidade
- **THEN** o texto diz "Dano Agravado não é dividido." e o botão diz "Marcar 3 de dano"

#### Scenario: Força de Vontade não é dividida
- **WHEN** o usuário troca para "Força de Vontade" com "Dano recebido" 3 e "Superficial"
- **THEN** a pré-visualização passa a "Força de Vontade depois" com as caixas da Força de Vontade, o texto diz "Dano de Força de Vontade não é dividido." e o botão diz "Marcar 3 de dano"

#### Scenario: Limites do Dano recebido
- **WHEN** o "Dano recebido" está em 1
- **THEN** o botão − fica desativado; ao chegar a 20, o botão + fica desativado

#### Scenario: Transbordo na pré-visualização
- **WHEN** a Vitalidade tem 4 caixas todas superficiais e o usuário aplica 1 Agravado
- **THEN** a pré-visualização mostra a primeira caixa agravada e tracejada em vermelho, e as demais superficiais sem destaque

#### Scenario: Confirmar grava na ficha
- **WHEN** o usuário clica "Marcar 2 de dano" com Superficial em Vitalidade
- **THEN** a Vitalidade da ficha fica igual à pré-visualização, o diálogo mostra "Dano marcado", "Anotado na ficha." e a nota "2 de dano superficial marcado na Vitalidade."

#### Scenario: Vitalidade toda agravada
- **WHEN** a Vitalidade tem 4 caixas, 3 agravadas e 1 vazia, e o usuário confirma 1 Agravado
- **THEN** a nota termina com "Vitalidade toda agravada: torpor."

#### Scenario: Cancelar o dano depois de mexer no formulário
- **WHEN** o usuário troca a trilha, muda o "Dano recebido", marca "Agravado" e clica "Cancelar"
- **THEN** o diálogo fecha, as trilhas da ficha não mudam, e ao reabrir o formulário volta ao estado inicial

## MODIFIED Requirements

### Requirement: Diálogo de regras
As ações de regra SHALL abrir um diálogo modal com rótulo superior (kicker), título, texto, nota opcional e uma lista de botões de ação, fechando pelo botão de cancelar/fechar. No estágio de registro da alimentação e no estágio de registro de dano, a lista de botões MUST ser trocada pelo formulário correspondente (alimentação ou dano), que traz os próprios botões de confirmar e cancelar. O resultado de cada ação MUST ser aplicado à ficha e salvo.

#### Scenario: Cancelar
- **WHEN** o usuário clica "Cancelar" em qualquer diálogo de regra
- **THEN** o diálogo fecha e a ficha não muda

#### Scenario: Cancelar a alimentação depois de mexer no formulário
- **WHEN** o usuário muda o "Saciar", marca uma Ressonância e clica "Cancelar"
- **THEN** o diálogo fecha, a Fome e a Ressonância da ficha não mudam, e ao reabrir o formulário volta ao estado inicial

### Requirement: Aba Ações
A aba Ações SHALL mostrar Vitalidade, Força de Vontade e Humanidade (com contagem de manchas) e os cartões de ação Sofrer dano, Alimentar-se, Teste de Frenesi (sangue) e Surto de Sangue (sangue), cada um com descrição e botão. As trilhas MUST continuar permitindo a marcação manual caixa a caixa.

#### Scenario: Abrir alimentação pela aba
- **WHEN** o usuário clica "Registrar" no cartão Alimentar-se
- **THEN** o diálogo "Registrar alimentação" abre

#### Scenario: Abrir dano pela aba
- **WHEN** o usuário clica "Marcar dano" no cartão Sofrer dano
- **THEN** o diálogo "Sofrer dano" abre com "Vitalidade", "Dano recebido" 1 e "Superficial" escolhidos

### Requirement: Regras como funções puras
As regras (máximos de trilhas, marcação e transbordo de dano, dano efetivo com a divisão do Superficial em Vitalidade, cura ao dormir, cura agravada, alimentação com Fome e Ressonância, Potência por geração, cotas de atributos e habilidades) SHALL ser implementadas como funções puras em TypeScript, sem dependência de React, cobertas por testes unitários.

#### Scenario: Transbordo de dano superficial
- **WHEN** uma trilha de 4 caixas está com 4 superficiais e recebe mais 1 superficial
- **THEN** a primeira caixa superficial vira agravada

#### Scenario: Dano efetivo arredonda para cima
- **WHEN** a Vitalidade recebe 3 de dano Superficial
- **THEN** o dano efetivo é 2; com 1 recebido, é 1
