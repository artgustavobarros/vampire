import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { RichParagraphs, RichText } from "./rich-text";

function inline(text: string) {
  return render(
    <div>
      <RichText text={text} />
    </div>
  ).container.firstElementChild as HTMLElement;
}

describe("RichText", () => {
  it("põe **texto** em negrito", () => {
    const el = inline("Exige um **Rouse Check** ao ativar.");
    expect(el.querySelector("strong")).toHaveTextContent("Rouse Check");
    expect(el).toHaveTextContent("Exige um Rouse Check ao ativar.");
    expect(el.textContent).not.toContain("*");
  });

  it("põe *texto* em itálico", () => {
    const el = inline("Você sente a *Besta* acordar.");
    expect(el.querySelector("em")).toHaveTextContent("Besta");
    expect(el.textContent).toBe("Você sente a Besta acordar.");
  });

  it("combina negrito e itálico", () => {
    const triple = inline("***Atenção***: fim.");
    expect(triple.querySelector("strong em")).toHaveTextContent("Atenção");

    const nested = inline("**a *b* c**");
    expect(nested.querySelector("strong")).toHaveTextContent("a b c");
    expect(nested.querySelector("strong em")).toHaveTextContent("b");
  });

  it("quebra linha em \\n", () => {
    const el = inline("Primeira.\nSegunda.");
    expect(el.querySelectorAll("br")).toHaveLength(1);
    expect(el.textContent).toBe("Primeira.Segunda.");
  });

  it("mantém asterisco sem par", () => {
    expect(inline("Custa 2* pontos.").textContent).toBe("Custa 2* pontos.");
    expect(inline("De 2* a 3* dados.").querySelector("em")).toBeNull();
    expect(inline("**meio").textContent).toBe("**meio");
  });

  it("deixa texto sem marcação igual", () => {
    const el = inline("Força bruta, sem enfeite.");
    expect(el.innerHTML).toBe("Força bruta, sem enfeite.");
  });
});

describe("RichParagraphs", () => {
  it("separa parágrafos por linha em branco", () => {
    const { container } = render(
      <div>
        <RichParagraphs text={"Primeira.\nSegunda.\n\nOutro parágrafo."} />
      </div>
    );
    const ps = container.querySelectorAll("p");
    expect(ps).toHaveLength(2);
    expect(ps[0].querySelectorAll("br")).toHaveLength(1);
    expect(ps[1]).toHaveTextContent("Outro parágrafo.");
  });
});
