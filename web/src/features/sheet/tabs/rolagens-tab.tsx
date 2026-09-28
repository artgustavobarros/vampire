import { useEffect, useId, useRef, useState } from "react";
import { fieldVariants } from "#/components/ui/input";
import { NativeSelect } from "#/components/vtm/fields";
import { FieldLabel, Panel, SectionTitle } from "#/components/vtm/text";
import { ATTRIBUTE_GROUPS, SKILL_GROUPS, type TraitGroup } from "#/data/traits";
import type { DicePool, Sheet } from "#/lib/types";
import { cn } from "#/lib/utils";
import {
  dicePools,
  POOL_MOD_MAX,
  POOL_MOD_MIN,
  poolFormula,
  poolTotal,
} from "#/rules/dice-pool";
import { patchSheet, useSheet } from "#/stores/character-store";

const LABEL =
  "font-label font-semibold text-ink-soft text-xs uppercase leading-none tracking-[.12em]";

const MOD_BTN =
  "flex size-9 cursor-pointer items-center justify-center border border-line bg-field font-label font-semibold text-ink leading-none focus-visible:outline-2 focus-visible:outline-ink disabled:cursor-not-allowed disabled:opacity-40";

/** Aba Rolagens: paradas de dados salvas, com total que acompanha a ficha. */
export function RolagensTab() {
  const sheet = useSheet();
  const pools = dicePools(sheet);
  const [created, setCreated] = useState<string | null>(null);

  const save = (next: DicePool[]) => patchSheet({ rolagens: next });

  const add = () => {
    const id = newPoolId();
    save([...pools, { id, mod: 0, nome: "" }]);
    setCreated(id);
  };

  return (
    <div>
      <SectionTitle className="mb-2">Paradas de dados</SectionTitle>
      <p className="mx-auto mt-0 mb-6 max-w-[46ch] text-center text-ink-soft text-lg">
        Salve os testes que você usa sempre. O total acompanha a ficha quando
        atributos ou perícias mudam.
      </p>
      {pools.length > 0 && (
        <ul className="m-0 mb-4 grid list-none gap-4 p-0 md:grid-cols-2">
          {pools.map((pool) => (
            <li key={pool.id}>
              <DicePoolCard
                focusName={pool.id === created}
                onChange={(partial) =>
                  save(
                    pools.map((p) =>
                      p.id === pool.id ? { ...p, ...partial } : p
                    )
                  )
                }
                onRemove={() => save(pools.filter((p) => p.id !== pool.id))}
                pool={pool}
                sheet={sheet}
              />
            </li>
          ))}
        </ul>
      )}
      <button
        className="flex min-h-12 w-full cursor-pointer items-center justify-center bg-ink font-label font-semibold text-white text-xs uppercase leading-none tracking-[.22em] focus-visible:outline-2 focus-visible:outline-ink focus-visible:outline-offset-2"
        onClick={add}
        type="button"
      >
        + Nova parada
      </button>
    </div>
  );
}

interface DicePoolCardProps {
  focusName: boolean;
  onChange: (partial: Partial<DicePool>) => void;
  onRemove: () => void;
  pool: DicePool;
  sheet: Sheet;
}

function DicePoolCard({
  focusName,
  onChange,
  onRemove,
  pool,
  sheet,
}: DicePoolCardProps) {
  const id = useId();
  const nameRef = useRef<HTMLInputElement>(null);
  const mod = pool.mod || 0;

  useEffect(() => {
    if (focusName) {
      nameRef.current?.focus();
    }
  }, [focusName]);

  return (
    <Panel aria-label={pool.nome || "Parada sem nome"} className="h-full">
      <div className="flex items-stretch gap-3">
        <input
          aria-label="Nome do teste"
          className={cn(fieldVariants(), "min-w-0 flex-1")}
          onChange={(e) => onChange({ nome: e.target.value })}
          placeholder="Nome do teste"
          ref={nameRef}
          value={pool.nome}
        />
        <output
          aria-label="Total"
          className="flex w-13 flex-none items-center justify-center bg-ink font-label font-semibold text-2xl text-white leading-none"
        >
          {poolTotal(pool, sheet)}
        </output>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <TraitSelect
          empty="— nenhum —"
          groups={ATTRIBUTE_GROUPS}
          id={`${id}-attr`}
          label="Atributo"
          onChange={(attr) => onChange({ attr })}
          value={pool.attr}
          values={sheet.attrs}
        />
        <TraitSelect
          empty="— nenhuma —"
          groups={SKILL_GROUPS}
          id={`${id}-skill`}
          label="Perícia"
          onChange={(skill) => onChange({ skill })}
          value={pool.skill}
          values={sheet.skills}
        />
      </div>

      <fieldset
        aria-labelledby={`${id}-mod`}
        className="m-0 mt-4 flex min-w-0 items-center justify-between gap-3 border-0 p-0"
      >
        <span className={LABEL} id={`${id}-mod`}>
          Modificador
        </span>
        <div className="flex items-center gap-3">
          <button
            aria-label="Diminuir modificador"
            className={MOD_BTN}
            disabled={mod <= POOL_MOD_MIN}
            onClick={() => onChange({ mod: mod - 1 })}
            type="button"
          >
            −
          </button>
          <output
            aria-live="polite"
            className="min-w-6 text-center font-label font-semibold text-ink"
          >
            {signed(mod)}
          </output>
          <button
            aria-label="Aumentar modificador"
            className={MOD_BTN}
            disabled={mod >= POOL_MOD_MAX}
            onClick={() => onChange({ mod: mod + 1 })}
            type="button"
          >
            +
          </button>
        </div>
      </fieldset>

      <div className="mt-4 flex items-center justify-between gap-3 border-line-soft border-t pt-3">
        <span className="min-w-0 text-base text-ink-soft">
          {poolFormula(pool, sheet)}
        </span>
        <button
          className="flex-none cursor-pointer font-label font-semibold text-blood text-xs uppercase leading-none tracking-[.12em] focus-visible:outline-2 focus-visible:outline-ink focus-visible:outline-offset-2"
          onClick={onRemove}
          type="button"
        >
          Remover
        </button>
      </div>
    </Panel>
  );
}

/** Id local da parada (`crypto.randomUUID` só existe em contexto seguro). */
function newPoolId(): string {
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
}

function signed(value: number): string {
  if (value > 0) {
    return `+${value}`;
  }
  return value < 0 ? `−${-value}` : "0";
}

interface TraitSelectProps {
  empty: string;
  groups: readonly TraitGroup[];
  id: string;
  label: string;
  onChange: (value: string | undefined) => void;
  value: string | undefined;
  values: Record<string, number>;
}

/** Select de traço agrupado, com o valor atual em cada opção. */
function TraitSelect({
  empty,
  groups,
  id,
  label,
  onChange,
  value,
  values,
}: TraitSelectProps) {
  const known = groups.some((g) => value && g.traits.includes(value));
  return (
    <div className="min-w-0">
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <NativeSelect
        id={id}
        onChange={(e) => onChange(e.target.value || undefined)}
        value={known ? value : ""}
      >
        <option value="">{empty}</option>
        {groups.map((g) => (
          <optgroup key={g.label} label={g.label}>
            {g.traits.map((t) => (
              <option key={t} value={t}>
                {t} · {values[t] ?? 0}
              </option>
            ))}
          </optgroup>
        ))}
      </NativeSelect>
    </div>
  );
}
