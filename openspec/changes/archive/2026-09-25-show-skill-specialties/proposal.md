## Why

As especialidades escolhidas no assistente (passo 4 e a do Predador no passo 6) ficam gravadas na ficha, mas a aba Ficha não as mostra em lugar nenhum. Na mesa, o jogador precisa ver ao lado da habilidade que tem, por exemplo, Persuasão com Negociação e Sedução para somar o dado extra.

## What Changes

- **Aba Ficha · Habilidades**: abaixo do nome de cada habilidade aparecem as suas especialidades, lado a lado em linha (quebrando quando não cabem), como selos pequenos com borda em tinta (fonte de rótulo, semibold, texto pequeno), seguindo o layout de referência, mas em linha em vez de empilhados. Os pontos continuam alinhados à direita, na linha do nome.
- **Fontes das especialidades**: a lista de `espec[habilidade]` e a especialidade do Predador (`predEspec`, no formato "Habilidade (Especialidade)"), sem repetições e ignorando textos vazios.
- Habilidade sem especialidade continua com a linha atual, sem espaço extra.
- Os selos são só leitura; o assistente (passos 2 e 3) não muda.
- Fora do escopo: editar ou remover especialidades pela ficha.

## Capabilities

### New Capabilities
<!-- nenhuma -->

### Modified Capabilities
- `character-sheet`: a aba Ficha passa a exibir as especialidades de cada habilidade abaixo do nome.

## Impact

- Regras: função pura nova que junta `espec` e `predEspec` por habilidade (ex.: `rules/specialties.ts`) com teste.
- Componentes: `components/vtm/trait-grid.tsx` ganha a prop opcional de especialidades por traço; `features/sheet/tabs/ficha-tab.tsx` passa essa prop no grid de Habilidades.
- Sem mudança de dados salvos nem de tipos da ficha.
