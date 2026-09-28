# coteries Specification

## Purpose
Coteries da crônica: o Mestre cria, renomeia, exclui e monta os membros na aba Coteries do painel; cada jogador vê a própria coterie na aba Coterie da ficha.
## Requirements
### Requirement: Aba Coteries do Mestre
A página `/personagens/coteries` SHALL mostrar o texto "Monte as coteries da crônica. Cada jogador vê, na aba Coterie da própria ficha, os membros da coterie em que você o colocou." e, ao lado (abaixo no celular), o botão "+ Nova coterie" (fundo `ink`, texto branco, Karla caixa-alta).

Abaixo, a página MUST mostrar as coteries vindas de `GET /coteries`, na ordem de criação. Estados da lista:
- sem coteries: "Nenhuma coterie ainda.";
- carregando: "Carregando coteries…";
- falha: o erro como toast, com a ação "Tentar de novo".

#### Scenario: Criar coterie
- **WHEN** o Mestre toca em "+ Nova coterie"
- **THEN** uma coterie sem nome e sem membros é criada em `POST /coteries`, aparece no fim da lista e o campo de nome dela recebe o foco

#### Scenario: Nenhuma coterie
- **WHEN** a API não tem coteries
- **THEN** a página mostra "Nenhuma coterie ainda." e o botão "+ Nova coterie"

### Requirement: Painel de uma coterie
Cada coterie SHALL aparecer num painel com filete superior `blood`, fundo `surface` e borda `line`. A primeira linha do painel MUST ter:
- o campo de nome (Cormorant grande, placeholder "Nome da coterie"), salvo em `PATCH /coteries/<id>` ao sair do campo ou 500 ms depois da última tecla;
- a contagem ("0 membros", "1 membro", "N membros", Karla caixa-alta);
- o botão de texto "Excluir coterie" em `blood`.

"Excluir coterie" MUST pedir confirmação num diálogo ("Excluir a coterie <nome>? Os membros ficam sem coterie.", com "Excluir" e "Cancelar"). Só depois de confirmada, a coterie é apagada em `DELETE /coteries/<id>`. Sem membros, o painel MUST mostrar "Sem membros ainda." em itálico suave.

#### Scenario: Renomear
- **WHEN** o Mestre digita "Os Sem-Sol" no nome e sai do campo
- **THEN** o nome é enviado em `PATCH /coteries/<id>` e continua lá ao recarregar a página

#### Scenario: Excluir com confirmação
- **WHEN** o Mestre toca em "Excluir coterie" e confirma
- **THEN** a coterie some da lista e seus membros voltam a aparecer no seletor das outras coteries

#### Scenario: Cancelar exclusão
- **WHEN** o Mestre toca em "Excluir coterie" e escolhe "Cancelar"
- **THEN** a coterie continua na lista, sem chamada à API

### Requirement: Colocar e retirar membros
Cada painel SHALL ter um seletor nativo com a primeira opção "+ Colocar personagem…". As demais opções MUST ser os jogadores com personagem criado (`criada` igual a `true`) que não estão em nenhuma coterie, pelo nome do personagem, na ordem da Lista de personagens. Escolher um jogador MUST colocá-lo na coterie (`PUT /coteries/<id>/membros/<userId>`) e voltar o seletor para "+ Colocar personagem…". Sem jogador livre, o seletor MUST ficar desabilitado. Cada jogador MUST estar em no máximo uma coterie.

Os membros MUST aparecer em cartões, na ordem em que foram colocados. Cada cartão MUST mostrar:
- nome do personagem (Cormorant) e clã em texto suave;
- à direita, "Fome" (Karla caixa-alta em `blood`) com o valor em `blood`;
- "Vitalidade · restante/máximo" e "Força de vontade · restante/máximo", cada um com as caixas da trilha só para leitura, com as marcas de dano superficial e agravado da ficha;
- abaixo de um filete, o botão contornado "Ver ficha", que abre `/personagens/<userId>/caracteristicas`;
- o botão de texto "Retirar" em `blood`, que tira o jogador da coterie (`DELETE /coteries/<id>/membros/<userId>`) sem confirmação.

#### Scenario: Colocar personagem
- **WHEN** o Mestre escolhe "Vitória Salles" no seletor de uma coterie vazia
- **THEN** aparece o cartão de Vitória Salles (Ventrue, Fome 1, Vitalidade 5/5, Força de vontade 5/5), a contagem passa a "1 membro" e Vitória some do seletor de todas as coteries

#### Scenario: Retirar personagem
- **WHEN** o Mestre toca em "Retirar" no cartão de Vitória Salles
- **THEN** o cartão some, a contagem passa a "0 membros" e Vitória volta aos seletores

#### Scenario: Jogador sem personagem
- **WHEN** um jogador ainda não concluiu o assistente
- **THEN** ele não aparece em nenhum seletor de coterie

#### Scenario: Dano nas caixas
- **WHEN** o membro tem Vitalidade máxima 5 com uma caixa superficial e uma agravada
- **THEN** o cartão mostra "Vitalidade · 3/5" e as caixas com um traço e um X

### Requirement: Aba Coterie do jogador
A aba "Coterie" da ficha do jogador (`/ficha/coterie`) SHALL carregar `GET /me/coterie` ao abrir. Ela MUST mostrar o nome da coterie (Cormorant; "Coterie sem nome" se vazio) e um cartão por membro, incluindo o próprio jogador, com o mesmo conteúdo do cartão do Mestre, só para leitura e sem "Ver ficha" nem "Retirar".

Estados da aba:
- sem coterie: "Você ainda não está em uma coterie. Quem monta as coteries é o Mestre.";
- carregando: "Carregando coterie…";
- falha: o erro como toast, com a ação "Tentar de novo".

A aba MUST NOT mostrar o e-mail de outros jogadores.

#### Scenario: Jogador numa coterie
- **WHEN** o jogador de Vitória Salles está na coterie "Os Sem-Sol" com mais um membro e abre a aba Coterie
- **THEN** a aba mostra "Os Sem-Sol" e os dois cartões, sem botões

#### Scenario: Jogador sem coterie
- **WHEN** o jogador não está em nenhuma coterie e abre a aba Coterie
- **THEN** a aba mostra "Você ainda não está em uma coterie. Quem monta as coteries é o Mestre."

