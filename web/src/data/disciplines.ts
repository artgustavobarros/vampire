// Portado de design/reference/logic.js e atualizado com base no livro oficial V5 (disciplines and powers.pdf).
// Poderes, Cerimônias, Rituais e Fórmulas marcados como "Guia do Jogador" vêm do Players Guide (disciplinas.pdf).
export const DISCIPLINES: readonly string[] = [
  "Animalismo",
  "Auspícios",
  "Celeridade",
  "Dominação",
  "Feitiçaria de Sangue",
  "Fortitude",
  "Oblívio",
  "Ofuscação",
  "Potência",
  "Presença",
  "Protean",
];

const DISCIPLINE_CANONICAL: Record<string, string> = {
  "Alquimia de Sangue Fino": "Alquimia de Sangue-ralo",
  "Alquimia de Sangue-fraco": "Alquimia de Sangue-ralo",
  "Alquimia de Sangue-ralo": "Alquimia de Sangue-ralo",
  "Alquimia Sangue-Ralo": "Alquimia de Sangue-ralo",
  Dominação: "Dominação",
  Domínio: "Dominação",
  Metamorfose: "Proteanismo",
  Protean: "Proteanismo",
  Proteanismo: "Proteanismo",
};

export function canonicalDiscipline(name: string | undefined): string {
  if (!name) {
    return "";
  }
  const trimmed = name.trim();
  return DISCIPLINE_CANONICAL[trimmed] ?? trimmed;
}

export function sameDiscipline(
  a: string | undefined,
  b: string | undefined
): boolean {
  if (!(a && b)) {
    return false;
  }
  return canonicalDiscipline(a) === canonicalDiscipline(b);
}

export interface PowerTemplate {
  amalgam?: string;
  cost: string;
  description: string;
  dicePool?: string;
  duration: string;
  ingredients?: string;
  level: number;
  name: string;
  prerequisite?: string;
  process?: string;
  rouse: boolean;
  system?: string;
}

const ALCHEMY_POWERS: readonly PowerTemplate[] = [
  {
    cost: "Uma checagem de sangue",
    description: "Fórmula que simula temporariamente um poder de sangue puro.",
    duration: "Uma cena",
    level: 1,
    name: "Desperta o Sangue Adormecido",
    rouse: true,
  },
  {
    cost: "Uma checagem de sangue",
    description:
      "Esta fórmula permite ao alquimista utilizar o poder de sua mente para agarrar, segurar, empurrar e erguer objetos ou pessoas à distância sem tocá-los fisicamente.",
    dicePool: "Determinação + Alquimia vs. Força + Atletismo",
    duration: "Uma cena",
    ingredients:
      "Sangue do alquimista, sangue humano colérico, fios de náilon derretidos ou ímã de geladeira ralado",
    level: 1,
    name: "Alcance Remoto",
    rouse: true,
    system:
      "O alquimista pode levitar ou arremessar objetos de até 100 kg a até 10 metros de distância com a mente. Contra alvos resistentes, dispute Determinação + Alquimia vs. Força + Atletismo.",
  },
  {
    cost: "Uma checagem de sangue",
    description:
      "O alquimista exala uma cortina densa de vapor que o envolve e o acompanha por onde anda, obscurecendo suas feições e tornando-o um alvo quase impossível de atingir à distância.",
    duration: "Uma cena",
    ingredients:
      "Sangue do alquimista, sangue humano fleumático, gelo seco ou fumaça de charuto",
    level: 1,
    name: "Névoa",
    rouse: true,
    system:
      "Uma névoa impenetrável envolve o usuário, ocultando sua identidade e impondo uma penalidade de -2 dados em qualquer ataque à distância desferido contra ele.",
  },
  {
    cost: "Uma checagem de sangue",
    description:
      "Fórmula alquímica lendária de transformação corporal que permite ao alquimista remodelar inteiramente seu sexo biológico, fisionomia e feições anatômicas permanentes.",
    duration: "Permanente",
    ingredients:
      "Sangue do alquimista, sangue de cinco doadores humanos que se identifiquem plenamente com o gênero desejado",
    level: 1,
    name: "Hieros Gamos Profano",
    rouse: true,
    system:
      "O alquimista remodela seu corpo permanentemente, alterando sexo, formato facial e estrutura óssea, criando uma nova identidade perfeita e indetectável pela Máscara.",
  },
  {
    cost: "Uma checagem de sangue",
    description:
      "O alquimista projeta uma névoa asfixiante e pegajosa que se agarra ao redor do rosto de uma vítima, cegando-a e provocando sufocamento atroz em mortais.",
    dicePool: "Raciocínio + Alquimia vs. Vigor + Sobrevivência",
    duration: "Um turno por ponto de margem",
    ingredients:
      "Sangue do alquimista, sangue melancólico e fleumático, clorato de potássio ou gás halon",
    level: 2,
    name: "Envolver",
    rouse: true,
    system:
      "Role Raciocínio + Alquimia vs. Vigor + Sobrevivência. Em uma vitória, o alvo fica cego pela névoa espessa e, se for mortal, começa a sufocar sofrendo dano de Vitalidade.",
  },
  {
    cost: "Gratuito",
    description:
      "Esta fórmula miraculosa purifica bolsas de sangue hospitalar velhas ou congeladas, restaurando seu frescor original como se acabassem de sair diretamente da veia de um mortal vivo.",
    duration: "Permanente",
    ingredients:
      "Sangue do alquimista, sangue sanguíneo e melancólico, café preto fervente e octanoato de sódio",
    level: 3,
    name: "Desfracionar",
    rouse: false,
    system:
      "O alquimista purifica bolsas de sangue frio, permitindo que vampiros sem o mérito Estômago de Ferro consigam saciar Fome com sangue hospitalar normalmente.",
  },
  {
    cost: "Uma checagem de sangue",
    description:
      "Faz o vampiro parecer e reagir temporariamente como um mortal ou como um vampiro de sangue mais potente, enganando exames e toques espirituais.",
    duration: "Uma cena",
    level: 3,
    name: "Sangue Falso",
    rouse: true,
  },
  {
    cost: "Uma checagem de sangue",
    description:
      "O alquimista sintetiza um elixir que neutraliza as leis da atração gravitacional, concedendo-lhe a capacidade de levitar e voar livremente em qualquer direção.",
    dicePool: "Força + Alquimia vs. Força + Atletismo (se resistido)",
    duration: "Uma cena",
    ingredients:
      "Sangue do alquimista, sangue colérico e sanguíneo, champanhe, sangue de pássaro, gás hélio e extrato de beladona",
    level: 4,
    name: "Ímpeto Aéreo",
    rouse: true,
    system:
      "O alquimista ganha a habilidade de voar em velocidade equivalente à sua corrida normal, podendo pairar no ar e manobrar em três dimensões.",
  },
  {
    cost: "Três checagens de sangue",
    description:
      "A coroação da arte alquímica: um elixir potentíssimo que, quando misturado a sangue humano fresco, tem a virtude mágica de despertar um vampiro ancião do mais profundo torpor.",
    duration: "Permanente",
    ingredients:
      "Sangue do alquimista, sangue colérico e sanguíneo humano, adrenalina pura, carbonato de amônio, cafeína e melatonina",
    level: 5,
    name: "Despertar o Dormente",
    rouse: true,
    system:
      "Quando introduzido nos lábios de um vampiro em torpor, este composto quebra o coma imortal e o desperta instantaneamente para a não-vida, independentemente de sua idade.",
  },
  // Fórmulas do Guia do Jogador
  {
    cost: "Uma checagem de sangue",
    description:
      "O alquimista fala a língua nativa do mortal cujo sangue usou na fórmula.",
    duration:
      "Uma noite, ou até se alimentar de alguém com a mesma língua nativa do alquimista",
    ingredients:
      "O Sangue do alquimista, sangue de um mortal com outra língua nativa, a língua de um peixe ou pássaro, molho picante de outro país e limalha de cobre",
    level: 1,
    name: "Língua Mercurial",
    rouse: true,
    system:
      "Gastando 1 ponto de Força de Vontade e se alimentando de um mortal, o alquimista pode trocar o idioma aprendido pela língua nativa desse mortal.",
  },
  {
    cost: "Uma checagem de sangue",
    description:
      "O alquimista gera no corpo uma corrente elétrica de baixa intensidade, alimentando luzes, carregadores e outros aparelhos.",
    dicePool: "Determinação + Alquimia",
    duration:
      "Uma cena para iluminar um ambiente; até metade da carga da bateria ao alimentar um aparelho",
    ingredients:
      "O Sangue do alquimista, sangue sanguíneo, nitrogênio líquido, aparas de tungstênio e uma bateria quebrada",
    level: 1,
    name: "Plug-in",
    rouse: true,
    system:
      "Teste Determinação + Alquimia (Dificuldade 2). No sucesso, alimenta pelo toque pequenos aparelhos, como um celular, um computador ou uma lâmpada; a energia cai quando o contato é interrompido.",
  },
  {
    cost: "Uma checagem de sangue",
    description:
      "O alquimista vê as conexões entre mortais e Membros como um fio fino e prateado entre eles.",
    dicePool: "Inteligência + Alquimia",
    duration: "Uma cena",
    ingredients:
      "O Sangue do alquimista, sangue fleumático, os olhos de uma coruja ou outro pássaro noturno e um fio de prata",
    level: 2,
    name: "Lista de Amigos",
    rouse: true,
    system:
      "Um fio aparece ligando o mortal a cada vampiro com quem tenha alguma conexão (nenhum, se não tiver); se o vampiro não estiver perto, o alquimista pode seguir o fio. Conexões mais fortes exigem menos sucessos: um carniçal, um sucesso; um contato ou aliado distante, até cinco. O fio mais forte aparece primeiro, e com sucessos suficientes o alquimista vê todos.",
  },
  {
    cost: "Uma checagem de sangue",
    description:
      'Também chamada de "The Funk". O sangue do alquimista emite um gás nocivo que causa paralisia rígida em mortais e criaturas sobrenaturais.',
    dicePool: "Vigor + Alquimia vs. Vigor + Determinação",
    duration: "Três turnos",
    ingredients:
      "O Sangue do alquimista, sangue fleumático, gordura humana, cera de vela, éter, óleo de gergelim, sulfato de ferro ou verdete e bórax",
    level: 3,
    name: "Mandagloire",
    rouse: true,
    system:
      "Derramado, o athanor exala um fedor que enche uma sala (uma casa, numa vitória crítica). Mortais que falharem ficam paralisados, num coma acordado, pelo resto da cena; sobrenaturais sofrem -2 dados em testes Físicos por cãibras intensas. Fixação: pode ir numa bebida ou refeição como veneno, ou ser queimado como fragrância paralisante.",
  },
  {
    cost: "Uma checagem de sangue",
    description:
      "O alquimista faz uma afirmação e convence uma pessoa a concordar com ela. Útil em negociações, mas fácil de notar para quem presta atenção.",
    dicePool: "Manipulação + Alquimia vs. Raciocínio + Percepção",
    duration:
      "Uma cena, e depois até algo contradizer o acordo de forma convincente",
    ingredients:
      "O Sangue do alquimista, sangue fleumático, pimenta, óleo e grafite ou mercúrio",
    level: 3,
    name: "Rumor",
    rouse: true,
    system:
      "Numa vitória, o alvo concorda e acredita ter concordado por vontade própria. Fazê-lo agir conforme o acordo (assinar documentos, por exemplo) costuma exigir outra disputa de Manipulação + Subterfúgio ou similar, à qual o alquimista soma a margem da Alquimia.",
  },
  {
    cost: "Uma checagem de sangue",
    description: "O alquimista reforça temporariamente sua resistência a dano.",
    duration: "Até sofrer dano ou a cena acabar",
    ingredients:
      "O Sangue do alquimista, sangue colérico, bourbon ou vinho envelhecido em carvalho e fibras de Kevlar, cimento ou casco de tartaruga moído",
    level: 3,
    name: "Tanque",
    rouse: true,
    system:
      "Na primeira vez que o alquimista sofrer dano na cena, reduza o dano em 5; então a fórmula expira.",
  },
  {
    cost: "Uma checagem de sangue",
    description:
      "O alquimista sobrecarrega as baterias de qualquer equipamento elétrico ou eletrônico, inclusive baterias de carro ou os fusíveis de um prédio.",
    duration: "Instantânea",
    ingredients:
      "O Sangue do alquimista, ácido de bateria, sangue melancólico e água salgada",
    level: 4,
    name: "Curto-Circuito",
    rouse: true,
    system:
      "Com uma checagem de sangue e um toque no equipamento (ou em metal ligado a ele), provoca um curto-circuito automático e silencioso: pode causar um apagão num prédio inteiro tocando uma tomada, ou num carro roçando nele.",
  },
  {
    cost: "Uma ou duas checagens de sangue",
    description:
      "O alquimista secreta pelos poros e orifícios uma bile cáustica que corrói metal, madeira e tecido vivo, sem ser afetado por ela.",
    dicePool: "Força ou Destreza + Alquimia vs. Destreza + Atletismo",
    duration: "Uma cena",
    ingredients:
      "O Sangue do alquimista, sangue colérico, potássio ou soda cáustica, baço animal, gaze e iodo",
    level: 4,
    name: "Personalidade Tóxica",
    rouse: true,
    system:
      "Ativo, corrói qualquer material em segundos pelo toque e soma +2 de dano em ataques de Briga; o ácido é muito mais forte que o de Vitae Corrosivo. Uma segunda checagem de sangue permite vomitar a bile como ataque (Força + Alquimia corpo a corpo, Destreza + Alquimia à distância), causando dano Superficial de Vitalidade igual à margem +3 (Agravado contra mortais). Athanor Corporis ou Calcinatio: depois de uma semana o portador começa a parecer doente, e depois de um mês a bile corrói o recipiente. Fixação: o recipiente se desfaz em Alquimia + 4 semanas.",
  },
  {
    cost: "Uma checagem de sangue de cada participante",
    description:
      "Uma forma de diablerie compartilhada que extrai virtude da vitae de um Membro de sangue puro para o alquimista e seus assistentes.",
    dicePool:
      "Determinação + Alquimia vs. Força de Vontade + Potência de Sangue",
    duration: "Permanente",
    ingredients:
      "Sangue do alquimista e dos sangue-ralo participantes (até três no total), suco de flores de amaranto vermelho de uma planta adubada com sangue, sanguessugas pulverizadas, sulfeto de hidrogênio e neon",
    level: 5,
    name: "Amaranto Florido",
    rouse: true,
    system:
      "O alquimista e até dois participantes amarram cordões de seda nos pulsos, formando um triângulo ao redor do alvo, também amarrado. Cada participante adicional pode somar um dado à parada gastando 2 pontos de Força de Vontade. Numa vitória, os participantes ganham 1 ponto numa Disciplina de clã do alvo, sorteada (escolhida, numa vitória crítica). Não podem passar do primeiro ponto, mas a usam como Membros de sangue puro. Não mudam de geração, mas perdem 1 de Humanidade e ganham na aura as veias negras da diablerie.",
  },
  {
    cost: "Uma checagem de sangue",
    description:
      "O alquimista submerge temporariamente os instintos vampíricos e usa o poder da Besta a favor da mente, atingindo intelecto e concentração sobre-humanos.",
    duration: "Uma cena",
    ingredients:
      "O Sangue do alquimista, sangue fleumático, cádmio, nootrópicos e cinzas de páginas queimadas de um texto importante para o alquimista (uma escritura, o livro infantil favorito)",
    level: 5,
    name: "Momento de Clareza",
    rouse: true,
    system:
      "O alquimista soma +4 dados às paradas de Habilidades Mentais ou de Disciplina e +4 dados para resistir a Dominação, Animalismo, Presença, Auspícios e seus amálgamas. Fica imune a críticos confusos e ao frenesi.",
  },
];

const ANIMALISM_POWERS: readonly PowerTemplate[] = [
  {
    cost: "Gratuito (exige 3 noites com checagem de sangue)",
    description:
      "Ao criar um Laço de Sangue com um animal, o vampiro pode torná-lo um famulus, formando um elo mental com ele e facilitando o uso de outros poderes de Animalismo. Embora este poder por si só não permita comunicação bidirecional com o animal, ele pode seguir instruções verbais simples como 'fique' e 'venha aqui'. Ele ataca em defesa própria e de seu mestre, mas não pode ser persuadido a lutar contra algo que normalmente não atacaria.",
    dicePool: "Carisma + Empatia com Animais",
    duration: "Apenas a morte liberta",
    level: 1,
    name: "Famulus Enlaçado",
    rouse: false,
    system:
      "Sem o uso de Sussurros Ferais, dar comandos ao animal exige um teste de Carisma + Empatia com Animais (Dificuldade 2); aumente a Dificuldade para ordens mais complexas. Um vampiro pode ter apenas um famulus, mas pode obter um novo se o atual morrer. Um vampiro pode usar Sussurros Ferais (Animalismo 2) e Subjugar o Espírito (Animalismo 4) em seu famulus gratuitamente.",
  },
  {
    cost: "Gratuito",
    description:
      "O vampiro pode sentir a Besta presente em mortais, vampiros e outros seres sobrenaturais, obtendo uma percepção de sua natureza, fome e hostilidade.",
    dicePool: "Determinação + Animalismo vs. Autocontrole + Subterfúgio",
    duration: "Passiva",
    level: 1,
    name: "Sentir a Besta",
    rouse: false,
    system:
      "Role Determinação + Animalismo vs. Autocontrole + Subterfúgio. Uma vitória permite ao usuário sentir o nível de hostilidade em um alvo (se a pessoa está preparada para causar dano ou decidida a causá-lo) e determinar se ela abriga uma Besta sobrenatural, marcando-a como um vampiro ou lobisomem. Em uma vitória crítica, o usuário obtém informações sobre o tipo exato de criatura, bem como seu nível de Fome ou Fúria.",
  },
  {
    cost: "Uma checagem de sangue",
    description:
      "O vampiro pode se comunicar com as feras da natureza e da cidade. Sussurros Ferais permite comunicação bidirecional com animais. Um gato pode não estar interessado em debater filosofia, mas discute alegremente a movimentação ao redor do prédio. O vampiro pode persuadir animais a realizar favores ou convocá-los para um local.",
    dicePool: "Manipulação + Animalismo ou Carisma + Animalismo",
    duration: "Uma cena",
    level: 2,
    name: "Sussurros Selvagens",
    rouse: true,
    system:
      "Comunicação simples não requer teste. Persuadir um animal a realizar um serviço exige um teste de Manipulação + Animalismo; a Dificuldade depende da tarefa exigida. Convocar animais usa um teste de Carisma + Animalismo; a Dificuldade depende da escassez dos animais convocados. O número de animais depende da margem de sucesso.",
  },
  {
    cost: "Gratuito",
    description:
      "O vampiro pode saciar Fome adicional alimentando-se de animais. Além disso, o vampiro pode consumir seu famulus, obtendo nutrição muito além do que ganharia de um animal de porte semelhante e absorvendo uma fração de seu atributo primário.",
    duration: "Passiva",
    level: 3,
    name: "Suculência Animal",
    rouse: false,
    system:
      "Alimentar-se de animais sacia 1 ponto adicional de Fome, e o vampiro conta sua Potência de Sangue como dois níveis mais baixa em relação a penalidades para saciar Fome com sangue animal. Consumir o próprio famulus sacia 4 pontos de Fome, independentemente do tamanho do animal. Este ato nunca pode remover o último dado de Fome. Além disso, consumir o famulus aumenta em dois pontos o Atributo do vampiro mais associado a esse animal (determinado pelo Narrador).",
  },
  {
    cost: "Uma checagem de sangue",
    description:
      "Ao travar o olhar com um alvo, o vampiro acalma sua Besta interior em um sono temporário. Mortais afetados tornam-se apáticos, incapazes de realizar qualquer ação além de se manterem vivos, enquanto os impulsos bestiais dos vampiros diminuem temporariamente.",
    dicePool: "Carisma + Animalismo vs. Vigor + Determinação",
    duration: "Uma cena ou margem de turnos",
    level: 3,
    name: "Subjulgar a Besta",
    rouse: true,
    system:
      "Role Carisma + Animalismo vs. Vigor + Determinação. Uma vitória contra um alvo mortal o incapacita durante a cena, incutindo severa letargia. Ele age apenas para se preservar, não contra o usuário ou qualquer outra pessoa. Uma vitória contra um vampiro impede o alvo de realizar Surtos de Sangue. Contra vampiros, este poder dura um turno mais um número de turnos igual à margem de vitória. Uma vitória crítica contra um vampiro encerra seu frenesi.",
  },
  {
    amalgam: "Ofuscação 2",
    cost: "Sem custo adicional",
    description:
      "Mais frequentemente visto entre os Nosferatu, este poder perturbador permite ao usuário estender sua influência animal a enxames de insetos, como moscas ou baratas. Certos vampiros chegam ao ponto de adotar enxames como famuli, dando-lhes um lar permanente nas dobras e cavidades de sua carne deformada.",
    duration: "Passiva",
    level: 3,
    name: "Enxame Não-vivo",
    rouse: false,
    system:
      "Este poder estende todos os poderes de Animalismo para enxames de insetos, tratando um enxame como uma criatura única. O vampiro pode vincular o enxame como um famulus e aninhá-lo dentro das cavidades de seu corpo, tornando-o indetectável exceto por raios X. Enxames têm Vitalidade 5 e parada de 8 dados para resistir a ataques. Sofrem dano Superficial de Briga; fogo e inseticidas causam dano Agravado.",
  },
  {
    amalgam: "Ofuscação 2",
    cost: "Sem custo adicional",
    description:
      "Mais frequentemente visto entre os Nosferatu, este poder perturbador permite ao usuário estender sua influência animal a enxames de insetos, como moscas ou baratas. Certos vampiros chegam ao ponto de adotar enxames como famuli, dando-lhes um lar permanente nas dobras e cavidades de sua carne deformada.",
    duration: "Passiva",
    level: 3,
    name: "Colmeia Inanimada",
    rouse: false,
    system:
      "Este poder estende todos os poderes de Animalismo para enxames de insetos, tratando um enxame como uma criatura única. O vampiro pode vincular o enxame como um famulus e aninhá-lo dentro das cavidades de seu corpo, tornando-o indetectável exceto por raios X.",
  },
  {
    cost: "Uma checagem de sangue (gratuito no famulus)",
    description:
      "O vampiro pode transferir completamente sua mente para o corpo de um animal. Ele pode controlar o animal e usar seus sentidos livremente, mesmo durante o dia, caso consiga permanecer acordado. Enquanto faz isso, o corpo do vampiro fica imóvel como se estivesse em torpor.",
    dicePool: "Manipulação + Animalismo",
    duration: "Uma cena / indefinidamente",
    level: 4,
    name: "Comunhão de Espíritos",
    rouse: true,
    system:
      "Faça um teste de Manipulação + Animalismo (Dificuldade 4). Em uma vitória, o vampiro pode habitar o corpo do animal por uma cena. Em uma vitória crítica, pode habitá-lo indefinidamente. Estender a possessão durante o dia exige permanecer acordado; ver o sol exige teste de frenesi de medo, embora a luz solar não fira o animal possuído. O usuário permanece alheio ao seu corpo original, mas danos a ele interrompem o transe.",
  },
  {
    cost: "Duas checagens de sangue",
    description:
      "O poder que o vampiro exerce sobre os animais torna-se grandioso o suficiente para comandar bandos e matilhas como se fossem extensões de seu próprio corpo. Com um gesto, dezenas ou até centenas de animais sacrificam suas vidas para satisfazer seu mestre.",
    dicePool: "Carisma + Animalismo",
    duration: "Uma cena ou até ordem cumprida",
    level: 5,
    name: "Controle Animal",
    rouse: true,
    system:
      "Escolha um tipo de animal e faça um teste de Carisma + Animalismo com Dificuldade baseada na natureza dos animais e na ordem dada (Dificuldade 3 para dispersar corvos à procura de alguém; Dificuldade 5 para matilha de cães atacar em investida suicida contra outro vampiro). O vampiro pode ordenar que os animais retornem após completarem a tarefa.",
  },
  {
    cost: "Uma checagem de sangue",
    description:
      "O vampiro pode projetar sua Besta no momento de um frenesi de terror ou fúria, transferindo-a para um alvo próximo, seja mortal ou vampiro. Essa pessoa experimenta imediatamente o frenesi em seu lugar, entrando em fúria impiedosa ou fugindo em pavor dependendo do gatilho.",
    dicePool: "Raciocínio + Animalismo vs. Autocontrole + Determinação",
    duration: "Duração do frenesi",
    level: 5,
    name: "Expulsar a Besta",
    rouse: true,
    system:
      "Em vez do teste de Força de Vontade para resistir a frenesi de terror ou fúria, role Raciocínio + Animalismo vs. Autocontrole + Determinação do alvo. Se falhar, entra em frenesi normalmente. Em uma vitória, o alvo experimenta o frenesi em vez do usuário. Este poder não pode transferir frenesi de fome.",
  },
  // Guia do Jogador
  {
    amalgam: "Auspícios 1",
    cost: "Uma checagem de sangue por noite",
    description:
      "O famulus do vampiro leva uma mensagem curta a uma pessoa designada pelo mestre, desde que consiga alcançá-la. Quem estiver ao alcance da voz ouve a mensagem como se o famulus falasse com a voz do mestre.",
    duration: "Uma ou mais noites, conforme a duração da busca",
    level: 2,
    name: "Mensageiro Animal",
    rouse: true,
    system:
      "O vampiro sussurra uma única frase ao famulus e aponta o destinatário. Se a localização do destinatário for desconhecida, o famulus precisa rastreá-lo com um teste de Determinação + Manha ou Sobrevivência (Dificuldade 2), resistido por Inteligência + Manha ou Sobrevivência do alvo se ele estiver se escondendo ativamente. A tentativa pode ser feita uma vez por noite. A mensagem é entregue assim que o famulus faz contato visual com o alvo, e então ele volta para o mestre.",
  },
  {
    amalgam: "Dominação 1",
    cost: "Gratuito",
    description:
      "O vampiro usa Compelir ou Mesmerismo por meio de um comando entregue pelo famulus, impondo sua vontade ao destinatário da mensagem.",
    duration: "Veja Mensageiro Animal",
    level: 3,
    name: "Comando do Mensageiro",
    prerequisite: "Mensageiro Animal; Compelir ou Mesmerismo",
    rouse: false,
    system:
      "Funciona como Mensageiro Animal, e a parada de dados é a de Compelir ou Mesmerismo. O teste é feito assim que o famulus faz contato visual com o alvo. O nível de Dominação usado não pode exceder o Animalismo do usuário.",
  },
  {
    cost: "Uma checagem de sangue",
    description:
      "O vampiro marca um indivíduo como alvo da atenção concentrada dos animais. Feras e vermes da área o procuram para latir, bicar e arranhar, tornando sua noite miserável; sem ameaçar a própria sobrevivência, os animais dificultam que a vítima faça qualquer coisa além de afastá-los.",
    dicePool: "Manipulação + Animalismo vs. Autocontrole + Empatia com Animais",
    duration: "Uma noite",
    level: 3,
    name: "Praga de Bestas",
    rouse: true,
    system:
      "O vampiro escolhe um alvo na linha de visão. Numa vitória, o alvo vira o foco de todos os animais próximos pelo resto da noite e sofre penalidade em todas as paradas de Habilidades igual à margem, a menos que se isole fisicamente da fauna local. Qualquer perseguidor ganha bônus igual à mesma margem para rastreá-lo. A penalidade não vale em conflitos físicos: os animais fogem quando a violência começa e voltam depois.",
  },
  {
    cost: "Uma ou mais checagens de sangue",
    description:
      "O vampiro influencia o humor geral dos animais numa área ampla. Não controla ações específicas, mas direciona o comportamento deles da indiferença sonolenta à agressão indiscriminada: o efeito pode ser sutil, como a falta do canto dos pássaros, ou puro caos, com feras destruindo tudo o que se move.",
    dicePool: "Autocontrole + Animalismo",
    duration: "Uma noite",
    level: 4,
    name: "Influenciar o Rebanho",
    rouse: true,
    system:
      "O vampiro escolhe o comportamento a encorajar e testa Autocontrole + Animalismo. Com um sucesso os animais não mudam visivelmente; com cinco, ficam dominados pelo impulso (os calmos adormecem, os irritados atacam sem provocação). Tentativas mundanas de controlar os animais têm a Dificuldade aumentada pelo número de sucessos. A área equivale a um campo de futebol e pode ser ampliada com checagens de sangue adicionais, até cinco para uma cidade pequena.",
  },
  {
    cost: "Uma checagem de sangue",
    description:
      "Cantarolando, cantando ou rosnando baixinho, o vampiro toca as Bestas de todos os vampiros próximos, atiçando ou acalmando seus ânimos conforme o próprio capricho.",
    dicePool: "Manipulação + Animalismo",
    duration: "Enquanto o usuário continuar cantarolando",
    level: 5,
    name: "Atiçar o Temperamento Bestial",
    rouse: true,
    system:
      "O vampiro decide se quer agitar ou acalmar e testa Manipulação + Animalismo (Dificuldade 3). Cada sucesso na margem aumenta ou diminui em 1 a Dificuldade para resistir ao frenesi de todos os outros vampiros ao alcance da voz. Se a Dificuldade diminuir, vampiros já em frenesi podem testar de novo para sair dele.",
  },
];

const AUSPEX_POWERS: readonly PowerTemplate[] = [
  {
    cost: "Gratuito (mas veja abaixo)",
    description:
      "Os sentidos do vampiro se aguçam a um grau sobrenatural, concedendo-lhe a capacidade de enxergar na escuridão total, ouvir frequências ultrassônicas e farejar o medo de presas acuadas.",
    dicePool: "Raciocínio + Determinação",
    duration: "Até ser desativado",
    level: 1,
    name: "Sentidos Aguçados",
    rouse: false,
    system:
      "O usuário adiciona sua pontuação de Auspícios a todos os testes de percepção. Se for exposto a sensações extremas (estrondos altos, clarões de luz intensa, odores avassaladores) enquanto o poder estiver ativo, deve vencer um teste de Raciocínio + Determinação (Dificuldade 3 ou mais) para amortecer os sentidos a tempo, caso contrário sofre uma penalidade de -2 em testes de percepção pelo resto da cena.",
  },
  {
    cost: "Gratuito",
    description:
      "Os sentidos do vampiro tornam-se sintonizados com dimensões além do reino mundano. Isso permite que sintam a presença de seres sobrenaturais invisíveis a olho nu, desde espíritos e fantasmas até outros vampiros ocultos por Ofuscação ou rituais místicos dormentes.",
    duration: "Passiva",
    level: 1,
    name: "Sentir o Invisível",
    rouse: false,
    system:
      "Sempre que houver algo sobrenatural oculto à vista de todos, o Narrador faz um teste secreto de Raciocínio + Auspícios contra uma Dificuldade escolhida por ele. Contra uma entidade tentando ativamente se esconder (usando Ofuscação, por exemplo), o teste é disputado contra a parada de dados dessa criatura.",
  },
  {
    cost: "Gratuito ou uma checagem de sangue",
    description:
      "O vampiro vivencia lampejos de pressentimentos premonitórios na forma de arrepios na nuca, súbitas inspirações ou visões vívidas. Embora nunca sejam inteiramente precisas, essas visões podem afastar o vampiro do perigo ou revelar uma verdade anteriormente negligenciada.",
    dicePool: "Determinação + Auspícios",
    duration: "Passiva",
    level: 2,
    name: "Premonição",
    rouse: false,
    system:
      "Sempre que o Narrador achar apropriado, este poder fornece ao personagem uma pista súbita que o ajuda de alguma forma (salvando-o de perigo iminente ou descobrindo uma pista perdida). O usuário também pode provocar ativamente uma premonição concentrando-se em um sujeito ou objeto específico e fazendo uma checagem de sangue, rolando Determinação + Auspícios contra Dificuldade 3 ou mais.",
  },
  {
    cost: "Uma checagem de sangue",
    description:
      "Ao focar em uma pessoa, o vampiro pode perceber sua aura e discernir seu humor, saúde mental, perturbações, intenções e traços sobrenaturais ocultos.",
    dicePool: "Inteligência + Auspícios vs. Autocontrole + Subterfúgio",
    duration: "Um turno ou a critério do Narrador",
    level: 3,
    name: "Perscrutar a Alma",
    rouse: true,
    system:
      "Faça um teste de Inteligência + Auspícios vs. Autocontrole + Subterfúgio. Em uma vitória, o Narrador responde com sinceridade a um número de perguntas igual à margem da vitória sobre a aura e psique do alvo (estado emocional, se é vampiro, lobisomem, etc., intensidade da Fome, etc.).",
  },
  {
    cost: "Uma checagem de sangue",
    description:
      "O usuário pode sintonizar-se com os sentidos de outra pessoa, vendo, ouvindo e sentindo tudo o que o alvo percebe através de seus próprios sentidos.",
    dicePool: "Determinação + Auspícios",
    duration: "Uma cena",
    level: 3,
    name: "Compartilhar os Sentidos",
    rouse: true,
    system:
      "Role Determinação + Auspícios com Dificuldade 3. Uma vitória permite ao vampiro experimentar tudo o que o alvo percebe sensorialmente durante uma cena. O alvo geralmente não percebe a intrusão.",
  },
  {
    cost: "Uma checagem de sangue",
    description:
      "Ao tocar um objeto inanimado, o vampiro pode captar resíduos emocionais e impressões psíquicas deixadas pela última pessoa que o manuseou. Não apenas quem tocou, mas também o que foi feito e sob quais circunstâncias emocionais.",
    dicePool: "Inteligência + Auspícios",
    duration: "Um turno",
    level: 4,
    name: "Toque do Espírito",
    rouse: true,
    system:
      "Faça um teste de Inteligência + Auspícios contra uma Dificuldade baseada nas informações desejadas (Dificuldade 3 para arma do crime recente, 5 ou mais para eventos mais antigos ou sutis). A margem de sucesso revela detalhes mais profundos e precisos.",
  },
  {
    cost: "Uma checagem de sangue",
    description:
      "Fechando os olhos e entrando em um breve transe, o vampiro pode projetar seus sentidos para qualquer local familiar ou nas proximidades, observando eventos como se estivesse fisicamente presente lá.",
    dicePool: "Inteligência + Auspícios",
    duration: "Alguns minutos para coletar informações, até uma cena inteira",
    level: 5,
    name: "Clarividência",
    rouse: true,
    system:
      "Role Inteligência + Auspícios contra uma Dificuldade baseada na segurança e nível de atividade da área (Dificuldade 3 em sua própria mansão, até 7 ou mais em um quarteirão desconhecido). O vampiro pode ver e ouvir a área como se estivesse lá fisicamente.",
  },
  {
    amalgam: "Dominação 3",
    cost: "Duas checagens de sangue",
    description:
      "Com este poder, o vampiro pode invadir e assumir o controle total do corpo de um mortal, subjugando a mente da vítima e operando seu invólucro físico diretamente.",
    dicePool: "Determinação + Auspícios vs. Determinação + Inteligência",
    duration: "Até ser encerrado voluntária ou involuntariamente",
    level: 5,
    name: "Possessão",
    rouse: true,
    system:
      "Este poder só pode ser usado em mortais (se for um carniçal, deve estar com Laço de Sangue). Exige contato visual. Role Determinação + Auspícios vs. Determinação + Inteligência do alvo. Em uma vitória, o vampiro transfere sua consciência para o mortal. O corpo original do vampiro cai em torpor comatoso durante a possessão.",
  },
  {
    cost: "Uma checagem de sangue (mais 1 Força de Vontade vs. vampiros relutantes)",
    description:
      "O usuário pode ler os pensamentos superficiais e memórias profundas de outras mentes, bem como projetar seus próprios pensamentos diretamente na mente de outros.",
    dicePool: "Determinação + Auspícios vs. Raciocínio + Subterfúgio",
    duration: "Cerca de um minuto por checagem de sangue",
    level: 5,
    name: "Telepatia",
    rouse: true,
    system:
      "Projetar pensamentos em uma mente em linha de visão não requer rolagem de dados. Ler a mente de um mortal voluntário é gratuito e automático. Ler a mente de um mortal resistente ou de outro vampiro exige um teste de Determinação + Auspícios vs. Raciocínio + Subterfúgio. Cada margem de sucesso permite extrair fatos mais profundos e memórias ocultas.",
  },
  // Guia do Jogador
  {
    amalgam: "Fortitude 1",
    cost: "Uma checagem de sangue e Força de Vontade conforme as circunstâncias",
    description:
      "O vampiro acalma o tumulto mental ou emocional do alvo, restaurando-lhe alguma firmeza. É especialmente eficaz em mortais, seja para ajudá-los numa crise, seja para tranquilizá-los antes de se alimentar.",
    dicePool: "Autocontrole + Auspícios",
    duration: "Instantânea",
    level: 2,
    name: "Panaceia",
    rouse: true,
    system:
      "Teste Autocontrole + Auspícios (Dificuldade 2): o alvo recupera dano Superficial de Força de Vontade igual à margem ou, alternativamente, um nível de dano Agravado de Força de Vontade a cada três sucessos na margem. Num mortal, também o acalma. Leva um turno; gastando uma cena, a Dificuldade cai para 0. Não pode ser usado em si mesmo, e cada alvo só pode ser afetado uma vez por noite. Para cada alvo adicional na mesma noite, o usuário sofre dano Superficial de Força de Vontade igual à metade dos sucessos na margem.",
  },
  {
    cost: "Uma checagem de sangue",
    description:
      "O vampiro sente o cheiro da Ressonância do alvo e de qualquer Discrasia em seu sangue. Também percebe se outro vampiro se alimentou recentemente e a Ressonância de sua última vítima.",
    dicePool: "Inteligência + Auspícios vs. Autocontrole + Subterfúgio",
    duration: "Uma cena",
    level: 2,
    name: "Revelar Temperamento",
    rouse: true,
    system:
      "Contra um mortal, uma vitória revela a Ressonância e outras particularidades do sangue, como Discrasias; numa vitória crítica, o usuário ganha +2 dados para interagir com o alvo durante a cena. Contra um vampiro, uma vitória revela a Ressonância do último mortal de quem ele se alimentou, e uma vitória crítica mostra o momento da alimentação, revelando o método e o Tipo de Predador.",
  },
  {
    amalgam: "Oblívio 1",
    cost: "Uma checagem de sangue",
    description:
      "Observando o trabalho sutil da entropia, o vampiro detecta o calcanhar de Aquiles do alvo, seja uma rachadura em sua fachada mental, seja uma fraqueza em sua armadura.",
    dicePool:
      "Inteligência + Auspícios vs. Autocontrole ou Vigor + Subterfúgio",
    duration: "Uma cena",
    level: 3,
    name: "Falha Fatal",
    rouse: true,
    system:
      "O usuário passa um turno observando o alvo e testa Inteligência + Auspícios contra Autocontrole (fraquezas mentais) ou Vigor (fraquezas físicas) + Subterfúgio. Uma vitória revela a parada de defesa mais baixa do alvo na categoria e dá +2 dados em ataques contra ela. Quem for informado da fraqueza pelo usuário ganha +1 dado.",
  },
  {
    amalgam: "Dominação 3",
    cost: "Duas checagens de sangue e uma Mácula",
    description:
      "Buscando as promessas da Golconda, o vampiro compartilha um pouco de sua serenidade moral com um Membro arrependido, restaurando algum remorso e mantendo a Besta sob controle. Para isso, acorrenta a vontade do sujeito à sua. Visto com mais frequência entre os Salubri, o poder alimentou a fama de ladrões de almas do clã.",
    dicePool: "Autocontrole + Auspícios vs. Humanidade",
    duration: "Uma sessão",
    level: 5,
    name: "Aliviar a Alma Bestial",
    prerequisite: "Panaceia",
    rouse: true,
    system:
      'O vampiro passa uma cena em reclusão com o sujeito e testa Autocontrole + Auspícios contra a Humanidade dele. Cada sucesso na margem remove uma Mácula do alvo ou ergue um "escudo" que anula uma Mácula futura na sessão. Numa vitória crítica, o usuário pode abrir mão disso para restaurar 1 ponto de Humanidade do alvo, benefício que nenhum vampiro recebe mais de uma vez. Só funciona em vampiros e falha automaticamente se o alvo tiver Humanidade maior que a do usuário. Pelo resto da sessão o sujeito fica entorpecido, e os poderes de Dominação do usuário funcionam nele automaticamente, sem contato visual. Escudos não usados se perdem quando o poder termina; Máculas removidas e Humanidade ganha permanecem.',
  },
];

const CELERITY_POWERS: readonly PowerTemplate[] = [
  {
    cost: "Gratuito",
    description:
      "O usuário atinge uma graça sobrenatural que iguala e supera os melhores trapezistas do mundo. Ele pode andar e até correr sobre beiradas e cabos estreitos sem esforço, mantendo o equilíbrio sobre o mais tênue dos apoios.",
    duration: "Passiva",
    level: 1,
    name: "Graça Felina",
    rouse: false,
    system:
      "O usuário passa automaticamente em qualquer teste baseado em Destreza ou Atletismo necessário para manter o equilíbrio. Isso não permite equilibrar-se em apoios que não suportem seu peso corporal.",
  },
  {
    cost: "Gratuito",
    description:
      "Para o vampiro dotado deste poder, o mundo ao redor parece desacelerar. Ele percebe ameaças que se aproximam instantaneamente e reage com presteza sobre-humana, sendo capaz de desviar de flechas e disparos sem cobertura disponível.",
    duration: "Passiva",
    level: 1,
    name: "Reflexos Rápidos",
    rouse: false,
    system:
      "O vampiro não sofre penalidades em sua parada de defesa por falta de cobertura contra ataques com Armas de Fogo. Ele também pode realizar uma ação menor (de até dois dados por turno, como sacar ou recarregar uma arma) gratuitamente a cada turno.",
  },
  {
    cost: "Uma checagem de sangue",
    description:
      "Seu domínio sobre a Celeridade permite ao vampiro mover-se e reagir com uma velocidade estarrecedora, tornando seus movimentos um borrão para os olhos comuns.",
    duration: "Uma cena",
    level: 2,
    name: "Rapidez",
    rouse: true,
    system:
      "Adicione a pontuação de Celeridade à parada de dados do usuário para todos os testes de Destreza fora de combate. Uma vez por turno, o usuário também pode adicionar esse valor ao se defender usando Destreza + Atletismo.",
  },
  {
    cost: "Uma checagem de sangue",
    description:
      "O vampiro aproxima-se velozmente de um adversário, engajando em combate ou escapando em um piscar de olhos. Para um observador desprevenido, ele parece teleportar, deixando para trás apenas uma rajada de vento.",
    dicePool: "Destreza + Atletismo",
    duration: "Um turno",
    level: 3,
    name: "Piscadela",
    rouse: true,
    system:
      "O vampiro se move em linha reta em direção a um alvo, cobrindo qualquer distância inferior a 50 metros e ainda tendo tempo hábil para realizar uma ação, como um ataque, durante o turno. Se o terreno for perigoso ou exigir manobras, role Destreza + Atletismo.",
  },
  {
    cost: "Uma checagem de sangue",
    description:
      "Com velocidade inacreditável, o vampiro pode correr por superfícies verticais, muros, vidraças ou através de líquidos sem afundar, desde que mantenha o ímpeto e não pare de correr.",
    dicePool: "Destreza + Atletismo",
    duration: "Um turno",
    level: 3,
    name: "Travessia",
    rouse: true,
    system:
      "Faça um teste de Destreza + Atletismo com Dificuldade de 3 (superfície inclinada) a 6 (parede vertical lisa, água aberta). Cada ponto de margem leva o vampiro mais longe pela superfície impossível antes que a gravidade volte a agir.",
  },
  {
    cost: "Uma checagem de sangue",
    description:
      "O Sangue do vampiro fica saturado com a essência da Celeridade, transmitindo temporariamente parte dessa velocidade sobrenatural para qualquer um que dele beba.",
    duration: "Uma noite; para vampiros, até a próxima alimentação ou Fome 5",
    level: 4,
    name: "Elegância Direto da Fonte",
    rouse: true,
    system:
      "Beber o equivalente a uma checagem de sangue diretamente do usuário concede ao bebedor Celeridade temporária igual à metade dos pontos de Celeridade do doador (arredondado para baixo). O bebedor ganha os mesmos poderes sem amálgama do doador até esse nível.",
  },
  {
    amalgam: "Auspícios 2",
    cost: "Uma checagem de sangue",
    description:
      "Com o mundo ao seu redor congelado em câmera lenta, o vampiro pode mirar e arremessar ou disparar qualquer projétil contra um alvo como se ele estivesse perfeitamente estático.",
    duration: "Um ataque",
    level: 4,
    name: "Mira Infalível",
    rouse: true,
    system:
      "Use antes de realizar um ataque à distância. O alvo não faz rolagem de esquiva ou defesa; faça o ataque com Dificuldade 1. Um oponente com Celeridade 5 pode anular este poder fazendo sua própria checagem de sangue para se defender na mesma velocidade.",
  },
  {
    cost: "Uma checagem de sangue",
    description:
      "Mais rápido do que a visão humana ou vampírica pode acompanhar, o vampiro desfere um golpe desarmado ou com arma branca com tal velocidade que o oponente é incapaz de reagir ou esquivar.",
    duration: "Um ataque",
    level: 5,
    name: "Golpe Relâmpago",
    rouse: true,
    system:
      "Use antes de fazer um ataque de Briga ou Armas Brancas. O oponente não faz rolagem de esquiva ou defesa; faça o ataque com Dificuldade 1. Um oponente com Celeridade 5 pode anular este poder fazendo sua própria checagem de sangue para se defender na mesma velocidade.",
  },
  {
    cost: "Uma checagem de sangue",
    description:
      "O vampiro atinge o ápice da velocidade sobrenatural, reagindo instantaneamente antes que eventos ao seu redor se desenrolem. Emboscadores encontram sua presa já posicionada atrás deles, e favores são concluídos antes que o pedido termine de ser pronunciado.",
    duration: "Um turno",
    level: 5,
    name: "Fração de Segundo",
    rouse: true,
    system:
      "O jogador pode interromper e se sobrepor à narração de eventos pelo Narrador dentro da razão: passar por uma porta antes que ela feche, contornar uma emboscada assim que deflagrada, rolar para longe de uma explosão iminente, etc. Permite agir antes de todos na ordem de iniciativa.",
  },
  // Guia do Jogador
  {
    cost: "Uma checagem de sangue",
    description:
      "O vampiro realiza tarefas demoradas numa velocidade ofuscante, com dedos e mãos borrados enquanto escreve, conserta ou constrói. A concentração exigida impede o uso em ataques, mas permite atingir fins não violentos rapidamente mesmo sob pressão.",
    duration: "Uma cena",
    level: 2,
    name: "Trabalho Apressado",
    rouse: true,
    system:
      "Enquanto ativo, tarefas de Habilidade que levariam turnos inteiros são concluídas em segundos, e o vampiro pode tratar uma ação completa como ação menor (Vampiro: A Máscara, p. 298). Não serve para acelerar ataques, defesas ou tarefas com resistência ativa, mas permite, por exemplo, arrombar uma fechadura e disparar uma arma (esta com a penalidade de dois dados da ação menor).",
  },
  {
    cost: "Uma checagem de sangue",
    description:
      "O vampiro se move rápido o bastante para ver facas e balas como lentas e desviar delas quando quiser.",
    duration: "Uma cena",
    level: 3,
    name: "Tecelagem",
    prerequisite: "Reflexos Rápidos",
    rouse: true,
    system:
      "O usuário não sofre redução na parada ao se defender de múltiplos ataques à distância com Destreza + Atletismo e pode somar seu nível de Celeridade a todas essas tentativas enquanto o poder estiver ativo.",
  },
  {
    cost: "Uma checagem de sangue por turno",
    description:
      "O movimento do vampiro vira um borrão trêmulo, tornando-o extremamente difícil de acertar, mesmo quando não percebe o oponente ou não está se defendendo.",
    duration: "Até o usuário deixar expirar",
    level: 4,
    name: "Movimento Borrado",
    rouse: true,
    system:
      "Ataques com menos sucessos que o nível de Celeridade do usuário sempre erram, independentemente de testes de defesa ou esquiva. Vale também contra ataques surpresa e ataques que não permitem defesa, como Golpe Relâmpago. Ativar exige uma checagem de sangue, e mantê-lo exige outra a cada turno.",
  },
  {
    amalgam: "Ofuscação 4",
    cost: "Duas checagens de sangue",
    description:
      "O vampiro some da vista de todos e se move instantaneamente até um inimigo para desferir um ataque fatal, podendo virar o jogo ao desaparecer diante dos perseguidores.",
    dicePool: "Destreza + Celeridade vs. Raciocínio + Percepção",
    duration: "Um turno",
    level: 4,
    name: "Greve Invisível",
    prerequisite: "Piscadela",
    rouse: true,
    system:
      "Combina Piscadela com Desaparecer (Ofuscação). O alvo é pego de surpresa: a menos que supere a Destreza + Celeridade do usuário com Raciocínio + Percepção, não pode se defender e o ataque é feito contra Dificuldade 1 (Ataques Surpresa, Vampiro: A Máscara, p. 300). Se o usuário perder a disputa, ainda faz um ataque normal, como em Piscadela, com as mesmas restrições de movimento.",
  },
];

const DOMINATE_POWERS: readonly PowerTemplate[] = [
  {
    cost: "Gratuito",
    description:
      "Pronunciando uma palavra-gatilho como 'Esqueça!', o vampiro faz com que a vítima esqueça os eventos imediatos dos últimos minutos, suficiente para ocultar uma alimentação superficial ou um encontro casual.",
    dicePool: "Carisma + Dominação vs. Raciocínio + Determinação",
    duration: "Indefinida",
    level: 1,
    name: "Nublar Memória",
    rouse: false,
    system:
      "Nenhum teste é necessário contra mortais desprevenidos. Nublar a memória de um mortal resistente ou de outro vampiro requer uma disputa de Carisma + Dominação vs. Raciocínio + Determinação. Não cria memórias novas; se questionada, a vítima nota um lapso de tempo.",
  },
  {
    cost: "Gratuito",
    description:
      "Com o contato visual e uma ordem falada de uma única palavra, o vampiro compele a vítima a obedecer imediatamente a uma instrução simples e direta: 'Pare', 'Corra', 'Entregue', 'Pule'.",
    dicePool: "Carisma + Dominação vs. Raciocínio + Determinação",
    duration: "Não mais que um turno",
    level: 1,
    name: "Compelir",
    rouse: false,
    system:
      "Nenhum teste é necessário contra um mortal desprevenido. Contra um mortal resistente, alguém já dominado na mesma cena ou outro vampiro, dispute Carisma + Dominação vs. Raciocínio + Determinação. O comando deve ser de uma palavra e ser realizável em um único turno.",
  },
  {
    cost: "Uma checagem de sangue",
    description:
      "O vampiro pode implantar ordens e sugestões complexas na mente de uma vítima por meio de contato visual e fala hipnótica. As ordens podem conter várias etapas e ser executadas com precisão pela vítima.",
    dicePool: "Manipulação + Dominação vs. Inteligência + Determinação",
    duration: "Até a ordem ser cumprida ou a cena terminar",
    level: 2,
    name: "Mesmerismo",
    rouse: true,
    system:
      "Nenhum teste contra mortais desprevenidos. Contra vítimas resistentes ou outros vampiros, dispute Manipulação + Dominação vs. Inteligência + Determinação. A ordem deve ser cumprida imediatamente com o melhor das habilidades da vítima, sem exigir discernimento moral ou ações suicidas diretas.",
  },
  {
    amalgam: "Ofuscação 2",
    cost: "Uma checagem de sangue por cena",
    description:
      "A voz e os maneirismos do vampiro transmitem uma semente de insanidade. A vítima se vê cada vez mais agitada à medida que seus demônios internos emergem para a superfície, sufocando a razão e o equilíbrio mental.",
    dicePool: "Manipulação + Dominação vs. Autocontrole + Inteligência",
    duration: "Uma cena",
    level: 2,
    name: "Dementação",
    rouse: true,
    system:
      "Após conversar com a vítima, dispute Manipulação + Dominação vs. Autocontrole + Inteligência. Em uma vitória, o usuário inflige dano de Força de Vontade Superficial no alvo a cada turno através da conversa insidiosa. Se o alvo for desmoralizado (Força de Vontade esgotada), desenvolve um surto psicótico ou compulsão severa temporária.",
  },
  {
    cost: "Uma checagem de sangue",
    description:
      "O vampiro pode reescrever completamente as memórias de uma vítima, apagando acontecimentos inteiros, alterando detalhes cruciais ou inserindo lembranças fabricadas que o sujeito aceita como genuínas.",
    dicePool: "Manipulação + Dominação vs. Inteligência + Determinação",
    duration: "Permanente",
    level: 3,
    name: "A Mente Esquecida",
    rouse: true,
    system:
      "Dispute Manipulação + Dominação vs. Inteligência + Determinação. Cada ponto de margem permite ao vampiro adicionar ou remover uma lembrança substancial ou alterar uma existente. A vítima passa a recordar a nova versão fabricada como verdade absoluta.",
  },
  {
    cost: "Sem custo adicional",
    description:
      "Ao mesmerizar alguém, o vampiro pode condicionar a ordem para disparar no futuro através de um gatilho pré-estabelecido, como uma data, evento ou frase de código específica.",
    duration: "Até ser ativada (permanente)",
    level: 3,
    name: "Diretiva Submersa",
    rouse: false,
    system:
      "Funciona como Mesmerizar. A diretiva permanece oculta na mente do sujeito por meses ou anos até que as condições do gatilho ocorram. Uma vez engatilhada, a vítima executa a ordem hipnótica sem questionar.",
  },
  {
    cost: "Sem custo adicional",
    description:
      "As vítimas do vampiro passam a acreditar piamente que tudo o que fizeram sob a influência de sua Dominação foi fruto de sua própria livre vontade, defendendo suas ações mesmo que tenham sido bizarras ou ilógicas.",
    duration: "Indefinida",
    level: 4,
    name: "Racionalizar",
    rouse: false,
    system:
      "Qualquer comando de Dominação usado pelo vampiro ganha este efeito. Se questionada sobre suas ações, a vítima racionaliza o comportamento como escolha pessoal. Testar a consistência mental da vítima exige dela um teste de Raciocínio + Percepção (Dificuldade 5).",
  },
  {
    cost: "Uma checagem de sangue adicional ao custo do poder amplificado",
    description:
      "O vampiro pode agora comandar multidões inteiras de mortais e até grupos de vampiros de uma só vez, emitindo ordens coletivas com uma presença magnética e intimidadora.",
    duration: "Conforme o poder utilizado",
    level: 5,
    name: "Manipulação em Massa",
    rouse: true,
    system:
      "O vampiro pode amplificar Compelir ou Mesmerizar para afetar um grupo inteiro de pessoas ao mesmo tempo. Todas as vítimas precisam enxergar os olhos do vampiro. O usuário faz uma única rolagem contra o maior atributo de defesa do grupo ou contra cada um individualmente.",
  },
  {
    cost: "Sem custo adicional de Fome (mas com potencial perda de Humanidade)",
    description:
      "A vontade do vampiro é tão absoluta que consegue sobrepujar o mais profundo instinto de autopreservação de suas vítimas, ordenando suicídio, mutilação direta ou o avanço cego contra chamas ou luz solar.",
    duration: "Passiva",
    level: 5,
    name: "Decreto Terminal",
    rouse: false,
    system:
      "Comandos que causam a morte ou automutilação imediata não falham mais automaticamente. Vítimas mortais e vampiros podem resistir através de disputas normais do poder de Dominação utilizado, mas sucumbem se perderem o teste.",
  },
  // Guia do Jogador
  {
    amalgam: "Fortitude 1",
    cost: "Gratuito",
    description:
      "Quem já está sob o domínio mental do vampiro tem a mente fortalecida contra a interferência de outros Membros.",
    duration: "Passiva",
    level: 1,
    name: "Devoção Servil",
    rouse: false,
    system:
      "Qualquer tentativa de terceiros de usar Dominação num personagem já sob a Dominação do vampiro sofre penalidade de dados igual à Fortitude do vampiro.",
  },
  {
    cost: "Uma checagem de sangue",
    description:
      "Enquanto condicionado por este poder, um servo com Laço de Sangue com o vampiro tem muito mais dificuldade de agir contra o mestre. Os Tzimisce o apreciam para garantir a lealdade de seus servos.",
    duration: "Um mês",
    level: 2,
    name: "Favor do Domitor",
    rouse: true,
    system:
      "Testes de desafio de servos obstinados sob o efeito sofrem penalidade de três dados, e o servo não pode gastar Força de Vontade neles. Uma falha total no teste de desafio significa que o Laço de Sangue não enfraquece naquele mês.",
  },
  {
    amalgam: "Feitiçaria de Sangue 2",
    cost: "Uma checagem de sangue",
    description:
      "Vampiros antigos e poderosos impõem sua vontade através do Sangue, sem contato visual nem comunicação verbal, obrigando um descendente a agir em seu nome mesmo contra a vontade dele. O alvo sabe instintivamente que um ancestral o manipula.",
    dicePool: "Manipulação + Dominação vs. Determinação + Ocultismo",
    duration:
      "Até o comando ser cumprido ou a cena acabar, o que vier primeiro",
    level: 4,
    name: "Domínio Ancestral",
    prerequisite: "Mesmerismo",
    rouse: true,
    system:
      "Numa vitória, o descendente atende ao pedido do ancestral, desde que não precise se ferir. Para cada geração que separa usuário e alvo, o alvo ganha um dado na resistência (um vampiro de 9ª geração contra um descendente de 11ª dá dois dados extras). O comando passa em silêncio, de Sangue para Sangue, mas segue as demais limitações da Dominação.",
  },
  {
    amalgam: "Presença 1",
    cost: "Uma checagem de sangue",
    description:
      "O vampiro muda temporariamente a personalidade ou as opiniões de alguém: pode fazê-lo desejar um estranho, abandonar a família, duvidar das próprias crenças ou simplesmente querer uma cerveja. Quem usa este poder indiscriminadamente costuma ser evitado pelos pares.",
    dicePool: "Manipulação + Dominação vs. Autocontrole + Determinação",
    duration: "Uma cena",
    level: 4,
    name: "Implantar Sugestão",
    rouse: true,
    system:
      "Não exige teste contra um mortal desprevenido; um mortal preparado ou um vampiro resiste com Autocontrole + Determinação. Mudanças radicais em crenças fundamentais (um vegano desejar um bife, um pacifista ficar violento) permitem resistência mesmo a mortais desprevenidos.",
  },
];

const FORTITUDE_POWERS: readonly PowerTemplate[] = [
  {
    cost: "Gratuito",
    description:
      "Dotado de vigor sobrenatural, o vampiro fortalece sua estrutura física e tolerância ao dano. A carne se torna mais densa e suporta agressões que destruiriam um mortal.",
    duration: "Passiva",
    level: 1,
    name: "Resiliência",
    rouse: false,
    system:
      "Adicione a pontuação de Fortitude do vampiro ao seu total de Vitalidade.",
  },
  {
    cost: "Gratuito",
    description:
      "A determinação imutável dos mortos-vivos confere ao vampiro uma barreira impenetrável contra intimidação, sedução e dominação mental sobrenatural.",
    duration: "Passiva",
    level: 1,
    name: "Mente Inescrutável",
    rouse: false,
    system:
      "O usuário adiciona sua pontuação de Fortitude a quaisquer paradas de dados de Autocontrole ou Determinação para resistir a persuasão mundana, intimidação, bem como poderes sobrenaturais como Dominação e Presença.",
  },
  {
    cost: "Gratuito",
    description:
      "A carne do vampiro adquire uma tenacidade inata que ignora e amortece ferimentos que rasgariam músculos e quebrariam ossos.",
    duration: "Passiva",
    level: 2,
    name: "Tenacidade",
    rouse: false,
    system:
      "Sempre que o usuário sofrer dano Superficial, reduza o total de dano sofrido por ataque em um valor igual à sua pontuação de Fortitude (antes de dividir o dano pela metade, se aplicável), até um mínimo de 1 de dano.",
  },
  {
    amalgam: "Animalismo 1",
    cost: "Gratuito ou uma checagem de sangue",
    description:
      "O vampiro pode estender a resistência sobrenatural de sua Fortitude aos animais que comanda ou ao seu famulus ligado por Sangue.",
    duration: "Uma cena",
    level: 2,
    name: "Feras Tenazes",
    rouse: false,
    system:
      "O vampiro confere sua pontuação de Fortitude (Resiliência e Tenacidade) aos seus animais comandados ou ao seu famulus. O famulus recebe esse benefício passivamente de forma gratuita; animais comuns exigem uma checagem de sangue.",
  },
  {
    cost: "Uma checagem de sangue",
    description:
      "Concentrando o poder de sua Vitae, o vampiro torna-se temporariamente resistente às maiores fraquezas e terrores de sua espécie: fogo e luz solar.",
    duration: "Uma cena",
    level: 3,
    name: "Desafio à Perdição",
    rouse: true,
    system:
      "Durante uma cena, o vampiro converte uma quantidade de dano Agravado proveniente de fogo ou luz solar igual à sua pontuação de Fortitude por turno em dano Superficial. Além disso, adiciona sua Fortitude a testes para resistir ao Rötschreck.",
  },
  {
    cost: "Gratuito",
    description:
      "O vampiro constrói uma barreira psíquica impenetrável em sua mente, ocultando seus pensamentos mais íntimos, emoções e até sua aura de qualquer perscrutação mística.",
    duration: "Passiva",
    level: 3,
    name: "Fortificar a Fachada Interior",
    rouse: false,
    system:
      "Qualquer tentativa sobrenatural de ler a mente do vampiro (como Telepatia) ou sondar sua aura (como Sondar a Alma) sofre uma penalidade na parada de dados igual à pontuação de Fortitude do usuário, ou o usuário soma Fortitude à sua rolagem de resistência.",
  },
  {
    cost: "Uma checagem de sangue",
    description:
      "O Sangue do vampiro transborda com a tenacidade da Fortitude, transferindo temporariamente essa resistência colossal para quem quer que beba dele.",
    duration: "Uma noite; para vampiros, até a próxima alimentação ou Fome 5",
    level: 4,
    name: "Resistência Direto da Fonte",
    rouse: true,
    system:
      "Beber o equivalente a uma checagem de sangue diretamente do usuário concede ao bebedor Fortitude temporária igual à metade dos pontos de Fortitude do doador (arredondado para baixo), recebendo os mesmos poderes sem amálgama.",
  },
  {
    cost: "Duas checagens de sangue",
    description:
      "O poder do Sangue faz a pele do vampiro endurecer com a perfeição translúcida do mármore esculpido, tornando-o invulnerável ao primeiro golpe violento desferido contra ele em cada turno.",
    duration: "Uma cena",
    level: 5,
    name: "Pele de Mármore",
    rouse: true,
    system:
      "Enquanto ativo, o vampiro ignora completamente todo o dano físico do primeiro ataque bem-sucedido contra ele em cada turno, a menos que o ataque seja causado por fogo ou luz solar.",
  },
  {
    cost: "Gratuito",
    description:
      "Em vez de ser enfraquecido pelos ferimentos, o vampiro converte a dor em pura energia sobrenatural, ficando mais forte e letal à medida que seu corpo é rasgado em batalha.",
    duration: "Passiva",
    level: 5,
    name: "Proeza Vindo da Dor",
    rouse: false,
    system:
      "O vampiro não sofre penalidades por caixas de Vitalidade danificadas. Além disso, para cada nível de dano que normalmente causaria penalidade em suas paradas de dados, ele ganha dados bônus adicionais em testes físicos.",
  },
  // Guia do Jogador
  {
    cost: "Uma checagem de sangue",
    description:
      "O vampiro recorre à força da terra e se ancora no lugar, tornando-se quase impossível de mover.",
    duration: "Uma cena ou até o usuário encerrar",
    level: 2,
    name: "Perseverança da Terra",
    rouse: true,
    system:
      "Enquanto ativo, o vampiro só se move se escolher fazê-lo. Não o torna resistente a dano: ele ainda pode ser esmagado ou despedaçado, assim como o chão em que está.",
  },
  {
    amalgam: "Auspícios 1",
    cost: "Apenas as checagens de sangue para doar vitae",
    description:
      "O Sangue do vampiro ganha força para unir carne mortal e curar doenças: seres vivos que bebem sua vitae recuperam a saúde numa velocidade surpreendente.",
    duration: "Passiva",
    level: 2,
    name: "Vitae Revigorante",
    rouse: false,
    system:
      "Usar vitae para curar os vivos (Vampiro: A Máscara, p. 139) cura três níveis de dano Agravado por checagem de sangue, em vez de um. Os outros efeitos (virar carniçal, arriscar o Laço de Sangue) não mudam.",
  },
  {
    amalgam: "Auspícios 1",
    cost: "Uma checagem de sangue e Vitalidade conforme as circunstâncias",
    description:
      "O vampiro projeta sua Fortitude para fora, fazendo o poder de seu Sangue reparar o corpo ferido de outro vampiro.",
    dicePool: "Inteligência + Fortitude",
    duration: "Instantânea",
    level: 3,
    name: "Valeren",
    rouse: true,
    system:
      "Teste Inteligência + Fortitude (Dificuldade 2): o alvo recupera dano Superficial de Vitalidade igual à margem ou, alternativamente, um nível de dano Agravado a cada três sucessos na margem. Leva um turno; gastando uma cena, a Dificuldade cai para 0. Só funciona em outros vampiros, e cada alvo só pode ser afetado uma vez por noite. Para cada alvo adicional na mesma noite, o usuário sofre dano Superficial de Vitalidade igual à metade dos sucessos na margem.",
  },
  {
    cost: "Uma checagem de sangue",
    description:
      "A Ressonância do sangue no organismo do vampiro lhe dá defesas contra poderes de outros Membros ou contra fraquezas vampíricas comuns. Vampiros especialmente frios mantêm recipientes de Ressonâncias variadas em estoque para isso.",
    duration:
      "Até o fim da cena ou a Ressonância se perder, o que vier primeiro",
    level: 4,
    name: "Escamas da Górgona",
    rouse: true,
    system:
      "Ao ativar, o vampiro ganha uma defesa conforme a Ressonância do sangue do qual se alimentou recentemente. Colérica: uma estaca cravada no coração apodrece ou vira cinzas no fim da cena, libertando-o da paralisia; a Ressonância se perde. Melancólica: dano Agravado de fogo vira Superficial; a Ressonância se perde após reduzir quatro níveis. Fleumática: +4 dados para resistir a poderes de Auspícios que revelariam algo sobre ele ou o que sabe; dura uma cena e a Ressonância se perde. Sanguínea: dano Agravado da luz do sol vira Superficial; a Ressonância se perde após reduzir quatro níveis.",
  },
];

const OBFUSCATE_POWERS: readonly PowerTemplate[] = [
  {
    cost: "Gratuito",
    description:
      "Permanecendo imóvel, o usuário se mescla completamente ao ambiente ao redor. Desde que haja qualquer tipo de sombra, cobertura ou canto escuro, ele se torna indetectável à visão casual.",
    duration: "Até que o usuário se mova ou ataque",
    level: 1,
    name: "Manto de Sombras",
    rouse: false,
    system:
      "O vampiro é automaticamente imperceptível enquanto permanecer imóvel e em alguma cobertura ou penumbra. Observadores em busca ativa devem vencer uma disputa de Raciocínio + Percepção contra a Destreza + Furtividade do vampiro.",
  },
  {
    cost: "Gratuito",
    description:
      "O vampiro abafa todo som emanado de sua pessoa e pertences imediatos. Seus passos não estalam folhas secas, suas roupas não farfalham e objetos derrubados atingem o chão em silêncio absoluto.",
    duration: "Uma cena",
    level: 1,
    name: "Silêncio da Morte",
    rouse: false,
    system:
      "O usuário silencia completamente sons emitidos por seus movimentos corporais e itens pessoais. Ele pode conversar em sussurro direto sem que ninguém além do interlocutor pretendido ouça.",
  },
  {
    cost: "Uma checagem de sangue",
    description:
      "Com este poder, o vampiro pode mover-se furtivamente permanecendo totalmente despercebido. As mentes ao redor simplesmente ignoram sua presença, desviando o olhar inconscientemente.",
    dicePool: "Raciocínio + Furtividade vs. Raciocínio + Percepção",
    duration: "Uma cena",
    level: 2,
    name: "Passagem Invisível",
    rouse: true,
    system:
      "O vampiro pode se deslocar enquanto permanece imperceptível aos sentidos de mortais e vampiros. Chamar atenção deliberadamente (falar alto, empurrar alguém, quebrar um objeto ou atacar) quebra a ilusão imediatamente.",
  },
  {
    cost: "Gratuito",
    description:
      "O usuário agora consegue transmitir os efeitos hipnóticos da Ofuscação através de mídias eletrônicas, permitindo ocultar-se de câmeras de segurança, detectores digitais e gravações de vídeo.",
    duration: "Passiva",
    level: 3,
    name: "Fantasma na Máquina",
    rouse: false,
    system:
      "Os poderes de Ofuscação do vampiro passam a funcionar igualmente contra equipamentos de gravação de vídeo, sensores e câmeras de segurança, gerando distorções sutis, falhas na imagem ou simplesmente desaparecendo das filmagens.",
  },
  {
    cost: "Gratuito",
    description:
      "O vampiro projeta uma ilusão mental sobre quem o observa, fazendo com que o vejam não com seu verdadeiro rosto, mas como um estranho qualquer, um funcionário inócuo ou uma pessoa sem traços marcantes.",
    dicePool: "Manipulação + Furtividade vs. Raciocínio + Percepção",
    duration: "Uma cena",
    level: 3,
    name: "Máscara de Mil Faces",
    rouse: false,
    system:
      "O vampiro assume a aparência de um desconhecido comum e insignificante. Se tentar imitar alguém específico, deve fazer um teste de Manipulação + Furtividade contra Raciocínio + Percepção de conhecidos dessa pessoa.",
  },
  {
    amalgam: "Auspícios 3",
    cost: "Uma checagem de sangue",
    description:
      "Esta habilidade permite ao usuário estender o manto da Ofuscação para esconder um objeto inanimado de grande porte ou até um veículo, tornando-o invisível à percepção casual.",
    dicePool: "Inteligência + Furtividade",
    duration: "Uma cena",
    level: 4,
    name: "Ocultar",
    rouse: true,
    system:
      "O vampiro pode ocultar um objeto inanimado com tamanho até o de um carro ou caminhão pequeno. Quem procurar ativamente pelo objeto disputa Raciocínio + Percepção contra a parada de dados do usuário.",
  },
  {
    cost: "Uma checagem de sangue",
    description:
      "O vampiro pode desaparecer instantaneamente da vista de todos mesmo quando sob observação direta ou no calor do combate, deixando seus adversários perplexos e desorientados.",
    dicePool: "Raciocínio + Furtividade vs. Raciocínio + Percepção",
    duration: "Conforme Passagem Invisível",
    level: 4,
    name: "Desaparecer",
    rouse: true,
    system:
      "Permite ativar Passagem Invisível sob escrutínio aberto ou durante um combate. Dispute Raciocínio + Furtividade vs. Raciocínio + Percepção de quem estiver olhando diretamente. Se vencer, desvanece no ar.",
  },
  {
    cost: "Uma checagem de sangue adicional",
    description:
      "O vampiro pode estender o manto de Ofuscação para abrigar seus companheiros, fazendo com que um grupo inteiro compartilhe de sua invisibilidade e discrição sobrenatural.",
    duration: "Uma cena",
    level: 5,
    name: "Ocultar o Grupo",
    rouse: true,
    system:
      "O usuário estende Passagem Invisível ou Manto de Sombras a um número de pessoas adicionais igual à sua pontuação de Furtividade, desde que permaneçam por perto.",
  },
  {
    cost: "Uma checagem de sangue",
    description:
      "O usuário pode transformar sua aparência na réplica exata e impecável de qualquer indivíduo específico, copiando com perfeição rosto, voz, altura, peso, sotaque e tiques motores.",
    dicePool: "Manipulação + Performance vs. Raciocínio + Percepção",
    duration: "Uma cena",
    level: 5,
    name: "Disfarce do Impostor",
    rouse: true,
    system:
      "O vampiro se disfarça perfeitamente como alguém que estudou previamente. Pessoas próximas do indivíduo imitado precisam vencer uma disputa de Raciocínio + Percepção vs. Manipulação + Performance para desconfiar de algo.",
  },
  // Guia do Jogador
  {
    amalgam: "Presença 1",
    cost: "Uma checagem de sangue",
    description:
      "O vampiro cria alucinações breves e vívidas, em qualquer sentido, que distraem quem as percebe. Por serem breves, não passam de algo vislumbrado no canto do olho ou de uma voz ouvida ao longe; não servem para criar uma identidade falsa.",
    dicePool: "Manipulação + Ofuscação vs. Autocontrole + Raciocínio",
    duration: "Um turno",
    level: 2,
    name: "Quimerismo",
    rouse: true,
    system:
      "Qualquer pessoa despreparada que possa perceber a alucinação fica distraída e perde dois dados na próxima ação. Quem falhar em resistir com Autocontrole + Raciocínio também perde a próxima ação ativa (ainda pode se defender e resistir, com -2 dados). Ao contrário da maioria dos poderes de Presença, pode ser usado em combate, mas cada alvo só é afetado uma vez por conflito. As alucinações nunca podem ser gravadas ou transmitidas.",
  },
  {
    amalgam: "Presença 2",
    cost: "Uma checagem de sangue",
    description:
      "O vampiro cria alucinações elaboradas: qualquer pessoa próxima vê, ouve e sente o que ele imaginar, de comida cheia de larvas a uma torrente de sangue fervendo dos esgotos.",
    dicePool: "Manipulação + Ofuscação",
    duration: "Uma cena, a menos que o vampiro a encerre antes",
    level: 3,
    name: "Fata Morgana",
    rouse: true,
    system:
      "Teste Manipulação + Ofuscação contra Dificuldade igual a 1 + o número de sentidos atingidos (audiovisual = 3; cinco sentidos = 6). Alucinações do tamanho de uma sala somam +1, do tamanho de uma casa +2, e assim por diante; imitar alguém específico pode exigir testes de Performance ou Raciocínio. Não há limite de vítimas, mas elas precisam ver o usuário ou ser vistas por ele. As alucinações são objetos separados: não disfarçam coisas, não bloqueiam a visão, não afetam a realidade, não cegam nem ensurdecem e não aparecem em gravações. Vampiros e sobrenaturais podem desacreditá-las (mortais, só com motivo para suspeitar) com Inteligência + Percepção vs. Manipulação + Presença do usuário; interagir com a alucinação a desfaz para todos. Se ela puder provocar frenesi, o teste tem Dificuldade 1 menor.",
  },
  {
    amalgam: "Dominação 1",
    cost: "Uma ou três checagens de sangue",
    description:
      "O vampiro tira da vítima todo o senso de direção, tornando-a prisioneira do ambiente em que está (uma casa, uma boate, um porão). A saída parece sempre levar mais para dentro, até a vítima entrar em pânico.",
    dicePool: "Carisma + Ofuscação vs. Raciocínio + Determinação",
    duration: "Uma noite",
    level: 3,
    name: "Labirinto Mental",
    rouse: true,
    system:
      "Exige contato visual; vampiros podem negar o teste gastando 1 ponto de Força de Vontade, como na Dominação (Vampiro: A Máscara, p. 255). Numa vitória, a vítima não consegue sair do prédio em que está. Duas checagens de sangue adicionais permitem usá-lo numa única sala ou num ambiente externo denso (canteiro de obras, floresta). Mortais não podem tentar escapar; sobrenaturais testam Determinação + Percepção a cada cena contra os sucessos iniciais do vampiro, sofrendo 1 de dano Superficial de Força de Vontade por sucesso que faltar. Trabalho em Equipe não ajuda. O poder termina se o ambiente ficar perigoso, a menos que o vampiro tenha Decreto Terminal.",
  },
  {
    amalgam: "Dominação 2",
    cost: "Uma checagem de sangue",
    description:
      "O vampiro cria a ilusão de uma personalidade totalmente diferente, escondendo pensamentos e sentimentos de quem usa poderes sobrenaturais para ler seu estado mental, aura ou pensamentos.",
    dicePool: "Inteligência + Ofuscação",
    duration: "Uma cena",
    level: 3,
    name: "Máscara da Mente",
    rouse: true,
    system:
      "Teste Inteligência + Ofuscação contra Dificuldade 1 (mascarar o estado emocional) a 3 ou mais (personas completas com falsos pensamentos e memórias). A margem soma à Dificuldade de qualquer tentativa de lê-lo; quem não alcançar essa Dificuldade vê só a falsa personalidade, sem indício de engano. Quem nem alcança a Dificuldade normal não obtém nada, como de costume.",
  },
];

const POTENCE_POWERS: readonly PowerTemplate[] = [
  {
    cost: "Gratuito",
    description:
      "Usando este poder, o vampiro é capaz de causar danos horrendos a mortais com socos e chutes, rasgando carne e quebrando ossos com facilidade monstruosa.",
    duration: "Passiva",
    level: 1,
    name: "Corpo Letal",
    rouse: false,
    system:
      "Ao usar ataques desarmados (Briga), o usuário causa dano Agravado em mortais em vez de dano Superficial. Contra seres sobrenaturais, causa dano Superficial normalmente mas não tem o dano reduzido pela metade.",
  },
  {
    cost: "Gratuito",
    description:
      "As pernas do vampiro flexionam-se com força descomunal, impulsionando-o em saltos verticais e horizontais vertiginosos que desafiam as leis da física.",
    duration: "Passiva",
    level: 1,
    name: "Salto Elevado",
    rouse: false,
    system:
      "O usuário pode saltar verticalmente uma altura em metros igual a três vezes seu nível de Potência, e horizontalmente cinco vezes seu nível de Potência sem precisar de teste.",
  },
  {
    cost: "Uma checagem de sangue",
    description:
      "Os vampiros dotados de Potência extraem muito mais força bruta de seu Sangue místico, amplificando o impacto de seus ataques e a capacidade de erguer cargas colossais.",
    duration: "Uma cena",
    level: 2,
    name: "Poderio",
    rouse: true,
    system:
      "Quando ativado, adicione a pontuação de Potência do usuário ao dano de seus ataques desarmados e a todos os testes que envolvam proezas extraordinárias de Força física.",
  },
  {
    cost: "Gratuito",
    description:
      "Conhecido como o 'Beijo Selvagem', este poder permite ao usuário empregar uma força impiedosa ao sugar o sangue de uma vítima, drenando um mortal em segundos.",
    duration: "Um turno",
    level: 3,
    name: "Alimentação Brutal",
    rouse: false,
    system:
      "O vampiro drena um mortal por completo em poucos segundos (geralmente um único turno). Cada ponto de Fome saciado causa dois pontos de dano Agravado na vítima mortal.",
  },
  {
    amalgam: "Presença 3",
    cost: "Uma checagem de sangue",
    description:
      "O usuário canaliza a energia de sua Besta e sua força bruta para incitar paixões violentas e fúria assassina em indivíduos ou multidões ao seu redor.",
    dicePool: "Manipulação + Potência",
    duration: "Uma cena",
    level: 3,
    name: "Centelha de Fúria",
    rouse: true,
    system:
      "O usuário soma sua pontuação de Potência a qualquer tentativa de incitar um motim, provocar brigas ou atiçar o frenesi de fúria em alvos mortais ou vampiros próximos.",
  },
  {
    cost: "Uma checagem de sangue",
    description:
      "O vampiro crava os dedos em superfícies sólidas como pedra, tijolos ou madeira com força titânica, permitindo-lhe escalar paredes verticais e agarrar-se com firmeza inabalável.",
    duration: "Uma cena",
    level: 3,
    name: "Pegada Sobrenatural",
    rouse: true,
    system:
      "O usuário passa automaticamente em testes de Atletismo para escalar superfícies não metálicas sólidas cravando os dedos nelas. Em manobras de imobilização, adiciona Potência à parada.",
  },
  {
    cost: "Uma checagem de sangue",
    description:
      "O Sangue do vampiro fica impregnado com a pura força da Potência, transmitindo temporariamente essa pujança titânica para quem o consome.",
    duration: "Uma noite; para vampiros, até a próxima alimentação ou Fome 5",
    level: 4,
    name: "Força Direto da Fonte",
    rouse: true,
    system:
      "Beber o equivalente a uma checagem de sangue diretamente do usuário concede ao bebedor Potência temporária igual à metade dos pontos de Potência do doador (arredondado para baixo).",
  },
  {
    cost: "Duas checagens de sangue",
    description:
      "Com uma força elemental avassaladora, o vampiro esmurra ou pisa com violência extrema no chão, propagando uma onda de choque sísmica destrutiva ao redor.",
    duration: "Instantânea",
    level: 5,
    name: "Terremoto",
    rouse: true,
    system:
      "Não exige teste para deflagrar o impacto. Todos em um raio de 5 metros ao redor do usuário devem fazer um teste de Destreza + Atletismo (Dificuldade 4) ou cair ao chão atordoados e sofrer 3 pontos de dano Superficial.",
  },
  {
    cost: "Uma checagem de sangue",
    description:
      "A força do vampiro se torna uma arma de aniquilação mitológica. Seus golpes são capazes de decapitar, rasgar membros ou arrancar o coração do peito de mortais e vampiros com as próprias mãos.",
    duration: "Uma cena",
    level: 5,
    name: "Punho de Caim",
    rouse: true,
    system:
      "Por uma cena inteira, o usuário causa dano Agravado a mortais e seres sobrenaturais ao lutar desarmado (Briga), destroçando carcaças com facilidade colossal.",
  },
  // Guia do Jogador
  {
    cost: "Uma checagem de sangue",
    description:
      "O aperto do vampiro fica incrivelmente forte: uma vez que ele agarra algo, só se solta desmembrado.",
    duration: "Uma cena",
    level: 2,
    name: "Aperto Implacável",
    rouse: true,
    system:
      "Soma o nível de Potência como sucessos automáticos em qualquer tentativa de se segurar em algo, inclusive para manter um agarrão (mas não no teste inicial de agarrar).",
  },
  {
    cost: "Gratuito",
    description:
      "O vampiro aplica força violenta e indiscriminada a um objeto parado para quebrá-lo e destruí-lo. O tempo de preparo o torna inútil numa luta, mas ideal quando uma porta bloqueia o caminho, um carro precisa ser imobilizado ou uma estátua ofensiva precisa virar exemplo.",
    duration: "Como Poderio",
    level: 3,
    name: "Destruidor",
    prerequisite: "Poderio",
    rouse: false,
    system:
      "O usuário conta seu nível de Potência duas vezes ao usar Poderio em feitos de força para danificar ou destruir objetos inanimados.",
  },
  {
    cost: "Uma checagem de sangue",
    description:
      "O vampiro aterrissa do Salto Elevado com estrondo, parando de forma irrefreável e ferindo quem estiver onde ele pousa ou ao redor.",
    dicePool: "Força + Potência vs. Destreza + Atletismo",
    duration: "Instantânea",
    level: 4,
    name: "Queda",
    prerequisite: "Salto Elevado",
    rouse: true,
    system:
      "Ao usar Salto Elevado, o vampiro pode ativar Queda e causar dano numa pequena área: todos num raio de três metros sofrem um ataque de Força + Potência contra Destreza + Atletismo e recebem dano Superficial igual à margem. Quem sofrer três ou mais níveis de dano ou tiver falha total na defesa é derrubado (Vampiro: A Máscara, p. 122).",
  },
  {
    cost: "Gratuito",
    description:
      "Cada parte do corpo do vampiro projeta toda a sua força: um peteleco transmite a força de um soco de corpo inteiro, e uma cutucada com o dedo do pé vira um chute que parte concreto. O poder não o torna mais forte, apenas permite usar toda a força em movimentos pequenos.",
    duration: "Passiva",
    level: 5,
    name: "Martelo Sutil",
    rouse: false,
    system:
      "Ataques desarmados corpo a corpo ou feitos de força passam a contar como ações menores de dois dados (Vampiro: A Máscara, p. 298). Só uma ação menor de Martelo Sutil por turno, e sem outros ataques no mesmo turno. Feitos de força com movimento limitado (como romper amarras) ganham +4 dados ou mais, a critério do Narrador.",
  },
];

const PRESENCE_POWERS: readonly PowerTemplate[] = [
  {
    cost: "Gratuito",
    description:
      "Qualquer um na presença do vampiro sente sua atenção inexplicavelmente atraída para ele. Aqueles que o ouvem inclinam-se a concordar com suas opiniões e pontos de vista.",
    dicePool: "Manipulação + Presença vs. Autocontrole + Inteligência",
    duration: "Uma cena ou até ser cancelado",
    level: 1,
    name: "Fascínio",
    rouse: false,
    system:
      "Adiciona a pontuação de Presença a qualquer teste social envolvendo Persuasão ou Performance. Contra alvos em disputa, role Manipulação + Presença vs. Autocontrole + Inteligência.",
  },
  {
    cost: "Gratuito",
    description:
      "O vampiro exala uma aura palpável de perigo predatório, fazendo mortais evitarem seu olhar e outros vampiros pensarem duas vezes antes de confrontá-lo.",
    duration: "Uma cena",
    level: 1,
    name: "Amedrontar",
    rouse: false,
    system:
      "Adicione a pontuação de Presença a qualquer rolagem de Intimidação. Qualquer pessoa que tente atacar o usuário deve antes vencer um teste de Determinação + Autocontrole (Dificuldade 2).",
  },
  {
    cost: "Gratuito",
    description:
      "O Beijo do vampiro induz um êxtase avassalador que deixa as presas completamente viciadas em sua mordida, desejando ardentemente ser alimentadas de novo.",
    duration: "Até ser superado",
    level: 2,
    name: "Beijo Indelével",
    rouse: false,
    system:
      "O vampiro pode escolher ativar este efeito durante a alimentação. Vítimas mortais tornam-se submissas e viciadas no Beijo, concedendo +2 dados em testes sociais subsequentes contra elas.",
  },
  {
    cost: "Uma checagem de sangue",
    description:
      "Exibindo brevemente sua natureza vampírica predatória, o usuário incute em um alvo um pavor paralisante, forçando mortais a fugir e vampiros a fraquejar ou entrar em Rötschreck.",
    dicePool: "Carisma + Presença vs. Autocontrole + Determinação",
    duration: "Uma cena",
    level: 3,
    name: "Olhar Aterrorizante",
    rouse: true,
    system:
      "Role Carisma + Presença vs. Autocontrole + Determinação. Mortais derrotados fogem em pânico ou ficam catatônicos de medo. Vampiros derrotados sofrem penalidades ou devem testar contra o frenesi de terror.",
  },
  {
    cost: "Uma checagem de sangue",
    description:
      "O vampiro encanta um indivíduo tão profundamente que este se torna totalmente fascinado, buscando a aprovação do vampiro acima de quaisquer outros laços comuns.",
    dicePool: "Carisma + Presença vs. Autocontrole + Raciocínio",
    duration: "Uma hora mais uma hora por ponto de margem",
    level: 3,
    name: "Transe",
    rouse: true,
    system:
      "Dispute Carisma + Presença vs. Autocontrole + Raciocínio. Em uma vitória, o alvo fica hipnotizado pelo vampiro, concordando com quase qualquer pedido razoável que não lhe cause dano físico direto.",
  },
  {
    amalgam: "Dominação 1",
    cost: "Sem custo adicional",
    description:
      "A Presença do usuário serve como um condutor perfeito para a Dominação. O vampiro agora precisa apenas que sua voz seja ouvida para usar seus poderes de Dominação, sem exigir contato visual.",
    duration: "Passiva",
    level: 4,
    name: "Voz Irresistível",
    rouse: false,
    system:
      "Permite usar todos os poderes de Dominação que exigem contato visual apenas através da voz falada, desde que o alvo consiga ouvi-lo claramente pessoalmente (não funciona por mídia eletrônica).",
  },
  {
    cost: "Uma checagem de sangue",
    description:
      "O vampiro pode chamar para sua presença qualquer pessoa que já tenha experimentado sua Presença ou provado de seu Sangue, independentemente da distância.",
    dicePool: "Manipulação + Presença vs. Autocontrole + Inteligência",
    duration: "Uma noite",
    level: 4,
    name: "Convocar",
    rouse: true,
    system:
      "Role Manipulação + Presença vs. Autocontrole + Inteligência. Em uma vitória, o alvo sente uma atração irresistível e viaja até o vampiro pelo caminho mais rápido possível.",
  },
  {
    cost: "Duas checagens de sangue",
    description:
      "No ápice da Disciplina, o vampiro amplifica seu semblante a níveis semidivinos ou aterradores. Testemunhar a Majestade é estar diante de um deus ou de um soberano supremo.",
    dicePool: "Carisma + Presença vs. Autocontrole + Determinação",
    duration: "Uma cena",
    level: 5,
    name: "Majestade",
    rouse: true,
    system:
      "Ninguém na presença do usuário pode atacá-lo ou mesmo falar de forma desrespeitosa sem antes vencer um teste de Autocontrole + Determinação contra a parada de Carisma + Presença do usuário.",
  },
  {
    cost: "Uma checagem de sangue adicional",
    description:
      "A Presença do vampiro torna-se tão potente que consegue ultrapassar as barreiras das transmissões eletrônicas, projetando Fascínio, Intimidação ou Transe através de câmeras, transmissões ao vivo ou chamadas de telefone.",
    duration: "Uma cena",
    level: 5,
    name: "Magnetismo de Estrela",
    rouse: true,
    system:
      "Permite transmitir Fascínio, Intimidação e Transe através de feeds de vídeo e telas digitais ao vivo, afetando espectadores remotos que estejam assistindo no momento.",
  },
  // Guia do Jogador
  {
    amalgam: "Proteanismo 1",
    cost: "Gratuito",
    description:
      "Os olhos do vampiro viram orbes de serpente que congelam no lugar o mortal que cruzar seu olhar. Pode até paralisar vampiros, por pouco tempo e provavelmente despertando a ira da vítima.",
    dicePool: "Carisma + Presença vs. Raciocínio + Autocontrole",
    duration: "Até o contato visual ser quebrado ou a cena acabar",
    level: 1,
    name: "Olhos da Serpente",
    rouse: false,
    system:
      "Ao prender a atenção de um mortal (Vampiro: A Máscara, p. 255), o vampiro o imobiliza enquanto mantiver o contato visual. Só uma vítima por vez; o efeito termina se ela sofrer dano ou for removida à força. A vítima pode falar, mas não gritar. Para paralisar um vampiro, é preciso vencer uma disputa de Carisma + Presença vs. Raciocínio + Autocontrole; a vítima pode escapar a partir do segundo turno gastando 1 ponto de Força de Vontade.",
  },
  {
    cost: "Gratuito",
    description:
      "A voz do usuário vira a de uma sereia, capaz de fascinar ou aterrorizar por si só, sem que ele precise estar presente. Afeta qualquer um ao alcance da voz, mas perde o efeito se gravada ou transmitida eletronicamente.",
    duration: "Passiva",
    level: 2,
    name: "Melpômene",
    rouse: false,
    system:
      "O vampiro pode usar Fascínio, Amedrontar, Olhar Aterrorizante, Transe e Majestade apenas pela voz: não precisa ver o alvo, e o alvo só precisa estar perto o bastante para ouvi-lo.",
  },
  {
    amalgam: "Auspícios 1",
    cost: "Uma checagem de sangue",
    description:
      "O vampiro faz a voz emanar de qualquer ponto à vista, de sussurro a grito, audível como se ele estivesse lá. A voz também pode ficar num local, continuando a atrair ou aterrorizar quem passa, conforme o poder usado.",
    duration: "Uma cena",
    level: 3,
    name: "Voz Lançada",
    rouse: true,
    system:
      "Não exige teste além da checagem de sangue. Combinado com Voz Irresistível, Melpômene ou poderes similares, estes são testados normalmente.",
  },
  {
    cost: "Gratuito",
    description:
      "Presente num edifício ou local semelhante, o vampiro estende Fascínio, Amedrontar e Majestade pela própria estrutura: quem está no prédio ou olha para ele reage como se o vampiro estivesse presente.",
    duration: "Enquanto o poder usado durar",
    level: 4,
    name: "Impregnar o Edifício",
    rouse: false,
    system:
      "Quem vê o prédio de fora ou está dentro dele precisa resistir ao poder como se o vampiro estivesse ali, a menos que o vampiro esteja no campo de visão, quando ele mesmo vira o foco. Aplique os bônus às reações das vítimas ao local: uma boate sob Fascínio tem fila dando a volta no quarteirão, e um refúgio sob Amedrontar afasta todos, menos os investigadores mais teimosos. Majestade deve ser usada com extrema cautela, pois os resultados podem ser espetaculares e voláteis.",
  },
];

const PROTEAN_POWERS: readonly PowerTemplate[] = [
  {
    cost: "Gratuito",
    description:
      "O vampiro faz seus olhos brilharem em um tom vermelho sobrenatural, permitindo-lhe enxergar com perfeita nitidez mesmo na mais absoluta escuridão.",
    duration: "Enquanto desejado",
    level: 1,
    name: "Olhos da Besta",
    rouse: false,
    system:
      "Não exige teste. O vampiro ignora todas as penalidades de visão decorrentes da escuridão, incluindo sombras sobrenaturais ordinárias.",
  },
  {
    amalgam: "Presença 1",
    cost: "Gratuito",
    description:
      "Os olhos do vampiro assumem a forma dos de uma serpente, hipnotizando quem cruza seu olhar e deixando a vítima paralisada enquanto o contato visual durar.",
    duration: "Enquanto o contato visual for mantido",
    level: 1,
    name: "Olhos da Serpente",
    rouse: false,
    system:
      "Não exige teste. Mortais que encontram o olhar do vampiro ficam imobilizados até ele desviar os olhos ou a vítima ser ferida. Vampiros e outros seres sobrenaturais podem se libertar gastando 1 ponto de Força de Vontade.",
  },
  {
    cost: "Gratuito",
    description:
      "Ao alterar momentaneamente a densidade de sua forma morta, o vampiro pode cair de alturas absurdas sem sofrer qualquer dano, pousando no solo suavemente como uma folha ou pena.",
    dicePool: "Raciocínio + Sobrevivência",
    duration: "Passiva",
    level: 1,
    name: "Peso Pena",
    rouse: false,
    system:
      "Se o vampiro tiver tempo para se preparar para a queda, não requer teste. Como reação súbita a uma queda inesperada, faça um teste de Raciocínio + Sobrevivência (Dificuldade 3) para desacelerar a descida.",
  },
  {
    cost: "Uma checagem de sangue",
    description:
      "O vampiro projeta suas armas naturais a proporções monstruosas: unhas que se estendem em garras recurvadas e afiadas como navalhas, ou presas que se alongam em presas de serpente gigantesca.",
    duration: "Uma cena",
    level: 2,
    name: "Armas Ferais",
    rouse: true,
    system:
      "O vampiro adiciona +2 de modificador ao dano de seus ataques desarmados (Briga) e inflige dano Agravado de Vitalidade em mortais e seres sobrenaturais.",
  },
  {
    cost: "Uma checagem de sangue",
    description:
      "Tornando-se um com o solo, o vampiro afunda na terra virgem, repousando protegido de todos os perigos e da luz do sol até a noite seguinte.",
    duration: "Um dia ou até acordar",
    level: 3,
    name: "Fusão com a Terra",
    rouse: true,
    system:
      "Não exige teste, mas o vampiro deve repousar sobre uma superfície natural de terra, grama ou rochas virgens. O vampiro fica totalmente selado dentro da terra, seguro contra o sol e detecção mundana.",
  },
  {
    cost: "Uma checagem de sangue",
    description:
      "O vampiro pode transformar seu corpo na forma de um animal predador de tamanho similar ao seu, tipicamente um lobo selvagem ou grande felino.",
    duration: "Uma cena ou até retornar voluntariamente",
    level: 3,
    name: "Mudança de Forma",
    rouse: true,
    system:
      "A transformação leva um turno. Na forma de lobo, ganha sentidos aprimorados, velocidade extra e armas naturais que causam dano Agravado de Briga.",
  },
  {
    cost: "Uma checagem de sangue",
    description:
      "Este poder concede uma forma animal adicional ao vampiro, desta vez muito menor que sua forma original, como um morcego, rato, corvo ou serpente venenosa.",
    duration: "Uma cena ou até retornar voluntariamente",
    level: 4,
    name: "Metamorfose",
    prerequisite: "Mudança de Forma",
    rouse: true,
    system:
      "Funciona como Metamorfose. Permite assumir a forma de criaturas pequenas como morcegos (capazes de voar) ou ratos (capazes de infiltrar-se em tubulações e frestas estreitas).",
  },
  {
    cost: "De uma a três checagens de sangue",
    description:
      "O vampiro alcança o lendário poder de dissolver seu corpo sólido em uma densa névoa sobrenatural, imune a danos físicos e capaz de esgueirar-se por frestas e fechaduras.",
    duration: "Uma cena",
    level: 5,
    name: "Forma de Névoa",
    rouse: true,
    system:
      "A transformação leva três turnos (ou menos se gastar mais checagens de sangue). Na forma de névoa, o usuário é imune a armas físicas comuns, exceto fogo e luz solar, e pode passar por tubulações e rachaduras.",
  },
  {
    cost: "Gratuito",
    description:
      "O vampiro ganha controle absoluto sobre a anatomia de seu cadáver imortal, sendo capaz de deslocar seu coração para qualquer parte do corpo ou desfazer a paralisia de uma estaca de madeira.",
    duration: "Passiva",
    level: 5,
    name: "Coração Vagante",
    rouse: false,
    system:
      "Aumenta a Dificuldade de qualquer tentativa de empalar o vampiro com uma estaca no coração em +3. Se empalado, pode gastar uma checagem de sangue para expelir a estaca e desfazer a paralisia.",
  },
  // Guia do Jogador
  {
    amalgam: "Dominação 2",
    cost: "Uma checagem de sangue",
    description:
      "Raro fora do clã Tzimisce, o poder permite ao vampiro exigir obediência da própria carne: pele, músculos e ossos podem ser esculpidos ou deformados, com resultados às vezes belos e, com a mesma frequência, monstruosos.",
    dicePool: "Determinação + Proteanismo",
    duration: "Permanente",
    level: 2,
    name: "Vicissitude",
    rouse: true,
    system:
      "Cada sucesso permite uma mudança, mas o total de mudanças não pode exceder o nível de Proteanismo. Cada mudança custa 1 ponto de Atributo Físico (nenhum abaixo de 1) e cada uso leva um turno. Redistribuição: +1 em um Atributo Físico (máximo 5); anote os valores originais para o custo de XP. Armas (só uma vez): esporas ósseas ou porretes de cartilagem que valem uma arma leve perfurante ou de impacto (+2 de dano, mundano). Armadura: 1 ponto de Atributo vira 2 de armadura (máximo 6). Aparência: leva uma cena e exige Destreza + Ofícios (Dificuldade 3 para esconder a identidade, 4 para melhorar a Aparência, cada nível contando como uma mudança, e 5 para imitar alguém); falha total reduz a Aparência em um nível. Nosferatu só podem esconder a identidade. Outras mudanças ficam a critério do Narrador. As mudanças são reparadas como dano Agravado, um nível por mudança, devolvendo os pontos de Atributo.",
  },
  {
    amalgam: "Dominação 2",
    cost: "Uma checagem de sangue",
    description:
      "O vampiro aplica seu domínio sobre a carne ao corpo de outras pessoas. Temido com razão pelas torturas de seus usuários, também é usado para melhorar e adaptar servos e aliados.",
    dicePool: "Determinação + Proteanismo vs. Vigor + Determinação",
    duration: "Permanente",
    level: 3,
    name: "Moldar a Carne",
    prerequisite: "Vicissitude",
    rouse: true,
    system:
      "O sujeito precisa estar disposto ou contido, e o usuário precisa trabalhar sem ser perturbado. Num sujeito disposto, siga o sistema de Vicissitude; um relutante resiste com Vigor + Determinação, e a margem conta como sucessos de Vicissitude. Cada uso leva uma cena. O total de mudanças não pode exceder o Proteanismo do usuário (com vários usuários, conta o maior). As mudanças são reparadas como dano Agravado, um nível por mudança; mortais precisam de cirurgia extensa.",
  },
  {
    amalgam: "Dominação 2",
    cost: "Uma checagem de sangue",
    description:
      "O vampiro assume uma forma verdadeiramente monstruosa, com garras cruéis, presas salientes e músculos tensos: uma visão da Besta feita carne, que costuma ter sempre a mesma aparência individual.",
    duration: "Uma cena, a menos que encerrada antes",
    level: 4,
    name: "Forma Horrível",
    prerequisite: "Vicissitude",
    rouse: true,
    system:
      "Leva um turno para ativar, durante o qual o vampiro só pode se defender. Concede mudanças de Vicissitude gratuitas (sem perder Atributos) iguais ao nível de Proteanismo, gastas em Redistribuição, Armas e Armadura; o Narrador pode permitir outras, como membranas para planar ou membros alongados. Com a Besta tão perto da superfície, todo crítico conta como crítico confuso e testes de frenesi têm +2 de Dificuldade. O vampiro fica inconfundivelmente desumano e só se comunica com grunhidos, silvos e rugidos.",
  },
  {
    amalgam: "Animalismo 2",
    cost: "Duas checagens de sangue",
    description:
      "O vampiro estende o domínio da própria forma ao seu domínio: afunda em qualquer superfície e mantém consciência sobrenatural do que acontece ao redor.",
    duration: "Um dia ou mais, ou até ser perturbado fisicamente",
    level: 5,
    name: "Um com a Terra",
    prerequisite: "Fusão com a Terra",
    rouse: true,
    system:
      'Como Fusão com a Terra (Vampiro: A Máscara, p. 270), mas sem restrição de superfície: paredes de uma mansão, tábuas de uma ocupação, uma piscina rasa de "água morta". Num raio de cerca de 1 km, o vampiro pode experimentar qualquer estímulo sensorial através dos animais presentes, por menores que sejam; eventos discretos ou ocultos exigem Raciocínio + Animalismo contra a parada relevante do oponente. Sair antes do anoitecer seguinte exige Determinação + Proteanismo (Dificuldade 4) e pode levar até uma hora; uma vitória crítica permite sair na hora.',
  },
];

const BLOOD_SORCERY_POWERS: readonly PowerTemplate[] = [
  {
    cost: "Uma checagem de sangue",
    description:
      "Alterando as propriedades químicas e místicas de seu próprio Sangue, o vampiro o torna um ácido avassaladoramente corrosivo para matérias inanimadas e metais.",
    duration: "Instantânea",
    level: 1,
    name: "Vitae Corrosivo",
    rouse: true,
    system:
      "O Sangue expelido pelo vampiro corrói metais, madeira e plásticos, destruindo fechaduras, algemas, correntes e grades em poucos segundos. Se cuspido em combate, causa dano Agravado a equipamentos.",
  },
  {
    cost: "Gratuito",
    description:
      "Ao provar uma única gota do sangue de um indivíduo, o feiticeiro discerne instantaneamente a espécie da criatura, sua ressonância, geração e intensidade de poder sobrenatural.",
    dicePool: "Determinação + Feitiçaria de Sangue",
    duration: "Instantânea",
    level: 1,
    name: "Um Gosto Por Sangue",
    rouse: false,
    system:
      "Role Determinação + Feitiçaria de Sangue (Dificuldade 3). Cada ponto de margem revela detalhes sobre o dono do sangue: se é mortal, carniçal ou vampiro, sua Geração aproximada, Potência de Sangue e estado de saúde.",
  },
  {
    cost: "Uma checagem de sangue",
    description:
      "O feiticeiro pode resfriar e anular o poder nutriente do sangue no interior de outro vampiro, acelerando a queima de sua Fome interior.",
    dicePool: "Inteligência + Feitiçaria de Sangue vs. Vigor + Determinação",
    duration: "Instantânea",
    level: 2,
    name: "Extinguir Vitae",
    rouse: true,
    system:
      "Dispute Inteligência + Feitiçaria de Sangue vs. Vigor + Determinação. Em uma vitória, o vampiro alvo tem 1 ponto de sua Fome aumentado (máximo de 5) como se seu sangue tivesse sido consumido.",
  },
  {
    cost: "Uma checagem de sangue",
    description:
      "O vampiro pode concentrar misticamente sua própria Vitae, elevando temporariamente sua Potência de Sangue acima de seus limites habituais.",
    dicePool: "Determinação + Feitiçaria de Sangue",
    duration: "Uma cena",
    level: 3,
    name: "Sangue Potente",
    rouse: true,
    system:
      "Role Determinação + Feitiçaria de Sangue contra Dificuldade 3. Uma vitória aumenta a Potência de Sangue do vampiro em 1 ponto pela duração de uma cena.",
  },
  {
    cost: "Uma checagem de sangue",
    description:
      "O usuário transmuta sua Vitae em um veneno paralisante e virulento, capaz de revestir armas brancas ou ser expelido pelo toque para minar o vigor de suas vítimas.",
    dicePool: "Força + Feitiçaria de Sangue vs. Vigor + Determinação",
    duration: "Uma cena",
    level: 3,
    name: "Picada do Escorpião",
    rouse: true,
    system:
      "Reveste uma arma com sangue venenoso. Em um acerto que cause dano de Vitalidade, a vítima sofre dano Superficial adicional de Vitalidade igual aos sucessos do feiticeiro no teste.",
  },
  {
    cost: "Uma checagem de sangue",
    description:
      "Através de artes ocultas tenebrosas, o vampiro abre feridas invisíveis em uma vítima à distância, fazendo com que uma torrente carmesim de sangue flutue no ar diretamente para sua boca sedenta.",
    dicePool: "Raciocínio + Feitiçaria de Sangue vs. Vigor + Sobrevivência",
    duration: "Instantânea",
    level: 4,
    name: "Roubo de Vitae",
    rouse: true,
    system:
      "Dispute Raciocínio + Feitiçaria de Sangue vs. Vigor + Sobrevivência contra um alvo a até 15 metros. Cada ponto de margem drena sangue do alvo, saciando a Fome do usuário sem exigir contato físico.",
  },
  {
    cost: "Uma checagem de sangue",
    description:
      "O vampiro transforma seu Sangue em um veneno corrosivo lendário, letal para mortais e devastador para carcaças mortas-vivas de vampiros.",
    duration: "Uma cena",
    level: 5,
    name: "Carícia de Baal",
    rouse: true,
    system:
      "O Sangue reveste uma arma branca ou as presas do feiticeiro. Todos os ataques bem-sucedidos desferidos com a arma envenenada causam dano Agravado em vampiros e mortais.",
  },
  {
    cost: "Uma checagem de sangue e uma Força de Vontade",
    description:
      "Com um simples toque e uma palavra amaldiçoada, o feiticeiro ferve a Vitae no interior das veias de sua vítima até o ponto de ebulição, dilacerando-a de dentro para fora.",
    dicePool: "Determinação + Feitiçaria de Sangue vs. Autocontrole + Vigor",
    duration: "Instantânea",
    level: 5,
    name: "Caldeirão de Sangue",
    rouse: true,
    system:
      "Dispute Determinação + Feitiçaria de Sangue vs. Autocontrole + Vigor após tocar a vítima. Cada ponto de margem inflige dano Agravado direto no alvo e faz seu sangue ferver em agonia atroz.",
  },
  // Poderes do Guia do Jogador
  {
    cost: "Uma checagem de sangue",
    description:
      "O feiticeiro solta filetes do próprio Sangue para buscar informações sobre um assunto, lavando textos e volumes em minutos. O objeto investigado fica com uma mancha de sangue reveladora.",
    dicePool: "Inteligência + Feitiçaria de Sangue",
    duration:
      "Uma noite, ou até achar a informação ou a busca se esgotar, o que vier primeiro",
    level: 2,
    name: "Vasculhar Segredos",
    rouse: true,
    system:
      "A Dificuldade é definida pelo Narrador: de 2 (uma carta num escritório comum) a 5 (informações criptografadas numa vasta biblioteca), maior se a informação foi oculta de forma sobrenatural. Um cômodo leva minutos; uma biblioteca, horas ou a noite inteira. Não traduz idiomas desconhecidos nem cifras; formatos não escritos (pintura, música, disquetes) ficam a critério do Narrador, com Dificuldade maior.",
  },
  {
    cost: "Uma ou mais checagens de sangue",
    description:
      "A vitae do vampiro forma uma camada trêmula de Sangue que se move sozinha para interceptar e capturar projéteis.",
    duration: "Uma cena, ou até a proteção se esgotar",
    level: 4,
    name: "Égide de Sangue",
    rouse: true,
    system:
      "Para cada checagem de sangue gasta, a barreira reduz em 5 o dano de ataques à distância. É automático: a vitae intercepta cada projétil e se refaz enquanto o poder durar. Esgotada a proteção, o Sangue fica inerte, espalhado pela área.",
  },
  // Rituais
  {
    cost: "Uma checagem de sangue",
    description:
      "Este ritual expande a percepção do sangue, traçando a árvore genealógica espiritual do indivíduo até seus progenitores mais antigos.",
    duration: "Uma noite",
    ingredients: "100 ml de sangue do sujeito em um recipiente de prata pura",
    level: 1,
    name: "Caminho do Sangue",
    process:
      "O feiticeiro derrama seu próprio Sangue no recipiente, misturando as amostras e entoando cânticos ancestrais enquanto queima incenso de sândalo.",
    rouse: true,
    system:
      "Permite discernir a linhagem completa do indivíduo: seu senhor, o senhor de seu senhor e toda a árvore genealógica de sangue até os fundadores míticos.",
  },
  {
    cost: "Uma checagem de sangue",
    description:
      "Permite ao taumaturgo escalar superfícies verticais e tetos com a mesma facilidade e aderência de uma aranha ou inseto rastejante.",
    duration: "Uma cena",
    ingredients: "Uma aranha viva ou besouro esmagado e misturado ao Sangue",
    level: 1,
    name: "Aderência do Inseto",
    process:
      "O conjurador espalha a mistura de sangue e inseto nas palmas das mãos e solas dos pés enquanto entoa as palavras de ligação.",
    rouse: true,
    system:
      "O feiticeiro ganha a capacidade de escalar paredes e tetos como um inseto durante uma cena inteira sem precisar de testes de equilíbrio.",
  },
  {
    cost: "Uma checagem de sangue",
    description:
      "Cria um talismã sintonizado com o Sangue do vampiro, permitindo que ele sinta intuitivamente a direção e proximidade da pedra onde quer que ela esteja.",
    duration: "Permanente até ser destruída",
    ingredients: "Um seixo polido e Sangue do conjurador",
    level: 1,
    name: "Criar Pedra de Sangue",
    process:
      "A pedra é banhada na Vitae fervente por uma hora sob encantamentos arcanos.",
    rouse: true,
    system:
      "A pedra fica sintonizada com o conjurador, permitindo-lhe sempre saber a direção e distância exatas onde ela se encontra.",
  },
  {
    cost: "Uma checagem de sangue",
    description:
      "Protege o vampiro contra a letargia mortal durante as horas do dia, acordando-o instantaneamente caso seu refúgio seja ameaçado.",
    duration: "Um dia",
    ingredients: "Pena de coruja ou cinzas de ervas noturnas",
    level: 1,
    name: "Despertar com o Frescor Noturno",
    process:
      "O feiticeiro desenha um círculo de cinzas ao redor de seu leito antes de dormir.",
    rouse: true,
    system:
      "Permite ao vampiro acordar instantaneamente em plena vigília ao primeiro sinal de perigo diurno ou invasão, agindo sem as penalidades habituais de vigília diurna.",
  },
  {
    cost: "Uma checagem de sangue",
    description:
      "Inscreve uma runa protetora em um objeto ou passagem que causa queimaduras místicas em carniçais que tentarem transpô-la.",
    duration: "Permanente até ser ativada",
    ingredients: "Pó de osso humano e Sangue do conjurador",
    level: 1,
    name: "Proteção contra Carniçais",
    process:
      "O símbolo protetor é pintado na entrada ou objeto com a tinta de ossos e sangue.",
    rouse: true,
    system:
      "Qualquer carniçal que toque o objeto ou tente atravessar a barreira sofre dano Superficial e é repelido por uma força mística intransponível.",
  },
  {
    cost: "Uma checagem de sangue",
    description:
      "Abre um elo mental entre o conjurador e seu senhor através do Laço de Sangue primordial que os conecta.",
    duration: "Uma conversa",
    ingredients:
      "Um espelho de água e uma mecha de cabelo ou gota de sangue do senhor",
    level: 2,
    name: "Comunicação com o Senhor do Membro",
    process:
      "O vampiro medita diante da água sob a luz da lua, chamando mentalmente o senhor.",
    rouse: true,
    system:
      "Abre um canal telepático claro e audível com o senhor do conjurador, permitindo conversação mística independentemente da distância geográfica.",
  },
  {
    cost: "Uma checagem de sangue",
    description:
      "Concede ao feiticeiro a capacidade de compreender, ler e falar qualquer idioma mortal ao consumir a língua de uma criatura.",
    duration: "Uma noite",
    ingredients:
      "Língua de um pássaro canoro ou papiro antigo empapado em sangue",
    level: 2,
    name: "Olhos de Babel",
    process:
      "O feiticeiro engole a língua ou queima o papiro inalando a fumaça.",
    rouse: true,
    system:
      "Permite ao feiticeiro ler, escrever e falar perfeitamente qualquer idioma desconhecido durante a noite.",
  },
  {
    cost: "Uma checagem de sangue",
    description:
      "Faz o rastro de uma vítima brilhar em luminescência visível apenas para o feiticeiro, facilitando sua perseguição implacável.",
    duration: "Uma cena",
    ingredients:
      "Um fio de cabelo ou pertence pessoal da presa e uma vela branca",
    level: 2,
    name: "Iluminar o Rastro da Presa",
    process:
      "A vela é acesa com o pertence e o sangue do feiticeiro pingado no pavio.",
    rouse: true,
    system:
      "O rastro deixado pela presa brilha no chão com uma luminescência visível apenas para o feiticeiro, facilitando o rastreamento através de qualquer labirinto urbano.",
  },
  {
    cost: "Uma checagem de sangue",
    description:
      "Obriga uma pessoa que provar da poção consagrada a dizer a verdade pura sob interrogatório místico.",
    duration: "Uma cena",
    ingredients: "Gota de sangue do interrogado e cinzas de espinheiro",
    level: 2,
    name: "Verdade do Sangue",
    process:
      "O sangue do interrogado é misturado em vinho ou água e consagrado.",
    rouse: true,
    system:
      "O alvo não consegue mentir deliberadamente diante do feiticeiro durante o interrogatório enquanto o ritual estiver ativo.",
  },
  {
    cost: "Uma checagem de sangue",
    description:
      "Cria uma barreira defensiva que impede a intrusão de fantasmas, espectros e entidades astrais desencarnadas.",
    duration: "Permanente até ser ativada",
    ingredients: "Pó de prata pura misturado com o Sangue do conjurador",
    level: 2,
    name: "Proteção contra Espíritos",
    process: "Desenha-se o símbolo protetor com uma adaga de ferro consagrada.",
    rouse: true,
    system:
      "Impede a passagem de fantasmas, espectros e espíritos desincorporados, causando-lhes dor intolerável ao tentar tocar o local protegido.",
  },
  {
    cost: "Uma checagem de sangue",
    description:
      "Versão ampliada da Proteção contra Carniçais: traça um círculo místico ao redor do conjurador que carniçais não conseguem atravessar.",
    duration: "Até o amanhecer ou até o conjurador deixar o círculo",
    ingredients: "Pó de osso humano e Sangue do conjurador",
    level: 2,
    name: "Círculo de Proteção contra Carniçais",
    process:
      "O feiticeiro caminha em círculo derramando a mistura de ossos e sangue, fechando o perímetro ao redor de si e de seus aliados.",
    rouse: true,
    system:
      "Qualquer carniçal que tente cruzar o círculo sofre dano Superficial e é repelido; o raio é de alguns metros, suficiente para proteger o conjurador e quem estiver com ele.",
  },
  {
    cost: "Uma checagem de sangue",
    description:
      "Ruptura mística terrível: o feiticeiro ferve e coagula o sangue no interior dos pulmões e coração de um inimigo à distância.",
    duration: "Instantânea",
    ingredients:
      "Adaga cerimonial de ouro e lascas de madeira banhadas em sangue",
    level: 3,
    name: "Chamado de Dagon",
    process:
      "O conjurador profere a invocação profana enquanto crava a adaga em uma efígie da vítima.",
    rouse: true,
    system:
      "A vítima (que já tenha provado da Vitae do conjurador) tem os vasos sanguíneos rompidos de dentro para fora, sofrendo dano Agravado letal à distância.",
  },
  {
    cost: "Uma checagem de sangue",
    description:
      "Encantamento protetor que envolve o coração do vampiro, repelindo e estilhaçando a primeira estaca de madeira cravada contra ele.",
    duration: "Até ser descarregado ou amanhecer",
    ingredients:
      "Uma lasca de carvalho envolta em seda vermelha e mergulhada no Sangue",
    level: 3,
    name: "Deflexão da Ruína de Madeira",
    process: "A seda é amarrada próxima ao coração do vampiro.",
    rouse: true,
    system:
      "A primeira estaca de madeira que atingiria o coração do vampiro em combate se estilhaça e se desfaz em pó no momento do impacto.",
  },
  {
    cost: "Uma checagem de sangue",
    description:
      "O feiticeiro destila a sutileza do éter, tornando seu corpo leve como pluma para planar pelas correntes de ar da noite.",
    duration: "Uma cena",
    ingredients:
      "Folhas secas de beladona e Sangue do conjurador reduzidos em braseiro",
    level: 3,
    name: "Essência do Ar",
    process: "A poção é preparada em fogo brando e inalada.",
    rouse: true,
    system:
      "O corpo do feiticeiro torna-se tão leve quanto uma brisa, permitindo-lhe levitar e planar lentamente pelo ar durante uma cena.",
  },
  {
    cost: "Uma checagem de sangue",
    description:
      "Ritual ancestral de purificação e resguardo que torna a carne do vampiro invulnerável às queimaduras de chamas mundanas.",
    duration: "Uma cena",
    ingredients:
      "A ponta de um dedo do conjurador cortada e queimada em cálice de ouro com Sangue",
    level: 3,
    name: "Andarilho do Fogo",
    process:
      "O feiticeiro consome as cinzas do próprio dedo em comunhão com o fogo.",
    rouse: true,
    system:
      "O vampiro e seus companheiros selecionados ganham imunidade temporária às queimaduras de chamas mundanas durante uma cena.",
  },
  {
    cost: "Uma checagem de sangue",
    description:
      "Inscrição rúnica potente projetada especificamente para repelir lobisomens e criaturas metamorfas selvagens.",
    duration: "Permanente até ser ativada",
    ingredients:
      "Prata moída e sangue de lobo misturados ao Sangue do feiticeiro",
    level: 3,
    name: "Proteção contra Lupinos",
    process: "O glifo de proteção é traçado com uma lâmina de prata virgem.",
    rouse: true,
    system:
      "Lobisomens que tocarem o objeto ou barreira sofrem dano Agravado terrível e não conseguem cruzar o perímetro.",
  },
  {
    cost: "Uma checagem de sangue",
    description:
      "Versão ampliada da Proteção contra Espíritos: traça um círculo místico ao redor do conjurador que fantasmas e espíritos não conseguem atravessar.",
    duration: "Até o amanhecer ou até o conjurador deixar o círculo",
    ingredients: "Pó de prata pura misturado com o Sangue do conjurador",
    level: 3,
    name: "Círculo de Proteção contra Espíritos",
    process:
      "O feiticeiro caminha em círculo derramando a mistura de prata e sangue com uma adaga de ferro consagrada, fechando o perímetro ao redor de si e de seus aliados.",
    rouse: true,
    system:
      "Fantasmas, espectros e espíritos desincorporados não conseguem cruzar o círculo e sofrem dor intolerável ao tentar; o raio é de alguns metros, suficiente para proteger o conjurador e quem estiver com ele.",
  },
  {
    cost: "Uma checagem de sangue",
    description:
      "Ergue um manto impenetrável de trevas místicas sobre as janelas e paredes do refúgio, protegendo-o completamente dos raios solares.",
    duration: "Um dia inteiro",
    ingredients: "Nada além do Sangue do conjurador",
    level: 4,
    name: "Defesa do Refúgio Sagrado",
    process:
      "O conjurador traça sigilos nas janelas e paredes do refúgio por várias horas antes do amanhecer.",
    rouse: true,
    system:
      "A escuridão mística envolve completamente o refúgio, bloqueando a luz solar destrutiva e mantendo o interior seguro mesmo durante o dia.",
  },
  {
    cost: "Uma checagem de sangue",
    description:
      "Sintoniza a visão do feiticeiro com os olhos de uma ave de rapina, enxergando toda a cidade lá de cima com clareza cristalina.",
    duration: "Uma noite",
    ingredients:
      "Os olhos de uma ave de rapina noturna alimentada com a Vitae do feiticeiro",
    level: 4,
    name: "Olhos do Falcão Noturno",
    process:
      "O conjurador entra em transe profundo sintonizando sua visão com a ave.",
    rouse: true,
    system:
      "Permite ao vampiro enxergar através dos olhos da ave enquanto ela sobrevoa a cidade, cobrindo quilômetros de observação aérea.",
  },
  {
    cost: "Uma checagem de sangue",
    description:
      "O feiticeiro torna-se translúcido e imaterial, podendo atravessar portas de cofre, concreto armado e paredes sólidas.",
    duration: "Uma cena",
    ingredients: "Um espelho de corpo inteiro e o Sangue do conjurador",
    level: 4,
    name: "Passagem Incorpórea",
    process:
      "O conjurador quebra o espelho consagrado e passa através dos estilhaços.",
    rouse: true,
    system:
      "O vampiro torna-se imaterial por uma cena, sendo capaz de atravessar paredes sólidas e portas trancadas sem ser tocado.",
  },
  {
    cost: "Uma checagem de sangue",
    description:
      "Poderosa runa ancestral que queima com fúria cósmica qualquer outro vampiro que tente violar o refúgio protegido.",
    duration: "Permanente até ser ativada",
    ingredients: "Cinzas mornas de fogueira e Sangue de um vampiro ancião",
    level: 4,
    name: "Proteção contra Cainitas",
    process:
      "O símbolo é desenhado com uma faca de ferro mergulhada em sal e Sangue.",
    rouse: true,
    system:
      "Impede a passagem de outros vampiros; qualquer cainita que tocar a barreira sofre queimaduras imediatas de dano Agravado.",
  },
  {
    cost: "Uma checagem de sangue",
    description:
      "Versão ampliada da Proteção contra Lupinos: traça um círculo místico ao redor do conjurador que lobisomens não conseguem atravessar.",
    duration: "Até o amanhecer ou até o conjurador deixar o círculo",
    ingredients:
      "Prata moída e sangue de lobo misturados ao Sangue do feiticeiro",
    level: 4,
    name: "Círculo de Proteção contra Lupinos",
    process:
      "O feiticeiro caminha em círculo derramando a mistura com uma lâmina de prata virgem, fechando o perímetro ao redor de si e de seus aliados.",
    rouse: true,
    system:
      "Lobisomens e metamorfos que tentem cruzar o círculo sofrem dano Agravado e são repelidos; o raio é de alguns metros, suficiente para proteger o conjurador e quem estiver com ele.",
  },
  {
    cost: "Duas checagens de sangue",
    description:
      "Prepara dois portais místicos distantes que permitem ao taumaturgo teleportar-se instantaneamente para seu santuário em caso de perigo mortal.",
    duration: "Permanente até ser utilizado",
    ingredients:
      "Dois círculos de um metro de diâmetro queimados no solo com fogo e Sangue",
    level: 5,
    name: "Fuga para o Verdadeiro Santuário",
    process:
      "Um círculo é preparado no santuário principal e outro no local de fuga.",
    rouse: true,
    system:
      "Ao pisar no círculo ritual de partida, o conjurador é teleportado instantaneamente através do éter para o círculo de chegada em seu santuário.",
  },
  {
    cost: "Duas checagens de sangue",
    description:
      "Transmuta o coração do vampiro em rocha sólida, tornando-o imune a estacas de madeira e insensível a apelos e manipulações emocionais.",
    duration: "Enquanto desejado",
    ingredients:
      "Uma laje de pedra e uma vela de cera banhada no Sangue do conjurador",
    level: 5,
    name: "Coração de Pedra",
    process:
      "O feiticeiro deita-se na laje e deixa a vela queimar sobre seu peito.",
    rouse: true,
    system:
      "O coração do vampiro transmuta-se literalmente em rocha sólida, tornando-o completamente imune a ser empalado por estacas e resistente a manipulações emocionais.",
  },
  {
    cost: "Duas checagens de sangue",
    description:
      "Encanta uma estaca de madeira mística que, ao perfurar uma vítima, se fragmenta e viaja internamente até despedaçar o coração do alvo.",
    duration: "Permanente até ser disparada",
    ingredients:
      "Uma estaca entalhada em madeira de tramazeira gravada com runas proibidas",
    level: 5,
    name: "Fuste de Extinção Tardia",
    process:
      "A estaca é embebida com 2 checagens de sangue sob ritos necromânticos.",
    rouse: true,
    system:
      "Se cravada em uma vítima, a estaca se fragmenta em lascas microscópicas que viajam pelas veias do alvo até perfurar o coração de forma irreversível e fatal.",
  },
  {
    cost: "Duas checagens de sangue",
    description:
      "Versão ampliada da Proteção contra Cainitas: traça um círculo místico ao redor do conjurador que outros vampiros não conseguem atravessar.",
    duration: "Até o amanhecer ou até o conjurador deixar o círculo",
    ingredients: "Cinzas mornas de fogueira e Sangue de um vampiro ancião",
    level: 5,
    name: "Círculo de Proteção contra Cainitas",
    process:
      "O feiticeiro caminha em círculo derramando cinzas, sal e sangue com uma faca de ferro, fechando o perímetro ao redor de si e de seus aliados.",
    rouse: true,
    system:
      "Qualquer cainita que tente cruzar o círculo sofre dano Agravado e é repelido; o raio é de alguns metros, suficiente para proteger o conjurador e quem estiver com ele.",
  },
  // Rituais do Guia do Jogador
  {
    cost: "Uma checagem de sangue",
    description:
      "Ritual que apaga brevemente o medo vampírico natural do fogo.",
    duration: "Uma noite",
    ingredients: "Um objeto sagrado, como um crucifixo, a Bíblia ou o Alcorão",
    level: 1,
    name: "Apagar o Medo",
    process:
      "O vampiro expõe o símbolo sagrado a uma chama; basta ele ser tocado pelo fogo.",
    rouse: true,
    system:
      "Um teste de Ritual bem-sucedido dá +2 dados em todos os testes para resistir ao Rötschreck. Numa vitória crítica, o personagem não precisa fazer testes de frenesi de terror.",
  },
  {
    cost: "Uma checagem de sangue",
    description:
      "Tatuagens, cicatrizes e outras alterações na carne do vampiro somem durante o sono diurno; este Ritual torna uma marca permanente.",
    duration: "Permanente",
    ingredients:
      "Prata derretida derramada sobre uma tatuagem, marca ou outra modificação corporal",
    level: 1,
    name: "Selar a Marca",
    process:
      "O conjurador derrama a prata derretida sobre a modificação do alvo; depois de reparado o dano, ela permanece.",
    rouse: true,
    system:
      "Um Ritual bem-sucedido torna a modificação parte permanente do corpo imortal do alvo, impossível de remover por outros meios. A prata causa 1 de dano Superficial, reparável normalmente.",
  },
  {
    cost: "Uma checagem de sangue",
    description:
      "O feiticeiro converte uma dose da própria vitae num narcótico ativado pelo toque, que deixa a vítima desinibida e vulnerável a Presença e Dominação, além de manipulação, coerção ou interrogatório mundanos.",
    duration: "Uma cena",
    ingredients:
      "Uma pequena quantidade de haxixe ou outra substância entorpecente",
    level: 1,
    name: "Toque Soporífico",
    process:
      "A substância é misturada ao Sangue do usuário e esfregada entre os dedos enquanto o encantamento é lido ou sussurrado; o preparo leva poucos minutos.",
    rouse: true,
    system:
      "Faça o teste de Ritual contra Vigor + Determinação do alvo quando ele tocar a vitae. Pelo resto da cena, a vítima sofre penalidade igual à margem em todas as paradas de resistência com Autocontrole ou Determinação (uma vez só, se a parada tiver ambos). A vitae mantém a potência até ser tocada ou a cena acabar.",
  },
  {
    cost: "Uma checagem de sangue",
    description:
      "O vampiro caminha silenciosamente sobre qualquer corpo d'água, como se não tivesse peso, com névoa subindo de seus passos.",
    duration: "Uma noite",
    ingredients: "Um pedaço de madeira de um navio e água",
    level: 2,
    name: "Como Névoa na Água",
    process:
      "O vampiro submerge a madeira na água que quer atravessar enquanto derrama seu Sangue nela.",
    rouse: true,
    system:
      "Após um teste de Ritual bem-sucedido, pode andar sobre a água pelo resto da noite. Pode encerrar o efeito quando quiser, mas precisa refazer o Ritual para andar sobre a água de novo.",
  },
  {
    cost: "Uma checagem de sangue",
    description:
      "O feiticeiro transforma um objeto comum num receptáculo capaz de armazenar quantidades surpreendentes de seu Sangue para uso posterior.",
    duration: "Até o Sangue ser liberado",
    ingredients:
      "Um objeto que caiba na mão do conjurador e o Sangue do usuário",
    level: 3,
    name: "Cálice Secreto",
    process:
      "O usuário encharca o objeto com seu Sangue e recita o Ritual; o objeto absorve o Sangue. O processo leva uma hora.",
    rouse: true,
    system:
      "Com um teste de Ritual bem-sucedido, o objeto guarda Sangue do conjurador, liberado com uma palavra de comando. A cada duas checagens de sangue feitas ao armazenar, o Sangue guardado sacia 1 de Fome. O Sangue de uma única checagem serve de dose para um carniçal ou de requisito de outro Ritual.",
  },
  {
    cost: "Uma checagem de sangue",
    description:
      "O vampiro faz o sangue da vítima arder como fogo nas veias, com dor intensa. Diferente de Caldeirão de Sangue, funciona à distância e serve mais para incapacitar do que para matar.",
    duration: "Uma cena",
    ingredients:
      "Uma amostra do sangue do alvo, uma representação visual dele (foto, pintura, vídeo) e uma vela de cera vermelha ou um isqueiro de ferro",
    level: 3,
    name: "Fogo no Sangue",
    process:
      "O vampiro se concentra na imagem do alvo (ou no próprio alvo) e queima a amostra de sangue sobre a chama; o sangue da vítima esquenta nas veias quase na hora.",
    rouse: true,
    system:
      "Teste de Ritual contra Determinação + Ocultismo do alvo (ou Determinação + Fortitude, se ele tiver a Disciplina). Cada ponto de margem causa 1 de dano Superficial de Vitalidade, e a dor impõe -2 dados nas paradas Físicas pelo resto da cena (-3 numa vitória crítica). Um Membro atingido faz uma checagem de sangue. Cada vítima só é afetada uma vez por noite.",
  },
  {
    cost: "Uma checagem de sangue",
    description:
      "O Membro afetado não consegue beber sangue por uma noite: ele vira cinzas em sua boca.",
    duration: "Uma noite",
    ingredients:
      "Um pergaminho com o nome do alvo, queimado, e as cinzas desse pergaminho",
    level: 4,
    name: "Banquete de Cinzas",
    process:
      "O conjurador escreve o nome do alvo no pergaminho, queima-o e usa as cinzas misturadas a seu Sangue para escrever os sigilos do Ritual.",
    rouse: true,
    system:
      "Teste de Ritual contra Determinação + Força de Vontade do alvo. Numa vitória, o alvo vomita qualquer sangue por uma noite, como se fosse comida mortal. Só cinzas saciam sua Fome, e não abaixo de 3; poucas vítimas pensam em comê-las sem saber do feitiço.",
  },
  {
    cost: "Uma checagem de sangue",
    description:
      "O vampiro se liga a uma arma favorita, que nunca enferruja nem perde o fio enquanto estiver com ele. Se outro a tomar, ela envelhece rápido, como um carniçal privado de vitae; se ainda for utilizável, pode ferir gravemente o dono original.",
    duration: "Permanente",
    ingredients:
      "Uma arma corpo a corpo e vitae do conjurador suficiente para submergi-la",
    level: 4,
    name: "Um com a Lâmina",
    process:
      "O vampiro submerge a arma na própria vitae e jura dedicar sua não-vida a ela; a arma fica submersa sem interrupção até o nascer do sol seguinte.",
    rouse: true,
    system:
      "Numa vitória, a arma fica dedicada ao usuário e intacta, salvo dano intencional fora da posse dele. Ungida de novo com o Sangue do usuário (um turno e uma checagem de sangue), ganha +2 dados em combate por uma cena. Usada contra o dono original, causa dano Agravado, mas sem dados adicionais. Só uma arma dedicada por vez; para dedicar outra, a anterior precisa ser destruída.",
  },
  {
    cost: "Uma checagem de sangue",
    description:
      "Bebendo o Sangue de um Membro disposto, o vampiro revive memórias do doador, guiado por ele, podendo lembrar de épocas anteriores ao próprio nascimento e desbloquear poderes, Méritos e outras dádivas do Sangue do doador.",
    duration: "Até o fim da sessão",
    ingredients:
      "A vitae de outro vampiro, alecrim seco e papoulas frescas ou miosótis",
    level: 4,
    name: "Memória Guiada",
    process:
      "O feiticeiro queima as flores e o alecrim, mistura as cinzas à vitae doada e bebe o Sangue.",
    rouse: true,
    system:
      "Segue as regras de Memoriam (Vampiro: A Máscara, p. 312), mas o doador faz a checagem de sangue e acompanha a cena como guia; a bebida conta sempre como gole profundo. O objetivo pode ser um Memoriam comum ou um poder de nível 1 ou Mérito de 1 ponto, um poder de nível 2 ou Mérito de 2, ou um poder de nível 3 ou Mérito de 3. O poder não conta no limite da Disciplina, exige o nível nela e não serve de pré-requisito; Méritos não podem ser divididos nem somados a existentes. O Narrador decide a dádiva. Penalidades: cena durante ou após a vida mortal do viajante, -1 dado; menos de um século antes, -2; um ou dois séculos antes, -4; três ou mais, -6. As dádivas duram até o fim da sessão (ou da seguinte, se o Memoriam acontecer no fim dela).",
  },
  {
    cost: "Uma checagem de sangue",
    description:
      "O feiticeiro prende o alvo em correntes invisíveis, confinando-o num único lugar.",
    duration: "Uma hora por sucesso na margem",
    ingredients: "Um elo de corrente",
    level: 4,
    name: "Correntes Invisíveis de Aprisionamento",
    process:
      "O feiticeiro inscreve sigilos no elo com o próprio Sangue, o que leva uma hora; depois pode guardá-lo e lançá-lo aos pés de um alvo.",
    rouse: true,
    system:
      "Ao lançar o elo, faça o teste de Ritual contra Força + Determinação do alvo. Ele não sai do lugar por uma hora por sucesso na margem, enquanto o elo estiver intacto e a até três metros dele, e sofre -4 dados em defesas físicas e em ações de Briga e Armas Brancas. O elo vira pó no fim do efeito.",
  },
  {
    cost: "Uma checagem de sangue",
    description:
      "O conjurador manifesta chamas nos braços, protegido por uma camada encantada de vitae, e pode incendiar objetos e pessoas.",
    duration: "Uma cena",
    ingredients:
      "Vitae (de qualquer vampiro) suficiente para cobrir os braços até os cotovelos e uma fonte de chama, como um isqueiro",
    level: 5,
    name: "Antebrachia Ignium",
    process:
      "O vampiro mergulha os braços no sangue resistindo à vontade de se alimentar; depois, exposta às chamas, a vitae que o reveste pega fogo em vez dele.",
    rouse: true,
    system:
      "Com Fome 4 ou mais, teste frenesi de fome (Dificuldade 3) para não beber os ingredientes. A qualquer momento da noite, o conjurador expõe a vitae ao fogo e faz o teste de Ritual; qualquer sucesso acende os braços e provoca teste de frenesi de terror (Dificuldade 2) nos outros vampiros próximos. Toques com Destreza + Briga causam 2 de dano Agravado de Vitalidade; num agarrão, as roupas pegam fogo e o dano continua até um teste de Autocontrole + Sobrevivência (Dificuldade 3). Só os braços resistem ao fogo. As chamas apagam quando o conjurador quiser ou no fim da cena.",
  },
  {
    cost: "Uma a cinco checagens de sangue, conforme o tamanho do prédio",
    description:
      "O feiticeiro se torna soberano dos poderes sobrenaturais em seu domínio, impedindo que outros usem a maioria das habilidades vampíricas.",
    duration: "Indefinida",
    ingredients: "Selos de ferro embutidos em todas as portas do prédio",
    level: 5,
    name: "Domínio",
    process:
      "O ritual leva três horas: o conjurador embute selos de ferro em cada porta, consagra-os com a própria vitae e grava sigilos nelas.",
    rouse: true,
    system:
      "Após um teste de Ritual bem-sucedido, ninguém além do feiticeiro consegue usar Animalismo, Auspícios, Dominação ou Presença no prédio, embora as checagens de sangue desses usos ainda aconteçam. O custo vai de uma checagem de sangue para um apartamento a cinco para uma mansão. Dura indefinidamente, até pelo menos um selo ser destruído.",
  },
];

const OBLIVION_POWERS: readonly PowerTemplate[] = [
  // Guia do Jogador
  {
    cost: "Uma checagem de sangue",
    description:
      "O vampiro destrói um cadáver, fresco ou antigo, introduzindo sua vitae no corpo. Não funciona em vampiros, mas pode funcionar em cadáveres animados, a critério do Narrador.",
    dicePool: "Vigor + Oblívio vs. Vigor + Medicina ou Fortitude",
    duration: "Variável",
    level: 1,
    name: "Cinzas às Cinzas",
    rouse: true,
    system:
      "Um cadáver comum se desintegra ao longo de três turnos, sem teste. Um cadáver animado resiste com Vigor (ou Vigor + Fortitude); numa vitória do usuário, ele se dissolve em cinco turnos menos a margem (mínimo um), sofrendo Debilitação física enquanto isso. Numa vitória crítica, desintegra na hora; numa falha total, fica imune a este poder de qualquer usuário.",
  },
  {
    cost: "Gratuito",
    description:
      "O vampiro identifica objetos, lugares ou pessoas importantes para fantasmas. Esses grilhões prendem os mortos à existência e emanam auras que vão de vitalidade dourada a decomposição ou odores marcantes para o espectro, como pão fresco, gasolina ou cigarro. Conhecer o grilhão ajuda o necromante a manipular o fantasma.",
    dicePool: "Raciocínio + Oblívio",
    duration: "Uma cena",
    level: 1,
    name: "Grilhão de Ligação",
    rouse: false,
    system:
      "Ao ativar, os sentidos do usuário se sintonizam com a energia dos grilhões, e ele os identifica pela visão, pelo olfato e por outros sentidos. Enquanto ativo, a distração impõe -2 em testes de Destreza e Raciocínio.",
  },
  {
    cost: "Gratuito",
    description:
      "Os olhos do vampiro ficam negros: ele enxerga na escuridão total e percebe fantasmas que não estejam se escondendo.",
    duration: "Uma cena",
    level: 1,
    name: "Visão do Oblívio",
    rouse: false,
    system:
      "Ignora todas as penalidades de pouca luz, inclusive sobrenaturais (ainda precisa dos olhos, e vendas funcionam). Fantasmas presentes que não estejam furtivos ou usando poderes para se ocultar ficam visíveis, com a aparência que escolherem. Não permite contato físico com fantasmas, e os olhos negros impõem -2 dados em interações sociais com mortais.",
  },
  {
    cost: "Gratuito",
    description:
      "Aplicando sutilmente o Oblívio às sombras ao redor, o usuário mascara a aparência ou parece mais sinistro e ameaçador.",
    duration: "Passiva",
    level: 1,
    name: "Manto de Sombra",
    rouse: false,
    system:
      "+2 dados em testes de Furtividade e em testes de Intimidação contra mortais.",
  },
  {
    amalgam: "Potência 2",
    cost: "Uma checagem de sangue",
    description:
      "Extensões de sombra brotam de pontos escuros na linha de visão, deslizam por paredes e pisos e convergem sobre as vítimas para prendê-las ou sufocá-las.",
    dicePool: "Raciocínio + Oblívio",
    duration: "Uma cena ou até serem encerrados ou destruídos",
    level: 2,
    name: "Braços de Ahriman",
    rouse: true,
    system:
      "O usuário gasta um turno para convocar os braços; nos turnos seguintes, faz ataques de concussão ou agarrão à distância com Raciocínio + Oblívio, causando dano Superficial e somando metade da Potência (arredondada para cima) ao dano. Pode dividir a parada para atacar vários alvos. Enquanto ativo, só controla as sombras, que também fazem ações simples (abrir portas, puxar alavancas). Os braços alcançam, em metros, o dobro do Oblívio, movendo-se por superfícies. Só luz forte os bane, mas Raciocínio + Oblívio (Dificuldade 3) os deixa evitar a luz por um turno.",
  },
  {
    amalgam: "Auspícios 2",
    cost: "Uma checagem de sangue",
    description:
      "O vampiro prende fios invisíveis de entropia a um mortal, aumentando a chance de ele se ferir ou morrer em uma noite e um dia. Parece uma maldição, mas o vampiro não pode interferir com o condenado, ou o efeito se quebra.",
    dicePool: "Determinação + Oblívio vs. Raciocínio + Ocultismo",
    duration: "Uma noite e um dia (24 horas)",
    level: 2,
    name: "Previsão Fatal",
    rouse: true,
    system:
      'Cada sucesso na margem causa 1 de dano Agravado em algum momento das próximas 24 horas, de doença súbita a acidentes estranhos. O vampiro não pode interagir com a vítima, direta ou indiretamente (mandar lacaios "apressar" o resultado conta). O uso é invisível, mas um observador pode sentir algo errado com Raciocínio + Ocultismo (Dificuldade 3). Só afeta mortais, inclusive carniçais.',
  },
  {
    cost: "Uma checagem de sangue",
    description:
      "O vampiro projeta do próprio corpo uma sombra sobrenatural, da qual manifesta outros poderes independentemente da iluminação. Ela costuma imitar o usuário, mas pode ficar distorcida ou monstruosa conforme o humor dele.",
    duration: "Uma cena",
    level: 2,
    name: "Sombra Projetada",
    rouse: true,
    system:
      "A sombra só é removida pela luz direta do sol. Quem vê o usuário percebe a sombra sem fonte de luz com Raciocínio + Percepção (Dificuldade 3). O vampiro pode alongá-la ou distorcê-la (sem separá-la), e às vezes ela age por conta própria; para outros poderes, como Perspectiva da Sombra, ela alcança o dobro do Oblívio em metros. Quem estiver ao alcance da sombra sofre +1 de dano de Força de Vontade em conflitos sociais (depois de dividir o dano Superficial).",
  },
  {
    cost: "Uma checagem de sangue",
    description:
      "O vampiro sente onde o véu entre vivos e mortos é mais fraco, sem saber por quê. Onde o véu é tênue, a saúde mortal sofre e o Oblívio fica mais fácil.",
    dicePool: "Inteligência + Oblívio",
    duration: "Um turno",
    level: 2,
    name: "Onde o Véu se Afina",
    rouse: true,
    system:
      "Teste Inteligência + Oblívio (Dificuldade 3): uma vitória revela a densidade do véu numa área do tamanho de um prédio. Numa vitória crítica, revela também se a densidade mudou recentemente; numa falha total, dá uma leitura falsa. Densidades: Impenetrável (espectros não cruzam), Espesso (sem efeito), Fino (-1 de Dificuldade em Cerimônias), Desfiado (-2), Ausente (-2; aparições passam livremente, e mortais sofrem 2 de dano Superficial que não cura até saírem). Sem este poder, o usuário não se beneficia do véu fino.",
  },
  {
    cost: "Uma checagem de sangue",
    description:
      "O vampiro faz plantas murcharem, animais e pessoas adoecerem e comida estragar ao redor, acelerando a erosão da vida. Não acelera a decomposição de coisas mortas.",
    dicePool: "Vigor + Oblívio vs. Vigor + Medicina ou Fortitude",
    duration: "Uma cena",
    level: 3,
    name: "Aura de Decadência",
    rouse: true,
    system:
      "Após vencer Vigor + Oblívio (Dificuldade 3), a matéria não inteligente num raio de cinco metros se degrada: plantas morrem, comida apodrece, tijolos esfarelam. Comida e bebida afetadas causam 2 de dano Superficial de Vitalidade por cena a quem as ingerir, até tratamento com Inteligência + Medicina (Dificuldade 3). Seres vivos na aura resistem com Vigor + Medicina; cada ponto de margem do vampiro causa 1 de dano Superficial de Vitalidade (dividido), aplicado ao longo da cena e só uma vez por cena. Um odor podre impõe -2 dados nos testes Sociais do vampiro.",
  },
  {
    amalgam: "Fortitude 2",
    cost: "Gratuito",
    description:
      "O vampiro se sustenta das paixões das aparições em vez de sangue, podendo passar longos períodos nas terras dos mortos ou atormentar um espírito.",
    dicePool: "Determinação + Oblívio vs. Determinação + Autocontrole",
    duration: "Passiva",
    level: 3,
    name: "Banquete de Paixões",
    rouse: false,
    system:
      "A até três metros de uma aparição, o vampiro disputa Determinação + Oblívio contra Determinação + Autocontrole dela. Numa vitória, a aparição sofre 1 de dano Agravado de Força de Vontade e a Fome do vampiro cai em 1. Pode render Máculas, a critério do Narrador. O Narrador define quantas paixões a aparição tem (cinco ou mais é raro); sem nenhuma, ela pode virar um espectro assassino.",
  },
  {
    cost: "Uma checagem de sangue",
    description:
      "Com um toque, o vampiro envelhece catastroficamente parte do corpo da vítima: murcha um membro, esmaga uma garganta ou cega um par de olhos.",
    duration: "Um turno",
    level: 3,
    name: "Toque do Oblívio",
    rouse: true,
    system:
      "O vampiro agarra a vítima (Força + Briga, se ela tentar evitá-lo). A vítima sofre 2 de dano Agravado e uma lesão incapacitante (Vampiro: A Máscara, p. 303): um membro aleijado, mudez, surdez ou cegueira. Mortais precisam de longa reabilitação; vampiros curam como dano Agravado. Pode render Máculas, a critério do Narrador.",
  },
  {
    cost: "Uma checagem de sangue",
    description:
      "O vampiro projeta os sentidos em qualquer sombra na linha de visão, inclusive a própria (via Sombra Projetada), vendo e ouvindo como se estivesse escondido nela.",
    duration: "Até uma cena",
    level: 3,
    name: "Perspectiva da Sombra",
    rouse: true,
    system:
      "A presença dos sentidos na sombra só é detectável por meios sobrenaturais (como Sentir o Invisível). O vampiro percebe tanto o próprio entorno quanto o da sombra, como se olhasse por uma tela.",
  },
  {
    amalgam: "Auspícios 1",
    cost: "Uma checagem de sangue",
    description:
      "O vampiro dá vida independente a parte de sua sombra para espionar ou enervar inimigos.",
    duration: "Uma cena",
    level: 3,
    name: "Servo da Sombra",
    rouse: true,
    system:
      "O servo não tem mente própria e segue comandos mentais. Viaja em velocidade de corrida, passa sob portas, escala paredes e atravessa frestas, mas não resiste a áreas bem iluminadas. Pode se agarrar a veículos, e seu alcance é o quanto percorre numa noite. Vê e ouve tudo e repassa ao ser reabsorvido. Só luz forte o bane, mas Raciocínio + Oblívio (Dificuldade 3) o deixa evitar a luz por um turno.",
  },
  {
    cost: "Uma checagem de sangue",
    description:
      "Pelo toque, o vampiro envenena o sangue de um mortal com uma doença devastadora, que pode ficar contagiosa. Necromantes com formação médica chegam a imitar doenças específicas, até algumas tidas como extintas.",
    dicePool: "Inteligência + Oblívio vs. Vigor ou Vigor + Fortitude",
    duration: "Um turno para ativar; a doença dura cenas iguais ao Oblívio",
    level: 4,
    name: "Praga Necrótica",
    rouse: true,
    system:
      "Vítimas frágeis (bebês, idosos, doentes, ou com 3 ou menos caixas de Vitalidade livres) são infectadas automaticamente; as saudáveis resistem com Vigor (ou Vigor + Fortitude). A vítima sofre 1 de dano Agravado de Vitalidade no início de cada cena, por cenas iguais ao Oblívio do usuário. A medicina não trata a doença, mas a vitae cura. Numa vitória crítica, a doença pode ser transmissível pelo toque, durando um turno a menos em cada novo infectado. Rende Máculas, a critério do Narrador.",
  },
  {
    cost: "Uma checagem de sangue",
    description:
      "As sombras se espalham e cobrem a área com uma camada de escuridão que abafa os sons. Quem está dentro luta para ver e ouvir, e os mortais são sufocados.",
    duration: "Uma cena",
    level: 4,
    name: "Mortalha Estígia",
    rouse: true,
    system:
      "O usuário gasta um turno espalhando a sombra num círculo de raio igual ao dobro do Oblívio em metros, centrado nele ou num ponto à vista. Todos exceto o usuário sofrem -3 dados em todos os testes, a menos que enxerguem através de escuridão sobrenatural. Mortais sofrem 1 de dano Superficial por turno dentro dela.",
  },
  {
    cost: "Uma checagem de sangue",
    description:
      "Entrando numa sombra, o usuário some e reaparece da mesma ou de outra sombra mais distante. Lasombra e Hecata discutem se ele atravessa o Labirinto ou só sua superfície, mas o dano espiritual sugere que toca algo sujo.",
    duration: "Um turno",
    level: 5,
    name: "Passo de Sombra",
    rouse: true,
    system:
      "O vampiro entra numa sombra grande o bastante para cobri-lo e sai de outra um turno depois. A sombra de destino precisa estar à vista ou ser percebida por meios místicos, como Perspectiva da Sombra. Pode levar alguém; se a pessoa não quiser, precisa estar agarrada. Se o uso render uma Mácula, o passageiro também recebe uma.",
  },
  {
    cost: "Duas checagens de sangue",
    description:
      "O vampiro reintroduz doenças em quem se recuperou delas, quebra ossos há muito curados e revoga a imunidade de um carniçal ao envelhecimento, sem precisar contatar a vítima. Não funciona em vampiros.",
    dicePool: "Vigor + Oblívio vs. Vigor × 2 ou Vigor + Fortitude",
    duration: "Variável, conforme a condição seja tratável",
    level: 5,
    name: "Skuld Cumprido",
    rouse: true,
    system:
      "O vampiro cobre as palmas e o rosto com vitae lembrando o rosto do alvo. Numa vitória, o alvo volta a sofrer uma condição grave da qual já se recuperou (câncer tratado, osso quebrado, uma doença, inclusive a de Praga Necrótica), com efeitos debilitantes imediatos, a critério do Narrador. Um carniçal perde a imunidade ao envelhecimento e toda a vitae do organismo, o que pode matá-lo ou desintegrá-lo. Numa vitória crítica, o usuário pode parar o coração da vítima. Numa falha total, não pode mais usar o poder contra ela.",
  },
  {
    cost: "Duas checagens de sangue",
    description:
      "O vampiro transforma a própria substância em sombra, uma mancha bidimensional de escuridão que desliza por qualquer superfície e por frestas minúsculas.",
    duration: "Uma cena ou até encerrar",
    level: 5,
    name: "Avatar Tenebroso",
    rouse: true,
    system:
      "A transformação leva um turno, sem outras ações. Depois, move-se em passo de caminhada pelo chão ou pelas paredes, detido só por barreiras herméticas. Pode envolver vítimas: elas perdem três dados em todas as paradas, e mortais sufocam como na Mortalha Estígia; envolvendo um mortal, pode se alimentar sem usar as presas. Não sofre dano de fontes físicas, mas fogo e sol o ferem normalmente. Disciplinas mentais ainda podem ser usadas, a critério do Narrador.",
  },
  // Cerimônias do Guia do Jogador
  {
    cost: "Uma checagem de sangue",
    description:
      "Cerimônia que levanta um ou mais cadáveres para realizar tarefas simples, únicas ou repetitivas.",
    dicePool: "Determinação + Oblívio",
    duration: "Até o cadáver ser destruído ou concluir a tarefa",
    ingredients:
      "Um corpo humano (ou vários) e uma pequena mistura de sangue, catarro e bile",
    level: 1,
    name: "O Dom da Falsa Vida",
    prerequisite: "Cinzas às Cinzas",
    process:
      "O vampiro aplica a mistura nos cadáveres e realiza a Cerimônia; os corpos ganham uma falsa vida.",
    rouse: true,
    system:
      'Dificuldade 2. Numa vitória, levanta cadáveres iguais ao Oblívio ou aos corpos preparados, o que for menor; uma vitória crítica dobra o Oblívio para essa conta. Cada um segue um único comando simples ("varrer o chão", "manter esta porta fechada"); comandos condicionais ou complexos não funcionam, mas o usuário pode apontar um alvo para ataque. Não se defendem e apodrecem normalmente. Cadáver sem mente: Físico 2, Social 0, Mental 0; Vitalidade 4, Força de Vontade 0; Intimidação 4; imune ao sol, não cura e perde 1 de Vitalidade por dia; Dificuldades Gerais 2/1.',
  },
  {
    cost: "Uma checagem de sangue",
    description:
      "Cerimônia que convoca um espírito do Submundo. A aparição sente o chamado e viaja até o conjurador, o que pode levar noites; se o véu for fino no local, ela é puxada através dele. Não tem obrigação de servir e pode ser hostil se sentir o grilhão ameaçado, ou grata pela companhia.",
    dicePool: "Determinação + Oblívio",
    duration: "Uma cena",
    ingredients:
      "Um grilhão da aparição, uma foto ou representação dela (ou seu nome assinado) e a vitae do conjurador",
    level: 1,
    name: "Invocar Espírito",
    prerequisite: "Grilhão de Ligação",
    process:
      "O necromante derrama sua vitae sobre o grilhão e, estudando a imagem ou a assinatura, chama o nome da aparição.",
    rouse: true,
    system:
      "Dificuldade 2. Não funciona onde o véu é impenetrável, e a aparição perde a passagem se o grilhão deixar o local. Ela surge como sombra nas paredes, uma silhueta trêmula da qual saem vozes, fala as línguas que falava em vida e some no fim da cena, a menos que outra Cerimônia a obrigue ou prenda.",
  },
  {
    cost: "Uma checagem de sangue",
    description:
      "Cerimônia que cria servos e espiões a partir de partes do corpo, como mãos ou crânios, ou de pequenos animais mortos, como ratos ou raposas.",
    dicePool: "Determinação + Oblívio",
    duration: "Noites iguais aos sucessos",
    ingredients:
      "A parte do corpo ou a carcaça do animal, a arma usada para cortá-la ou matá-lo, e uma pequena mistura de urina, fezes e sêmen",
    level: 2,
    name: "Despertar o Servo Homuncular",
    prerequisite: "Onde o Véu se Afina",
    process:
      "O conjurador reveste uma lâmina com o coquetel de fluidos, separa a parte do corpo ou mata o pequeno animal (no máximo do tamanho de um cachorro pequeno, e que não voe) e massageia vitae no alvo.",
    rouse: true,
    system:
      "Dificuldade 3. Numa vitória, ganha um servo homuncular leal que espiona, segue ou intimida. Fica inerte a mais de 100 metros do vampiro e dura noites iguais aos sucessos; uma vitória crítica o mantém ativo para sempre, e uma falha total destrói os componentes. Escala, pula e se esconde bem, e transmite telepaticamente uma imagem, cheiro ou som por cena. Servo homuncular: Físico 1, Social 0, Mental 1; Vitalidade 3, Força de Vontade 1; Atletismo 4, Furtividade 6, Intimidação 4; imune ao sol, não cura e não pode ser dominado; Dificuldades Gerais 3/1.",
  },
  {
    cost: "Uma checagem de sangue",
    description:
      "Cerimônia que dobra uma aparição à vontade do vampiro numa disputa de vontades.",
    dicePool: "Determinação + Oblívio",
    duration: "Até o fim da crônica ou até cumprir as ordens",
    ingredients:
      "O grilhão de uma aparição, a vitae do conjurador e um item (ou ameaça) capaz de danificar o grilhão",
    level: 2,
    name: "Compelir Espírito",
    prerequisite: "Onde o Véu se Afina",
    process:
      "Perto da aparição (normalmente via Invocar Espírito), o necromante lança um punhado de vitae nela enquanto ameaça o grilhão com faca, martelo, arma ou fogo, ou com palavras em que o fantasma acredite.",
    rouse: true,
    system:
      "Teste de Cerimônia contra Determinação + Autocontrole da aparição; sem ameaça física ao grilhão, também Manipulação + Intimidação (Dificuldade igual à mesma parada). Vencendo ambos, o vampiro comanda tarefas moderadas (espionar, pesquisar, responder com sinceridade) iguais aos sucessos, ou uma tarefa difícil a cada dois; numa vitória crítica, qualquer ação. A aparição serve até o fim da crônica ou das ordens e depois odeia o necromante para sempre. Se a aparição vencer, o vampiro sofre a margem em dano Superficial de Vitalidade e ela volta ao Submundo. Atacar a aparição quebra a compulsão; ferir o grilhão ameaçado causa a ela 1 a 3 de dano Agravado de Força de Vontade e a manda de volta ao Submundo.",
  },
  {
    cost: "Uma checagem de sangue",
    description:
      "Cerimônia em que o vampiro abre o corpo para ser possuído por uma aparição, ganhando físico aprimorado, as memórias que ela quiser compartilhar e seus conselhos. A aparição pode tomar controle total, o que alguns necromantes veem como bênção e outros como o maior motivo para não usar o poder.",
    dicePool: "Determinação + Oblívio",
    duration: "Cenas iguais aos sucessos",
    ingredients:
      "Um tributo à aparição, um inseto parasita e dois dentes arrancados da boca do vampiro",
    level: 3,
    name: "Espírito Hospedeiro",
    prerequisite: "Aura de Decadência",
    process:
      "Perto da aparição (normalmente via Invocar Espírito), o necromante oferece o tributo (álcool no túmulo, moedas enterradas, a cabeça de um inimigo dela), arranca dois dentes, morde o parasita com os restantes e abre a boca para o espectro entrar.",
    rouse: true,
    system:
      "Dificuldade 4. Se a aparição aceitar, habita o corpo por cenas iguais aos sucessos. O vampiro ganha +2 dados em todos os testes e +2 de Vitalidade e ouve os conselhos dela. A aparição pode tentar tomar o controle; o vampiro resiste com Determinação + Autocontrole. No controle por uma noite, ela subjuga a Besta e demonstra destreza e conhecimentos que o vampiro não tem, mas não pode torná-lo autodestrutivo.",
  },
  {
    cost: "Uma checagem de sangue",
    description:
      "Cerimônia que levanta mortos-vivos agressivos, capazes de cumprir ordens complexas. Sem comando, atacam qualquer um ao redor, exceto o mestre.",
    dicePool: "Determinação + Oblívio",
    duration: "Até a morte final ou até serem destruídos",
    ingredients:
      "Cadáveres (um por morto animado) e um mortal vivo para o sacrifício",
    level: 3,
    name: "Hordas Cambaleantes",
    prerequisite: "Aura de Decadência",
    process:
      "O vampiro prepara os cadáveres, mata o sacrifício e derrama o sangue dele sobre os corpos para animá-los.",
    rouse: true,
    system:
      'Pelo sangue derramado, o conjurador testa frenesi de fome (Dificuldade 2), e o assassinato pode render Máculas. Dificuldade 4. Numa vitória, os cadáveres preparados se animam, não apodrecem e obedecem até a morte final ou serem destruídos, aceitando ordens como "mate quem entrar" ou "aterrorize aquela vizinhança". Como vantagem temporária (Vampiro: A Máscara, p. 180), mantê-los além da história exige XP em Lacaios (1 ponto por cadáver). Cadáver agressivo: Físico 4, Social 0, Mental 0; Vitalidade 6, Força de Vontade 0; Briga 6, Intimidação 5; imune ao sol e não cura; a mordida causa +2, Agravado contra mortais; Dificuldades Gerais 3/2.',
  },
  {
    cost: "Uma checagem de sangue",
    description:
      "Cerimônia que acorrenta aparições a lugares e pessoas específicos, muitas vezes para defender refúgios ou assombrar inimigos.",
    dicePool: "Determinação + Oblívio",
    duration: "Indefinida",
    ingredients:
      "O grilhão de uma aparição, o sacrifício de um mortal inocente e sal suficiente para cercar uma propriedade ou pessoa; para prender a uma pessoa, algo do corpo dela (unhas, cabelo, sangue ou pele)",
    level: 4,
    name: "Prender o Espírito",
    prerequisite: "Praga Necrótica",
    process:
      "Com uma aparição já sob Compelir Espírito, o vampiro mata um inocente no local ou perto da pessoa a assombrar, mistura a vitae com sal, pinta um círculo ao redor do alvo e deixa o grilhão no local ou com a pessoa.",
    rouse: true,
    system:
      "O assassinato pode render Máculas. Dificuldade 5, e o teste não é resistido. A aparição fica presa sem limite de duração; o que ela sente intensamente afeta os ocupantes ou a pessoa, que sofrem -2 dados para resistir a agir ou sentir como ela. Tem os poderes de um espectro (Vampiro: A Máscara, p. 377). O vínculo termina se o vampiro cancelar a Cerimônia, o grilhão sair do local ou da posse do alvo, a aparição for destruída ou o necromante atacá-la.",
  },
  {
    cost: "Uma checagem de sangue",
    description:
      "Cerimônia que abre um rasgo no véu por onde aparições passam para assombrar lugares e pessoas, entregar-se às paixões e possuir mortais. Algumas ficam gratas; outras gostam de torturar os responsáveis.",
    dicePool: "Determinação + Oblívio",
    duration: "O resto da sessão ou da noite",
    ingredients:
      "Uma lâmina que já tirou uma vida, giz ou carvão, um sacrifício humano e um lençol de seda",
    level: 4,
    name: "Rasgar o Véu",
    prerequisite: "Praga Necrótica",
    process:
      "O vampiro pendura o lençol de seda numa parede onde o véu é padrão, fino ou desfiado, sacrifica um humano contra ele e corta o lençol com a lâmina, abrindo um portal entre os mundos.",
    rouse: true,
    system:
      "O sacrifício pode render Máculas, e o conjurador testa frenesi (Dificuldade 2) pelo sangue derramado. Dificuldade 5. Cada sucesso reduz a densidade do véu em um nível, até Ausente. Com o véu reduzido, aparições entram no mundo físico pelo resto da sessão (ou da noite); depois a densidade volta a subir e o portal se fecha.",
  },
  {
    cost: "Uma checagem de sangue",
    description:
      "Cerimônia que traz de volta à vida um corpo recém-morto, ocupado por uma aparição, embora nenhum parente ou amigo reconheça quem volta.",
    dicePool: "Determinação + Oblívio",
    duration: "Indefinida",
    ingredients:
      "Um sacrifício mortal, o coração de outro mamífero, incenso e prata em pó",
    level: 5,
    name: "Bênção Lazarena",
    prerequisite: "Skuld Cumprido",
    process:
      "O necromante queima incenso, arranca e queima o coração da vítima, põe no lugar o de outro mamífero (sem precisar costurá-lo), derrama prata em pó sobre os olhos abertos do morto e convida uma aparição a tomá-lo como hospedeiro.",
    rouse: true,
    system:
      "Matar para a Cerimônia pode render Máculas (e o coração substituto também, se veio de um assassinato). Dificuldade 6. Numa vitória, a aparição, que precisa estar presente no sacrifício, ocupa o corpo como se fosse seu. Ele acorda com os ferimentos que o mataram, cura 1 de Vitalidade na hora e o resto com o tempo, como um vampiro. Mantém os Atributos Físicos, as Disciplinas (se era carniçal) e as Vantagens do corpo; Atributos Sociais e Mentais, Habilidades e moralidade são da aparição. A possessão dura até o corpo morrer de novo ou a aparição ser exorcizada.",
  },
];

export const POWERS: Readonly<Record<string, readonly PowerTemplate[]>> = {
  "Alquimia de Sangue Fino": ALCHEMY_POWERS,
  "Alquimia de Sangue-fraco": ALCHEMY_POWERS,
  "Alquimia de Sangue-ralo": ALCHEMY_POWERS,
  Animalismo: ANIMALISM_POWERS,
  Auspícios: AUSPEX_POWERS,
  Celeridade: CELERITY_POWERS,
  Dominação: DOMINATE_POWERS,
  Domínio: DOMINATE_POWERS,
  "Feitiçaria de Sangue": BLOOD_SORCERY_POWERS,
  Fortitude: FORTITUDE_POWERS,
  Oblívio: OBLIVION_POWERS,
  Ofuscação: OBFUSCATE_POWERS,
  Potência: POTENCE_POWERS,
  Presença: PRESENCE_POWERS,
  Protean: PROTEAN_POWERS,
  Proteanismo: PROTEAN_POWERS,
};

// Inclui os nomes do catálogo de Oblívio anterior ao Guia do Jogador (Necrose, Túnel de Sombras…).
export const POWER_ALIASES: Readonly<Record<string, string>> = {
  "Desfazer a Fera": "Expulsar a Besta",
  "Expelir a Fera": "Expulsar a Besta",
  Fascinação: "Fascínio",
  "Força Prodigiosa": "Salto Elevado",
  "Ligar Famulus": "Famulus Enlaçado",
  "Ligação com o Familiar": "Famulus Enlaçado",
  Necrose: "Praga Necrótica",
  "Passo Tenebroso": "Avatar Tenebroso",
  "Salto Prodigioso": "Salto Elevado",
  "Sombra do Aniquilador": "Perspectiva da Sombra",
  "Sombra Palpável": "Manto de Sombra",
  "Sussurro Ferino": "Sussurros Selvagens",
  "Toque Letal": "Corpo Letal",
  "Túnel de Sombras": "Passo de Sombra",
  "Vista Cadavérica": "Visão do Oblívio",
};

export function findPower(
  disc: string | undefined,
  name: string | undefined
): PowerTemplate | undefined {
  if (!name) {
    return undefined;
  }
  const trimmed = name.trim();
  const lower = trimmed.toLowerCase();
  if (disc) {
    const canonical = canonicalDiscipline(disc);
    const list = POWERS[canonical] ?? POWERS[disc.trim()] ?? [];
    const hit = list.find((p) => p.name.toLowerCase() === lower);
    if (hit) {
      return hit;
    }
  }
  for (const list of Object.values(POWERS)) {
    const hit = list.find((p) => p.name.toLowerCase() === lower);
    if (hit) {
      return hit;
    }
  }
  const aliasedName = POWER_ALIASES[trimmed] ?? POWER_ALIASES[lower];
  if (aliasedName) {
    return findPower(disc, aliasedName);
  }
  return undefined;
}
