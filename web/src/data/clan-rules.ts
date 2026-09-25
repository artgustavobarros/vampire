// Paráfrases das regras do V5, não o texto do livro em português. Revisar com a mesa
// (principalmente Hecata, Lasombra, Salubri e Tremere).
// Portado de "Mudanças desde o último standalone" (rodada 2, seção 8).

/** [descrição completa, linhas [rótulo, texto]]; `{G}` é a Gravidade da Perdição. */
export type ClanRule = readonly [
  string,
  readonly (readonly [string, string])[],
];

export const CLAN_FULL: Readonly<
  Record<string, { readonly bane: ClanRule; readonly comp: ClanRule }>
> = {
  "Banu Haqim": {
    bane: [
      "O sangue de outros vampiros é viciante. Provar Vitae acende uma sede quase impossível de controlar.",
      [
        ["Gatilho", "Reduzir ao menos 1 de Fome bebendo sangue de vampiro."],
        ["Rolagem", "Teste de frenesi de fome com dificuldade 2 + {G}."],
        ["Falha", "Entra em frenesi e tenta beber tudo."],
      ],
    ],
    comp: [
      "O vampiro sente o dever de julgar. Alguém, amigo ou inimigo, que violou as convicções dele precisa ser punido.",
      [
        [
          "Efeito",
          "−2 dados em todas as paradas que não sirvam para punir o transgressor.",
        ],
        [
          "Termina",
          "Quando pune (beber 1 de Fome dele conta) ou a cena termina.",
        ],
      ],
    ],
  },
  Brujah: {
    bane: [
      "A fúria ferve logo abaixo da pele. Qualquer provocação pode virar frenesi, e o sangue Brujah resiste mal ao impulso de revidar.",
      [
        ["Gatilho", "Testes para resistir a frenesi de fúria."],
        [
          "Rolagem",
          "Retire {G} dados da parada para resistir, você não pode ficar com menos que um dado.",
        ],
        ["Dura", "Sempre ativa."],
      ],
    ],
    comp: [
      "A Besta exige desafiar a autoridade. O vampiro precisa se opor a quem representa ordem ou expectativa na cena: líder, regra, costume.",
      [
        [
          "Efeito",
          "−2 dados em todas as paradas que não sirvam para contrariar a ordem, a autoridade ou a expectativa de alguém.",
        ],
        [
          "Termina",
          "Quando tiver feito a autoridade mudar de ideia",
        ],
      ],
    ],
  },
  Gangrel: {
    bane: [
      "Quando em frenesi, os Gangrel ganham um ou mais de um aspecto animalesco: um traço físico, um odor ou um comportamento.",
      [
        ["Gatilho", "Sempre que entra em frenesi."],
        [
          "Efeito",
          "Ganha {G} traços animais. Cada traço dá −1 em um Atributo (escolha na hora) até a próxima noite.",
        ],
        [
          "Opção",
          "Pode escolher Curtir a Onda e manifesta apenas um aspecto.",
        ],
      ],
    ],
    comp: [
      "A Besta toma a frente e o vampiro age como animal: rosna, fareja, desconfia de tudo e perde a fala articulada.",
      [
        ["Efeito", "−3 dados em paradas de Manipulação e Inteligência."],
        ["Termina", "No fim da cena."],
      ],
    ],
  },
  Hecata: {
    bane: [
      "Vítimas apanhadsa desprevinidas irão resistir violentamente, a menos que sejam contidas, e pocas pessoas se submetem de bom grado à tortura que é o Beijo dos Hecata.",
      [
        [
          "Alimentação",
          "A vítima resiste sempre; é preciso contê-la ou convencê-la antes.",
        ],
        [
          "Rolagem",
          "Mortais relutantes não contidos ou amarrados tentarão escapar, e mesmo aqueles dispostos, Vigor + Determinação contra {G} + 2 para não recuar.",
        ],
        ["Alimentação", "Vítimas vampiras devem fazer teste de frenesi contra dificuldade 3 para evitar cair em frenesi de terror."],
      ],
    ],
    comp: [
      "Os Hecata são possuidores de uma curiosidade peculiar combinada com desapego de compaixão e empatia, provavelmente devido ao seu relacionamento frequente com cadáveres e fantasmas daqueles que morreram tragicamente.",
      [
        [
          "Efeito",
          "−3 dados em todas as paradas que não envolvam sinais de doença, fragibilidade ou morte iminente.",
        ],
        [
          "Termina",
          "Até que eles tenham predito uma morte sem meios sobrenaturais ou resolvido a causa de uma morte local.",
        ],
      ],
    ],
  },
  Lasombra: {
    bane: [
      "O reflexo é distorcido e a tecnologia rejeita o vampiro. Espelhos, câmeras e microfones captam uma imagem ou voz deformada.",
      [
        ["Gatilho", "Usar tecnologia moderna ou tentar aparecer em gravações."],
        ["Rolagem", " {G} + 2 a menos em paradas de Tecnologia."],
        ["Aparência", "Reflexos e gravações ficam visivelmente distorcidos."],
      ],
    ],
    comp: [
      "O fracasso é inaceitável. Depois de falhar, o vampiro só pensa em vencer, custe o que custar.",
      [
        ["Gatilho", "A próxima vez que falhar numa ação."],
        [
          "Efeito",
          "−2 dados em todas as paradas até ter sucesso numa nova tentativa da ação que falhou.",
        ],
        ["Termina", "Com o sucesso ou no fim da cena."],
      ],
    ],
  },
  Malkaviano: {
    bane: [
      "A mente é fraturada por uma perturbação permanente. Quando a Besta aparece, a loucura aparece junto e distorce os sentidos ou o juízo.",
      [
        ["Gatilho", "Falha bestial ou Compulsão de qualquer tipo."],
        [
          "Efeito",
          "−{G} dados em uma categoria de paradas (Física, Social ou Mental), definida pelo Narrador conforme a perturbação.",
        ],
        ["Dura", "Até o fim da cena."],
      ],
    ],
    comp: [
      "O véu entre verdade e delírio se rasga. O vampiro enxerga sinais, vozes e padrões que ninguém mais vê e age com base neles.",
      [
        [
          "Efeito",
          "−2 dados em paradas de Destreza, Manipulação, Autocontrole e Raciocínio, e em testes para resistir a Auspícios.",
        ],
        ["Termina", "No fim da cena."],
      ],
    ],
  },
  Ministério: {
    bane: [
      "A luz é inimiga. Luz forte fere mais e cega mais do que a outros vampiros.",
      [
        ["Luz forte", "Retire {G} dados de todas as paradas sob luz intensa."],
        ["Luz do sol", "Some {G} ao dano agravado recebido da luz solar."],
        ["Dura", "Enquanto estiver exposto."],
      ],
    ],
    comp: [
      "O vampiro precisa levar alguém a romper uma regra, um tabu ou uma convicção.",
      [
        [
          "Efeito",
          "−2 dados em todas as paradas que não sirvam para induzir a transgressão.",
        ],
        [
          "Termina",
          "Quando alguém transgride (ou o próprio vampiro, com teste de Humanidade) ou a cena termina.",
        ],
      ],
    ],
  },
  Nosferatu: {
    bane: [
      "O corpo é deformado e monstruoso. Não há como se passar por humano sem ajuda sobrenatural.",
      [
        [
          "Efeito",
          "Defeito Repulsivo (-2)",
        ],
          ["Rolagem", "Retire {G} dados da parada de disfarce."],
        ["Restrição", "Não podem aumentar seu valor na Qualidade Visual."],
      ],
    ],
    comp: [
      "Segredos atraem o Nosferatu como sangue. Ele precisa descobrir algo escondido e não aceita desistir até conseguir.",
      [
        [
          "Efeito",
          "−2 dados em todas as paradas que não sirvam para descobrir um segredo.",
        ],
        [
          "Termina",
          "Quando obtém um segredo ainda não conhecido ou a cena termina.",
        ],
      ],
    ],
  },
  Ravnos: {
    bane: [
      "O sol procura o Ravnos. Dormir duas vezes no mesmo lugar em sete noites queima o corpo.",
      [
        ["Gatilho", "Repousar no mesmo lugar mais de uma vez em sete noites."],
        [
          "Rolagem",
          "Role {G} dados ao acordar. Cada 6 ou mais causa 1 dano agravado.",
        ],
        ["Dura", "Todo despertar em que a regra for quebrada."],
      ],
    ],
    comp: [
      "O vampiro precisa tentar o destino: escolher o caminho mais arriscado e ousado disponível.",
      [
        [
          "Efeito",
          "−2 dados em todas as paradas de ações seguras ou sensatas.",
        ],
        ["Termina", "Quando realiza algo arriscado ou a cena termina."],
      ],
    ],
  },
  Salubri: {
    bane: [
      "O sangue Salubri é cobiçado e o terceiro olho denuncia o clã. Outros vampiros os caçam.",
      [
        [
          "Terceiro olho",
          "Abre ao usar Disciplinas e chora sangue; difícil de esconder.",
        ],
        [
          "Quem bebe",
          "Vampiros que provam sangue Salubri testam frenesi de fome com dificuldade 2 + {G}.",
        ],
        ["Dura", "Sempre ativa."],
      ],
    ],
    comp: [
      "O vampiro sente a dor dos outros como sua e precisa aliviá-la.",
      [
        [
          "Efeito",
          "−2 dados em todas as paradas que não sirvam para ajudar alguém que sofre.",
        ],
        ["Termina", "Quando alivia o sofrimento de alguém ou a cena termina."],
      ],
    ],
  },
  Toreador: {
    bane: [
      "Eles desejam tão intensamente a beleza que acabam sofrendo em sua ausência.",
      [
        ["Gatilho", "Estar num lugar feio ou sem beleza."],
        ["Rolagem", "Retire {G} dados das paradas de Disciplina."],
        ["Dura", "Enquanto estiver no lugar."],
      ],
    ],
    comp: [
      "Algo belo prende toda a atenção do vampiro: uma pessoa, uma obra, uma cena. O resto do mundo some.",
      [
        ["Efeito", "−2 dados em todas as paradas que não envolvam a fixação."],
        ["Termina", "Quando a fixação é satisfeita ou a cena termina."],
      ],
    ],
  },
  Tremere: {
    bane: [
      "Desde a queda da Pirâmide, o sangue Tremere perdeu força. Ele não cria Laços de Sangue como deveria.",
      [
        ["Vampiros", "Não consegue criar Laço de Sangue em outros vampiros."],
        [
          "Mortais",
          "Um mortal ou carniçal precisa beber {G} vezes a mais para ficar laçado.",
        ],
        ["Dura", "Sempre ativa."],
      ],
    ],
    comp: [
      "Nada menos que o perfeito serve. O vampiro refaz, corrige e se irrita com qualquer resultado mediano.",
      [
        [
          "Efeito",
          "−2 dados em todas as paradas. Repetir a mesma ação reduz a penalidade em 1 a cada tentativa.",
        ],
        ["Termina", "Quando obtém um sucesso crítico ou a cena termina."],
      ],
    ],
  },
  Tzimisce: {
    bane: [
      "O vampiro está preso a algo: sua terra, um grupo, um objeto. Precisa repousar junto do que é seu.",
      [
        ["Gatilho", "Repousar longe do vínculo escolhido."],
        ["Efeito", "Acorda com {G} de dano agravado em Força de Vontade."],
        ["Dura", "Todo despertar sem o vínculo."],
      ],
    ],
    comp: [
      "A cobiça toma conta. O vampiro precisa possuir algo ou alguém que viu na cena.",
      [
        [
          "Efeito",
          "−2 dados em todas as paradas que não sirvam para obter o objeto da cobiça.",
        ],
        ["Termina", "Quando possui o que deseja ou a cena termina."],
      ],
    ],
  },
  Ventrue: {
    bane: [
      "O paladar é exigente: só um tipo específico de presa satisfaz. Sangue de qualquer outra fonte é rejeitado pelo corpo.",
      [
        [
          "Identificar",
          "Determinação + Percepção (dificuldade 4 ou maior) para saber se a presa é do sangue desejado.",
        ],
        [
          "Beber fora do tipo",
          "Gaste {G} pontos de Força de Vontade para manter o sangue; sem isso, vomita e não reduz a Fome.",
        ],
        ["Dura", "Sempre ativa."],
      ],
    ],
    comp: [
      "O Ventrue precisa estar no comando. Alguém na cena tem de obedecer uma ordem dele.",
      [
        [
          "Efeito",
          "−2 dados em todas as paradas que não sirvam para fazer alguém obedecer.",
        ],
        [
          "Termina",
          "Quando alguém cumpre uma ordem dele (sem uso de Domínio) ou a cena termina.",
        ],
      ],
    ],
  },
};
