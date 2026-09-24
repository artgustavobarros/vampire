import { DotRating } from "#/components/vtm/dot-rating";
import { NativeSelect } from "#/components/vtm/fields";
import { SelectableCard } from "#/components/vtm/selectable";
import { findClan } from "#/data/clans";
import { DISCIPLINES, POWERS } from "#/data/disciplines";
import { patchSheet, useSheet } from "#/lib/store";
import type { Discipline, Sheet } from "#/lib/types";
import { bloodPotency, potencyNote } from "#/rules/generation";

function setDiscipline(
  sheet: Sheet,
  index: number,
  change: Partial<Discipline>
) {
  const disc = sheet.disc.slice();
  while (disc.length <= index) {
    disc.push({ nivel: 0, nome: "", powers: [] });
  }
  disc[index] = { ...disc[index], ...change };
  patchSheet({ disc });
}

export function Step5Disciplines() {
  const sheet = useSheet();
  const clan = findClan(sheet.cla);
  const options = clan
    ? [
        ...clan.disciplines,
        ...DISCIPLINES.filter((n) => !clan.disciplines.includes(n)),
      ]
    : DISCIPLINES;
  return (
    <>
      {[0, 1].map((i) => (
        <DisciplineRow index={i} key={i} options={options} sheet={sheet} />
      ))}
      <div className="mt-6 border border-line bg-wash p-3">
        <div className="font-label font-semibold text-ink-soft text-xs uppercase leading-none tracking-[.12em]">
          Potência de Sangue
        </div>
        <DotRating
          className="mt-3 flex-wrap gap-2"
          count={10}
          label="Potência de Sangue"
          value={bloodPotency(sheet)}
        />
        <div className="mt-3 text-sm opacity-70">
          {potencyNote(sheet, true)}
        </div>
      </div>
    </>
  );
}

function DisciplineRow({
  sheet,
  index,
  options,
}: {
  sheet: Sheet;
  index: number;
  options: readonly string[];
}) {
  const d: Discipline = sheet.disc[index] ?? { nivel: 0, nome: "", powers: [] };
  const name = d.nome.trim();
  const level = d.nivel || 0;
  const catalog = POWERS[name] ?? [];
  const cap = Math.max(level, 1);
  const chosen = new Set(d.powers.map((p) => p.nome));
  const label = `Disciplina ${index + 1}`;

  const togglePower = (p: (typeof catalog)[number]) => {
    const powers = chosen.has(p.name)
      ? d.powers.filter((x) => x.nome !== p.name)
      : [
          ...d.powers,
          {
            custo: p.cost,
            desc: p.description,
            duracao: p.duration,
            nivel: p.level,
            nome: p.name,
            rouse: p.rouse,
          },
        ];
    powers.sort((x, y) => (x.nivel || 1) - (y.nivel || 1));
    setDiscipline(sheet, index, { powers });
  };

  return (
    <div className="border-line border-b py-4">
      <div className="flex flex-wrap items-center gap-3">
        <NativeSelect
          aria-label={label}
          className="min-w-[180px] flex-1"
          onChange={(e) =>
            setDiscipline(sheet, index, { nome: e.target.value })
          }
          value={d.nome}
        >
          <option value="">— escolher disciplina —</option>
          {options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </NativeSelect>
        <DotRating
          label={`Nível ${label}`}
          onChange={(v) => setDiscipline(sheet, index, { nivel: v })}
          value={level}
        />
      </div>
      {name && catalog.length > 0 && (
        <>
          <div className="mt-3 mb-2 text-sm opacity-70">
            {level
              ? `Poderes disponíveis até o nível ${level} — toque para incluir na ficha.`
              : "Marque o nível da disciplina; por enquanto só os poderes de nível 1 aparecem."}
          </div>
          <div className="flex flex-wrap gap-2">
            {catalog
              .filter((p) => p.level <= cap)
              .map((p) => (
                <SelectableCard
                  className="w-auto max-w-[280px]"
                  key={p.name}
                  onClick={() => togglePower(p)}
                  selected={chosen.has(p.name)}
                >
                  <span className="block font-label font-semibold text-xs leading-tight">
                    {p.name}
                  </span>
                  <span className="mt-0.5 block text-sm leading-snug opacity-70">
                    Nível {p.level} · {p.cost}
                  </span>
                </SelectableCard>
              ))}
          </div>
        </>
      )}
    </div>
  );
}
