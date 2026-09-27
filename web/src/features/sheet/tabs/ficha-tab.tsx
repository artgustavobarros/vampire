import { useId } from "react";
import { DotRating } from "#/components/vtm/dot-rating";
import { InfoTrigger } from "#/components/vtm/info-trigger";
import {
  SegmentedTabs,
  SegmentedTabsContent,
  SegmentedTabsList,
  SegmentedTabsTrigger,
} from "#/components/vtm/segmented-tabs";
import { Chip } from "#/components/vtm/selectable";
import { Panel, SectionTitle } from "#/components/vtm/text";
import { HumanityTrack } from "#/components/vtm/tracks";
import { autoFit, TraitGrid } from "#/components/vtm/trait-grid";
import { RESONANCE_INTENSITIES, RESONANCES } from "#/data/fields";
import { ATTRIBUTE_GROUPS, SKILL_GROUPS } from "#/data/traits";
import { cn } from "#/lib/utils";
import { adjustHumanity, stains, toggleStain } from "#/rules/humanity";
import { specialtiesBySkill } from "#/rules/specialties";
import { patchSheet, useSheet } from "#/stores/character-store";
import { CYCLE_HINT, TrackPanel } from "../track-panels";

const PANEL_TITLE =
  "mt-0 mb-4 font-label font-semibold text-xs uppercase leading-none tracking-[.12em]";
const LEVEL_BTN =
  "cursor-pointer border border-line px-4 py-3 font-label font-semibold text-ink text-xs uppercase leading-none tracking-widest focus-visible:outline-2 focus-visible:outline-ink";
/** painel sempre montado: some só quando inativo abaixo de lg */
const TAB_PANE = "max-lg:data-[state=inactive]:hidden";

export function FichaTab() {
  const sheet = useSheet();
  const attrsTitleId = useId();
  const skillsTitleId = useId();
  return (
    <>
      {/* abaixo de lg, um bloco por vez; a partir de lg, os dois com as trilhas entre eles */}
      <SegmentedTabs
        className="mb-8 flex flex-col gap-8"
        defaultValue="atributos"
      >
        <SegmentedTabsList className="-mb-3 lg:hidden">
          <SegmentedTabsTrigger value="atributos">
            Atributos
          </SegmentedTabsTrigger>
          <SegmentedTabsTrigger value="habilidades">
            Habilidades
          </SegmentedTabsTrigger>
        </SegmentedTabsList>

        <SegmentedTabsContent
          aria-labelledby={attrsTitleId}
          className={cn(TAB_PANE, "lg:order-1")}
          forceMount
          value="atributos"
        >
          <SectionTitle className="max-lg:hidden" id={attrsTitleId}>
            Atributos
          </SectionTitle>
          <TraitGrid
            groups={ATTRIBUTE_GROUPS}
            infoKind="attr"
            minColumn={232}
            onChange={(name, v) =>
              patchSheet({ attrs: { ...sheet.attrs, [name]: v } })
            }
            values={sheet.attrs}
          />
        </SegmentedTabsContent>

        <SegmentedTabsContent
          aria-labelledby={skillsTitleId}
          className={cn(TAB_PANE, "lg:order-3")}
          forceMount
          value="habilidades"
        >
          <SectionTitle className="max-lg:hidden" id={skillsTitleId}>
            Habilidades
          </SectionTitle>
          <TraitGrid
            groups={SKILL_GROUPS}
            infoKind="skill"
            minColumn={248}
            onChange={(name, v) =>
              patchSheet({ skills: { ...sheet.skills, [name]: v } })
            }
            specialties={specialtiesBySkill(sheet)}
            values={sheet.skills}
          />
        </SegmentedTabsContent>

        <div className="grid gap-4 lg:order-2" style={autoFit(260)}>
          <TrackPanel hint={CYCLE_HINT} track="vit" />
          <TrackPanel hint="Autocontrole + Determinação" track="fdv" />
        </div>
      </SegmentedTabs>

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
