/**
 * Atma Vedika — First Reading Generator
 *
 * Compõe as estrofes do onboarding a partir dos dados
 * pesquisados no compêndio védico (vedic-knowledge.ts).
 *
 * Em produção: será substituída por resposta do Claude Sonnet 4.6
 * via buildVedaSystemPrompt, mantendo a mesma estrutura ReadingStanza[].
 */

import type { BirthChart } from '@/types/chart';
import {
  NAKSHATRA_MEANINGS,
  PLANET_ARCHETYPES,
  SIGN_ARCHETYPES,
  DASHA_THEMES,
} from './vedic-knowledge';

export interface ReadingStanza {
  /** Identificador semântico (usado por animações se preciso). */
  id: string;
  /** Texto da estrofe. */
  text: string;
  /** Variant de tipografia recomendada. */
  variant: 'sacred' | 'bodyLarge' | 'title' | 'display' | 'heading';
}

export function buildFirstReading(chart: BirthChart): ReadingStanza[] {
  const moonNak = NAKSHATRA_MEANINGS[chart.moonNakshatra.name];
  const moonRuler = PLANET_ARCHETYPES[chart.moonNakshatra.ruler];
  const ascSign = SIGN_ARCHETYPES[chart.ascendant];
  const saturn = chart.planets.Saturn;
  const saturnSign = SIGN_ARCHETYPES[saturn.sign];
  const dasha = DASHA_THEMES[chart.vimshottariDasha.currentMahadasha];
  const pct = Math.round(chart.vimshottariDasha.mahadashaProgress * 100);
  const nextPeriod = chart.vimshottariDasha.periods.find(
    (p) => p.planet !== chart.vimshottariDasha.currentMahadasha,
  );

  return [
    {
      id: 'nakshatra',
      text:
        `Lua em ${chart.moonNakshatra.name}.\n` +
        `Regida por ${moonRuler.pt} — ${moonRuler.keyword}.\n\n` +
        `${moonNak.keyword}.`,
      variant: 'sacred',
    },
    {
      id: 'gift',
      text: moonNak.gift,
      variant: 'bodyLarge',
    },
    {
      id: 'shadow',
      text: `Mas também: ${moonNak.shadow}`,
      variant: 'bodyLarge',
    },
    {
      id: 'ascendant',
      text:
        `Ascendente em ${ascSign.pt}.\n` +
        `${ascSign.keyword} — ${ascSign.nature}.`,
      variant: 'sacred',
    },
    {
      id: 'saturn',
      text:
        `Saturno em ${saturnSign.pt}${saturn.retrograde ? ', retrógrado' : ''}, ` +
        `${ordinal(saturn.house)} casa.\n\n` +
        `${PLANET_ARCHETYPES.Saturn.keyword}.\n` +
        `${PLANET_ARCHETYPES.Saturn.shadow}.`,
      variant: 'sacred',
    },
    {
      id: 'dasha',
      text:
        `Mahadasha de ${dasha.pt} — ${pct}% concluído.\n\n` +
        `${dasha.theme}.\n\n` +
        `${dasha.invitation}.` +
        (nextPeriod
          ? `\n\nDepois, ${DASHA_THEMES[nextPeriod.planet].pt}.`
          : ''),
      variant: 'sacred',
    },
    {
      id: 'closing',
      text: 'O seu céu está pronto.\nNavegue pelos temas,\nveja o que ele quer te mostrar.',
      variant: 'title',
    },
  ];
}

function ordinal(n: number): string {
  const map: Record<number, string> = {
    1: 'primeira', 2: 'segunda', 3: 'terceira', 4: 'quarta',
    5: 'quinta', 6: 'sexta', 7: 'sétima', 8: 'oitava',
    9: 'nona', 10: 'décima', 11: 'décima primeira', 12: 'décima segunda',
  };
  return map[n] ?? `${n}ª`;
}
