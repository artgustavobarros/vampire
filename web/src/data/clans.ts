// Portado de design/reference/logic.js. Não editar à mão sem conferir a referência.
export interface Clan {
  bane: string;
  baneText: string;
  compulsion: string;
  compulsionText: string;
  disciplines: readonly string[];
  name: string;
}

export const CLANS: readonly Clan[] = [
  {
    bane: "Temperamento Violento",
    baneText:
      "O Sangue dos Brujah fervilhe com fúria malcontida, que explode sob a menor provocação.",
    compulsion: "Rebelião",
    compulsionText:
      "Se posiciona contra qualquer um ou qualquer coisa que lhe pareça representar o status quo na situação.",
    disciplines: ["Celeridade", "Potência", "Presença"],
    name: "Brujah",
  },
  {
    bane: "Traços Bestiais",
    baneText:
      "Quando em frenesi ganham um ou mais de um aspecto animalesco: um traço físico, um odor o um comportamento.",
    compulsion: "Impulsos Ferais",
    compulsionText:
      "Retorna a um estado animal a um ponto onde a fala se torna difícil, as roupas desconfortáveis e os argumentos são mais bem-resolvidos com garras e presas.",
    disciplines: ["Animalismo", "Fortitude", "Proteanismo"],
    name: "Gangrel",
  },
  {
    bane: "Perspectiva Fraturada",
    baneText:
      "Todos são amaldiçoados com pelo menos um tipo de transtorno mental.",
    compulsion: "Delírio",
    compulsionText:
      "Experimenta o que podem ser verdades ou presságios, mas que os outros chama de delírios trazidos à tona pela Fome",
    disciplines: ["Auspícios", "Dominação", "Ofuscação"],
    name: "Malkaviano",
  },
  {
    bane: "Repulsivo",
    baneText:
      "Eles são vistos como grotestos e quase sempre aterrorizantes.",
    compulsion: "Criptofilia",
    compulsionText:
      "Ele é consumido por uma fome de segredos quase tão forte quanto sua sede de sangue.",
    disciplines: ["Animalismo", "Ofuscação", "Potência"],
    name: "Nosferatu",
  },
  {
    bane: "Fixação Estética",
    baneText:
      "Eles desejam tão intensamente a beleza que acabam sofrendo em sua ausência.",
    compulsion: "Obsessão",
    compulsionText: "Torna-se temporariamente obcecado com algo singularmente belo, ficando incapaz de pensar em qualquer outra coisa.",
    disciplines: ["Auspícios", "Celeridade", "Presença"],
    name: "Toreador",
  },
  {
    bane: "Sangue Deficiente",
    baneText:
      "O Vitae Tremere não tem mais a capacide de criar Laços de Sangue com outros Membros.",
    compulsion: "Perfeccionismo",
    compulsionText:
      "Nada a não ser o melhor satisfaz. Qualquer outra coisa provova uma profunda sensaçãõ de falha.",
    disciplines: ["Auspícios", "Dominação", "Feitiçaria de Sangue"],
    name: "Tremere",
  },
  {
    bane: "Paladar Refinado",
    baneText:
      "Quando bebe sangue de qualquer mortal que não seja da sua preferência, ele precisa fazer um grande esforço de vontade para que o sangue não folte na forma de vômito escarlate.",
    compulsion: "Arrogância",
    compulsionText:
      "A necessidade que tem de governas aflora. Nada pode impedi-lo de assumir o controle de uma situação.",
    disciplines: ["Dominação", "Fortitude", "Presença"],
    name: "Ventrue",
  },
  {
    bane: "Imagem Distorcida",
    baneText:
      "Não aparece em espelhos, câmeras e microfones sem falhar tecnologia por perto.",
    compulsion: "Crueldade",
    compulsionText:
      "Fracasso não é uma opção. ",
    disciplines: ["Dominação", "Oblívio", "Potência"],
    name: "Lasombra",
  },
  {
    bane: "Sede de Sangue",
    baneText:
      "Provar sangue vampírico exige teste de frenesi de fome contra a Gravidade da Perdição.",
    compulsion: "Julgamento",
    compulsionText:
      "Precisa punir quem violou o próprio código, mesmo sem plateia.",
    disciplines: ["Celeridade", "Feitiçaria de Sangue", "Ofuscação"],
    name: "Banu Haqim",
  },
  {
    bane: "Aversão à Luz",
    baneText:
      "O sangue do ministro abomina a luz.",
    compulsion: "Transgressão",
    compulsionText:
      "Tem que levar alguém a quebrar um tabu, ou quebrá-lo você mesmo.",
    disciplines: ["Ofuscação", "Presença", "Proteanismo"],
    name: "Ministério",
  },
  {
    bane: "Beijo Doloroso",
    baneText:
      "Sua mordida é agonia: nunca causa êxtase e a vítima sempre resiste.",
    compulsion: "Morbidez",
    compulsionText:
      "Só consegue pensar em morte e precisa entender como aquilo acabou.",
    disciplines: ["Auspícios", "Fortitude", "Oblívio"],
    name: "Hecata",
  },
  {
    bane: "Condenado a Vagar",
    baneText: "Dormir duas vezes no mesmo lugar traz dano agravado ao acordar.",
    compulsion: "Destino Tentador",
    compulsionText:
      "Precisa escolher o caminho mais arriscado só para ver o que acontece.",
    disciplines: ["Animalismo", "Ofuscação", "Presença"],
    name: "Ravnos",
  },
  {
    bane: "Preso à Terra",
    baneText:
      "Precisa dormir cercado por terra do seu Dominação, ou não recupera nada.",
    compulsion: "Cobiça",
    compulsionText:
      "Tem de possuir e controlar o que considera seu, sem dividir.",
    disciplines: ["Animalismo", "Dominação", "Proteanismo"],
    name: "Tzimisce",
  },
  {
    bane: "Caçados",
    baneText:
      "O terceiro olho os marca e o sangue deles é cobiçado por outros clãs.",
    compulsion: "Empatia Afetiva",
    compulsionText:
      "Sente a dor alheia como sua e precisa aliviá-la antes de agir.",
    disciplines: ["Auspícios", "Dominação", "Fortitude"],
    name: "Salubri",
  },
  {
    bane: "Marginalizado",
    baneText:
      "Intocados pelos Antidiluvianos, os Caitiff não compartilham nenhuma perdição.",
    compulsion: "Nenhuma",
    compulsionText: "Caitiff não tem Compulsão de clã.",
    disciplines: ["Livre escolha"],
    name: "Caitiff",
  },
  {
    bane: "Sangue-ralo",
    baneText:
      "Sem Perdição de clã, mas também sem Potência de Sangue e com méritos e falhas próprios.",
    compulsion: "Nenhuma",
    compulsionText: "Sangue Fraco não tem Compulsão de clã.",
    disciplines: ["Alquimia de Sangue-ralo"],
    name: "Sangue-ralo",
  },
];

export function findClan(name: string | undefined): Clan | undefined {
  const key = (name ?? "").trim();
  return CLANS.find((c) => c.name === key);
}
