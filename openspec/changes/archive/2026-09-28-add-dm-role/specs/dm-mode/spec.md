## ADDED Requirements

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
A página `/personagens` SHALL mostrar, sob o título "Lista de personagens", o texto "Fichas de todos os jogadores. Abra qualquer uma para consultar ou ajustar." e um cartão por jogador vindo de `GET /sheets`, na ordem da API. Cada cartão MUST ter filete superior sangue, fundo `surface` e borda `line`, e mostrar: o nome do personagem (Cormorant) ou "Sem nome", o clã abaixo em texto suave, o e-mail do jogador em Karla pequena, e três valores lado a lado — "Fome" (valor em sangue), "Vitalidade" e "Vontade" no formato `restante/máximo`, onde restante é o máximo menos as caixas marcadas. O cartão MUST terminar com o botão "Ver ficha" (fundo sangue, largura total) que abre `/personagens/<userId>/caracteristicas`. Jogador sem ficha ou com ficha ainda não criada (`criada` diferente de `true`) MUST aparecer com o nome do jogador, o e-mail e o texto "Ainda sem personagem", sem valores e sem botão. O cabeçalho da página MUST ter o botão contornado "Sair", que encerra a sessão e leva para `/entrar`. Sem jogadores, a página MUST mostrar "Nenhum jogador cadastrado ainda.". Enquanto a lista carrega, a página MUST mostrar "Carregando fichas…"; se a busca falhar, MUST mostrar o erro como toast com a ação "Tentar de novo". Estilos MUST ser classes Tailwind no JSX, e os cartões MUST ocupar uma coluna no celular.

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

### Requirement: Ficha de jogador aberta pelo Mestre
A página `/personagens/<userId>/<aba>` SHALL mostrar a ficha do jogador `userId` com o mesmo layout, abas, barra inferior e diálogos da ficha do jogador, carregando-a de `GET /sheets/<userId>` e gravando as alterações em `PATCH /sheets/<userId>`. Todas as partes da ficha MUST ser editáveis pelo Mestre, incluindo Atributos e Habilidades. Enquanto a ficha carrega, a página MUST mostrar "Abrindo a ficha…". Se a API responder `404` ou o jogador não tiver personagem criado, o app MUST mostrar o toast "Jogador não encontrado." (ou "Este jogador ainda não criou o personagem.") e voltar para `/personagens`. "Lista de personagens" no menu MUST enviar as mudanças pendentes antes de voltar para `/personagens`.

#### Scenario: Mestre edita a Fome
- **WHEN** o Mestre marca Fome 3 na ficha de um jogador
- **THEN** a mudança é enviada em `PATCH /sheets/<userId>` e, ao voltar à lista, o cartão mostra Fome "3"

#### Scenario: Recarregar a ficha aberta
- **WHEN** o Mestre recarrega a página em `/personagens/<userId>/notas`
- **THEN** a ficha do mesmo jogador reabre na aba Notas

#### Scenario: Jogador inexistente
- **WHEN** o Mestre acessa `/personagens/<uuid inexistente>/caracteristicas`
- **THEN** aparece o toast "Jogador não encontrado." e a URL passa a ser `/personagens`
