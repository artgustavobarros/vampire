## MODIFIED Requirements

### Requirement: Assistente em 8 passos
O assistente SHALL guiar a criação em 8 passos, nesta ordem: Clã e senhor; Atributos; Habilidades; Especialidades; Disciplinas; Predador; Vantagens e defeitos; Detalhes finais. Cada passo MUST mostrar título, dica em itálico, "Passo N de 8" e uma barra de progresso com 8 segmentos preenchidos até o passo atual. Os valores de um passo MUST ser gravados na ficha quando o passo é validado em "Continuar" ou "Concluir", e MUST ser gravados sem validação ao clicar "Voltar". Alterações dentro de um passo não são gravadas a cada tecla.

#### Scenario: Navegar para frente
- **WHEN** o passo 3 está válido e o usuário clica "Continuar"
- **THEN** os valores do passo 3 são gravados na ficha, o passo 4 é exibido e 4 segmentos da barra ficam preenchidos

#### Scenario: Voltar grava sem validar
- **WHEN** o usuário está no passo 2 com a distribuição de atributos incompleta e clica "Voltar"
- **THEN** o passo 1 é exibido e os atributos digitados no passo 2 ficam gravados na ficha

#### Scenario: Voltar do primeiro passo
- **WHEN** o usuário clica "Voltar" no passo 1
- **THEN** volta para a ficha se estiver no modo refazer, ou sai e vai para a tela de entrada caso contrário

#### Scenario: Concluir
- **WHEN** o passo 8 está válido e o usuário clica "Concluir"
- **THEN** a ficha é gravada com `criada: true`, disciplinas sem nome são descartadas e a ficha abre na aba Ficha

#### Scenario: Refazer personagem
- **WHEN** o usuário escolhe "Refazer personagem" no menu da ficha
- **THEN** o assistente abre no passo 1 em modo refazer, com os dados atuais preenchidos

## ADDED Requirements

### Requirement: Formulário único do assistente
O assistente SHALL ser um único formulário `react-hook-form` que cobre os 8 passos, com valores iniciais tirados da ficha atual. Os campos MUST usar o componente `Field` do shadcn (rótulo, descrição e erro). Os controles próprios (`DotRating`, cartões selecionáveis, seletores) MUST estar ligados ao formulário. Um campo com erro MUST exibir `aria-invalid="true"` e a mensagem de erro logo abaixo dele.

#### Scenario: Valores iniciais da ficha
- **WHEN** o assistente abre para uma ficha com clã "Brujah" e nome "Ana"
- **THEN** o cartão "Brujah" aparece selecionado no passo 1 e o campo nome mostra "Ana" no passo 8

#### Scenario: Valores preservados entre passos
- **WHEN** o usuário digita o nome do senhor no passo 1, avança até o passo 3 e volta ao passo 1
- **THEN** o campo do senhor mantém o valor digitado

### Requirement: Validação por passo
"Continuar" e "Concluir" SHALL validar só os campos do passo atual contra o schema zod daquele passo. Se o passo for inválido, o assistente MUST continuar no passo, mostrar as mensagens de erro e levar o foco ao primeiro campo com erro. As regras são:
- Passo 1: clã e geração obrigatórios.
- Passo 2: todos os nove atributos entre 1 e 5, com exatamente um em 4, três em 3, um em 1 e o resto em 2.
- Passo 3: distribuição escolhida e com todos os níveis completos.
- Passo 4: especialidade preenchida para cada habilidade obrigatória com pontos; sem nenhuma, uma habilidade com pontos e uma especialidade livre.
- Passo 5: duas disciplinas diferentes, cada uma com nível ≥ 1, e nenhum poder marcado acima do nível da disciplina.
- Passo 6: tipo de predador, especialidade do predador e disciplina do predador escolhidos.
- Passo 7: cada linha com nome preenchido e pontos de 1 a 5 (a lista pode ficar vazia).
- Passo 8: nome do personagem obrigatório.

#### Scenario: Clã não escolhido
- **WHEN** o usuário clica "Continuar" no passo 1 sem escolher clã
- **THEN** o passo 1 continua visível e aparece "Escolha um clã"

#### Scenario: Cota de atributos excedida
- **WHEN** dois atributos estão em 4 e o usuário clica "Continuar" no passo 2
- **THEN** o passo 2 continua visível e aparece uma mensagem dizendo que alguma cota foi excedida

#### Scenario: Distribuição de habilidades incompleta
- **WHEN** a distribuição "Equilibrado" está escolhida com apenas 2 habilidades em 3 e o usuário clica "Continuar"
- **THEN** o passo 3 continua visível com a mensagem de distribuição incompleta

#### Scenario: Especialidade obrigatória vazia
- **WHEN** o personagem tem Ofícios 2, o campo de Ofícios está vazio e o usuário clica "Continuar" no passo 4
- **THEN** o campo "Ofícios" mostra "Informe uma especialidade"

#### Scenario: Disciplinas repetidas
- **WHEN** as duas disciplinas escolhidas são "Potência" e o usuário clica "Continuar" no passo 5
- **THEN** o passo 5 continua visível com a mensagem "Escolha duas disciplinas diferentes"

#### Scenario: Predador incompleto
- **WHEN** "Sereia" está escolhido sem disciplina do predador e o usuário clica "Continuar"
- **THEN** o passo 6 continua visível e o grupo de disciplina mostra "Escolha uma disciplina"

#### Scenario: Mérito sem nome
- **WHEN** existe uma linha de vantagem sem nome e o usuário clica "Continuar" no passo 7
- **THEN** o campo nome dessa linha mostra "Informe o nome"

#### Scenario: Concluir sem nome
- **WHEN** o nome do personagem está vazio e o usuário clica "Concluir"
- **THEN** o passo 8 continua visível, a ficha continua com `criada: false` e o campo nome mostra "Informe o nome do personagem"

#### Scenario: Erro some ao corrigir
- **WHEN** o erro "Escolha um clã" está visível e o usuário seleciona "Toreador"
- **THEN** a mensagem de erro some

### Requirement: Sem pular passos
O assistente SHALL abrir no máximo o primeiro passo cujos dados gravados na ficha ainda não passam no schema. Um `?passo=N` além desse passo MUST ser trocado pelo primeiro passo incompleto.

#### Scenario: Pular pela URL
- **WHEN** a ficha só tem os passos 1 e 2 válidos e o usuário abre `/criar?passo=6`
- **THEN** o assistente abre no passo 3

#### Scenario: Voltar é sempre permitido
- **WHEN** a ficha tem os passos 1 a 4 válidos e o usuário abre `/criar?passo=2`
- **THEN** o assistente abre no passo 2

### Requirement: Um personagem por jogador
Cada jogador SHALL ter no máximo um personagem, guardado em `vtm5.sheet.<email>`. Com a ficha já criada (`criada: true`), `/criar` MUST redirecionar para a ficha, exceto no modo refazer (`refazer=true`), que edita o mesmo personagem e, ao concluir, substitui a ficha existente.

#### Scenario: Criar com personagem existente
- **WHEN** o jogador tem a ficha criada e abre `/criar?passo=1`
- **THEN** é redirecionado para a aba Ficha

#### Scenario: Primeira criação
- **WHEN** o jogador não tem ficha criada e abre `/criar?passo=1`
- **THEN** o assistente abre no passo 1

#### Scenario: Refazer substitui o mesmo personagem
- **WHEN** o jogador refaz o personagem, troca o nome para "Bruno" e conclui
- **THEN** a mesma ficha em `vtm5.sheet.<email>` passa a ter o nome "Bruno" e nenhuma outra ficha é criada
