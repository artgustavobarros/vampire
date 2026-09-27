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
A API SHALL expor `GET /api/auth/me`, protegido, que devolve `{ id, email, name }` do jogador do token. É o equivalente a restaurar `vtm5.session` e ler `vtm5.name.<email>` no `web`.

#### Scenario: Restaurar sessão
- **WHEN** o cliente chama `GET /api/auth/me` com um token válido
- **THEN** a API responde `200` com id, e-mail e nome do jogador, sem o hash da senha

