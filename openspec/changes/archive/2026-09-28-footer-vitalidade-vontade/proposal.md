## Why

Vitalidade e Força de Vontade são as trilhas mais consultadas durante o jogo, mas hoje só aparecem dentro das abas Características e Ações, repetidas nas duas. Colocá-las na barra inferior fixa, ao lado da Fome, deixa tudo visível e editável em qualquer aba e elimina a duplicação.

## What Changes

- Barra inferior fixa redesenhada: botão "Checagem de sangue" vira uma aba centralizada saindo da borda superior (sangue) da barra; abaixo, três blocos lado a lado — "Vitalidade" (caixas de dano), "Fome" (valor) e "Vontade" (caixas de dano).
- As caixas de Vitalidade e Vontade na barra são clicáveis e seguem o mesmo ciclo vazio → superficial → agravado; os rótulos abrem o painel de informação como antes.
- **BREAKING (UI)**: o botão "Dormir" sai da barra inferior e vira o cartão "Dormir" na aba Ações.
- Aba Características: remove os painéis de Vitalidade e Força de Vontade (que ficavam entre Atributos e Habilidades).
- Aba Ações: remove os painéis de Vitalidade e Força de Vontade; mantém Humanidade.
- Remove o componente `TrackPanel`, que deixa de ter uso.

## Capabilities

### New Capabilities

_Nenhuma._

### Modified Capabilities

- `character-sheet`: a "Barra inferior fixa" passa a exibir Vitalidade, Fome e Vontade e a Checagem de sangue, sem "Dormir"; a "Aba Ficha" e as "Abas de Atributos e Habilidades em telas menores" deixam de exibir Vitalidade e Força de Vontade.
- `vampire-actions`: a "Aba Ações" deixa de mostrar Vitalidade e Força de Vontade e ganha o cartão "Dormir".

## Impact

- `web/src/features/sheet/sheet-layout.tsx` (`BottomBar` e espaço inferior da página)
- `web/src/features/sheet/tabs/ficha-tab.tsx`, `web/src/features/sheet/tabs/acoes-tab.tsx`
- `web/src/features/sheet/track-panels.tsx` (remoção de `TrackPanel`; `CYCLE_HINT` e `HumanityCompactPanel` continuam)
- `web/src/components/vtm/tracks.tsx` (`DamageTrack` ganha variante para fundo escuro)
- Testes da ficha/ações; sem mudanças de API ou de dados.
