## MODIFIED Requirements

### Requirement: Estrutura da ficha e navegação
A ficha SHALL ter um cabeçalho com o nome do personagem ("Sem nome" se vazio) e um botão de menu. O cabeçalho MUST NOT mostrar o rótulo da aba atual nem o rótulo "MESTRE": é igual para jogador e Mestre (o contexto do Mestre fica na faixa do Mestre, acima do cabeçalho). O menu MUST abrir uma gaveta lateral com o e-mail do dono da ficha, o nome do personagem, as abas (Características, Disciplinas & Sangue, Ações, Biografia, Rolagens e, se habilitado, Sessões & XP) com a atual destacada, "Lista de personagens" (só para o Mestre, em sangue) e "Sair" (em sangue). O menu MUST NOT ter "Refazer personagem". A aba atual MUST ser refletida na URL: `/ficha/<aba>` para o jogador e `/personagens/<userId>/<aba>` para o Mestre; a aba Biografia MUST usar o id `resumo` e a aba Rolagens o id `rolagens`. Os endereços antigos `registros`, `ficha`, `disciplinas` e `notas` MUST redirecionar (substituindo a entrada do histórico) para `resumo`, `caracteristicas`, `disciplinas-e-sangue` e `rolagens`; qualquer outro endereço de aba desconhecido MUST redirecionar para `caracteristicas`.

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
- **THEN** a gaveta mostra as abas (com "Rolagens" e sem "Notas") e "Sair", sem "Lista de personagens" e sem "Refazer personagem"

#### Scenario: Menu do Mestre
- **WHEN** o Mestre abre o menu na ficha de um jogador
- **THEN** a gaveta mostra o e-mail desse jogador, as abas, "Lista de personagens" e "Sair", nessa ordem

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
- **WHEN** o usuário recarrega a página estando na aba Rolagens
- **THEN** a ficha reabre na aba Rolagens

### Requirement: Barra inferior fixa
Enquanto a ficha estiver aberta, o app SHALL exibir uma barra fixa no rodapé, em qualquer aba, com fundo tinta e filete superior sangue. O botão "Checagem de sangue" MUST ficar centralizado como uma aba sangue que se sobrepõe ao filete superior da barra e MUST abrir o diálogo de Checagem de sangue. Abaixo dele, a barra SHALL mostrar três blocos lado a lado: à esquerda "Vitalidade", no centro "Fome" com o valor atual e à direita "Vontade". Os blocos de Vitalidade e Vontade MUST ter borda clara e mostrar as caixas de dano da trilha (máx. Vigor + 3 e máx. Autocontrole + Determinação), clicáveis no ciclo vazio → superficial → agravado → vazio, gravando na ficha. Os rótulos "Vitalidade" e "Vontade" MUST abrir o painel de informação da trilha. Abaixo de 640px (breakpoint `sm` do Tailwind), os três blocos MUST ficar empilhados em coluna, na ordem Vitalidade, Fome, Vontade, e o botão "Checagem de sangue" MUST continuar na mesma posição sobre o filete. As caixas MUST quebrar linha e ficar centralizadas quando não couberem. A barra MUST NOT ter o botão "Dormir". O conteúdo da página MUST ter espaço inferior suficiente para não ficar escondido atrás da barra. Estilos MUST ser classes Tailwind no JSX.

#### Scenario: Fome visível
- **WHEN** a Fome é 3
- **THEN** a barra inferior mostra "Fome" e "3" em qualquer aba

#### Scenario: Trilhas na barra
- **WHEN** a ficha tem Vigor 2, Autocontrole 2 e Determinação 3 e o usuário está na aba Rolagens
- **THEN** a barra inferior mostra "Vitalidade" com 5 caixas e "Vontade" com 5 caixas

#### Scenario: Ciclo da caixa de dano
- **WHEN** o usuário toca repetidamente numa caixa de Vitalidade vazia na barra inferior
- **THEN** ela passa por vazio → `/` superficial → `✕` agravado → vazio e cada estado é gravado na ficha

#### Scenario: Máximo acompanha atributo
- **WHEN** Vigor sobe de 2 para 3
- **THEN** a Vitalidade da barra passa a ter 6 caixas, preservando as marcas existentes

#### Scenario: Barra em coluna no celular
- **WHEN** a ficha é aberta numa tela de 390px de largura
- **THEN** a barra mostra "Checagem de sangue" centralizado sobre o filete e, abaixo, Vitalidade, Fome e Vontade empilhados nessa ordem

#### Scenario: Checagem de sangue pela barra
- **WHEN** o usuário clica "Checagem de sangue" na barra inferior
- **THEN** o diálogo de Checagem de sangue abre

#### Scenario: Sem Dormir na barra
- **WHEN** a ficha está aberta
- **THEN** a barra inferior não mostra o botão "Dormir"

#### Scenario: Informação da trilha
- **WHEN** o usuário toca no rótulo "Vontade" da barra
- **THEN** o painel de informação de Força de Vontade abre

## REMOVED Requirements

### Requirement: Aba Notas
**Reason**: A aba Notas é substituída pela aba Rolagens (paradas de dados salvas), definida em `dice-pools`.
**Migration**: O campo `notas` deixa de ser lido e escrito pelo web; o valor já gravado na API continua no JSON da ficha, sem ser apagado. Links para `/ficha/notas` e `/personagens/<userId>/notas` redirecionam para a aba Rolagens.
