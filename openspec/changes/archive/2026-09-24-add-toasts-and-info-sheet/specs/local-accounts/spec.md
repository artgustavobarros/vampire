## MODIFIED Requirements

### Requirement: Criar conta local
O usuário SHALL poder criar uma conta informando nome, e-mail e senha duas vezes. A conta MUST ser guardada apenas neste navegador. Erros de cadastro MUST ser exibidos como toast de erro (ver `notifications`), e não como texto inline no formulário.

#### Scenario: Cadastro válido
- **WHEN** o usuário preenche nome, um e-mail válido ainda não cadastrado e duas senhas iguais e confirma
- **THEN** a conta é salva, a sessão é iniciada e o assistente de criação abre

#### Scenario: Senhas diferentes
- **WHEN** as senhas não conferem
- **THEN** um toast de erro com a mensagem "As senhas não conferem." aparece e nada é salvo

#### Scenario: E-mail já cadastrado
- **WHEN** o e-mail já existe em `vtm5.accounts`
- **THEN** um toast de erro com a mensagem "E-mail já cadastrado. Use \"Entrar\"." é exibido

#### Scenario: Nome ausente
- **WHEN** o nome está vazio no cadastro
- **THEN** um toast de erro com a mensagem "Informe o nome." é exibido

#### Scenario: Sem erro inline
- **WHEN** qualquer erro de cadastro ocorre
- **THEN** nenhum parágrafo de erro é renderizado dentro do formulário

### Requirement: Entrar
O usuário SHALL poder entrar com e-mail (normalizado para minúsculas, sem espaços) e senha de uma conta existente neste dispositivo. Erros de entrada MUST ser exibidos como toast de erro, e não como texto inline no formulário.

#### Scenario: Credenciais corretas
- **WHEN** e-mail e senha conferem com uma conta local
- **THEN** a sessão é gravada em `vtm5.session` e a ficha (ou o assistente) do usuário é carregada

#### Scenario: E-mail desconhecido
- **WHEN** o e-mail não está cadastrado
- **THEN** um toast de erro com a mensagem "E-mail não cadastrado neste dispositivo." é exibido

#### Scenario: Senha errada
- **WHEN** a senha não confere
- **THEN** um toast de erro com a mensagem "Senha incorreta." é exibido

#### Scenario: Campos vazios ou e-mail inválido
- **WHEN** falta e-mail ou senha, ou o e-mail não tem formato válido
- **THEN** um toast de erro com a mensagem "Informe e-mail e senha." ou "E-mail inválido." é exibido

#### Scenario: Resultado imediato
- **WHEN** o usuário confirma o formulário de entrar ou criar conta
- **THEN** o toast de erro ou a navegação acontece na hora, sem desabilitar os botões nem exibir "Verificando…"
