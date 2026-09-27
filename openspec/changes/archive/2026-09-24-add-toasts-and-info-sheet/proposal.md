## Why

O standalone de referência ("Mudanças desde o último standalone") trocou as mensagens de erro inline por toasts e ganhou um painel lateral que explica cada traço da ficha. O web ainda mostra `<p role="alert">` vermelho no login/cadastro e no diálogo de adicionar disciplina, e não tem nenhuma explicação de atributos, habilidades, disciplinas, poderes, méritos ou estados. Diferente da referência (que implementa tudo à mão), o web deve usar os componentes shadcn: **Sonner** para os toasts e **Sheet** para o painel.

## What Changes

- Adicionar o componente shadcn `sonner` (`components/ui/sonner.tsx`) e montar um único `<Toaster />` na raiz, estilizado com os tokens V5 (Vellum, filete, borda esquerda 2px Blood/Moss/Ink, sem sombra, sem cantos arredondados, Karla/Cormorant).
- Criar um módulo `lib/toast.tsx` com `notify(msg, { tom, titulo, duracao, acao, onAcao })` e `apiError(err, retry)` sobre o `toast` do Sonner: máx. 3 visíveis, mensagem repetida não duplica, erro 6s / ok-info 3,5s, `duracao: 0` = persistente.
- **Remover** o `<p role="alert">` de erro do `AuthCard` e do diálogo "Adicionar disciplina ou poder"; esses erros passam a sair como toast.
- Toast persistente "Não salvou", uma vez por sessão, quando a gravação no `localStorage` falhar.
- Posição: canto inferior direito (24px); abaixo de 640px, centralizado embaixo com 16px de margem; na ficha, 96px do fundo para ficar acima da barra inferior preta.
- Adicionar um painel lateral de descrição (`InfoSheet`) com o `Sheet` shadcn já existente (lado direito, 400px, `max-w-[92vw]`), que mostra kicker, título, selo do valor atual, descrição, lista de níveis com o nível atual destacado e nota. Fecha no ×, clique fora ou Esc.
- Catálogo de textos (atributos, escala de habilidades, habilidades, disciplinas, estados, méritos) em `data/trait-info.ts`, e a montagem do conteúdo como função pura.
- Gatilhos: nome de atributo e habilidade, botão **?** ao lado da disciplina, link "Sobre este poder" no poder aberto, botão **?** na linha de vantagem/defeito (passo 7), e os rótulos de Fome, Humanidade, Vitalidade, Força de Vontade, Ressonância e Potência de Sangue.
- Gatilhos de texto sem sublinhado, com hover em Blood (`#7A1220`) e `transition: color .15s`; sobre fundo tinta (painel de Potência de Sangue) o hover usa Ember (`#E8535F`).
- Fora do escopo: o item 4 da referência (lógica de méritos na criação) — o passo 7 do web já funciona com `useFieldArray`.

## Capabilities

### New Capabilities
- `notifications`: toasts globais (Sonner) — aparência, posição, duração, limite e deduplicação, API `notify`/`apiError` e aviso de falha de gravação.
- `trait-info`: painel lateral (Sheet) de descrição de traços, seu catálogo de textos, gatilhos e estilo de hover.

### Modified Capabilities
- `local-accounts`: os erros de cadastro e entrada deixam de aparecer inline e passam a ser toasts.
- `character-sheet`: o erro "Adicionar sem nome" do diálogo de disciplinas passa a ser toast; o salvamento automático avisa quando a gravação falha.

## Impact

- Dependência nova: `sonner` (via `shadcn add sonner`); `next-themes`, que o gerador puxa, não é necessário — o componente é ajustado para não usá-lo.
- Código: `routes/__root.tsx`, `features/auth/auth-card.tsx`, `features/sheet/tabs/disciplinas-tab.tsx`, `features/sheet/tabs/ficha-tab.tsx`, `features/sheet/tabs/registros-tab.tsx`, `features/sheet/track-panels.tsx`, `features/wizard/step2-attributes.tsx`, `features/wizard/step3-skills.tsx`, `features/wizard/step7-merits.tsx`, `components/vtm/trait-grid.tsx`, `lib/storage.ts`. `styles.css` não muda: todo estilo e animação ficam em classes Tailwind no JSX.
- Novos: `components/ui/sonner.tsx`, `lib/toast.tsx`, `data/trait-info.ts`, `features/info/` (provider + painel + montagem do conteúdo).
- Testes existentes que procuram o `<p role="alert">` do login precisam passar a procurar o toast.
