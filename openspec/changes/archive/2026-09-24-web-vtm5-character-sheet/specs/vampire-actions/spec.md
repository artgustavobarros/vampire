## ADDED Requirements

### Requirement: Diálogo de regras
As ações de regra SHALL abrir um diálogo modal com rótulo superior (kicker), título, texto, nota opcional e uma lista de botões de ação, fechando pelo botão de cancelar/fechar. O resultado de cada ação MUST ser aplicado à ficha e salvo.

#### Scenario: Cancelar
- **WHEN** o usuário clica "Cancelar" em qualquer diálogo de regra
- **THEN** o diálogo fecha e a ficha não muda

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
O usuário SHALL registrar alimentação escolhendo a fonte: vários animais pequenos (−1), animal médio (−1), animal grande (−2), bolsa de sangue (−1), pessoa sem dor e rápido (−1), pessoa sem dor (−2), pessoa (escolher −1 a −4) e matar a pessoa (−5). A redução MUST respeitar a Potência de Sangue: animal rende metade na Potência 2 e nada na 3+; bolsa não sacia na 3+; pessoa sem matar não sacia na 4+. A Fome MUST nunca ficar abaixo de 0.

#### Scenario: Animal grande na Potência 2
- **WHEN** Potência é 2, Fome é 3 e o usuário escolhe "Animal grande"
- **THEN** a Fome cai para 2

#### Scenario: Fonte que não sacia
- **WHEN** Potência é 3 e o usuário escolhe "Bolsa de sangue — não sacia"
- **THEN** a Fome não muda e a nota explica "Sangue de bolsa não sacia na Potência 3."

#### Scenario: Escolher quanto bebeu
- **WHEN** o usuário escolhe "Pessoa" e depois "−3 de Fome" com Fome 2
- **THEN** a Fome passa a 0

#### Scenario: Já saciado
- **WHEN** a Fome é 0 ao abrir a alimentação
- **THEN** o título é "Fome 0" e o texto diz "Você está saciado. Nada a reduzir."

### Requirement: Teste de Frenesi
O usuário SHALL escolher a provocação (fome/sangue à vista dif. 2, provocação/fúria dif. 3, terror dif. 4), ver a reserva (Autocontrole + Determinação) e registrar se resistiu ou sucumbiu, sem alterar a ficha.

#### Scenario: Sucumbir
- **WHEN** o usuário escolhe "Provocação ou fúria" e depois "Sucumbi ao frenesi"
- **THEN** o resultado "Frenesi resolvido" explica as restrições do frenesi por uma cena

### Requirement: Surto de Sangue
A ação Surto de Sangue SHALL abrir o Rouse Check com a nota do bônus de surto da Potência atual.

#### Scenario: Surto na Potência 1
- **WHEN** o usuário aciona "Rouse + surto" com Potência 1
- **THEN** o Rouse Check abre com a nota "Surto de Sangue: +2 dados no teste."

### Requirement: Aba Ações
A aba Ações SHALL mostrar Vitalidade, Força de Vontade e Humanidade (com contagem de manchas) e os cartões de ação Alimentar-se, Teste de Frenesi (sangue) e Surto de Sangue (sangue), cada um com descrição e botão.

#### Scenario: Abrir alimentação pela aba
- **WHEN** o usuário clica "Registrar" no cartão Alimentar-se
- **THEN** o diálogo "De onde veio o sangue?" abre

### Requirement: Alerta de Fome
Quando a Fome mudar e chegar a 5 ou a 0, o app SHALL exibir um alerta em tela cheia com kicker, título e texto adequados, fechado por "Entendido" ou clique fora.

#### Scenario: Fome chega a 5
- **WHEN** a Fome passa de 4 para 5 por qualquer ação
- **THEN** o alerta de Fome 5 aparece

#### Scenario: Sem mudança
- **WHEN** a Fome já era 5 e continua 5
- **THEN** nenhum alerta novo aparece

### Requirement: Regras como funções puras
As regras (máximos de trilhas, marcação e transbordo de dano, cura ao dormir, cura agravada, rendimento da alimentação, Potência por geração, cotas de atributos e habilidades) SHALL ser implementadas como funções puras em TypeScript, sem dependência de React, cobertas por testes unitários.

#### Scenario: Transbordo de dano superficial
- **WHEN** uma trilha de 4 caixas está com 4 superficiais e recebe mais 1 superficial
- **THEN** a primeira caixa superficial vira agravada
