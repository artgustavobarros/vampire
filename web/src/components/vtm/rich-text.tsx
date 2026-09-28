import { useEffect, useRef, useState } from "react";
import { sanitizeRichText } from "#/lib/rich-text";
import { cn } from "#/lib/utils";

/** Listas e parágrafos do texto rico, só com classes Tailwind. */
const PROSE =
  "[&_ol]:my-1 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:my-0 [&_ul]:my-1 [&_ul]:list-disc [&_ul]:pl-6";

/** Exibe o texto rico de um especial, sempre limpo antes. */
export function RichText({
  className,
  html,
}: {
  className?: string;
  html: string;
}) {
  return (
    <div
      className={cn(PROSE, className)}
      // biome-ignore lint/security/noDangerouslySetInnerHtml: HTML limpo por `sanitizeRichText` (lista de tags permitidas, sem atributos)
      dangerouslySetInnerHTML={{ __html: sanitizeRichText(html) }}
    />
  );
}

const COMMANDS = [
  { command: "bold", label: "N", name: "Negrito", style: "font-bold" },
  { command: "italic", label: "I", name: "Itálico", style: "italic" },
  { command: "underline", label: "S", name: "Sublinhado", style: "underline" },
  {
    command: "insertUnorderedList",
    label: "• Lista",
    name: "Lista com marcadores",
    style: "",
  },
  {
    command: "insertOrderedList",
    label: "1. Lista",
    name: "Lista numerada",
    style: "",
  },
] as const;

type Command = (typeof COMMANDS)[number]["command"];

// `execCommand` é obsoleto mas é o que todos os navegadores têm para isso;
// fica isolado aqui (o jsdom dos testes não tem)
function exec(command: string, value?: string): void {
  document.execCommand?.(command, false, value);
}

function active(command: Command): boolean {
  try {
    return document.queryCommandState?.(command) ?? false;
  } catch {
    return false;
  }
}

interface RichTextEditorProps {
  label: string;
  onChange: (html: string) => void;
  value: string;
}

/**
 * Editor dos especiais: barra N/I/S/• Lista/1. Lista sobre um
 * `contentEditable`. Sai sempre HTML limpo; colar também passa pela limpeza.
 */
export function RichTextEditor({
  label,
  onChange,
  value,
}: RichTextEditorProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [pressed, setPressed] = useState<Partial<Record<Command, boolean>>>({});

  // o conteúdo só é escrito no DOM de fora quando difere (senão o cursor pula)
  useEffect(() => {
    const clean = sanitizeRichText(value);
    const current = ref.current?.innerHTML;
    if (current !== undefined && sanitizeRichText(current) !== clean) {
      ref.current?.replaceChildren();
      ref.current?.insertAdjacentHTML("afterbegin", clean);
    }
  }, [value]);

  const refresh = () =>
    setPressed(
      Object.fromEntries(COMMANDS.map((c) => [c.command, active(c.command)]))
    );

  const emit = () => onChange(sanitizeRichText(ref.current?.innerHTML ?? ""));

  return (
    <div className="border border-line bg-white">
      <div
        aria-label={`Formatação de ${label}`}
        className="flex flex-wrap gap-1.5 border-line border-b p-2"
        role="toolbar"
      >
        {COMMANDS.map((c) => (
          <button
            aria-label={c.name}
            aria-pressed={pressed[c.command] ?? false}
            className={cn(
              "min-h-9 min-w-9 cursor-pointer border px-2 font-label font-semibold text-xs leading-none focus-visible:outline-2 focus-visible:outline-ink",
              pressed[c.command]
                ? "border-ink bg-ink text-white"
                : "border-line bg-white text-ink",
              c.style
            )}
            key={c.command}
            onClick={() => {
              ref.current?.focus();
              exec(c.command);
              emit();
              refresh();
            }}
            // mantém a seleção do texto ao tocar no botão
            onMouseDown={(e) => e.preventDefault()}
            type="button"
          >
            {c.label}
          </button>
        ))}
      </div>
      {/* biome-ignore lint/a11y/useSemanticElements: editor de texto rico não tem elemento nativo */}
      <div
        aria-label={label}
        aria-multiline="true"
        className={cn(
          PROSE,
          "min-h-24 px-3 py-2 text-lg outline-none focus-visible:outline-2 focus-visible:outline-ink focus-visible:-outline-offset-2"
        )}
        contentEditable
        onBlur={(e) => {
          const el = e.currentTarget;
          const clean = sanitizeRichText(el.innerHTML);
          if (clean !== el.innerHTML) {
            el.innerHTML = clean;
          }
          onChange(clean);
        }}
        onInput={emit}
        onKeyUp={refresh}
        onMouseUp={refresh}
        onPaste={(e) => {
          e.preventDefault();
          const html = e.clipboardData.getData("text/html");
          const text = e.clipboardData.getData("text/plain");
          if (html) {
            exec("insertHTML", sanitizeRichText(html));
          } else {
            exec("insertText", text);
          }
          emit();
        }}
        ref={ref}
        role="textbox"
        suppressContentEditableWarning
        tabIndex={0}
      />
    </div>
  );
}
