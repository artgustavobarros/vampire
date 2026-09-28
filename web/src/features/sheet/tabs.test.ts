import { describe, expect, it } from "vitest";
import { isSheetTab, legacyTab, resolveTab, visibleTabs } from "./tabs";

describe("abas da ficha", () => {
  it("Biografia fica entre Ações e Notas e Registros não é mais aba", () => {
    const ids = visibleTabs.map((t) => t.id);
    expect(ids.indexOf("resumo")).toBe(ids.indexOf("acoes") + 1);
    expect(ids.indexOf("notas")).toBe(ids.indexOf("resumo") + 1);
    expect(isSheetTab("registros")).toBe(false);
  });

  it("o id antigo registros aponta para resumo", () => {
    expect(legacyTab("registros")).toBe("resumo");
    expect(legacyTab("toString")).toBeUndefined();
    expect(legacyTab("notas")).toBeUndefined();
  });

  it("o id antigo ficha aponta para caracteristicas", () => {
    expect(legacyTab("ficha")).toBe("caracteristicas");
  });

  it("o id antigo disciplinas aponta para disciplinas-e-sangue", () => {
    expect(legacyTab("disciplinas")).toBe("disciplinas-e-sangue");
  });

  it("resolve a aba da URL", () => {
    expect(resolveTab("notas")).toEqual({ redirect: false, tab: "notas" });
    expect(resolveTab("registros")).toEqual({ redirect: true, tab: "resumo" });
    expect(resolveTab("xyz")).toEqual({
      redirect: true,
      tab: "caracteristicas",
    });
  });
});
