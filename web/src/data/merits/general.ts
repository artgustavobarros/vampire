// Vantagens e Defeitos gerais do V5, na ordem das seções do livro.
import { type MeritTemplate, OPEN_RANGE } from "./model";

const LINGUISTICA = "Linguística";
const APARENCIA = "Aparência";
const SUBSTANCIAS = "Uso de Substâncias";
const ARCAICOS = "Arcaicos";
const LACO = "Laço de Sangue";
const SOBRENATURAL = "Sobrenatural";
const ALIMENTACAO = "Alimentação";
const MITICOS = "Míticos";
const PSICOLOGICOS = "Psicológicos";
const CONTAGIO = "Contágio";
const LINHAGEM = "Laços de Linhagem";
const DIABLERIE = "Diablerie";
const OUTROS = "Outros";

export const GENERAL: readonly MeritTemplate[] = [
  // Linguística
  {
    aliases: ["Linguistics"],
    category: LINGUISTICA,
    description:
      "Fluência (ler, escrever e falar) em um idioma além da língua nativa e da língua do domínio, por ponto.",
    name: "Linguística",
    points: OPEN_RANGE,
    source: "Corebook",
    tipo: "vantagem",
  },
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
    aliases: ["Semblance of the Methuselah"],
    category: APARENCIA,
    description:
      "Você se parece com um Matusalém. +1 dado para impressionar quem reconhece a semelhança; com 2 pontos, vantagens extras ao lidar com esse Matusalém ou seus seguidores.",
    name: "Semblante do Matusalém",
    points: [1, 2],
    source: "Forbidden Religions",
    tipo: "vantagem",
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
    aliases: ["Unblinking Visage"],
    category: APARENCIA,
    description:
      "Seu rosto não engana ninguém: trate a Humanidade como 2 menor (mínimo 0) ao usar o Rubor da Vida, comer, beber ou fazer sexo.",
    name: "Rosto Impassível",
    points: 2,
    source: "Gehenna War",
    tipo: "defeito",
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
  {
    aliases: ["Up All Night"],
    category: APARENCIA,
    description:
      "Você passa por mortal com facilidade: trate a Humanidade como 1 maior (2 pontos) ou 2 maior (4 pontos), máximo 10, ao usar o Rubor da Vida, comer, beber ou fazer sexo.",
    name: "Virado na Noite",
    points: [2, 4],
    source: "Blood Stained Love",
    tipo: "vantagem",
  },
  {
    aliases: ["Scene Kid"],
    category: APARENCIA,
    description:
      "Você é da cena: +1 dado nas paradas Sociais com gente da subcultura escolhida.",
    name: "Da Cena",
    points: 1,
    source: "Live from the Succubus Club",
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
    name: "Vício",
    points: 1,
    source: "Corebook",
    tipo: "defeito",
  },
  {
    aliases: ["Hopeless Addiction"],
    category: SUBSTANCIAS,
    description:
      "Como Vício, mas −2 dados em todas as paradas quando a última alimentação não tinha a droga, exceto as ações para consegui-la agora.",
    name: "Vício Sem Volta",
    points: 2,
    source: "Corebook",
    tipo: "defeito",
  },
  // Arcaicos
  {
    aliases: ["Custodian of History"],
    category: ARCAICOS,
    description:
      "Escolha um período histórico ou uma figura da tradição dos Membros: +1 em testes de Habilidade sobre esse tema.",
    name: "Guardião da História",
    points: 1,
    source: "In Memoriam",
    tipo: "vantagem",
  },
  {
    aliases: ["Living in the Past"],
    category: ARCAICOS,
    description:
      "Uma ou mais Convicções refletem valores ultrapassados. Só para Ancillae ou mais velhos.",
    name: "Vivendo no Passado",
    points: 1,
    source: "In Memoriam",
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
  {
    aliases: ["Grief Phobia"],
    category: ARCAICOS,
    description:
      "Uma fobia ligada a uma Pedra de Toque perdida de forma traumática: −1 dado em todos os testes na presença do gatilho.",
    name: "Fobia do Luto",
    points: 1,
    source: "In Memoriam",
    tipo: "defeito",
  },
  {
    aliases: ["Old Tricks"],
    category: ARCAICOS,
    description: "Todas as suas especialidades precisam ser arcaicas.",
    name: "Truques Antigos",
    points: 1,
    source: "In Memoriam",
    tipo: "defeito",
  },
  // Laço de Sangue
  {
    aliases: ["Bond Resistance"],
    category: LACO,
    description: "+1 dado por ponto para resistir ao Laço de Sangue.",
    name: "Resistência ao Laço",
    points: [1, 2, 3],
    source: "Corebook",
    tipo: "vantagem",
  },
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
    name: "Inquebrantável",
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
  {
    aliases: ["Bonds of Fealty"],
    category: LACO,
    description:
      "Seus poderes de Dominação não precisam de contato visual com quem está sob Laço de Sangue com você. Exige Dominação.",
    name: "Laços de Lealdade",
    points: 3,
    requires: { discipline: "Dominação" },
    source: "Gehenna War",
    tipo: "vantagem",
  },
  {
    aliases: ["Enduring Bond"],
    category: LACO,
    description:
      "Os Laços que você cria enfraquecem a cada dois meses, e não todo mês.",
    name: "Laço Duradouro",
    points: 1,
    source: "Gehenna War",
    tipo: "vantagem",
  },
  // Sobrenatural
  {
    aliases: ["Two Masters"],
    category: SOBRENATURAL,
    description:
      "Você pode estar sob Laço de Sangue com duas pessoas ao mesmo tempo.",
    name: "Dois Senhores",
    points: 1,
    source: "Blood Stained Love",
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
    name: "Presa Excluída",
    points: 1,
    source: "Corebook",
    tipo: "defeito",
  },
  {
    aliases: ["Iron Gullet"],
    category: ALIMENTACAO,
    description:
      "Você consegue beber sangue rançoso, fracionado, de bolsa velha ou que outros vampiros não aguentam.",
    name: "Estômago de Ferro",
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
  {
    aliases: ["Vessel Recognition"],
    category: ALIMENTACAO,
    description:
      "Com Determinação + Percepção (Dificuldade 2), você nota se um mortal serviu de alimento recentemente; num crítico, sabe se é presa frequente.",
    name: "Reconhecer Receptáculo",
    points: 1,
    source: "Players Guide",
    tipo: "vantagem",
  },
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
    aliases: ["Drive-thru"],
    category: ALIMENTACAO,
    description:
      "Você caça em minutos aumentando a Dificuldade do teste de caça em 1, e se alimenta com segurança em movimento.",
    name: "Drive-thru",
    points: 1,
    source: "Live from the Succubus Club",
    tipo: "vantagem",
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
  {
    aliases: ["Vein Tapper"],
    category: ALIMENTACAO,
    description:
      "Você prefere vítimas que não sabem o que está acontecendo: drogadas, inconscientes ou distraídas, e as procura ativamente.",
    name: "Sangria às Escondidas",
    points: 1,
    source: "Players Guide",
    tipo: "defeito",
  },
  {
    aliases: ["Outdated Preference"],
    category: ALIMENTACAO,
    description:
      "Você só se satisfaz com um tipo de presa de outra época: capture alguém que atenda à preferência ou gaste 1 de Força de Vontade a cada alimentação.",
    name: "Preferência Antiquada",
    points: 2,
    source: "In Memoriam",
    tipo: "defeito",
  },
  {
    aliases: ["Resonance Sensitivity"],
    category: ALIMENTACAO,
    description:
      "Uma Ressonância específica desperta em você uma compulsão própria ao beber sangue dela.",
    name: "Sensível à Ressonância",
    points: 1,
    source: "Live from the Succubus Club",
    tipo: "defeito",
  },
  {
    aliases: ["Resonance Mimic"],
    category: ALIMENTACAO,
    description:
      "As memórias e emoções da vítima passam para você pelo sangue, trazendo penalidades e influências indesejadas.",
    name: "Mímico de Ressonância",
    points: 2,
    source: "Live from the Succubus Club",
    tipo: "defeito",
  },
  {
    aliases: ["Sloppy Feeder"],
    category: ALIMENTACAO,
    description:
      "Seu jeito de atacar é reconhecível: um ataque pode ser ligado aos anteriores, o que arrisca sua identificação.",
    name: "Alimentador Desleixado",
    points: 2,
    source: "Live from the Succubus Club",
    tipo: "defeito",
  },
  // Míticos
  {
    aliases: ["Eat Food"],
    category: MITICOS,
    description:
      "Você consegue comer e beber comida mortal, sem se nutrir. Precisa expeli-la antes do descanso diurno.",
    name: "Comer Comida",
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
    aliases: ["Cold Dead Hunger"],
    category: MITICOS,
    description: "+2 dados para resistir ao frenesi de Fome.",
    name: "Fome Fria e Morta",
    points: 3,
    source: "Forbidden Religions",
    tipo: "vantagem",
  },
  {
    aliases: ["Folkloric Block"],
    category: MITICOS,
    description:
      "Diante de um objeto que o folclore diz afastar vampiros (ex.: símbolo sagrado), gaste Força de Vontade ou se afaste dele.",
    name: "Bloqueio Folclórico",
    points: 1,
    source: "Corebook",
    tipo: "defeito",
  },
  {
    aliases: ["Pack Diablerie"],
    category: MITICOS,
    description:
      "Na diablerie em grupo, você sempre fica com a alma, a menos que escolha não ficar; se só ajudar, ganha 5 XP como se tivesse cometido a diablerie sozinho.",
    name: "Diablerie em Bando",
    points: 2,
    source: "Forbidden Religions",
    tipo: "vantagem",
  },
  {
    aliases: ["Stigmata"],
    category: MITICOS,
    description:
      "Com Fome 4, você sangra de feridas nas mãos, nos pés e na testa.",
    name: "Estigmas",
    points: 1,
    source: "Corebook",
    tipo: "defeito",
  },
  {
    aliases: ["Luck of the Devil"],
    category: MITICOS,
    description:
      "Uma vez por sessão, um azar que cairia sobre você cai sobre alguém próximo.",
    name: "Sorte do Diabo",
    points: 4,
    source: "Players Guide",
    tipo: "vantagem",
  },
  {
    aliases: ["Stake Bait"],
    category: MITICOS,
    description: "Uma estaca no coração leva à Morte Final, não ao torpor.",
    name: "Isca de Estaca",
    points: 2,
    source: "Corebook",
    tipo: "defeito",
  },
  {
    aliases: ["Nuit Mode"],
    category: MITICOS,
    description:
      "Seu corpo não volta ao estado da morte a cada noite: você mantém cortes de cabelo e modificações, e desfazê-las cura como Dano Agravado. Exige Potência de Sangue 1 ou menos.",
    name: "Modo Nuit",
    points: 2,
    source: "Players Guide",
    tipo: "vantagem",
  },
  {
    aliases: ["Starving Decay"],
    category: MITICOS,
    description:
      "Com Fome 3 ou mais, seu corpo murcha: −2 dados nos testes Físicos e nas interações Sociais com mortais, e risco à Máscara.",
    name: "Decomposição Faminta",
    points: 2,
    source: "Players Guide",
    tipo: "defeito",
  },
  {
    aliases: ["Object of Power"],
    category: MITICOS,
    description:
      "Um objeto com poder: rerrolar um dado por história (1 ponto), +1 dado em Rituais de nível 1 (2 pontos) ou um aviso de premonição grátis por sessão (3 pontos).",
    name: "Objeto de Poder",
    points: [1, 2, 3],
    source: "In Memoriam",
    tipo: "vantagem",
  },
  {
    aliases: ["Cursed Object"],
    category: MITICOS,
    description:
      "Você carrega um objeto amaldiçoado: uma vez por sessão, o Narrador manda rerrolar um teste bem-sucedido.",
    name: "Objeto Amaldiçoado",
    points: 1,
    source: "In Memoriam",
    tipo: "defeito",
  },
  {
    aliases: ["Ley Line Leach"],
    category: MITICOS,
    description:
      "Depois de horas de viagem até outro lugar, você não precisa do Despertar com Checagem de Sangue na noite seguinte.",
    name: "Sanguessuga de Linha Ley",
    points: 1,
    source: "Live from the Succubus Club",
    tipo: "vantagem",
  },
  {
    aliases: ["Twice Cursed"],
    category: MITICOS,
    description:
      "Você sofre a Perdição variante do seu clã além da normal. O Narrador pode vetar se as duas forem incompatíveis.",
    name: "Duas Vezes Amaldiçoado",
    points: 2,
    source: "Players Guide",
    tipo: "defeito",
  },
  {
    aliases: ["Persistent Blush"],
    category: MITICOS,
    description: "Uma ativação do Rubor da Vida dura uma semana.",
    name: "Rubor Persistente",
    points: 3,
    source: "Live from the Succubus Club",
    tipo: "vantagem",
  },
  {
    aliases: ["Resistant Blush"],
    category: MITICOS,
    description:
      "Role duas vezes a Checagem de Sangue do Rubor da Vida e fique com o pior resultado.",
    name: "Rubor Resistente",
    points: 1,
    source: "Live from the Succubus Club",
    tipo: "defeito",
  },
  {
    aliases: ["Land Locked"],
    category: MITICOS,
    description:
      "Você não consegue deixar a terra firme: para embarcar em barco ou avião, teste frenesi de Terror (Dificuldade 3).",
    name: "Preso à Terra",
    points: 1,
    source: "Live from the Succubus Club",
    tipo: "defeito",
  },
  {
    aliases: ["Corpse Flesh"],
    category: MITICOS,
    description: "Você não pode usar o Rubor da Vida.",
    name: "Carne de Cadáver",
    points: 2,
    source: "Live from the Succubus Club",
    tipo: "defeito",
  },
  // Psicológicos
  {
    aliases: ["Unholy Will"],
    category: PSICOLOGICOS,
    description:
      "Contra quem tem Fé Verdadeira: +1 dado para resistir ou disputar e 1 de dano sagrado a menos (2 pontos); +2 dados e 2 de dano a menos (4 pontos).",
    name: "Vontade Profana",
    points: [2, 4],
    source: "Forbidden Religions",
    tipo: "vantagem",
  },
  {
    aliases: ["Beacon of Profanity"],
    category: PSICOLOGICOS,
    description:
      "Qualquer mortal com Fé Verdadeira sente sua presença, qualquer que seja o nível da fé.",
    name: "Farol de Profanação",
    points: 1,
    source: "Forbidden Religions",
    tipo: "defeito",
  },
  {
    aliases: ["Zealotry"],
    category: PSICOLOGICOS,
    description:
      "Uma vez por sessão, um sucesso comum numa ação alinhada à sua Convicção vira um crítico confuso.",
    name: "Zelo",
    points: [1, 2, 3],
    source: "Forbidden Religions",
    tipo: "vantagem",
  },
  {
    aliases: ["Crisis of Faith"],
    category: PSICOLOGICOS,
    description:
      "Numa falha bestial, você também sofre 1 de dano Superficial de Força de Vontade.",
    name: "Crise de Fé",
    points: 1,
    source: "Forbidden Religions",
    tipo: "defeito",
  },
  {
    aliases: ["Penitence"],
    category: PSICOLOGICOS,
    description:
      "Uma vez por sessão, cause a si mesmo 1 de dano Superficial de Vitalidade para recuperar 1 de dano Superficial de Força de Vontade.",
    name: "Penitência",
    points: OPEN_RANGE,
    source: "Forbidden Religions",
    tipo: "vantagem",
  },
  {
    aliases: ["Horrible Scars of Penitence"],
    category: PSICOLOGICOS,
    description:
      "Suas cicatrizes de penitência são horríveis: perto de quem não é do seu culto, sofre as mesmas penalidades de Repulsivo.",
    name: "Cicatrizes da Penitência",
    points: 1,
    source: "Forbidden Religions",
    tipo: "defeito",
  },
  {
    aliases: ["Soothed Beast"],
    category: PSICOLOGICOS,
    description:
      "Você tem uma obsessão por um personagem do Narrador: uma vez por sessão, ignore uma falha bestial ou um crítico confuso. Se essa pessoa morrer, você sofre 3 Máculas.",
    name: "Fera Apaziguada",
    points: 1,
    source: "Blood Stained Love",
    tipo: "vantagem",
  },
  {
    aliases: ["Groveling Worm"],
    category: PSICOLOGICOS,
    description:
      "Uma vez por sessão, você precisa se flagelar (2 de dano Superficial de Vitalidade) ou sofre 1 de dano Agravado de Força de Vontade na sessão seguinte. Não combina com Penitência.",
    name: "Verme Rastejante",
    points: 2,
    source: "Forbidden Religions",
    tipo: "defeito",
  },
  {
    aliases: ["False Love"],
    category: PSICOLOGICOS,
    description:
      "Você tem uma obsessão por um personagem do Narrador: trate a Humanidade como 1 maior ao usar o Rubor da Vida, comer ou ter intimidade. Se essa pessoa morrer, você sofre 3 Máculas.",
    name: "Falso Amor",
    points: 1,
    source: "Blood Stained Love",
    tipo: "vantagem",
  },
  // Contágio
  {
    aliases: ["Disease Vector"],
    category: CONTAGIO,
    description:
      "Ao beber de um mortal doente, você sempre pega a doença e a passa para o próximo receptáculo.",
    name: "Vetor de Doença",
    points: 1,
    source: "Forbidden Religions",
    tipo: "defeito",
  },
  {
    aliases: ["Plaguebringer"],
    category: CONTAGIO,
    description:
      "Seu sangue carrega uma doença permanente, transmitida pela mordida: leve e com sinais visíveis (1 ponto) ou potencialmente fatal sem tratamento (2 pontos).",
    name: "Pestilento",
    points: [1, 2],
    source: "Forbidden Religions",
    tipo: "defeito",
  },
  // Laços de Linhagem
  {
    aliases: ["Consanguineous Sense"],
    category: LINHAGEM,
    description:
      "Você sente se outro Membro é da sua linhagem direta, sem saber a Geração dele.",
    name: "Sentido Consanguíneo",
    points: 2,
    source: "Gehenna War",
    tipo: "vantagem",
  },
  {
    aliases: ["Consanguineous Influence"],
    category: LINHAGEM,
    description:
      "+1 dado com Disciplinas Mentais contra membros do seu clã e ancestrais ou descendentes diretos; +2 dados se estiverem a até duas gerações de você.",
    name: "Influência Consanguínea",
    points: 2,
    source: "Gehenna War",
    tipo: "vantagem",
  },
  {
    aliases: ["Sins of the Father"],
    category: LINHAGEM,
    description:
      "Diablerie contra ancestrais ou descendentes diretos não deixa marcas em você (2 pontos); com 3 pontos, vale contra qualquer membro do seu clã.",
    name: "Pecados do Pai",
    points: [2, 3],
    source: "Gehenna War",
    tipo: "vantagem",
  },
  // Diablerie
  {
    aliases: ["Blatant Diablerist"],
    category: DIABLERIE,
    description:
      "Poderes que detectam diablerie sempre revelam a sua, mesmo quando o teste falharia.",
    name: "Diablerista Descarado",
    points: 1,
    source: "Gehenna War",
    tipo: "defeito",
  },
  {
    aliases: ["Inherited Bane"],
    category: DIABLERIE,
    description:
      "Você sofre a Perdição de outro clã além da sua. Tremere podem usar isto para ter a Perdição Salubri sem diablerie.",
    name: "Perdição Herdada",
    points: 2,
    source: "Gehenna War",
    tipo: "defeito",
  },
  // Outros
  {
    aliases: ["Check the Trunk"],
    category: OUTROS,
    description:
      "Você tem acesso fácil a um arsenal ou esconderijo: +2 dados nos testes de preparação para itens de até Recursos 2.",
    name: "Confira o Porta-malas",
    points: 1,
    source: "Players Guide",
    tipo: "vantagem",
  },
  {
    aliases: ["Knowledge Hungry"],
    category: OUTROS,
    description:
      "Escolha um assunto. Diante de um jeito de estudá-lo, teste Força de Vontade (Dificuldade 3) para resistir.",
    name: "Sede de Saber",
    points: 1,
    source: "Players Guide",
    tipo: "defeito",
  },
  {
    aliases: ["Side Hustler"],
    category: OUTROS,
    description:
      "Uma vez por sessão, consiga um item, informação ou acesso como se tivesse 2 pontos em Recursos, Contatos ou Influência.",
    name: "Corre por Fora",
    points: 2,
    source: "Players Guide",
    tipo: "vantagem",
  },
  {
    aliases: ["Prestation Debts"],
    category: OUTROS,
    description:
      "Você deve favores a outros Membros; os credores ganham +1 dado em combate social contra você.",
    name: "Dívidas de Prestação",
    points: 1,
    source: "Players Guide",
    tipo: "defeito",
  },
  {
    aliases: ["Tempered Will"],
    category: OUTROS,
    description:
      "Você sempre sabe quando Dominação ou Presença são usadas contra você e, uma vez por sessão, soma 2 dados para resistir. Exige 0 pontos em Dominação e Presença.",
    name: "Vontade Temperada",
    points: 3,
    source: "Players Guide",
    tipo: "vantagem",
  },
  {
    aliases: ["Risk-Taker", "Risk Taker"],
    category: OUTROS,
    description:
      "Diante de uma tentação arriscada que você nunca experimentou, −2 dados em todas as ações até participar dela ou a cena acabar.",
    name: "Inconsequente",
    points: 1,
    source: "Players Guide",
    tipo: "defeito",
  },
  {
    aliases: ["Untouchable"],
    category: OUTROS,
    description:
      "Uma vez por história, você escapa de toda punição oficial por um crime que normalmente levaria à sua destruição.",
    name: "Intocável",
    points: 5,
    source: "Players Guide",
    tipo: "vantagem",
  },
  {
    aliases: ["Weak-Willed", "Weak Willed"],
    category: OUTROS,
    description:
      "Você não pode usar resistência ativa contra tentativas de influenciá-lo, mesmo quando percebe.",
    name: "Vontade Fraca",
    points: 2,
    source: "Players Guide",
    tipo: "defeito",
  },
  {
    aliases: ["Mystic of the Void"],
    category: OUTROS,
    description:
      "Escolha um poder de Oblívio que você não tem: ele conta como conhecido para pré-requisitos de Rituais. Com 2 pontos, Hecata e Lasombra escolhem três poderes.",
    name: "Místico do Vazio",
    points: [1, 2],
    source: "Tattered Facade",
    tipo: "vantagem",
  },
];
