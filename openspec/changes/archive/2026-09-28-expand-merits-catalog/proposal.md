## Why

O catálogo de Vantagens e Defeitos (`web/src/data/merits.ts`) tem ~55 itens, contra ~235 do V5 listados em [Advantages and Flaws](https://vtm.paradoxwikis.com/Advantages_and_Flaws). Jogadores acabam cadastrando itens "fora do catálogo" sem regra, o Predador cita méritos que não existem no catálogo (`Rejeitado`, `Predador Óbvio`, `Refúgio Assombrado`…) e parte do que já existe está errado: dois Defeitos de Sangue-ralo cadastrados como Qualidades, descrições com texto de outro item colado, custos de Aparência e faixas de Antecedentes que não batem com o V5. A decisão é trazer o catálogo inteiro agora e podar depois, em vez de ir adicionando aos poucos.

## What Changes

- Catálogo completo do wiki em PT-BR (tradução própria), cada item com o nome em inglês como alias pesquisável e o livro de origem:
  - Gerais: Linguística, Aparência, Uso de Substâncias, Arcaicos, Laço de Sangue, Sobrenatural, Alimentação, Míticos, Psicológicos, Contágio, Laços de Sangue (linhagem), Diablerie, Outros.
  - Falhas de Disciplina Enraizada (sem valor em pontos, uma por Disciplina).
  - Caitiff (só para o clã Caitiff).
  - Carniçais (catalogados, fora do assistente — só carniçais podem ter).
  - Cultos: gerais, Ashfinders, Bahari, Igreja de Caim, Igreja de Set, Culto de Shalim, Mistérios Mitraicos, Nefilim.
  - Sub-vantagens e sub-defeitos de cada Antecedente (Aliados, Contatos, Fama, Influência, Refúgio, Rebanho, Máscara, Mawla, Recursos, Lacaios, Status), com o Antecedente e o nível exigidos.
- Correções no que já existe:
  - `Presença do Crepúsculo` e `Fome Infinita` passam a Defeitos SR; descrições limpas (sem texto de outro item nem restos do PDF). Sangue-ralo fica com **14 Qualidades e 16 Defeitos**.
  - `Conta Sobrenatural` → `Sinal Sobrenatural` (alias do nome antigo).
  - **BREAKING (dados)** Aparência segue o V5: `Feio` •, novo `Repulsivo` ••; `Monstruoso` sai do catálogo.
  - **BREAKING (dados)** `Evitado` passa a custo fixo •• (Shunned, sub-defeito de Status); `Assombrado` vira `Refúgio Assombrado` (sub-defeito de Refúgio, alias do nome antigo); `Perseguido` sai do catálogo (Inimigo e Adversário cobrem).
  - **BREAKING (dados)** `Vegano` → `Fazendeiro` (Farmer ••, alias `Vegano`), proibido para Ventrue.
  - Faixas de Antecedentes do V5: Aliados ••–••••••, Contatos •–•••, Refúgio •–•••, Máscara •–••, Lacaios •–•••; demais •–•••••.
- Modelo do item ganha: `aliases`, `source`, `parent` (Antecedente dono), `requires` (Antecedente com nível mínimo ou Disciplina), `clans` / `excludeClans`, e custo 0 para itens sem valor em pontos.
- `findMerit` resolve aliases e deixa de casar um nome curto com o início de um nome maior (ex.: "Arsenal" não vira "Arsenal Escondido").
- Assistente (Passo 7): opções filtradas pelo clã (Sangue-ralo, Caitiff, exclusões como Fazendeiro/Ventrue) e pelas Disciplinas da ficha; sub-vantagens agrupadas sob o Antecedente; status cobra os pré-requisitos; `DotRating` aceita 0 e até 6 conforme o item.
- `MERIT_INFO` em `data/trait-info.ts` deixa de duplicar descrições de méritos: o painel lateral usa só o catálogo.
- `data/predators.ts` passa a usar só nomes do catálogo; a lista de exceções do teste de predadores fica vazia.

## Capabilities

### New Capabilities
<!-- nenhuma: tudo cabe nas capacidades existentes -->

### Modified Capabilities
- `v5-merits-catalog`: catálogo completo, novo modelo do item (aliases, origem, pré-requisitos, restrição de clã, custo 0), correções de Sangue-ralo/Aparência/Antecedentes, busca por alias, filtragem por clã e Disciplinas.
- `character-wizard`: Passo 7 com grupos de sub-vantagens, rótulo "—" para custo 0, filtro por clã/Disciplina, validação de pré-requisitos e restrições de clã, pontos de 0 a 6 conforme o item.
- `trait-info`: painel de Vantagem/Defeito lê só o catálogo (sem `MERIT_INFO`), mostra nome original, livro e pré-requisito, e usa os níveis do item (não sempre 5).

## Impact

- `web/src/data/merits.ts` → `web/src/data/merits/` (arquivos por grupo + `index.ts` com os helpers; o import `#/data/merits` continua igual).
- `web/src/data/trait-info.ts` (remove entradas de mérito de `MERIT_INFO`), `web/src/features/info/build-info.ts`.
- `web/src/data/predators.ts` (nomes: Vegano → Fazendeiro, Sabujo de Sangue, Predador Óbvio, Rejeitado, Refúgio Assustador/Assombrado já no catálogo).
- `web/src/features/wizard/step7-merits.tsx`, `merit-combobox.tsx`, `schema.ts`, `web/src/rules/wizard.ts` (filtro, validação, faixa de pontos).
- `web/src/features/sheet/merits-panel.tsx` (DotRating com os valores do item).
- Testes: `data/merits.test.ts`, `rules/rules.test.ts`, `features/wizard/wizard.test.tsx`, `features/info/build-info.test.ts`, `features/sheet/merits-panel.test.tsx`.
- Fichas salvas não são migradas: o nome gravado continua na ficha e passa a ser resolvido por alias quando mudou de nome; itens removidos (Monstruoso, Perseguido) aparecem como "fora do catálogo".
