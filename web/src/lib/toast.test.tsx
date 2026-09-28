import { render, screen } from "@testing-library/react";
import { toast } from "sonner";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { apiError, notify } from "./toast";

vi.mock("sonner", () => ({
  toast: { custom: vi.fn(), dismiss: vi.fn() },
}));

const custom = vi.mocked(toast.custom);
const dismiss = vi.mocked(toast.dismiss);

/** Renderiza o último toast disparado. */
function renderLast() {
  const jsx = custom.mock.calls.at(-1)?.[0];
  if (!jsx) {
    throw new Error("nenhum toast");
  }
  return render(jsx("x"));
}

function lastOptions() {
  return custom.mock.calls.at(-1)?.[1];
}

beforeEach(() => {
  // fecha tudo que ficou aberto de outro teste
  for (const call of custom.mock.calls) {
    call[1]?.onDismiss?.({ id: call[1].id } as never);
  }
  custom.mockClear();
  dismiss.mockClear();
});

afterEach(() => {
  vi.clearAllMocks();
});

describe("notify", () => {
  it("erro dura 6s com rótulo padrão", () => {
    notify("Senha incorreta.");
    expect(lastOptions()?.duration).toBe(6000);
    renderLast();
    expect(screen.getByRole("alert")).toHaveTextContent("Algo deu errado");
    expect(screen.getByRole("alert")).toHaveTextContent("Senha incorreta.");
  });

  it("ok e info duram 3,5s com rótulos próprios", () => {
    notify("Salvo.", { tom: "ok" });
    expect(lastOptions()?.duration).toBe(3500);
    renderLast();
    expect(screen.getByText("Feito")).toBeInTheDocument();
  });

  it("duracao 0 é persistente", () => {
    notify("Fica.", { duracao: 0 });
    expect(lastOptions()?.duration).toBe(Number.POSITIVE_INFINITY);
  });

  it("mensagem repetida reusa o mesmo id", () => {
    notify("Senha incorreta.");
    notify("Senha incorreta.");
    const ids = custom.mock.calls.map((c) => c[1]?.id);
    expect(ids[0]).toBe(ids[1]);
    expect(dismiss).not.toHaveBeenCalled();
  });

  it("descarta o mais antigo além de três", () => {
    notify("a");
    notify("b");
    notify("c");
    notify("d");
    expect(dismiss).toHaveBeenCalledWith("v:a");
  });
});

describe("apiError", () => {
  it.each([
    [401, "Sua sessão expirou. Entre de novo para continuar."],
    [403, "Você não tem permissão para fazer isso."],
    [404, "Não encontramos o que você pediu."],
    [
      409,
      "Essa ficha foi alterada em outro lugar. Recarregue antes de salvar.",
    ],
    [422, "Algum campo foi recusado. Revise e tente de novo."],
    [503, "O servidor falhou ao responder. Nada foi perdido; tente de novo."],
  ])("status %i", (status, msg) => {
    apiError({ status });
    renderLast();
    expect(screen.getByRole("alert")).toHaveTextContent(`Erro ${status}`);
    expect(screen.getByRole("alert")).toHaveTextContent(msg);
  });

  it("403 usa a mensagem do servidor", () => {
    apiError({ message: "Apenas o Mestre pode fazer isso.", status: 403 });
    renderLast();
    expect(
      screen.getByText("Apenas o Mestre pode fazer isso.")
    ).toBeInTheDocument();
  });

  it("400 usa a mensagem do servidor", () => {
    apiError({ message: "Nome obrigatório.", status: 400 });
    renderLast();
    expect(screen.getByText("Nome obrigatório.")).toBeInTheDocument();
  });

  it("sem status vira Sem conexão com Tentar de novo", () => {
    const retry = vi.fn();
    apiError(new TypeError("Failed to fetch"), retry);
    renderLast();
    expect(screen.getByText("Sem conexão")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Não foi possível falar com o servidor. Verifique a conexão."
      )
    ).toBeInTheDocument();
    screen.getByRole("button", { name: "Tentar de novo" }).click();
    expect(retry).toHaveBeenCalledOnce();
  });
});
