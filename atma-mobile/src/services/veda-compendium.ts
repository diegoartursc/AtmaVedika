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

// ─── Nakshatras ──────────────────────────────────────────────

export function getMoonNakshatraBlock(chart: BirthChart): CompendiumBlock {
  const { name, pada, ruler } = chart.moonNakshatra;
  const nak = NAKSHATRA_MEANINGS[name];
  const rulerArch = PLANET_ARCHETYPES[ruler];

  const body = [
    `${nak.keyword.charAt(0).toUpperCase() + nak.keyword.slice(1)}.`,
    '',
    `Divindade regente: ${nak.deity}.`,
    `Símbolo sagrado: ${nak.symbol}.`,
    `Graus: ${nak.degrees}.`,
    '',
    `Dom: ${nak.gift}.`,
    '',
    `Sombra: ${nak.shadow}.`,
    '',
    `Regente ${rulerArch.pt}: ${rulerArch.keyword}. ${rulerArch.governs}.`,
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
    `${nak.keyword.charAt(0).toUpperCase() + nak.keyword.slice(1)}.`,
    '',
    `Divindade regente: ${nak.deity}.`,
    `Graus: ${nak.degrees}.`,
    '',
    `Dom: ${nak.gift}.`,
    '',
    `Sombra: ${nak.shadow}.`,
    '',
    `Regente ${rulerArch.pt}: ${rulerArch.keyword}. Governa ${rulerArch.governs}.`,
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
    `Seu Ascendente está em ${ascSign.pt} (${ascSign.keyword}), no nakshatra ${name}.`,
    '',
    `${nak.keyword.charAt(0).toUpperCase() + nak.keyword.slice(1)}.`,
    '',
    `Dom: ${nak.gift}.`,
    '',
    `Sombra: ${nak.shadow}.`,
    '',
    `Regente ${rulerArch.pt}: ${rulerArch.keyword}.`,
    `Natureza do ascendente ${ascSign.pt}: ${ascSign.nature}.`,
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

  const nextPeriod = periods.find((p) => p.planet !== currentMahadasha);
  const next = nextPeriod ? DASHA_THEMES[nextPeriod.planet] : null;

  const body = [
    `Você está a ${pct}% do Mahadasha de ${dasha.pt} — um ciclo de ${dasha.duration} anos.`,
    '',
    `Tema central: ${dasha.theme}.`,
    '',
    `O que este período ativa: ${dasha.activates}.`,
    '',
    `Convite kármico: ${dasha.invitation}.`,
    '',
    `Desafio central: ${dasha.challenge}.`,
    '',
    `Antardasha atual: ${antardasha.pt} (${antardasha.keyword}).`,
    ...(next && nextPeriod
      ? [
          '',
          `Próximo Mahadasha: ${next.pt}, a partir de ${nextPeriod.startDate}.`,
          `Tema que se aproxima: ${next.theme}.`,
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
    `${arch.pt} em ${sign.pt}, ${ordinal(pos.house)} casa (${house.sanskrit}).`,
    '',
    `Arquétipo de ${arch.pt}: ${arch.keyword}.`,
    `Governa: ${arch.governs}.`,
    '',
    `${sign.pt} (${sign.quality}, ${sign.element}): ${sign.nature}.`,
    '',
    `${house.sanskrit} — ${house.topic}.`,
    `Significadores desta casa: ${house.significators}.`,
    '',
    ...(pos.retrograde
      ? [`Retrógrado: a energia de ${arch.pt} está voltada para dentro. Karma a revisitar e integrar.`, '']
      : []),
    `Sombra de ${arch.pt}: ${arch.shadow}.`,
    '',
    `Exaltação: ${arch.exaltation}. Debilitação: ${arch.debilitation}.`,
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

  const planetLines =
    houseInfo.planetsIn.length > 0
      ? houseInfo.planetsIn.map((p) => {
          const a = PLANET_ARCHETYPES[p];
          return `• ${a.pt} aqui: ${a.keyword}. Governa ${a.governs}.`;
        })
      : ['• Vazia — lida pelo regente.'];

  const body = [
    `${meaning.sanskrit} — ${meaning.topic}.`,
    '',
    `Signo: ${sign.pt} (${sign.keyword}, ${sign.element}, ${sign.quality}).`,
    `Natureza: ${sign.nature}.`,
    '',
    `Regente: ${lord.pt} (${lord.keyword}), posicionado na ${ordinal(lordPos.house)} casa.`,
    `${lord.governs}.`,
    '',
    `Planetas presentes:`,
    ...planetLines,
    '',
    `Significadores clássicos desta casa: ${meaning.significators}.`,
    `Tipo: ${meaning.type}.`,
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
        `Definição: ${yoga.definition}.`,
        '',
        `No seu mapa: Júpiter está na ${ordinal(jup.house)} casa e a Lua na ${ordinal(moon.house)} casa — em relação kendra entre si.`,
        '',
        `Efeito: ${yoga.effect}.`,
        '',
        `Ativação: ${yoga.activation}.`,
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
    const names = rajPlanets.map((p) => PLANET_ARCHETYPES[p].pt).join(', ');
    blocks.push({
      id: 'yoga-raj',
      category: 'yoga',
      title: 'Raj Yoga',
      subtitle: `${names} em kendra + trikona`,
      body: [
        `Definição: ${yoga.definition}.`,
        '',
        `No seu mapa: ${names} ${rajPlanets.length > 1 ? 'estão' : 'está'} em casa que é simultaneamente kendra e trikona.`,
        '',
        `Efeito: ${yoga.effect}.`,
        '',
        `Ativação: ${yoga.activation}.`,
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
    const names = dhanaInhabitants.map((p) => PLANET_ARCHETYPES[p].pt).join(', ');
    blocks.push({
      id: 'yoga-dhana',
      category: 'yoga',
      title: 'Dhana Yoga',
      subtitle: `${dhanaInhabitants.length} planetas nas casas da abundância`,
      body: [
        `Definição: ${yoga.definition}.`,
        '',
        `No seu mapa: ${names} habitam as casas 2, 5, 9 ou 11.`,
        '',
        `Efeito: ${yoga.effect}.`,
        '',
        `Ativação: ${yoga.activation}.`,
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
    const names = trikLordsInTrik.map((p) => PLANET_ARCHETYPES[p].pt).join(', ');
    blocks.push({
      id: 'yoga-viparita',
      category: 'yoga',
      title: 'Viparita Raja Yoga',
      subtitle: `${names} em casas trik (6/8/12)`,
      body: [
        `Definição: ${yoga.definition}.`,
        '',
        `No seu mapa: ${names} — regentes de casas difíceis — estão posicionados em casas difíceis.`,
        '',
        `Efeito: ${yoga.effect}.`,
        '',
        `Ativação: ${yoga.activation}.`,
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
    `No Jyotish, amor e parcerias são lidos pelas casas 7 (parceria) e 5 (romance), e pelo planeta Vênus.`,
    '',
    `Vênus em ${venusSign.pt} (${venusSign.keyword}), ${ordinal(venus.house)} casa.`,
    `Vênus governa: ${venusArch.governs}.`,
    `Natureza de ${venusSign.pt}: ${venusSign.nature}.`,
    '',
    `7ª casa (Yuvati Bhava — ${HOUSE_MEANINGS[7].topic}): ${SIGN_ARCHETYPES[house7.sign].pt}.`,
    `Regente da 7ª casa: ${lord7.pt} (${lord7.keyword}), posicionado na ${ordinal(lord7Pos.house)} casa.`,
    ...(house7.planetsIn.length > 0
      ? [`Planetas na 7ª casa: ${house7.planetsIn.map((p) => PLANET_ARCHETYPES[p].pt).join(', ')}.`]
      : [`7ª casa vazia — lida pelo regente ${lord7.pt}.`]),
    '',
    `5ª casa (Putra Bhava — ${HOUSE_MEANINGS[5].topic}): ${SIGN_ARCHETYPES[chart.houses[4].sign].pt}.`,
    ...(house5.planetsIn.length > 0
      ? [`Planetas na 5ª casa: ${house5.planetsIn.map((p) => PLANET_ARCHETYPES[p].pt).join(', ')}.`]
      : [`5ª casa vazia — lida pelo regente.`]),
    '',
    `Sombra de Vênus: ${venusArch.shadow}.`,
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
    `No Jyotish, carreira é lida pela 10ª casa (Karma Bhava), pelo Sol e pelo Saturno.`,
    '',
    `10ª casa (${HOUSE_MEANINGS[10].topic}): ${SIGN_ARCHETYPES[house10.sign].pt}.`,
    `Regente: ${lord10.pt} (${lord10.keyword}), na ${ordinal(lord10Pos.house)} casa.`,
    ...(house10.planetsIn.length > 0
      ? [`Planetas na 10ª casa: ${house10.planetsIn.map((p) => PLANET_ARCHETYPES[p].pt).join(', ')}.`]
      : [`10ª casa vazia — carreira lida pelo regente ${lord10.pt}.`]),
    '',
    `Sol em ${sunSign.pt}, ${ordinal(sun.house)} casa.`,
    `Sol governa: ${PLANET_ARCHETYPES.Sun.governs}.`,
    `Natureza de ${sunSign.pt}: ${sunSign.nature}.`,
    '',
    `Ketu na ${ordinal(ketu.house)} casa (${HOUSE_MEANINGS[ketu.house].sanskrit}): karma passado nessa área.`,
    `${PLANET_ARCHETYPES.Ketu.keyword} — ${PLANET_ARCHETYPES.Ketu.governs}.`,
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
    `No Jyotish, riqueza é lida pelas casas 2 (acumulação) e 11 (ganhos), e pelo planeta Júpiter.`,
    '',
    `2ª casa (${HOUSE_MEANINGS[2].topic}): ${SIGN_ARCHETYPES[house2.sign].pt}.`,
    `Regente: ${lord2.pt} (${lord2.keyword}), na ${ordinal(lord2Pos.house)} casa.`,
    ...(house2.planetsIn.length > 0
      ? [`Planetas na 2ª casa: ${house2.planetsIn.map((p) => PLANET_ARCHETYPES[p].pt).join(', ')}.`]
      : [`2ª casa vazia — lida pelo regente ${lord2.pt}.`]),
    '',
    `11ª casa (${HOUSE_MEANINGS[11].topic}): ${SIGN_ARCHETYPES[house11.sign].pt}.`,
    ...(house11.planetsIn.length > 0
      ? [`Planetas na 11ª casa: ${house11.planetsIn.map((p) => PLANET_ARCHETYPES[p].pt).join(', ')}.`]
      : [`11ª casa vazia.`]),
    '',
    `Júpiter em ${SIGN_ARCHETYPES[jupiter.sign].pt}, ${ordinal(jupiter.house)} casa.`,
    `Júpiter governa: ${PLANET_ARCHETYPES.Jupiter.governs}.`,
    ...(jupiter.retrograde ? [`Júpiter retrógrado: abundância via revisão interna.`] : []),
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
    `No Jyotish, saúde é lida pelo Ascendente (vitalidade geral), 6ª casa (doenças) e 8ª casa (crises/longevidade).`,
    '',
    `Ascendente em ${ascSign.pt} (${ascSign.keyword}): ${ascSign.nature}.`,
    `Regente do Ascendente: ${asc.pt} (${asc.keyword}).`,
    ...(house1.planetsIn.length > 0
      ? [`Planetas no Ascendente: ${house1.planetsIn.map((p) => PLANET_ARCHETYPES[p].pt).join(', ')}.`]
      : []),
    '',
    `6ª casa (Ari Bhava — ${HOUSE_MEANINGS[6].topic}): ${SIGN_ARCHETYPES[house6.sign].pt}.`,
    ...(house6.planetsIn.length > 0
      ? [`Planetas na 6ª casa: ${house6.planetsIn.map((p) => PLANET_ARCHETYPES[p].pt).join(', ')}.`]
      : [`6ª casa vazia — resistência saudável.`]),
    '',
    `8ª casa (Randhra Bhava — ${HOUSE_MEANINGS[8].topic}): ${SIGN_ARCHETYPES[house8.sign].pt}.`,
    ...(house8.planetsIn.length > 0
      ? [`Planetas na 8ª casa: ${house8.planetsIn.map((p) => PLANET_ARCHETYPES[p].pt).join(', ')}.`]
      : [`8ª casa vazia.`]),
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
    `No Jyotish, família é lida pela 4ª casa (mãe/lar), 2ª casa (família próxima) e pela Lua (mente/nutrição).`,
    '',
    `4ª casa (${HOUSE_MEANINGS[4].topic}): ${SIGN_ARCHETYPES[house4.sign].pt}.`,
    `Regente: ${lord4.pt} (${lord4.keyword}), na ${ordinal(lord4Pos.house)} casa.`,
    ...(house4.planetsIn.length > 0
      ? [`Planetas na 4ª casa: ${house4.planetsIn.map((p) => PLANET_ARCHETYPES[p].pt).join(', ')}.`]
      : [`4ª casa vazia — lida pelo regente ${lord4.pt}.`]),
    '',
    `Lua em ${moonSign.pt}, ${ordinal(moon.house)} casa.`,
    `Lua governa: ${PLANET_ARCHETYPES.Moon.governs}.`,
    `${moonSign.pt}: ${moonSign.nature}.`,
    '',
    `2ª casa (${HOUSE_MEANINGS[2].topic}): ${SIGN_ARCHETYPES[house2.sign].pt}.`,
    ...(house2.planetsIn.length > 0
      ? [`Planetas na 2ª casa: ${house2.planetsIn.map((p) => PLANET_ARCHETYPES[p].pt).join(', ')}.`]
      : [`2ª casa vazia.`]),
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
