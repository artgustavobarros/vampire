## MODIFIED Requirements

### Requirement: Tela de abertura
Ao iniciar, o app SHALL exibir a tela de abertura ("Vampiro · A Máscara", "Abrindo a ficha…", spinner e barras pulsantes) apenas enquanto restaura a sessão, sem duração mínima, e então ir para a ficha, o assistente ou a tela de entrada.

#### Scenario: Sessão existente com ficha criada
- **WHEN** o app abre com `vtm5.session` definido e a ficha desse usuário tem `criada: true`
- **THEN** após a abertura, a ficha é exibida na aba Ficha

#### Scenario: Sessão existente sem ficha criada
- **WHEN** o app abre com sessão cujo usuário tem ficha com `criada: false` ou inexistente
- **THEN** o assistente de criação abre no passo 1

#### Scenario: Sem sessão
- **WHEN** o app abre sem `vtm5.session`
- **THEN** a tela de entrada é exibida

#### Scenario: Sem espera artificial
- **WHEN** a sessão termina de ser restaurada
- **THEN** a tela de abertura sai imediatamente, sem aguardar um tempo mínimo

### Requirement: Entrar
O usuário SHALL poder entrar com e-mail (normalizado para minúsculas, sem espaços) e senha de uma conta existente neste dispositivo.

#### Scenario: Credenciais corretas
- **WHEN** e-mail e senha conferem com uma conta local
- **THEN** a sessão é gravada em `vtm5.session` e a ficha (ou o assistente) do usuário é carregada

#### Scenario: E-mail desconhecido
- **WHEN** o e-mail não está cadastrado
- **THEN** a mensagem "E-mail não cadastrado neste dispositivo." é exibida

#### Scenario: Senha errada
- **WHEN** a senha não confere
- **THEN** a mensagem "Senha incorreta." é exibida

#### Scenario: Campos vazios ou e-mail inválido
- **WHEN** falta e-mail ou senha, ou o e-mail não tem formato válido
- **THEN** a mensagem "Informe e-mail e senha." ou "E-mail inválido." é exibida

#### Scenario: Resultado imediato
- **WHEN** o usuário confirma o formulário de entrar ou criar conta
- **THEN** a mensagem de erro ou a navegação acontece na hora, sem desabilitar os botões nem exibir "Verificando…"
