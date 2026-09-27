# api-sheets Specification

## Purpose
Persistência da ficha do jogador autenticado na API (um personagem por jogador), guardada como o JSON `Sheet` do `web`, com leitura, gravação completa e mescla parcial.
## Requirements
### Requirement: Uma ficha por jogador
Cada jogador SHALL ter no máximo uma ficha, guardada na tabela `sheets` como JSON (`jsonb`) no formato `Sheet` do `web` (`web/src/lib/types.ts`), ligada ao jogador e apagada junto com ele. Todas as rotas de ficha são protegidas e MUST agir só sobre a ficha do jogador do token.

#### Scenario: Isolamento entre jogadores
- **WHEN** dois jogadores gravam fichas diferentes
- **THEN** cada um, ao ler `GET /api/me/sheet`, recebe só a própria ficha

#### Scenario: Sem token
- **WHEN** qualquer rota de ficha é chamada sem token válido
- **THEN** a API responde `401`

### Requirement: Ler a ficha
A API SHALL expor `GET /api/me/sheet`, que responde `200` com `{ sheet, updatedAt }`. Quando o jogador ainda não tem ficha, MUST responder `{ "sheet": null, "updatedAt": null }`, e o `web` completa com a ficha em branco (`normalizeSheet`).

#### Scenario: Ficha existente
- **WHEN** o jogador já gravou uma ficha
- **THEN** a resposta traz o JSON gravado, sem alterações, e a data da última gravação

#### Scenario: Conta nova
- **WHEN** o jogador nunca gravou uma ficha
- **THEN** a resposta é `200` com `sheet: null` e `updatedAt: null`

### Requirement: Gravar a ficha inteira
A API SHALL expor `PUT /api/me/sheet`, recebendo `{ sheet }`, que cria ou substitui por completo a ficha do jogador e responde `200` com `{ sheet, updatedAt }`.

#### Scenario: Primeira gravação
- **WHEN** o jogador sem ficha envia `PUT` com uma ficha
- **THEN** a ficha é criada e devolvida

#### Scenario: Substituição
- **WHEN** o jogador com ficha envia `PUT` com uma ficha sem o campo `notas`
- **THEN** a ficha gravada passa a não ter `notas`

### Requirement: Mesclar campos da ficha
A API SHALL expor `PATCH /api/me/sheet`, recebendo `{ patch }`, que mescla os campos de primeiro nível na ficha gravada (os campos enviados substituem os antigos por inteiro, os demais ficam), como o `patch` do character store do `web`. Se o jogador ainda não tiver ficha, o `patch` vira a ficha. A resposta é `200` com `{ sheet, updatedAt }` já mesclado. A mescla MUST ser feita numa única operação no banco, para que dois `PATCH` seguidos em campos diferentes não se sobrescrevam.

#### Scenario: Atualizar a Fome
- **WHEN** a ficha gravada tem `fome: 1` e `humanidade: 7` e o cliente envia `{ "patch": { "fome": 3 } }`
- **THEN** a ficha passa a ter `fome: 3` e continua com `humanidade: 7`

#### Scenario: Campo aninhado substituído por inteiro
- **WHEN** o cliente envia `{ "patch": { "attrs": { "Força": 3 } } }`
- **THEN** `attrs` passa a ser exatamente `{ "Força": 3 }`, como no `patch` do `web`

#### Scenario: Patches concorrentes
- **WHEN** duas requisições `PATCH` quase simultâneas alteram `fome` e `notas`
- **THEN** a ficha final tem as duas alterações

### Requirement: Validação mínima da ficha
A API SHALL tratar a ficha como dado do cliente: MUST aceitar só um objeto JSON (não array, não valor solto) e MUST rejeitar corpos acima de 1 MB, mas não aplica as regras de Vampiro (pontos, Geração, Predador), que continuam no `web`.

#### Scenario: Ficha que não é objeto
- **WHEN** o cliente envia `{ "sheet": [1, 2] }` ou `{ "patch": "texto" }`
- **THEN** a API responde `400` com a mensagem `Ficha inválida.`

#### Scenario: Corpo grande demais
- **WHEN** o corpo da requisição passa de 1 MB
- **THEN** a API responde `413` e nada é gravado

#### Scenario: Campos desconhecidos
- **WHEN** a ficha traz um campo que o `web` ainda não usa
- **THEN** o campo é guardado e devolvido como veio

