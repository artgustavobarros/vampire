## MODIFIED Requirements

### Requirement: Passo 1 — Clã e geração
O passo SHALL listar os clãs em cartões selecionáveis (nome e disciplinas do clã), mostrar Perdição e Compulsão do clã escolhido, o campo do nome do senhor e um seletor de Geração com 13 opções (16ª a 4ª), sem campo livre de Geração nem de Potência de Sangue. A Potência de Sangue inicial MUST ser derivada da Geração pela tabela do livro: 16ª–14ª 0, 13ª–10ª 1, 9ª–8ª 2, 7ª–6ª 3, 5ª 4, 4ª 5. Abaixo do seletor, o passo MUST mostrar a nota de Potência ("Geração 9ª — Potência de Sangue 2.", ou "Escolha a Geração para definir a Potência de Sangue." sem Geração) e, numa segunda linha, a Geração do senhor: "Seu senhor é da <N-1>ª Geração (você é sempre uma Geração acima do senhor)." ou, sem Geração, "Você é sempre uma Geração acima do seu senhor.". O rótulo "Geração" MUST abrir o painel da Geração (ver `trait-info`). Os títulos da Perdição e da Compulsão MUST ser gatilhos do painel lateral (ver `trait-info`).

#### Scenario: Escolher clã
- **WHEN** o usuário seleciona "Brujah"
- **THEN** o cartão fica invertido e aparecem "Temperamento Violento" (Perdição) e "Rebeldia" (Compulsão) com suas descrições

#### Scenario: Atributos iniciais em 2
- **WHEN** o usuário avança do passo 1 e todos os atributos ainda valem 1 ou menos
- **THEN** todos os nove atributos passam a valer 2

#### Scenario: Abrir a Perdição
- **WHEN** o clã "Brujah" está escolhido e o usuário clica em "Temperamento Violento"
- **THEN** o painel lateral abre com o kicker "Perdição · Brujah"

#### Scenario: Potência pela Geração
- **WHEN** o usuário escolhe a Geração "9ª"
- **THEN** a nota mostra "Geração 9ª — Potência de Sangue 2." e, ao salvar o passo, a ficha grava `potencia: 2`

#### Scenario: Potência das Gerações extremas
- **WHEN** o usuário escolhe "4ª" e depois "14ª"
- **THEN** a nota mostra Potência de Sangue 5 e depois 0

#### Scenario: Geração do senhor
- **WHEN** a Geração escolhida é "9ª"
- **THEN** abaixo da nota de Potência aparece "Seu senhor é da 8ª Geração (você é sempre uma Geração acima do senhor)."

#### Scenario: Sem Geração
- **WHEN** nenhuma Geração está escolhida
- **THEN** as linhas mostram "Escolha a Geração para definir a Potência de Sangue." e "Você é sempre uma Geração acima do seu senhor."

### Requirement: Passo 5 — Disciplinas
O passo SHALL mostrar um aviso com a regra conforme o clã e dois slots fixos ("Primeira Disciplina" e "Segunda Disciplina"). Cada slot MUST listar só as Disciplinas do clã escolhido; para Caitiff, todas as Disciplinas. A Disciplina escolhida num slot MUST NOT aparecer na lista do outro. Cada slot MUST ter um `DotRating` de 2 pontos, e a distribuição MUST ser 2 e 1: marcar 2 num slot põe 1 no outro, e marcar 1 num slot põe 2 no outro. Abaixo dos slots, uma linha de status MUST mostrar "Distribuição completa: 2 e 1." em Moss `#2F6B3C` quando as duas Disciplinas estão escolhidas e a distribuição é 2 e 1; senão, "Falta: " seguido do que falta ("escolher as duas Disciplinas", "marcar 2 pontos em uma e 1 na outra"). Para Sangue Fraco, o passo MUST mostrar só o aviso "Sangues-ralos não têm Disciplinas intrínsecas. Siga para o próximo passo.", sem slots nem linha de status, e ao salvar o passo as duas posições do assistente MUST ser gravadas vazias (Disciplinas extras da aba Disciplinas são preservadas). Sem clã escolhido, o aviso MUST pedir para escolher o clã no passo 1.

Poderes: para cada slot com Disciplina do catálogo, o passo MUST listar em cartões os poderes até o nível do slot (nível 1 quando o slot não tem pontos), com nome, nível e custo. Cada ponto dá direito a um poder: um slot MUST aceitar no máximo tantos poderes quanto seus pontos. Tocar no cartão inclui ou remove o poder. Incluir sem pontos no slot MUST mostrar o toast info de título "Sem pontos" com "Marque os pontos da Disciplina antes de escolher poderes.", e incluir além do limite MUST mostrar o toast info de título "Limite de poderes" com "<Disciplina> tem 1 ponto: só 1 poder. Tire um para trocar." ou "<Disciplina> tem 2 pontos: só 2 poderes. Tire um para trocar."; em ambos os casos nada é incluído. Remover um poder MUST ser sempre permitido. Quando a distribuição muda, cada slot MUST perder os poderes acima do novo nível e, depois, os que passam do novo limite, mantendo os primeiros na ordem por nível. Acima dos cartões, a dica MUST ser "Escolha N poder(es) (um por ponto) · X/N escolhidos. Toque no nome para ver a descrição." ("poder" quando N é 1) ou, sem pontos, "Marque os pontos primeiro: cada ponto dá direito a um poder. Toque no nome para ver a descrição.". O nome do poder no cartão MUST abrir o painel lateral do poder sem incluir nem remover o poder.

O passo MUST NOT exibir a Potência de Sangue nem a Geração: o passo termina na linha de status da distribuição (ou no aviso, para Sangue Fraco).

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

#### Scenario: Limite de poderes
- **WHEN** Presença tem 1 ponto e um poder marcado, e o usuário toca em outro poder de Presença
- **THEN** o poder não é incluído e aparece o toast "Limite de poderes" com "Presença tem 1 ponto: só 1 poder. Tire um para trocar."

#### Scenario: Poder sem pontos
- **WHEN** o slot tem "Domínio" sem pontos e o usuário toca num poder
- **THEN** o poder não é incluído e aparece o toast "Sem pontos"

#### Scenario: Remover dentro do limite
- **WHEN** Domínio tem 2 pontos e 2 poderes marcados, e o usuário toca num deles
- **THEN** o poder é removido e a dica mostra "1/2 escolhidos"

#### Scenario: Inverter a distribuição corta poderes
- **WHEN** Domínio tem 2 pontos com poderes de nível 1 e 2, Presença tem 1 ponto, e o usuário marca 2 pontos em Presença
- **THEN** Domínio fica com 1 ponto e só o poder de nível 1

#### Scenario: Dica com contador
- **WHEN** Domínio tem 2 pontos e 1 poder marcado
- **THEN** a dica diz "Escolha 2 poderes (um por ponto) · 1/2 escolhidos. Toque no nome para ver a descrição."

#### Scenario: Nome do poder abre o painel
- **WHEN** o usuário toca no nome "Compelir" num cartão não selecionado
- **THEN** o painel do poder Compelir abre e o poder continua não selecionado


#### Scenario: Excesso de poderes bloqueia o passo
- **WHEN** a ficha tem Presença com 1 ponto e 2 poderes gravados e o usuário clica "Continuar" no passo 5
- **THEN** o passo 5 continua visível e o toast mostra "Escolha no máximo 1 poder em Presença"

#### Scenario: Sem bloco de Potência
- **WHEN** o assistente está no passo 5 com a Geração "12ª"
- **THEN** não há pontos de Potência de Sangue, nem rótulo "Geração 12ª", nem gatilho de Potência de Sangue no passo

### Requirement: Passo 8 — Detalhes finais
O passo SHALL exibir os campos restantes de identificação (nome, conceito, crônica, ambição, desejo) antes de concluir. Os campos de clã, senhor, Geração e Predador MUST NOT aparecer no passo, porque são definidos nos passos 1 e 6.

#### Scenario: Preencher nome
- **WHEN** o usuário digita o nome do personagem no passo 8
- **THEN** o nome aparece no cabeçalho da ficha após concluir

#### Scenario: Sem Geração nos detalhes
- **WHEN** o assistente está no passo 8
- **THEN** não há campo "Geração" nem "Senhor"

## ADDED Requirements

### Requirement: Dica do passo 5
A dica do passo 5 SHALL ser "Duas Disciplinas do clã: dois pontos em uma, um na outra.".

#### Scenario: Dica do passo 5
- **WHEN** o assistente está no passo 5
- **THEN** a dica mostra "Duas Disciplinas do clã: dois pontos em uma, um na outra."
