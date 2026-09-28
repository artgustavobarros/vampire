import { describe, expect, it } from "vitest";
import { isSheetTab, legacyTab, resolveTab, tabsFor } from "./tabs";

describe("abas da ficha", () => {
  it("jogador: Ações, Coterie, Rodada, Biografia e Rolagens, nessa ordem", () => {
    const ids = tabsFor("jogador").map((t) => t.id);
    expect(
      ids.slice(ids.indexOf("acoes"), ids.indexOf("rolagens") + 1)
    ).toEqual(["acoes", "coterie", "rodada", "resumo", "rolagens"]);
    expect(isSheetTab("notas")).toBe(false);
    expect(isSheetTab("registros")).toBe(false);
  });

  it("na ficha aberta pelo Mestre não há Coterie nem Rodada", () => {
    const ids = tabsFor("mestre").map((t) => t.id);
    expect(ids).not.toContain("coterie");
    expect(ids).not.toContain("rodada");
    expect(ids.indexOf("resumo")).toBe(ids.indexOf("acoes") + 1);
    expect(resolveTab("rodada", "mestre")).toEqual({
      redirect: true,
      tab: "caracteristicas",
    });
    expect(resolveTab("rodada")).toEqual({ redirect: false, tab: "rodada" });
  });

  it("o id antigo registros aponta para resumo", () => {
    expect(legacyTab("registros")).toBe("resumo");
    expect(legacyTab("toString")).toBeUndefined();
    expect(legacyTab("rolagens")).toBeUndefined();
  });

  it("o id antigo ficha aponta para caracteristicas", () => {
    expect(legacyTab("ficha")).toBe("caracteristicas");
  });

  it("o id antigo disciplinas aponta para disciplinas-e-sangue", () => {
    expect(legacyTab("disciplinas")).toBe("disciplinas-e-sangue");
  });

  it("o id antigo notas aponta para rolagens", () => {
    expect(legacyTab("notas")).toBe("rolagens");
  });

  it("resolve a aba da URL", () => {
    expect(resolveTab("rolagens")).toEqual({
      redirect: false,
      tab: "rolagens",
    });
    expect(resolveTab("notas")).toEqual({ redirect: true, tab: "rolagens" });
    expect(resolveTab("registros")).toEqual({ redirect: true, tab: "resumo" });
    expect(resolveTab("xyz")).toEqual({
      redirect: true,
      tab: "caracteristicas",
    });
  });
});
