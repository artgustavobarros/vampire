import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "#/components/ui/dialog";
import { store, useAppState } from "#/lib/store";
import { cn } from "#/lib/utils";

const COPY = {
  0: {
    kicker: "Saciado",
    text: "Sua Fome está em 0. A Besta está quieta, mas o próximo Rouse Check já volta a subir a Fome.",
    title: "Fome 0",
  },
  5: {
    kicker: "A Besta desperta",
    text: "Você está à beira do frenesi. Resistir à Fome agora exige teste de frenesi e qualquer falha bestial vira Compulsão. Alimente-se.",
    title: "Fome 5",
  },
} as const;

/** Alerta em tela cheia quando a Fome chega a 5 ou a 0. */
export function HungerAlert() {
  const { hungerAlert } = useAppState();
  const copy = hungerAlert === null ? null : COPY[hungerAlert];
  const beast = hungerAlert === 5;
  return (
    <Dialog
      onOpenChange={(open) => !open && store.dismissHungerAlert()}
      open={!!copy}
    >
      {copy ? (
        <DialogContent
          className={cn(
            "z-[70] max-w-[400px] animate-vfade gap-0 border-t-4 bg-surface p-6 shadow-[0_24px_64px_rgba(0,0,0,.55)] sm:max-w-[400px]",
            beast ? "border-t-ember" : "border-t-moss"
          )}
          onClick={() => store.dismissHungerAlert()}
          overlayClassName="z-[70] bg-black/80"
          showCloseButton={false}
        >
          <div
            className={cn(
              "font-label font-semibold text-xs uppercase leading-none tracking-[.22em]",
              beast ? "text-ember" : "text-moss"
            )}
          >
            {copy.kicker}
          </div>
          <DialogTitle className="mt-3 font-normal font-serif text-4xl text-ink leading-tight">
            {copy.title}
          </DialogTitle>
          <DialogDescription className="mt-3 font-label text-ink/55 text-sm leading-relaxed">
            {copy.text}
          </DialogDescription>
          <button
            className={cn(
              "mt-6 cursor-pointer px-5 py-3 text-center font-label font-semibold text-white text-xs uppercase leading-none tracking-[.14em]",
              beast ? "bg-ember" : "bg-moss"
            )}
            onClick={() => store.dismissHungerAlert()}
            type="button"
          >
            Entendido
          </button>
        </DialogContent>
      ) : null}
    </Dialog>
  );
}
