## 1. Texto automático da Perdição

- [x] 1.1 Adicionar `clanBaneText(clan: Clan): string` em `web/src/data/clans.ts`, retornando `` `${clan.bane} — ${clan.baneText}` ``
- [x] 1.2 Adicionar `isAutoBaneText(text: string | undefined): boolean` (vazio após `trim` ou igual a `clanBaneText` de algum clã de `CLANS`)

## 2. Gravação no assistente

- [x] 2.1 Em `web/src/features/wizard/schema.ts`, ampliar o parâmetro `sheet` de `wizardToPatch` para `Pick<Sheet, "disc" | "perdicao">`
- [x] 2.2 Em `wizardToPatch`, quando `fields` inclui `cla`, `findClan(values.cla)` acha o clã e `isAutoBaneText(sheet.perdicao)`, gravar `patch.perdicao = clanBaneText(clan)`
- [x] 2.3 Conferir que `wizard-shell.tsx` já passa a ficha base completa (`base`) para `wizardToPatch` e ajustar chamadas/fixtures de teste que passam só `{ disc }`

## 3. Testes

- [x] 3.1 `schema.test.ts`: patch do passo 1 grava a Perdição com `perdicao` vazio
- [x] 3.2 `schema.test.ts`: troca de clã substitui o texto automático do clã anterior
- [x] 3.3 `schema.test.ts`: texto editado pelo jogador é preservado; clã inválido não grava `perdicao`
- [x] 3.4 `wizard.test.tsx`: concluir o assistente com "Brujah" deixa a ficha com `perdicao` começando por "Temperamento Violento — "
- [x] 3.5 Rodar a suíte de testes e o lint (`ultracite check`) do `web/`
