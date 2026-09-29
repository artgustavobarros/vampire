## MODIFIED Requirements

### Requirement: Barra inferior fixa
Enquanto a ficha estiver aberta, o app SHALL exibir uma barra fixa no rodapé, em qualquer aba, com fundo tinta e filete superior sangue. O botão "Checagem de sangue" MUST ficar centralizado como uma aba sangue que se sobrepõe ao filete superior da barra e MUST abrir o diálogo de Checagem de sangue. Abaixo dele, a barra SHALL mostrar três blocos lado a lado: à esquerda "Vitalidade", no centro "Fome" com o valor atual e à direita "Vontade". Os blocos de Vitalidade e Vontade MUST ter borda clara e mostrar as caixas de dano da trilha (máx. Vigor + 3 e máx. Autocontrole + Determinação), clicáveis no ciclo vazio → superficial → agravado → vazio, gravando na ficha. Os rótulos "Vitalidade" e "Vontade" MUST abrir o painel de informação da trilha. Abaixo de 640px (breakpoint `sm` do Tailwind), os três blocos MUST ficar empilhados em coluna, na ordem Vitalidade, Fome, Vontade, e o botão "Checagem de sangue" MUST continuar na mesma posição sobre o filete. As caixas MUST quebrar linha e ficar centralizadas quando não couberem. A barra MUST NOT ter o botão "Dormir". O conteúdo da página MUST ter espaço inferior suficiente para não ficar escondido atrás da barra. Estilos MUST ser classes Tailwind no JSX.

Abaixo de 640px, a barra SHALL começar recolhida: uma linha única, centralizada, com "VIT x/y", "FOME n" (na cor brasa) e "VONT x/y", onde `x` é o número de caixas vazias da trilha e `y` o máximo, e uma seta para cima à direita. A linha recolhida inteira MUST ser um botão com `aria-expanded="false"` que expande a barra. Recolhida, a barra MUST NOT mostrar o botão "Checagem de sangue" nem os blocos. Expandida, a barra MUST mostrar o formato completo descrito acima e um botão de seta para baixo, com `aria-expanded="true"`, que a recolhe. Os valores da linha recolhida MUST refletir a ficha em tempo real. O estado recolhido/expandido MUST NOT ser gravado na ficha. A partir de 640px, a barra MUST ficar sempre no formato completo, sem linha recolhida nem botão de recolher. No celular, o espaço inferior da página MUST corresponder à altura da barra recolhida; expandida, a barra MAY cobrir o conteúdo.

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
- **WHEN** a ficha é aberta numa tela de 390px de largura e o usuário expande a barra
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

#### Scenario: Barra recolhida no celular
- **WHEN** a ficha é aberta numa tela de 390px de largura, com Vigor 2, Autocontrole 2, Determinação 3, Fome 1 e nenhum dano
- **THEN** a barra mostra só a linha "VIT 5/5  FOME 1  VONT 5/5" com a seta para cima, sem "Checagem de sangue" nem caixas

#### Scenario: Resumo conta caixas vazias
- **WHEN** a barra está recolhida e a Vitalidade (máx. 5) tem 1 caixa superficial e 1 agravada
- **THEN** a linha recolhida mostra "VIT 3/5"

#### Scenario: Expandir a barra
- **WHEN** a barra está recolhida numa tela de 390px e o usuário toca na linha
- **THEN** a barra sobe no formato completo, com "Checagem de sangue", os três blocos e a seta para baixo

#### Scenario: Recolher a barra
- **WHEN** a barra está expandida numa tela de 390px e o usuário toca na seta para baixo
- **THEN** a barra volta para a linha recolhida

#### Scenario: Desktop sempre expandido
- **WHEN** a ficha é aberta numa tela de 1024px de largura
- **THEN** a barra mostra o formato completo, sem linha recolhida nem seta de recolher
