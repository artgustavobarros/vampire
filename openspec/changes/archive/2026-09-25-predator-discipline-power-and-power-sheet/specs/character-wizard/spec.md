## MODIFIED Requirements

### Requirement: Passo 6 — Predador
O passo SHALL listar os 12 tipos de predador em cartões e, para o escolhido, oferecer a escolha de uma especialidade entre duas, um ponto de disciplina entre duas com a escolha de um poder, e listar os ajustes obrigatórios. Os ajustes MUST vir da lista estruturada do Predador em `data/predators.ts`, cada um com tipo (`humanidade`, `potencia`, `merito`, `escolha` ou `nota`), valores e rótulo; o passo MUST exibir o rótulo e colorir o filete pelo tipo: ganho (Humanidade ou Potência positivas, `merito`/`escolha` de vantagem) em Moss, custo (Humanidade negativa, `merito`/`escolha` de defeito, `nota`) em Blood. Cada ajuste do tipo `escolha` MUST mostrar, abaixo do rótulo, um seletor: no modo `uma`, um botão por opção, com uma só selecionada; no modo `dividir`, um `DotRating` por opção com o total de pontos do ajuste como máximo e a soma entre as opções limitada a esse total. As escolhas MUST ser gravadas em `predEscolhas` (id do ajuste → pontos por opção). Trocar de Predador MUST limpar `predEspec`, `predDisc`, `predPoder` e `predEscolhas`. Para Sangue Fraco, o passo MUST esconder os cartões e mostrar só o aviso "Sangues-ralos não têm Tipo de Predador. Siga para o próximo passo."; ao salvar o passo, `predador`, `predEspec`, `predDisc`, `predPoder` e `predEscolhas` MUST ser gravados vazios.

#### Scenario: Escolher Sereia
- **WHEN** o usuário escolhe "Sereia"
- **THEN** aparecem as especialidades "Persuasão (Seduzir)" e "Subterfúgio (Sedução)", os cartões de disciplina "Fascinação" e "Presença" e os ajustes "−1 de Humanidade", "Vantagem Belíssimo ••" e "Defeito Inimigo • (amante preterido)", sem seletores de escolha

#### Scenario: Escolha de uma opção
- **WHEN** o usuário escolhe "Sanguessuga"
- **THEN** o ajuste "Defeito Segredo Obscuro •• (diabolista) ou Evitado ••" mostra os botões "Segredo Obscuro (diabolista)" e "Evitado", e clicar em "Evitado" deixa só ele selecionado

#### Scenario: Dividir pontos
- **WHEN** o usuário escolhe "Osíris" e marca 2 pontos em Rebanho no ajuste "3 pontos entre Rebanho e Fama"
- **THEN** Fama aceita no máximo 1 ponto

#### Scenario: Trocar de Predador limpa escolhas
- **WHEN** "Sanguessuga" tinha "Evitado" escolhido e um poder do Predador escolhido, e o usuário troca para "Osíris"
- **THEN** `predEscolhas` fica vazio, `predPoder` fica vazio e nenhum seletor do Osíris vem marcado

#### Scenario: Sangue-ralo sem Predador
- **WHEN** o clã é "Sangue Fraco"
- **THEN** nenhum cartão de predador aparece, só o aviso, e "Continuar" avança

#### Scenario: Predador antigo apagado
- **WHEN** a ficha tinha "Sereia" gravado, o clã passou a ser "Sangue Fraco" e o usuário avança do passo 6
- **THEN** a ficha é gravada com `predador`, `predEspec`, `predDisc`, `predPoder` e `predEscolhas` vazios

### Requirement: Validação por passo
"Continuar" e "Concluir" SHALL validar só os campos do passo atual contra o schema zod daquele passo. Se o passo for inválido, o assistente MUST continuar no passo, disparar um toast de erro com rótulo "Passo incompleto" contendo as mensagens de erro do passo e levar o foco ao primeiro campo com erro. As mensagens MUST ser únicas (sem repetir a mesma frase); com mais de 3, o toast MUST mostrar as 3 primeiras e "e mais N.". Os passos 5, 6 e 7 MUST ler o clã como contexto, sem gravá-lo, e o passo 6 MUST ler também as Disciplinas do passo 5 como contexto, sem gravá-las. As regras são:
- Passo 1: clã e geração obrigatórios.
- Passo 2: todos os nove atributos entre 1 e 4, com exatamente um em 4, três em 3, um em 1 e o resto em 2.
- Passo 3: distribuição escolhida, com todos os níveis completos e nenhuma habilidade num nível fora da distribuição. A mensagem MUST dizer, por nível, quantas faltam ou sobram (ex.: "Nível 3: falta 1.") e listar as habilidades fora do formato com o nível (ex.: "Fora do formato: Briga (4).").
- Passo 4: especialidade preenchida para cada habilidade obrigatória com pontos; sem nenhuma, uma habilidade com pontos e uma especialidade livre.
- Passo 5: para Sangue Fraco, sempre válido. Para os demais: duas disciplinas diferentes, ambas do clã (qualquer uma para Caitiff), com níveis 2 e 1, e nenhum poder marcado acima do nível da disciplina.
- Passo 6: para Sangue Fraco, sempre válido. Para os demais: tipo de predador, especialidade do predador e disciplina do predador escolhidos; quando a Disciplina do Predador tem poderes elegíveis (ver "Poder do Predador"), `predPoder` MUST ser um deles ("Escolha um poder de <Disciplina>"); e todas as escolhas de ajuste do Predador completas: no modo `uma`, uma opção escolhida ("Escolha uma opção: <rótulo>"); no modo `dividir`, os pontos das opções somando exatamente o total ("Distribua N pontos entre <opções separadas por " e ">").
- Passo 7: cada linha com nome preenchido e pontos de 1 a 5; vantagens somando exatamente 7 e defeitos exatamente 2 (sem contar tipos SR); para Sangue Fraco, também de 1 a 3 Qualidades SR e o mesmo número de Defeitos SR. A mensagem MUST ser a mesma da linha de status.
- Passo 8: nome do personagem obrigatório.

#### Scenario: Clã não escolhido
- **WHEN** o usuário clica "Continuar" no passo 1 sem escolher clã nem geração
- **THEN** o passo 1 continua visível e aparece um toast "Passo incompleto" com "Escolha um clã" e "Escolha a geração"

#### Scenario: Poder do Predador obrigatório
- **WHEN** o Predador é "Extorsionário" com Disciplina "Potência", especialidade e ajustes completos, sem poder escolhido, e o usuário clica "Continuar"
- **THEN** o passo 6 continua visível e o toast "Passo incompleto" traz "Escolha um poder de Potência"

#### Scenario: Poder invalidado pelo passo 5
- **WHEN** o poder do Predador era um poder de Domínio de nível 3 e o usuário volta ao passo 5 e troca Domínio de 2 para 1 ponto
- **THEN** no passo 6 o poder deixa de aparecer como escolhido e "Continuar" pede "Escolha um poder de Domínio"

### Requirement: Predador aplicado ao concluir
Ao clicar "Concluir" no passo 8, o assistente SHALL aplicar o Predador escolhido por cima dos valores finais da ficha montada pelos 8 passos, na mesma gravação que marca a ficha como criada:
- **Disciplina**: a Disciplina de `predDisc` MUST ganhar 1 ponto se já existir na ficha (em qualquer posição), até o limite de 5; se não existir, MUST ser acrescentada à ficha com nível 1. Quando `predPoder` corresponde a um poder do catálogo dessa Disciplina, o poder MUST ser acrescentado aos poderes dela com nome, nível, custo, duração, descrição e Rouse do catálogo, mantendo a ordem por nível; sem `predPoder`, a Disciplina acrescentada fica sem poderes.
- **Humanidade**: a soma dos ajustes `humanidade` MUST ser somada à Humanidade da ficha, limitada entre 0 e 10.
- **Potência de Sangue**: a soma dos ajustes `potencia` MUST ser somada à Potência derivada da Geração, limitada a 10.
- **Vantagens e Defeitos**: cada ajuste `merito` MUST virar uma linha em `meritos` com o tipo e os pontos do ajuste e o nome "<nome> (<detalhe>)" (ou só "<nome>" sem detalhe); cada ajuste `escolha` MUST virar uma linha por opção com pontos em `predEscolhas`, com o tipo do ajuste e os pontos escolhidos. Essas linhas MUST ser marcadas com `origem: "predador"` e MUST NOT entrar nas somas de 7 vantagens e 2 defeitos.
- Ajustes `nota` MUST NOT alterar a ficha.

O que foi aplicado à Disciplina, à Humanidade e à Potência MUST ficar registrado na ficha (`predBonus`: Disciplina, se ela foi acrescentada, o nome do poder acrescentado, e os deltas efetivamente aplicados de Humanidade e Potência). Uma ficha que já tem `predBonus` ou linhas de mérito com `origem: "predador"` MUST NOT receber o Predador de novo. Sangue Fraco, ou ficha sem Predador, MUST NOT receber nada nem `predBonus`.

#### Scenario: Ponto em Disciplina do clã
- **WHEN** o passo 5 tem Potência 2 e Celeridade 1, o Predador é "Gato de Rua" com Disciplina "Potência" e poder "Força Prodigiosa", e o usuário conclui
- **THEN** a ficha fica com Potência 3 com o poder "Força Prodigiosa" somado aos do passo 5, e Celeridade 1

#### Scenario: Disciplina nova
- **WHEN** o passo 5 tem Domínio 2 e Presença 1, o Predador é "Sereia" com Disciplina "Fascinação", e o usuário conclui
- **THEN** a ficha fica com Domínio 2, Presença 1 e Fascinação 1 sem poderes

#### Scenario: Disciplina fora do clã com poder
- **WHEN** o clã é "Ventrue", o Predador é "Extorsionário" com Disciplina "Potência" e poder "Toque Letal", e o usuário conclui
- **THEN** a ficha ganha Potência 1 com o poder "Toque Letal" de nível 1

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
No modo refazer, o assistente SHALL trabalhar sobre os valores da ficha sem o Predador aplicado: os valores iniciais do formulário e a verificação do primeiro passo incompleto MUST desconsiderar o ponto da Disciplina, a Disciplina acrescentada, o poder acrescentado pelo Predador, o ajuste de Humanidade registrado em `predBonus` e as linhas de `meritos` com `origem: "predador"`. A primeira gravação de um passo MUST remover da ficha o Predador aplicado e apagar `predBonus`. Ao concluir, o Predador MUST ser aplicado de novo conforme "Predador aplicado ao concluir", com o Predador e as escolhas desse momento. Ao clicar "Voltar" no passo 1 do modo refazer, a ficha MUST voltar a ter o Predador aplicado antes de exibir a ficha.

#### Scenario: Passo 5 mostra os pontos originais
- **WHEN** a ficha concluída tem Potência 3 porque o "Gato de Rua" deu 1 ponto e o poder "Força Prodigiosa" a uma Potência 2, e o usuário abre o refazer no passo 5
- **THEN** o slot de Potência mostra 2 pontos, só os poderes do passo 5, e o passo é válido

#### Scenario: Passo 7 sem as linhas do Predador
- **WHEN** a ficha concluída com "Sereia" tem 7 pontos de vantagens do passo 7 mais "Belíssimo" do Predador, e o usuário abre o refazer no passo 7
- **THEN** o passo lista só as linhas do passo 7 e mostra "7/7 pts em vantagens"

#### Scenario: Concluir o refazer não duplica
- **WHEN** a ficha concluída com "Sereia" tem Humanidade 6 e o usuário refaz sem trocar o Predador e conclui
- **THEN** a ficha continua com Humanidade 6, um só ponto de Fascinação e uma só linha "Belíssimo"

#### Scenario: Concluir o refazer não duplica o poder
- **WHEN** a ficha concluída com "Gato de Rua" tem Potência 3 com "Força Prodigiosa" do Predador e o usuário refaz sem trocar nada e conclui
- **THEN** a ficha continua com Potência 3 e uma só "Força Prodigiosa"

#### Scenario: Trocar de Predador no refazer
- **WHEN** a ficha concluída com "Sereia" (Fascinação 1 acrescentada, Humanidade 6) é refeita com "Consensualista" e Disciplina "Fortitude", e o usuário conclui
- **THEN** a ficha não tem mais Fascinação nem "Belíssimo", ganha Fortitude conforme a regra de Disciplina, a linha "Segredo Obscuro (violação da Máscara)" e fica com Humanidade 8

#### Scenario: Sair do refazer pelo passo 1
- **WHEN** o usuário abre o refazer de uma ficha com "Sereia", avança até o passo 2, volta ao passo 1 e clica "Voltar"
- **THEN** a aba Ficha mostra a Humanidade, a Fascinação e as linhas de mérito com o Predador aplicado

## ADDED Requirements

### Requirement: Disciplina do Predador em cartões
No passo 6, as duas Disciplinas do Predador SHALL aparecer como cartões lado a lado, sob o rótulo "Disciplina — um ponto em uma", cada um com o nome da Disciplina e uma linha de contexto em rótulo Karla:
- Disciplina do clã com N pontos no passo 5: "do clã · N → N+1", em tinta suave.
- Disciplina do clã sem pontos no passo 5: "do clã · nível 1", em tinta suave.
- Disciplina fora do clã: "fora do clã · nível 1", em Blood.

Uma Disciplina conta como "do clã" quando está entre as Disciplinas do clã escolhido; para Caitiff, quando foi escolhida no passo 5. Os pontos do passo 5 MUST ser lidos das duas posições do assistente. O cartão escolhido MUST ter borda Moss e fundo `field`; os outros, borda `ink/20` e fundo transparente. Cada cartão MUST ser um `<button>` com `aria-pressed`. Escolher outra Disciplina MUST limpar `predPoder`.

#### Scenario: Ventrue com Extorsionário
- **WHEN** o clã é "Ventrue" com Domínio 2 no passo 5 e o Predador é "Extorsionário"
- **THEN** o cartão "Domínio" mostra "do clã · 2 → 3" e o cartão "Potência" mostra "fora do clã · nível 1" em Blood

#### Scenario: Trocar a Disciplina limpa o poder
- **WHEN** "Domínio" está escolhida com um poder e o usuário escolhe "Potência"
- **THEN** `predPoder` fica vazio e o slot do poder volta a "1 poder sem escolha"

### Requirement: Poder do Predador
Com uma Disciplina do Predador escolhida, o passo 6 SHALL mostrar, abaixo dos cartões, o painel "Poder do Predador": borda `line` para Disciplina do clã e Blood para fora do clã; no topo, o rótulo "Poder do Predador", o nome da Disciplina (Cormorant) e um selo "DO CLÃ" (fundo tinta, texto branco) ou "FORA DO CLÃ" (fundo Blood, texto branco); à direita, bolinhas com os pontos do passo 5 em tinta seguidos de uma bolinha Blood do ponto do Predador. O texto do painel MUST ser:
- do clã com N pontos: "Você já tem N ponto(s) em <Disciplina> pelo clã. O Predador soma +1 e ela vai a N+1. Escolha 1 poder novo de nível N+1 ou inferior." ("ponto" quando N é 1, "pontos" senão);
- do clã sem pontos: "<Disciplina> é do clã, mas não recebeu pontos no passo 5. Entra com 1 ponto e 1 poder de nível 1.";
- fora do clã: "<Disciplina> não é Disciplina do clã <clã>. Entra com 1 ponto e 1 poder de nível 1. Subir depois custa mais XP."

Os poderes elegíveis MUST ser os do catálogo da Disciplina com nível até o novo nível (N+1, ou 1), sem os poderes já escolhidos para ela no passo 5, em ordem de nível. Quando há poderes elegíveis, o painel MUST mostrar:
- um slot: sem escolha, borda tracejada Blood com fundo Blood translúcido, um quadrado tracejado com "+", o rótulo "1 poder sem escolha" em Blood, o título "Nível N+1 ou inferior · <Disciplina>" (ou "Nível 1 · <Disciplina>") e "Escolha um poder da lista abaixo."; com escolha, borda sólida tinta, o quadrado com o nível do poder, o rótulo "Poder escolhido" em Moss, o nome do poder como título e "Nível n · <custo>";
- cartões com os poderes elegíveis (nome, "Nível n · <custo>"), no mesmo visual dos cartões de poder do passo 5. Tocar num cartão MUST gravar o nome do poder em `predPoder`; tocar no cartão já escolhido MUST limpar `predPoder`. O nome do poder no cartão MUST abrir o painel lateral do poder sem alterar a escolha.

Um `predPoder` que não está entre os elegíveis (por exemplo, depois de mudar o passo 5) MUST ser exibido como sem escolha. Quando a Disciplina não tem poderes elegíveis no catálogo, o painel MUST mostrar, no lugar do slot e dos cartões, "Sem poderes catalogados para <Disciplina>. Registre o poder na aba Disciplinas depois." e `predPoder` não é exigido.

#### Scenario: Fora do clã só nível 1
- **WHEN** o clã é "Ventrue" e a Disciplina do Predador é "Potência"
- **THEN** o painel tem o selo "FORA DO CLÃ", uma bolinha Blood, o slot "Nível 1 · Potência" e só cartões de poderes de nível 1 de Potência

#### Scenario: Do clã até o novo nível sem repetir
- **WHEN** o clã é "Ventrue" com Domínio 2 e o poder "Compelir" no passo 5, e a Disciplina do Predador é "Domínio"
- **THEN** o painel tem o selo "DO CLÃ", duas bolinhas tinta e uma Blood, o slot "Nível 3 ou inferior · Domínio", e os cartões listam poderes de Domínio de nível 1 a 3 sem "Compelir"

#### Scenario: Escolher e trocar o poder
- **WHEN** o usuário toca em "Toque Letal" e depois em "Força Prodigiosa"
- **THEN** o slot mostra "Força Prodigiosa" como poder escolhido e só esse cartão fica selecionado

#### Scenario: Nome abre o painel lateral
- **WHEN** o usuário clica no nome "Toque Letal" num cartão não escolhido
- **THEN** o painel lateral de "Toque Letal" abre e `predPoder` não muda

#### Scenario: Disciplina sem catálogo
- **WHEN** o Predador é "Sereia" e a Disciplina escolhida é "Fascinação"
- **THEN** o painel mostra "Sem poderes catalogados para Fascinação. Registre o poder na aba Disciplinas depois." e o passo não exige poder
