## MODIFIED Requirements

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
