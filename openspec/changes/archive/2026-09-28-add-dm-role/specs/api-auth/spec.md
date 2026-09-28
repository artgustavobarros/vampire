## ADDED Requirements

### Requirement: Papéis de usuário
Cada usuário SHALL ter um papel (`role`), `player` ou `dm`, guardado na tabela `users` com padrão `player`. Todo cadastro por `POST /api/auth/signup` MUST criar a conta com `role: "player"`, ignorando qualquer `role` enviado no corpo. A API MUST NOT expor rota para mudar o papel.

#### Scenario: Cadastro nasce jogador
- **WHEN** o cliente cria uma conta nova
- **THEN** a conta é gravada com `role: "player"`

#### Scenario: Papel enviado no cadastro
- **WHEN** o cliente envia `{ name, email, password, role: "dm" }` para `POST /api/auth/signup`
- **THEN** a conta é criada com `role: "player"`

### Requirement: Conta do Mestre
As migrações do banco SHALL garantir a conta `admin@admin.com` com a senha `!@#ASD123asd` (guardada só como hash bcrypt) e `role: "dm"`. Se já existir conta com esse e-mail, a migração MUST promovê-la a `dm` e redefinir a senha, sem criar outra conta.

#### Scenario: Entrar como Mestre
- **WHEN** após as migrações o cliente chama `POST /api/auth/login` com `admin@admin.com` e `!@#ASD123asd`
- **THEN** a API responde `200` com o token e `user.role` igual a `"dm"`

#### Scenario: Conta já existente
- **WHEN** antes da migração já existia um jogador `admin@admin.com`
- **THEN** depois da migração há uma única conta com esse e-mail, com `role: "dm"` e a senha do Mestre

### Requirement: Papel no usuário público
O usuário devolvido por `POST /api/auth/signup`, `POST /api/auth/login` e `GET /api/auth/me` SHALL ser `{ id, email, name, role }`, sem o hash da senha.

#### Scenario: Login de jogador
- **WHEN** um jogador comum entra
- **THEN** a resposta traz `user.role` igual a `"player"`

### Requirement: Rotas restritas por papel
Rotas marcadas como exclusivas de um papel SHALL exigir que o usuário do token tenha esse papel, lido do banco a cada requisição (não do token). Um usuário autenticado sem o papel MUST receber `403` com a mensagem `Apenas o Mestre pode fazer isso.`. Sem token válido, a resposta continua `401`.

#### Scenario: Jogador numa rota do Mestre
- **WHEN** um `player` com token válido chama `GET /api/sheets`
- **THEN** a API responde `403` com a mensagem `Apenas o Mestre pode fazer isso.`

#### Scenario: Mestre numa rota do Mestre
- **WHEN** o `dm` chama `GET /api/sheets`
- **THEN** a requisição é processada normalmente

#### Scenario: Papel mudado depois do login
- **WHEN** um usuário tem o papel trocado no banco enquanto seu token ainda é válido
- **THEN** a próxima requisição já usa o papel novo

## MODIFIED Requirements

### Requirement: Jogador da sessão
A API SHALL expor `GET /api/auth/me`, protegido, que devolve `{ id, email, name, role }` do usuário do token. É o equivalente a restaurar `vtm5.session` e ler `vtm5.name.<email>` no `web`.

#### Scenario: Restaurar sessão
- **WHEN** o cliente chama `GET /api/auth/me` com um token válido
- **THEN** a API responde `200` com id, e-mail, nome e papel do usuário, sem o hash da senha
