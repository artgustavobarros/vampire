## Context

`web/src/data/trait-info.ts` has three dot-level catalogs:
- `ATTR_INFO: Record<string, [desc, rows[]]>`: text for each attribute's levels.
- `MERIT_INFO`: text for each merit's levels, with a generic scale (`MERIT_SCALE_V/D`) used only for merits outside the catalog.
- `SKILL_INFO: Record<string, [desc, espec]>` plus a global `SKILL_SCALE`, which every skill shares.

The 27 skill keys are a fixed set (`SKILL_GROUPS` in `data/traits.ts`), so there are no "skills outside the catalog".

## Goals / Non-Goals

**Goals:**
- Give every skill its own 5 level texts in pt-BR, in the same voice as the attribute texts.
- Keep `skillInfo` a pure function with the same `InfoContent` output shape.

**Non-Goals:**
- No changes to the panel UI, the highlight rules or the badge ("Sem treino" / "N pontos").
- No changes to the text of the skill descriptions or of the common specialties.

## Decisions

- **Extend the tuple to `[desc, espec, rows]`** (`readonly [string, string, readonly string[]]`), following `ATTR_INFO`. Other options: a separate `SKILL_LEVELS` record, which splits one skill's data across two places, or an object shape, which doesn't match how the neighbouring catalogs are written. The tuple keeps each skill's data in one entry.
- **Remove `SKILL_SCALE`** instead of keeping it as a fallback. All skills are catalogued, so a fallback would be dead code. The fallback in `skillInfo` becomes `["", "", []]` (empty list, so the list and its title are hidden).
- **Where the text comes from**: the dot descriptions from the V5 core rulebook for each skill, adapted to pt-BR in short sentences, like the attribute texts. The user can edit them freely afterwards. The content lives only in the data file.

## Risks / Trade-offs

- [The texts may not match the user's own translation of the book] → They are drafts in the data file, easy to edit. The tests only check that each skill has 5 non-empty texts that differ from other skills, never the wording.
- [Large diff in `trait-info.ts` (~135 new lines)] → The change is pure data, one entry at a time, and easy to review.
