import { fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { InfoProvider } from "#/features/info/info-sheet";
import type { DamageMark } from "#/lib/types";
import { specialtiesBySkill } from "#/rules/specialties";
import { cycleBox } from "#/rules/tracks";
import { useCharacterStore, useSheet } from "#/stores/character-store";
import { DotRating } from "./dot-rating";
import { SelectableCard } from "./selectable";
import { DamageTrack, HumanityTrack } from "./tracks";
import { TraitGrid } from "./trait-grid";

function Dots({ start }: { start: number }) {
  const [v, setV] = useState(start);
  return <DotRating label="Força" onChange={setV} value={v} />;
}

function Track() {
  const [m, setM] = useState<DamageMark[]>([0, 0, 0]);
  return (
    <DamageTrack
      label="Vitalidade"
      marks={m}
      onCycle={(i) => setM(cycleBox(m, i))}
    />
  );
}

const pressed = () =>
  screen
    .getAllByRole("button")
    .filter((b) => b.getAttribute("aria-pressed") === "true").length;

describe("DotRating", () => {
  it("clicar no terceiro ponto com valor 1 define 3", () => {
    render(<Dots start={1} />);
    fireEvent.click(screen.getByRole("button", { name: "Força 3" }));
    expect(pressed()).toBe(3);
  });

  it("clicar no ponto do valor atual diminui 1", () => {
    render(<Dots start={3} />);
    fireEvent.click(screen.getByRole("button", { name: "Força 3" }));
    expect(pressed()).toBe(2);
  });

  function Allowed({ start, allowed }: { allowed: number[]; start: number }) {
    const [v, setV] = useState(start);
    return (
      <DotRating allowed={allowed} label="Bonito" onChange={setV} value={v} />
    );
  }

  it("custo fixo: pontos acima tracejados e valor travado", () => {
    render(<Allowed allowed={[2]} start={2} />);
    expect(screen.getByRole("button", { name: "Bonito 3" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Bonito 5" })).toBeDisabled();
    fireEvent.click(screen.getByRole("button", { name: "Bonito 2" }));
    expect(pressed()).toBe(2);
  });

  it("faixa não desce abaixo do mínimo", () => {
    render(<Allowed allowed={[1, 2, 3, 4, 5]} start={1} />);
    fireEvent.click(screen.getByRole("button", { name: "Bonito 1" }));
    expect(pressed()).toBe(1);
  });

  it("faixa parcial aceita o topo e desativa o resto", () => {
    render(<Allowed allowed={[1, 2]} start={1} />);
    fireEvent.click(screen.getByRole("button", { name: "Bonito 2" }));
    expect(pressed()).toBe(2);
    expect(screen.getByRole("button", { name: "Bonito 3" })).toBeDisabled();
  });

  it("somente leitura não tem botões", () => {
    render(<DotRating count={10} label="Potência" value={2} />);
    expect(screen.queryAllByRole("button")).toHaveLength(0);
    expect(
      screen.getByRole("img", { name: "Potência: 2 de 10" })
    ).toBeInTheDocument();
  });
});

describe("DamageTrack", () => {
  it("cicla vazio → / → ✕ → vazio", () => {
    render(<Track />);
    const box = () => screen.getAllByRole("button")[0];
    fireEvent.click(box());
    expect(box()).toHaveTextContent("/");
    fireEvent.click(box());
    expect(box()).toHaveTextContent("✕");
    fireEvent.click(box());
    expect(box()).toHaveTextContent("");
  });
});

describe("HumanityTrack", () => {
  it("preenche até o nível e mostra manchas", () => {
    const stains = Array.from({ length: 10 }, (_, i) => i === 9);
    render(
      <HumanityTrack level={7} onToggle={() => undefined} stains={stains} />
    );
    const boxes = screen.getAllByRole("button");
    expect(boxes[6]).toHaveClass("bg-ink");
    expect(boxes[7]).toHaveClass("bg-field");
    expect(boxes[9]).toHaveTextContent("✕");
  });
});

describe("SelectableCard", () => {
  it("inverte as cores quando selecionado", () => {
    render(<SelectableCard selected>Brujah</SelectableCard>);
    const card = screen.getByRole("button", { name: "Brujah" });
    expect(card).toHaveClass("bg-ink", "text-white", "border-ink");
    expect(card).toHaveAttribute("aria-pressed", "true");
  });
});

describe("TraitGrid", () => {
  it("mostra as especialidades abaixo do nome", () => {
    render(
      <InfoProvider>
        <TraitGrid
          groups={[{ label: "Sociais", traits: ["Persuasão", "Briga"] }]}
          infoKind="skill"
          minColumn={200}
          onChange={() => undefined}
          specialties={{
            Persuasão: [{ nome: "Negociação" }, { nome: "Sedução" }],
          }}
          values={{ Persuasão: 4 }}
        />
      </InfoProvider>
    );
    const list = screen.getByRole("list", {
      name: "Especialidades de Persuasão",
    });
    expect(list).toHaveTextContent("Negociação");
    expect(list).toHaveTextContent("Sedução");
    expect(
      screen.queryByRole("list", { name: "Especialidades de Briga" })
    ).toBeNull();
  });

  it("o selo abre o painel da especialidade sem mudar os pontos", async () => {
    const onChange = vi.fn();
    render(
      <InfoProvider>
        <TraitGrid
          groups={[{ label: "Mentais", traits: ["Erudição"] }]}
          infoKind="skill"
          minColumn={200}
          onChange={onChange}
          specialties={{ Erudição: [{ nome: "Direito" }] }}
          values={{ Erudição: 1 }}
        />
      </InfoProvider>
    );
    const badge = screen.getByRole("button", { name: "Direito" });
    expect(badge).toHaveClass("border-ink");
    fireEvent.click(badge);

    const dialog = await screen.findByRole("dialog", { name: "Direito" });
    expect(dialog).toHaveTextContent("Erudição 1");
    expect(screen.queryByLabelText("Nome da especialidade")).toBeNull();
    expect(onChange).not.toHaveBeenCalled();
  });
});

function SkillsFromStore() {
  const sheet = useSheet();
  return (
    <InfoProvider>
      <TraitGrid
        groups={[{ label: "Sociais", traits: ["Intimidação"] }]}
        infoKind="skill"
        minColumn={200}
        onChange={() => undefined}
        specialties={specialtiesBySkill(sheet)}
        values={sheet.skills}
      />
    </InfoProvider>
  );
}

describe("especialidade do Predador", () => {
  beforeEach(() => {
    useCharacterStore.getState().clear();
    useCharacterStore.getState().patch({
      predador: "Extorsionário",
      predEspec: "Intimidação (Chantagem)",
      predEspecNome: "Extorsão",
      skills: { Intimidação: 3 },
    });
  });

  it("é um selo comum, com o nome do passo 6 e sem formulário", async () => {
    render(<SkillsFromStore />);
    const badge = screen.getByRole("button", { name: "Extorsão" });
    expect(badge).toHaveClass("border-ink", "text-ink");
    fireEvent.click(badge);

    const dialog = await screen.findByRole("dialog", { name: "Extorsão" });
    expect(dialog).toHaveTextContent("Intimidação 3");
    expect(dialog).not.toHaveTextContent("Tipo de Predador");
    expect(screen.queryByLabelText("Nome da especialidade")).toBeNull();
  });
});
