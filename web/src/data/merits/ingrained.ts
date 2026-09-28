// Falhas de Disciplina Enraizada: sem valor em pontos; trocam poderes extras por um preço.
import type { MeritTemplate } from "./model";

const ingrained = (
  name: string,
  alias: string,
  discipline: string,
  effect: string
): MeritTemplate => ({
  aliases: [alias],
  category: "Falhas de Disciplina Enraizada",
  description: `${discipline}: ${effect} Aumenta quantos poderes da Disciplina você pode comprar; não tem valor em pontos.`,
  name,
  points: 0,
  requires: { discipline },
  source: "Tattered Facade",
  tipo: "defeito",
});

export const INGRAINED_FLAWS: readonly MeritTemplate[] = [
  ingrained(
    "Indomado",
    "Untamed",
    "Animalismo",
    "ao falhar em cavalgar a onda durante um frenesi, você sofre 2 Máculas que as Convicções não reduzem."
  ),
  ingrained(
    "Pesadelos Diurnos",
    "Daymares",
    "Auspícios",
    "ao despertar à noite, faça duas Checagens de Sangue em vez de uma."
  ),
  ingrained(
    "Animismo Sanguinário",
    "Sanguinary Animism",
    "Feitiçaria de Sangue",
    "−2 dados nas paradas Sociais e Mentais na cena seguinte a uma alimentação."
  ),
  ingrained(
    "Colapso",
    "Breakdown",
    "Celeridade",
    "falhar na Checagem de Sangue de um poder de Celeridade causa 1 de dano Agravado de Vitalidade."
  ),
  ingrained(
    "Rude",
    "Blunt",
    "Dominação",
    "você não pode gastar Força de Vontade para rerrolar testes Sociais."
  ),
  ingrained(
    "Tecido Cicatricial",
    "Scar Tissue",
    "Fortitude",
    "ferimentos curados com sangue continuam visíveis por um dia inteiro."
  ),
  ingrained(
    "Esmaecido",
    "Faded",
    "Ofuscação",
    "role um dado a menos nos testes de Remorso (mínimo 1)."
  ),
  ingrained(
    "Monstruosidade",
    "Monstrous",
    "Oblívio",
    "sua Humanidade conta como 3 menor para o Rubor da Vida e interações sociais."
  ),
  ingrained(
    "Instinto Assassino",
    "Killer Instinct",
    "Potência",
    "falhar na Checagem de Sangue de um poder de Potência exige teste de frenesi de Fúria."
  ),
  ingrained(
    "Egomaníaco",
    "Egomaniac",
    "Presença",
    "um crítico confuso ou uma disputa perdida com poderes de Presença exige teste de frenesi de Fúria."
  ),
  ingrained(
    "Estase",
    "Stasis",
    "Protean",
    "falhar na Checagem de Sangue de um poder de Protean deixa a volta à forma normal incompleta."
  ),
];
