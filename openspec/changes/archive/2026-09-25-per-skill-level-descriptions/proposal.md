## Why

The skill panel shows the same generic 5-level list (`SKILL_SCALE`: "Novato… Mestre") for every skill. Attributes and merits already have their own text for each dot. So "Briga •••" and "Finanças •••" read the same, and the level list doesn't say what the character can actually do.

## What Changes

- Each skill in `SKILL_INFO` gets its own 5 texts, one per dot (• to •••••), like `ATTR_INFO` already does.
- The skill panel's "O que cada ponto significa" list uses the texts for that skill.
- **BREAKING** (internal): the global `SKILL_SCALE` array is removed, and the shape of the `SKILL_INFO` entries changes.

## Capabilities

### New Capabilities
<!-- none -->

### Modified Capabilities
- `trait-info`: the **Habilidade** content rule changes. Levels are now the skill's own 5 texts instead of the shared novato→mestre scale.

## Impact

- `web/src/data/trait-info.ts`: `SKILL_INFO` shape and content (27 skills × 5 texts), `SKILL_SCALE` removed.
- `web/src/features/info/build-info.ts`: `skillInfo` reads the rows from `SKILL_INFO` and drops the `SKILL_SCALE` import.
- `web/src/features/info/build-info.test.ts`: new assertions for per-skill levels.
- No UI or layout changes. The panel already renders any `niveis` list.
