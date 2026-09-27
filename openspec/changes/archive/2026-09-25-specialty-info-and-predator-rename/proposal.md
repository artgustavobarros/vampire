## Why

Os selos de especialidade na aba Ficha são só leitura: o jogador vê "Direito" ou "Chantagem" mas não tem onde ler o que a especialidade faz. Além disso, a especialidade que vem do Tipo de Predador é um nome genérico da lista do livro ("Intimidação (Chantagem)"), e o jogador deveria poder ajustá-la ao personagem uma vez, logo depois de criar a ficha, sem refazer o assistente.

## What Changes

- Cada selo de especialidade na seção Habilidades da aba Ficha passa a ser um gatilho que abre o painel lateral de descrição (o mesmo `InfoProvider`), com kicker "Especialidade · <Habilidade>", título com o nome da especialidade, selo "<Habilidade> N" e a descrição "Um foco dentro de <Habilidade>. Quando a rolagem de <Habilidade> se encaixa nesta especialidade, some 1 dado à parada."
- A especialidade do Predador ainda não confirmada aparece com o selo em Blood (borda e texto `#7A1220`) em vez de tinta.
- Ao abrir o painel dessa especialidade pendente, o painel mostra uma nota explicando que ela veio do Tipo de Predador (com o nome do Predador) e um formulário "Nome da especialidade" (pré-preenchido com o nome atual) com os botões **Confirmar nome** e **Manter atual**.
- Confirmar (com o nome novo ou o atual) grava o nome final na ficha, o selo passa a ter o estilo comum das demais especialidades, o painel fecha e um toast `ok` com rótulo "Especialidade" diz "Especialidade <Nome> fixada em <Habilidade>." Isso acontece uma única vez: depois de confirmada, o painel da especialidade não mostra mais o formulário.
- Refazer o assistente e trocar a especialidade do Predador volta a deixá-la pendente.

## Capabilities

### New Capabilities
<!-- nenhuma -->

### Modified Capabilities
- `character-sheet`: "Especialidades na aba Ficha" — selos viram gatilhos do painel; a do Predador pendente tem destaque Blood; confirmar/renomear uma vez com toast.
- `trait-info`: novo requisito "Painel de especialidade" (conteúdo e formulário de renomear); "Gatilhos do painel" ganha os selos de especialidade da aba Ficha.

## Impact

- `web/src/lib/types.ts`: novo campo opcional `predEspecNome` na `Sheet` (nome confirmado da especialidade do Predador). Fichas antigas sem o campo ficam com a especialidade pendente.
- `web/src/rules/specialties.ts`: `specialtiesBySkill` passa a devolver, por especialidade, o nome e se é a pendente do Predador; nova função pura para confirmar o nome.
- `web/src/components/vtm/trait-grid.tsx`: selos como `InfoTrigger`, estilo Blood para a pendente.
- `web/src/features/info/build-info.ts` e `info-sheet.tsx`: novo alvo `espec` e formulário de renomear dentro do painel.
- `web/src/features/wizard/schema.ts`: gravar o passo 6 com outra especialidade do Predador apaga `predEspecNome`.
- Toast via `notify` existente (`lib/toast.tsx`); sem dependências novas.
