## MODIFIED Requirements

### Requirement: Especialidades na aba Ficha
Na seção Habilidades da aba Ficha, cada habilidade SHALL exibir abaixo do seu nome as suas especialidades lado a lado numa linha que quebra quando não cabe, cada uma num selo com borda. A lista SHALL juntar as especialidades gravadas para a habilidade no assistente e a especialidade do Predador ("Habilidade (Especialidade)"), sem textos vazios e sem repetições. Quando a ficha tem `predEspecNome`, o selo do Predador MUST usar esse nome no lugar do nome da lista do Predador. Os pontos da habilidade SHALL continuar na linha do nome. Habilidade sem especialidade SHALL ser exibida sem selos.

Cada selo MUST ser um gatilho (`<button>`) que abre o painel de especialidade (ver trait-info, "Painel de especialidade") sem alterar os pontos.

A especialidade do Predador está **pendente** enquanto a ficha tem `predEspec` e não tem `predEspecNome`. O selo pendente MUST usar borda e texto Blood `#7A1220`; os demais selos usam borda e texto tinta. Confirmar o nome no painel MUST gravar `predEspecNome` (o nome novo, aparado, ou o atual em "Manter atual"), deixar o selo com o estilo comum, fechar o painel e exibir um toast de tom `ok` com rótulo "Especialidade" e a mensagem "Especialidade <Nome> fixada em <Habilidade>.". A confirmação MUST acontecer uma única vez: com `predEspecNome` gravado, o selo não é mais pendente.

Gravar o passo 6 do assistente (refazer) com uma especialidade do Predador diferente da gravada MUST apagar `predEspecNome`, deixando a nova especialidade pendente; gravar com a mesma MUST manter `predEspecNome`.

#### Scenario: Especialidades do assistente
- **WHEN** a ficha tem Persuasão 4 com as especialidades "Negociação" e "Sedução"
- **THEN** a linha de Persuasão mostra os 4 pontos ao lado do nome e, abaixo do nome, os selos "Negociação" e "Sedução" lado a lado, com borda tinta

#### Scenario: Especialidade do Predador pendente
- **WHEN** o Predador escolhido deu "Intimidação (Chantagem)", a ficha não tem `predEspecNome` e Intimidação não tem outra especialidade
- **THEN** a linha de Intimidação mostra o selo "Chantagem" com borda e texto Blood

#### Scenario: Renomear a especialidade do Predador
- **WHEN** a especialidade "Chantagem" de Intimidação está pendente e o usuário abre o selo, escreve "Extorsão" e toca em "Confirmar nome"
- **THEN** a ficha grava `predEspecNome: "Extorsão"`, o selo passa a mostrar "Extorsão" com borda tinta, o painel fecha e aparece o toast "Especialidade Extorsão fixada em Intimidação."

#### Scenario: Manter o nome atual
- **WHEN** a especialidade "Chantagem" de Intimidação está pendente e o usuário toca em "Manter atual"
- **THEN** a ficha grava `predEspecNome: "Chantagem"`, o selo fica com borda tinta e aparece o toast "Especialidade Chantagem fixada em Intimidação."

#### Scenario: Só uma vez
- **WHEN** a ficha já tem `predEspecNome` e o usuário abre o selo da especialidade do Predador
- **THEN** o painel mostra a descrição sem o formulário de renomear

#### Scenario: Trocar a especialidade no refazer
- **WHEN** a ficha tem `predEspec: "Intimidação (Chantagem)"` e `predEspecNome: "Extorsão"`, e o usuário refaz o passo 6 escolhendo "Subterfúgio (Golpes)"
- **THEN** a ficha perde `predEspecNome` e o selo "Golpes" de Subterfúgio aparece pendente em Blood

#### Scenario: Sem repetição
- **WHEN** a mesma especialidade vem do assistente e do Predador para a mesma habilidade
- **THEN** o selo aparece uma só vez

#### Scenario: Habilidade sem especialidade
- **WHEN** Briga não tem especialidades
- **THEN** a linha de Briga não mostra selos
