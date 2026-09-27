import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { InfoTrigger } from "#/components/vtm/info-trigger";
import { InfoProvider } from "./info-sheet";

describe("painel de descrição", () => {
  it("abre pelo gatilho e fecha com Esc", async () => {
    render(
      <InfoProvider>
        <InfoTrigger target={{ key: "Manipulação", kind: "attr", nivel: 2 }}>
          Manipulação
        </InfoTrigger>
      </InfoProvider>
    );
    fireEvent.click(screen.getByRole("button", { name: "Manipulação" }));

    const dialog = await screen.findByRole("dialog", { name: "Manipulação" });
    expect(dialog).toHaveTextContent("Atributo social");
    expect(dialog).toHaveTextContent("2 pontos");
    expect(dialog.querySelector("[aria-current]")).toHaveTextContent("••");

    fireEvent.keyDown(dialog, { key: "Escape" });
    await waitFor(() =>
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
    );
  });

  it("mostra a tabela de Potência num painel largo", async () => {
    render(
      <InfoProvider>
        <InfoTrigger target={{ geracao: "9ª", kind: "potencia", potencia: 2 }}>
          Potência de Sangue
        </InfoTrigger>
        <InfoTrigger target={{ key: "Força", kind: "attr", nivel: 1 }}>
          Força
        </InfoTrigger>
      </InfoProvider>
    );
    fireEvent.click(screen.getByRole("button", { name: "Potência de Sangue" }));

    const dialog = await screen.findByRole("dialog", {
      name: "Potência de Sangue",
    });
    expect(dialog).toHaveClass("w-[760px]");
    expect(screen.getAllByRole("columnheader")).toHaveLength(7);
    expect(dialog.querySelector("tr[aria-current]")).toHaveTextContent(
      "Adicione 1 dado"
    );

    fireEvent.keyDown(dialog, { key: "Escape" });
    await waitFor(() =>
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
    );
    fireEvent.click(screen.getByRole("button", { name: "Força" }));
    expect(await screen.findByRole("dialog", { name: "Força" })).toHaveClass(
      "w-[400px]"
    );
  });

  it("exibe a descrição e quebras de linha", async () => {
    render(
      <InfoProvider>
        <InfoTrigger
          target={{
            desc: "Exige um Rouse Check.\n\nA Besta acorda.",
            disc: "Serpentis",
            key: "Olhar da Serpente",
            kind: "poder",
            nivel: 1,
          }}
        >
          Olhar da Serpente
        </InfoTrigger>
      </InfoProvider>
    );
    fireEvent.click(screen.getByRole("button", { name: "Olhar da Serpente" }));

    const dialog = await screen.findByRole("dialog", {
      name: "Olhar da Serpente",
    });
    expect(dialog).toHaveTextContent("Exige um Rouse Check.");
    expect(dialog).toHaveTextContent("A Besta acorda.");
    const desc = dialog.querySelector('[data-slot="sheet-description"]');
    expect(desc?.textContent).toBe("Exige um Rouse Check.\n\nA Besta acorda.");
  });
});
