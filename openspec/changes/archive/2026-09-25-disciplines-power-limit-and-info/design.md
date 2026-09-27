## Context

O passo 5 (`features/wizard/step5-disciplines.tsx`) já tem, pela change `sync-standalone-round-2` (ainda não arquivada), dois slots filtrados pelo clã, `DotRating count={2}` com complemento automático, aviso e linha de status. Os poderes são `SelectableCard` (um `<button>`) sem limite de quantidade, e a dica não tem contador. O painel lateral (`features/info/build-info.ts`) já tem o ramo `poder` com Custo e Duração, e não tem ramo de Geração. O bloco de Potência de Sangue do passo 5 é só texto, e o rótulo "Geração" do passo 1 é um `FieldLabel` ligado ao `<select>`.

A referência é "Mudanças — Disciplinas.md" (e o `Ficha de Vampiro V5 (offline).html`). O visual segue o Design Book, e o estilo vai só em classes Tailwind no JSX, sem CSS global.

## Goals / Non-Goals

**Goals:**
- Limite "um poder por ponto" na UI e no schema, com os toasts da referência.
- Corte de poderes ao redistribuir 2/1.
- Nome do poder e Geração como gatilhos do painel; Rolagem no painel do poder; novo painel da Geração.

**Non-Goals:**
- Reescrever `POWERS` com descrições e rolagens completas.
- Exigir o número exato de poderes para avançar.
- Mudar a aba Disciplinas da ficha em jogo.

## Decisions

### 1. Regras puras em `rules/wizard.ts`
- `powerLimitHint(nivel, escolhidos)` → texto da dica, com singular/plural.
- `trimPowers(powers, nivel)` → filtra `nivel <= novo nível`, ordena por nível e corta em `nivel` itens. O `onChange` do `DotRating` chama isso para os dois slots ao gravar o complemento (`setValue` em `disc.${i}.powers`).
- `powerToggleBlock(nome, nivel, count)` → `null` quando pode incluir, ou `{ titulo, msg }` para "Sem pontos" / "Limite de poderes". O componente chama `notify(msg, { tom: "info", titulo })`.

Assim a mensagem e o corte são testáveis sem renderizar. Alternativa: lógica inline no `Controller`, como hoje. Descartada porque o toggle ficaria com três ramos e dois textos difíceis de testar.

### 2. Cartão de poder sem botões aninhados
A referência põe um `onClick` com `stopPropagation` no nome dentro do cartão clicável. No React isso seria um `<button>` dentro de outro `<button>`, o que é HTML inválido e confunde leitores de tela. O cartão passa a ser um `div` com a borda e o fundo do `SelectableCard`, e dentro dele vêm:
- um `<button aria-pressed>` de alternância com `after:absolute after:inset-0` (padrão "stretched link"), para o cartão todo alternar ao clique;
- o nome como `InfoTrigger` com `relative z-10`, por cima da camada, com `onDark` quando selecionado (hover Ember) e hover Blood nos demais.

Como os dois botões são irmãos, o clique no nome não chega ao toggle e dispensa `stopPropagation`. O teclado alcança os dois. O nome acessível do toggle é "Incluir <poder>" / "Remover <poder>". Alternativa: `SelectableCard` com `role="button"` num `span`. Descartada porque perde o `<button>` nativo.

### 3. Rolagem no ramo `poder`
Função pura `splitRoll(description, duration)` em `build-info.ts`, com o regex da referência para achar "Atributo + Disciplina (de X)? (vs.|contra …)?". **Desvio da referência**: a referência remove a rolagem com um segundo regex que exige o fim da frase logo após a primeira palavra com ponto. Com "vs." no meio, ele falha e a rolagem fica repetida na descrição. Aqui a frase casada é removida literalmente, junto com o ponto final e os espaços. Se a descrição ficar vazia, volta a original. `nivelTit` passa a "Rolagem, custo e duração".

### 4. Novo alvo `{ kind: "geracao"; geracao: string }`
`buildInfo` monta a tabela a partir de `GENERATIONS` e da categoria calculada por `generationCategory(n)` em `rules/generation.ts`. A referência escreve "Matusélem" no código e "Matusalém" na lista, e aqui vale a grafia correta, "Matusalém". A potência do selo sai de `potencyFromGeneration`. O gatilho passa a geração do **formulário** (e não a da ficha), pelo mesmo motivo da Perdição: a ficha só recebe a geração ao salvar o passo 1.

### 5. Rótulo "Geração" no passo 1
O rótulo visível vira um `InfoTrigger` com o estilo de label (Karla 12px, caixa alta, `tracking-[.12em]`, `text-ink-soft`). O `<select>` passa a ter `aria-label="Geração"` no lugar do `htmlFor`, porque um `<label>` clicável focaria o select em vez de abrir o painel.

### 6. Bloco de Potência no passo 5
O rótulo "Potência de Sangue" vira `InfoTrigger` para o estado `potencia`, como na ficha. A nota vira uma linha flex com o `InfoTrigger` "Geração 12ª" (label) e o texto do `potencyNote`. O `potencyNote` repete "Geração 12ª — …", então o passo 5 usa uma variante sem o prefixo: `potencyNote(..., true)` ganha um formato curto "Potência de Sangue N." quando a geração é reconhecida. Os demais casos (geração desconhecida, sem geração) continuam iguais.

### 7. Schema
No `superRefine` do passo 5, para cada slot com `powers.length > nivel` (e `nivel >= 1`), sai o erro "Escolha no máximo N poder(es) em <Disciplina>" em `disc.i.powers`. Slot sem pontos com poderes já cai na regra de distribuição 2+1.

## Risks / Trade-offs

- [Fichas salvas com mais poderes que pontos passam a ter o passo 5 inválido] → `firstIncompleteStep` leva ao passo 5 no "Refazer". A ficha em jogo não é bloqueada.
- [O corte ao inverter 2/1 apaga escolhas sem confirmação] → é o comportamento da referência. As escolhas são poucas e fáceis de refazer.
- [Rolagem extraída por regex falha em descrições fora do padrão] → cai no texto "Sem teste…", que pode estar errado para poderes com teste descrito de outro jeito. Fica aceito até o catálogo ser reescrito (fora do escopo).
- [Depende de `sync-standalone-round-2`] → arquivar aquela change antes desta, para os MODIFIED partirem do texto certo.
