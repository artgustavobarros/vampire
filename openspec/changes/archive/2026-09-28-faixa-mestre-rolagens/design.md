## Context

- `SheetLayout` (`web/src/features/sheet/sheet-layout.tsx`) desenha o cabeçalho da ficha para jogador e Mestre; hoje, para o Mestre, põe o rótulo "MESTRE" em sangue ao lado do nome. "Lista de personagens" e "Sair" só existem dentro da gaveta do menu.
- As abas vêm de `SHEET_TABS` em `features/sheet/tabs.ts`, com ids na URL, `LEGACY_TABS` para endereços antigos e `SheetTabContent` escolhendo o componente.
- A ficha é o tipo `Sheet` (`lib/types.ts`), normalizada por `normalizeSheet` (`lib/sheet.ts`) e gravada por `patchSheet` no store com salvamento automático. A API guarda a ficha como JSON livre, então campos novos não exigem mudança no back.
- Os traços estão em `data/traits.ts` (`ATTRIBUTE_GROUPS`, `SKILL_GROUPS`); os valores atuais ficam em `sheet.attrs` e `sheet.skills`.
- Já existem `NativeSelect` (`components/vtm/fields.tsx`), `Panel`, `SectionTitle`, `FieldLabel` (`components/vtm/text.tsx`) e o `Stepper` dos formulários de regras (`features/actions/stepper.tsx`, com layout vertical e valor grande — não é o visual da referência).
- Estilos só com classes Tailwind no JSX, nada em `styles.css`.

## Goals / Non-Goals

**Goals:**
- Faixa sangue do Mestre acima do cabeçalho da ficha, com contexto e as ações "Lista de personagens" e "Sair".
- Cabeçalho da ficha idêntico para jogador e Mestre.
- Aba Rolagens no lugar de Notas, com paradas de dados salvas na ficha e total derivado dos valores atuais.

**Non-Goals:**
- Rolar os dados (sortear d10, sucessos, Fome nos dados). A parada só guarda e soma.
- Somar especialidades, Disciplinas ou Potência do Sangue à parada.
- Reordenar paradas ou confirmar a remoção.
- Mudar a gaveta do menu (o Mestre continua tendo "Lista de personagens" e "Sair" nela também).
- Apagar o campo `notas` já gravado na API.

## Decisions

### 1. Faixa dentro do `SheetLayout`, condicionada ao modo da ficha

A faixa é renderizada no próprio `SheetLayout`, antes do `<header>` e dentro do contêiner `max-w-[1000px]`, quando `tabs.to === "/personagens/$id/$aba"` (ficha aberta pelo Mestre). Usar o `base` das abas, em vez de `role === "dm"`, amarra a faixa ao contexto "ficha de jogador aberta pelo Mestre", que é o que o texto descreve. O rótulo "MESTRE" e a leitura de `role` que só servia a ele saem do cabeçalho (o `role` continua usado pelo item "Lista de personagens" da gaveta).

- Texto: `Modo Mestre · {name} · Ficha de jogador`, `truncate` numa `div min-w-0`. A referência diz "Sua ficha" porque lá o Mestre olhava a própria ficha; aqui ele sempre olha a de um jogador.
- Layout: `flex flex-wrap items-center justify-between gap-x-4 gap-y-2 bg-blood px-4 py-3`; os botões ficam num grupo `ml-auto flex gap-2`, que desce para a linha de baixo quando não cabe (abaixo de `sm` o texto ocupa `basis-full`).
- "Lista de personagens" reusa o mesmo `Link to="/personagens"` da gaveta (o envio das pendências já acontece nesse caminho); "Sair" reusa o mesmo handler de `logout()` + `navigate({ to: "/entrar" })` — extraído para uma função local para não duplicar.
- Alternativa considerada: um componente de rota em `personagens.$id.tsx` envolvendo o `SheetLayout`. Rejeitada porque a faixa precisa ficar dentro do mesmo contêiner de largura e acima do cabeçalho que o `SheetLayout` desenha.

### 2. Dados: `rolagens?: DicePool[]` na ficha, `notas` sai

```ts
export interface DicePool {
  id: string;        // id local (Date.now + random; randomUUID exige HTTPS), só para key e foco
  nome: string;
  attr?: string;     // nome do atributo (chave de sheet.attrs)
  skill?: string;    // nome da habilidade (chave de sheet.skills)
  mod: number;       // −10..+10
}
```

- Guarda nomes de traços, não valores: o total é sempre derivado de `sheet.attrs`/`sheet.skills`, por isso "acompanha a ficha" sem sincronização.
- `rolagens` é opcional no tipo e `normalizeSheet` não precisa de padrão (ausente = lista vazia na aba). Entradas inválidas (não objeto) são descartadas na leitura da aba; `attr`/`skill` desconhecidos são tratados como "nenhum".
- Cada mudança chama `patchSheet({ rolagens: next })` com a lista inteira — o PATCH da API mescla no nível de cima, então a lista é substituída de uma vez.
- `notas` sai de `Sheet`, de `blankSheet()` e de `TextFieldKey` (`data/fields.ts`), junto com `notas-tab.tsx`. Nada apaga o valor antigo na API: `normalizeSheet` espalha os campos brutos, então ele segue no JSON sem ser exibido. Alternativa considerada: manter o campo "por via das dúvidas" — rejeitada para não deixar tipo e padrão órfãos.

### 3. Regra pura em `web/src/rules/dice-pool.ts`

`poolTotal(pool, sheet)` e `poolFormula(pool, sheet)` puros e testáveis sem React:
- total = `max(0, attrVal + skillVal + mod)`, com 0 para o que não foi escolhido;
- fórmula = partes `"Nome valor"` unidas por `" + "`, mais `"+ n"`/`"− n"` (sinal de menos tipográfico) quando `mod ≠ 0`; sem atributo e sem perícia → `"Escolha atributo e perícia"`.

### 4. Aba e cartão

- `tabs.ts`: `{ id: "rolagens", label: "Rolagens" }` no lugar de `notas`; `["notas", "rolagens"]` em `LEGACY_TABS`. `tab-content.tsx` troca `NotasTab` por `RolagensTab`.
- `tabs/rolagens-tab.tsx`: `SectionTitle` "Paradas de dados" + texto; `ul` com `grid gap-4 md:grid-cols-2`; botão final `w-full bg-ink text-white font-label uppercase`. Ao criar, guarda o `id` novo num estado e o cartão correspondente foca o input no `useEffect` de montagem.
- `DicePoolCard` no mesmo arquivo (ou `dice-pool-card.tsx` se passar de ~150 linhas): `Panel`, input de nome com o visual de campo (`fieldVariants`), quadrado `size-13 bg-ink text-white` com o total; selects `NativeSelect` com `<optgroup label>` por grupo, `value=""` para "— nenhum —"/"— nenhuma —"; grade `grid gap-2 sm:grid-cols-2`.
- Modificador: um contador compacto próprio (botões `size-9` com borda, valor no meio), porque o `Stepper` existente tem outro layout e rótulo embaixo. `aria-label` "Diminuir modificador"/"Aumentar modificador".
- Nenhuma regra de "somente leitura": diferente das Características, as paradas são editáveis pelo jogador.

## Risks / Trade-offs

- [Jogadores perdem de vista as anotações já escritas em Notas] → o valor continua no JSON da API; se alguém precisar, dá para recuperar pelo `GET /sheets`. Mudança pedida explicitamente.
- [Faixa + cabeçalho + barra inferior ocupam muita altura no celular] → a faixa é compacta (`py-3`, texto `text-xs`) e não é fixa; rola com a página.
- [Nome de traço renomeado no futuro invalida paradas salvas] → tratado como "nenhum", sem quebrar a aba.
- [Várias gravações ao digitar o nome] → o salvamento automático já agrupa gravações; nada novo.

## Migration Plan

Só web. Deploy normal; sem migração de dados. Rollback: reverter o commit — `rolagens` fica no JSON sem uso e `notas` volta a aparecer.

## Open Questions

- Nenhuma bloqueante. Se o Mestre preferir que a gaveta deixe de repetir "Lista de personagens"/"Sair", é uma mudança à parte.
