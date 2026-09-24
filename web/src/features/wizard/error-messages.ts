import type { FieldErrors } from "react-hook-form";

const MAX_MESSAGES = 3;
const ENDS_WITH_PUNCTUATION = /[.!?]$/;

function visit(node: unknown, out: string[]): void {
  if (typeof node !== "object" || node === null) {
    return;
  }
  const { message } = node as { message?: unknown };
  if (typeof message === "string" && message) {
    out.push(message);
    return;
  }
  for (const [key, child] of Object.entries(node)) {
    // `ref` aponta para o elemento do DOM, não para erros aninhados
    if (key !== "ref") {
      visit(child, out);
    }
  }
}

/** Mensagens únicas dos erros do formulário, na ordem em que aparecem, com ponto final. */
export function collectErrorMessages(errors: FieldErrors): string[] {
  const out: string[] = [];
  visit(errors, out);
  const withPeriod = out.map((m) =>
    ENDS_WITH_PUNCTUATION.test(m) ? m : `${m}.`
  );
  return [...new Set(withPeriod)];
}

/** Texto do toast: as três primeiras mensagens e "e mais N." para o resto. */
export function formatStepErrors(messages: readonly string[]): string {
  const shown = messages.slice(0, MAX_MESSAGES).join(" ");
  const rest = messages.length - MAX_MESSAGES;
  return rest > 0 ? `${shown} …e mais ${rest}.` : shown;
}
