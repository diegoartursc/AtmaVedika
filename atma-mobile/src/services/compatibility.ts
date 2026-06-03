/**
 * Atma Vedika — Compatibilidade (synastry védica)
 *
 * Cruza dois mapas e produz um score (0-100) em 4 dimensões:
 *  • Atma  — alinhamento de alma (ascendentes / elementos)
 *  • Manas — sintonia mental e emocional (luas)
 *  • Kama  — atração e desejo (Vênus + Marte)
 *  • Gana  — temperamentos compatíveis
 *
 * O mapa do parceiro é gerado de forma determinística a partir
 * de seus dados de nascimento (nome + data + lugar = seed).
 * Em produção, vira chamada ao backend com Swiss Ephemeris.
 */

import type { BirthChart, SignName } from '@/types/chart';

export type ElementKind = 'fire' | 'earth' | 'air' | 'water';

const SIGN_ELEMENT: Record<SignName, ElementKind> = {
  Aries: 'fire',
  Leo: 'fire',
  Sagittarius: 'fire',
  Taurus: 'earth',
  Virgo: 'earth',
  Capricorn: 'earth',
  Gemini: 'air',
  Libra: 'air',
  Aquarius: 'air',
  Cancer: 'water',
  Scorpio: 'water',
  Pisces: 'water',
};

const ALL_SIGNS: SignName[] = [
  'Aries',
  'Taurus',
  'Gemini',
  'Cancer',
  'Leo',
  'Virgo',
  'Libra',
  'Scorpio',
  'Sagittarius',
  'Capricorn',
  'Aquarius',
  'Pisces',
];

// ─── Mock do parceiro ────────────────────────────────────

export interface PartnerSeed {
  name: string;
  birthDate: string; // DD/MM/AAAA
  birthTime: string; // HH:MM
  birthPlace: string;
}

export interface PartnerLite {
  name: string;
  birthDate: string;
  birthPlace: string;
  ascendant: SignName;
  sunSign: SignName;
  moonSign: SignName;
  venusSign: SignName;
  marsSign: SignName;
}

/** Hash determinístico simples (FNV-like) a partir de string. */
function hashSeed(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = (h * 16777619) >>> 0;
  }
  return h >>> 0;
}

export function buildPartnerChart(seed: PartnerSeed): PartnerLite {
  const seedStr = `${seed.name}|${seed.birthDate}|${seed.birthTime}|${seed.birthPlace}`;
  const h = hashSeed(seedStr);
  const pick = (offset: number) => ALL_SIGNS[(h + offset * 7919) % 12];

  return {
    name: seed.name,
    birthDate: seed.birthDate,
    birthPlace: seed.birthPlace,
    ascendant: pick(1),
    sunSign: pick(2),
    moonSign: pick(3),
    venusSign: pick(4),
    marsSign: pick(5),
  };
}

// ─── Compatibilidade ─────────────────────────────────────

export interface CompatibilityScore {
  atma: number; // 0-100
  manas: number;
  kama: number;
  gana: number;
  total: number;
}

export interface CompatibilityReading {
  partner: PartnerLite;
  score: CompatibilityScore;
  band: 'rare' | 'strong' | 'good' | 'challenge';
  headline: string;
  body: string;
}

const ELEMENT_AFFINITY: Record<ElementKind, Record<ElementKind, number>> = {
  fire: { fire: 85, earth: 35, air: 90, water: 40 },
  earth: { fire: 35, earth: 80, air: 50, water: 85 },
  air: { fire: 90, earth: 50, air: 75, water: 45 },
  water: { fire: 40, earth: 85, air: 45, water: 90 },
};

function buildAtma(my: BirthChart, p: PartnerLite): number {
  const myEl = SIGN_ELEMENT[my.ascendant];
  const pEl = SIGN_ELEMENT[p.ascendant];
  return ELEMENT_AFFINITY[myEl][pEl];
}

function buildManas(my: BirthChart, p: PartnerLite): number {
  const myEl = SIGN_ELEMENT[my.planets.Moon.sign];
  const pEl = SIGN_ELEMENT[p.moonSign];
  // Bonus se ambas Luas no mesmo signo
  const base = ELEMENT_AFFINITY[myEl][pEl];
  if (my.planets.Moon.sign === p.moonSign) return Math.min(100, base + 12);
  return base;
}

function buildKama(my: BirthChart, p: PartnerLite): number {
  // Vênus (atração) + Marte (paixão) cruzados
  const v1 = SIGN_ELEMENT[my.planets.Venus.sign];
  const v2 = SIGN_ELEMENT[p.venusSign];
  const m1 = SIGN_ELEMENT[my.planets.Mars.sign];
  const m2 = SIGN_ELEMENT[p.marsSign];
  const venus = ELEMENT_AFFINITY[v1][v2];
  const mars = ELEMENT_AFFINITY[m1][m2];
  return Math.round((venus + mars) / 2);
}

function buildGana(my: BirthChart, p: PartnerLite): number {
  // Aproximação: signos solares
  const myEl = SIGN_ELEMENT[my.planets.Sun.sign];
  const pEl = SIGN_ELEMENT[p.sunSign];
  return ELEMENT_AFFINITY[myEl][pEl];
}

function scoreBand(total: number): CompatibilityReading['band'] {
  if (total >= 85) return 'rare';
  if (total >= 70) return 'strong';
  if (total >= 50) return 'good';
  return 'challenge';
}

const BAND_HEADLINE: Record<CompatibilityReading['band'], string> = {
  rare: 'Encontro raro.',
  strong: 'Forte conexão.',
  good: 'Compatibilidade saudável.',
  challenge: 'Desafio que ensina.',
};

const BAND_TONE: Record<CompatibilityReading['band'], string> = {
  rare:
    'Os céus de vocês conversam em harmonia rara. Vínculos assim costumam carregar lições profundas — sejam de amor, parceria ou aprendizado conjunto.',
  strong:
    'Há sintonia natural entre vocês. A maior parte das áreas flui sem esforço, e onde há atrito, é construtivo.',
  good:
    'É uma conexão saudável. Vocês se encontram em algumas áreas e se desafiam em outras — receita comum de relações que duram.',
  challenge:
    'Existem mais polaridades que pontos de convergência. Não significa que não funcione — significa que exige consciência. Ótimo pra crescimento, exigente pro dia a dia.',
};

export function buildCompatibility(
  my: BirthChart,
  partner: PartnerLite,
): CompatibilityReading {
  const score: CompatibilityScore = {
    atma: buildAtma(my, partner),
    manas: buildManas(my, partner),
    kama: buildKama(my, partner),
    gana: buildGana(my, partner),
    total: 0,
  };
  score.total = Math.round(
    (score.atma + score.manas + score.kama + score.gana) / 4,
  );
  const band = scoreBand(score.total);

  const body =
    `${BAND_TONE[band]}\n\n` +
    `Atma (alma): ${score.atma}/100 — alinhamento dos ascendentes. ` +
    `Como vocês se apresentam ao mundo.\n\n` +
    `Manas (mente): ${score.manas}/100 — sintonia emocional pelas Luas. ` +
    `A textura do que vocês sentem juntos.\n\n` +
    `Kama (desejo): ${score.kama}/100 — Vênus + Marte cruzados. ` +
    `A química da atração e da paixão.\n\n` +
    `Gana (temperamento): ${score.gana}/100 — Sol contra Sol. ` +
    `Como cada um expressa o ego e a vontade.`;

  return {
    partner,
    score,
    band,
    headline: BAND_HEADLINE[band],
    body,
  };
}
