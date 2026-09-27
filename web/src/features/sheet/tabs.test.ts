import { describe, expect, it } from "vitest";
import { isSheetTab, legacyTab, tabLabel, visibleTabs } from "./tabs";

describe("abas da ficha", () => {
  it("Resumo fica entre Ações e Notas e Registros não é mais aba", () => {
    const ids = visibleTabs.map((t) => t.id);
    expect(ids.indexOf("resumo")).toBe(ids.indexOf("acoes") + 1);
    expect(ids.indexOf("notas")).toBe(ids.indexOf("resumo") + 1);
    expect(tabLabel("resumo")).toBe("Resumo");
    expect(isSheetTab("registros")).toBe(false);
  });

  it("o id antigo registros aponta para resumo", () => {
    expect(legacyTab("registros")).toBe("resumo");
    expect(legacyTab("toString")).toBeUndefined();
    expect(legacyTab("ficha")).toBeUndefined();
  });
});
