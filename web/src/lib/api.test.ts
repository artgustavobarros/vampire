import { afterEach, describe, expect, it } from "vitest";
import { blankSheet } from "#/lib/sheet";
import { usePlayerStore } from "#/stores/player-store";
import { resetStores } from "#/stores/test-utils";
import { fakeApi } from "#/test/fake-api";
import { API_URL, ApiError, getSheet, login, setToken, signup } from "./api";
import { apiErrorMessage } from "./toast";

const BEARER = /^Bearer token-/;

afterEach(resetStores);

describe("cliente da API", () => {
  it("usa http://localhost:3333/api sem VITE_API_URL", async () => {
    expect(API_URL).toBe("http://localhost:3333/api");
    fakeApi.seed({ email: "a@b.co", password: "123456" });
    await login({ email: "a@b.co", password: "123456" });
    expect(fakeApi.calls[0]).toMatchObject({
      method: "POST",
      path: "/auth/login",
    });
  });

  it("manda o Bearer só quando há token", async () => {
    fakeApi.seed({ email: "a@b.co", password: "123456" });
    setToken("qualquer");
    await login({ email: "a@b.co", password: "123456" });
    expect(fakeApi.calls[0].auth).toBeNull();

    setToken(fakeApi.tokenFor("a@b.co"));
    await getSheet();
    expect(fakeApi.calls[1].auth).toMatch(BEARER);
  });

  it("erro da API vira ApiError com status e mensagem", async () => {
    fakeApi.seed({ email: "a@b.co" });
    const err = await signup({
      email: "a@b.co",
      name: "A",
      password: "123456",
    }).catch((e: unknown) => e);
    expect(err).toBeInstanceOf(ApiError);
    expect(err).toMatchObject({
      message: 'E-mail já cadastrado. Use "Entrar".',
      status: 409,
    });
  });

  it("sem conexão rejeita sem status", async () => {
    fakeApi.fail("network");
    const err = await getSheet().catch((e: unknown) => e);
    expect(err).not.toBeInstanceOf(ApiError);
    expect((err as { status?: number }).status).toBeUndefined();
    expect(apiErrorMessage(err)).toBe(
      "Não foi possível falar com o servidor. Verifique a conexão."
    );
  });

  it("401 de chamada autenticada encerra a sessão", async () => {
    fakeApi.login(blankSheet());
    fakeApi.expireTokens();
    await expect(getSheet()).rejects.toMatchObject({ status: 401 });
    expect(usePlayerStore.getState().user).toBeNull();
  });

  it("401 do login não encerra a sessão", async () => {
    fakeApi.login(blankSheet());
    await expect(
      login({ email: "ana@exemplo.com", password: "errada" })
    ).rejects.toMatchObject({
      message: "E-mail ou senha incorretos.",
      status: 401,
    });
    expect(usePlayerStore.getState().user).toBe("ana@exemplo.com");
  });
});
