/**
 * Cliente da API (`api/`). Erros fora de 2xx viram `ApiError` com a mensagem
 * em português do corpo; falha de rede deixa passar o `TypeError` do `fetch`.
 * Os dois formatos são entendidos por `apiError` de `./toast`.
 */
import { clearToken, readToken, writeToken } from "./storage";
import type { Enemy, EnemyStats, RoundEntry, RoundState, Sheet } from "./types";

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
  username: string;
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

/** Uma coterie na visão do Mestre: membros com a ficha inteira. */
export interface CoterieResponse {
  id: string;
  membros: PlayerSheetResponse[];
  nome: string;
}

/**
 * A coterie do jogador. `sheet` traz só nome, clã, Fome, trilhas e os
 * Atributos das trilhas; sem e-mail.
 */
export interface MyCoterieResponse {
  coterie: {
    id: string;
    membros: { sheet: Record<string, unknown> | null; userId: string }[];
    nome: string;
  } | null;
}

export interface EnemyRecord {
  enemy: Enemy;
  id: string;
  updatedAt: string;
}

export type RoundViewEntry =
  | (RoundEntry & { sheet: Record<string, unknown> | null; tipo: "jogador" })
  | (RoundEntry & {
      /** `null` para jogadores quando o Mestre não deixou ver */
      dados: EnemyStats | null;
      nome: string;
      tipo: "inimigo";
      visivel: boolean;
    });

/** A rodada com cada participante completo, como `GET /round` devolve. */
export interface RoundView {
  ordem: RoundViewEntry[];
  rodada: number;
  updatedAt: string | null;
  vez: number;
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
  if (res.status === 204) {
    return undefined as T;
  }
  if (res.ok) {
    return (await res.json()) as T;
  }
  const error = new ApiError(res.status, await messageOf(res));
  if (res.status === 401 && auth) {
    unauthorized?.();
  }
  throw error;
}

/** Sem `username`, a API gera um a partir do nome. */
export function signup(body: {
  email: string;
  name: string;
  password: string;
  username?: string;
}): Promise<AuthResponse> {
  return request("POST", "/auth/signup", body, { auth: false });
}

/** `identifier` é o e-mail (com `@`) ou o nome de usuário. */
export function login(body: {
  identifier: string;
  password: string;
}): Promise<AuthResponse> {
  return request("POST", "/auth/login", body, { auth: false });
}

export function me(): Promise<ApiUser> {
  return request("GET", "/auth/me");
}

/** Só os campos que mudam; `password` é a senha nova. */
export interface AccountUpdate {
  /** exigida para mudar e-mail ou senha da própria conta */
  currentPassword?: string;
  email?: string;
  name?: string;
  password?: string;
  username?: string;
}

/** A própria conta; do Mestre, só o nome. */
export function updateMyAccount(body: AccountUpdate): Promise<ApiUser> {
  return request("PATCH", "/me/account", body);
}

/** Só o Mestre: a conta de um jogador, sem a senha atual dele. */
export function updatePlayerAccount(
  userId: string,
  body: Omit<AccountUpdate, "currentPassword">
): Promise<ApiUser> {
  return request("PATCH", `/accounts/${encodeURIComponent(userId)}`, body);
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

const segment = (value: string) => encodeURIComponent(value);

/** Só o Mestre: todas as coteries com os membros. */
export function listCoteries(): Promise<CoterieResponse[]> {
  return request("GET", "/coteries");
}

export function createCoterie(nome = ""): Promise<CoterieResponse> {
  return request("POST", "/coteries", { nome });
}

export function renameCoterie(
  coterieId: string,
  nome: string,
  options: { keepalive?: boolean } = {}
): Promise<CoterieResponse> {
  return request("PATCH", `/coteries/${segment(coterieId)}`, { nome }, options);
}

export function deleteCoterie(coterieId: string): Promise<void> {
  return request("DELETE", `/coteries/${segment(coterieId)}`);
}

export function addCoterieMember(
  coterieId: string,
  userId: string
): Promise<CoterieResponse> {
  return request(
    "PUT",
    `/coteries/${segment(coterieId)}/membros/${segment(userId)}`
  );
}

export function removeCoterieMember(
  coterieId: string,
  userId: string
): Promise<CoterieResponse> {
  return request(
    "DELETE",
    `/coteries/${segment(coterieId)}/membros/${segment(userId)}`
  );
}

/** A coterie do jogador do token, ou `{ coterie: null }`. */
export function getMyCoterie(): Promise<MyCoterieResponse> {
  return request("GET", "/me/coterie");
}

/** Só o Mestre: o Bestiário, por ordem de criação. */
export function listEnemies(): Promise<EnemyRecord[]> {
  return request("GET", "/enemies");
}

export function createEnemy(enemy: Enemy): Promise<EnemyRecord> {
  return request("POST", "/enemies", { enemy });
}

export function saveEnemy(
  enemyId: string,
  enemy: Enemy,
  options: { keepalive?: boolean } = {}
): Promise<EnemyRecord> {
  return request("PUT", `/enemies/${segment(enemyId)}`, { enemy }, options);
}

export function deleteEnemy(enemyId: string): Promise<void> {
  return request("DELETE", `/enemies/${segment(enemyId)}`);
}

/** A rodada; para jogadores, sem os dados de inimigos ocultos. */
export function getRound(): Promise<RoundView> {
  return request("GET", "/round");
}

/** Só o Mestre: grava o estado inteiro da rodada. */
export function putRound(
  state: RoundState,
  options: { keepalive?: boolean } = {}
): Promise<RoundView> {
  return request("PUT", "/round", state, options);
}
