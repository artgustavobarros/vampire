## ADDED Requirements

### Requirement: Assistente em 8 passos
O assistente SHALL guiar a criação em 8 passos, nesta ordem: Clã e senhor; Atributos; Habilidades; Especialidades; Disciplinas; Predador; Vantagens e defeitos; Detalhes finais. Cada passo MUST mostrar título, dica em itálico, "Passo N de 8" e uma barra de progresso com 8 segmentos preenchidos até o passo atual. Toda alteração MUST ser salva imediatamente na ficha.

#### Scenario: Navegar para frente
- **WHEN** o usuário clica "Continuar" no passo 3
- **THEN** o passo 4 é exibido e 4 segmentos da barra ficam preenchidos

#### Scenario: Voltar do primeiro passo
- **WHEN** o usuário clica "Voltar" no passo 1
- **THEN** volta para a ficha se ela já estava criada, ou para a tela de entrada caso contrário

#### Scenario: Concluir
- **WHEN** o usuário clica "Concluir" no passo 8
- **THEN** a ficha é marcada `criada: true`, disciplinas sem nome são descartadas e a ficha abre na aba Ficha

#### Scenario: Refazer personagem
- **WHEN** o usuário escolhe "Refazer personagem" no menu da ficha
- **THEN** o assistente abre no passo 1 com os dados atuais preenchidos

### Requirement: Passo 1 — Clã e geração
O passo SHALL listar os clãs em cartões selecionáveis (nome e disciplinas do clã), mostrar Perdição e Compulsão do clã escolhido, campos de nome do senhor e afins, e um seletor de Geração (16ª a 4ª) com a nota de Potência de Sangue derivada.

#### Scenario: Escolher clã
- **WHEN** o usuário seleciona "Brujah"
- **THEN** o cartão fica invertido e aparecem "Temperamento Violento" (Perdição) e "Rebeldia" (Compulsão) com suas descrições

#### Scenario: Atributos iniciais em 2
- **WHEN** o usuário avança do passo 1 e todos os atributos ainda valem 1 ou menos
- **THEN** todos os nove atributos passam a valer 2

### Requirement: Passo 2 — Atributos
O passo SHALL exibir os três grupos de atributos com `DotRating` e cotas da distribuição V5: um atributo em 4, três em 3, um em 1 e o restante em 2. Os cartões de cota MUST indicar quanto falta ou excede em cada nível, e a linha de derivados MUST mostrar Vitalidade (Vigor + 3) e Força de Vontade (Autocontrole + Determinação).

#### Scenario: Cota excedida
- **WHEN** o usuário coloca dois atributos em 4
- **THEN** a cota "4" aparece destacada em sangue indicando excesso

#### Scenario: Derivados atualizam
- **WHEN** Vigor passa de 2 para 3
- **THEN** a linha de derivados mostra Vitalidade 6

### Requirement: Passo 3 — Habilidades
O passo SHALL oferecer as distribuições "Faz-tudo" (1×3, 8×2, 10×1), "Equilibrado" (3×3, 5×2, 7×1) e "Especialista" (1×4, 3×3, 3×2, 3×1) em cartões, exibir o progresso por nível e as 27 habilidades em três grupos com `DotRating`.

#### Scenario: Progresso da distribuição
- **WHEN** a distribuição "Equilibrado" está escolhida e o usuário tem 2 habilidades em 3
- **THEN** a linha "3" mostra 2 de 3

### Requirement: Passo 4 — Especialidades
O passo SHALL pedir uma especialidade para cada habilidade obrigatória com pontos (Ciência, Erudição, Ofícios, Performance). Sem nenhuma dessas, MUST oferecer uma especialidade livre: seletor de habilidade com pontos e campo de texto.

#### Scenario: Habilidade obrigatória
- **WHEN** o personagem tem Ofícios 2
- **THEN** aparece um campo "Ofícios · 2" pedindo "Qual especialidade?"

#### Scenario: Especialidade livre
- **WHEN** nenhuma habilidade obrigatória tem pontos
- **THEN** o usuário escolhe uma habilidade com pontos e digita a especialidade

### Requirement: Passo 5 — Disciplinas
O passo SHALL permitir escolher duas disciplinas (as do clã primeiro na lista), definir níveis com `DotRating` e marcar poderes do catálogo até o nível da disciplina, mostrando nome, nível e custo de cada poder. MUST exibir a Potência de Sangue derivada da geração como 10 pontos somente leitura.

#### Scenario: Catálogo limitado pelo nível
- **WHEN** Domínio está com nível 2
- **THEN** somente poderes de nível 1 e 2 de Domínio podem ser marcados

### Requirement: Passo 6 — Predador
O passo SHALL listar os 12 tipos de predador em cartões e, para o escolhido, oferecer a escolha de uma especialidade entre duas, um ponto de disciplina entre duas, e listar os ajustes obrigatórios.

#### Scenario: Escolher Sereia
- **WHEN** o usuário escolhe "Sereia"
- **THEN** aparecem as especialidades "Persuasão (Seduzir)" e "Subterfúgio (Sedução)", as disciplinas "Fascinação" e "Presença" e os ajustes "−1 de Humanidade", "Vantagem Belíssimo ••" e "Defeito Inimigo • (amante preterido)"

### Requirement: Passo 7 — Vantagens e defeitos
O passo SHALL permitir adicionar linhas de mérito ou defeito (alternáveis por um selo), com nome, pontos de 1 a 5 e remoção, mostrando o total de pontos em vantagens e em defeitos e um estado vazio quando não houver linhas.

#### Scenario: Totais
- **WHEN** existem uma vantagem de 3 pontos e um defeito de 2
- **THEN** o topo mostra "3 pts em vantagens" e "2 pts em defeitos"

#### Scenario: Lista vazia
- **WHEN** não há nenhuma linha
- **THEN** aparece "Nenhum mérito ou defeito" com a explicação e o botão "Adicionar"

### Requirement: Passo 8 — Detalhes finais
O passo SHALL exibir os campos restantes de identificação (nome, conceito, crônica, ambição, desejo, etc.) antes de concluir.

#### Scenario: Preencher nome
- **WHEN** o usuário digita o nome do personagem no passo 8
- **THEN** o nome aparece no cabeçalho da ficha após concluir
