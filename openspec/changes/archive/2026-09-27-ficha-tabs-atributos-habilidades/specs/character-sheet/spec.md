## ADDED Requirements

### Requirement: Abas de Atributos e Habilidades em telas menores
Em telas com largura abaixo de 1024px (breakpoint `lg` do Tailwind — tablet e celular), a aba Ficha SHALL exibir, no lugar dos títulos de seção "Atributos" e "Habilidades", um seletor segmentado com duas abas, "Atributos" e "Habilidades", ocupando a largura do conteúdo. Apenas o bloco da aba ativa SHALL ficar visível; "Atributos" MUST ser a aba ativa ao abrir a aba Ficha. Os painéis de Vitalidade e Força de Vontade SHALL vir logo abaixo do bloco das abas, na mesma posição para as duas abas.

O seletor MUST usar a semântica de abas acessível (`tablist`/`tab`/`tabpanel`, `aria-selected`, setas do teclado para trocar de aba) e o estilo da ficha: cantos retos, rótulos Karla em caixa-alta, aba ativa com fundo branco e texto tinta, aba inativa com texto suave sobre o fundo do seletor. Estilos MUST ser classes Tailwind no JSX.

A partir de 1024px, a aba Ficha MUST manter o layout atual: os títulos "Atributos" e "Habilidades", os dois blocos visíveis, Vitalidade e Força de Vontade entre eles, e nenhum seletor de abas.

A aba escolhida MUST NOT ser gravada na ficha nem na URL. Trocar de aba MUST NOT alterar valores de traços nem especialidades.

#### Scenario: Abertura no celular
- **WHEN** o usuário abre a aba Ficha numa tela de 390px de largura
- **THEN** o seletor mostra "Atributos" ativo, os grupos Físicos, Sociais e Mentais estão visíveis, as habilidades estão ocultas e Vitalidade e Força de Vontade aparecem abaixo dos atributos

#### Scenario: Trocar para Habilidades
- **WHEN** numa tela de tablet (768px) o usuário toca em "Habilidades"
- **THEN** os atributos ficam ocultos, as habilidades com seus pontos e selos de especialidade ficam visíveis, e Vitalidade e Força de Vontade continuam logo abaixo do bloco

#### Scenario: Navegação pelo teclado
- **WHEN** o foco está na aba "Atributos" e o usuário pressiona a seta para a direita
- **THEN** o foco vai para "Habilidades" e o bloco de habilidades passa a ser exibido

#### Scenario: Desktop sem abas
- **WHEN** o usuário abre a aba Ficha numa tela de 1280px
- **THEN** não há seletor de abas; os títulos "Atributos" e "Habilidades" e os dois blocos estão visíveis, com Vitalidade e Força de Vontade entre eles

#### Scenario: Aba não persiste
- **WHEN** o usuário ativa "Habilidades", vai para a aba Disciplinas e volta para a Ficha
- **THEN** a Ficha reabre com "Atributos" ativo e a URL continua `/ficha/ficha`

#### Scenario: Editar traço na aba ativa
- **WHEN** na aba "Habilidades" o usuário marca o 3º ponto de Furtividade e depois volta para "Atributos"
- **THEN** Furtividade fica gravada com 3 e os atributos continuam com os valores anteriores
