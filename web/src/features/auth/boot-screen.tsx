import { Kicker } from "#/components/vtm/text";

export function BootScreen() {
  return (
    <div className="grid min-h-screen place-items-center px-4 py-8">
      <div
        aria-busy="true"
        className="flex w-full max-w-105 flex-col items-center gap-5"
        role="status"
      >
        <div className="size-8 animate-vspin rounded-full border border-line border-l-2 border-l-blood" />
        <Kicker>Vampiro · A Máscara</Kicker>
        <div className="text-center text-ink-soft text-lg italic">
          Abrindo a ficha…
        </div>
        <div className="mt-2 flex w-full flex-col gap-2">
          <div className="h-3 animate-vpulse bg-line" />
          <div className="h-3 w-[72%] animate-vpulse bg-line [animation-delay:.15s]" />
          <div className="h-3 w-[48%] animate-vpulse bg-line [animation-delay:.3s]" />
        </div>
      </div>
    </div>
  );
}
