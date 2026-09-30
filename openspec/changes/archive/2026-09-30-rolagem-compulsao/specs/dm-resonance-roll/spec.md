## MODIFIED Requirements

### Requirement: Layout da aba Ações
A Rolagem de Ressonância SHALL usar duas colunas a partir de `md`: o painel de escolha à esquerda e, à direita, "Limpar" e o cartão de resultado. No celular, MUST usar uma coluna, na ordem painel, resultado.

Logo abaixo da Rolagem de Ressonância, a aba MUST mostrar a Rolagem de Compulsão (ver `dm-compulsion-roll`), com o mesmo layout de duas colunas a partir de `md` (painel à esquerda, "Limpar" e cartão à direita) e uma coluna no celular.

Abaixo da Rolagem de Compulsão, a aba MUST mostrar a seção do Gerador de NPC (ver `npc-generator`), com largura total, separada por um título centralizado entre dois filetes `ink`. Estilos MUST ser classes Tailwind no JSX, reaproveitando `Chip` e `Button` existentes, sem regras novas em `styles.css`.

#### Scenario: Celular
- **WHEN** a aba é aberta numa tela de 375px
- **THEN** painel e resultado da Ressonância, painel e resultado da Compulsão e Gerador de NPC aparecem empilhados, nessa ordem, sem rolagem horizontal

#### Scenario: Compulsão abaixo da ressonância
- **WHEN** o Mestre abre `/personagens/acoes`
- **THEN** logo abaixo da Rolagem de Ressonância aparece o painel "Rolagem de Compulsão"

#### Scenario: Gerador abaixo da compulsão
- **WHEN** o Mestre abre `/personagens/acoes`
- **THEN** abaixo da Rolagem de Compulsão aparece o título "Gerador de NPC · Sertão alagoano, 1936" e o painel de filtros do gerador
