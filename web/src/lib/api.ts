/**
 * Cliente da API (`api/`). Erros fora de 2xx viram `ApiError` com a mensagem
 * em português do corpo; falha de rede deixa passar o `TypeError` do `fetch`.
 * Os dois formatos são entendidos por `apiError` de `./toast`.
 */
import { clearToken, readToken, writeToken } from "./storage";
import type { Sheet } from "./types";

export const API_URL: string =
  import.meta.env.VITE_API_URL || "http://localhost:3333/api";

const FALLBACK_MESSAGE = "Algo deu errado. Tente novamente.";

/** `dm` é o Mestre: vê e edita a ficha de todos os jogadores. */
export type Role = "player" | "dm";

export interface ApiUser {
  email: string;
  id: string;
  name: string;
  role: Role;
}

export interface AuthResponse {
  accessToken: string;
  user: ApiUser;
}

export interface SheetResponse {
  sheet: Record<string, unknown> | null;
  updatedAt: string | null;
}

/** Um jogador e sua ficha, na lista do Mestre. */
export interface PlayerSheetResponse extends SheetResponse {
  user: ApiUser;
}

export class ApiError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export function getToken(): string | null {
  return readToken();
}

export function setToken(token: string | null): void {
  if (token) {
    writeToken(token);
  } else {
    clearToken();
  }
}

let unauthorized: (() => void) | null = null;

/** Chamado quando uma chamada autenticada recebe `401`. */
export function onUnauthorized(handler: () => void): void {
  unauthorized = handler;
}

interface RequestOptions {
  /** manda o token e trata `401` como sessão expirada (padrão) */
  auth?: boolean;
  keepalive?: boolean;
}

async function messageOf(res: Response): Promise<string> {
  try {
    const body = (await res.json()) as { message?: unknown };
    return typeof body.message === "string" ? body.message : FALLBACK_MESSAGE;
  } catch {
    return FALLBACK_MESSAGE;
  }
}

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
  { auth = true, keepalive }: RequestOptions = {}
): Promise<T> {
  const headers: Record<string, string> = {};
  if (body !== undefined) {
    headers["Content-Type"] = "application/json";
  }
  const token = auth ? getToken() : null;
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  const res = await fetch(`${API_URL}${path}`, {
    body: body === undefined ? undefined : JSON.stringify(body),
    headers,
    keepalive,
    method,
  });
  if (res.ok) {
    return (await res.json()) as T;
  }
  const error = new ApiError(res.status, await messageOf(res));
  if (res.status === 401 && auth) {
    unauthorized?.();
  }
  throw error;
}

export function signup(body: {
  email: string;
  name: string;
  password: string;
}): Promise<AuthResponse> {
  return request("POST", "/auth/signup", body, { auth: false });
}

export function login(body: {
  email: string;
  password: string;
}): Promise<AuthResponse> {
  return request("POST", "/auth/login", body, { auth: false });
}

export function me(): Promise<ApiUser> {
  return request("GET", "/auth/me");
}

export function getSheet(): Promise<SheetResponse> {
  return request("GET", "/me/sheet");
}

export function putSheet(sheet: Sheet): Promise<SheetResponse> {
  return request("PUT", "/me/sheet", { sheet });
}

/** Troca só as chaves enviadas; `null` apaga o campo (ver `normalizeSheet`). */
export function patchSheet(
  patch: Record<string, unknown>,
  options: { keepalive?: boolean } = {}
): Promise<SheetResponse> {
  return request("PATCH", "/me/sheet", { patch }, options);
}

/** Só o Mestre: todos os jogadores com suas fichas. */
export function listSheets(): Promise<PlayerSheetResponse[]> {
  return request("GET", "/sheets");
}

/** Só o Mestre: a ficha de um jogador, com o jogador. */
export function getPlayerSheet(userId: string): Promise<PlayerSheetResponse> {
  return request("GET", `/sheets/${encodeURIComponent(userId)}`);
}

/** Só o Mestre: como `patchSheet`, na ficha de um jogador e sem a trava. */
export function patchPlayerSheet(
  userId: string,
  patch: Record<string, unknown>,
  options: { keepalive?: boolean } = {}
): Promise<SheetResponse> {
  return request(
    "PATCH",
    `/sheets/${encodeURIComponent(userId)}`,
    { patch },
    options
  );
}
