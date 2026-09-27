## ADDED Requirements

### Requirement: URL base da API
O `web` SHALL falar com a API por um único cliente em `lib/api.ts`, cuja URL base vem de `VITE_API_URL` e, sem ela, MUST ser `http://localhost:3333/api`. Todas as chamadas MUST enviar e receber JSON.

#### Scenario: Sem variável definida
- **WHEN** o `web` roda sem `VITE_API_URL`
- **THEN** as chamadas vão para `http://localhost:3333/api/...`

#### Scenario: Variável definida
- **WHEN** `VITE_API_URL` é `https://vtm.exemplo.com/api`
- **THEN** a entrada chama `https://vtm.exemplo.com/api/auth/login`

### Requirement: Token Bearer
Quando há token de sessão, o cliente MUST enviá-lo em `Authorization: Bearer <token>` em toda chamada. Sem token, o cabeçalho MUST NOT ser enviado.

#### Scenario: Chamada autenticada
- **WHEN** o jogador está logado e o app lê a ficha
- **THEN** `GET /me/sheet` sai com `Authorization: Bearer <token da sessão>`

#### Scenario: Chamada pública
- **WHEN** o usuário ainda não entrou e envia o formulário de entrada
- **THEN** `POST /auth/login` sai sem o cabeçalho `Authorization`

### Requirement: Erros da API
Uma resposta com status fora de 2xx MUST virar um `ApiError` com o `status` HTTP e a `message` do corpo `{ statusCode, message, error }`. Falha de rede MUST virar um erro sem `status`. Esses erros MUST ser aceitos por `apiError` de `lib/toast.tsx`.

#### Scenario: Erro com mensagem
- **WHEN** a API responde `409` com `message: "E-mail já cadastrado. Use \"Entrar\"."`
- **THEN** a chamada rejeita com `ApiError` de `status: 409` e essa mensagem

#### Scenario: Sem conexão
- **WHEN** a API está fora do ar
- **THEN** a chamada rejeita com um erro sem `status`, e `apiError` mostra o rótulo "Sem conexão"

### Requirement: Sessão expirada em qualquer chamada
Um `401` em chamada autenticada MUST encerrar a sessão (apagar o token e limpar os stores do jogador e do personagem) e mostrar o toast de sessão expirada, levando à tela de entrada. `401` de `POST /auth/login` e `POST /auth/signup` MUST NOT encerrar sessão: são erros do formulário.

#### Scenario: Token expira durante o uso
- **WHEN** o jogador edita a ficha e o `PATCH /me/sheet` responde `401`
- **THEN** o token é apagado, aparece o toast "Sua sessão expirou. Entre de novo para continuar." e a tela de entrada é exibida

#### Scenario: Senha errada no login
- **WHEN** `POST /auth/login` responde `401`
- **THEN** só aparece o toast "E-mail ou senha incorretos.", sem aviso de sessão expirada
