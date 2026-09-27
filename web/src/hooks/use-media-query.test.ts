import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useMediaQuery } from "./use-media-query";

afterEach(() => {
  vi.restoreAllMocks();
});

/** matchMedia controlável: `set` muda o resultado e avisa quem escuta `change`. */
function stubMatchMedia(initial: boolean) {
  let matches = initial;
  const listeners = new Set<() => void>();
  vi.spyOn(window, "matchMedia").mockImplementation(
    (query) =>
      ({
        addEventListener: (_: string, fn: () => void) => listeners.add(fn),
        get matches() {
          return matches;
        },
        media: query,
        removeEventListener: (_: string, fn: () => void) =>
          listeners.delete(fn),
      }) as unknown as MediaQueryList
  );
  return {
    set(next: boolean) {
      matches = next;
      for (const fn of listeners) {
        fn();
      }
    },
  };
}

describe("useMediaQuery", () => {
  it("devolve o valor atual da media query", () => {
    stubMatchMedia(true);
    const { result } = renderHook(() => useMediaQuery("(max-width: 640px)"));
    expect(result.current).toBe(true);
  });

  it("atualiza quando a media query muda", () => {
    const media = stubMatchMedia(false);
    const { result } = renderHook(() => useMediaQuery("(max-width: 640px)"));
    expect(result.current).toBe(false);

    act(() => media.set(true));
    expect(result.current).toBe(true);

    act(() => media.set(false));
    expect(result.current).toBe(false);
  });
});
