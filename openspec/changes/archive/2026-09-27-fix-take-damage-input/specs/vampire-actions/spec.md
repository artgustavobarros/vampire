## MODIFIED Requirements

### Requirement: Aba Ações
A aba Ações SHALL mostrar Vitalidade, Força de Vontade e Humanidade (com contagem de manchas) e os cartões de ação Sofrer dano, Alimentar-se, Teste de Frenesi (sangue) e Surto de Sangue (sangue), cada um com descrição e botão. As trilhas MUST continuar permitindo a marcação manual caixa a caixa.

#### Scenario: Abrir alimentação pela aba
- **WHEN** o usuário clica "Registrar" no cartão Alimentar-se
- **THEN** o diálogo "Registrar alimentação" abre

#### Scenario: Abrir dano pela aba
- **WHEN** o usuário clica "Marcar dano" no cartão Sofrer dano
- **THEN** o diálogo "Sofrer dano" abre com "Vitalidade", "Dano recebido" 0 e "Superficial" escolhidos

### Requirement: Regras como funções puras
As regras (máximos de trilhas, marcação e transbordo de dano, cura ao dormir, cura agravada, alimentação com Fome e Ressonância, Potência por geração, cotas de atributos e habilidades) SHALL ser implementadas como funções puras em TypeScript, sem dependência de React, cobertas por testes unitários.

#### Scenario: Transbordo de dano superficial
- **WHEN** uma trilha de 4 caixas está com 4 superficiais e recebe mais 1 superficial
- **THEN** a primeira caixa superficial vira agravada

#### Scenario: Dano marcado é o dano recebido
- **WHEN** a Vitalidade de 5 caixas vazias recebe 3 de dano Superficial
- **THEN** o resultado tem 3 caixas superficiais, sem divisão

### Requirement: Sofrer dano
O usuário SHALL registrar dano num formulário de uma tela dentro do diálogo de regras, com kicker "Dano" e título "Sofrer dano". O formulário MUST ter, nesta ordem:
- abas segmentadas "Vitalidade" e "Força de Vontade" para escolher a trilha, começando em "Vitalidade";
- o controle "Dano recebido" com botões − e +, de 0 a 20, começando em 0, que representa só o dano novo deste golpe;
- dois cartões de escolha única, "Superficial" (com o ícone de traço) e "Agravado" (com o ícone de X), começando em "Superficial"; o cartão marcado tem borda tinta e texto tinta, o outro borda clara e texto suave;
- a pré-visualização "<Trilha> depois" (ex.: "Vitalidade depois"), com as caixas da trilha no tamanho atual, com o dano já acumulado na ficha e o dano recebido aplicado por cima, em que cada caixa alterada por este dano MUST ter borda tracejada vermelha e a marca em vermelho; com "Dano recebido" 0, a pré-visualização MUST mostrar a trilha como está, sem caixas destacadas;
- um texto de dica;
- o botão principal "Marcar R de dano", em que R é o dano recebido, e o botão "Cancelar". Com "Dano recebido" 0, o botão principal MUST ficar desativado.

O app MUST NOT dividir nem ajustar o dano: o número de pontos marcados MUST ser exatamente o "Dano recebido", em qualquer trilha e tipo. A divisão do Superficial é decisão do jogador e aparece só como dica. O texto de dica MUST ser:
- Vitalidade + Superficial com R ≥ 1: "Vampiros dividem dano Superficial por 2, arredondando para cima: R virariam N. Ajuste o dano recebido se for o caso.", em que N é R dividido por 2 arredondado para cima (com "1 viraria 1." quando R é 1);
- Vitalidade + Superficial com R = 0: "Vampiros dividem dano Superficial por 2, arredondando para cima. Ajuste o dano recebido se for o caso.";
- Vitalidade + Agravado: "Dano Agravado não é dividido.";
- Força de Vontade: "Dano de Força de Vontade não é dividido.".

A aplicação MUST seguir a regra de marcação existente: cada ponto ocupa a primeira caixa vazia; sem caixa vazia, a primeira caixa superficial vira agravada. Ao confirmar, a trilha escolhida MUST ser gravada na ficha exatamente como na pré-visualização e o diálogo MUST mostrar o título "Dano marcado", o texto "Anotado na ficha." e uma nota "R de dano <superficial|agravado> marcado na <Trilha>.". Se todas as caixas da trilha ficarem marcadas, a nota MUST acrescentar " Trilha cheia: Debilitado."; se a trilha for Vitalidade e todas as caixas ficarem agravadas, MUST acrescentar " Vitalidade toda agravada: torpor." no lugar.

#### Scenario: Abre sem dano novo
- **WHEN** a Vitalidade tem 5 caixas com 2 superficiais e o usuário abre "Sofrer dano"
- **THEN** "Dano recebido" mostra 0, a pré-visualização "Vitalidade depois" mostra as 2 superficiais sem nenhuma caixa tracejada, e o botão "Marcar 0 de dano" fica desativado

#### Scenario: Superficial em Vitalidade não é dividido
- **WHEN** a Vitalidade tem 5 caixas com 1 superficial, o usuário deixa "Vitalidade", sobe "Dano recebido" para 3 e mantém "Superficial"
- **THEN** o texto diz "Vampiros dividem dano Superficial por 2, arredondando para cima: 3 virariam 2. Ajuste o dano recebido se for o caso.", a pré-visualização "Vitalidade depois" mostra 4 superficiais com a 2ª, a 3ª e a 4ª caixas tracejadas em vermelho, e o botão diz "Marcar 3 de dano"

#### Scenario: Trilha cheia de superficiais transborda
- **WHEN** a Vitalidade tem 5 caixas todas superficiais e o usuário sobe "Dano recebido" para 1 com "Superficial"
- **THEN** a pré-visualização mostra a primeira caixa agravada e tracejada em vermelho, e as outras 4 superficiais sem destaque

#### Scenario: Agravado
- **WHEN** o usuário escolhe "Agravado" com "Dano recebido" 3 em Vitalidade
- **THEN** o texto diz "Dano Agravado não é dividido." e o botão diz "Marcar 3 de dano"

#### Scenario: Força de Vontade
- **WHEN** o usuário troca para "Força de Vontade" com "Dano recebido" 3 e "Superficial"
- **THEN** a pré-visualização passa a "Força de Vontade depois" com as caixas da Força de Vontade, o texto diz "Dano de Força de Vontade não é dividido." e o botão diz "Marcar 3 de dano"

#### Scenario: Limites do Dano recebido
- **WHEN** o "Dano recebido" está em 0
- **THEN** o botão − fica desativado; ao chegar a 20, o botão + fica desativado

#### Scenario: Transbordo na pré-visualização
- **WHEN** a Vitalidade tem 4 caixas todas superficiais e o usuário aplica 1 Agravado
- **THEN** a pré-visualização mostra a primeira caixa agravada e tracejada em vermelho, e as demais superficiais sem destaque

#### Scenario: Confirmar grava na ficha
- **WHEN** a Vitalidade tem 5 caixas com 1 superficial e o usuário clica "Marcar 3 de dano" com Superficial em Vitalidade
- **THEN** a Vitalidade da ficha fica com 4 superficiais e 1 vazia, igual à pré-visualização, e o diálogo mostra "Dano marcado", "Anotado na ficha." e a nota "3 de dano superficial marcado na Vitalidade."

#### Scenario: Golpes seguidos acumulam
- **WHEN** a Vitalidade tem 5 caixas vazias, o usuário marca 5 de dano Superficial, fecha, reabre "Sofrer dano" e sobe "Dano recebido" para 1 com "Superficial"
- **THEN** o formulário reabre com "Dano recebido" 0 mostrando as 5 superficiais, e com 1 a pré-visualização mostra a primeira caixa agravada tracejada em vermelho

#### Scenario: Vitalidade toda agravada
- **WHEN** a Vitalidade tem 4 caixas, 3 agravadas e 1 vazia, e o usuário confirma 1 Agravado
- **THEN** a nota termina com "Vitalidade toda agravada: torpor."

#### Scenario: Cancelar o dano depois de mexer no formulário
- **WHEN** o usuário troca a trilha, muda o "Dano recebido", marca "Agravado" e clica "Cancelar"
- **THEN** o diálogo fecha, as trilhas da ficha não mudam, e ao reabrir o formulário volta ao estado inicial
