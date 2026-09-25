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

/** [prefixo do nome em minúsculas, tipo, nome canônico, descrição] */
export type MeritInfo = readonly [
  string,
  "vantagem" | "defeito",
  string,
  string,
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

export const MERIT_INFO: readonly MeritInfo[] = [
  [
    "aliad",
    "vantagem",
    "Aliados",
    "Mortais que ajudam você por lealdade, não por dinheiro.",
  ],
  [
    "contat",
    "vantagem",
    "Contatos",
    "Pessoas que passam informação ou prestam pequenos serviços.",
  ],
  [
    "fama",
    "vantagem",
    "Fama",
    "Reconhecimento público entre mortais. Abre portas e atrapalha a Máscara.",
  ],
  [
    "influ",
    "vantagem",
    "Influência",
    "Peso dentro de uma instituição ou comunidade.",
  ],
  [
    "rebanh",
    "vantagem",
    "Rebanho",
    "Mortais de quem você se alimenta com segurança.",
  ],
  ["recurs", "vantagem", "Recursos", "Dinheiro, bens e renda."],
  [
    "refúg",
    "vantagem",
    "Refúgio",
    "Onde você dorme de dia. Os pontos medem segurança, tamanho e segredo.",
  ],
  [
    "refug",
    "vantagem",
    "Refúgio",
    "Onde você dorme de dia. Os pontos medem segurança, tamanho e segredo.",
  ],
  [
    "lacai",
    "vantagem",
    "Lacaios",
    "Servos leais que cumprem ordens sem perguntar.",
  ],
  [
    "escrav",
    "vantagem",
    "Lacaios",
    "Servos leais que cumprem ordens sem perguntar.",
  ],
  ["másc", "vantagem", "Máscara", "Identidade mortal falsa e documentada."],
  ["masc", "vantagem", "Máscara", "Identidade mortal falsa e documentada."],
  [
    "mawla",
    "vantagem",
    "Mawla",
    "Um Membro mais velho que aconselha e protege você.",
  ],
  [
    "status",
    "vantagem",
    "Status",
    "Posição reconhecida na sociedade vampírica da cidade.",
  ],
  [
    "linguís",
    "vantagem",
    "Linguística",
    "Idiomas além do nativo, um por ponto.",
  ],
  [
    "belíss",
    "vantagem",
    "Belíssimo",
    "Aparência marcante que ajuda em testes sociais.",
  ],
  [
    "estômago",
    "vantagem",
    "Estômago de Ferro",
    "Tolera sangue de bolsa, velho ou de má qualidade.",
  ],
  ["inimig", "defeito", "Inimigo", "Alguém trabalha ativamente contra você."],
  [
    "segredo",
    "defeito",
    "Segredo Obscuro",
    "Algo que, se revelado, destrói sua reputação ou pior.",
  ],
  ["persegu", "defeito", "Perseguido", "Algo ou alguém caça você."],
  [
    "evitad",
    "defeito",
    "Evitado",
    "Outros Membros evitam ser vistos com você.",
  ],
  ["vegan", "defeito", "Vegano", "Sangue humano não sacia como deveria."],
  [
    "presa",
    "defeito",
    "Presa Excluída",
    "Um tipo de presa que você não pode ou não quer usar.",
  ],
  [
    "assomb",
    "defeito",
    "Assombrado",
    "Uma presença sobrenatural acompanha você.",
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
