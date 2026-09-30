## Context

A aba Ações (`/personagens/acoes`) renderiza `ResonanceRollTab`, que tem a Rolagem de Ressonância (painel de selos + cartão escuro com "Limpar") e, abaixo, o `NpcGenerator`. Toda a lógica de dados é pura e recebe um `Die` (`rules/resonance.ts`), então os testes usam dados viciados. Os clãs, com `compulsion` e `compulsionText`, já estão em `data/clans.ts`. Caitiff e Sangue-ralo aparecem ali com `compulsion: "Nenhuma"`.

Pelas regras do V5, numa falha bestial o Narrador pode impor uma compulsão sorteada em d10 (1–3 Fome, 4–5 Dominância, 6–7 Dano, 8–9 Paranoia, 10 do clã). A compulsão dá −2 dados em tudo que não seja para satisfazê-la e dura até ser satisfeita ou até o fim da cena.

## Goals / Non-Goals

**Goals:**
- Sortear a compulsão em um toque, com o texto já pronto para ler na mesa.
- Mostrar a compulsão do clã certo quando sai 10.
- Manter o mesmo visual e comportamento da Rolagem de Ressonância (selos, botão sangue, cartão `ink`, "Limpar", `aria-live`).

**Non-Goals:**
- Aplicar a compulsão na ficha do personagem ou avisar o jogador.
- Detectar a falha bestial automaticamente nas rolagens.
- Escolher um personagem da crônica para puxar o clã. O Mestre marca o clã à mão.
- Guardar histórico de rolagens.

## Decisions

- **Componente próprio, montado dentro de `ResonanceRollTab`.** `CompulsionRoll` fica em `features/dm/compulsion-roll.tsx` e recebe `d`, como o `NpcGenerator`. A rota continua a mesma. Alternativa: criar uma aba nova. Descartada, porque as rolagens rápidas do Mestre já moram em Ações.
- **Lógica pura em `rules/compulsion.ts`.** `rollCompulsion(clan: string | null, d: Die): CompulsionRoll` devolve `{ dados: number[], tipo: "Fome" | "Dominância" | "Dano" | "Paranoia" | "Clã", clan?: Clan }`. `compulsionDiceLine` monta a linha "Compulsão d10: 4" (ou "10, 6"). Reaproveita `Die`/`rollDie` de `rules/resonance.ts` em vez de duplicá-los.
- **Clãs sem compulsão rolam o 10 de novo.** Com Caitiff ou Sangue-ralo (clã cuja `compulsion` é "Nenhuma"), o 10 não tem efeito, então a função rola de novo até sair 1–9 e guarda todos os dados. Alternativa: mostrar "sem compulsão". Descartada, porque deixaria a falha bestial sem consequência e obrigaria o Mestre a rolar de novo à mão.
- **"Não informado" como padrão do grupo Clã.** Cada grupo de selos precisa de um marcado. Um clã qualquer como padrão levaria a erro. Com "Não informado", o 10 mostra "Compulsão de Clã" e o texto "Use a compulsão do clã do personagem.".
- **Textos das compulsões gerais em `data/compulsions.ts`.** Nome, efeito e fim ficam num arquivo de dados, que é a fonte da verdade, e os testes seguem o que estiver lá. Os nomes em português seguem a tradução brasileira. "Dominância" evita a confusão com a Disciplina Dominação.
- **Estilo com classes Tailwind no JSX.** Reaproveita `ChipGroup`, `Button` e as mesmas classes do cartão da Ressonância, sem regras novas em `styles.css`. A constante `LABEL` é repetida no arquivo novo, como já acontece em `resonance-roll.tsx` e `resonance-parts.tsx`.

## Risks / Trade-offs

- [Os textos das compulsões são uma paráfrase, não o texto do livro] → Ficam isolados em `data/compulsions.ts` para o Mestre revisar e ajustar sem mexer em componente.
- [16 selos de clã ocupam espaço no celular] → Os selos quebram linha (`flex-wrap`), como já fazem na Ressonância. Não há rolagem horizontal.
- [O Mestre pode esquecer de trocar o clã entre personagens] → O selo marcado fica sempre visível, e o cartão de Compulsão de Clã mostra o nome do clã.

## Open Questions

- Os textos de efeito e fim de cada compulsão geral precisam ser conferidos com o livro em português.
