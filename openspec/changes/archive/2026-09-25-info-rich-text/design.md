## Context

O painel lateral (`features/info/info-sheet.tsx`) renderiza strings vindas de `buildInfo` (`features/info/build-info.ts`), que por sua vez lê o catálogo em `data/*.ts`. Hoje:
- a descrição é o conteúdo de `SheetDescription` (um `<p>` do Radix, usado como `aria-describedby` do diálogo);
- níveis e nota são `<span>`/`<p>` com texto puro;
- as células de tabela usavam `whitespace-pre-line` para o `\n` quebrar linha; com o renderizador, o `\n` vira `<br />` e a classe sai.

Nenhuma string atual do catálogo contém `*`, então a marcação nova não altera nada que já existe.

## Goals / Non-Goals

**Goals:**
- Negrito, itálico e quebra de linha/parágrafo nos textos do painel, escritos direto nas strings do catálogo.
- Zero dependência nova, sem HTML cru.
- Nada muda para textos sem marcação.

**Non-Goals:**
- Markdown completo (listas, links, títulos, cabeçalhos).
- Formatação no kicker, no título ou no selo.
- Editor visual ou botões de formatação nos campos da ficha.

## Decisions

**1. Sintaxe estilo Markdown (`**`, `*`, `\n`) em vez de HTML ou estrutura de dados.**
As strings ficam legíveis no código e fáceis de editar. Alternativas: tags HTML (`<b>`) exigiriam sanitização ou parser de HTML; trocar `string` por arrays de segmentos deixaria o catálogo pesado de editar.

**2. Parser próprio pequeno em `features/info/rich-text.tsx`, sem `react-markdown`.**
Só três construções; uma lib de Markdown traria bundle e comportamentos (listas, `_`, links) que não queremos. O parser:
- divide em parágrafos por `\n\n` (em `RichParagraphs`);
- divide cada parágrafo em linhas por `\n`, intercalando `<br />`;
- em cada linha, tokeniza `**…**` e depois `*…*` com regex não gulosa; marcador sem par fica literal.
Exporta `RichText` (em linha) e `RichParagraphs` (com parágrafos). Não há `plainText`: a descrição acessível do Radix é calculada do DOM, que já não tem marcadores.

**3. Descrição com parágrafos: `SheetDescription asChild` envolvendo um `<div>`.**
`<p>` não pode conter `<p>`. Usar `asChild` mantém o `aria-describedby` do Radix apontando para o bloco; os parágrafos internos são `<p>` com espaçamento via classes Tailwind (`mt-3` entre eles). A nota segue o mesmo padrão. Níveis e células usam o modo em linha (só `<br />`, sem parágrafos).

**4. Classes no componente.**
`<strong className="font-bold">` e `<em className="italic">`, conforme a regra de não adicionar estilos globais.

**5. Aplicar no render, não em `buildInfo`.**
`buildInfo` continua devolvendo strings (testes de `build-info.test.ts` intactos). `splitRoll` roda sobre a string marcada; a regex de rolagem não usa `*`, então marcação fora da frase de rolagem não interfere. Textos registrados à mão pelo usuário (poder fora do catálogo) também passam pelo `RichText` — inofensivo, já que `*` sem par fica literal.

## Risks / Trade-offs

- [Autor escreve `*` literal com par acidental, ex.: "2*3*4"] → vira itálico; documentar no topo de `trait-info.ts` que `*` é marcação.
- [Marcação dentro da frase de rolagem quebra a extração] → não marcar a frase "Atributo + Disciplina"; citar isso no comentário do catálogo.
- [Testes que buscam texto por `getByText` com string inteira] → com `<strong>`/`<em>` o texto fica em nós separados; só afeta textos que ganharem marcação, e os testes usam matcher por `textContent` quando preciso.
