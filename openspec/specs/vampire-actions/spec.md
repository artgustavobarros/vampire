# vampire-actions Specification

## Purpose
Ações de regra da ficha: Rouse Check, dormir e curar, cura agravada, alimentação com Ressonância da presa, frenesi, surto de sangue e alerta de Fome.
## Requirements
### Requirement: Diálogo de regras
As ações de regra SHALL abrir um diálogo modal com rótulo superior (kicker), título, texto, nota opcional e uma lista de botões de ação, fechando pelo botão de cancelar/fechar. No estágio de registro da alimentação, no estágio de registro de dano e no estágio de registro de cura, a lista de botões MUST ser trocada pelo formulário correspondente (alimentação, dano ou cura), que traz os próprios botões de confirmar e cancelar. O resultado de cada ação MUST ser aplicado à ficha e salvo.

#### Scenario: Cancelar
- **WHEN** o usuário clica "Cancelar" em qualquer diálogo de regra
- **THEN** o diálogo fecha e a ficha não muda

#### Scenario: Cancelar a alimentação depois de mexer no formulário
- **WHEN** o usuário muda o "Saciar", marca uma Ressonância e clica "Cancelar"
- **THEN** o diálogo fecha, a Fome e a Ressonância da ficha não mudam, e ao reabrir o formulário volta ao estado inicial

### Requirement: Rouse Check
O usuário SHALL poder registrar um Rouse Check informando se passou ou falhou.

#### Scenario: Passou
- **WHEN** o usuário escolhe "Passei"
- **THEN** a Fome não muda e a nota diz "Fome permanece em N. Sem alteração."

#### Scenario: Falhou
- **WHEN** o usuário escolhe "Falhei" com Fome 2
- **THEN** a Fome passa a 3 e a nota diz "Fome sobe para 3."

#### Scenario: Falhou chegando a 5
- **WHEN** o usuário falha com Fome 4 e o aviso de frenesi está ativo
- **THEN** a Fome passa a 5 e a nota avisa sobre Frenesi de Fome e o teste de Determinação

#### Scenario: Limite de Fome
- **WHEN** o usuário falha com Fome 5
- **THEN** a Fome permanece 5

### Requirement: Dormir e acordar
O usuário SHALL poder encerrar a noite. Com a regra de cura ao dormir ativa, dormir MUST curar dano superficial de Vitalidade igual ao valor de recuperação da Potência de Sangue atual, restaurar Força de Vontade superficial igual ao maior entre Autocontrole e Determinação, e somar 1 a noites vividas. Depois MUST oferecer o Rouse Check de despertar.

#### Scenario: Dormir com dano
- **WHEN** o personagem tem 2 superficiais em Vitalidade, Potência 1 e dorme
- **THEN** 1 superficial é curado, a Força de Vontade é restaurada conforme a regra, noites vividas aumenta em 1 e o diálogo "Hora de acordar" oferece "Fazer Rouse Check"

#### Scenario: Nada a curar
- **WHEN** não há dano superficial em nenhuma trilha
- **THEN** a nota diz "Nada a curar nesta noite."

### Requirement: Cura de dano agravado
O usuário SHALL poder curar 1 dano agravado informando quantos dos três Rouse Checks falharam (0 a 3); cada falha soma 1 de Fome (máx. 5).

#### Scenario: Cura com uma falha
- **WHEN** há dano agravado na Vitalidade, Fome 1, e o usuário escolhe "1 falhou"
- **THEN** a última caixa agravada vira superficial e a Fome passa a 2

#### Scenario: Sem dano agravado
- **WHEN** não há caixas agravadas
- **THEN** apenas a Fome é ajustada e a nota informa "Nenhum dano agravado marcado na vitalidade."

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

### Requirement: Teste de Frenesi
O usuário SHALL escolher a provocação (fome/sangue à vista dif. 2, provocação/fúria dif. 3, terror dif. 4), ver a reserva (Autocontrole + Determinação) e registrar se resistiu ou sucumbiu, sem alterar a ficha.

#### Scenario: Sucumbir
- **WHEN** o usuário escolhe "Provocação ou fúria" e depois "Sucumbi ao frenesi"
- **THEN** o resultado "Frenesi resolvido" explica as restrições do frenesi por uma cena

### Requirement: Surto de Sangue
A ação Surto de Sangue SHALL abrir o Rouse Check com a nota do bônus de surto da Potência atual, no formato "Surto de Sangue: <bônus em minúscula> ao teste.", usando o texto da tabela de Potência de Sangue do livro.

#### Scenario: Surto na Potência 1
- **WHEN** o usuário aciona "Rouse + surto" com Potência 1
- **THEN** o Rouse Check abre com a nota "Surto de Sangue: adicione 2 dados ao teste."

#### Scenario: Surto na Potência 0
- **WHEN** o usuário aciona "Rouse + surto" com uma ficha de 15ª Geração
- **THEN** o Rouse Check abre com a nota "Surto de Sangue: adicione 1 dado ao teste."

### Requirement: Aba Ações
A aba Ações SHALL mostrar Humanidade (com contagem de manchas) e os cartões de ação Sofrer dano, Curar-se, Alimentar-se, Dormir, Teste de Frenesi (sangue) e Surto de Sangue (sangue), nesta ordem, cada um com descrição e botão. A aba MUST NOT mostrar os painéis de Vitalidade e Força de Vontade; essas trilhas ficam na barra inferior fixa, onde continuam permitindo a marcação manual caixa a caixa. O botão do cartão Dormir MUST abrir o mesmo diálogo de dormir que antes era aberto pela barra inferior.

#### Scenario: Abrir alimentação pela aba
- **WHEN** o usuário clica "Registrar" no cartão Alimentar-se
- **THEN** o diálogo "Registrar alimentação" abre

#### Scenario: Abrir dano pela aba
- **WHEN** o usuário clica "Marcar dano" no cartão Sofrer dano
- **THEN** o diálogo "Sofrer dano" abre com "Vitalidade", "Dano recebido" 0 e "Superficial" escolhidos

#### Scenario: Abrir cura pela aba
- **WHEN** o usuário clica "Curar dano" no cartão Curar-se
- **THEN** o diálogo "Curar-se" abre com "Vitalidade", "Dano curado" 0 e "Superficial" escolhidos

#### Scenario: Dormir pela aba
- **WHEN** o usuário clica "Dormir" no cartão Dormir
- **THEN** o diálogo "Dormir até o anoitecer?" abre

#### Scenario: Sem painéis de trilha
- **WHEN** o usuário abre a aba Ações
- **THEN** a área de conteúdo da aba mostra o painel de Humanidade e não mostra painéis de Vitalidade nem de Força de Vontade

### Requirement: Alerta de Fome
Quando a Fome mudar e chegar a 5 ou a 0, o app SHALL exibir um alerta em tela cheia com kicker, título e texto adequados, fechado por "Entendido" ou clique fora.

#### Scenario: Fome chega a 5
- **WHEN** a Fome passa de 4 para 5 por qualquer ação
- **THEN** o alerta de Fome 5 aparece

#### Scenario: Sem mudança
- **WHEN** a Fome já era 5 e continua 5
- **THEN** nenhum alerta novo aparece

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

