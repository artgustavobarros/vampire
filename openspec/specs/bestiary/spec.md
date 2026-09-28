# bestiary Specification

## Purpose
Aba Bestiário do Mestre: inimigos persistentes com Vitalidade, Força de Vontade, paradas de dados e especiais em texto rico, com gravação automática, duplicar, excluir e colocar ou tirar da rodada.
## Requirements
### Requirement: Aba Bestiário do Mestre
A página `/personagens/bestiario` SHALL mostrar o título "Inimigos" (Karla caixa-alta) com o botão "+ Novo inimigo" (fundo `ink`, texto branco) à direita e, abaixo, um editor por inimigo vindo de `GET /enemies`, na ordem de criação. Estados da lista:
- sem inimigos: "Nenhum inimigo no bestiário ainda.";
- carregando: "Carregando bestiário…";
- falha: o erro como toast, com a ação "Tentar de novo".

"+ Novo inimigo" MUST criar em `POST /enemies` um inimigo com estes valores e colocá-lo no fim da lista, com foco no campo de nome:
- nome vazio;
- "Jogadores veem os dados" desmarcado;
- Vitalidade 5 e Força de Vontade 3, sem dano;
- sem paradas e sem especiais.

Criar um inimigo MUST NOT colocá-lo na rodada.

#### Scenario: Novo inimigo fica embaixo
- **WHEN** o bestiário tem "Encourado" e o Mestre toca em "+ Novo inimigo"
- **THEN** um editor vazio aparece abaixo do de "Encourado", e a ordem da rodada não muda

#### Scenario: Bestiário vazio
- **WHEN** a API não tem inimigos
- **THEN** a página mostra "Nenhum inimigo no bestiário ainda." e o botão "+ Novo inimigo"

### Requirement: Editor de inimigo
Cada inimigo SHALL ter um editor com filete superior `ink`, fundo `surface` e borda `line`, com estes campos, nesta ordem:
1. Nome: campo grande em Cormorant, placeholder "Nome do inimigo". Sem nome, o inimigo é mostrado em qualquer lugar como "Inimigo sem nome".
2. Caixa "Jogadores veem os dados".
3. "Vitalidade" e "Força de vontade": o máximo entre os botões "−" e "+" (de 1 a 20). Abaixo, as caixas da trilha, que ciclam vazio → superficial → agravado ao toque, como na ficha. Diminuir o máximo MUST descartar as caixas que saem.
4. "Paradas de dados": uma linha por parada, com nome (placeholder "Ataque, Esquiva…"), quantidade de dados (número de 0 a 30) e "×" para remover. Abaixo, "+ Parada" em `blood`.
5. "Especiais": uma linha por especial, com nome, "×" e um editor de texto rico. Abaixo, "+ Especial" em `blood`.

Toda alteração MUST ser gravada sozinha em `PUT /enemies/<id>`, 500 ms depois da última mudança. Mudanças pendentes MUST ser enviadas ao sair da aba. Uma falha de gravação MUST aparecer como toast com a ação "Tentar de novo".

#### Scenario: Ajustar Vitalidade
- **WHEN** o Mestre toca em "+" na Vitalidade de um inimigo com 5
- **THEN** a Vitalidade passa a 6, aparecem 6 caixas e a mudança é gravada em `PUT /enemies/<id>`

#### Scenario: Marcar dano
- **WHEN** o Mestre toca duas vezes na primeira caixa de Vitalidade
- **THEN** a caixa mostra dano agravado (X), e o dano continua lá ao recarregar a página

#### Scenario: Parada de dados
- **WHEN** o Mestre toca em "+ Parada", escreve "Garras" e 7
- **THEN** a parada "Garras 7" fica salva no inimigo

### Requirement: Texto rico dos especiais
O editor de texto rico SHALL ter uma barra com os botões "N" (negrito), "I" (itálico), "S" (sublinhado), "• Lista" (lista com marcadores) e "1. Lista" (lista numerada), e uma área editável de pelo menos três linhas. O texto MUST ser guardado como HTML restrito às tags `p`, `br`, `strong`, `b`, `em`, `i`, `u`, `ul`, `ol` e `li`, sem atributos. Qualquer outra tag MUST ser trocada pelo seu texto, tanto ao gravar quanto ao exibir. Colar texto de fora MUST passar pela mesma limpeza. A exibição fora do editor (cartões da Rodada) MUST usar o mesmo HTML limpo.

#### Scenario: Negrito
- **WHEN** o Mestre escreve "Garras agravadas", seleciona "agravadas" e toca em "N"
- **THEN** "agravadas" aparece em negrito no editor e no cartão do inimigo na Rodada

#### Scenario: HTML colado é limpo
- **WHEN** o Mestre cola um trecho com `<a href="…">link</a><script>…</script>`
- **THEN** fica só o texto "link", sem link nem script

### Requirement: Rodada, duplicar e excluir
O rodapé do editor SHALL ter, depois de um filete, três botões:
- **Rodada**: "Colocar na rodada" (contornado) quando o inimigo não está na rodada, ou "Na rodada · tirar" (fundo `ink`, texto branco) quando está. Colocar MUST acrescentá-lo no fim da ordem da rodada, sem iniciativa; tirar MUST removê-lo da ordem.
- **Duplicar** (contornado): cria em `POST /enemies` uma cópia com nome "<nome> (cópia)", as mesmas trilhas (sem dano), paradas, especiais e visibilidade, no fim da lista e fora da rodada.
- **Excluir** (texto `blood`): pede confirmação ("Excluir <nome> do bestiário?", com "Excluir" e "Cancelar"). Confirmado, apaga em `DELETE /enemies/<id>` e tira o inimigo da rodada.

#### Scenario: Colocar na rodada
- **WHEN** o Mestre toca em "Colocar na rodada" no inimigo "Encourado"
- **THEN** o botão passa a "Na rodada · tirar" e "Encourado" aparece no fim da Ordem da rodada

#### Scenario: Duplicar
- **WHEN** o Mestre toca em "Duplicar" em "Encourado", que tem 2 caixas de dano
- **THEN** aparece "Encourado (cópia)" no fim da lista, com as mesmas paradas e especiais, sem dano e com "Colocar na rodada"

#### Scenario: Excluir inimigo na rodada
- **WHEN** o Mestre exclui "Encourado", que estava na rodada, e confirma
- **THEN** o inimigo some do bestiário e da Ordem da rodada

