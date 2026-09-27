## Context

O passo 5 (`web/src/features/wizard/step5-disciplines.tsx`) tem dois slots `DisciplineRow`. Cada slot filtra `clanDisciplineOptions(cla).options` tirando a Disciplina do outro slot, mas depois **reinsere** o nome gravado quando ele não está na lista — por isso, depois de trocar de clã no passo 1, a Disciplina do clã antigo continua aparecendo no seletor. O passo 1 (`step1-clan.tsx`) só faz `field.onChange(c.name)`, sem tocar em `disc`.

O nível usa `DotRating count={2}` com `nextDotValue` (clicar no valor atual diminui 1). No `onChange` do slot, `v >= 2 ? 2 : 1` converte qualquer resultado em 2 ou 1, então:
- slot com 2, clique no 2º ponto → `nextDotValue` devolve 1 → a distribuição inverte sem o jogador querer;
- slot com 1, clique no 1º ponto → devolve 0 → grava 1 (o ponto parece "não responder");
- slots em 0/0 mostram dois pares de pontos vazios sem indicar que a regra é fixa em 2 + 1.

O visual de referência para os novos botões é o `OptionGroup` do passo 6 (`step6-predator.tsx`, "Especialidade — escolha uma"): `border px-3 py-2 text-base leading-tight`, ativo `border-moss bg-field`, inativo `border-ink/20 bg-transparent`, com `aria-pressed`.

## Goals / Non-Goals

**Goals:**
- Seletor de cada slot mostra estritamente as Disciplinas do clã (Caitiff: todas).
- Trocar de clã esvazia os slots que ficaram fora do novo clã.
- Botões "+2" / "+1" determinísticos: o botão clicado define o nível do slot; o outro slot recebe o complemento.

**Non-Goals:**
- Mudar a validação do passo 5, a linha de status ou as regras de poderes.
- Mexer no `DotRating` compartilhado ou em `nextDotValue` (usados em outros passos e na ficha).
- Extrair um componente genérico de "botão de opção" compartilhado com o passo 6 (só dois usos; manter as classes inline, como no resto do projeto).

## Decisions

1. **Regra pura `keepClanDisciplines(disc, cla)` em `rules/wizard.ts`.** Recebe os slots e o clã novo e devolve os slots com os que não pertencem a `clanDisciplineOptions(cla).options` trocados por `{ nome: "", nivel: 0, powers: [] }`. Fica testável em `rules.test.ts` sem render. Alternativa descartada: limpar num `useEffect` do passo 5 ao montar — escreveria no formulário durante a navegação e esconderia o motivo da limpeza.
   - Sangue Fraco (`options` vazio) esvazia os dois slots, o que já coincide com o que o passo 5 grava para sangue-ralo.
   - Sem clã (`kind: "none"`) aceita todas as Disciplinas, então nada é limpo.

2. **Chamar a regra no `onClick` do cartão de clã no passo 1**, só quando o clã realmente muda (`c.name !== field.value`), via `setValue("disc", keepClanDisciplines(getValues("disc"), c.name))`. Assim, escolher o mesmo clã de novo não mexe em nada.

3. **Remover a reinserção do nome fora do clã no `DisciplineRow`.** O slot calcula `shown` (o nome gravado só se estiver na lista, senão `""`) e o usa como valor do `NativeSelect` e para o catálogo de poderes, então uma Disciplina fora do clã aparece como slot vazio e sem cartões de poder; a validação existente ("Escolha Disciplinas do clã") continua cobrindo fichas antigas gravadas com Disciplina inválida.

4. **Componente local `LevelButtons` no passo 5** em vez de `DotRating`: dois `<button type="button" aria-pressed>` com `aria-label` `"<label> +2"` / `"<label> +1"`, texto visível "+2" e "+1", classes copiadas do `OptionGroup` do passo 6. `onPick(n)` faz o que o `onChange` atual faz (define `mine`, põe `3 - mine` no outro, aplica `trimPowers` nos dois), mas retorna cedo quando `n === level` — clicar no ativo não altera nada. Envolvido num `fieldset` sem borda com `aria-label` do nível, mantendo o `Field data-invalid` do `Controller` para o destaque de erro.

## Risks / Trade-offs

- [Limpar slots ao trocar de clã descarta poderes escolhidos] → só acontece para Disciplinas que deixaram de ser válidas; as compartilhadas entre os clãs (ex.: Presença de Brujah → Toreador) são mantidas.
- [Testes existentes clicam em "Nível Primeira Disciplina 2"] → atualizar para os novos rótulos "Primeira Disciplina +2" etc.
- [Ficha antiga com Disciplina fora do clã aparece com slot vazio sem aviso visual imediato] → o "Continuar" já bloqueia com "Escolha Disciplinas do clã"; e a linha de status mostra o que falta.
