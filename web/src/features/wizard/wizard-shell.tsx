import { useNavigate } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { Button } from "#/components/ui/button";
import { logout } from "#/lib/auth";
import { patchSheet, store, useSheet } from "#/lib/store";
import { cn } from "#/lib/utils";
import { initialAttributes } from "#/rules/wizard";
import { Step1Clan } from "./step1-clan";
import { Step2Attributes } from "./step2-attributes";
import { Step3Skills } from "./step3-skills";
import { Step4Specialties } from "./step4-specialties";
import { Step5Disciplines } from "./step5-disciplines";
import { Step6Predator } from "./step6-predator";
import { Step7Merits } from "./step7-merits";
import { Step8Final } from "./step8-final";

const STEPS: { title: string; hint: string; body: () => ReactNode }[] = [
  {
    body: Step1Clan,
    hint: "O clã define as Disciplinas iniciais e a Perdição.",
    title: "Clã e senhor",
  },
  {
    body: Step2Attributes,
    hint: "Vitalidade e Força de Vontade saem daqui.",
    title: "Atributos",
  },
  {
    body: Step3Skills,
    hint: "Escolha o formato de distribuição e aplique os pontos.",
    title: "Habilidades",
  },
  {
    body: Step4Specialties,
    hint: "Perícias amplas exigem uma especialidade.",
    title: "Especialidades",
  },
  {
    body: Step5Disciplines,
    hint: "Duas Disciplinas do clã e a Potência de Sangue.",
    title: "Disciplinas",
  },
  {
    body: Step6Predator,
    hint: "Como você caça define perícias e Disciplinas extras.",
    title: "Predador",
  },
  {
    body: Step7Merits,
    hint: "Sete pontos em vantagens, dois em defeitos.",
    title: "Vantagens e defeitos",
  },
  {
    body: Step8Final,
    hint: "O que faltou para fechar a ficha.",
    title: "Detalhes finais",
  },
];

export const WIZARD_STEPS = STEPS.length;

export function WizardShell({ step }: { step: number }) {
  const navigate = useNavigate();
  const sheet = useSheet();
  const current = STEPS[step - 1];
  const Body = current.body;

  const go = (passo: number) => navigate({ search: { passo }, to: "/criar" });

  const back = () => {
    if (step > 1) {
      go(step - 1);
    } else if (sheet.criada) {
      navigate({ params: { aba: "ficha" }, to: "/ficha/$aba" });
    } else {
      logout();
      navigate({ to: "/entrar" });
    }
  };

  const next = () => {
    if (step === 1) {
      const attrs = initialAttributes(store.get().sheet.attrs);
      if (attrs) {
        patchSheet({ attrs });
      }
    }
    if (step === STEPS.length) {
      patchSheet({
        criada: true,
        disc: store.get().sheet.disc.filter((d) => (d.nome ?? "").trim()),
      });
      navigate({ params: { aba: "ficha" }, to: "/ficha/$aba" });
      return;
    }
    go(step + 1);
  };

  return (
    <div className="mx-auto max-w-[820px] px-4 py-6">
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <div className="font-label font-semibold text-ink text-xs uppercase leading-none tracking-[.12em]">
          Criação de personagem
        </div>
        <div className="text-base text-ink-soft">
          Passo {step} de {STEPS.length}
        </div>
      </div>
      <div
        aria-label={`Passo ${step} de ${STEPS.length}`}
        aria-valuemax={STEPS.length}
        aria-valuemin={1}
        aria-valuenow={step}
        className="mt-3 mb-6 flex gap-1"
        role="progressbar"
      >
        {STEPS.map((s, i) => (
          <span
            className={cn("h-1 flex-1", i < step ? "bg-ink" : "bg-line")}
            key={s.title}
          />
        ))}
      </div>
      <div
        className="animate-vfade border border-line bg-surface px-5 py-6"
        key={step}
      >
        <h2 className="mt-0 mb-1 font-semibold text-[32px] leading-[1.2]">
          {current.title}
        </h2>
        <p className="mt-0 mb-6 text-ink-soft text-lg italic">{current.hint}</p>
        <Body />
        <div className="mt-6 flex gap-3 border-line border-t pt-4">
          <Button onClick={back} type="button" variant="outline">
            Voltar
          </Button>
          <Button className="flex-1" onClick={next} type="button">
            {step === STEPS.length ? "Concluir" : "Continuar"}
          </Button>
        </div>
      </div>
    </div>
  );
}
