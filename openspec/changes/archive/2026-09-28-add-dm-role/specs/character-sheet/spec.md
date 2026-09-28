## ADDED Requirements

### Requirement: Características somente leitura para o jogador
Com o personagem criado, a aba Características SHALL exibir os pontos de Atributos e Habilidades do jogador somente para leitura: os pontos MUST NOT ser clicáveis nem focáveis como controle, e MUST ser anunciados como imagem com o valor (ex.: "Força: 2 de 5"). Os nomes dos traços e os selos de especialidade MUST continuar abrindo o painel de informação. Quando a ficha é aberta pelo Mestre, os pontos MUST continuar editáveis.

#### Scenario: Jogador tenta mudar um atributo
- **WHEN** o jogador com personagem criado toca no 3º ponto de Força na aba Características
- **THEN** nada muda e nenhuma gravação é enviada

#### Scenario: Informação continua disponível
- **WHEN** o jogador toca no nome "Furtividade" na aba Características
- **THEN** o painel de informação de Furtividade abre

#### Scenario: Mestre ajusta um atributo
- **WHEN** o Mestre, com a ficha de um jogador aberta, toca no 3º ponto de Força
- **THEN** Força passa a 3 e a mudança é gravada na ficha desse jogador

## MODIFIED Requirements

### Requirement: Estrutura da ficha e navegação
A ficha SHALL ter um cabeçalho com o nome do personagem ("Sem nome" se vazio) e um botão de menu. O cabeçalho MUST NOT mostrar o rótulo da aba atual. Quando o usuário é o Mestre, o cabeçalho MUST mostrar, ao lado do nome, o rótulo "MESTRE" em Karla caixa-alta na cor `blood` (vermelho sangue). O menu MUST abrir uma gaveta lateral com o e-mail do dono da ficha, o nome do personagem, as abas (Características, Disciplinas & Sangue, Ações, Biografia, Notas e, se habilitado, Sessões & XP) com a atual destacada, "Lista de personagens" (só para o Mestre, em sangue) e "Sair" (em sangue). O menu MUST NOT ter "Refazer personagem". A aba atual MUST ser refletida na URL: `/ficha/<aba>` para o jogador e `/personagens/<userId>/<aba>` para o Mestre; a aba Biografia MUST usar o id `resumo`. Os endereços antigos `registros`, `ficha` e `disciplinas` MUST redirecionar (substituindo a entrada do histórico) para `resumo`, `caracteristicas` e `disciplinas-e-sangue`; qualquer outro endereço de aba desconhecido MUST redirecionar para `caracteristicas`.

#### Scenario: Trocar de aba pelo menu
- **WHEN** o jogador abre o menu e escolhe "Biografia"
- **THEN** a gaveta fecha, a URL passa a ser `/ficha/resumo` e o conteúdo da aba Biografia é exibido

#### Scenario: Cabeçalho do jogador
- **WHEN** o jogador está na aba Ações
- **THEN** o cabeçalho mostra só o nome do personagem e o botão de menu, sem "Ações" nem "MESTRE"

#### Scenario: Cabeçalho do Mestre
- **WHEN** o Mestre abre a ficha de um jogador
- **THEN** o cabeçalho mostra o nome do personagem e, ao lado, "MESTRE" em vermelho sangue

#### Scenario: Menu do jogador
- **WHEN** o jogador abre o menu
- **THEN** a gaveta mostra as abas e "Sair", sem "Lista de personagens" e sem "Refazer personagem"

#### Scenario: Menu do Mestre
- **WHEN** o Mestre abre o menu na ficha de um jogador
- **THEN** a gaveta mostra o e-mail desse jogador, as abas, "Lista de personagens" e "Sair", nessa ordem

#### Scenario: Link antigo de Registros
- **WHEN** o usuário acessa `/ficha/registros`
- **THEN** a URL passa a ser `/ficha/resumo` e a aba Biografia é exibida

#### Scenario: Fechar menu pelo fundo
- **WHEN** o usuário clica no fundo escurecido
- **THEN** a gaveta fecha sem mudar de aba

#### Scenario: Link direto para aba
- **WHEN** o usuário recarrega a página estando na aba Notas
- **THEN** a ficha reabre na aba Notas
