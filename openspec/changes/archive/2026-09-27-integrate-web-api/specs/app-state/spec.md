## MODIFIED Requirements

### Requirement: Store do jogador
O app SHALL manter o estado da sessão num store Zustand próprio do jogador (`usePlayerStore`), com o e-mail do jogador (`user`), o nome do jogador (`name`), ambos vindos do `user` da API, e a flag `ready`, que indica que a sessão salva já foi restaurada no cliente. A restauração MUST ser assíncrona: com `vtm5.token`, busca `GET /auth/me` e `GET /me/sheet` em paralelo antes de marcar `ready`.

#### Scenario: Restaurar sessão salva
- **WHEN** o app restaura a sessão com `vtm5.token` válido
- **THEN** o store do jogador passa a ter `user` e `name` iguais aos de `GET /auth/me`, o store do personagem recebe a ficha de `GET /me/sheet` e `ready` vira `true`

#### Scenario: Restaurar sem sessão
- **WHEN** o app restaura a sessão sem `vtm5.token`
- **THEN** o store do jogador fica com `user: null` e `ready: true`, sem chamar a API

#### Scenario: Restaurar só uma vez
- **WHEN** a restauração é chamada novamente enquanto uma está em andamento ou depois de `ready: true`
- **THEN** nenhuma nova chamada à API é feita

#### Scenario: Restauração sem conexão
- **WHEN** a API não responde durante a restauração
- **THEN** `ready` continua `false`, o token é mantido e a restauração pode ser tentada de novo

### Requirement: Store do personagem
O app SHALL manter a ficha do personagem (`Sheet`) e o alerta de Fome pendente num store Zustand próprio do personagem (`useCharacterStore`), separado do store do jogador. Cada alteração da ficha MUST ser mesclada à ficha atual na hora, marcada como pendente e, quando mudar `fome`, atualizar o alerta de Fome (0 ou 5). As chaves pendentes MUST ser enviadas à API num único `PATCH /me/sheet` depois de um intervalo curto sem novas alterações, com no máximo uma requisição de gravação em andamento por vez.

#### Scenario: Carregar ficha do jogador
- **WHEN** o jogador entra ou a sessão é restaurada
- **THEN** o store do personagem carrega a ficha de `GET /me/sheet` normalizada, ou uma ficha em branco se vier `sheet: null`

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
- **WHEN** o `PATCH /me/sheet` falha sem conexão ou com 5xx
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
Ao sair, o app MUST limpar o store do jogador e o store do personagem, incluindo as mudanças pendentes e o envio agendado.

#### Scenario: Sair
- **WHEN** o jogador sai
- **THEN** o store do jogador fica com `user: null` e `name: null`, e o store do personagem volta à ficha em branco sem alerta de Fome e sem mudanças pendentes

### Requirement: Estado inicial no servidor
Na renderização no servidor e na hidratação, os stores MUST expor o estado inicial (sem jogador, ficha em branco, `ready: false`), e a sessão MUST ser lida e a API chamada só no cliente, depois da hidratação.

#### Scenario: Primeira renderização
- **WHEN** a página é renderizada no servidor
- **THEN** os componentes leem `user: null`, `ready: false` e a ficha em branco, sem acessar `localStorage` nem chamar a API
