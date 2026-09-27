## ADDED Requirements

### Requirement: Nome da especialidade do Predador
No passo 6, com uma especialidade do Predador escolhida ("<Habilidade> (<Nome>)"), o passo SHALL mostrar, logo abaixo dos botões de especialidade, um painel com borda tinta e fundo branco, sem cantos arredondados, contendo:
- à esquerda, uma marca quadrada de 40×40px: fundo tinta com "✓" branco quando o nome está preenchido; borda tracejada Blood e vazia quando o nome está vazio;
- o rótulo "Especialidade em <Habilidade>" (Karla maiúsculo, tinta 60%), associado ao campo;
- um campo de texto (Cormorant, grande) com o nome da especialidade, gravado em `predEspecNome`;
- abaixo do campo, a dica "Sugestão do Predador: <Nome>. Renomeie se quiser; na ficha ela fica fixa." em tinta suave.

Escolher uma especialidade (inclusive a primeira escolha) MUST preencher `predEspecNome` com o nome sugerido dela; tocar na especialidade já escolhida MUST NOT mudar o nome digitado. Ao abrir o passo 6 com `predEspec` gravado e sem `predEspecNome` (fichas antigas), o campo MUST vir com o nome sugerido. O nome MUST ser gravado aparado junto com os demais campos do passo 6, e `applyPredator` MUST NOT depender dele.

#### Scenario: Escolher a especialidade preenche a sugestão
- **WHEN** o Predador é "Extorsionário" e o usuário toca em "Ofícios (Armadilhas)"
- **THEN** aparece o painel "Especialidade em Ofícios" com o campo "Armadilhas", a marca tinta com "✓" e a dica "Sugestão do Predador: Armadilhas. Renomeie se quiser; na ficha ela fica fixa."

#### Scenario: Renomear no assistente
- **WHEN** o usuário troca "Armadilhas" por "Laços e arapucas" e conclui o passo 6
- **THEN** a ficha grava `predEspec: "Ofícios (Armadilhas)"` e `predEspecNome: "Laços e arapucas"`

#### Scenario: Trocar de especialidade repõe a sugestão
- **WHEN** o campo tem "Laços e arapucas" e o usuário toca na outra especialidade "Intimidação (Chantagem)"
- **THEN** o painel passa a "Especialidade em Intimidação" com o campo "Chantagem"

#### Scenario: Nome vazio
- **WHEN** o usuário apaga todo o texto do campo
- **THEN** a marca fica com borda tracejada Blood e sem "✓"

#### Scenario: Ficha antiga sem nome
- **WHEN** a ficha tem `predEspec: "Intimidação (Chantagem)"` sem `predEspecNome` e o usuário refaz o passo 6
- **THEN** o painel mostra o campo "Chantagem"

## MODIFIED Requirements

### Requirement: Passo 6 — Predador
O passo SHALL listar os 12 tipos de predador em cartões e, para o escolhido, oferecer a escolha de uma especialidade entre duas, um ponto de disciplina entre duas com a escolha de um poder, e listar os ajustes obrigatórios. Os ajustes MUST vir da lista estruturada do Predador em `data/predators.ts`, cada um com tipo (`humanidade`, `potencia`, `merito`, `escolha` ou `nota`), valores e rótulo; o passo MUST exibir o rótulo e colorir o filete pelo tipo: ganho (Humanidade ou Potência positivas, `merito`/`escolha` de vantagem) em Moss, custo (Humanidade negativa, `merito`/`escolha` de defeito, `nota`) em Blood. Cada ajuste do tipo `escolha` MUST mostrar, abaixo do rótulo, um seletor: no modo `uma`, um botão por opção, com uma só selecionada; no modo `dividir`, um `DotRating` por opção com o total de pontos do ajuste como máximo e a soma entre as opções limitada a esse total. As escolhas MUST ser gravadas em `predEscolhas` (id do ajuste → pontos por opção). Trocar de Predador MUST limpar `predEspec`, `predEspecNome`, `predDisc`, `predPoder` e `predEscolhas`. Para Sangue Fraco, o passo MUST esconder os cartões e mostrar só o aviso "Sangues-ralos não têm Tipo de Predador. Siga para o próximo passo."; ao salvar o passo, `predador`, `predEspec`, `predEspecNome`, `predDisc`, `predPoder` e `predEscolhas` MUST ser gravados vazios.

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
- **THEN** `predEscolhas` fica vazio, `predEspecNome` e `predPoder` ficam vazios e nenhum seletor do Osíris vem marcado

#### Scenario: Sangue-ralo sem Predador
- **WHEN** o clã é "Sangue Fraco"
- **THEN** nenhum cartão de predador aparece, só o aviso, e "Continuar" avança

#### Scenario: Predador antigo apagado
- **WHEN** a ficha tinha "Sereia" gravado, o clã passou a ser "Sangue Fraco" e o usuário avança do passo 6
- **THEN** a ficha é gravada com `predador`, `predEspec`, `predEspecNome`, `predDisc`, `predPoder` e `predEscolhas` vazios

### Requirement: Validação por passo
"Continuar" e "Concluir" SHALL validar só os campos do passo atual contra o schema zod daquele passo. Se o passo for inválido, o assistente MUST continuar no passo, disparar um toast de erro com rótulo "Passo incompleto" contendo as mensagens de erro do passo e levar o foco ao primeiro campo com erro. As mensagens MUST ser únicas (sem repetir a mesma frase); com mais de 3, o toast MUST mostrar as 3 primeiras e "e mais N.". Os passos 5, 6 e 7 MUST ler o clã como contexto, sem gravá-lo, e o passo 6 MUST ler também as Disciplinas do passo 5 como contexto, sem gravá-las. As regras são:
- Passo 1: clã e geração obrigatórios.
- Passo 2: todos os nove atributos entre 1 e 4, com exatamente um em 4, três em 3, um em 1 e o resto em 2.
- Passo 3: distribuição escolhida, com todos os níveis completos e nenhuma habilidade num nível fora da distribuição. A mensagem MUST dizer, por nível, quantas faltam ou sobram (ex.: "Nível 3: falta 1.") e listar as habilidades fora do formato com o nível (ex.: "Fora do formato: Briga (4).").
- Passo 4: especialidade preenchida para cada habilidade obrigatória com pontos; sem nenhuma, uma habilidade com pontos e uma especialidade livre.
- Passo 5: para Sangue Fraco, sempre válido. Para os demais: duas disciplinas diferentes, ambas do clã (qualquer uma para Caitiff), com níveis 2 e 1, e nenhum poder marcado acima do nível da disciplina.
- Passo 6: para Sangue Fraco, sempre válido. Para os demais: tipo de predador, especialidade do predador e disciplina do predador escolhidos; `predEspecNome` preenchido, sem contar espaços ("Informe o nome da especialidade do Predador"); quando a Disciplina do Predador tem poderes elegíveis (ver "Poder do Predador"), `predPoder` MUST ser um deles ("Escolha um poder de <Disciplina>"); e todas as escolhas de ajuste do Predador completas: no modo `uma`, uma opção escolhida ("Escolha uma opção: <rótulo>"); no modo `dividir`, os pontos das opções somando exatamente o total ("Distribua N pontos entre <opções separadas por " e ">").
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

#### Scenario: Nome da especialidade do Predador obrigatório
- **WHEN** o Predador é "Extorsionário" com "Intimidação (Chantagem)" escolhida, o usuário apaga o nome da especialidade e clica "Continuar"
- **THEN** o passo 6 continua visível e o toast "Passo incompleto" traz "Informe o nome da especialidade do Predador"
