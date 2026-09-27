## Why

O standalone de referência publicou um documento só das Disciplinas ("Mudanças — Disciplinas", que substitui as versões anteriores da seção 5). A estrutura em dois slots 2+1 filtrados pelo clã já vem da change `sync-standalone-round-2`. O que falta é a regra do livro "cada ponto = um poder": hoje o passo 5 deixa marcar todos os poderes até o nível. Faltam também os atalhos de consulta que a referência pôs no passo: descrição do poder com a rolagem e a tabela de Geração × Potência.

## What Changes

- **Limite de poderes = pontos**: a Disciplina de 2 pontos aceita 2 poderes e a de 1 ponto aceita 1. Ao tentar marcar além do limite, aparece o toast info "Limite de poderes" ("<Disciplina> tem N pontos: só N poderes. Tire um para trocar."). Sem pontos marcados, aparece o toast info "Sem pontos" ("Marque os pontos da Disciplina antes de escolher poderes."). Desmarcar continua sempre permitido.
- **Corte ao inverter 2/1**: quando a distribuição muda, cada slot perde os poderes acima do novo nível e os que passam do novo limite (mantém os de menor nível, na ordem gravada).
- **Dica com contador** acima dos poderes: "Escolha N poder(es) (um por ponto) · X/N escolhidos. Toque no nome para ver a descrição."; sem pontos: "Marque os pontos primeiro: cada ponto dá direito a um poder. Toque no nome para ver a descrição."
- **Nome do poder clicável**: o nome dentro do cartão abre o painel lateral do poder. O resto do cartão continua incluindo/removendo o poder. No hover, o nome fica Blood; no cartão selecionado (fundo tinta), Ember.
- **Painel do poder com Rolagem**: a lista passa a ser "Rolagem, custo e duração". A rolagem é extraída da descrição do catálogo quando ela cita "Atributo + Disciplina" (com "vs."/"contra" opcional) e sai da descrição. Sem citação: "Sem teste: efeito passivo, sempre ativo." (duração Passiva) ou "Sem teste: o efeito acontece ao ativar.".
- **Geração clicável**: novo painel "Geração" com a tabela Geração × Potência de Sangue × categoria (Sangue-ralo, Neófito, Ancilla, Ancião, Ancião poderoso, Matusalém), marcando a Geração do personagem. Gatilhos: o rótulo "Geração" no passo 1 e o rótulo "Geração 12ª" no bloco de Potência de Sangue do passo 5.
- **Potência de Sangue clicável no passo 5**: o rótulo do bloco abre o painel de Potência de Sangue, como na ficha em jogo.
- **Validação**: o passo 5 fica inválido quando um slot tem mais poderes que pontos ("Escolha no máximo N poderes em <Disciplina>"). **BREAKING** para fichas salvas com mais poderes que pontos: "Refazer" leva ao passo 5.
- Fora do escopo: reescrever o catálogo `POWERS` com descrição completa e rolagem de todos os poderes, e exigir o número exato de poderes (o limite é máximo).

## Capabilities

### New Capabilities
<!-- nenhuma -->

### Modified Capabilities
- `character-wizard`: o passo 5 ganha o limite de poderes por ponto, o corte ao inverter 2/1, a dica com contador, o nome do poder e a Geração como gatilhos, e a regra de validação de excesso de poderes.
- `trait-info`: o conteúdo do Poder ganha Rolagem, há um novo tipo de conteúdo Geração, e a lista de gatilhos ganha o nome do poder no passo 5, o rótulo da Geração (passos 1 e 5) e a Potência de Sangue do passo 5.

## Impact

- Depende de `sync-standalone-round-2` (as deltas partem do texto dela para o passo 5 e o painel). Arquivar aquela change antes desta.
- Regras: `rules/wizard.ts` (limite, corte ao redistribuir, texto da dica), `rules/generation.ts` (categoria da Geração).
- Painel: `features/info/build-info.ts` (rolagem no ramo `poder`, novo ramo `geracao`).
- UI: `features/wizard/step5-disciplines.tsx` (cartão de poder, toasts, dica, bloco de Potência) e `features/wizard/step1-clan.tsx` (rótulo da Geração).
- Schema: `features/wizard/schema.ts` (passo 5 rejeita excesso de poderes).
- Testes: `rules.test.ts`, `build-info.test.ts`, `schema.test.ts`, `wizard.test.tsx`.
