## Context

`RuleDialogProvider` (`web/src/features/actions/rule-dialog.tsx`) draws one generic dialog for every rule action: kicker, title, body, optional note, and a list of buttons. The content comes from `flowView` (`flows.ts`), which is plain TS and returns data (`FlowView`), never JSX. For feeding, `feedView` builds eight buttons from `FEEDING_SOURCES` (capped by `feedingYield` and Blood Potency) plus a "pessoa" stage with −1…−4.

Resonance lives in `sheet.ressonancia` / `sheet.resIntensidade`. The Ficha tab edits it with `Chip`s using `RESONANCES` and `RESONANCE_INTENSITIES` from `#/data/fields`. `RESONANCES` includes "Sem ressonância", which the new dialog does not show.

The target design (screenshot) shows a − / + stepper "Saciar", a 2×2 grid of serif cards for resonance, a segmented bar for intensity, a blood-colored primary button "Alimentar · Fome X → Y", and "Cancelar".

## Goals / Non-Goals

**Goals:**
- Replace the feeding stages with a single-screen form that writes Hunger and resonance to the sheet together.
- Reuse the Ficha tab's data lists, so both places store the same values.
- Keep `flows.ts` free of React, and keep the other flows (rouse, sleep, agg, frenzy) as they are.

**Non-Goals:**
- Blood Potency limits and feeding sources (removed by the user's decision).
- Changing the Ficha tab's Resonance panel or the `sheet` data model.
- Resonance effects on disciplines (not modeled).

## Decisions

### 1. Form in the dialog, driven by the flow stage
`RuleDialogProvider` keeps drawing kicker/title/body/note from `flowView`. When `flow.kind === "feed" && flow.stage === "ask"`, it renders `<FeedForm>` in place of the buttons list. `feedView` returns `actions: []` for that stage. The "done" stage stays data-driven like the others.
- *Alternative:* add `content?: ReactNode` to `FlowView`. Rejected because it would force `flows.ts` → `.tsx` and put JSX in the flow logic.
- *Alternative:* a separate `FeedDialog` outside the provider. Rejected because it would duplicate the dialog shell and the "open via `useRuleDialog`" contract that `acoes-tab` already uses.

### 2. Local form state, reset for free
`FeedForm` holds `amount`, `resonance` (`""` = none), and `intensity` in `useState`. The dialog content unmounts when `flow` is `null`, so reopening always starts fresh (amount = current Hunger, no resonance, intensity = `RESONANCE_INTENSITIES[0]`).

### 3. Pure rule `feed`
New signature in `rules/feeding.ts`:
```ts
feed(sheet, amount, resonance?: { tipo: string; intensidade: string }): ActionResult
```
It returns the patch `{ fome }` plus `{ ressonancia, resIntensidade }` when a resonance is given. `fome = max(0, fome − amount)`. The note reads like "Fome 2 → 0. Ressonância Fleumática · Intensa." (resonance part only when given). `FeedForm` calls `feed`, then `patchSheet(r.patch)` and `to("feed", "done", r.note)` through an `onApply` callback that the provider passes in. `FEEDING_SOURCES`, `feedingYield`, their types, the "pessoa" stage, and `bloodPotency` in `flows.ts` are removed (no other use).

### 4. Resonance options = `RESONANCES` without "Sem ressonância"
The grid filters `RESONANCES` to the four blood types, so the labels stay in one place. "No resonance" is simply nothing selected, and then the sheet's resonance is left as is. Cards use `SelectableCard` with `filled` (white when off, ink when on), plus `text-center font-serif text-xl` in `className`, in a `grid grid-cols-2 gap-2`. `aria-pressed` comes from the component.

### 5. Intensity as a value segmented control (ToggleGroup)
Radix `Tabs` (`SegmentedTabs`) needs tab panels and has the wrong semantics for picking a value. Add `web/src/components/vtm/segmented-control.tsx` with Radix `ToggleGroup` `type="single"` and the same classes as `SegmentedTabsList`/`Trigger` (bg-wash strip, active item bg-field + shadow-sm), using `data-[state=on]` in place of `data-[state=active]`. `onValueChange` ignores `""` so one value is always selected. The whole group gets `disabled` while no resonance is chosen. Styling uses Tailwind classes in `className` only, no additions to `styles.css`.
- *Alternative:* reuse `Chip`s like the Ficha tab. Rejected because the design shows a segmented bar.

### 6. Stepper inline in `FeedForm`
A `bg-wash` strip with two white square buttons (`aria-label` "Saciar menos" / "Saciar mais") and a centered value (`font-serif` bold) with the "SACIAR" label (`font-label` uppercase), as `<output aria-live="polite">`. Bounds are `[min(1, fome), fome]`, so both buttons are disabled at Hunger 0. It is used in only one place, so it is not extracted into a shared component.

### 7. Primary button
`Button variant="destructive"` (blood). The label is `Alimentar · Fome ${fome} → ${fome − amount}` when `amount > 0`, or "Registrar ressonância" when Hunger is 0. It is disabled when `amount === 0 && !resonance`. "Cancelar" uses `variant="outline"` and closes the dialog.

## Risks / Trade-offs

- [The app no longer enforces the Blood Potency rules for feeding] → This was the user's decision. The player takes on that judgment, and "Penalidade de Alimentação" stays visible in the Resumo tab.
- [Defaulting "Saciar" to the full Hunger lets the player reach Hunger 0 without killing, which V5 does not allow] → Same as the reference design. The Hunger 0 alert still fires, and the player can lower the value.
- [The ToggleGroup copies the SegmentedTabs classes (duplication)] → The two components sit side by side in `components/vtm/`. If they drift, extract a shared class constant.
