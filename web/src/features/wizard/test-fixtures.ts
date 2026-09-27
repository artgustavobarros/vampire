import { blankSheet } from "#/lib/sheet";
import type { Sheet } from "#/lib/types";

/** Ficha que passa em todos os passos do assistente (só para testes). */
export function completeSheet(over: Partial<Sheet> = {}): Sheet {
  const base = blankSheet();
  return {
    ...base,
    attrs: {
      ...base.attrs,
      Autocontrole: 2,
      Carisma: 3,
      Destreza: 3,
      Determinação: 2,
      Força: 4,
      Inteligência: 2,
      Manipulação: 1,
      Raciocínio: 2,
      Vigor: 3,
    },
    cla: "Brujah",
    disc: [
      { nivel: 2, nome: "Potência", powers: [] },
      { nivel: 1, nome: "Celeridade", powers: [] },
    ],
    dist: "Equilibrado",
    espec: { Briga: ["Agarrar"] },
    especLivre: "Briga",
    geracao: "12ª",
    meritos: [
      { nome: "Recursos", pontos: 4, tipo: "vantagem" },
      { nome: "Contatos", pontos: 3, tipo: "vantagem" },
      { nome: "Inimigo", pontos: 2, tipo: "defeito" },
    ],
    nome: "Ana Brava",
    predador: "Gato de Rua",
    predDisc: "Potência",
    predEscolhas: {},
    predEspec: "Briga (Agarramento)",
    predEspecNome: "Agarrar",
    predPoder: "Força Prodigiosa",
    skills: {
      ...base.skills,
      Atletismo: 2,
      Briga: 3,
      Condução: 2,
      Etiqueta: 3,
      Furtividade: 1,
      Intimidação: 2,
      Investigação: 2,
      Manha: 2,
      Medicina: 1,
      Percepção: 1,
      Persuasão: 3,
      Política: 1,
      Sagacidade: 1,
      Subterfúgio: 1,
      Tecnologia: 1,
    },
    ...over,
  };
}
