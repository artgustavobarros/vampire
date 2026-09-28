/** Postgres: violação de chave única ou primária */
const UNIQUE_VIOLATION = "23505";

/**
 * O nome da constraint violada, se o erro for de unicidade; `""` quando o
 * driver não informa. O Drizzle embrulha o erro do `pg` em `cause`.
 */
export function uniqueViolationConstraint(error: unknown): string | null {
  for (let e = error; e; e = (e as { cause?: unknown }).cause) {
    const { code, constraint } = e as { code?: unknown; constraint?: unknown };
    if (code === UNIQUE_VIOLATION) {
      return typeof constraint === "string" ? constraint : "";
    }
  }
  return null;
}

export function isUniqueViolation(error: unknown): boolean {
  return uniqueViolationConstraint(error) !== null;
}
