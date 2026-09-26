// Portado de design/reference/logic.js e atualizado com base no livro oficial V5 (disciplines and powers.pdf).
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
  Dominação: "Dominação",
  Domínio: "Dominação",
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
    cost: "Um Rouse Check",
    description: "Fórmula que simula temporariamente um poder de sangue puro.",
    duration: "Uma cena",
    level: 1,
    name: "Desperta o Sangue Adormecido",
    rouse: true,
  },
  {
    cost: "Um Teste de Rouse",
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
    cost: "Um Teste de Rouse",
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
    cost: "Um Teste de Rouse",
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
    cost: "Um Teste de Rouse",
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
    cost: "Um Rouse Check",
    description:
      "Faz o vampiro parecer e reagir temporariamente como um mortal ou como um vampiro de sangue mais potente, enganando exames e toques espirituais.",
    duration: "Uma cena",
    level: 3,
    name: "Sangue Falso",
    rouse: true,
  },
  {
    cost: "Um Teste de Rouse",
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
    cost: "Três Testes de Rouse",
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
];

const ANIMALISM_POWERS: readonly PowerTemplate[] = [
  {
    cost: "Gratuito (exige 3 noites com Teste de Rouse)",
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
    cost: "Gratuito (exige 3 noites com Teste de Rouse)",
    description:
      "Ao criar um Laço de Sangue com um animal, o vampiro pode torná-lo um famulus, formando um elo mental com ele e facilitando o uso de outros poderes de Animalismo. Embora este poder por si só não permita comunicação bidirecional com o animal, ele pode seguir instruções verbais simples como 'fique' e 'venha aqui'. Ele ataca em defesa própria e de seu mestre, mas não pode ser persuadido a lutar contra algo que normalmente não atacaria.",
    dicePool: "Carisma + Empatia com Animais",
    duration: "Apenas a morte liberta",
    level: 1,
    name: "Ligar Famulus",
    rouse: false,
    system:
      "Sem o uso de Sussurros Ferais, dar comandos ao animal exige um teste de Carisma + Empatia com Animais (Dificuldade 2); aumente a Dificuldade para ordens mais complexas. Um vampiro pode ter apenas um famulus, mas pode obter um novo se o atual morrer. Um vampiro pode usar Sussurros Ferais (Animalismo 2) e Subjugar o Espírito (Animalismo 4) em seu famulus gratuitamente.",
  },
  {
    cost: "Gratuito",
    description:
      "O vampiro pode sentir a Fera presente em mortais, vampiros e outros seres sobrenaturais, obtendo uma percepção de sua natureza, fome e hostilidade.",
    dicePool: "Determinação + Animalismo vs. Autocontrole + Subterfúgio",
    duration: "Passiva",
    level: 1,
    name: "Sentir a Fera",
    rouse: false,
    system:
      "Role Determinação + Animalismo vs. Autocontrole + Subterfúgio. Uma vitória permite ao usuário sentir o nível de hostilidade em um alvo (se a pessoa está preparada para causar dano ou decidida a causá-lo) e determinar se ela abriga uma Fera sobrenatural, marcando-a como um vampiro ou lobisomem. Em uma vitória crítica, o usuário obtém informações sobre o tipo exato de criatura, bem como seu nível de Fome ou Fúria.",
  },
  {
    cost: "Um Teste de Rouse",
    description:
      "O vampiro pode se comunicar com as feras da natureza e da cidade. Sussurros Ferais permite comunicação bidirecional com animais. Um gato pode não estar interessado em debater filosofia, mas discute alegremente a movimentação ao redor do prédio. O vampiro pode persuadir animais a realizar favores ou convocá-los para um local.",
    dicePool: "Manipulação + Animalismo ou Carisma + Animalismo",
    duration: "Uma cena",
    level: 2,
    name: "Sussurros Ferais",
    rouse: true,
    system:
      "Comunicação simples não requer teste. Persuadir um animal a realizar um serviço exige um teste de Manipulação + Animalismo; a Dificuldade depende da tarefa exigida. Convocar animais usa um teste de Carisma + Animalismo; a Dificuldade depende da escassez dos animais convocados. O número de animais depende da margem de sucesso.",
  },
  {
    cost: "Um Teste de Rouse",
    description:
      "Manipulação + Animalismo vs. resistência do animal. Permite comunicar-se com animais e convocá-los.",
    duration: "Uma cena",
    level: 1,
    name: "Sussurro Ferino",
    rouse: true,
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
    cost: "Um Teste de Rouse",
    description:
      "Ao travar o olhar com um alvo, o vampiro acalma sua Fera interior em um sono temporário. Mortais afetados tornam-se apáticos, incapazes de realizar qualquer ação além de se manterem vivos, enquanto os impulsos bestiais dos vampiros diminuem temporariamente.",
    dicePool: "Carisma + Animalismo vs. Vigor + Determinação",
    duration: "Uma cena ou margem de turnos",
    level: 3,
    name: "Acalmar a Fera",
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
    name: "Colmeia Desalmada",
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
    cost: "Um Teste de Rouse (gratuito no famulus)",
    description:
      "O vampiro pode transferir completamente sua mente para o corpo de um animal. Ele pode controlar o animal e usar seus sentidos livremente, mesmo durante o dia, caso consiga permanecer acordado. Enquanto faz isso, o corpo do vampiro fica imóvel como se estivesse em torpor.",
    dicePool: "Manipulação + Animalismo",
    duration: "Uma cena / indefinidamente",
    level: 4,
    name: "Subjugar o Espírito",
    rouse: true,
    system:
      "Faça um teste de Manipulação + Animalismo (Dificuldade 4). Em uma vitória, o vampiro pode habitar o corpo do animal por uma cena. Em uma vitória crítica, pode habitá-lo indefinidamente. Estender a possessão durante o dia exige permanecer acordado; ver o sol exige teste de frenesi de medo, embora a luz solar não fira o animal possuído. O usuário permanece alheio ao seu corpo original, mas danos a ele interrompem o transe.",
  },
  {
    cost: "Dois Testes de Rouse",
    description:
      "O poder que o vampiro exerce sobre os animais torna-se grandioso o suficiente para comandar bandos e matilhas como se fossem extensões de seu próprio corpo. Com um gesto, dezenas ou até centenas de animais sacrificam suas vidas para satisfazer seu mestre.",
    dicePool: "Carisma + Animalismo",
    duration: "Uma cena ou até ordem cumprida",
    level: 5,
    name: "Domínio Animal",
    rouse: true,
    system:
      "Escolha um tipo de animal e faça um teste de Carisma + Animalismo com Dificuldade baseada na natureza dos animais e na ordem dada (Dificuldade 3 para dispersar corvos à procura de alguém; Dificuldade 5 para matilha de cães atacar em investida suicida contra outro vampiro). O vampiro pode ordenar que os animais retornem após completarem a tarefa.",
  },
  {
    cost: "Um Teste de Rouse",
    description:
      "O vampiro pode projetar sua Fera no momento de um frenesi de terror ou fúria, transferindo-a para um alvo próximo, seja mortal ou vampiro. Essa pessoa experimenta imediatamente o frenesi em seu lugar, entrando em fúria impiedosa ou fugindo em pavor dependendo do gatilho.",
    dicePool: "Raciocínio + Animalismo vs. Autocontrole + Determinação",
    duration: "Duração do frenesi",
    level: 5,
    name: "Expulsar a Fera",
    rouse: true,
    system:
      "Em vez do teste de Força de Vontade para resistir a frenesi de terror ou fúria, role Raciocínio + Animalismo vs. Autocontrole + Determinação do alvo. Se falhar, entra em frenesi normalmente. Em uma vitória, o alvo experimenta o frenesi em vez do usuário. Este poder não pode transferir frenesi de fome.",
  },
  {
    cost: "Um Teste de Rouse",
    description:
      "O vampiro pode projetar sua Fera no momento de um frenesi de terror ou fúria, transferindo-a para um alvo próximo, seja mortal ou vampiro. Essa pessoa experimenta imediatamente o frenesi em seu lugar.",
    dicePool: "Raciocínio + Animalismo vs. Autocontrole + Determinação",
    duration: "Duração do frenesi",
    level: 5,
    name: "Expelir a Fera",
    rouse: true,
    system:
      "Role Raciocínio + Animalismo vs. Autocontrole + Determinação do alvo. Se vencer, a vítima entra em frenesi no lugar do vampiro.",
  },
  {
    cost: "Um Teste de Rouse",
    description:
      "Ao sucumbir a um frenesi de fúria ou terror, transfere a Fera para um alvo próximo mortal ou vampiro. Se vencer, a vítima entra em frenesi no lugar do vampiro.",
    dicePool: "Raciocínio + Animalismo vs. Autocontrole + Determinação",
    duration: "Duração do frenesi",
    level: 5,
    name: "Desfazer a Fera",
    rouse: true,
    system: "Raciocínio + Animalismo vs. Autocontrole + Determinação do alvo.",
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
    cost: "Gratuito ou um Teste de Rouse",
    description:
      "O vampiro vivencia lampejos de pressentimentos premonitórios na forma de arrepios na nuca, súbitas inspirações ou visões vívidas. Embora nunca sejam inteiramente precisas, essas visões podem afastar o vampiro do perigo ou revelar uma verdade anteriormente negligenciada.",
    dicePool: "Determinação + Auspícios",
    duration: "Passiva",
    level: 2,
    name: "Premonição",
    rouse: false,
    system:
      "Sempre que o Narrador achar apropriado, este poder fornece ao personagem uma pista súbita que o ajuda de alguma forma (salvando-o de perigo iminente ou descobrindo uma pista perdida). O usuário também pode provocar ativamente uma premonição concentrando-se em um sujeito ou objeto específico e fazendo um Teste de Rouse, rolando Determinação + Auspícios contra Dificuldade 3 ou mais.",
  },
  {
    cost: "Um Teste de Rouse",
    description:
      "Ao focar em uma pessoa, o vampiro pode perceber sua aura e discernir seu humor, saúde mental, perturbações, intenções e traços sobrenaturais ocultos.",
    dicePool: "Inteligência + Auspícios vs. Autocontrole + Subterfúgio",
    duration: "Um turno ou a critério do Narrador",
    level: 3,
    name: "Sondar a Alma",
    rouse: true,
    system:
      "Faça um teste de Inteligência + Auspícios vs. Autocontrole + Subterfúgio. Em uma vitória, o Narrador responde com sinceridade a um número de perguntas igual à margem da vitória sobre a aura e psique do alvo (estado emocional, se é vampiro, lobisomem, etc., intensidade da Fome, etc.).",
  },
  {
    cost: "Um Teste de Rouse",
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
    cost: "Um Teste de Rouse",
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
    cost: "Um Teste de Rouse",
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
    cost: "Dois Testes de Rouse",
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
    cost: "Um Teste de Rouse (mais 1 Força de Vontade vs. vampiros relutantes)",
    description:
      "O usuário pode ler os pensamentos superficiais e memórias profundas de outras mentes, bem como projetar seus próprios pensamentos diretamente na mente de outros.",
    dicePool: "Determinação + Auspícios vs. Raciocínio + Subterfúgio",
    duration: "Cerca de um minuto por Teste de Rouse",
    level: 5,
    name: "Telepatia",
    rouse: true,
    system:
      "Projetar pensamentos em uma mente em linha de visão não requer rolagem de dados. Ler a mente de um mortal voluntário é gratuito e automático. Ler a mente de um mortal resistente ou de outro vampiro exige um teste de Determinação + Auspícios vs. Raciocínio + Subterfúgio. Cada margem de sucesso permite extrair fatos mais profundos e memórias ocultas.",
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
    cost: "Um Teste de Rouse",
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
    cost: "Um Teste de Rouse",
    description:
      "O vampiro aproxima-se velozmente de um adversário, engajando em combate ou escapando em um piscar de olhos. Para um observador desprevenido, ele parece teleportar, deixando para trás apenas uma rajada de vento.",
    dicePool: "Destreza + Atletismo",
    duration: "Um turno",
    level: 3,
    name: "Lampejo",
    rouse: true,
    system:
      "O vampiro se move em linha reta em direção a um alvo, cobrindo qualquer distância inferior a 50 metros e ainda tendo tempo hábil para realizar uma ação, como um ataque, durante o turno. Se o terreno for perigoso ou exigir manobras, role Destreza + Atletismo.",
  },
  {
    cost: "Um Teste de Rouse",
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
    cost: "Um Teste de Rouse",
    description:
      "O Sangue do vampiro fica saturado com a essência da Celeridade, transmitindo temporariamente parte dessa velocidade sobrenatural para qualquer um que dele beba.",
    duration: "Uma noite; para vampiros, até a próxima alimentação ou Fome 5",
    level: 4,
    name: "Gole de Elegância",
    rouse: true,
    system:
      "Beber o equivalente a um Teste de Rouse diretamente do usuário concede ao bebedor Celeridade temporária igual à metade dos pontos de Celeridade do doador (arredondado para baixo). O bebedor ganha os mesmos poderes sem amálgama do doador até esse nível.",
  },
  {
    amalgam: "Auspícios 2",
    cost: "Um Teste de Rouse",
    description:
      "Com o mundo ao seu redor congelado em câmera lenta, o vampiro pode mirar e arremessar ou disparar qualquer projétil contra um alvo como se ele estivesse perfeitamente estático.",
    duration: "Um ataque",
    level: 4,
    name: "Mira Certeira",
    rouse: true,
    system:
      "Use antes de realizar um ataque à distância. O alvo não faz rolagem de esquiva ou defesa; faça o ataque com Dificuldade 1. Um oponente com Celeridade 5 pode anular este poder fazendo seu próprio Teste de Rouse para se defender na mesma velocidade.",
  },
  {
    cost: "Um Teste de Rouse",
    description:
      "Mais rápido do que a visão humana ou vampírica pode acompanhar, o vampiro desfere um golpe desarmado ou com arma branca com tal velocidade que o oponente é incapaz de reagir ou esquivar.",
    duration: "Um ataque",
    level: 5,
    name: "Golpe Relâmpago",
    rouse: true,
    system:
      "Use antes de fazer um ataque de Briga ou Armas Brancas. O oponente não faz rolagem de esquiva ou defesa; faça o ataque com Dificuldade 1. Um oponente com Celeridade 5 pode anular este poder fazendo seu próprio Teste de Rouse para se defender na mesma velocidade.",
  },
  {
    cost: "Um Teste de Rouse",
    description:
      "O vampiro atinge o ápice da velocidade sobrenatural, reagindo instantaneamente antes que eventos ao seu redor se desenrolem. Emboscadores encontram sua presa já posicionada atrás deles, e favores são concluídos antes que o pedido termine de ser pronunciado.",
    duration: "Um turno",
    level: 5,
    name: "Fração de Segundo",
    rouse: true,
    system:
      "O jogador pode interromper e se sobrepor à narração de eventos pelo Narrador dentro da razão: passar por uma porta antes que ela feche, contornar uma emboscada assim que deflagrada, rolar para longe de uma explosão iminente, etc. Permite agir antes de todos na ordem de iniciativa.",
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
    cost: "Um Teste de Rouse",
    description:
      "O vampiro pode implantar ordens e sugestões complexas na mente de uma vítima por meio de contato visual e fala hipnótica. As ordens podem conter várias etapas e ser executadas com precisão pela vítima.",
    dicePool: "Manipulação + Dominação vs. Inteligência + Determinação",
    duration: "Até a ordem ser cumprida ou a cena terminar",
    level: 2,
    name: "Mesmerizar",
    rouse: true,
    system:
      "Nenhum teste contra mortais desprevenidos. Contra vítimas resistentes ou outros vampiros, dispute Manipulação + Dominação vs. Inteligência + Determinação. A ordem deve ser cumprida imediatamente com o melhor das habilidades da vítima, sem exigir discernimento moral ou ações suicidas diretas.",
  },
  {
    amalgam: "Ofuscação 2",
    cost: "Um Teste de Rouse por cena",
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
    cost: "Um Teste de Rouse",
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
    cost: "Um Teste de Rouse adicional ao custo do poder amplificado",
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
    name: "Mente Inabalável",
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
    cost: "Gratuito ou um Teste de Rouse",
    description:
      "O vampiro pode estender a resistência sobrenatural de sua Fortitude aos animais que comanda ou ao seu famulus ligado por Sangue.",
    duration: "Uma cena",
    level: 2,
    name: "Bestas Resistentes",
    rouse: false,
    system:
      "O vampiro confere sua pontuação de Fortitude (Resiliência e Tenacidade) aos seus animais comandados ou ao seu famulus. O famulus recebe esse benefício passivamente de forma gratuita; animais comuns exigem um Teste de Rouse.",
  },
  {
    cost: "Um Teste de Rouse",
    description:
      "Concentrando o poder de sua Vitae, o vampiro torna-se temporariamente resistente às maiores fraquezas e terrores de sua espécie: fogo e luz solar.",
    duration: "Uma cena",
    level: 3,
    name: "Desafiar a Ruína",
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
    cost: "Um Teste de Rouse",
    description:
      "O Sangue do vampiro transborda com a tenacidade da Fortitude, transferindo temporariamente essa resistência colossal para quem quer que beba dele.",
    duration: "Uma noite; para vampiros, até a próxima alimentação ou Fome 5",
    level: 4,
    name: "Gole de Resistência",
    rouse: true,
    system:
      "Beber o equivalente a um Teste de Rouse diretamente do usuário concede ao bebedor Fortitude temporária igual à metade dos pontos de Fortitude do doador (arredondado para baixo), recebendo os mesmos poderes sem amálgama.",
  },
  {
    cost: "Dois Testes de Rouse",
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
    name: "Proeza da Dor",
    rouse: false,
    system:
      "O vampiro não sofre penalidades por caixas de Vitalidade danificadas. Além disso, para cada nível de dano que normalmente causaria penalidade em suas paradas de dados, ele ganha dados bônus adicionais em testes físicos.",
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
    cost: "Um Teste de Rouse",
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
    cost: "Um Teste de Rouse",
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
    cost: "Um Teste de Rouse",
    description:
      "O vampiro pode desaparecer instantaneamente da vista de todos mesmo quando sob observação direta ou no calor do combate, deixando seus adversários perplexos e desorientados.",
    dicePool: "Raciocínio + Furtividade vs. Raciocínio + Percepção",
    duration: "Conforme Passagem Invisível",
    level: 4,
    name: "Desvanecer",
    rouse: true,
    system:
      "Permite ativar Passagem Invisível sob escrutínio aberto ou durante um combate. Dispute Raciocínio + Furtividade vs. Raciocínio + Percepção de quem estiver olhando diretamente. Se vencer, desvanece no ar.",
  },
  {
    cost: "Um Teste de Rouse adicional",
    description:
      "O vampiro pode estender o manto de Ofuscação para abrigar seus companheiros, fazendo com que um grupo inteiro compartilhe de sua invisibilidade e discrição sobrenatural.",
    duration: "Uma cena",
    level: 5,
    name: "Manto Coletivo",
    rouse: true,
    system:
      "O usuário estende Passagem Invisível ou Manto de Sombras a um número de pessoas adicionais igual à sua pontuação de Furtividade, desde que permaneçam por perto.",
  },
  {
    cost: "Um Teste de Rouse",
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
      "Usando este poder, o vampiro é capaz de causar danos horrendos a mortais com socos e chutes, rasgando carne e quebrando ossos com facilidade monstruosa.",
    duration: "Passiva",
    level: 1,
    name: "Toque Letal",
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
    cost: "Gratuito",
    description:
      "As pernas do vampiro flexionam-se com força descomunal, impulsionando-o em saltos verticais e horizontais vertiginosos que desafiam as leis da física.",
    duration: "Passiva",
    level: 1,
    name: "Força Prodigiosa",
    rouse: false,
    system:
      "O usuário pode saltar verticalmente uma altura em metros igual a três vezes seu nível de Potência, e horizontalmente cinco vezes seu nível de Potência sem precisar de teste.",
  },
  {
    cost: "Um Teste de Rouse",
    description:
      "Os vampiros dotados de Potência extraem muito mais força bruta de seu Sangue místico, amplificando o impacto de seus ataques e a capacidade de erguer cargas colossais.",
    duration: "Uma cena",
    level: 2,
    name: "Proeza",
    rouse: true,
    system:
      "Quando ativado, adicione a pontuação de Potência do usuário ao dano de seus ataques desarmados e a todos os testes que envolvam proezas extraordinárias de Força física.",
  },
  {
    cost: "Gratuito",
    description:
      "As pernas do vampiro flexionam-se com força descomunal, impulsionando-o em saltos verticais e horizontais vertiginosos que desafiam as leis da física.",
    duration: "Passiva",
    level: 2,
    name: "Salto Prodigioso",
    rouse: false,
    system:
      "O usuário pode saltar verticalmente uma altura em metros igual a três vezes seu nível de Potência, e horizontalmente cinco vezes seu nível de Potência sem precisar de teste.",
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
    cost: "Um Teste de Rouse",
    description:
      "O usuário canaliza a energia de sua Fera e sua força bruta para incitar paixões violentas e fúria assassina em indivíduos ou multidões ao seu redor.",
    dicePool: "Manipulação + Potência",
    duration: "Uma cena",
    level: 3,
    name: "Centelha de Fúria",
    rouse: true,
    system:
      "O usuário soma sua pontuação de Potência a qualquer tentativa de incitar um motim, provocar brigas ou atiçar o frenesi de fúria em alvos mortais ou vampiros próximos.",
  },
  {
    cost: "Um Teste de Rouse",
    description:
      "O vampiro crava os dedos em superfícies sólidas como pedra, tijolos ou madeira com força titânica, permitindo-lhe escalar paredes verticais e agarrar-se com firmeza inabalável.",
    duration: "Uma cena",
    level: 3,
    name: "Aderência Sobrenatural",
    rouse: true,
    system:
      "O usuário passa automaticamente em testes de Atletismo para escalar superfícies não metálicas sólidas cravando os dedos nelas. Em manobras de imobilização, adiciona Potência à parada.",
  },
  {
    cost: "Um Teste de Rouse",
    description:
      "O vampiro desfere socos devastadores capazes de fraturar estruturas e lançar oponentes longe.",
    duration: "Um turno",
    level: 3,
    name: "Golpe Brutal",
    rouse: true,
    system:
      "Adiciona bônus massivo ao impacto de golpes contundentes desarmados.",
  },
  {
    cost: "Um Teste de Rouse",
    description:
      "O Sangue do vampiro fica impregnado com a pura força da Potência, transmitindo temporariamente essa pujança titânica para quem o consome.",
    duration: "Uma noite; para vampiros, até a próxima alimentação ou Fome 5",
    level: 4,
    name: "Gole de Poder",
    rouse: true,
    system:
      "Beber o equivalente a um Teste de Rouse diretamente do usuário concede ao bebedor Potência temporária igual à metade dos pontos de Potência do doador (arredondado para baixo).",
  },
  {
    cost: "Dois Testes de Rouse",
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
    cost: "Um Teste de Rouse",
    description:
      "A força do vampiro se torna uma arma de aniquilação mitológica. Seus golpes são capazes de decapitar, rasgar membros ou arrancar o coração do peito de mortais e vampiros com as próprias mãos.",
    duration: "Uma cena",
    level: 5,
    name: "Punho de Caim",
    rouse: true,
    system:
      "Por uma cena inteira, o usuário causa dano Agravado a mortais e seres sobrenaturais ao lutar desarmado (Briga), destroçando carcaças com facilidade colossal.",
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
      "Qualquer um na presença do vampiro sente sua atenção inexplicavelmente atraída para ele. Aqueles que o ouvem inclinam-se a concordar com suas opiniões e pontos de vista.",
    dicePool: "Manipulação + Presença vs. Autocontrole + Inteligência",
    duration: "Uma cena ou até ser cancelado",
    level: 1,
    name: "Fascinação",
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
    name: "Intimidação",
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
    name: "Beijo Duradouro",
    rouse: false,
    system:
      "O vampiro pode escolher ativar este efeito durante a alimentação. Vítimas mortais tornam-se submissas e viciadas no Beijo, concedendo +2 dados em testes sociais subsequentes contra elas.",
  },
  {
    cost: "Um Teste de Rouse",
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
    cost: "Um Teste de Rouse",
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
    cost: "Um Teste de Rouse",
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
    cost: "Dois Testes de Rouse",
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
    cost: "Um Teste de Rouse adicional",
    description:
      "A Presença do vampiro torna-se tão potente que consegue ultrapassar as barreiras das transmissões eletrônicas, projetando Fascínio, Intimidação ou Transe através de câmeras, transmissões ao vivo ou chamadas de telefone.",
    duration: "Uma cena",
    level: 5,
    name: "Magnetismo de Estrela",
    rouse: true,
    system:
      "Permite transmitir Fascínio, Intimidação e Transe através de feeds de vídeo e telas digitais ao vivo, afetando espectadores remotos que estejam assistindo no momento.",
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
    cost: "Gratuito",
    description:
      "Ao alterar momentaneamente a densidade de sua forma morta, o vampiro pode cair de alturas absurdas sem sofrer qualquer dano, pousando no solo suavemente como uma folha ou pena.",
    dicePool: "Raciocínio + Sobrevivência",
    duration: "Passiva",
    level: 1,
    name: "Peso da Pena",
    rouse: false,
    system:
      "Se o vampiro tiver tempo para se preparar para a queda, não requer teste. Como reação súbita a uma queda inesperada, faça um teste de Raciocínio + Sobrevivência (Dificuldade 3) para desacelerar a descida.",
  },
  {
    cost: "Um Teste de Rouse",
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
    cost: "Um Teste de Rouse",
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
    cost: "Um Teste de Rouse",
    description:
      "O vampiro pode transformar seu corpo na forma de um animal predador de tamanho similar ao seu, tipicamente um lobo selvagem ou grande felino.",
    duration: "Uma cena ou até retornar voluntariamente",
    level: 3,
    name: "Metamorfose",
    rouse: true,
    system:
      "A transformação leva um turno. Na forma de lobo, ganha sentidos aprimorados, velocidade extra e armas naturais que causam dano Agravado de Briga.",
  },
  {
    cost: "Um Teste de Rouse",
    description:
      "Este poder concede uma forma animal adicional ao vampiro, desta vez muito menor que sua forma original, como um morcego, rato, corvo ou serpente venenosa.",
    duration: "Uma cena ou até retornar voluntariamente",
    level: 4,
    name: "Metamorfose Maior",
    prerequisite: "Metamorfose",
    rouse: true,
    system:
      "Funciona como Metamorfose. Permite assumir a forma de criaturas pequenas como morcegos (capazes de voar) ou ratos (capazes de infiltrar-se em tubulações e frestas estreitas).",
  },
  {
    cost: "De um a três Testes de Rouse",
    description:
      "O vampiro alcança o lendário poder de dissolver seu corpo sólido em uma densa névoa sobrenatural, imune a danos físicos e capaz de esgueirar-se por frestas e fechaduras.",
    duration: "Uma cena",
    level: 5,
    name: "Forma de Névoa",
    rouse: true,
    system:
      "A transformação leva três turnos (ou menos se gastar mais Testes de Rouse). Na forma de névoa, o usuário é imune a armas físicas comuns, exceto fogo e luz solar, e pode passar por tubulações e rachaduras.",
  },
  {
    cost: "Gratuito",
    description:
      "O vampiro ganha controle absoluto sobre a anatomia de seu cadáver imortal, sendo capaz de deslocar seu coração para qualquer parte do corpo ou desfazer a paralisia de uma estaca de madeira.",
    duration: "Passiva",
    level: 5,
    name: "O Coração Liberto",
    rouse: false,
    system:
      "Aumenta a Dificuldade de qualquer tentativa de empalar o vampiro com uma estaca no coração em +3. Se empalado, pode gastar um Teste de Rouse para expelir a estaca e desfazer a paralisia.",
  },
];

const BLOOD_SORCERY_POWERS: readonly PowerTemplate[] = [
  {
    cost: "Um Teste de Rouse",
    description:
      "Alterando as propriedades químicas e místicas de seu próprio Sangue, o vampiro o torna um ácido avassaladoramente corrosivo para matérias inanimadas e metais.",
    duration: "Instantânea",
    level: 1,
    name: "Vitae Corrosiva",
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
    name: "Gosto por Sangue",
    rouse: false,
    system:
      "Role Determinação + Feitiçaria de Sangue (Dificuldade 3). Cada ponto de margem revela detalhes sobre o dono do sangue: se é mortal, carniçal ou vampiro, sua Geração aproximada, Potência de Sangue e estado de saúde.",
  },
  {
    cost: "Um Teste de Rouse",
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
    cost: "Um Teste de Rouse",
    description:
      "O vampiro pode concentrar misticamente sua própria Vitae, elevando temporariamente sua Potência de Sangue acima de seus limites habituais.",
    dicePool: "Determinação + Feitiçaria de Sangue",
    duration: "Uma cena",
    level: 3,
    name: "Sangue de Potência",
    rouse: true,
    system:
      "Role Determinação + Feitiçaria de Sangue contra Dificuldade 3. Uma vitória aumenta a Potência de Sangue do vampiro em 1 ponto pela duração de uma cena.",
  },
  {
    cost: "Um Teste de Rouse",
    description:
      "O usuário transmuta sua Vitae em um veneno paralisante e virulento, capaz de revestir armas brancas ou ser expelido pelo toque para minar o vigor de suas vítimas.",
    dicePool: "Força + Feitiçaria de Sangue vs. Vigor + Determinação",
    duration: "Uma cena",
    level: 3,
    name: "Toque de Escorpião",
    rouse: true,
    system:
      "Reveste uma arma com sangue venenoso. Em um acerto que cause dano de Vitalidade, a vítima sofre dano Superficial adicional de Vitalidade igual aos sucessos do feiticeiro no teste.",
  },
  {
    cost: "Um Teste de Rouse",
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
    cost: "Um Teste de Rouse",
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
    cost: "Um Teste de Rouse e uma Força de Vontade",
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
  {
    cost: "Um Teste de Rouse",
    description:
      "Este ritual expande a percepção do sangue, traçando a árvore genealógica espiritual do indivíduo até seus progenitores mais antigos.",
    duration: "Uma noite",
    ingredients: "100 ml de sangue do sujeito em um recipiente de prata pura",
    level: 1,
    name: "Caminhada do Sangue",
    process:
      "O feiticeiro derrama seu próprio Sangue no recipiente, misturando as amostras e entoando cânticos ancestrais enquanto queima incenso de sândalo.",
    rouse: true,
    system:
      "Permite discernir a linhagem completa do indivíduo: seu senhor, o senhor de seu senhor e toda a árvore genealógica de sangue até os fundadores míticos.",
  },
  {
    cost: "Um Teste de Rouse",
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
    cost: "Um Teste de Rouse",
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
    cost: "Um Teste de Rouse",
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
    cost: "Um Teste de Rouse",
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
    cost: "Um Teste de Rouse",
    description:
      "Abre um elo mental entre o conjurador e seu senhor através do Laço de Sangue primordial que os conecta.",
    duration: "Uma conversa",
    ingredients:
      "Um espelho de água e uma mecha de cabelo ou gota de sangue do senhor",
    level: 2,
    name: "Comunicação com o Senhor",
    process:
      "O vampiro medita diante da água sob a luz da lua, chamando mentalmente o senhor.",
    rouse: true,
    system:
      "Abre um canal telepático claro e audível com o senhor do conjurador, permitindo conversação mística independentemente da distância geográfica.",
  },
  {
    cost: "Um Teste de Rouse",
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
    cost: "Um Teste de Rouse",
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
    cost: "Um Teste de Rouse",
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
    cost: "Um Teste de Rouse",
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
    cost: "Um Teste de Rouse",
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
    cost: "Um Teste de Rouse",
    description:
      "Encantamento protetor que envolve o coração do vampiro, repelindo e estilhaçando a primeira estaca de madeira cravada contra ele.",
    duration: "Até ser descarregado ou amanhecer",
    ingredients:
      "Uma lasca de carvalho envolta em seda vermelha e mergulhada no Sangue",
    level: 3,
    name: "Deflexão do Destino de Madeira",
    process: "A seda é amarrada próxima ao coração do vampiro.",
    rouse: true,
    system:
      "A primeira estaca de madeira que atingiria o coração do vampiro em combate se estilhaça e se desfaz em pó no momento do impacto.",
  },
  {
    cost: "Um Teste de Rouse",
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
    cost: "Um Teste de Rouse",
    description:
      "Ritual ancestral de purificação e resguardo que torna a carne do vampiro invulnerável às queimaduras de chamas mundanas.",
    duration: "Uma cena",
    ingredients:
      "A ponta de um dedo do conjurador cortada e queimada em cálice de ouro com Sangue",
    level: 3,
    name: "Caminhante do Fogo",
    process:
      "O feiticeiro consome as cinzas do próprio dedo em comunhão com o fogo.",
    rouse: true,
    system:
      "O vampiro e seus companheiros selecionados ganham imunidade temporária às queimaduras de chamas mundanas durante uma cena.",
  },
  {
    cost: "Um Teste de Rouse",
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
    cost: "Um Teste de Rouse",
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
    cost: "Um Teste de Rouse",
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
    cost: "Um Teste de Rouse",
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
    cost: "Um Teste de Rouse",
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
    cost: "Dois Testes de Rouse",
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
    cost: "Dois Testes de Rouse",
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
    cost: "Dois Testes de Rouse",
    description:
      "Encanta uma estaca de madeira mística que, ao perfurar uma vítima, se fragmenta e viaja internamente até despedaçar o coração do alvo.",
    duration: "Permanente até ser disparada",
    ingredients:
      "Uma estaca entalhada em madeira de tramazeira gravada com runas proibidas",
    level: 5,
    name: "Estaca da Dissolução Tardia",
    process:
      "A estaca é embebida com 2 Testes de Rouse de Sangue sob ritos necromânticos.",
    rouse: true,
    system:
      "Se cravada em uma vítima, a estaca se fragmenta em lascas microscópicas que viajam pelas veias do alvo até perfurar o coração de forma irreversível e fatal.",
  },
];

const OBLIVION_POWERS: readonly PowerTemplate[] = [
  {
    cost: "Gratuito",
    description:
      "O vampiro manipula as sombras ao seu redor, condensando a escuridão em uma capa protetora quase física que distorce sua silhueta e absorve a luz circundante.",
    duration: "Uma cena",
    level: 1,
    name: "Sombra Palpável",
    rouse: false,
    system:
      "Adiciona dois dados a testes de Furtividade e fornece 1 ponto de armadura contra ataques mundanos de concussão.",
  },
  {
    cost: "Gratuito",
    description:
      "Os olhos do vampiro adquirem a palidez e a visão da própria morte, permitindo-lhe enxergar fantasmas no Mundo Inferior e rastros deixados pelos mortos.",
    duration: "Uma cena",
    level: 1,
    name: "Vista Cadavérica",
    rouse: false,
    system:
      "O usuário enxerga através de escuridão sobrenatural e percebe fantasmas e aparições na mortalha do Além sem restrições.",
  },
  {
    cost: "Um Teste de Rouse",
    description:
      "O vampiro invoca tentáculos sinistros de sombras sólidas que brotam do solo ou de paredes, agarrando e estrangulando seus oponentes com frieza cadavérica.",
    dicePool: "Raciocínio + Oblívio vs. Destreza + Atletismo",
    duration: "Uma cena",
    level: 2,
    name: "Braços de Ahriman",
    rouse: true,
    system:
      "Os tentáculos de sombra agarram e atacam alvos a até 10 metros, causando dano Superficial de Vitalidade e restringindo a locomoção da vítima.",
  },
  {
    cost: "Um Teste de Rouse",
    description:
      "Projeta sombras tridimensionais que podem se afastar do usuário, confundindo a visão dos inimigos e criando duplicatas ilusórias na penumbra.",
    duration: "Uma cena",
    level: 2,
    name: "Manto de Sombras",
    rouse: true,
    system:
      "Cria distrações e sombras animadas que cobrem uma área inteira, penalizando a percepção e ataques à distância dos oponentes em -2 dados.",
  },
  {
    cost: "Um Teste de Rouse",
    description:
      "O vampiro imbui a ponta de seus dedos com a frieza gélida do Vazio. Ao tocar um oponente, drena sua vitalidade e gela sua alma instantaneamente.",
    dicePool: "Força + Oblívio vs. Vigor + Determinação",
    duration: "Um turno",
    level: 3,
    name: "Toque do Oblívio",
    rouse: true,
    system:
      "Um ataque desarmado bem-sucedido inflige 3 pontos de dano Agravado de Vitalidade e deixa o membro tocado atrofiado e paralisado.",
  },
  {
    cost: "Um Teste de Rouse",
    description:
      "O vampiro consegue projetar seus sentidos através de sombras distantes, usando a escuridão como seus olhos e ouvidos sem ser notado.",
    duration: "Uma cena",
    level: 3,
    name: "Sombra do Aniquilador",
    rouse: true,
    system:
      "O usuário pode enxergar e ouvir através de qualquer sombra em linha de visão a até 50 metros como se estivesse presente naquele ponto.",
  },
  {
    cost: "Um Teste de Rouse",
    description:
      "Uma infecção putrefata do Abismo se espalha pelo toque do vampiro, apodrecendo carne viva ou morta-viva em questão de instantes com dores atrozes.",
    dicePool: "Inteligência + Oblívio vs. Vigor + Medicina",
    duration: "Uma cena",
    level: 4,
    name: "Necrose",
    rouse: true,
    system:
      "Causa necrose acelerada na carne da vítima, impondo 2 pontos de dano Agravado por turno até que o membro seja amputado ou tratado magicamente.",
  },
  {
    cost: "Dois Testes de Rouse",
    description:
      "O vampiro captura o fantasma de uma pessoa no exato instante de sua morte, aprisionando sua alma em um receptáculo ou escravizando-a ao seu serviço.",
    dicePool: "Determinação + Oblívio vs. Determinação + Autocontrole",
    duration: "Indefinida",
    level: 4,
    name: "Aprisionar Alma",
    rouse: true,
    system:
      "O espírito do recém-falecido é impedido de passar para o Além, ficando compelido a responder perguntas do vampiro e obedecer a seus comandos.",
  },
  {
    cost: "Dois Testes de Rouse",
    description:
      "Abre uma fenda na própria tapeçaria da realidade conectando sombras distantes, permitindo ao vampiro transitar por quilômetros de distância em um único passo no Vazio.",
    duration: "Instantânea",
    level: 5,
    name: "Túnel de Sombras",
    rouse: true,
    system:
      "O vampiro entra em uma sombra e emerge instantaneamente em outra sombra a até 10 quilômetros de distância, escapando de qualquer perigo terreno.",
  },
  {
    cost: "Um Teste de Rouse",
    description:
      "O vampiro dissolve sua carcaça física em um espectro de pura escuridão viva e maleável, imune a armas mundanas e capaz de esgueirar-se velozmente pela noite.",
    duration: "Uma cena",
    level: 5,
    name: "Passo Tenebroso",
    rouse: true,
    system:
      "O vampiro torna-se uma sombra incorpórea e tridimensional, imune a todo dano físico não mágico e capaz de voar e deslizar por frestas sem ruído.",
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
