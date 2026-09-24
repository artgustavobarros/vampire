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
