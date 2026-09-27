## Context

O assistente de criação e a ficha de personagem utilizam o tipo `Merit` (`{ nome: string; pontos: number; tipo: MeritKind }`). Atualmente, no Passo 7, o usuário precisa digitar manualmente o nome em um campo aberto de texto e selecionar os pontos de 1 a 5, sem qualquer indicação de quais opções são canônicas, quais são os custos fixos oficiais do livro básico ou quais opções exclusivas pertencem a Sangue-ralo (16 qualidades e 14 defeitos).

Além disso, o painel lateral de consulta (`InfoSheet`) dependia do componente customizado `rich-text.tsx`, que implementava uma máquina de regex para markdown com negrito, itálico e parágrafos. Como todo o catálogo agora utiliza strings limpas e a única ocorrência de formatação itálica era a palavra isolada "*sex appeal*", o parser tornou-se desnecessário. Por fim, `DISC_INFO` em `trait-info.ts` não possuía mapeamento para os nomes canônicos "Dominação", "Proteanismo" e "Alquimia de Sangue-ralo", gerando mensagens incorretas de "fora do catálogo".

## Goals / Non-Goals

**Goals:**
- Criar `web/src/data/merits.ts` com o catálogo canônico completo de Qualidades/Defeitos de Sangue-ralo e Vantagens/Defeitos/Antecedentes gerais derivados de `vantagens-e-defeitos.json`.
- Integrar `findMerit(name)` no painel de informações (`build-info.ts`) para que qualquer mérito canônico seja detalhado com regras oficiais.
- Fornecer sugestões (`<datalist>`) filtradas por tipo no Passo 7 do assistente e autopreencher custos fixos de méritos.
- Saneamento ortográfico de `trait-info.ts` e normalização das chaves canônicas de `DISC_INFO`.
- Remover `rich-text.tsx` e `rich-text.test.tsx`, substituindo por renderização nativa direta com parágrafos e `whitespace-pre-line`.

**Non-Goals:**
- Modificar o tipo estrutural `Merit` na ficha salva (mantém retrocompatibilidade total com `{ nome, pontos, tipo }`).
- Impedir que o usuário digite vantagens personalizadas (o input continua aberto caso queira algo fora do compêndio).

## Decisions

### 1. Estrutura de dados em `web/src/data/merits.ts`
- **Decisão:** Separar as coleções por categoria semântica e exportar dicionários e listas tipadas:
  - `THIN_BLOOD_MERITS`: 16 qualidades de sangue-ralo.
  - `THIN_BLOOD_FLAWS`: 14 defeitos de sangue-ralo.
  - `COMMON_MERITS`: qualidades físicas/mentais/sociais comuns (ex.: Estômago de Ferro [3], Bonito [2], Deslumbrante [4]).
  - `COMMON_FLAWS`: defeitos com custos fixos (ex.: Vegano [2], Feio [2], Monstruoso [4]).
  - `BACKGROUNDS`: antecedentes com progressão de 1 a 5 pontos (Aliados, Contatos, Fama, Influência, Mawla, Rebanho, Recursos, Refúgio, Lacaios, Máscara, Status).
  - Exportar helper `findMerit(name: string)` que normaliza acentuação e caixa para localizar a regra correspondente.
- **Alternativa descartada:** Manter tudo em uma única lista desestruturada de strings sem indicação de pontuação ou restrição de clã.

### 2. Remoção de `rich-text.tsx`
- **Decisão:** Deletar `rich-text.tsx` e `rich-text.test.tsx`. Em `info-sheet.tsx`, renderizar o texto descritivo com elementos `<p>` nativos aplicando `whitespace-pre-line` para preservar quebras de parágrafo naturais sem regex intermediária.
- **Motivação:** Zero dependências de regex de markdown, melhor performance de renderização e código mais limpo.

### 3. Sugestões e preenchimento de pontos no Passo 7
- **Decisão:** Utilizar `<datalist id="merit-suggestions-${tipo}">` nativo do HTML acoplado ao `<Input {...field} list={...} />`. Ao mudar o valor do nome, se for detectado um mérito canônico de custo fixo (ex.: Estômago de Ferro), o formulário dispara `setValue("meritos.${i}.pontos", fixo)`.
- **Motivação:** Acessível, leve, compatível com teclado e sem necessidade de bibliotecas pesadas de combobox ou alteração drástica da UI.

## Risks / Trade-offs

- **[Risco]** Quebra de testes existentes que esperavam renderização via `RichText`:
  - **Mitigação:** Os testes do assistente e regras validam valores de formulário e acessibilidade; remover `rich-text.test.tsx` e garantir que `info-sheet.tsx` renderize os nós de texto normalmente mantém todos os 253 testes intactos.
- **[Risco]** Variações de escrita de méritos na ficha (ex.: "Recursos (herança)"):
  - **Mitigação:** `findMerit` e `meritInfo` preservam a lógica de resolução por prefixo e limpeza de detalhes entre parênteses.
