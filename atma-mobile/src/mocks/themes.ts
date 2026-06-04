/**
 * Atma Vedika — Vedic Themes (mock)
 *
 * Estrutura panorâmica:
 *   ↕ vertical (capítulos)         ↔ horizontal (páginas)
 *   ─────────────────────          ─────────────────────
 *   1  Mapa Natal                  identidade · mente · trajetória
 *   2  Casas                       Casa 1 → 12
 *   3  Planetas                    Sol → Ketu (9 grahas)
 *   4  Aspectos                    drishti por planeta (9)
 *   5  Ciclos                      atual · próximo · anterior
 *   6  Hoje                        Lua hoje · retorno
 *   7  Mapa Védico (diamond)       D1 · D9 · D10 visuais clicáveis
 *   8  Mapa 3D                     cena Three.js (final)
 *
 * Cards são panorâmicos — sem CTAs intrusivas pra Veda.
 */

import { palette } from '@/theme/colors';
import {
  getHouseBlock,
  getPlanetBlock,
  getMoonNakshatraBlock,
  getCurrentDashaBlock,
  getLoveBlock,
  getCareerBlock,
  getMoneyBlock,
  getHealthBlock,
  getFamilyBlock,
  getYogaBlocks,
} from '@/services/veda-compendium';
import type {
  BirthChart,
  HouseInfo,
  PlanetName,
  PlanetPosition,
} from '@/types/chart';

export interface ThemeMetric {
  label: string;
  value: string;
}

export type ThemeVisual =
  | {
      kind: 'progressArc';
      progress: number;
      centerLabel: string;
      centerCaption: string;
    }
  | { kind: 'lunarPhase'; phase: number }
  | { kind: 'constellation'; points: number }
  | { kind: 'vedicChart'; chartKind: 'D1' | 'D9' | 'D10' }
  | { kind: 'chart3d' };

export interface ThemeLayer {
  id: string;
  ritual: string;
  title: string;
  subtitle?: string;
  body: string;
  metric?: ThemeMetric;
  visual?: ThemeVisual;
  /** Quando true, renderiza layout de capa (símbolo enorme + chamada). */
  isCover?: boolean;
  /** Override do símbolo (default: símbolo do tema). */
  symbolOverride?: string;
}

export interface VedicTheme {
  id: string;
  symbol: string;
  accent: string;
  shortName: string;
  layers: ThemeLayer[];
}

// ─── Construtor principal ────────────────────────────────

export function buildVedicThemes(chart: BirthChart): VedicTheme[] {
  return [
    buildOverviewTheme(chart),
    buildTransitTheme(chart),
    buildLifeAreasTheme(chart),
    buildHousesTheme(chart),
    buildPlanetsTheme(chart),
    buildAspectsTheme(chart),
    buildYogasTheme(chart),
    buildMahadashaTheme(chart),
    buildVedicChartTheme(),
    buildChart3DTheme(),
  ];
}

// ─── Helpers de capa ─────────────────────────────────────

function coverLayer(args: {
  id: string;
  ritual: string;
  title: string;
  caption: string;
}): ThemeLayer {
  return {
    id: args.id,
    ritual: args.ritual,
    title: args.title,
    body: args.caption,
    isCover: true,
  };
}

// ─── 1. Mapa Natal (resumo) ──────────────────────────────

function buildOverviewTheme(chart: BirthChart): VedicTheme {
  const moon = chart.moonNakshatra;
  const sun = chart.planets.Sun;
  const dasha = chart.vimshottariDasha;
  return {
    id: 'overview',
    symbol: '◯',
    accent: palette.gold.glow,
    shortName: 'Mapa',
    layers: [
      coverLayer({
        id: 'overview-cover',
        ritual: '✦  capítulo  ✦',
        title: 'Sua essência.',
        caption: 'O ascendente, o sol e a lua — os três pontos que dizem mais sobre você do que palavras.',
      }),
      {
        id: 'overview-identity',
        ritual: '✦  identidade  ✦',
        title: `Ascendente\n${signPt(chart.ascendant)}.`,
        subtitle: `Sol em ${signPt(sun.sign)}, ${ordinal(sun.house)} casa.`,
        body: 'O signo do ascendente é a roupa que sua alma escolheu vestir nesta vida. O Sol é o fogo que ela queima por dentro.',
        metric: { label: 'ascendente', value: signPt(chart.ascendant) },
      },
      {
        id: 'overview-mind',
        ritual: '✦  mente  ✦',
        title: `Lua em\n${signPt(chart.planets.Moon.sign)}.`,
        subtitle: `Nakshatra ${moon.name}, pada ${moon.pada}.`,
        body: getMoonNakshatraBlock(chart).body,
        metric: { label: 'nakshatra', value: moon.name },
      },
      {
        id: 'overview-trajectory',
        ritual: '✦  trajetória  ✦',
        title: `Mahadasha\nde ${planetPt(dasha.currentMahadasha)}.`,
        subtitle: `${Math.round(dasha.mahadashaProgress * 100)}% concluído.`,
        body: 'Você está no longo ciclo regido por este planeta. Cada Mahadasha pinta uma fase inteira da vida.',
        metric: { label: 'progresso', value: `${Math.round(dasha.mahadashaProgress * 100)}%` },
      },
    ],
  };
}

// ─── 2. Casas (12 bhavas) ────────────────────────────────

// ─── Yogas (combinações kármicas) ────────────────────────

function buildYogasTheme(chart: BirthChart): VedicTheme {
  const yogaBlocks = getYogaBlocks(chart);
  return {
    id: 'yogas',
    symbol: '✶',
    accent: palette.gold.bright,
    shortName: 'Yogas',
    layers: [
      coverLayer({
        id: 'yogas-cover',
        ritual: '✦  capítulo  ✦',
        title: 'Yogas\nkármicas.',
        caption:
          'As combinações raras do seu mapa. Forças que se ativam em momentos específicos da vida — Raj Yoga, Dhana, Gajakesari, Viparita.',
      }),
      ...(yogaBlocks.length > 0
        ? yogaBlocks.map((b) => ({
            id: b.id,
            ritual: `✦  ${b.title.toLowerCase()}  ✦`,
            title: b.title,
            subtitle: b.subtitle,
            body: b.body,
            symbolOverride: b.symbol,
          }))
        : [
            {
              id: 'yogas-empty',
              ritual: '✦  sem yogas  ✦',
              title: 'Nenhuma yoga\nrara ativa.',
              subtitle: '',
              body:
                'Mapas sem yogas explícitas não são "menos" — a maioria das pessoas têm vidas conduzidas por trânsitos sutis. Os Mahadashas ainda governam suas fases.',
            } as ThemeLayer,
          ]),
    ],
  };
}

// ─── 2.5 Áreas da Vida ───────────────────────────────────

function buildLifeAreasTheme(chart: BirthChart): VedicTheme {
  const blocks = [
    { ritual: '✦  amor  ✦',     block: getLoveBlock(chart) },
    { ritual: '✦  dinheiro  ✦', block: getMoneyBlock(chart) },
    { ritual: '✦  carreira  ✦', block: getCareerBlock(chart) },
    { ritual: '✦  saúde  ✦',    block: getHealthBlock(chart) },
    { ritual: '✦  família  ✦',  block: getFamilyBlock(chart) },
  ];
  return {
    id: 'life-areas',
    symbol: '❤',
    accent: palette.ember.rose,
    shortName: 'Sua vida',
    layers: [
      coverLayer({
        id: 'life-cover',
        ritual: '✦  capítulo  ✦',
        title: 'Sua vida\nem 5 áreas.',
        caption: 'Amor, dinheiro, carreira, saúde, família. Cada uma cruzando casas e planetas do seu mapa.',
      }),
      ...blocks.map(({ ritual, block }) => ({
        id: block.id,
        ritual,
        title: block.title,
        subtitle: block.subtitle,
        body: block.body,
        symbolOverride: block.symbol,
      })),
    ],
  };
}

function buildHousesTheme(chart: BirthChart): VedicTheme {
  return {
    id: 'houses',
    symbol: '⌂',
    accent: palette.mystic.soul,
    shortName: 'Casas',
    layers: [
      coverLayer({
        id: 'houses-cover',
        ritual: '✦  capítulo  ✦',
        title: 'As 12 casas.',
        caption: 'Os bhavas — as 12 áreas da vida onde tudo acontece. Da identidade ao desapego.',
      }),
      ...chart.houses.map((h) => buildHouseLayer(h, chart)),
    ],
  };
}

/** Nome popular de cada casa — usado no rótulo "ritual" do card.
 *  O corpo da leitura vem de getHouseBlock (veda-compendium). */
const HOUSE_LORE: Record<number, { popular: string }> = {
  1: { popular: 'a casa do corpo e da identidade' },
  2: { popular: 'a casa do dinheiro e da voz' },
  3: { popular: 'a casa da coragem e dos irmãos' },
  4: { popular: 'a casa do lar e da mãe' },
  5: { popular: 'a casa da criatividade e do romance' },
  6: { popular: 'a casa dos desafios e da saúde' },
  7: { popular: 'a casa do amor e das parcerias' },
  8: { popular: 'a casa da transformação e do oculto' },
  9: { popular: 'a casa do sentido e do dharma' },
  10: { popular: 'a casa da carreira e do reconhecimento' },
  11: { popular: 'a casa dos ganhos e dos amigos' },
  12: { popular: 'a casa do desapego e da espiritualidade' },
};

function buildHouseLayer(h: HouseInfo, chart: BirthChart): ThemeLayer {
  const lore = HOUSE_LORE[h.number];
  return {
    id: `house-${h.number}`,
    ritual: `✦  Casa ${h.number} · ${lore.popular}  ✦`,
    title: `${ordinal(h.number)} casa.\n${h.bhavaName}.`,
    subtitle: `${signPt(h.sign)} · regente ${planetPt(h.signLord)}.`,
    body: getHouseBlock(chart, h.number).body,
    metric: {
      label: h.planetsIn.length === 0 ? 'regente' : 'habitantes',
      value:
        h.planetsIn.length === 0
          ? planetPt(h.signLord)
          : h.planetsIn.map(planetPt).join(' · '),
    },
  };
}

// ─── 3. Planetas (9 grahas) ──────────────────────────────

const PLANET_ORDER: PlanetName[] = [
  'Sun',
  'Moon',
  'Mars',
  'Mercury',
  'Jupiter',
  'Venus',
  'Saturn',
  'Rahu',
  'Ketu',
];

function buildPlanetsTheme(chart: BirthChart): VedicTheme {
  return {
    id: 'planets',
    symbol: '☉',
    accent: palette.astral.sun,
    shortName: 'Planetas',
    layers: [
      coverLayer({
        id: 'planets-cover',
        ritual: '✦  capítulo  ✦',
        title: 'Os 9 grahas.',
        caption: 'Os planetas védicos. Cada um carrega uma função na sua psique. Conheça o tom de cada um no seu mapa.',
      }),
      ...PLANET_ORDER.map((name) =>
        buildPlanetLayer(name, chart.planets[name], chart),
      ),
    ],
  };
}

function buildPlanetLayer(name: PlanetName, p: PlanetPosition, chart: BirthChart): ThemeLayer {
  const retro = p.retrograde ? ' retrógrado' : '';
  return {
    id: `planet-${name.toLowerCase()}`,
    ritual: `✦  ${planetPt(name)}${retro}  ✦`,
    title: `${planetPt(name)}\nem ${signPt(p.sign)}.`,
    subtitle: `${ordinal(p.house)} casa · ${p.degree.toFixed(1)}°.`,
    body: getPlanetBlock(chart, name).body,
    metric: {
      label: 'posição',
      value: `${signPt(p.sign)} · ${ordinal(p.house)} casa`,
    },
  };
}

// ─── 4. Aspectos (drishti por planeta) ───────────────────

const ASPECT_PLANETS: PlanetName[] = PLANET_ORDER;

const ASPECT_KIND_DESC: Record<number, string> = {
  3: '3ª',
  4: '4ª',
  5: '5ª',
  7: '7ª',
  8: '8ª',
  9: '9ª',
  10: '10ª',
};

function buildAspectsTheme(chart: BirthChart): VedicTheme {
  return {
    id: 'aspects',
    symbol: '✺',
    accent: palette.astral.mars,
    shortName: 'Aspectos',
    layers: [
      coverLayer({
        id: 'aspects-cover',
        ritual: '✦  capítulo  ✦',
        title: 'Drishti.',
        caption: 'Os aspectos — como os planetas se olham. Pra onde cada um manda sua energia no seu mapa.',
      }),
      ...ASPECT_PLANETS.map((p) => buildAspectLayer(p, chart)),
    ],
  };
}

function buildAspectLayer(planet: PlanetName, chart: BirthChart): ThemeLayer {
  const owned = chart.aspects.filter((a) => a.from === planet);
  const planetHouse = chart.planets[planet].house;
  const planetSign = chart.planets[planet].sign;

  const list =
    owned.length === 0
      ? 'Sem aspectos especiais ativos.'
      : owned
          .map(
            (a) =>
              `${ordinal(a.toHouse)} (${ASPECT_KIND_DESC[a.aspectKind] ?? `${a.aspectKind}ª`})`,
          )
          .join(' · ');

  return {
    id: `aspect-${planet.toLowerCase()}`,
    ritual: `✦  Aspectos de ${planetPt(planet)}  ✦`,
    title: `${planetPt(planet)}\nolha para…`,
    subtitle: `de ${signPt(planetSign)} · casa ${planetHouse}.`,
    body: `${list}. ${buildAspectReading(planet, owned.length)}`,
    metric: {
      label: 'aspectos ativos',
      value: String(owned.length),
    },
  };
}

function buildAspectReading(planet: PlanetName, count: number): string {
  if (count === 0) return '';
  switch (planet) {
    case 'Sun':
      return 'O Sol projeta autoridade silenciosa.';
    case 'Moon':
      return 'Onde a Lua olha, o emocional flui sem resistência.';
    case 'Mercury':
      return 'Mercúrio sussurra — comunicação afiada nessas casas.';
    case 'Venus':
      return 'Vênus suaviza — prazer e harmonia nesses lugares.';
    case 'Mars':
      return 'Marte corta — urgência e direção onde aspecta.';
    case 'Jupiter':
      return 'Júpiter abençoa — crescimento leve nas áreas tocadas.';
    case 'Saturn':
      return 'Saturno testa — disciplina antes da entrega.';
    case 'Rahu':
      return 'Rahu obceca — atração e ilusão nessas casas.';
    case 'Ketu':
      return 'Ketu liberta — desapego e sabedoria silenciosa.';
    default:
      return '';
  }
}

// ─── 5. Ciclos (Mahadasha) ───────────────────────────────

function buildMahadashaTheme(chart: BirthChart): VedicTheme {
  const dasha = chart.vimshottariDasha;
  const pct = Math.round(dasha.mahadashaProgress * 100);
  const currentIdx = dasha.periods.findIndex(
    (p) => p.planet === dasha.currentMahadasha,
  );
  const previous = currentIdx > 0 ? dasha.periods[currentIdx - 1] : null;
  const next = currentIdx >= 0 ? dasha.periods[currentIdx + 1] : null;

  return {
    id: 'mahadasha',
    symbol: '⧉',
    accent: palette.astral.saturn,
    shortName: 'Ciclos',
    layers: [
      coverLayer({
        id: 'mahadasha-cover',
        ritual: '✦  capítulo  ✦',
        title: 'Vimshottari Dasha.',
        caption: 'Os ciclos planetários da sua vida. Cada mahadasha pinta uma fase inteira — o que veio, o que vem.',
      }),
      {
        id: 'mahadasha-current',
        ritual: '✦  Mahadasha atual  ✦',
        title: `${planetPt(dasha.currentMahadasha)}.`,
        subtitle: `${pct}% concluído.`,
        body: getCurrentDashaBlock(chart).body,
        metric: { label: 'progresso', value: `${pct}%` },
        visual: {
          kind: 'progressArc',
          progress: dasha.mahadashaProgress,
          centerLabel: `${pct}%`,
          centerCaption: planetPt(dasha.currentMahadasha),
        },
      },
      {
        id: 'mahadasha-next',
        ritual: '✦  Próximo ciclo  ✦',
        title: next ? `${planetPt(next.planet)}.` : 'Fim do ciclo.',
        subtitle: next ? `${next.years} anos.` : undefined,
        body: next
          ? `Quando ${planetPt(dasha.currentMahadasha)} sair, ${planetPt(next.planet)} entra. O que era importante deixa de ser.`
          : 'Você vive o último período. Use o silêncio.',
        metric: next
          ? { label: 'próximo', value: planetPt(next.planet) }
          : undefined,
      },
      {
        id: 'mahadasha-prev',
        ritual: '✦  Ciclo anterior  ✦',
        title: previous ? `${planetPt(previous.planet)}.` : 'Início.',
        subtitle: previous ? `${previous.years} anos.` : undefined,
        body: previous
          ? `Antes do atual, você passou ${previous.years} anos sob este planeta. As marcas ainda estão na sua estrutura.`
          : 'Primeiro período pós-nascimento. Sem cicatriz anterior.',
        metric: previous
          ? { label: 'anterior', value: planetPt(previous.planet) }
          : undefined,
      },
    ],
  };
}

// ─── 6. Hoje (Trânsito) ──────────────────────────────────

function buildTransitTheme(chart: BirthChart): VedicTheme {
  const moon = chart.moonNakshatra;
  return {
    id: 'transit',
    symbol: '☽',
    accent: palette.silver.soft,
    shortName: 'Hoje',
    layers: [
      coverLayer({
        id: 'transit-cover',
        ritual: '✦  capítulo  ✦',
        title: 'O céu de hoje.',
        caption: 'Onde os planetas estão agora e como tocam o seu mapa. A leitura do dia, em camadas.',
      }),
      {
        id: 'transit-moon-today',
        ritual: '✦  Lua hoje  ✦',
        title: 'A Lua está\nem Sagitário.',
        subtitle: 'Trânsito de Mula.',
        body: 'O dia pede ação ampla — viagens, conversas grandes, decisões largas. Lua sob o nakshatra de Ketu pede corte.',
        metric: { label: 'trânsito', value: 'Sagitário · Mula' },
      },
      {
        id: 'transit-lunar-phase',
        ritual: '✦  Fase lunar  ✦',
        title: 'Lua crescente,\n62% iluminada.',
        subtitle: 'Shukla paksha — fase de expansão.',
        body: 'Estamos na metade ascendente do mês lunar. Inicie. Plante o que quer ver crescer nas próximas 2 semanas.',
        metric: { label: 'paksha', value: 'shukla' },
      },
      {
        id: 'transit-nakshatra-return',
        ritual: '✦  Retorno lunar  ✦',
        title: 'A Lua\nvolta pra casa.',
        subtitle: `Nakshatra natal ${moon.name}.`,
        body: `Uma vez por mês a Lua transita o seu nakshatra natal. ${planetPt(moon.ruler)} rege esse dia — o que você desligar fica desligado.`,
        metric: { label: 'evento', value: 'retorno' },
      },
      {
        id: 'transit-saturn-now',
        ritual: '✦  Saturno hoje  ✦',
        title: 'Saturno em\nPeixes.',
        subtitle: 'Aspectando sua 9ª, 11ª e 6ª casas.',
        body: 'O Saturno externo está nos peixes desde 2023. Aspecta seu Júpiter natal — exige disciplina onde antes era fluxo.',
        metric: { label: 'aspecta', value: '9, 11, 6' },
      },
      {
        id: 'transit-jupiter-now',
        ritual: '✦  Júpiter hoje  ✦',
        title: 'Júpiter em\nGêmeos.',
        subtitle: 'Trânsito pela sua 11ª casa.',
        body: 'Júpiter visita a casa dos ganhos e das amizades. Ano de abrir portas que estavam fechadas — sem forçar.',
        metric: { label: 'casa', value: '11ª' },
      },
    ],
  };
}

// ─── 7. Mapa Védico Interativo (diamond) ─────────────────

function buildVedicChartTheme(): VedicTheme {
  return {
    id: 'vedic-chart',
    symbol: '⬢',
    accent: palette.ember.rose,
    shortName: 'Diamante',
    layers: [
      {
        id: 'diamond-d1',
        ritual: '✦  D1 · Rasi  ✦',
        title: 'Seu mapa\nde nascimento.',
        subtitle: 'Toque numa casa.',
        body: '',
        visual: { kind: 'vedicChart', chartKind: 'D1' },
      },
      {
        id: 'diamond-d9',
        ritual: '✦  D9 · Navamsha  ✦',
        title: 'Mapa do\ncasamento\ne dharma.',
        subtitle: 'Toque numa casa.',
        body: '',
        visual: { kind: 'vedicChart', chartKind: 'D9' },
      },
      {
        id: 'diamond-d10',
        ritual: '✦  D10 · Dashamsha  ✦',
        title: 'Mapa da\ncarreira.',
        subtitle: 'Toque numa casa.',
        body: '',
        visual: { kind: 'vedicChart', chartKind: 'D10' },
      },
    ],
  };
}

// ─── 8. Mapa 3D (cena Three.js — último) ─────────────────

function buildChart3DTheme(): VedicTheme {
  return {
    id: 'chart-3d',
    symbol: '✦',
    accent: palette.mystic.soul,
    shortName: '3D',
    layers: [
      {
        id: 'chart3d-main',
        ritual: '✦  seu céu  ✦',
        title: 'Em três\ndimensões.',
        subtitle: 'Toque num planeta.',
        body: '',
        visual: { kind: 'chart3d' },
      },
    ],
  };
}

// ─── Helpers ─────────────────────────────────────────────

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

function planetPt(p: PlanetName): string {
  return PLANET_PT[p];
}

const SIGN_PT: Record<string, string> = {
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

function signPt(s: string): string {
  return SIGN_PT[s] ?? s;
}

const ORDINALS: Record<number, string> = {
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

function ordinal(n: number): string {
  return ORDINALS[n] ?? `${n}ª`;
}
