## MODIFIED Requirements

### Requirement: Passo 5 — Disciplinas
O passo SHALL mostrar um aviso com a regra conforme o clã e dois slots fixos ("Primeira Disciplina" e "Segunda Disciplina"). Cada slot MUST listar só as Disciplinas do clã escolhido; para Caitiff, todas as Disciplinas. Uma Disciplina gravada que não pertence ao clã MUST NOT ser reinserida na lista (o slot aparece sem escolha). A Disciplina escolhida num slot MUST NOT aparecer na lista do outro. Ao trocar de clã no passo 1, cada slot cuja Disciplina não pertence ao novo clã MUST ser esvaziado (nome, nível e poderes); slots com Disciplina do novo clã são mantidos. Cada slot MUST ter dois botões de alternância, "+2" e "+1" (rótulos acessíveis "<rótulo do slot> +2" e "<rótulo do slot> +1", com `aria-pressed`), no mesmo visual dos botões de especialidade do Predador: borda Moss e fundo `field` quando ativo, borda `ink/20` e fundo transparente quando inativo. Nenhum botão fica ativo enquanto o slot não tem nível. A distribuição MUST ser 2 e 1: escolher "+2" num slot põe 1 no outro, e escolher "+1" num slot põe 2 no outro. Clicar no botão já ativo MUST NOT alterar os níveis. Abaixo dos slots, uma linha de status MUST mostrar "Distribuição completa: 2 e 1." em Moss `#2F6B3C` quando as duas Disciplinas estão escolhidas e a distribuição é 2 e 1; senão, "Falta: " seguido do que falta ("escolher as duas Disciplinas", "marcar 2 pontos em uma e 1 na outra"). Para Sangue Fraco, o passo MUST mostrar só o aviso "Sangues-ralos não têm Disciplinas intrínsecas. Siga para o próximo passo.", sem slots nem linha de status, e ao salvar o passo as duas posições do assistente MUST ser gravadas vazias (Disciplinas extras da aba Disciplinas são preservadas). Sem clã escolhido, o aviso MUST pedir para escolher o clã no passo 1.

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
- **WHEN** o usuário escolhe "+2" no primeiro slot
- **THEN** o primeiro slot fica com 2 pontos, o segundo passa a ter 1 ponto e o botão "+1" do segundo slot fica ativo

#### Scenario: Escolher +1 inverte
- **WHEN** o primeiro slot tem 2 e o segundo 1, e o usuário escolhe "+1" no primeiro slot
- **THEN** o primeiro slot fica com 1 ponto e o segundo com 2

#### Scenario: Clicar no botão ativo não muda nada
- **WHEN** o primeiro slot tem 2 e o usuário clica de novo em "+2" do primeiro slot
- **THEN** o primeiro slot continua com 2 e o segundo com 1

#### Scenario: Slot sem nível
- **WHEN** os dois slots têm nível 0
- **THEN** nenhum botão "+2" ou "+1" está ativo

#### Scenario: Disciplina de outro clã não aparece
- **WHEN** o clã é "Brujah" e a ficha tem "Domínio" gravado no primeiro slot
- **THEN** o primeiro slot lista apenas Celeridade, Potência e Presença e aparece sem escolha

#### Scenario: Trocar de clã limpa slots inválidos
- **WHEN** o clã é "Brujah" com "Potência" (2, com poder) e "Celeridade" (1) e o usuário troca o clã para "Ventrue"
- **THEN** os dois slots ficam vazios, com nível 0 e sem poderes

#### Scenario: Trocar de clã mantém Disciplina compartilhada
- **WHEN** o clã é "Brujah" com "Presença" (2) e "Potência" (1) e o usuário troca o clã para "Toreador"
- **THEN** o slot de "Presença" é mantido com nível e poderes, e o slot de "Potência" fica vazio

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
- **WHEN** Domínio tem 2 pontos com poderes de nível 1 e 2, Presença tem 1 ponto, e o usuário escolhe "+2" em Presença
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
