# dm-mode Specification

## Purpose
Papel de Mestre no web: Lista de personagens com todos os jogadores, abrir e editar a ficha de qualquer jogador com o layout da ficha, e rotas por papel (o Mestre não tem ficha própria).
## Requirements
### Requirement: Destino do Mestre ao entrar
Quando o usuário é o Mestre, a página inicial, a entrada e a restauração da sessão SHALL levar para `/personagens`. O Mestre não tem ficha própria: `/ficha` e qualquer `/ficha/<aba>` MUST redirecionar (substituindo a entrada do histórico) para `/personagens`. Um jogador que abre `/personagens` ou `/personagens/<userId>/<aba>` MUST ser redirecionado para a própria ficha; sem sessão, para `/entrar`.

#### Scenario: Mestre entra
- **WHEN** o Mestre entra com `admin@admin.com`
- **THEN** o app abre `/personagens`

#### Scenario: Mestre abre a própria ficha
- **WHEN** o Mestre acessa `/ficha/caracteristicas`
- **THEN** a URL passa a ser `/personagens`

#### Scenario: Jogador tenta abrir a lista
- **WHEN** um jogador com personagem criado acessa `/personagens`
- **THEN** a URL passa a ser `/ficha/caracteristicas`

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

### Requirement: Ficha de jogador aberta pelo Mestre
A página `/personagens/<userId>/<aba>` SHALL mostrar a ficha do jogador `userId` com o mesmo layout, abas, barra inferior e diálogos da ficha do jogador, mais a faixa do Mestre acima do cabeçalho, carregando-a de `GET /sheets/<userId>` e gravando as alterações em `PATCH /sheets/<userId>`. Todas as partes da ficha MUST ser editáveis pelo Mestre, incluindo Atributos e Habilidades. Enquanto a ficha carrega, a página MUST mostrar "Abrindo a ficha…". Se a API responder `404` ou o jogador não tiver personagem criado, o app MUST mostrar o toast "Jogador não encontrado." (ou "Este jogador ainda não criou o personagem.") e voltar para `/personagens`. "Lista de personagens" no menu MUST enviar as mudanças pendentes antes de voltar para `/personagens`.

#### Scenario: Mestre edita a Fome
- **WHEN** o Mestre marca Fome 3 na ficha de um jogador
- **THEN** a mudança é enviada em `PATCH /sheets/<userId>` e, ao voltar à lista, o cartão mostra Fome "3"

#### Scenario: Recarregar a ficha aberta
- **WHEN** o Mestre recarrega a página em `/personagens/<userId>/rolagens`
- **THEN** a ficha do mesmo jogador reabre na aba Rolagens

#### Scenario: Jogador inexistente
- **WHEN** o Mestre acessa `/personagens/<uuid inexistente>/caracteristicas`
- **THEN** aparece o toast "Jogador não encontrado." e a URL passa a ser `/personagens`

### Requirement: Painel do Mestre
As páginas `/personagens`, `/personagens/coteries`, `/personagens/acoes`, `/personagens/rodada`, `/personagens/bestiario` e `/personagens/conta` SHALL ficar dentro do painel do Mestre, com largura máxima de 1000px centralizada.

O cabeçalho do painel MUST mostrar:
- à esquerda, o nome do usuário (Cormorant, semibold) seguido do selo "MESTRE" (Karla caixa-alta, cor `blood`);
- à direita, o botão contornado "Sair da conta", que encerra a sessão e leva para `/entrar`;
- um filete `line` no fim.

Abaixo do cabeçalho, o painel MUST ter uma barra de abas, nesta ordem:
- "Lista de personagens" (`/personagens`);
- "Coteries" (`/personagens/coteries`);
- "Ações" (`/personagens/acoes`);
- "Rodada" (`/personagens/rodada`);
- "Bestiário" (`/personagens/bestiario`);
- "Conta" (`/personagens/conta`), com a conta do próprio Mestre.

As abas MUST ser em Karla caixa-alta pequena, e a barra MUST terminar com filete `line`. No celular, a barra MUST rolar na horizontal em vez de quebrar linha, sem rolagem horizontal da página. A aba da página atual MUST ter texto `ink`, sublinhado de 2px em `blood` e `aria-current="page"`. As outras MUST ter texto suave e escurecer no hover. "Lista de personagens" MUST ser a aba aberta quando o Mestre entra.

A ficha de um jogador (`/personagens/<userId>/<aba>`) e a conta de um jogador (`/personagens/<userId>/conta`) MUST NOT ficar dentro do painel: mantêm o layout da ficha. Estilos MUST ser classes Tailwind no JSX, sem regras novas em `styles.css`.

#### Scenario: Mestre entra e vê a lista
- **WHEN** o Mestre "Mestre de exemplo" entra
- **THEN** o app abre `/personagens`, o cabeçalho mostra "Mestre de exemplo", "MESTRE" e "Sair da conta", e a aba "Lista de personagens" está ativa

#### Scenario: Abas do painel
- **WHEN** qualquer página do painel é exibida
- **THEN** a barra mostra, nessa ordem, "Lista de personagens", "Coteries", "Ações", "Rodada", "Bestiário" e "Conta"

#### Scenario: Trocar para Ações
- **WHEN** o Mestre toca na aba "Ações"
- **THEN** a URL passa a ser `/personagens/acoes`, a aba "Ações" fica ativa e a página mostra a Rolagem de Ressonância

#### Scenario: Trocar para Rodada
- **WHEN** o Mestre toca na aba "Rodada"
- **THEN** a URL passa a ser `/personagens/rodada`, só a aba "Rodada" tem `aria-current="page"` e a página mostra a rodada

#### Scenario: Trocar para Conta
- **WHEN** o Mestre toca na aba "Conta"
- **THEN** a URL passa a ser `/personagens/conta`, a aba "Conta" fica ativa e a página mostra a conta do próprio Mestre

#### Scenario: Recarregar no Bestiário
- **WHEN** o Mestre recarrega a página em `/personagens/bestiario`
- **THEN** o painel reabre com a aba "Bestiário" ativa

#### Scenario: Sair da conta
- **WHEN** o Mestre toca em "Sair da conta" em qualquer aba do painel
- **THEN** a sessão é encerrada e a URL passa a ser `/entrar`

#### Scenario: Ficha fora do painel
- **WHEN** o Mestre abre `/personagens/<userId>/caracteristicas`
- **THEN** a página mostra o cabeçalho e o menu da ficha, sem a barra de abas do painel

#### Scenario: Jogador tenta abrir abas do Mestre
- **WHEN** um jogador com personagem criado acessa `/personagens/acoes`, `/personagens/coteries`, `/personagens/rodada`, `/personagens/bestiario` ou `/personagens/conta`
- **THEN** a URL passa a ser `/ficha/caracteristicas`

### Requirement: Faixa do Mestre na ficha
Na ficha de um jogador aberta pelo Mestre (`/personagens/<userId>/<aba>`), a página SHALL mostrar, acima do cabeçalho da ficha e com a mesma largura máxima dele, uma faixa de fundo `blood` com o texto "Modo Mestre · <nome do personagem> · Ficha de jogador" (Karla caixa-alta, branco; "Sem nome" quando o personagem não tem nome) à esquerda e, à direita, dois botões em Karla caixa-alta: "Lista de personagens" (contornado em branco, texto branco) e "Sair" (fundo branco, texto `blood`). "Lista de personagens" MUST enviar as mudanças pendentes da ficha antes de abrir `/personagens`; "Sair" MUST encerrar a sessão e levar para `/entrar`. O texto MUST ser truncado com reticências quando não couber. Abaixo de 640px (breakpoint `sm` do Tailwind), os botões MUST ficar numa linha abaixo do texto, alinhados à direita. A faixa MUST NOT aparecer na ficha do jogador (`/ficha/<aba>`). Estilos MUST ser classes Tailwind no JSX.

#### Scenario: Faixa na ficha aberta pelo Mestre
- **WHEN** o Mestre abre a ficha de "Vitória Salles"
- **THEN** acima do cabeçalho aparece a faixa sangue com "Modo Mestre · Vitória Salles · Ficha de jogador" e os botões "Lista de personagens" e "Sair"

#### Scenario: Voltar pela faixa
- **WHEN** o Mestre marca Fome 3 e toca em "Lista de personagens" na faixa
- **THEN** a mudança é enviada em `PATCH /sheets/<userId>` antes de a URL passar a ser `/personagens`

#### Scenario: Sair pela faixa
- **WHEN** o Mestre toca em "Sair" na faixa
- **THEN** a sessão é encerrada e a URL passa a ser `/entrar`

#### Scenario: Jogador não vê a faixa
- **WHEN** o jogador abre a própria ficha
- **THEN** não há faixa "Modo Mestre" acima do cabeçalho

