## MODIFIED Requirements

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
