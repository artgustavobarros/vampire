## Context

No aplicativo Vampire V5, o painel lateral de informações (`Sheet`) apresenta o detalhamento de cada traço da ficha de personagem quando o usuário clica sobre seu nome. O arquivo `web/src/data/trait-info.ts` armazena o catálogo `SKILL_INFO` no formato `Record<string, readonly [string, string, readonly string[]]>`, onde cada tupla contém:
1. `description`: texto geral explicativo da perícia (suporta quebras `\n`, parágrafos `\n\n` e formatação inline `*itálico*` / `**negrito**`).
2. `specialties`: string com a lista de especialidades canônicas sugeridas, separadas por vírgula.
3. `levels`: array com exatamente 5 strings correspondentes aos níveis de 1 a 5 pontos (• a •••••).

Atualmente, apenas "Armas Brancas" e "Armas de Fogo" possuem textos detalhados derivados do livro de regras (ainda assim com alguns erros de digitação pontuais). As demais 25 perícias utilizam resumos telegráficos de placeholder criados durante o desenvolvimento inicial. O usuário forneceu `skills.pdf` (páginas do livro de regras V5) e o livro oficial completo `Vampire the Masquerade.pdf` está presente na mesma pasta de downloads como referência completa das páginas 159 a 174.

## Goals / Non-Goals

**Goals:**
- Traduzir com fidelidade ao português brasileiro todas as 27 perícias do livro de regras oficial V5, adaptando descrições, especialidades sugeridas e os 5 níveis descritivos de competência (• a •••••).
- Respeitar a terminologia oficial brasileira estabelecida de Vampiro: A Máscara 5ª Edição (ex.: *Parada de Dados*, *Teste Simples*, *Conflito*, *Força de Vontade*, *Vitalidade*, *Máscara*, *Membros*, *Caimitas*, *Predador*).
- Revisar e corrigir erros tipográficos existentes em "Armas Brancas" e "Armas de Fogo" (ex.: "arrmas", "Improvisaddas", "garnadas", "faer").
- Manter compatibilidade com a tipagem estrita TypeScript (`readonly [string, string, readonly string[]]`) e garantir que a suíte de testes (`build-info.test.ts`) continue executando com 100% de aprovação.

**Non-Goals:**
- Alterar componentes React ou a lógica de renderização do painel (`web/src/features/info/build-info.ts`, `info-sheet.tsx` ou `rich-text.tsx`), pois a camada de visualização já suporta dinamicamente qualquer texto e quebra de parágrafo.
- Modificar atributos, disciplinas ou méritos neste ciclo de mudança.

## Decisions

### Decisão 1: Tradução fiel ao livro de regras oficial V5
- **Escolha**: Usar a estrutura canônica de cada perícia do V5 (Capítulo de Personagens, páginas 159 a 174):
  - Descrição detalhada: o que a perícia engloba, quando é testada e regras pontuais (ex.: Atletismo como substituto em combate físico sem infligir dano; Ciências/Erudição/Ofícios exigindo especialidade).
  - Lista de especialidades oficiais do livro de regras para cada uma das 27 perícias.
  - Progressão de 1 a 5 pontos (• a •••••) ilustrando a experiência de vida e capacidade do personagem.
- **Alternativas consideradas**:
  - *Manter resumos curtos*: Não atende ao pedido do usuário de ler e aplicar as skills traduzidas do livro.
  - *Tradução mecânica direta sem adaptação*: O V5 possui tom narrativo e descrições com humor ácido ou gírias (como o exemplo da Winchester ou da Segunda Inquisição). A tradução deve manter essa vivacidade e estilo, alinhando com a tradução oficial brasileira.

### Decisão 2: Correção tipográfica nas perícias existentes
- As entradas existentes "Armas Brancas" e "Armas de Fogo" já continham a tradução de parte do livro, mas apresentavam erros de digitação perceptíveis. Elas serão refinadas para manter o padrão profissional do catálogo.

### Decisão 3: Estrutura de dados imutável e testes de contrato
- Manter o tipo `readonly [string, string, readonly string[]]` em `SKILL_INFO`.
- Cada array de níveis deve ter exatamente 5 itens não vazios para cada uma das 27 chaves de perícias reconhecidas pelo sistema (`SKILL_GROUPS`).

## Risks / Trade-offs

- **Extensão do texto no painel mobile**:
  - *Risco*: Textos descritivos mais longos aumentam a rolagem vertical no componente `Sheet`.
  - *Mitigação*: O painel já possui `overflow-y-auto` com rolagem suave e tipografia legível (`Cormorant 18px` para descrição e lista organizada com espaçamento adequado).
- **Consistência de nomes de especialidades**:
  - *Risco*: Nomes de especialidades diferirem das opções pré-selecionadas no assistente de criação de personagens.
  - *Mitigação*: Manter especialidades em formato de lista textual separada por vírgulas, alinhada com as recomendações do livro e permitindo que o jogador crie ou selecione qualquer especialidade livremente.
