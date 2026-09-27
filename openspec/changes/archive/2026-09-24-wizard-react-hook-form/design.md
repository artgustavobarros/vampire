## Context

O assistente (`web/src/features/wizard/`) tem um shell (`wizard-shell.tsx`) e oito componentes de passo. Cada passo lê `useSheet()` e grava cada alteração com `patchSheet()`, e a ficha no `useCharacterStore` já é o estado do "formulário". Não há validação nenhuma. O shell só navega (`?passo=N`) e, ao concluir, marca `criada: true`.

Restrições:
- A ficha (`Sheet`) guarda os nomes em português do standalone, e o formato em `localStorage` não pode mudar.
- As regras de cota já existem como funções puras em `web/src/rules/wizard.ts` (`attributeQuotas`, `skillDistributionProgress`, `initialAttributes`).
- Os controles visuais próprios (`DotRating`, `SelectableCard`, `NativeSelect`, `TraitGrid`) são controlados (`value`/`onChange`). Não são inputs nativos registráveis.
- Já existe `FieldLabel` em `#/components/vtm/text`, com o mesmo nome do `FieldLabel` do shadcn.
- A mudança `optimistic-sheet-updates` em andamento mexe em `patch` e em `SheetTextField`.

## Goals / Non-Goals

**Goals:**
- Um único `useForm` para os 8 passos, com schemas zod por passo e `zodResolver`.
- Mensagens de erro nos campos usando o `Field` do shadcn.
- Gravar só nas transições de passo (Continuar, Voltar, Concluir).
- Garantir um personagem por jogador e impedir que se pule passos.

**Non-Goals:**
- Vários personagens por jogador ou seletor de personagem.
- Validar orçamento de méritos (7 pts em vantagens, 2 em defeitos). Os totais continuam só informativos.
- Validar a distribuição de pontos entre disciplinas (2 + 1) ou aplicar os ajustes do predador na ficha.
- Mudar o formato da `Sheet` ou as chaves do `localStorage`.
- Rascunho gravado a cada tecla dentro de um passo.

## Decisions

### 1. Um `useForm` no shell, com `FormProvider`
O `WizardShell` cria o formulário com `defaultValues = sheetToWizard(sheet)` e envolve os passos com `<FormProvider>`. Cada passo usa `useFormContext<WizardValues>()`. O formulário vive enquanto `/criar` está montado. Trocar `?passo=N` só troca o corpo, então os valores continuam entre os passos.

*Alternativa:* um `useForm` por passo. Descartada porque obriga a gravar ou reidratar a cada troca de passo e perde validações que cruzam passos, como a especialidade depender das habilidades.

### 2. `WizardValues`: um recorte da `Sheet`
`schema.ts` define `WizardValues` com os campos que o assistente edita: `cla`, `senhor`, `geracao`, `attrs`, `dist`, `skills`, `espec`, `especLivre`, `disc`, `predador`, `predEspec`, `predDisc`, `meritos` e os campos de identidade do passo 8. Ele exporta `sheetToWizard(sheet)` e `wizardToPatch(values, fields)`. O segundo devolve um `Partial<Sheet>` só com os campos pedidos e recalcula `potencia` a partir de `geracao`. Os nomes das chaves são os da `Sheet`, então a conversão é quase uma cópia.

### 3. Resolver por passo, lendo o passo atual
`STEP_SCHEMAS: z.ZodType[]` tem um `z.object` por passo. O resolver é estável e escolhe o schema do passo atual guardado numa ref:

```ts
const stepRef = useRef(step);
stepRef.current = step;
const resolver: Resolver<WizardValues> = (values, ctx, opts) =>
  zodResolver(STEP_SCHEMAS[stepRef.current - 1])(values, ctx, opts);
```

"Continuar" chama `handleSubmit(onStepValid)`. Os schemas usam o modo padrão de chaves (`strip`), então campos de outros passos não geram erro.

*Alternativa:* um schema completo com `trigger(STEP_FIELDS[step])`. Descartada porque as regras que cruzam campos (cotas, especialidades, disciplinas) rodariam para o formulário inteiro a cada validação. Também seria preciso filtrar à mão os erros de outros passos que um `superRefine` pusesse em campos compartilhados, como `skills`. Obs.: no zod 4, o `superRefine` roda mesmo quando os campos têm erros comuns (`min`, `length`, `refine`); só erros de tipo o interrompem. Por isso as regras precisam tolerar dados incompletos.

Passos com validação que cruza campos incluem os campos de contexto no próprio schema, sem gerar erro neles. Exemplo: o passo 4 recebe `skills` como `z.record(z.string(), z.number())` para saber quais especialidades são obrigatórias. O `superRefine` de cada passo chama as funções de `rules/wizard.ts` e põe o erro no `path` do campo certo (`attrs`, `skills`, `espec.Ofícios`, `disc.1.nome`, `meritos.0.nome`...).

### 4. Gravação nas transições
- **Continuar (válido)**: `patchSheet(wizardToPatch(getValues(), STEP_FIELDS[step]))`. No passo 1 também aplica `initialAttributes` e faz `setValue("attrs", ...)`, para o passo 2 já abrir com os 2.
- **Voltar**: grava `STEP_FIELDS[step]` sem validar e navega.
- **Concluir (válido)**: grava todos os campos do formulário, com `criada: true` e `disc` filtrado sem nomes vazios, e navega para `/ficha/ficha`.

`STEP_FIELDS` sai das chaves de `STEP_SCHEMAS[i].shape`, menos os campos de contexto, para não ficar duas listas para manter.

### 5. Campos com shadcn `Field` + `Controller`
Adicionar `field.tsx` com `pnpm dlx shadcn@latest add field`. Ele traz `Field`, `FieldLabel`, `FieldError`, `FieldDescription`, `FieldGroup`, `FieldSet` e `FieldLegend`. Depois ajustar os tokens (`text-ink-soft`, `text-blood`, `font-label`) ao design system. Os padrões de uso ficam assim:
- Texto: `<Controller render={({ field, fieldState }) => <Field data-invalid={fieldState.invalid}><FieldLabel/><Input {...field} aria-invalid={fieldState.invalid}/><FieldError errors={[fieldState.error]}/></Field>} />`.
- `DotRating`/`TraitGrid`/`SelectableCard`: `Controller` com `value`/`onChange` e um `FieldError` para o grupo (por exemplo, erro de cota em `attrs`).
- Listas (disciplinas, méritos): `useFieldArray` para `meritos`. `disc` tem sempre 2 posições fixas, então usa `Controller` por índice.

O `FieldLabel` do vtm continua para as telas da ficha. No assistente, o shadcn é importado direto de `#/components/ui/field`. `SheetTextField` deixa de ser usado no assistente.

### 6. Guardas na rota `/criar`
`validateSearch` passa a aceitar `{ passo: number; refazer?: boolean }`. O componente da rota:
1. sem usuário → `/entrar` (já existe);
2. `sheet.criada && !refazer` → `/ficha/ficha`;
3. `firstIncompleteStep(sheet)` (roda `STEP_SCHEMAS[i].safeParse(sheetToWizard(sheet))` em ordem) menor que `passo` → `<Navigate search={{ passo: first, refazer }} replace />`.

`sheet-layout.tsx` ("Refazer personagem") navega com `refazer: true`, e o shell repassa `refazer` em toda navegação entre passos.

### 7. Um personagem por jogador
Nada muda no armazenamento: já há uma única `vtm5.sheet.<email>`. A regra fica garantida na rota (decisão 6) e no `homeTarget`, que já manda para `/ficha` quando `criada`. Refazer edita e sobrescreve essa mesma ficha.

## Risks / Trade-offs

- [Dados do passo atual se perdem ao recarregar a página no meio do passo] → É aceitável na criação. Voltar e Continuar gravam. Se incomodar, dá para ligar depois um `watch` com debounce que grava rascunho.
- [Fichas antigas com dados fora das regras novas, como atributos fora da cota] → Abrem no primeiro passo incompleto com os valores preenchidos, e o usuário só precisa corrigir. No modo refazer, uma ficha criada antes da validação pode exigir ajustes para concluir.
- [Resolver lendo ref pode validar com o passo errado se o `step` mudar no meio de um `handleSubmit`] → A navegação só acontece depois de `onStepValid`. O `key={step}` do corpo já remonta o passo.
- [Nome `FieldLabel` repetido (vtm × shadcn)] → No assistente, só o do shadcn é importado. Renomear o do vtm fica fora desta mudança.
- [Conflito com `optimistic-sheet-updates` em `fields.tsx`] → Esta mudança não altera `fields.tsx`, só para de usá-lo no assistente.
- [Tamanho do bundle: zod + RHF] → A rota `/criar` já é separada pelo router. Os schemas ficam só no módulo do assistente e na guarda da rota.

## Migration Plan

Sem migração de dados. Depois do deploy, fichas com `criada: false` abrem no primeiro passo incompleto. Fichas com `criada: true` não entram mais em `/criar` sem `refazer`. Para reverter, é só voltar o código, porque o formato gravado não muda.

## Open Questions

- Validar o orçamento de méritos (7/2) e a distribuição de disciplinas (2 + 1) numa mudança futura?
- Aplicar automaticamente os ajustes do predador (especialidade, +1 disciplina, Humanidade)?
