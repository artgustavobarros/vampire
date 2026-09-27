## Context

O passo 6 (`features/wizard/step6-predator.tsx`) usa um `OptionGroup` genérico para especialidade e Disciplina do Predador: dois botões com o nome. O ponto da Disciplina só é somado no fim, em `applyPredator` (`rules/predator.ts`), que acrescenta 1 ponto (ou a Disciplina com nível 1 e sem poderes) e registra o que fez em `predBonus` para `removePredator` desfazer no modo refazer. Não existe escolha de poder para esse ponto.

O passo 5 já tem cartões de poder (`PowerCard` com `InfoTrigger` no nome e camada de clique no cartão) e a conversão `toPower` do catálogo `POWERS` para `Power`. O painel lateral (`InfoProvider`/`buildInfo`) já sabe mostrar um poder do catálogo ou com descrição livre.

Na aba Disciplinas (`features/sheet/tabs/disciplinas-tab.tsx`) cada poder é um botão de acordeão que abre `PowerEditor` (nome, nível, Rouse, descrição, "Sobre este poder", remover).

Contexto do schema: `CONTEXT_FIELDS` define campos que um passo lê mas não grava (hoje `cla` nos passos 5–7).

## Goals / Non-Goals

**Goals:**
- Mostrar, no passo 6, se a Disciplina do Predador é do clã, quanto ela vale antes e depois, e exigir a escolha do poder que esse ponto dá.
- Gravar esse poder na ficha ao concluir e desfazê-lo no refazer, sem duplicar.
- Trocar o acordeão de poderes da aba Disciplinas pelo painel lateral já usado no resto do app.

**Non-Goals:**
- Pré-requisitos de amálgama e custo em XP (o texto só avisa que subir custa mais).
- Editar em linha poderes gravados na ficha (o fluxo passa a ser remover e adicionar de novo).
- Mudar o painel lateral em si ou o conteúdo de `buildInfo` para poderes.

## Decisions

**1. `predPoder` guarda só o nome do poder.** O poder completo sai do catálogo (`POWERS[predDisc]`) na hora de aplicar. Alternativa: guardar o `Power` inteiro no formulário — descartada porque duplica o catálogo e abre espaço para dados velhos. Sem catálogo (ex.: Fascinação), o campo fica vazio e não é exigido.

**2. Regras puras em `rules/predator.ts`.** Nova função `predatorDiscipline(cla, disc, predDisc)` devolve `{ doCla, atual, novo, elegiveis }`: `doCla` pelas Disciplinas do clã (`findClan(cla).disciplines`; para Caitiff, se a Disciplina está nas posições do passo 5), `atual` pelo nível no passo 5, `novo = atual + 1` (ou 1), e `elegiveis` = catálogo com `level <= novo` menos os poderes já escolhidos para ela, ordenados por nível. A UI, o schema e os textos usam essa mesma função, e ela é testada em `rules.test.ts`. Alternativa: calcular na UI — descartada porque o schema precisa da mesma lista.

**3. `disc` como contexto do passo 6.** Entra em `CONTEXT_FIELDS[6]` junto com `cla`, para a validação do `predPoder` ver os pontos e poderes do passo 5 sem gravá-los de novo. Um poder que deixou de ser elegível (passo 5 mudou) não é apagado automaticamente: a UI o mostra como sem escolha e o schema pede um novo. Alternativa: limpar `predPoder` num efeito quando o passo 5 muda — descartada por ser estado derivado sincronizado à mão.

**4. `applyPredator`/`removePredator` levam o poder.** `applyPredator` acrescenta `toPower(template)` aos poderes da Disciplina (existente ou nova), reordena por nível e grava `predBonus.poder` com o nome. `removePredator` tira o poder com esse nome (a primeira ocorrência) antes de reduzir o nível ou remover a Disciplina nova. `toPower` sai do passo 5 para `rules/predator.ts` (ou um módulo compartilhado) e o passo 5 passa a importar dali. Fichas antigas sem `predBonus.poder` continuam funcionando: sem nome, nada é removido.

**5. Componentes do passo 6.** `OptionGroup` continua para a especialidade. A Disciplina ganha `PredatorDisciplineCards` (cartões com linha de contexto) e `PredatorPowerPanel` (cabeçalho com selo e bolinhas, texto, slot e cartões). O `PowerCard` do passo 5 é extraído para `components/vtm` (ou um arquivo do assistente) e reutilizado nos dois passos. Estilo só com classes Tailwind nos componentes, sem CSS global; as bolinhas são `span` redondos (tinta para os pontos do passo 5, `bg-blood` para o do Predador), sem reaproveitar `DotRating`, que é interativo.

**6. Aba Disciplinas sem acordeão.** A linha do poder vira um `InfoTrigger` de largura total (nível, nome, resumo) que abre `{ kind: "poder", disc, key, nivel, desc }`, mais um botão "×" irmão (fora do gatilho, para não aninhar botões). Saem o estado `open`/`onToggle`, `PowerEditor`, `ACTION`, o `useId` e qualquer import que só o editor usava (`FieldLabel`); `Textarea`, `NativeSelect`, `Chip` e `LEVELS` ficam porque o diálogo de adicionar ainda os usa.

## Risks / Trade-offs

- [Perda da edição em linha de poderes] → O diálogo "Adicionar disciplina ou poder" continua cobrindo poderes manuais; corrigir é remover e adicionar. Registrado como BREAKING de UX na proposta.
- [Poder do Predador igual a um poder acrescentado depois na aba Disciplinas] → `removePredator` remove só uma ocorrência pelo nome, então a cópia manual sobrevive.
- [Catálogo sem a Disciplina (Fascinação e outras)] → Sem elegíveis, o poder não é exigido e o painel orienta a registrar depois.
- [Ficha concluída antes desta mudança] → Sem `predPoder` nem `predBonus.poder`; aplicar/remover seguem como antes.
