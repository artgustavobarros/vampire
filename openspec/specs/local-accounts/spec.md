# local-accounts Specification

## Purpose
Criação de conta, login, sessão e saída pela API, com só o token guardado no navegador (`vtm5.token`), além da ficha de exemplo.
## Requirements
### Requirement: Tela de abertura
Ao iniciar, o app SHALL exibir a tela de abertura ("Vampiro · A Máscara", "Abrindo a ficha…", spinner e barras pulsantes) apenas enquanto restaura a sessão pela API, sem duração mínima, e então ir para a ficha, o assistente ou a tela de entrada. Sem conexão com a API, a tela de abertura MUST continuar visível com o toast de erro de conexão e a ação "Tentar de novo".

#### Scenario: Sessão existente com ficha criada
- **WHEN** o app abre com `vtm5.token` válido e `GET /me/sheet` devolve uma ficha com `criada: true`
- **THEN** após a abertura, a ficha é exibida na aba Ficha

#### Scenario: Sessão existente sem ficha criada
- **WHEN** o app abre com token válido e a ficha vem com `criada: false` ou `sheet: null`
- **THEN** o assistente de criação abre no passo 1

#### Scenario: Sem sessão
- **WHEN** o app abre sem `vtm5.token`
- **THEN** a tela de entrada é exibida sem chamar a API

#### Scenario: Token recusado
- **WHEN** o app abre com um token que a API responde com `401`
- **THEN** o token é apagado e a tela de entrada é exibida

#### Scenario: API fora do ar
- **WHEN** o app abre com token e a API não responde
- **THEN** a tela de abertura continua, aparece o toast "Sem conexão" com "Tentar de novo", e tocar nele refaz a restauração

#### Scenario: Sem espera artificial
- **WHEN** a sessão termina de ser restaurada
- **THEN** a tela de abertura sai imediatamente, sem aguardar um tempo mínimo

### Requirement: Criar conta local
O usuário SHALL poder criar uma conta informando nome, nome de usuário, e-mail e senha duas vezes, nessa ordem no formulário. A conta MUST ser criada na API (`POST /auth/signup`); o `web` confere antes, sem chamar a API, os campos vazios, o formato do nome de usuário (`^[a-z][a-z0-9_.]{2,19}$` depois de tirar os espaços das pontas e passar para minúsculas), o formato do e-mail, a senha de pelo menos 6 caracteres e a confirmação de senha. O campo "Nome de usuário" MUST usar `autoComplete="username"`, sem correção nem capitalização automáticas. Erros de cadastro MUST ser exibidos como toast de erro (ver `notifications`), com a mensagem que a API devolver, e não como texto inline no formulário.

#### Scenario: Cadastro válido
- **WHEN** o usuário preenche nome, um nome de usuário válido e livre, um e-mail válido ainda não cadastrado e duas senhas iguais com pelo menos 6 caracteres e confirma
- **THEN** a conta é criada na API, o token é salvo, a sessão é iniciada e o assistente de criação abre

#### Scenario: Senhas diferentes
- **WHEN** as senhas não conferem
- **THEN** um toast de erro com a mensagem "As senhas não conferem." aparece e a API não é chamada

#### Scenario: Senha curta
- **WHEN** a senha tem menos de 6 caracteres
- **THEN** um toast de erro com a mensagem "A senha precisa ter pelo menos 6 caracteres." aparece e a API não é chamada

#### Scenario: E-mail já cadastrado
- **WHEN** a API responde `409` por causa do e-mail
- **THEN** um toast de erro com a mensagem "E-mail já cadastrado. Use \"Entrar\"." é exibido

#### Scenario: Nome de usuário já em uso
- **WHEN** a API responde `409` por causa do nome de usuário
- **THEN** um toast de erro com a mensagem "Nome de usuário já em uso." é exibido

#### Scenario: Nome ausente
- **WHEN** o nome está vazio no cadastro
- **THEN** um toast de erro com a mensagem "Informe o nome." é exibido

#### Scenario: Nome de usuário ausente
- **WHEN** o nome de usuário está vazio no cadastro
- **THEN** um toast de erro com a mensagem "Informe o nome de usuário." é exibido e a API não é chamada

#### Scenario: Nome de usuário inválido
- **WHEN** o nome de usuário tem menos de 3 ou mais de 20 caracteres, caracteres fora de letras, números, `_` e `.`, ou não começa por letra
- **THEN** um toast de erro com a mensagem "Nome de usuário: 3 a 20 letras, números, _ ou ., começando por letra." é exibido e a API não é chamada

#### Scenario: Sem erro inline
- **WHEN** qualquer erro de cadastro ocorre
- **THEN** nenhum parágrafo de erro é renderizado dentro do formulário

### Requirement: Entrar
O usuário SHALL poder entrar com e-mail ou nome de usuário, num único campo "E-mail ou usuário" (normalizado para minúsculas, sem espaços nas pontas), e senha de uma conta existente na API (`POST /auth/login` com `{ identifier, password }`). O campo MUST usar `autoComplete="username"` e não ser do tipo `email`. Na entrada o `web` confere só se os campos estão preenchidos, sem validar o formato do e-mail. Erros de entrada MUST ser exibidos como toast de erro, e não como texto inline no formulário. Enquanto a requisição corre, o botão de confirmar MUST ficar desabilitado com o texto "Entrando…" (ou "Criando…" no cadastro).

#### Scenario: Entrar com e-mail
- **WHEN** o e-mail e a senha conferem com uma conta da API
- **THEN** o token é gravado em `vtm5.token`, a ficha é lida por `GET /me/sheet` e a ficha (ou o assistente) do usuário é carregada

#### Scenario: Entrar com nome de usuário
- **WHEN** o usuário digita o nome de usuário (em qualquer caixa) e a senha correta
- **THEN** a sessão é iniciada da mesma forma que ao entrar com o e-mail

#### Scenario: Credenciais erradas
- **WHEN** a API responde `401` porque o e-mail ou usuário não existe ou a senha não confere
- **THEN** um toast de erro com a mensagem "E-mail, usuário ou senha incorretos." é exibido

#### Scenario: Campos vazios
- **WHEN** falta o e-mail ou usuário, ou a senha
- **THEN** um toast de erro com a mensagem "Informe o e-mail ou usuário." ou "Informe a senha." é exibido sem chamar a API

#### Scenario: Aguardando a API
- **WHEN** o usuário confirma o formulário de entrar ou criar conta
- **THEN** o botão de confirmar fica desabilitado com "Entrando…" ou "Criando…" até a resposta, e um segundo envio não dispara outra requisição

#### Scenario: Sem conexão
- **WHEN** a API não responde ao entrar
- **THEN** aparece o toast "Sem conexão" e o formulário volta a aceitar envio

### Requirement: Sair
O usuário SHALL poder encerrar a sessão pelo menu da ficha. Antes de sair, o app MUST tentar enviar as mudanças pendentes da ficha.

#### Scenario: Sair
- **WHEN** o usuário escolhe "Sair" no menu
- **THEN** as mudanças pendentes são enviadas, `vtm5.token` é removido, a ficha em memória é descartada e a tela de entrada aparece

#### Scenario: Sair sem conexão
- **WHEN** o usuário sai e o envio das mudanças pendentes falha
- **THEN** a saída acontece mesmo assim

### Requirement: Armazenamento local
O app MUST guardar no navegador apenas o token de sessão, na chave `vtm5.token`. Contas e fichas MUST ficar só na API; as chaves `vtm5.accounts`, `vtm5.session`, `vtm5.name.<email>` e `vtm5.sheet.<email>` MUST NOT ser lidas nem gravadas, e dados antigos nelas não são importados. Falhas de acesso ao `localStorage` MUST ser ignoradas sem quebrar a interface.

#### Scenario: Ficha incompleta
- **WHEN** a ficha devolvida pela API não tem alguns campos
- **THEN** o app abre a ficha completando os campos ausentes com os valores padrão

#### Scenario: Armazenamento bloqueado
- **WHEN** o `localStorage` lança exceção (modo privado ou bloqueio)
- **THEN** o app continua utilizável na sessão atual, com o token só em memória, sem erro na tela

#### Scenario: Dados locais antigos
- **WHEN** o navegador ainda tem `vtm5.accounts` e `vtm5.sheet.<email>` de versões anteriores
- **THEN** o app os ignora e a entrada depende de uma conta na API

### Requirement: Ficha de exemplo
O app SHALL incluir a ficha de exemplo do standalone como um arquivo JSON versionado (Vitória Salles, "Advogada da noite", Ventrue, predador Extorsionário, 12ª geração). Com a opção de dados de exemplo ligada, uma conta recém-criada MUST receber essa ficha, gravada pelo `web` na API com `PUT /me/sheet` logo após o cadastro.

#### Scenario: Cadastro com dados de exemplo
- **WHEN** a opção de dados de exemplo está ligada e o usuário cria uma conta
- **THEN** a ficha de exemplo é enviada por `PUT /me/sheet`, o assistente abre no passo 1 com o clã Ventrue selecionado e, no passo 8, o nome "Vitória Salles" já preenchido

#### Scenario: Cadastro sem dados de exemplo
- **WHEN** a opção está desligada (padrão)
- **THEN** a conta nova começa com uma ficha em branco e nenhum `PUT` é feito

