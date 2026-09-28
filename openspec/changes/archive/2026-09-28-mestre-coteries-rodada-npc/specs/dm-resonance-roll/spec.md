## MODIFIED Requirements

### Requirement: Layout da aba Ações
A Rolagem de Ressonância SHALL usar duas colunas a partir de `md`: o painel de escolha à esquerda e, à direita, "Limpar" e o cartão de resultado. No celular, MUST usar uma coluna, na ordem painel, resultado.

Abaixo da Rolagem de Ressonância, a aba MUST mostrar a seção do Gerador de NPC (ver `npc-generator`), com largura total, separada por um título centralizado entre dois filetes `ink`. Estilos MUST ser classes Tailwind no JSX, reaproveitando `Chip` e `Button` existentes, sem regras novas em `styles.css`.

#### Scenario: Celular
- **WHEN** a aba é aberta numa tela de 375px
- **THEN** painel, resultado e Gerador de NPC aparecem empilhados, nessa ordem, sem rolagem horizontal

#### Scenario: Gerador abaixo da ressonância
- **WHEN** o Mestre abre `/personagens/acoes`
- **THEN** abaixo da Rolagem de Ressonância aparece o título "Gerador de NPC · Sertão alagoano, 1936" e o painel de filtros do gerador
