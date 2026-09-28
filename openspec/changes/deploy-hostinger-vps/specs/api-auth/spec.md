## MODIFIED Requirements

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
