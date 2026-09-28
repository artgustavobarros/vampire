## MODIFIED Requirements

### Requirement: Sofrer dano
O usuário SHALL registrar dano num formulário de uma tela dentro do diálogo de regras, com kicker "Dano" e título "Sofrer dano". O formulário MUST ter, nesta ordem:
- abas segmentadas "Vitalidade" e "Força de Vontade" para escolher a trilha, começando em "Vitalidade";
- o controle "Dano recebido" com botões − e +, de 0 a 20, começando em 0, que representa só o dano novo deste golpe;
- dois cartões de escolha única, "Superficial" (com o ícone de traço) e "Agravado" (com o ícone de X), começando em "Superficial"; o cartão marcado tem borda tinta e texto tinta, o outro borda clara e texto suave;
- a pré-visualização "<Trilha> depois" (ex.: "Vitalidade depois"), com as caixas da trilha no tamanho atual, com o dano já acumulado na ficha, as caixas clicadas e o dano recebido aplicado por cima, em que cada caixa diferente da ficha MUST ter borda tracejada vermelha e a marca em vermelho; sem cliques e com "Dano recebido" 0, a pré-visualização MUST mostrar a trilha como está, sem caixas destacadas;
- a dica de toque "Toque para marcar: vazio → superficial → agravado", com os ícones de superficial e agravado, igual à da trilha da ficha;
- um texto de dica sobre a divisão;
- o botão principal e o botão "Cancelar". O botão principal MUST dizer "Marcar R de dano", em que R é o dano recebido, enquanto nenhuma caixa foi clicada, e "Marcar dano" depois do primeiro clique. O botão principal MUST ficar desativado quando "Dano recebido" é 0 e nenhuma caixa da pré-visualização difere da ficha.

Cada caixa da pré-visualização MUST ser um botão com o mesmo ciclo da trilha da ficha: vazio → superficial → agravado → vazio. O clique MUST agir sobre o que está na tela: as caixas mostradas (com o dano recebido já aplicado) viram o novo ponto de partida, "Dano recebido" volta a 0 e a caixa clicada avança uma posição no ciclo. O dano recebido depois disso MUST ser aplicado por cima das caixas clicadas. Trocar a trilha MUST descartar as caixas clicadas da trilha anterior e partir de novo da ficha na trilha escolhida.

O app MUST NOT dividir nem ajustar o dano: o número de pontos marcados pelo controle MUST ser exatamente o "Dano recebido", em qualquer trilha e tipo. A divisão do Superficial é decisão do jogador e aparece só como dica. O texto de dica sobre a divisão MUST ser:
- Vitalidade + Superficial com R ≥ 1: "Vampiros dividem dano Superficial por 2, arredondando para cima: R virariam N. Ajuste o dano recebido se for o caso.", em que N é R dividido por 2 arredondado para cima (com "1 viraria 1." quando R é 1);
- Vitalidade + Superficial com R = 0: "Vampiros dividem dano Superficial por 2, arredondando para cima. Ajuste o dano recebido se for o caso.";
- Vitalidade + Agravado: "Dano Agravado não é dividido.";
- Força de Vontade: "Dano de Força de Vontade não é dividido.".

A aplicação do dano recebido MUST seguir a regra de marcação existente: cada ponto ocupa a primeira caixa vazia; sem caixa vazia, a primeira caixa superficial vira agravada. Ao confirmar, a trilha escolhida MUST ser gravada na ficha exatamente como na pré-visualização e o diálogo MUST mostrar o título "Dano marcado", o texto "Anotado na ficha." e uma nota. Sem caixas clicadas, a nota MUST ser "R de dano <superficial|agravado> marcado na <Trilha>."; com caixas clicadas, MUST ser "<Trilha> atualizada: S <superficial|superficiais>, A <agravado|agravados>.", com S e A contados nas caixas gravadas. Se todas as caixas da trilha ficarem marcadas, a nota MUST acrescentar " Trilha cheia: Debilitado."; se a trilha for Vitalidade e todas as caixas ficarem agravadas, MUST acrescentar " Vitalidade toda agravada: torpor." no lugar.

#### Scenario: Abre sem dano novo
- **WHEN** a Vitalidade tem 5 caixas com 2 superficiais e o usuário abre "Sofrer dano"
- **THEN** "Dano recebido" mostra 0, a pré-visualização "Vitalidade depois" mostra as 2 superficiais sem nenhuma caixa tracejada, a dica de toque aparece sob ela, e o botão "Marcar 0 de dano" fica desativado

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

#### Scenario: Marcar clicando nas caixas
- **WHEN** a Vitalidade tem 5 caixas vazias, o usuário abre "Sofrer dano" e clica duas vezes na 3ª caixa da pré-visualização
- **THEN** a 3ª caixa mostra agravado com borda tracejada vermelha, as demais seguem vazias sem destaque, "Dano recebido" segue 0 e o botão diz "Marcar dano" e fica ativo

#### Scenario: Terceiro clique volta a vazio
- **WHEN** o usuário clica três vezes numa caixa vazia da pré-visualização
- **THEN** a caixa volta a vazio sem destaque e, sem outras diferenças da ficha, o botão "Marcar dano" fica desativado

#### Scenario: Clique desmarca dano já gravado
- **WHEN** a Vitalidade tem 5 caixas com a 1ª agravada e o usuário clica nela na pré-visualização
- **THEN** a 1ª caixa mostra vazio com borda tracejada vermelha e o botão "Marcar dano" fica ativo

#### Scenario: Clique depois do stepper parte do que está na tela
- **WHEN** a Vitalidade tem 5 caixas vazias, o usuário sobe "Dano recebido" para 2 com "Superficial" e clica na 1ª caixa da pré-visualização
- **THEN** "Dano recebido" volta a 0, a 1ª caixa mostra agravado e a 2ª superficial, ambas tracejadas em vermelho, e o botão diz "Marcar dano"

#### Scenario: Stepper soma por cima das caixas clicadas
- **WHEN** a Vitalidade tem 5 caixas vazias, o usuário clica uma vez na 1ª caixa e depois sobe "Dano recebido" para 1 com "Agravado"
- **THEN** a pré-visualização mostra a 1ª caixa superficial e a 2ª agravada, ambas tracejadas em vermelho, e o botão diz "Marcar dano"

#### Scenario: Confirmar depois de clicar
- **WHEN** a Vitalidade tem 5 caixas com 1 superficial, o usuário clica duas vezes na 2ª caixa e clica "Marcar dano"
- **THEN** a Vitalidade da ficha fica com 1 superficial, 1 agravada e 3 vazias, e o diálogo mostra "Dano marcado", "Anotado na ficha." e a nota "Vitalidade atualizada: 1 superficial, 1 agravado."

#### Scenario: Trocar a trilha descarta os cliques
- **WHEN** o usuário clica numa caixa da pré-visualização de "Vitalidade" e troca para "Força de Vontade"
- **THEN** a pré-visualização mostra a Força de Vontade como está na ficha e, ao voltar para "Vitalidade", o clique anterior não aparece

#### Scenario: Golpes seguidos acumulam
- **WHEN** a Vitalidade tem 5 caixas vazias, o usuário marca 5 de dano Superficial, fecha, reabre "Sofrer dano" e sobe "Dano recebido" para 1 com "Superficial"
- **THEN** o formulário reabre com "Dano recebido" 0 mostrando as 5 superficiais, e com 1 a pré-visualização mostra a primeira caixa agravada tracejada em vermelho

#### Scenario: Vitalidade toda agravada
- **WHEN** a Vitalidade tem 4 caixas, 3 agravadas e 1 vazia, e o usuário confirma 1 Agravado
- **THEN** a nota termina com "Vitalidade toda agravada: torpor."

#### Scenario: Cancelar o dano depois de mexer no formulário
- **WHEN** o usuário troca a trilha, muda o "Dano recebido", marca "Agravado", clica numa caixa da pré-visualização e clica "Cancelar"
- **THEN** o diálogo fecha, as trilhas da ficha não mudam, e ao reabrir o formulário volta ao estado inicial
