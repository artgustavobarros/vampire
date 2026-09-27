## 1. Remoção de `rich-text.tsx` e Simplificação de Renderização

- [x] 1.1 Remover `web/src/features/info/rich-text.tsx` e `web/src/features/info/rich-text.test.tsx`.
- [x] 1.2 Atualizar `web/src/features/info/info-sheet.tsx` para renderizar `info.desc`, `info.nota`, `l.txt` e células com tags nativas e `whitespace-pre-line`.
- [x] 1.3 Remover sintaxe de itálico `*sex appeal*` e comentário de formatação em `web/src/data/trait-info.ts`.

## 2. Saneamento e Correções em `trait-info.ts`

- [x] 2.1 Adicionar chaves canônicas (`Dominação`, `Proteanismo`, `Alquimia de Sangue-ralo`) a `DISC_INFO` em `trait-info.ts`.
- [x] 2.2 Corrigir erros ortográficos em `ATTR_INFO` e `TRAIT_INFO` em `trait-info.ts`.

## 3. Catálogo Canônico de Vantagens e Defeitos (`data/merits.ts`)

- [x] 3.1 Criar `web/src/data/merits.ts` com as 16 Qualidades de Sangue-ralo (`THIN_BLOOD_MERITS`) e 14 Defeitos de Sangue-ralo (`THIN_BLOOD_FLAWS`) do compêndio oficial V5 PT-BR.
- [x] 3.2 Catalogar as Vantagens e Defeitos comuns com pontos fixos (`COMMON_MERITS`, `COMMON_FLAWS`) e os Antecedentes com progressão 1 a 5 (`BACKGROUNDS`).
- [x] 3.3 Implementar função de busca e resolução `findMerit(name)` em `data/merits.ts`.
- [x] 3.4 Conectar `findMerit` no painel de informações em `web/src/features/info/build-info.ts`.

## 4. Integração no Assistente (Passo 7 - Méritos)

- [x] 4.1 Adicionar `<datalist>` no Passo 7 (`step7-merits.tsx`) com sugestões dinâmicas baseadas no tipo de mérito selecionado.
- [x] 4.2 Implementar autopreenchimento de pontuação para méritos de custo fixo ao selecionar uma sugestão canônica.

## 5. Verificação e Testes

- [x] 5.1 Executar a suíte de testes Vitest (`pnpm test`) garantindo todas as suítes verdes.
- [x] 5.2 Executar checagem de tipos (`pnpm typecheck`) e verificação do Ultracite (`pnpm check`).
