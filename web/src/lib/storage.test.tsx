import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Toaster } from "#/components/ui/sonner";
import { writeSheet } from "./storage";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("falha de gravação", () => {
  it("avisa uma única vez com toast persistente", async () => {
    render(<Toaster bottom={16} />);
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("QuotaExceededError");
    });
    writeSheet("ana@exemplo.com", {});
    writeSheet("ana@exemplo.com", {});

    const alerts = await screen.findAllByRole("alert");
    expect(alerts).toHaveLength(1);
    expect(alerts[0]).toHaveTextContent("Não salvou");
  });
});
