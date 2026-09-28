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
  /** cadastro */
  email?: string;
  /** entrar: e-mail ou nome de usuário */
  identifier?: string;
  mode: "login" | "signup";
  name?: string;
  password: string;
  password2?: string;
  /** cadastro */
  username?: string;
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
/** o mesmo formato da API; sem `@`, o que separa o usuário do e-mail ao entrar */
const USERNAME = /^[a-z][a-z0-9_.]{2,19}$/;
const MIN_PASSWORD = 6;
/** quanto o "Sair" espera as mudanças pendentes irem para a API */
const LOGOUT_WAIT = 2000;

/** sem espaços nas pontas e em minúsculas, como a API guarda */
const normalize = (value = "") => value.trim().toLowerCase();

/** Mesmas regras e mensagens da API, sem ida e volta. */
function validateLogin({ identifier, password }: AuthInput): string | null {
  if (!normalize(identifier)) {
    return "Informe o e-mail ou usuário.";
  }
  if (!password) {
    return "Informe a senha.";
  }
  return null;
}

function validateSignup(input: AuthInput): string | null {
  const email = normalize(input.email);
  const username = normalize(input.username);
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
  if (!(input.name ?? "").trim()) {
    return "Informe o nome.";
  }
  if (!username) {
    return "Informe o nome de usuário.";
  }
  if (!USERNAME.test(username)) {
    return "Nome de usuário: 3 a 20 letras, números, _ ou ., começando por letra.";
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
  const invalid =
    input.mode === "signup" ? validateSignup(input) : validateLogin(input);
  if (invalid) {
    notify(invalid);
    return false;
  }
  const { password } = input;
  try {
    let sheet: unknown = null;
    if (input.mode === "signup") {
      const res = await signup({
        email: normalize(input.email),
        name: (input.name ?? "").trim(),
        password,
        username: normalize(input.username),
      });
      setToken(res.accessToken);
      if (options.exampleData) {
        ({ sheet } = await putSheet(exampleSheet()));
      }
      usePlayerStore.getState().login(res.user, sheet);
      return true;
    }
    const res = await login({
      identifier: normalize(input.identifier),
      password,
    });
    setToken(res.accessToken);
    // o Mestre não tem ficha própria
    if (res.user.role === "player") {
      ({ sheet } = await getSheet());
    }
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
