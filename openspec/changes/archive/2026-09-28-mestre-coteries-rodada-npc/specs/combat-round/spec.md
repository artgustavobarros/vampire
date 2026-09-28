## ADDED Requirements

### Requirement: Estado da rodada
A crônica SHALL ter uma única rodada, guardada na API, com:
- o número da rodada (a partir de 1);
- o índice da vez (a partir de 0);
- a ordem: uma lista de participantes, cada um com tipo (`jogador` com o `userId`, ou `inimigo` com o id do bestiário) e iniciativa (número de 0 a 30, ou vazio).

Um participante MUST aparecer no máximo uma vez na ordem. Sem ninguém na ordem, a vez MUST ser 0. As regras de navegação e edição MUST ser funções puras testáveis:

| Ação | Efeito |
|---|---|
| **Próximo** | avança a vez. Depois do último, a vez volta ao primeiro e a rodada soma 1. |
| **Anterior** | volta a vez. Antes do primeiro, vai para o último e a rodada diminui 1. Não faz nada na rodada 1, vez do primeiro. |
| **Reiniciar** | rodada 1, vez do primeiro; a ordem não muda. |
| **Ordenar por iniciativa** | ordena da maior para a menor, iniciativa vazia por último, empates na ordem atual. |
| **↑ / ↓** | troca o participante com o vizinho. |
| **× (remover)** | tira o participante. Se ele estava antes da vez, a vez recua 1. Se era a vez dele, ela passa para quem vem depois, ou para o primeiro se ele era o último, sem mudar a rodada. |
| **Colocar** | acrescenta no fim, sem mudar a vez. |
| **Esvaziar** | ordem vazia, rodada 1, vez 0. |

Em "Ordenar por iniciativa" e "↑ / ↓", a vez MUST continuar com o mesmo participante.

#### Scenario: Virar a rodada
- **WHEN** a rodada é 1, a ordem tem 2 participantes e é a vez do segundo
- **THEN** "Próximo" leva à rodada 2, vez do primeiro

#### Scenario: Voltar da rodada
- **WHEN** a rodada é 2 e é a vez do primeiro de 3 participantes
- **THEN** "Anterior" leva à rodada 1, vez do terceiro

#### Scenario: Ordenar mantém a vez
- **WHEN** a ordem é A (iniciativa 3), B (vazia), C (9), e é a vez de A
- **THEN** "Ordenar por iniciativa" deixa C, A, B com a vez ainda de A

#### Scenario: Remover quem tem a vez
- **WHEN** a ordem é A, B, C, é a vez de B e o Mestre remove B
- **THEN** a ordem fica A, C com a vez de C, na mesma rodada

### Requirement: Aba Rodada do Mestre
A página `/personagens/rodada` SHALL carregar a rodada (`GET /round`), os jogadores (`GET /sheets`) e o bestiário (`GET /enemies`). Enquanto carrega, MUST mostrar "Carregando rodada…"; se falhar, o erro como toast, com a ação "Tentar de novo".

No topo, a página MUST mostrar:
- "Rodada N" em Cormorant grande;
- ao lado, "Vez de <nome>" em Karla caixa-alta suave (omitido com a ordem vazia);
- à direita, os botões "◀ Anterior" (contornado), "Próximo ▶" (fundo `blood`) e "Reiniciar" (contornado). "Próximo" e "Anterior" ficam desabilitados com a ordem vazia, e "Anterior" também na rodada 1, vez do primeiro.

Toda mudança MUST ser gravada em `PUT /round`. A iniciativa é gravada 500 ms depois da última tecla; as demais ações, na hora.

#### Scenario: Avançar a vez
- **WHEN** a ordem tem "Vitória Salles" e "Encourado", é a vez de Vitória, e o Mestre toca em "Próximo ▶"
- **THEN** o título mostra "Rodada 1" e "Vez de Encourado", o cartão de Encourado fica destacado e o estado é gravado em `PUT /round`

#### Scenario: Recarregar mantém a rodada
- **WHEN** o Mestre está na rodada 3 e recarrega a página
- **THEN** a página volta na rodada 3, com a mesma ordem e a mesma vez

### Requirement: Cartões da rodada
Abaixo do topo, a página SHALL mostrar um cartão por participante, na ordem, numa grade de uma coluna no celular, duas a partir de `sm` e três a partir de `md`. Cada cartão MUST ter:
- a posição num quadrado (fundo `ink`; `blood` no da vez);
- o nome em Cormorant ("Inimigo sem nome" se vazio);
- abaixo do nome, o tipo em Karla caixa-alta: "Jogador" em `blood`, ou, para o Mestre, "Inimigo · visível aos jogadores" / "Inimigo · oculto aos jogadores" em texto suave;
- à direita, "Inic." com a iniciativa, ou "—" se vazia.

O cartão da vez MUST ter borda `blood`, sombra e o selo "Vez de agir" (fundo `blood`, texto branco). O conteúdo depende do tipo:
- **Jogador**: "Fome" e o valor, as trilhas "Vitalidade · restante/máximo" e "Força de vontade · restante/máximo", só para leitura, com as marcas de dano da ficha.
- **Inimigo**: as trilhas de Vitalidade e Força de Vontade, as paradas ("<nome> <dados>") e os especiais (nome em Karla `blood`, texto rico limpo abaixo). Na aba do Mestre, tocar numa caixa do inimigo MUST ciclar o dano e gravá-lo no inimigo (`PUT /enemies/<id>`).

#### Scenario: Cartão de jogador
- **WHEN** Vitória Salles (Fome 1, Vitalidade 5/5, Força de vontade 5/5) está na rodada
- **THEN** o cartão mostra "Vitória Salles", "Jogador", "Fome 1" e as duas trilhas vazias

#### Scenario: Dano em inimigo pela rodada
- **WHEN** o Mestre toca na primeira caixa de Vitalidade do cartão de "Encourado"
- **THEN** a caixa fica com dano superficial e o editor do Bestiário mostra o mesmo dano

### Requirement: Ordem da rodada
Abaixo dos cartões, a página SHALL mostrar o painel "Ordem da rodada" (fundo `surface`, borda `line`), com no máximo metade da largura a partir de `md`. Cada linha do painel MUST ter:
- a posição;
- o nome em Cormorant, com o tipo abaixo ("Jogador" em `blood`, "Inimigo" suave);
- um campo numérico de iniciativa;
- os botões "↑" e "↓" (desabilitados no primeiro e no último);
- "×" para remover.

Depois das linhas, o painel MUST ter:
- o seletor "+ Colocar personagem…", com os jogadores de personagem criado que não estão na ordem;
- o seletor "+ Colocar inimigo…", com os inimigos do bestiário que não estão na ordem;
- os botões "Ordenar por iniciativa" (contornado) e "Esvaziar" (contornado, texto `blood`).

Cada seletor MUST ficar desabilitado quando não há opção. "Esvaziar" MUST pedir confirmação ("Esvaziar a rodada?", com "Esvaziar" e "Cancelar"). Com a ordem vazia, o painel MUST mostrar "Ninguém na rodada ainda.".

#### Scenario: Colocar personagem na rodada
- **WHEN** o Mestre escolhe "Vitória Salles" em "+ Colocar personagem…"
- **THEN** Vitória aparece no fim da ordem e dos cartões, sem iniciativa, e some do seletor

#### Scenario: Colocar inimigo pelo seletor
- **WHEN** o Mestre escolhe "Encourado" em "+ Colocar inimigo…"
- **THEN** Encourado aparece no fim da ordem, e o editor dele no Bestiário mostra "Na rodada · tirar"

#### Scenario: Ordenar por iniciativa
- **WHEN** Vitória tem iniciativa 4, Encourado 7, e o Mestre toca em "Ordenar por iniciativa"
- **THEN** a ordem passa a Encourado, Vitória

### Requirement: Aba Rodada do jogador
A aba "Rodada" da ficha do jogador (`/ficha/rodada`) SHALL mostrar a mesma rodada do Mestre, só para leitura:
- o título "Rodada N" e "Vez de <nome>";
- os cartões na ordem, com a vez destacada;
- sem botões, sem campos de iniciativa e sem o painel "Ordem da rodada".

A aba MUST carregar `GET /round` ao abrir e de novo a cada 5 segundos enquanto está aberta e a página está visível, e também quando a página volta a ficar visível. Uma falha periódica MUST NOT abrir toast; só a primeira carga mostra o erro com "Tentar de novo". Com a ordem vazia, a aba MUST mostrar "Nenhum combate em andamento.".

O cartão de inimigo MUST mostrar o nome e o tipo "Inimigo". Se o Mestre não marcou "Jogadores veem os dados", o cartão MUST mostrar só "Dados ocultos pelo Mestre." no lugar das trilhas, paradas e especiais. Esses dados MUST NOT chegar ao navegador do jogador (ver `api-chronicle`).

#### Scenario: Jogador acompanha a vez
- **WHEN** o Mestre toca em "Próximo ▶" e o jogador está com a aba Rodada aberta
- **THEN** em até 5 segundos o cartão destacado na aba do jogador muda para o novo participante

#### Scenario: Inimigo oculto
- **WHEN** "Encourado" está na rodada com "Jogadores veem os dados" desmarcado
- **THEN** o jogador vê o cartão "Encourado", "Inimigo", com "Dados ocultos pelo Mestre." e sem Vitalidade, Força de Vontade, paradas ou especiais

#### Scenario: Inimigo visível
- **WHEN** o Mestre marca "Jogadores veem os dados" em "Encourado"
- **THEN** na próxima atualização o jogador vê as trilhas, as paradas e os especiais de Encourado

#### Scenario: Sem combate
- **WHEN** a ordem da rodada está vazia
- **THEN** a aba Rodada do jogador mostra "Nenhum combate em andamento."
