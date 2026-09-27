## ADDED Requirements

### Requirement: Valores permitidos no DotRating
O `DotRating` SHALL aceitar uma lista opcional de valores permitidos. Quando a lista é dada, cada ponto acima do maior valor da lista MUST ser desenhado com borda tracejada em `ink/25`, sem preenchimento, e MUST ficar desativado (`disabled`, fora da ordem de foco). Um clique que levaria a um valor fora da lista (inclusive diminuir abaixo do menor valor) MUST NOT chamar `onChange`. Sem a lista, o comportamento é o atual.

#### Scenario: Custo fixo
- **WHEN** um `DotRating` com valor 2 recebe os valores permitidos `[2]`
- **THEN** os dois primeiros pontos aparecem preenchidos, os três restantes tracejados e desativados, e clicar no segundo ponto não altera o valor

#### Scenario: Faixa com mínimo
- **WHEN** um `DotRating` com valor 1 recebe os valores permitidos `[1, 2, 3, 4, 5]` e o usuário clica no primeiro ponto
- **THEN** o valor continua 1

#### Scenario: Faixa parcial
- **WHEN** um `DotRating` com valor 1 recebe os valores permitidos `[1, 2]` e o usuário clica no segundo ponto
- **THEN** o valor passa a 2 e os pontos 3 a 5 aparecem tracejados
