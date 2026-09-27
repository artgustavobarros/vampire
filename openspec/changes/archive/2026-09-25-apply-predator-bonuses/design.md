## Context

O passo 6 grava `predador`, `predEspec` e `predDisc`, e os ajustes do Predador existem só como texto em `data/predators.ts` (`adjustments: string[]`), coloridos no passo por regex (`COST`/`GAIN` em `step6-predator.tsx`). A especialidade já é derivada na leitura (`rules/specialties.ts`). Nada soma a Disciplina, a Humanidade, a Potência ou os méritos.

O assistente grava a ficha a cada passo (`commit` em `wizard-shell.tsx` → `patchSheet(wizardToPatch(...))`), e o "Concluir" grava tudo com `criada: true`. No modo refazer, `sheetToWizard(sheet)` monta os valores iniciais a partir da ficha concluída e `firstIncompleteStep(sheet)` (em `routes/criar.tsx`) valida os passos sobre esses valores. O passo 5 exige 2 + 1 nas duas posições do assistente e o passo 7 exige exatamente 7/2, então uma ficha com o Predador aplicado seria inválida no refazer se ele não fosse descontado.

A Potência de Sangue não é editável: `bloodPotency(sheet)` deriva da Geração. A Humanidade, as Disciplinas e os méritos são dados gravados.

## Goals / Non-Goals

**Goals:**
- Descrever todos os ajustes do Predador como dados estruturados, aplicáveis por código e exibíveis a partir do mesmo dado.
- Deixar o jogador resolver no passo 6 os ajustes com escolha.
- Aplicar Disciplina, Humanidade, Potência e méritos uma única vez, por cima dos valores finais, no "Concluir"; desfazer com exatidão no refazer.
- Manter a lógica em funções puras testáveis, fora dos componentes.

**Non-Goals:**
- Exibir os méritos na ficha em jogo (não há seção para eles hoje).
- Migrar fichas concluídas antes desta mudança.

## Decisions

### 1. Ajustes como união discriminada em `data/predators.ts`

```ts
type MeritSide = "vantagem" | "defeito";
interface MeritOption { nome: string; detalhe?: string }

type PredatorAdjustment =
  | { kind: "humanidade"; valor: number; label: string }
  | { kind: "potencia"; valor: number; label: string }
  | { kind: "merito"; tipo: MeritSide; nome: string; detalhe?: string; pontos: number; label: string }
  | { kind: "escolha"; id: string; modo: "uma" | "dividir"; tipo: MeritSide; pontos: number; opcoes: readonly MeritOption[]; label: string }
  | { kind: "nota"; label: string };
```

`label` é o texto exibido (mantém os textos atuais, ex.: "Vantagem Belíssimo ••", "Contatos •• (criminosos)"), porque Antecedentes não levam o prefixo "Vantagem" e o texto do livro não é derivável de forma limpa. Os campos estruturados são a fonte da regra; o `label` é só exibição. Antecedentes (Contatos, Rebanho, Recursos, Fama) entram como `tipo: "vantagem"`, que é como o passo 7 já os trata.

Mapeamento dos casos com texto ambíguo:
- Extorsionário "3 pontos em Contatos" → `merito` vantagem Contatos 3; "−2 pontos entre Recursos e Escravos" → `escolha` `dividir`, `tipo: "defeito"`, 2 pontos entre Recursos e Escravos.
- Sanguessuga "Presa Excluída (mortais)" → `merito` defeito 2 (o livro dá ••; o `label` passa a "Defeito Presa Excluída •• (mortais)"); "Segredo Obscuro •• (diabolista) ou Evitado ••" → `escolha` `uma`, defeito 2.
- Osíris → duas `escolha` `dividir`: vantagem 3 entre Rebanho e Fama; defeito 2 entre Inimigos e Perseguido.
- Fazendeiro "Exige Humanidade 8 ou mais" → `nota` (com a Humanidade 7 inicial +1 a exigência é sempre atendida).

A cor do filete sai do `kind`/`tipo`/sinal (função pura no passo 6), e a regex `COST`/`GAIN` sai do código.

*Alternativa*: manter o texto e extrair números por regex. Frágil, e não resolve as escolhas.

### 2. Escolhas em `predEscolhas`
`predEscolhas: Record<string, Record<string, number>>` (id do ajuste → nome da opção → pontos), na `Sheet` e em `WizardValues`, gravado pelo passo 6. Mesmo formato para os dois modos: `uma` guarda uma opção com todos os pontos; `dividir` guarda os pontos por opção. Uma função pura `predatorChoiceStatus(predator, predEscolhas)` devolve os ids incompletos e as mensagens ("Escolha uma opção: <rótulo>", "Distribua N pontos entre A e B"), usada pelo schema do passo 6 e pelo seletor (erro em `path: ["predEscolhas", id]`).

No modo `dividir`, cada opção tem um `DotRating` com `count = pontos`; o `onChange` limita o valor a `pontos − soma das outras`.

### 3. Registro do que foi aplicado
- `Sheet.predBonus?: { disciplina: string; novaDisciplina: boolean; humanidade: number; potencia: number }` com os deltas **efetivamente aplicados** (Humanidade já limitada a 0–10).
- `Merit.origem?: "predador"` nas linhas acrescentadas pelo Predador.

Serve para impedir a aplicação dupla, desfazer com exatidão (tirar o ponto ou remover a Disciplina acrescentada, subtrair a Humanidade, filtrar as linhas de origem Predador) e derivar a Potência: `bloodPotency` soma `predBonus.potencia` (limite 10) e `potencyNote` acrescenta " (+N do Predador)". `meritTotals` ignora linhas com `origem: "predador"`, o que também cumpre a regra já existente de que os defeitos do Predador não contam na cota.

*Alternativa*: derivar tudo na leitura (valor exibido = gravado + bônus). Complicaria cada `DotRating` editável da ficha, que teria de converter o clique de volta ao valor base.

### 4. Funções puras em `rules/predator.ts`
- `predatorMerits(predator, predEscolhas): Merit[]`: linhas de mérito dos ajustes `merito` e `escolha` (só opções com pontos > 0), nome "<nome> (<detalhe>)" ou "<nome>", `origem: "predador"`.
- `applyPredator(sheet): Sheet`: sem efeito se há `predBonus` ou linhas de origem Predador, sem Predador válido ou com Sangue Fraco. Soma a Disciplina (procura por nome em `sheet.disc` inteiro; +1 até 5 ou acrescenta `{ nome, nivel: 1, powers: [] }`), a Humanidade (0–10), registra `predBonus` e acrescenta `predatorMerits` a `meritos`.
- `removePredator(sheet): Sheet`: inverso; remove as linhas de origem Predador e, havendo `predBonus`, desfaz Disciplina (remove a acrescentada pelo nome ou tira 1 ponto, mínimo 0) e Humanidade, e apaga `predBonus`.

### 5. Onde o assistente usa as funções
- `sheetToWizard(sheet)` lê `removePredator(sheet)`. Cobre os valores iniciais e o `firstIncompleteStep` do refazer, sem mexer na rota.
- `commit` parte de `removePredator(ficha atual)` e grava junto com o patch do passo `disc`, `humanidade`, `meritos` e `predBonus: undefined`. A partir da primeira gravação a ficha fica sem o Predador aplicado, e a gravação do passo 5 ou 7 nunca convive com um registro que diz que o Predador ainda está lá.
- `wizardToPatch` grava `predEscolhas` com o passo 6 e o esvazia junto com `predador`/`predEspec`/`predDisc` para Sangue Fraco.
- "Concluir": monta a ficha final (base sem Predador + patch + `criada: true` + filtro de Disciplinas vazias) e grava `applyPredator(final)`.
- "Voltar" no passo 1 do refazer: depois do `commit`, grava `applyPredator(ficha)` antes de navegar para a ficha.

*Alternativa*: remover o Predador uma vez ao entrar no refazer (efeito no mount). Exigiria escrita no store durante a navegação e não cobre `firstIncompleteStep`, que roda na rota antes do shell montar.

## Risks / Trade-offs

- [Usuário fecha a aba no meio do refazer] → a ficha fica gravada sem o Predador até concluir de novo. É o mesmo estado intermediário que o refazer já produz hoje (cada passo grava valores parciais).
- [Jogador editou à mão a Disciplina do Predador antes de refazer] → a remoção é por nome e nunca deixa nível negativo; o pior caso é tirar 1 ponto que o jogador já tinha tirado.
- [Mesmo mérito vindo do passo 7 e do Predador (ex.: Contatos)] → ficam duas linhas separadas, uma com `origem: "predador"`; é o que permite desfazer sem mexer na linha do jogador.
- [Leitura do texto de referência] → "−2 pontos entre Recursos e Escravos" foi modelado como 2 pontos de defeito divididos entre as opções; se a mesa ler diferente, muda só o dado.
- [Fichas antigas já concluídas] → não recebem o Predador até serem refeitas; decisão explícita de não migrar.
