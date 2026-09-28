## MODIFIED Requirements

### Requirement: Assistente em 8 passos
O assistente SHALL guiar a criação em 8 passos, nesta ordem: Clã e senhor; Atributos; Habilidades; Especialidades; Disciplinas; Predador; Vantagens e defeitos; Detalhes finais. Cada passo MUST mostrar título, dica em itálico, "Passo N de 8" e uma barra de progresso com 8 segmentos preenchidos até o passo atual. Os valores de um passo MUST ser gravados na ficha quando o passo é validado em "Continuar" ou "Concluir", e MUST ser gravados sem validação ao clicar "Voltar". Alterações dentro de um passo não são gravadas a cada tecla. O assistente MUST NOT ter modo de refazer: ele só existe enquanto a ficha não está criada.

#### Scenario: Navegar para frente
- **WHEN** o passo 3 está válido e o usuário clica "Continuar"
- **THEN** os valores do passo 3 são gravados na ficha, o passo 4 é exibido e 4 segmentos da barra ficam preenchidos

#### Scenario: Voltar grava sem validar
- **WHEN** o usuário está no passo 2 com a distribuição de atributos incompleta e clica "Voltar"
- **THEN** o passo 1 é exibido e os atributos digitados no passo 2 ficam gravados na ficha

#### Scenario: Voltar do primeiro passo
- **WHEN** o usuário clica "Voltar" no passo 1
- **THEN** sai e vai para a tela de entrada

#### Scenario: Concluir
- **WHEN** o passo 8 está válido e o usuário clica "Concluir"
- **THEN** a ficha é gravada com `criada: true`, disciplinas sem nome são descartadas e a ficha abre na aba Características

### Requirement: Predador aplicado ao concluir
Ao clicar "Concluir" no passo 8, o assistente SHALL aplicar o Predador escolhido por cima dos valores finais da ficha montada pelos 8 passos, na mesma gravação que marca a ficha como criada:
- **Disciplina**: a Disciplina de `predDisc` MUST ganhar 1 ponto se já existir na ficha (em qualquer posição), até o limite de 5; se não existir, MUST ser acrescentada à ficha com nível 1. Quando `predPoder` corresponde a um poder do catálogo dessa Disciplina, o poder MUST ser acrescentado aos poderes dela com nome, nível, custo, duração, descrição e Rouse do catálogo, mantendo a ordem por nível; sem `predPoder`, a Disciplina acrescentada fica sem poderes.
- **Humanidade**: a soma dos ajustes `humanidade` MUST ser somada à Humanidade da ficha, limitada entre 0 e 10.
- **Potência de Sangue**: a soma dos ajustes `potencia` MUST ser somada à Potência derivada da Geração, limitada a 10.
- **Vantagens e Defeitos**: cada ajuste `merito` MUST virar uma linha em `meritos` com o tipo e os pontos do ajuste e o nome "<nome> (<detalhe>)" (ou só "<nome>" sem detalhe); cada ajuste `escolha` MUST virar uma linha por opção com pontos em `predEscolhas`, com o tipo do ajuste e os pontos escolhidos. Linhas do Predador com o mesmo nome e o mesmo tipo MUST virar uma linha só, com os pontos somados. Essas linhas MUST ser marcadas com `origem: "predador"` e MUST NOT entrar nas somas de 7 vantagens e 2 defeitos.

A aplicação MUST ficar registrada na ficha em `predBonus`, que guarda só a Potência somada pelo Predador (`{ potencia }`) e marca que o Predador já foi aplicado. Uma ficha que já tem `predBonus` ou linhas de mérito com `origem: "predador"` MUST NOT receber o Predador de novo. Sangue Fraco, ou ficha sem Predador, MUST NOT receber nada nem `predBonus`.

#### Scenario: Ponto em Disciplina do clã
- **WHEN** o passo 5 tem Potência 2 e Celeridade 1, o Predador é "Gato de Rua" com Disciplina "Potência" e poder "Força Prodigiosa", e o usuário conclui
- **THEN** a ficha fica com Potência 3 com o poder "Força Prodigiosa" somado aos do passo 5, e Celeridade 1

#### Scenario: Disciplina nova
- **WHEN** o clã é "Brujah", o passo 5 tem Celeridade 2 e Presença 1, o Predador é "Sereia" com Disciplina "Fortitude" e poder "Resiliência", e o usuário conclui
- **THEN** a ficha fica com Celeridade 2, Presença 1 e Fortitude 1 com o poder "Resiliência"

#### Scenario: Disciplina fora do clã com poder
- **WHEN** o clã é "Ventrue", o Predador é "Extorsionário" com Disciplina "Potência" e poder "Toque Letal", e o usuário conclui
- **THEN** a ficha ganha Potência 1 com o poder "Toque Letal" de nível 1

#### Scenario: Humanidade reduzida
- **WHEN** a ficha tem Humanidade 7, o Predador é "Gato de Rua" e o usuário conclui
- **THEN** a ficha fica com Humanidade 6

#### Scenario: Sereia não mexe na Humanidade
- **WHEN** a ficha tem Humanidade 7, o Predador é "Sereia" e o usuário conclui
- **THEN** a ficha continua com Humanidade 7

#### Scenario: Humanidade aumentada
- **WHEN** a ficha tem Humanidade 7, o Predador é "Fazendeiro" e o usuário conclui
- **THEN** a ficha fica com Humanidade 8

#### Scenario: Potência de Sangue do Sanguessuga
- **WHEN** a ficha é de 12ª Geração (Potência 1), o Predador é "Sanguessuga" e o usuário conclui
- **THEN** a Potência de Sangue da ficha passa a ser 2 e a Humanidade cai 1

#### Scenario: Méritos fixos do Predador
- **WHEN** o passo 7 tem 7 pontos de vantagens e 2 de defeitos, o Predador é "Sereia" e o usuário conclui
- **THEN** `meritos` mantém as linhas do passo 7 e ganha "Bonito" (vantagem, 2) e "Inimigo (amante desprezado ou parceiro ciumento)" (defeito, 1), ambas com `origem: "predador"`

#### Scenario: Méritos escolhidos do Predador
- **WHEN** o Predador é "Osíris" com Rebanho 2 e Fama 1, Inimigo 2 e Defeito Mítico 0, e o usuário conclui
- **THEN** `meritos` ganha "Rebanho" (vantagem, 2), "Fama" (vantagem, 1) e "Inimigo" (defeito, 2) com `origem: "predador"`, e nenhuma linha "Defeito Mítico"

#### Scenario: Méritos repetidos somam
- **WHEN** o Predador é "Alçapão" com "Refúgio" na escolha de vantagem e "Refúgio Assustador" na escolha de defeito, e o usuário conclui
- **THEN** `meritos` ganha uma só linha "Refúgio" (vantagem, 2) e "Refúgio Assustador" (defeito, 1), com `origem: "predador"`

#### Scenario: Sangue-ralo sem Predador aplicado
- **WHEN** o clã é "Sangue Fraco" e o usuário conclui
- **THEN** Disciplinas, Humanidade, Potência de Sangue e `meritos` ficam como os passos deixaram e a ficha não tem `predBonus`

### Requirement: Um personagem por jogador
Cada jogador SHALL ter no máximo um personagem, gravado na API como a sua ficha. Com a ficha já criada (`criada: true`), `/criar` MUST redirecionar para a aba Características, ignorando o antigo parâmetro `refazer=true`: depois da criação, Atributos e Habilidades só podem ser alterados pelo Mestre. O Mestre não tem personagem próprio e, ao abrir `/criar`, MUST ser redirecionado para `/personagens`.

#### Scenario: Criar com personagem existente
- **WHEN** o jogador tem a ficha criada e abre `/criar?passo=1`
- **THEN** é redirecionado para a aba Características

#### Scenario: Refazer com personagem existente
- **WHEN** o jogador tem a ficha criada e abre `/criar?passo=1&refazer=true`
- **THEN** é redirecionado para a aba Características e a ficha não muda

#### Scenario: Primeira criação
- **WHEN** o jogador não tem ficha criada e abre `/criar?passo=1`
- **THEN** o assistente abre no passo 1

#### Scenario: Mestre no assistente
- **WHEN** o Mestre abre `/criar?passo=1`
- **THEN** é redirecionado para `/personagens`

## REMOVED Requirements

### Requirement: Refazer sem o Predador aplicado
**Reason**: Com a ficha criada, Atributos e Habilidades só podem ser alterados pelo Mestre, então o jogador não pode mais refazer o personagem; o Mestre edita a ficha direto. Sem o modo refazer, não há mais o que desfazer do Predador.
**Migration**: Pedir ao Mestre para ajustar a ficha pela Lista de personagens. `predBonus` antigo com campos extras (`disciplina`, `humanidade`, `novaDisciplina`, `poder`) continua válido; só `potencia` é lido.
