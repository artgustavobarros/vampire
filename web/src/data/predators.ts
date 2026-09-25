// Portado de design/reference/logic.js. Não editar à mão sem conferir a referência.
export type MeritSide = "vantagem" | "defeito";

export interface MeritOption {
  detalhe?: string;
  nome: string;
}

/**
 * Ajuste obrigatório do Predador. `label` é só exibição; os outros campos são
 * a regra aplicada na ficha ao concluir o assistente.
 */
export type PredatorAdjustment =
  | { kind: "humanidade"; label: string; valor: number }
  | { kind: "potencia"; label: string; valor: number }
  | {
      detalhe?: string;
      kind: "merito";
      label: string;
      nome: string;
      pontos: number;
      tipo: MeritSide;
    }
  | {
      id: string;
      kind: "escolha";
      label: string;
      /** `uma`: uma opção leva todos os pontos; `dividir`: pontos entre as opções */
      modo: "uma" | "dividir";
      opcoes: readonly MeritOption[];
      pontos: number;
      tipo: MeritSide;
    }
  | { kind: "nota"; label: string };

export interface Predator {
  adjustments: readonly PredatorAdjustment[];
  description: string;
  disciplines: readonly string[];
  name: string;
  specialties: readonly string[];
}

export const PREDATORS: readonly Predator[] = [
  {
    adjustments: [
      { kind: "humanidade", label: "−1 de Humanidade", valor: -1 },
      {
        detalhe: "criminosos",
        kind: "merito",
        label: "Contatos •• (criminosos)",
        nome: "Contatos",
        pontos: 2,
        tipo: "vantagem",
      },
    ],
    description: "Caça pela força e leva o sangue à força.",
    disciplines: ["Celeridade", "Potência"],
    name: "Gato de Rua",
    specialties: ["Briga (Agarrar)", "Intimidação (Assalto)"],
  },
  {
    adjustments: [
      {
        kind: "merito",
        label: "3 pontos em Contatos",
        nome: "Contatos",
        pontos: 3,
        tipo: "vantagem",
      },
      {
        id: "recursos-escravos",
        kind: "escolha",
        label: "−2 pontos entre Recursos e Escravos",
        modo: "dividir",
        opcoes: [{ nome: "Recursos" }, { nome: "Escravos" }],
        pontos: 2,
        tipo: "defeito",
      },
      {
        detalhe: "polícia ou vítima",
        kind: "merito",
        label: "Defeito Inimigo •• (polícia ou vítima)",
        nome: "Inimigo",
        pontos: 2,
        tipo: "defeito",
      },
    ],
    description: "Troca proteção e favores por sangue.",
    disciplines: ["Domínio", "Potência"],
    name: "Extorsionário",
    specialties: ["Intimidação (Chantagem)", "Ofícios (Armadilhas)"],
  },
  {
    adjustments: [
      { kind: "humanidade", label: "−1 de Humanidade", valor: -1 },
      {
        kind: "merito",
        label: "Vantagem Belíssimo ••",
        nome: "Belíssimo",
        pontos: 2,
        tipo: "vantagem",
      },
      {
        detalhe: "amante preterido",
        kind: "merito",
        label: "Defeito Inimigo • (amante preterido)",
        nome: "Inimigo",
        pontos: 1,
        tipo: "defeito",
      },
    ],
    description: "Seduz a presa antes de beber.",
    disciplines: ["Fascinação", "Presença"],
    name: "Sereia",
    specialties: ["Persuasão (Seduzir)", "Subterfúgio (Sedução)"],
  },
  {
    adjustments: [
      {
        kind: "merito",
        label: "Vantagem Estômago de Ferro •••",
        nome: "Estômago de Ferro",
        pontos: 3,
        tipo: "vantagem",
      },
      {
        detalhe: "policial ou traficante",
        kind: "merito",
        label: "Defeito Inimigo •• (policial ou traficante)",
        nome: "Inimigo",
        pontos: 2,
        tipo: "defeito",
      },
    ],
    description: "Vive de bolsas de sangue e restos.",
    disciplines: ["Fortitude", "Ofuscação"],
    name: "Saqueador",
    specialties: ["Ladroagem (Arrombamento)", "Manha (Mercado Negro)"],
  },
  {
    adjustments: [
      { kind: "humanidade", label: "−1 de Humanidade", valor: -1 },
      { kind: "potencia", label: "+1 de Potência de Sangue", valor: 1 },
      {
        detalhe: "mortais",
        kind: "merito",
        label: "Defeito Presa Excluída •• (mortais)",
        nome: "Presa Excluída",
        pontos: 2,
        tipo: "defeito",
      },
      {
        id: "segredo-evitado",
        kind: "escolha",
        label: "Defeito Segredo Obscuro •• (diabolista) ou Evitado ••",
        modo: "uma",
        opcoes: [
          { detalhe: "diabolista", nome: "Segredo Obscuro" },
          { nome: "Evitado" },
        ],
        pontos: 2,
        tipo: "defeito",
      },
    ],
    description: "Alimenta-se de outros vampiros.",
    disciplines: ["Celeridade", "Potência"],
    name: "Sanguessuga",
    specialties: ["Briga (Vampiros)", "Subterfúgio (Emboscada)"],
  },
  {
    adjustments: [
      {
        detalhe: "família mortal",
        kind: "merito",
        label: "3 pontos em Rebanho (família mortal)",
        nome: "Rebanho",
        pontos: 3,
        tipo: "vantagem",
      },
      {
        detalhe: "Doméstico",
        kind: "merito",
        label: "Defeito Segredo Obscuro • (Doméstico)",
        nome: "Segredo Obscuro",
        pontos: 1,
        tipo: "defeito",
      },
    ],
    description: "Bebe de família, amigos e vizinhos.",
    disciplines: ["Animalismo", "Domínio"],
    name: "Doméstico",
    specialties: ["Persuasão (Manipulação)", "Subterfúgio (Cobrir Rastros)"],
  },
  {
    adjustments: [
      { kind: "humanidade", label: "+1 de Humanidade", valor: 1 },
      {
        detalhe: "violação da Máscara",
        kind: "merito",
        label: "Defeito Segredo Obscuro •• (violação da Máscara)",
        nome: "Segredo Obscuro",
        pontos: 2,
        tipo: "defeito",
      },
    ],
    description: "Só se alimenta com consentimento.",
    disciplines: ["Auspícios", "Fortitude"],
    name: "Consensualista",
    specialties: ["Medicina (Flebotomia)", "Persuasão (Vítimas)"],
  },
  {
    adjustments: [
      { kind: "humanidade", label: "+1 de Humanidade", valor: 1 },
      {
        detalhe: "fome dobrada com sangue humano",
        kind: "merito",
        label: "Defeito Vegano •• (fome dobrada com sangue humano)",
        nome: "Vegano",
        pontos: 2,
        tipo: "defeito",
      },
      { kind: "nota", label: "Exige Humanidade 8 ou mais" },
    ],
    description: "Alimenta-se de animais.",
    disciplines: ["Animalismo", "Protean"],
    name: "Fazendeiro",
    specialties: [
      "Empatia com Animais (tipo escolhido)",
      "Sobrevivência (Caça)",
    ],
  },
  {
    adjustments: [
      {
        id: "rebanho-fama",
        kind: "escolha",
        label: "3 pontos entre Rebanho e Fama",
        modo: "dividir",
        opcoes: [{ nome: "Rebanho" }, { nome: "Fama" }],
        pontos: 3,
        tipo: "vantagem",
      },
      {
        id: "inimigos-perseguido",
        kind: "escolha",
        label: "2 pontos entre Inimigos e Perseguido",
        modo: "dividir",
        opcoes: [{ nome: "Inimigos" }, { nome: "Perseguido" }],
        pontos: 2,
        tipo: "defeito",
      },
    ],
    description: "Mantém um culto que se oferece.",
    disciplines: ["Fascinação", "Domínio"],
    name: "Osíris",
    specialties: [
      "Ocultismo (culto escolhido)",
      "Performance (cena escolhida)",
    ],
  },
  {
    adjustments: [
      {
        kind: "merito",
        label: "1 ponto em Recursos",
        nome: "Recursos",
        pontos: 1,
        tipo: "vantagem",
      },
    ],
    description: "Bebe de quem dorme.",
    disciplines: ["Auspícios", "Ofuscação"],
    name: "João Pestana",
    specialties: ["Furtividade (Invasão)", "Ladroagem (Arrombamento)"],
  },
  {
    adjustments: [
      {
        kind: "merito",
        label: "Fama ••",
        nome: "Fama",
        pontos: 2,
        tipo: "vantagem",
      },
      {
        kind: "merito",
        label: "Contatos •",
        nome: "Contatos",
        pontos: 1,
        tipo: "vantagem",
      },
      {
        detalhe: "fora da subcultura",
        kind: "merito",
        label: "Defeito Status Negativo • (fora da subcultura)",
        nome: "Status Negativo",
        pontos: 1,
        tipo: "defeito",
      },
    ],
    description: "Domina uma subcultura e se serve dela.",
    disciplines: ["Domínio", "Fascinação"],
    name: "Rainha da Cena",
    specialties: ["Etiqueta (cena escolhida)", "Performance (cena escolhida)"],
  },
  {
    adjustments: [
      {
        detalhe: "coveiros e enlutados",
        kind: "merito",
        label: "Rebanho •• (coveiros e enlutados)",
        nome: "Rebanho",
        pontos: 2,
        tipo: "vantagem",
      },
      {
        kind: "merito",
        label: "Vantagem Estômago de Ferro •••",
        nome: "Estômago de Ferro",
        pontos: 3,
        tipo: "vantagem",
      },
      {
        kind: "merito",
        label: "Defeito Assombrado ••",
        nome: "Assombrado",
        pontos: 2,
        tipo: "defeito",
      },
    ],
    description: "Sangue de cadáveres frescos.",
    disciplines: ["Fortitude", "Ofuscação"],
    name: "Ladrão de Túmulos",
    specialties: ["Medicina (Cadáveres)", "Ocultismo (Rituais Fúnebres)"],
  },
];

export function findPredator(name: string | undefined): Predator | undefined {
  return PREDATORS.find((p) => p.name === (name ?? ""));
}
