import { useId } from "react";
import {
  SegmentedTabs,
  SegmentedTabsContent,
  SegmentedTabsList,
  SegmentedTabsTrigger,
} from "#/components/vtm/segmented-tabs";
import { SectionTitle } from "#/components/vtm/text";
import { TraitGrid } from "#/components/vtm/trait-grid";
import { ATTRIBUTE_GROUPS, SKILL_GROUPS } from "#/data/traits";
import { specialtiesBySkill } from "#/rules/specialties";
import { patchSheet, useSheet } from "#/stores/character-store";
import { usePlayerStore } from "#/stores/player-store";

/** painel sempre montado: some só quando inativo abaixo de lg */
const TAB_PANE = "max-lg:data-[state=inactive]:hidden";

/** Criado o personagem, Atributos e Habilidades só mudam pelo Mestre. */
function useCanEditTraits(): boolean {
  const role = usePlayerStore((s) => s.role);
  const { criada } = useSheet();
  return role === "dm" || !criada;
}

export function CaracteristicasTab() {
  const sheet = useSheet();
  const editable = useCanEditTraits();
  const attrsTitleId = useId();
  const skillsTitleId = useId();
  return (
    // abaixo de lg, um bloco por vez; a partir de lg, os dois
    <SegmentedTabs className="flex flex-col gap-8" defaultValue="atributos">
      <SegmentedTabsList className="-mb-3 lg:hidden">
        <SegmentedTabsTrigger value="atributos">Atributos</SegmentedTabsTrigger>
        <SegmentedTabsTrigger value="habilidades">
          Habilidades
        </SegmentedTabsTrigger>
      </SegmentedTabsList>

      <SegmentedTabsContent
        aria-labelledby={attrsTitleId}
        className={TAB_PANE}
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
          onChange={
            editable
              ? (name, v) =>
                  patchSheet({ attrs: { ...sheet.attrs, [name]: v } })
              : undefined
          }
          values={sheet.attrs}
        />
      </SegmentedTabsContent>

      <SegmentedTabsContent
        aria-labelledby={skillsTitleId}
        className={TAB_PANE}
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
          onChange={
            editable
              ? (name, v) =>
                  patchSheet({ skills: { ...sheet.skills, [name]: v } })
              : undefined
          }
          specialties={specialtiesBySkill(sheet)}
          values={sheet.skills}
        />
      </SegmentedTabsContent>
    </SegmentedTabs>
  );
}
