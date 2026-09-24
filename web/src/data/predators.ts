// Portado de design/reference/logic.js. Não editar à mão sem conferir a referência.
export interface Predator {
  adjustments: readonly string[];
  description: string;
  disciplines: readonly string[];
  name: string;
  specialties: readonly string[];
}

export const PREDATORS: readonly Predator[] = [
  {
    adjustments: ["−1 de Humanidade", "Contatos •• (criminosos)"],
    description: "Caça pela força e leva o sangue à força.",
    disciplines: ["Celeridade", "Potência"],
    name: "Gato de Rua",
    specialties: ["Briga (Agarrar)", "Intimidação (Assalto)"],
  },
  {
    adjustments: [
      "3 pontos em Contatos",
      "−2 pontos entre Recursos e Escravos",
      "Defeito Inimigo •• (polícia ou vítima)",
    ],
    description: "Troca proteção e favores por sangue.",
    disciplines: ["Domínio", "Potência"],
    name: "Extorsionário",
    specialties: ["Intimidação (Chantagem)", "Ofícios (Armadilhas)"],
  },
  {
    adjustments: [
      "−1 de Humanidade",
      "Vantagem Belíssimo ••",
      "Defeito Inimigo • (amante preterido)",
    ],
    description: "Seduz a presa antes de beber.",
    disciplines: ["Fascinação", "Presença"],
    name: "Sereia",
    specialties: ["Persuasão (Seduzir)", "Subterfúgio (Sedução)"],
  },
  {
    adjustments: [
      "Vantagem Estômago de Ferro •••",
      "Defeito Inimigo •• (policial ou traficante)",
    ],
    description: "Vive de bolsas de sangue e restos.",
    disciplines: ["Fortitude", "Ofuscação"],
    name: "Saqueador",
    specialties: ["Ladroagem (Arrombamento)", "Manha (Mercado Negro)"],
  },
  {
    adjustments: [
      "−1 de Humanidade",
      "+1 de Potência de Sangue",
      "Defeito Presa Excluída (mortais)",
      "Defeito Segredo Obscuro •• (diabolista) ou Evitado ••",
    ],
    description: "Alimenta-se de outros vampiros.",
    disciplines: ["Celeridade", "Potência"],
    name: "Sanguessuga",
    specialties: ["Briga (Vampiros)", "Subterfúgio (Emboscada)"],
  },
  {
    adjustments: [
      "3 pontos em Rebanho (família mortal)",
      "Defeito Segredo Obscuro • (Doméstico)",
    ],
    description: "Bebe de família, amigos e vizinhos.",
    disciplines: ["Animalismo", "Domínio"],
    name: "Doméstico",
    specialties: ["Persuasão (Manipulação)", "Subterfúgio (Cobrir Rastros)"],
  },
  {
    adjustments: [
      "+1 de Humanidade",
      "Defeito Segredo Obscuro •• (violação da Máscara)",
    ],
    description: "Só se alimenta com consentimento.",
    disciplines: ["Auspícios", "Fortitude"],
    name: "Consensualista",
    specialties: ["Medicina (Flebotomia)", "Persuasão (Vítimas)"],
  },
  {
    adjustments: [
      "+1 de Humanidade",
      "Defeito Vegano •• (fome dobrada com sangue humano)",
      "Exige Humanidade 8 ou mais",
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
      "3 pontos entre Rebanho e Fama",
      "2 pontos entre Inimigos e Perseguido",
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
    adjustments: ["1 ponto em Recursos"],
    description: "Bebe de quem dorme.",
    disciplines: ["Auspícios", "Ofuscação"],
    name: "João Pestana",
    specialties: ["Furtividade (Invasão)", "Ladroagem (Arrombamento)"],
  },
  {
    adjustments: [
      "Fama ••",
      "Contatos •",
      "Defeito Status Negativo • (fora da subcultura)",
    ],
    description: "Domina uma subcultura e se serve dela.",
    disciplines: ["Domínio", "Fascinação"],
    name: "Rainha da Cena",
    specialties: ["Etiqueta (cena escolhida)", "Performance (cena escolhida)"],
  },
  {
    adjustments: [
      "Rebanho •• (coveiros e enlutados)",
      "Vantagem Estômago de Ferro •••",
      "Defeito Assombrado ••",
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
