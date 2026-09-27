## 1. Extração e Auditoria dos Dados Canônicos

- [x] 1.1 Baixar e catalogar `disciplinas.json`, `clas.json`, `tipos-de-predador.json` e `vantagens-e-defeitos.json` do repositório `vtm5e-compendio-ptbr`.
- [x] 1.2 Auditar comparativamente `web/src/data/clans.ts` contra os clãs oficiais de `clas.json`.
- [x] 1.3 Auditar comparativamente `web/src/data/predators.ts` contra os predadores de `tipos-de-predador.json`.

## 2. Saneamento e Padronização de Disciplinas

- [x] 2.1 Compilar o catálogo saneado de poderes para as 12 disciplinas principais sem entradas duplicadas, com dados canônicos (`cost`, `dicePool`, `system`, `duration`, `rouse`).
- [x] 2.2 Padronizar os rituais de Feitiçaria de Sangue, cerimônias de Oblívio e fórmulas de Alquimia de Sangue-ralo com `ingredients`, `process` e `amalgam`.
- [x] 2.3 Implementar tabela de resolução de aliases em `disciplines.ts` ou `build-info.ts` para garantir retrocompatibilidade com testes que usam nomes legados.
- [x] 2.4 Atualizar `web/src/data/disciplines.ts` com o novo catálogo consolidado.

## 3. Alinhamento de Clãs, Predadores e Documentação

- [x] 3.1 Aplicar correções de paridade em `web/src/data/clans.ts` e `web/src/data/predators.ts` se identificadas divergências.
- [x] 3.2 Adicionar seção de referências oficiais e fontes canônicas no `web/README.md`.

## 4. Verificação e Testes

- [x] 4.1 Executar a suíte de testes Vitest (`pnpm test`) e garantir 253+ testes passando.
- [x] 4.2 Executar verificação de tipos (`pnpm typecheck`) e lint/formatação com Ultracite (`pnpm check`).
