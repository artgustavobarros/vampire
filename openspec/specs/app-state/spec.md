# app-state Specification

## Purpose
Estado do cliente dividido em store do jogador (sessão) e store do personagem (ficha), em Zustand, com sessão restaurada e ficha gravada pela API (envio agrupado) e estado inicial estável no servidor.
## Requirements
### Requirement: Store do jogador
O app SHALL manter o estado da sessão num store Zustand próprio do jogador (`usePlayerStore`), com o e-mail do usuário (`user`), o nome (`name`), o nome de usuário (`username`) e o papel (`role`: `"player"` ou `"dm"`), todos vindos do `user` da API, e a flag `ready`, que indica que a sessão salva já foi restaurada no cliente. Depois de salvar a própria conta, o store MUST passar a ter os valores do usuário devolvido pela API, sem recarregar a sessão. A restauração MUST ser assíncrona: com `vtm5.token`, busca `GET /auth/me` e `GET /me/sheet` em paralelo antes de marcar `ready`. Para o `dm`, a ficha de `GET /me/sheet` MUST ser ignorada e o store do personagem MUST ficar com a ficha em branco e sem destino de gravação até uma ficha ser aberta pela Lista de personagens. Ao entrar pelo formulário como `dm`, o app MUST NOT buscar `GET /me/sheet`.

#### Scenario: Restaurar sessão salva
- **WHEN** o app restaura a sessão de um jogador com `vtm5.token` válido
- **THEN** o store do jogador passa a ter `user`, `name`, `username` e `role: "player"` iguais aos de `GET /auth/me`, o store do personagem recebe a ficha de `GET /me/sheet` e `ready` vira `true`

#### Scenario: Restaurar sessão do Mestre
- **WHEN** o app restaura a sessão do Mestre com `vtm5.token` válido
- **THEN** o store do jogador passa a ter `role: "dm"`, o store do personagem fica com a ficha em branco e sem destino de gravação, e `ready` vira `true`

#### Scenario: Restaurar sem sessão
- **WHEN** o app restaura a sessão sem `vtm5.token`
- **THEN** o store do jogador fica com `user: null`, `username: null`, `role: null` e `ready: true`, sem chamar a API

#### Scenario: Restaurar só uma vez
- **WHEN** a restauração é chamada novamente enquanto uma está em andamento ou depois de `ready: true`
- **THEN** nenhuma nova chamada à API é feita

#### Scenario: Restauração sem conexão
- **WHEN** a API não responde durante a restauração
- **THEN** `ready` continua `false`, o token é mantido e a restauração pode ser tentada de novo

#### Scenario: Conta salva
- **WHEN** o jogador muda o nome de usuário e o e-mail na página "Conta" e a API responde com sucesso
- **THEN** `username` e `user` do store passam a ser os novos valores, e a gaveta da ficha já mostra o `@nome_de_usuario` novo

### Requirement: Store do personagem
O app SHALL manter a ficha do personagem aberta (`Sheet`), a indicação de onde ela é gravada e o alerta de Fome pendente num store Zustand próprio do personagem (`useCharacterStore`), separado do store do jogador. A ficha aberta MUST ser a do próprio jogador (gravada em `PATCH /me/sheet`) ou, para o Mestre, a de um jogador escolhido (gravada em `PATCH /sheets/:userId`). Cada alteração da ficha MUST ser mesclada à ficha atual na hora, marcada como pendente e, quando mudar `fome`, atualizar o alerta de Fome (0 ou 5). As chaves pendentes MUST ser enviadas à API num único `PATCH` para o destino da ficha aberta depois de um intervalo curto sem novas alterações, com no máximo uma requisição de gravação em andamento por vez. Abrir outra ficha MUST enviar antes as mudanças pendentes da ficha anterior para o destino dela e só então descartar o estado anterior.

#### Scenario: Carregar ficha do jogador
- **WHEN** o jogador entra ou a sessão é restaurada
- **THEN** o store do personagem carrega a ficha de `GET /me/sheet` normalizada, ou uma ficha em branco se vier `sheet: null`

#### Scenario: Mestre abre a ficha de um jogador
- **WHEN** o Mestre abre a ficha do jogador `u1`
- **THEN** o store do personagem carrega a ficha de `GET /sheets/u1` normalizada, e as alterações seguintes são enviadas em `PATCH /sheets/u1`

#### Scenario: Mestre troca de ficha com mudança pendente
- **WHEN** o Mestre altera a Fome na ficha de `u1` e, antes do envio, abre a ficha de `u2`
- **THEN** a Fome é enviada em `PATCH /sheets/u1` e nenhuma alteração de `u1` é enviada para `u2`

#### Scenario: Salvar alteração
- **WHEN** um campo da ficha é alterado com um jogador logado
- **THEN** a ficha mesclada fica no store do personagem na hora e o campo é enviado num `PATCH /me/sheet` pouco depois

#### Scenario: Alterações em sequência
- **WHEN** o jogador digita o nome e marca Fome 2 em menos de meio segundo
- **THEN** um único `PATCH /me/sheet` envia `{ nome, fome }` com os valores atuais

#### Scenario: Alteração durante o envio
- **WHEN** um campo muda enquanto um `PATCH` ainda está em andamento
- **THEN** o novo valor segue pendente e é enviado num próximo `PATCH` depois que o primeiro termina

#### Scenario: Falha ao enviar
- **WHEN** o `PATCH` falha sem conexão ou com 5xx
- **THEN** a edição continua na tela e as chaves enviadas voltam a ficar pendentes

#### Scenario: Sair da página
- **WHEN** a página é escondida ou fechada com mudanças pendentes
- **THEN** as mudanças são enviadas imediatamente, sem esperar o intervalo

#### Scenario: Alteração sem jogador
- **WHEN** um campo da ficha é alterado sem jogador logado
- **THEN** a ficha é atualizada só em memória, sem chamar a API

#### Scenario: Alerta de Fome
- **WHEN** a Fome passa de 4 para 5
- **THEN** o store do personagem sinaliza alerta 5 até ser dispensado

### Requirement: Sair limpa jogador e personagem
Ao sair, o app MUST limpar o store do jogador (incluindo o papel) e o store do personagem, incluindo a ficha aberta, o destino de gravação, as mudanças pendentes e o envio agendado.

#### Scenario: Sair
- **WHEN** o jogador sai
- **THEN** o store do jogador fica com `user: null`, `name: null` e `role: null`, e o store do personagem volta à ficha em branco sem alerta de Fome, sem destino de gravação e sem mudanças pendentes

### Requirement: Estado inicial no servidor
Na renderização no servidor e na hidratação, os stores MUST expor o estado inicial (sem jogador, ficha em branco, `ready: false`), e a sessão MUST ser lida e a API chamada só no cliente, depois da hidratação.

#### Scenario: Primeira renderização
- **WHEN** a página é renderizada no servidor
- **THEN** os componentes leem `user: null`, `ready: false` e a ficha em branco, sem acessar `localStorage` nem chamar a API

### Requirement: Dono da ficha com nome de usuário
O dono da ficha aberta no store do personagem (`owner`) SHALL trazer, além do e-mail, o nome de usuário e o nome da conta (vindos do `user` da API). Quando a conta do dono é salva pela página "Conta" (pelo próprio jogador ou pelo Mestre), o `owner` MUST ser atualizado com o usuário devolvido pela API, sem reabrir a ficha nem descartar mudanças pendentes.

#### Scenario: Mestre abre uma ficha
- **WHEN** o Mestre abre a ficha do jogador `ana_s`
- **THEN** `owner` tem o `userId`, o e-mail, o nome e o nome de usuário `ana_s` desse jogador

#### Scenario: Mestre muda o nome de usuário do jogador
- **WHEN** o Mestre salva `ana` como nome de usuário na conta do jogador aberto
- **THEN** `owner.username` passa a ser `ana` e a ficha continua aberta com as mudanças pendentes

