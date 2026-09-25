import { DotRating } from "#/components/vtm/dot-rating";
import { SheetTextField } from "#/components/vtm/fields";
import { InfoTrigger } from "#/components/vtm/info-trigger";
import { Chip } from "#/components/vtm/selectable";
import { Panel, SectionTitle } from "#/components/vtm/text";
import { HumanityTrack } from "#/components/vtm/tracks";
import { autoFit, TraitGrid } from "#/components/vtm/trait-grid";
import {
  IDENTITY_FIELDS,
  RESONANCE_INTENSITIES,
  RESONANCES,
} from "#/data/fields";
import { ATTRIBUTE_GROUPS, SKILL_GROUPS } from "#/data/traits";
import { adjustHumanity, stains, toggleStain } from "#/rules/humanity";
import { specialtiesBySkill } from "#/rules/specialties";
import { patchSheet, useSheet } from "#/stores/character-store";
import { CYCLE_HINT, TrackPanel } from "../track-panels";

const PANEL_TITLE =
  "mt-0 mb-4 font-label font-semibold text-xs uppercase leading-none tracking-[.12em]";
const LEVEL_BTN =
  "cursor-pointer border border-line px-4 py-3 font-label font-semibold text-ink text-xs uppercase leading-none tracking-widest focus-visible:outline-2 focus-visible:outline-ink";

export function FichaTab() {
  const sheet = useSheet();
  return (
    <>
      <Panel className="mb-6 grid gap-x-6 gap-y-4" style={autoFit(220)}>
        {IDENTITY_FIELDS.map((f) => (
          <SheetTextField
            field={{ ...f, placeholder: undefined }}
            key={f.key}
          />
        ))}
      </Panel>

      <SectionTitle>Atributos</SectionTitle>
      <TraitGrid
        className="mb-8"
        groups={ATTRIBUTE_GROUPS}
        infoKind="attr"
        minColumn={232}
        onChange={(name, v) =>
          patchSheet({ attrs: { ...sheet.attrs, [name]: v } })
        }
        values={sheet.attrs}
      />

      <div className="mb-8 grid gap-4" style={autoFit(260)}>
        <TrackPanel hint={CYCLE_HINT} track="vit" />
        <TrackPanel hint="Autocontrole + Determinação" track="fdv" />
      </div>

      <SectionTitle>Habilidades</SectionTitle>
      <TraitGrid
        className="mb-8"
        groups={SKILL_GROUPS}
        infoKind="skill"
        minColumn={248}
        onChange={(name, v) =>
          patchSheet({ skills: { ...sheet.skills, [name]: v } })
        }
        predador={sheet.predador}
        specialties={specialtiesBySkill(sheet)}
        values={sheet.skills}
      />

      <div className="flex flex-col gap-4">
        <Panel className="p-6">
          <h3 className={`${PANEL_TITLE} text-blood`}>
            <InfoTrigger
              target={{
                atual: `Fome ${sheet.fome || 0}`,
                kind: "fome",
                marca: String(sheet.fome || 0),
              }}
            >
              Fome
            </InfoTrigger>
          </h3>
          <DotRating
            className="gap-3"
            label="Fome"
            onChange={(v) => patchSheet({ fome: v })}
            size="lg"
            tone="blood"
            value={sheet.fome || 0}
          />
        </Panel>
        <Panel className="p-6">
          <h3 className={`${PANEL_TITLE} text-ink-soft`}>
            <InfoTrigger
              target={{
                atual: `${sheet.humanidade || 0} / 10`,
                kind: "humanidade",
                marca: String(sheet.humanidade || 0),
              }}
            >
              Humanidade {sheet.humanidade || 0}
            </InfoTrigger>
          </h3>
          <HumanityTrack
            level={sheet.humanidade || 0}
            onToggle={(i) => patchSheet(toggleStain(sheet, i))}
            stains={stains(sheet)}
          />
          <div className="mt-4 flex gap-2">
            <button
              className={LEVEL_BTN}
              onClick={() =>
                patchSheet({ humanidade: adjustHumanity(sheet, -1) })
              }
              type="button"
            >
              − Nível
            </button>
            <button
              className={LEVEL_BTN}
              onClick={() =>
                patchSheet({ humanidade: adjustHumanity(sheet, 1) })
              }
              type="button"
            >
              + Nível
            </button>
          </div>
        </Panel>
        <Panel className="p-6">
          <h3 className={`${PANEL_TITLE} text-ink-soft`}>
            <InfoTrigger
              target={{
                atual: [sheet.ressonancia, sheet.resIntensidade]
                  .filter(Boolean)
                  .join(" · "),
                kind: "ressonancia",
                marca: sheet.ressonancia,
              }}
            >
              Ressonância
            </InfoTrigger>
          </h3>
          <div className="flex flex-wrap gap-2">
            {RESONANCES.map((r) => (
              <Chip
                key={r}
                onClick={() =>
                  patchSheet({ ressonancia: sheet.ressonancia === r ? "" : r })
                }
                selected={sheet.ressonancia === r}
              >
                {r}
              </Chip>
            ))}
          </div>
          <div className="mt-4 mb-2 font-label font-semibold text-ink-faint text-xs uppercase leading-none tracking-[.12em]">
            Intensidade
          </div>
          <div className="flex flex-wrap gap-2">
            {RESONANCE_INTENSITIES.map((r) => (
              <Chip
                key={r}
                onClick={() =>
                  patchSheet({
                    resIntensidade: sheet.resIntensidade === r ? "" : r,
                  })
                }
                selected={sheet.resIntensidade === r}
              >
                {r}
              </Chip>
            ))}
          </div>
        </Panel>
      </div>
    </>
  );
}
