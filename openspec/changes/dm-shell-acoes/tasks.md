## 1. Dados e regras da Ressonância

- [x] 1.1 Criar `web/src/data/resonance.ts` com os tipos `Mood`/`Intensity`, `RESONANCE_MOODS` (emoções, Disciplinas, 3 discrasias por humor) e `INTENSITY_EFFECTS`, com os textos do spec `dm-resonance-roll`
- [x] 1.2 Criar `web/src/rules/resonance.ts` com `rollResonance(escolha, d)` (tabelas de d10, segundo d10 em 9–10, d3 de discrasia só em Aguçada) e `diceLine(escolha, roll)`, mais o gerador padrão com `crypto.getRandomValues`
- [x] 1.3 Testes das regras com dados fixos: tudo aleatório (5/7 → Melancólica Difusa), 9→10 Aguçada com discrasia, 10→4 Intensa, tudo fixo Fleumática/Aguçada d3 1 → Frieza sem d10, e as linhas de dados dos cenários do spec

## 2. Painel do Mestre e rotas

- [x] 2.1 Criar `web/src/features/dm/dm-shell.tsx`: cabeçalho (nome, selo "MESTRE", "Sair da conta") e abas `Link` sublinhadas "Lista de personagens" (`exact`) e "Ações", com `<Outlet />`
- [x] 2.2 Criar `web/src/routes/personagens._painel.tsx` (layout sem caminho com o `DmShell`), `personagens._painel.index.tsx` (`CharacterList`) e `personagens._painel.acoes.tsx`; apagar `personagens.index.tsx` e regenerar `routeTree.gen.ts`
- [x] 2.3 Remover da `CharacterList` o `<header>` (título e "Sair") e os imports/hooks que ficaram órfãos (`useNavigate`, `logout`, `Button`)
- [x] 2.4 Conferir que `personagens.$id*` continua fora do painel e que o link "Lista de personagens" do menu da ficha ainda leva a `/personagens`

## 3. Aba Ações

- [x] 3.1 Criar `web/src/features/dm/resonance-roll.tsx`: painel de escolha com `Chip` (Aleatória por padrão, um marcado por grupo), botão "Rolar ressonância"/"Rolar discrasia" e nota das tabelas
- [x] 3.2 Cartão de resultado escuro (placeholder, intensidade, humor, emoções, selos de Disciplinas, efeito, seção de discrasia em Aguçada, linha de dados, `aria-live="polite"`)
- [x] 3.3 Botão "Limpar" acima do cartão, alinhado à direita, só com resultado; volta o cartão ao texto inicial sem mexer nas escolhas
- [x] 3.4 Grade de duas colunas a partir de `md`, uma coluna no celular; só classes Tailwind no JSX

## 4. Testes e verificação

- [x] 4.1 Atualizar `character-list.test.tsx` (sem título/Sair próprios) e `dm-routes.test.tsx`: Mestre entra em `/personagens` com a aba Lista ativa; aba Ações leva a `/personagens/acoes` com `aria-current` certo; "Sair da conta" vai para `/entrar`; jogador em `/personagens/acoes` volta para a ficha; ficha do jogador sem barra de abas
- [x] 4.2 Teste da aba Ações com gerador fixo: estado inicial, troca de rótulo do botão, resultado Fleumática/Aguçada/Frieza com a linha de dados, "Limpar" oculto sem resultado e limpando o cartão sem mexer nas escolhas
- [x] 4.3 Rodar `pnpm test`, `pnpm check` (Biome/Ultracite) e o build do web; conferir no navegador a lista, as Ações em desktop e em 375px

## 5. Sangue-fraco

- [x] 5.1 `rules/resonance.ts`: `sangueFraco` na escolha; sorteio de Disciplina (d2) e poder do nível (1 em Intensa, 2 em Aguçada), sem rituais, amálgamas e apelidos; `diceLine` com dados rolados em ordem e depois as escolhas
- [x] 5.2 Testes das regras: Intensa e Aguçada com sangue-fraco, poder único sem dado, Difusa sem poder, nova ordem da linha de dados
- [x] 5.3 Painel: grupo "Sangue-fraco" (Não/Sim); cartão: seção do poder antes da discrasia
- [x] 5.4 Testes da aba e verificação no navegador
