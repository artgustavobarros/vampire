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
    "Calma sob pressão e domínio das emoções. Com Determinação, forma a Força de Vontade.",
    [
      "Explode à toa.",
      "Médio.",
      "Mantém a compostura em crises.",
      "Frio como gelo.",
      "Imperturbável. Nada tira você do eixo.",
    ],
  ],
  Carisma: [
    "Presença e poder de atrair, inspirar e agradar.",
    [
      "Passa despercebido ou incomoda.",
      "Agradável.",
      "Faz amigos com facilidade.",
      "Magnético. Atrai atenção onde entra.",
      "Líder nato. As pessoas querem seguir você.",
    ],
  ],
  Destreza: [
    "Coordenação, reflexo e precisão do corpo e das mãos.",
    [
      "Desajeitado. Tropeça, derruba coisas.",
      "Médio.",
      "Ágil. Bom em esportes de precisão.",
      "Treinado. Acrobata, atirador, dançarino.",
      "Graça excepcional. Movimento quase perfeito.",
    ],
  ],
  Determinação: [
    "Foco e persistência. Com Autocontrole, forma a Força de Vontade.",
    [
      "Desiste fácil.",
      "Médio.",
      "Termina o que começa.",
      "Obstinado.",
      "Inabalável.",
    ],
  ],
  Força: [
    "Potência física bruta: levantar, empurrar, golpear, arrombar.",
    [
      "Fraco. Carrega compras com esforço.",
      "Médio. Uma pessoa comum, sem treino.",
      "Forte. Treina com frequência; arromba uma porta simples.",
      "Muito forte. Levanta o próprio peso com facilidade.",
      "No limite humano. Derruba quase qualquer um.",
    ],
  ],
  Inteligência: [
    "Raciocínio lógico, memória e conhecimento acumulado.",
    [
      "Aprende devagar.",
      "Médio.",
      "Esperto. Aprende rápido.",
      "Brilhante.",
      "Gênio.",
    ],
  ],
  Manipulação: [
    "Fazer os outros agirem como você quer, com ou sem a verdade.",
    [
      "Transparente. Mente mal.",
      "Médio.",
      "Convence sem esforço aparente.",
      "Joga com as pessoas como peças.",
      "Mestre. Quase ninguém percebe.",
    ],
  ],
  Raciocínio: [
    "Rapidez de pensamento e reação ao inesperado.",
    [
      "Demora a reagir.",
      "Médio.",
      "Pensa rápido numa conversa ou numa briga.",
      "Raramente é pego de surpresa.",
      "Responde antes de a pergunta terminar.",
    ],
  ],
  Vigor: [
    "Resistência a dor, cansaço e ferimento. Define a Vitalidade (Vigor + 3).",
    [
      "Frágil. Cansa e se machuca fácil.",
      "Médio.",
      "Resistente. Aguenta uma briga sem cair.",
      "Duro. Resiste como um atleta de fundo.",
      "Quase inquebrável para um corpo humano.",
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
  "Alquimia de Sangue Fino":
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
