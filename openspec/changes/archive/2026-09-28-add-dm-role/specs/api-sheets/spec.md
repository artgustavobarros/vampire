## ADDED Requirements

### Requirement: Características travadas depois da criação
Quando a ficha gravada do jogador já está criada (`criada: true`), `PATCH /api/me/sheet` e `PUT /api/me/sheet` MUST responder `403` com a mensagem `Atributos e Habilidades só podem ser alterados pelo Mestre.` e não gravar nada se o corpo trouxer `attrs` ou `skills` com valor diferente do gravado (comparação profunda, sem depender da ordem das chaves). Enviar `attrs` ou `skills` iguais ao gravado MUST ser aceito. Enquanto a ficha não está criada (ou não existe), a trava MUST NOT se aplicar. A trava MUST NOT se aplicar às rotas do Mestre.

#### Scenario: Jogador muda atributo depois de criar
- **WHEN** a ficha gravada tem `criada: true` e `attrs.Força: 2`, e o jogador envia `{ "patch": { "attrs": { "Força": 3, ... } } }`
- **THEN** a API responde `403` com a mensagem `Atributos e Habilidades só podem ser alterados pelo Mestre.` e a ficha continua com `Força: 2`

#### Scenario: Durante a criação
- **WHEN** a ficha gravada tem `criada: false` e o jogador envia um `patch` com `skills`
- **THEN** o `patch` é gravado normalmente

#### Scenario: Concluir a criação
- **WHEN** a ficha gravada tem `criada: false` e o jogador envia um único `patch` com `criada: true` e `attrs`
- **THEN** o `patch` é gravado normalmente

#### Scenario: Valor igual ao gravado
- **WHEN** a ficha gravada tem `criada: true` e o jogador envia `attrs` idêntico ao gravado junto com `fome: 2`
- **THEN** a API responde `200` e grava a Fome

#### Scenario: Outros campos continuam livres
- **WHEN** a ficha gravada tem `criada: true` e o jogador envia `{ "patch": { "fome": 3, "notas": "…" } }`
- **THEN** a API responde `200` com a ficha mesclada

### Requirement: Lista de fichas para o Mestre
A API SHALL expor `GET /api/sheets`, só para `dm`, que responde `200` com a lista de todos os usuários `player`, cada item com `{ user: { id, email, name, role }, sheet, updatedAt }`, onde `sheet` e `updatedAt` são `null` para quem ainda não tem ficha. A lista MUST vir ordenada pelo nome do usuário e MUST NOT incluir contas `dm`.

#### Scenario: Mestre lista as fichas
- **WHEN** existem dois jogadores, um com ficha e outro sem, e o Mestre chama `GET /api/sheets`
- **THEN** a resposta traz os dois, o primeiro com a ficha gravada e o outro com `sheet: null`

#### Scenario: Jogador tenta listar
- **WHEN** um `player` chama `GET /api/sheets`
- **THEN** a API responde `403`

### Requirement: Ficha de qualquer jogador para o Mestre
A API SHALL expor `GET /api/sheets/:userId` e `PATCH /api/sheets/:userId`, só para `dm`, agindo sobre a ficha do jogador `userId`. O `GET` MUST responder `{ user, sheet, updatedAt }` (o jogador como na lista, mais a ficha como em `GET /api/me/sheet`); o `PATCH` MUST ter o mesmo corpo e resposta de `PATCH /api/me/sheet`. O `PATCH` MUST mesclar numa única operação como o `PATCH /api/me/sheet` e MUST NOT aplicar a trava das Características. Um `userId` que não é UUID MUST responder `400`; um jogador inexistente (ou uma conta `dm`) MUST responder `404` com a mensagem `Jogador não encontrado.`.

#### Scenario: Mestre ajusta atributo
- **WHEN** a ficha do jogador tem `criada: true` e o Mestre envia `PATCH /api/sheets/:userId` com `attrs` alterado
- **THEN** a API responde `200` com a ficha mesclada com os novos atributos

#### Scenario: Jogador inexistente
- **WHEN** o Mestre chama `GET /api/sheets/:userId` com um UUID que não é de nenhum jogador
- **THEN** a API responde `404` com a mensagem `Jogador não encontrado.`

#### Scenario: Jogador tenta abrir outra ficha
- **WHEN** um `player` chama `GET /api/sheets/:userId` com o id de outro jogador
- **THEN** a API responde `403`

## MODIFIED Requirements

### Requirement: Uma ficha por jogador
Cada jogador SHALL ter no máximo uma ficha, guardada na tabela `sheets` como JSON (`jsonb`) no formato `Sheet` do `web` (`web/src/lib/types.ts`), ligada ao jogador e apagada junto com ele. Todas as rotas de ficha são protegidas; as rotas `/api/me/sheet` MUST agir só sobre a ficha do usuário do token, e só as rotas `/api/sheets` do Mestre podem ler ou gravar a ficha de outro jogador.

#### Scenario: Isolamento entre jogadores
- **WHEN** dois jogadores gravam fichas diferentes
- **THEN** cada um, ao ler `GET /api/me/sheet`, recebe só a própria ficha

#### Scenario: Sem token
- **WHEN** qualquer rota de ficha é chamada sem token válido
- **THEN** a API responde `401`
