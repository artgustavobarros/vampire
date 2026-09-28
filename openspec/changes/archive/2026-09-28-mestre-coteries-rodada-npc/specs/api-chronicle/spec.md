## ADDED Requirements

### Requirement: Coteries na API
A API SHALL guardar coteries (id, nome, data de criação) e membros (coterie, jogador, data de entrada) em tabelas próprias. Cada jogador MUST estar em no máximo uma coterie (restrição única no banco). Apagar a coterie ou o jogador MUST apagar a filiação junto.

Rotas, todas só do Mestre (`403` para jogador, `401` sem token):

| Rota | Faz | Resposta |
|---|---|---|
| `GET /api/coteries` | lista as coteries por ordem de criação, os membros por ordem de entrada | `200` com `[{ id, nome, membros: [{ user, sheet, updatedAt }] }]`; `sheet` e `updatedAt` como em `GET /api/sheets` |
| `POST /api/coteries` | cria, com `{ nome? }` | `201` com a coterie |
| `PATCH /api/coteries/:id` | renomeia, com `{ nome }` | `200` com a coterie |
| `DELETE /api/coteries/:id` | apaga | `204` |
| `PUT /api/coteries/:id/membros/:userId` | coloca o jogador | `200` com a coterie |
| `DELETE /api/coteries/:id/membros/:userId` | retira o jogador | `200` com a coterie |

Regras e erros:
- `nome` MUST ser texto de até 80 caracteres, sem espaços nas pontas; vazio é aceito.
- Coterie inexistente: `404` "Coterie não encontrada.".
- Jogador inexistente: `404` "Jogador não encontrado.".
- Jogador que ainda não criou o personagem: `400` "Este jogador ainda não criou o personagem.".
- Jogador em outra coterie: `409` "Este jogador já está em outra coterie.".
- Colocar quem já está na mesma coterie, ou retirar quem não está nela, MUST responder `200` sem mudar nada.

#### Scenario: Colocar jogador
- **WHEN** o Mestre envia `PUT /api/coteries/<id>/membros/<userId>` de um jogador sem coterie
- **THEN** a resposta é `200` e a coterie traz o jogador em `membros`, com a ficha

#### Scenario: Jogador em duas coteries
- **WHEN** o jogador já está na coterie A e o Mestre tenta colocá-lo na coterie B
- **THEN** a API responde `409` com "Este jogador já está em outra coterie."

#### Scenario: Jogador tenta listar coteries
- **WHEN** um jogador chama `GET /api/coteries`
- **THEN** a API responde `403`

### Requirement: Coterie do jogador
A API SHALL expor `GET /api/me/coterie`, para qualquer usuário autenticado. A resposta é `200` com `{ coterie: null }` quando o usuário não está em coterie. Quando está, é `{ coterie: { id, nome, membros: [{ userId, sheet }] } }`, com os membros por ordem de entrada, incluindo o próprio usuário.

Nos membros, `sheet` MUST ter só as chaves `nome`, `cla`, `criada`, `fome`, `vit`, `fdv` e `attrs`, e `attrs` só com `Vigor`, `Autocontrole` e `Determinação` (o bastante para as trilhas). A resposta MUST NOT trazer e-mail nem outras partes da ficha de outros jogadores.

#### Scenario: Projeção da ficha
- **WHEN** um membro tem `notas`, `skills` e `disciplinas` na ficha
- **THEN** `GET /api/me/coterie` não traz essas chaves nem o e-mail dele

#### Scenario: Sem coterie
- **WHEN** o jogador não está em nenhuma coterie
- **THEN** `GET /api/me/coterie` responde `200` com `{ "coterie": null }`

### Requirement: Inimigos na API
A API SHALL guardar os inimigos do Bestiário numa tabela própria (id, dados em `jsonb`, datas de criação e de atualização). Os dados MUST ser validados com este formato:
- `nome`: texto até 120;
- `visivel`: booleano;
- `vitMax` e `fdvMax`: inteiros de 1 a 20;
- `vit` e `fdv`: listas de marcas 0, 1 ou 2, com no máximo o máximo da trilha;
- `paradas`: até 20 de `{ nome: texto até 60, dados: inteiro de 0 a 30 }`;
- `especiais`: até 20 de `{ nome: texto até 80, texto: texto até 10 000 }`.

Rotas, todas só do Mestre:

| Rota | Faz | Resposta |
|---|---|---|
| `GET /api/enemies` | lista por ordem de criação | `200` com `[{ id, enemy, updatedAt }]` |
| `POST /api/enemies` | cria, com `{ enemy }` | `201` |
| `PUT /api/enemies/:id` | substitui, com `{ enemy }` | `200` |
| `DELETE /api/enemies/:id` | apaga | `204` |

`DELETE` MUST tirar o inimigo da ordem da rodada na mesma transação. Inimigo inexistente: `404` "Inimigo não encontrado.". Dados fora do formato: `400` "Inimigo inválido.".

#### Scenario: Criar inimigo
- **WHEN** o Mestre envia `POST /api/enemies` com um inimigo válido
- **THEN** a API responde `201` e ele aparece por último em `GET /api/enemies`

#### Scenario: Trilha maior que o máximo
- **WHEN** o corpo traz `vitMax: 3` e `vit: [0, 0, 0, 1]`
- **THEN** a API responde `400` com "Inimigo inválido."

#### Scenario: Excluir inimigo da rodada
- **WHEN** o Mestre apaga um inimigo que está na ordem da rodada
- **THEN** `GET /api/round` não traz mais esse inimigo

### Requirement: Rodada na API
A API SHALL guardar a rodada da crônica numa tabela de linha única, criada pela migração. O estado é `{ rodada: 1, vez: 0, ordem: [] }` no início; `ordem` é uma lista de `{ tipo: "jogador" | "inimigo", id, iniciativa: inteiro de 0 a 30 | null }`.

**`PUT /api/round`** (só o Mestre) substitui o estado, com `{ rodada, vez, ordem }`, e responde `200` com a mesma visão do `GET`. Validação:
- `rodada` MUST ser inteiro ≥ 1;
- `vez` MUST ser inteiro ≥ 0 e menor que o tamanho da ordem (ou 0 com a ordem vazia), senão `400` "Vez fora da ordem.";
- `ordem` MUST ter no máximo 50 participantes, sem repetição, só jogadores existentes com personagem criado e inimigos existentes, senão `400` "Participante inválido na rodada.".

**`GET /api/round`** (qualquer usuário autenticado) responde `200` com `{ rodada, vez, ordem, updatedAt }`, onde cada participante é:
- **jogador**: `{ tipo: "jogador", id, iniciativa, sheet }`, com `sheet` na mesma projeção de `GET /api/me/coterie`;
- **inimigo**: `{ tipo: "inimigo", id, iniciativa, nome, visivel, dados }`, com `dados` = `{ vitMax, vit, fdvMax, fdv, paradas, especiais }`.

Para o Mestre, `dados` MUST vir sempre. Para jogadores, `dados` MUST ser `null` quando `visivel` é `false`.

Participantes que deixaram de existir (jogador apagado, inimigo apagado) MUST ser omitidos na leitura, e `vez` MUST ser ajustada para continuar válida.

#### Scenario: Jogador não recebe dados ocultos
- **WHEN** um jogador chama `GET /api/round` e a ordem tem um inimigo com `visivel: false`
- **THEN** o participante vem com `nome` e `visivel: false`, e `dados: null`

#### Scenario: Mestre recebe tudo
- **WHEN** o Mestre chama `GET /api/round` com o mesmo inimigo
- **THEN** o participante vem com `dados` completos

#### Scenario: Jogador tenta mudar a rodada
- **WHEN** um jogador envia `PUT /api/round`
- **THEN** a API responde `403` e nada muda

#### Scenario: Vez inválida
- **WHEN** o Mestre envia `vez: 3` com 2 participantes
- **THEN** a API responde `400` com "Vez fora da ordem."

### Requirement: Documentação das novas rotas
As rotas de coteries, inimigos, rodada e `me/coterie` SHALL aparecer na documentação OpenAPI com tags próprias ("coteries (Mestre)", "enemies (Mestre)", "round", "coterie"), autenticação Bearer, esquemas de corpo e de resposta gerados dos schemas zod, e as respostas de erro no formato padrão.

#### Scenario: Swagger
- **WHEN** alguém abre a documentação da API
- **THEN** as rotas `/api/coteries`, `/api/enemies`, `/api/round` e `/api/me/coterie` aparecem com seus esquemas
