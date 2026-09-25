import { Controller, useWatch } from "react-hook-form";
import { FieldLegend, FieldSet } from "#/components/ui/field";
import { DotRating } from "#/components/vtm/dot-rating";
import { PowerCard } from "#/components/vtm/power-card";
import { SelectableCard } from "#/components/vtm/selectable";
import { autoFit } from "#/components/vtm/trait-grid";
import type { PowerTemplate } from "#/data/disciplines";
import {
  findPredator,
  PREDATORS,
  type PredatorAdjustment,
} from "#/data/predators";
import { cn } from "#/lib/utils";
import {
  choiceOptionLabel,
  choiceTotal,
  type PredatorDiscipline,
  predatorDiscipline,
  predatorPower,
} from "#/rules/predator";
import { isThinBlood } from "#/rules/wizard";
import { useWizardForm } from "./form-fields";

type Choice = Extract<PredatorAdjustment, { kind: "escolha" }>;

/** Cor da borda de cada ajuste: custo em sangue, ganho em verde. */
function adjustmentTone(a: PredatorAdjustment): string {
  switch (a.kind) {
    case "humanidade":
    case "potencia":
      return a.valor < 0 ? "border-l-blood" : "border-l-moss";
    case "merito":
    case "escolha":
      return a.tipo === "defeito" ? "border-l-blood" : "border-l-moss";
    default:
      return "border-l-blood";
  }
}

const LABEL =
  "font-label font-semibold text-xs uppercase leading-none tracking-widest text-ink/60";

export function Step6Predator() {
  const { control, setValue } = useWizardForm();
  const [cla, predador, predEspec, predDisc, predPoder] = useWatch({
    control,
    name: ["cla", "predador", "predEspec", "predDisc", "predPoder"],
  });
  if (isThinBlood(cla)) {
    return (
      <div className="border border-line bg-wash p-4 text-base">
        Sangues-ralos não têm Tipo de Predador. Siga para o próximo passo.
      </div>
    );
  }
  const predator = findPredator(predador);
  return (
    <>
      <Controller
        control={control}
        name="predador"
        render={({ field, fieldState }) => (
          <FieldSet
            className="outline-none"
            data-invalid={fieldState.invalid}
            ref={field.ref}
            tabIndex={-1}
          >
            <FieldLegend className="sr-only">Tipo de predador</FieldLegend>
            <div className="grid gap-2" style={autoFit(220)}>
              {PREDATORS.map((p) => (
                <SelectableCard
                  key={p.name}
                  onClick={() => {
                    if (p.name !== field.value) {
                      setValue("predEspec", "");
                      setValue("predDisc", "");
                      setValue("predPoder", "");
                      setValue("predEscolhas", {});
                    }
                    field.onChange(p.name);
                  }}
                  selected={field.value === p.name}
                >
                  <span className="block font-label font-semibold text-xs leading-none tracking-[.02em]">
                    {p.name}
                  </span>
                  <span className="mt-1 block text-base leading-snug opacity-70">
                    {p.description}
                  </span>
                </SelectableCard>
              ))}
            </div>
          </FieldSet>
        )}
      />
      {predator && (
        <div className="mt-5 flex flex-col gap-4 border border-line p-4">
          <SpecialtyGroup options={predator.specialties} />
          <DisciplineGroup options={predator.disciplines} />
          <div className="flex flex-col gap-2">
            <span className={LABEL}>Ajustes obrigatórios</span>
            {predator.adjustments.map((a) => (
              <div
                className={cn(
                  "border-l-2 py-1 pl-3 text-base",
                  adjustmentTone(a)
                )}
                key={a.label}
              >
                {a.label}
                {a.kind === "escolha" && <ChoicePicker choice={a} />}
              </div>
            ))}
          </div>
          <div className="text-sm opacity-70">
            {predEspec && predDisc
              ? `Predador definido: ${predator.name} · ${predEspec} · +1 ${predDisc}${predPoder ? ` (${predPoder})` : ""}`
              : "Escolha uma especialidade e uma Disciplina para completar o Predador."}
          </div>
        </div>
      )}
    </>
  );
}

const TOGGLE =
  "cursor-pointer border px-3 py-2 text-base leading-tight focus-visible:outline-2 focus-visible:outline-ink";

function SpecialtyGroup({ options }: { options: readonly string[] }) {
  const { control } = useWizardForm();
  return (
    <Controller
      control={control}
      name="predEspec"
      render={({ field, fieldState }) => (
        <FieldSet
          className="gap-2 outline-none"
          data-invalid={fieldState.invalid}
          ref={field.ref}
          tabIndex={-1}
        >
          <FieldLegend className="mb-4">
            Especialidade — escolha uma
          </FieldLegend>
          <div className="flex flex-wrap gap-2">
            {options.map((o) => (
              <button
                aria-pressed={field.value === o}
                className={cn(
                  TOGGLE,
                  field.value === o
                    ? "border-moss bg-field"
                    : "border-ink/20 bg-transparent"
                )}
                key={o}
                onClick={() => field.onChange(o)}
                type="button"
              >
                {o}
              </button>
            ))}
          </div>
        </FieldSet>
      )}
    />
  );
}

/** Cartões da Disciplina do Predador, com o contexto do clã, e o painel do poder. */
function DisciplineGroup({ options }: { options: readonly string[] }) {
  const { control, setValue } = useWizardForm();
  const [cla, disc] = useWatch({ control, name: ["cla", "disc"] });
  return (
    <Controller
      control={control}
      name="predDisc"
      render={({ field, fieldState }) => (
        <FieldSet
          className="gap-2 outline-none"
          data-invalid={fieldState.invalid}
          ref={field.ref}
          tabIndex={-1}
        >
          <FieldLegend className="mb-4">
            Disciplina — um ponto em uma
          </FieldLegend>
          <div className="flex flex-wrap gap-2">
            {options.map((o) => {
              const ctx = predatorDiscipline(cla, disc, o);
              let note = "fora do clã · nível 1";
              if (ctx.doCla) {
                note = ctx.atual
                  ? `do clã · ${ctx.atual} → ${ctx.novo}`
                  : "do clã · nível 1";
              }
              return (
                <button
                  aria-pressed={field.value === o}
                  className={cn(
                    TOGGLE,
                    "min-w-34 text-left",
                    field.value === o
                      ? "border-moss bg-field"
                      : "border-ink/20 bg-transparent"
                  )}
                  key={o}
                  onClick={() => {
                    if (o !== field.value) {
                      setValue("predPoder", "");
                    }
                    field.onChange(o);
                  }}
                  type="button"
                >
                  <span className="block">{o}</span>
                  <span
                    className={cn(
                      "mt-1 block font-label font-semibold text-xs tracking-[.02em]",
                      ctx.doCla ? "text-ink-soft" : "text-blood"
                    )}
                  >
                    {note}
                  </span>
                </button>
              );
            })}
          </div>
          {field.value && options.includes(field.value) && (
            <PowerPanel
              cla={cla}
              ctx={predatorDiscipline(cla, disc, field.value)}
              nome={field.value}
            />
          )}
        </FieldSet>
      )}
    />
  );
}

/** Texto do painel: de onde vem o ponto e até que nível vai o poder. */
function powerPanelText(
  { atual, doCla, novo }: PredatorDiscipline,
  nome: string,
  cla: string
): string {
  if (!doCla) {
    return `${nome} não é Disciplina do clã ${cla}. Entra com 1 ponto e 1 poder de nível 1. Subir depois custa mais XP.`;
  }
  if (!atual) {
    return `${nome} é do clã, mas não recebeu pontos no passo 5. Entra com 1 ponto e 1 poder de nível 1.`;
  }
  return `Você já tem ${atual} ${atual === 1 ? "ponto" : "pontos"} em ${nome} pelo clã. O Predador soma +1 e ela vai a ${novo}. Escolha 1 poder novo de nível ${novo} ou inferior.`;
}

/** Painel "Poder do Predador": selo do clã, pontos antes/depois e a escolha do poder. */
function PowerPanel({
  cla,
  ctx,
  nome,
}: {
  cla: string;
  ctx: PredatorDiscipline;
  nome: string;
}) {
  const { control } = useWizardForm();
  const levelTitle =
    ctx.novo > 1
      ? `Nível ${ctx.novo} ou inferior · ${nome}`
      : `Nível 1 · ${nome}`;
  return (
    <div
      className={cn(
        "mt-3 flex flex-col gap-4 border bg-surface p-4",
        ctx.doCla ? "border-line" : "border-blood"
      )}
    >
      <div className="flex flex-wrap items-center gap-3">
        <span className={LABEL}>Poder do Predador</span>
        <span className="font-serif text-2xl leading-none">{nome}</span>
        <span
          className={cn(
            "px-2 py-1 font-label font-semibold text-white text-xs uppercase leading-none tracking-widest",
            ctx.doCla ? "bg-ink" : "bg-blood"
          )}
        >
          {ctx.doCla ? "Do clã" : "Fora do clã"}
        </span>
        <span
          aria-label={`${ctx.atual} ${ctx.atual === 1 ? "ponto" : "pontos"} do clã e 1 do Predador`}
          className="ml-auto flex gap-1"
          role="img"
        >
          {Array.from({ length: ctx.atual }, (_, i) => (
            <span className="size-4 rounded-full bg-ink" key={i} />
          ))}
          <span className="size-4 rounded-full bg-blood" />
        </span>
      </div>
      <p className="m-0 max-w-lg text-base text-ink-soft">
        {powerPanelText(ctx, nome, cla)}
      </p>
      {ctx.elegiveis.length ? (
        <Controller
          control={control}
          name="predPoder"
          render={({ field, fieldState }) => {
            const chosen = predatorPower(ctx, field.value);
            return (
              <FieldSet
                className="gap-3 outline-none"
                data-invalid={fieldState.invalid}
                ref={field.ref}
                tabIndex={-1}
              >
                <FieldLegend className="sr-only">
                  Poder do Predador em {nome}
                </FieldLegend>
                <PowerSlot chosen={chosen} levelTitle={levelTitle} />
                <div className="flex flex-wrap gap-2">
                  {ctx.elegiveis.map((p) => (
                    <PowerCard
                      disc={nome}
                      key={p.name}
                      onToggle={() =>
                        field.onChange(chosen?.name === p.name ? "" : p.name)
                      }
                      power={p}
                      selected={chosen?.name === p.name}
                    />
                  ))}
                </div>
              </FieldSet>
            );
          }}
        />
      ) : (
        <p className="m-0 text-base text-ink-soft">
          Sem poderes catalogados para {nome}. Registre o poder na aba
          Disciplinas depois.
        </p>
      )}
    </div>
  );
}

/** Slot do poder do Predador: tracejado em Blood até haver escolha. */
function PowerSlot({
  chosen,
  levelTitle,
}: {
  chosen: PowerTemplate | undefined;
  levelTitle: string;
}) {
  const text = chosen
    ? {
        detail: `Nível ${chosen.level} · ${chosen.cost}`,
        kicker: "Poder escolhido",
        mark: String(chosen.level),
        title: chosen.name,
      }
    : {
        detail: "Escolha um poder da lista abaixo.",
        kicker: "1 poder sem escolha",
        mark: "+",
        title: levelTitle,
      };
  return (
    <div
      className={cn(
        "flex items-center gap-4 border p-4",
        chosen ? "border-ink bg-field" : "border-blood border-dashed bg-blood/5"
      )}
    >
      <span
        className={cn(
          "grid size-10 flex-none place-items-center border font-label font-semibold text-sm",
          chosen
            ? "border-ink text-ink"
            : "border-blood border-dashed text-blood"
        )}
      >
        {text.mark}
      </span>
      <span className="min-w-0 flex-1">
        <span
          className={cn(LABEL, "block", chosen ? "text-moss" : "text-blood")}
        >
          {text.kicker}
        </span>
        <span className="mt-2 block font-serif text-xl leading-tight">
          {text.title}
        </span>
        <span className="mt-1 block text-base text-ink-soft">
          {text.detail}
        </span>
      </span>
    </div>
  );
}

/** Seletor de um ajuste com escolha: uma opção ou pontos divididos. */
function ChoicePicker({ choice }: { choice: Choice }) {
  const { control } = useWizardForm();
  return (
    <Controller
      control={control}
      defaultValue={{}}
      name={`predEscolhas.${choice.id}`}
      render={({ field, fieldState }) => {
        const picked = field.value ?? {};
        return (
          <FieldSet
            className="mt-2 gap-2 outline-none"
            data-invalid={fieldState.invalid}
            ref={field.ref}
            tabIndex={-1}
          >
            <FieldLegend className="sr-only">{choice.label}</FieldLegend>
            {choice.modo === "uma" ? (
              <div className="flex flex-wrap gap-2">
                {choice.opcoes.map((o) => {
                  const on = (picked[o.nome] || 0) > 0;
                  return (
                    <button
                      aria-pressed={on}
                      className={cn(
                        TOGGLE,
                        on
                          ? "border-moss bg-field"
                          : "border-ink/20 bg-transparent"
                      )}
                      key={o.nome}
                      onClick={() =>
                        field.onChange({ [o.nome]: choice.pontos })
                      }
                      type="button"
                    >
                      {choiceOptionLabel(o)}
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {choice.opcoes.map((o) => {
                  const others = choiceTotal(picked) - (picked[o.nome] || 0);
                  return (
                    <div className="flex items-center gap-3" key={o.nome}>
                      <span className="w-32">{choiceOptionLabel(o)}</span>
                      <DotRating
                        count={choice.pontos}
                        label={`Pontos em ${o.nome}`}
                        onChange={(v) =>
                          field.onChange({
                            ...picked,
                            [o.nome]: Math.min(v, choice.pontos - others),
                          })
                        }
                        size="sm"
                        value={picked[o.nome] || 0}
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </FieldSet>
        );
      }}
    />
  );
}
