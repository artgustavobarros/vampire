// Vantagens e Defeitos gerais do V5, na ordem das seções do livro.
import type { MeritTemplate } from "./model";

const LINGUISTICA = "Linguística";
const APARENCIA = "Aparência";
const SUBSTANCIAS = "Uso de Substâncias";
const ARCAICOS = "Arcaicos";
const LACO = "Laço de Sangue";
const ALIMENTACAO = "Alimentação";
const MITICOS = "Míticos";
const OUTROS = "Outros";

export const GENERAL: readonly MeritTemplate[] = [
  // Linguística
  {
    aliases: ["Illiterate"],
    category: LINGUISTICA,
    description:
      "Você não sabe ler nem escrever. Ciência e Erudição ficam limitados a 1 ponto.",
    name: "Analfabeto",
    points: 2,
    source: "Corebook",
    tipo: "defeito",
  },
  // Aparência
  {
    aliases: ["Beautiful", "Belíssimo"],
    category: APARENCIA,
    description:
      "Aparência marcante e atraente: +1 dado nas paradas Sociais em que a aparência pesa.",
    name: "Bonito",
    points: 2,
    source: "Corebook",
    tipo: "vantagem",
  },
  {
    aliases: ["Stunning"],
    category: APARENCIA,
    description:
      "Beleza fora do comum: +2 dados nas paradas Sociais em que a aparência pesa.",
    name: "Deslumbrante",
    points: 4,
    source: "Corebook",
    tipo: "vantagem",
  },
  {
    aliases: ["Ugly"],
    category: APARENCIA,
    description:
      "Aparência desagradável: −1 dado nas paradas Sociais em que a aparência pesa.",
    name: "Feio",
    points: 1,
    source: "Corebook",
    tipo: "defeito",
  },
  {
    aliases: ["Repulsive"],
    category: APARENCIA,
    description:
      "Aparência perturbadora: −2 dados nas paradas Sociais em que a aparência pesa.",
    name: "Repulsivo",
    points: 2,
    source: "Corebook",
    tipo: "defeito",
  },
  {
    aliases: ["Stench"],
    category: APARENCIA,
    description:
      "Um cheiro sobrenatural o acompanha: −1 dado nas paradas de sedução e −2 em Furtividade, a menos que você esteja contra o vento.",
    name: "Fedor",
    points: 1,
    source: "Corebook",
    tipo: "defeito",
  },
  {
    aliases: ["Famous Face"],
    category: APARENCIA,
    description:
      "Você tem o rosto de alguém famoso: +2 dados quando isso ajuda socialmente, −2 dados para se esconder na multidão ou não ser reconhecido.",
    name: "Rosto Famoso",
    points: 1,
    source: "Players Guide",
    tipo: "vantagem",
  },
  {
    aliases: ["Transparent"],
    category: APARENCIA,
    description:
      "Você não consegue mentir direito: não pode comprar Subterfúgio e perde um dado nas paradas que a usam.",
    name: "Transparente",
    points: 1,
    source: "Players Guide",
    tipo: "defeito",
  },
  {
    aliases: ["Ingénue", "Ingenue"],
    category: APARENCIA,
    description:
      "Você parece inocente: +2 dados para evitar suspeitas ou jogar a culpa em outro, a critério do Narrador.",
    name: "Ingênuo",
    points: 1,
    source: "Players Guide",
    tipo: "vantagem",
  },
  {
    aliases: ["Remarkable Feature"],
    category: APARENCIA,
    description:
      "Um traço físico raro e memorável: +2 dados nas interações Sociais com desconhecidos, −1 dado para se disfarçar.",
    name: "Traço Marcante",
    points: 1,
    source: "Players Guide",
    tipo: "vantagem",
  },
  // Uso de Substâncias
  {
    aliases: ["High Functioning Addict"],
    category: SUBSTANCIAS,
    description:
      "Escolha uma droga. Se a última alimentação tinha a droga no sangue, +1 dado em uma parada Física, Social ou Mental à sua escolha.",
    name: "Viciado Funcional",
    points: 1,
    source: "Corebook",
    tipo: "vantagem",
  },
  {
    aliases: ["Addiction"],
    category: SUBSTANCIAS,
    description:
      "Escolha uma droga. Se a última alimentação não tinha a droga no sangue, −1 dado em todas as paradas, exceto as ações para consegui-la agora.",
    name: "Dependência",
    points: 1,
    source: "Corebook",
    tipo: "defeito",
  },
  {
    aliases: ["Hopeless Addiction"],
    category: SUBSTANCIAS,
    description:
      "Como Dependência, mas −2 dados em todas as paradas quando a última alimentação não tinha a droga, exceto as ações para consegui-la agora.",
    name: "Vício Incurável",
    points: 2,
    source: "Corebook",
    tipo: "defeito",
  },
  // Arcaicos
  {
    aliases: ["Living in the Past"],
    category: ARCAICOS,
    description:
      "Uma ou mais Convicções refletem valores ultrapassados. Só para Ancillae ou mais velhos.",
    name: "Vivendo no Passado",
    points: 1,
    source: "Corebook",
    tipo: "defeito",
  },
  {
    aliases: ["Archaic"],
    category: ARCAICOS,
    description:
      "Você não sabe usar computador nem celular; Tecnologia fica sempre em 0. Só para Ancillae ou mais velhos.",
    name: "Arcaico",
    points: 2,
    source: "Corebook",
    tipo: "defeito",
  },
  // Laço de Sangue
  {
    aliases: ["Bond Junkie"],
    category: LACO,
    description:
      "O Laço é doce demais para você: −1 dado ao agir contra um Laço de Sangue.",
    name: "Viciado em Laço",
    points: 1,
    source: "Corebook",
    tipo: "defeito",
  },
  {
    aliases: ["Short Bond"],
    category: LACO,
    description:
      "Sem reforço, seus Laços caem dois níveis por mês em vez de um.",
    name: "Laço Curto",
    points: 2,
    source: "Corebook",
    tipo: "vantagem",
  },
  {
    aliases: ["Long Bond"],
    category: LACO,
    description:
      "Seus Laços demoram a enfraquecer: sem reforço, caem um nível a cada três meses.",
    name: "Laço Longo",
    points: 1,
    source: "Corebook",
    tipo: "defeito",
  },
  {
    aliases: ["Unbondable"],
    category: LACO,
    description: "Nada cria um Laço de Sangue em você.",
    name: "À Prova de Laço",
    points: 5,
    source: "Corebook",
    tipo: "vantagem",
  },
  {
    aliases: ["Bondslave"],
    category: LACO,
    description: "Você cria o Laço completo com um só gole, em vez de três.",
    name: "Escravo do Laço",
    points: 2,
    source: "Corebook",
    tipo: "defeito",
  },
  // Alimentação
  {
    aliases: ["Bloodhound"],
    category: ALIMENTACAO,
    description:
      "Você identifica a Ressonância do sangue de um mortal pelo cheiro, sem precisar prová-lo.",
    name: "Sabujo de Sangue",
    points: 1,
    source: "Corebook",
    tipo: "vantagem",
  },
  {
    aliases: ["Prey Exclusion"],
    category: ALIMENTACAO,
    description:
      "Você não se alimenta de um grupo específico (ex.: crianças, policiais). Fazer isso causa Máculas como violar um Princípio da Crônica.",
    name: "Exclusão de Presa",
    points: 1,
    source: "Corebook",
    tipo: "defeito",
  },
  {
    aliases: ["Iron Gullet"],
    category: ALIMENTACAO,
    description:
      "Você consegue beber sangue rançoso, fracionado, de bolsa velha ou que outros vampiros não aguentam.",
    name: "Esôfago de Ferro",
    points: 3,
    source: "Corebook",
    tipo: "vantagem",
  },
  {
    aliases: ["Methuselah's Thirst", "Methuselahs Thirst"],
    category: ALIMENTACAO,
    description:
      "Só sangue sobrenatural leva sua Fome a 0; sangue mortal para em 1.",
    name: "Sede de Matusalém",
    points: 1,
    source: "Corebook",
    tipo: "defeito",
  },
  // {
  //   aliases: ["Vessel Recognition"],
  //   category: ALIMENTACAO,
  //   description:
  //     "Com Determinação + Percepção (Dificuldade 2), você nota se um mortal serviu de alimento recentemente; num crítico, sabe se é presa frequente.",
  //   name: "Reconhecer Receptáculo",
  //   points: 1,
  //   source: "Players Guide",
  //   tipo: "vantagem",
  // },
  {
    aliases: ["Farmer", "Vegano"],
    category: ALIMENTACAO,
    description:
      "Você se alimenta de animais. Para beber sangue humano, gaste 2 de Força de Vontade. Ventrue não podem ter este Defeito.",
    excludeClans: ["Ventrue"],
    name: "Fazendeiro",
    points: 2,
    source: "Corebook",
    tipo: "defeito",
  },
  {
    aliases: ["Organovore"],
    category: ALIMENTACAO,
    description:
      "Sua Fome só é saciada comendo carne e órgãos humanos, não só bebendo sangue.",
    name: "Organívoro",
    points: 2,
    source: "Corebook",
    tipo: "defeito",
  },
  // {
  //   aliases: ["Vein Tapper"],
  //   category: ALIMENTACAO,
  //   description:
  //     "Você prefere vítimas que não sabem o que está acontecendo: drogadas, inconscientes ou distraídas, e as procura ativamente.",
  //   name: "Sangria às Escondidas",
  //   points: 1,
  //   source: "Players Guide",
  //   tipo: "defeito",
  // },
  // Míticos
  {
    aliases: ["Eat Food"],
    category: MITICOS,
    description:
      "Você consegue comer e beber comida mortal, sem se nutrir. Precisa expeli-la antes do descanso diurno.",
    name: "Ingerir Comida",
    points: 2,
    source: "Corebook",
    tipo: "vantagem",
  },
  {
    aliases: ["Folkloric Bane"],
    category: MITICOS,
    description:
      "Um objeto do folclore vampírico (ex.: prata, alho) causa Dano Agravado ao tocar você.",
    name: "Perdição Folclórica",
    points: 1,
    source: "Corebook",
    tipo: "defeito",
  },
  {
    aliases: ["Folkloric Block"],
    category: MITICOS,
    description:
      "Diante de um objeto que o folclore diz afastar vampiros (ex.: símbolo sagrado), gaste Força de Vontade ou se afaste dele.",
    name: "Tabu Folclórico",
    points: 1,
    source: "Corebook",
    tipo: "defeito",
  },
  {
    aliases: ["Stigmata"],
    category: MITICOS,
    description:
      "Com Fome 4, você sangra de feridas nas mãos, nos pés e na testa.",
    name: "Estigma",
    points: 1,
    source: "Corebook",
    tipo: "defeito",
  },
  // {
  //   aliases: ["Luck of the Devil"],
  //   category: MITICOS,
  //   description:
  //     "Uma vez por sessão, um azar que cairia sobre você cai sobre alguém próximo.",
  //   name: "Sorte do Diabo",
  //   points: 4,
  //   source: "Players Guide",
  //   tipo: "vantagem",
  // },
  {
    aliases: ["Stake Bait"],
    category: MITICOS,
    description: "Uma estaca no coração leva à Morte Final, não ao torpor.",
    name: "Isca de Estaca",
    points: 2,
    source: "Corebook",
    tipo: "defeito",
  },
  // {
  //   aliases: ["Nuit Mode"],
  //   category: MITICOS,
  //   description:
  //     "Seu corpo não volta ao estado da morte a cada noite: você mantém cortes de cabelo e modificações, e desfazê-las cura como Dano Agravado. Exige Potência de Sangue 1 ou menos.",
  //   name: "Modo Nuit",
  //   points: 2,
  //   source: "Players Guide",
  //   tipo: "vantagem",
  // },
  // {
  //   aliases: ["Starving Decay"],
  //   category: MITICOS,
  //   description:
  //     "Com Fome 3 ou mais, seu corpo murcha: −2 dados nos testes Físicos e nas interações Sociais com mortais, e risco à Máscara.",
  //   name: "Decomposição Faminta",
  //   points: 2,
  //   source: "Players Guide",
  //   tipo: "defeito",
  // },
  // {
  //   aliases: ["Twice Cursed"],
  //   category: MITICOS,
  //   description:
  //     "Você sofre a Perdição variante do seu clã além da normal. O Narrador pode vetar se as duas forem incompatíveis.",
  //   name: "Duas Vezes Amaldiçoado",
  //   points: 2,
  //   source: "Players Guide",
  //   tipo: "defeito",
  // },
  // Outros
  // {
  //   aliases: ["Check the Trunk"],
  //   category: OUTROS,
  //   description:
  //     "Você tem acesso fácil a um arsenal ou esconderijo: +2 dados nos testes de preparação para itens de até Recursos 2.",
  //   name: "Confira o Porta-malas",
  //   points: 1,
  //   source: "Players Guide",
  //   tipo: "vantagem",
  // },
  // {
  //   aliases: ["Knowledge Hungry"],
  //   category: OUTROS,
  //   description:
  //     "Escolha um assunto. Diante de um jeito de estudá-lo, teste Força de Vontade (Dificuldade 3) para resistir.",
  //   name: "Sede de Saber",
  //   points: 1,
  //   source: "Players Guide",
  //   tipo: "defeito",
  // },
  // {
  //   aliases: ["Side Hustler"],
  //   category: OUTROS,
  //   description:
  //     "Uma vez por sessão, consiga um item, informação ou acesso como se tivesse 2 pontos em Recursos, Contatos ou Influência.",
  //   name: "Corre por Fora",
  //   points: 2,
  //   source: "Players Guide",
  //   tipo: "vantagem",
  // },
  // {
  //   aliases: ["Prestation Debts"],
  //   category: OUTROS,
  //   description:
  //     "Você deve favores a outros Membros; os credores ganham +1 dado em combate social contra você.",
  //   name: "Dívidas de Prestação",
  //   points: 1,
  //   source: "Players Guide",
  //   tipo: "defeito",
  // },
  // {
  //   aliases: ["Tempered Will"],
  //   category: OUTROS,
  //   description:
  //     "Você sempre sabe quando Dominação ou Presença são usadas contra você e, uma vez por sessão, soma 2 dados para resistir. Exige 0 pontos em Dominação e Presença.",
  //   name: "Vontade Temperada",
  //   points: 3,
  //   source: "Players Guide",
  //   tipo: "vantagem",
  // },
  // {
  //   aliases: ["Risk-Taker", "Risk Taker"],
  //   category: OUTROS,
  //   description:
  //     "Diante de uma tentação arriscada que você nunca experimentou, −2 dados em todas as ações até participar dela ou a cena acabar.",
  //   name: "Inconsequente",
  //   points: 1,
  //   source: "Players Guide",
  //   tipo: "defeito",
  // },
  // {
  //   aliases: ["Untouchable"],
  //   category: OUTROS,
  //   description:
  //     "Uma vez por história, você escapa de toda punição oficial por um crime que normalmente levaria à sua destruição.",
  //   name: "Intocável",
  //   points: 5,
  //   source: "Players Guide",
  //   tipo: "vantagem",
  // },
  // {
  //   aliases: ["Weak-Willed", "Weak Willed"],
  //   category: OUTROS,
  //   description:
  //     "Você não pode usar resistência ativa contra tentativas de influenciá-lo, mesmo quando percebe.",
  //   name: "Vontade Fraca",
  //   points: 2,
  //   source: "Players Guide",
  //   tipo: "defeito",
  // },
  // {
  //   aliases: ["Mystic of the Void"],
  //   category: OUTROS,
  //   description:
  //     "Escolha um poder de Oblívio que você não tem: ele conta como conhecido para pré-requisitos de Rituais. Com 2 pontos, Hecata e Lasombra escolhem três poderes.",
  //   name: "Místico do Vazio",
  //   points: [1, 2],
  //   source: "Tattered Facade",
  //   tipo: "vantagem",
  // },
];
