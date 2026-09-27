import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { InfoProvider } from "#/features/info/info-sheet";
import { blankSheet } from "#/lib/sheet";
import { useCharacterStore } from "#/stores/character-store";
import { resetStores } from "#/stores/test-utils";
import { ResumoTab } from "./resumo-tab";

const IDENTITY_LABELS = [
  "Nome",
  "Conceito",
  "Crônica",
  "Predador",
  "Ambição",
  "Clã",
  "Senhor",
  "Desejo",
  "Geração",
];

function renderTab() {
  useCharacterStore.setState({
    sheet: { ...blankSheet(), cla: "Ventrue", nome: "Vitória Salles" },
  });
  return render(
    <InfoProvider>
      <ResumoTab />
    </InfoProvider>
  );
}

describe("aba Resumo: identificação", () => {
  beforeEach(resetStores);

  it("mostra os campos de identificação antes de Princípios da Crônica", () => {
    renderTab();
    expect(screen.getByLabelText("Nome")).toHaveValue("Vitória Salles");
    expect(screen.getByLabelText("Clã")).toHaveValue("Ventrue");

    const fields = screen.getAllByRole("textbox");
    const identity = IDENTITY_LABELS.map((label) =>
      screen.getByLabelText(label)
    );
    expect(fields.slice(0, identity.length)).toEqual(identity);
    expect(fields[identity.length]).toBe(
      screen.getByLabelText("Princípios da Crônica")
    );
    for (const field of identity) {
      expect(field).not.toHaveAttribute("placeholder");
    }
  });

  it("editar o Nome grava nome na ficha", () => {
    renderTab();
    fireEvent.change(screen.getByLabelText("Nome"), {
      target: { value: "Aurélio Braga" },
    });
    expect(useCharacterStore.getState().sheet.nome).toBe("Aurélio Braga");
  });
});
