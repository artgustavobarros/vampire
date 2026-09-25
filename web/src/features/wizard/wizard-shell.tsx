import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import { type ReactNode, useCallback, useRef, useState } from "react";
import {
  type FieldErrors,
  FormProvider,
  type Resolver,
  useForm,
} from "react-hook-form";
import type { ZodType } from "zod";
import { Button } from "#/components/ui/button";
import { logout } from "#/lib/auth";
import { notify } from "#/lib/toast";
import { cn } from "#/lib/utils";
import { initialAttributes } from "#/rules/wizard";
import { patchSheet, useCharacterStore } from "#/stores/character-store";
import { collectErrorMessages, formatStepErrors } from "./error-messages";
import {
  ALL_FIELDS,
  STEP_SCHEMAS,
  sheetToWizard,
  stepFields,
  type WizardKey,
  type WizardValues,
  wizardToPatch,
} from "./schema";
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
    hint: "Como você caça define perícias e Disciplinas extras. Sangues-ralos não têm.",
    title: "Predador",
  },
  {
    body: Step7Merits,
    hint: "Sete pontos em vantagens, dois em defeitos além dos do Predador.",
    title: "Vantagens e defeitos",
  },
  {
    body: Step8Final,
    hint: "O que faltou para fechar a ficha.",
    title: "Detalhes finais",
  },
];

export const WIZARD_STEPS = STEPS.length;

/** `raw: true` devolve os valores do formulário inteiro, não só os do passo. */
const STEP_RESOLVERS: Resolver<WizardValues>[] = STEP_SCHEMAS.map((schema) =>
  zodResolver(
    // cada schema cobre só um recorte de WizardValues
    schema as unknown as ZodType<WizardValues, WizardValues>,
    undefined,
    { raw: true }
  )
);

export function WizardShell({
  step,
  refazer = false,
}: {
  step: number;
  refazer?: boolean;
}) {
  const navigate = useNavigate();
  const current = STEPS[step - 1];
  const Body = current.body;

  // o resolver é estável e valida sempre com o schema do passo exibido
  const stepRef = useRef(step);
  stepRef.current = step;
  const resolver = useCallback<Resolver<WizardValues>>(
    (values, context, options) =>
      STEP_RESOLVERS[stepRef.current - 1](values, context, options),
    []
  );
  const [defaultValues] = useState(() =>
    sheetToWizard(useCharacterStore.getState().sheet)
  );
  const form = useForm<WizardValues>({
    defaultValues,
    resolver,
    reValidateMode: "onChange",
  });

  /** Grava os campos na ficha e zera erros e estado de envio para o próximo passo. */
  const commit = (fields: readonly WizardKey[], extra: object = {}) => {
    const values = form.getValues();
    patchSheet({
      ...wizardToPatch(values, fields, useCharacterStore.getState().sheet),
      ...extra,
    });
    form.reset(values);
  };

  const go = (passo: number) =>
    navigate({
      search: refazer ? { passo, refazer } : { passo },
      to: "/criar",
    });

  const back = () => {
    commit(stepFields(step));
    if (step > 1) {
      go(step - 1);
    } else if (refazer) {
      navigate({ params: { aba: "ficha" }, to: "/ficha/$aba" });
    } else {
      logout();
      navigate({ to: "/entrar" });
    }
  };

  const next = (values: WizardValues) => {
    if (step === STEPS.length) {
      const patch = wizardToPatch(
        values,
        ALL_FIELDS,
        useCharacterStore.getState().sheet
      );
      commit([], {
        ...patch,
        criada: true,
        disc: (patch.disc ?? []).filter((d) => d.nome.trim()),
      });
      navigate({ params: { aba: "ficha" }, to: "/ficha/$aba" });
      return;
    }
    const fields = [...stepFields(step)];
    if (step === 1) {
      const attrs = initialAttributes(values.attrs);
      if (attrs) {
        form.setValue("attrs", attrs);
        fields.push("attrs");
      }
    }
    commit(fields);
    go(step + 1);
  };

  /** O passo inválido avisa por toast; os campos só ficam marcados. */
  const invalid = (errors: FieldErrors<WizardValues>) => {
    notify(formatStepErrors(collectErrorMessages(errors)), {
      titulo: "Passo incompleto",
    });
  };

  return (
    <div className="mx-auto max-w-205 px-4 py-6">
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <div className="font-label font-semibold text-ink text-xs uppercase leading-none tracking-[.12em]">
          {refazer ? "Refazer personagem" : "Criação de personagem"}
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
      <FormProvider {...form}>
        <form
          className="animate-vfade border border-line bg-surface px-5 py-6"
          key={step}
          noValidate
          onSubmit={form.handleSubmit(next, invalid)}
        >
          <h2 className="mt-0 mb-1 font-semibold text-[32px] leading-[1.2]">
            {current.title}
          </h2>
          <p className="mt-0 mb-6 text-ink-soft text-lg italic">
            {current.hint}
          </p>
          <Body />
          <div className="mt-6 flex gap-3 border-line border-t pt-4">
            <Button onClick={back} type="button" variant="outline">
              Voltar
            </Button>
            <Button className="flex-1" type="submit">
              {step === STEPS.length ? "Concluir" : "Continuar"}
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
