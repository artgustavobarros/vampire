import { useState } from "react";
import { Button } from "#/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "#/components/ui/dialog";
import { Input } from "#/components/ui/input";
import { Textarea } from "#/components/ui/textarea";
import { DotRating } from "#/components/vtm/dot-rating";
import { NativeSelect } from "#/components/vtm/fields";
import { InfoButton, InfoTrigger } from "#/components/vtm/info-trigger";
import { Chip } from "#/components/vtm/selectable";
import { EmptyState } from "#/components/vtm/text";
import { findClan } from "#/data/clans";
import { DISCIPLINES } from "#/data/disciplines";
import { notify } from "#/lib/toast";
import type { Discipline, Power } from "#/lib/types";
import {
  patchSheet,
  useCharacterStore,
  useSheet,
} from "#/stores/character-store";

const LEVELS = [1, 2, 3, 4, 5];

function updateDiscipline(index: number, change: Partial<Discipline>) {
  const disc = useCharacterStore
    .getState()
    .sheet.disc.map((d, i) => (i === index ? { ...d, ...change } : d));
  patchSheet({ disc });
}

export function DisciplinasTab() {
  const sheet = useSheet();
  const [adding, setAdding] = useState(false);

  return (
    <>
      {sheet.disc.map((d, i) => (
        <DisciplineCard discipline={d} index={i} key={i} />
      ))}
      {sheet.disc.length === 0 && (
        <EmptyState title="Nenhuma disciplina registrada">
          Use o botão abaixo para registrar disciplinas e os poderes que você já
          domina.
        </EmptyState>
      )}
      <Button className="w-full" onClick={() => setAdding(true)} type="button">
        + Adicionar disciplina ou poder
      </Button>
      <AddDisciplineDialog onOpenChange={setAdding} open={adding} />
    </>
  );
}

function DisciplineCard({
  discipline: d,
  index,
}: {
  discipline: Discipline;
  index: number;
}) {
  const setPowers = (powers: Power[]) => updateDiscipline(index, { powers });
  const label = d.nome || "Disciplina";

  return (
    <div className="mb-4 border border-line bg-surface">
      <div className="flex flex-wrap items-center gap-4 border-line-soft border-b p-4">
        <Input
          aria-label="Nome da disciplina"
          className="min-w-0 flex-1 font-semibold text-2xl leading-tight"
          onChange={(e) => updateDiscipline(index, { nome: e.target.value })}
          placeholder="Disciplina"
          value={d.nome}
        />
        <InfoButton
          aria-label={`Sobre ${label}`}
          target={{ key: d.nome, kind: "disc", nivel: d.nivel || 0 }}
        />
        <DotRating
          className="flex-none gap-2"
          label={`Nível de ${label}`}
          onChange={(v) => updateDiscipline(index, { nivel: v })}
          value={d.nivel || 0}
        />
        <button
          aria-label={`Remover ${label}`}
          className="grid size-10 flex-none cursor-pointer place-items-center border border-line text-2xl text-ink-faint leading-none focus-visible:outline-2 focus-visible:outline-ink"
          onClick={() =>
            patchSheet({
              disc: useCharacterStore
                .getState()
                .sheet.disc.filter((_, j) => j !== index),
            })
          }
          type="button"
        >
          ×
        </button>
      </div>
      {d.powers.map((p, j) => {
        const desc = (p.desc ?? "").replace(/\s+/g, " ").trim();
        let summary = "sem descrição";
        if (desc) {
          summary = desc.length > 90 ? `${desc.slice(0, 90)}…` : desc;
        }
        const nome = p.nome || "Poder sem nome";
        return (
          <div className="flex items-stretch border-line-soft border-b" key={j}>
            <InfoTrigger
              className="flex min-h-12 min-w-0 flex-1 items-center gap-3 px-4 py-3 focus-visible:outline-ink focus-visible:-outline-offset-2"
              target={{
                desc: p.desc,
                disc: d.nome,
                key: p.nome,
                kind: "poder",
                nivel: p.nivel || 1,
              }}
            >
              <span className="grid size-6 flex-none place-items-center border border-line font-label font-semibold text-ink text-xs leading-none">
                {p.nivel || 1}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-semibold text-xl leading-tight">
                  {nome}
                </span>
                <span className="mt-1 block text-base text-ink-soft">
                  {summary}
                </span>
              </span>
            </InfoTrigger>
            <button
              aria-label={`Remover ${nome}`}
              className="grid w-12 flex-none cursor-pointer place-items-center text-2xl text-ink-faint leading-none hover:text-blood focus-visible:outline-2 focus-visible:outline-ink focus-visible:-outline-offset-2"
              onClick={() => setPowers(d.powers.filter((_, k) => k !== j))}
              type="button"
            >
              ×
            </button>
          </div>
        );
      })}
    </div>
  );
}

interface AddForm {
  desc: string;
  disc: string;
  livre: string;
  nivel: string;
  nome: string;
  rouse: boolean;
}

const EMPTY_FORM: AddForm = {
  desc: "",
  disc: "",
  livre: "",
  nivel: "1",
  nome: "",
  rouse: false,
};

function AddDisciplineDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const sheet = useSheet();
  const [form, setForm] = useState<AddForm>(EMPTY_FORM);
  const set = (change: Partial<AddForm>) => setForm({ ...form, ...change });

  const suggested = findClan(sheet.cla)?.disciplines ?? [];
  const existing = sheet.disc.map((d) => d.nome.trim()).filter(Boolean);
  const options = [
    ...existing,
    ...suggested.filter((n) => !existing.includes(n)),
    ...DISCIPLINES.filter(
      (n) => !(existing.includes(n) || suggested.includes(n))
    ),
  ];

  const changeOpen = (next: boolean) => {
    if (next) {
      setForm(EMPTY_FORM);
    }
    onOpenChange(next);
  };

  const confirm = () => {
    const name = (form.disc || form.livre).trim();
    if (!name) {
      notify("Selecione ou digite uma disciplina.");
      return;
    }
    const power: Power[] = form.nome.trim()
      ? [
          {
            desc: form.desc,
            nivel: Number.parseInt(form.nivel, 10) || 1,
            nome: form.nome.trim(),
            rouse: form.rouse,
          },
        ]
      : [];
    const current = useCharacterStore.getState().sheet.disc;
    const idx = current.findIndex((d) => d.nome.trim() === name);
    const disc =
      idx >= 0
        ? current.map((d, j) =>
            j === idx ? { ...d, powers: [...d.powers, ...power] } : d
          )
        : [
            ...current,
            {
              nivel: power.length ? power[0].nivel : 1,
              nome: name,
              powers: power,
            },
          ];
    patchSheet({ disc });
    onOpenChange(false);
  };

  const label =
    "mb-2 font-label font-semibold text-ink-soft text-xs uppercase leading-none tracking-[.12em]";

  return (
    <Dialog onOpenChange={changeOpen} open={open}>
      <DialogContent
        aria-describedby={undefined}
        className="max-h-[88vh] max-w-[440px] animate-vfade gap-0 overflow-y-auto p-6 shadow-[0_24px_64px_rgba(0,0,0,.4)] sm:max-w-[440px]"
        overlayClassName="bg-black/70"
        showCloseButton={false}
      >
        <div className="font-label font-semibold text-ink text-xs uppercase leading-none tracking-[.22em]">
          Adicionar
        </div>
        <DialogTitle className="mt-3 mb-6 font-semibold font-serif text-2xl leading-tight">
          Disciplina e poder
        </DialogTitle>

        <div className={label}>Disciplina</div>
        <div className="mb-4 flex flex-wrap gap-2">
          {options.map((n) => (
            <Chip
              key={n}
              onClick={() => set({ disc: form.disc === n ? "" : n, livre: "" })}
              selected={form.disc === n}
            >
              {n}
            </Chip>
          ))}
        </div>
        <Input
          aria-label="Outra disciplina"
          className="mb-6"
          onChange={(e) => set({ disc: "", livre: e.target.value })}
          placeholder="ou digite outra"
          value={form.livre}
        />

        <div className={label}>Poder (opcional)</div>
        <Input
          aria-label="Nome do poder"
          className="mb-3"
          onChange={(e) => set({ nome: e.target.value })}
          placeholder="Nome do poder"
          value={form.nome}
        />
        <div className="mb-3 flex flex-wrap items-center gap-3">
          <NativeSelect
            aria-label="Nível do poder"
            className="w-auto"
            onChange={(e) => set({ nivel: e.target.value })}
            value={form.nivel}
          >
            {LEVELS.map((n) => (
              <option key={n} value={n}>
                Nível {n}
              </option>
            ))}
          </NativeSelect>
          <Chip
            className="min-h-12 min-w-38 flex-1 justify-center"
            onClick={() => set({ rouse: !form.rouse })}
            selected={form.rouse}
            tone="blood"
          >
            Custa Rouse
          </Chip>
        </div>
        <Textarea
          aria-label="Descrição do poder"
          onChange={(e) => set({ desc: e.target.value })}
          placeholder="Custo, teste e efeito"
          rows={3}
          value={form.desc}
        />
        <div className="mt-6 flex flex-col gap-2">
          <Button className="w-full" onClick={confirm} type="button">
            Adicionar
          </Button>
          <Button
            className="w-full"
            onClick={() => onOpenChange(false)}
            type="button"
            variant="outline"
          >
            Cancelar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
