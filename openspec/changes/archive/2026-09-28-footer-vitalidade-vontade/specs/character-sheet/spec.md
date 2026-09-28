## MODIFIED Requirements

### Requirement: Barra inferior fixa
Enquanto a ficha estiver aberta, o app SHALL exibir uma barra fixa no rodapé, em qualquer aba, com fundo tinta e filete superior sangue. O botão "Checagem de sangue" MUST ficar centralizado como uma aba sangue que se sobrepõe ao filete superior da barra e MUST abrir o diálogo de Checagem de sangue. Abaixo dele, a barra SHALL mostrar três blocos lado a lado: à esquerda "Vitalidade", no centro "Fome" com o valor atual e à direita "Vontade". Os blocos de Vitalidade e Vontade MUST ter borda clara e mostrar as caixas de dano da trilha (máx. Vigor + 3 e máx. Autocontrole + Determinação), clicáveis no ciclo vazio → superficial → agravado → vazio, gravando na ficha. Os rótulos "Vitalidade" e "Vontade" MUST abrir o painel de informação da trilha. Abaixo de 640px (breakpoint `sm` do Tailwind), os três blocos MUST ficar empilhados em coluna, na ordem Vitalidade, Fome, Vontade, e o botão "Checagem de sangue" MUST continuar na mesma posição sobre o filete. As caixas MUST quebrar linha e ficar centralizadas quando não couberem. A barra MUST NOT ter o botão "Dormir". O conteúdo da página MUST ter espaço inferior suficiente para não ficar escondido atrás da barra. Estilos MUST ser classes Tailwind no JSX.

#### Scenario: Fome visível
- **WHEN** a Fome é 3
- **THEN** a barra inferior mostra "Fome" e "3" em qualquer aba

#### Scenario: Trilhas na barra
- **WHEN** a ficha tem Vigor 2, Autocontrole 2 e Determinação 3 e o usuário está na aba Notas
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

### Requirement: Aba Ficha
A aba SHALL exibir os atributos e habilidades com `DotRating`, Fome como 5 pontos clicáveis, Humanidade com 10 caixas e botões "− Nível"/"+ Nível" (limitados a 0–10), e Ressonância com tipo e intensidade selecionáveis. A aba MUST NOT exibir os painéis de Vitalidade e Força de Vontade; essas trilhas ficam na barra inferior fixa. A aba MUST NOT exibir os campos de identificação (Nome, Conceito, Crônica, Predador, Ambição, Clã, Senhor, Desejo, Geração); eles ficam na aba Resumo.

#### Scenario: Sem painel de identificação
- **WHEN** o usuário abre a aba Ficha
- **THEN** não há campos "Nome", "Clã" nem os demais campos de identificação, e o primeiro bloco da aba é o de Atributos/Habilidades

#### Scenario: Sem painéis de trilha
- **WHEN** o usuário abre a aba Ficha
- **THEN** a área de conteúdo da aba não mostra painéis de Vitalidade nem de Força de Vontade

#### Scenario: Marcar mancha
- **WHEN** o usuário toca numa caixa de Humanidade
- **THEN** a caixa alterna a marca de mancha `✕` e a contagem de manchas é atualizada

### Requirement: Abas de Atributos e Habilidades em telas menores
Em telas com largura abaixo de 1024px (breakpoint `lg` do Tailwind — tablet e celular), a aba Ficha SHALL exibir, no lugar dos títulos de seção "Atributos" e "Habilidades", um seletor segmentado com duas abas, "Atributos" e "Habilidades", ocupando a largura do conteúdo. Apenas o bloco da aba ativa SHALL ficar visível; "Atributos" MUST ser a aba ativa ao abrir a aba Ficha.

O seletor MUST usar a semântica de abas acessível (`tablist`/`tab`/`tabpanel`, `aria-selected`, setas do teclado para trocar de aba) e o estilo da ficha: cantos retos, rótulos Karla em caixa-alta, aba ativa com fundo branco e texto tinta, aba inativa com texto suave sobre o fundo do seletor. Estilos MUST ser classes Tailwind no JSX.

A partir de 1024px, a aba Ficha MUST exibir os títulos "Atributos" e "Habilidades", os dois blocos visíveis, Habilidades logo abaixo de Atributos, e nenhum seletor de abas.

A aba escolhida MUST NOT ser gravada na ficha nem na URL. Trocar de aba MUST NOT alterar valores de traços nem especialidades.

#### Scenario: Abertura no celular
- **WHEN** o usuário abre a aba Ficha numa tela de 390px de largura
- **THEN** o seletor mostra "Atributos" ativo, os grupos Físicos, Sociais e Mentais estão visíveis e as habilidades estão ocultas

#### Scenario: Trocar para Habilidades
- **WHEN** numa tela de tablet (768px) o usuário toca em "Habilidades"
- **THEN** os atributos ficam ocultos e as habilidades com seus pontos e selos de especialidade ficam visíveis

#### Scenario: Navegação pelo teclado
- **WHEN** o foco está na aba "Atributos" e o usuário pressiona a seta para a direita
- **THEN** o foco vai para "Habilidades" e o bloco de habilidades passa a ser exibido

#### Scenario: Desktop sem abas
- **WHEN** o usuário abre a aba Ficha numa tela de 1280px
- **THEN** não há seletor de abas; os títulos "Atributos" e "Habilidades" e os dois blocos estão visíveis, com Habilidades logo abaixo de Atributos

#### Scenario: Aba não persiste
- **WHEN** o usuário ativa "Habilidades", vai para a aba Disciplinas e volta para a Ficha
- **THEN** a Ficha reabre com "Atributos" ativo e a URL continua `/ficha/ficha`

#### Scenario: Editar traço na aba ativa
- **WHEN** na aba "Habilidades" o usuário marca o 3º ponto de Furtividade e depois volta para "Atributos"
- **THEN** Furtividade fica gravada com 3 e os atributos continuam com os valores anteriores
