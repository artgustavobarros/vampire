# api-auth Specification

## Purpose
Cadastro, entrada e sessão de jogadores na API com JWT (Bearer) e senhas em hash, com todas as rotas protegidas por padrão.
## Requirements
### Requirement: Criar conta
A API SHALL expor `POST /api/auth/signup`, público, recebendo `{ name, email, password }` e, opcionalmente, `username`. O e-mail e o nome de usuário MUST ser normalizados (sem espaços nas pontas, minúsculas) e o nome sem espaços nas pontas. Se `username` vier ausente, vazio ou só com espaços, a API MUST gerar o nome de usuário a partir do nome (ver "Nome de usuário gerado"); se vier preenchido, MUST usar o informado, sem gerar outro. A senha MUST ser guardada apenas como hash (bcrypt). Em caso de sucesso, a API responde `201` com `{ accessToken, user: { id, email, name, role, username } }`. A confirmação de senha (`password2`) continua sendo só do `web`.

#### Scenario: Cadastro válido
- **WHEN** o cliente envia nome, nome de usuário válido e livre, e-mail válido ainda não cadastrado e senha com pelo menos 6 caracteres
- **THEN** a conta é criada, a senha é gravada como hash e a resposta traz o token e o jogador com o nome de usuário

#### Scenario: Cadastro sem nome de usuário
- **WHEN** o cliente envia `{ name: "Vitória Salles", email, password }` sem `username`
- **THEN** a conta é criada com o nome de usuário `vitoria_salles`

#### Scenario: Nome de usuário vazio
- **WHEN** o cliente envia `username: "   "`
- **THEN** a API gera o nome de usuário a partir do nome, sem responder `400`

#### Scenario: E-mail normalizado
- **WHEN** o cliente envia `"  Vitoria@Exemplo.COM "`
- **THEN** a conta é criada com o e-mail `vitoria@exemplo.com`

#### Scenario: Nome de usuário normalizado
- **WHEN** o cliente envia `"  Vitoria_S "` como nome de usuário
- **THEN** a conta é criada com o nome de usuário `vitoria_s`

#### Scenario: E-mail já cadastrado
- **WHEN** já existe conta com o mesmo e-mail normalizado
- **THEN** a API responde `409` com a mensagem `E-mail já cadastrado. Use "Entrar".`

#### Scenario: Nome de usuário já em uso
- **WHEN** o cliente informa um nome de usuário que já existe (normalizado), ou `mestre`
- **THEN** a API responde `409` com a mensagem `Nome de usuário já em uso.`

#### Scenario: Nome ausente
- **WHEN** o nome está vazio ou só com espaços
- **THEN** a API responde `400` com a mensagem `Informe o nome.`

#### Scenario: Nome de usuário inválido
- **WHEN** o nome de usuário informado, depois de normalizado, não segue `^[a-z][a-z0-9_.]{2,19}$` (ex.: `ab`, `1ana`, `ana souza`, `ana@x`)
- **THEN** a API responde `400` com a mensagem `Nome de usuário: 3 a 20 letras, números, _ ou ., começando por letra.`

#### Scenario: E-mail ou senha ausentes
- **WHEN** falta o e-mail ou a senha
- **THEN** a API responde `400` com a mensagem `Informe o e-mail.` ou `Informe a senha.`

#### Scenario: E-mail inválido
- **WHEN** o e-mail não tem formato válido
- **THEN** a API responde `400` com a mensagem `E-mail inválido.`

#### Scenario: Senha curta
- **WHEN** a senha tem menos de 6 caracteres
- **THEN** a API responde `400` com a mensagem `A senha precisa ter pelo menos 6 caracteres.`

### Requirement: Entrar
A API SHALL expor `POST /api/auth/login`, público, recebendo `{ identifier, password }`. O `identifier` MUST ser normalizado (sem espaços nas pontas, minúsculas); se contém `@`, é comparado ao e-mail das contas, senão ao nome de usuário. Com credenciais corretas, responde `200` com `{ accessToken, user: { id, email, name, role, username } }`. Para não revelar quais e-mails ou nomes de usuário existem, identificador desconhecido e senha errada MUST ter a mesma resposta, no mesmo tempo aproximado.

#### Scenario: Entrar com e-mail
- **WHEN** o `identifier` é o e-mail de uma conta (em qualquer caixa, com ou sem espaços nas pontas) e a senha confere
- **THEN** a API responde `200` com um novo token e o jogador

#### Scenario: Entrar com nome de usuário
- **WHEN** o `identifier` é o nome de usuário de uma conta (em qualquer caixa) e a senha confere
- **THEN** a API responde `200` com um novo token e o jogador

#### Scenario: Credenciais erradas
- **WHEN** o `identifier` não corresponde a nenhuma conta ou a senha não confere
- **THEN** a API responde `401` com a mensagem `E-mail, usuário ou senha incorretos.`

#### Scenario: Campos vazios
- **WHEN** falta o `identifier` ou a senha
- **THEN** a API responde `400` com a mensagem `Informe o e-mail ou usuário.` ou `Informe a senha.`

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
A API SHALL expor `GET /api/auth/me`, protegido, que devolve `{ id, email, name, role, username }` do usuário do token.

#### Scenario: Restaurar sessão
- **WHEN** o cliente chama `GET /api/auth/me` com um token válido
- **THEN** a API responde `200` com id, e-mail, nome, papel e nome de usuário, sem o hash da senha

### Requirement: Papéis de usuário
Cada usuário SHALL ter um papel (`role`), `player` ou `dm`, guardado na tabela `users` com padrão `player`. Todo cadastro por `POST /api/auth/signup` MUST criar a conta com `role: "player"`, ignorando qualquer `role` enviado no corpo. A API MUST NOT expor rota para mudar o papel.

#### Scenario: Cadastro nasce jogador
- **WHEN** o cliente cria uma conta nova
- **THEN** a conta é gravada com `role: "player"`

#### Scenario: Papel enviado no cadastro
- **WHEN** o cliente envia `{ name, email, password, role: "dm" }` para `POST /api/auth/signup`
- **THEN** a conta é criada com `role: "player"`

### Requirement: Conta do Mestre
A API SHALL garantir, ao subir, a conta do Mestre a partir das variáveis `ADMIN_EMAIL` e `ADMIN_PASSWORD`: se não existe conta com esse e-mail, cria uma com nome `Mestre`, nome de usuário `mestre`, a senha guardada só como hash bcrypt e `role: "dm"`; se já existe, MUST promovê-la a `dm`, dar a ela o nome de usuário `mestre` e redefinir a senha, sem criar outra conta. Se outra conta tinha o nome de usuário `mestre` (por exemplo, o Mestre anterior depois de trocar `ADMIN_EMAIL`), ela MUST receber outro nome de usuário antes, para a subida não falhar. Sem as duas variáveis, nenhuma conta é criada, e definir só uma delas MUST impedir a API de subir. As migrações MUST NOT criar contas nem conter senhas. Em desenvolvimento (`api/.env.example` e `docker-compose.yml`) os valores padrão são `admin@admin.com` e `!@#ASD123asd`.

#### Scenario: Entrar como Mestre
- **WHEN** a API sobe com `ADMIN_EMAIL` e `ADMIN_PASSWORD` e o cliente chama `POST /api/auth/login` com esse e-mail e senha
- **THEN** a API responde `200` com o token e `user.role` igual a `"dm"`

#### Scenario: Entrar como Mestre pelo nome de usuário
- **WHEN** o cliente chama `POST /api/auth/login` com `identifier: "mestre"` e a senha de `ADMIN_PASSWORD`
- **THEN** a API responde `200` com `user.role` igual a `"dm"` e `user.username` igual a `"mestre"`

#### Scenario: Conta já existente
- **WHEN** antes da subida já existia um jogador com o e-mail de `ADMIN_EMAIL`
- **THEN** depois da subida há uma única conta com esse e-mail, com `role: "dm"`, nome de usuário `mestre` e a senha de `ADMIN_PASSWORD`

#### Scenario: Troca de ADMIN_EMAIL
- **WHEN** a API sobe com um `ADMIN_EMAIL` diferente do Mestre anterior, que tinha o nome de usuário `mestre`
- **THEN** a API sobe, a conta nova fica com `mestre` e a anterior com outro nome de usuário

#### Scenario: Trocar a senha do Mestre
- **WHEN** `ADMIN_PASSWORD` muda e a API sobe de novo
- **THEN** o Mestre entra só com a senha nova

#### Scenario: Banco novo sem as variáveis
- **WHEN** as migrações rodam num banco vazio e a API sobe sem `ADMIN_EMAIL` e `ADMIN_PASSWORD`
- **THEN** não existe nenhuma conta com `role: "dm"`

### Requirement: Papel no usuário público
O usuário devolvido por `POST /api/auth/signup`, `POST /api/auth/login` e `GET /api/auth/me` SHALL ser `{ id, email, name, role, username }`, sem o hash da senha.

#### Scenario: Login de jogador
- **WHEN** um jogador comum entra
- **THEN** a resposta traz `user.role` igual a `"player"` e `user.username` com o nome de usuário da conta

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

### Requirement: Nome de usuário
Toda conta SHALL ter um nome de usuário (`username`) único, guardado normalizado: sem espaços nas pontas e em minúsculas. Depois de normalizado, o nome de usuário MUST ter de 3 a 20 caracteres, só letras `a-z`, dígitos, `_` e `.`, e começar por letra (`^[a-z][a-z0-9_.]{2,19}$`); por isso nunca contém `@`. O nome `mestre` é reservado para a conta do Mestre. Contas que já existiam antes desta mudança MUST receber um nome de usuário gerado pela migração a partir da parte local do e-mail (caracteres inválidos viram `_`, prefixo `u` se não começar por letra, cortado para caber no limite e com sufixo numérico em caso de colisão), e a conta com `role: "dm"` recebe `mestre`.

#### Scenario: Conta antiga ganha nome de usuário
- **WHEN** a migração roda com um jogador `ana.souza@exemplo.com` sem nome de usuário
- **THEN** a conta passa a ter o nome de usuário `ana.souza` e continua entrando com o e-mail

#### Scenario: Colisão na migração
- **WHEN** existem as contas `ana@exemplo.com` e `ana@outro.com`
- **THEN** cada uma recebe um nome de usuário diferente (ex.: `ana` e `ana2`)

#### Scenario: Mestre existente
- **WHEN** a migração roda com uma conta `role: "dm"`
- **THEN** essa conta recebe o nome de usuário `mestre`

### Requirement: Nome de usuário gerado
Quando o cadastro não informa nome de usuário, a API SHALL gerar um a partir do nome da pessoa, sempre no formato `^[a-z][a-z0-9_.]{2,19}$`:
1. tirar os acentos (decompor em NFD e remover as marcas) e passar para minúsculas;
2. trocar cada sequência de caracteres fora de `a-z` e `0-9` por um único `_` e tirar `_` das pontas;
3. se o resultado ficar vazio, usar `jogador`; se não começar por letra, prefixar `u`;
4. cortar em 17 caracteres (tirando `_` que sobrar no fim) e, se ficar com menos de 3, completar com `_`;
5. se a base já estiver em uso ou for `mestre`, acrescentar `2`, `3`, … até achar um livre.

Se dois cadastros simultâneos gerarem o mesmo nome de usuário, a API MUST tentar o próximo sufixo em vez de responder `409`.

#### Scenario: Nome com acento e espaço
- **WHEN** o nome é `"Vitória Salles"`
- **THEN** o nome de usuário gerado é `vitoria_salles`

#### Scenario: Colisão
- **WHEN** já existe `vitoria_salles` e outra pessoa chamada "Vitória Salles" se cadastra sem nome de usuário
- **THEN** a conta nova recebe `vitoria_salles2`

#### Scenario: Nome curto ou sem letras
- **WHEN** o nome é `"Al"` ou `"李"`
- **THEN** o nome de usuário gerado é `al_` ou `jogador` (com sufixo se já existir)

#### Scenario: Nome longo
- **WHEN** o nome é `"Maria Aparecida dos Santos Oliveira"`
- **THEN** o nome de usuário gerado tem no máximo 20 caracteres, contando o sufixo, e começa por `maria_aparecida`

#### Scenario: Nome igual ao do Mestre
- **WHEN** o nome é `"Mestre"`
- **THEN** o nome de usuário gerado é `mestre2` (ou o próximo livre), nunca `mestre`

