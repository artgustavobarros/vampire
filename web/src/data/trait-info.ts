// Descrições próprias, não do livro. Revisar com a mesa.
// Portado de "Mudanças desde o último standalone" (painel lateral de descrição).
// Não marque a frase de rolagem ("Atributo + Disciplina") das descrições de poder: ela é extraída por regex.

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
    "O Autocontrole permite que você permaneça calmo, controle suas emoções e tranquilize os outros. Também representa sua capacidade de manter a calma em tudo, de tiroteios a encontros íntimos. \n\nAutocontrole + Determinação resultam na sua Força de Vontade.",
    [
      "O menor insulto ou confronto pode levá-lo ao frenesi.",
      "Você pode subjugar seus instintos predatórios na maioria das situações não hostis.",
      "Outros procuram sua orientação quando o sangue atinge o ventilador.",
      "Você pode blefar sem esforço nas cartas e administrar sua Besta até certo ponto.",
      "A Besta é seu animal de estimação.",
    ],
  ],
  Carisma: [
    "O Carisma mede seu charme natural, graça e sex appeal. Quando você tem este Atributo, ele atrai as pessoas para você, facilitando muito sua alimentação. \n\nO Carisma não depende de boa aparência, que é a sua própria Qualidade.",
    [
      "Você pode falar claramente, embora poucas pessoas tendam a ouvir.",
      "Geralmente agradável, apesar de sua natureza não viva, você pode até fazer amigos.",
      "As pessoas confiam em você implicitamente, por isso você faz amigos com facilidade.",
      "Você possui magnetismo pessoal significativo e atrai seguidores como moscas.",
      "Você pode liderar uma cidade em rebelião, se assim quiser.",
    ],
  ],
  Destreza: [
    "A Destreza governa sua agilidade e elegância, a rapidez com que você se esquiva de uma estaca que mira seu coração e quanto controle motor fino você possui quando está contra o relógio.",
    [
      "Você pode correr, mas se equilibrar e se esquivar são um desafio.",
      "Sua arrancada é sólida e, às vezes, você parece gracioso em seus movimentos.",
      "Sua agilidade é impressionante e sua coordenação é tão boa quanto a de qualquer amador treinado.",
      "Você pode se destacar em acrobacias e se mover de uma maneira que poucos humanos conseguem.",
      "Seus movimentos são fluidos e hipnóticos — quase sobre-humanos.",
    ],
  ],
  Determinação: [
    "A Determinação fornece foco e propósito. Ela mede sua concentração e fortitude mental. A Determinação impele vigílias que varam a noite e bloqueiam distrações. \n\nSua Força de Vontade é igual ao seu Autocontrole + Determinação.",
    [
      "Você só presta atenção nas coisas mais urgentes.",
      "Você consegue se concentrar por um longo período, contanto que não seja muito longo.",
      "Distraí-lo exige mais esforço do que a maioria das pessoas está disposta a fazer.",
      "Você pode superar obstáculos e chegar a uma dedução empregando nada mais do que força-bruta mental.",
      "Você consegue pensar em meio a um tiroteio ou vigiar a porta de uma orgia de sangue e depois limpar cada gota ou projétil derramado.",
    ],
  ],
  Força: [
    "A Força determina o tamanho de um mortal que você pode levantar, o quão forte você pode atingi-lo e o quanto de força você pode obrigar seu corpo morto a exercer.",
    [
      "Você pode esmagar facilmente uma latinha de cerveja.",
      "Você é fisicamente mediano.",
      "Você pode ser capaz de arrombar uma porta de madeira.",
      "Você é um espécime de físico privilegiado, provavelmente com uma musculatura vistosa.",
      "Você é um verdadeiro pináculo de força e provavelmente é capaz de arrombar uma porta corta-fogo de metal, rasgar uma cerca de arame ou estourar um portão trancado por correntes.",
    ],
  ],
  Inteligência: [
    "A Inteligência mede sua capacidade de pensar, pesquisar e aplicar a lógica. Você pode lembrar e analisar informações de livros ou de seus sentidos. Nenhum enigma ou mistério pode iludir os verdadeiramente inteligentes.",
    [
      "Você pode ler e escrever com competência, embora alguns termos o confundam.",
      "Você é inteligente o suficiente para perceber suas limitações.",
      "Você é brilhante, capaz de juntar pistas sem dificuldade.",
      "Você provavelmente é consultado por membros do Clã Tremere por sua sabedoria.",
      'O termo "gênio" não abarca as profundezas e o alcance de seu intelecto.',
    ],
  ],
  Manipulação: [
    "Manipulação é a sua capacidade de convencer os outros do seu ponto de vista, mentir de forma convincente e partir após enganar alguém sem que ninguém tenha notado.",
    [
      "Desde que seja honesto, você pode convencer as pessoas a fazer o que você quer.",
      "Sua capacidade de enganar supera a vontade dos simplórios e fracos de mente.",
      "Você nunca precisa pagar o preço total de nada.",
      "Você poderia ser um líder de um culto — ou um político.",
      "Você poderia convencer o Príncipe a investir em propriedades no deserto, ou talvez até a cancelar uma Caçada de Sangue por sua cabeça.",
    ],
  ],
  Raciocínio: [
    'O Raciocínio é usado para pensar com rapidez e reagir corretamente com base em pouca informação. "Você ouve um som" é Raciocínio; "Você ouve dois guardas chegando" é Inteligência. O Raciocínio permite que você perceba uma emboscada ou responda de bate-pronto à Harpia no tribunal, em vez de pensar na melhor resposta apenas na noite seguinte.',
    [
      "Você acaba entendendo, mas precisa de explicação.",
      "Você pode apostar a sorte no pôquer ou pisar nos freios a tempo. Quase sempre.",
      "Você pode analisar uma situação e descobrir rapidamente a melhor rota de fuga.",
      "Você nunca é pego desprevenido e sempre tem uma resposta inteligente na ponta da língua.",
      "Você pensa e responde mais rapidamente do que a maioria das pessoas pode compreender.",
    ],
  ],
  Vigor: [
    "Sua resistência física. Vigor absorve danos físicos, como uma bala em alta velocidade ou a lâmina de um caçador, além de permitir que você não ceda a esforço árduo. \n\nSeu Vigor + 3 resulta no seu valor de Vitalidade.",
    [
      "Mesmo esforços menores o deixam sem fôlego.",
      "Você pode levar uma surra, mas considera fazer as pazes.",
      "Alguns dias de caminhada difícil com uma mochila pesada não são problema para você.",
      "Você pode vencer uma maratona ou aguentar grandes quantidades de dor, ao menos fisicamente.",
      "Mesmo se fosse um mortal, você nunca derramaria uma gota de suor.",
    ],
  ],
};

export const SKILL_INFO: Readonly<
  Record<string, readonly [string, string, readonly string[]]>
> = {
  "Armas Brancas": [
    "Use Armas Brancas para manejar armas portáteis como facas, correntes e tacos de beisebol com destreza. Uma estaca é uma arma branca, frequentemente encontrada nas mãos de supostos caçadores.",
    "Armas Improvisadas, Correntes, Desarme, Esgrima, Espadas, Estacas, Facas, Garrotes, Machados, Porretes",
    [
      "Você consegue brandir um bastão ou uma arma de lâmina e, na maior parte do tempo, atingir os alvos pretendidos.",
      "Sua clara competência com uma arma em mãos deveria fazer com que seus atacantes hesitassem.",
      "Sua habilidade com uma arma branca é reconhecida em todo o domínio.",
      "Os idiotas trouxeram uma arma de fogo para a sua briga de faca.",
      "Você é o mestre de armas do domínio, procurado por Membros de toda parte por sua habilidade.",
    ],
  ],
  "Armas de Fogo": [
    "Deixar uma vítima com buracos na garganta: investigação completa da Segunda Inquisição. Deixar uma vítima com buracos na cabeça: apenas mais um sábado à noite no Rio de Janeiro. Cainitas usam Armas de Fogo não somente pelas razões humanas (eficiência e emoção), mas também para preservar a Máscara.\n\nEsta Perícia compreende familiaridade com armas de pequeno porte, de pistolas de defesa a fuzis de assalto. Ela também inclui outras armas acionadas por gatilho, como bestas e lança-granadas.\n\nFinalmente, engloba a limpeza, destravamento e recarga rápida desse armamento.",
    "Atirador de Elite, Bestas, Comércio de Armas, Fabricação de Armas de Fogo, Recarga Manual, Saque Rápido, Tiro de Exibição",
    [
      "Você disparou uma arma algumas vezes, no estande de tiro ou em circunstâncias menos formais.",
      "Você sabe (e sabe como) manter sua arma limpa, desmontá-la e remontá-la.",
      'Você já esteve na merda (ou "viu o elefante", se tiver mais de um século) e conseguiu escapar do outro lado.',
      "Você domina disparos acrobáticos, tiros localizados, disparos em movimento — basicamente qualquer coisa que termine em um tiro.",
      "Você vem praticando desde a estreia da Winchester.",
    ],
  ],
  Atletismo: [
    "Atletismo permite ultrapassar alguém em uma perseguição, saltar para fora do caminho de um carro em alta velocidade, além de escalar e nadar como uma pessoa viva saudável e vigorosa.\n\nUm personagem pode usar Atletismo no lugar de qualquer Perícia de combate Físico em uma rolagem de conflito, mas, nesse caso, nunca inflige dano ao oponente, não importando a quantidade de sucessos obtidos.",
    "Acrobacia, Arremesso, Corrida de Longa Distância, Escalada, Natação, Parkour, Salto, Tiro com Arco",
    [
      "Você sempre foi atento nas aulas de educação física e ainda mantém agilidade nos passos.",
      "Apesar de morto, você ainda tem o preparo de um mortal que se exercita regularmente.",
      "Você está em excelente forma e poderia competir em esportes profissionais — ao menos em jogos noturnos.",
      "Com suas habilidades de parkour, por que você precisaria se transformar em morcego?",
      "Recordes olímpicos esperam por você; pouquíssimos humanos no ápice físico conseguem o que você faz. Outros vampiros confundem sua perícia com Disciplinas Físicas.",
    ],
  ],
  Briga: [
    "Briga permite aos personagens atingirem seus alvos quando desferem golpes com punhos, botas ou garras. Contanto que você não empunhe uma arma, o ataque se qualifica como briga — desde um elegante aikijutsu até uma luta de rua suja e brutal.",
    "Agarrões, Animais, Briga de Bar, Combate Esportivo, Em Forma de Fera de Protean, Lobisomens, Membros, Mortais Armados, Mortais Desarmados",
    [
      "Você teve uma criação difícil e precisou brigar pelo seu espaço. Ainda tem alguma ginga.",
      "Você recebeu treinamento para acertar alguém com força e precisão.",
      "Você se garante com sobras em qualquer confronto direto.",
      "Ou você recebeu treinamento de elite no nível Spetsnaz, ou passou décadas da não-vida metido em combates.",
      "Você venceria campeonatos de MMA mesmo sem utilizar nenhum poder vampírico.",
    ],
  ],
  Ciência: [
    "Ciência é um vasto horizonte de conhecimento, englobando desde os princípios biológicos básicos até a compreensão da entropia universal. As leis científicas regem o mundo material, e os vampiros que almejam dominá-lo se dedicam ao seu estudo. Assim como em Erudição, personagens que adquirem pontos em Ciência recebem uma especialidade gratuita.",
    "Astronomia, Biologia, Demolições e Explosivos, Engenharia, Física, Genética, Geologia, Matemática, Química",
    [
      "Você tem noções científicas sólidas e compreende os princípios por trás dos blocos fundamentais da vida.",
      "Você consegue explicar com precisão a outro vampiro as teorias científicas concorrentes sobre a biologia do Abraço.",
      "Você é um excelente gestor científico: coordena laboratórios, interpreta relatórios complexos e conserta instrumentos de pesquisa.",
      "Você é um especialista renomado na sua área científica de atuação e em disciplinas correlatas.",
      "Pouquíssimos colegas no mundo se igualam ao seu intelecto, e cientistas ilustres buscam sua orientação e mentoria.",
    ],
  ],
  Condução: [
    "Qualquer um (exceto talvez vampiros de quinhentos anos) pode aprender a dirigir um carro. A Perícia Condução denota a capacidade de pilotar com velocidade e segurança sob condições adversas ou situações de alto estresse: andar fora da estrada, acelerar para escapar de emboscadas, vencer rachas de rua e fugir de perseguições da Segunda Inquisição.",
    "Acrobacias, Caminhões, Carros Clássicos, Despistar, Manobras de Evasão, Motocicletas, Rachas de Rua, Veículos Todo-Terreno",
    [
      "Você é um motorista prudente, dificilmente cometendo qualquer infração ou deslize.",
      "Você pisa fundo sem grande medo de acidentes, desde que a visibilidade seja boa.",
      "Você já venceu perseguições de carro, conquistando moral e respeito entre os Anarquistas.",
      "Você poderia trabalhar como dublê profissional ou ser o motorista particular de um Príncipe ou Barão.",
      "Você conhece veículos por dentro e por fora. Quase ninguém iguala sua perícia e reflexos no volante.",
    ],
  ],
  "Empatia com Animais": [
    "Empatia com Animais permite subjugar, acalmar e até mesmo criar laços com animais. Esta Perícia possibilita prever a reação de um bicho em determinada situação, adestrar criaturas domésticas ou acalmar e enfurecer espécimes selvagens. Sem esta Perícia, a maioria das criaturas vivas evita instintivamente ou reage com agressividade à presença fria e predatória dos vampiros.",
    "Acalmar, Adestramento de Ataque, Cavalos, Cães, Cobras, Falcoaria, Gatos, Lobos, Ratos, Truques e Acrobacias",
    [
      "Os animais ficam cautelosos perto de você, mas não entram em pânico nem tentam morder.",
      "Os animais permanecem dóceis ao seu redor, agindo como se você não estivesse ali, a menos que você crie um vínculo.",
      "Os animais te tratam como um dono amigável e acolhedor, a menos que sejam provocados.",
      "Você atrai feras para a sua órbita; pouquíssimos animais mantêm a agressividade ao se aproximarem.",
      "Você pressente os sentimentos e impulsos de um animal, e ele consegue compreender e agir conforme a sua vontade.",
    ],
  ],
  Erudição: [
    'Erudição reflete a erudição formal, ensino superior e capacidade de pesquisar áreas das ciências humanas e artes liberais. Estudos históricos, por exemplo, estão longe de ser "apenas acadêmicos" quando seus rivais imortais viveram — e deixaram vestígios — naquelas épocas. Ao adquirir esta Perícia, você recebe uma especialidade gratuita. (Para idiomas estrangeiros, utilize a Vantagem Linguística).',
    "Arquitetura, Ensino e Tutoria, Filosofia, História (campo ou período específico), História da Arte, Jornalismo, Literatura, Pesquisa Documental, Teologia",
    [
      "Educação básica e secundária sólida; cursos noturnos em faculdades comunitárias.",
      "Graduação universitária básica ou instrução por um tutor razoável; bacharelado padrão.",
      "Formação acadêmica avançada ou tutoria dedicada de alto nível; mestrado ou doutorado de renome.",
      "Pesquisa altamente especializada além da academia, mergulhando em temas que poucos humanos compreendem.",
      "Saber erudito refinado e enciclopédico, sendo referência e procurado por sábios vivos e mortos para aconselhamento.",
    ],
  ],
  Etiqueta: [
    "Etiqueta é a capacidade de identificar e corresponder às convenções sociais da cena atual, ditar novos protocolos e agradar a todos ao redor com graça e desenvoltura. Aplique esta Perícia tanto na alta sociedade mortal quanto nas cortes refinadas dos Membros.",
    "Alta Sociedade e Celebridades, Anarquistas, Camarilla, Corporativo, Elysium, Feudal, Sociedades Secretas",
    [
      "Você sabe como se dirigir ao governante local sem cometer nenhuma gafe humilhante.",
      "Você domina os códigos de conduta de cada um dos clubes e pontos noturnos influentes do domínio.",
      "Você impressiona até os mais exigentes com seu domínio de polidez, cortesia e elegância.",
      "Seu comportamento lança tendências, especialmente quando decide romper com normas tradicionais.",
      "O Guardião do Elysium e as Harpias consultam você para estabelecer o protocolo cerimonial do domínio.",
    ],
  ],
  Finanças: [
    "Finanças possibilita identificar tendências de mercado, realizar bons investimentos, manipular ações na bolsa e antecipar colapsos econômicos. Também permite estimar — e rastrear — o patrimônio alheio e intermediar grandes fusões financeiras. Em termos gerais, permite avaliar obras de arte, imóveis e bens comerciais. Os Ventrue chegam a valorizar esta Perícia mais do que algumas Disciplinas.",
    "Artes Plásticas e Avaliação de Bens, Auditoria Forense, Bancos, Bolsa de Valores, Contabilidade Empresarial, Finanças Corporativas, Lavagem de Dinheiro, Manipulação Cambial, Mercado Negro",
    [
      "Você sabe administrar um negócio próprio e manter a escrituração contábil em dia.",
      "Você gerencia divisões corporativas ou agências bancárias; suas declarações fiscais são perfeitamente plausíveis.",
      "Graças ao comércio internacional, você atua com destaque como corretor nas principais bolsas do mundo.",
      "Bancos de investimento seguem suas recomendações de mercado. Você oculta fraudes financeiras com maestria.",
      "Você faz o dinheiro realizar qualquer prodígio — desde colar nos seus bolsos até quebrar economias de nações inteiras.",
    ],
  ],
  Furtividade: [
    "Furtividade permite ao personagem seguir e vigiar alvos nas sombras, tornando vampiros dotados desta perícia caçadores superlativos. Eles tiram proveito da capacidade de espionar, esgueirar-se silenciosamente e misturar-se a multidões quando necessário.",
    "Camuflagem em Multidões, Deslocamento Silencioso, Disfarce, Emboscadas, Esconder-se, Ocultação Urbana, Perseguição Silenciosa, Vida Selvagem",
    [
      "Encontrar você sob o manto da escuridão ou camuflado é uma tarefa difícil.",
      "Você passa despercebido por observadores casuais e espreita presas desatentas sem levantar qualquer suspeita.",
      "Você despista guardas em patrulha, movendo-se com passos suaves e ocultando-se facilmente.",
      "Sua passagem sutil e silenciosa faria inveja a um ninja de elite — ou o tornaria um oponente à altura.",
      "Até os Filhos de Haqim procurariam seus conselhos sobre camuflagem e perseguição nas sombras — se conseguissem te encontrar.",
    ],
  ],
  Intimidação: [
    "Intimidação é o poder de coagir, pressionar, ameaçar e impor sua vontade pela força para conquistar uma vitória social. Vampiros que dependem de Intimidação não hesitam em quebrar o moral — e, ocasionalmente, os ossos dos dedos — de seus adversários.",
    "Ameaças Veladas, Coerção Física, Encaradas, Extorsão, Insultos Mordazes, Interrogatório",
    [
      "Você consegue desferir insultos cortantes com precisão e frieza cirúrgica.",
      "Você impõe respeito e intimida a maioria dos humanos sem encontrar resistência.",
      "Sua postura predatória e atitudes implacáveis construíram uma reputação temida por todos.",
      "Você já superou em muito a necessidade de ameaças meramente físicas para se fazer obedecer.",
      "Mesmo outros Membros dão um passo atrás quando você dá um passo à frente.",
    ],
  ],
  Investigação: [
    "Investigação permite desvendar mistérios e casos mundanos ou sobrenaturais, encontrar pistas, interpretá-las e localizar pessoas desaparecidas. Os vampiros consideram esta Perícia especialmente útil quando uma presa valiosa escapa.",
    "Análise de Tráfego e Dados, Criminologia, Dedução Lógica, Homicídios, Mistérios Paranormais, Perícia Forense, Pessoas Desaparecidas",
    [
      "Você adora romances policiais e se enxerga como um detetive amador perspicaz.",
      "Você possui sólido conhecimento em criminologia e reconhece o modus operandi de criminosos locais.",
      "Você é, ou poderia ser, um detetive profissional de renome. Nada em uma cena de crime escapa aos seus olhos.",
      "O Xerife do domínio recorre aos seus serviços quando indivíduos desconhecidos sabotam a segurança da cidade.",
      "Você cria enigmas insolúveis para os outros e conduz uma existência indecifrável que raríssimos seres conseguem penetrar.",
    ],
  ],
  Ladroagem: [
    'Esta Perícia engloba a familiaridade com ferramentas e técnicas para arrombar fechaduras, plantar escutas, desativar alarmes residenciais e automotivos convencionais, falsificação manual, ligação direta em automóveis e abertura de cofres, além de incontáveis formas de invasão e arrombamento. Personagens também a utilizam para projetar sistemas de segurança sofisticados ou deduzir falhas em invasões passadas. Ventrue costumam chamar esta perícia de "Segurança". Hoje em dia, a maioria dos sistemas de ponta conta com controles computadorizados e alarmes eletrônicos, exigindo também a Perícia Tecnologia para serem superados.',
    "Alarmes, Análise de Segurança, Arrombamento de Casas, Bater Carteira, Falsificação, Furto de Veículos, Gazua e Fechaduras, Violação de Cofres",
    [
      "Você consegue abrir uma fechadura simples ou bater a carteira de alguém distraído.",
      "Você faz ligação direta em um carro e furta itens de lojas sem qualquer esforço.",
      "Você identifica a posição de câmeras de segurança e sensores de alarme para contorná-los com facilidade.",
      "Você burla teclados eletrônicos, clona crachás de identificação e arromba cofres tradicionais.",
      "Você consegue entrar — e sair — do cofre blindado de um banco multinacional sem ser pego.",
    ],
  ],
  Liderança: [
    "Liderança concede a aptidão para conduzir multidões, comandar destacamentos, elevar o moral de aliados e conter motins inflamados. Um Príncipe ou Barão firme deve possuir Liderança, sob o risco inevitável de perder o trono.",
    "Comando, Dinâmica de Equipe, Inspiração, Matilha de Guerra, Oratória, Práxis",
    [
      "Você já liderou grupos informais e sabe organizar Membros que compartilham dos seus interesses.",
      "Sua voz se faz ouvir no conselho, e até seus superiores param para escutar suas ponderações.",
      "Você sabe comandar no campo de batalha e guiar seus subordinados mesmo diante da morte.",
      "Você inspira combatentes feridos e desesperados a lutar enquanto você estiver à frente liderando-os.",
      "Suas palavras enchem o peito morto de um vampiro de tanto vigor que seu coração parece voltar a pulsar.",
    ],
  ],
  Manha: [
    "Manha capacita os personagens a falar a língua e navegar pelas dinâmicas sociais das ruas e do submundo do crime. Você compreende gírias, códigos de conduta ilegais, lê símbolos e pichações e reproduz sinais de gangues com perfeição.",
    "Comércio de Armas, Drogas, Gangues e Facções, Mercado Negro, Pichação e Códigos, Prostituição, Receptação de Cargas, Reputação nas Ruas, Sobrevivência Urbana, Suborno",
    [
      "Você sabe exatamente onde encontrar drogas e prazer proibido no seu domínio.",
      "Você sabe quais gangues atuam em cada bairro, suas cores e rivalidades. Talvez tenha sua própria tag de picho.",
      "Você distingue produto de qualidade do refugo, arranja armas quentes e se camufla entre criminosos e moradores de rua.",
      'Quando criminosos da cidade dizem "eu conheço um cara", esse cara é você.',
      "Você contrata, comanda ou arquiteta quase qualquer atividade ilícita em qualquer ponto da sua cidade.",
    ],
  ],
  Medicina: [
    "Medicina permite remendar corpos feridos e diagnosticar causas de morte ou doenças em uma vítima. Também habilita o uso de equipamentos hospitalares, prescrição de remédios e estancamento (ou aceleração proposital) de hemorragias. Personagens usam Medicina para curar dano Agravado à Vitalidade em mortais.",
    "Cirurgia, Farmácia e Farmacologia, Flebotomia, Hematologia, Patologia, Primeiros Socorros, Tratamento de Traumas Graves, Veterinária",
    [
      "Você conhece a anatomia básica e a dinâmica do fluxo arterial e venoso. Sabe primeiros socorros e RCP. Pode ter sido estudante de medicina em vida.",
      "Você trata traumas e patologias menores com facilidade e refina diagnósticos. Pode ter sido enfermeiro ou socorrista em vida.",
      "Seu preparo permite conduzir grandes cirurgias e tratar traumas severos. Pode ter sido clínico geral ou intensivista em vida.",
      "Você diagnostica e trata quase todas as doenças existentes, exceto as mais raras do planeta. Pode ter sido um cirurgião ou especialista de ponta.",
      "Você é uma sumidade médica renomada internacionalmente, procurada com desespero tanto por mortais quanto por imortais.",
    ],
  ],
  Ocultismo: [
    "Ocultismo representa o conhecimento do universo místico e sobrenatural, estendendo-se desde os ritos de maçons e rosa-cruzes até estudiosos nodistas e magos autênticos. Você reconhece selos ocultos, grimórios e práticas de magia popular, sejam elas genuínas ou crendices inofensivas.",
    "Alquimia, Bruxaria e Vodu, Fadas, Fantasmas e Aparições, Feitiçaria de Sangue, Grimórios Ocultos, Infernalismo, Lobisomens, Magos Mortais, Necromancia, Nodismo, Parapsicologia",
    [
      "Você conhece as lendas primordiais de Caim e dos Antediluvianos, e talvez tenha folheado cópias do Livro de Nod.",
      "Você separa fatos herméticos reais das tolices populares e modismos da cultura pop.",
      "Você tem experiência direta com fenômenos inexplicáveis até mesmo para os padrões dos Membros.",
      "Você é capaz de citar a maioria dos Antediluvianos pelo nome e até compreender a estrutura de rituais Tremere.",
      "Mestres Tremere e Filhos de Haqim procuram sua consulta sobre saberes herméticos arcanos e profecias perdidas.",
    ],
  ],
  Ofícios: [
    "Ofícios abrange amplamente as artes práticas e manuais, a criação de itens e utilitários que vão do estético ao funcional, desde moldar cerâmica até construir e reforçar seu próprio refúgio. Ao adquirir esta Perícia, você recebe uma especialidade gratuita. Diferente da maioria das perícias, você pode ter mais especialidades em Ofícios do que pontos na Perícia.",
    "Carpintaria, Costura, Design, Escultura, Forja de Armas, Marcenaria, Pintura, Talha",
    [
      "Você é um amador dedicado e sabe muito bem o que está fazendo.",
      "Seu trabalho artesanal é elogiado e admirado pela sólida funcionalidade.",
      "Suas criações podem ser deslumbrantes ou aterrorizantes, mas sua intenção é sempre nítida.",
      "Sua perícia e arte são reverenciadas tanto pelo gado quanto pelos Membros que conhecem suas obras.",
      "Você é a escolha natural para conceber as obras centrais que decoram e fascinam as festas no Elysium.",
    ],
  ],
  Percepção: [
    "Percepção governa a acuidade dos seus sentidos físicos e instintivos. Ela permite notar um assassino oculto nas sombras antes do bote, avistar uma chave descartada no lixo ou farejar o aroma quase imperceptível de um perfume no ar.",
    "Audição, Camuflagem, Emboscadas, Faro, Instintos, Objetos Ocultos, Perigos Naturais, Trapaças e Armadilhas, Visão",
    [
      "Você tem um histórico natural de notar quando qualquer coisa mínima está fora do lugar.",
      "Você percebe comportamentos erráticos ou padrões incomuns de linguagem corporal em um indivíduo.",
      "Você enxerga através da maioria dos disfarces e pressente perigos ocultos ou pistas encobertas.",
      "Mesmo quando está absorto ou distraído, pouquíssimas coisas escapam à sua atenção.",
      "Seus sentidos atingiram o nível de prontidão e agudeza de um predador selvagem no ápice.",
    ],
  ],
  Performance: [
    "Performance engloba diversas formas de artes cênicas e expressivas, da dança e poesia até o humor e a contação de histórias. Você pode ser um artista brilhante por mérito próprio ou um estudante apaixonado dos palcos. Ao adquirir esta Perícia, você recebe uma especialidade gratuita.",
    "Bateria e Percussão, Canto, Comédia, Dança, Discurso Público, Instrumentos de Sopro, Oratória, Poesia, Rap, Teclados e Piano, Teatro, Violão e Guitarra, Violino",
    [
      "Você é a alma de qualquer festa, embora ainda não levasse sua apresentação aos palcos.",
      "Você já se apresentou em público com recepção mista: alguns adoram, outros torcem o nariz.",
      "Você é um profundo conhecedor técnico e praticante experiente da sua arte performática.",
      "Você executa sua arte de forma deslumbrante, cativando até os Toreador mais céticos e refinados.",
      "O improviso não traz receio algum: a cada noite um público diferente, a cada noite um espetáculo triunfal.",
    ],
  ],
  Persuasão: [
    "Use Persuasão ao tentar convencer os outros de que você sabe o que é melhor para eles — e de que uma mordidinha não vai doer nada. Negociadores habilidosos manipulam as emoções das presas e apelam à lógica dos seus iguais. Persuasão se aplica em tribunais mortais e cortes principescas, salas de reunião, mesas de bar e quartos fechados.",
    "Argumentação Jurídica, Barganha, Conversa Fiada, Interrogatório, Lábia Rápida, Negociação, Retórica",
    [
      "Você consegue fechar um bom negócio com compradores que já estejam motivados.",
      "Você sempre consegue um desconto camarada ou descobre em primeira mão a fofoca mais recente.",
      "Você sempre encontra uma proposta de acordo viável no meio de qualquer disputa ou impasse.",
      "A parte contrária começa a buscar um acordo amigável assim que te vê no tribunal, seja mortal ou vampírico.",
      "Você muito provavelmente é o próprio diabo da língua de prata original.",
    ],
  ],
  Política: [
    "Política abrange a diplomacia e os labirintos burocráticos: tanto no governo mortal quanto nas intrigas dos Membros. Você sabe como circular nas esferas de poder e exercer pressão sobre prefeituras, órgãos estaduais e além. Entre os vampiros, você tem informações privilegiadas sobre qual seita domina cada território, quem está em guerra com quem e onde os corpos estão enterrados. Literalmente.",
    "Anarquistas, Camarilla, Clã específico, Diplomacia, Governo Municipal, Mídia e Imprensa, Política Estadual, Política Nacional",
    [
      "Você acompanha o cenário político mortal da sua região e sabe o básico do que os anciãos revelam sobre a política dos Membros.",
      "Você exerce influência efetiva em âmbito local ou sabe exatamente a quem recorrer para conseguir o que precisa.",
      "Você seria capaz de comandar campanhas eleitorais ou causar grande impacto na sua seita como uma promessa em ascensão.",
      "Você conhece a verdadeira personalidade e ambições das figuras que movem os pauzinhos na cidade, vivas ou mortas.",
      "Você seria capaz de deduzir a identidade dos membros secretos do Círculo Interno da Camarilla.",
    ],
  ],
  Sagacidade: [
    "Sagacidade concede a habilidade de interpretar linguagem corporal, notar pistas sutis no tom de voz ou na expressão facial e discernir a verdade de mentiras. Também possibilita compreender as motivações e impulsos ocultos por trás das ações alheias.",
    "Ambições, Desejos, Detectar Mentiras, Emoções, Empatia, Fobias, Interrogatório, Motivações, Vícios",
    [
      "Você enxerga com clareza através de bravatas vazias e fingimentos simples.",
      "Você capta a corrente de emoções veladas entre humanos e, por vezes, até mesmo entre Membros.",
      "Você presta apoio psicológico com mais perspicácia do que analistas mortais que não desejam devorar seus pacientes.",
      "Você é um polígrafo morto-vivo: somente os golpistas mais brilhantes conseguem esconder algo de você.",
      "As pessoas podem até ser livros de sangue, mas estão impressas em letras garrafais para o seu olhar.",
    ],
  ],
  Sobrevivência: [
    "Sobrevivência confere a habilidade de subsistir na natureza selvagem e sob condições climáticas adversas, retornando à civilização em segurança: navegar pelas estrelas, erguer um refúgio improvisado contra a alvorada e notar rastros de lobisomens antes que seja tarde demais. Algumas de suas funções também se aplicam a parques, zonas industriais abandonadas e outros ermos da selva de pedra.",
    "Abrigos, Armadilhas, Caça, Deserto, Exploração Urbana, Florestas, Rastreamento, Selva Tropical",
    [
      "Você conhece bem as trilhas e os trechos selvagens no entorno do seu domínio.",
      "Você passa mais tempo a céu aberto do que sob tetos e rastreia qualquer pessoa sem noções de mateiro.",
      "Você sobrevive fora da cidade, armando emboscadas para capturar mortais e garantindo abrigo diurno seguro.",
      "Você prospera na natureza longe do asfalto como o verdadeiro predador que é.",
      "Membros do Clã Gangrel correm em alcateias ao seu lado — se conseguirem acompanhar seu ritmo.",
    ],
  ],
  Subterfúgio: [
    "Subterfúgio é a arte refinada de mentir convincentemente, tecer intrigas e criar justificativas perfeitas para atos condenáveis. Esta Perícia define seu talento para segredos, traições e jogos duplos. Subterfúgio também é utilizado em jogos de sedução e para emular o comportamento orgânico dos mortais.",
    "Blefe, Fingir Mortalidade, Golpe Longo, Inocência Aparente, Mentiras Impecáveis, Sedução",
    [
      "Você conta mentiras simples e diretas com total naturalidade e credibilidade.",
      "Você engana facilmente pessoas ingênuas, jovens ou velhas, fazendo com que entreguem seus bens.",
      "Você opera em múltiplos níveis, contando mentiras calculadas para serem descobertas só para sustentar fraudes maiores.",
      "Você mantém disfarces profundos indefinidamente como o agente duplo ideal. Talvez você realmente seja!",
      "Absolutamente ninguém no domínio acredita que você tenha sequer um único ponto em Subterfúgio.",
    ],
  ],
  Tecnologia: [
    "A Perícia Tecnologia é um alvo em constante transformação: ela governa a operação e a compreensão dos avanços técnicos modernos que a maioria dos vampiros anciãos considera misteriosos. Em 1870, cobria motores a vapor e eletricidade; hoje, rege redes de computadores, telecomunicações e inteligência artificial — os quais, por sua vez, controlam desde turbinas de usinas elétricas até a segurança de edifícios inteiros.",
    "Artilharia Eletrônica, Construção de Computadores, Criptografia e Segurança, Hacking e Invasão, Mineração de Dados, Programação e Código, Redes, Sistemas de Vigilância, Telefonia Móvel",
    [
      "Você sabe montar computadores domésticos, atualizar hardware e manter sistemas protegidos de vírus comuns.",
      "Você mascara endereços IP, opera drones com destreza e cria montagens digitais e adulterações fotográficas imperceptíveis.",
      "Você programa e dissemina seus próprios vírus e malwares sofisticados sem deixar rastros.",
      "O próprio Príncipe do domínio pode te procurar pessoalmente para estruturar e auditar a segurança cibernética do domínio.",
      "Na internet, ninguém sabe que você é um vampiro — ou sequer desconfia que você está lá.",
    ],
  ],
};

export const DISC_INFO: Readonly<Record<string, string>> = {
  "Alquimia de Sangue-fraco":
    "Fórmulas que imitam Disciplinas usando sangue fraco.",
  "Alquimia de Sangue-ralo":
    "Fórmulas que imitam Disciplinas usando sangue de sangue-ralo.",
  Animalismo: "Domínio sobre animais e sobre a Besta, a sua e a dos outros.",
  Auspícios:
    "Sentidos sobrenaturais: ver auras, ler pensamentos, pressentir o que vem.",
  Celeridade: "Velocidade e reflexos acima do humano.",
  Dominação: "Controle da mente alheia pelo olhar e pela voz.",
  Domínio: "Controle da mente alheia pelo olhar e pela voz.",
  "Feitiçaria de Sangue": "Magia feita com vitae: rituais e poderes de sangue.",
  Fortitude: "Resistência sobrenatural a dano, dor e controle mental.",
  Oblívio: "Manipulação das sombras e da energia dos mortos.",
  Ofuscação:
    "Passar despercebido, sumir da mente dos outros, assumir outro rosto.",
  Potência: "Força física sobrenatural.",
  Presença: "Poder emocional: fascinar, aterrorizar, fazer-se amado.",
  Protean: "Mudança de forma: garras, fundir-se à terra, virar animal.",
  Proteanismo: "Mudança de forma: garras, fundir-se à terra, virar animal.",
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
      ["Fleumático", "Auspícios, Dominação"],
      ["Sanguíneo", "Feitiçaria de Sangue, Presença"],
      ["Animal", "Animalismo, Proteanismo"],
    ],
    "A intensidade define por quanto tempo e quanto o bônus vale.",
  ],
  vitalidade: [
    "Rastreador",
    "Vitalidade",
    "Quanto dano o corpo aguenta antes de cair. Máximo: Vigor + 3.",
    [
      [
        "/",
        "Superficial. Mortais podem remover uma quantidade máxima de níveis de dano Superficial da sua trilha de Vitalidade igual ao seu Vigor. \n Os vampiros podem, a cada turno, remover uma quantidade de níveis de dano Superficial da sua trilha de Vitalidade ao Inflamarem o Sangue.",
      ],
      [
        "✕",
        "Agravado. Para mortais, um personagem com Medicina pode converter dano Agravado na sua Trilha de Vitalidade para dano Superficial. Ele deve obter sucesso em um teste simples de Inteligência + Medicina; a Dificuldade é igual ao dano Agravado total do paciente. Tentativas de um personagem curar-se a si mesmo somam + 1 à Dificuldade. \n A quantidade máxima de pontos de dano Agravado que um personagem pode remover é igual à metade do seu valor na Habilidade Medicina, arredondado para cima.\n Vampiros normalmente podem curar 1 nível de dano Agravado à Vitalidade por noite Inflamando o Sangue.",
      ],
    ],
    "Quando todas as caixas estão marcadas, você cai em torpor.",
  ],
  vontade: [
    "Rastreador",
    "Força de Vontade",
    "Reserva de determinação. Máximo: Autocontrole + Determinação.",
    [
      [
        "/",
        "Superficial. No início de uma sessão, tanto vampiros quanto mortais podem remover uma quantidade máxima de níveis de dano Superficial da sua trilha de Força de Vontade igual ao seu valor de Autocontrole ou Determinação (o que for maior).",
      ],
      [
        "✕",
        "Agravado. No início da sessão, um personagem que tenha agido de acordo com sua Ambição pode curar 1 nível de dano Agravado à Força de Vontade.\nNo entanto, as consequências podem continuar.",
      ],
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
