## Why

Hoje, "Alimentar-se" (aba Ações) abre uma lista de oito fontes de sangue com os limites da Potência, e a Ressonância da presa tem que ser marcada depois, à mão, na aba Ficha. O novo diálogo "Registrar alimentação" junta tudo numa tela: o jogador diz quanto saciou, escolhe a Ressonância e a intensidade da presa, e ao confirmar a Fome e o painel de Ressonância da aba Ficha são atualizados juntos.

## What Changes

- O diálogo de alimentação passa a ser um formulário numa tela só (kicker "Alimentação", título "Registrar alimentação", texto "Fome atual: N."):
  - controle **− / +** "Saciar", de 1 até a Fome atual, começando na Fome atual;
  - **Ressonância da presa**: grade 2×2 com Colérica, Melancólica, Fleumática e Sanguínea (tocar de novo desmarca);
  - **intensidade** em controle segmentado com a mesma lista da aba Ficha (Negligenciável, Difusa, Intensa, Aguçada), ativo só com uma Ressonância marcada;
  - botão principal em sangue "Alimentar · Fome X → Y" e botão "Cancelar".
- Confirmar reduz a Fome e, se houver Ressonância marcada, grava `ressonancia` e `resIntensidade` na ficha, os mesmos campos do painel Ressonância da aba Ficha. Sem Ressonância marcada, a Ressonância da ficha não muda.
- Com Fome 0 o "Saciar" fica em 0, o texto diz "Você está saciado. Nada a reduzir." e o botão vira "Registrar ressonância" (só ativo com uma Ressonância marcada).
- Depois de confirmar, o diálogo mostra o resultado ("Fome Y", "Anotado na ficha.") com uma nota do que mudou, como as outras ações de regra.
- **BREAKING** (regra): sai a escolha da fonte (animais, bolsa, pessoa, matar) e o app deixa de aplicar os limites da Potência de Sangue na alimentação. O jogador informa direto quanto saciou. Saem `FEEDING_SOURCES`, `feedingYield` e o estágio "Quanto você bebeu?".

## Capabilities

### New Capabilities
<!-- nenhuma -->

### Modified Capabilities
- `vampire-actions`: "Alimentação" deixa de ser por fonte e Potência e passa a ser o formulário Saciar + Ressonância da presa, que atualiza a Ressonância da ficha; "Diálogo de regras" aceita um formulário no lugar da lista de botões; o cenário "Abrir alimentação pela aba" abre "Registrar alimentação"; "Regras como funções puras" troca "rendimento da alimentação" por "alimentação (Fome e Ressonância)".

## Impact

- `web/src/rules/feeding.ts`: `feed` passa a receber quanto saciou e a Ressonância opcional e devolve o patch de `fome`, `ressonancia` e `resIntensidade`. Saem `FEEDING_SOURCES`, `feedingYield` e os tipos `FeedingKind`, `FeedingSource` e `FeedingYield`.
- `web/src/features/actions/flows.ts`: `feedView` sem fontes nem estágio "pessoa"; sai o import de `bloodPotency` se não for mais usado.
- `web/src/features/actions/rule-dialog.tsx`: renderiza o formulário de alimentação no estágio "ask".
- Novo `web/src/features/actions/feed-form.tsx` e novo controle segmentado de valor em `web/src/components/vtm/`.
- `web/src/rules/rules.test.ts`: testes de alimentação reescritos; novos testes do formulário.
- Sem mudança de API, de modelo de dados (`sheet`) nem de dependências (`radix-ui` já inclui ToggleGroup).
