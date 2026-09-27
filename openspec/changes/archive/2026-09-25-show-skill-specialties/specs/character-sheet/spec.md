## ADDED Requirements

### Requirement: Especialidades na aba Ficha
Na seção Habilidades da aba Ficha, cada habilidade SHALL exibir abaixo do seu nome as suas especialidades lado a lado numa linha que quebra quando não cabe, cada uma num selo só de leitura com borda. A lista SHALL juntar as especialidades gravadas para a habilidade no assistente e a especialidade do Predador ("Habilidade (Especialidade)"), sem textos vazios e sem repetições. Os pontos da habilidade SHALL continuar na linha do nome. Habilidade sem especialidade SHALL ser exibida sem selos.

#### Scenario: Especialidades do assistente
- **WHEN** a ficha tem Persuasão 4 com as especialidades "Negociação" e "Sedução"
- **THEN** a linha de Persuasão mostra os 4 pontos ao lado do nome e, abaixo do nome, os selos "Negociação" e "Sedução" lado a lado

#### Scenario: Especialidade do Predador
- **WHEN** o Predador escolhido deu "Intimidação (Chantagem)" e Intimidação não tem outra especialidade
- **THEN** a linha de Intimidação mostra o selo "Chantagem"

#### Scenario: Sem repetição
- **WHEN** a mesma especialidade vem do assistente e do Predador para a mesma habilidade
- **THEN** o selo aparece uma só vez

#### Scenario: Habilidade sem especialidade
- **WHEN** Briga não tem especialidades
- **THEN** a linha de Briga não mostra selos
