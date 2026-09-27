## Why

O standalone de referência foi atualizado de novo ("Mudanças desde o último standalone", rodada 2, seções 5–9). A rodada 1 (toasts, painel lateral, hover e méritos) já está no web (change arquivada `add-toasts-and-info-sheet`). A rodada 2 aplica regras do livro que o web ainda não segue: as Disciplinas iniciais vêm do clã e são distribuídas 2 + 1, Sangue-ralo não tem Disciplinas intrínsecas nem Tipo de Predador, e o passo de Vantagens/Defeitos tem cota de 7 / 2 pontos, com Qualidades e Defeitos de Sangue-Ralo. Além disso, Perdição e Compulsão do clã passam a abrir o painel lateral com a regra completa.

## What Changes

- **Passo 5 — Disciplinas**: cada um dos dois slots lista **só** as Disciplinas do clã (Caitiff: todas; hoje o web lista todas com as do clã primeiro). A Disciplina de um slot some da lista do outro. Os níveis passam a ser **2 e 1** obrigatoriamente: cada slot tem 2 pontos, e marcar um slot ajusta o outro para o complemento. Um aviso explica a regra conforme o clã, e uma linha de status mostra "Distribuição completa: 2 e 1." (Moss) ou "Falta: …". Sangue Fraco não tem slots: só o aviso, e o passo é válido sem Disciplinas. **BREAKING** para fichas com Disciplinas de fora do clã ou níveis diferentes de 2+1 — o passo 5 passa a ser inválido para elas.
- **Passo 6 — Predador**: para Sangue Fraco, os cartões somem e aparece só "Sangues-ralos não têm Tipo de Predador. Siga para o próximo passo."; o passo é válido sem escolha e um Predador gravado antes é apagado ao salvar o passo.
- **Passo 7 — Vantagens e Defeitos**: contadores "X/7 pts em vantagens" e "Y/2 pts em defeitos", o texto da regra do livro e uma linha de status ("Falta: …" ou "Distribuição completa." em Moss). Os defeitos do Predador não contam nesses 2. Para Sangue Fraco o selo de tipo cicla Vantagem → Defeito → Qualidade SR → Defeito SR, com contador "N qualidades · N defeitos de sangue-ralo" e validação de 1 a 3 Qualidades e o mesmo número de Defeitos SR. Se o clã deixa de ser Sangue Fraco, Qualidade SR é tratada como Vantagem e Defeito SR como Defeito. A cota 7/2 e a regra SR passam a **bloquear** "Continuar", como as cotas dos passos 2 e 3. **BREAKING**: a lista vazia deixa de ser válida.
- **Perdição e Compulsão no painel**: no passo 1, os títulos da Perdição e da Compulsão viram gatilhos do painel lateral. Perdição mostra kicker "Perdição · <clã>", selo "Gravidade N" (da Potência de Sangue), descrição completa e linhas "Regra e rolagem" com `{G}` trocado pela Gravidade; Compulsão mostra descrição, Efeito e Termina, com nota sobre falha bestial. Caitiff e Sangue Fraco usam o texto curto do clã, sem linhas. Novo catálogo `CLAN_FULL` com os 14 clãs.
- **Textos do assistente**: dicas dos passos 6 ("Como você caça define perícias e Disciplinas extras. Sangues-ralos não têm.") e 7 ("Sete pontos em vantagens, dois em defeitos além dos do Predador.").
- Fora do escopo: somar automaticamente os defeitos do Predador; exibir méritos na ficha em jogo.

## Capabilities

### New Capabilities
<!-- nenhuma -->

### Modified Capabilities
- `character-wizard`: passos 5, 6 e 7 mudam de regra (filtro por clã, 2+1, Sangue-ralo sem Disciplinas nem Predador, cota 7/2 e Qualidades/Defeitos SR), as regras de validação por passo mudam e as dicas dos passos 6 e 7 mudam.
- `trait-info`: novos tipos de conteúdo (Perdição e Compulsão do clã), novo gatilho (títulos no passo 1) e os tipos de mérito SR no painel de mérito.

## Impact

- Dados: `data/clans.ts` (ou novo `data/clan-rules.ts`) ganha `CLAN_FULL`; `lib/types.ts` amplia `MeritKind` com os tipos SR.
- Regras e validação: `rules/wizard.ts` (`meritTotals` e contagem SR, checagem de distribuição de Disciplinas), `features/wizard/schema.ts` (passos 5, 6 e 7 dependem do clã; `cla` entra como campo de contexto desses passos; `wizardToPatch` limpa o Predador de Sangue-ralo).
- UI: `step1-clan.tsx`, `step5-disciplines.tsx`, `step6-predator.tsx`, `step7-merits.tsx`, `wizard-shell.tsx`.
- Painel: `features/info/build-info.ts` (tipos `bane` e `comp`, mérito SR).
- Testes: `schema.test.ts`, `wizard.test.tsx`, `build-info.test.ts`, `rules.test.ts` e `test-fixtures.ts` (a ficha de exemplo precisa respeitar 2+1 e 7/2).
