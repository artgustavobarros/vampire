## Context

Hoje `/personagens` é um layout que só faz a guarda de papel (`personagens.tsx`) e renderiza `<Outlet />`. Os filhos são `personagens.index.tsx` (a `CharacterList`, que desenha o próprio cabeçalho com "Lista de personagens" e "Sair") e `personagens.$id*` (a ficha do jogador no `SheetLayout`). Não existe nada da Rolagem de Ressonância: nem regras de sorteio, nem tabela de discrasias. `data/fields.ts` tem só os nomes (`RESONANCES`, `RESONANCE_INTENSITIES`), e `data/trait-info.ts` tem os humores com as Disciplinas em texto corrido.

A referência mostra o painel do Mestre: cabeçalho "<nome> MESTRE … SAIR DA CONTA", abas sublinhadas "LISTA DE PERSONAGENS | AÇÕES" e, em Ações, duas colunas (escolha à esquerda; resultado escuro à direita). Da referência sai o cartão "Últimas rolagens": o "Limpar" vai para cima do cartão de resultado e não há histórico.

## Goals / Non-Goals

**Goals:**
- Moldura única (cabeçalho + abas) para a Lista e as Ações, sem duplicar cabeçalho.
- Lista de personagens como aba padrão, reaproveitando cartões e carregamento como estão.
- Rolagem de Ressonância com lógica pura e testável (gerador injetável).

**Non-Goals:**
- Aplicar a Ressonância sorteada na ficha de um jogador (o registro continua no "Registrar alimentação" da ficha).
- Efeitos mecânicos das discrasias; o texto é só referência narrativa.
- Outras ações do Mestre além da Ressonância.
- Histórico de rolagens (nem na tela, nem no aparelho).

## Decisions

### Rotas: layout sem caminho sob `/personagens`
Arquivos:
- `personagens.tsx` — continua só a guarda de papel + `<Outlet />`.
- `personagens._painel.tsx` — layout sem caminho que renderiza o `DmShell` (cabeçalho + abas + `<Outlet />`).
- `personagens._painel.index.tsx` — `CharacterList` (substitui `personagens.index.tsx`, que é apagado).
- `personagens._painel.acoes.tsx` — aba Ações.
- `personagens.$id*` — sem mudança; ficam fora do `_painel`, então a ficha não herda a barra de abas.

`/personagens/acoes` é segmento estático e tem prioridade sobre `$id` no roteador; ids de jogador são UUID, então não há colisão.

*Alternativas*: (a) colocar o `DmShell` em `personagens.tsx` — embrulharia também a ficha, que tem cabeçalho próprio; (b) abas em estado local (Radix Tabs) sem rota — perde link direto, recarga e o botão voltar; (c) rota nova `/mestre/acoes` — espalha a área do Mestre em dois prefixos e muda o destino já especificado (`/personagens`).

### Abas como `Link` sublinhado, não `SegmentedTabs`
A referência usa abas de navegação sublinhadas (não o controle segmentado da ficha). As abas são `<Link>` do TanStack Router com `activeOptions={{ exact: true }}` para `/personagens` (senão ficaria ativa em `/personagens/acoes`) e `activeProps` aplicando `text-ink` + `border-b-2 border-blood` + `aria-current="page"`. Tudo em classes Tailwind no JSX.

### `DmShell` em `features/dm/dm-shell.tsx`
Lê `name` do `usePlayerStore`, mostra o selo "Mestre" com as mesmas classes do selo do `SheetLayout`, e o `Button variant="outline"` "Sair da conta" com o mesmo fluxo de hoje (`await logout(); navigate({ to: "/entrar" })`). A `CharacterList` perde o `<header>` e o `useNavigate`/`logout`/`Button` que só serviam a ele (remover imports órfãos). O `<main>` com o texto de abertura e a lista fica.

### Dados em `data/resonance.ts`
- `RESONANCE_MOODS`: por humor — `emocoes`, `disciplinas` (nomes como em `data/disciplines.ts`: "Dominação", não "Domínio" como na imagem) e `discrasias` (3 × `{ nome, descricao }`).
- `INTENSITY_EFFECTS`: texto por intensidade.
- Tipos `Mood = "Colérica" | "Melancólica" | "Fleumática" | "Sanguínea"` e `Intensity` derivados das listas existentes em `data/fields.ts` (sem "Sem ressonância").

### Regras em `rules/resonance.ts`
```ts
type Choice<T> = T | "Aleatória";
interface ResonanceRoll {
  tipo: Mood; intensidade: Intensity;
  discrasia: { nome: string; descricao: string } | null;
  dados: { ressonancia?: number; intensidade?: number[]; discrasia?: number };
}
function rollResonance(
  escolha: { tipo: Choice<Mood>; intensidade: Choice<Intensity> },
  d: (faces: number) => number // 1..faces
): ResonanceRoll
function diceLine(escolha, roll): string // "Discrasia d3: 1 · Fleumática (escolhida) · …"
```
O gerador padrão usa `crypto.getRandomValues` (com `Math.random` de reserva). Testes passam um `d` que devolve uma fila de valores. Ficam junto dos outros testes de regras (`rules/rules.test.ts`) ou num `resonance.test.ts` ao lado.

### Resultado em estado local
O último resultado é um `useState<ResonanceRoll | null>` da aba Ações; "Limpar" o volta a `null`. Sem `localStorage` nem store: ao sair da aba ou recarregar, o cartão volta ao texto inicial.

### Componentes da aba Ações
`features/dm/resonance-roll.tsx` compõe: painel de escolha (`Chip` para os selos, `Button variant="destructive"` para rolar), "Limpar" (botão de texto sangue, alinhado à direita, só com resultado) e `ResonanceResult` (cartão escuro, `aria-live="polite"`). Grade `grid gap-4 md:grid-cols-2` com a coluna direita em `flex flex-col gap-2`.

### Sangue-fraco
O painel ganha o grupo "Sangue-fraco" (Não/Sim) em vez de ligar a aba a uma ficha: o Mestre marca quando quem se alimenta é sangue-fraco. `ResonanceChoice` ganha `sangueFraco: boolean`, e `rollResonance`, depois da discrasia, rola `disciplina` (d2 sobre `RESONANCE_MOODS[tipo].disciplinas`) e `poder` (d<k> sobre os poderes do nível — 1 em Intensa, 2 em Aguçada — de `POWERS[disciplina]`, sem rituais (`ingredients`), amálgamas (`amalgam`) nem nomes em `POWER_ALIASES`; com k = 1 não rola). `ResonanceRoll` ganha `poder: { disciplina, nivel, poder: PowerTemplate } | null` e `dados.disciplina`/`dados.poder`/`dados.faces` do poder. `diceLine` passa a listar os dados rolados na ordem da rolagem e depois as escolhas. O cartão mostra a primeira frase de `description`, porque a descrição completa do livro é longa demais para o cartão.

## Risks / Trade-offs

- [A maioria das Disciplinas do humor tem um só poder de nível 2] → em Aguçada o poder quase sempre sai sem dado; a regra é a pedida (nível exatamente 2).
- [Textos de efeito e discrasias são autorais, não do livro] → ficam isolados em `data/resonance.ts`, fáceis de trocar; o Mestre usa como referência.
- [O selo "MESTRE" repete classes do `SheetLayout`] → aceitável por ora (duas ocorrências); extrair se aparecer a terceira.
- [`activeOptions.exact` esquecido deixa as duas abas ativas em `/personagens/acoes`] → teste de rota cobre `aria-current` nas duas URLs.

## Migration Plan

Só front-end. `routeTree.gen.ts` é regenerado pelo plugin do roteador ao rodar dev/build. Links existentes para `/personagens` continuam válidos (mesma URL da lista). Reverter é apagar os arquivos novos e restaurar `personagens.index.tsx` e o cabeçalho da `CharacterList`.

## Open Questions

- Confirmar os textos de efeito de Difusa/Intensa e os nomes das discrasias (exceto Fleumática 1 "Frieza" e o efeito de Aguçada, tirados da referência).
