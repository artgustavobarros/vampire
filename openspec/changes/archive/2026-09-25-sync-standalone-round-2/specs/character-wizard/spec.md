## MODIFIED Requirements

### Requirement: Passo 1 — Clã e geração
O passo SHALL listar os clãs em cartões selecionáveis (nome e disciplinas do clã), mostrar Perdição e Compulsão do clã escolhido, campos de nome do senhor e afins, e um seletor de Geração (16ª a 4ª) com a nota de Potência de Sangue derivada. Os títulos da Perdição e da Compulsão MUST ser gatilhos do painel lateral (ver `trait-info`).

#### Scenario: Escolher clã
- **WHEN** o usuário seleciona "Brujah"
- **THEN** o cartão fica invertido e aparecem "Temperamento Violento" (Perdição) e "Rebeldia" (Compulsão) com suas descrições

#### Scenario: Atributos iniciais em 2
- **WHEN** o usuário avança do passo 1 e todos os atributos ainda valem 1 ou menos
- **THEN** todos os nove atributos passam a valer 2

#### Scenario: Abrir a Perdição
- **WHEN** o clã "Brujah" está escolhido e o usuário clica em "Temperamento Violento"
- **THEN** o painel lateral abre com o kicker "Perdição · Brujah"

### Requirement: Passo 5 — Disciplinas
O passo SHALL mostrar um aviso com a regra conforme o clã e dois slots fixos ("Primeira Disciplina" e "Segunda Disciplina"). Cada slot MUST listar só as Disciplinas do clã escolhido; para Caitiff, todas as Disciplinas. A Disciplina escolhida num slot MUST NOT aparecer na lista do outro. Cada slot MUST ter um `DotRating` de 2 pontos, e a distribuição MUST ser 2 e 1: marcar 2 num slot põe 1 no outro, e marcar 1 num slot põe 2 no outro. Abaixo dos slots, uma linha de status MUST mostrar "Distribuição completa: 2 e 1." em Moss `#2F6B3C` quando as duas Disciplinas estão escolhidas e a distribuição é 2 e 1; senão, "Falta: " seguido do que falta ("escolher as duas Disciplinas", "marcar 2 pontos em uma e 1 na outra"). Para cada slot com Disciplina do catálogo, o passo MUST permitir marcar poderes até o nível do slot, mostrando nome, nível e custo. Para Sangue Fraco, o passo MUST mostrar só o aviso "Sangues-ralos não têm Disciplinas intrínsecas. Siga para o próximo passo.", sem slots nem linha de status, e ao salvar o passo as duas posições do assistente MUST ser gravadas vazias (Disciplinas extras da aba Disciplinas são preservadas). Sem clã escolhido, o aviso MUST pedir para escolher o clã no passo 1. O passo MUST exibir a Potência de Sangue derivada da geração como 10 pontos somente leitura.

#### Scenario: Catálogo limitado pelo nível
- **WHEN** Domínio está com nível 1
- **THEN** somente poderes de nível 1 de Domínio podem ser marcados

#### Scenario: Só Disciplinas do clã
- **WHEN** o clã é "Brujah"
- **THEN** cada slot lista apenas Celeridade, Potência e Presença, e o aviso diz "Escolha duas Disciplinas do clã Brujah (Celeridade, Potência, Presença). Dois pontos em uma, um ponto na outra."

#### Scenario: Caitiff escolhe qualquer uma
- **WHEN** o clã é "Caitiff"
- **THEN** cada slot lista todas as Disciplinas e o aviso diz "Caitiff: escolha duas Disciplinas quaisquer. Dois pontos em uma, um ponto na outra."

#### Scenario: Escolha some do outro slot
- **WHEN** o clã é "Brujah" e o primeiro slot tem "Potência"
- **THEN** o segundo slot lista apenas Celeridade e Presença

#### Scenario: Distribuição 2 e 1 automática
- **WHEN** o usuário marca 2 pontos no primeiro slot
- **THEN** o segundo slot passa a ter 1 ponto

#### Scenario: Status completo
- **WHEN** os dois slots têm Disciplina e níveis 2 e 1
- **THEN** a linha de status mostra "Distribuição completa: 2 e 1." em Moss

#### Scenario: Sangue-ralo sem Disciplinas
- **WHEN** o clã é "Sangue Fraco"
- **THEN** o passo mostra só o aviso de que sangues-ralos não têm Disciplinas intrínsecas, sem slots

### Requirement: Passo 6 — Predador
O passo SHALL listar os 12 tipos de predador em cartões e, para o escolhido, oferecer a escolha de uma especialidade entre duas, um ponto de disciplina entre duas, e listar os ajustes obrigatórios. Para Sangue Fraco, o passo MUST esconder os cartões e mostrar só o aviso "Sangues-ralos não têm Tipo de Predador. Siga para o próximo passo."; ao salvar o passo, `predador`, `predEspec` e `predDisc` MUST ser gravados vazios.

#### Scenario: Escolher Sereia
- **WHEN** o usuário escolhe "Sereia"
- **THEN** aparecem as especialidades "Persuasão (Seduzir)" e "Subterfúgio (Sedução)", as disciplinas "Fascinação" e "Presença" e os ajustes "−1 de Humanidade", "Vantagem Belíssimo ••" e "Defeito Inimigo • (amante preterido)"

#### Scenario: Sangue-ralo sem Predador
- **WHEN** o clã é "Sangue Fraco"
- **THEN** nenhum cartão de predador aparece, só o aviso, e "Continuar" avança

#### Scenario: Predador antigo apagado
- **WHEN** a ficha tinha "Sereia" gravado, o clã passou a ser "Sangue Fraco" e o usuário avança do passo 6
- **THEN** a ficha é gravada com `predador`, `predEspec` e `predDisc` vazios

### Requirement: Passo 7 — Vantagens e defeitos
O passo SHALL permitir adicionar linhas de mérito ou defeito (tipo alternável por um selo), com nome, pontos de 1 a 5, botão **?** e remoção, e um estado vazio quando não houver linhas. No topo, o passo MUST mostrar "X/7 pts em vantagens" e "Y/2 pts em defeitos", o texto da regra ("Distribua 7 pontos em Vantagens e adquira 2 pontos de Defeitos além daqueles obtidos do seu Tipo de Predador.") e uma linha de status: "Falta: " com os itens pendentes separados por " · " (ex.: "distribuir 3 pts em vantagens", "remover 1 pts de defeitos"), ou "Distribuição completa." em Moss `#2F6B3C`. Os defeitos do Predador MUST NOT entrar na soma. Para Sangue Fraco:
- o selo MUST ciclar Vantagem → Defeito → Qualidade SR → Defeito SR (Qualidade SR em Moss, Defeito SR em Blood);
- o topo MUST mostrar também "N qualidades · N defeitos de sangue-ralo" (conta linhas, não pontos);
- a regra MUST acrescentar "Sangues-ralos devem adquirir entre uma e três Qualidades de Sangue-Ralo e a mesma quantidade de Defeitos de Sangue-Ralo.";
- o status MUST cobrar de 1 a 3 Qualidades SR e o mesmo número de Defeitos SR.

Qualidades e Defeitos SR MUST NOT entrar nas somas de 7 e 2. Para outros clãs, uma linha gravada como Qualidade SR MUST ser exibida e contada como Vantagem, e Defeito SR como Defeito, e o selo cicla só Vantagem ↔ Defeito.

#### Scenario: Totais
- **WHEN** existem uma vantagem de 3 pontos e um defeito de 2
- **THEN** o topo mostra "3/7 pts em vantagens" e "2/2 pts em defeitos" e o status diz "Falta: distribuir 4 pts em vantagens."

#### Scenario: Distribuição completa
- **WHEN** as vantagens somam 7 e os defeitos somam 2, num clã que não é Sangue Fraco
- **THEN** o status mostra "Distribuição completa." em Moss

#### Scenario: Lista vazia
- **WHEN** não há nenhuma linha
- **THEN** aparece "Nenhum mérito ou defeito" com a explicação e o botão "Adicionar"

#### Scenario: Ciclo de tipo do sangue-ralo
- **WHEN** o clã é "Sangue Fraco" e o usuário clica três vezes no selo de uma linha "Vantagem"
- **THEN** o selo mostra "Defeito SR"

#### Scenario: Tipos SR fora do Sangue Fraco
- **WHEN** a ficha tem uma "Qualidade SR" de 2 pontos e o clã é "Brujah"
- **THEN** a linha aparece como "Vantagem" e conta 2 pts em vantagens

### Requirement: Validação por passo
"Continuar" e "Concluir" SHALL validar só os campos do passo atual contra o schema zod daquele passo. Se o passo for inválido, o assistente MUST continuar no passo, disparar um toast de erro com rótulo "Passo incompleto" contendo as mensagens de erro do passo e levar o foco ao primeiro campo com erro. As mensagens MUST ser únicas (sem repetir a mesma frase); com mais de 3, o toast MUST mostrar as 3 primeiras e "e mais N.". Os passos 5, 6 e 7 MUST ler o clã como contexto, sem gravá-lo. As regras são:
- Passo 1: clã e geração obrigatórios.
- Passo 2: todos os nove atributos entre 1 e 4, com exatamente um em 4, três em 3, um em 1 e o resto em 2.
- Passo 3: distribuição escolhida, com todos os níveis completos e nenhuma habilidade num nível fora da distribuição. A mensagem MUST dizer, por nível, quantas faltam ou sobram (ex.: "Nível 3: falta 1.") e listar as habilidades fora do formato com o nível (ex.: "Fora do formato: Briga (4).").
- Passo 4: especialidade preenchida para cada habilidade obrigatória com pontos; sem nenhuma, uma habilidade com pontos e uma especialidade livre.
- Passo 5: para Sangue Fraco, sempre válido. Para os demais: duas disciplinas diferentes, ambas do clã (qualquer uma para Caitiff), com níveis 2 e 1, e nenhum poder marcado acima do nível da disciplina.
- Passo 6: para Sangue Fraco, sempre válido. Para os demais: tipo de predador, especialidade do predador e disciplina do predador escolhidos.
- Passo 7: cada linha com nome preenchido e pontos de 1 a 5; vantagens somando exatamente 7 e defeitos exatamente 2 (sem contar tipos SR); para Sangue Fraco, também de 1 a 3 Qualidades SR e o mesmo número de Defeitos SR. A mensagem MUST ser a mesma da linha de status.
- Passo 8: nome do personagem obrigatório.

#### Scenario: Clã não escolhido
- **WHEN** o usuário clica "Continuar" no passo 1 sem escolher clã nem geração
- **THEN** o passo 1 continua visível e aparece um toast "Passo incompleto" com "Escolha um clã" e "Escolha a geração"

#### Scenario: Cota de atributos excedida
- **WHEN** dois atributos estão em 4 e o usuário clica "Continuar" no passo 2
- **THEN** o passo 2 continua visível e aparece um toast dizendo que alguma cota foi excedida

#### Scenario: Distribuição de habilidades incompleta
- **WHEN** a distribuição "Equilibrado" está escolhida com apenas 2 habilidades em 3 e o usuário clica "Continuar"
- **THEN** o passo 3 continua visível e o toast diz "Nível 3: falta 1."

#### Scenario: Habilidade fora do formato bloqueia com motivo
- **WHEN** a distribuição "Equilibrado" está completa, "Briga" está em 4 e o usuário clica "Continuar"
- **THEN** o passo 3 continua visível e o toast diz "Fora do formato: Briga (4)."

#### Scenario: Especialidade obrigatória vazia
- **WHEN** o personagem tem Ofícios 2, o campo de Ofícios está vazio e o usuário clica "Continuar" no passo 4
- **THEN** o campo "Ofícios" fica com `aria-invalid="true"` e o toast mostra "Informe uma especialidade"

#### Scenario: Disciplinas repetidas
- **WHEN** as duas disciplinas gravadas são "Potência" e o usuário clica "Continuar" no passo 5
- **THEN** o passo 5 continua visível e o toast mostra "Escolha duas disciplinas diferentes"

#### Scenario: Disciplina de fora do clã
- **WHEN** o clã é "Brujah", a ficha tem "Domínio" gravado num slot e o usuário clica "Continuar" no passo 5
- **THEN** o passo 5 continua visível e o toast mostra "Escolha Disciplinas do clã"

#### Scenario: Distribuição diferente de 2 e 1
- **WHEN** as duas disciplinas estão com nível 1 e o usuário clica "Continuar" no passo 5
- **THEN** o passo 5 continua visível e o toast mostra "Marque 2 pontos em uma Disciplina e 1 na outra"

#### Scenario: Sangue-ralo avança sem Disciplinas
- **WHEN** o clã é "Sangue Fraco", os slots estão vazios e o usuário clica "Continuar" no passo 5
- **THEN** o assistente avança para o passo 6

#### Scenario: Predador incompleto
- **WHEN** "Sereia" está escolhido sem disciplina do predador e o usuário clica "Continuar"
- **THEN** o passo 6 continua visível, o grupo de disciplina fica marcado como inválido e o toast mostra "Escolha uma disciplina"

#### Scenario: Mérito sem nome
- **WHEN** existe uma linha de vantagem sem nome e o usuário clica "Continuar" no passo 7
- **THEN** o campo nome dessa linha fica com `aria-invalid="true"` e o toast mostra "Informe o nome"

#### Scenario: Cota de méritos incompleta
- **WHEN** as vantagens somam 5, os defeitos somam 2 e o usuário clica "Continuar" no passo 7
- **THEN** o passo 7 continua visível e o toast mostra "Falta: distribuir 2 pts em vantagens."

#### Scenario: Sangue-ralo sem Qualidade
- **WHEN** o clã é "Sangue Fraco", vantagens somam 7, defeitos somam 2, não há Qualidade SR e o usuário clica "Continuar"
- **THEN** o passo 7 continua visível e o toast menciona "ter de 1 a 3 Qualidades de Sangue-Ralo"

#### Scenario: Concluir sem nome
- **WHEN** o nome do personagem está vazio e o usuário clica "Concluir"
- **THEN** o passo 8 continua visível, a ficha continua com `criada: false` e o toast mostra "Informe o nome do personagem"

#### Scenario: Erro some ao corrigir
- **WHEN** o grupo "Clã" está marcado como inválido e o usuário seleciona "Toreador"
- **THEN** a marcação de inválido some

#### Scenario: Clique repetido não empilha toasts
- **WHEN** o usuário clica "Continuar" duas vezes seguidas no passo 1 sem escolher nada
- **THEN** só um toast "Passo incompleto" fica visível

## ADDED Requirements

### Requirement: Dicas dos passos 6 e 7
A dica do passo 6 SHALL ser "Como você caça define perícias e Disciplinas extras. Sangues-ralos não têm." e a do passo 7 SHALL ser "Sete pontos em vantagens, dois em defeitos além dos do Predador.".

#### Scenario: Dica do passo 7
- **WHEN** o assistente está no passo 7
- **THEN** a dica mostra "Sete pontos em vantagens, dois em defeitos além dos do Predador."
