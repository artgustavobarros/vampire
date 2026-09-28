## Context

O diálogo de regras (`RuleDialogProvider` em `web/src/features/actions/rule-dialog.tsx`) monta cada fluxo a partir de `flowView` (`flows.ts`). O fluxo de alimentação já estabeleceu o padrão de formulário: no estágio `ask`, o provider desenha `FeedForm` no lugar da lista de botões; ao confirmar, aplica `patchSheet(result.patch)` e muda para o estágio `done` com a nota.

A marcação de dano hoje só existe caixa a caixa (`DamageTrack` + `cycleBox`). A regra de transbordo já está em `addDamage` (`web/src/rules/tracks.ts`), testada, mas não é usada pela UI. O ícone `DamageIcon` (traço / X) já existe em `web/src/components/vtm/tracks.tsx`.

O formato-alvo é o da imagem de referência: título "Sofrer dano", abas Vitalidade | Força de Vontade, stepper "Dano recebido", cartões Superficial / Agravado com ícone, pré-visualização "Vitalidade depois" com as caixas novas tracejadas em vermelho, texto da conta e botão "Marcar N de dano".

## Goals / Non-Goals

**Goals:**
- Fluxo "damage" no diálogo de regras seguindo exatamente o padrão do fluxo "feed".
- Conta do dano efetivo e resultado da trilha em função pura testada, reaproveitando `addDamage`.
- Pré-visualização fiel: o que aparece em "<Trilha> depois" é exatamente o que é gravado.
- Visual com as primitivas e tokens existentes (`SegmentedControl`, `STEP_BTN` do stepper, `bg-wash`, `border-line`, `text-blood`), somente com classes Tailwind no JSX.

**Non-Goals:**
- Remover a marcação manual caixa a caixa das trilhas.
- Automatizar consequências além da nota (torpor, Debilitado, morte final não alteram outros campos).
- Dano de fontes especiais (fogo, sol) com regras próprias; o jogador escolhe Agravado.
- Cantos arredondados da imagem: o app usa cantos retos; mantemos o estilo do app.

## Decisions

### Função pura `takeDamage` em `rules/tracks.ts`
Assinatura: `takeDamage(sheet, track: TrackKey, level: 1 | 2, received: number)` → `{ effective, before, marks, changed: boolean[], note, patch }`. Calcula `effective = track === "vit" && level === 1 ? Math.ceil(received / 2) : received`, chama `addDamage(trackBoxes(sheet[track], trackMax(sheet, track)), level, effective)`, e deriva `changed[i] = before[i] !== marks[i]`. O formulário usa o mesmo retorno tanto para pré-visualizar quanto para `onApply`, garantindo que a prévia é o que se grava.
- Alternativa: calcular no componente. Rejeitada porque a spec exige regras como funções puras testadas e a conta de divisão é regra de jogo.
- `note` monta "N de dano superficial|agravado marcado na <Trilha>." mais o sufixo de trilha cheia / Vitalidade toda agravada. O retorno é compatível com `ActionResult` (`note` + `patch`) para o provider tratar igual à alimentação.

### Novo `FlowKind` "damage" e `DamageForm`
`flows.ts` ganha `"damage"` e uma `damageView` análoga à `feedView`: estágio `ask` com kicker "Dano", título "Sofrer dano", sem botões (`actions: []`); estágio `done` com título "Dano marcado", texto "Anotado na ficha." e botão "Fechar". `rule-dialog.tsx` passa a escolher o formulário por `flow.kind` no estágio `ask` (`feed` → `FeedForm`, `damage` → `DamageForm`).
- O corpo do estágio `ask` não aparece na imagem; a `DialogDescription` recebe um texto curto acessível ("Escolha a trilha, o dano e o tipo.") e fica `sr-only` nesse estágio, para manter a descrição do modal para leitores de tela.

### `DamageForm` (novo `features/actions/damage-form.tsx`)
Estado local: `track` ("vit"), `received` (1), `level` (1). Sem estado persistido: cancelar e reabrir recomeça do zero porque o provider desmonta o formulário ao fechar.
- Abas de trilha: `SegmentedControl` (escolha única sempre marcada), não `SegmentedTabs`, porque não há painéis de conteúdo, só um valor.
- Stepper: mesmo markup/classe do `FeedForm` ("Dano recebido" como rótulo). Extrair `STEP_BTN` e `LABEL` para um módulo compartilhado em `features/actions` evita duplicar as strings de classe.
- Cartões Superficial / Agravado: botões com `aria-pressed`, `font-serif` grande e `DamageIcon` abaixo do nome; marcado com `border-ink text-ink`, desmarcado com `border-line text-ink-faint`. Não usar `SelectableCard`, que inverte para fundo tinta — a imagem mantém o fundo claro.
- Pré-visualização: novo componente somente leitura `DamagePreview` em `components/vtm/tracks.tsx` (`marks`, `changed`, `label`), caixas maiores que as da trilha (ex.: `h-10 flex-1`), `border-ink` sólida nas não alteradas e `border-dashed border-blood` nas alteradas, com `DamageIcon`. Exposto como `role="img"`/lista com `aria-label` descrevendo o estado final.
- Botão principal `variant="default"` (tinta, como na imagem) com "Marcar N de dano"; "Cancelar" `outline`.

### Cartão na aba Ações
`acoes-tab.tsx` ganha o primeiro cartão: título "Sofrer dano", descrição "Marca dano em Vitalidade ou Força de Vontade, já dividindo o Superficial quando for o caso.", CTA "Marcar dano", `run: () => dialog.open("damage")`.

## Risks / Trade-offs

- [Divisão do Superficial vale para dano físico em vampiros; alguns efeitos ignoram a divisão] → o jogador escolhe Agravado ou ajusta manualmente nas trilhas, que continuam editáveis.
- [Dano recebido muito alto transborda além da trilha] → `addDamage` já satura (tudo agravado); a nota informa torpor/Debilitado. Limite de 20 no stepper evita valores absurdos.
- [Dois formulários no provider aumentam o condicional do render] → um pequeno mapa `kind → form` mantém legível; se surgir um terceiro, vale transformar em registro de formulários.
