/** O que sobra para o sufixo numérico dentro dos 20 caracteres. */
const BASE_MAX = 17;
const BASE_MIN = 3;
const MARKS = /\p{M}/gu;
const NOT_ALNUM = /[^a-z0-9]+/g;
const EDGE_UNDERSCORES = /^_+|_+$/g;
const TRAILING_UNDERSCORES = /_+$/;
const STARTS_WITH_LETTER = /^[a-z]/;

/**
 * Nome de usuário a partir do nome da pessoa, no formato de `USERNAME_FORMAT`
 * e só com `a-z`, `0-9` e `_` ("Vitória Salles" → `vitoria_salles`). Colisões
 * ficam com `UsersService.freeUsername`.
 */
export function slugUsername(name: string): string {
  let slug = name
    .normalize("NFD")
    .replace(MARKS, "")
    .toLowerCase()
    .replace(NOT_ALNUM, "_")
    .replace(EDGE_UNDERSCORES, "");
  if (!slug) {
    slug = "jogador";
  } else if (!STARTS_WITH_LETTER.test(slug)) {
    slug = `u${slug}`;
  }
  return slug
    .slice(0, BASE_MAX)
    .replace(TRAILING_UNDERSCORES, "")
    .padEnd(BASE_MIN, "_");
}
