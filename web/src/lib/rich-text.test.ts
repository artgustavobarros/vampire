import { describe, expect, it } from "vitest";
import { richTextIsEmpty, sanitizeRichText } from "./rich-text";

describe("sanitizeRichText", () => {
  it("mantém negrito, itálico, sublinhado e listas", () => {
    const html =
      "<p>Garras <strong>agravadas</strong> <em>e</em> <u>rápidas</u><br></p><ul><li>um</li></ul><ol><li>dois</li></ol>";
    expect(sanitizeRichText(html)).toBe(html);
  });

  it("troca link pelo texto e descarta script com o conteúdo", () => {
    expect(
      sanitizeRichText(
        '<a href="https://x.test">link</a><script>alert(1)</script>'
      )
    ).toBe("link");
  });

  it("tira todos os atributos, inclusive eventos", () => {
    expect(
      sanitizeRichText(
        '<b onclick="x()" style="color:red">forte</b><img src=x onerror="alert(1)">'
      )
    ).toBe("<b>forte</b>");
  });

  it("desembrulha div e span aninhados", () => {
    expect(
      sanitizeRichText("<div><span>linha <i>um</i></span></div><div>dois</div>")
    ).toBe("linha <i>um</i>dois");
  });

  it("vazio continua vazio", () => {
    expect(sanitizeRichText("")).toBe("");
  });
});

describe("richTextIsEmpty", () => {
  it("considera só o texto", () => {
    expect(richTextIsEmpty("<p><br></p>")).toBe(true);
    expect(richTextIsEmpty("<p>x</p>")).toBe(false);
  });
});
