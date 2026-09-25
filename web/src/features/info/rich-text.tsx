import type { ReactNode } from "react";
import { cn } from "#/lib/utils";

// ***negrito e itálico***, **negrito** (pode conter itálico) e *itálico* (sem espaço colado aos marcadores)
const INLINE = /\*\*\*(.+?)\*\*\*|\*\*(.+?)\*\*|\*(?![\s*])([^*]+?)(?<!\s)\*/g;
const PARAGRAPH = /\n{2,}/;

function inline(text: string, key: string): ReactNode[] {
  const out: ReactNode[] = [];
  let last = 0;
  for (const m of text.matchAll(INLINE)) {
    if (m.index > last) {
      out.push(text.slice(last, m.index));
    }
    const k = `${key}-${m.index}`;
    if (m[1] !== undefined) {
      out.push(
        <strong className="font-bold" key={k}>
          <em className="italic">{m[1]}</em>
        </strong>
      );
    } else if (m[2] === undefined) {
      out.push(
        <em className="italic" key={k}>
          {m[3]}
        </em>
      );
    } else {
      out.push(
        <strong className="font-bold" key={k}>
          {inline(m[2], k)}
        </strong>
      );
    }
    last = m.index + m[0].length;
  }
  if (last < text.length) {
    out.push(text.slice(last));
  }
  return out;
}

function lines(text: string, key: string): ReactNode[] {
  return text.split("\n").flatMap((line, i) => {
    const k = `${key}-${i}`;
    const parts = inline(line, k);
    return i ? [<br key={`${k}-br`} />, ...parts] : parts;
  });
}

/** Texto do catálogo em linha: `**negrito**`, `*itálico*` e `\n` como quebra de linha. */
export function RichText({ text }: { text: string }) {
  return <>{lines(text, "t")}</>;
}

/** Como `RichText`, mas uma linha em branco (`\n\n`) separa parágrafos. */
export function RichParagraphs({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  return (
    <>
      {text.split(PARAGRAPH).map((p, i) => (
        <p className={cn("m-0 mt-3 first:mt-0", className)} key={`p-${i}`}>
          {lines(p, `p-${i}`)}
        </p>
      ))}
    </>
  );
}
