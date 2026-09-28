## MODIFIED Requirements

### Requirement: Diálogo de regras
As ações de regra SHALL abrir um diálogo modal com rótulo superior (kicker), título, texto, nota opcional e uma lista de botões de ação, fechando pelo botão de cancelar/fechar. No estágio de registro da alimentação, no estágio de registro de dano e no estágio de registro de cura, a lista de botões MUST ser trocada pelo formulário correspondente (alimentação, dano ou cura), que traz os próprios botões de confirmar e cancelar. O resultado de cada ação MUST ser aplicado à ficha e salvo.

#### Scenario: Cancelar
- **WHEN** o usuário clica "Cancelar" em qualquer diálogo de regra
- **THEN** o diálogo fecha e a ficha não muda

#### Scenario: Cancelar a alimentação depois de mexer no formulário
- **WHEN** o usuário muda o "Saciar", marca uma Ressonância e clica "Cancelar"
- **THEN** o diálogo fecha, a Fome e a Ressonância da ficha não mudam, e ao reabrir o formulário volta ao estado inicial

### Requirement: Aba Ações
A aba Ações SHALL mostrar Vitalidade, Força de Vontade e Humanidade (com contagem de manchas) e os cartões de ação Sofrer dano, Curar-se, Alimentar-se, Teste de Frenesi (sangue) e Surto de Sangue (sangue), nesta ordem, cada um com descrição e botão. As trilhas MUST continuar permitindo a marcação manual caixa a caixa.

#### Scenario: Abrir alimentação pela aba
- **WHEN** o usuário clica "Registrar" no cartão Alimentar-se
- **THEN** o diálogo "Registrar alimentação" abre

#### Scenario: Abrir dano pela aba
- **WHEN** o usuário clica "Marcar dano" no cartão Sofrer dano
- **THEN** o diálogo "Sofrer dano" abre com "Vitalidade", "Dano recebido" 0 e "Superficial" escolhidos

#### Scenario: Abrir cura pela aba
- **WHEN** o usuário clica "Curar dano" no cartão Curar-se
- **THEN** o diálogo "Curar-se" abre com "Vitalidade", "Dano curado" 0 e "Superficial" escolhidos

### Requirement: Regras como funções puras
As regras (máximos de trilhas, marcação e transbordo de dano, cura de dano por tipo, cura ao dormir, cura agravada, alimentação com Fome e Ressonância, Potência por geração, cotas de atributos e habilidades) SHALL ser implementadas como funções puras em TypeScript, sem dependência de React, cobertas por testes unitários.

#### Scenario: Transbordo de dano superficial
- **WHEN** uma trilha de 4 caixas está com 4 superficiais e recebe mais 1 superficial
- **THEN** a primeira caixa superficial vira agravada

#### Scenario: Dano marcado é o dano recebido
- **WHEN** a Vitalidade de 5 caixas vazias recebe 3 de dano Superficial
- **THEN** o resultado tem 3 caixas superficiais, sem divisão

#### Scenario: Cura da última caixa para a primeira
- **WHEN** uma trilha com superficial, agravado, superficial, vazio, vazio recebe 1 de cura Superficial
- **THEN** o resultado é superficial, agravado, vazio, vazio, vazio

#### Scenario: Cura de agravado esvazia a caixa
- **WHEN** uma trilha com agravado, superficial, vazio recebe 1 de cura Agravado
- **THEN** o resultado é vazio, superficial, vazio

## ADDED Requirements

### Requirement: Curar-se
O usuário SHALL registrar cura num formulário de uma tela dentro do diálogo de regras, com kicker "Cura" e título "Curar-se", no mesmo modelo visual do "Sofrer dano". O formulário MUST ter, nesta ordem:
- abas segmentadas "Vitalidade" e "Força de Vontade" para escolher a trilha, começando em "Vitalidade";
- o controle "Dano curado" com botões − e +, começando em 0, de 0 até o número de caixas marcadas com o tipo escolhido no ponto de partida (a ficha, ou as caixas clicadas); ao trocar o tipo ou a trilha, se o valor passar do novo limite, MUST ser reduzido a ele;
- dois cartões de escolha única, "Superficial" (com o ícone de traço) e "Agravado" (com o ícone de X), começando em "Superficial", com o mesmo visual de marcado/desmarcado do "Sofrer dano";
- a pré-visualização "<Trilha> depois" (ex.: "Vitalidade depois"), com as caixas da trilha no tamanho atual, partindo da ficha ou das caixas clicadas e com a cura aplicada por cima, em que cada caixa diferente da ficha MUST ter borda tracejada vermelha e a marca em vermelho; sem cliques e com "Dano curado" 0, a pré-visualização MUST mostrar a trilha como está, sem caixas destacadas;
- a dica de toque "Toque para marcar: vazio → superficial → agravado", com os ícones, igual à da trilha da ficha;
- um texto de dica sobre o custo da cura;
- o botão principal e o botão "Cancelar". O botão principal MUST dizer "Curar R de dano", em que R é o dano curado, enquanto nenhuma caixa foi clicada, e "Curar dano" depois do primeiro clique. O botão principal MUST ficar desativado quando nenhuma caixa da pré-visualização difere da ficha.

Cada caixa da pré-visualização MUST ser um botão com o mesmo ciclo da trilha da ficha e o mesmo comportamento do "Sofrer dano": o clique age sobre o que está na tela (as caixas mostradas, com a cura já aplicada, viram o novo ponto de partida), "Dano curado" volta a 0 e a caixa clicada avança uma posição no ciclo. Trocar a trilha MUST descartar as caixas clicadas e partir de novo da ficha na trilha escolhida.

A cura MUST remover exatamente R marcas do tipo escolhido, da última caixa para a primeira; cada caixa curada, superficial ou agravada, MUST ficar vazia. As demais caixas MUST NOT mudar. O app MUST NOT cobrar o custo da cura (checagens de sangue, Fome, noites): o custo aparece só como dica. O texto de dica MUST ser:
- Vitalidade + Superficial: "Com Potência de Sangue P, cada checagem de sangue cura M de dano Superficial.", em que P é a Potência de Sangue do personagem e M a cura da tabela de Potência;
- Vitalidade + Agravado: "Cada 1 de dano Agravado curado exige três checagens de sangue.";
- Força de Vontade + Superficial: "Ao dormir, a Força de Vontade recupera W de dano Superficial.", em que W é o maior entre Autocontrole e Determinação;
- Força de Vontade + Agravado: "Dano Agravado de Força de Vontade se recupera com o tempo, a critério do Narrador.".

Ao confirmar, a trilha escolhida MUST ser gravada na ficha exatamente como na pré-visualização e o diálogo MUST mostrar o título "Dano curado", o texto "Anotado na ficha." e uma nota. Sem caixas clicadas, a nota MUST ser "R de dano <superficial|agravado> curado na <Trilha>."; com caixas clicadas, MUST ser "<Trilha> atualizada: S <superficial|superficiais>, A <agravado|agravados>.", com S e A contados nas caixas gravadas, com os mesmos acréscimos de " Trilha cheia: Debilitado." e " Vitalidade toda agravada: torpor." do "Sofrer dano".

#### Scenario: Abre sem cura
- **WHEN** a Vitalidade tem 5 caixas com 2 superficiais e o usuário abre "Curar-se"
- **THEN** "Dano curado" mostra 0, a pré-visualização "Vitalidade depois" mostra as 2 superficiais sem nenhuma caixa tracejada, a dica de toque aparece sob ela, e o botão "Curar 0 de dano" fica desativado

#### Scenario: Curar superficial
- **WHEN** a Vitalidade tem 5 caixas com 3 superficiais e o usuário sobe "Dano curado" para 2 com "Superficial"
- **THEN** a pré-visualização mostra 1 superficial na 1ª caixa e a 2ª e a 3ª vazias, tracejadas em vermelho, e o botão diz "Curar 2 de dano"

#### Scenario: Curar agravado esvazia a caixa
- **WHEN** a Vitalidade tem 5 caixas com a 1ª agravada e a 2ª superficial, e o usuário escolhe "Agravado" e sobe "Dano curado" para 1
- **THEN** a pré-visualização mostra a 1ª caixa vazia e tracejada em vermelho, a 2ª superficial sem destaque, e o texto diz "Cada 1 de dano Agravado curado exige três checagens de sangue."

#### Scenario: Limite do Dano curado
- **WHEN** a Vitalidade tem 2 superficiais e 1 agravado e o usuário está em "Superficial"
- **THEN** o botão − fica desativado em 0 e o botão + fica desativado ao chegar a 2

#### Scenario: Trocar o tipo reduz o Dano curado
- **WHEN** a Vitalidade tem 2 superficiais e 1 agravado, o usuário sobe "Dano curado" para 2 com "Superficial" e escolhe "Agravado"
- **THEN** "Dano curado" passa a 1, a caixa agravada aparece vazia e tracejada, e o botão diz "Curar 1 de dano"

#### Scenario: Nada do tipo para curar
- **WHEN** a Vitalidade não tem caixa agravada e o usuário escolhe "Agravado"
- **THEN** "Dano curado" fica em 0 com os botões − e + desativados, e o botão "Curar 0 de dano" fica desativado

#### Scenario: Dica de Potência de Sangue
- **WHEN** o personagem tem Potência de Sangue 2 e o usuário está em "Vitalidade" com "Superficial"
- **THEN** o texto diz "Com Potência de Sangue 2, cada checagem de sangue cura 2 de dano Superficial."

#### Scenario: Força de Vontade
- **WHEN** o personagem tem Autocontrole 2 e Determinação 3 e o usuário troca para "Força de Vontade" com "Superficial"
- **THEN** a pré-visualização passa a "Força de Vontade depois" com as caixas da Força de Vontade e o texto diz "Ao dormir, a Força de Vontade recupera 3 de dano Superficial."

#### Scenario: Confirmar grava na ficha
- **WHEN** a Vitalidade tem 5 caixas com 3 superficiais e o usuário clica "Curar 2 de dano" com "Superficial"
- **THEN** a Vitalidade da ficha fica com 1 superficial e 4 vazias, igual à pré-visualização, a Fome não muda, e o diálogo mostra "Dano curado", "Anotado na ficha." e a nota "2 de dano superficial curado na Vitalidade."

#### Scenario: Curar clicando nas caixas
- **WHEN** a Vitalidade tem 5 caixas com a 1ª superficial e o usuário clica duas vezes nela na pré-visualização
- **THEN** a 1ª caixa mostra vazio com borda tracejada vermelha, "Dano curado" segue 0 e o botão diz "Curar dano" e fica ativo

#### Scenario: Limite parte das caixas clicadas
- **WHEN** a Vitalidade tem 5 caixas vazias e o usuário clica uma vez na 1ª e uma vez na 2ª caixa
- **THEN** o botão + de "Dano curado" fica desativado ao chegar a 2, e com 2 as duas caixas voltam a vazio sem destaque e o botão "Curar dano" fica desativado

#### Scenario: Confirmar depois de clicar
- **WHEN** a Vitalidade tem 5 caixas com 2 superficiais, o usuário clica duas vezes na 2ª caixa e clica "Curar dano"
- **THEN** a Vitalidade da ficha fica com 1 superficial e 4 vazias, e a nota é "Vitalidade atualizada: 1 superficial, 0 agravados."

#### Scenario: Trocar a trilha descarta os cliques
- **WHEN** o usuário clica numa caixa da pré-visualização de "Vitalidade" e troca para "Força de Vontade"
- **THEN** a pré-visualização mostra a Força de Vontade como está na ficha e, ao voltar para "Vitalidade", o clique anterior não aparece

#### Scenario: Cancelar a cura depois de mexer no formulário
- **WHEN** o usuário troca a trilha, muda o "Dano curado", marca "Agravado", clica numa caixa da pré-visualização e clica "Cancelar"
- **THEN** o diálogo fecha, as trilhas da ficha não mudam, e ao reabrir o formulário volta ao estado inicial
