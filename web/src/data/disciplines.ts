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
  cost: string;
  description: string;
  duration: string;
  level: number;
  name: string;
  rouse: boolean;
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
    cost: "Um Rouse Check",
    description:
      "Manipula, ergue, empurra e arremessa objetos ou pessoas com menos de 100 kg a até 10 metros de distância com a mente. Para alvos resistentes: Determinação + Alquimia vs. Força + Atletismo.",
    duration: "Um turno",
    level: 1,
    name: "Alcance Remoto",
    rouse: true,
  },
  {
    cost: "Um Rouse Check",
    description:
      "Cria uma cortina de névoa densa que envolve o alquimista, mascarando sua silhueta e impondo penalidade de dois dados em ataques à distância ou tentativas de identificação.",
    duration: "Uma cena",
    level: 1,
    name: "Névoa",
    rouse: true,
  },
  {
    cost: "Um Rouse Check",
    description:
      "Aproveita a natureza fluida do sangue-fraco para alterar permanentemente o sexo biológico e traços físicos de gênero do alquimista durante o sono diurno, permitindo criar uma nova identidade.",
    duration: "Permanente",
    level: 1,
    name: "Hieros Gamos Profano",
    rouse: true,
  },
  {
    cost: "Um Rouse Check",
    description:
      "Lança uma bruma que cega o alvo com penalidade de três dados de visão. Contra mortais, pode asfixiar a vítima em um teste de Raciocínio + Alquimia vs. Vigor + Sobrevivência.",
    duration: "Uma cena",
    level: 2,
    name: "Envolver",
    rouse: true,
  },
  {
    cost: "Um Rouse Check",
    description:
      "Elixir homeopático que purifica bolsas de sangue hospitalar fracionado ou estéril, restaurando seu frescor para que qualquer vampiro possa saciar sua Fome com ele.",
    duration: "Uma noite",
    level: 3,
    name: "Desfracionar",
    rouse: true,
  },
  {
    cost: "Um Rouse Check",
    description: "Fórmula que imita a vitae de um clã específico.",
    duration: "Uma noite",
    level: 3,
    name: "Sangue Falso",
    rouse: true,
  },
  {
    cost: "Um Rouse Check",
    description:
      "Concede capacidade de levitar e voar pelos céus em velocidade de corrida, manobrando livremente e podendo carregar até o peso de um corpo humano adulto. Se resistido: Força + Alquimia vs. Força + Atletismo.",
    duration: "Uma cena",
    level: 4,
    name: "Ímpeto Aéreo",
    rouse: true,
  },
  {
    cost: "Um Rouse Check",
    description:
      "Fórmula extraordinária que, misturada a sangue humano fresco, é capaz de despertar um vampiro de qualquer geração do torpor místico de acordo com a potência da destilação.",
    duration: "Instantânea",
    level: 5,
    name: "Despertar o Dormente",
    rouse: true,
  },
];

const ANIMALISM_POWERS: readonly PowerTemplate[] = [
  {
    cost: "Sem custo de sangue",
    description:
      "Permite comunicar-se com animais e convocá-los. Manipulação + Animalismo vs. resistência do animal.",
    duration: "Uma cena",
    level: 1,
    name: "Sussurro Ferino",
    rouse: false,
  },
  {
    cost: "Sem custo de sangue",
    description:
      "Forma um elo mental com um animal alimentado com a sua vitae em três noites, tornando-o um famulus. O animal compreende ordens verbais simples como 'fique' ou 'venha aqui' e defende o mestre. Sem Sussurros Ferais, ordens complexas exigem Carisma + Empatia com Animais. Permite usar Sussurros Ferais e Subjugar o Espírito no famulus sem custo.",
    duration: "Permanente",
    level: 1,
    name: "Ligar Famulus",
    rouse: false,
  },
  {
    cost: "Sem custo de sangue",
    description:
      "Sente a Fera presente em mortais, vampiros e outros seres sobrenaturais, percebendo Fome, hostilidade e agressividade. Resolução + Animalismo vs. Autocontrole + Dissimulação. Vitória revela o nível de agressividade e se o alvo abriga uma Fera sobrenatural (vampiro ou lobisomem). Vitória crítica revela a criatura e seu nível de Fome ou Fúria.",
    duration: "Passiva",
    level: 1,
    name: "Sentir a Fera",
    rouse: false,
  },
  {
    cost: "Um Rouse Check",
    description:
      "Permite comunicação bidirecional e convocação de animais da área (gratuito no famulus). Conversas simples não exigem testes. Convencer o animal a prestar serviços perigosos exige Manipulação + Animalismo. Convocar animais do tipo escolhido usa Carisma + Animalismo.",
    duration: "Uma cena",
    level: 2,
    name: "Sussurros Ferais",
    rouse: true,
  },
  {
    cost: "Sem custo de sangue",
    description:
      "Sacia um ponto adicional de Fome ao alimentar-se de animais e trata a Potência de Sangue como dois níveis mais baixa contra penalidades de saciedade com sangue animal. Consumir o próprio famulus sacia 4 pontos de Fome e adiciona dois pontos ao Atributo associado ao animal até a próxima alimentação.",
    duration: "Passiva",
    level: 3,
    name: "Suculência Animal",
    rouse: false,
  },
  {
    cost: "Um Rouse Check",
    description:
      "Ao fixar o olhar no alvo, o vampiro faz a Fera interior dele adormecer temporariamente. Carisma + Animalismo vs. Vigor + Determinação. Mortais ficam apáticos e letárgicos pela cena. Vampiros afetados não podem usar Surtos de Sangue nem marcar acertos críticos caóticos; vitória crítica encerra o frenesi do vampiro.",
    duration: "Uma cena",
    level: 3,
    name: "Acalmar a Fera",
    rouse: true,
  },
  {
    cost: "Sem custo adicional",
    description:
      "Amálgama: Ofuscação 2. Estende os poderes de Animalismo a enxames de insetos (moscas, baratas, escorpiões), tratando o enxame como uma criatura única. O vampiro pode abrigar o enxame dentro das cavidades e dobras da sua carne morta-viva, ocultando-o de qualquer detecção mundana.",
    duration: "Passiva",
    level: 3,
    name: "Colmeia Inanimada",
    rouse: false,
  },
  {
    cost: "Um Rouse Check",
    description:
      "Projeta a consciência do vampiro para dentro do corpo de um animal, controlando suas ações e sentidos enquanto o próprio corpo físico descansa imóvel em torpor (gratuito no famulus). Manipulação + Animalismo contra Dificuldade 4. Vitória crítica permite habitar o animal indefinidamente.",
    duration: "Uma cena",
    level: 4,
    name: "Subjugar o Espírito",
    rouse: true,
  },
  {
    cost: "Dois Rouse Checks",
    description:
      "Subjuga e comanda bandos, enxames e matilhas inteiras de animais presentes na área como extensões do próprio corpo. Carisma + Animalismo com Dificuldade de 3 a 5 conforme a complexidade e periculosidade das ordens.",
    duration: "Uma cena",
    level: 5,
    name: "Domínio Animal",
    rouse: true,
  },
  {
    cost: "Um Rouse Check",
    description:
      "Ao sucumbir a um frenesi de fúria ou terror, transfere a Fera para um alvo próximo mortal ou vampiro. Raciocínio + Animalismo vs. Autocontrole + Determinação. Se vencer, a vítima entra em frenesi no lugar do vampiro (não afeta frenesi de Fome).",
    duration: "Uma cena",
    level: 5,
    name: "Expelir a Fera",
    rouse: true,
  },
];

const AUSPEX_POWERS: readonly PowerTemplate[] = [
  {
    cost: "Sem custo de sangue",
    description:
      "Aguça a visão, audição e olfato a patamares sobrenaturais, permitindo enxergar na escuridão total e ouvir frequências inaudíveis. Adiciona o nível de Auspícios a todas as rolagens de percepção. Estímulos intensos exigem Raciocínio + Determinação para evitar sobrecarga de -3 dados pela cena.",
    duration: "Passiva",
    level: 1,
    name: "Sentidos Aguçados",
    rouse: false,
  },
  {
    cost: "Sem custo de sangue",
    description:
      "Sente presenças ocultas além do plano mundano, como vampiros sob Ofuscação, espíritos, fantasmas ou projeções astrais. O efeito opera de forma passiva avisando sobre presenças sobrenaturais.",
    duration: "Passiva",
    level: 1,
    name: "Sentir o Invisível",
    rouse: false,
  },
  {
    cost: "Sem custo de sangue",
    description:
      "O vampiro recebe lampejos de intuição, presságios ou visões que o alertam de emboscadas ou revelam pistas esquecidas. Pode ser provocado ativamente gastando um Rouse Check e rolando Determinação + Auspícios para obter revelações proféticas sobre uma pessoa, local ou objeto.",
    duration: "Passiva",
    level: 2,
    name: "Premonição",
    rouse: false,
  },
  {
    cost: "Um Rouse Check",
    description:
      "Examina a aura e o estado anímico de um indivíduo através de um halo cromático mutável. Inteligência + Auspícios vs. Autocontrole + Dissimulação. Cada margem de sucesso revela o estado emocional, a Ressonância do sangue, natureza sobrenatural, feitiços ativos ou diablerie cometida no último ano.",
    duration: "Um turno",
    level: 3,
    name: "Sondar a Alma",
    rouse: true,
  },
  {
    cost: "Um Rouse Check",
    description:
      "Conecta a mente aos sentidos de outro ser humano ou vampiro dentro do campo de visão, compartilhando o que o alvo vê, ouve e experimenta em tempo real. Determinação + Auspícios contra Dificuldade 3. A vítima pode tentar expulsar a conexão com Raciocínio + Determinação.",
    duration: "Uma cena",
    level: 3,
    name: "Compartilhar os Sentidos",
    rouse: true,
  },
  {
    cost: "Um Rouse Check",
    description:
      "Ao tocar um objeto ou solo, o vampiro capta as impressões psíquicas e resíduos emocionais intensos deixados pelas pessoas que o manusearam. Inteligência + Auspícios contra Dificuldade 3 a 6+. Cada margem revela vislumbres dos portadores e fatos ocorridos com o item.",
    duration: "Um turno",
    level: 4,
    name: "Toque do Espírito",
    rouse: true,
  },
  {
    cost: "Um Rouse Check",
    description:
      "Ao entrar em transe, projeta sua consciência por uma área de até um quarteirão inteiro, monitorando eventos, conversas e presenças instantaneamente. Inteligência + Auspícios (adiciona os pontos do Refúgio à parada se utilizado dentro dele).",
    duration: "Uma noite",
    level: 5,
    name: "Clarividência",
    rouse: true,
  },
  {
    cost: "Dois Rouse Checks",
    description:
      "Amálgama: Dominação 3. Subjuga a mente de um mortal através de contato visual e possui integralmente seu corpo físico, enquanto o corpo do vampiro fica inerte em transe. Determinação + Auspícios vs. Determinação + Inteligência. Permite canalizar Auspícios, Presença e Dominação através do corpo possuído.",
    duration: "Até ser encerrada",
    level: 5,
    name: "Possessão",
    rouse: true,
  },
  {
    cost: "Um Rouse Check",
    description:
      "Lê mentes através de contato visual e projeta pensamentos diretamente na mente de outros seres sem teste. Para ler pensamentos de alvos relutantes: Determinação + Auspícios vs. Raciocínio + Dissimulação (vampiros resistentes exigem o gasto adicional de 1 Força de Vontade pelo usuário).",
    duration: "Uma cena",
    level: 5,
    name: "Telepatia",
    rouse: true,
  },
];

const CELERITY_POWERS: readonly PowerTemplate[] = [
  {
    cost: "Sem custo de sangue",
    description:
      "Concede equilíbrio e coordenação física perfeitos que superam acrobatas de elite. O vampiro passa automaticamente em qualquer teste de Destreza ou Atletismo necessário para se equilibrar em parapeitos estreitos, vigas e fios finos sem hesitar.",
    duration: "Passiva",
    level: 1,
    name: "Graça Felina",
    rouse: false,
  },
  {
    cost: "Sem custo de sangue",
    description:
      "Reage em velocidade prodigiosa a ataques imprevistos. O usuário não sofre penalidades em suas paradas de defesa por falta de cobertura contra armas de fogo e tem direito a realizar uma ação menor gratuita por turno (como recarregar ou desembainhar armas).",
    duration: "Passiva",
    level: 1,
    name: "Reflexos Rápidos",
    rouse: false,
  },
  {
    cost: "Um Rouse Check",
    description:
      "Move-se em velocidade estonteante. O vampiro soma sua pontuação de Celeridade a todas as paradas de dados de testes de Destreza fora de combate. Uma vez por turno de combate, pode somar esse mesmo bônus à esquiva defensiva com Destreza + Atletismo.",
    duration: "Uma cena",
    level: 2,
    name: "Rapidez",
    rouse: true,
  },
  {
    cost: "Um Rouse Check",
    description:
      "O vampiro se desloca em linha reta cobrindo qualquer distância até 50 metros em uma fração de segundo, mantendo tempo suficiente para agir no mesmo turno. Terrenos acidentados exigem Destreza + Atletismo para evitar tropeços. Para observadores, parece teletransporte instantâneo.",
    duration: "Um turno",
    level: 3,
    name: "Lampejo",
    rouse: true,
  },
  {
    cost: "Um Rouse Check",
    description:
      "Permite correr sobre qualquer superfície, escalando paredes verticais e correndo sobre águas calmas por curtas distâncias sem afundar. Destreza + Atletismo com Dificuldade de 3 a 6 conforme a inclinação e atrito da superfície.",
    duration: "Um turno",
    level: 3,
    name: "Travessia",
    rouse: true,
  },
  {
    cost: "Um Rouse Check",
    description:
      "O sangue do vampiro transmite agilidade sobrenatural a quem bebê-lo. Beber uma Checagem de Sangue diretamente de suas veias concede pontos temporários de Celeridade iguais à metade do nível do doador (arredondado para baixo) e seus poderes não-amálgama até aquele nível.",
    duration: "Uma noite",
    level: 4,
    name: "Gole de Elegância",
    rouse: true,
  },
  {
    cost: "Um Rouse Check",
    description:
      "Amálgama: Auspícios 2. O mundo ao redor desacelera até quase parar. O vampiro mira e dispara qualquer arma de arremesso ou fogo contra um alvo como se este estivesse perfeitamente estático. O alvo não realiza rolagens de defesa ou esquiva; o ataque é feito contra Dificuldade 1.",
    duration: "Um turno",
    level: 4,
    name: "Mira Certeira",
    rouse: true,
  },
  {
    cost: "Um Rouse Check",
    description:
      "Desfere um golpe corpo a corpo desarmado ou com arma branca com velocidade inumana tão vertiginosa que o oponente não tem tempo hábil para esquivar ou se defender. O ataque é realizado contra Dificuldade 1 (oponentes com Celeridade 5 podem anular gastando um Rouse Check).",
    duration: "Um turno",
    level: 5,
    name: "Golpe Relâmpago",
    rouse: true,
  },
  {
    cost: "Um Rouse Check",
    description:
      "Sua velocidade atinge a mesma cadência de seus reflexos acelerados, permitindo interromper a narrativa do Narrador para reagir a imprevistos: cruzar uma porta prestes a fechar, escapar de uma explosão iminente ou evitar uma emboscada assim que ela tem início.",
    duration: "Uma ação",
    level: 5,
    name: "Fração de Segundo",
    rouse: true,
  },
];

const DOMINATE_POWERS: readonly PowerTemplate[] = [
  {
    cost: "Sem custo de sangue",
    description:
      "Com a palavra 'Esqueça!', o vampiro faz a vítima esquecer o momento presente e os últimos minutos, encobrindo encontros e alimentações. Alvos mundanos despreparados não exigem teste; alvos resistentes disputam Carisma + Dominação vs. Raciocínio + Determinação.",
    duration: "Indefinida",
    level: 1,
    name: "Nublar Memória",
    rouse: false,
  },
  {
    cost: "Sem custo de sangue",
    description:
      "Com contato visual, emite um comando direto de uma única ação formulado em uma frase curta (como 'Pare!', 'Fuja!', 'Solte!'). Mortais despreparados não rolam; alvos resistentes ou vampiros disputam Carisma + Dominação vs. Inteligência + Determinação.",
    duration: "Uma ação",
    level: 1,
    name: "Compelir",
    rouse: false,
  },
  {
    cost: "Um Rouse Check",
    description:
      "Com contato visual e fala pausada, implanta ordens complexas na mente da vítima, a serem executadas imediatamente com sua melhor capacidade. Alvos relutantes ou vampiros disputam Manipulação + Dominação vs. Inteligência + Determinação.",
    duration: "Uma cena",
    level: 2,
    name: "Mesmerizar",
    rouse: true,
  },
  {
    cost: "Um Rouse Check",
    description:
      "Amálgama: Ofuscação 2. Inserindo insinuações e inflexões perturbadoras em uma conversa casual, o vampiro instiga os demônios interiores do alvo. A cada turno, ataca o alvo com Manipulação + Dominação vs. Autocontrole + Inteligência, causando dano Superficial à Força de Vontade.",
    duration: "Uma cena",
    level: 2,
    name: "Dementação",
    rouse: true,
  },
  {
    cost: "Um Rouse Check",
    description:
      "Reescreve parcelas inteiras das memórias da vítima mantendo contato visual ininterrupto, descrevendo os novos fatos aceitos como verdades pelo alvo. Manipulação + Dominação vs. Inteligência + Determinação; a margem determina o número e clareza das memórias adulteradas.",
    duration: "Indefinida",
    level: 3,
    name: "A Mente Esquecida",
    rouse: true,
  },
  {
    cost: "Sem custo adicional",
    description:
      "Permite adicionar uma sugestão pós-hipnótica ao usar Mesmerizar, deixando a ordem dormente na mente da vítima até que um gatilho específico ocorra (uma data, um encontro ou uma palavra-chave). A diretiva nunca expira por si mesma.",
    duration: "Passiva",
    level: 3,
    name: "Diretiva Submersa",
    rouse: false,
  },
  {
    cost: "Sem custo adicional",
    description:
      "As vítimas de Dominação passam a acreditar piamente que tudo o que fizeram sob comando foi fruto de sua própria e livre escolha, defendendo seus atos com convicção absoluta mesmo quando ilógicos ou absurdos.",
    duration: "Indefinida",
    level: 4,
    name: "Racionalizar",
    rouse: false,
  },
  {
    cost: "Um Rouse Check adicional",
    description:
      "Amplifica qualquer outro poder de Dominação para afetar multidões de mortais e grupos de vampiros simultaneamente, desde que todos possam ver os olhos do vampiro. O teste é rolado contra o oponente de maior resistência do grupo.",
    duration: "Uma cena",
    level: 5,
    name: "Manipulação em Massa",
    rouse: true,
  },
  {
    cost: "Sem custo de sangue",
    description:
      "Supera o instinto de autopreservação da vítima. O vampiro agora pode ordenar comandos suicidas ou diretamente letais (como atirar em si mesmo, pular de um prédio ou caminhar para o fogo ou luz do sol). O alvo tem direito a testes normais para resistir ao poder.",
    duration: "Passiva",
    level: 5,
    name: "Decreto Terminal",
    rouse: false,
  },
];

const FORTITUDE_POWERS: readonly PowerTemplate[] = [
  {
    cost: "Sem custo de sangue",
    description:
      "Reforça a resistência mística do corpo vampírico. O usuário adiciona sua pontuação total em Fortitude diretamente à sua trilha de Vitalidade.",
    duration: "Passiva",
    level: 1,
    name: "Resiliência",
    rouse: false,
  },
  {
    cost: "Sem custo de sangue",
    description:
      "Concede serenidade inabalável contra manipulações mentais, sedução, chantagem mundana e coerção sobrenatural (incluindo Dominação e Presença). Adiciona a Fortitude como dados extras em qualquer teste para resistir a tentativas de controlar a mente.",
    duration: "Passiva",
    level: 1,
    name: "Mente Inabalável",
    rouse: false,
  },
  {
    cost: "Um Rouse Check",
    description:
      "O vampiro absorve danos brutais ignorando o impacto. Subtrai sua Fortitude de todo o dano Superficial recebido antes de aplicar a divisão por dois (o dano sofrido nunca pode ser reduzido a menos de 1).",
    duration: "Uma cena",
    level: 2,
    name: "Tenacidade",
    rouse: true,
  },
  {
    cost: "Sem custo para famulus; Um Rouse Check para outros animais",
    description:
      "Amálgama: Animalismo 1. Compartilha a durabilidade sobrenatural com animais sob seu controle, concedendo-lhes níveis de Vitalidade adicionais iguais à Fortitude do vampiro. Gratuito no famulus; para outros animais exige Vigor + Animalismo (Dificuldade 3).",
    duration: "Uma cena",
    level: 2,
    name: "Bestas Resistentes",
    rouse: false,
  },
  {
    cost: "Um Rouse Check",
    description:
      "Permite resistir a fogo, luz solar e ferimentos mortais. Converte dano Agravado recebido em dano Superficial até um total de pontos igual ao valor de Fortitude na cena. Pode ser ativado reflexivamente ao sofrer dano com um teste de Raciocínio + Sobrevivência (Dificuldade 3).",
    duration: "Uma cena",
    level: 3,
    name: "Desafiar a Ruína",
    rouse: true,
  },
  {
    cost: "Sem custo de sangue",
    description:
      "Protege pensamentos e emoções contra espionagem sobrenatural, mantendo a mente em branco e a aura plana. Aumenta a Dificuldade de poderes como Sondar a Alma e Telepatia em metade da Fortitude; se o poder permitir teste de resistência, soma a Fortitude à parada.",
    duration: "Uma cena",
    level: 3,
    name: "Fortificar a Fachada Interior",
    rouse: false,
  },
  {
    cost: "Um Rouse Check",
    description:
      "O sangue do vampiro transmite durabilidade inumana a quem o beber. Beber uma Checagem de Sangue diretamente de suas veias concede ao receptor pontos de Fortitude temporários iguais à metade da pontuação do doador e seus poderes não-amálgama até esse nível.",
    duration: "Uma noite",
    level: 4,
    name: "Gole de Resistência",
    rouse: true,
  },
  {
    cost: "Dois Rouse Checks",
    description:
      "A pele do vampiro ganha a dureza e impermeabilidade do mármore. Enquanto ativo, ignora a primeira fonte de dano físico recebida a cada turno (incluindo fogo, mas exceto luz solar). Um acerto crítico em rolagem de ataque inimiga ultrapassa essa proteção.",
    duration: "Uma cena",
    level: 5,
    name: "Pele de Mármore",
    rouse: true,
  },
  {
    cost: "Um Rouse Check",
    description:
      "Converte dor em vigor avassalador. O vampiro anula quaisquer penalidades de dados decorrentes de dano em Vitalidade e ganha 1 ponto em um Atributo Físico para cada nível de dano marcado em sua trilha de Vitalidade, até o limite máximo de Surto de Sangue + 6.",
    duration: "Uma cena",
    level: 5,
    name: "Proeza da Dor",
    rouse: true,
  },
];

const OBFUSCATE_POWERS: readonly PowerTemplate[] = [
  {
    cost: "Sem custo de sangue",
    description:
      "Permanecendo em repouso e aproveitando coberturas ou penumbra, o vampiro se funde ao cenário e passa totalmente despercebido por observadores naturais. O efeito dura até que se mova ou emita sons altos. Apenas meios mecânicos ou Sentir o Invisível conseguem detectá-lo.",
    duration: "Uma cena",
    level: 1,
    name: "Manto de Sombras",
    rouse: false,
  },
  {
    cost: "Sem custo de sangue",
    description:
      "Amortece e anula todos os sons emitidos pela pessoa do vampiro: passos, roupas e respiração. Observadores mundanos que dependam da audição não conseguem ouvi-lo. Não silencia sons produzidos fora de seu espaço pessoal nem engana microfones eletrônicos.",
    duration: "Uma cena",
    level: 1,
    name: "Silêncio da Morte",
    rouse: false,
  },
  {
    cost: "Um Rouse Check",
    description:
      "Permite caminhar e deslocar-se livremente mantendo-se invisível aos olhos mundanos, contanto que não emita odores fortes nem produza sons mais altos que um sussurro. Não pode ser ativado caso o vampiro já esteja sob observação direta no instante do acionamento.",
    duration: "Uma cena",
    level: 2,
    name: "Passagem Invisível",
    rouse: true,
  },
  {
    cost: "Sem custo adicional",
    description:
      "Transmite os efeitos ilusórios de Ofuscação através de meios eletrônicos, ficando invisível em câmeras de vídeo e telas ao vivo. Em gravações posteriores, a silhueta aparece borrada com +3 na Dificuldade para identificação, e o usuário ganha +3 dados para burlar segurança eletrônica.",
    duration: "Uma cena",
    level: 3,
    name: "Fantasma na Máquina",
    rouse: false,
  },
  {
    cost: "Um Rouse Check",
    description:
      "O vampiro altera sutilmente sua aura e feições para aparentar ser um estranho anônimo e insuspeito compatível com o local (como um faxineiro ou vigia). Não exige teste contra observadores casuais; Sentir o Invisível pode romper o disfarce.",
    duration: "Uma cena",
    level: 3,
    name: "Máscara de Mil Faces",
    rouse: true,
  },
  {
    cost: "Um Rouse Check",
    description:
      "Amálgama: Auspícios 3. Oculta um objeto inanimado (como um carro, porta ou edifício pequeno) e tudo dentro dele da atenção de transeuntes através de sugestão hipnótica. Inteligência + Ofuscação contra Dificuldade 2 a 6. Auspícios pode disputar com Raciocínio + Auspícios.",
    duration: "Uma noite",
    level: 4,
    name: "Ocultar",
    rouse: true,
  },
  {
    cost: "Um Rouse Check",
    description:
      "Pré-requisito: Manto de Sombras. Permite ativar Manto de Sombras ou Passagem Invisível mesmo sob vista direta de outras pessoas. Diante de mortais: Raciocínio + Ofuscação vs. Raciocínio + Prontidão; vitória faz a testemunha duvidar que o viu, e crítico apaga o fato da memória.",
    duration: "Uma cena",
    level: 4,
    name: "Desvanecer",
    rouse: true,
  },
  {
    cost: "Um Rouse Check adicional",
    description:
      "Estende os poderes de Ofuscação conhecidos para proteger companheiros voluntários próximos. Abriga um número de aliados igual ao Raciocínio do usuário (mais um por Rouse Check extra). Os aliados usam a pontuação de Ofuscação do conjurador para testes.",
    duration: "Uma cena",
    level: 5,
    name: "Manto Coletivo",
    rouse: true,
  },
  {
    cost: "Um Rouse Check",
    description:
      "Pré-requisito: Máscara de Mil Faces. Permite imitar com perfeição a aparência física, timbre vocal e maneirismos de um indivíduo estudado por 15 minutos. Exige teste oculto de Raciocínio + Ofuscação (Dificuldade 4) e Manipulação + Performance para atuar como o indivíduo.",
    duration: "Uma cena",
    level: 5,
    name: "Disfarce do Impostor",
    rouse: true,
  },
];

const POTENCE_POWERS: readonly PowerTemplate[] = [
  {
    cost: "Sem custo de sangue",
    description:
      "A musculatura do vampiro ganha força avassaladora capaz de causar danos terríveis a mortais, rasgando pele e quebrando ossos com os dedos nus. Os ataques desarmados podem causar dano Agravado de Vitalidade a mortais e ignoram um nível de blindagem por ponto de Potência do usuário.",
    duration: "Passiva",
    level: 1,
    name: "Corpo Letal",
    rouse: false,
  },
  {
    cost: "Sem custo de sangue",
    description:
      "Possuindo força sobrenatural em pernas e tronco, o usuário pode saltar distâncias verticais de até três vezes seu nível de Potência em metros, e distâncias horizontais de até cinco vezes sua pontuação de Potência em metros, sem precisar tomar impulso prévio.",
    duration: "Passiva",
    level: 1,
    name: "Salto Elevado",
    rouse: false,
  },
  {
    cost: "Sem custo de sangue",
    description:
      "A musculatura do vampiro ganha força avassaladora capaz de causar danos terríveis a mortais, rasgando pele e quebrando ossos com os dedos nus. Os ataques desarmados podem causar dano Agravado de Vitalidade a mortais e ignoram um nível de blindagem por ponto de Potência do usuário.",
    duration: "Passiva",
    level: 1,
    name: "Toque Letal",
    rouse: false,
  },
  {
    cost: "Sem custo de sangue",
    description:
      "Possuindo força sobrenatural em pernas e tronco, o usuário pode saltar distâncias verticais de até três vezes seu nível de Potência em metros, e distâncias horizontais de até cinco vezes sua pontuação de Potência em metros, sem precisar tomar impulso prévio.",
    duration: "Passiva",
    level: 1,
    name: "Força Prodigiosa",
    rouse: false,
  },
  {
    cost: "Um Rouse Check",
    description:
      "Multiplica a força física bruta da vitae. Adiciona a pontuação de Potência do usuário diretamente ao dano final de seus golpes desarmados e a todas as paradas de dados em façanhas de Força física realizadas durante a cena.",
    duration: "Uma cena",
    level: 2,
    name: "Proeza",
    rouse: true,
  },
  {
    cost: "Um Rouse Check",
    description:
      "Permite realizar saltos sobre-humanos de grande alcance e altura durante a cena com impulso da vitae.",
    duration: "Uma cena",
    level: 2,
    name: "Salto Prodigioso",
    rouse: true,
  },
  {
    cost: "Sem custo de sangue",
    description:
      "Conhecido como o 'Beijo Selvagem', permite drenar o sangue de uma vítima em meros segundos logo após um acerto com presas em combate. Cada ponto de Fome saciado inflige 1 ponto de dano Agravado em mortais (ou dano Superficial em vampiros).",
    duration: "Uma alimentação",
    level: 3,
    name: "Alimentação Brutal",
    rouse: false,
  },
  {
    cost: "Um Rouse Check",
    description:
      "Amálgama: Presença 3. Provoca fúria violenta e frenesi em espectadores. O usuário soma sua Potência a testes para incitar multidões ao motim. Contra outro vampiro: Manipulação + Potência vs. Autocontrole + Inteligência; se vencer, o adversário deve fazer teste de frenesi de fúria (Dificuldade 3).",
    duration: "Uma cena",
    level: 3,
    name: "Centelha de Fúria",
    rouse: true,
  },
  {
    cost: "Um Rouse Check",
    description:
      "O vampiro crava dedos e artelhos em quase qualquer superfície sólida por pura força bruta, escalando paredes e pendurando-se em tetos com sucesso automático em superfícies não-metálicas. Deixa marcas detectáveis com Inteligência + Investigação.",
    duration: "Uma cena",
    level: 3,
    name: "Aderência Sobrenatural",
    rouse: true,
  },
  {
    cost: "Um Rouse Check",
    description:
      "Desfere um golpe devastador canalizado pelo Sangue, dobrando o impacto destrutivo ou dano em um ataque bem-sucedido com Força física.",
    duration: "Um ataque",
    level: 3,
    name: "Golpe Brutal",
    rouse: true,
  },
  {
    cost: "Um Rouse Check",
    description:
      "O sangue do vampiro transmite força inumana a quem o beber. Beber uma Checagem de Sangue diretamente de suas veias concede pontos temporários de Potência iguais à metade da pontuação do doador e seus poderes não-amálgama até esse nível.",
    duration: "Uma noite",
    level: 4,
    name: "Gole de Poder",
    rouse: true,
  },
  {
    cost: "Dois Rouse Checks",
    description:
      "O vampiro desfere um golpe esmagador no solo com o punho ou calcanhar, irradiando uma onda de choque sísmica destrutiva. Todos em um raio de 5 metros devem testar Destreza + Atletismo (Dificuldade 3); falhas causam queda ao chão e perda da ação.",
    duration: "Um turno",
    level: 5,
    name: "Terremoto",
    rouse: true,
  },
  {
    cost: "Um Rouse Check",
    description:
      "Os golpes desarmados do vampiro ganham letalidade mística ancestral. Durante a cena, seus ataques de Briga causam dano Agravado de Vitalidade tanto a mortais quanto a seres sobrenaturais, dilacerando membros e arrancando corações.",
    duration: "Uma cena",
    level: 5,
    name: "Punho de Caim",
    rouse: true,
  },
];

const PRESENCE_POWERS: readonly PowerTemplate[] = [
  {
    cost: "Sem custo de sangue",
    description:
      "Todos na presença do vampiro têm sua atenção hipnotizada por suas palavras e magnetismo. Adiciona a pontuação de Presença a testes sociais envolvendo Persuasão ou Performance. Alvos alertas podem resistir em disputa de Autocontrole + Inteligência vs. Manipulação + Presença.",
    duration: "Uma cena",
    level: 1,
    name: "Fascínio",
    rouse: false,
  },
  {
    cost: "Sem custo de sangue",
    description:
      "O vampiro exala uma aura ameaçadora de terror predatório. Adiciona sua Presença a todas as rolagens de Intimidação. Qualquer indivíduo que deseje atacar o vampiro diretamente deve antes passar em um teste de Resolução + Autocontrole (Dificuldade 2). Não pode ser usado junto com Fascínio.",
    duration: "Uma cena",
    level: 1,
    name: "Intimidação",
    rouse: false,
  },
  {
    cost: "Sem custo de sangue",
    description:
      "O Beijo do vampiro gera um arrebatamento e dependência psicológica obsessiva na vítima. Adiciona dados iguais à Presença a testes sociais de Carisma subsequentes contra o indivíduo mordido. A vítima resiste com teste semanal de Força de Vontade contra Dificuldade igual à Presença.",
    duration: "Até ser superado",
    level: 2,
    name: "Beijo Duradouro",
    rouse: false,
  },
  {
    cost: "Um Rouse Check",
    description:
      "Ao exibir suas presas e uma expressão predatória medonha, o vampiro instila pânico avassalador em um alvo. Carisma + Presença vs. Autocontrole + Determinação. Mortais fogem aterrorizados ou entram em estado de choque; vampiros recuam em pavor ou entram em frenesi de terror (Rötschreck).",
    duration: "Um turno",
    level: 3,
    name: "Olhar Aterrorizante",
    rouse: true,
  },
  {
    cost: "Um Rouse Check",
    description:
      "Foca o magnetismo em uma pessoa, despertando nela paixão ou adoração cega pelo vampiro. Carisma + Presença vs. Autocontrole + Raciocínio. O alvo faz o possível para agradar o usuário e este adiciona sua Presença a testes sociais contra ele; pedidos que firam crenças fundamentais rompem o efeito.",
    duration: "Uma cena",
    level: 3,
    name: "Transe",
    rouse: true,
  },
  {
    cost: "Sem custo adicional",
    description:
      "Amálgama: Dominação 1. A presença do usuário permite canalizar poderes de Dominação exclusivamente através de sua voz emitida em presença física, sem exigir contato visual direto com a vítima.",
    duration: "Passiva",
    level: 4,
    name: "Voz Irresistível",
    rouse: false,
  },
  {
    cost: "Um Rouse Check",
    description:
      "Chama até si qualquer mortal ou vampiro que já tenha provado seu sangue ou sido alvo de Fascínio, Transe ou Majestade. Manipulação + Presença vs. Autocontrole + Inteligência. O alvo sente uma urgência magnética de viajar até o invocador.",
    duration: "Uma noite",
    level: 4,
    name: "Convocar",
    rouse: true,
  },
  {
    cost: "Dois Rouse Checks",
    description:
      "O vampiro manifesta uma aura sublime de autoridade divina ou terror infernal. Todos os presentes ficam petrificados em reverência ou medo. Quem desejar agir contra o vampiro deve antes vencer uma disputa de Autocontrole + Determinação contra Carisma + Presença do usuário.",
    duration: "Uma cena",
    level: 5,
    name: "Majestade",
    rouse: true,
  },
  {
    cost: "Um Rouse Check adicional",
    description:
      "Permite transmitir os poderes de Fascínio, Intimidação e Transe através de transmissões de vídeo ao vivo ou chamadas telefônicas, impactando espectadores que acompanham o sinal em tempo real.",
    duration: "Uma cena",
    level: 5,
    name: "Magnetismo de Estrela",
    rouse: true,
  },
];

const PROTEAN_POWERS: readonly PowerTemplate[] = [
  {
    cost: "Sem custo de sangue",
    description:
      "Os olhos do vampiro emitem um brilho avermelhado sobrenatural que lhe permite enxergar perfeitamente na escuridão total (mesmo sobrenatural). Enquanto ativo, confere dois dados extras em testes de Intimidação contra mortais.",
    duration: "Passiva",
    level: 1,
    name: "Olhos da Besta",
    rouse: false,
  },
  {
    cost: "Sem custo de sangue",
    description:
      "Reduz a densidade corporal tornando o vampiro praticamente sem peso. Torna-o imune a dano decorrente de quedas de qualquer altura, impactos e arremessos, impedindo o acionamento de sensores de pressão no chão. Ativação súbita durante queda usa Raciocínio + Sobrevivência (Dificuldade 3).",
    duration: "Passiva",
    level: 1,
    name: "Peso da Pena",
    rouse: false,
  },
  {
    cost: "Um Rouse Check",
    description:
      "O vampiro estende garras curvas e afiadas nas mãos ou presas pontiagudas como adagas. Adiciona +2 ao dano de ataques de Briga e causa dano Agravado a mortais; dano Superficial infligido não é dividido pela metade contra outros vampiros.",
    duration: "Uma cena",
    level: 2,
    name: "Armas Ferais",
    rouse: true,
  },
  {
    cost: "Um Rouse Check",
    description:
      "O vampiro dissolve seu corpo no solo natural (terra crua, relva ou rochas), fundindo-se à terra para descansar durante o dia protegido da luz do sol ou se ocultar de perseguidores, despertando na noite seguinte.",
    duration: "Um dia",
    level: 3,
    name: "Fusão com a Terra",
    rouse: true,
  },
  {
    cost: "Um Rouse Check",
    description:
      "O vampiro transmuta seu corpo na forma de um animal de porte e massa similar à sua (tipicamente um lobo, cão grande, lince ou serpente volumosa). A transformação leva um turno e concede os Atributos Físicos, sentidos e habilidades da espécie animal.",
    duration: "Uma cena",
    level: 3,
    name: "Metamorfose",
    rouse: true,
  },
  {
    cost: "Um Rouse Check",
    description:
      "Pré-requisito: Metamorfose. Concede uma forma animal adicional permitindo ao vampiro alterar drasticamente seu tamanho físico, assumindo formas diminutas como morcegos, ratos ou cobras para infiltração e espionagem.",
    duration: "Uma cena",
    level: 4,
    name: "Metamorfose Maior",
    rouse: true,
  },
  {
    cost: "De um a três Rouse Checks",
    description:
      "O vampiro converte seu corpo em uma nuvem de névoa impalpável, totalmente imune a ataques físicos ordinários (suscetível apenas a fogo, luz solar ou rituais mágicos). Consegue esgueirar-se por canos, frestas e fechaduras em velocidade de caminhada.",
    duration: "Uma cena",
    level: 5,
    name: "Forma de Névoa",
    rouse: true,
  },
  {
    cost: "Sem custo de sangue",
    description:
      "O coração do vampiro torna-se móvel e maleável dentro do peito, mudando de posição todas as noites. Aumenta a Dificuldade de qualquer tentativa de empalação em +3 (em combate, apenas acertos críticos atingem o coração). Se empalado, pode rolar Força + Determinação para expelir a estaca.",
    duration: "Passiva",
    level: 5,
    name: "O Coração Liberto",
    rouse: false,
  },
];

const BLOOD_SORCERY_POWERS: readonly PowerTemplate[] = [
  {
    cost: "Um ou mais Rouse Checks",
    description:
      "O sangue derramado pelo feiticeiro ganha propriedades altamente corrosivas para matéria inanimada. Cada Rouse Check de sangue derrete cerca de 35 cm de matéria sólida em cinco minutos, dissolvendo trincos, grades e algemas metálicas.",
    duration: "Instantânea",
    level: 1,
    name: "Vitae Corrosiva",
    rouse: true,
  },
  {
    cost: "Sem custo de sangue",
    description:
      "Ao provar uma gota de sangue na língua, discerne traços essenciais do doador. Determinação + Feitiçaria de Sangue contra Dificuldade 3. Uma vitória revela se é mortal, carniçal, vampiro ou outra entidade, e sua Ressonância. Vitória crítica revela Potência de Sangue, geração aproximada e se já cometeu diablerie.",
    duration: "Instantânea",
    level: 1,
    name: "Gosto por Sangue",
    rouse: false,
  },
  {
    cost: "Um Rouse Check",
    description:
      "Ritual de Nível 1. Em uma taça de prata com uma amostra de sangue do alvo, mistura sua vitae e entoa cânticos por uma hora. Inteligência + Feitiçaria de Sangue contra Dificuldade 2. Vitória revela nome, geração e senhor do alvo; vitória crítica revela laços de sangue ativos.",
    duration: "Instantânea",
    level: 1,
    name: "Caminhada do Sangue",
    rouse: true,
  },
  {
    cost: "Um Rouse Check",
    description:
      "Ritual de Nível 1. Esmaga uma aranha viva em uma ampola com sua vitae e bebe a mistura. Inteligência + Feitiçaria de Sangue contra Dificuldade 2. Ganha a capacidade de escalar paredes e tetos usando mãos e pés durante uma cena inteira (ou pela noite toda em vitória crítica).",
    duration: "Uma cena",
    level: 1,
    name: "Aderência do Inseto",
    rouse: true,
  },
  {
    cost: "Um Rouse Check",
    description:
      "Ritual de Nível 1. Encanta um minério de ferro ou ímã imerso em sangue com cânticos por três noites. Inteligência + Feitiçaria de Sangue contra Dificuldade 2. Sintoniza a mente à pedra, sabendo infalivelmente a direção e distância exatas até onde ela estiver por uma semana.",
    duration: "Uma semana",
    level: 1,
    name: "Criar Pedra de Sangue",
    rouse: true,
  },
  {
    cost: "Um Rouse Check",
    description:
      "Ritual de Nível 1. Traça um círculo com cinzas de galo e sangue ao redor do leito de repouso. Se qualquer perigo surgir durante o dia, acorda imediatamente em prontidão total com Inteligência + Feitiçaria de Sangue, anulando penalidades diurnas pela cena.",
    duration: "Uma cena",
    level: 1,
    name: "Despertar com o Frescor Noturno",
    rouse: true,
  },
  {
    cost: "Um Rouse Check",
    description:
      "Ritual de Nível 1. Traça um glifo com a própria vitae sobre um objeto ou ponto de passagem de até um metro. Quando tocado por um carniçal, o glifo causa 1 ponto de dano Agravado (3 em acerto crítico) e pânico extremo.",
    duration: "Permanente",
    level: 1,
    name: "Proteção contra Carniçais",
    rouse: true,
  },
  {
    cost: "Um Rouse Check",
    description:
      "Concentrando-se e gesticulando sutilmente, retira as propriedades vitais do sangue nas veias de outro vampiro à vista, secando suas reservas e elevando sua Fome. Inteligência + Feitiçaria de Sangue vs. Vigor + Autocontrole. Uma vitória aumenta a Fome da vítima em 1 ponto; vitória crítica aumenta em 2.",
    duration: "Instantânea",
    level: 2,
    name: "Extinguir Vitae",
    rouse: true,
  },
  {
    cost: "Um Rouse Check",
    description:
      "Ritual de Nível 2. Mergulha um objeto pertencente ao senhor em uma bacia de prata com sangue e água por quinze minutos. Inteligência + Feitiçaria de Sangue contra Dificuldade 3. Estabelece elo telepático bidirecional de comunicação a longa distância por dez minutos.",
    duration: "Uma cena",
    level: 2,
    name: "Comunicação com o Senhor",
    rouse: true,
  },
  {
    cost: "Um Rouse Check",
    description:
      "Ritual de Nível 2. Arrancando e ingerindo os olhos e a língua fresca de uma pessoa recém-morta, o feiticeiro absorve o conhecimento linguístico da vítima com Inteligência + Feitiçaria de Sangue (Dificuldade 3), falando e lendo fluentemente todos os idiomas que ela conhecia por uma semana.",
    duration: "Uma semana",
    level: 2,
    name: "Olhos de Babel",
    rouse: true,
  },
  {
    cost: "Um Rouse Check",
    description:
      "Ritual de Nível 2. Embebe uma fita de cetim branco em sua vitae e queima-a. Inteligência + Feitiçaria de Sangue contra Dificuldade 3. Permite enxergar a trilha percorrida por uma presa específica nas últimas 24 horas como um rastro luminescente no chão durante toda a noite.",
    duration: "Uma noite",
    level: 2,
    name: "Iluminar o Rastro da Presa",
    rouse: true,
  },
  {
    cost: "Um Rouse Check",
    description:
      "Ritual de Nível 2. Mistura a própria vitae com o sangue do alvo em um cálice e mergulha o dedo. A cada frase dita pelo sujeito, disputa Resolução + Feitiçaria de Sangue vs. Autocontrole + Ocultismo para saber infalivelmente se o depoimento é verdadeiro.",
    duration: "Uma cena",
    level: 2,
    name: "Verdade do Sangue",
    rouse: true,
  },
  {
    cost: "Um Rouse Check",
    description:
      "Ritual de Nível 2. Traça um glifo com punhado de sal e sangue sobre um objeto ou passagem. Espíritos incorpóreos e fantasmas que tocarem o item sofrem 1 ponto de dano Agravado e são repelidos por terror sobrenatural.",
    duration: "Permanente",
    level: 2,
    name: "Proteção contra Espíritos",
    rouse: true,
  },
  {
    cost: "Um Rouse Check",
    description:
      "O feiticeiro concentra o poder místico da vitae em suas veias, elevando temporariamente sua Potência de Sangue. Determinação + Feitiçaria de Sangue contra Dificuldade 2 + Potência de Sangue atual. Vitória aumenta a Potência em 1 nível; vitória crítica aumenta em 2 níveis.",
    duration: "Uma cena",
    level: 3,
    name: "Sangue de Potência",
    rouse: true,
  },
  {
    cost: "Um ou mais Rouse Checks",
    description:
      "Transmuta o próprio sangue em um veneno paralisante de contato, cobrindo armas brancas ou cuspindo contra o adversário. Força + Feitiçaria de Sangue vs. Vigor + Ocultismo. Causa a margem em dano Agravado a mortais (desmaiando-os) ou dano Superficial direto em vampiros.",
    duration: "Uma cena",
    level: 3,
    name: "Toque de Escorpião",
    rouse: true,
  },
  {
    cost: "Um Rouse Check",
    description:
      "Ritual de Nível 3. Tendo entrado em contato físico com a pele ou sangue da vítima previamente, o feiticeiro perfura a própria carne com uma adaga cerimonial de ouro. Resolução + Feitiçaria de Sangue vs. Vigor + Determinação. Cada margem rompe vasos e inunda os pulmões da vítima de sangue à distância.",
    duration: "Instantânea",
    level: 3,
    name: "Chamado de Dagon",
    rouse: true,
  },
  {
    cost: "Um Rouse Check",
    description:
      "Ritual de Nível 3. Medita em um círculo traçado com lascas de madeira e sangue, colocando uma farpa de madeira sob a língua. A primeira estaca de madeira que tentaria empalar o coração do vampiro despedaça-se instantaneamente em estilhaços inofensivos antes de furar a pele.",
    duration: "Uma noite",
    level: 3,
    name: "Deflexão do Destino de Madeira",
    rouse: true,
  },
  {
    cost: "Um Rouse Check",
    description:
      "Ritual de Nível 3. Reduz folhas e bagas de beladona em fogo brando com vitae, destilando uma poção escura que, quando bebida, concede a capacidade de levitar e voar pelos céus em velocidade de corrida durante uma cena inteira.",
    duration: "Uma cena",
    level: 3,
    name: "Essência do Ar",
    rouse: true,
  },
  {
    cost: "Um Rouse Check",
    description:
      "Ritual de Nível 3. O feiticeiro corta a ponta de um de seus dedos e o queima com sangue em uma taça dourada com Vigor + Determinação (Dificuldade 3). Pela noite toda, todo dano recebido por fogo é reduzido à metade.",
    duration: "Uma noite",
    level: 3,
    name: "Caminhante do Fogo",
    rouse: true,
  },
  {
    cost: "Um Rouse Check",
    description:
      "Ritual de Nível 3. Inscrição mística traçada com pó de prata e vitae sobre um objeto. Lobisomens em qualquer forma que tocarem o objeto sofrem dano Agravado imediato e são repelidos por pânico sobrenatural.",
    duration: "Permanente",
    level: 3,
    name: "Proteção contra Lupinos",
    rouse: true,
  },
  {
    cost: "Um Rouse Check",
    description:
      "Abre um ferimento místico nas artérias de uma presa à vista, fazendo o sangue jorrar pelo ar em um arco contínuo até a boca do feiticeiro. Raciocínio + Feitiçaria de Sangue vs. Raciocínio + Ocultismo. O usuário alimenta-se a distância no dobro da velocidade comum sem deixar marcas físicas posteriores.",
    duration: "Uma alimentação",
    level: 4,
    name: "Roubo de Vitae",
    rouse: true,
  },
  {
    cost: "Um Rouse Check",
    description:
      "Ritual de Nível 4. Inscrição de glifos protetores com vitae ao redor de uma câmara de até 6 metros de raio. Ao nascer do sol, sombras místicas cobrem portas e janelas, bloqueando totalmente a entrada de luz solar e resguardando os vampiros adormecidos.",
    duration: "Um dia",
    level: 4,
    name: "Defesa do Refúgio Sagrado",
    rouse: true,
  },
  {
    cost: "Um Rouse Check",
    description:
      "Ritual de Nível 4. Alimenta uma ave de rapina carnívora (corvo ou gavião) com seu sangue e entra em transe, enxergando através de seus olhos e guiando seu voo por distâncias ilimitadas. Permite canalizar disciplinas mentais através do pássaro.",
    duration: "Uma noite",
    level: 4,
    name: "Olhos do Falcão Noturno",
    rouse: true,
  },
  {
    cost: "Um Rouse Check",
    description:
      "Ritual de Nível 4. Quebra um espelho coberto de sangue entoando palavras de poder e segura um de seus cacos. Torna-se espectral e incorpóreo, atravessando portas e paredes sólidas em linha reta, imune a danos físicos mundanos.",
    duration: "Uma cena",
    level: 4,
    name: "Passagem Incorpórea",
    rouse: true,
  },
  {
    cost: "Um Rouse Check",
    description:
      "Ritual de Nível 4. Glifo traçado com cinzas quentes de brasa e sangue. Qualquer vampiro além do próprio conjurador que tocar no objeto sofre 1 ponto de dano Agravado (3 pontos em acerto crítico) e fica repelido.",
    duration: "Permanente",
    level: 4,
    name: "Proteção contra Cainitas",
    rouse: true,
  },
  {
    cost: "Um ou mais Rouse Checks",
    description:
      "Transmuta a própria vitae em uma toxina hiperagressiva que impregna lâminas corpo a corpo. Força + Feitiçaria de Sangue vs. Vigor + Ocultismo. Inflige dano Agravado igual à margem a mortais e vampiros; mortais morrem instantaneamente e vampiros atingidos arriscam entrar em torpor ao dormir.",
    duration: "Uma cena",
    level: 5,
    name: "Carícia de Baal",
    rouse: true,
  },
  {
    cost: "Um Rouse Check",
    description:
      "Com um toque físico, o feiticeiro ferve instantaneamente o sangue dentro das próprias veias da vítima em agonia atroz. Determinação + Feitiçaria de Sangue vs. Autocontrole + Ocultismo. Cada margem causa 1 de dano Agravado; vítimas mortais falecem aos berros e vampiros aumentam 1 ponto de Fome por ponto de dano sofrido.",
    duration: "Um turno",
    level: 5,
    name: "Caldeirão de Sangue",
    rouse: true,
  },
  {
    cost: "Doze Rouse Checks",
    description:
      "Ritual de Nível 5. Cria dois círculos místicos interligados queimados no solo e consagrados por três noites. Ao entrar no círculo de partida e se concentrar por um turno, teletransporta-se instantaneamente para o círculo de chegada a qualquer distância do planeta.",
    duration: "Instantânea",
    level: 5,
    name: "Fuga para o Verdadeiro Santuário",
    rouse: true,
  },
  {
    cost: "Um Rouse Check",
    description:
      "Ritual de Nível 5. Após uma noite de meditação com uma vela acesa sobre o peito em uma laje de pedra, o coração do vampiro transforma-se em pedra sólida impenetrável. Fica imune a estacas de madeira e adquire total frieza emocional (+3 dados para resistir a Presença).",
    duration: "Indefinida",
    level: 5,
    name: "Coração de Pedra",
    rouse: true,
  },
  {
    cost: "Dois Rouse Checks",
    description:
      "Ritual de Nível 5. Entalha runas malévolas em uma estaca de freixo embebida em sangue e fogo. Confere +3 dados no ataque de empalação; se atingir o peito com margem 5+, o vampiro atingido desintegra-se em cinzas pela Morte Final no mesmo turno.",
    duration: "Um ataque",
    level: 5,
    name: "Estaca da Dissolução Tardia",
    rouse: true,
  },
];

const OBLIVION_POWERS: readonly PowerTemplate[] = [
  {
    cost: "Sem custo de sangue",
    description:
      "Manipula sombras ao redor do corpo para ocultar contornos e conferir ocultamento místico. Adiciona bônus a testes de Furtividade e confere vantagem em testes de Intimidação realizados na penumbra.",
    duration: "Uma cena",
    level: 1,
    name: "Sombra Palpável",
    rouse: false,
  },
  {
    cost: "Um Rouse Check",
    description:
      "Sintoniza a visão com a entropia do Vazio e da morte, permitindo ao usuário enxergar na escuridão absoluta e discernir espíritos de mortos, fantasmas e auras de seres doentes ou à beira da destruição.",
    duration: "Uma cena",
    level: 1,
    name: "Vista Cadavérica",
    rouse: true,
  },
  {
    cost: "Um Rouse Check",
    description:
      "Manifesta tentáculos de pura escuridão sólida a partir de sombras no ambiente para agarrar e esmagar adversários. Disputa Raciocínio + Oblívio vs. Destreza + Atletismo para imobilizar e sufocar alvos à distância.",
    duration: "Uma cena",
    level: 2,
    name: "Braços de Ahriman",
    rouse: true,
  },
  {
    cost: "Sem custo de sangue",
    description:
      "Oculta a forma do vampiro sob uma capa de sombras e reflexos negros enganosos, dificultando sua localização exata e concedendo bônus em esquiva e camuflagem no escuro.",
    duration: "Uma cena",
    level: 2,
    name: "Manto de Sombras",
    rouse: false,
  },
  {
    cost: "Um Rouse Check",
    description:
      "Canaliza a essência gelada e decadente do Vazio através do toque da mão, causando necrose instantânea e dano Agravado devastador a carnes vivas ou mortas-vivas e apodrecendo matéria orgânica.",
    duration: "Instantânea",
    level: 3,
    name: "Toque do Oblívio",
    rouse: true,
  },
  {
    cost: "Um Rouse Check",
    description:
      "Irradia uma aura de decadência e entropia que drena a vitalidade e vigor físico de inimigos no mesmo ambiente e acelera a ferrugem e desgaste de equipamentos e armas dos oponentes.",
    duration: "Uma cena",
    level: 3,
    name: "Sombra do Aniquilador",
    rouse: true,
  },
  {
    cost: "Um Rouse Check",
    description:
      "Apodrece instantaneamente os tecidos musculares e membros de um alvo por pura emanação cadavérica, infligindo ferimentos severos e inutilizando braços ou pernas da vítima pela dor ou atrofia.",
    duration: "Instantânea",
    level: 4,
    name: "Necrose",
    rouse: true,
  },
  {
    cost: "Um Rouse Check",
    description:
      "Captura e aprisiona a alma ou sombra errante de um fantasma ou espectro recém-falecido, forçando a entidade espiritual a responder a questionamentos ou cumprir serviços de vigilância na noite.",
    duration: "Uma noite",
    level: 4,
    name: "Aprisionar Alma",
    rouse: true,
  },
  {
    cost: "Dois Rouse Checks",
    description:
      "Abre uma fenda na própria tapeçaria da realidade conectando sombras distantes, permitindo ao vampiro e seus aliados transitarem por quilômetros de distância em um único passo no Vazio.",
    duration: "Instantânea",
    level: 5,
    name: "Túnel de Sombras",
    rouse: true,
  },
  {
    cost: "Um Rouse Check",
    description:
      "O vampiro dissolve sua carcaça física em um espectro de pura escuridão viva e maleável, imune a armas mundanas e capaz de esgueirar-se velozmente através das sombras da noite.",
    duration: "Uma cena",
    level: 5,
    name: "Passo Tenebroso",
    rouse: true,
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
