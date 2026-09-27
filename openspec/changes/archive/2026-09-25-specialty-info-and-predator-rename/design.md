## Context

- `rules/specialties.ts#specialtiesBySkill` junta `sheet.espec` (assistente) com `sheet.predEspec` ("Habilidade (Especialidade)") e devolve `Record<string, string[]>`; `TraitGrid` renderiza cada item como `<li>` estático.
- O painel lateral (`features/info/info-sheet.tsx`) é único, guiado por `InfoTarget` → `buildInfo` (função pura) → `InfoContent`. Hoje ele é só leitura.
- `predEspec` é validado no passo 6 contra `predator.specialties`; portanto o nome renomeado **não** pode ser gravado em `predEspec`, senão o refazer falharia na validação.
- Toasts: `notify(msg, { tom: "ok", titulo })` em `lib/toast.tsx` (borda Moss para `ok`, como no print).

## Goals / Non-Goals

**Goals:**
- Selo de especialidade abre o painel de descrição.
- Especialidade do Predador pendente em Blood, com renomear/manter uma única vez, fechando com toast.
- Refazer o assistente continua funcionando e a regra continua pura/testável.

**Non-Goals:**
- Editar ou remover especialidades do assistente pela ficha.
- Descrições por especialidade específica (o texto é genérico por habilidade).
- Selos clicáveis no assistente (o `TraitGrid` do passo 3 não recebe `specialties`).

## Decisions

1. **Novo campo `predEspecNome?: string` na `Sheet`** guarda o nome confirmado. Pendente ⇔ `predEspec` casa com "Habilidade (X)" e `predEspecNome` é `undefined`. Confirmar com "Manter atual" grava o nome original.
   - Alternativa: mover a especialidade para `espec[skill]` e limpar `predEspec`. Rejeitada: o refazer relê `predEspec` no passo 6 e perderia a escolha do Predador (e duplicaria ao concluir de novo).
   - Alternativa: flag booleana + reescrever `predEspec`. Rejeitada pela validação do passo 6.
2. **`specialtiesBySkill` devolve `Record<string, SpecialtyEntry[]>`** com `{ nome, pendente }`. Com `predEspecNome`, usa esse nome no lugar do da lista. Deduplicação por nome continua; se o nome do Predador colidir com um do assistente, o item existente fica, marcado `pendente` se aplicável (o jogador ainda precisa confirmar).
3. **Função pura `confirmPredatorSpecialty(sheet, nome)`** em `rules/specialties.ts` devolve `{ patch, skill, nome } | null` (nome aparado; vazio → `null`, o botão fica desabilitado). O componente chama `patchSheet(patch)`, fecha o painel e `notify(\`Especialidade ${nome} fixada em ${skill}.\`, { tom: "ok", titulo: "Especialidade" })`.
4. **Novo `InfoTarget` `{ kind: "espec"; key: string; skill: string; nivel: number; predador?: string }`** e `specialtyInfo` em `build-info.ts`: kicker "Especialidade · <skill>", título `key`, selo "<skill> N", desc genérica, nota do Predador (com o nome do Predador) quando `predador` vem preenchido, que é o sinal de pendente. `InfoContent` ganha `renomear?: boolean` para o `InfoProvider` renderizar o formulário.
5. **Formulário no painel** num componente próprio (`features/info/specialty-rename.tsx`) que usa `useSheet`/`patchSheet` e recebe `onDone` para fechar o painel. Campo com `Input` shadcn e botões com as classes da ficha (primário tinta, secundário com borda), sem cantos arredondados, estilo só em Tailwind no JSX.
6. **Refazer**: em `wizardToPatch`, quando `predEspec` está nos campos do passo e difere do valor gravado, `patch.predEspecNome = undefined` (volta a pendente). Mesma especialidade mantém o nome confirmado.
7. **Selo pendente**: `border-blood text-blood` no lugar de `border-ink text-ink`; hover do gatilho segue Blood. O selo é um `<button>` dentro do `<li>` (via `InfoTrigger`) para teclado.

## Risks / Trade-offs

- [Fichas antigas já criadas aparecem com o selo do Predador em Blood] → comportamento desejado: dá a chance única de renomear.
- [Nome renomeado igual a uma especialidade do assistente] → dedup mostra um só selo; aceitável.
- [Painel fica "com estado" pela primeira vez] → o formulário é isolado num componente e só aparece quando `renomear` é verdadeiro; o resto do painel continua puro.
- [Mudança de retorno de `specialtiesBySkill`] → único consumidor é `FichaTab`/`TraitGrid`; testes existentes em `rules.test.ts` e `components.test.tsx` precisam ser atualizados.
