/** Tags que o texto rico dos especiais aceita, sempre sem atributos. */
const ALLOWED = new Set([
  "P",
  "BR",
  "STRONG",
  "B",
  "EM",
  "I",
  "U",
  "UL",
  "OL",
  "LI",
]);

/** Descartadas com o conteúdo, não só a tag. */
const DROPPED = new Set([
  "SCRIPT",
  "STYLE",
  "TEMPLATE",
  "IFRAME",
  "OBJECT",
  "NOSCRIPT",
]);

function clean(node: Node, doc: Document): Node[] {
  if (node.nodeType === Node.TEXT_NODE) {
    return [doc.createTextNode(node.textContent ?? "")];
  }
  if (node.nodeType !== Node.ELEMENT_NODE) {
    return [];
  }
  const el = node as Element;
  if (DROPPED.has(el.tagName)) {
    return [];
  }
  const children = [...el.childNodes].flatMap((child) => clean(child, doc));
  if (!ALLOWED.has(el.tagName)) {
    return children;
  }
  const copy = doc.createElement(el.tagName.toLowerCase());
  copy.append(...children);
  return [copy];
}

/**
 * HTML restrito a `p, br, strong, b, em, i, u, ul, ol, li`, sem atributos:
 * outras tags viram só o texto delas. Usado ao editar, ao gravar e sempre
 * antes de exibir.
 */
export function sanitizeRichText(html: string): string {
  if (!html) {
    return "";
  }
  const template = document.createElement("template");
  template.innerHTML = html;
  const box = document.createElement("div");
  for (const node of [...template.content.childNodes]) {
    box.append(...clean(node, document));
  }
  return box.innerHTML;
}

/** Só o texto, para saber se o especial está vazio. */
export function richTextIsEmpty(html: string): boolean {
  const template = document.createElement("template");
  template.innerHTML = html;
  return (template.content.textContent ?? "").trim() === "";
}
