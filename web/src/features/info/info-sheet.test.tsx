import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { InfoTrigger } from "#/components/vtm/info-trigger";
import { InfoProvider } from "./info-sheet";

afterEach(() => {
  vi.restoreAllMocks();
});

/** Simula uma tela de até 640px: toda media query casa. */
function stubMobile() {
  vi.spyOn(window, "matchMedia").mockImplementation(
    (query) =>
      ({
        addEventListener: () => undefined,
        matches: true,
        media: query,
        removeEventListener: () => undefined,
      }) as unknown as MediaQueryList
  );
}

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
            desc: "Exige uma checagem de sangue.\n\nA Besta acorda.",
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
    expect(dialog).toHaveTextContent("Exige uma checagem de sangue.");
    expect(dialog).toHaveTextContent("A Besta acorda.");
    const desc = dialog.querySelector('[data-slot="sheet-description"]');
    expect(desc?.textContent).toBe(
      "Exige uma checagem de sangue.\n\nA Besta acorda."
    );
  });

  describe("em tela estreita", () => {
    it("sobe de baixo com largura total", async () => {
      stubMobile();
      render(
        <InfoProvider>
          <InfoTrigger target={{ key: "Força", kind: "attr", nivel: 1 }}>
            Força
          </InfoTrigger>
        </InfoProvider>
      );
      fireEvent.click(screen.getByRole("button", { name: "Força" }));

      const dialog = await screen.findByRole("dialog", { name: "Força" });
      expect(dialog).toHaveClass("bottom-0", "border-t", "max-h-[85dvh]");
      expect(dialog).not.toHaveClass("w-[400px]");
      expect(dialog).not.toHaveClass("max-w-[92vw]");
      expect(dialog).not.toHaveClass(
        "data-[state=open]:slide-in-from-right-6!"
      );
    });

    it("não usa o painel largo quando há tabela", async () => {
      stubMobile();
      render(
        <InfoProvider>
          <InfoTrigger
            target={{ geracao: "9ª", kind: "potencia", potencia: 2 }}
          >
            Potência de Sangue
          </InfoTrigger>
        </InfoProvider>
      );
      fireEvent.click(
        screen.getByRole("button", { name: "Potência de Sangue" })
      );

      const dialog = await screen.findByRole("dialog", {
        name: "Potência de Sangue",
      });
      expect(dialog).toHaveClass("bottom-0");
      expect(dialog).not.toHaveClass("w-[760px]");
      expect(screen.getAllByRole("columnheader")).toHaveLength(7);
    });

    it("fecha com Esc e tocando no fundo escurecido", async () => {
      stubMobile();
      render(
        <InfoProvider>
          <InfoTrigger target={{ key: "Força", kind: "attr", nivel: 1 }}>
            Força
          </InfoTrigger>
        </InfoProvider>
      );
      const trigger = screen.getByRole("button", { name: "Força" });

      fireEvent.click(trigger);
      const dialog = await screen.findByRole("dialog", { name: "Força" });
      fireEvent.keyDown(dialog, { key: "Escape" });
      await waitFor(() =>
        expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
      );

      fireEvent.click(trigger);
      await screen.findByRole("dialog", { name: "Força" });
      const overlay = document.querySelector('[data-slot="sheet-overlay"]');
      if (!overlay) {
        throw new Error("fundo escurecido ausente");
      }
      await userEvent.click(overlay);
      await waitFor(() =>
        expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
      );
    });
  });
});
