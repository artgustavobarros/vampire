## ADDED Requirements

### Requirement: Faixa do Mestre na ficha
Na ficha de um jogador aberta pelo Mestre (`/personagens/<userId>/<aba>`), a página SHALL mostrar, acima do cabeçalho da ficha e com a mesma largura máxima dele, uma faixa de fundo `blood` com o texto "Modo Mestre · <nome do personagem> · Ficha de jogador" (Karla caixa-alta, branco; "Sem nome" quando o personagem não tem nome) à esquerda e, à direita, dois botões em Karla caixa-alta: "Lista de personagens" (contornado em branco, texto branco) e "Sair" (fundo branco, texto `blood`). "Lista de personagens" MUST enviar as mudanças pendentes da ficha antes de abrir `/personagens`; "Sair" MUST encerrar a sessão e levar para `/entrar`. O texto MUST ser truncado com reticências quando não couber. Abaixo de 640px (breakpoint `sm` do Tailwind), os botões MUST ficar numa linha abaixo do texto, alinhados à direita. A faixa MUST NOT aparecer na ficha do jogador (`/ficha/<aba>`). Estilos MUST ser classes Tailwind no JSX.

#### Scenario: Faixa na ficha aberta pelo Mestre
- **WHEN** o Mestre abre a ficha de "Vitória Salles"
- **THEN** acima do cabeçalho aparece a faixa sangue com "Modo Mestre · Vitória Salles · Ficha de jogador" e os botões "Lista de personagens" e "Sair"

#### Scenario: Voltar pela faixa
- **WHEN** o Mestre marca Fome 3 e toca em "Lista de personagens" na faixa
- **THEN** a mudança é enviada em `PATCH /sheets/<userId>` antes de a URL passar a ser `/personagens`

#### Scenario: Sair pela faixa
- **WHEN** o Mestre toca em "Sair" na faixa
- **THEN** a sessão é encerrada e a URL passa a ser `/entrar`

#### Scenario: Jogador não vê a faixa
- **WHEN** o jogador abre a própria ficha
- **THEN** não há faixa "Modo Mestre" acima do cabeçalho

## MODIFIED Requirements

### Requirement: Ficha de jogador aberta pelo Mestre
A página `/personagens/<userId>/<aba>` SHALL mostrar a ficha do jogador `userId` com o mesmo layout, abas, barra inferior e diálogos da ficha do jogador, mais a faixa do Mestre acima do cabeçalho, carregando-a de `GET /sheets/<userId>` e gravando as alterações em `PATCH /sheets/<userId>`. Todas as partes da ficha MUST ser editáveis pelo Mestre, incluindo Atributos e Habilidades. Enquanto a ficha carrega, a página MUST mostrar "Abrindo a ficha…". Se a API responder `404` ou o jogador não tiver personagem criado, o app MUST mostrar o toast "Jogador não encontrado." (ou "Este jogador ainda não criou o personagem.") e voltar para `/personagens`. "Lista de personagens" no menu MUST enviar as mudanças pendentes antes de voltar para `/personagens`.

#### Scenario: Mestre edita a Fome
- **WHEN** o Mestre marca Fome 3 na ficha de um jogador
- **THEN** a mudança é enviada em `PATCH /sheets/<userId>` e, ao voltar à lista, o cartão mostra Fome "3"

#### Scenario: Recarregar a ficha aberta
- **WHEN** o Mestre recarrega a página em `/personagens/<userId>/rolagens`
- **THEN** a ficha do mesmo jogador reabre na aba Rolagens

#### Scenario: Jogador inexistente
- **WHEN** o Mestre acessa `/personagens/<uuid inexistente>/caracteristicas`
- **THEN** aparece o toast "Jogador não encontrado." e a URL passa a ser `/personagens`
