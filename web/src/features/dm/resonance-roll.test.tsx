import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import type { Die } from "#/rules/resonance";
import { ResonanceRollTab } from "./resonance-roll";

/** Dados viciados que devolvem os valores na ordem. */
function dice(...values: number[]): Die {
  const queue = [...values];
  return () => queue.shift() ?? 1;
}

const group = (name: string) => screen.getByRole("group", { name });
const pick = (grupo: string, opcao: string) =>
  userEvent.click(within(group(grupo)).getByRole("button", { name: opcao }));
const result = () =>
  screen.getByRole("region", { name: "Resultado da rolagem" });

describe("Rolagem de Ressonância", () => {
  it("começa com Aleatória nos dois grupos e sem resultado", () => {
    render(<ResonanceRollTab d={dice()} />);
    for (const name of ["Ressonância", "Intensidade"]) {
      const pressed = within(group(name))
        .getAllByRole("button")
        .filter((b) => b.getAttribute("aria-pressed") === "true");
      expect(pressed.map((b) => b.textContent)).toEqual(["Aleatória"]);
    }
    expect(
      within(group("Sangue-fraco")).getByRole("button", { name: "Não" })
    ).toHaveAttribute("aria-pressed", "true");
    expect(
      screen.getByRole("button", { name: "Rolar ressonância" })
    ).toBeInTheDocument();
    expect(
      within(result()).getByText("O resultado da rolagem aparece aqui.")
    ).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Limpar" })).toBeNull();
  });

  it("o botão vira Rolar discrasia só com humor fixo e Aguçada", async () => {
    render(<ResonanceRollTab d={dice()} />);
    await pick("Intensidade", "Aguçada");
    expect(
      screen.getByRole("button", { name: "Rolar ressonância" })
    ).toBeInTheDocument();
    await pick("Ressonância", "Fleumática");
    expect(
      within(group("Ressonância")).getByRole("button", { name: "Aleatória" })
    ).toHaveAttribute("aria-pressed", "false");
    expect(
      screen.getByRole("button", { name: "Rolar discrasia" })
    ).toBeInTheDocument();
  });

  it("mostra Fleumática Aguçada com a discrasia Frieza", async () => {
    render(<ResonanceRollTab d={dice(1)} />);
    await pick("Ressonância", "Fleumática");
    await pick("Intensidade", "Aguçada");
    await userEvent.click(
      screen.getByRole("button", { name: "Rolar discrasia" })
    );

    const card = within(result());
    expect(card.getByText("Aguçada")).toBeInTheDocument();
    expect(card.getByText("Fleumática")).toBeInTheDocument();
    expect(
      card.getByText("Preguiça, apatia, calma, controle, sentimentalismo.")
    ).toBeInTheDocument();
    expect(card.getByText("Auspícios")).toBeInTheDocument();
    expect(card.getByText("Dominação")).toBeInTheDocument();
    expect(card.getByText("Discrasia")).toBeInTheDocument();
    expect(card.getByText("Frieza")).toBeInTheDocument();
    expect(
      card.getByText("Calma absoluta, quase clínica, diante de qualquer coisa.")
    ).toBeInTheDocument();
    expect(
      card.getByText(
        "Discrasia d3: 1 · Fleumática (escolhida) · Aguçada (escolhida)"
      )
    ).toBeInTheDocument();
  });

  it("resultado aleatório sem discrasia", async () => {
    render(<ResonanceRollTab d={dice(8, 3)} />);
    await userEvent.click(
      screen.getByRole("button", { name: "Rolar ressonância" })
    );
    const card = within(result());
    expect(card.getByText("Negligenciável")).toBeInTheDocument();
    expect(card.getByText("Colérica")).toBeInTheDocument();
    expect(card.getByText("Celeridade")).toBeInTheDocument();
    expect(card.queryByText("Discrasia")).toBeNull();
    expect(
      card.getByText("Ressonância d10: 8 · Intensidade d10: 3")
    ).toBeInTheDocument();
  });

  it("Limpar volta o cartão ao início sem mexer nas escolhas", async () => {
    render(<ResonanceRollTab d={dice(1)} />);
    await pick("Ressonância", "Fleumática");
    await pick("Intensidade", "Aguçada");
    await userEvent.click(
      screen.getByRole("button", { name: "Rolar discrasia" })
    );
    await userEvent.click(screen.getByRole("button", { name: "Limpar" }));

    expect(
      within(result()).getByText("O resultado da rolagem aparece aqui.")
    ).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Limpar" })).toBeNull();
    expect(
      within(group("Ressonância")).getByRole("button", { name: "Fleumática" })
    ).toHaveAttribute("aria-pressed", "true");
    expect(
      within(group("Intensidade")).getByRole("button", { name: "Aguçada" })
    ).toHaveAttribute("aria-pressed", "true");
  });

  it("sangue-fraco em Aguçada mostra o poder antes da discrasia", async () => {
    render(<ResonanceRollTab d={dice(3, 1, 1)} />);
    await pick("Intensidade", "Aguçada");
    await pick("Sangue-fraco", "Sim");
    await userEvent.click(
      screen.getByRole("button", { name: "Rolar ressonância" })
    );

    const card = within(result());
    expect(card.getByText("Auspícios · Nível 2")).toBeInTheDocument();
    // o poder vem antes da discrasia
    const texto = result().textContent ?? "";
    expect(texto.indexOf("Premonição")).toBeLessThan(texto.indexOf("Frieza"));
    expect(texto.indexOf("Premonição")).toBeGreaterThan(-1);
    expect(texto).toContain("Gratuito ou uma checagem de sangue · ");
    expect(
      card.getByText(
        "Ressonância d10: 3 · Discrasia d3: 1 · Disciplina d2: 1 · Aguçada (escolhida)"
      )
    ).toBeInTheDocument();
  });

  it("sem sangue-fraco não mostra poder", async () => {
    render(<ResonanceRollTab d={dice(1)} />);
    await pick("Ressonância", "Fleumática");
    await pick("Intensidade", "Aguçada");
    await userEvent.click(
      screen.getByRole("button", { name: "Rolar discrasia" })
    );
    expect(result().textContent).not.toContain("· Nível");
  });
});
