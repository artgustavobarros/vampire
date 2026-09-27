# character-wizard Specification

## Purpose
Assistente de criação de personagem em 8 passos com as regras de distribuição de Vampiro: A Máscara V5.
## Requirements
### Requirement: Assistente em 8 passos
O assistente SHALL guiar a criação em 8 passos, nesta ordem: Clã e senhor; Atributos; Habilidades; Especialidades; Disciplinas; Predador; Vantagens e defeitos; Detalhes finais. Cada passo MUST mostrar título, dica em itálico, "Passo N de 8" e uma barra de progresso com 8 segmentos preenchidos até o passo atual. Os valores de um passo MUST ser gravados na ficha quando o passo é validado em "Continuar" ou "Concluir", e MUST ser gravados sem validação ao clicar "Voltar". Alterações dentro de um passo não são gravadas a cada tecla.

#### Scenario: Navegar para frente
- **WHEN** o passo 3 está válido e o usuário clica "Continuar"
- **THEN** os valores do passo 3 são gravados na ficha, o passo 4 é exibido e 4 segmentos da barra ficam preenchidos

#### Scenario: Voltar grava sem validar
- **WHEN** o usuário está no passo 2 com a distribuição de atributos incompleta e clica "Voltar"
- **THEN** o passo 1 é exibido e os atributos digitados no passo 2 ficam gravados na ficha

#### Scenario: Voltar do primeiro passo
- **WHEN** o usuário clica "Voltar" no passo 1
- **THEN** volta para a ficha se estiver no modo refazer, ou sai e vai para a tela de entrada caso contrário

#### Scenario: Concluir
- **WHEN** o passo 8 está válido e o usuário clica "Concluir"
- **THEN** a ficha é gravada com `criada: true`, disciplinas sem nome são descartadas e a ficha abre na aba Ficha

#### Scenario: Refazer personagem
- **WHEN** o usuário escolhe "Refazer personagem" no menu da ficha
- **THEN** o assistente abre no passo 1 em modo refazer, com os dados atuais preenchidos

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

### Requirement: Passo 2 — Atributos
O passo SHALL exibir os três grupos de atributos com `DotRating` e cotas da distribuição V5: um atributo em 4, três em 3, um em 1 e o restante em 2. Os cartões de cota MUST indicar quanto falta ou excede em cada nível, e a linha de derivados MUST mostrar Vitalidade (Vigor + 3) e Força de Vontade (Autocontrole + Determinação).

#### Scenario: Cota excedida
- **WHEN** o usuário coloca dois atributos em 4
- **THEN** a cota "4" aparece destacada em sangue indicando excesso

#### Scenario: Derivados atualizam
- **WHEN** Vigor passa de 2 para 3
- **THEN** a linha de derivados mostra Vitalidade 6

### Requirement: Passo 3 — Habilidades
O passo SHALL oferecer as distribuições "Faz-tudo" (1×3, 8×2, 10×1), "Equilibrado" (3×3, 5×2, 7×1) e "Especialista" (1×4, 3×3, 3×2, 3×1) em cartões, exibir o progresso por nível e as 27 habilidades em três grupos com `DotRating`. Quando a ficha não tem distribuição gravada, o cartão "Faz-tudo" MUST aparecer selecionado e o progresso MUST usar as metas de Faz-tudo. Uma distribuição já gravada na ficha MUST ser respeitada, e o usuário MUST poder trocar de distribuição a qualquer momento. Ao validar o passo, a distribuição selecionada (padrão ou escolhida) MUST ser gravada na ficha. Habilidades com pontos num nível que a distribuição escolhida não prevê MUST aparecer no progresso numa linha "Fora do formato: N" em Blood; a linha MUST sumir quando N for 0. O progresso exibido e a validação do passo MUST usar a mesma regra, de modo que todas as linhas verdes e nenhuma linha "Fora do formato" signifiquem passo válido.

#### Scenario: Faz-tudo selecionada por padrão
- **WHEN** o usuário chega ao passo 3 com uma ficha sem distribuição gravada
- **THEN** o cartão "Faz-tudo" aparece selecionado e o progresso mostra "Nível 3: 0 de 1", "Nível 2: 0 de 8" e "Nível 1: 0 de 10"

#### Scenario: Distribuição gravada é respeitada
- **WHEN** o usuário chega ao passo 3 com "Especialista" gravada na ficha
- **THEN** o cartão "Especialista" aparece selecionado e "Faz-tudo" não

#### Scenario: Padrão gravado ao continuar
- **WHEN** a ficha não tem distribuição, o usuário marca 1 habilidade em 3, 8 em 2 e 10 em 1 sem tocar nos cartões e clica "Continuar"
- **THEN** o assistente vai para o passo 4 e a ficha fica com a distribuição "Faz-tudo"

#### Scenario: Progresso da distribuição
- **WHEN** a distribuição "Equilibrado" está escolhida e o usuário tem 2 habilidades em 3
- **THEN** a linha "3" mostra 2 de 3

#### Scenario: Habilidade fora do formato
- **WHEN** a distribuição "Equilibrado" está escolhida com 3 em 3, 5 em 2, 7 em 1 e "Briga" em 4
- **THEN** as linhas de nível 3, 2 e 1 aparecem completas e a linha "Fora do formato: 1" aparece em Blood

#### Scenario: Distribuição completa avança
- **WHEN** a distribuição "Especialista" está escolhida com 1 em 4, 3 em 3, 3 em 2, 3 em 1 e as demais em 0, e o usuário clica "Continuar"
- **THEN** o assistente vai para o passo 4

### Requirement: Passo 4 — Especialidades
O passo SHALL pedir uma especialidade para cada habilidade obrigatória com pontos (Ciência, Erudição, Ofícios, Performance). Sem nenhuma dessas, MUST oferecer uma especialidade livre: seletor de habilidade com pontos e campo de texto. Escolher a habilidade ou digitar a especialidade MUST NOT produzir erro de tipo (ex.: "expected array, received undefined"); as únicas mensagens do passo são as de negócio em português. Entradas de especialidade vazias MUST NOT ser gravadas na ficha.

#### Scenario: Habilidade obrigatória
- **WHEN** o personagem tem Ofícios 2
- **THEN** aparece um campo "Ofícios · 2" pedindo "Qual especialidade?"

#### Scenario: Especialidade livre
- **WHEN** nenhuma habilidade obrigatória tem pontos
- **THEN** o usuário escolhe uma habilidade com pontos e digita a especialidade

#### Scenario: Escolher a habilidade livre não gera erro de tipo
- **WHEN** nenhuma habilidade obrigatória tem pontos, o usuário escolhe "Briga" no seletor, digita "Agarrar" e clica "Continuar"
- **THEN** o assistente vai para o passo 5 e nenhum toast com "expected array" aparece

#### Scenario: Continuar antes de digitar a especialidade livre
- **WHEN** o usuário escolhe "Armas Brancas" no seletor e clica "Continuar" antes de digitar
- **THEN** o toast "Passo incompleto" diz "Informe uma especialidade." sem mensagem de tipo do Zod; ao digitar "Armas improvisadas" e clicar "Continuar", o assistente vai para o passo 5

#### Scenario: Obrigatória sem especialidade mostra mensagem de negócio
- **WHEN** o personagem tem Ofícios 2 sem especialidade e o usuário clica "Continuar"
- **THEN** o passo 4 continua visível e o toast "Passo incompleto" diz "Informe uma especialidade." sem mensagem de tipo do Zod

#### Scenario: Trocar a habilidade livre
- **WHEN** o usuário escolhe "Briga", troca para "Esportes", digita "Corrida" e clica "Continuar"
- **THEN** o assistente avança e a ficha grava `espec` apenas com `{ Esportes: ["Corrida"] }`

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

### Requirement: Passo 6 — Predador
O passo SHALL listar em cartões os 16 tipos de predador do Livro Básico e do Players Guide: Gato de Rua, Extorsionário, Sereia, Saqueador, Sanguessuga, Doméstico, Consensualista, Fazendeiro, Osíris, João Pestana, Rainha da Cena, Ladrão de Túmulos, Ceifador, Montero, Perseguidor e Alçapão. Para o escolhido, o passo SHALL oferecer a escolha de uma especialidade entre as opções do Predador (duas, ou três na Rainha da Cena), um ponto de disciplina entre duas com a escolha de um poder, e listar os ajustes obrigatórios. Especialidades, Disciplinas e ajustes MUST seguir o Livro Básico (p. 175–178) e o Players Guide (p. 107–109). Os nomes de Disciplina MUST ser os do catálogo `DISCIPLINES` (Dominação, Proteanismo, Oblívio, Feitiçaria de Sangue…), e os nomes de mérito MUST ser os de `data/merits.ts` quando o mérito existe lá. Os ajustes MUST vir da lista estruturada do Predador em `data/predators.ts`, cada um com tipo (`humanidade`, `potencia`, `merito` ou `escolha`), valores e rótulo. O passo MUST exibir o rótulo e colorir o filete pelo tipo: ganho (Humanidade ou Potência positivas, `merito`/`escolha` de vantagem) em Moss, custo (Humanidade negativa, `merito`/`escolha` de defeito) em Blood.

Um Predador pode proibir clãs e limitar a Potência de Sangue: Fazendeiro e Saqueador não podem ser escolhidos por Ventrue, e Fazendeiro exige Potência de Sangue 2 ou menos (Potência da Geração, sem o Predador). O cartão de um Predador indisponível para o clã e a Geração do passo 1 MUST aparecer desabilitado, com opacidade reduzida e o motivo em Blood no lugar da descrição ("Ventrue não pode ser <Predador>" ou "Exige Potência de Sangue 2 ou menos"). Clicar nele MUST NOT escolhê-lo. Um Predador já gravado que ficou indisponível MUST continuar marcado, com o motivo, até o usuário trocar. Cada ajuste do tipo `escolha` MUST mostrar, abaixo do rótulo, um seletor: no modo `uma`, um botão por opção, com uma só selecionada; no modo `dividir`, um `DotRating` por opção com o total de pontos do ajuste como máximo e a soma entre as opções limitada a esse total. As escolhas MUST ser gravadas em `predEscolhas` (id do ajuste → pontos por opção). Trocar de Predador MUST limpar `predEspec`, `predEspecNome`, `predDisc`, `predPoder` e `predEscolhas`. Para Sangue Fraco, o passo MUST esconder os cartões e mostrar só o aviso "Sangues-ralos não têm Tipo de Predador. Siga para o próximo passo."; ao salvar o passo, `predador`, `predEspec`, `predEspecNome`, `predDisc`, `predPoder` e `predEscolhas` MUST ser gravados vazios.

#### Scenario: Escolher Sereia
- **WHEN** o usuário escolhe "Sereia"
- **THEN** aparecem as especialidades "Persuasão (Sedução)" e "Subterfúgio (Sedução)", os cartões de disciplina "Fortitude" e "Presença" e os ajustes "Vantagem Bonito ••" e "Defeito Inimigo • (amante desprezado ou parceiro ciumento)", sem ajuste de Humanidade e sem seletores de escolha

#### Scenario: Os 16 tipos
- **WHEN** o clã é "Brujah" e o usuário abre o passo 6
- **THEN** aparecem 16 cartões habilitados, entre eles "Ceifador", "Montero", "Perseguidor" e "Alçapão"

#### Scenario: Três especialidades na Rainha da Cena
- **WHEN** o usuário escolhe "Rainha da Cena"
- **THEN** aparecem as especialidades "Etiqueta (Cena)", "Liderança (Cena)" e "Manha (Cena)"

#### Scenario: Ventrue não pode ser Fazendeiro
- **WHEN** o clã é "Ventrue" e o usuário abre o passo 6
- **THEN** os cartões "Fazendeiro" e "Saqueador" aparecem desabilitados, com "Ventrue não pode ser Fazendeiro" e "Ventrue não pode ser Saqueador", e clicar neles não escolhe nada

#### Scenario: Fazendeiro com Potência alta
- **WHEN** o clã é "Brujah", a Geração é 7ª (Potência 3) e o usuário abre o passo 6
- **THEN** o cartão "Fazendeiro" aparece desabilitado com "Exige Potência de Sangue 2 ou menos"

#### Scenario: Méritos do Alçapão
- **WHEN** o usuário escolhe "Alçapão"
- **THEN** os ajustes são "Refúgio •", uma escolha de uma opção entre "Lacaios", "Rebanho" e "Refúgio", e uma escolha de uma opção entre "Refúgio Assustador" e "Refúgio Assombrado"

#### Scenario: Escolha de uma opção
- **WHEN** o usuário escolhe "Sanguessuga"
- **THEN** o ajuste "Defeito Segredo Obscuro •• (diablerista) ou Evitado ••" mostra os botões "Segredo Obscuro (diablerista)" e "Evitado", e clicar em "Evitado" deixa só ele selecionado

#### Scenario: Dividir pontos
- **WHEN** o usuário escolhe "Osíris" e marca 2 pontos em Rebanho no ajuste "3 pontos entre Rebanho e Fama"
- **THEN** Fama aceita no máximo 1 ponto

#### Scenario: Trocar de Predador limpa escolhas
- **WHEN** "Sanguessuga" tinha "Evitado" escolhido e um poder do Predador escolhido, e o usuário troca para "Osíris"
- **THEN** `predEscolhas` fica vazio, `predEspecNome` e `predPoder` ficam vazios e nenhum seletor do Osíris vem marcado

#### Scenario: Sangue-ralo sem Predador
- **WHEN** o clã é "Sangue Fraco"
- **THEN** nenhum cartão de predador aparece, só o aviso, e "Continuar" avança

#### Scenario: Predador antigo apagado
- **WHEN** a ficha tinha "Sereia" gravado, o clã passou a ser "Sangue Fraco" e o usuário avança do passo 6
- **THEN** a ficha é gravada com `predador`, `predEspec`, `predEspecNome`, `predDisc`, `predPoder` e `predEscolhas` vazios

### Requirement: Passo 7 — Vantagens e defeitos
O passo SHALL escolher vantagens e defeitos por um combobox de busca sobre o catálogo (`web/src/data/merits.ts`) e mostrar os escolhidos numa lista abaixo dele. No topo, o passo MUST mostrar "X/7 pts em vantagens" e "Y/2 pts em defeitos", o texto da regra ("Distribua 7 pontos em Vantagens e adquira 2 pontos de Defeitos além daqueles obtidos do seu Tipo de Predador.") e uma linha de status: "Falta: " com os itens pendentes separados por " · " (ex.: "distribuir 3 pts em vantagens", "remover 1 pts de defeitos"), ou "Distribuição completa." em Moss `#2F6B3C`. Os defeitos do Predador MUST NOT entrar na soma.

Combobox:
- acima do campo, três abas com `aria-pressed`: "Todos" (padrão), "Vantagens" e "Defeitos"; a aba ativa tem fundo tinta e texto branco, as outras só contorno;
- o campo tem o placeholder "Buscar vantagem ou defeito…", um ícone de lupa à esquerda e, à direita, "N opções" com o número de opções visíveis;
- ao focar ou digitar, MUST abrir abaixo do campo uma lista (`role="listbox"`) com altura máxima e rolagem, agrupada por categoria na ordem do catálogo, com o cabeçalho de cada grupo fixo no topo durante a rolagem ("Antecedente" aparece como "Antecedentes");
- cada opção MUST mostrar o nome, a faixa de pontos em pontinhos ("•" para custo fixo de 1, "••" para custo fixo de 2, "•–•••••" para faixa de 1 a 5), a marca "Na ficha" em Moss quando já está na lista de escolhidos, o selo do tipo à direita ("Vantagem" ou "Qualidade SR" em Moss, "Defeito" ou "Defeito SR" em Blood) e a descrição do catálogo numa linha;
- a busca MUST ignorar maiúsculas e acentos e comparar com nome, categoria e descrição; a aba "Vantagens" mostra só `vantagem` e `qualidade-sr`, a aba "Defeitos" só `defeito` e `defeito-sr`;
- o campo MUST seguir o padrão ARIA combobox: seta para baixo/cima move a opção ativa (destacada com filete tinta à esquerda e fundo `field`), Enter escolhe a opção ativa, Esc fecha a lista, clicar fora fecha a lista;
- escolher uma opção que não está na ficha MUST acrescentar uma linha com o nome e o tipo do catálogo e os pontos mínimos permitidos (o custo fixo, ou o primeiro valor da faixa), limpar a busca e fechar a lista; escolher uma opção marcada "Na ficha" MUST NOT acrescentar outra linha;
- quando a busca tem texto e nenhum nome do catálogo é igual a ele (sem diferença de maiúsculas e acentos), a lista MUST terminar com "Adicionar “<texto>” como vantagem" e "Adicionar “<texto>” como defeito", que acrescentam uma linha fora do catálogo com esse nome, o tipo escolhido e 1 ponto;
- sem resultados nem texto de busca, a lista mostra "Nenhuma opção nesta aba.".

Lista de escolhidos: cada linha MUST mostrar o selo do tipo, o nome como gatilho do painel lateral do mérito (ver `trait-info`), a legenda "<Categoria> · <faixa>" (ou "Fora do catálogo" para nomes que `findMerit` não encontra), um `DotRating` pequeno que só aceita os valores permitidos do item (1 a 5 para itens fora do catálogo) e o botão "Remover". O selo de um item do catálogo MUST ser fixo; o selo de um item fora do catálogo MUST ser alternável como antes. Sem linhas, o passo MUST mostrar "Nenhum mérito ou defeito" com a explicação "Busque acima e escolha no catálogo. Vantagens custam pontos; defeitos devolvem pontos.".

Para Sangue Fraco:
- as Qualidades SR MUST aparecer na aba "Vantagens" e os Defeitos SR na aba "Defeitos", no grupo "Sangue-ralo"; para outros clãs essas opções MUST NOT aparecer;
- o selo de um item fora do catálogo MUST ciclar Vantagem → Defeito → Qualidade SR → Defeito SR (Qualidade SR em Moss, Defeito SR em Blood);
- o topo MUST mostrar também "N qualidades · N defeitos de sangue-ralo" (conta linhas, não pontos);
- a regra MUST acrescentar "Sangues-ralos devem adquirir entre uma e três Qualidades de Sangue-Ralo e a mesma quantidade de Defeitos de Sangue-Ralo.";
- o status MUST cobrar de 1 a 3 Qualidades SR e o mesmo número de Defeitos SR.

Qualidades e Defeitos SR MUST NOT entrar nas somas de 7 e 2. Para outros clãs, uma linha gravada como Qualidade SR MUST ser exibida e contada como Vantagem, e Defeito SR como Defeito, e o selo de itens fora do catálogo cicla só Vantagem ↔ Defeito.

#### Scenario: Totais
- **WHEN** existem uma vantagem de 3 pontos e um defeito de 2
- **THEN** o topo mostra "3/7 pts em vantagens" e "2/2 pts em defeitos" e o status diz "Falta: distribuir 4 pts em vantagens."

#### Scenario: Distribuição completa
- **WHEN** as vantagens somam 7 e os defeitos somam 2, num clã que não é Sangue Fraco
- **THEN** o status mostra "Distribuição completa." em Moss

#### Scenario: Lista vazia
- **WHEN** não há nenhuma linha
- **THEN** aparece "Nenhum mérito ou defeito" com a explicação e o campo de busca, sem botão "Adicionar"

#### Scenario: Escolher antecedente
- **WHEN** o clã é "Brujah" e o usuário digita "recur" no campo e escolhe "Recursos"
- **THEN** a lista de escolhidos ganha "Recursos" com selo "Vantagem", legenda "Antecedentes · •–•••••" e 1 ponto, e o campo fica vazio

#### Scenario: Escolher item de custo fixo
- **WHEN** o usuário escolhe "Bonito" no combobox
- **THEN** a linha "Bonito" aparece com 2 pontos e o `DotRating` não aceita outros valores

#### Scenario: Aba de defeitos
- **WHEN** o usuário ativa a aba "Defeitos"
- **THEN** a lista mostra só opções com selo "Defeito" e "N opções" conta apenas elas

#### Scenario: Busca sem acento
- **WHEN** o usuário digita "mascara"
- **THEN** a opção "Máscara" aparece na lista

#### Scenario: Opção já escolhida
- **WHEN** "Influência" já está na lista de escolhidos e o usuário abre o combobox
- **THEN** a opção "Influência" mostra "Na ficha" e escolhê-la não acrescenta uma segunda linha

#### Scenario: Teclado
- **WHEN** o foco está no campo com a lista aberta e o usuário pressiona seta para baixo duas vezes e Enter
- **THEN** a segunda opção visível é acrescentada à lista de escolhidos

#### Scenario: Item fora do catálogo
- **WHEN** o usuário digita "Dívida de sangue" e escolhe "Adicionar “Dívida de sangue” como defeito"
- **THEN** a lista ganha "Dívida de sangue" com selo "Defeito" alternável, legenda "Fora do catálogo" e 1 ponto

#### Scenario: Nome abre o painel
- **WHEN** o usuário clica no nome "Recursos" na lista de escolhidos
- **THEN** o painel lateral abre com a descrição e os níveis de "Recursos"

#### Scenario: Qualidades SR só para Sangue Fraco
- **WHEN** o clã é "Ventrue" e o usuário busca "Bebedor diurno"
- **THEN** nenhuma opção do catálogo aparece, só as ações "Adicionar … como vantagem/defeito"

#### Scenario: Qualidades SR na aba de vantagens
- **WHEN** o clã é "Sangue Fraco" e o usuário ativa a aba "Vantagens"
- **THEN** a lista tem o grupo "Sangue-ralo" com opções de selo "Qualidade SR"

#### Scenario: Ciclo de tipo do sangue-ralo
- **WHEN** o clã é "Sangue Fraco" e o usuário clica três vezes no selo de uma linha "Vantagem" fora do catálogo
- **THEN** o selo mostra "Defeito SR"

#### Scenario: Tipos SR fora do Sangue Fraco
- **WHEN** a ficha tem uma "Qualidade SR" de 2 pontos e o clã é "Brujah"
- **THEN** a linha aparece como "Vantagem" e conta 2 pts em vantagens

### Requirement: Passo 8 — Detalhes finais
O passo SHALL exibir os campos restantes de identificação (nome, conceito, crônica, ambição, desejo) antes de concluir. Os campos de clã, senhor, Geração e Predador MUST NOT aparecer no passo, porque são definidos nos passos 1 e 6.

#### Scenario: Preencher nome
- **WHEN** o usuário digita o nome do personagem no passo 8
- **THEN** o nome aparece no cabeçalho da ficha após concluir

#### Scenario: Sem Geração nos detalhes
- **WHEN** o assistente está no passo 8
- **THEN** não há campo "Geração" nem "Senhor"

### Requirement: Formulário único do assistente
O assistente SHALL ser um único formulário `react-hook-form` que cobre os 8 passos, com valores iniciais tirados da ficha atual. Os campos MUST usar o componente `Field` do shadcn (rótulo e descrição). Os controles próprios (`DotRating`, cartões selecionáveis, seletores) MUST estar ligados ao formulário. Um campo com erro MUST exibir `aria-invalid="true"` (ou `data-invalid` no grupo) e MUST NOT exibir mensagem de erro em texto abaixo dele; a mensagem sai no toast (ver "Validação por passo").

#### Scenario: Valores iniciais da ficha
- **WHEN** o assistente abre para uma ficha com clã "Brujah" e nome "Ana"
- **THEN** o cartão "Brujah" aparece selecionado no passo 1 e o campo nome mostra "Ana" no passo 8

#### Scenario: Valores preservados entre passos
- **WHEN** o usuário digita o nome do senhor no passo 1, avança até o passo 3 e volta ao passo 1
- **THEN** o campo do senhor mantém o valor digitado

#### Scenario: Sem mensagem inline
- **WHEN** o usuário clica "Continuar" no passo 1 sem escolher clã
- **THEN** o grupo "Clã" fica marcado como inválido e nenhum texto "Escolha um clã" aparece dentro do formulário

### Requirement: Validação por passo
"Continuar" e "Concluir" SHALL validar só os campos do passo atual contra o schema zod daquele passo. Se o passo for inválido, o assistente MUST continuar no passo, disparar um toast de erro com rótulo "Passo incompleto" contendo as mensagens de erro do passo e levar o foco ao primeiro campo com erro. As mensagens MUST ser únicas (sem repetir a mesma frase); com mais de 3, o toast MUST mostrar as 3 primeiras e "e mais N.". Os passos 5, 6 e 7 MUST ler o clã como contexto, sem gravá-lo, e o passo 6 MUST ler também a Geração do passo 1 e as Disciplinas do passo 5 como contexto, sem gravá-las. As regras são:
- Passo 1: clã e geração obrigatórios.
- Passo 2: todos os nove atributos entre 1 e 4, com exatamente um em 4, três em 3, um em 1 e o resto em 2.
- Passo 3: distribuição escolhida, com todos os níveis completos e nenhuma habilidade num nível fora da distribuição. A mensagem MUST dizer, por nível, quantas faltam ou sobram (ex.: "Nível 3: falta 1.") e listar as habilidades fora do formato com o nível (ex.: "Fora do formato: Briga (4).").
- Passo 4: especialidade preenchida para cada habilidade obrigatória com pontos; sem nenhuma, uma habilidade com pontos e uma especialidade livre.
- Passo 5: para Sangue Fraco, sempre válido. Para os demais: duas disciplinas diferentes, ambas do clã (qualquer uma para Caitiff), com níveis 2 e 1, e nenhum poder marcado acima do nível da disciplina.
- Passo 6: para Sangue Fraco, sempre válido. Para os demais: tipo de predador, especialidade do predador e disciplina do predador escolhidos, com a especialidade e a Disciplina entre as opções do Predador (uma Disciplina gravada fora das opções conta como não escolhida: "Escolha uma disciplina"); o Predador disponível para o clã e a Geração, lidos como contexto do passo 1 (mensagem igual ao motivo do cartão, ex.: "Ventrue não pode ser Fazendeiro"); a Disciplina do Predador permitida para o clã ("Feitiçaria de Sangue: só Tremere e Banu Haqim"); `predEspecNome` preenchido, sem contar espaços ("Informe o nome da especialidade do Predador"); `predPoder` MUST ser um dos poderes elegíveis da Disciplina (ver "Poder do Predador") ("Escolha um poder de <Disciplina>"); e todas as escolhas de ajuste do Predador completas: no modo `uma`, uma opção escolhida ("Escolha uma opção: <rótulo>"); no modo `dividir`, os pontos das opções somando exatamente o total ("Distribua N pontos entre <opções separadas por " e ">").
- Passo 7: cada linha com nome preenchido e pontos de 1 a 5; vantagens somando exatamente 7 e defeitos exatamente 2 (sem contar tipos SR); para Sangue Fraco, também de 1 a 3 Qualidades SR e o mesmo número de Defeitos SR. A mensagem MUST ser a mesma da linha de status.
- Passo 8: nome do personagem obrigatório.

#### Scenario: Clã não escolhido
- **WHEN** o usuário clica "Continuar" no passo 1 sem escolher clã nem geração
- **THEN** o passo 1 continua visível e aparece um toast "Passo incompleto" com "Escolha um clã" e "Escolha a geração"

#### Scenario: Poder do Predador obrigatório
- **WHEN** o Predador é "Extorsionário" com Disciplina "Potência", especialidade e ajustes completos, sem poder escolhido, e o usuário clica "Continuar"
- **THEN** o passo 6 continua visível e o toast "Passo incompleto" traz "Escolha um poder de Potência"

#### Scenario: Poder invalidado pelo passo 5
- **WHEN** o poder do Predador era um poder de Dominação de nível 3 e o usuário volta ao passo 5 e troca Dominação de 2 para 1 ponto
- **THEN** no passo 6 o poder deixa de aparecer como escolhido e "Continuar" pede "Escolha um poder de Dominação"

#### Scenario: Nome da especialidade do Predador obrigatório
- **WHEN** o Predador é "Extorsionário" com "Intimidação (Coerção)" escolhida, o usuário apaga o nome da especialidade e clica "Continuar"
- **THEN** o passo 6 continua visível e o toast "Passo incompleto" traz "Informe o nome da especialidade do Predador"

#### Scenario: Predador proibido depois de trocar o clã
- **WHEN** a ficha tem "Fazendeiro" gravado, o usuário troca o clã para "Ventrue" no passo 1 e clica "Continuar" no passo 6
- **THEN** o passo 6 continua visível e o toast "Passo incompleto" traz "Ventrue não pode ser Fazendeiro"

#### Scenario: Disciplina antiga fora das opções
- **WHEN** a ficha tem "Sereia" com `predDisc: "Fascinação"` e o usuário refaz o passo 6
- **THEN** nenhum cartão de Disciplina aparece escolhido e "Continuar" pede "Escolha uma disciplina"

### Requirement: Sem pular passos
O assistente SHALL abrir no máximo o primeiro passo cujos dados gravados na ficha ainda não passam no schema. Um `?passo=N` além desse passo MUST ser trocado pelo primeiro passo incompleto.

#### Scenario: Pular pela URL
- **WHEN** a ficha só tem os passos 1 e 2 válidos e o usuário abre `/criar?passo=6`
- **THEN** o assistente abre no passo 3

#### Scenario: Voltar é sempre permitido
- **WHEN** a ficha tem os passos 1 a 4 válidos e o usuário abre `/criar?passo=2`
- **THEN** o assistente abre no passo 2

### Requirement: Um personagem por jogador
Cada jogador SHALL ter no máximo um personagem, guardado em `vtm5.sheet.<email>`. Com a ficha já criada (`criada: true`), `/criar` MUST redirecionar para a ficha, exceto no modo refazer (`refazer=true`), que edita o mesmo personagem e, ao concluir, substitui a ficha existente.

#### Scenario: Criar com personagem existente
- **WHEN** o jogador tem a ficha criada e abre `/criar?passo=1`
- **THEN** é redirecionado para a aba Ficha

#### Scenario: Primeira criação
- **WHEN** o jogador não tem ficha criada e abre `/criar?passo=1`
- **THEN** o assistente abre no passo 1

#### Scenario: Refazer substitui o mesmo personagem
- **WHEN** o jogador refaz o personagem, troca o nome para "Bruno" e conclui
- **THEN** a mesma ficha em `vtm5.sheet.<email>` passa a ter o nome "Bruno" e nenhuma outra ficha é criada

### Requirement: Dicas dos passos 6 e 7
A dica do passo 6 SHALL ser "Como você caça define perícias e Disciplinas extras. Sangues-ralos não têm." e a do passo 7 SHALL ser "Sete pontos em vantagens, dois em defeitos além dos do Predador.".

#### Scenario: Dica do passo 7
- **WHEN** o assistente está no passo 7
- **THEN** a dica mostra "Sete pontos em vantagens, dois em defeitos além dos do Predador."

### Requirement: Dica do passo 5
A dica do passo 5 SHALL ser "Duas Disciplinas do clã: dois pontos em uma, um na outra.".

#### Scenario: Dica do passo 5
- **WHEN** o assistente está no passo 5
- **THEN** a dica mostra "Duas Disciplinas do clã: dois pontos em uma, um na outra."

### Requirement: Predador aplicado ao concluir
Ao clicar "Concluir" no passo 8, o assistente SHALL aplicar o Predador escolhido por cima dos valores finais da ficha montada pelos 8 passos, na mesma gravação que marca a ficha como criada:
- **Disciplina**: a Disciplina de `predDisc` MUST ganhar 1 ponto se já existir na ficha (em qualquer posição), até o limite de 5; se não existir, MUST ser acrescentada à ficha com nível 1. Quando `predPoder` corresponde a um poder do catálogo dessa Disciplina, o poder MUST ser acrescentado aos poderes dela com nome, nível, custo, duração, descrição e Rouse do catálogo, mantendo a ordem por nível; sem `predPoder`, a Disciplina acrescentada fica sem poderes.
- **Humanidade**: a soma dos ajustes `humanidade` MUST ser somada à Humanidade da ficha, limitada entre 0 e 10.
- **Potência de Sangue**: a soma dos ajustes `potencia` MUST ser somada à Potência derivada da Geração, limitada a 10.
- **Vantagens e Defeitos**: cada ajuste `merito` MUST virar uma linha em `meritos` com o tipo e os pontos do ajuste e o nome "<nome> (<detalhe>)" (ou só "<nome>" sem detalhe); cada ajuste `escolha` MUST virar uma linha por opção com pontos em `predEscolhas`, com o tipo do ajuste e os pontos escolhidos. Linhas do Predador com o mesmo nome e o mesmo tipo MUST virar uma linha só, com os pontos somados. Essas linhas MUST ser marcadas com `origem: "predador"` e MUST NOT entrar nas somas de 7 vantagens e 2 defeitos.

O que foi aplicado à Disciplina, à Humanidade e à Potência MUST ficar registrado na ficha (`predBonus`: Disciplina, se ela foi acrescentada, o nome do poder acrescentado, e os deltas efetivamente aplicados de Humanidade e Potência). Uma ficha que já tem `predBonus` ou linhas de mérito com `origem: "predador"` MUST NOT receber o Predador de novo. Sangue Fraco, ou ficha sem Predador, MUST NOT receber nada nem `predBonus`.

#### Scenario: Ponto em Disciplina do clã
- **WHEN** o passo 5 tem Potência 2 e Celeridade 1, o Predador é "Gato de Rua" com Disciplina "Potência" e poder "Força Prodigiosa", e o usuário conclui
- **THEN** a ficha fica com Potência 3 com o poder "Força Prodigiosa" somado aos do passo 5, e Celeridade 1

#### Scenario: Disciplina nova
- **WHEN** o clã é "Brujah", o passo 5 tem Celeridade 2 e Presença 1, o Predador é "Sereia" com Disciplina "Fortitude" e poder "Resiliência", e o usuário conclui
- **THEN** a ficha fica com Celeridade 2, Presença 1 e Fortitude 1 com o poder "Resiliência"

#### Scenario: Disciplina fora do clã com poder
- **WHEN** o clã é "Ventrue", o Predador é "Extorsionário" com Disciplina "Potência" e poder "Toque Letal", e o usuário conclui
- **THEN** a ficha ganha Potência 1 com o poder "Toque Letal" de nível 1

#### Scenario: Humanidade reduzida
- **WHEN** a ficha tem Humanidade 7, o Predador é "Gato de Rua" e o usuário conclui
- **THEN** a ficha fica com Humanidade 6

#### Scenario: Sereia não mexe na Humanidade
- **WHEN** a ficha tem Humanidade 7, o Predador é "Sereia" e o usuário conclui
- **THEN** a ficha continua com Humanidade 7

#### Scenario: Humanidade aumentada
- **WHEN** a ficha tem Humanidade 7, o Predador é "Fazendeiro" e o usuário conclui
- **THEN** a ficha fica com Humanidade 8

#### Scenario: Potência de Sangue do Sanguessuga
- **WHEN** a ficha é de 12ª Geração (Potência 1), o Predador é "Sanguessuga" e o usuário conclui
- **THEN** a Potência de Sangue da ficha passa a ser 2 e a Humanidade cai 1

#### Scenario: Méritos fixos do Predador
- **WHEN** o passo 7 tem 7 pontos de vantagens e 2 de defeitos, o Predador é "Sereia" e o usuário conclui
- **THEN** `meritos` mantém as linhas do passo 7 e ganha "Bonito" (vantagem, 2) e "Inimigo (amante desprezado ou parceiro ciumento)" (defeito, 1), ambas com `origem: "predador"`

#### Scenario: Méritos escolhidos do Predador
- **WHEN** o Predador é "Osíris" com Rebanho 2 e Fama 1, Inimigo 2 e Defeito Mítico 0, e o usuário conclui
- **THEN** `meritos` ganha "Rebanho" (vantagem, 2), "Fama" (vantagem, 1) e "Inimigo" (defeito, 2) com `origem: "predador"`, e nenhuma linha "Defeito Mítico"

#### Scenario: Méritos repetidos somam
- **WHEN** o Predador é "Alçapão" com "Refúgio" na escolha de vantagem e "Refúgio Assustador" na escolha de defeito, e o usuário conclui
- **THEN** `meritos` ganha uma só linha "Refúgio" (vantagem, 2) e "Refúgio Assustador" (defeito, 1), com `origem: "predador"`

#### Scenario: Sangue-ralo sem Predador aplicado
- **WHEN** o clã é "Sangue Fraco" e o usuário conclui
- **THEN** Disciplinas, Humanidade, Potência de Sangue e `meritos` ficam como os passos deixaram e a ficha não tem `predBonus`

### Requirement: Refazer sem o Predador aplicado
No modo refazer, o assistente SHALL trabalhar sobre os valores da ficha sem o Predador aplicado: os valores iniciais do formulário e a verificação do primeiro passo incompleto MUST desconsiderar o ponto da Disciplina, a Disciplina acrescentada, o poder acrescentado pelo Predador, o ajuste de Humanidade registrado em `predBonus` e as linhas de `meritos` com `origem: "predador"`. A primeira gravação de um passo MUST remover da ficha o Predador aplicado e apagar `predBonus`. Ao concluir, o Predador MUST ser aplicado de novo conforme "Predador aplicado ao concluir", com o Predador e as escolhas desse momento. Ao clicar "Voltar" no passo 1 do modo refazer, a ficha MUST voltar a ter o Predador aplicado antes de exibir a ficha.

#### Scenario: Passo 5 mostra os pontos originais
- **WHEN** a ficha concluída tem Potência 3 porque o "Gato de Rua" deu 1 ponto e o poder "Força Prodigiosa" a uma Potência 2, e o usuário abre o refazer no passo 5
- **THEN** o slot de Potência mostra 2 pontos, só os poderes do passo 5, e o passo é válido

#### Scenario: Passo 7 sem as linhas do Predador
- **WHEN** a ficha concluída com "Sereia" tem 7 pontos de vantagens do passo 7 mais "Bonito" do Predador, e o usuário abre o refazer no passo 7
- **THEN** o passo lista só as linhas do passo 7 e mostra "7/7 pts em vantagens"

#### Scenario: Concluir o refazer não duplica
- **WHEN** a ficha concluída com "Gato de Rua" e Disciplina "Celeridade" tem Humanidade 6 e o usuário refaz sem trocar o Predador e conclui
- **THEN** a ficha continua com Humanidade 6, um só ponto de Celeridade do Predador e uma só linha "Contatos (criminosos)"

#### Scenario: Concluir o refazer não duplica o poder
- **WHEN** a ficha concluída com "Gato de Rua" tem Potência 3 com "Força Prodigiosa" do Predador e o usuário refaz sem trocar nada e conclui
- **THEN** a ficha continua com Potência 3 e uma só "Força Prodigiosa"

#### Scenario: Trocar de Predador no refazer
- **WHEN** a ficha concluída com "Gato de Rua" (Celeridade 1 acrescentada, Humanidade 6) é refeita com "Consensualista" e Disciplina "Fortitude", e o usuário conclui
- **THEN** a ficha não tem mais Celeridade nem "Contatos (criminosos)", ganha Fortitude conforme a regra de Disciplina, as linhas "Segredo Obscuro (Quebrador da Máscara)" e "Presa Excluída (sem consentimento)" e fica com Humanidade 8

#### Scenario: Sair do refazer pelo passo 1
- **WHEN** o usuário abre o refazer de uma ficha com "Gato de Rua" e Disciplina "Celeridade", avança até o passo 2, volta ao passo 1 e clica "Voltar"
- **THEN** a aba Ficha mostra a Humanidade, a Celeridade e as linhas de mérito com o Predador aplicado

### Requirement: Disciplina do Predador em cartões
No passo 6, as duas Disciplinas do Predador SHALL aparecer como cartões lado a lado, sob o rótulo "Disciplina — um ponto em uma", cada um com o nome da Disciplina e uma linha de contexto em rótulo Karla:
- Disciplina do clã com N pontos no passo 5: "do clã · N → N+1", em tinta suave.
- Disciplina do clã sem pontos no passo 5: "do clã · nível 1", em tinta suave.
- Disciplina fora do clã: "fora do clã · nível 1", em Blood.

Uma Disciplina conta como "do clã" quando está entre as Disciplinas do clã escolhido; para Caitiff, quando foi escolhida no passo 5. Os pontos do passo 5 MUST ser lidos das duas posições do assistente. O cartão escolhido MUST ter borda Moss e fundo `field`; os outros, borda `ink/20` e fundo transparente. Cada cartão MUST ser um `<button>` com `aria-pressed`. Escolher outra Disciplina MUST limpar `predPoder`.

Uma opção de Disciplina pode ser restrita a clãs: Feitiçaria de Sangue, no Saqueador e no Osíris, só vale para Tremere e Banu Haqim. Para os demais clãs, o cartão dela MUST ficar desabilitado, com opacidade reduzida e a linha de contexto "só Tremere e Banu Haqim" em Blood, e clicar nele MUST NOT escolhê-lo.

#### Scenario: Ventrue com Extorsionário
- **WHEN** o clã é "Ventrue" com Dominação 2 no passo 5 e o Predador é "Extorsionário"
- **THEN** o cartão "Dominação" mostra "do clã · 2 → 3" e o cartão "Potência" mostra "fora do clã · nível 1" em Blood

#### Scenario: Trocar a Disciplina limpa o poder
- **WHEN** "Dominação" está escolhida com um poder e o usuário escolhe "Potência"
- **THEN** `predPoder` fica vazio e o slot do poder volta a "1 poder sem escolha"

#### Scenario: Feitiçaria de Sangue restrita
- **WHEN** o clã é "Brujah" e o Predador é "Osíris"
- **THEN** o cartão "Feitiçaria de Sangue" aparece desabilitado com "só Tremere e Banu Haqim" e só "Presença" pode ser escolhida

#### Scenario: Feitiçaria de Sangue para Banu Haqim
- **WHEN** o clã é "Banu Haqim" e o Predador é "Saqueador"
- **THEN** o cartão "Feitiçaria de Sangue" está habilitado e mostra "do clã · nível 1" ou "do clã · N → N+1"

### Requirement: Poder do Predador
Com uma Disciplina do Predador escolhida, o passo 6 SHALL mostrar, abaixo dos cartões, o painel "Poder do Predador": borda `line` para Disciplina do clã e Blood para fora do clã; no topo, o rótulo "Poder do Predador", o nome da Disciplina (Cormorant) e um selo "DO CLÃ" (fundo tinta, texto branco) ou "FORA DO CLÃ" (fundo Blood, texto branco); à direita, bolinhas com os pontos do passo 5 em tinta seguidos de uma bolinha Blood do ponto do Predador. O texto do painel MUST ser:
- do clã com N pontos: "Você já tem N ponto(s) em <Disciplina> pelo clã. O Predador soma +1 e ela vai a N+1. Escolha 1 poder novo de nível N+1 ou inferior." ("ponto" quando N é 1, "pontos" senão);
- do clã sem pontos: "<Disciplina> é do clã, mas não recebeu pontos no passo 5. Entra com 1 ponto e 1 poder de nível 1.";
- fora do clã: "<Disciplina> não é Disciplina do clã <clã>. Entra com 1 ponto e 1 poder de nível 1. Subir depois custa mais XP."

Os poderes elegíveis MUST ser os do catálogo da Disciplina com nível até o novo nível (N+1, ou 1), sem os poderes já escolhidos para ela no passo 5, em ordem de nível. Quando há poderes elegíveis, o painel MUST mostrar:
- um slot: sem escolha, borda tracejada Blood com fundo Blood translúcido, um quadrado tracejado com "+", o rótulo "1 poder sem escolha" em Blood, o título "Nível N+1 ou inferior · <Disciplina>" (ou "Nível 1 · <Disciplina>") e "Escolha um poder da lista abaixo."; com escolha, borda sólida tinta, o quadrado com o nível do poder, o rótulo "Poder escolhido" em Moss, o nome do poder como título e "Nível n · <custo>";
- cartões com os poderes elegíveis (nome, "Nível n · <custo>"), no mesmo visual dos cartões de poder do passo 5. Tocar num cartão MUST gravar o nome do poder em `predPoder`; tocar no cartão já escolhido MUST limpar `predPoder`. O nome do poder no cartão MUST abrir o painel lateral do poder sem alterar a escolha.

Um `predPoder` que não está entre os elegíveis (por exemplo, depois de mudar o passo 5) MUST ser exibido como sem escolha. Toda Disciplina oferecida por um Predador MUST ter poderes no catálogo, então o painel sempre mostra o slot e os cartões.

#### Scenario: Fora do clã só nível 1
- **WHEN** o clã é "Ventrue" e a Disciplina do Predador é "Potência"
- **THEN** o painel tem o selo "FORA DO CLÃ", uma bolinha Blood, o slot "Nível 1 · Potência" e só cartões de poderes de nível 1 de Potência

#### Scenario: Do clã até o novo nível sem repetir
- **WHEN** o clã é "Ventrue" com Dominação 2 e o poder "Compelir" no passo 5, e a Disciplina do Predador é "Dominação"
- **THEN** o painel tem o selo "DO CLÃ", duas bolinhas tinta e uma Blood, o slot "Nível 3 ou inferior · Dominação", e os cartões listam poderes de Dominação de nível 1 a 3 sem "Compelir"

#### Scenario: Escolher e trocar o poder
- **WHEN** o usuário toca em "Toque Letal" e depois em "Força Prodigiosa"
- **THEN** o slot mostra "Força Prodigiosa" como poder escolhido e só esse cartão fica selecionado

#### Scenario: Nome abre o painel lateral
- **WHEN** o usuário clica no nome "Toque Letal" num cartão não escolhido
- **THEN** o painel lateral de "Toque Letal" abre e `predPoder` não muda

#### Scenario: Todas as Disciplinas dos Predadores têm catálogo
- **WHEN** qualquer um dos 16 Predadores é escolhido com qualquer uma das suas Disciplinas
- **THEN** o painel mostra o slot e pelo menos um cartão de poder

### Requirement: Nome da especialidade do Predador
No passo 6, com uma especialidade do Predador escolhida ("<Habilidade> (<Nome>)"), o passo SHALL mostrar, logo abaixo dos botões de especialidade, um painel com borda tinta e fundo branco, sem cantos arredondados, contendo:
- à esquerda, uma marca quadrada de 40×40px: fundo tinta com "✓" branco quando o nome está preenchido; borda tracejada Blood e vazia quando o nome está vazio;
- o rótulo "Especialidade em <Habilidade>" (Karla maiúsculo, tinta 60%), associado ao campo;
- um campo de texto (Cormorant, grande) com o nome da especialidade, gravado em `predEspecNome`;
- abaixo do campo, a dica "Sugestão do Predador: <Nome>. Renomeie se quiser; na ficha ela fica fixa." em tinta suave.

Escolher uma especialidade (inclusive a primeira escolha) MUST preencher `predEspecNome` com o nome sugerido dela; tocar na especialidade já escolhida MUST NOT mudar o nome digitado. Ao abrir o passo 6 com `predEspec` gravado e sem `predEspecNome` (fichas antigas), o campo MUST vir com o nome sugerido. O nome MUST ser gravado aparado junto com os demais campos do passo 6, e `applyPredator` MUST NOT depender dele.

#### Scenario: Escolher a especialidade preenche a sugestão
- **WHEN** o Predador é "Extorsionário" e o usuário toca em "Ladroagem (Segurança)"
- **THEN** aparece o painel "Especialidade em Ladroagem" com o campo "Segurança", a marca tinta com "✓" e a dica "Sugestão do Predador: Segurança. Renomeie se quiser; na ficha ela fica fixa."

#### Scenario: Renomear no assistente
- **WHEN** o usuário troca "Segurança" por "Cofres e alarmes" e conclui o passo 6
- **THEN** a ficha grava `predEspec: "Ladroagem (Segurança)"` e `predEspecNome: "Cofres e alarmes"`

#### Scenario: Trocar de especialidade repõe a sugestão
- **WHEN** o campo tem "Cofres e alarmes" e o usuário toca na outra especialidade "Intimidação (Coerção)"
- **THEN** o painel passa a "Especialidade em Intimidação" com o campo "Coerção"

#### Scenario: Nome vazio
- **WHEN** o usuário apaga todo o texto do campo
- **THEN** a marca fica com borda tracejada Blood e sem "✓"

#### Scenario: Ficha antiga sem nome
- **WHEN** a ficha tem "Extorsionário" com `predEspec: "Intimidação (Coerção)"` sem `predEspecNome` e o usuário refaz o passo 6
- **THEN** o painel mostra o campo "Coerção"

### Requirement: Perdição do clã gravada na ficha
Ao salvar o passo 1 (e ao concluir o assistente), a ficha SHALL gravar em `perdicao` o texto da Perdição do clã escolhido, no formato `<nome da Perdição> — <descrição>`, usando o nome e a descrição do catálogo de clãs. O texto MUST ser gravado apenas quando `perdicao` está vazio ou é igual ao texto automático de algum clã do catálogo; um texto diferente (editado pelo jogador na aba Resumo) MUST ser preservado. Sem clã válido, `perdicao` MUST NOT ser alterado.

#### Scenario: Perdição preenchida após o cadastro
- **WHEN** o jogador escolhe "Brujah" no passo 1 e conclui o assistente
- **THEN** a aba Resumo mostra em "Perdição do Clã" o texto "Temperamento Violento — " seguido da descrição da Perdição Brujah

#### Scenario: Trocar de clã atualiza o texto automático
- **WHEN** a ficha tem em `perdicao` o texto automático de "Brujah" e o jogador, no passo 1, troca para "Gangrel" e avança
- **THEN** `perdicao` passa a ter o texto automático de "Gangrel"

#### Scenario: Texto editado pelo jogador é preservado
- **WHEN** a ficha tem em `perdicao` um texto escrito pelo jogador e o passo 1 é salvo com outro clã
- **THEN** `perdicao` mantém o texto do jogador

#### Scenario: Clã sem Perdição própria
- **WHEN** o jogador escolhe "Sangue-ralo" e avança do passo 1
- **THEN** `perdicao` recebe "Sangue-ralo — " seguido da descrição do catálogo

