## MODIFIED Requirements

### Requirement: Painel do Mestre
As páginas `/personagens`, `/personagens/coteries`, `/personagens/acoes`, `/personagens/rodada` e `/personagens/bestiario` SHALL ficar dentro do painel do Mestre, com largura máxima de 1000px centralizada.

O cabeçalho do painel MUST mostrar:
- à esquerda, o nome do usuário (Cormorant, semibold) seguido do selo "MESTRE" (Karla caixa-alta, cor `blood`);
- à direita, o botão contornado "Sair da conta", que encerra a sessão e leva para `/entrar`;
- um filete `line` no fim.

Abaixo do cabeçalho, o painel MUST ter uma barra de abas, nesta ordem:
- "Lista de personagens" (`/personagens`);
- "Coteries" (`/personagens/coteries`);
- "Ações" (`/personagens/acoes`);
- "Rodada" (`/personagens/rodada`);
- "Bestiário" (`/personagens/bestiario`).

As abas MUST ser em Karla caixa-alta pequena, e a barra MUST terminar com filete `line`. No celular, a barra MUST rolar na horizontal em vez de quebrar linha, sem rolagem horizontal da página. A aba da página atual MUST ter texto `ink`, sublinhado de 2px em `blood` e `aria-current="page"`. As outras MUST ter texto suave e escurecer no hover. "Lista de personagens" MUST ser a aba aberta quando o Mestre entra.

A ficha de um jogador (`/personagens/<userId>/<aba>`) MUST NOT ficar dentro do painel: mantém o layout da ficha. Estilos MUST ser classes Tailwind no JSX, sem regras novas em `styles.css`.

#### Scenario: Mestre entra e vê a lista
- **WHEN** o Mestre "Mestre de exemplo" entra
- **THEN** o app abre `/personagens`, o cabeçalho mostra "Mestre de exemplo", "MESTRE" e "Sair da conta", e a aba "Lista de personagens" está ativa

#### Scenario: Abas do painel
- **WHEN** qualquer página do painel é exibida
- **THEN** a barra mostra, nessa ordem, "Lista de personagens", "Coteries", "Ações", "Rodada" e "Bestiário"

#### Scenario: Trocar para Ações
- **WHEN** o Mestre toca na aba "Ações"
- **THEN** a URL passa a ser `/personagens/acoes`, a aba "Ações" fica ativa e a página mostra a Rolagem de Ressonância

#### Scenario: Trocar para Rodada
- **WHEN** o Mestre toca na aba "Rodada"
- **THEN** a URL passa a ser `/personagens/rodada`, só a aba "Rodada" tem `aria-current="page"` e a página mostra a rodada

#### Scenario: Recarregar no Bestiário
- **WHEN** o Mestre recarrega a página em `/personagens/bestiario`
- **THEN** o painel reabre com a aba "Bestiário" ativa

#### Scenario: Sair da conta
- **WHEN** o Mestre toca em "Sair da conta" em qualquer aba do painel
- **THEN** a sessão é encerrada e a URL passa a ser `/entrar`

#### Scenario: Ficha fora do painel
- **WHEN** o Mestre abre `/personagens/<userId>/caracteristicas`
- **THEN** a página mostra o cabeçalho e o menu da ficha, sem a barra de abas do painel

#### Scenario: Jogador tenta abrir abas do Mestre
- **WHEN** um jogador com personagem criado acessa `/personagens/acoes`, `/personagens/coteries`, `/personagens/rodada` ou `/personagens/bestiario`
- **THEN** a URL passa a ser `/ficha/caracteristicas`
