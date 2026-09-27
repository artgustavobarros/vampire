/**
 * Token da sessão no localStorage. Tudo em try/catch: modo privado ou
 * armazenamento bloqueado não pode quebrar a interface, e aí o token fica
 * só em memória.
 */
const TOKEN_KEY = "vtm5.token";

/** Usado só quando o localStorage lança exceção. */
let fallback: string | null = null;

export function readToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return fallback;
  }
}

export function writeToken(token: string): void {
  fallback = token;
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch {
    // armazenamento indisponível: segue só em memória
  }
}

export function clearToken(): void {
  fallback = null;
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch {
    // idem
  }
}
