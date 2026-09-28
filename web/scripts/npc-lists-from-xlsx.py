#!/usr/bin/env python3
"""Converte a planilha do Gerador de NPC em `web/src/data/npc-lists.ts`.

Uso:
    python3 web/scripts/npc-lists-from-xlsx.py <Gerador_NPC_Sertao_Alagoano_1936.xlsx>

Lê a aba `Listas` (linha 1 = nome da coluna; repetições são mantidas, porque
repetir um item é o peso dele) e os pesos de estrato e de exposição da aba
`Referência`. Só a biblioteca padrão do Python.
"""

import json
import re
import sys
import zipfile
import xml.etree.ElementTree as ET
from pathlib import Path

NS = {
    "m": "http://schemas.openxmlformats.org/spreadsheetml/2006/main",
    "r": "http://schemas.openxmlformats.org/officeDocument/2006/relationships",
}
T = f"{{{NS['m']}}}t"

# colunas que a aba `NPC` da planilha não usa
UNUSED = {"Alcunha_H", "Alcunha_M", "Carrega", "OndeEncontra"}

OUT = Path(__file__).resolve().parent.parent / "src" / "data" / "npc-lists.ts"


def col_index(ref: str) -> int:
    n = 0
    for ch in re.match(r"[A-Z]+", ref).group():
        n = n * 26 + ord(ch) - 64
    return n


def read_sheets(path: str) -> dict[str, list[dict[int, str]]]:
    z = zipfile.ZipFile(path)
    shared = []
    if "xl/sharedStrings.xml" in z.namelist():
        root = ET.fromstring(z.read("xl/sharedStrings.xml"))
        for si in root.findall("m:si", NS):
            shared.append("".join(t.text or "" for t in si.iter(T)))
    wb = ET.fromstring(z.read("xl/workbook.xml"))
    rels = ET.fromstring(z.read("xl/_rels/workbook.xml.rels"))
    targets = {r.get("Id"): r.get("Target") for r in rels}
    out = {}
    for sheet in wb.find("m:sheets", NS):
        target = targets[sheet.get(f"{{{NS['r']}}}id")].lstrip("/")
        if not target.startswith("xl/"):
            target = "xl/" + target
        rows = []
        for row in ET.fromstring(z.read(target)).iter(f"{{{NS['m']}}}row"):
            cells = {}
            for c in row.findall("m:c", NS):
                v = c.find("m:v", NS)
                kind = c.get("t")
                if kind == "s" and v is not None:
                    value = shared[int(v.text)]
                elif kind == "inlineStr":
                    value = "".join(t.text or "" for t in c.iter(T))
                else:
                    value = v.text if v is not None else None
                if value not in (None, ""):
                    cells[col_index(c.get("r"))] = value.strip()
            rows.append(cells)
        out[sheet.get("name")] = rows
    return out


def weight(rows: list[dict[int, str]], label_prefix: str) -> int:
    for cells in rows:
        if cells.get(1, "").startswith(label_prefix):
            return round(float(cells[2]))
    raise SystemExit(f"Peso '{label_prefix}' não encontrado na aba Referência.")


def main() -> None:
    if len(sys.argv) != 2:
        raise SystemExit(__doc__)
    sheets = read_sheets(sys.argv[1])
    listas = sheets["Listas"]
    header = listas[0]
    lists: dict[str, list[str]] = {}
    for col, name in sorted(header.items()):
        if name in UNUSED:
            continue
        # a planilha para no primeiro vazio (COUNTA); aqui também
        items = []
        for cells in listas[1:]:
            if col not in cells:
                break
            items.append(cells[col])
        lists[name] = items

    ref = sheets["Referência"]
    weights = {
        "estrato": [weight(ref, f"{n} ·") for n in (1, 2, 3)],
        "exposicao": [weight(ref, f"Grau {n} ·") for n in range(5)],
    }

    body = [
        "// gerado por web/scripts/npc-lists-from-xlsx.py — não editar.",
        "// Fonte: Gerador_NPC_Sertao_Alagoano_1936 (abas Listas e Referência).",
        "// Itens repetidos são o peso deles: duas vezes, o dobro de chance.",
        "",
        "/** Pesos em 100: estrato 1–3 e exposição ao oculto 0–4. */",
        f"export const NPC_WEIGHTS = {json.dumps(weights, ensure_ascii=False)} as const;",
        "",
        f"export const NPC_LISTS = {json.dumps(lists, ensure_ascii=False, indent=2)} as const;",
        "",
        "export type NpcListName = keyof typeof NPC_LISTS;",
        "",
    ]
    OUT.write_text("\n".join(body), encoding="utf-8")
    total = sum(len(v) for v in lists.values())
    print(f"{OUT}: {len(lists)} listas, {total} itens")


if __name__ == "__main__":
    main()
