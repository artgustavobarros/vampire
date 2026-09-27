## Context

`step7-merits.tsx` hoje usa `useFieldArray` sobre `meritos` com uma linha por item: selo de tipo que cicla, `Input` com `<datalist>` por tipo, `DotRating` de 1 a 5, `InfoButton` (**?**) e "Remover". O catálogo `merits.ts` já tem `category`, `points` (número ou lista), `description` e `levels`, e o painel lateral (`build-info.ts` → `meritInfo`) já resolve nomes com `findMerit`. `InfoTrigger` transforma qualquer texto em link para o painel. O layout novo (duas imagens do usuário) pede abas + campo de busca com lista suspensa agrupada, e uma lista de escolhidos com selo, nome, legenda, pontos e "Remover".

Restrições do projeto: estilo só por classes Tailwind no JSX (nada em `styles.css`), sem dependências novas se o `radix-ui` / código próprio resolver, e remover tudo o que ficar órfão.

## Goals / Non-Goals

**Goals:**
- Escolher vantagens/defeitos direto do catálogo, com tipo e faixa de pontos vindos dos dados.
- Combobox acessível por teclado (padrão ARIA 1.2 "combobox com listbox").
- Nome da linha escolhida abre o painel lateral (substitui o **?**).
- Fichas antigas com nomes livres continuam abrindo e validando.

**Non-Goals:**
- Mudar o formato de `meritos` na ficha ou o schema da API.
- Revisar as faixas de pontos dos Antecedentes no catálogo (todos estão 1–5 hoje; o mecanismo já suporta faixas menores).
- Campo de detalhe por linha (ex.: "Aliados (gangue)") ou várias instâncias do mesmo item.
- Usar o combobox fora do Passo 7 (aba Vantagens da ficha continua como está).

## Decisions

### 1. Combobox próprio, sem `cmdk` nem Radix Popover
Um componente `MeritCombobox` em `web/src/features/wizard/merit-combobox.tsx`: `Input` com `role="combobox"`, `aria-expanded`, `aria-controls`, `aria-activedescendant`; a lista é um `<ul role="listbox">` renderizado logo abaixo, em fluxo absoluto dentro de um contêiner `relative` (a lista sobrepõe o conteúdo como na imagem 1). Grupos usam `role="group"` com `aria-labelledby` no cabeçalho `sticky top-0`.
- *Alternativa*: `cmdk` — dependência nova e estilo próprio para sobrescrever. Radix não tem combobox; Popover resolveria só o posicionamento, que aqui é trivial.
- Fechar ao clicar fora: `onBlur` do contêiner com checagem de `relatedTarget`; opções usam `onMouseDown={e => e.preventDefault()}` para não roubar o foco do campo.

### 2. Lógica de opções em funções puras em `merits.ts`
- `meritPointOptions(m: MeritTemplate): number[]` — `[m.points]` ou `[...m.points]`.
- `meritRangeLabel(values: number[]): string` — "•", "••", "•–•••••".
- `meritGroupLabel(category?: string): string` — "Antecedente" → "Antecedentes", fallback "Outros".
- `meritOptions(thin: boolean): MeritTemplate[]` — gerais sempre, SR só para Sangue Fraco (recebe `isThinBlood(cla)` do passo, evitando importar `rules` em `data`).
- `filterMeritOptions(options, { tab, query })` — normaliza com o `NORMALIZE` existente; compara nome, categoria e descrição; `tab` filtra por tipo (`vantagem`/`qualidade-sr` vs. `defeito`/`defeito-sr`).
- `groupMeritOptions(list)` — preserva a ordem de primeira aparição da categoria.
Funções puras ficam testáveis sem render e deixam o componente fino. `getMeritSuggestions` perde o único uso e é removida (e o teste que a cobre, se houver).

### 3. "Na ficha" por nome canônico, sem duplicar
Uma opção está "Na ficha" quando algum `meritos[i].nome` resolve (via `findMerit`) para o mesmo template. Escolher uma opção "Na ficha" é no-op (mantém a lista aberta). Duplicar exigiria o campo de detalhe, fora do escopo.

### 4. Linhas: catálogo vs. fora do catálogo
Na lista de escolhidos, `findMerit(nome)` decide:
- achou → selo fixo com o tipo efetivo (`effectiveMeritKind`), legenda `"<grupo> · <faixa>"`, `DotRating allowed={meritPointOptions(t)}`;
- não achou → selo alternável (lógica atual de `kinds`), legenda "Fora do catálogo", `allowed=[1..5]`.
O tipo gravado continua sendo o do catálogo no momento da escolha; `effectiveMeritKind` segue convertendo SR para não-Sangue-Fraco.

### 5. Ações "Adicionar … como vantagem/defeito"
Entram como opções extras no fim do listbox (navegáveis por teclado), só quando `query.trim()` não bate exatamente com um nome do catálogo visível. Para Sangue Fraco não há "como qualidade SR": o usuário cria como vantagem e cicla o selo — evita quatro ações no rodapé.

### 6. `DotRating` com `allowed`
Prop opcional `allowed?: readonly number[]`. Pontos `n` acima do maior valor de `allowed` renderizam `disabled` com `border-dashed border-ink/25` e sem preenchimento abaixo do valor. O `onClick` calcula `nextDotValue` e só chama `onChange` se o resultado estiver em `allowed`. Isso também impede zerar linhas (o schema exige ≥ 1). O modo somente-leitura aplica o mesmo tracejado, por consistência.

### 7. Abas e contagem
Estado local (`useState`) de `tab` e `query` no `MeritCombobox`; a contagem "N opções" é o total filtrado de itens do catálogo (sem contar as ações de adicionar). Abas são `<button aria-pressed>` como os botões do Predador.

## Risks / Trade-offs

- [Descrições longas deixam a lista pesada] → uma linha com `truncate`/`line-clamp-1`; a descrição completa fica no painel lateral.
- [Busca na descrição traz resultados ruidosos] → ordenar primeiro por acerto no nome, depois categoria, depois descrição, mantendo o agrupamento.
- [Nomes antigos com sufixo "(detalhe)" viram "catálogo" pelo prefixo do `findMerit`] → comportamento desejado: "Recursos (herança)" ganha selo fixo e faixa correta; o nome gravado não é reescrito.
- [Testes do Passo 7 dependem do `Input` de nome e do botão "Adicionar"] → reescrever os casos em `wizard.test.tsx` para o fluxo de busca/escolha; manter os de totais e Sangue Fraco.
- [Lista absoluta cortada em telas baixas] → `max-h-[min(60vh,420px)] overflow-y-auto`.

## Open Questions

- Faixas canônicas dos Antecedentes (ex.: Máscara 1–2, Contatos 1–3 como sugere o layout): corrigir em outra mudança de dados?
- Permitir o mesmo Antecedente mais de uma vez (Aliados distintos) com campo de detalhe no futuro?
