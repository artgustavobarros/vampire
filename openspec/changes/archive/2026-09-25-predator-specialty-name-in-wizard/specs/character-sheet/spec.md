## MODIFIED Requirements

### Requirement: Especialidades na aba Ficha
Na seção Habilidades da aba Ficha, cada habilidade SHALL exibir abaixo do seu nome as suas especialidades lado a lado numa linha que quebra quando não cabe, cada uma num selo com borda e texto tinta. A lista SHALL juntar as especialidades gravadas para a habilidade no assistente e a especialidade do Predador ("Habilidade (Especialidade)"), sem textos vazios e sem repetições. O selo do Predador MUST usar `predEspecNome` quando a ficha o tem preenchido e, senão (fichas antigas), o nome da lista do Predador. Os pontos da habilidade SHALL continuar na linha do nome. Habilidade sem especialidade SHALL ser exibida sem selos.

Cada selo MUST ser um gatilho (`<button>`) que abre o painel de especialidade (ver trait-info, "Painel de especialidade") sem alterar os pontos. A especialidade do Predador MUST NOT ter estilo, nota ou formulário próprios na ficha: o nome é definido no passo 6 do assistente (ver character-wizard, "Nome da especialidade do Predador") e, para mudá-lo, o jogador refaz o assistente.

#### Scenario: Especialidades do assistente
- **WHEN** a ficha tem Persuasão 4 com as especialidades "Negociação" e "Sedução"
- **THEN** a linha de Persuasão mostra os 4 pontos ao lado do nome e, abaixo do nome, os selos "Negociação" e "Sedução" lado a lado, com borda tinta

#### Scenario: Especialidade do Predador renomeada no assistente
- **WHEN** a ficha tem `predEspec: "Ofícios (Armadilhas)"` e `predEspecNome: "Laços e arapucas"`
- **THEN** a linha de Ofícios mostra o selo "Laços e arapucas" com borda e texto tinta

#### Scenario: Ficha antiga sem nome gravado
- **WHEN** a ficha tem `predEspec: "Intimidação (Chantagem)"` sem `predEspecNome`
- **THEN** a linha de Intimidação mostra o selo "Chantagem" com borda e texto tinta

#### Scenario: Selo do Predador sem formulário
- **WHEN** o usuário abre o selo da especialidade do Predador
- **THEN** o painel mostra a descrição da especialidade sem nota do Predador e sem formulário de renomear

#### Scenario: Sem repetição
- **WHEN** a mesma especialidade vem do assistente e do Predador para a mesma habilidade
- **THEN** o selo aparece uma só vez

#### Scenario: Habilidade sem especialidade
- **WHEN** Briga não tem especialidades
- **THEN** a linha de Briga não mostra selos
