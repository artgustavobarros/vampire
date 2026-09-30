import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { COMPULSION_DURATION, COMPULSIONS } from "#/data/compulsions";
import type { Die } from "#/rules/resonance";
import { CompulsionRoll } from "./compulsion-roll";

/** Dados viciados que devolvem os valores na ordem. */
function dice(...values: number[]): Die {
  const queue = [...values];
  return () => queue.shift() ?? 1;
}

const clans = () => screen.getByRole("group", { name: "Clã" });
const pick = (clan: string) =>
  userEvent.click(within(clans()).getByRole("button", { name: clan }));
const roll = () =>
  userEvent.click(screen.getByRole("button", { name: "Rolar compulsão" }));
const result = () =>
  screen.getByRole("region", { name: "Resultado da compulsão" });

describe("Rolagem de Compulsão", () => {
  it("começa em Não informado e sem resultado", () => {
    render(<CompulsionRoll d={dice()} />);
    const pressed = within(clans())
      .getAllByRole("button")
      .filter((b) => b.getAttribute("aria-pressed") === "true");
    expect(pressed.map((b) => b.textContent)).toEqual(["Não informado"]);
    expect(
      within(result()).getByText("O resultado da compulsão aparece aqui.")
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Limpar compulsão" })
    ).toBeNull();
  });

  it("marca só o clã escolhido", async () => {
    render(<CompulsionRoll d={dice()} />);
    await pick("Brujah");
    const pressed = within(clans())
      .getAllByRole("button")
      .filter((b) => b.getAttribute("aria-pressed") === "true");
    expect(pressed.map((b) => b.textContent)).toEqual(["Brujah"]);
  });

  it("mostra uma compulsão geral", async () => {
    render(<CompulsionRoll d={dice(4)} />);
    await roll();
    const card = within(result());
    expect(card.getByText("Compulsão")).toBeInTheDocument();
    expect(card.getByText("Dominância")).toBeInTheDocument();
    expect(card.getByText(COMPULSIONS.Dominância)).toBeInTheDocument();
    expect(card.getByText(COMPULSION_DURATION)).toBeInTheDocument();
    expect(card.getByText("Compulsão d10: 4")).toBeInTheDocument();
  });

  it("mostra a compulsão do clã marcado no 10", async () => {
    render(<CompulsionRoll d={dice(10)} />);
    await pick("Brujah");
    await roll();
    const card = within(result());
    expect(card.getByText("Compulsão de Clã · Brujah")).toBeInTheDocument();
    expect(card.getByText("Rebelião")).toBeInTheDocument();
    expect(card.getByText("Compulsão d10: 10")).toBeInTheDocument();
  });

  it("sem clã informado manda usar a do personagem", async () => {
    render(<CompulsionRoll d={dice(10)} />);
    await roll();
    const card = within(result());
    expect(card.getAllByText("Compulsão de Clã")).toHaveLength(2);
    expect(
      card.getByText("Use a compulsão do clã do personagem.")
    ).toBeInTheDocument();
  });

  it("Sangue-ralo rola o 10 de novo", async () => {
    render(<CompulsionRoll d={dice(10, 1)} />);
    await pick("Sangue-ralo");
    await roll();
    const card = within(result());
    expect(card.getByText("Fome")).toBeInTheDocument();
    expect(card.getByText("Compulsão d10: 10, 1")).toBeInTheDocument();
  });

  it("Limpar volta ao texto inicial sem mudar o clã", async () => {
    render(<CompulsionRoll d={dice(2)} />);
    await pick("Toreador");
    await roll();
    await userEvent.click(
      screen.getByRole("button", { name: "Limpar compulsão" })
    );
    expect(
      within(result()).getByText("O resultado da compulsão aparece aqui.")
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Limpar compulsão" })
    ).toBeNull();
    expect(
      within(clans()).getByRole("button", { name: "Toreador" })
    ).toHaveAttribute("aria-pressed", "true");
  });
});
