import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { toast } from "sonner";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Toaster } from "#/components/ui/sonner";
import { NPC_LISTS } from "#/data/npc-lists";
import type { Die } from "#/rules/resonance";
import { ResonanceRollTab } from "./resonance-roll";

const CREDITS = /Cangaço Trevoso RPG/;
const KNOWN_AS = /conhecid[oa] como/;
const ROLL_INTENSITY = /^Rolar intensidade · /;
const INTENSITY_OF = /^Intensidade de /;
const OPENING = /Abre a conversa dizendo/;

/** Dado sempre no mínimo: sem sorteio, NPC previsível. */
const lowest: Die = () => 1;
/** Dado sempre no máximo: sem alcunha, estrato 3, exposição 4. */
const highest: Die = (faces) => faces;

const group = (name: string) => screen.getByRole("group", { name });
const pick = (grupo: string, opcao: string) =>
  userEvent.click(within(group(grupo)).getByRole("button", { name: opcao }));
const generate = () =>
  userEvent.click(screen.getByRole("button", { name: "Gerar NPC" }));

function renderTab(d: Die) {
  render(
    <>
      <ResonanceRollTab d={d} />
      <Toaster bottom={16} />
    </>
  );
}

afterEach(() => {
  toast.dismiss();
  vi.restoreAllMocks();
});

describe("Gerador de NPC", () => {
  it("fica abaixo da Rolagem de Ressonância, com tudo aleatório e os créditos", () => {
    renderTab(lowest);
    expect(
      screen.getByRole("heading", {
        name: "Gerador de NPC · Sertão alagoano, 1936",
      })
    ).toBeInTheDocument();
    for (const [grupo, opcao] of [
      ["Apresentação", "Aleatória"],
      ["Estrato social", "Aleatório"],
      ["Exposição ao oculto", "Aleatória"],
    ] as const) {
      expect(
        within(group(grupo)).getByRole("button", { name: opcao })
      ).toHaveAttribute("aria-pressed", "true");
    }
    expect(screen.getByText(CREDITS)).toBeInTheDocument();
    expect(screen.queryByRole("region", { name: "Identidade" })).toBeNull();
  });

  it("gera com os filtros e mostra cabeçalho, cartões e resumo", async () => {
    renderTab(lowest);
    await pick("Apresentação", "Mulher");
    await pick("Exposição ao oculto", "2");
    await generate();

    const nome = `${NPC_LISTS.Nomes_M[0]} ${NPC_LISTS.Sobrenomes[0]}`;
    expect(screen.getByRole("heading", { name: nome })).toBeInTheDocument();
    expect(screen.getByText(`NPC gerado: ${nome}`)).toBeInTheDocument();
    expect(
      screen.getByText(`“${NPC_LISTS.Alc_Pre_M[0]} ${NPC_LISTS.Alc_Comp[0]}”`)
    ).toBeInTheDocument();
    for (const title of [
      "Identidade",
      "Personalidade",
      "Dramaturgia",
      "O Oculto",
    ]) {
      expect(screen.getByRole("region", { name: title })).toBeInTheDocument();
    }
    const oculto = screen.getByRole("region", { name: "O Oculto" });
    expect(
      within(oculto).getByText(NPC_LISTS.Grau_Texto[2])
    ).toBeInTheDocument();
    const resumo = screen.getByRole("region", {
      name: "Resumo para ler na mesa",
    });
    expect(
      within(resumo).getByText(new RegExp(`^${nome}, conhecida como`))
    ).toBeInTheDocument();
  });

  it("sem alcunha, o cabeçalho e o resumo ficam sem ela", async () => {
    renderTab(highest);
    await generate();
    const resumo = screen.getByRole("region", {
      name: "Resumo para ler na mesa",
    });
    expect(within(resumo).queryByText(KNOWN_AS)).toBeNull();
    const nome = `${NPC_LISTS.Nomes_M.at(-1)} ${NPC_LISTS.Sobrenomes.at(-1)}`;
    // no cabeçalho, nada depois do nome
    expect(
      screen.getByRole("heading", { level: 3, name: nome }).nextElementSibling
    ).toBeNull();
  });

  it("gerar de novo substitui o NPC e apaga a intensidade rolada", async () => {
    let n = 0;
    // alterna mínimo e máximo a cada NPC
    const alternating: Die = (faces) => (n % 2 === 0 ? 1 : faces);
    renderTab(alternating);
    await generate();
    const first = screen.getAllByRole("heading", { level: 3 })[0]?.textContent;
    await userEvent.click(screen.getByRole("button", { name: ROLL_INTENSITY }));
    expect(
      screen.getByRole("region", { name: `Intensidade de ${first}` })
    ).toBeInTheDocument();
    n += 1;
    await generate();
    expect(screen.queryByRole("heading", { name: first })).toBeNull();
    expect(screen.queryByRole("region", { name: INTENSITY_OF })).toBeNull();
    expect(screen.getAllByRole("region", { name: "Identidade" })).toHaveLength(
      1
    );
  });

  it("Rolar intensidade fixa a ressonância do NPC", async () => {
    renderTab(lowest);
    await generate();
    const [mood] = NPC_LISTS.Ressonancia;
    const label = mood.charAt(0).toUpperCase() + mood.slice(1);
    await userEvent.click(
      screen.getByRole("button", { name: `Rolar intensidade · ${label}` })
    );
    const nome = `${NPC_LISTS.Nomes_H[0]} ${NPC_LISTS.Sobrenomes[0]}`;
    const result = screen.getByRole("region", {
      name: `Intensidade de ${nome}`,
    });
    expect(within(result).getByText(label)).toBeInTheDocument();
    expect(
      within(result).getByText(new RegExp(`${label} \\(escolhida\\)`))
    ).toBeInTheDocument();
    // o cartão do topo da aba não muda
    expect(
      within(
        screen.getByRole("region", { name: "Resultado da rolagem" })
      ).getByText("O resultado da rolagem aparece aqui.")
    ).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Limpar" }));
    expect(
      screen.queryByRole("region", { name: `Intensidade de ${nome}` })
    ).toBeNull();
  });

  it("Copiar põe o resumo na área de transferência", async () => {
    renderTab(lowest);
    await generate();
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText },
    });
    await userEvent.click(screen.getByRole("button", { name: "Copiar" }));
    const resumo = within(
      screen.getByRole("region", { name: "Resumo para ler na mesa" })
    ).getByText(OPENING).textContent;
    expect(writeText).toHaveBeenCalledWith(resumo);
    expect(await screen.findByText("Resumo copiado.")).toBeInTheDocument();
  });

  it("falha ao copiar avisa", async () => {
    renderTab(lowest);
    await generate();
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText: vi.fn().mockRejectedValue(new Error("negado")) },
    });
    await userEvent.click(screen.getByRole("button", { name: "Copiar" }));
    expect(
      await screen.findByText(
        "Não foi possível copiar. Selecione o texto e copie."
      )
    ).toBeInTheDocument();
  });
});
