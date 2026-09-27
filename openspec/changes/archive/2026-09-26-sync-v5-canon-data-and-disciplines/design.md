## Context

O catálogo de dados do sistema em `web/src/data/` foi inicialmente portado de protótipos em JavaScript e atualizado parcialmente. O arquivo `web/src/data/disciplines.ts` acumula cerca de 1.783 linhas com poderes canônicos misturados a duplicações legadas (ex.: nomes repetidos com grafias alternativas para o mesmo efeito mecânico). 

A comunidade oficial de V5 para Foundry VTT mantém compêndios padronizados no padrão da Galápagos Jogos (`pixshadoow-beep/vtm5e-compendio-ptbr` e `WoD5E-Developers/wod5e`). Utilizaremos esses dados para sanear, enriquecer e auditar todo o conjunto de dados do projeto.

## Goals / Non-Goals

**Goals:**
- Sanear `web/src/data/disciplines.ts`, eliminando duplicações e padronizando todas as entradas com as regras e textos canônicos do V5 PT-BR.
- Fornecer suporte completo a metadados mecânicos: `cost`, `rouse`, `duration`, `dicePool`, `system`, `amalgam`, `prerequisite`, `ingredients` e `process`.
- Manter compatibilidade reversa com testes unitários (como `build-info.test.ts`) por meio de resolução de aliases canônicos.
- Auditar e garantir paridade nos dados de clãs (`web/src/data/clans.ts`) e tipos de predador (`web/src/data/predators.ts`).
- Atualizar o `web/README.md` com as referências técnicas e canônicas oficiais.
- Manter 100% de aprovação na suíte de testes Vitest (253 testes).

**Non-Goals:**
- Não introduzir regras ou poderes de edições anteriores (V20, Revised) ou da versão de LARP (*Laws of the Night*).
- Não alterar a arquitetura da UI do assistente de criação (`wizard`) ou da ficha (`sheet`).

## Decisions

### Decisão 1: Fonte da verdade baseada no compêndio oficial PT-BR (`vtm5e-compendio-ptbr`)
- **Escolha**: Usar os dados brutos de `disciplinas.json` do compêndio brasileiro do Foundry VTT como referência primária de texto, testes de sistema, custos e durações.
- **Alternativas consideradas**:
  - *Manter compilação manual a partir de PDFs*: Muito propenso a erros de digitação e formatação inconsistente.
  - *Usar Laws of the Night (One World of Darkness)*: Descartado por ser específico de LARP/Mind's Eye Theatre, com mecânicas incompatíveis com mesa.
- **Justificativa**: O compêndio traz 367 poderes, rituais e fórmulas já formatados conforme as regras oficiais da Galápagos Jogos e do sistema `wod5e`.

### Decisão 2: Desduplicação com retrocompatibilidade por Aliases
- **Escolha**: Remover poderes duplicados das listas principais de exibição (`POWERS`), mantendo um dicionário de redirecionamento ou resolução em `disciplines.ts` para que buscas por nomes legados (ex.: "Sussurro Ferino", "Toque Letal") encontrem o poder canônico correspondente ("Sussurros Ferais", "Corpo Letal").
- **Justificativa**: Evita poluir a seleção de poderes no assistente de criação com opções duplicadas, sem quebrar testes existentes que verificam chaves legadas.

### Decisão 3: Documentação explícita de referências no README
- **Escolha**: Adicionar uma seção "Referências e Dados Canônicos" no `web/README.md` listando os repositórios oficiais e compêndios utilizados.
- **Justificativa**: Facilita manutenção futura e esclarece a proveniência dos textos do sistema de acordo com as diretrizes do *Dark Pack*.

## Risks / Trade-offs

- **[Risco] Incompatibilidade com asserções exatas de testes**: Testes como `build-info.test.ts` verificam se `Sussurro Ferino` extrai a rolagem `Manipulação + Animalismo vs. resistência do animal`.
  - *Mitigação*: Garantir que aliases legados necessários para testes permaneçam mapeados ou resolvam para os dados esperados.
- **[Risco] Divergência de nomes de disciplinas em clãs ou predadores**: Nomes como "Domínio" vs "Dominação" ou "Protean" vs "Proteanismo".
  - *Mitigação*: Preservar e validar as funções `canonicalDiscipline` e `sameDiscipline` já existentes no projeto, cobrindo todas as variantes.
