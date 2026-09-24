import { autoFit } from "#/components/vtm/trait-grid";
import { IDENTITY_FIELDS } from "#/data/fields";
import { WizardTextField } from "./form-fields";
import { FINAL_KEYS } from "./schema";

const FINAL_FIELDS = FINAL_KEYS.map((key) => {
  const def = IDENTITY_FIELDS.find((f) => f.key === key);
  return { key, label: def?.label ?? key, placeholder: def?.placeholder };
});

export function Step8Final() {
  return (
    <div className="grid gap-x-5 gap-y-4" style={autoFit(220)}>
      {FINAL_FIELDS.map((f) => (
        <WizardTextField
          key={f.key}
          label={f.label}
          name={f.key}
          placeholder={f.placeholder}
        />
      ))}
    </div>
  );
}
