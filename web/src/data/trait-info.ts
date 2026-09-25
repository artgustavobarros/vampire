// Descrições próprias, não do livro. Revisar com a mesa.
// Portado de "Mudanças desde o último standalone" (painel lateral de descrição).

export type StateKind =
  | "fome"
  | "humanidade"
  | "vitalidade"
  | "vontade"
  | "ressonancia";

/** [kicker, título, descrição, níveis [marcador, texto], nota] */
export type TraitInfo = readonly [
  string,
  string,
  string,
  readonly (readonly [string, string])[],
  string,
];

/** [prefixo do nome em minúsculas, tipo, nome canônico, descrição, texto de cada ponto (1 a 5)] */
export type MeritInfo = readonly [
  string,
  "vantagem" | "defeito",
  string,
  string,
  readonly string[],
];

export const ATTR_INFO: Readonly<
  Record<string, readonly [string, readonly string[]]>
> = {
  Autocontrole: [
    "O Autocontrole permite qeu você permaneça calmo, controle suas emoções e tranquilize os outros. Também representa sua capacidade de manter a calma em tudo, de tiroteios a encontros íntimos. Autocontrole + Determinação resultam na sua Força de Vontade.",
    [
     "O menor insulto ou confronto pode levá-lo ao frenesi.","Você pode subjugar seus instintos predatórios na maioria das situações não hostis.","Outros procuram sua orientação quando o sangue atinge o ventilador.","Você pode blefar sem esforço nas cartas e administrar sua Besta até certo ponto.","A Besta é seu animal de estimação."
    ],
  ],
  Carisma: [
    "O Carisma mede seu charme natural, graça e sex appeal. Quando você tem este Atributo, ele atrai as pessoas para você, facilitando muito sua alimentação. O Carisma não depende de boa aparência, que é a sua própria Qualidade.",
    [
      "Você pode falar claramente, embora pocucas pesoas tendam a ouvir.",
      "Geralmente agradável, apesar de sua natureza não viva, você pode até fazer amigos.",
      "As pessoas confiam em você implicatmente, por isso você faz amigos com facilidade.",
      "Você possui magnetismo pessoal significativo e atrai seguidores como moscas.",
      "Você pode liderar uma cidade em rebelião, se assim quiser.",
    ],
  ],
  Destreza: [
    "A Destreza governa sua agilidade e elegância, a rapidez com que você se esquiva de uma estaca que mira seu coração e quanto controle motor fino você possui quando está contra o relógio",
    [
      "Você pode correr, mas se equilibrar e se esquivar são um desafio.","Sua arrancada é sólida e, às vezes, você parece gracioso em seus movimentos.","Sua agilidade é impressionante e sua coordenação é tao boa quanot a de qualquer amador treinado","Você pode se destacar em acrobacias e se mover de uma mneira que poucos humanos conseguem.","Seus movimentos são fluidos e hipnóticos - quase sobre-humanos."
    ],
  ],
  Determinação: [
    "A Determinação fornece foco e propósito. Ela mede sua concentração e fortitude mental. A Determinação impele vigílias que varam a noite e bloqueiam distrações. Sua Força de Vontade é igual ao seu Autocontrole + Determinação.",
    [
    "Você só presta atenção nas coisas mais urgentes.","Você consegue se concentrar por um long período, contanto que não seja muito longo.","Distraí-lo exige mais esforço do que a maioria das pessoas está disposta a fazer.","Voc~e pode superar obstáculos e chegar a uma dedução empregando nada mais do que força-bruta mental.","Você consegue pensar em meio a um tiroteio ou vigiar a porta de uma orgia de sangue e depois limpar cada gota ou projétil derramado."
    ],
  ],
  Força: [
    "A Força determina o tamanho de um mortal que você pode levantar, o quão forte você pode atingi-lo e o quanto de força você pode obrigar seu corpo mortor a exercer.",
    [
      "Você pode esmagar facilmente uma lavinha de cerveja.",
      "Você é fisicamente mediano.",
      "Você pode ser capaz de arrombar uma porta de madeira.",
      "Você é uma espécime de físico privilegiado, provavelmente com uma musculatura vistosa.",
      "Você é um verdadeiro pináculo de força e provavlmente é capaz de arrombar uma porta corta-fogo de metal, rasgar uma cerca de arame ou estourar um portão trnacado por correntes.",
    ],
  ],
  Inteligência: [
    "A Inteligência mede sua capacidade de pensar, pesquisar e aplicar a lógica. Você pode lembrar e analisar informações de livros ou de seus sentidos. Nenhum enimga ou mistério pode iludir os verdadeiramente inteligentes.",
    [
      "Você pode ler escrever com competência, embora alguns termos o confundam.","Você é inteligente o suficiente para perceber suas limitações.","Você é brilhante, capaz de juntar pistas sem dificuldade.","Você provavelmente é consultado por membro do Clã Tremere por sua sabedoria.",'O termo "gênio" não abarca as profundezas e o alcance de seu intelecto.'
    ],
  ],
  Manipulação: [
    "Manipulação é a sua capacidade de convecer os outros do seu ponto de vista, mentir de forma convincente e partir após enganar alguém sem que ninguém tenha notado.",
    [
      "Desde que seja honesto, você pode convencer as pessoas a fazer o qeu você quer.",
      "Sua capacidade de enganar supera a vontade dos simplórios e fracos de mente.",
      "Você nunca precisa pagar o preço total de nada.",
      "Você poderia ser um líder de um culto - ou um político",
      "Você poderia convencer o Príncipe a investir em propriedades no deserto, ou talvez até a cancelar uma Caçada de SAngue por sua cabeça.",
    ],
  ],
  Raciocínio: [
    'O Raciocínio é usado para pensar com rapidez e reagir corretamente com base em pouca informação. "Você ouve um som" é Raciocínio; "Você ouve dois guardas chegando" é Inteligência. O Raciocínio permite qeu você perceba uma emboscada ou responda de bate-pronto à Harpia no tribunal, em vez de pensar na melhor responsta apenas na noite seguinte.',
    [
      "Você acaba entendendo, mas precisa de explicação.","Voc~e pode apostar a sorte no póquer ou pisar nos freios a tempo. Quase sempre.", "Você pode analisar uma situação e descobrir rapidamente a melhor rota de fuga.","Voc~e nunac é pego desprevenido e sempre tem uma resposta inteligente na ponta da língua.","Você poensa e responde mais rapidamente do que a maioria das pessoas pode compreender."
    ],
  ],
  Vigor: [
    "Sua resistência física. Vigor absorve danos físicos, como uma bala em alta velocidade ou a lâmina de um caçador, além de permitir que você não ce a esforço árduo. Seu Vigor + 3 resulta no seu valor de Vitalidade",
    [
        "Mesmo esforços menores o deixam sem fôlego.",
        "Você pode levar uma surra, mas considera fazer as pazes.",
        "Alguns dias da caminhada difícil com uma mochila pesada não são problema para você",
        "Você pode vencer uma maratona ou aguentar grandes quantidades de dor, ao menos fisicamente.",
        "Mesmo se fosse um mortal, você nunca derramaria uma gota de suor."
    ],
  ],
};

export const SKILL_SCALE: readonly string[] = [
  "Novato. Conhece o básico.",
  "Praticante. Usa com alguma frequência.",
  "Competente. Nível profissional.",
  "Especialista. Referência entre profissionais.",
  "Mestre. Entre os melhores do mundo.",
];

export const SKILL_INFO: Readonly<Record<string, readonly [string, string]>> = {
  "Armas Brancas": [
    "Luta com facas, espadas, bastões e objetos improvisados.",
    "Facas, Espadas, Bastões",
  ],
  "Armas de Fogo": [
    "Mira, uso e manutenção de pistolas, rifles e escopetas.",
    "Pistolas, Rifles, Recarga rápida",
  ],
  Atletismo: [
    "Correr, saltar, escalar, nadar e arremessar.",
    "Corrida, Escalada, Parkour",
  ],
  Briga: [
    "Combate desarmado: socos, chutes e agarrões.",
    "Agarrar, Boxe, Briga de rua",
  ],
  Ciência: [
    "Conhecimento científico e método. Exige especialidade.",
    "Química, Biologia, Física",
  ],
  Condução: [
    "Dirigir em situações difíceis.",
    "Perseguição, Motocicletas, Caminhões",
  ],
  "Empatia com Animais": [
    "Ler, acalmar e treinar animais.",
    "Cães, Cavalos, Ratos",
  ],
  Erudição: [
    "Humanidades: história, arte, línguas. Exige especialidade.",
    "História, Línguas, Arte",
  ],
  Etiqueta: [
    "Conhecer e seguir as regras de cada ambiente social.",
    "Elysium, Alta sociedade, Corporativo",
  ],
  Finanças: [
    "Dinheiro, contabilidade e mercado.",
    "Lavagem, Bolsa, Contabilidade",
  ],
  Furtividade: [
    "Mover-se sem ser visto ou ouvido; esconder-se.",
    "Sombras, Multidões, Emboscada",
  ],
  Intimidação: [
    "Impor medo por presença, ameaça ou violência implícita.",
    "Ameaças veladas, Interrogatório",
  ],
  Investigação: [
    "Encontrar pistas e reconstruir o que aconteceu.",
    "Cena de crime, Pesquisa, Perícia",
  ],
  Ladroagem: [
    "Arrombar fechaduras, bater carteiras, burlar alarmes.",
    "Fechaduras, Punga, Cofres",
  ],
  Liderança: [
    "Comandar, organizar e inspirar grupos.",
    "Discursos, Táticas, Seguidores",
  ],
  Manha: [
    "Conhecimento das ruas: gírias, contatos, mercado negro.",
    "Drogas, Gangues, Mercado negro",
  ],
  Medicina: [
    "Diagnóstico, primeiros socorros e cirurgia.",
    "Primeiros socorros, Cirurgia, Venenos",
  ],
  Ocultismo: [
    "Saber sobre o sobrenatural, ritos e lendas.",
    "Magia, Lendas vampíricas, Fantasmas",
  ],
  Ofícios: [
    "Criar e consertar coisas com as mãos. Exige especialidade.",
    "Marcenaria, Mecânica, Pintura",
  ],
  Percepção: [
    "Notar detalhes, perigos e o que está fora do lugar.",
    "Emboscadas, Visão, Audição",
  ],
  Performance: [
    "Atuar, cantar, dançar ou tocar. Exige especialidade.",
    "Canto, Dança, Stand-up",
  ],
  Persuasão: [
    "Convencer com argumento, charme ou negociação.",
    "Negociação, Sedução, Retórica",
  ],
  Política: [
    "Entender e mover poder, hierarquias e burocracia.",
    "Camarilla, Prefeitura, Polícia",
  ],
  Sagacidade: [
    "Perceber intenções e emoções pelo comportamento.",
    "Mentiras, Emoções, Motivações",
  ],
  Sobrevivência: [
    "Orientar-se, rastrear e abrigar-se fora da cidade.",
    "Rastrear, Floresta, Abrigo",
  ],
  Subterfúgio: [
    "Mentir, disfarçar e enganar com convicção.",
    "Mentira, Disfarce, Blefe",
  ],
  Tecnologia: [
    "Computadores, redes e eletrônicos.",
    "Hacking, Segurança, Celulares",
  ],
};

export const DISC_INFO: Readonly<Record<string, string>> = {
  "Alquimia de Sangue-fraco":
    "Fórmulas que imitam Disciplinas usando sangue fraco.",
  Animalismo: "Domínio sobre animais e sobre a Besta, a sua e a dos outros.",
  Auspícios:
    "Sentidos sobrenaturais: ver auras, ler pensamentos, pressentir o que vem.",
  Celeridade: "Velocidade e reflexos acima do humano.",
  Domínio: "Controle da mente alheia pelo olhar e pela voz.",
  "Feitiçaria de Sangue": "Magia feita com vitae: rituais e poderes de sangue.",
  Fortitude: "Resistência sobrenatural a dano, dor e controle mental.",
  Oblívio: "Manipulação das sombras e da energia dos mortos.",
  Ofuscação:
    "Passar despercebido, sumir da mente dos outros, assumir outro rosto.",
  Potência: "Força física sobrenatural.",
  Presença: "Poder emocional: fascinar, aterrorizar, fazer-se amado.",
  Protean: "Mudança de forma: garras, fundir-se à terra, virar animal.",
};

export const TRAIT_INFO: Readonly<Record<StateKind, TraitInfo>> = {
  fome: [
    "Estado",
    "Fome",
    "A necessidade de sangue. Cada ponto vira um dado de Fome nas rolagens: um 1 nesses dados pode virar falha bestial, e um 10 pode virar crítico confuso.",
    [
      ["1", "Saciado, mas já sente o chamado."],
      ["2", "Incomodado. O cheiro de sangue distrai."],
      ["3", "Faminto. Difícil ignorar uma ferida aberta."],
      ["4", "Voraz. Resistir à Besta fica mais difícil."],
      ["5", "No limite. Qualquer provocação vira frenesi."],
    ],
    "Sobe com o Rouse Check. Desce quando você se alimenta.",
  ],
  humanidade: [
    "Estado",
    "Humanidade",
    "O quanto do mortal ainda resta. Quanto mais baixa, mais a Besta fala por você.",
    [
      ["1", "À beira de perder-se para sempre."],
      ["2", "Quase só Besta."],
      ["3", "Monstro com boas maneiras."],
      ["4", "Cruel. A violência vem fácil."],
      ["5", "Distante. Mortais viram meios."],
      ["6", "Frio. Justifica o que antes evitaria."],
      ["7", "A média dos Membros. A máscara ainda é natural."],
      ["8", "Humano. Sente culpa real."],
      ["9", "Compassivo. Ainda cora e se aquece."],
      ["10", "Santo. Quase ninguém chega aqui."],
    ],
    "Manchas vêm de violar seus Princípios. No fim da sessão, cada mancha pode custar um ponto.",
  ],
  ressonancia: [
    "Sangue",
    "Ressonância",
    "O sabor emocional do sangue da presa. Cada humor fortalece certas Disciplinas enquanto dura.",
    [
      ["Colérico", "Celeridade, Potência"],
      ["Melancólico", "Fortitude, Oblívio"],
      ["Fleumático", "Auspícios, Domínio"],
      ["Sanguíneo", "Feitiçaria de Sangue, Presença"],
      ["Animal", "Animalismo, Protean"],
    ],
    "A intensidade define por quanto tempo e quanto o bônus vale.",
  ],
  vitalidade: [
    "Rastreador",
    "Vitalidade",
    "Quanto dano o corpo aguenta antes de cair. Máximo: Vigor + 3.",
    [
      ["/", "Superficial. Cura com sangue ao despertar ou com Rouse Check."],
      ["✕", "Agravado. Vem de fogo, sol e presas; demora muito mais a curar."],
    ],
    "Quando todas as caixas estão marcadas, você cai em torpor.",
  ],
  vontade: [
    "Rastreador",
    "Força de Vontade",
    "Reserva de determinação. Máximo: Autocontrole + Determinação.",
    [
      ["/", "Superficial. Volta com descanso e ao cumprir Desejos."],
      ["✕", "Agravado. Vem de trauma e de agir contra si mesmo."],
    ],
    "Gaste um ponto para rerrolar até três dados comuns.",
  ],
};

const NAO_EXISTE = "Não existe neste nível.";

const REFUGIO: readonly string[] = [
  "Um quarto seguro ou apartamento pequeno, pouco protegido.",
  "Casa ou apartamento discreto, com trancas e janelas vedadas.",
  "Imóvel amplo e seguro, difícil de achar ou invadir.",
  "Fortaleza urbana: vários cômodos, saídas escondidas, vigilância.",
  "Domínio quase inviolável, protegido e ignorado pelos mortais.",
];

const LACAIOS: readonly string[] = [
  "Um servo fraco ou pouco confiável.",
  "Um servo competente para tarefas do dia a dia.",
  "Um servo capaz e leal, ou dois comuns.",
  "Servo excepcional, ou um pequeno grupo bem treinado.",
  "Um séquito leal que cumpre qualquer ordem.",
];

const MASCARA: readonly string[] = [
  "Documentos básicos que passam numa olhada rápida.",
  "Identidade sólida com histórico simples: conta, endereço, emprego.",
  "Identidade que resiste a uma investigação policial comum.",
  "Vida inteira forjada, com registros oficiais e testemunhas.",
  "Passado impecável, resistente até a agências de inteligência.",
];

export const MERIT_INFO: readonly MeritInfo[] = [
  [
    "aliad",
    "vantagem",
    "Aliados",
    "Mortais que ajudam você por lealdade, não por dinheiro.",
    [
      "Um aliado fraco ou de pouca disposição.",
      "Um aliado comum, disposto a arriscar pouco.",
      "Um aliado capaz, que corre riscos por você.",
      "Um aliado poderoso ou um grupo pequeno e unido.",
      "Aliados influentes que mudam o jogo quando chamados.",
    ],
  ],
  [
    "contat",
    "vantagem",
    "Contatos",
    "Pessoas que passam informação ou prestam pequenos serviços.",
    [
      "Um contato num único meio, com fofoca de rua.",
      "Contato bem posicionado que consegue dados pontuais.",
      "Rede em alguns meios; informação confiável em dias.",
      "Fontes em lugares sensíveis: polícia, imprensa, empresas.",
      "Rede ampla que descobre quase tudo em pouco tempo.",
    ],
  ],
  [
    "fama",
    "vantagem",
    "Fama",
    "Reconhecimento público entre mortais. Abre portas e atrapalha a Máscara.",
    [
      "Conhecido num nicho ou numa cena local.",
      "Reconhecido na cidade por quem acompanha a sua área.",
      "Celebridade regional; estranhos pedem foto.",
      "Famoso no país; a imprensa segue seus passos.",
      "Ícone internacional; impossível passar despercebido.",
    ],
  ],
  [
    "influ",
    "vantagem",
    "Influência",
    "Peso dentro de uma instituição ou comunidade.",
    [
      "Voz num bairro ou num grupo pequeno.",
      "Respeitado numa comunidade ou repartição.",
      "Influente numa instituição da cidade.",
      "Peso político na cidade; move decisões importantes.",
      "Controla uma instituição ou fala pela cidade inteira.",
    ],
  ],
  [
    "rebanh",
    "vantagem",
    "Rebanho",
    "Mortais de quem você se alimenta com segurança.",
    [
      "Poucos mortais; reduz a Fome em 1 por semana, com cuidado.",
      "Um grupo pequeno; alimentação fácil algumas noites.",
      "Rebanho estável; quase nunca precisa caçar.",
      "Rebanho grande e variado; escolha de Ressonância.",
      "Um culto ou comunidade inteira à sua disposição.",
    ],
  ],
  [
    "recurs",
    "vantagem",
    "Recursos",
    "Dinheiro, bens e renda.",
    [
      "Renda modesta; paga as contas sem sobras.",
      "Classe média confortável; alguns luxos.",
      "Rico; propriedades e dinheiro para gastar sem pensar.",
      "Muito rico; empresas, imóveis e investimentos.",
      "Fortuna imensa; poucos mortais têm tanto.",
    ],
  ],
  [
    "refúg",
    "vantagem",
    "Refúgio",
    "Onde você dorme de dia. Os pontos medem segurança, tamanho e segredo.",
    REFUGIO,
  ],
  [
    "refug",
    "vantagem",
    "Refúgio",
    "Onde você dorme de dia. Os pontos medem segurança, tamanho e segredo.",
    REFUGIO,
  ],
  [
    "lacai",
    "vantagem",
    "Lacaios",
    "Servos leais que cumprem ordens sem perguntar.",
    LACAIOS,
  ],
  [
    "escrav",
    "vantagem",
    "Lacaios",
    "Servos leais que cumprem ordens sem perguntar.",
    LACAIOS,
  ],
  [
    "másc",
    "vantagem",
    "Máscara",
    "Identidade mortal falsa e documentada.",
    MASCARA,
  ],
  [
    "masc",
    "vantagem",
    "Máscara",
    "Identidade mortal falsa e documentada.",
    MASCARA,
  ],
  [
    "mawla",
    "vantagem",
    "Mawla",
    "Um Membro mais velho que aconselha e protege você.",
    [
      "Um ancilla que responde perguntas de vez em quando.",
      "Mentor com alguma posição; ajuda quando é conveniente.",
      "Membro respeitado que intercede por você na corte.",
      "Ancião influente que protege você de rivais.",
      "Uma figura de poder na cidade te trata como protegido.",
    ],
  ],
  [
    "status",
    "vantagem",
    "Status",
    "Posição reconhecida na sociedade vampírica da cidade.",
    [
      "Conhecido e aceito; não é mais um neófito qualquer.",
      "Respeitado; sua palavra conta em disputas menores.",
      "Figura de destaque, com cargo ou favor reconhecido.",
      "Autoridade: Primógeno, Harpia ou equivalente.",
      "O topo da cidade: Príncipe, Barão ou braço direito.",
    ],
  ],
  [
    "linguís",
    "vantagem",
    "Linguística",
    "Idiomas além do nativo, um por ponto.",
    [
      "Um idioma extra.",
      "Dois idiomas extras.",
      "Três idiomas extras.",
      "Quatro idiomas extras.",
      "Cinco idiomas extras.",
    ],
  ],
  [
    "belíss",
    "vantagem",
    "Belíssimo",
    "Aparência marcante que ajuda em testes sociais.",
    [
      NAO_EXISTE,
      "Bonito: +1 dado em testes sociais em que a aparência conta.",
      NAO_EXISTE,
      "Deslumbrante: +2 dados em testes sociais em que a aparência conta; difícil passar despercebido.",
      NAO_EXISTE,
    ],
  ],
  [
    "estômago",
    "vantagem",
    "Estômago de Ferro",
    "Tolera sangue de bolsa, velho ou de má qualidade.",
    [
      NAO_EXISTE,
      NAO_EXISTE,
      "Sangue de bolsa, frio ou velho sacia como se fosse fresco.",
      NAO_EXISTE,
      NAO_EXISTE,
    ],
  ],
  [
    "inimig",
    "defeito",
    "Inimigo",
    "Alguém trabalha ativamente contra você.",
    [
      "Um mortal comum que atrapalha quando pode.",
      "Inimigo com recursos ou contatos; ameaça real.",
      "Rival poderoso, mortal ou Membro, que planeja sua queda.",
      "Inimigo influente na cidade; quer você destruído.",
      "Um ancião ou organização inteira caça você.",
    ],
  ],
  [
    "segredo",
    "defeito",
    "Segredo Obscuro",
    "Algo que, se revelado, destrói sua reputação ou pior.",
    [
      "Um deslize vergonhoso que custaria respeito.",
      "Algo que custaria aliados e posição.",
      "Um crime contra a Camarilla, a Anarquia ou o clã.",
      "Algo que renderia uma caçada de sangue.",
      "Revelado, garante a Morte Final.",
    ],
  ],
  [
    "persegu",
    "defeito",
    "Perseguido",
    "Algo ou alguém caça você.",
    [
      "Um curioso que aparece nas horas erradas.",
      "Um investigador persistente segue seu rastro.",
      "Caçadores sabem da sua existência e procuram você.",
      "Uma organização organizada está na sua cola.",
      "A Segunda Inquisição tem seu nome.",
    ],
  ],
  [
    "evitad",
    "defeito",
    "Evitado",
    "Outros Membros evitam ser vistos com você.",
    [
      "Um grupo pequeno te trata com desprezo.",
      "Metade da corte evita você em público.",
      "Pária no clã ou na seita; ninguém faz favores.",
      "Ser visto com você é risco social para qualquer um.",
      "A cidade inteira te trata como leproso.",
    ],
  ],
  [
    "vegan",
    "defeito",
    "Vegano",
    "Sangue humano não sacia como deveria.",
    [
      NAO_EXISTE,
      "Só se alimenta de animais ou bolsas; tomar de humano custa Força de Vontade.",
      NAO_EXISTE,
      NAO_EXISTE,
      NAO_EXISTE,
    ],
  ],
  [
    "presa",
    "defeito",
    "Presa Excluída",
    "Um tipo de presa que você não pode ou não quer usar.",
    [
      "Exclui um grupo pequeno de presas; alimentar-se dele custa Força de Vontade.",
      NAO_EXISTE,
      NAO_EXISTE,
      NAO_EXISTE,
      NAO_EXISTE,
    ],
  ],
  [
    "assomb",
    "defeito",
    "Assombrado",
    "Uma presença sobrenatural acompanha você.",
    [
      "Sussurros e objetos fora do lugar.",
      "Aparições que assustam mortais por perto.",
      "Um espírito hostil que atrapalha em momentos críticos.",
      "Assombração violenta, capaz de ferir.",
      "Uma entidade poderosa quer algo de você.",
    ],
  ],
];

export const MERIT_SCALE_V: readonly string[] = [
  "Menor. Ajuda pontual, pouca influência.",
  "Modesto. Confiável para favores pequenos.",
  "Sólido. Recurso real e recorrente.",
  "Forte. Muda o rumo de uma história.",
  "Máximo. Poder raro, cobiçado por outros.",
];

export const MERIT_SCALE_D: readonly string[] = [
  "Incômodo menor.",
  "Problema recorrente.",
  "Ameaça séria.",
  "Pode arruinar você.",
  "Risco de morte final.",
];
