import { Controller, useFieldArray, useWatch } from "react-hook-form";
import { DotRating } from "#/components/vtm/dot-rating";
import { InfoTrigger } from "#/components/vtm/info-trigger";
import { EmptyState } from "#/components/vtm/text";
import {
  findMerit,
  type MeritTemplate,
  meritGroupLabel,
  meritPointOptions,
  meritRangeLabel,
  sameMeritName,
} from "#/data/merits";
import { cn } from "#/lib/utils";
import {
  effectiveMeritKind,
  isThinBlood,
  MERIT_TARGETS,
  meritKinds,
  meritStatus,
} from "#/rules/wizard";
import { useWizardForm } from "./form-fields";
import {
  MERIT_ACTION as ACTION,
  KIND_BG,
  KIND_LABEL,
  KindBadge,
  MeritCombobox,
} from "./merit-combobox";

const FREE_POINTS = [1, 2, 3, 4, 5] as const;

/** Item do catálogo pelo nome (aceita sufixo "(detalhe)"); nomes livres ficam fora. */
function catalogMerit(nome: string): MeritTemplate | undefined {
  const hit = findMerit(nome);
  const base = nome.replace(/\s*\([^)]*\)/g, "");
  return hit && sameMeritName(hit.name, base) ? hit : undefined;
}

const RULE =
  "Distribua 7 pontos em Vantagens e adquira 2 pontos de Defeitos além daqueles obtidos do seu Tipo de Predador.";
const THIN_RULE =
  " Sangues-ralos devem adquirir entre uma e três Qualidades de Sangue-Ralo e a mesma quantidade de Defeitos de Sangue-Ralo.";

export function Step7Merits() {
  const { control } = useWizardForm();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "meritos",
  });
  const [cla, meritos] = useWatch({ control, name: ["cla", "meritos"] });
  const thin = isThinBlood(cla);
  const kinds = meritKinds(cla);
  const status = meritStatus(meritos, cla);
  const { totals } = status;
  const taken = new Set(meritos.map((m) => catalogMerit(m.nome)));

  return (
    <>
      <div className={cn(ACTION, "mb-3 flex flex-wrap gap-4 text-ink-soft")}>
        <span>
          {totals.vantagens}/{MERIT_TARGETS.vantagens} pts em vantagens
        </span>
        <span>
          {totals.defeitos}/{MERIT_TARGETS.defeitos} pts em defeitos
        </span>
        {thin && (
          <span>
            {totals.qualidadesSR} qualidades · {totals.defeitosSR} defeitos de
            sangue-ralo
          </span>
        )}
      </div>
      <div className="mb-2 max-w-[60ch] text-base text-ink-soft">
        {RULE}
        {thin && THIN_RULE}
      </div>
      <div
        className={cn(
          ACTION,
          "mb-3 leading-snug",
          status.ok ? "text-moss" : "text-ink-soft"
        )}
      >
        {status.message}
      </div>
      <MeritCombobox
        isTaken={(m) => taken.has(m)}
        onPick={append}
        thin={thin}
      />
      {fields.map((row, i) => {
        const nome = meritos[i]?.nome ?? row.nome;
        const canon = catalogMerit(nome);
        const allowed = canon ? meritPointOptions(canon) : FREE_POINTS;
        const tipo = effectiveMeritKind(meritos[i]?.tipo ?? row.tipo, cla);
        const pontos = meritos[i]?.pontos ?? 0;
        return (
          <div
            className="flex flex-wrap items-center gap-x-4 gap-y-2 border-line-soft border-b py-3"
            key={row.id}
          >
            {canon ? (
              <KindBadge className="min-w-28 text-center" tipo={tipo} />
            ) : (
              <Controller
                control={control}
                name={`meritos.${i}.tipo`}
                render={({ field }) => (
                  <button
                    className={cn(
                      ACTION,
                      "min-w-28 cursor-pointer whitespace-nowrap px-2 py-1 text-white",
                      KIND_BG[tipo]
                    )}
                    onClick={() =>
                      field.onChange(
                        kinds[(kinds.indexOf(tipo) + 1) % kinds.length]
                      )
                    }
                    title="Alternar tipo"
                    type="button"
                  >
                    {KIND_LABEL[tipo]}
                  </button>
                )}
              />
            )}
            <div className="min-w-35 flex-1">
              <InfoTrigger
                className="block font-serif text-ink text-xl leading-tight"
                target={{ key: nome, kind: "merit", pontos, tipo }}
              >
                {nome}
              </InfoTrigger>
              <div className={cn(ACTION, "mt-1 text-ink-soft normal-case")}>
                {canon
                  ? `${meritGroupLabel(canon.category)} · ${meritRangeLabel(allowed)}`
                  : "Fora do catálogo"}
              </div>
            </div>
            <Controller
              control={control}
              name={`meritos.${i}.pontos`}
              render={({ field }) => (
                <DotRating
                  allowed={allowed}
                  label={`Pontos de ${nome}`}
                  onChange={field.onChange}
                  size="sm"
                  value={field.value}
                />
              )}
            />
            <button
              className={cn(ACTION, "cursor-pointer text-ink/55")}
              onClick={() => remove(i)}
              type="button"
            >
              Remover
            </button>
          </div>
        );
      })}
      {fields.length === 0 && (
        <EmptyState title="Nenhum mérito ou defeito">
          Busque acima e escolha no catálogo. Vantagens custam pontos; defeitos
          devolvem pontos.
        </EmptyState>
      )}
    </>
  );
}
