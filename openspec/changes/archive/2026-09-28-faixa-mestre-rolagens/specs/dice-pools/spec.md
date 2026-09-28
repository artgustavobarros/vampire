## ADDED Requirements

### Requirement: Aba Rolagens
A aba Rolagens (`rolagens`) SHALL mostrar, centralizados, o título "Paradas de dados" (Karla caixa-alta) e o texto "Salve os testes que você usa sempre. O total acompanha a ficha quando atributos ou perícias mudam." (Cormorant, texto suave). Abaixo ficam as paradas salvas, na ordem em que foram criadas, e por último o botão "+ Nova parada" (fundo tinta, texto branco em Karla caixa-alta, largura total), que MUST acrescentar uma parada vazia ao fim da lista e levar o foco ao nome dela. Sem paradas, a aba MUST mostrar só o título, o texto e o botão. A aba MUST ser editável tanto pelo jogador quanto pelo Mestre. Estilos MUST ser classes Tailwind no JSX.

#### Scenario: Aba vazia
- **WHEN** o jogador abre a aba Rolagens sem nenhuma parada salva
- **THEN** a aba mostra "Paradas de dados", o texto explicativo e o botão "+ Nova parada", sem cartões

#### Scenario: Nova parada
- **WHEN** o jogador toca em "+ Nova parada"
- **THEN** aparece um cartão com o nome vazio (placeholder "Nome do teste"), total "0", Atributo "— nenhum —", Perícia "— nenhuma —", Modificador 0 e o texto "Escolha atributo e perícia", e o foco vai para o nome

### Requirement: Cartão de parada
Cada parada SHALL ser um cartão (fundo `surface`, borda `line`) com: na primeira linha, o campo de nome (placeholder "Nome do teste") e, à direita, um quadrado de fundo tinta com o total em branco; abaixo, lado a lado, "Atributo" e "Perícia" como `<select>` nativos; depois a linha "Modificador" com o valor entre os botões "−" e "+"; e, separado por um filete, a fórmula da parada à esquerda e o botão "Remover" (Karla caixa-alta, cor `blood`) à direita. O select de Atributo MUST ter a opção "— nenhum —" e os atributos agrupados em "Físicos", "Sociais" e "Mentais"; o de Perícia MUST ter "— nenhuma —" e as habilidades agrupadas em "Físicas", "Sociais" e "Mentais". Cada opção MUST mostrar o nome e o valor atual na ficha no formato "Nome · valor" (ex.: "Vigor · 2", "Armas de Fogo · 0"). O modificador MUST ir de −10 a +10, com o botão do limite desativado. "Remover" MUST apagar a parada imediatamente. Toda mudança (nome, atributo, perícia, modificador, remoção, criação) MUST ser gravada na ficha pelo salvamento automático.

#### Scenario: Opções com valor
- **WHEN** a ficha tem Vigor 2 e o usuário abre o select de Atributo
- **THEN** a lista mostra "— nenhum —" e, sob "Físicos", "Força · 1", "Destreza · 2" e "Vigor · 2"

#### Scenario: Remover parada
- **WHEN** o usuário toca em "Remover" no cartão "Atirar"
- **THEN** o cartão some e a ficha gravada não tem mais a parada "Atirar"

#### Scenario: Paradas persistem
- **WHEN** o usuário cria a parada "Atirar" com Autocontrole e Armas de Fogo e recarrega a página
- **THEN** a aba Rolagens mostra a parada "Atirar" com as mesmas escolhas

#### Scenario: Limite do modificador
- **WHEN** o modificador de uma parada está em +10
- **THEN** o botão "+" fica desativado

### Requirement: Total e fórmula da parada
O total SHALL ser o valor atual do atributo escolhido + o valor atual da perícia escolhida + o modificador, contando 0 para o que não foi escolhido, e MUST NOT ficar abaixo de 0. O total e as opções MUST acompanhar a ficha: quando um atributo ou perícia muda, as paradas que o usam mostram o novo valor sem outra ação. A fórmula MUST listar as partes escolhidas no formato "Nome valor", unidas por " + ", seguidas do modificador quando diferente de 0 ("+ 2" ou "− 1"); sem atributo e sem perícia, MUST mostrar "Escolha atributo e perícia".

#### Scenario: Atributo e perícia
- **WHEN** a parada usa Autocontrole 3 e Armas de Fogo 0, com modificador 0
- **THEN** o total é "3" e a fórmula é "Autocontrole 3 + Armas de Fogo 0"

#### Scenario: Com modificador
- **WHEN** a parada usa Destreza 2 e Briga 1, com modificador −1
- **THEN** o total é "2" e a fórmula é "Destreza 2 + Briga 1 − 1"

#### Scenario: Só atributo
- **WHEN** a parada usa só Raciocínio 2, sem perícia, com modificador +1
- **THEN** o total é "3" e a fórmula é "Raciocínio 2 + 1"

#### Scenario: Total nunca negativo
- **WHEN** a parada usa Força 1, sem perícia, com modificador −3
- **THEN** o total é "0"

#### Scenario: Total acompanha a ficha
- **WHEN** o Mestre sobe Autocontrole de 3 para 4 na ficha de um jogador que tem a parada "Atirar" (Autocontrole + Armas de Fogo 0)
- **THEN** a parada "Atirar" passa a mostrar total "4" e a opção "Autocontrole · 4"

### Requirement: Grade de paradas
As paradas SHALL ficar em uma grade de até 2 cartões por linha a partir de 768px (breakpoint `md` do Tailwind) e em uma coluna abaixo disso. Abaixo de 640px (breakpoint `sm`), os selects de Atributo e Perícia dentro do cartão MUST ficar empilhados.

#### Scenario: Duas por linha
- **WHEN** a tela tem 1000px de largura e há 3 paradas
- **THEN** as duas primeiras ficam lado a lado e a terceira na linha seguinte

#### Scenario: Coluna no celular
- **WHEN** a tela tem 390px de largura
- **THEN** as paradas ficam uma abaixo da outra e os selects de cada cartão ficam empilhados
