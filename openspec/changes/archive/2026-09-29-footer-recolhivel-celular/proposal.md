## Why

No celular (abaixo de 640px) a barra inferior empilha Vitalidade, Fome e Vontade em coluna e ocupa boa parte da tela, escondendo a ficha. Recolher a barra numa linha compacta devolve espaço para o conteúdo sem perder os números que o jogador consulta o tempo todo.

## What Changes

- Abaixo de 640px (breakpoint `sm`), a barra inferior começa **recolhida**: uma linha única com "VIT x/y", "FOME n" e "VONT x/y" e uma seta para cima (^) à direita. `x` é o número de caixas vazias da trilha e `y` o máximo.
- Tocar na linha recolhida **expande** a barra, que sobe exatamente no formato atual (Checagem de sangue sobre o filete, blocos Vitalidade/Fome/Vontade empilhados e editáveis).
- Com a barra expandida, um botão de seta para baixo recolhe a barra de novo.
- Com a barra recolhida, o botão "Checagem de sangue" não aparece; ele volta ao expandir.
- A partir de 640px nada muda: a barra fica sempre expandida e sem botão de recolher.
- O espaço inferior da página no celular diminui para a altura da barra recolhida; expandida, a barra fica por cima do conteúdo.

## Capabilities

### New Capabilities

_Nenhuma._

### Modified Capabilities

- `character-sheet`: o requisito "Barra inferior fixa" ganha o estado recolhido/expandido abaixo de 640px.

## Impact

- `web/src/features/sheet/bottom-bar.tsx` (linha recolhida, estado de expansão, botões de alternar)
- `web/src/features/sheet/sheet-layout.tsx` (espaço inferior da página no celular)
- `web/src/features/sheet/bottom-bar.test.tsx`
- Sem mudanças de API, dados ou estilos globais.
