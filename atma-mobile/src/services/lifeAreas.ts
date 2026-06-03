/**
 * Atma Vedika — Áreas da Vida
 *
 * 5 leituras integradas que cruzam casas + planetas do BirthChart
 * pra dar uma visão por área: Amor, Dinheiro, Carreira, Saúde, Família.
 *
 * Cada área é uma narrativa coesa — combina os significadores mais
 * relevantes pra aquele tema na tradição védica.
 */

import type { BirthChart, PlanetName, SignName } from '@/types/chart';

export interface LifeAreaReading {
  id: 'love' | 'money' | 'career' | 'health' | 'family';
  ritual: string;
  symbol: string;
  title: string;
  subtitle: string;
  body: string;
  metric: { label: string; value: string };
  accent: string;
}

const PLANET_PT: Record<PlanetName, string> = {
  Sun: 'Sol',
  Moon: 'Lua',
  Mars: 'Marte',
  Mercury: 'Mercúrio',
  Jupiter: 'Júpiter',
  Venus: 'Vênus',
  Saturn: 'Saturno',
  Rahu: 'Rahu',
  Ketu: 'Ketu',
};

const SIGN_PT: Record<SignName, string> = {
  Aries: 'Áries',
  Taurus: 'Touro',
  Gemini: 'Gêmeos',
  Cancer: 'Câncer',
  Leo: 'Leão',
  Virgo: 'Virgem',
  Libra: 'Libra',
  Scorpio: 'Escorpião',
  Sagittarius: 'Sagitário',
  Capricorn: 'Capricórnio',
  Aquarius: 'Aquário',
  Pisces: 'Peixes',
};

const ORD: Record<number, string> = {
  1: '1ª',
  2: '2ª',
  3: '3ª',
  4: '4ª',
  5: '5ª',
  6: '6ª',
  7: '7ª',
  8: '8ª',
  9: '9ª',
  10: '10ª',
  11: '11ª',
  12: '12ª',
};

const p = (planet: PlanetName) => PLANET_PT[planet];
const s = (sign: SignName) => SIGN_PT[sign];
const ord = (n: number) => ORD[n] ?? `${n}ª`;

// ─── Construtor das 5 áreas ──────────────────────────────

export function buildLifeAreas(chart: BirthChart): LifeAreaReading[] {
  return [
    buildLove(chart),
    buildMoney(chart),
    buildCareer(chart),
    buildHealth(chart),
    buildFamily(chart),
  ];
}

// ─── Amor ────────────────────────────────────────────────

function buildLove(chart: BirthChart): LifeAreaReading {
  const venus = chart.planets.Venus;
  const moon = chart.planets.Moon;
  const house7 = chart.houses[6];
  const house5 = chart.houses[4];
  const house7Inhabitants = house7.planetsIn;
  const has7Planet = house7Inhabitants.length > 0;

  const body =
    `No amor, a astrologia védica olha pra três pontos: Vênus, a 7ª casa (parcerias) e a 5ª casa (romance).\n\n` +
    `Vênus em ${s(venus.sign)}, na sua ${ord(venus.house)} casa, define o tom do seu desejo — você se apaixona pelo que tem o sabor de ${s(venus.sign)}. ` +
    `A sua 7ª casa está em ${s(house7.sign)}, regida por ${p(house7.signLord)}. ${
      has7Planet
        ? `Habitada por ${house7Inhabitants.map(p).join(' e ')}, isso colore profundamente quem te atrai como par.`
        : 'Sem planetas habitando — a leitura vem do regente, e o tipo de parceiro segue esse padrão.'
    }\n\n` +
    `Sua Lua em ${s(moon.sign)} adiciona a camada emocional: você se conecta com quem entende essa textura. ` +
    `Na 5ª casa, ${s(house5.sign)} colore o romance — como você ama com prazer, antes do compromisso.\n\n` +
    `O amor real vem quando essas três peças se alinham: alguém que te acende (Vênus), que aparece (7ª) e que te toca por dentro (Lua).`;

  return {
    id: 'love',
    ritual: '✦  amor  ✦',
    symbol: '❤',
    title: 'Como você ama.',
    subtitle: `Vênus em ${s(venus.sign)}, ${ord(venus.house)} casa.`,
    body,
    metric: { label: 'parceiro vem por', value: p(house7.signLord) },
    accent: '#EC4899',
  };
}

// ─── Dinheiro ────────────────────────────────────────────

function buildMoney(chart: BirthChart): LifeAreaReading {
  const jupiter = chart.planets.Jupiter;
  const house2 = chart.houses[1];
  const house11 = chart.houses[10];
  const house10 = chart.houses[9];
  const house2Inhabitants = house2.planetsIn;
  const house11Inhabitants = house11.planetsIn;

  const body =
    `O dinheiro no Jyotish é olhado por três casas: a 2ª (o que você acumula), a 11ª (ganhos via comunidade) e a 10ª (o que vem pela carreira). Júpiter é o significador maior — o planeta da abundância.\n\n` +
    `Sua 2ª casa está em ${s(house2.sign)}, regida por ${p(house2.signLord)}. ${
      house2Inhabitants.length > 0
        ? `Habitada por ${house2Inhabitants.map(p).join(' e ')} — é por aí que sua riqueza tem forma.`
        : 'Sem planetas habitando — o regente ' + p(house2.signLord) + ' dita o tom do que você guarda.'
    } Você acumula valor pelo modo que esse signo se comporta.\n\n` +
    `Sua 11ª casa, em ${s(house11.sign)} regida por ${p(house11.signLord)}, fala dos ganhos que vêm de fora — amigos, redes, comunidades. ${
      house11Inhabitants.length > 0
        ? `Com ${house11Inhabitants.map(p).join(' e ')} aqui, ganhos via coletivo são fortes.`
        : 'Trabalhe sua rede — é por ela que vem mais do que pelo esforço solo.'
    }\n\n` +
    `Júpiter em ${s(jupiter.sign)}, ${ord(jupiter.house)} casa, abençoa essa área. A casa onde Júpiter está é onde a abundância chega com menos esforço.`;

  return {
    id: 'money',
    ritual: '✦  dinheiro  ✦',
    symbol: '◈',
    title: 'Como o dinheiro vem.',
    subtitle: `Júpiter em ${s(jupiter.sign)}, ${ord(jupiter.house)} casa.`,
    body,
    metric: { label: 'abundância via', value: `${ord(jupiter.house)} casa` },
    accent: '#F59E0B',
  };
}

// ─── Carreira ────────────────────────────────────────────

function buildCareer(chart: BirthChart): LifeAreaReading {
  const saturn = chart.planets.Saturn;
  const sun = chart.planets.Sun;
  const house10 = chart.houses[9];
  const house10Inhabitants = house10.planetsIn;

  const body =
    `Carreira é a 10ª casa — o ponto mais alto do céu no seu nascimento. É o que o mundo lembra de você quando você não está na sala.\n\n` +
    `Sua 10ª está em ${s(house10.sign)}, regida por ${p(house10.signLord)}. ${
      house10Inhabitants.length > 0
        ? `Habitada por ${house10Inhabitants.map(p).join(' e ')}, sua autoridade pública vem dessas energias.`
        : `Sem planetas habitando — você deve olhar pra onde ${p(house10.signLord)} está no seu mapa pra entender o caminho.`
    } O signo ${s(house10.sign)} pinta o tipo de carreira que floresce.\n\n` +
    `Saturno em ${s(saturn.sign)}, ${ord(saturn.house)} casa, é o juiz interno do trabalho. Ele dá maturidade no tempo — você ganha autoridade real depois dos 35. Antes disso, é construção.\n\n` +
    `Sol em ${s(sun.sign)}, ${ord(sun.house)} casa, mostra onde sua autoridade interna brilha. Quando essa luz se alinha com a 10ª casa, carreira flui sem você precisar empurrar.`;

  return {
    id: 'career',
    ritual: '✦  carreira  ✦',
    symbol: '▲',
    title: 'Onde você é visto.',
    subtitle: `10ª casa em ${s(house10.sign)}.`,
    body,
    metric: { label: 'autoridade via', value: p(house10.signLord) },
    accent: '#3B82F6',
  };
}

// ─── Saúde ───────────────────────────────────────────────

function buildHealth(chart: BirthChart): LifeAreaReading {
  const mars = chart.planets.Mars;
  const moon = chart.planets.Moon;
  const ascendant = chart.ascendant;
  const house6 = chart.houses[5];

  const body =
    `A saúde no Jyotish é a 1ª casa (corpo), a 6ª casa (doenças, hábitos) e dois planetas chave: Marte (sangue, músculo, ação) e Lua (mente, fluidos, equilíbrio emocional).\n\n` +
    `Seu Ascendente em ${s(ascendant)} dá o corpo base — sua constituição (prakriti) segue esse signo. Pessoas de ${s(ascendant)} têm um padrão específico de força e fragilidade física.\n\n` +
    `Marte em ${s(mars.sign)}, ${ord(mars.house)} casa, governa sua energia bruta. Onde Marte está, há vitalidade; mas se aflito, pode trazer inflamação ou inquietude. ` +
    `Sua Lua em ${s(moon.sign)} é a saúde mental — quando ela tá tensa, o corpo cobra primeiro.\n\n` +
    `A 6ª casa em ${s(house6.sign)} regida por ${p(house6.signLord)} mostra como você lida com doença, rotina e disciplina diária. Forte aqui = corpo que aguenta o que vier.`;

  return {
    id: 'health',
    ritual: '✦  saúde  ✦',
    symbol: '✚',
    title: 'Seu corpo, sua mente.',
    subtitle: `Marte em ${s(mars.sign)}, ${ord(mars.house)} casa.`,
    body,
    metric: { label: 'constituição', value: s(ascendant) },
    accent: '#10B981',
  };
}

// ─── Família ─────────────────────────────────────────────

function buildFamily(chart: BirthChart): LifeAreaReading {
  const moon = chart.planets.Moon;
  const jupiter = chart.planets.Jupiter;
  const house4 = chart.houses[3];
  const house5 = chart.houses[4];
  const house4Inhabitants = house4.planetsIn;

  const body =
    `Família tem três pilares no Jyotish: a 4ª casa (mãe, lar, raízes), a 5ª casa (filhos, criatividade que continua) e a Lua, que carrega o vínculo materno mais profundo.\n\n` +
    `Sua 4ª casa está em ${s(house4.sign)}, regida por ${p(house4.signLord)}. ${
      house4Inhabitants.length > 0
        ? `Habitada por ${house4Inhabitants.map(p).join(' e ')} — essas energias colorem a memória do seu lar e o tipo de paz que você busca dentro de casa.`
        : `Sem planetas habitando — o lar segue o tom de ${s(house4.sign)} e como ${p(house4.signLord)} se manifesta no seu mapa.`
    }\n\n` +
    `Sua 5ª casa, em ${s(house5.sign)} regida por ${p(house5.signLord)}, traz a relação com filhos (biológicos ou criativos) e a continuação de você no mundo.\n\n` +
    `Lua em ${s(moon.sign)} mostra como você se sente em família — o que te dá segurança, o que te machuca. Júpiter em ${s(jupiter.sign)} ${ord(jupiter.house)} casa abençoa o linhageamento — onde a sabedoria flui pela família.`;

  return {
    id: 'family',
    ritual: '✦  família  ✦',
    symbol: '⌂',
    title: 'O lar dentro de você.',
    subtitle: `4ª casa em ${s(house4.sign)}.`,
    body,
    metric: { label: 'raízes em', value: p(house4.signLord) },
    accent: '#7C3AED',
  };
}
