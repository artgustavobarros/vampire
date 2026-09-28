## 1. Trilha de dano para fundo escuro

- [x] 1.1 Em `web/src/components/vtm/tracks.tsx`, adicionar a `DamageTrack` as props `tone?: "ink" | "inverse"` (padrão `"ink"`) e `className` (mesclado via `cn`); em `inverse`, caixas brancas com `border-white` e foco `outline-white`
- [x] 1.2 Em `components.test.tsx`, testar que `DamageTrack` com `tone="inverse"` mantém os rótulos acessíveis e o `onCycle`

## 2. Barra inferior

- [x] 2.1 Em `bottom-bar.tsx` (extraído de `sheet-layout.tsx`), criar `BarTrack({ track })` com rótulo `InfoTrigger onDark` ("Vitalidade"/"Vontade", `kind` "vitalidade"/"vontade"), bloco com borda clara e `DamageTrack tone="inverse"` centralizado, usando `trackMax`, `trackBoxes`, `cycleBox` e `patchSheet`
- [x] 2.2 Reescrever `BottomBar`: botão "Checagem de sangue" absoluto e centralizado sobre o filete sangue (aba `bg-blood`), e grade `grid-cols-[1fr_auto_1fr]` com Vitalidade, Fome e Vontade; remover o botão "Dormir" e o `dialog.open("sleep")`
- [x] 2.3 Ajustar o espaço inferior da página (`pb-24`) para a nova altura da barra, cobrindo o caso do celular com as caixas quebrando linha
- [x] 2.4 Criar testes da barra: mostra Vitalidade e Vontade com o número de caixas do máximo, ciclo de uma caixa grava na ficha, "Checagem de sangue" abre o diálogo, não há "Dormir", rótulo "Vontade" abre o painel de informação

## 3. Abas

- [x] 3.1 Em `ficha-tab.tsx`, remover o bloco com os `TrackPanel` de Vitalidade e Força de Vontade, o import de `track-panels` e as classes `lg:order-*` que ficaram sem propósito
- [x] 3.2 Em `acoes-tab.tsx`, remover os dois `TrackPanel` (mantendo `HumanityCompactPanel`) e adicionar o cartão "Dormir" entre Alimentar-se e Teste de Frenesi, com CTA "Dormir" abrindo `dialog.open("sleep")`
- [x] 3.3 Em `track-panels.tsx`, remover `TrackPanel` e os imports que só ele usava (`DamageTrack`, `trackBoxes`, `trackMax`, `cycleBox`, `TrackKey`, `ReactNode` etc.), mantendo `CYCLE_HINT` e `HumanityCompactPanel`
- [x] 3.4 Testar: aba Ações sem painéis de Vitalidade/Força de Vontade e cartão "Dormir" abrindo "Dormir até o anoitecer?"; aba Características sem painéis de trilha

## 4. Verificação

- [x] 4.1 Rodar lint (Ultracite/Biome), typecheck e a suíte de testes do `web`
- [x] 4.2 Conferir no navegador em 390px, 768px e 1280px: aba "Checagem de sangue" sobre o filete, blocos lado a lado, caixas quebrando centralizadas no celular, foco visível nas caixas, e conteúdo das abas não escondido atrás da barra
