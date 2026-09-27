## 1. Catálogo e painel lateral

- [x] 1.1 Em `web/src/data/trait-info.ts`, acrescentar ao tipo `MeritInfo` o 5º item `niveis` (5 textos, um por ponto) e escrevê-los para cada mérito de `MERIT_INFO`, com constantes compartilhadas entre as grafias duplicadas (Refúgio, Máscara, Lacaios)
- [x] 1.2 Em `features/info/build-info.ts`, `meritInfo` usa os níveis do catálogo e cai para `MERIT_SCALE_V`/`MERIT_SCALE_D` fora do catálogo
- [x] 1.3 Testes em `features/info/build-info.test.ts`: Recursos 3 com textos próprios e "•••" destacado; "Arsenal" fora do catálogo com escala genérica; Defeito SR "Inimigo" com níveis de Inimigo

## 2. Painel Vantagens & Defeitos

- [x] 2.1 Criar `web/src/features/sheet/merits-panel.tsx`: duas colunas (`autoFit`), Vantagens (`vantagem`, `qualidade-sr`) e Defeitos (`defeito`, `defeito-sr`), ignorando nomes vazios, com título/linhas nas mesmas classes Tailwind do `TraitGrid`
- [x] 2.2 Nome como `InfoTrigger` com `{ kind: "merit", key, tipo, pontos }`; `DotRating` editável gravando `meritos[i].pontos` pelo índice original via `patchSheet`, preservando `tipo`, `nome` e `origem`
- [x] 2.3 Coluna vazia mostra "Nenhuma vantagem." / "Nenhum defeito." em texto suave
- [x] 2.4 Testes do painel: méritos nas colunas certas (incluindo SR), editar pontos persiste, coluna vazia, clique no nome abre o painel lateral sem mudar pontos

## 3. Aba Registros

- [x] 3.1 Remover `vantagens` de `LONG_FIELDS` e de `TextFieldKey` em `data/fields.ts` (e qualquer uso órfão)
- [x] 3.2 Em `registros-tab.tsx`, renderizar `MeritsPanel` dentro de um `Panel` com título "Vantagens & Defeitos" logo abaixo de Princípios/Perdição, antes de História
- [ ] 3.3 Rodar testes e lint (`ultracite check`) e conferir visualmente contra a imagem de referência (Recursos 3, Influência 2, Máscara 2, Inimigo 2)
