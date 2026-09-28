import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useDebouncedSave } from "./use-debounced-save";
import { usePolling } from "./use-polling";

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe("useDebouncedSave", () => {
  it("grava só o último valor depois da espera", () => {
    const save = vi.fn().mockResolvedValue(undefined);
    const { result } = renderHook(() => useDebouncedSave(save, 500));
    act(() => {
      result.current.schedule("a");
      result.current.schedule("ab");
    });
    vi.advanceTimersByTime(499);
    expect(save).not.toHaveBeenCalled();
    vi.advanceTimersByTime(1);
    expect(save).toHaveBeenCalledOnce();
    expect(save).toHaveBeenCalledWith("ab", { keepalive: undefined });
  });

  it("envia o pendente ao desmontar, com keepalive", () => {
    const save = vi.fn().mockResolvedValue(undefined);
    const { result, unmount } = renderHook(() => useDebouncedSave(save));
    act(() => result.current.schedule(1));
    unmount();
    expect(save).toHaveBeenCalledWith(1, { keepalive: true });
  });

  it("sem pendência, desmontar não grava", () => {
    const save = vi.fn().mockResolvedValue(undefined);
    const { unmount } = renderHook(() => useDebouncedSave(save));
    unmount();
    expect(save).not.toHaveBeenCalled();
  });
});

describe("usePolling", () => {
  it("chama ao montar e a cada intervalo com a página visível", () => {
    const fn = vi.fn();
    const { unmount } = renderHook(() => usePolling(fn, 5000));
    expect(fn).toHaveBeenCalledTimes(1);
    vi.advanceTimersByTime(5000);
    expect(fn).toHaveBeenCalledTimes(2);
    unmount();
    vi.advanceTimersByTime(10_000);
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it("não chama com a página oculta e recarrega ao voltar", () => {
    const fn = vi.fn();
    const state = vi.spyOn(document, "visibilityState", "get");
    state.mockReturnValue("hidden");
    renderHook(() => usePolling(fn, 5000));
    vi.advanceTimersByTime(15_000);
    expect(fn).toHaveBeenCalledTimes(1);
    state.mockReturnValue("visible");
    document.dispatchEvent(new Event("visibilitychange"));
    expect(fn).toHaveBeenCalledTimes(2);
    state.mockRestore();
  });
});
