import {
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  RouterProvider,
} from "@tanstack/react-router";
import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { toast } from "sonner";
import { afterEach, describe, expect, it } from "vitest";
import { Toaster } from "#/components/ui/sonner";
import { InfoProvider } from "#/features/info/info-sheet";
import { blankSheet } from "#/lib/sheet";
import { writeSheet } from "#/lib/storage";
import type { Sheet } from "#/lib/types";
import { Route as CriarRoute } from "#/routes/criar";
import { useCharacterStore } from "#/stores/character-store";
import { usePlayerStore } from "#/stores/player-store";
import { resetStores } from "#/stores/test-utils";
import { completeSheet } from "./test-fixtures";

const EMAIL = "ana@exemplo.com";
const TOREADOR = /^Toreador/;
const BRUJAH = /^Brujah/;
const EXPECTED_ARRAY = /expected array/;

/** Monta `/criar` num roteador em memória, com a ficha e a entrada como stubs. */
function renderWizard(sheet: Sheet, url: string) {
  writeSheet(EMAIL, sheet);
  usePlayerStore.getState().login(EMAIL);
  const root = createRootRoute({
    component: () => (
      <InfoProvider>
        <Outlet />
        <Toaster bottom={16} />
      </InfoProvider>
    ),
  });
  const criar = createRoute({
    component: CriarRoute.options.component,
    getParentRoute: () => root,
    path: "/criar",
    validateSearch: CriarRoute.options.validateSearch,
  });
  const ficha = createRoute({
    component: () => <div>Página da ficha</div>,
    getParentRoute: () => root,
    path: "/ficha/$aba",
  });
  const entrar = createRoute({
    component: () => <div>Página de entrada</div>,
    getParentRoute: () => root,
    path: "/entrar",
  });
  const router = createRouter({
    history: createMemoryHistory({ initialEntries: [url] }),
    routeTree: root.addChildren([criar, ficha, entrar]),
  });
  render(<RouterProvider router={router} />);
  return router;
}

const SALTO = /Salto Prodigioso/;

const stored = () => useCharacterStore.getState().sheet;
const click = (target: string | RegExp | HTMLElement) =>
  fireEvent.click(
    target instanceof HTMLElement
      ? target
      : screen.getByRole("button", { name: target })
  );

/** Texto do toast "Passo incompleto" visível. */
async function stepToast() {
  const alert = await screen.findByRole("alert");
  expect(alert).toHaveTextContent("Passo incompleto");
  expect(alert.closest("form")).toBeNull();
  return alert;
}

/** Nenhuma mensagem de erro é renderizada dentro do formulário do assistente. */
function expectNoInlineText(text: string) {
  const form = screen.getByRole("button", { name: "Voltar" }).closest("form");
  expect(form && within(form).queryByText(text)).toBeNull();
}

afterEach(() => {
  toast.dismiss();
  resetStores();
});

describe("assistente com react-hook-form", () => {
  it("Continuar bloqueado mostra o erro, foca o campo e mantém o passo", async () => {
    renderWizard(blankSheet(), "/criar?passo=1");
    await screen.findByText("Passo 1 de 8");
    click("Continuar");
    const alert = await stepToast();
    expect(alert).toHaveTextContent("Escolha um clã. Escolha a geração.");
    expectNoInlineText("Escolha um clã");
    expect(screen.getByRole("group", { name: "Clã" })).toHaveFocus();
    expect(screen.getByLabelText("Geração")).toHaveAttribute(
      "aria-invalid",
      "true"
    );
    expect(screen.getByText("Passo 1 de 8")).toBeInTheDocument();
    expect(stored().cla).toBeUndefined();
  });

  it("o erro some ao corrigir o campo", async () => {
    renderWizard(blankSheet(), "/criar?passo=1");
    click(await screen.findByText("Continuar"));
    await stepToast();
    const cla = screen.getByRole("group", { name: "Clã" });
    expect(cla).toHaveAttribute("data-invalid", "true");
    click(TOREADOR);
    await waitFor(() =>
      expect(cla).not.toHaveAttribute("data-invalid", "true")
    );
    expect(screen.getByLabelText("Geração")).toHaveAttribute(
      "aria-invalid",
      "true"
    );
  });

  it("passo válido grava na ficha e avança", async () => {
    renderWizard(blankSheet(), "/criar?passo=1");
    click(await screen.findByRole("button", { name: BRUJAH }));
    fireEvent.change(screen.getByLabelText("Geração"), {
      target: { value: "12ª" },
    });
    fireEvent.change(screen.getByLabelText("Senhor"), {
      target: { value: "Aurélio" },
    });
    click("Continuar");
    expect(await screen.findByText("Passo 2 de 8")).toBeInTheDocument();
    expect(stored()).toMatchObject({
      cla: "Brujah",
      geracao: "12ª",
      potencia: 1,
      senhor: "Aurélio",
    });
    expect(stored().attrs.Força).toBe(2);
    // o passo seguinte começa sem erros, mesmo depois do envio anterior
    click("Força 4");
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("Voltar grava o passo sem validar", async () => {
    renderWizard(completeSheet(), "/criar?passo=2");
    await screen.findByText("Passo 2 de 8");
    click("Carisma 4");
    click("Voltar");
    expect(await screen.findByText("Passo 1 de 8")).toBeInTheDocument();
    expect(stored().attrs.Carisma).toBe(4);
  });

  it("valores continuam entre passos", async () => {
    renderWizard(completeSheet(), "/criar?passo=1");
    fireEvent.change(await screen.findByLabelText("Senhor"), {
      target: { value: "Helena" },
    });
    click("Continuar");
    await screen.findByText("Passo 2 de 8");
    click("Voltar");
    expect(await screen.findByLabelText("Senhor")).toHaveValue("Helena");
  });

  it("Concluir sem nome não marca a ficha como criada", async () => {
    renderWizard(completeSheet({ nome: "" }), "/criar?passo=8");
    click(await screen.findByText("Concluir"));
    expect(await stepToast()).toHaveTextContent(
      "Informe o nome do personagem."
    );
    expectNoInlineText("Informe o nome do personagem");
    expect(screen.getByLabelText("Nome")).toHaveAttribute(
      "aria-invalid",
      "true"
    );
    expect(stored().criada).toBe(false);
  });

  it("Concluir válido marca criada e abre a ficha", async () => {
    renderWizard(completeSheet({ nome: "" }), "/criar?passo=8");
    fireEvent.change(await screen.findByLabelText("Nome"), {
      target: { value: "Ana Brava" },
    });
    click("Concluir");
    expect(await screen.findByText("Página da ficha")).toBeInTheDocument();
    expect(stored()).toMatchObject({ criada: true, nome: "Ana Brava" });
    expect(stored().disc.map((d) => d.nome)).toEqual([
      "Potência",
      "Celeridade",
    ]);
  });

  it("mérito sem nome bloqueia o passo 7", async () => {
    renderWizard(completeSheet({ meritos: [] }), "/criar?passo=7");
    click(await screen.findByText("Adicionar"));
    click("Continuar");
    expect(await stepToast()).toHaveTextContent("Informe o nome.");
    expect(screen.getByPlaceholderText("Nome")).toHaveAttribute(
      "aria-invalid",
      "true"
    );
    expect(screen.getByText("Passo 7 de 8")).toBeInTheDocument();
  });

  it("clique repetido em Continuar não empilha toasts", async () => {
    renderWizard(blankSheet(), "/criar?passo=1");
    click(await screen.findByText("Continuar"));
    await stepToast();
    click("Continuar");
    await stepToast();
    expect(screen.getAllByRole("alert")).toHaveLength(1);
  });

  it("habilidade fora do formato aparece no progresso e no toast", async () => {
    renderWizard(completeSheet(), "/criar?passo=3");
    await screen.findByText("Passo 3 de 8");
    click("Ocultismo 4");
    expect(screen.getByText("Fora do formato: 1")).toBeInTheDocument();
    click("Continuar");
    expect(await stepToast()).toHaveTextContent(
      "Fora do formato: Ocultismo (4)."
    );
    expect(screen.getByText("Passo 3 de 8")).toBeInTheDocument();
    // 4 → 1 → 0: volta ao formato
    click("Ocultismo 1");
    click("Ocultismo 1");
    expect(screen.queryByText("Fora do formato: 1")).not.toBeInTheDocument();
    click("Continuar");
    expect(await screen.findByText("Passo 4 de 8")).toBeInTheDocument();
  });

  it("escolher a habilidade livre e digitar a especialidade avança", async () => {
    renderWizard(
      completeSheet({ espec: {}, especLivre: "" }),
      "/criar?passo=4"
    );
    await screen.findByText("Passo 4 de 8");
    fireEvent.change(screen.getByLabelText("Perícia"), {
      target: { value: "Briga" },
    });
    fireEvent.change(screen.getByLabelText("Especialidade"), {
      target: { value: "Agarrar" },
    });
    click("Continuar");
    expect(await screen.findByText("Passo 5 de 8")).toBeInTheDocument();
    expect(screen.queryByText(EXPECTED_ARRAY)).not.toBeInTheDocument();
    expect(stored().espec).toEqual({ Briga: ["Agarrar"] });
  });

  it("habilidade obrigatória sem especialidade mostra só a mensagem do passo", async () => {
    const base = completeSheet();
    renderWizard(
      completeSheet({
        espec: {},
        skills: { ...base.skills, Ofícios: 1, Tecnologia: 0 },
      }),
      "/criar?passo=4"
    );
    await screen.findByText("Passo 4 de 8");
    click("Continuar");
    const alert = await stepToast();
    expect(alert).toHaveTextContent("Informe uma especialidade.");
    expect(alert).not.toHaveTextContent(EXPECTED_ARRAY);
  });

  it("perícia escolhida sem especialidade pede a especialidade, sem erro de tipo", async () => {
    const base = completeSheet();
    renderWizard(
      completeSheet({
        espec: {},
        especLivre: "",
        skills: { ...base.skills, "Armas Brancas": 1, Tecnologia: 0 },
      }),
      "/criar?passo=4"
    );
    await screen.findByText("Passo 4 de 8");
    fireEvent.change(screen.getByLabelText("Perícia"), {
      target: { value: "Armas Brancas" },
    });
    click("Continuar");
    const alert = await stepToast();
    expect(alert).toHaveTextContent("Informe uma especialidade.");
    expect(alert).not.toHaveTextContent(EXPECTED_ARRAY);
    fireEvent.change(screen.getByLabelText("Especialidade"), {
      target: { value: "Armas improvisadas" },
    });
    click("Continuar");
    expect(await screen.findByText("Passo 5 de 8")).toBeInTheDocument();
    expect(stored().espec).toEqual({ "Armas Brancas": ["Armas improvisadas"] });
  });

  it("trocar a habilidade livre grava só a escolhida", async () => {
    renderWizard(
      completeSheet({ espec: {}, especLivre: "" }),
      "/criar?passo=4"
    );
    await screen.findByText("Passo 4 de 8");
    const pericia = screen.getByLabelText("Perícia");
    fireEvent.change(pericia, { target: { value: "Briga" } });
    fireEvent.change(pericia, { target: { value: "Atletismo" } });
    fireEvent.change(screen.getByLabelText("Especialidade"), {
      target: { value: "Corrida" },
    });
    click("Continuar");
    expect(await screen.findByText("Passo 5 de 8")).toBeInTheDocument();
    expect(stored().espec).toEqual({ Atletismo: ["Corrida"] });
  });
});

describe("regras do clã nos passos 5 a 7", () => {
  const optionsOf = (name: string) =>
    within(screen.getByRole("combobox", { name }))
      .getAllByRole("option")
      .map((o) => o.textContent)
      .filter((t) => !t?.startsWith("—"));

  it("slots listam só Disciplinas do clã, sem a do outro slot", async () => {
    renderWizard(completeSheet(), "/criar?passo=5");
    await screen.findByText("Passo 5 de 8");
    expect(optionsOf("Primeira Disciplina")).toEqual(["Potência", "Presença"]);
    expect(optionsOf("Segunda Disciplina")).toEqual(["Celeridade", "Presença"]);
    expect(
      screen.getByText("Distribuição completa: 2 e 1.")
    ).toBeInTheDocument();
  });

  it("marcar 2 num slot põe 1 no outro", async () => {
    renderWizard(completeSheet(), "/criar?passo=5");
    click(await screen.findByLabelText("Nível Segunda Disciplina 2"));
    expect(
      screen.getByLabelText("Nível Primeira Disciplina 2")
    ).toHaveAttribute("aria-pressed", "false");
    expect(
      screen.getByLabelText("Nível Primeira Disciplina 1")
    ).toHaveAttribute("aria-pressed", "true");
  });

  it("Sangue Fraco passa pelos passos 5 e 6 sem escolhas", async () => {
    renderWizard(completeSheet({ cla: "Sangue Fraco" }), "/criar?passo=5");
    expect(
      await screen.findByText(
        "Sangues-ralos não têm Disciplinas intrínsecas. Siga para o próximo passo."
      )
    ).toBeInTheDocument();
    expect(screen.queryByRole("combobox")).toBeNull();
    click("Continuar");
    expect(
      await screen.findByText(
        "Sangues-ralos não têm Tipo de Predador. Siga para o próximo passo."
      )
    ).toBeInTheDocument();
    click("Continuar");
    expect(await screen.findByText("Passo 7 de 8")).toBeInTheDocument();
    expect(stored()).toMatchObject({
      predador: "",
      predDisc: "",
      predEspec: "",
    });
    expect(stored().disc.map((d) => d.nome)).toEqual(["", ""]);
  });

  it("selo do sangue-ralo cicla até Defeito SR", async () => {
    renderWizard(completeSheet({ cla: "Sangue Fraco" }), "/criar?passo=7");
    const [badge] = await screen.findAllByTitle("Alternar tipo");
    click(badge);
    click(badge);
    click(badge);
    expect(badge).toHaveTextContent("Defeito SR");
    expect(
      screen.getByText("0 qualidades · 1 defeitos de sangue-ralo")
    ).toBeInTheDocument();
  });

  it("cota 7/2 bloqueia o passo 7", async () => {
    renderWizard(
      completeSheet({
        meritos: [{ nome: "Recursos", pontos: 3, tipo: "vantagem" }],
      }),
      "/criar?passo=7"
    );
    click(await screen.findByText("Continuar"));
    expect(await stepToast()).toHaveTextContent(
      "Falta: distribuir 4 pts em vantagens · adquirir 2 pts em defeitos."
    );
  });

  const pw = (nome: string, nivel: number) => ({
    custo: "",
    desc: "",
    duracao: "",
    nivel,
    nome,
    rouse: false,
  });

  it("limite de um poder por ponto", async () => {
    renderWizard(completeSheet(), "/criar?passo=5");
    click(await screen.findByRole("button", { name: "Incluir Graça Felina" }));
    expect(
      screen.getByRole("button", { name: "Remover Graça Felina" })
    ).toHaveAttribute("aria-pressed", "true");
    click("Incluir Reflexos Rápidos");
    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent("Limite de poderes");
    expect(alert).toHaveTextContent(
      "Celeridade tem 1 ponto: só 1 poder. Tire um para trocar."
    );
    expect(
      screen.getByRole("button", { name: "Incluir Reflexos Rápidos" })
    ).toHaveAttribute("aria-pressed", "false");
  });

  it("sem pontos avisa e não inclui", async () => {
    renderWizard(
      completeSheet({
        disc: [
          { nivel: 0, nome: "Potência", powers: [] },
          { nivel: 0, nome: "Celeridade", powers: [] },
        ],
      }),
      "/criar?passo=5"
    );
    click(await screen.findByRole("button", { name: "Incluir Toque Letal" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("Sem pontos");
    expect(
      screen.queryByRole("button", { name: "Remover Toque Letal" })
    ).toBeNull();
  });

  it("dica conta os poderes escolhidos", async () => {
    renderWizard(
      completeSheet({
        disc: [
          { nivel: 2, nome: "Potência", powers: [pw("Toque Letal", 1)] },
          { nivel: 1, nome: "Celeridade", powers: [] },
        ],
      }),
      "/criar?passo=5"
    );
    expect(
      await screen.findByText(
        "Escolha 2 poderes (um por ponto) · 1/2 escolhidos. Toque no nome para ver a descrição."
      )
    ).toBeInTheDocument();
  });

  it("inverter 2/1 corta os poderes que não cabem", async () => {
    renderWizard(
      completeSheet({
        disc: [
          {
            nivel: 2,
            nome: "Potência",
            powers: [pw("Toque Letal", 1), pw("Salto Prodigioso", 2)],
          },
          { nivel: 1, nome: "Celeridade", powers: [] },
        ],
      }),
      "/criar?passo=5"
    );
    click(await screen.findByLabelText("Nível Segunda Disciplina 2"));
    expect(
      screen.getByRole("button", { name: "Remover Toque Letal" })
    ).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: SALTO })).toBeNull();
  });

  it("nome do poder abre o painel sem alternar", async () => {
    renderWizard(completeSheet(), "/criar?passo=5");
    click(await screen.findByRole("button", { name: "Toque Letal" }));
    const dialog = await screen.findByRole("dialog", { name: "Toque Letal" });
    expect(dialog).toHaveTextContent("Rolagem, custo e duração");
    // o painel é modal: o resto da página fica fora da árvore acessível
    expect(
      screen.getByRole("button", { hidden: true, name: "Incluir Toque Letal" })
    ).toHaveAttribute("aria-pressed", "false");
  });

  it("passo 5 não mostra Potência nem Geração", async () => {
    renderWizard(completeSheet(), "/criar?passo=5");
    await screen.findByText("Passo 5 de 8");
    expect(
      screen.getByText(
        "Duas Disciplinas do clã: dois pontos em uma, um na outra."
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText("Distribuição completa: 2 e 1.")
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Geração 12ª" })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Potência de Sangue" })
    ).not.toBeInTheDocument();
  });

  it("passo 1 mostra a Potência e a Geração do senhor", async () => {
    renderWizard(completeSheet(), "/criar?passo=1");
    fireEvent.change(await screen.findByLabelText("Geração"), {
      target: { value: "9ª" },
    });
    expect(
      screen.getByText("Geração 9ª — Potência de Sangue 2.")
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Seu senhor é da 8ª Geração (você é sempre uma Geração acima do senhor)."
      )
    ).toBeInTheDocument();
  });

  it("rótulo Geração do passo 1 abre o painel", async () => {
    renderWizard(completeSheet(), "/criar?passo=1");
    click(await screen.findByRole("button", { name: "Geração" }));
    const dialog = await screen.findByRole("dialog", { name: "Geração" });
    expect(dialog).toHaveTextContent("12ª Geração · Potência 1");
    expect(dialog.querySelector("tr[aria-current]")).toHaveTextContent(
      "Adicione 2 dados"
    );
    expect(
      screen.getByRole("combobox", { hidden: true, name: "Geração" })
    ).toHaveValue("12ª");
  });

  it("título da Perdição abre o painel", async () => {
    renderWizard(completeSheet(), "/criar?passo=1");
    click(await screen.findByText("Temperamento Violento"));
    const dialog = await screen.findByRole("dialog", {
      name: "Temperamento Violento",
    });
    expect(dialog).toHaveTextContent("Perdição · Brujah");
    expect(dialog).toHaveTextContent("Gravidade 2");
  });
});

describe("rota /criar", () => {
  it("com a ficha criada, redireciona para a ficha", async () => {
    renderWizard(completeSheet({ criada: true }), "/criar?passo=1");
    expect(await screen.findByText("Página da ficha")).toBeInTheDocument();
  });

  it("não deixa pular passos pela URL", async () => {
    renderWizard(completeSheet({ dist: "" }), "/criar?passo=6");
    expect(await screen.findByText("Passo 3 de 8")).toBeInTheDocument();
  });

  it("voltar para um passo anterior é permitido", async () => {
    renderWizard(completeSheet(), "/criar?passo=2");
    expect(await screen.findByText("Passo 2 de 8")).toBeInTheDocument();
  });

  it("Voltar no passo 1 sai quando não é refazer", async () => {
    renderWizard(blankSheet(), "/criar?passo=1");
    click(await screen.findByText("Voltar"));
    expect(await screen.findByText("Página de entrada")).toBeInTheDocument();
    expect(usePlayerStore.getState().user).toBeNull();
  });

  it("refazer edita e substitui o mesmo personagem", async () => {
    renderWizard(
      completeSheet({ criada: true }),
      "/criar?passo=8&refazer=true"
    );
    const nome = await screen.findByLabelText("Nome");
    expect(screen.getByText("Refazer personagem")).toBeInTheDocument();
    fireEvent.change(nome, { target: { value: "Bruno" } });
    click("Concluir");
    expect(await screen.findByText("Página da ficha")).toBeInTheDocument();
    const keys = Object.keys(localStorage).filter((k) =>
      k.startsWith("vtm5.sheet.")
    );
    expect(keys).toEqual([`vtm5.sheet.${EMAIL}`]);
    expect(JSON.parse(localStorage.getItem(keys[0]) ?? "{}")).toMatchObject({
      criada: true,
      nome: "Bruno",
    });
  });
});
