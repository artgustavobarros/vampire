import { fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
import { describe, expect, it } from "vitest";
import type { DamageMark } from "#/lib/types";
import { cycleBox } from "#/rules/tracks";
import { DotRating } from "./dot-rating";
import { SelectableCard } from "./selectable";
import { DamageTrack, HumanityTrack } from "./tracks";

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
