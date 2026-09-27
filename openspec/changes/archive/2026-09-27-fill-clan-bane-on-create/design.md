## Context

`perdicao` é um `TextFieldKey` livre da `Sheet`, exibido em `LONG_FIELDS` na aba Registros. O assistente edita um recorte da ficha (`WizardValues`) e grava cada passo com `wizardToPatch(values, fields, base)`, em que `base` é a ficha atual sem o Predador aplicado. `perdicao` não faz parte de `WizardValues`, então nenhum passo o grava — por isso o campo fica vazio após o cadastro.

O catálogo `CLANS` (`web/src/data/clans.ts`) já tem `bane` (nome) e `baneText` (descrição) para todos os clãs, incluindo Caitiff e Sangue-ralo.

## Goals / Non-Goals

**Goals:**
- Ficha criada pelo assistente sai com "Perdição do Clã" preenchida.
- Troca de clã atualiza o texto, sem apagar edições manuais do jogador.

**Non-Goals:**
- Preencher a Compulsão (não há campo `compulsao` na ficha).
- Migrar fichas já criadas com `perdicao` vazio; elas passam a ser preenchidas ao salvar o passo 1 do "Refazer personagem".
- Usar o texto completo de `CLAN_FULL` (regras com `{G}`), que depende da Gravidade e já está no painel lateral.
- Tornar a Perdição um campo do formulário do assistente.

## Decisions

**Gravar em `wizardToPatch`, não em um campo do formulário.** Quando `fields` inclui `cla`, o patch recebe `perdicao` derivado do clã. Assim o passo 1 (e o `ALL_FIELDS` do passo final) grava a Perdição sem acrescentar estado ao formulário nem UI. Alternativa descartada: adicionar `perdicao` a `WizardValues` e ao schema do passo 1 — exigiria sincronizar o campo com o clique no cartão e o jogador não o edita no assistente.

**Formato `"<bane> — <baneText>"`.** Nome e descrição curta já estão no catálogo e batem com o que o passo 1 mostra. Helper `clanBaneText(clan)` em `clans.ts` concentra o formato.

**Sobrescrever só texto automático.** `wizardToPatch` recebe `base: Pick<Sheet, "disc" | "perdicao">`. Grava a Perdição do novo clã se `base.perdicao` está vazio (após `trim`) ou é igual a `clanBaneText(c)` para algum `c` de `CLANS`; senão mantém o texto do jogador. Alternativa descartada: guardar uma flag "perdição editada" na ficha — mais estado para um caso que a comparação resolve.

**Clã inválido/vazio não grava.** Se `findClan(values.cla)` não acha o clã, `perdicao` não entra no patch.

## Risks / Trade-offs

- [Mudança no texto de `baneText` no catálogo deixa de casar com textos antigos gravados] → o texto antigo passa a ser tratado como edição do jogador e é preservado; aceitável, o jogador pode apagar o campo e salvar o passo 1 de novo.
- [Jogador edita o texto para exatamente o de outro clã] → seria sobrescrito numa troca de clã; improvável e inofensivo.
