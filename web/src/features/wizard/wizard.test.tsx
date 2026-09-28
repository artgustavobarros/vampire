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
import { SKILLS } from "#/data/traits";
import { InfoProvider } from "#/features/info/info-sheet";
import { blankSheet } from "#/lib/sheet";
import type { Sheet } from "#/lib/types";
import { Route as CriarRoute } from "#/routes/criar";
import { useCharacterStore } from "#/stores/character-store";
import { usePlayerStore } from "#/stores/player-store";
import { resetStores } from "#/stores/test-utils";
import { fakeApi } from "#/test/fake-api";
import { completeSheet } from "./test-fixtures";

const EMAIL = "ana@exemplo.com";
const TOREADOR = /^Toreador/;
const BRUJAH = /^Brujah/;
const EXPECTED_ARRAY = /expected array/;

/** Monta `/criar` num roteador em memória, com a ficha e a entrada como stubs. */
const BRUJAH_BANE = /^Temperamento Violento — ./;

function renderWizard(sheet: Sheet, url: string) {
  fakeApi.login(sheet, EMAIL);
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

const PODERIO = /Poderio/;
const SANGUESSUGA = /^Sanguessuga/;
const OSIRIS = /^Osíris/;
const FAZENDEIRO = /^Fazendeiro/;
const SAQUEADOR = /^Saqueador/;
const FEITICARIA = /^Feitiçaria de Sangue/;
const PRESENCA = /^Presença/;
const EXTORSIONARIO = /^Extorsionário/;
const DOMINACAO = /^Dominação/;
const POTENCIA = /^Potência/;
const FAZ_TUDO = /^Faz-tudo/;
const ESPECIALISTA = /^Especialista/;

const stored = () => useCharacterStore.getState().sheet;
const search = () =>
  screen.findByRole("combobox", { name: "Buscar vantagem ou defeito" });
const type = (input: HTMLElement, value: string) =>
  fireEvent.change(input, { target: { value } });
const option = (name: string | RegExp) =>
  within(screen.getByRole("listbox")).getByRole("option", { name });
const RECURSOS = /^Recursos/;
const BONITO = /^Bonito/;
const MASCARA = /^Máscara/;
const BIBLIOTECA = /^Biblioteca/;
const INQUEBRANTAVEL = /^Inquebrantável/;
const INSTINTO = /^Instinto Assassino/;
const ALIADOS = /^Aliados/;
const SANGUE_FAVORECIDO = /^Sangue Favorecido/;
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
    // a geração vem antes do clã na tela, então recebe o foco
    expect(screen.getByLabelText("Geração do senhor")).toHaveFocus();
    expect(screen.getByLabelText("Geração do senhor")).toHaveAttribute(
      "aria-invalid",
      "true"
    );
    expect(screen.getByRole("group", { name: "Clã" })).toHaveAttribute(
      "data-invalid",
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
    expect(screen.getByLabelText("Geração do senhor")).toHaveAttribute(
      "aria-invalid",
      "true"
    );
  });

  it("passo válido grava na ficha e avança", async () => {
    renderWizard(blankSheet(), "/criar?passo=1");
    click(await screen.findByRole("button", { name: BRUJAH }));
    fireEvent.change(screen.getByLabelText("Geração do senhor"), {
      target: { value: "11ª" },
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
    expect(stored().perdicao).toMatch(BRUJAH_BANE);
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
    expect(stored().perdicao).toMatch(BRUJAH_BANE);
    expect(stored().disc.map((d) => d.nome)).toEqual([
      "Potência",
      "Celeridade",
    ]);
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

  it("sem distribuição gravada, o passo 3 abre com Faz-tudo", async () => {
    renderWizard(
      completeSheet({ dist: undefined, skills: blankSheet().skills }),
      "/criar?passo=3"
    );
    await screen.findByText("Passo 3 de 8");
    expect(screen.getByRole("button", { name: FAZ_TUDO })).toHaveAttribute(
      "aria-pressed",
      "true"
    );
    expect(screen.getByText("Nível 3: 0 de 1")).toBeInTheDocument();
    expect(screen.getByText("Nível 2: 0 de 8")).toBeInTheDocument();
    expect(screen.getByText("Nível 1: 0 de 10")).toBeInTheDocument();
  });

  it("a distribuição gravada é respeitada no passo 3", async () => {
    renderWizard(completeSheet({ dist: "Especialista" }), "/criar?passo=3");
    await screen.findByText("Passo 3 de 8");
    expect(screen.getByRole("button", { name: ESPECIALISTA })).toHaveAttribute(
      "aria-pressed",
      "true"
    );
    expect(screen.getByRole("button", { name: FAZ_TUDO })).toHaveAttribute(
      "aria-pressed",
      "false"
    );
  });

  it("Faz-tudo completa sem tocar nos cartões grava a distribuição", async () => {
    const skills = { ...blankSheet().skills };
    SKILLS.forEach((name, i) => {
      if (i < 1) {
        skills[name] = 3;
      } else if (i < 9) {
        skills[name] = 2;
      } else if (i < 19) {
        skills[name] = 1;
      }
    });
    renderWizard(completeSheet({ dist: undefined, skills }), "/criar?passo=3");
    await screen.findByText("Passo 3 de 8");
    click("Continuar");
    expect(await screen.findByText("Passo 4 de 8")).toBeInTheDocument();
    expect(stored().dist).toBe("Faz-tudo");
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

  it("+2 num slot põe 1 no outro", async () => {
    renderWizard(completeSheet(), "/criar?passo=5");
    click(await screen.findByLabelText("Segunda Disciplina +2"));
    expect(screen.getByLabelText("Primeira Disciplina +2")).toHaveAttribute(
      "aria-pressed",
      "false"
    );
    expect(screen.getByLabelText("Primeira Disciplina +1")).toHaveAttribute(
      "aria-pressed",
      "true"
    );
    expect(screen.getByLabelText("Segunda Disciplina +2")).toHaveAttribute(
      "aria-pressed",
      "true"
    );
  });

  it("clicar no botão ativo não muda os níveis", async () => {
    renderWizard(completeSheet(), "/criar?passo=5");
    click(await screen.findByLabelText("Primeira Disciplina +2"));
    expect(screen.getByLabelText("Primeira Disciplina +2")).toHaveAttribute(
      "aria-pressed",
      "true"
    );
    expect(screen.getByLabelText("Segunda Disciplina +1")).toHaveAttribute(
      "aria-pressed",
      "true"
    );
  });

  it("sem nível, nenhum botão fica ativo", async () => {
    renderWizard(
      completeSheet({
        disc: [
          { nivel: 0, nome: "Potência", powers: [] },
          { nivel: 0, nome: "Celeridade", powers: [] },
        ],
      }),
      "/criar?passo=5"
    );
    await screen.findByText("Passo 5 de 8");
    for (const name of [
      "Primeira Disciplina +2",
      "Primeira Disciplina +1",
      "Segunda Disciplina +2",
      "Segunda Disciplina +1",
    ]) {
      expect(screen.getByLabelText(name)).toHaveAttribute(
        "aria-pressed",
        "false"
      );
    }
  });

  it("Disciplina gravada de outro clã não aparece no slot", async () => {
    renderWizard(
      completeSheet({
        disc: [
          { nivel: 2, nome: "Domínio", powers: [] },
          { nivel: 1, nome: "Celeridade", powers: [] },
        ],
      }),
      "/criar?passo=5"
    );
    await screen.findByText("Passo 5 de 8");
    expect(optionsOf("Primeira Disciplina")).toEqual(["Potência", "Presença"]);
    expect(
      screen.getByRole("combobox", { name: "Primeira Disciplina" })
    ).toHaveValue("");
  });

  it("trocar de clã limpa as Disciplinas de fora do novo clã", async () => {
    renderWizard(
      completeSheet({
        disc: [
          { nivel: 2, nome: "Presença", powers: [] },
          { nivel: 1, nome: "Potência", powers: [] },
        ],
      }),
      "/criar?passo=1"
    );
    click(await screen.findByRole("button", { name: TOREADOR }));
    click("Continuar");
    await screen.findByText("Passo 2 de 8");
    click("Continuar");
    await screen.findByText("Passo 3 de 8");
    click("Continuar");
    await screen.findByText("Passo 4 de 8");
    click("Continuar");
    await screen.findByText("Passo 5 de 8");
    expect(
      screen.getByRole("combobox", { name: "Primeira Disciplina" })
    ).toHaveValue("Presença");
    expect(
      screen.getByRole("combobox", { name: "Segunda Disciplina" })
    ).toHaveValue("");
    expect(screen.getByLabelText("Primeira Disciplina +2")).toHaveAttribute(
      "aria-pressed",
      "true"
    );
    for (const name of ["Segunda Disciplina +2", "Segunda Disciplina +1"]) {
      expect(screen.getByLabelText(name)).toHaveAttribute(
        "aria-pressed",
        "false"
      );
    }
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
    type(await search(), "Pacto antigo");
    click(option("Adicionar “Pacto antigo” como vantagem"));
    const [badge] = screen.getAllByTitle("Alternar tipo");
    click(badge);
    click(badge);
    click(badge);
    expect(badge).toHaveTextContent("Defeito SR");
    expect(
      screen.getByText("0 qualidades · 1 defeitos de sangue-ralo")
    ).toBeInTheDocument();
  });

  describe("combobox do passo 7", () => {
    const empty = () => completeSheet({ meritos: [] });

    it("escolhe um antecedente pela busca", async () => {
      renderWizard(empty(), "/criar?passo=7");
      expect(
        await screen.findByText("Nenhum mérito ou defeito")
      ).toBeInTheDocument();
      type(await search(), "recur");
      click(option(RECURSOS));
      expect(await search()).toHaveValue("");
      expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Recursos" })
      ).toBeInTheDocument();
      expect(screen.getByText("Antecedentes · •–•••••")).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Pontos de Recursos 1" })
      ).toHaveAttribute("aria-pressed", "true");
      expect(screen.getByText("1/7 pts em vantagens")).toBeInTheDocument();
    });

    it("custo fixo trava os pontos", async () => {
      renderWizard(empty(), "/criar?passo=7");
      type(await search(), "bonito");
      click(option(BONITO));
      expect(screen.getByText("2/7 pts em vantagens")).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Pontos de Bonito 3" })
      ).toBeDisabled();
    });

    it("aba Defeitos mostra só defeitos", async () => {
      renderWizard(empty(), "/criar?passo=7");
      click(await screen.findByRole("button", { name: "Defeitos" }));
      fireEvent.focus(await search());
      const options = within(screen.getByRole("listbox")).getAllByRole(
        "option"
      );
      expect(options.length).toBeGreaterThan(0);
      for (const o of options) {
        expect(o).toHaveTextContent("Defeito");
      }
      expect(screen.getByText(`${options.length} opções`)).toBeInTheDocument();
    });

    it("busca sem acento", async () => {
      renderWizard(empty(), "/criar?passo=7");
      type(await search(), "mascara");
      expect(option(MASCARA)).toBeInTheDocument();
    });

    it("opção na ficha não duplica", async () => {
      renderWizard(completeSheet(), "/criar?passo=7");
      type(await search(), "Recursos");
      const hit = option(RECURSOS);
      expect(hit).toHaveTextContent("Na ficha");
      click(hit);
      expect(screen.getAllByRole("button", { name: "Recursos" })).toHaveLength(
        1
      );
    });

    it("teclado: ↓ ↓ Enter escolhe a segunda opção", async () => {
      renderWizard(empty(), "/criar?passo=7");
      const input = await search();
      fireEvent.focus(input);
      const [, second] = within(screen.getByRole("listbox")).getAllByRole(
        "option"
      );
      const name = second?.querySelector("span")?.textContent ?? "";
      fireEvent.keyDown(input, { key: "ArrowDown" });
      fireEvent.keyDown(input, { key: "ArrowDown" });
      expect(input).toHaveAttribute("aria-activedescendant", second?.id);
      fireEvent.keyDown(input, { key: "Enter" });
      expect(screen.getByRole("button", { name })).toBeInTheDocument();
    });

    it("item fora do catálogo", async () => {
      renderWizard(empty(), "/criar?passo=7");
      type(await search(), "Dívida de sangue");
      click(option("Adicionar “Dívida de sangue” como defeito"));
      expect(screen.getByTitle("Alternar tipo")).toHaveTextContent("Defeito");
      expect(screen.getByText("Fora do catálogo")).toBeInTheDocument();
      expect(screen.getByText("1/2 pts em defeitos")).toBeInTheDocument();
    });

    it("nome abre o painel", async () => {
      renderWizard(completeSheet(), "/criar?passo=7");
      click(await screen.findByRole("button", { name: "Recursos" }));
      expect(
        await screen.findByRole("dialog", { name: "Recursos" })
      ).toBeInTheDocument();
    });

    it("Qualidades SR só para Sangue Fraco", async () => {
      renderWizard(empty(), "/criar?passo=7");
      type(await search(), "Bebedor diurno");
      expect(
        within(screen.getByRole("listbox")).getAllByRole("option")
      ).toHaveLength(2);
    });

    it("Sangue Fraco vê Qualidades SR em Vantagens", async () => {
      renderWizard(
        completeSheet({ cla: "Sangue Fraco", meritos: [] }),
        "/criar?passo=7"
      );
      click(await screen.findByRole("button", { name: "Vantagens" }));
      fireEvent.focus(await search());
      const list = screen.getByRole("listbox");
      expect(
        within(list).getByRole("group", { name: "Sangue-ralo" })
      ).toHaveTextContent("Qualidade SR");
    });

    it("sub-vantagem agrupada sob o Antecedente", async () => {
      renderWizard(empty(), "/criar?passo=7");
      type(await search(), "biblioteca");
      const group = within(screen.getByRole("listbox")).getByRole("group", {
        name: "Antecedente · Refúgio",
      });
      expect(
        within(group).getByRole("option", { name: BIBLIOTECA })
      ).toHaveTextContent("Exige Refúgio •");
    });

    it("pré-requisito pendente e cumprido", async () => {
      const meritos = [
        { nome: "Zerado", pontos: 1, tipo: "vantagem" as const },
        { nome: "Máscara", pontos: 1, tipo: "vantagem" as const },
        { nome: "Recursos", pontos: 4, tipo: "vantagem" as const },
        { nome: "Inimigo", pontos: 2, tipo: "defeito" as const },
      ];
      renderWizard(completeSheet({ meritos }), "/criar?passo=7");
      expect(
        await screen.findByText(
          "Falta: distribuir 1 pts em vantagens · Zerado exige Máscara ••."
        )
      ).toBeInTheDocument();
      click(screen.getByRole("button", { name: "Pontos de Máscara 2" }));
      expect(screen.getByText("Distribuição completa.")).toBeInTheDocument();
    });

    it("clã que não pode ter o item", async () => {
      renderWizard(
        completeSheet({
          meritos: [
            { nome: "Sangue Favorecido", pontos: 4, tipo: "vantagem" },
            { nome: "Contatos", pontos: 3, tipo: "vantagem" },
            { nome: "Inimigo", pontos: 2, tipo: "defeito" },
          ],
        }),
        "/criar?passo=7"
      );
      expect(
        await screen.findByText("Falta: Brujah não pode ter Sangue Favorecido.")
      ).toBeInTheDocument();
      type(await search(), "sangue favorecido");
      expect(
        within(screen.getByRole("listbox")).queryByRole("option", {
          name: SANGUE_FAVORECIDO,
        })
      ).toBeNull();
    });

    it("Falha Enraizada sem pontos", async () => {
      renderWizard(completeSheet(), "/criar?passo=7");
      type(await search(), "instinto");
      click(option(INSTINTO));
      expect(
        screen.getByText("Falhas de Disciplina Enraizada · —")
      ).toBeInTheDocument();
      expect(
        screen.queryByRole("group", { name: "Pontos de Instinto Assassino" })
      ).toBeNull();
      expect(screen.getByText("2/2 pts em defeitos")).toBeInTheDocument();
    });

    it("busca pelo nome em inglês", async () => {
      renderWizard(empty(), "/criar?passo=7");
      type(await search(), "unbondable");
      expect(option(INQUEBRANTAVEL)).toBeInTheDocument();
    });

    it("Aliados até 6", async () => {
      renderWizard(empty(), "/criar?passo=7");
      type(await search(), "aliados");
      click(option(ALIADOS));
      expect(
        screen.getByRole("button", { name: "Pontos de Aliados 2" })
      ).toHaveAttribute("aria-pressed", "true");
      expect(
        screen.getByRole("button", { name: "Pontos de Aliados 6" })
      ).toBeEnabled();
    });
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
    click(await screen.findByRole("button", { name: "Incluir Corpo Letal" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("Sem pontos");
    expect(
      screen.queryByRole("button", { name: "Remover Corpo Letal" })
    ).toBeNull();
  });

  it("dica conta os poderes escolhidos", async () => {
    renderWizard(
      completeSheet({
        disc: [
          { nivel: 2, nome: "Potência", powers: [pw("Corpo Letal", 1)] },
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
            powers: [pw("Corpo Letal", 1), pw("Poderio", 2)],
          },
          { nivel: 1, nome: "Celeridade", powers: [] },
        ],
      }),
      "/criar?passo=5"
    );
    click(await screen.findByLabelText("Segunda Disciplina +2"));
    expect(
      screen.getByRole("button", { name: "Remover Corpo Letal" })
    ).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: PODERIO })).toBeNull();
  });

  it("nome do poder abre o painel sem alternar", async () => {
    renderWizard(completeSheet(), "/criar?passo=5");
    click(await screen.findByRole("button", { name: "Corpo Letal" }));
    const dialog = await screen.findByRole("dialog", { name: "Corpo Letal" });
    expect(dialog).toHaveTextContent("Rolagem, custo e duração");
    // o painel é modal: o resto da página fica fora da árvore acessível
    expect(
      screen.getByRole("button", { hidden: true, name: "Incluir Corpo Letal" })
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
    fireEvent.change(await screen.findByLabelText("Geração do senhor"), {
      target: { value: "8ª" },
    });
    expect(
      screen.getByText("Geração 9ª — Potência de Sangue 2.")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Você é da 9ª Geração (sempre uma acima do seu senhor).")
    ).toBeInTheDocument();
  });

  it("rótulo Geração do senhor do passo 1 abre o painel", async () => {
    renderWizard(completeSheet(), "/criar?passo=1");
    click(await screen.findByRole("button", { name: "Geração do senhor" }));
    const dialog = await screen.findByRole("dialog", { name: "Geração" });
    expect(dialog).toHaveTextContent("12ª Geração · Potência 1");
    expect(dialog.querySelector("tr[aria-current]")).toHaveTextContent(
      "Adicione 2 dados"
    );
    expect(
      screen.getByRole("combobox", { hidden: true, name: "Geração do senhor" })
    ).toHaveValue("11ª");
  });

  it("rótulo Vitalidade do passo 2 abre o painel", async () => {
    renderWizard(completeSheet(), "/criar?passo=2");
    click(await screen.findByRole("button", { name: "Vitalidade" }));
    const dialog = await screen.findByRole("dialog", { name: "Vitalidade" });
    expect(dialog).toHaveTextContent("Máximo 6");
    expect(
      screen.getByRole("button", { hidden: true, name: "Vigor 3" })
    ).toHaveAttribute("aria-pressed", "true");
    expect(
      screen.getByRole("button", { hidden: true, name: "Vigor 4" })
    ).toHaveAttribute("aria-pressed", "false");
  });

  it("rótulo Força de Vontade do passo 2 abre o painel", async () => {
    renderWizard(completeSheet(), "/criar?passo=2");
    click(await screen.findByRole("button", { name: "Força de Vontade" }));
    const dialog = await screen.findByRole("dialog", {
      name: "Força de Vontade",
    });
    expect(dialog).toHaveTextContent("Máximo 4");
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
    renderWizard(completeSheet({ dist: "Inexistente" }), "/criar?passo=6");
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

  it("com a ficha criada vai para a ficha, mesmo pedindo refazer", async () => {
    renderWizard(
      completeSheet({ criada: true }),
      "/criar?passo=8&refazer=true"
    );
    expect(await screen.findByText("Página da ficha")).toBeInTheDocument();
    expect(screen.queryByText("Refazer personagem")).toBeNull();
  });
});

describe("Predador aplicado na ficha", () => {
  const pressed = (label: string) =>
    screen.getByRole("button", { name: label }).getAttribute("aria-pressed");
  const levels = () => stored().disc.map((d) => [d.nome, d.nivel]);
  const predatorMerits = () =>
    (stored().meritos ?? [])
      .filter((m) => m.origem === "predador")
      .map((m) => m.nome);

  it("escolha de uma opção seleciona só uma", async () => {
    renderWizard(completeSheet(), "/criar?passo=6");
    click(await screen.findByRole("button", { name: SANGUESSUGA }));
    click("Evitado");
    expect(pressed("Evitado")).toBe("true");
    expect(pressed("Segredo Obscuro (diablerista)")).toBe("false");
  });

  it("dividir limita os pontos ao total e bloqueia incompleto", async () => {
    renderWizard(completeSheet(), "/criar?passo=6");
    click(await screen.findByRole("button", { name: OSIRIS }));
    click("Pontos em Rebanho 2");
    click("Pontos em Fama 2");
    expect(pressed("Pontos em Fama 1")).toBe("true");
    expect(pressed("Pontos em Fama 2")).toBe("false");
    click("Continuar");
    expect(await stepToast()).toHaveTextContent(
      "Distribua 2 pontos entre Inimigo e Defeito Mítico"
    );
  });

  describe("poder do Predador", () => {
    const ventrue = () =>
      completeSheet({
        cla: "Ventrue",
        disc: [
          {
            nivel: 2,
            nome: "Dominação",
            powers: [{ nivel: 1, nome: "Compelir" }],
          },
          { nivel: 1, nome: "Presença", powers: [] },
        ],
        predador: "",
        predDisc: "",
        predEspec: "",
        predPoder: "",
      });
    const open = async () => {
      renderWizard(ventrue(), "/criar?passo=6");
      click(await screen.findByRole("button", { name: EXTORSIONARIO }));
      click("Intimidação (Coerção)");
    };

    it("cartões mostram o contexto do clã", async () => {
      await open();
      expect(screen.getByRole("button", { name: DOMINACAO })).toHaveTextContent(
        "do clã · 2 → 3"
      );
      expect(screen.getByRole("button", { name: POTENCIA })).toHaveTextContent(
        "fora do clã · nível 1"
      );
    });

    it("fora do clã: selo, slot de nível 1 e só poderes de nível 1", async () => {
      await open();
      click(POTENCIA);
      expect(screen.getByText("Fora do clã")).toBeInTheDocument();
      expect(screen.getByText("1 poder sem escolha")).toBeInTheDocument();
      expect(screen.getByText("Nível 1 · Potência")).toBeInTheDocument();
      expect(
        screen.getByText(
          "Potência não é Disciplina do clã Ventrue. Entra com 1 ponto e 1 poder de nível 1. Subir depois custa mais XP."
        )
      ).toBeInTheDocument();
      expect(
        screen.queryByRole("button", { name: "Incluir Alimentação Brutal" })
      ).toBeNull();
    });

    it("do clã: até o novo nível, sem repetir o passo 5", async () => {
      await open();
      click(DOMINACAO);
      expect(screen.getByText("Do clã")).toBeInTheDocument();
      expect(
        screen.getByText("Nível 3 ou inferior · Dominação")
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          "Você já tem 2 pontos em Dominação pelo clã. O Predador soma +1 e ela vai a 3. Escolha 1 poder novo de nível 3 ou inferior."
        )
      ).toBeInTheDocument();
      expect(
        screen.queryByRole("button", { name: "Incluir Compelir" })
      ).toBeNull();
    });

    it("escolher, trocar e exigir o poder", async () => {
      await open();
      click(POTENCIA);
      click("Continuar");
      expect(await stepToast()).toHaveTextContent(
        "Escolha um poder de Potência"
      );
      click("Incluir Corpo Letal");
      click("Incluir Salto Elevado");
      expect(screen.getByText("Poder escolhido")).toBeInTheDocument();
      expect(pressed("Remover Salto Elevado")).toBe("true");
      expect(pressed("Incluir Corpo Letal")).toBe("false");
    });

    it("nome do poder abre o painel sem escolher", async () => {
      await open();
      click(POTENCIA);
      click("Corpo Letal");
      expect(
        await screen.findByRole("dialog", { name: "Corpo Letal" })
      ).toBeInTheDocument();
      expect(
        screen
          .getByRole("button", { hidden: true, name: "Incluir Corpo Letal" })
          .getAttribute("aria-pressed")
      ).toBe("false");
    });

    it("trocar a Disciplina limpa o poder", async () => {
      await open();
      click(POTENCIA);
      click("Incluir Corpo Letal");
      click(DOMINACAO);
      click(POTENCIA);
      expect(screen.getByText("1 poder sem escolha")).toBeInTheDocument();
    });

    it("Feitiçaria de Sangue fora de Tremere e Banu Haqim fica desabilitada", async () => {
      renderWizard(completeSheet(), "/criar?passo=6");
      click(await screen.findByRole("button", { name: OSIRIS }));
      const feiticaria = screen.getByRole("button", { name: FEITICARIA });
      expect(feiticaria).toBeDisabled();
      expect(feiticaria).toHaveTextContent("só Tremere e Banu Haqim");
      expect(screen.getByRole("button", { name: PRESENCA })).toBeEnabled();
    });

    it("Feitiçaria de Sangue liberada para Banu Haqim", async () => {
      renderWizard(
        completeSheet({
          cla: "Banu Haqim",
          disc: [
            { nivel: 2, nome: "Celeridade", powers: [] },
            { nivel: 1, nome: "Ofuscação", powers: [] },
          ],
        }),
        "/criar?passo=6"
      );
      click(await screen.findByRole("button", { name: SAQUEADOR }));
      expect(screen.getByRole("button", { name: FEITICARIA })).toBeEnabled();
    });
  });

  it("Predador vetado para o clã aparece desabilitado com o motivo", async () => {
    renderWizard(
      completeSheet({
        cla: "Ventrue",
        disc: [
          { nivel: 2, nome: "Dominação", powers: [] },
          { nivel: 1, nome: "Presença", powers: [] },
        ],
        predador: "Fazendeiro",
      }),
      "/criar?passo=6"
    );
    const fazendeiro = await screen.findByRole("button", { name: FAZENDEIRO });
    expect(fazendeiro).toBeDisabled();
    expect(fazendeiro).toHaveAttribute("aria-pressed", "true");
    expect(fazendeiro).toHaveTextContent("Ventrue não pode ser Fazendeiro");
    const saqueador = screen.getByRole("button", { name: SAQUEADOR });
    expect(saqueador).toBeDisabled();
    click(saqueador);
    expect(saqueador).toHaveAttribute("aria-pressed", "false");
    click("Continuar");
    expect(await stepToast()).toHaveTextContent(
      "Ventrue não pode ser Fazendeiro"
    );
  });

  describe("nome da especialidade do Predador", () => {
    const open = async () => {
      renderWizard(
        completeSheet({ predador: "", predDisc: "", predEspec: "" }),
        "/criar?passo=6"
      );
      click(await screen.findByRole("button", { name: EXTORSIONARIO }));
      click("Ladroagem (Segurança)");
    };

    it("escolher a especialidade preenche a sugestão", async () => {
      await open();
      expect(screen.getByLabelText("Especialidade em Ladroagem")).toHaveValue(
        "Segurança"
      );
      expect(
        screen.getByText(
          "Sugestão do Predador: Segurança. Renomeie se quiser; na ficha ela fica fixa."
        )
      ).toBeInTheDocument();
    });

    it("trocar de especialidade repõe a sugestão; repetir não apaga", async () => {
      await open();
      fireEvent.change(screen.getByLabelText("Especialidade em Ladroagem"), {
        target: { value: "Cofres e alarmes" },
      });
      click("Ladroagem (Segurança)");
      expect(screen.getByLabelText("Especialidade em Ladroagem")).toHaveValue(
        "Cofres e alarmes"
      );
      click("Intimidação (Coerção)");
      expect(screen.getByLabelText("Especialidade em Intimidação")).toHaveValue(
        "Coerção"
      );
    });

    it("nome vazio bloqueia; renomeado é gravado", async () => {
      await open();
      click(POTENCIA);
      click("Incluir Corpo Letal");
      click("Pontos em Contatos 1");
      click("Pontos em Recursos 2");
      const field = screen.getByLabelText("Especialidade em Ladroagem");
      fireEvent.change(field, { target: { value: " " } });
      click("Continuar");
      expect(await stepToast()).toHaveTextContent(
        "Informe o nome da especialidade do Predador"
      );
      fireEvent.change(field, { target: { value: " Cofres e alarmes " } });
      click("Continuar");
      expect(await screen.findByText("Passo 7 de 8")).toBeInTheDocument();
      expect(stored().predEspec).toBe("Ladroagem (Segurança)");
      expect(stored().predEspecNome).toBe("Cofres e alarmes");
    });
  });

  it("Concluir aplica Disciplina, Humanidade e méritos", async () => {
    renderWizard(completeSheet(), "/criar?passo=8");
    click(await screen.findByText("Concluir"));
    expect(await screen.findByText("Página da ficha")).toBeInTheDocument();
    expect(levels()).toEqual([
      ["Potência", 3],
      ["Celeridade", 1],
    ]);
    expect(stored().disc[0].powers.map((p) => p.nome)).toEqual([
      "Salto Elevado",
    ]);
    expect(stored().humanidade).toBe(6);
    expect(predatorMerits()).toEqual(["Contatos (criminosos)"]);
  });
});
