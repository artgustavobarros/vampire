## Context

Duas esperas artificiais simulam latência que não existe, já que contas e sessão vivem no `localStorage`:

- `web/src/features/auth/auth-card.tsx`: `submit` liga `busy`, agenda `authenticate` + navegação num `setTimeout(…, BUSY_MS)` (420ms) e guarda o timer num `ref`, que um `useEffect` limpa ao desmontar. Enquanto `busy`, os botões ficam desabilitados e o principal mostra "Verificando…".
- `web/src/features/auth/use-boot.ts`: `useBoot` chama `restore()` e segura a tela de abertura até `ready && elapsed`, onde `elapsed` só vira `true` depois de `MIN_BOOT_MS` (600ms) na primeira carga (flag de módulo `bootShown`).

## Goals / Non-Goals

**Goals:**
- Envio do formulário síncrono: validar/autenticar e navegar no mesmo handler.
- Tela de abertura visível só até `ready`.
- Menos estado e nenhum timer nesses dois pontos.
- Remover junto toda lógica que só existia por causa das esperas (estado, refs, efeitos, guards, rótulos, imports, comentários), sem deixar código ou regra órfã.

**Non-Goals:**
- Criar infraestrutura de loading/pending para um backend futuro.
- Mudar a tela de abertura em si (`boot-screen.tsx`) ou a animação das barras.
- Mexer em `authenticate`, `homeTarget` ou nos stores.

## Decisions

- **Remover `busy` por completo em `auth-card.tsx`**, em vez de manter o estado com valor fixo. `authenticate` é síncrono, então não há janela para duplo envio; o guard `if (busy) return` perde sentido. Quando existir um backend, o estado de envio volta junto com a chamada assíncrona real (ex.: `isSubmitting` de um form/mutation).
- **Manter `useBoot`, reduzido a `restore()` num `useEffect` + `return !ready`.** O hook continua sendo o ponto de entrada usado em `__root.tsx`, então a rota raiz não muda. A tela de abertura ainda aparece no primeiro render (no SSR e antes da hidratação `ready` é `false`), evitando flash da tela errada.
- **Remover a flag `bootShown`**: ela só existia para o atraso mínimo não se repetir em remontagens; sem atraso, não há o que controlar.

## Risks / Trade-offs

- [A abertura pode piscar rapidamente em máquinas rápidas] → Aceitável no MVP; se incomodar, tratar com transição CSS, não com timer.
- [Duplo clique no botão de envio] → O handler é síncrono e navega/mostra erro no mesmo tick; um segundo envio apenas repete a mesma validação, sem efeito colateral extra.
- [`auth-card.tsx` tem alterações locais não commitadas (só espaçamento)] → A edição reescreve `submit`; o resultado deve ficar formatado pelo Ultracite/Biome.
