/** Postgres: violação de chave única ou primária */
const UNIQUE_VIOLATION = "23505";

/** O Drizzle embrulha o erro do `pg` em `cause`. */
export function isUniqueViolation(error: unknown): boolean {
  for (let e = error; e; e = (e as { cause?: unknown }).cause) {
    if ((e as { code?: unknown }).code === UNIQUE_VIOLATION) {
      return true;
    }
  }
  return false;
}
