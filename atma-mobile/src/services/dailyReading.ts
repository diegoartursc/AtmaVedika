/**
 * Atma Vedika — Leitura Diária
 *
 * Gera UMA leitura única por dia, baseada em:
 *  • Regente do dia da semana (Sol=domingo, Lua=segunda...)
 *  • Posição desse regente no mapa natal do usuário
 *  • Casa que ele habita
 *
 * Determinístico: mesma data + mesmo mapa = mesma leitura.
 * Em produção, isso vira chamada à IA com prompt cacheado.
 */

import type { BirthChart, PlanetName, SignName } from '@/types/chart';

export interface DailyReading {
  /** ID do dia (YYYY-MM-DD). */
  date: string;
  /** Planeta regente do dia. */
  rulerPlanet: PlanetName;
  symbol: string;
  rulerColor: string;
  /** Header curto pro badge. */
  brief: string;
  /** Título grande no sheet. */
  title: string;
  /** Corpo completo (3-4 parágrafos). */
  body: string;
  /** Saudação contextual ao período do dia (manhã/tarde/noite). */
  greeting: string;
}

const WEEK_RULER: PlanetName[] = [
  'Sun',
  'Moon',
  'Mars',
  'Mercury',
  'Jupiter',
  'Venus',
  'Saturn',
];

const SYMBOL: Record<PlanetName, string> = {
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

const COLOR: Record<PlanetName, string> = {
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

const SIGN: Record<SignName, string> = {
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

/** Tema/foco que cada planeta sugere pro dia, contextualizado pela casa. */
const RULER_THEME: Record<
  PlanetName,
  { tone: string; action: string; warning: string }
> = {
  Sun: {
    tone: 'autoridade, foco no que é seu',
    action: 'tome uma decisão que só você pode tomar',
    warning: 'cuidado com orgulho disfarçado de princípio',
  },
  Moon: {
    tone: 'sensibilidade, descanso, fluxo emocional',
    action: 'escute o que vem sem palavra',
    warning: 'evite decisões finais com a emoção quente',
  },
  Mars: {
    tone: 'ação, força, urgência',
    action: 'execute o que vinha sendo adiado',
    warning: 'reduza a velocidade na hora de responder',
  },
  Mercury: {
    tone: 'comunicação, análise, contratos',
    action: 'escreva, fale, organize papéis',
    warning: 'releia antes de enviar — dia de mal-entendido',
  },
  Jupiter: {
    tone: 'expansão, ensino, fé',
    action: 'pergunte por algo grande — o sim vem mais fácil hoje',
    warning: 'não confunda otimismo com falta de critério',
  },
  Venus: {
    tone: 'prazer, beleza, relações afetivas',
    action: 'cuide de quem você ama — ou de você mesmo, com beleza',
    warning: 'cuidado com indulgência exagerada',
  },
  Saturn: {
    tone: 'disciplina, responsabilidade, peso construtivo',
    action: 'termine algo, mesmo que pequeno — Saturno valoriza fechar',
    warning: 'não é dia de buscar atalho',
  },
  Rahu: {
    tone: 'intensidade, ambição, fome',
    action: 'observe seus desejos sem ceder a todos',
    warning: 'evite decisões impulsivas movidas por fome',
  },
  Ketu: {
    tone: 'desapego, intuição, retiro',
    action: 'solte algo pequeno antes do dia terminar',
    warning: 'não force conexão — dia é mais interno',
  },
};

// ─── Construtor principal ────────────────────────────────

export function buildDailyReading(
  chart: BirthChart,
  date: Date = new Date(),
): DailyReading {
  const dateStr = date.toISOString().split('T')[0];
  const dow = date.getDay();
  const ruler = WEEK_RULER[dow];
  const rulerPos = chart.planets[ruler];
  const theme = RULER_THEME[ruler];

  const greeting = buildGreeting(date);

  const body =
    `Hoje é dia de ${PT[ruler]}. ${theme.tone.charAt(0).toUpperCase() + theme.tone.slice(1)}.\n\n` +
    `No seu mapa, ${PT[ruler]} está em ${SIGN[rulerPos.sign]}, na ${ORD[rulerPos.house]} casa${rulerPos.retrograde ? ' (retrógrado)' : ''}. ` +
    `Isso significa que a energia desse dia se manifesta na sua vida pela área de ${getHouseTopic(rulerPos.house)} — ` +
    `e com o sabor de ${SIGN[rulerPos.sign]}.\n\n` +
    `A ação sugerida: ${theme.action}.\n\n` +
    `Aviso: ${theme.warning}.`;

  return {
    date: dateStr,
    rulerPlanet: ruler,
    symbol: SYMBOL[ruler],
    rulerColor: COLOR[ruler],
    brief: `${PT[ruler]} rege hoje`,
    title: `Hoje, ${PT[ruler]}\nfala alto.`,
    body,
    greeting,
  };
}

function getHouseTopic(house: number): string {
  const topics: Record<number, string> = {
    1: 'identidade e corpo',
    2: 'dinheiro e voz',
    3: 'comunicação e coragem',
    4: 'lar e emoção',
    5: 'criatividade e romance',
    6: 'rotina e desafios',
    7: 'parcerias e amor',
    8: 'transformação e segredos',
    9: 'sentido e fé',
    10: 'carreira e status',
    11: 'rede e ganhos',
    12: 'desapego e intuição',
  };
  return topics[house] ?? 'sua vida';
}

function buildGreeting(date: Date): string {
  const hour = date.getHours();
  if (hour >= 4 && hour < 12) return 'bom dia';
  if (hour >= 12 && hour < 18) return 'boa tarde';
  if (hour >= 18 && hour < 22) return 'boa noite';
  return 'noite profunda';
}

/** Helper: a leitura já foi lida hoje? */
export function isDailyReadingFresh(
  lastReadAt: string | null,
  today: Date = new Date(),
): boolean {
  if (!lastReadAt) return true;
  const todayStr = today.toISOString().split('T')[0];
  return lastReadAt !== todayStr;
}
