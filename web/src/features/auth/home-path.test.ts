import { describe, expect, it } from "vitest";
import { homeTarget } from "./home-path";

describe("homeTarget", () => {
  it.each([
    [{ criada: false, role: null, user: null }, "/entrar"],
    [{ criada: false, role: "player", user: "a@b.c" }, "/criar"],
    [{ criada: true, role: "player", user: "a@b.c" }, "/ficha"],
    [{ criada: false, role: "dm", user: "admin@admin.com" }, "/personagens"],
  ] as const)("%o → %s", (input, target) => {
    expect(homeTarget(input)).toBe(target);
  });
});
