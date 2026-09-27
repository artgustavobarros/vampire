## 1. Data catalog

- [x] 1.1 In `web/src/data/trait-info.ts`, change the `SKILL_INFO` type to `Readonly<Record<string, readonly [string, string, readonly string[]]>>`
- [x] 1.2 Write 5 pt-BR level texts (• to •••••) for each of the 27 skills, based on the V5 core rulebook, in the same short style as `ATTR_INFO`
- [x] 1.3 Remove the `SKILL_SCALE` export

## 2. Panel content

- [x] 2.1 In `web/src/features/info/build-info.ts`, make `skillInfo` read `[desc, espec, rows]` from `SKILL_INFO` (fallback `["", "", []]`) and pass `rows` to `dotLevels`
- [x] 2.2 Remove the `SKILL_SCALE` import and any other leftover references to it

## 3. Tests

- [x] 3.1 In `build-info.test.ts`, check that "Briga" with 3 points has 5 rows of its own and the "•••" row highlighted
- [x] 3.2 Check that the "••" text of Briga differs from the "••" text of Finanças
- [x] 3.3 Check that every skill in `SKILL_GROUPS` has exactly 5 non-empty texts
- [x] 3.4 Run the web test suite and the lint (Ultracite) and fix any failures
