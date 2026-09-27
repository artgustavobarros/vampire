## MODIFIED Requirements

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
