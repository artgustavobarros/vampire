## MODIFIED Requirements

### Requirement: Passo 7 — Vantagens e defeitos
O passo SHALL escolher vantagens e defeitos por um combobox de busca sobre o catálogo (`web/src/data/merits/`) e mostrar os escolhidos numa lista abaixo dele. No topo, o passo MUST mostrar "X/7 pts em vantagens" e "Y/2 pts em defeitos", o texto da regra ("Distribua 7 pontos em Vantagens e adquira 2 pontos de Defeitos além daqueles obtidos do seu Tipo de Predador.") e uma linha de status: "Falta: " com os itens pendentes separados por " · " (ex.: "distribuir 3 pts em vantagens", "remover 1 pts de defeitos"), ou "Distribuição completa." em Moss `#2F6B3C`. Os defeitos do Predador MUST NOT entrar na soma.

Combobox:
- acima do campo, três abas com `aria-pressed`: "Todos" (padrão), "Vantagens" e "Defeitos"; a aba ativa tem fundo tinta e texto branco, as outras só contorno;
- o campo tem o placeholder "Buscar vantagem ou defeito…", um ícone de lupa à esquerda e, à direita, "N opções" com o número de opções visíveis;
- ao focar ou digitar, MUST abrir abaixo do campo uma lista (`role="listbox"`) com altura máxima e rolagem, agrupada por categoria na ordem do catálogo, com o cabeçalho de cada grupo fixo no topo durante a rolagem ("Antecedente" aparece como "Antecedentes"; os sub-itens de cada Antecedente aparecem num grupo "Antecedente · <Antecedente>" logo depois do grupo "Antecedentes");
- cada opção MUST mostrar o nome, a faixa de pontos em pontinhos ("•" para custo fixo de 1, "••" para custo fixo de 2, "•–•••••" para faixa de 1 a 5, "••/••••" para valores não contíguos, "—" para custo 0), a marca "Na ficha" em Moss quando já está na lista de escolhidos, o selo do tipo à direita ("Vantagem" ou "Qualidade SR" em Moss, "Defeito" ou "Defeito SR" em Blood) a descrição do catálogo numa linha e, para itens com `requires.merit`, a nota "Exige <Antecedente> <pontinhos do mínimo>";
- a busca MUST ignorar maiúsculas e acentos e comparar com nome, aliases (inclusive o nome em inglês), categoria e descrição; a aba "Vantagens" mostra só `vantagem` e `qualidade-sr`, a aba "Defeitos" só `defeito` e `defeito-sr`;
- o campo MUST seguir o padrão ARIA combobox: seta para baixo/cima move a opção ativa (destacada com filete tinta à esquerda e fundo `field`), Enter escolhe a opção ativa, Esc fecha a lista, clicar fora fecha a lista;
- escolher uma opção que não está na ficha MUST acrescentar uma linha com o nome e o tipo do catálogo e os pontos mínimos permitidos (o custo fixo, ou o primeiro valor da faixa), limpar a busca e fechar a lista; escolher uma opção marcada "Na ficha" MUST NOT acrescentar outra linha;
- quando a busca tem texto e nenhum nome ou alias do catálogo é igual a ele (sem diferença de maiúsculas e acentos), a lista MUST terminar com "Adicionar “<texto>” como vantagem" e "Adicionar “<texto>” como defeito", que acrescentam uma linha fora do catálogo com esse nome, o tipo escolhido e 1 ponto;
- sem resultados nem texto de busca, a lista mostra "Nenhuma opção nesta aba.".

Lista de escolhidos: cada linha MUST mostrar o selo do tipo, o nome como gatilho do painel lateral do mérito (ver `trait-info`), a legenda "<Categoria> · <faixa>" (ou "Fora do catálogo" para nomes que `findMerit` não encontra), um `DotRating` pequeno que só aceita os valores permitidos do item (1 a 5 para itens fora do catálogo; até 6 para Aliados; itens de custo 0 mostram "—" sem `DotRating`) e o botão "Remover". O selo de um item do catálogo MUST ser fixo; o selo de um item fora do catálogo MUST ser alternável como antes. Sem linhas, o passo MUST mostrar "Nenhum mérito ou defeito" com a explicação "Busque acima e escolha no catálogo. Vantagens custam pontos; defeitos devolvem pontos.".

Para Sangue Fraco:
- as Qualidades SR MUST aparecer na aba "Vantagens" e os Defeitos SR na aba "Defeitos", no grupo "Sangue-ralo"; para outros clãs essas opções MUST NOT aparecer;
- o selo de um item fora do catálogo MUST ciclar Vantagem → Defeito → Qualidade SR → Defeito SR (Qualidade SR em Moss, Defeito SR em Blood);
- o topo MUST mostrar também "N qualidades · N defeitos de sangue-ralo" (conta linhas, não pontos);
- a regra MUST acrescentar "Sangues-ralos devem adquirir entre uma e três Qualidades de Sangue-Ralo e a mesma quantidade de Defeitos de Sangue-Ralo.";
- o status MUST cobrar de 1 a 3 Qualidades SR e o mesmo número de Defeitos SR.

Opções por clã e Disciplinas (ver `v5-merits-catalog`, `meritOptions`): o grupo "Caitiff" MUST aparecer só para Caitiff; itens com `excludeClans` MUST NOT aparecer para esses clãs ("Fazendeiro" some para Ventrue); as Falhas de Disciplina Enraizada MUST aparecer só para as Disciplinas escolhidas no Passo 5, lidas como contexto; o grupo "Carniçais" MUST NOT aparecer.

Pré-requisitos no status: o status MUST acrescentar às pendências, na ordem das linhas, "<Item> exige <Antecedente> <pontinhos>" quando o Antecedente de `requires.merit` não está na lista ou tem menos pontos que o mínimo; "<Clã> não pode ter <Item>" quando a linha é de um item que o clã atual não pode ter (`clans`/`excludeClans`); e "<Item> exige a Disciplina <Disciplina>" quando a Disciplina de `requires.discipline` não está no Passo 5. Itens de custo 0 MUST NOT entrar nas somas.

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

#### Scenario: Sub-vantagem agrupada sob o Antecedente
- **WHEN** o usuário digita "biblioteca"
- **THEN** "Biblioteca" aparece no grupo "Antecedente · Refúgio" com a nota "Exige Refúgio •"

#### Scenario: Pré-requisito pendente
- **WHEN** a lista tem "Zerado" e "Máscara" com 1 ponto
- **THEN** o status traz "Zerado exige Máscara ••" e o passo não fica completo

#### Scenario: Pré-requisito cumprido
- **WHEN** a lista tem "Zerado" e "Máscara" com 2 pontos, com vantagens somando 7 e defeitos 2
- **THEN** o status mostra "Distribuição completa."

#### Scenario: Clã trocado depois da escolha
- **WHEN** a lista tem "Fazendeiro" e o usuário troca o clã para "Ventrue" no passo 1 e volta ao passo 7
- **THEN** a opção "Fazendeiro" não aparece no combobox e o status traz "Ventrue não pode ter Fazendeiro"

#### Scenario: Falha Enraizada
- **WHEN** o clã é "Brujah" com Potência e Presença no Passo 5 e o usuário escolhe "Instinto Assassino"
- **THEN** a linha mostra a faixa "—", sem `DotRating`, e os totais de defeitos não mudam

#### Scenario: Busca pelo nome em inglês
- **WHEN** o usuário digita "unbondable"
- **THEN** "Inquebrantável" aparece na lista

#### Scenario: Aliados até 6
- **WHEN** o usuário escolhe "Aliados"
- **THEN** a linha é criada com 2 pontos e o `DotRating` aceita de 2 a 6

### Requirement: Validação por passo
"Continuar" e "Concluir" SHALL validar só os campos do passo atual contra o schema zod daquele passo. Se o passo for inválido, o assistente MUST continuar no passo, disparar um toast de erro com rótulo "Passo incompleto" contendo as mensagens de erro do passo e levar o foco ao primeiro campo com erro. As mensagens MUST ser únicas (sem repetir a mesma frase); com mais de 3, o toast MUST mostrar as 3 primeiras e "e mais N.". Os passos 5, 6 e 7 MUST ler o clã como contexto, sem gravá-lo, e o passo 6 MUST ler também a Geração do passo 1 e as Disciplinas do passo 5 como contexto, sem gravá-las. As regras são:
- Passo 1: clã e geração obrigatórios.
- Passo 2: todos os nove atributos entre 1 e 4, com exatamente um em 4, três em 3, um em 1 e o resto em 2.
- Passo 3: distribuição escolhida, com todos os níveis completos e nenhuma habilidade num nível fora da distribuição. A mensagem MUST dizer, por nível, quantas faltam ou sobram (ex.: "Nível 3: falta 1.") e listar as habilidades fora do formato com o nível (ex.: "Fora do formato: Briga (4).").
- Passo 4: especialidade preenchida para cada habilidade obrigatória com pontos; sem nenhuma, uma habilidade com pontos e uma especialidade livre.
- Passo 5: para Sangue Fraco, sempre válido. Para os demais: duas disciplinas diferentes, ambas do clã (qualquer uma para Caitiff), com níveis 2 e 1, e nenhum poder marcado acima do nível da disciplina.
- Passo 6: para Sangue Fraco, sempre válido. Para os demais: tipo de predador, especialidade do predador e disciplina do predador escolhidos, com a especialidade e a Disciplina entre as opções do Predador (uma Disciplina gravada fora das opções conta como não escolhida: "Escolha uma disciplina"); o Predador disponível para o clã e a Geração, lidos como contexto do passo 1 (mensagem igual ao motivo do cartão, ex.: "Ventrue não pode ser Fazendeiro"); a Disciplina do Predador permitida para o clã ("Feitiçaria de Sangue: só Tremere e Banu Haqim"); `predEspecNome` preenchido, sem contar espaços ("Informe o nome da especialidade do Predador"); `predPoder` MUST ser um dos poderes elegíveis da Disciplina (ver "Poder do Predador") ("Escolha um poder de <Disciplina>"); e todas as escolhas de ajuste do Predador completas: no modo `uma`, uma opção escolhida ("Escolha uma opção: <rótulo>"); no modo `dividir`, os pontos das opções somando exatamente o total ("Distribua N pontos entre <opções separadas por " e ">").
- Passo 7: cada linha com nome preenchido e pontos entre os valores permitidos do item do catálogo (de 0 a 6), ou de 1 a 5 para itens fora do catálogo; pré-requisitos, restrições de clã e Disciplinas exigidas cumpridos (ver "Passo 7 — Vantagens e defeitos"); vantagens somando exatamente 7 e defeitos exatamente 2 (sem contar tipos SR); para Sangue Fraco, também de 1 a 3 Qualidades SR e o mesmo número de Defeitos SR. A mensagem MUST ser a mesma da linha de status.
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
