// Conferido com o Livro Básico V5 PT-BR (p. 175–178) e o Players Guide (p. 107–109).
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
    };

/** Disciplina que o Predador oferece; `clas` restringe a opção a esses clãs. */
export interface PredatorDisciplineOption {
  clas?: readonly string[];
  nome: string;
}

export interface Predator {
  adjustments: readonly PredatorAdjustment[];
  /** clãs que não podem escolher este Predador */
  clasProibidos?: readonly string[];
  description: string;
  disciplines: readonly PredatorDisciplineOption[];
  name: string;
  /** Potência de Sangue máxima (a da Geração) para escolher este Predador */
  potenciaMaxima?: number;
  specialties: readonly string[];
}

/** Feitiçaria de Sangue: só Tremere (Livro Básico) e Banu Haqim (Players Guide). */
const BLOOD_SORCERY: PredatorDisciplineOption = {
  clas: ["Tremere", "Banu Haqim"],
  nome: "Feitiçaria de Sangue",
};

export const PREDATORS: readonly Predator[] = [
  {
    adjustments: [
      { kind: "humanidade", label: "−1 de Humanidade", valor: -1 },
      {
        detalhe: "criminosos",
        kind: "merito",
        label: "Contatos ••• (criminosos)",
        nome: "Contatos",
        pontos: 3,
        tipo: "vantagem",
      },
    ],
    description: "Persegue, domina e bebe de quem puder, à força.",
    disciplines: [{ nome: "Celeridade" }, { nome: "Potência" }],
    name: "Gato de Rua",
    specialties: ["Intimidação (Assalto à Mão Armada)", "Briga (Agarramento)"],
  },
  {
    adjustments: [
      {
        id: "contatos-recursos",
        kind: "escolha",
        label: "3 pontos entre Contatos e Recursos",
        modo: "dividir",
        opcoes: [{ nome: "Contatos" }, { nome: "Recursos" }],
        pontos: 3,
        tipo: "vantagem",
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
    description: "Troca proteção e serviços por sangue, por coerção.",
    disciplines: [{ nome: "Dominação" }, { nome: "Potência" }],
    name: "Extorsionário",
    specialties: ["Intimidação (Coerção)", "Ladroagem (Segurança)"],
  },
  {
    adjustments: [
      {
        kind: "merito",
        label: "Vantagem Bonito ••",
        nome: "Bonito",
        pontos: 2,
        tipo: "vantagem",
      },
      {
        detalhe: "amante desprezado ou parceiro ciumento",
        kind: "merito",
        label: "Defeito Inimigo • (amante desprezado ou parceiro ciumento)",
        nome: "Inimigo",
        pontos: 1,
        tipo: "defeito",
      },
    ],
    description: "Alimenta-se sob o pretexto de sexo e sedução.",
    disciplines: [{ nome: "Fortitude" }, { nome: "Presença" }],
    name: "Sereia",
    specialties: ["Persuasão (Sedução)", "Subterfúgio (Sedução)"],
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
        kind: "merito",
        label: "Defeito Inimigo ••",
        nome: "Inimigo",
        pontos: 2,
        tipo: "defeito",
      },
    ],
    clasProibidos: ["Ventrue"],
    description: "Compra, rouba ou obtém sangue frio em vez de caçar.",
    disciplines: [BLOOD_SORCERY, { nome: "Ofuscação" }],
    name: "Saqueador",
    specialties: ["Ladroagem (Abrir Fechaduras)", "Manha (Mercado Negro)"],
  },
  {
    adjustments: [
      { kind: "humanidade", label: "−1 de Humanidade", valor: -1 },
      { kind: "potencia", label: "+1 de Potência de Sangue", valor: 1 },
      {
        id: "segredo-evitado",
        kind: "escolha",
        label: "Defeito Segredo Obscuro •• (diablerista) ou Evitado ••",
        modo: "uma",
        opcoes: [
          { detalhe: "diablerista", nome: "Segredo Obscuro" },
          { nome: "Evitado" },
        ],
        pontos: 2,
        tipo: "defeito",
      },
      {
        detalhe: "mortais",
        kind: "merito",
        label: "Defeito Presa Excluída •• (mortais)",
        nome: "Presa Excluída",
        pontos: 2,
        tipo: "defeito",
      },
    ],
    description: "Alimenta-se de outros vampiros.",
    disciplines: [{ nome: "Celeridade" }, { nome: "Proteanismo" }],
    name: "Sanguessuga",
    specialties: ["Briga (Membros)", "Furtividade (contra Membros)"],
  },
  {
    adjustments: [
      {
        detalhe: "Trinchador",
        kind: "merito",
        label: "Defeito Segredo Obscuro • (Trinchador)",
        nome: "Segredo Obscuro",
        pontos: 1,
        tipo: "defeito",
      },
      {
        kind: "merito",
        label: "Vantagem Rebanho ••",
        nome: "Rebanho",
        pontos: 2,
        tipo: "vantagem",
      },
    ],
    description: "Bebe em segredo da própria família e amigos mortais.",
    disciplines: [{ nome: "Dominação" }, { nome: "Animalismo" }],
    name: "Doméstico",
    specialties: ["Persuasão (Gaslighting)", "Subterfúgio (Encobrimento)"],
  },
  {
    adjustments: [
      { kind: "humanidade", label: "+1 de Humanidade", valor: 1 },
      {
        detalhe: "Quebrador da Máscara",
        kind: "merito",
        label: "Defeito Segredo Obscuro • (Quebrador da Máscara)",
        nome: "Segredo Obscuro",
        pontos: 1,
        tipo: "defeito",
      },
      {
        detalhe: "sem consentimento",
        kind: "merito",
        label: "Defeito Presa Excluída • (sem consentimento)",
        nome: "Presa Excluída",
        pontos: 1,
        tipo: "defeito",
      },
    ],
    description: "Só se alimenta com consentimento.",
    disciplines: [{ nome: "Auspícios" }, { nome: "Fortitude" }],
    name: "Consensualista",
    specialties: ["Medicina (Flebotomia)", "Persuasão (Bolsas)"],
  },
  {
    adjustments: [
      { kind: "humanidade", label: "+1 de Humanidade", valor: 1 },
      {
        kind: "merito",
        label: "Defeito Fazendeiro ••",
        nome: "Fazendeiro",
        pontos: 2,
        tipo: "defeito",
      },
    ],
    clasProibidos: ["Ventrue"],
    description: "Só se alimenta de animais.",
    disciplines: [{ nome: "Animalismo" }, { nome: "Proteanismo" }],
    name: "Fazendeiro",
    potenciaMaxima: 2,
    specialties: [
      "Empatia com Animais (Animal Específico)",
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
        id: "inimigo-mitico",
        kind: "escolha",
        label: "2 pontos entre Inimigo e Defeito Mítico",
        modo: "dividir",
        opcoes: [{ nome: "Inimigo" }, { nome: "Defeito Mítico" }],
        pontos: 2,
        tipo: "defeito",
      },
    ],
    description: "Alimenta-se de fãs, fiéis ou do próprio culto.",
    disciplines: [BLOOD_SORCERY, { nome: "Presença" }],
    name: "Osíris",
    specialties: [
      "Ocultismo (Tradição Específica)",
      "Performance (Campo de Entretenimento)",
    ],
  },
  {
    adjustments: [
      {
        kind: "merito",
        label: "Vantagem Recursos •",
        nome: "Recursos",
        pontos: 1,
        tipo: "vantagem",
      },
    ],
    description: "Bebe de vítimas adormecidas.",
    disciplines: [{ nome: "Auspícios" }, { nome: "Ofuscação" }],
    name: "João Pestana",
    specialties: ["Medicina (Anestésicos)", "Furtividade (Invasão)"],
  },
  {
    adjustments: [
      {
        kind: "merito",
        label: "Vantagem Fama •",
        nome: "Fama",
        pontos: 1,
        tipo: "vantagem",
      },
      {
        kind: "merito",
        label: "Vantagem Contatos •",
        nome: "Contatos",
        pontos: 1,
        tipo: "vantagem",
      },
      {
        id: "rejeitado-presa",
        kind: "escolha",
        label:
          "Defeito Rejeitado • (fora da subcultura) ou Presa Excluída • (outra subcultura)",
        modo: "uma",
        opcoes: [
          { detalhe: "fora da subcultura", nome: "Rejeitado" },
          { detalhe: "outra subcultura", nome: "Presa Excluída" },
        ],
        pontos: 1,
        tipo: "defeito",
      },
    ],
    description: "Alimenta-se de uma subcultura onde tem status.",
    disciplines: [{ nome: "Dominação" }, { nome: "Potência" }],
    name: "Rainha da Cena",
    specialties: ["Etiqueta (Cena)", "Liderança (Cena)", "Manha (Cena)"],
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
        kind: "merito",
        label: "Vantagem Refúgio •",
        nome: "Refúgio",
        pontos: 1,
        tipo: "vantagem",
      },
      {
        kind: "merito",
        label: "Defeito Predador Óbvio ••",
        nome: "Predador Óbvio",
        pontos: 2,
        tipo: "defeito",
      },
    ],
    description: "Bebe de cadáveres frescos e dos enlutados.",
    disciplines: [{ nome: "Fortitude" }, { nome: "Oblívio" }],
    name: "Ladrão de Túmulos",
    specialties: ["Ocultismo (Rituais Fúnebres)", "Medicina (Cadáveres)"],
  },
  {
    adjustments: [
      { kind: "humanidade", label: "+1 de Humanidade", valor: 1 },
      {
        id: "aliados-influencia",
        kind: "escolha",
        label: "Aliados • ou Influência • (comunidade médica)",
        modo: "uma",
        opcoes: [
          { detalhe: "comunidade médica", nome: "Aliados" },
          { detalhe: "comunidade médica", nome: "Influência" },
        ],
        pontos: 1,
        tipo: "vantagem",
      },
      {
        detalhe: "mortais saudáveis",
        kind: "merito",
        label: "Defeito Presa Excluída • (mortais saudáveis)",
        nome: "Presa Excluída",
        pontos: 1,
        tipo: "defeito",
      },
    ],
    description: "Só se alimenta de quem está prestes a morrer.",
    disciplines: [{ nome: "Auspícios" }, { nome: "Oblívio" }],
    name: "Ceifador",
    specialties: ["Percepção (Morte)", "Ladroagem (Falsificação)"],
  },
  {
    adjustments: [
      { kind: "humanidade", label: "−1 de Humanidade", valor: -1 },
      {
        kind: "merito",
        label: "Vantagem Lacaios ••",
        nome: "Lacaios",
        pontos: 2,
        tipo: "vantagem",
      },
    ],
    description: "Seus lacaios conduzem a presa até você.",
    disciplines: [{ nome: "Dominação" }, { nome: "Ofuscação" }],
    name: "Montero",
    specialties: ["Liderança (Matilha de Caça)", "Furtividade (Tocaia)"],
  },
  {
    adjustments: [
      { kind: "humanidade", label: "−1 de Humanidade", valor: -1 },
      {
        kind: "merito",
        label: "Vantagem Sabujo de Sangue •",
        nome: "Sabujo de Sangue",
        pontos: 1,
        tipo: "vantagem",
      },
      {
        detalhe: "frequentadores do território de caça",
        kind: "merito",
        label: "Contatos • (frequentadores do território de caça)",
        nome: "Contatos",
        pontos: 1,
        tipo: "vantagem",
      },
    ],
    description: "Estuda e persegue a vítima até a hora do bote.",
    disciplines: [{ nome: "Animalismo" }, { nome: "Auspícios" }],
    name: "Perseguidor",
    specialties: ["Investigação (Perfil)", "Furtividade (Seguir)"],
  },
  {
    adjustments: [
      {
        kind: "merito",
        label: "Vantagem Refúgio •",
        nome: "Refúgio",
        pontos: 1,
        tipo: "vantagem",
      },
      {
        id: "lacaios-rebanho-refugio",
        kind: "escolha",
        label: "Lacaios •, Rebanho • ou um segundo ponto de Refúgio",
        modo: "uma",
        opcoes: [{ nome: "Lacaios" }, { nome: "Rebanho" }, { nome: "Refúgio" }],
        pontos: 1,
        tipo: "vantagem",
      },
      {
        id: "refugio-defeito",
        kind: "escolha",
        label: "Defeito Refúgio Assustador • ou Refúgio Assombrado •",
        modo: "uma",
        opcoes: [
          { nome: "Refúgio Assustador" },
          { nome: "Refúgio Assombrado" },
        ],
        pontos: 1,
        tipo: "defeito",
      },
    ],
    description: "Atrai a presa para o próprio covil.",
    disciplines: [{ nome: "Proteanismo" }, { nome: "Ofuscação" }],
    name: "Alçapão",
    specialties: ["Persuasão (Marketing)", "Furtividade (Emboscadas)"],
  },
];

export function findPredator(name: string | undefined): Predator | undefined {
  return PREDATORS.find((p) => p.name === (name ?? ""));
}
