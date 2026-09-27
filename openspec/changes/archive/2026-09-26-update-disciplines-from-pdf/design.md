## Context

O arquivo `web/src/data/disciplines.ts` contém a definição de `DISCIPLINES` e o dicionário `POWERS` com os modelos de poderes (`PowerTemplate`) usados no assistente de criação (`character-wizard`), na ficha do personagem (`character-sheet`) e no painel de informações (`trait-info`).

Atualmente, muitas descrições estão excessivamente curtas ou desatualizadas em relação ao livro oficial de regras V5 (Vampiro: A Máscara 5ª Edição). O usuário forneceu o livro de regras em PDF (`disciplines and powers.pdf`), que detalha:
1. Animalismo (pp. 244-248)
2. Auspícios (pp. 248-252)
3. Celeridade (pp. 252-255)
4. Dominação (pp. 255-258)
5. Fortitude (pp. 258-260)
6. Ofuscação (pp. 260-263)
7. Potência (pp. 263-266)
8. Presença (pp. 266-269)
9. Protean (pp. 269-271)
10. Feitiçaria de Sangue e Rituais (pp. 271-282)
11. Alquimia de Sangue-fraco (pp. 282-287)

Além destas, o sistema suporta Oblívio (suplementos V5 posteriores).

## Goals / Non-Goals

**Goals:**
- Extrair e traduzir fielmente do PDF oficial todos os poderes, amálgamas, rituais e fórmulas para o português brasileiro (PT-BR).
- Enriquecer as descrições com narrativa imersiva e regras de sistema mecânicas completas.
- Formatar as rolagens de sistema para que a regex de `splitRoll` em `build-info.ts` capture perfeitamente a parada de dados (ex.: `Manipulação + Animalismo vs. Autocontrole + Dissimulação`) para exibição no painel de detalhes.
- Garantir interoperabilidade de nomes entre clãs, predadores e catálogo (suporte simultâneo a "Dominação"/"Domínio", "Protean"/"Proteanismo", "Alquimia de Sangue-fraco"/"Alquimia de Sangue-ralo").
- Preservar os poderes existentes de Oblívio, elevando a qualidade de suas descrições.

**Non-Goals:**
- Alterar componentes visuais de UI ou criar novas telas.
- Remover disciplinas ou poderes de suplementos já integrados que não estejam no PDF base (como Oblívio).

## Decisions

### Decisão 1: Aliasing de Chaves em `POWERS`
- **Contexto**: `clans.ts` utiliza nomes como `"Dominação"` e `"Proteanismo"`, enquanto referências anteriores usavam `"Domínio"` e `"Protean"`.
- **Decisão**: Exportar tanto as chaves oficiais quanto aliases de compatibilidade em `POWERS` (ex.: `POWERS["Domínio"] = POWERS["Dominação"]`, `POWERS["Proteanismo"] = POWERS["Protean"]`, `POWERS["Alquimia de Sangue-ralo"] = POWERS["Alquimia de Sangue-fraco"]`).
- **Alternativas consideradas**: Modificar `clans.ts` e `predators.ts` exclusivamente. Rejeitado isoladamente para evitar qualquer regressão em fichas persistidas no localStorage do usuário que possam ter salvo uma ou outra grafia.

### Decisão 2: Formatação de Paradas de Dados para `splitRoll`
- **Contexto**: A função pura `splitRoll` usa a regex `/[A-ZÁ-Ú][a-zà-ú]+ \+ [A-ZÁ-Ú][a-zà-ú]+(?: de [A-ZÁ-Ú][a-zà-ú]+)?(?: (?:vs\.|contra) [^.;]+)?/` para separar a rolagem do texto descritivo.
- **Decisão**: Em poderes ativos que envolvem testes, formular a frase com a sintaxe exata reconhecida (ex.: `Rolagem: Carisma + Animalismo vs. Vigor + Determinação.` ou `Teste: Força + Potência contra Destreza + Atletismo.`). Em poderes passivos ou automáticos, omitir para que `splitRoll` exiba a mensagem padrão ("Sem teste: efeito passivo, sempre ativo." ou "Sem teste: o efeito acontece ao ativar.").
- **Alternativas consideradas**: Alterar a interface `PowerTemplate` para adicionar um campo `roll?: string`. Rejeitado para preservar compatibilidade com componentes que já consom `description`.

### Decisão 3: Rituais de Feitiçaria de Sangue e Fórmulas de Alquimia
- **Contexto**: No PDF, Feitiçaria de Sangue inclui poderes base e uma vasta seleção de Rituais (níveis 1 a 5). Alquimia possui fórmulas específicas de níveis 1 a 5.
- **Decisão**: Catalogar tanto os poderes base quanto os rituais canônicos sob a entrada de "Feitiçaria de Sangue", com nível correspondente e indicação explícita de `[Ritual]` no nome/descrição, e todas as fórmulas de Alquimia sob "Alquimia de Sangue-fraco".

## Risks / Trade-offs

- **[Risco] Fichas antigas no localStorage com nomes de poderes antigos**: Se um poder antigo teve o nome ajustado para o canônico oficial (ex.: de "Sussurro Ferino" para "Sussurros Ferais"), o painel lateral pode não encontrar a chave exata em `POWERS`.
  - **Mitigação**: `powerInfo` em `build-info.ts` já prevê fallback elegante (`target.desc || "Poder fora do catálogo. A descrição é a que você registrou."`), não quebrando a interface. Além disso, nomes que já eram canônicos são mantidos ou mapeados.
- **[Risco] Tamanho do arquivo `disciplines.ts`**: Adicionar dezenas de poderes e rituais detalhados aumenta o tamanho do arquivo.
  - **Mitigação**: O arquivo é TypeScript estático empacotado no bundle da aplicação web, sem impacto perceptível de performance em tempo de execução, beneficiando diretamente a experiência do usuário com dados completos offline.
