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
});
