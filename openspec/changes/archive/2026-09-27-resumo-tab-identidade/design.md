## Context

As abas da ficha são definidas em `web/src/features/sheet/tabs.ts` (`SHEET_TABS`, com `id` usado na URL `/ficha/$aba` e `label` usado no menu e no cabeçalho). `tab-content.tsx` escolhe o componente pelo id, e `routes/ficha.$aba.tsx` redireciona ids desconhecidos para `/ficha/ficha` via `isSheetTab`.

Hoje a aba Ficha (`tabs/ficha-tab.tsx`) começa com um `Panel` que mapeia `IDENTITY_FIELDS` em `SheetTextField` (sem placeholder, grade `autoFit(220)`). A aba Registros (`tabs/registros-tab.tsx`, `RegistrosTab`) começa pelos `LONG_FIELDS`. Os campos gravam direto na ficha via `SheetTextField`, então mudar o painel de lugar não afeta dados.

## Goals / Non-Goals

**Goals:**
- Renomear a aba para "Resumo" em rótulo, id/URL, arquivo e componente.
- Mover o painel de identificação, sem mudar visual nem comportamento, para o topo do Resumo.
- Não quebrar links antigos `/ficha/registros`.

**Non-Goals:**
- Reordenar as abas no menu ou mudar a aba inicial.
- Mudar o conteúdo/ordem do restante do Resumo.
- Mudar o painel de identificação do assistente (passo 8 usa `IDENTITY_FIELDS` e continua igual).

## Decisions

- **Trocar também o id (`registros` → `resumo`), não só o rótulo.** A URL deve refletir o nome visível; manter `registros` na URL e "Resumo" na tela seria confuso. Alternativa (só rótulo) descartada por deixar nome e endereço divergentes.
- **Redirecionar o id legado na rota.** Em `ficha.$aba.tsx`, antes do `isSheetTab`, tratar `aba === "registros"` com `<Navigate params={{ aba: "resumo" }} replace />`. Um mapa pequeno de aliases (`LEGACY_TABS = { registros: "resumo" }`) em `tabs.ts` mantém a regra junto das abas. Alternativa (deixar cair no redirecionamento para `ficha`) descartada: o usuário cairia na aba errada.
- **Renomear arquivo e componente** (`registros-tab.tsx` → `resumo-tab.tsx`, `RegistrosTab` → `ResumoTab`) para não deixar nome órfão no código, seguindo a regra de remover lógica/nomes órfãos.
- **Mover o JSX do painel tal como está** (mesmo `Panel`, `mb-6 grid gap-x-6 gap-y-4`, `autoFit(220)`, placeholders removidos) para o início do fragmento do Resumo, e remover do `ficha-tab.tsx` o import de `IDENTITY_FIELDS` e qualquer import que ficar sem uso. Estilos continuam como classes Tailwind no JSX; nada vai para `styles.css`.

## Risks / Trade-offs

- [Links/favoritos para `/ficha/registros`] → redirecionamento com `replace` para `/ficha/resumo`.
- [Jogador acostumado a editar o nome na Ficha] → o nome continua no cabeçalho e o menu mostra "Resumo" logo depois de "Ações"; mudança é pequena e intencional.
- [Testes/e2e que procuram "Registros" ou campos de identificação na Ficha] → atualizar os testes existentes e cobrir o Resumo com teste novo.
