/**
 * Atma Vedika — Yogas (combinações kármicas)
 *
 * Detecta as principais yogas no BirthChart:
 *  • Raj Yoga         — planetas de kendra (1/4/7/10) + trikona (1/5/9)
 *  • Dhana Yoga       — conexão entre 2/5/9/11
 *  • Gajakesari Yoga  — Júpiter + Lua em kendra
 *  • Mahapurusha Yoga — planeta forte em kendra (Marte/Mercúrio/Júpiter/Vênus/Saturno)
 *  • Sade Sati        — Saturno transitando casas 12/1/2 a partir da Lua
 *
 * A detecção real exige Swiss Ephemeris pra trânsitos.
 * Aqui usamos heurísticas no mock chart.
 */

import type { BirthChart, PlanetName } from '@/types/chart';

export type YogaKind =
  | 'raj'
  | 'dhana'
  | 'gajakesari'
  | 'mahapurusha'
  | 'sade-sati';

export interface Yoga {
  kind: YogaKind;
  name: string;
  /** Sub-tipo (ex: "Ruchaka Mahapurusha"). */
  subtype?: string;
  symbol: string;
  accent: string;
  title: string;
  subtitle: string;
  body: string;
  metric?: { label: string; value: string };
}

const KENDRA_HOUSES = [1, 4, 7, 10];
const TRIKONA_HOUSES = [1, 5, 9];
const DHANA_HOUSES = [2, 5, 9, 11];
const KENDRA_TRIKONA_LORDS: Record<number, PlanetName[]> = {
  // Mapa simplificado de regentes (Ascendente Leão)
  // Em produção: derivar dinamicamente
};

// ─── Detectores ──────────────────────────────────────────

function isInKendra(house: number): boolean {
  return KENDRA_HOUSES.includes(house);
}

function isInTrikona(house: number): boolean {
  return TRIKONA_HOUSES.includes(house);
}

function detectRajYoga(chart: BirthChart): Yoga | null {
  const kendraPlanets: PlanetName[] = [];
  const trikonaPlanets: PlanetName[] = [];
  (Object.entries(chart.planets) as Array<[PlanetName, BirthChart['planets'][PlanetName]]>).forEach(
    ([name, p]) => {
      if (isInKendra(p.house)) kendraPlanets.push(name);
      if (isInTrikona(p.house)) trikonaPlanets.push(name);
    },
  );

  // Procura conexão (mesmo planeta em kendra E trikona OU 2 planetas conectados)
  const both = kendraPlanets.filter((p) => trikonaPlanets.includes(p));
  if (both.length === 0) return null;

  return {
    kind: 'raj',
    name: 'Raj Yoga',
    symbol: '♔',
    accent: '#FFB74D',
    title: 'Raj Yoga.',
    subtitle: `${both.map(planetPt).join(', ')} ligando kendra e trikona.`,
    body:
      `Raj Yoga é uma das combinações mais auspiciosas do Jyotish. Ela acontece quando planetas de casas angulares (1, 4, 7, 10) se conectam com casas trigonais (1, 5, 9). É o yoga da autoridade, da elevação social, da capacidade de liderar e ser visto.\n\n` +
      `No seu mapa, ${both.map(planetPt).join(' e ')} criam esse link. ` +
      `Isso significa que a vida te oferece momentos de ascensão natural — onde reconhecimento, posição e poder vêm sem você precisar forçar.\n\n` +
      `A ativação plena depende do Mahadasha desse planeta. Quando ele vira regente do seu ciclo de vida, o yoga "acende" e o resultado se manifesta.`,
    metric: { label: 'ligado por', value: both.map(planetPt).join(' · ') },
  };
}

function detectDhanaYoga(chart: BirthChart): Yoga | null {
  const dhanaInhabitants: PlanetName[] = [];
  (Object.entries(chart.planets) as Array<[PlanetName, BirthChart['planets'][PlanetName]]>).forEach(
    ([name, p]) => {
      if (DHANA_HOUSES.includes(p.house)) dhanaInhabitants.push(name);
    },
  );
  if (dhanaInhabitants.length < 2) return null;

  return {
    kind: 'dhana',
    name: 'Dhana Yoga',
    symbol: '◈',
    accent: '#F59E0B',
    title: 'Dhana Yoga.',
    subtitle: `${dhanaInhabitants.length} planetas nas casas da abundância.`,
    body:
      `Dhana Yoga é a combinação da riqueza. Ela se forma quando há conexão entre as casas 2 (acumulação), 5 (criatividade), 9 (sorte) e 11 (ganhos). Cada planeta nessas casas alimenta o fluxo financeiro.\n\n` +
      `No seu mapa, ${dhanaInhabitants.map(planetPt).join(', ')} habitam essas áreas. ` +
      `Cada um traz uma forma de ganhar — pela voz, pela criatividade, pela rede, pela sorte. A combinação significa que o dinheiro pode chegar por múltiplas portas.\n\n` +
      `A ativação acontece nos Mahadashas e Antardashas desses planetas. Períodos onde a abundância flui com menos esforço.`,
    metric: {
      label: 'habitantes',
      value: dhanaInhabitants.map(planetPt).join(' · '),
    },
  };
}

function detectGajakesariYoga(chart: BirthChart): Yoga | null {
  const jupiter = chart.planets.Jupiter;
  const moon = chart.planets.Moon;
  const dist = Math.abs(jupiter.house - moon.house);
  // Kendra entre si: 0, 3, 6, 9 (que viram 4, 7, 10)
  const kendraDistances = [0, 3, 6, 9];
  if (!kendraDistances.includes(dist) && dist !== 12 - dist) return null;

  return {
    kind: 'gajakesari',
    name: 'Gajakesari Yoga',
    symbol: '♃',
    accent: '#10B981',
    title: 'Gajakesari Yoga.',
    subtitle: 'Júpiter e Lua em kendra entre si.',
    body:
      `Gajakesari é o yoga do "elefante e do leão". A força de Júpiter (sabedoria) combinada com a tranquilidade da Lua (mente) cria poder estável.\n\n` +
      `No seu mapa, Júpiter está na ${ordinal(jupiter.house)} casa e a Lua na ${ordinal(moon.house)} casa — a uma distância de kendra entre si. ` +
      `Isso dá inteligência elevada, fama, longevidade e uma natureza generosa que atrai bons mestres.\n\n` +
      `É um dos yogas mais respeitados na tradição védica. Marca pessoas com presença sábia e magnetismo natural.`,
    metric: {
      label: 'jupiter · lua',
      value: `${ordinal(jupiter.house)} · ${ordinal(moon.house)}`,
    },
  };
}

function detectMahapurushaYoga(chart: BirthChart): Yoga | null {
  // Verifica cada um dos 5 grandes yogas
  const checks: Array<{
    planet: PlanetName;
    ownSigns: string[];
    exalted: string;
    name: string;
  }> = [
    { planet: 'Mars', ownSigns: ['Aries', 'Scorpio'], exalted: 'Capricorn', name: 'Ruchaka' },
    { planet: 'Mercury', ownSigns: ['Gemini', 'Virgo'], exalted: 'Virgo', name: 'Bhadra' },
    { planet: 'Jupiter', ownSigns: ['Sagittarius', 'Pisces'], exalted: 'Cancer', name: 'Hamsa' },
    { planet: 'Venus', ownSigns: ['Taurus', 'Libra'], exalted: 'Pisces', name: 'Malavya' },
    { planet: 'Saturn', ownSigns: ['Capricorn', 'Aquarius'], exalted: 'Libra', name: 'Sasa' },
  ];

  for (const c of checks) {
    const p = chart.planets[c.planet];
    if (!isInKendra(p.house)) continue;
    const isStrong =
      c.ownSigns.includes(p.sign) || p.sign === c.exalted;
    if (isStrong) {
      const reason = p.sign === c.exalted ? 'exaltado' : 'em domicílio';
      return {
        kind: 'mahapurusha',
        name: `${c.name} Mahapurusha Yoga`,
        subtype: c.name,
        symbol: '✶',
        accent: '#7C3AED',
        title: `${c.name}\nMahapurusha Yoga.`,
        subtitle: `${planetPt(c.planet)} ${reason} em kendra.`,
        body:
          `Os Mahapurusha Yogas são 5 combinações que indicam "grandes seres" — pessoas que carregam uma força planetária específica de forma rara. ` +
          `${c.name} Yoga acontece quando ${planetPt(c.planet)} está em casa angular (1, 4, 7, 10) e ${reason} em ${signPt(p.sign)}.\n\n` +
          `No seu mapa, ${planetPt(c.planet)} ocupa a ${ordinal(p.house)} casa em ${signPt(p.sign)} — ${reason}. ` +
          `Isso te conecta diretamente à qualidade central desse planeta: ` +
          `${MAHAPURUSHA_QUALITY[c.name]}\n\n` +
          `É um yoga raro de aparecer. Marca a vida de quem o tem com uma direção clara desde cedo.`,
        metric: { label: c.name, value: signPt(p.sign) },
      };
    }
  }

  return null;
}

const MAHAPURUSHA_QUALITY: Record<string, string> = {
  Ruchaka: 'coragem, autoridade física, liderança militar ou empreendedora.',
  Bhadra: 'inteligência analítica, comunicação afiada, sucesso pela palavra.',
  Hamsa: 'sabedoria, ensino, fé inabalável, espiritualidade refinada.',
  Malavya: 'beleza, luxo, vida estética, atração natural, prazer com classe.',
  Sasa: 'disciplina extrema, autoridade pela maturidade, longevidade.',
};

function detectSadeSati(chart: BirthChart): Yoga | null {
  // Mock: assume que hoje Saturno está em Pisces (trânsito real ~2023-2026)
  // Sade Sati = Saturno passa 12ª, 1ª e 2ª desde a Lua natal
  const moonSign = chart.planets.Moon.sign;
  const transitSaturnSign = 'Pisces'; // mock
  const SIGN_INDEX: Record<string, number> = {
    Aries: 0, Taurus: 1, Gemini: 2, Cancer: 3, Leo: 4, Virgo: 5,
    Libra: 6, Scorpio: 7, Sagittarius: 8, Capricorn: 9, Aquarius: 10, Pisces: 11,
  };
  const moonIdx = SIGN_INDEX[moonSign];
  const satIdx = SIGN_INDEX[transitSaturnSign];
  const diff = (satIdx - moonIdx + 12) % 12;
  // Sade Sati = diff 11 (12ª), 0 (1ª), 1 (2ª)
  const phase =
    diff === 11
      ? 'first'
      : diff === 0
        ? 'peak'
        : diff === 1
          ? 'last'
          : null;
  if (!phase) return null;

  const phaseLabel: Record<string, string> = {
    first: 'primeira fase (12ª da Lua) — perdas materiais, desapego forçado.',
    peak: 'fase central (1ª da Lua) — identidade em prova, peso máximo.',
    last: 'última fase (2ª da Lua) — recompensa após a prova, voz forte.',
  };

  return {
    kind: 'sade-sati',
    name: 'Sade Sati',
    symbol: '♄',
    accent: '#3B82F6',
    title: 'Sade Sati.',
    subtitle: phaseLabel[phase],
    body:
      `Sade Sati são os 7 anos e meio em que Saturno transita pelas casas 12, 1 e 2 a partir da sua Lua natal. É considerado um dos períodos mais transformadores da vida — não é punição, mas maturação intensa.\n\n` +
      `Você está atualmente na ${phaseLabel[phase]}\n\n` +
      `Esse período exige: simplificar, soltar o que não aguenta o peso, e construir o que dura. Quem atravessa bem sai com autoridade real — quem tenta atalho, paga depois. ` +
      `Saturno não dá o que você quer agora. Dá o que você vai querer ter daqui a 10 anos.`,
    metric: { label: 'fase', value: phase },
  };
}

// ─── Builder principal ──────────────────────────────────

export function detectYogas(chart: BirthChart): Yoga[] {
  const results: Yoga[] = [];
  const raj = detectRajYoga(chart);
  if (raj) results.push(raj);
  const dhana = detectDhanaYoga(chart);
  if (dhana) results.push(dhana);
  const gaj = detectGajakesariYoga(chart);
  if (gaj) results.push(gaj);
  const mp = detectMahapurushaYoga(chart);
  if (mp) results.push(mp);
  const ss = detectSadeSati(chart);
  if (ss) results.push(ss);
  return results;
}

// ─── Helpers ─────────────────────────────────────────────

const PT: Record<PlanetName, string> = {
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

const SIGN_PT_LOCAL: Record<string, string> = {
  Aries: 'Áries', Taurus: 'Touro', Gemini: 'Gêmeos', Cancer: 'Câncer',
  Leo: 'Leão', Virgo: 'Virgem', Libra: 'Libra', Scorpio: 'Escorpião',
  Sagittarius: 'Sagitário', Capricorn: 'Capricórnio',
  Aquarius: 'Aquário', Pisces: 'Peixes',
};

const ORD: Record<number, string> = {
  1: '1ª', 2: '2ª', 3: '3ª', 4: '4ª', 5: '5ª', 6: '6ª',
  7: '7ª', 8: '8ª', 9: '9ª', 10: '10ª', 11: '11ª', 12: '12ª',
};

function planetPt(p: PlanetName): string {
  return PT[p];
}
function signPt(s: string): string {
  return SIGN_PT_LOCAL[s] ?? s;
}
function ordinal(n: number): string {
  return ORD[n] ?? `${n}ª`;
}

// suprime unused
void KENDRA_TRIKONA_LORDS;
