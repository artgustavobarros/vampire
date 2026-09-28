# api-auth Specification

## Purpose
Cadastro, entrada e sessão de jogadores na API com JWT (Bearer) e senhas em hash, com todas as rotas protegidas por padrão.
## Requirements
### Requirement: Criar conta
A API SHALL expor `POST /api/auth/signup`, público, recebendo `{ name, email, password }`. O e-mail MUST ser normalizado (sem espaços nas pontas, minúsculas) e o nome sem espaços nas pontas. A senha MUST ser guardada apenas como hash (bcrypt). Em caso de sucesso, a API responde `201` com `{ accessToken, user: { id, email, name } }`. A confirmação de senha (`password2`) continua sendo só do `web`.

#### Scenario: Cadastro válido
- **WHEN** o cliente envia nome, e-mail válido ainda não cadastrado e senha com pelo menos 6 caracteres
- **THEN** a conta é criada, a senha é gravada como hash e a resposta traz o token e o jogador

#### Scenario: E-mail normalizado
- **WHEN** o cliente envia `"  Vitoria@Exemplo.COM "`
- **THEN** a conta é criada com o e-mail `vitoria@exemplo.com`

#### Scenario: E-mail já cadastrado
- **WHEN** já existe conta com o mesmo e-mail normalizado
- **THEN** a API responde `409` com a mensagem `E-mail já cadastrado. Use "Entrar".`

#### Scenario: Nome ausente
- **WHEN** o nome está vazio ou só com espaços
- **THEN** a API responde `400` com a mensagem `Informe o nome.`

#### Scenario: E-mail ou senha ausentes
- **WHEN** falta o e-mail ou a senha
- **THEN** a API responde `400` com a mensagem `Informe e-mail e senha.`

#### Scenario: E-mail inválido
- **WHEN** o e-mail não tem formato válido
- **THEN** a API responde `400` com a mensagem `E-mail inválido.`

#### Scenario: Senha curta
- **WHEN** a senha tem menos de 6 caracteres
- **THEN** a API responde `400` com a mensagem `A senha precisa ter pelo menos 6 caracteres.`

### Requirement: Entrar
A API SHALL expor `POST /api/auth/login`, público, recebendo `{ email, password }` com o e-mail normalizado como no cadastro. Com credenciais corretas, responde `200` com `{ accessToken, user: { id, email, name } }`. Para não revelar quais e-mails existem, e-mail desconhecido e senha errada MUST ter a mesma resposta.

#### Scenario: Credenciais corretas
- **WHEN** e-mail e senha conferem com uma conta
- **THEN** a API responde `200` com um novo token e o jogador

#### Scenario: Credenciais erradas
- **WHEN** o e-mail não está cadastrado ou a senha não confere
- **THEN** a API responde `401` com a mensagem `E-mail ou senha incorretos.`

#### Scenario: Campos vazios
- **WHEN** falta e-mail ou senha
- **THEN** a API responde `400` com a mensagem `Informe e-mail e senha.`

### Requirement: Token JWT
O `accessToken` SHALL ser um JWT assinado com `JWT_SECRET` (HS256), com `sub` = id do jogador e `email`, expirando conforme `JWT_EXPIRES_IN`. O cliente MUST enviá-lo no cabeçalho `Authorization: Bearer <token>`. Sair é responsabilidade do cliente (descartar o token); não há lista de revogação nesta etapa.

#### Scenario: Token válido
- **WHEN** uma rota protegida recebe um token válido e não expirado de um jogador existente
- **THEN** a requisição segue com o jogador identificado

#### Scenario: Token expirado ou adulterado
- **WHEN** o token está expirado, com assinatura inválida ou malformado
- **THEN** a API responde `401` com a mensagem `Sessão expirada. Entre novamente.`

#### Scenario: Jogador removido
- **WHEN** o token é válido mas o jogador do `sub` não existe mais
- **THEN** a API responde `401` com a mensagem `Sessão expirada. Entre novamente.`

### Requirement: Rotas protegidas por padrão
Toda rota SHALL exigir token válido, exceto as marcadas explicitamente como públicas (`signup`, `login`, `health`).

#### Scenario: Sem token
- **WHEN** uma rota protegida é chamada sem o cabeçalho `Authorization`
- **THEN** a API responde `401` com a mensagem `Entre para continuar.`

#### Scenario: Rota pública
- **WHEN** `POST /api/auth/login` é chamado sem token
- **THEN** a requisição é processada normalmente

### Requirement: Jogador da sessão
A API SHALL expor `GET /api/auth/me`, protegido, que devolve `{ id, email, name, role }` do usuário do token. É o equivalente a restaurar `vtm5.session` e ler `vtm5.name.<email>` no `web`.

#### Scenario: Restaurar sessão
- **WHEN** o cliente chama `GET /api/auth/me` com um token válido
- **THEN** a API responde `200` com id, e-mail, nome e papel do usuário, sem o hash da senha

### Requirement: Papéis de usuário
Cada usuário SHALL ter um papel (`role`), `player` ou `dm`, guardado na tabela `users` com padrão `player`. Todo cadastro por `POST /api/auth/signup` MUST criar a conta com `role: "player"`, ignorando qualquer `role` enviado no corpo. A API MUST NOT expor rota para mudar o papel.

#### Scenario: Cadastro nasce jogador
- **WHEN** o cliente cria uma conta nova
- **THEN** a conta é gravada com `role: "player"`

#### Scenario: Papel enviado no cadastro
- **WHEN** o cliente envia `{ name, email, password, role: "dm" }` para `POST /api/auth/signup`
- **THEN** a conta é criada com `role: "player"`

### Requirement: Conta do Mestre
A API SHALL garantir, ao subir, a conta do Mestre a partir das variáveis `ADMIN_EMAIL` e `ADMIN_PASSWORD`: se não existe conta com esse e-mail, cria uma com nome `Mestre`, a senha guardada só como hash bcrypt e `role: "dm"`; se já existe, MUST promovê-la a `dm` e redefinir a senha, sem criar outra conta. Sem as duas variáveis, nenhuma conta é criada, e definir só uma delas MUST impedir a API de subir. As migrações MUST NOT criar contas nem conter senhas. Em desenvolvimento (`api/.env.example` e `docker-compose.yml`) os valores padrão são `admin@admin.com` e `!@#ASD123asd`.

#### Scenario: Entrar como Mestre
- **WHEN** a API sobe com `ADMIN_EMAIL` e `ADMIN_PASSWORD` e o cliente chama `POST /api/auth/login` com esses valores
- **THEN** a API responde `200` com o token e `user.role` igual a `"dm"`

#### Scenario: Conta já existente
- **WHEN** antes da subida já existia um jogador com o e-mail de `ADMIN_EMAIL`
- **THEN** depois da subida há uma única conta com esse e-mail, com `role: "dm"` e a senha de `ADMIN_PASSWORD`

#### Scenario: Trocar a senha do Mestre
- **WHEN** `ADMIN_PASSWORD` muda e a API sobe de novo
- **THEN** o Mestre entra só com a senha nova

#### Scenario: Banco novo sem as variáveis
- **WHEN** as migrações rodam num banco vazio e a API sobe sem `ADMIN_EMAIL` e `ADMIN_PASSWORD`
- **THEN** não existe nenhuma conta com `role: "dm"`

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

