// Portado de design/reference/logic.js. Não editar à mão sem conferir a referência.
export interface TextFieldDef {
  key: TextFieldKey;
  label: string;
  placeholder?: string;
}

export type TextFieldKey =
  | "nome"
  | "conceito"
  | "cronica"
  | "predador"
  | "ambicao"
  | "cla"
  | "senhor"
  | "desejo"
  | "geracao"
  | "principios"
  | "perdicao"
  | "idadeReal"
  | "idadeAparente"
  | "nascimento"
  | "morte"
  | "aparencia"
  | "tracos"
  | "historia"
  | "notas";

export const IDENTITY_FIELDS: readonly TextFieldDef[] = [
  { key: "nome", label: "Nome", placeholder: "ex. Vitória Salles" },
  { key: "conceito", label: "Conceito", placeholder: "ex. detetive caído" },
  { key: "cronica", label: "Crônica", placeholder: "ex. Noites de São Paulo" },
  { key: "predador", label: "Predador", placeholder: "ex. Sereia" },
  { key: "ambicao", label: "Ambição", placeholder: "ex. controlar o porto" },
  { key: "cla", label: "Clã", placeholder: "ex. Ventrue" },
  { key: "senhor", label: "Senhor", placeholder: "ex. Aurélio Braga" },
  { key: "desejo", label: "Desejo", placeholder: "ex. uma noite em paz" },
  { key: "geracao", label: "Geração", placeholder: "ex. 12ª" },
];

export const LONG_FIELDS: readonly TextFieldDef[] = [
  { key: "principios", label: "Princípios da Crônica" },
  { key: "perdicao", label: "Perdição do Clã" },
];

export const BIO_FIELDS: readonly TextFieldDef[] = [
  { key: "idadeReal", label: "Idade Verdadeira" },
  { key: "idadeAparente", label: "Idade Aparente" },
  { key: "nascimento", label: "Data de Nascimento" },
  { key: "morte", label: "Data de Morte" },
  { key: "aparencia", label: "Aparência" },
  { key: "tracos", label: "Traços Distintivos" },
];

export const RESONANCES: readonly string[] = [
  "Colérica",
  "Melancólica",
  "Fleumática",
  "Sanguínea",
  "Sem ressonância",
];
export const RESONANCE_INTENSITIES: readonly string[] = [
  "Negligenciável",
  "Difusa",
  "Intensa",
  "Aguçada",
];
