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
      "Some a Gravidade da Perdição à dificuldade de testes para resistir a frenesi de fúria.",
    compulsion: "Rebeldia",
    compulsionText:
      "Precisa contrariar quem manda ou desfazer o que acabou de aceitar.",
    disciplines: ["Celeridade", "Potência", "Presença"],
    name: "Brujah",
  },
  {
    bane: "Traços Bestiais",
    baneText:
      "Em frenesi ganha traços animais: cada um dá −1 em uma categoria de teste pela cena.",
    compulsion: "Selvageria",
    compulsionText:
      "Perde a fala articulada e resolve tudo por instinto e violência.",
    disciplines: ["Animalismo", "Fortitude", "Protean"],
    name: "Gangrel",
  },
  {
    bane: "Perspectiva Fraturada",
    baneText:
      "Uma desordem sempre presente: em falha bestial ou frenesi, penalidade igual à Gravidade da Perdição.",
    compulsion: "Delírio",
    compulsionText:
      "Alucinações e paranoia: −2 em testes sociais e de Percepção.",
    disciplines: ["Auspícios", "Domínio", "Ofuscação"],
    name: "Malkaviano",
  },
  {
    bane: "Repulsivo",
    baneText:
      "Aparência 0 e impossível se passar por humano; falha automática em disfarce.",
    compulsion: "Criptofilia",
    compulsionText:
      "Só se move atrás de um segredo novo e não compartilha o que sabe.",
    disciplines: ["Animalismo", "Ofuscação", "Potência"],
    name: "Nosferatu",
  },
  {
    bane: "Fixação Estética",
    baneText:
      "Diante de algo feio ou de um ambiente sem beleza, perde dados iguais à Gravidade da Perdição.",
    compulsion: "Obsessão",
    compulsionText: "Fica preso a uma coisa bela e ignora todo o resto.",
    disciplines: ["Auspícios", "Celeridade", "Presença"],
    name: "Toreador",
  },
  {
    bane: "Sangue Deficiente",
    baneText:
      "Seu sangue não cria laços nem vínculos como devia; Vitae instável.",
    compulsion: "Perfeccionismo",
    compulsionText:
      "Nada menos que impecável serve: −2 acumulável até um sucesso crítico.",
    disciplines: ["Auspícios", "Domínio", "Feitiçaria de Sangue"],
    name: "Tremere",
  },
  {
    bane: "Paladar Refinado",
    baneText:
      "Só se alimenta de um tipo específico de presa; outro sangue é vomitado.",
    compulsion: "Arrogância",
    compulsionText:
      "Precisa mandar na cena e ser obedecido, ou nada mais importa.",
    disciplines: ["Domínio", "Fortitude", "Presença"],
    name: "Ventrue",
  },
  {
    bane: "Imagem Distorcida",
    baneText:
      "Não aparece em espelhos, câmeras e microfones sem falhar tecnologia por perto.",
    compulsion: "Crueldade",
    compulsionText:
      "Não pode hesitar: qualquer recuo custa −2 até levar a coisa até o fim.",
    disciplines: ["Domínio", "Oblívio", "Potência"],
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
      "Luz forte machuca mais: dano extra e penalidades iguais à Gravidade da Perdição.",
    compulsion: "Transgressão",
    compulsionText:
      "Tem que levar alguém a quebrar um tabu, ou quebrá-lo você mesmo.",
    disciplines: ["Ofuscação", "Presença", "Protean"],
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
    compulsion: "Tentar o Destino",
    compulsionText:
      "Precisa escolher o caminho mais arriscado só para ver o que acontece.",
    disciplines: ["Animalismo", "Ofuscação", "Presença"],
    name: "Ravnos",
  },
  {
    bane: "Preso à Terra",
    baneText:
      "Precisa dormir cercado por terra do seu domínio, ou não recupera nada.",
    compulsion: "Cobiça",
    compulsionText:
      "Tem de possuir e controlar o que considera seu, sem dividir.",
    disciplines: ["Animalismo", "Domínio", "Protean"],
    name: "Tzimisce",
  },
  {
    bane: "Caçados",
    baneText:
      "O terceiro olho os marca e o sangue deles é cobiçado por outros clãs.",
    compulsion: "Empatia Afetiva",
    compulsionText:
      "Sente a dor alheia como sua e precisa aliviá-la antes de agir.",
    disciplines: ["Auspícios", "Domínio", "Fortitude"],
    name: "Salubri",
  },
  {
    bane: "Marginalizado",
    baneText:
      "Sem clã nem Perdição fixa: subir Disciplinas custa mais e ninguém confia em você.",
    compulsion: "Nenhuma",
    compulsionText: "Caitiff não tem Compulsão de clã.",
    disciplines: ["Livre escolha"],
    name: "Caitiff",
  },
  {
    bane: "Sangue Fino",
    baneText:
      "Sem Perdição de clã, mas também sem Potência de Sangue e com méritos e falhas próprios.",
    compulsion: "Nenhuma",
    compulsionText: "Sangue Fraco não tem Compulsão de clã.",
    disciplines: ["Alquimia de Sangue Fino"],
    name: "Sangue Fraco",
  },
];

export function findClan(name: string | undefined): Clan | undefined {
  const key = (name ?? "").trim();
  return CLANS.find((c) => c.name === key);
}
