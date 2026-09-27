## ADDED Requirements

### Requirement: Tela de abertura
Ao iniciar, o app SHALL exibir a tela de abertura ("Vampiro · A Máscara", "Abrindo a ficha…", spinner e barras pulsantes) enquanto restaura a sessão, por no mínimo 600ms, e então ir para a ficha, o assistente ou a tela de entrada.

#### Scenario: Sessão existente com ficha criada
- **WHEN** o app abre com `vtm5.session` definido e a ficha desse usuário tem `criada: true`
- **THEN** após a abertura, a ficha é exibida na aba Ficha

#### Scenario: Sessão existente sem ficha criada
- **WHEN** o app abre com sessão cujo usuário tem ficha com `criada: false` ou inexistente
- **THEN** o assistente de criação abre no passo 1

#### Scenario: Sem sessão
- **WHEN** o app abre sem `vtm5.session`
- **THEN** a tela de entrada é exibida

### Requirement: Criar conta local
O usuário SHALL poder criar uma conta informando nome, e-mail e senha duas vezes. A conta MUST ser guardada apenas neste navegador.

#### Scenario: Cadastro válido
- **WHEN** o usuário preenche nome, um e-mail válido ainda não cadastrado e duas senhas iguais e confirma
- **THEN** a conta é salva, a sessão é iniciada e o assistente de criação abre

#### Scenario: Senhas diferentes
- **WHEN** as senhas não conferem
- **THEN** a mensagem "As senhas não conferem." aparece em sangue e nada é salvo

#### Scenario: E-mail já cadastrado
- **WHEN** o e-mail já existe em `vtm5.accounts`
- **THEN** a mensagem "E-mail já cadastrado. Use \"Entrar\"." é exibida

#### Scenario: Nome ausente
- **WHEN** o nome está vazio no cadastro
- **THEN** a mensagem "Informe o nome." é exibida

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

#### Scenario: Botões ocupados durante o envio
- **WHEN** o usuário confirma o formulário
- **THEN** os botões ficam desabilitados por ~420ms antes do resultado aparecer

### Requirement: Sair
O usuário SHALL poder encerrar a sessão pelo menu da ficha.

#### Scenario: Sair
- **WHEN** o usuário escolhe "Sair" no menu
- **THEN** `vtm5.session` é removido, a ficha em memória é descartada e a tela de entrada aparece

### Requirement: Armazenamento local
O app MUST guardar contas e fichas apenas no `localStorage` do navegador, nas chaves `vtm5.accounts` (mapa e-mail → senha), `vtm5.session`, `vtm5.name.<email>` e `vtm5.sheet.<email>` (JSON da ficha). Fichas salvas pelo standalone não são importadas. Falhas de acesso ao `localStorage` MUST ser ignoradas sem quebrar a interface.

#### Scenario: Ficha incompleta
- **WHEN** o JSON salvo de uma ficha não tem alguns campos
- **THEN** o app abre a ficha completando os campos ausentes com os valores padrão

#### Scenario: Armazenamento bloqueado
- **WHEN** o `localStorage` lança exceção (modo privado ou bloqueio)
- **THEN** o app continua utilizável na sessão atual, sem erro na tela

### Requirement: Ficha de exemplo
O app SHALL incluir a ficha de exemplo do standalone como um arquivo JSON versionado (Vitória Salles, "Advogada da noite", Ventrue, predador Extorsionário, 12ª geração). Com a opção de dados de exemplo ligada, uma conta recém-criada MUST receber essa ficha.

#### Scenario: Cadastro com dados de exemplo
- **WHEN** a opção de dados de exemplo está ligada e o usuário cria uma conta
- **THEN** o assistente abre no passo 1 com o clã Ventrue selecionado e, no passo 8, o nome "Vitória Salles" já preenchido

#### Scenario: Cadastro sem dados de exemplo
- **WHEN** a opção está desligada (padrão)
- **THEN** a conta nova começa com uma ficha em branco
