import { describe, expect, it } from "vitest";
import { slugUsername } from "./slug-username.js";
import { USERNAME_FORMAT } from "./users.schemas.js";

describe("slugUsername", () => {
  it.each([
    ["Vitória Salles", "vitoria_salles"],
    ["  João  da   Silva ", "joao_da_silva"],
    ["Ana-Clara O'Neil", "ana_clara_o_neil"],
    ["Al", "al_"],
    ["A", "a__"],
    ["李", "jogador"],
    ["", "jogador"],
    ["42", "u42"],
    ["3 Irmãs", "u3_irmas"],
    ["Mestre", "mestre"],
    ["Maria Aparecida dos Santos Oliveira", "maria_aparecida_d"],
    ["Abcdefghijklmnop Qr", "abcdefghijklmnop"],
  ])("%j vira %s", (name, expected) => {
    expect(slugUsername(name)).toBe(expected);
  });

  it.each(["Vitória Salles", "Al", "李", "42", "Maria Aparecida dos Santos"])(
    "o resultado de %j e com sufixo segue o formato do nome de usuário",
    (name) => {
      const slug = slugUsername(name);
      expect(slug).toMatch(USERNAME_FORMAT);
      expect(`${slug}999`).toMatch(USERNAME_FORMAT);
    }
  );
});
