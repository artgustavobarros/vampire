// Antecedentes do V5 e as Vantagens/Defeitos ligados a cada um.
import { type MeritTemplate, OPEN_RANGE } from "./model";

export const BACKGROUNDS: readonly MeritTemplate[] = [
  {
    aliases: ["Allies"],
    category: "Antecedente",
    description:
      "Mortais que ajudam você por lealdade, dívida ou amizade, não por dinheiro. Quanto mais pontos, mais capazes e confiáveis eles são.",
    levels: [
      "Aliado fraco e pouco confiável, que ajuda quando é fácil.",
      "Aliado comum e razoavelmente confiável.",
      "Aliado competente e dedicado, que corre riscos por você.",
      "Aliado poderoso e leal até o fim.",
    ],
    name: "Aliados",
    points: [1, 2, 3, 4],
    source: "Corebook",
    tipo: "vantagem",
  },
  {
    aliases: ["Contacts"],
    category: "Antecedente",
    description:
      "Mortais que conseguem informação, objetos ou serviços difíceis de obter por outros meios.",
    levels: [
      "Um contato num único meio, com fofoca de rua.",
      "Contatos bem posicionados em alguns meios; informação confiável em dias.",
      "Rede ampla, com fontes em lugares sensíveis: polícia, imprensa, empresas.",
    ],
    name: "Contatos",
    points: [1, 2, 3],
    source: "Corebook",
    tipo: "vantagem",
  },
  {
    aliases: ["Fame"],
    category: "Antecedente",
    description:
      "Reconhecimento público entre mortais. Abre portas sociais, mas atrapalha a caça e ameaça a Máscara, porque as pessoas lembram de você.",
    levels: [
      "Conhecido num nicho ou numa cena local.",
      "Reconhecido na cidade por quem acompanha a sua área.",
      "Celebridade regional; estranhos pedem fotos.",
      "Famoso no país; a imprensa segue seus passos.",
      "Ícone internacional; impossível passar despercebido.",
    ],
    name: "Fama",
    points: OPEN_RANGE,
    source: "Corebook",
    tipo: "vantagem",
  },
  {
    aliases: ["Influence"],
    category: "Antecedente",
    description:
      "Poder sobre comunidades mortais por política, dinheiro, prestígio ou manipulação. Vale para um grupo ou região da cidade.",
    levels: [
      "Voz num bairro ou num grupo pequeno.",
      "Respeitado numa comunidade ou repartição.",
      "Influente numa instituição da cidade.",
      "Peso político na cidade; move decisões importantes.",
      "Controla uma instituição ou fala pela cidade inteira.",
    ],
    name: "Influência",
    points: OPEN_RANGE,
    source: "Corebook",
    tipo: "vantagem",
  },
  {
    aliases: ["Retainers"],
    category: "Antecedente",
    description:
      "Seguidores leais que cumprem suas ordens; às vezes carniçais ou mortais sob Laço de Sangue.",
    levels: [
      "Um servo comum ou pouco confiável.",
      "Um servo capaz e leal, ou alguns servos comuns.",
      "Um servo excepcional (talvez carniçal) ou um pequeno grupo bem treinado.",
    ],
    name: "Lacaios",
    points: [1, 2, 3],
    source: "Corebook",
    tipo: "vantagem",
  },
  {
    aliases: ["Mask"],
    category: "Antecedente",
    description:
      "Identidade mortal falsa, com contas bancárias, certidões e documentos que escondem o que você é.",
    levels: [
      "Documentos básicos: conta bancária, certidão, carteira de motorista.",
      "Identidade sólida que passa por checagens oficiais, até de governo.",
    ],
    name: "Máscara",
    points: [1, 2],
    source: "Corebook",
    tipo: "vantagem",
  },
  {
    aliases: ["Mawla", "Mentor"],
    category: "Antecedente",
    description:
      "Um Membro que aconselha, orienta e protege você na sociedade vampírica. Mais pontos, mais investimento dele em você.",
    levels: [
      "Um ancilla que responde perguntas de vez em quando.",
      "Mentor com alguma posição; ajuda quando é conveniente.",
      "Membro respeitado que intercede por você na corte.",
      "Ancião influente que protege você de rivais.",
      "Uma figura de poder na cidade te trata como protegido.",
    ],
    name: "Mawla",
    points: OPEN_RANGE,
    source: "Corebook",
    tipo: "vantagem",
  },
  {
    aliases: ["Herd"],
    category: "Antecedente",
    description:
      "Receptáculos dispostos de quem você se alimenta. Cada ponto sacia 1 de Fome por semana sem teste de caça.",
    levels: [
      "Poucos receptáculos; sacia 1 de Fome por semana sem teste.",
      "Um grupo pequeno; sacia 2 de Fome por semana sem teste.",
      "Rebanho estável; sacia 3 de Fome por semana sem teste.",
      "Rebanho grande e variado; sacia 4 de Fome por semana e dá escolha de Ressonância.",
      "Um culto ou comunidade inteira; sacia 5 de Fome por semana sem teste.",
    ],
    name: "Rebanho",
    points: OPEN_RANGE,
    source: "Corebook",
    tipo: "vantagem",
  },
  {
    aliases: ["Resources"],
    category: "Antecedente",
    description:
      "Dinheiro e renda: herança, investimentos ou trabalho noturno.",
    levels: [
      "Renda modesta; paga as contas sem sobras.",
      "Classe média confortável; alguns luxos.",
      "Rico; propriedades e dinheiro para gastar sem pensar.",
      "Muito rico; empresas, imóveis e investimentos volumosos.",
      "Fortuna imensa; poucos mortais no mundo têm tanto.",
    ],
    name: "Recursos",
    points: OPEN_RANGE,
    source: "Corebook",
    tipo: "vantagem",
  },
  {
    aliases: ["Haven"],
    category: "Antecedente",
    description:
      "O lugar seguro onde você dorme durante o dia. Cada ponto aumenta segurança e privacidade.",
    levels: [
      "Um quarto ou apartamento pequeno, pouco protegido.",
      "Casa ou apartamento seguro e discreto, com trancas e janelas vedadas.",
      "Imóvel amplo e fortificado, difícil de achar ou invadir.",
    ],
    name: "Refúgio",
    points: [1, 2, 3],
    source: "Corebook",
    tipo: "vantagem",
  },
  {
    aliases: ["Status"],
    category: "Antecedente",
    description:
      "Reputação dentro da sua seita ou facção na sociedade vampírica local.",
    levels: [
      "Conhecido e aceito; não é mais um neófito qualquer.",
      "Respeitado; sua palavra conta em disputas menores.",
      "Figura de destaque, com cargo ou favor reconhecido.",
      "Autoridade: Primógeno, Harpia ou equivalente.",
      "O topo da cidade: Príncipe, Barão ou braço direito.",
    ],
    name: "Status",
    points: OPEN_RANGE,
    source: "Corebook",
    tipo: "vantagem",
  },
];

const sub = (parent: string) => `Antecedente · ${parent}`;
const haven = { category: sub("Refúgio"), parent: "Refúgio" } as const;
const needsHaven = { merit: "Refúgio", min: 1 } as const;

export const BACKGROUND_EXTRAS: readonly MeritTemplate[] = [
  // Aliados
  {
    aliases: ["Enemy"],
    category: sub("Aliados"),
    description:
      "Mortais com uma rixa contra você. O Defeito vale dois pontos a menos que a ameaça real deles.",
    levels: [
      "Um mortal comum que atrapalha quando pode.",
      "Inimigo com recursos ou contatos; ameaça real.",
      "Rival poderoso que planeja sua queda.",
      "Inimigo influente na cidade; quer você destruído.",
      "Uma organização inteira caça você.",
    ],
    name: "Inimigo",
    parent: "Aliados",
    points: OPEN_RANGE,
    source: "Corebook",
    tipo: "defeito",
  },
  // Fama
  {
    aliases: ["Dark Secret"],
    category: sub("Fama"),
    description:
      "Um delito grave do seu passado, ainda secreto, conhecido só por um ou dois inimigos dispostos a usá-lo contra você.",
    name: "Segredo Obscuro",
    parent: "Fama",
    points: 1,
    source: "Corebook",
    tipo: "defeito",
  },
  {
    aliases: ["Infamy"],
    category: sub("Fama"),
    description:
      "Você fez algo atroz e os outros sabem. A má fama chega antes de você.",
    name: "Infâmia",
    parent: "Fama",
    points: 2,
    source: "Corebook",
    tipo: "defeito",
  },
  // Influência
  {
    aliases: ["Disliked", "Rejeitado"],
    category: sub("Influência"),
    description:
      "Fora do seu círculo leal, as pessoas não gostam de você: perde um dado nas paradas Sociais com elas.",
    name: "Odiado",
    parent: "Influência",
    points: 1,
    source: "Corebook",
    tipo: "defeito",
  },
  {
    aliases: ["Despised"],
    category: sub("Influência"),
    description:
      "Um grupo ou região da cidade odeia você e trabalha ativamente para sabotar seus planos.",
    name: "Desprezado",
    parent: "Influência",
    points: 2,
    source: "Corebook",
    tipo: "defeito",
  },
  // Lacaios
  {
    aliases: ["Stalkers"],
    category: sub("Lacaios"),
    description:
      "Você atrai pessoas obcecadas que não o deixam em paz. Se se livrar de uma, outra aparece.",
    name: "Admiradores Obsessivos",
    parent: "Lacaios",
    points: 1,
    source: "Corebook",
    tipo: "defeito",
  },
  // Máscara
  {
    aliases: ["Known Corpse"],
    category: sub("Máscara"),
    description:
      "Gente que conhecia você sabe que você morreu há pouco tempo e reage com medo ou desconfiança ao reencontrá-lo.",
    name: "Cadáver Identificado",
    parent: "Máscara",
    points: 1,
    source: "Corebook",
    tipo: "defeito",
  },
  {
    aliases: ["Zeroed"],
    category: sub("Máscara"),
    description:
      "Seu passado foi apagado de todos os sistemas, como se você nunca tivesse existido.",
    name: "Zerado",
    parent: "Máscara",
    points: 1,
    requires: { merit: "Máscara", min: 2 },
    source: "Corebook",
    tipo: "vantagem",
  },
  {
    aliases: ["Known Blankbody"],
    category: sub("Máscara"),
    description:
      "Seu nome, histórico e conhecidos estão nos bancos de dados de agências de inteligência; a Segunda Inquisição pode reconhecê-lo como vampiro.",
    name: "Corpo em Frio Identificado",
    parent: "Máscara",
    points: 2,
    source: "Corebook",
    tipo: "defeito",
  },
  {
    aliases: ["Cobbler"],
    category: sub("Máscara"),
    description:
      "Você cria ou arranja identidades falsas para outros: leva três dias por ponto de Máscara da identidade.",
    name: "Sapateiro",
    parent: "Máscara",
    points: 1,
    requires: { merit: "Máscara", min: 2 },
    source: "Corebook",
    tipo: "vantagem",
  },
  // Mawla
  {
    aliases: ["Adversary"],
    category: sub("Mawla"),
    description:
      "Um Membro que trabalha para arruinar sua existência. O Defeito vale dois pontos a mais que um Mawla de mesmo peso.",
    name: "Adversário",
    parent: "Mawla",
    points: OPEN_RANGE,
    source: "Corebook",
    tipo: "defeito",
  },
  // Rebanho
  {
    aliases: ["Obvious Predator", "Predador Óbvio"],
    category: sub("Rebanho"),
    description:
      "Você exala perigo: perde dois dados nas paradas de caça (exceto perseguição física) e um dado nas paradas Sociais com mortais. Não pode manter Rebanho.",
    name: "Predador Manifesto",
    parent: "Rebanho",
    points: 2,
    source: "Corebook",
    tipo: "defeito",
  },
  // Recursos
  {
    aliases: ["Destitute"],
    category: sub("Recursos"),
    description:
      "Sem dinheiro, sem casa, sem nada de valor além do próprio corpo.",
    name: "Destituído",
    parent: "Recursos",
    points: 1,
    source: "Corebook",
    tipo: "defeito",
  },
  // Refúgio
  {
    ...haven,
    aliases: ["No Haven"],
    description:
      "Você não tem onde dormir: toda noite precisa passar num teste simples para achar um lugar seguro para o dia.",
    name: "Nenhum Refúgio",
    points: 1,
    source: "Corebook",
    tipo: "defeito",
  },
  {
    ...haven,
    aliases: ["Hidden Armory"],
    description:
      "Um arsenal escondido no refúgio: cada ponto guarda uma pistola e uma arma longa bem ocultas.",
    name: "Arsenal Oculto",
    points: OPEN_RANGE,
    requires: needsHaven,
    source: "Corebook",
    tipo: "vantagem",
  },
  {
    ...haven,
    aliases: ["Creepy", "Refúgio Assustador"],
    description:
      "Seu refúgio parece o covil de um assassino em série. Vizinhos podem denunciá-lo à polícia ou comentar o que viram. Perde dois dados nas paradas Sociais para seduzir ou deixar hóspedes humanos à vontade.",
    name: "Assustador",
    points: 1,
    source: "Corebook",
    tipo: "defeito",
  },

  {
    ...haven,
    aliases: ["Cell"],
    description:
      "Celas no refúgio: cada ponto prende dois prisioneiros ou dificulta a fuga em um.",
    name: "Cela",
    points: OPEN_RANGE,
    requires: { merit: "Refúgio", min: 2 },
    source: "Corebook",
    tipo: "vantagem",
  },
  {
    ...haven,
    aliases: ["Haunted", "Refúgio Assombrado"],
    description:
      "Seu refúgio abriga uma manifestação sobrenatural que você não controla nem compreende: um fantasma, um portal, um meteorito amaldiçoado. Quem a entenda pode usá-la para violar a segurança do refúgio. O Narrador define os efeitos, com no mínimo um dado de penalidade por ponto nas paradas afetadas dentro do refúgio.",
    name: "Assombrado",
    points: OPEN_RANGE,
    source: "Corebook",
    tipo: "defeito",
  },

  {
    ...haven,
    aliases: ["Watchmen"],
    description:
      "Guardas mortais protegem o refúgio: cada ponto dá quatro guardas comuns ou um talentoso.",
    name: "Vigilância",
    points: OPEN_RANGE,
    requires: needsHaven,
    source: "Corebook",
    tipo: "vantagem",
  },
  {
    ...haven,
    aliases: ["Compromised"],
    description:
      "O refúgio está numa lista de vigilância das autoridades e talvez já tenha sido invadido.",
    name: "Comprometido",
    points: 2,
    source: "Corebook",
    tipo: "defeito",
  },
  {
    ...haven,
    aliases: ["Laboratory"],
    description:
      "Um laboratório no refúgio: cada ponto soma um dado em testes de Ciência ou Tecnologia com especialidade ligada ao laboratório, ou de Alquimia de Sangue-ralo.",
    name: "Laboratório",
    points: OPEN_RANGE,
    requires: { merit: "Refúgio", min: 2 },
    source: "Corebook",
    tipo: "vantagem",
  },
  {
    ...haven,
    aliases: ["Shared"],
    description:
      "O refúgio é dividido com outro Membro ou pertence a um senhorio, o que traz complicações. 2 pontos quando o dono pode expulsá-lo.",
    name: "Refúgio Compartilhado",
    points: [1, 2],
    source: "Players Guide",
    tipo: "defeito",
  },
  {
    ...haven,
    aliases: ["Library"],
    description:
      "Uma biblioteca no refúgio: cada ponto soma um dado em testes de Erudição, Investigação ou Ocultismo ligados ao acervo (no máximo 1 ponto num Refúgio de 1).",
    name: "Biblioteca",
    points: OPEN_RANGE,
    requires: needsHaven,
    source: "Corebook",
    tipo: "vantagem",
  },
  {
    ...haven,
    aliases: ["Location"],
    description:
      "O refúgio fica num lugar vantajoso: +2 dados em testes ligados à localização, ou +2 de Dificuldade para inimigos.",
    name: "Localização",
    points: 1,
    requires: needsHaven,
    source: "Corebook",
    tipo: "vantagem",
  },
  {
    ...haven,
    aliases: ["Luxury"],
    description:
      "Refúgio luxuoso e bem decorado: +2 dados nas paradas Sociais com mortais dentro dele. Obtido de forma legítima, exige Recursos 3 ou mais.",
    name: "Luxo",
    points: 1,
    requires: needsHaven,
    source: "Corebook",
    tipo: "vantagem",
  },
  {
    ...haven,
    aliases: ["Postern"],
    description:
      "Uma saída secreta: cada ponto soma um dado para fugir ou despistar perseguidores perto do refúgio.",
    name: "Poterna",
    points: OPEN_RANGE,
    requires: needsHaven,
    source: "Corebook",
    tipo: "vantagem",
  },
  {
    ...haven,
    aliases: ["Security System"],
    description:
      "Trancas, alarmes e reforços: cada ponto soma um dado para resistir a invasores.",
    name: "Sistema de Segurança",
    points: OPEN_RANGE,
    requires: needsHaven,
    source: "Corebook",
    tipo: "vantagem",
  },
  {
    ...haven,
    aliases: ["Surgery"],
    description:
      "Uma sala cirúrgica no refúgio: +2 dados em testes de Medicina feitos nela.",
    name: "Sala de Operações",
    points: 1,
    requires: needsHaven,
    source: "Corebook",
    tipo: "vantagem",
  },
  {
    ...haven,
    aliases: ["Warding"],
    description:
      "Proteções mágicas afastam o sobrenatural: cada ponto soma um dado para resistir a vidência e intrusões sobrenaturais.",
    name: "Proteção",
    points: OPEN_RANGE,
    requires: needsHaven,
    source: "Corebook",
    tipo: "vantagem",
  },
  {
    ...haven,
    aliases: ["Business Establishment"],
    description:
      "O refúgio funciona como um negócio: gera renda, mas fica exposto. Perde um ponto de privacidade e defesa contra intrusões financeiras ou criminais.",
    name: "Estabelecimento Comercial",
    points: [2, 3],
    requires: needsHaven,
    source: "Players Guide",
    tipo: "vantagem",
  },
  {
    ...haven,
    aliases: ["Furcus"],
    description:
      "O refúgio fica sobre veios da terra ou rasgos no Véu: soma dados iguais aos pontos em Rituais e Cerimônias feitos nele.",
    name: "Furcus",
    points: [1, 2, 3],
    requires: needsHaven,
    source: "Players Guide",
    tipo: "vantagem",
  },
  {
    ...haven,
    aliases: ["Machine Shop"],
    description:
      "Uma oficina no refúgio: cada ponto soma um dado para construir, consertar ou desmontar máquinas.",
    name: "Oficina de Máquinas",
    points: OPEN_RANGE,
    requires: needsHaven,
    source: "Players Guide",
    tipo: "vantagem",
  },
  // Status
  {
    aliases: ["Suspect"],
    category: sub("Status"),
    description:
      "Você irritou sua seita: perde dois dados nas paradas Sociais com os membros ofendidos até provar seu valor.",
    name: "Suspeito",
    parent: "Status",
    points: 1,
    source: "Corebook",
    tipo: "defeito",
  },
  {
    aliases: ["City Secrets"],
    category: sub("Status"),
    description:
      "Você conhece segredos da estrutura de poder dos Membros (ou dos negócios mortais) da cidade: valem proteção ou um bom preço.",
    name: "Segredos da Cidade",
    parent: "Status",
    points: [1, 2, 3],
    source: "Players Guide",
    tipo: "vantagem",
  },
  {
    aliases: ["Shunned", "Evitado"],
    category: sub("Status"),
    description:
      "Sua seita despreza você depois de uma transgressão grave e trabalha ativamente contra você.",
    name: "Segregado",
    parent: "Status",
    points: 2,
    source: "Corebook",
    tipo: "defeito",
  },
];
