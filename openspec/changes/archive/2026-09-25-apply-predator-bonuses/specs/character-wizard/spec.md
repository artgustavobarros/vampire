## MODIFIED Requirements

### Requirement: Passo 6 — Predador
O passo SHALL listar os 12 tipos de predador em cartões e, para o escolhido, oferecer a escolha de uma especialidade entre duas, um ponto de disciplina entre duas, e listar os ajustes obrigatórios. Os ajustes MUST vir da lista estruturada do Predador em `data/predators.ts`, cada um com tipo (`humanidade`, `potencia`, `merito`, `escolha` ou `nota`), valores e rótulo; o passo MUST exibir o rótulo e colorir o filete pelo tipo: ganho (Humanidade ou Potência positivas, `merito`/`escolha` de vantagem) em Moss, custo (Humanidade negativa, `merito`/`escolha` de defeito, `nota`) em Blood. Cada ajuste do tipo `escolha` MUST mostrar, abaixo do rótulo, um seletor: no modo `uma`, um botão por opção, com uma só selecionada; no modo `dividir`, um `DotRating` por opção com o total de pontos do ajuste como máximo e a soma entre as opções limitada a esse total. As escolhas MUST ser gravadas em `predEscolhas` (id do ajuste → pontos por opção). Trocar de Predador MUST limpar `predEspec`, `predDisc` e `predEscolhas`. Para Sangue Fraco, o passo MUST esconder os cartões e mostrar só o aviso "Sangues-ralos não têm Tipo de Predador. Siga para o próximo passo."; ao salvar o passo, `predador`, `predEspec`, `predDisc` e `predEscolhas` MUST ser gravados vazios.

#### Scenario: Escolher Sereia
- **WHEN** o usuário escolhe "Sereia"
- **THEN** aparecem as especialidades "Persuasão (Seduzir)" e "Subterfúgio (Sedução)", as disciplinas "Fascinação" e "Presença" e os ajustes "−1 de Humanidade", "Vantagem Belíssimo ••" e "Defeito Inimigo • (amante preterido)", sem seletores de escolha

#### Scenario: Escolha de uma opção
- **WHEN** o usuário escolhe "Sanguessuga"
- **THEN** o ajuste "Defeito Segredo Obscuro •• (diabolista) ou Evitado ••" mostra os botões "Segredo Obscuro (diabolista)" e "Evitado", e clicar em "Evitado" deixa só ele selecionado

#### Scenario: Dividir pontos
- **WHEN** o usuário escolhe "Osíris" e marca 2 pontos em Rebanho no ajuste "3 pontos entre Rebanho e Fama"
- **THEN** Fama aceita no máximo 1 ponto

#### Scenario: Trocar de Predador limpa escolhas
- **WHEN** "Sanguessuga" tinha "Evitado" escolhido e o usuário troca para "Osíris"
- **THEN** `predEscolhas` fica vazio e nenhum seletor do Osíris vem marcado

#### Scenario: Sangue-ralo sem Predador
- **WHEN** o clã é "Sangue Fraco"
- **THEN** nenhum cartão de predador aparece, só o aviso, e "Continuar" avança

#### Scenario: Predador antigo apagado
- **WHEN** a ficha tinha "Sereia" gravado, o clã passou a ser "Sangue Fraco" e o usuário avança do passo 6
- **THEN** a ficha é gravada com `predador`, `predEspec`, `predDisc` e `predEscolhas` vazios

### Requirement: Validação por passo
"Continuar" e "Concluir" SHALL validar só os campos do passo atual contra o schema zod daquele passo. Se o passo for inválido, o assistente MUST continuar no passo, disparar um toast de erro com rótulo "Passo incompleto" contendo as mensagens de erro do passo e levar o foco ao primeiro campo com erro. As mensagens MUST ser únicas (sem repetir a mesma frase); com mais de 3, o toast MUST mostrar as 3 primeiras e "e mais N.". Os passos 5, 6 e 7 MUST ler o clã como contexto, sem gravá-lo. As regras são:
- Passo 1: clã e geração obrigatórios.
- Passo 2: todos os nove atributos entre 1 e 4, com exatamente um em 4, três em 3, um em 1 e o resto em 2.
- Passo 3: distribuição escolhida, com todos os níveis completos e nenhuma habilidade num nível fora da distribuição. A mensagem MUST dizer, por nível, quantas faltam ou sobram (ex.: "Nível 3: falta 1.") e listar as habilidades fora do formato com o nível (ex.: "Fora do formato: Briga (4).").
- Passo 4: especialidade preenchida para cada habilidade obrigatória com pontos; sem nenhuma, uma habilidade com pontos e uma especialidade livre.
- Passo 5: para Sangue Fraco, sempre válido. Para os demais: duas disciplinas diferentes, ambas do clã (qualquer uma para Caitiff), com níveis 2 e 1, e nenhum poder marcado acima do nível da disciplina.
- Passo 6: para Sangue Fraco, sempre válido. Para os demais: tipo de predador, especialidade do predador e disciplina do predador escolhidos, e todas as escolhas de ajuste do Predador completas: no modo `uma`, uma opção escolhida ("Escolha uma opção: <rótulo>"); no modo `dividir`, os pontos das opções somando exatamente o total ("Distribua N pontos entre <opções separadas por " e ">").
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

#### Scenario: Escolha do Predador incompleta
- **WHEN** "Osíris" está escolhido com especialidade e disciplina, Rebanho tem 1 ponto e Fama 1 no ajuste "3 pontos entre Rebanho e Fama", e o usuário clica "Continuar"
- **THEN** o passo 6 continua visível, o seletor desse ajuste fica marcado como inválido e o toast mostra "Distribua 3 pontos entre Rebanho e Fama"

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

### Requirement: Predador aplicado ao concluir
Ao clicar "Concluir" no passo 8, o assistente SHALL aplicar o Predador escolhido por cima dos valores finais da ficha montada pelos 8 passos, na mesma gravação que marca a ficha como criada:
- **Disciplina**: a Disciplina de `predDisc` MUST ganhar 1 ponto se já existir na ficha (em qualquer posição), até o limite de 5; se não existir, MUST ser acrescentada à ficha com nível 1 e sem poderes.
- **Humanidade**: a soma dos ajustes `humanidade` MUST ser somada à Humanidade da ficha, limitada entre 0 e 10.
- **Potência de Sangue**: a soma dos ajustes `potencia` MUST ser somada à Potência derivada da Geração, limitada a 10.
- **Vantagens e Defeitos**: cada ajuste `merito` MUST virar uma linha em `meritos` com o tipo e os pontos do ajuste e o nome "<nome> (<detalhe>)" (ou só "<nome>" sem detalhe); cada ajuste `escolha` MUST virar uma linha por opção com pontos em `predEscolhas`, com o tipo do ajuste e os pontos escolhidos. Essas linhas MUST ser marcadas com `origem: "predador"` e MUST NOT entrar nas somas de 7 vantagens e 2 defeitos.
- Ajustes `nota` MUST NOT alterar a ficha.

O que foi aplicado à Disciplina, à Humanidade e à Potência MUST ficar registrado na ficha (`predBonus`: Disciplina, se ela foi acrescentada, e os deltas efetivamente aplicados de Humanidade e Potência). Uma ficha que já tem `predBonus` ou linhas de mérito com `origem: "predador"` MUST NOT receber o Predador de novo. Sangue Fraco, ou ficha sem Predador, MUST NOT receber nada nem `predBonus`.

#### Scenario: Ponto em Disciplina do clã
- **WHEN** o passo 5 tem Potência 2 e Celeridade 1, o Predador é "Gato de Rua" com Disciplina "Potência", e o usuário conclui
- **THEN** a ficha fica com Potência 3 e Celeridade 1

#### Scenario: Disciplina nova
- **WHEN** o passo 5 tem Domínio 2 e Presença 1, o Predador é "Sereia" com Disciplina "Fascinação", e o usuário conclui
- **THEN** a ficha fica com Domínio 2, Presença 1 e Fascinação 1 sem poderes

#### Scenario: Humanidade reduzida
- **WHEN** a ficha tem Humanidade 7, o Predador é "Sereia" e o usuário conclui
- **THEN** a ficha fica com Humanidade 6

#### Scenario: Humanidade aumentada
- **WHEN** a ficha tem Humanidade 7, o Predador é "Fazendeiro" e o usuário conclui
- **THEN** a ficha fica com Humanidade 8

#### Scenario: Potência de Sangue do Sanguessuga
- **WHEN** a ficha é de 12ª Geração (Potência 1), o Predador é "Sanguessuga" e o usuário conclui
- **THEN** a Potência de Sangue da ficha passa a ser 2 e a Humanidade cai 1

#### Scenario: Méritos fixos do Predador
- **WHEN** o passo 7 tem 7 pontos de vantagens e 2 de defeitos, o Predador é "Sereia" e o usuário conclui
- **THEN** `meritos` mantém as linhas do passo 7 e ganha "Belíssimo" (vantagem, 2) e "Inimigo (amante preterido)" (defeito, 1), ambas com `origem: "predador"`

#### Scenario: Méritos escolhidos do Predador
- **WHEN** o Predador é "Osíris" com Rebanho 2 e Fama 1, Inimigos 2 e Perseguido 0, e o usuário conclui
- **THEN** `meritos` ganha "Rebanho" (vantagem, 2), "Fama" (vantagem, 1) e "Inimigos" (defeito, 2) com `origem: "predador"`, e nenhuma linha "Perseguido"

#### Scenario: Sangue-ralo sem Predador aplicado
- **WHEN** o clã é "Sangue Fraco" e o usuário conclui
- **THEN** Disciplinas, Humanidade, Potência de Sangue e `meritos` ficam como os passos deixaram e a ficha não tem `predBonus`

### Requirement: Refazer sem o Predador aplicado
No modo refazer, o assistente SHALL trabalhar sobre os valores da ficha sem o Predador aplicado: os valores iniciais do formulário e a verificação do primeiro passo incompleto MUST desconsiderar o ponto da Disciplina, a Disciplina acrescentada, o ajuste de Humanidade registrado em `predBonus` e as linhas de `meritos` com `origem: "predador"`. A primeira gravação de um passo MUST remover da ficha o Predador aplicado e apagar `predBonus`. Ao concluir, o Predador MUST ser aplicado de novo conforme "Predador aplicado ao concluir", com o Predador e as escolhas desse momento. Ao clicar "Voltar" no passo 1 do modo refazer, a ficha MUST voltar a ter o Predador aplicado antes de exibir a ficha.

#### Scenario: Passo 5 mostra os pontos originais
- **WHEN** a ficha concluída tem Potência 3 porque o "Gato de Rua" deu 1 ponto a uma Potência 2, e o usuário abre o refazer no passo 5
- **THEN** o slot de Potência mostra 2 pontos e o passo é válido

#### Scenario: Passo 7 sem as linhas do Predador
- **WHEN** a ficha concluída com "Sereia" tem 7 pontos de vantagens do passo 7 mais "Belíssimo" do Predador, e o usuário abre o refazer no passo 7
- **THEN** o passo lista só as linhas do passo 7 e mostra "7/7 pts em vantagens"

#### Scenario: Concluir o refazer não duplica
- **WHEN** a ficha concluída com "Sereia" tem Humanidade 6 e o usuário refaz sem trocar o Predador e conclui
- **THEN** a ficha continua com Humanidade 6, um só ponto de Fascinação e uma só linha "Belíssimo"

#### Scenario: Trocar de Predador no refazer
- **WHEN** a ficha concluída com "Sereia" (Fascinação 1 acrescentada, Humanidade 6) é refeita com "Consensualista" e Disciplina "Fortitude", e o usuário conclui
- **THEN** a ficha não tem mais Fascinação nem "Belíssimo", ganha Fortitude conforme a regra de Disciplina, a linha "Segredo Obscuro (violação da Máscara)" e fica com Humanidade 8

#### Scenario: Sair do refazer pelo passo 1
- **WHEN** o usuário abre o refazer de uma ficha com "Sereia", avança até o passo 2, volta ao passo 1 e clica "Voltar"
- **THEN** a aba Ficha mostra a Humanidade, a Fascinação e as linhas de mérito com o Predador aplicado
