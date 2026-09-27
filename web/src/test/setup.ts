import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, beforeAll } from "vitest";
import type { fakeApi as FakeApi } from "./fake-api";

let api: typeof FakeApi | undefined;

// o jsdom não tem matchMedia; por padrão nenhuma query casa (tela de desktop)
window.matchMedia = (query: string) => ({
  addEventListener: () => undefined,
  addListener: () => undefined,
  dispatchEvent: () => false,
  matches: false,
  media: query,
  onchange: null,
  removeEventListener: () => undefined,
  removeListener: () => undefined,
});

// importados só aqui, para respeitar o `vi.mock` de cada arquivo de teste
beforeAll(async () => {
  const [{ fakeApi }, { connectSession }] = await Promise.all([
    import("./fake-api"),
    import("#/lib/auth"),
  ]);
  api = fakeApi;
  globalThis.fetch = fakeApi.fetch as typeof fetch;
  connectSession();
});

afterEach(() => {
  cleanup();
  localStorage.clear();
  api?.reset();
});
