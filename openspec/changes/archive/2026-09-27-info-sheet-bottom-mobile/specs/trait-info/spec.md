## MODIFIED Requirements

### Requirement: Painel lateral de descrição
O app SHALL oferecer um painel de descrição construído com o `Sheet` shadcn, aberto pela direita, com 400px de largura (`max-width: 92vw`), altura total, fundo Vellum `#F4F3F0`, filete esquerdo de 1px e fundo escurecido `rgba(0,0,0,.55)`. Quando o conteúdo tem tabelas, a largura MUST ser 760px (mantendo `max-width: 92vw`). O painel MUST fechar no ×, com clique fora ou com Esc, e MUST entrar deslizando 24px da direita em 200ms, declarada com classes Tailwind no componente (sem keyframes no CSS global). A estrutura MUST ser: kicker (rótulo Karla), título (Cormorant 600 32px), selo do valor atual (fundo tinta, rótulo branco, omitido quando vazio), descrição (Cormorant 18px renderizada em elementos `<p>` nativos com `whitespace-pre-line`), título da lista e lista de níveis (omitidos quando a lista é vazia), tabelas, e nota (Cormorant 16px suave, omitida quando vazia). O painel MUST NOT depender de parsers externos ou regex de markdown customizados (`rich-text.tsx`). Só um painel MUST existir por vez.

Em telas que casam com `(max-width: 640px)`, o painel MUST abrir de baixo para cima (`side="bottom"` do mesmo `Sheet`), com largura total da tela (sem as larguras de 400px/760px nem o `max-width: 92vw`), altura máxima de 85% da altura visível (`85dvh`), rolagem vertical própria, filete superior de 1px no lugar do filete esquerdo, cantos retos e espaço inferior para a área segura do aparelho. Nessa variante o painel MUST NOT usar o deslize de 24px da direita. A escolha da posição MUST acontecer no cliente pela media query, e fora do navegador (SSR) o painel MUST assumir a variante lateral. Fechar no ×, com toque fora ou com Esc MUST continuar valendo; o painel MUST NOT depender de gesto de arrastar nem de bibliotecas de drawer.

Cada tabela MUST ter um título (rótulo Karla), filete superior, rolagem horizontal própria quando não cabe (sem rolagem horizontal da página), cabeçalho em Karla 700 11px maiúsculo com filete inferior, e células em Cormorant 15px com quebra de linha preservada. A primeira coluna e a linha destacada MUST usar peso 700. A linha destacada MUST ter fundo `#FFFFFF` e filete inferior tinta; as demais, fundo transparente e filete `rgba(13,13,13,.1)`.

#### Scenario: Fechar com Esc
- **WHEN** o painel está aberto e o usuário pressiona Esc
- **THEN** o painel fecha e o foco volta ao gatilho

#### Scenario: Título acessível
- **WHEN** o painel abre para "Força"
- **THEN** o diálogo tem nome acessível "Força"

#### Scenario: Painel largo com tabela
- **WHEN** o painel abre para "Potência de Sangue" numa tela com mais de 640px
- **THEN** o painel tem 760px de largura e a tabela rola na horizontal em telas estreitas

#### Scenario: Painel estreito sem tabela
- **WHEN** o painel abre para "Força" numa tela com mais de 640px
- **THEN** o painel tem 400px de largura

#### Scenario: Painel de baixo em tela estreita
- **WHEN** a tela casa com `(max-width: 640px)` e o painel abre para "Força"
- **THEN** o painel sobe da borda inferior com largura total, altura máxima de 85dvh e filete superior, sem as classes de 400px nem o deslize da direita

#### Scenario: Tabela no painel de baixo
- **WHEN** a tela casa com `(max-width: 640px)` e o painel abre para "Potência de Sangue"
- **THEN** o painel ocupa a largura total (sem 760px) e a tabela rola na horizontal dentro dele, sem rolagem horizontal da página

#### Scenario: Exatamente 640px
- **WHEN** a janela tem exatamente 640px de largura e o painel abre
- **THEN** o painel abre de baixo

#### Scenario: Fechar tocando fora na tela estreita
- **WHEN** a tela casa com `(max-width: 640px)`, o painel está aberto e o usuário toca no fundo escurecido
- **THEN** o painel fecha
