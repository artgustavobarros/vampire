## MODIFIED Requirements

### Requirement: Estrutura da ficha e navegação
A ficha SHALL ter um cabeçalho com o nome do personagem ("Sem nome" se vazio) e um botão de menu. O cabeçalho MUST NOT mostrar o rótulo da aba atual nem o rótulo "MESTRE": é igual para jogador e Mestre (o contexto do Mestre fica na faixa do Mestre, acima do cabeçalho).

O menu MUST abrir uma gaveta lateral com:
- o e-mail do dono da ficha;
- o nome do personagem;
- as abas, com a atual destacada;
- "Lista de personagens" (só para o Mestre, em sangue);
- "Sair" (em sangue).

Na ficha do jogador (`/ficha/<aba>`), as abas MUST ser, nesta ordem: Características, Disciplinas & Sangue, Ações, Coterie, Rodada, Biografia, Rolagens e, se habilitado, Sessões & XP. Na ficha de um jogador aberta pelo Mestre (`/personagens/<userId>/<aba>`), as abas MUST ser as mesmas sem Coterie e Rodada, que o Mestre acompanha pelo painel. O menu MUST NOT ter "Refazer personagem".

A aba atual MUST ser refletida na URL: `/ficha/<aba>` para o jogador e `/personagens/<userId>/<aba>` para o Mestre. Ids de aba:

| Aba | Id |
|---|---|
| Biografia | `resumo` |
| Rolagens | `rolagens` |
| Coterie | `coterie` |
| Rodada | `rodada` |

Redirecionamentos, sempre substituindo a entrada do histórico:
- os endereços antigos `registros`, `ficha`, `disciplinas` e `notas` MUST ir para `resumo`, `caracteristicas`, `disciplinas-e-sangue` e `rolagens`;
- qualquer outro endereço de aba desconhecido, incluindo `coterie` e `rodada` na ficha aberta pelo Mestre, MUST ir para `caracteristicas`.

#### Scenario: Trocar de aba pelo menu
- **WHEN** o jogador abre o menu e escolhe "Biografia"
- **THEN** a gaveta fecha, a URL passa a ser `/ficha/resumo` e o conteúdo da aba Biografia é exibido

#### Scenario: Cabeçalho do jogador
- **WHEN** o jogador está na aba Ações
- **THEN** o cabeçalho mostra só o nome do personagem e o botão de menu, sem "Ações" nem "MESTRE"

#### Scenario: Cabeçalho do Mestre
- **WHEN** o Mestre abre a ficha de um jogador
- **THEN** o cabeçalho mostra só o nome do personagem e o botão de menu, sem o rótulo "MESTRE"

#### Scenario: Menu do jogador
- **WHEN** o jogador abre o menu
- **THEN** a gaveta mostra as abas (com "Coterie", "Rodada" e "Rolagens", sem "Notas") e "Sair", sem "Lista de personagens" e sem "Refazer personagem"

#### Scenario: Menu do Mestre
- **WHEN** o Mestre abre o menu na ficha de um jogador
- **THEN** a gaveta mostra o e-mail desse jogador, as abas sem "Coterie" e sem "Rodada", "Lista de personagens" e "Sair", nessa ordem

#### Scenario: Mestre tenta abrir a aba Rodada de uma ficha
- **WHEN** o Mestre acessa `/personagens/<userId>/rodada`
- **THEN** a URL passa a ser `/personagens/<userId>/caracteristicas`

#### Scenario: Link antigo de Registros
- **WHEN** o usuário acessa `/ficha/registros`
- **THEN** a URL passa a ser `/ficha/resumo` e a aba Biografia é exibida

#### Scenario: Link antigo de Notas
- **WHEN** o usuário acessa `/ficha/notas`
- **THEN** a URL passa a ser `/ficha/rolagens` e a aba Rolagens é exibida

#### Scenario: Fechar menu pelo fundo
- **WHEN** o usuário clica no fundo escurecido
- **THEN** a gaveta fecha sem mudar de aba

#### Scenario: Link direto para aba
- **WHEN** o jogador recarrega a página estando na aba Rodada
- **THEN** a ficha reabre na aba Rodada
