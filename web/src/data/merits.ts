// Catálogo oficial de Vantagens, Defeitos, Antecedentes e Características de Sangue-ralo (V5 PT-BR).
import type { MeritKind } from "#/lib/types";

export interface MeritTemplate {
  category?: string;
  description: string;
  levels?: readonly string[];
  name: string;
  points: number | readonly number[];
  tipo: MeritKind;
}

export const THIN_BLOOD_MERITS: readonly MeritTemplate[] = [
  {
    category: "Sangue-ralo",
    description:
      "Sua natureza mortal ainda ofusca sua Fera. Sua aura não parece vampírica ou sobrenatural; em vez disso, ela parece mortal para qualquer pessoa capaz de detectar criaturas sobrenaturais. Você também pode adicionar dois dados a qualquer tentativa de se fazer parecer mortal em outros aspectos, como maquiagem.",
    name: "A Aparência da Mortalidade",
    points: 1,
    tipo: "qualidade-sr",
  },
  {
    category: "Sangue-ralo",
    description:
      "Você tem uma afinidade por uma determinada Disciplina, escolhida na criação do personagem. Você ganha um ponto nessa Disciplina e pode aprender e manter pontos adicionais nela através de gastos de experiência, como se fosse um vampiro normal. (O custo em pontos de experiência é o mesmo que uma Disciplina fora do clã.) Beber sangue com Ressonância correspondente não recompensa você com pontos extras nessa Disciplina, temporários ou não.",
    name: "Afinidade de Disciplina",
    points: 1,
    tipo: "qualidade-sr",
  },
  {
    category: "Sangue-ralo",
    description:
      "Talvez você tenha sido um flebotomista na vida, ou simplesmente não gostasse de bagunça. Você bebe delicadamente e rapidamente, satisfazendo de forma organizada uma Fome em uma única rodada, incluindo lamber o ferimento fechado. Este Mérito só pode ser usado uma vez por cena. No Mundo das Trevas, o foco da história frequentemente recai sobre os Membros, com os mortais assumindo um papel nominal e transacional nas intrigas daqueles que carregam a Maldição de Caim e são assombrados pela Besta. Ghouls, no entanto, permitem um nicho distinto para narrativa e envolvimento, tornando-os atraentes como personagens jogáveis por direito próprio.",
    name: "Alimentador Rápido",
    points: 1,
    tipo: "qualidade-sr",
  },
  {
    category: "Sangue-ralo",
    description:
      "Você pode considerar Alquimia de Sangue Fino como uma Disciplina. RESILIÊNCIA VAMPÍRICA Você recebe dano como um vampiro comum. Defeitos VÍCIO (•) Perde um dado sem uma correção; V:tM, p. 180. ADVERSÁRIO (• A •••) Membros que se opõe a você; V:tM, p. 193. ARCAICO (••) Não pode usar tecnologia. Apenas Ancillae ou mais antigos; V:tM, p. 180. VÍCIO EM LAÇO SANGUÍNEO (•) Mais difícil resistir ao Laço de Sangue; V:tM, p. 181. ESCRAVO DE LAÇO (••) Facilmente ligado por Laço de Sangue; V:tM, p. 180. SEGREDO SOMBRIO (• A ••••) Se descoberto, você seria infame e caçado; V:tM, p. 187. DESPREZADO (••) Um grupo ou região da cidade o despreza; V:tM, p. 187. DESTITUÍDO (•) Sem dinheiro ou lar; V:tM, p. 193. NÃO GOSTO (•) A cidade geralmente não gosta de você; V:tM, pp. 187–188.",
    name: "Alquimista de Sangue Fino",
    points: 1,
    tipo: "qualidade-sr",
  },
  {
    category: "Sangue-ralo",
    description:
      "Quando estiver com Fome 0 ou 1, e ao acordar ao pôr do sol, role dois dados no seu Teste de Vigília e escolha o maior dos dois. l U cid d reamer A maioria dos vampiros não sonha porque não dorme. Você sonha; pode se lembrar e até controlar seus sonhos às vezes. Uma vez por sessão, se você estiver dormindo durante o dia, pode pedir ao Narrador para fornecer uma pista das memórias da noite anterior ou uma dica sobre a história adequada para a revelação em sonho. m ortality’s m ien Sua natureza mortal ainda supera sua Fera. Sua aura não parece vampírica ou sobrenatural; ao invés disso, parece mortal para qualquer pessoa capaz de detectar criaturas sobrenaturais.",
    name: "Baixo apetite",
    points: 1,
    tipo: "qualidade-sr",
  },
  {
    category: "Sangue-ralo",
    description:
      "A luz do sol reduz pela metade seu rastreador de Vitalidade (arredondado para cima), mas, caso contrário, simplesmente remove suas habilidades vampíricas, incluindo todas as Disciplinas e benefícios de Vitalidade, e não causa nenhum outro dano. No entanto, você ainda sofre de Fome e, mais cedo ou mais tarde, precisará dormir. Se sua Vitalidade cair abaixo dos níveis de dano atualmente sustentados como resultado de dano recebido sob a luz do sol.",
    name: "Bebedor diurno",
    points: 1,
    tipo: "qualidade-sr",
  },
  {
    category: "Sangue-ralo",
    description:
      "se você aceitar esta Falha. ■ Dependência de Vitae: Seu Sangue é incapaz de sustentar poderes vampíricos por si só. A menos que você beba sangue de vampiro suficiente para saciar uma Fome a cada semana, você perde sua capacidade de ganhar e usar quaisquer Disciplinas (incluindo Alquimia de Sangue Fino). Você recupera seus poderes assim que saciar pelo menos uma Fome com sangue de vampiro. méritos de sangue fino ■ Companheiros Anarquistas: Você fez amizade com os membros de uma coterie Anarquista que toleram sua presença ou até mesmo o tratam afetuosamente como seu mascote. Eles agem cumulativamente como um Mawla Anarquista de um ponto, desde que você não desvie da linha do grupo. Anote-os no Mapa de Relacionamentos.",
    name: "Camaradas Anarquistas",
    points: 1,
    tipo: "qualidade-sr",
  },
  {
    category: "Sangue-ralo",
    description:
      "Você pode criar Laços de Sangue e Abraço. BEBEDOR DIURNO Pode andar à luz do dia. AFINIDADE DISCIPLINAR Ganha um ponto em uma Disciplina, como um vampiro normal. IMUNE À FÉ Imune à Verdadeira Fé; p. 136. VIVO Medicamente mortal; você pode comer, beber, transar, etc. APETITE BAIXO Role dois dados em alguns Testes de Excitação; p. 136. SONHADOR LÚCIDO Você sonha e pode se lembrar de detalhes relevantes; p. 136. APARÊNCIA MORTAL Aura se apresenta como mortal; p. 136. ALIMENTADOR RÁPIDO Sacia uma Fome em um turno, incluindo fechar ferimentos; p. 136.",
    name: "Catenação de Sangue",
    points: 1,
    tipo: "qualidade-sr",
  },
  {
    category: "Sangue-ralo",
    description:
      "com esta falha; a Camarilla prospera com esse tipo de duplicidade.",
    name: "Contato da Camarilla",
    points: 1,
    tipo: "qualidade-sr",
  },
  {
    category: "Sangue-ralo",
    description:
      "Sua Fera está sempre com fome de mais, nunca encontrando sustento em goles menores. Ao se alimentar em uma cena, você satisfaz uma Fome a menos do que outros Sangue-Fraco. Isso se aplica apenas uma vez por cena. Méritos de Sangue-Fraco um BH ou sangue corrente Algo em seu sangue faz com que outros vampiros não consigam suportá-lo. Seja a mistura perversa de vida e morte-viva ou seu histórico de Alquimia de Sangue-Fraco questionável, outros vampiros engasgam e vomitam ao tentar se alimentar de você. Outros vampiros interrompem qualquer mordida",
    name: "Fome Infinita",
    points: 1,
    tipo: "qualidade-sr",
  },
  {
    category: "Sangue-ralo",
    description:
      "Você faz os outros se sentirem desconfortáveis ao seu redor. A maioria dos mortais não quer estar perto de você de jeito nenhum, e outros Membros te desprezam ainda mais do que desprezam os thin-bloods normais. Apenas thin-bloods conseguem se ajustar ao seu comportamento estranho. Perda de um dado em reservas Sociais envolvendo qualquer pessoa, exceto thin-bloods. Fome Infinita A sua Fera está sempre faminta por mais, nunca se saciando com pequenos goles. Ao se alimentar em uma cena, você satisfaz uma Fome a menos do que outros thin-bloods. Isso se aplica apenas uma vez por cena. Méritos de Thin-Bloods um BH ou corrente Sangue Algo em seu sangue faz com que outros vampiros não consigam suportá-lo.",
    name: "Presença do Crepúsculo",
    points: 1,
    tipo: "qualidade-sr",
  },
  {
    category: "Sangue-ralo",
    description:
      "Você tem um batimento cardíaco, pode comer comida e desfrutar atividades sexuais como um mortal. Todas as inspeções médicas, exceto as mais avançadas, não revelam nada fora do comum, assumindo que ocorram à noite.",
    name: "Realista",
    points: 1,
    tipo: "qualidade-sr",
  },
  {
    category: "Sangue-ralo",
    description:
      "Você recebe dano como um vampiro comum. Defeitos VÍCIO (•) Perde um dado sem solução; V:tM, p. 180. ADVERSÁRIO (• A •••) Membros que se opõe a você; V:tM, p. 193. ARCAICO (••) Não pode usar tecnologia. Apenas Ancillae ou mais antigos; V:tM, p. 180. VICIADO EM VÍNCULO (•) Mais difícil resistir ao Vínculo de Sangue; V:tM, p. 181. ESCRAVO DE VÍNCULO (••) Facilmente submetido ao Vínculo de Sangue; V:tM, p. 180. SEGREDO SOMBRIO (• A ••••) Se descoberto, você seria infame e caçado; V:tM, p. 187. DESPREZADO (••) Um grupo ou região da cidade te despreza; V:tM, p. 187. DESTITUÍDO (•) Sem dinheiro ou casa; V:tM, p. 193. DESGOSTADO (•) A cidade geralmente não gosta de você; V:tM, pp. 187–188. INIMIGOS (• A ••••) Caçadores mortais e adversários; V:tM, pp. 184–185.",
    name: "Resiliência Vampírica",
    points: 1,
    tipo: "qualidade-sr",
  },
  {
    category: "Sangue-ralo",
    description:
      "Algo no seu Sangue faz com que outros vampiros não consigam suportá-lo. Seja a mistura perversa de vida e morte-viva ou seu histórico de Alquimia de Sangue Fino questionável, outros vampiros engasgam e vomitam quando tentam beber de você. Outros vampiros abortam qualquer mordida",
    name: "Sangue Abominável",
    points: 1,
    tipo: "qualidade-sr",
  },
  {
    category: "Sangue-ralo",
    description:
      "A maioria dos vampiros não sonha porque não dorme. Você sonha; pode se lembrar e até, às vezes, controlar seus sonhos. Uma vez por sessão, se você estiver dormindo durante o dia, pode pedir ao Narrador para fornecer uma pista das memórias da noite anterior ou uma dica sobre a história adequada para revelação em sonhos. Sua natureza mortal ainda supera sua Besta. Sua aura não parece vampírica ou sobrenatural; ao contrário, parece mortal para qualquer um capaz de detectar criaturas sobrenaturais. Você também pode adicionar dois dados a qualquer tentativa de fazer-se parecer mortal em outros aspectos, como maquiagem. Alimentador Rápido Talvez você tenha sido um flebotomista na vida, ou simplesmente não gostava de bagunça.",
    name: "Sonhador Lúcido",
    points: 1,
    tipo: "qualidade-sr",
  },
  {
    category: "Sangue-ralo",
    description:
      "Quer você se considere ateu ou devotamente religioso, você continua muito próximo da mortalidade para que a Verdadeira Fé o afete.",
    name: "À prova de fé",
    points: 1,
    tipo: "qualidade-sr",
  },
];

export const THIN_BLOOD_FLAWS: readonly MeritTemplate[] = [
  {
    category: "Sangue-ralo",
    description:
      "Sua mordida é descuidada, ou seus dentes são mal adequados para perfurar a pele de forma limpa. Ao se alimentar, faça um teste de Destreza + Medicina contra uma Dificuldade igual à Fome saciada para cobrir suas marcas de alimentação antes que muito sangue seja derramado. Em caso de falha, a ferida fica muito irregular para fechar: o mortal pode sangrar até a morte com ferimentos no pescoço que ameaçam a Máscara. s U n-Desvanecido Você não pode usar poderes de Disciplina – incluindo Alquimia de Sangue Fino – à luz do sol, e poderes ativos cessam quando você entra na luz do sol. Você pode usá-los dentro de casa durante o dia, com uma penalidade de dois dados, desde que evite qualquer indício de luz solar.",
    name: "Bebedor Descuidado",
    points: 1,
    tipo: "defeito-sr",
  },
  {
    category: "Sangue-ralo",
    description:
      "Seu sangue não é forte o suficiente para sustentá-lo completamente e, como efeito, sua carne está em um estado constante de putrefação, com um tom esverdeado e um leve cheiro de podridão. Qualquer inspeção médica o identificará imediatamente como falecido, e você recebe uma penalidade de um dado em qualquer teste Social face a face com um mortal. Você não pode escolher a Habilidade Aparente se optar por esta Falha.",
    name: "Carne Morta",
    points: 1,
    tipo: "defeito-sr",
  },
  {
    category: "Sangue-ralo",
    description:
      "Seja pelo seu cheiro, sua aura ou algo ainda mais sutil, outras entidades sobrenaturais podem perceber sua presença. Elas podem estar curiosas, com fome ou irritadas, mas definitivamente te notam. Perda de dois dados das reservas de Furtividade e similares contra oponentes sobrenaturais, incluindo outros vampiros. Presença Inquietante Você deixa os outros desconfortáveis ao seu redor. A maioria dos mortais não quer estar perto de você de jeito nenhum, e outros Membros te desgostam ainda mais do que desgostam de thin-bloods comuns. Apenas thin-bloods conseguem se adaptar ao seu comportamento estranho. Perda de um dado das reservas Sociais envolvendo qualquer pessoa que não seja um Sangue-Ralo. Fome Incessante Sua Besta sempre tem mais fome, nunca se satisfaz com goles menores.",
    name: "Conta Sobrenatural",
    points: 1,
    tipo: "defeito-sr",
  },
  {
    category: "Sangue-ralo",
    description:
      "Você nunca desenvolve presas operadas, ou as que você tem são inúteis para alimentação. Ou você precisa abrir suas vítimas, ou extrair o sangue delas com uma seringa.",
    name: "Dentes de leite",
    points: 1,
    tipo: "defeito-sr",
  },
  {
    category: "Sangue-ralo",
    description:
      "Seu Sangue é incapaz de sustentar poderes vampíricos por si só. A menos que você beba sangue suficiente de vampiro para saciar uma Fome a cada semana, você perde a habilidade de ganhar e usar quaisquer Disciplinas (incluindo Alquimia de Sangue Fino). Você recupera seus poderes assim que saciar pelo menos uma Fome com sangue de vampiro. méritos de sangue fino",
    name: "Dependência Vitae",
    points: 1,
    tipo: "defeito-sr",
  },
  {
    category: "Sangue-ralo",
    description:
      "Você não pode usar poderes de Disciplina – incluindo Alquimia de Sangue Fino – à luz do sol, e poderes ativos cessam quando você entra na luz do sol. Você pode usá-los dentro de casa durante o dia, com uma penalidade de dois dados, desde que evite qualquer indício de luz solar. s U pernat U ral t ell Seja pelo seu cheiro, sua aura ou algo ainda mais sutil, outras entidades sobrenaturais podem sentir sua presença. Elas podem estar curiosas, com fome ou irritadas, mas com certeza percebem você. Perde dois dados de reservas de Furtividade e similares contra oponentes sobrenaturais, incluindo outros vampiros. t W ili",
    name: "Desbotado pelo sol",
    points: 1,
    tipo: "defeito-sr",
  },
  {
    category: "Sangue-ralo",
    description:
      "Você não pode Agitar o Sangue para curar, ao invés disso, cura como um mortal (p. 126). Você não pode obter Resistência Vampírica se escolher esta Deficiência.",
    name: "Fragilidade Mortal",
    points: 1,
    tipo: "defeito-sr",
  },
  {
    category: "Sangue-ralo",
    description:
      "Um Suserano excessivamente cauteloso martelou o lembrete de evitar a luz do sol em você de forma um pouco exagerada, ou você viu alguém pegar fogo ao nascer do sol logo após seu Abraço. De qualquer forma, você teme a luz do sol como se fosse um vampiro completo. Você é suscetível à fúria aterrorizante causada pela luz do sol. n i",
    name: "Heliofobia",
    points: 1,
    tipo: "defeito-sr",
  },
  {
    category: "Sangue-ralo",
    description:
      "Um Caitiff por um fio de cabelo, você ainda sofre a maldição do clã de seu progenitor. Embora isso às vezes possa ajudá-lo a passar por um membro desse clã, na maioria das vezes só acrescenta mais uma dor à sua existência torturada. Você sofre de uma praga de clã vampírico de sua escolha, provavelmente a de seu progenitor (se ao menos souber quem ele é). Sua gravidade é reduzida pela metade (arredondando para baixo, mínimo de 1).",
    name: "Maldição do Clã",
    points: 1,
    tipo: "defeito-sr",
  },
  {
    category: "Sangue-ralo",
    description:
      "Em algumas cidades, os governantes simplesmente caçam e destroem os de sangue fino. Em outras cidades, o misericordioso Xerife apenas os marca, forçosamente e dolorosamente, para lembrá-los de seu lugar. (Muitos são então caçados e destruídos, frequentemente por ofensas percebidas ou simples caprichos.) Você tem tal marca que não cicatriza, e a Camarilla garante que ela seja mantida",
    name: "Marcado pela Camarilla",
    points: 1,
    tipo: "defeito-sr",
  },
  {
    category: "Sangue-ralo",
    description:
      "Ainda suscetíveis a doenças mortais, sempre que se alimentam têm uma chance de contrair uma doença ao rolar um dado e sair '1'. A medicina mortal não te cura, apenas saciar uma fome 0 graças a um sistema imunológico saudável faz isso.",
    name: "Portadores da Peste",
    points: 1,
    tipo: "defeito-sr",
  },
  {
    category: "Sangue-ralo",
    description:
      "Você quebrou uma regra não escrita ou se achou igual entre iguais, onde alguns se mostraram mais iguais que outros. Em qualquer caso, os Anarcas do regnum sabem de você e o evitam. Eles prefeririam jogá-lo para a Camarilla do que ouvir suas súplicas. Você não pode ter Companheiros Anarcas se assumir esta Falha.",
    name: "Rejeitado pelos Anarquistas",
    points: 1,
    tipo: "defeito-sr",
  },
  {
    category: "Sangue-ralo",
    description:
      "Você está afligido com a Besta equivalente a um vampiro completo. Você precisa testar para frenesi de acordo com as regras normais de vampiro.",
    name: "Temperamento Bestial",
    points: 1,
    tipo: "defeito-sr",
  },
  {
    category: "Sangue-ralo",
    description:
      "Você dorme como de costume, sem lembrar de quaisquer sonhos que possa ter tido durante o dia. No entanto, à noite, esses sonhos vêm à tona nos momentos mais inoportunos. Durante períodos de estresse, ou quando sua Fera está mais forte, pesadelos surgem e parecem dolorosamente reais. Eles podem ser alucinações desconexas, ou podem ser uma forma do Narrador alimentar um tema ou prever eventos. Uma vez por sessão, seus terrores noturnos começam e você sofre uma penalidade de um dado em todas as ações pelo restante da cena. Você ainda é suscetível a doenças mortais: resfriados, gripe e outras infecções mais graves.",
    name: "Terrores Noturnos",
    points: 1,
    tipo: "defeito-sr",
  },
];

export const BACKGROUNDS: readonly MeritTemplate[] = [
  {
    category: "Antecedente",
    description:
      "Mortais que ajudam você por lealdade, dívida ou amizade, não por dinheiro.",
    levels: [
      "Um aliado fraco ou de pouca disposição.",
      "Um aliado comum, disposto a arriscar pouco.",
      "Um aliado capaz, que corre riscos por você.",
      "Um aliado poderoso ou um grupo pequeno e unido.",
      "Aliados influentes que mudam o jogo quando chamados.",
    ],
    name: "Aliados",
    points: [1, 2, 3, 4, 5],
    tipo: "vantagem",
  },
  {
    category: "Antecedente",
    description:
      "Pessoas que passam informação ou prestam pequenos favores no dia a dia.",
    levels: [
      "Um contato num único meio, com fofoca de rua.",
      "Contato bem posicionado que consegue dados pontuais.",
      "Rede em alguns meios; informação confiável em dias.",
      "Fontes em lugares sensíveis: polícia, imprensa, empresas.",
      "Rede ampla que descobre quase tudo em pouco tempo.",
    ],
    name: "Contatos",
    points: [1, 2, 3, 4, 5],
    tipo: "vantagem",
  },
  {
    category: "Antecedente",
    description:
      "Reconhecimento público entre mortais. Abre portas sociais, mas atrai atenção.",
    levels: [
      "Conhecido num nicho ou numa cena local.",
      "Reconhecido na cidade por quem acompanha a sua área.",
      "Celebridade regional; estranhos pedem fotos.",
      "Famoso no país; a imprensa segue seus passos.",
      "Ícone internacional; impossível passar despercebido.",
    ],
    name: "Fama",
    points: [1, 2, 3, 4, 5],
    tipo: "vantagem",
  },
  {
    category: "Antecedente",
    description:
      "Peso social, político e institucional dentro do domínio mortal.",
    levels: [
      "Voz num bairro ou num grupo pequeno.",
      "Respeitado numa comunidade ou repartição.",
      "Influente numa instituição da cidade.",
      "Peso político na cidade; move decisões importantes.",
      "Controla uma instituição ou fala pela cidade inteira.",
    ],
    name: "Influência",
    points: [1, 2, 3, 4, 5],
    tipo: "vantagem",
  },
  {
    category: "Antecedente",
    description:
      "Servos leais (carniçais ou humanos dominados) que cumprem ordens diretas.",
    levels: [
      "Um servo fraco ou pouco confiável.",
      "Um servo competente para tarefas do dia a dia.",
      "Um servo capaz e leal, ou dois comuns.",
      "Servo excepcional, ou um pequeno grupo bem treinado.",
      "Um séquito leal que cumpre qualquer ordem.",
    ],
    name: "Lacaios",
    points: [1, 2, 3, 4, 5],
    tipo: "vantagem",
  },
  {
    category: "Antecedente",
    description:
      "Identidade mortal falsa, com documentos oficiais e histórico registrado.",
    levels: [
      "Documentos básicos que passam numa olhada rápida.",
      "Identidade sólida com histórico simples: conta, endereço, emprego.",
      "Identidade que resiste a uma investigação policial comum.",
      "Vida inteira forjada, com registros oficiais e testemunhas.",
      "Passado impecável, resistente até a agências de inteligência.",
    ],
    name: "Máscara",
    points: [1, 2, 3, 4, 5],
    tipo: "vantagem",
  },
  {
    category: "Antecedente",
    description:
      "Um Membro mais velho que aconselha, orienta e protege você na sociedade vampírica.",
    levels: [
      "Um ancilla que responde perguntas de vez em quando.",
      "Mentor com alguma posição; ajuda quando é conveniente.",
      "Membro respeitado que intercede por você na corte.",
      "Ancião influente que protege você de rivais.",
      "Uma figura de poder na cidade te trata como protegido.",
    ],
    name: "Mawla",
    points: [1, 2, 3, 4, 5],
    tipo: "vantagem",
  },
  {
    category: "Antecedente",
    description:
      "Mortais de quem você se alimenta com regularidade, facilidade e segurança.",
    levels: [
      "Poucos mortais; reduz a Fome em 1 por semana, com cuidado.",
      "Um grupo pequeno; alimentação fácil algumas noites.",
      "Rebanho estável; quase nunca precisa caçar.",
      "Rebanho grande e variado; escolha de Ressonância.",
      "Um culto ou comunidade inteira à sua disposição.",
    ],
    name: "Rebanho",
    points: [1, 2, 3, 4, 5],
    tipo: "vantagem",
  },
  {
    category: "Antecedente",
    description:
      "Recursos financeiros, ativos líquidos, renda, contas bancárias e investimentos.",
    levels: [
      "Renda modesta; paga as contas sem sobras.",
      "Classe média confortável; alguns luxos.",
      "Rico; propriedades e dinheiro para gastar sem pensar.",
      "Muito rico; empresas, imóveis e investimentos volumosos.",
      "Fortuna imensa; poucos mortais no mundo têm tanto.",
    ],
    name: "Recursos",
    points: [1, 2, 3, 4, 5],
    tipo: "vantagem",
  },
  {
    category: "Antecedente",
    description: "O refúgio seguro onde você descansa durante as horas do dia.",
    levels: [
      "Um quarto seguro ou apartamento pequeno, pouco protegido.",
      "Casa ou apartamento discreto, com trancas e janelas vedadas.",
      "Imóvel amplo e seguro, difícil de achar ou invadir.",
      "Fortaleza urbana: vários cômodos, saídas escondidas, vigilância.",
      "Domínio quase inviolável, protegido e ignorado pelos mortais.",
    ],
    name: "Refúgio",
    points: [1, 2, 3, 4, 5],
    tipo: "vantagem",
  },
  {
    category: "Antecedente",
    description:
      "Posição, honra e renome na hierarquia da sociedade vampírica local.",
    levels: [
      "Conhecido e aceito; não é mais um neófito qualquer.",
      "Respeitado; sua palavra conta em disputas menores.",
      "Figura de destaque, com cargo ou favor reconhecido.",
      "Autoridade: Primógeno, Harpia ou equivalente.",
      "O topo da cidade: Príncipe, Barão ou braço direito.",
    ],
    name: "Status",
    points: [1, 2, 3, 4, 5],
    tipo: "vantagem",
  },
];

export const COMMON_MERITS: readonly MeritTemplate[] = [
  {
    category: "Aparência",
    description:
      "Aparência marcante e atraente que concede bônus em testes sociais onde a aparência influencia.",
    name: "Bonito",
    points: 2,
    tipo: "vantagem",
  },
  {
    category: "Aparência",
    description:
      "Beleza sobrenatural hipnotizante. +2 dados em testes sociais pertinentes; impossível passar despercebido.",
    name: "Deslumbrante",
    points: 4,
    tipo: "vantagem",
  },
  {
    category: "Alimentação",
    description:
      "Capaz de digerir sangue frio, rançoso ou armazenado em bolsas médicas sem penalidade de náusea.",
    name: "Estômago de Ferro",
    points: 3,
    tipo: "vantagem",
  },
  {
    category: "Linguística",
    description:
      "Fluência em idiomas adicionais além da língua materna (1 idioma por ponto).",
    name: "Linguística",
    points: [1, 2, 3, 4, 5],
    tipo: "vantagem",
  },
  {
    category: "Físico",
    description:
      "Capaz de ingerir alimentos sólidos e bebidas humanas para manter o disfarce de mortalidade sem vomitar.",
    name: "Comer Comida",
    points: 2,
    tipo: "vantagem",
  },
];

export const COMMON_FLAWS: readonly MeritTemplate[] = [
  {
    category: "Aparência",
    description:
      "Aparência desagradável, grotesca ou perturbadora. -2 dados em testes sociais aplicáveis.",
    name: "Feio",
    points: 2,
    tipo: "defeito",
  },
  {
    category: "Aparência",
    description:
      "Aparência monstruosa que viola a Máscara à primeira vista. Falha automática na maioria das interações comuns.",
    name: "Monstruoso",
    points: 4,
    tipo: "defeito",
  },
  {
    category: "Alimentação",
    description:
      "Você não consegue ingerir sangue humano; apenas sangue animal sacia sua fome.",
    name: "Vegano",
    points: 2,
    tipo: "defeito",
  },
  {
    category: "Alimentação",
    description:
      "Você se recusa ou é incapaz de se alimentar de uma determinada classe de presas humanas.",
    name: "Presa Excluída",
    points: 1,
    tipo: "defeito",
  },
  {
    category: "Inimigos",
    description:
      "Um mortal ou Membro rival trabalha ativamente para prejudicar seus planos e causar sua ruína.",
    name: "Inimigo",
    points: [1, 2, 3, 4, 5],
    tipo: "defeito",
  },
  {
    category: "Segredos",
    description:
      "Um delito, transgressão passada ou crime gravíssimo que, se revelado, custará sua posição ou sua Morte Final.",
    name: "Segredo Obscuro",
    points: [1, 2, 3, 4, 5],
    tipo: "defeito",
  },
  {
    category: "Ameaça",
    description:
      "Um caçador da Segunda Inquisição, policial ou investigador obsessivo segue o seu rastro na noite.",
    name: "Perseguido",
    points: [1, 2, 3, 4, 5],
    tipo: "defeito",
  },
  {
    category: "Social",
    description:
      "Considerado um pária ou traidor por uma facção, clã ou corte local; outros Membros evitam contato público.",
    name: "Evitado",
    points: [1, 2, 3, 4, 5],
    tipo: "defeito",
  },
  {
    category: "Sobrenatural",
    description:
      "Uma aparição, fantasma ou espírito atormentador manifesta-se nos seus momentos de descanso ou crise.",
    name: "Assombrado",
    points: [1, 2, 3, 4, 5],
    tipo: "defeito",
  },
  {
    category: "Psicológico",
    description:
      "Dependência grave de álcool ou narcóticos; você precisa se alimentar de vítimas sob o efeito da substância.",
    name: "Vício",
    points: 1,
    tipo: "defeito",
  },
];

export const ALL_MERIT_TEMPLATES: readonly MeritTemplate[] = [
  ...BACKGROUNDS,
  ...COMMON_MERITS,
  ...COMMON_FLAWS,
  ...THIN_BLOOD_MERITS,
  ...THIN_BLOOD_FLAWS,
];

const NORMALIZE = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

export function findMerit(name: string | undefined): MeritTemplate | undefined {
  if (!name) {
    return undefined;
  }
  const clean = name.trim();
  const baseName = clean.replace(/\s*\([^)]*\)/g, "").trim();
  const normBase = NORMALIZE(baseName);
  const normClean = NORMALIZE(clean);

  // Busca exata primeiro
  const exact = ALL_MERIT_TEMPLATES.find((m) => {
    const normM = NORMALIZE(m.name);
    return normM === normBase || normM === normClean;
  });
  if (exact) {
    return exact;
  }

  // Busca por prefixo (ex: "Recursos (herança)" -> "Recursos")
  return ALL_MERIT_TEMPLATES.find((m) => {
    const normM = NORMALIZE(m.name);
    return normClean.startsWith(normM) || normM.startsWith(normBase);
  });
}

/** Valores de pontos aceitos: o custo fixo ou a faixa do catálogo. */
export function meritPointOptions(m: MeritTemplate): readonly number[] {
  return typeof m.points === "number" ? [m.points] : m.points;
}

/** "•" / "••" para custo fixo, "•–•••••" para faixa. */
export function meritRangeLabel(values: readonly number[]): string {
  const min = Math.min(...values);
  const max = Math.max(...values);
  return min === max
    ? "•".repeat(min)
    : `${"•".repeat(min)}–${"•".repeat(max)}`;
}

const GROUP_LABEL: Record<string, string> = { Antecedente: "Antecedentes" };

export function meritGroupLabel(category: string | undefined): string {
  if (!category) {
    return "Outros";
  }
  return GROUP_LABEL[category] ?? category;
}

/** Opções do Passo 7: gerais sempre; Sangue-ralo só para Sangue Fraco. */
export function meritOptions(thin: boolean): readonly MeritTemplate[] {
  return thin
    ? ALL_MERIT_TEMPLATES
    : [...BACKGROUNDS, ...COMMON_MERITS, ...COMMON_FLAWS];
}

export type MeritTab = "todos" | "vantagens" | "defeitos";

export const isFlawKind = (tipo: MeritKind) =>
  tipo === "defeito" || tipo === "defeito-sr";

/** Filtra por aba e busca (sem acento/maiúsculas); acertos no nome vêm primeiro. */
export function filterMeritOptions(
  options: readonly MeritTemplate[],
  { tab, query }: { query: string; tab: MeritTab }
): MeritTemplate[] {
  const q = NORMALIZE(query);
  const inTab = options.filter(
    (m) => tab === "todos" || (tab === "defeitos") === isFlawKind(m.tipo)
  );
  if (!q) {
    return inTab;
  }
  const rank = (m: MeritTemplate) => {
    if (NORMALIZE(m.name).includes(q)) {
      return 0;
    }
    if (NORMALIZE(meritGroupLabel(m.category)).includes(q)) {
      return 1;
    }
    return NORMALIZE(m.description).includes(q) ? 2 : -1;
  };
  const hits = inTab.map((m) => ({ m, r: rank(m) })).filter(({ r }) => r >= 0);
  return [0, 1, 2].flatMap((r) =>
    hits.filter((h) => h.r === r).map((h) => h.m)
  );
}

export interface MeritGroup {
  items: MeritTemplate[];
  label: string;
}

/** Agrupa pela categoria, na ordem da primeira aparição. */
export function groupMeritOptions(
  list: readonly MeritTemplate[]
): MeritGroup[] {
  const groups: MeritGroup[] = [];
  for (const m of list) {
    const label = meritGroupLabel(m.category);
    const group = groups.find((g) => g.label === label);
    if (group) {
      group.items.push(m);
    } else {
      groups.push({ items: [m], label });
    }
  }
  return groups;
}

export const sameMeritName = (a: string, b: string) =>
  NORMALIZE(a) === NORMALIZE(b);
