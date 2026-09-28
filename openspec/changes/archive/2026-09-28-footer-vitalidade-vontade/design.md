## Context

`BottomBar` (em `sheet-layout.tsx`) é uma barra fixa `bg-ink` com filete `border-blood` e três itens em linha: botão "Checagem de sangue", Fome e botão "Dormir". Vitalidade e Força de Vontade aparecem como `TrackPanel` (em `track-panels.tsx`) em dois lugares: entre Atributos e Habilidades na aba Características (`ficha-tab.tsx`, com `lg:order-2`) e no topo da aba Ações (`acoes-tab.tsx`, junto do `HumanityCompactPanel`). `TrackPanel` usa `DamageTrack` (`components/vtm/tracks.tsx`), cujas caixas são `bg-field border-ink` com foco `outline-ink`.

O mockup pedido: aba "Checagem de sangue" centralizada saindo do filete superior, e abaixo `[ Vitalidade ] Fome [ Vontade ]`, os dois blocos laterais com borda clara e caixas brancas.

## Goals / Non-Goals

**Goals:**
- Vitalidade, Fome e Vontade sempre visíveis e editáveis na barra inferior.
- Tirar as trilhas duplicadas das abas Características e Ações.
- Manter o acesso a "Dormir" como cartão na aba Ações.

**Non-Goals:**
- Mudar regras de dano, cura, sono ou o diálogo de regras.
- Mudar Humanidade (continua na aba Características e no `HumanityCompactPanel` de Ações).
- Recolher/expandir a barra ou mostrar o máximo numérico ("máx N") nela.

## Decisions

1. **Barra em duas camadas.** O botão "Checagem de sangue" fica em posição absoluta no topo da barra (`absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2`, metade acima e metade abaixo do filete), com fundo `bg-blood` e borda `border-ink` grossa, para parecer uma aba que corta o filete sangue. Abaixo, uma grade com Vitalidade, Fome e Vontade: `grid-cols-1` (empilhados) abaixo de `sm` e `sm:grid-cols-[1fr_auto_1fr]` (lado a lado) a partir de `sm`; a barra ganha `pt-…` para o botão não cobrir os blocos. Alternativa descartada: manter o botão na mesma linha dos blocos — no celular não sobra largura para as trilhas.

2. **Rótulo do botão.** Mantém "Checagem de sangue" (texto atual do app em português) em vez de "Rouse Check" do mockup; o mockup vale para layout, não para texto.

3. **`DamageTrack` com tom inverso.** Adicionar `tone?: "ink" | "inverse"` a `DamageTrack`, seguindo o padrão de `DotRating`: em `inverse`, caixas brancas com borda `border-white` e foco `outline-white` (o `outline-ink` sumiria no fundo escuro). As marcas continuam com `DamageIcon` (superficial em tinta, agravado em sangue), legíveis sobre branco. Também aceitar `className` para centralizar (`justify-center`). Alternativa descartada: um componente novo só para a barra — duplicaria rótulos acessíveis e o ciclo.

4. **Rótulos com `InfoTrigger onDark`.** "Vitalidade" e "Vontade" usam `InfoTrigger` com `kind: "vitalidade"`/`"vontade"` e `onDark`, como a Potência de Sangue faz na aba Biografia, para não perder o painel de informação que os `TrackPanel` ofereciam. O `aria-label` do `DamageTrack` continua "Vitalidade"/"Força de Vontade" (nome completo para leitor de tela; "Vontade" é só o rótulo visual curto).

5. **Lógica da trilha na barra.** Um pequeno componente local `BarTrack({ track })` em `sheet-layout.tsx` reaproveita `trackMax`, `trackBoxes` e `cycleBox` + `patchSheet`, exatamente como `TrackPanel`. `TrackPanel` é removido de `track-panels.tsx` (fica sem uso); `CYCLE_HINT` e `HumanityCompactPanel` continuam, pois os formulários de dano/cura e a aba Ações os usam.

6. **Aba Características.** Remove o `div` das trilhas e o import de `TrackPanel`/`CYCLE_HINT`. Sem o bloco do meio, as classes `lg:order-*` deixam de ser necessárias (ordem do DOM = Atributos, Habilidades) e saem.

7. **Aba Ações.** Remove os dois `TrackPanel`; o `HumanityCompactPanel` continua no topo (a grade `autoFit(260)` pode ficar, com um item só). Novo cartão "Dormir" entre Alimentar-se e Teste de Frenesi: CTA "Dormir", não sangue, `run: () => dialog.open("sleep")`, descrição "Encerra a noite: cura dano superficial, recupera Força de Vontade e oferece a checagem de sangue do despertar.". `BottomBar` deixa de usar `dialog.open("sleep")`.

8. **Espaço inferior.** A barra fica mais alta (aba + blocos com trilhas, que podem quebrar linha no celular). Ajustar o `pb-24` do contêiner da página para cobrir a altura da barra: `pb-84` abaixo de `sm` (blocos empilhados) e `sm:pb-52` a partir dele, incluindo a metade do botão que sobe acima da barra.

## Risks / Trade-offs

- [No celular os blocos empilhados deixam a barra alta (~260px)] → padding inferior da página `pb-84` abaixo de `sm`; conferir no navegador. Entre `sm` e `md`, com os blocos lado a lado, Vontade 10 caixas pode quebrar linha → caixas centralizadas com `flex-wrap`.
- [Barra fixa mais alta ocupa mais tela útil] → aceito em troca de ter as trilhas sempre à mão; blocos com padding enxuto.
- [Perda do "máx N" e da dica de ciclo que os painéis mostravam] → o número de caixas já mostra o máximo; o ciclo é o mesmo já conhecido e a dica continua nos diálogos de dano/cura.
- [Usuários acostumados ao "Dormir" na barra] → cartão "Dormir" na aba Ações, com o mesmo diálogo.
