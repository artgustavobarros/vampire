// Vantagens e Defeitos de culto; o livro permite adaptá-los a outros cultos.
import type { MeritTemplate } from "./model";

const CULTOS = "Cultos";
const culto = (nome: string) => `Culto · ${nome}`;

export const CULTS: readonly MeritTemplate[] = [
  {
    aliases: ["Apocryphal Texts"],
    category: CULTOS,
    description:
      "Você tem escritos do líder do culto: +2 dados em testes de Inteligência em que eles se apliquem. Opcionalmente, um Defeito de 1 ponto: +1 de dano de Força de Vontade em combate social.",
    name: "Textos Apócrifos",
    points: 1,
    source: "Children of the Blood",
    tipo: "vantagem",
  },
  {
    aliases: ["Excommunicated"],
    category: CULTOS,
    description:
      "Você foi expulso do culto: −2 dados em testes ligados ao culto (1 ponto), ou o culto quer destruí-lo (2 pontos).",
    name: "Excomungado",
    points: [1, 2],
    source: "Children of the Blood",
    tipo: "defeito",
  },
  {
    aliases: ["Inspired Artist"],
    category: CULTOS,
    description:
      "Símbolos do culto na sua arte impõem −1 dado a quem os vê para resistir às investidas Sociais dos membros do culto.",
    name: "Artista Inspirado",
    points: 2,
    source: "Children of the Blood",
    tipo: "vantagem",
  },
  {
    aliases: ["Faithless"],
    category: CULTOS,
    description:
      "Você está no culto pelos benefícios, não pela fé: −2 dados em testes de Determinação e Autocontrole ligados a ele; Rituais, Cerimônias e loresheets ficam limitados ao nível 2.",
    name: "Sem Fé",
    points: 2,
    source: "Children of the Blood",
    tipo: "defeito",
  },
  {
    aliases: ["Traveling Preacher"],
    category: CULTOS,
    description:
      "Você espalha a mensagem do culto pelas estradas: −1 na Dificuldade para evitar a Segunda Inquisição.",
    name: "Pregador Itinerante",
    points: 2,
    source: "Children of the Blood",
    tipo: "vantagem",
  },
  // Ashfinders
  {
    aliases: ["Memories of the Fallen"],
    category: culto("Ashfinders"),
    description:
      "Em testes de Alquimia de Sangue-ralo com Cinzas, um 10 conta como dois 10; dois 10 contam como quatro.",
    name: "Memórias dos Caídos",
    points: 2,
    source: "Cults of the Blood Gods",
    tipo: "vantagem",
  },
  {
    aliases: ["Ashe Addiction"],
    category: culto("Ashfinders"),
    description:
      "Depois de falhar num teste de Alquimia de Sangue-ralo, −2 dados em todas as ações até o fim da sessão.",
    name: "Vício em Cinzas",
    points: 2,
    source: "Cults of the Blood Gods",
    tipo: "defeito",
  },
  {
    aliases: ["Streamer"],
    category: culto("Ashfinders"),
    description:
      "Uma vez por história, você chama seus seguidores online para uma tarefa simples e não violenta.",
    name: "Streamer",
    points: 2,
    source: "Cults of the Blood Gods",
    tipo: "vantagem",
  },
  // Bahari
  {
    aliases: ["Gardener"],
    category: culto("Bahari"),
    description: "Fiéis escolhidos da fé Bahari funcionam como Rebanho.",
    name: "Jardineiro",
    points: [1, 2, 3, 4, 5],
    source: "Cults of the Blood Gods",
    tipo: "vantagem",
  },
  {
    aliases: ["Dark Mother's Song", "Dark Mothers Song"],
    category: culto("Bahari"),
    description:
      "+3 dados em Manipulação para convencer alguém a cultuar Lilith.",
    name: "Canção da Mãe Sombria",
    points: 2,
    source: "Cults of the Blood Gods",
    tipo: "vantagem",
  },
  // Igreja de Caim
  {
    aliases: ["Fire Resistant"],
    category: culto("Igreja de Caim"),
    description:
      "Durante o sono diurno, uma Checagem de Sangue (em vez de três) converte dano Agravado de fogo em Superficial, até a sua Potência de Sangue.",
    name: "Resistente ao Fogo",
    points: 1,
    source: "Children of the Blood",
    tipo: "vantagem",
  },
  {
    aliases: ["Schism"],
    category: culto("Igreja de Caim"),
    clans: ["Lasombra"],
    description:
      "Só Lasombra. −2 dados nos testes Sociais com membros do culto.",
    name: "Cisma",
    points: 1,
    source: "Children of the Blood",
    tipo: "defeito",
  },
  // Igreja de Set
  {
    aliases: ["Vigilant"],
    category: culto("Igreja de Set"),
    description:
      "Você sabe quando está sendo observado, exceto por meios sobrenaturais; descobrir quem ou de onde exige teste.",
    name: "Vigilante",
    points: 2,
    source: "Children of the Blood",
    tipo: "vantagem",
  },
  {
    aliases: ["False Alarm"],
    category: culto("Igreja de Set"),
    description: "Toda falha em Percepção conta como falha total.",
    name: "Alarme Falso",
    points: 1,
    source: "Children of the Blood",
    tipo: "defeito",
  },
  {
    aliases: ["Fixer"],
    category: culto("Igreja de Set"),
    description:
      "Uma vez por história, cobre um favor ou ameace um antigo cliente.",
    name: "Faz-Tudo",
    points: 2,
    source: "Children of the Blood",
    tipo: "vantagem",
  },
  {
    aliases: ["Go to Ground"],
    category: culto("Igreja de Set"),
    description: "+2 dados para escapar de perseguições.",
    name: "Sumir do Mapa",
    points: 1,
    source: "Children of the Blood",
    tipo: "vantagem",
  },
  // Culto de Shalim
  {
    aliases: ["Insidious Whispers"],
    category: culto("Culto de Shalim"),
    description:
      "Em testes Sociais para minar Convicções, um 10 conta como dois 10; dois 10 contam como quatro.",
    name: "Sussurros Insidiosos",
    points: 2,
    source: "Children of the Blood",
    tipo: "vantagem",
  },
  {
    aliases: ["Empty"],
    category: culto("Culto de Shalim"),
    description:
      "Sua presença vazia afasta as pessoas: −2 dados nos testes Sociais.",
    name: "Vazio",
    points: 1,
    source: "Children of the Blood",
    tipo: "defeito",
  },
  {
    aliases: ["Gematria"],
    category: culto("Culto de Shalim"),
    description:
      "Você domina a cifra do culto para codificar e decifrar mensagens.",
    name: "Gematria",
    points: 1,
    source: "Children of the Blood",
    tipo: "vantagem",
  },
  // Mistérios Mitraicos
  {
    aliases: ["Bull-Slayer", "Bull Slayer"],
    category: culto("Mistérios Mitraicos"),
    description:
      "Uma vez por cena, em testes prolongados, rerrole até três dados comuns sem gastar Força de Vontade.",
    name: "Matador de Touros",
    points: 3,
    source: "Children of the Blood",
    tipo: "vantagem",
  },
  {
    aliases: ["Failed Initiate"],
    category: culto("Mistérios Mitraicos"),
    description:
      "Você fraquejou na iniciação: um guia designado atrapalha seus planos, dá lições e exige provas a qualquer momento.",
    name: "Iniciado Fracassado",
    points: 1,
    source: "Children of the Blood",
    tipo: "defeito",
  },
  {
    aliases: ["Bargainer"],
    category: culto("Mistérios Mitraicos"),
    description: "−1 na Dificuldade para avaliar negociações.",
    name: "Negociador",
    points: 1,
    source: "Children of the Blood",
    tipo: "vantagem",
  },
  // Nefilim
  {
    aliases: ["Archangel's Grace", "Archangels Grace"],
    category: culto("Nefilim"),
    description:
      "Em atividades físicas intensas, como lutar, use Performance no lugar de Atletismo (ou o contrário).",
    name: "Graça do Arcanjo",
    points: 3,
    source: "Children of the Blood",
    tipo: "vantagem",
  },
  {
    aliases: ["Yearning"],
    category: culto("Nefilim"),
    description:
      "Você sente falta do seu mestre: gaste 2 de Força de Vontade para agir contra a vontade dele.",
    name: "Anseio",
    points: 1,
    source: "Children of the Blood",
    tipo: "defeito",
  },
];
