/**
 * Atma Vedika — Seletor de Trechos do Compêndio Védico
 *
 * Dado um BirthChart, compõe leituras a partir dos dados
 * pesquisados em vedic-knowledge.ts — sem IA.
 *
 * Cada função retorna um ou mais CompendiumBlocks:
 * texto real do compêndio montado com os dados do mapa do usuário.
 *
 * Uso futuro: substituir pelo Claude Sonnet 4.6 mantendo
 * a mesma assinatura de retorno (CompendiumBlock[]).
 */

import type { BirthChart, PlanetName } from '@/types/chart';
import {
  PLANET_ARCHETYPES,
  SIGN_ARCHETYPES,
  HOUSE_MEANINGS,
  NAKSHATRA_MEANINGS,
  DASHA_THEMES,
  KEY_YOGAS,
} from './vedic-knowledge';

// ─── Tipos ────────────────────────────────────────────────────

export interface CompendiumBlock {
  id: string;
  category: 'nakshatra' | 'dasha' | 'planet' | 'house' | 'yoga' | 'lifeArea';
  title: string;
  subtitle: string;
  body: string;
  accent: string;
  symbol: string;
  source: string;
}

// Paleta de cores por planeta
const PLANET_ACCENT: Record<PlanetName, string> = {
  Sun: '#FFB74D',
  Moon: '#E8E6DD',
  Mars: '#EF4444',
  Mercury: '#10B981',
  Jupiter: '#F59E0B',
  Venus: '#EC4899',
  Saturn: '#3B82F6',
  Rahu: '#6366F1',
  Ketu: '#8B5CF6',
};

const PLANET_SYMBOL: Record<PlanetName, string> = {
  Sun: '☉',
  Moon: '☽',
  Mars: '♂',
  Mercury: '☿',
  Jupiter: '♃',
  Venus: '♀',
  Saturn: '♄',
  Rahu: '☊',
  Ketu: '☋',
};

function ordinal(n: number): string {
  const map: Record<number, string> = {
    1: '1ª', 2: '2ª', 3: '3ª', 4: '4ª', 5: '5ª', 6: '6ª',
    7: '7ª', 8: '8ª', 9: '9ª', 10: '10ª', 11: '11ª', 12: '12ª',
  };
  return map[n] ?? `${n}ª`;
}

/** Primeira letra maiúscula — pra usar trechos do compêndio como frase. */
function cap(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

const MONTHS_PT = [
  'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
  'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro',
];

/** "2026-08-14" → "14 de agosto de 2026". Datas fora do padrão passam intactas. */
export function formatDatePt(iso: string): string {
  const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return iso;
  const month = MONTHS_PT[Number(m[2]) - 1];
  if (!month) return iso;
  return `${Number(m[3])} de ${month} de ${m[1]}`;
}

// ─── Nakshatras ──────────────────────────────────────────────

export function getMoonNakshatraBlock(chart: BirthChart): CompendiumBlock {
  const { name, pada, ruler } = chart.moonNakshatra;
  const nak = NAKSHATRA_MEANINGS[name];
  const rulerArch = PLANET_ARCHETYPES[ruler];

  const body = [
    `${cap(nak.keyword)}. É sob ${nak.deity} que sua Lua nasceu, no símbolo de ${nak.symbol}, entre ${nak.degrees}.`,
    '',
    `Seu dom — ${nak.gift}.`,
    '',
    `Sua sombra — ${nak.shadow}.`,
    '',
    `${rulerArch.pt} rege esse chão: ${rulerArch.keyword.toLowerCase()}, e governa ${rulerArch.governs}.`,
  ].join('\n');

  return {
    id: 'moon-nakshatra',
    category: 'nakshatra',
    title: `Lua em ${name}`,
    subtitle: `Pada ${pada} · regida por ${rulerArch.pt}`,
    body,
    accent: PLANET_ACCENT[ruler],
    symbol: '☽',
    source: `Nakshatra ${name} — BPHS / Nakshatra Insights (Prash Trivedi)`,
  };
}

export function getSunNakshatraBlock(chart: BirthChart): CompendiumBlock {
  const { name, pada, ruler } = chart.sunNakshatra;
  const nak = NAKSHATRA_MEANINGS[name];
  const rulerArch = PLANET_ARCHETYPES[ruler];

  const body = [
    `${cap(nak.keyword)}. Aqui mora o seu propósito, sob ${nak.deity}, entre ${nak.degrees}.`,
    '',
    `Seu dom — ${nak.gift}.`,
    '',
    `Sua sombra — ${nak.shadow}.`,
    '',
    `${rulerArch.pt} ilumina esse ponto: ${rulerArch.keyword.toLowerCase()}, e governa ${rulerArch.governs}.`,
  ].join('\n');

  return {
    id: 'sun-nakshatra',
    category: 'nakshatra',
    title: `Sol em ${name}`,
    subtitle: `Pada ${pada} · regida por ${rulerArch.pt}`,
    body,
    accent: PLANET_ACCENT[ruler],
    symbol: '☉',
    source: `Nakshatra ${name} — BPHS`,
  };
}

export function getAscendantNakshatraBlock(chart: BirthChart): CompendiumBlock {
  const { name, pada, ruler } = chart.ascendantNakshatra;
  const nak = NAKSHATRA_MEANINGS[name];
  const rulerArch = PLANET_ARCHETYPES[ruler];
  const ascSign = SIGN_ARCHETYPES[chart.ascendant];

  const body = [
    `Seu Ascendente nasce em ${ascSign.pt} — ${ascSign.keyword} — dentro do nakshatra ${name}. ${cap(nak.keyword)}.`,
    '',
    `Seu dom — ${nak.gift}.`,
    '',
    `Sua sombra — ${nak.shadow}.`,
    '',
    `${rulerArch.pt} é quem rege esse portal: ${rulerArch.keyword.toLowerCase()}. E ${ascSign.pt} dá o tom de tudo — ${ascSign.nature}.`,
  ].join('\n');

  return {
    id: 'ascendant-nakshatra',
    category: 'nakshatra',
    title: `Ascendente em ${name}`,
    subtitle: `${ascSign.pt} · Pada ${pada} · regida por ${rulerArch.pt}`,
    body,
    accent: PLANET_ACCENT[ruler],
    symbol: '↑',
    source: `Nakshatra ${name} — BPHS`,
  };
}

// ─── Dasha ───────────────────────────────────────────────────

export function getCurrentDashaBlock(chart: BirthChart): CompendiumBlock {
  const { currentMahadasha, currentAntardasha, mahadashaProgress, periods } =
    chart.vimshottariDasha;
  const dasha = DASHA_THEMES[currentMahadasha];
  const antardasha = PLANET_ARCHETYPES[currentAntardasha];
  const pct = Math.round(mahadashaProgress * 100);

  const currentIdx = periods.findIndex((p) => p.planet === currentMahadasha);
  const nextPeriod = currentIdx >= 0 ? periods[currentIdx + 1] : undefined;
  const next = nextPeriod ? DASHA_THEMES[nextPeriod.planet] : null;

  const body = [
    `Você está a ${pct}% do Mahadasha de ${dasha.pt}, um ciclo de ${dasha.duration} anos. É um tempo de ${dasha.theme}.`,
    '',
    `O período acende ${dasha.activates}.`,
    '',
    `O convite é claro: ${dasha.invitation}. O desafio, igualmente: ${dasha.challenge}.`,
    '',
    `Por dentro dele corre a antardasha de ${antardasha.pt} — ${antardasha.keyword.toLowerCase()} —, o sub-período que colore o agora.`,
    ...(next && nextPeriod
      ? [
          '',
          `Adiante, a partir de ${formatDatePt(nextPeriod.startDate)}, entra ${next.pt}: ${next.theme}.`,
        ]
      : []),
  ].join('\n');

  return {
    id: 'current-dasha',
    category: 'dasha',
    title: `Mahadasha de ${dasha.pt}`,
    subtitle: `${pct}% completo · Antardasha: ${antardasha.pt}`,
    body,
    accent: PLANET_ACCENT[currentMahadasha],
    symbol: PLANET_SYMBOL[currentMahadasha],
    source: 'Sistema Vimshottari — Parashara',
  };
}

// ─── Planetas ─────────────────────────────────────────────────

export function getPlanetBlock(
  chart: BirthChart,
  planet: PlanetName,
): CompendiumBlock {
  const pos = chart.planets[planet];
  const arch = PLANET_ARCHETYPES[planet];
  const sign = SIGN_ARCHETYPES[pos.sign];
  const house = HOUSE_MEANINGS[pos.house];

  const body = [
    `${arch.pt} é ${arch.keyword.toLowerCase()} — governa ${arch.governs}. No seu mapa, ele se instala em ${sign.pt}, na ${ordinal(pos.house)} casa (${house.sanskrit}).`,
    '',
    `${sign.pt} dá a cor: ${sign.nature} (${sign.quality}, ${sign.element}). A casa dá o palco — ${house.topic}.`,
    '',
    ...(pos.retrograde
      ? [`Retrógrado, a energia de ${arch.pt} olha para dentro: é um karma a revisitar e integrar, não a estrear.`, '']
      : []),
    `Quando desalinhado, ${arch.pt} mostra a sombra — ${arch.shadow}.`,
    '',
    `Ele se eleva em ${SIGN_ARCHETYPES[arch.exaltation].pt} e se enfraquece em ${SIGN_ARCHETYPES[arch.debilitation].pt}.`,
  ].join('\n');

  return {
    id: `planet-${planet.toLowerCase()}`,
    category: 'planet',
    title: `${arch.pt} em ${sign.pt}`,
    subtitle: `${ordinal(pos.house)} casa · ${house.sanskrit}${pos.retrograde ? ' · Retrógrado' : ''}`,
    body,
    accent: PLANET_ACCENT[planet],
    symbol: PLANET_SYMBOL[planet],
    source: `Graha ${arch.pt} — BPHS Capítulo ${planet}`,
  };
}

export function getAllPlanetBlocks(chart: BirthChart): CompendiumBlock[] {
  const order: PlanetName[] = [
    'Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu',
  ];
  return order.map((p) => getPlanetBlock(chart, p));
}

// ─── Casas ───────────────────────────────────────────────────

export function getHouseBlock(
  chart: BirthChart,
  houseNumber: number,
): CompendiumBlock {
  const houseInfo = chart.houses[houseNumber - 1];
  const meaning = HOUSE_MEANINGS[houseNumber];
  const sign = SIGN_ARCHETYPES[houseInfo.sign];
  const lord = PLANET_ARCHETYPES[houseInfo.signLord];
  const lordPos = chart.planets[houseInfo.signLord];

  const occupancy =
    houseInfo.planetsIn.length > 0
      ? `Aqui habita${houseInfo.planetsIn.length > 1 ? 'm' : ''} ${houseInfo.planetsIn
          .map((p) => PLANET_ARCHETYPES[p].pt)
          .join(' e ')} — ${houseInfo.planetsIn
          .map((p) => PLANET_ARCHETYPES[p].keyword.toLowerCase())
          .join('; ')}.`
      : `Nenhum planeta habita esta casa, então ela se lê pelo regente, ${lord.pt}.`;

  const body = [
    `${meaning.sanskrit}, a casa de ${meaning.topic}.`,
    '',
    `Ela se abre em ${sign.pt} — ${sign.nature} (${sign.element}, ${sign.quality}). Quem a rege é ${lord.pt}, ${lord.keyword.toLowerCase()}, posicionado na ${ordinal(lordPos.house)} casa.`,
    '',
    occupancy,
    '',
    `Na tradição, esta bhava responde por ${meaning.significators}; é uma casa do tipo ${meaning.type}.`,
  ].join('\n');

  return {
    id: `house-${houseNumber}`,
    category: 'house',
    title: `${ordinal(houseNumber)} Casa — ${meaning.sanskrit}`,
    subtitle: `${sign.pt} · Regente: ${lord.pt}`,
    body,
    accent: PLANET_ACCENT[houseInfo.signLord],
    symbol: `${houseNumber}`,
    source: `Bhava ${houseNumber} — BPHS`,
  };
}

export function getAllHouseBlocks(chart: BirthChart): CompendiumBlock[] {
  return Array.from({ length: 12 }, (_, i) => getHouseBlock(chart, i + 1));
}

// ─── Yogas ───────────────────────────────────────────────────

export function getYogaBlocks(chart: BirthChart): CompendiumBlock[] {
  const blocks: CompendiumBlock[] = [];

  // Gajakesari Yoga
  const jup = chart.planets.Jupiter;
  const moon = chart.planets.Moon;
  const dist = Math.abs(jup.house - moon.house);
  const isKendra = [0, 3, 6, 9].includes(dist) || [0, 3, 6, 9].includes(12 - dist);
  if (isKendra) {
    const yoga = KEY_YOGAS.gajakesariYoga;
    blocks.push({
      id: 'yoga-gajakesari',
      category: 'yoga',
      title: 'Gajakesari Yoga',
      subtitle: `Júpiter (Casa ${jup.house}) + Lua (Casa ${moon.house}) em kendra`,
      body: [
        `${cap(yoga.definition)}.`,
        '',
        `No seu mapa ele se forma: Júpiter na ${ordinal(jup.house)} casa e a Lua na ${ordinal(moon.house)}, guardando entre si uma relação de kendra.`,
        '',
        `O que ele traz — ${yoga.effect}. E se ativa com ${yoga.activation.toLowerCase()}.`,
      ].join('\n'),
      accent: '#10B981',
      symbol: '♃☽',
      source: 'Gajakesari Yoga — Phala Deepika',
    });
  }

  // Raj Yoga
  const kendraHouses = [1, 4, 7, 10];
  const trikonaHouses = [1, 5, 9];
  const rajPlanets: PlanetName[] = [];
  for (const [name, pos] of Object.entries(chart.planets)) {
    if (kendraHouses.includes(pos.house) && trikonaHouses.includes(pos.house)) {
      rajPlanets.push(name as PlanetName);
    }
  }
  if (rajPlanets.length > 0) {
    const yoga = KEY_YOGAS.rajYoga;
    const names = rajPlanets.map((p) => PLANET_ARCHETYPES[p].pt).join(' e ');
    blocks.push({
      id: 'yoga-raj',
      category: 'yoga',
      title: 'Raj Yoga',
      subtitle: `${names} em kendra + trikona`,
      body: [
        `${cap(yoga.definition)}.`,
        '',
        `No seu mapa, ${names} ${rajPlanets.length > 1 ? 'ocupam' : 'ocupa'} uma casa que é, ao mesmo tempo, kendra e trikona — o cruzamento que acende o yoga.`,
        '',
        `O que ele traz — ${yoga.effect}. E se ativa com ${yoga.activation.toLowerCase()}.`,
      ].join('\n'),
      accent: '#FFB74D',
      symbol: '♔',
      source: 'Raj Yoga — BPHS Cap. 41',
    });
  }

  // Dhana Yoga
  const dhanaHouses = [2, 5, 9, 11];
  const dhanaInhabitants: PlanetName[] = [];
  for (const [name, pos] of Object.entries(chart.planets)) {
    if (dhanaHouses.includes(pos.house)) {
      dhanaInhabitants.push(name as PlanetName);
    }
  }
  if (dhanaInhabitants.length >= 2) {
    const yoga = KEY_YOGAS.dhanaYoga;
    const names = dhanaInhabitants.map((p) => PLANET_ARCHETYPES[p].pt).join(' e ');
    blocks.push({
      id: 'yoga-dhana',
      category: 'yoga',
      title: 'Dhana Yoga',
      subtitle: `${dhanaInhabitants.length} planetas nas casas da abundância`,
      body: [
        `${cap(yoga.definition)}.`,
        '',
        `No seu mapa, ${names} habitam as casas da abundância — 2, 5, 9 ou 11 —, abrindo mais de uma porta para o ganho.`,
        '',
        `O que ele traz — ${yoga.effect}. E se ativa com ${yoga.activation.toLowerCase()}.`,
      ].join('\n'),
      accent: '#F59E0B',
      symbol: '◈',
      source: 'Dhana Yoga — BPHS / Saravali',
    });
  }

  // Viparita Raja Yoga
  const trikHouses = [6, 8, 12];
  const trikLords: PlanetName[] = [];
  for (const h of trikHouses) {
    const houseInfo = chart.houses[h - 1];
    if (houseInfo) trikLords.push(houseInfo.signLord);
  }
  const trikLordsInTrik = trikLords.filter((p) => {
    const pos = chart.planets[p];
    return trikHouses.includes(pos.house);
  });
  if (trikLordsInTrik.length >= 2) {
    const yoga = KEY_YOGAS.viparitaRajaYoga;
    const names = trikLordsInTrik.map((p) => PLANET_ARCHETYPES[p].pt).join(' e ');
    blocks.push({
      id: 'yoga-viparita',
      category: 'yoga',
      title: 'Viparita Raja Yoga',
      subtitle: `${names} em casas trik (6/8/12)`,
      body: [
        `${cap(yoga.definition)}.`,
        '',
        `No seu mapa, ${names} — regentes de casas difíceis (6, 8, 12) — caem dentro dessas mesmas casas. O peso se dobra e, ao se dobrar, se inverte.`,
        '',
        `O que ele traz — ${yoga.effect}. E se ativa com ${yoga.activation.toLowerCase()}.`,
      ].join('\n'),
      accent: '#8B5CF6',
      symbol: '↻',
      source: 'Viparita Raja Yoga — Phala Deepika',
    });
  }

  return blocks;
}

// ─── Áreas da Vida ────────────────────────────────────────────

export function getLoveBlock(chart: BirthChart): CompendiumBlock {
  const venus = chart.planets.Venus;
  const house7 = chart.houses[6];
  const house5 = chart.houses[4];
  const lord7 = PLANET_ARCHETYPES[house7.signLord];
  const lord7Pos = chart.planets[house7.signLord];
  const venusArch = PLANET_ARCHETYPES.Venus;
  const venusSign = SIGN_ARCHETYPES[venus.sign];

  const body = [
    `No amor, o Jyotish observa três pontos: Vênus, a 7ª casa das parcerias e a 5ª do romance.`,
    '',
    `Seu Vênus está em ${venusSign.pt} — ${venusSign.nature} — na ${ordinal(venus.house)} casa. É ele quem governa ${venusArch.governs}.`,
    '',
    `A 7ª casa, de ${HOUSE_MEANINGS[7].topic}, abre-se em ${SIGN_ARCHETYPES[house7.sign].pt} e é regida por ${lord7.pt}, na ${ordinal(lord7Pos.house)} casa. ` +
      (house7.planetsIn.length > 0
        ? `Ali habita${house7.planetsIn.length > 1 ? 'm' : ''} ${house7.planetsIn.map((p) => PLANET_ARCHETYPES[p].pt).join(' e ')}, colorindo quem cruza o seu caminho como par.`
        : `Vazia, ela se lê pelo próprio regente.`),
    '',
    `A 5ª casa, do romance e da criatividade, repousa em ${SIGN_ARCHETYPES[chart.houses[4].sign].pt}.` +
      (house5.planetsIn.length > 0
        ? ` Com ${house5.planetsIn.map((p) => PLANET_ARCHETYPES[p].pt).join(' e ')} presente${house5.planetsIn.length > 1 ? 's' : ''}, o jogo do desejo ganha esse sabor.`
        : ``),
    '',
    `Quando Vênus tropeça, aparece a sombra — ${venusArch.shadow}.`,
  ].join('\n');

  return {
    id: 'life-love',
    category: 'lifeArea',
    title: 'Amor e Parcerias',
    subtitle: `Vênus em ${venusSign.pt} · 7ª casa: ${SIGN_ARCHETYPES[house7.sign].pt}`,
    body,
    accent: '#EC4899',
    symbol: '♀',
    source: '7ª bhava + Vênus — BPHS',
  };
}


export function getCareerBlock(chart: BirthChart): CompendiumBlock {
  const sun = chart.planets.Sun;
  const house10 = chart.houses[9];
  const lord10 = PLANET_ARCHETYPES[house10.signLord];
  const lord10Pos = chart.planets[house10.signLord];
  const ketu = chart.planets.Ketu;
  const sunSign = SIGN_ARCHETYPES[sun.sign];

  const body = [
    `A carreira se lê pela 10ª casa — o Karma Bhava —, pelo Sol e por Saturno.`,
    '',
    `A 10ª casa, de ${HOUSE_MEANINGS[10].topic}, está em ${SIGN_ARCHETYPES[house10.sign].pt}, regida por ${lord10.pt} na ${ordinal(lord10Pos.house)} casa. ` +
      (house10.planetsIn.length > 0
        ? `Ali habita${house10.planetsIn.length > 1 ? 'm' : ''} ${house10.planetsIn.map((p) => PLANET_ARCHETYPES[p].pt).join(' e ')}, marcando o tom da sua missão pública.`
        : `Vazia, a carreira se lê pelo regente.`),
    '',
    `Seu Sol brilha em ${sunSign.pt} — ${sunSign.nature} — na ${ordinal(sun.house)} casa; é dele o ${PLANET_ARCHETYPES.Sun.governs}.`,
    '',
    `Ketu, na ${ordinal(ketu.house)} casa, aponta um karma já vivido nessa área — ${PLANET_ARCHETYPES.Ketu.keyword.toLowerCase()}, o que pede menos apego ao reconhecimento e mais entrega ao fazer.`,
  ].join('\n');

  return {
    id: 'life-career',
    category: 'lifeArea',
    title: 'Carreira e Propósito',
    subtitle: `10ª casa: ${SIGN_ARCHETYPES[house10.sign].pt} · Regente: ${lord10.pt}`,
    body,
    accent: '#FFB74D',
    symbol: '☉',
    source: '10ª bhava + Sol — BPHS',
  };
}

export function getMoneyBlock(chart: BirthChart): CompendiumBlock {
  const house2 = chart.houses[1];
  const house11 = chart.houses[10];
  const jupiter = chart.planets.Jupiter;
  const lord2 = PLANET_ARCHETYPES[house2.signLord];
  const lord2Pos = chart.planets[house2.signLord];

  const body = [
    `A riqueza se lê pela 2ª casa, da acumulação, pela 11ª, dos ganhos, e por Júpiter, o grande benéfico.`,
    '',
    `A 2ª casa, de ${HOUSE_MEANINGS[2].topic}, está em ${SIGN_ARCHETYPES[house2.sign].pt}, regida por ${lord2.pt} na ${ordinal(lord2Pos.house)} casa. ` +
      (house2.planetsIn.length > 0
        ? `Ali habita${house2.planetsIn.length > 1 ? 'm' : ''} ${house2.planetsIn.map((p) => PLANET_ARCHETYPES[p].pt).join(' e ')}.`
        : `Vazia, lê-se pelo regente.`),
    '',
    `A 11ª, de ${HOUSE_MEANINGS[11].topic}, repousa em ${SIGN_ARCHETYPES[house11.sign].pt}.` +
      (house11.planetsIn.length > 0
        ? ` Com ${house11.planetsIn.map((p) => PLANET_ARCHETYPES[p].pt).join(' e ')}, os ganhos chegam por essa via.`
        : ``),
    '',
    `Júpiter, em ${SIGN_ARCHETYPES[jupiter.sign].pt} na ${ordinal(jupiter.house)} casa, governa ${PLANET_ARCHETYPES.Jupiter.governs}.` +
      (jupiter.retrograde ? ` Retrógrado, a abundância vem por revisão interna, não por expansão fácil.` : ``),
  ].join('\n');

  return {
    id: 'life-money',
    category: 'lifeArea',
    title: 'Riqueza e Abundância',
    subtitle: `2ª casa: ${SIGN_ARCHETYPES[house2.sign].pt} · 11ª: ${SIGN_ARCHETYPES[house11.sign].pt}`,
    body,
    accent: '#F59E0B',
    symbol: '♃',
    source: '2ª + 11ª bhava + Júpiter — BPHS',
  };
}

export function getHealthBlock(chart: BirthChart): CompendiumBlock {
  const house1 = chart.houses[0];
  const house6 = chart.houses[5];
  const house8 = chart.houses[7];
  const asc = PLANET_ARCHETYPES[house1.signLord];
  const ascSign = SIGN_ARCHETYPES[chart.ascendant];

  const body = [
    `A saúde se lê pelo Ascendente, que dá a vitalidade geral, pela 6ª casa das doenças e pela 8ª das crises e da longevidade.`,
    '',
    `Seu Ascendente em ${ascSign.pt} — ${ascSign.nature} — é regido por ${asc.pt}, ${asc.keyword.toLowerCase()}.` +
      (house1.planetsIn.length > 0
        ? ` No corpo do mapa, ${house1.planetsIn.map((p) => PLANET_ARCHETYPES[p].pt).join(' e ')} reforça${house1.planetsIn.length > 1 ? 'm' : ''} essa porta.`
        : ``),
    '',
    `A 6ª casa, de ${HOUSE_MEANINGS[6].topic}, está em ${SIGN_ARCHETYPES[house6.sign].pt}. ` +
      (house6.planetsIn.length > 0
        ? `Com ${house6.planetsIn.map((p) => PLANET_ARCHETYPES[p].pt).join(' e ')} aqui, é onde a vida cobra cuidado.`
        : `Vazia, sinaliza boa resistência natural.`),
    '',
    `A 8ª, de ${HOUSE_MEANINGS[8].topic}, repousa em ${SIGN_ARCHETYPES[house8.sign].pt}.` +
      (house8.planetsIn.length > 0
        ? ` Com ${house8.planetsIn.map((p) => PLANET_ARCHETYPES[p].pt).join(' e ')}, as transformações são profundas.`
        : ``),
  ].join('\n');

  return {
    id: 'life-health',
    category: 'lifeArea',
    title: 'Saúde e Vitalidade',
    subtitle: `Ascendente: ${ascSign.pt} · 6ª: ${SIGN_ARCHETYPES[house6.sign].pt}`,
    body,
    accent: '#10B981',
    symbol: '⊕',
    source: 'Lagna + 6ª + 8ª bhava — BPHS',
  };
}

export function getFamilyBlock(chart: BirthChart): CompendiumBlock {
  const moon = chart.planets.Moon;
  const house4 = chart.houses[3];
  const house2 = chart.houses[1];
  const moonSign = SIGN_ARCHETYPES[moon.sign];
  const lord4 = PLANET_ARCHETYPES[house4.signLord];
  const lord4Pos = chart.planets[house4.signLord];

  const body = [
    `A família se lê pela 4ª casa, da mãe e do lar, pela 2ª, da família próxima, e pela Lua, que rege a nutrição e a mente.`,
    '',
    `A 4ª casa, de ${HOUSE_MEANINGS[4].topic}, está em ${SIGN_ARCHETYPES[house4.sign].pt}, regida por ${lord4.pt} na ${ordinal(lord4Pos.house)} casa. ` +
      (house4.planetsIn.length > 0
        ? `Ali habita${house4.planetsIn.length > 1 ? 'm' : ''} ${house4.planetsIn.map((p) => PLANET_ARCHETYPES[p].pt).join(' e ')}.`
        : `Vazia, lê-se pelo regente.`),
    '',
    `Sua Lua, em ${moonSign.pt} — ${moonSign.nature} — na ${ordinal(moon.house)} casa, governa ${PLANET_ARCHETYPES.Moon.governs}.`,
    '',
    `A 2ª casa, de ${HOUSE_MEANINGS[2].topic}, repousa em ${SIGN_ARCHETYPES[house2.sign].pt}.` +
      (house2.planetsIn.length > 0
        ? ` Com ${house2.planetsIn.map((p) => PLANET_ARCHETYPES[p].pt).join(' e ')}, os laços de sangue pesam nessa textura.`
        : ``),
  ].join('\n');

  return {
    id: 'life-family',
    category: 'lifeArea',
    title: 'Família e Raízes',
    subtitle: `Lua em ${moonSign.pt} · 4ª casa: ${SIGN_ARCHETYPES[house4.sign].pt}`,
    body,
    accent: '#E8E6DD',
    symbol: '☽',
    source: '4ª bhava + Lua — BPHS',
  };
}

// ─── Leitura Completa ─────────────────────────────────────────

export interface FullCompendiumReading {
  moonNakshatra: CompendiumBlock;
  sunNakshatra: CompendiumBlock;
  ascendantNakshatra: CompendiumBlock;
  dasha: CompendiumBlock;
  planets: CompendiumBlock[];
  houses: CompendiumBlock[];
  yogas: CompendiumBlock[];
  lifeAreas: {
    love: CompendiumBlock;
    career: CompendiumBlock;
    money: CompendiumBlock;
    health: CompendiumBlock;
    family: CompendiumBlock;
  };
}

export function getFullCompendiumReading(chart: BirthChart): FullCompendiumReading {
  return {
    moonNakshatra: getMoonNakshatraBlock(chart),
    sunNakshatra: getSunNakshatraBlock(chart),
    ascendantNakshatra: getAscendantNakshatraBlock(chart),
    dasha: getCurrentDashaBlock(chart),
    planets: getAllPlanetBlocks(chart),
    houses: getAllHouseBlocks(chart),
    yogas: getYogaBlocks(chart),
    lifeAreas: {
      love: getLoveBlock(chart),
      career: getCareerBlock(chart),
      money: getMoneyBlock(chart),
      health: getHealthBlock(chart),
      family: getFamilyBlock(chart),
    },
  };
}
