import { exampleSheet } from "#/data/example-sheet";
import { flushSheet } from "#/stores/character-store";
import { usePlayerStore } from "#/stores/player-store";
import {
  ApiError,
  getSheet,
  login,
  onUnauthorized,
  putSheet,
  setToken,
  signup,
} from "./api";
import { settings } from "./settings";
import { apiError, notify } from "./toast";

export interface AuthInput {
  email: string;
  mode: "login" | "signup";
  name?: string;
  password: string;
  password2?: string;
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD = 6;
/** quanto o "Sair" espera as mudanças pendentes irem para a API */
const LOGOUT_WAIT = 2000;

/** Mesmas regras e mensagens da API, sem ida e volta. */
function validate(input: AuthInput, email: string): string | null {
  const { password } = input;
  if (!email) {
    return "Informe o e-mail.";
  }
  if (!EMAIL.test(email)) {
    return "E-mail inválido.";
  }
  if (!password) {
    return "Informe a senha.";
  }
  if (input.mode === "login") {
    return null;
  }
  if (!(input.name ?? "").trim()) {
    return "Informe o nome.";
  }
  if (password.length < MIN_PASSWORD) {
    return "A senha precisa ter pelo menos 6 caracteres.";
  }
  if (password !== input.password2) {
    return "As senhas não conferem.";
  }
  return null;
}

/** Entra ou cria a conta na API. Mostra os erros como toast e devolve se entrou. */
export async function authenticate(
  input: AuthInput,
  options: { exampleData: boolean } = { exampleData: settings.dadosDeExemplo }
): Promise<boolean> {
  const email = input.email.trim().toLowerCase();
  const invalid = validate(input, email);
  if (invalid) {
    notify(invalid);
    return false;
  }
  const { password } = input;
  try {
    let sheet: unknown = null;
    if (input.mode === "signup") {
      const name = (input.name ?? "").trim();
      const res = await signup({ email, name, password });
      setToken(res.accessToken);
      if (options.exampleData) {
        ({ sheet } = await putSheet(exampleSheet()));
      }
      usePlayerStore.getState().login(res.user, sheet);
      return true;
    }
    const res = await login({ email, password });
    setToken(res.accessToken);
    ({ sheet } = await getSheet());
    usePlayerStore.getState().login(res.user, sheet);
    return true;
  } catch (err) {
    setToken(null);
    // 4xx é erro do formulário, com a mensagem pronta da API
    if (err instanceof ApiError && err.status < 500) {
      notify(err.message);
    } else {
      apiError(err);
    }
    return false;
  }
}

function endSession(): void {
  setToken(null);
  usePlayerStore.getState().logout();
}

/** Envia as mudanças pendentes (sem esperar mais que `LOGOUT_WAIT`) e sai. */
export async function logout(): Promise<void> {
  await Promise.race([
    flushSheet(),
    new Promise((resolve) => setTimeout(resolve, LOGOUT_WAIT)),
  ]);
  endSession();
}

let connected = false;

/**
 * Liga a sessão ao resto do app, uma vez no cliente: `401` em qualquer
 * chamada autenticada encerra a sessão, e esconder ou fechar a página envia
 * as mudanças pendentes.
 */
export function connectSession(): void {
  if (connected) {
    return;
  }
  connected = true;
  onUnauthorized(() => {
    endSession();
    apiError({ status: 401 });
  });
  const flushNow = () => {
    flushSheet({ keepalive: true });
  };
  window.addEventListener("pagehide", flushNow);
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") {
      flushNow();
    }
  });
}
