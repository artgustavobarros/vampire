## Context

A ficha guarda especialidades em dois campos: `espec: Record<string, string[]>` (passo 4; a posição 0 é a escolhida no assistente) e `predEspec: string` no formato "Persuasão (Seduzir)" (passo 6, vindo de `PREDATORS[].specialties`). A aba Ficha renderiza as habilidades com `TraitGrid`, que também é usado nos passos 2 e 3 do assistente. O layout de referência mostra o nome da habilidade, os pontos à direita na mesma linha e, embaixo do nome, cada especialidade num selo com borda (empilhados na referência; aqui ficam em linha).

## Goals / Non-Goals

**Goals:**
- Mostrar as especialidades de cada habilidade na aba Ficha, no layout da referência.
- Juntar as duas fontes (`espec` e `predEspec`) numa única lista por habilidade.

**Non-Goals:**
- Editar especialidades pela ficha.
- Mudar o assistente ou o formato salvo.

## Decisions

- **Função pura `specialtiesBySkill(sheet)` em `rules/specialties.ts`**: devolve `Record<string, string[]>`; percorre `espec` (tira vazios após `trim`), depois interpreta `predEspec` com `/^(.+?)\s*\((.+)\)$/` e acrescenta ao fim da habilidade, sem duplicar (comparação exata após `trim`). Alternativa: gravar o `predEspec` dentro de `espec` ao concluir o assistente — rejeitada porque muda dados salvos e o passo 6 continua podendo trocar o Predador.
- **`TraitGrid` ganha `specialties?: Record<string, readonly string[]>`**: quando o traço tem itens, o nome fica numa coluna (`flex-1 flex flex-col gap-1`) com os selos abaixo dele numa linha (`flex flex-row flex-wrap gap-1`), e o `DotRating` alinha ao topo (`items-start` na linha) para ficar ao lado do nome. Sem itens, o markup atual não muda. Alternativa: componente separado só para a ficha — rejeitada por duplicar o grid.
- **Selo**: `span` não interativo com classes Tailwind no próprio JSX (`w-fit border border-ink px-1.5 py-0.5 font-label font-semibold text-ink text-xs leading-none`), sem estilo global. Não reutiliza `Chip`, que é um botão selecionável.
- **Ficha**: `FichaTab` calcula `specialtiesBySkill(sheet)` e passa só no grid de Habilidades.

## Risks / Trade-offs

- [`predEspec` fora do formato "Habilidade (Especialidade)"] → a função ignora o valor em vez de quebrar.
- [Habilidade com muitas especialidades aumenta a altura da linha] → aceitável; é o comportamento da referência.
