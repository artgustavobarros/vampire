## Why

A maioria das perícias (skills) no catálogo `SKILL_INFO` (`web/src/data/trait-info.ts`) contém descrições sumárias e níveis genéricos de placeholder, enquanto apenas "Armas Brancas" e "Armas de Fogo" possuem o texto descritivo e os 5 níveis detalhados baseados no livro oficial de Vampiro: A Máscara 5ª Edição (V5). Isso prejudica a experiência no painel lateral de consulta de traços da ficha de personagem, que deve fornecer explicações ricas sobre o que cada perícia e pontuação representam no sistema.

## What Changes

- Tradução e inclusão do conteúdo oficial das perícias do livro de regras V5 (conforme fornecido em `skills.pdf` e referenciado no livro base V5) para o português em `SKILL_INFO` (`web/src/data/trait-info.ts`):
  - Descrição imersiva e mecânica completa de cada perícia.
  - Lista canônica de especialidades sugeridas pelo livro.
  - Texto detalhado para cada um dos 5 níveis (• a •••••), ilustrando o grau de competência do personagem.
- Cobertura completa das 27 perícias distribuídas entre Físicas, Sociais e Mentais:
  - **Físicas**: Armas Brancas, Armas de Fogo, Atletismo, Briga, Condução, Furtividade, Ladroagem, Ofícios, Sobrevivência.
  - **Sociais**: Empatia com Animais, Etiqueta, Intimidação, Liderança, Manha, Performance, Persuasão, Sagacidade, Subterfúgio.
  - **Mentais**: Ciência, Erudição, Finanças, Investigação, Medicina, Ocultismo, Percepção, Política, Tecnologia.
- Ajuste e revisão ortográfica/tipográfica das entradas já existentes ("Armas Brancas" e "Armas de Fogo") para manter padrão consistente de formatação e pontuação.

## Capabilities

### New Capabilities
<!-- none -->

### Modified Capabilities
- `trait-info`: A seção de perícias (`SKILL_INFO`) passa a conter o catálogo completo oficial de descrições, especialidades sugeridas e os 5 níveis detalhados traduzidos para o português para todas as 27 perícias do V5.

## Impact

- `web/src/data/trait-info.ts`: Atualização de `SKILL_INFO` com os textos completos das perícias.
- `web/src/features/info/build-info.test.ts`: Verificação dos testes do painel de informações para assegurar integridade dos níveis e especialidades.
