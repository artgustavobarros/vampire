import {
  createContext,
  type ReactNode,
  useContext,
  useMemo,
  useState,
} from "react";
import { Button } from "#/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "#/components/ui/dialog";
import { useSheet } from "#/lib/store";
import { type Flow, type FlowKind, flowView } from "./flows";

interface RuleDialogApi {
  open: (kind: FlowKind, note?: string) => void;
}

const RuleDialogContext = createContext<RuleDialogApi | null>(null);

export function useRuleDialog(): RuleDialogApi {
  const ctx = useContext(RuleDialogContext);
  if (!ctx) {
    throw new Error("useRuleDialog fora do RuleDialogProvider");
  }
  return ctx;
}

/** Diálogo único das ações de regra (Rouse, Dormir, Alimentação, Frenesi, cura agravada). */
export function RuleDialogProvider({ children }: { children: ReactNode }) {
  const [flow, setFlow] = useState<Flow | null>(null);
  const sheet = useSheet();
  const api = useMemo<RuleDialogApi>(
    () => ({
      open: (kind, note = "") => setFlow({ kind, note, stage: "ask" }),
    }),
    []
  );
  const view = flow ? flowView(flow, sheet, setFlow) : null;

  return (
    <RuleDialogContext.Provider value={api}>
      {children}
      <Dialog onOpenChange={(open) => !open && setFlow(null)} open={!!view}>
        {view ? (
          <DialogContent
            className="max-h-[calc(100dvh-40px)] max-w-[420px] animate-vfade gap-0 overflow-y-auto bg-surface p-6 shadow-[0_24px_64px_rgba(0,0,0,.4)] sm:max-w-[420px]"
            overlayClassName="bg-black/70"
            showCloseButton={false}
          >
            <div className="font-label font-semibold text-ink text-xs uppercase leading-none tracking-[.22em]">
              {view.kicker}
            </div>
            <DialogTitle className="mt-3 mb-2 font-semibold font-serif text-2xl leading-tight">
              {view.title}
            </DialogTitle>
            <DialogDescription className="m-0 mb-2 font-serif text-ink-soft text-lg">
              {view.body}
            </DialogDescription>
            {flow?.note ? (
              <p
                className="mt-2 mb-0 border-blood border-l-4 pl-3 text-blood text-lg italic"
                role="status"
              >
                {flow.note}
              </p>
            ) : null}
            <div className="mt-6 flex flex-col gap-2">
              {view.actions.map((a) => (
                <Button
                  className="h-auto w-full whitespace-normal px-3 py-4"
                  key={a.label}
                  onClick={a.run}
                  type="button"
                  variant={a.primary ? "default" : "outline"}
                >
                  {a.label}
                </Button>
              ))}
            </div>
          </DialogContent>
        ) : null}
      </Dialog>
    </RuleDialogContext.Provider>
  );
}
