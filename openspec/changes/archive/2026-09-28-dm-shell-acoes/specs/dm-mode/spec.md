## ADDED Requirements

### Requirement: Painel do Mestre
As páginas `/personagens` e `/personagens/acoes` SHALL ficar dentro do painel do Mestre, com largura máxima de 1000px centralizada. O cabeçalho do painel MUST mostrar à esquerda o nome do usuário (Cormorant, semibold) seguido do selo "MESTRE" (Karla caixa-alta, cor `blood`) e, à direita, o botão contornado "Sair da conta", que encerra a sessão e leva para `/entrar`; o cabeçalho MUST terminar com filete `line`. Abaixo do cabeçalho, o painel MUST ter uma barra de abas com "Lista de personagens" (link para `/personagens`) e "Ações" (link para `/personagens/acoes`), em Karla caixa-alta pequena, também terminada em filete `line`. A aba da página atual MUST ter texto `ink`, sublinhado de 2px em `blood` e `aria-current="page"`; a outra MUST ter texto suave e escurecer no hover. "Lista de personagens" MUST ser a aba aberta quando o Mestre entra. A ficha de um jogador (`/personagens/<userId>/<aba>`) MUST NOT ficar dentro do painel: mantém o layout da ficha. Estilos MUST ser classes Tailwind no JSX, sem regras novas em `styles.css`.

#### Scenario: Mestre entra e vê a lista
- **WHEN** o Mestre "Mestre de exemplo" entra
- **THEN** o app abre `/personagens`, o cabeçalho mostra "Mestre de exemplo", "MESTRE" e "Sair da conta", e a aba "Lista de personagens" está ativa

#### Scenario: Trocar para Ações
- **WHEN** o Mestre toca na aba "Ações"
- **THEN** a URL passa a ser `/personagens/acoes`, a aba "Ações" fica ativa e a página mostra a Rolagem de Ressonância

#### Scenario: Sair da conta
- **WHEN** o Mestre toca em "Sair da conta" em qualquer aba do painel
- **THEN** a sessão é encerrada e a URL passa a ser `/entrar`

#### Scenario: Ficha fora do painel
- **WHEN** o Mestre abre `/personagens/<userId>/caracteristicas`
- **THEN** a página mostra o cabeçalho e o menu da ficha, sem a barra de abas do painel

#### Scenario: Jogador tenta abrir Ações
- **WHEN** um jogador com personagem criado acessa `/personagens/acoes`
- **THEN** a URL passa a ser `/ficha/caracteristicas`

## MODIFIED Requirements

### Requirement: Lista de personagens
A aba "Lista de personagens" do painel do Mestre (`/personagens`) SHALL mostrar o texto "Fichas de todos os jogadores. Abra qualquer uma para consultar ou ajustar." e um cartão por jogador vindo de `GET /sheets`, na ordem da API. A página MUST NOT ter título nem botão de sair próprios: o título é a aba ativa e a saída é o "Sair da conta" do painel. Cada cartão MUST ter filete superior sangue, fundo `surface` e borda `line`, e mostrar: o nome do personagem (Cormorant) ou "Sem nome", o clã abaixo em texto suave, o e-mail do jogador em Karla pequena, e três valores lado a lado — "Fome" (valor em sangue), "Vitalidade" e "Vontade" no formato `restante/máximo`, onde restante é o máximo menos as caixas marcadas. O cartão MUST terminar com o botão "Ver ficha" (fundo sangue, largura total) que abre `/personagens/<userId>/caracteristicas`. Jogador sem ficha ou com ficha ainda não criada (`criada` diferente de `true`) MUST aparecer com o nome do jogador, o e-mail e o texto "Ainda sem personagem", sem valores e sem botão. Sem jogadores, a página MUST mostrar "Nenhum jogador cadastrado ainda.". Enquanto a lista carrega, a página MUST mostrar "Carregando fichas…"; se a busca falhar, MUST mostrar o erro como toast com a ação "Tentar de novo". Estilos MUST ser classes Tailwind no JSX, e os cartões MUST ocupar uma coluna no celular.

#### Scenario: Cartão de personagem criado
- **WHEN** o jogador "exemplo@ficha.local" tem a personagem "Vitória Salles", Ventrue, Fome 1, Vigor 2 sem dano e Vontade máxima 5 sem dano
- **THEN** o cartão mostra "Vitória Salles", "Ventrue", "exemplo@ficha.local", Fome "1", Vitalidade "5/5", Vontade "5/5" e o botão "Ver ficha"

#### Scenario: Dano refletido no cartão
- **WHEN** a Vitalidade máxima do personagem é 6 e há 2 caixas marcadas (superficial ou agravado)
- **THEN** o cartão mostra Vitalidade "4/6"

#### Scenario: Jogador sem personagem
- **WHEN** um jogador cadastrado ainda não concluiu o assistente
- **THEN** o cartão mostra o nome e o e-mail do jogador e "Ainda sem personagem", sem botão "Ver ficha"

#### Scenario: Abrir uma ficha
- **WHEN** o Mestre toca em "Ver ficha" no cartão de "Vitória Salles"
- **THEN** o app abre `/personagens/<id do jogador>/caracteristicas` com a ficha de Vitória Salles

#### Scenario: Sem título nem Sair próprios
- **WHEN** a Lista de personagens é exibida
- **THEN** não há título "Lista de personagens" nem botão "Sair" dentro da página, só a aba e o "Sair da conta" do painel
