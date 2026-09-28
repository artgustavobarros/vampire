import {
  type ComponentType,
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
import type { Sheet } from "#/lib/types";
import { cn } from "#/lib/utils";
import type { ActionResult } from "#/rules/actions";
import { patchSheet, useSheet } from "#/stores/character-store";
import { DamageForm } from "./damage-form";
import { FeedForm } from "./feed-form";
import { type Flow, type FlowKind, flowView } from "./flows";
import { HealForm } from "./heal-form";

interface FormProps {
  onApply: (result: ActionResult) => void;
  onCancel: () => void;
  sheet: Sheet;
}

/** Fluxos cujo estágio "ask" é um formulário no lugar da lista de botões. */
const FORMS: Partial<Record<FlowKind, ComponentType<FormProps>>> = {
  damage: DamageForm,
  feed: FeedForm,
  heal: HealForm,
};

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

/** Diálogo único das ações de regra (Checagem de sangue, Dormir, Alimentação, Dano, Cura, Frenesi, cura agravada). */
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
  const formKind = flow?.stage === "ask" && FORMS[flow.kind] ? flow.kind : null;
  const Form = formKind ? FORMS[formKind] : undefined;
  const applyForm = (r: ActionResult) => {
    if (!formKind) {
      return;
    }
    patchSheet(r.patch);
    setFlow({ kind: formKind, note: r.note, stage: "done" });
  };

  return (
    <RuleDialogContext.Provider value={api}>
      {children}
      <Dialog onOpenChange={(open) => !open && setFlow(null)} open={!!view}>
        {view ? (
          <DialogContent
            className="max-h-[calc(100dvh-40px)] max-w-105 animate-vfade gap-0 overflow-y-auto bg-surface p-6 shadow-[0_24px_64px_rgba(0,0,0,.4)] sm:max-w-105"
            overlayClassName="bg-black/70"
            showCloseButton={false}
          >
            <div className="font-label font-semibold text-ink text-xs uppercase leading-none tracking-[.22em]">
              {view.kicker}
            </div>
            <DialogTitle className="mt-3 mb-2 font-semibold font-serif text-2xl leading-tight">
              {view.title}
            </DialogTitle>
            <DialogDescription
              className={cn(
                "m-0 mb-2 font-serif text-ink-soft text-lg",
                (formKind === "damage" || formKind === "heal") && "sr-only"
              )}
            >
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
            {Form ? (
              <Form
                onApply={applyForm}
                onCancel={() => setFlow(null)}
                sheet={sheet}
              />
            ) : null}
            {formKind ? null : (
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
            )}
          </DialogContent>
        ) : null}
      </Dialog>
    </RuleDialogContext.Provider>
  );
}
