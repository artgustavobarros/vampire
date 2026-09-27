## MODIFIED Requirements

### Requirement: Passo 3 — Habilidades
O passo SHALL oferecer as distribuições "Faz-tudo" (1×3, 8×2, 10×1), "Equilibrado" (3×3, 5×2, 7×1) e "Especialista" (1×4, 3×3, 3×2, 3×1) em cartões, exibir o progresso por nível e as 27 habilidades em três grupos com `DotRating`. Habilidades com pontos num nível que a distribuição escolhida não prevê MUST aparecer no progresso numa linha "Fora do formato: N" em Blood; a linha MUST sumir quando N for 0. O progresso exibido e a validação do passo MUST usar a mesma regra, de modo que todas as linhas verdes e nenhuma linha "Fora do formato" signifiquem passo válido.

#### Scenario: Progresso da distribuição
- **WHEN** a distribuição "Equilibrado" está escolhida e o usuário tem 2 habilidades em 3
- **THEN** a linha "3" mostra 2 de 3

#### Scenario: Habilidade fora do formato
- **WHEN** a distribuição "Equilibrado" está escolhida com 3 em 3, 5 em 2, 7 em 1 e "Briga" em 4
- **THEN** as linhas de nível 3, 2 e 1 aparecem completas e a linha "Fora do formato: 1" aparece em Blood

#### Scenario: Distribuição completa avança
- **WHEN** a distribuição "Especialista" está escolhida com 1 em 4, 3 em 3, 3 em 2, 3 em 1 e as demais em 0, e o usuário clica "Continuar"
- **THEN** o assistente vai para o passo 4

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
"Continuar" e "Concluir" SHALL validar só os campos do passo atual contra o schema zod daquele passo. Se o passo for inválido, o assistente MUST continuar no passo, disparar um toast de erro com rótulo "Passo incompleto" contendo as mensagens de erro do passo e levar o foco ao primeiro campo com erro. As mensagens MUST ser únicas (sem repetir a mesma frase); com mais de 3, o toast MUST mostrar as 3 primeiras e "e mais N.". As regras são:
- Passo 1: clã e geração obrigatórios.
- Passo 2: todos os nove atributos entre 1 e 4, com exatamente um em 4, três em 3, um em 1 e o resto em 2.
- Passo 3: distribuição escolhida, com todos os níveis completos e nenhuma habilidade num nível fora da distribuição. A mensagem MUST dizer, por nível, quantas faltam ou sobram (ex.: "Nível 3: falta 1.") e listar as habilidades fora do formato com o nível (ex.: "Fora do formato: Briga (4).").
- Passo 4: especialidade preenchida para cada habilidade obrigatória com pontos; sem nenhuma, uma habilidade com pontos e uma especialidade livre.
- Passo 5: duas disciplinas diferentes, cada uma com nível ≥ 1, e nenhum poder marcado acima do nível da disciplina.
- Passo 6: tipo de predador, especialidade do predador e disciplina do predador escolhidos.
- Passo 7: cada linha com nome preenchido e pontos de 1 a 5 (a lista pode ficar vazia).
- Passo 8: nome do personagem obrigatório.

#### Scenario: Clã não escolhido
- **WHEN** o usuário clica "Continuar" no passo 1 sem escolher clã nem geração
- **THEN** o passo 1 continua visível e aparece um toast "Passo incompleto" com "Escolha um clã" e "Escolha a geração"

#### Scenario: Cota de atributos excedida
- **WHEN** dois atributos estão em 4 e o usuário clica "Continuar" no passo 2
- **THEN** o passo 2 continua visível e aparece um toast dizendo que alguma cota foi excedida

#### Scenario: Distribuição de habilidades incompleta
- **WHEN** a distribuição "Equilibrado" está escolhida com apenas 2 habilidades em 3 e o usuário clica "Continuar"
- **THEN** o passo 3 continua visível e o toast diz "Nível 3: falta 1."

#### Scenario: Habilidade fora do formato bloqueia com motivo
- **WHEN** a distribuição "Equilibrado" está completa, "Briga" está em 4 e o usuário clica "Continuar"
- **THEN** o passo 3 continua visível e o toast diz "Fora do formato: Briga (4)."

#### Scenario: Especialidade obrigatória vazia
- **WHEN** o personagem tem Ofícios 2, o campo de Ofícios está vazio e o usuário clica "Continuar" no passo 4
- **THEN** o campo "Ofícios" fica com `aria-invalid="true"` e o toast mostra "Informe uma especialidade"

#### Scenario: Disciplinas repetidas
- **WHEN** as duas disciplinas escolhidas são "Potência" e o usuário clica "Continuar" no passo 5
- **THEN** o passo 5 continua visível e o toast mostra "Escolha duas disciplinas diferentes"

#### Scenario: Predador incompleto
- **WHEN** "Sereia" está escolhido sem disciplina do predador e o usuário clica "Continuar"
- **THEN** o passo 6 continua visível, o grupo de disciplina fica marcado como inválido e o toast mostra "Escolha uma disciplina"

#### Scenario: Mérito sem nome
- **WHEN** existe uma linha de vantagem sem nome e o usuário clica "Continuar" no passo 7
- **THEN** o campo nome dessa linha fica com `aria-invalid="true"` e o toast mostra "Informe o nome"

#### Scenario: Concluir sem nome
- **WHEN** o nome do personagem está vazio e o usuário clica "Concluir"
- **THEN** o passo 8 continua visível, a ficha continua com `criada: false` e o toast mostra "Informe o nome do personagem"

#### Scenario: Erro some ao corrigir
- **WHEN** o grupo "Clã" está marcado como inválido e o usuário seleciona "Toreador"
- **THEN** a marcação de inválido some

#### Scenario: Clique repetido não empilha toasts
- **WHEN** o usuário clica "Continuar" duas vezes seguidas no passo 1 sem escolher nada
- **THEN** só um toast "Passo incompleto" fica visível
