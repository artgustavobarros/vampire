import { Search } from "lucide-react";
import {
  type KeyboardEvent,
  type ReactNode,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { Input } from "#/components/ui/input";
import {
  filterMeritOptions,
  groupMeritOptions,
  type MeritContext,
  type MeritTab,
  type MeritTemplate,
  meritKeys,
  meritOptions,
  meritPointOptions,
  meritRangeLabel,
  meritRequirementLabel,
  sameMeritName,
} from "#/data/merits";
import type { MeritKind } from "#/lib/types";
import { cn } from "#/lib/utils";

export const MERIT_ACTION =
  "font-label font-semibold text-xs uppercase leading-none tracking-widest";

export const KIND_LABEL: Record<MeritKind, string> = {
  defeito: "Defeito",
  "defeito-sr": "Defeito SR",
  "qualidade-sr": "Qualidade SR",
  vantagem: "Vantagem",
};

export const KIND_BG: Record<MeritKind, string> = {
  defeito: "bg-blood",
  "defeito-sr": "bg-blood",
  "qualidade-sr": "bg-moss",
  vantagem: "bg-moss",
};

export function KindBadge({
  tipo,
  className,
}: {
  className?: string;
  tipo: MeritKind;
}) {
  return (
    <span
      className={cn(
        MERIT_ACTION,
        "whitespace-nowrap px-2 py-1 text-white",
        KIND_BG[tipo],
        className
      )}
    >
      {KIND_LABEL[tipo]}
    </span>
  );
}

export interface MeritPick {
  nome: string;
  pontos: number;
  tipo: MeritKind;
}

const TABS: readonly [MeritTab, string][] = [
  ["todos", "Todos"],
  ["vantagens", "Vantagens"],
  ["defeitos", "Defeitos"],
];

type Entry =
  | { kind: "merit"; merit: MeritTemplate }
  | { kind: "custom"; tipo: "vantagem" | "defeito" };

interface MeritComboboxProps {
  /** clã e Disciplinas que filtram as opções */
  context: MeritContext;
  /** a opção já está entre os escolhidos */
  isTaken: (m: MeritTemplate) => boolean;
  onPick: (pick: MeritPick) => void;
}

/** Busca no catálogo de vantagens e defeitos (padrão ARIA combobox + listbox). */
export function MeritCombobox({
  context,
  isTaken,
  onPick,
}: MeritComboboxProps) {
  const id = useId();
  const boxRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [tab, setTab] = useState<MeritTab>("todos");
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);

  const all = meritOptions(context);
  const hits = filterMeritOptions(all, { query, tab });
  const groups = groupMeritOptions(hits);
  const starts = groups.map((_, gi) =>
    groups.slice(0, gi).reduce((n, g) => n + g.items.length, 0)
  );
  const text = query.trim();
  const custom =
    text !== "" &&
    !all.some((m) => meritKeys(m).some((k) => sameMeritName(k, text)));
  const customKinds = custom ? (["vantagem", "defeito"] as const) : [];
  const entries: Entry[] = [
    ...groups.flatMap((g) =>
      g.items.map((merit) => ({ kind: "merit" as const, merit }))
    ),
    ...customKinds.map((tipo) => ({ kind: "custom" as const, tipo })),
  ];
  const optionId = (i: number) => `${id}-opt-${i}`;

  useEffect(() => {
    if (open && active >= 0) {
      document
        .getElementById(`${id}-opt-${active}`)
        ?.scrollIntoView?.({ block: "nearest" });
    }
  }, [open, active, id]);

  const close = () => {
    setOpen(false);
    setActive(-1);
  };

  const choose = (entry: Entry) => {
    if (entry.kind === "custom") {
      onPick({ nome: text, pontos: 1, tipo: entry.tipo });
    } else if (isTaken(entry.merit)) {
      return;
    } else {
      onPick({
        nome: entry.merit.name,
        pontos: Math.min(...meritPointOptions(entry.merit)),
        tipo: entry.merit.tipo,
      });
    }
    setQuery("");
    close();
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      setOpen(true);
      if (entries.length === 0) {
        return;
      }
      const step = e.key === "ArrowDown" ? 1 : -1;
      setActive((a) => (a + step + entries.length) % entries.length);
    } else if (e.key === "Enter" && open && entries[active]) {
      e.preventDefault();
      choose(entries[active]);
    } else if (e.key === "Escape") {
      close();
    }
  };

  const option = (i: number, entry: Entry, body: ReactNode, taken = false) => (
    // biome-ignore lint/a11y/useKeyWithClickEvents: o teclado fica no campo (aria-activedescendant)
    <div
      aria-disabled={taken || undefined}
      aria-selected={i === active}
      className={cn(
        "cursor-pointer border-line-soft border-b border-l-4 border-l-transparent px-4 py-3",
        i === active && "border-l-ink bg-wash",
        taken && "cursor-default"
      )}
      id={optionId(i)}
      key={optionId(i)}
      onClick={() => choose(entry)}
      onMouseEnter={() => setActive(i)}
      role="option"
      tabIndex={-1}
    >
      {body}
    </div>
  );

  return (
    <div className="relative mb-4" ref={boxRef}>
      <div className="mb-3 flex flex-wrap gap-2">
        {TABS.map(([value, label]) => (
          <button
            aria-pressed={tab === value}
            className={cn(
              MERIT_ACTION,
              "cursor-pointer border px-3 py-2",
              tab === value
                ? "border-ink bg-ink text-white"
                : "border-line bg-transparent text-ink"
            )}
            key={value}
            onClick={() => {
              setTab(value);
              setActive(-1);
              inputRef.current?.focus();
            }}
            type="button"
          >
            {label}
          </button>
        ))}
      </div>
      <div className="relative">
        <Search
          aria-hidden
          className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-ink-soft"
        />
        <Input
          aria-activedescendant={
            open && active >= 0 ? optionId(active) : undefined
          }
          aria-autocomplete="list"
          aria-controls={`${id}-list`}
          aria-expanded={open}
          aria-label="Buscar vantagem ou defeito"
          autoComplete="off"
          className="pr-32 pl-11"
          onBlur={(e) => {
            if (!boxRef.current?.contains(e.relatedTarget)) {
              close();
            }
          }}
          onChange={(e) => {
            setQuery(e.target.value);
            setActive(-1);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          placeholder="Buscar vantagem ou defeito…"
          ref={inputRef}
          role="combobox"
          value={query}
        />
        <span
          className={cn(
            MERIT_ACTION,
            "pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-ink-soft"
          )}
        >
          {hits.length} {hits.length === 1 ? "opção" : "opções"}
        </span>
      </div>
      {open ? (
        <div
          aria-label="Vantagens e defeitos"
          className="absolute inset-x-0 top-full z-20 max-h-[min(60vh,420px)] overflow-y-auto border border-ink border-t-0 bg-field shadow-lg"
          id={`${id}-list`}
          onMouseDown={(e) => e.preventDefault()}
          role="listbox"
        >
          {groups.map((g, gi) => (
            // biome-ignore lint/a11y/useSemanticElements: grupo de opções do listbox, não um formulário
            <div aria-labelledby={`${id}-g${gi}`} key={g.label} role="group">
              <div
                className={cn(
                  MERIT_ACTION,
                  "sticky top-0 z-10 border-line-soft border-b bg-surface px-4 py-2 text-ink-soft"
                )}
                id={`${id}-g${gi}`}
              >
                {g.label}
              </div>
              {g.items.map((m, mi) => {
                const taken = isTaken(m);
                return option(
                  (starts[gi] ?? 0) + mi,
                  { kind: "merit", merit: m },
                  <>
                    <div className="flex items-center gap-3">
                      <span className="font-serif text-ink text-xl leading-tight">
                        {m.name}
                      </span>
                      <span className="text-ink text-sm tracking-tight">
                        {meritRangeLabel(meritPointOptions(m))}
                      </span>
                      {taken ? (
                        <span className={cn(MERIT_ACTION, "text-moss")}>
                          Na ficha
                        </span>
                      ) : null}
                      <KindBadge className="ml-auto" tipo={m.tipo} />
                    </div>
                    <div className="mt-1 line-clamp-1 text-base text-ink-soft">
                      {m.description}
                    </div>
                    {m.requires && "merit" in m.requires ? (
                      <div className={cn(MERIT_ACTION, "mt-2 text-ink-soft")}>
                        {meritRequirementLabel(m)}
                      </div>
                    ) : null}
                  </>,
                  taken
                );
              })}
            </div>
          ))}
          {customKinds.map((tipo, ci) =>
            option(
              hits.length + ci,
              { kind: "custom", tipo },
              <span className="font-serif text-ink text-lg">
                Adicionar “{text}” como {tipo}
              </span>
            )
          )}
          {entries.length === 0 ? (
            <div className="px-4 py-3 text-base text-ink-soft">
              Nenhuma opção nesta aba.
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
