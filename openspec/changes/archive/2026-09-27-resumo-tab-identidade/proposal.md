## Why

A aba "Registros" já concentra o retrato do personagem (Perdição, Vantagens & Defeitos, História, Convicções, Potência de Sangue, biografia), mas o nome, clã, conceito e demais dados de identificação ficam no topo da aba Ficha, misturados com a parte jogável (traços, trilhas, Fome). Renomear a aba para "Resumo" e levar para lá o painel de identificação deixa a Ficha focada no que se usa durante a cena e junta num só lugar quem o personagem é.

## What Changes

- A aba "Registros" passa a se chamar **"Resumo"** no menu, no cabeçalho e na URL (`/ficha/resumo`). **BREAKING** (URL): o endereço `/ficha/registros` deixa de ser uma aba; ele passa a redirecionar para `/ficha/resumo`, para não quebrar links salvos.
- O painel de identificação (Nome, Conceito, Crônica, Predador, Ambição, Clã, Senhor, Desejo, Geração) sai do topo da aba Ficha e passa a ser o primeiro bloco da aba Resumo, com o mesmo visual e os mesmos campos editáveis.
- A aba Ficha passa a abrir direto no bloco Atributos/Habilidades.
- O resto da aba Resumo (textos longos, Vantagens & Defeitos, História, Convicções, Potência de Sangue, biografia) não muda de conteúdo nem de ordem.
- Textos das specs que citam "aba Registros" passam a dizer "aba Resumo".

## Capabilities

### New Capabilities
<!-- nenhuma -->

### Modified Capabilities
- `character-sheet`: a aba "Registros" vira "Resumo" (menu, cabeçalho, URL e redirecionamento do endereço antigo); o painel de identificação sai de "Aba Ficha" e entra no topo de "Aba Resumo"; o painel "Vantagens & Defeitos" passa a referir-se à aba Resumo.
- `trait-info`: os gatilhos do painel de mérito e de Potência de Sangue passam a ser descritos na aba Resumo.
- `character-wizard`: a Perdição editada pelo jogador passa a ser descrita como editada na aba Resumo.

## Impact

- `web/src/features/sheet/tabs.ts` — id/rótulo da aba.
- `web/src/features/sheet/tab-content.tsx` e `web/src/features/sheet/tabs/registros-tab.tsx` → `resumo-tab.tsx` (`ResumoTab`).
- `web/src/features/sheet/tabs/ficha-tab.tsx` — remove o painel de identificação e o import de `IDENTITY_FIELDS` se não for mais usado.
- `web/src/routes/ficha.$aba.tsx` — redirecionamento de `registros` para `resumo`.
- Testes da aba Ficha e novos testes da aba Resumo.
- Sem mudança de API, de modelo de dados (`sheet`) nem de dependências.
