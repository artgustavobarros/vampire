import { Input } from "#/components/ui/input";
import { DotRating } from "#/components/vtm/dot-rating";
import { SheetTextArea, SheetTextField } from "#/components/vtm/fields";
import { Panel } from "#/components/vtm/text";
import { autoFit } from "#/components/vtm/trait-grid";
import { bloodPotencyRow } from "#/data/blood-potency";
import { BIO_FIELDS, LONG_FIELDS } from "#/data/fields";
import { patchSheet, useSheet } from "#/lib/store";
import { bloodPotency, potencyNote } from "#/rules/generation";

const TITLE =
  "mt-0 mb-3 font-label font-semibold text-ink text-xs uppercase leading-none tracking-[.12em]";

export function RegistrosTab() {
  const sheet = useSheet();
  const potency = bloodPotency(sheet);
  const bp = bloodPotencyRow(potency);
  const gives = [
    {
      label: "Surto de Sangue",
      note: "Dados extras em um teste físico, ao custo de um Rouse Check.",
      value: bp.bloodSurge,
    },
    {
      label: "Bônus de Poder",
      note: "Adicionado aos testes de ativação de Disciplina.",
      value: bp.powerBonus,
    },
    {
      label: "Rerrolagem de Rouse",
      note: "Uma segunda chance de não subir a Fome.",
      value: bp.rouseReroll,
    },
  ];
  const costs = [
    {
      label: "Cura ao Despertar",
      note: "Quanto some da vitalidade quando você dorme.",
      value: bp.mendAmount,
    },
    {
      label: "Penalidade de Alimentação",
      note: "O que já não sacia mais a sua Fome.",
      value: bp.feedingPenalty,
    },
    {
      label: "Gravidade da Perdição",
      note: "Intensidade da maldição do seu clã.",
      value: `Severidade ${bp.baneSeverity}`,
    },
  ];

  return (
    <>
      <div className="mb-6 grid gap-4" style={autoFit(260)}>
        {LONG_FIELDS.map((f) => (
          <Panel key={f.key}>
            <SheetTextArea field={f} />
          </Panel>
        ))}
      </div>

      <Panel className="mb-6">
        <SheetTextArea
          field={{ key: "historia", label: "História" }}
          rows={8}
        />
      </Panel>

      <Panel className="mb-6">
        <h3 className={TITLE}>Pilares &amp; Convicções</h3>
        {sheet.conv.map((c, i) => (
          <div className="grid gap-3 py-2" key={i} style={autoFit(200)}>
            <Input
              aria-label={`Convicção ${i + 1}`}
              onChange={(e) =>
                patchSheet({
                  conv: sheet.conv.map((x, j) =>
                    j === i ? { ...x, c: e.target.value } : x
                  ),
                })
              }
              placeholder="Convicção"
              value={c.c}
            />
            <Input
              aria-label={`Pilar ${i + 1}`}
              onChange={(e) =>
                patchSheet({
                  conv: sheet.conv.map((x, j) =>
                    j === i ? { ...x, p: e.target.value } : x
                  ),
                })
              }
              placeholder="Pilar"
              value={c.p}
            />
          </div>
        ))}
      </Panel>

      <section className="mb-6 bg-ink p-4 text-white">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
          <h3 className="m-0 font-label font-semibold text-white/60 text-xs uppercase leading-none tracking-[.12em]">
            Potência de Sangue
          </h3>
          <span className="text-lg text-white/60 leading-none">
            Nível {bp.level}
          </span>
          <DotRating
            className="flex-wrap gap-2"
            count={10}
            label="Potência de Sangue"
            tone="inverse"
            value={potency}
          />
          <div className="basis-full text-pretty font-label text-white/45 text-xs leading-normal">
            {potencyNote(sheet)}
          </div>
        </div>
        <div className="grid gap-6" style={autoFit(280)}>
          <BloodColumn accent rows={gives} title="O que o sangue te dá" />
          <BloodColumn rows={costs} title="O que o sangue te cobra" />
        </div>
      </section>

      <Panel className="grid gap-x-5 gap-y-4" style={autoFit(180)}>
        {BIO_FIELDS.map((f) => (
          <SheetTextField field={f} key={f.key} />
        ))}
      </Panel>
    </>
  );
}

function BloodColumn({
  title,
  rows,
  accent,
}: {
  title: string;
  rows: { label: string; value: string; note: string }[];
  accent?: boolean;
}) {
  return (
    <div className="flex flex-col gap-3">
      <div
        className={
          accent
            ? "border-ember/40 border-b pb-2 font-label font-semibold text-ember text-xs uppercase leading-none tracking-[.12em]"
            : "border-white/20 border-b pb-2 font-label font-semibold text-white/60 text-xs uppercase leading-none tracking-[.12em]"
        }
      >
        {title}
      </div>
      {rows.map((r) => (
        <div className="flex flex-col gap-1" key={r.label}>
          <div className="font-label font-semibold text-white/50 text-xs uppercase leading-snug tracking-widest">
            {r.label}
          </div>
          <div className="text-pretty text-[#F0F0EE] text-xl leading-snug">
            {r.value}
          </div>
          <div className="text-pretty font-label text-white/40 text-xs leading-normal">
            {r.note}
          </div>
        </div>
      ))}
    </div>
  );
}
