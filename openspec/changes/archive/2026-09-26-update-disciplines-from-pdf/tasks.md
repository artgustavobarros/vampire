## 1. Extração e Estruturação Canônica do Livro V5 (PDF)

- [x] 1.1 Mapear e traduzir os poderes das disciplinas Animalismo, Auspícios, Celeridade, Dominação e Fortitude com narrativas, custos, durações e rolagens para `splitRoll`
- [x] 1.2 Mapear e traduzir os poderes das disciplinas Ofuscação, Potência, Presença e Protean com amálgamas e regras completas
- [x] 1.3 Mapear e traduzir Feitiçaria de Sangue (poderes base e rituais níveis 1 a 5) e Alquimia de Sangue-fraco (fórmulas níveis 1 a 5)

## 2. Atualização de `web/src/data/disciplines.ts`

- [x] 2.1 Atualizar a lista `DISCIPLINES` e interface `PowerTemplate`
- [x] 2.2 Atualizar o dicionário `POWERS` com os poderes completos traduzidos em PT-BR
- [x] 2.3 Adicionar aliases de compatibilidade para `Dominação`/`Domínio`, `Protean`/`Proteanismo` e `Alquimia de Sangue-fraco`/`Alquimia de Sangue-ralo`
- [x] 2.4 Harmonizar e preservar os poderes de Oblívio com descrições refinadas

## 3. Validação e Qualidade

- [x] 3.1 Validar a integração com `splitRoll` em `web/src/features/info/build-info.ts` para exibição correta de testes no painel lateral
- [x] 3.2 Executar a suite de testes automatizados (`npm --prefix web test`) e ajustar quaisquer testes afetados por nomes de disciplinas
- [x] 3.3 Executar typecheck e linter (`npm --prefix web run typecheck` e `npm --prefix web run check`)
