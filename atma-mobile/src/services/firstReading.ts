/**
 * Atma Vedika — First Reading Generator (mock)
 *
 * Em produção: chama o backend que chama Claude/GPT.
 * Aqui: compõe estrofes a partir do BirthChart real (mock).
 */

import type { BirthChart } from '@/types/chart';

export interface ReadingStanza {
  /** Identificador semântico (usado por animações se preciso). */
  id: string;
  /** Texto da estrofe. */
  text: string;
  /** Variant de tipografia recomendada. */
  variant: 'sacred' | 'bodyLarge' | 'title' | 'display' | 'heading';
}

export function buildFirstReading(chart: BirthChart): ReadingStanza[] {
  const moonNakshatra = chart.moonNakshatra.name;
  const moonRuler = chart.moonNakshatra.ruler;
  const ascendant = chart.ascendant;
  const saturn = chart.planets.Saturn;
  const venus = chart.planets.Venus;
  const dasha = chart.vimshottariDasha;
  const nextDasha = dasha.periods.find(
    (p) => p.planet !== dasha.currentMahadasha,
  );

  return [
    {
      id: 'nakshatra',
      text: `Você nasceu sob a Lua em ${moonNakshatra}.\nO nakshatra regido por ${moonRuler}.\nÉ por isso que você sente antes de pensar.`,
      variant: 'sacred',
    },
    {
      id: 'ascendant',
      text: `Seu Ascendente é ${ascendant}.\nEste é o portão pelo qual o mundo te vê — e pelo qual seu dharma se manifesta.`,
      variant: 'sacred',
    },
    {
      id: 'saturn',
      text: `Saturno em ${saturn.sign}${saturn.retrograde ? ', retrógrado' : ''}, na sua ${ordinal(saturn.house)} casa.\nVocê vai amar tarde. Mas vai amar fundo.`,
      variant: 'sacred',
    },
    {
      id: 'dasha',
      text: `Seu Mahadasha atual é ${dasha.currentMahadasha}.${
        nextDasha ? ` Depois dele, ${nextDasha.planet} assume.` : ''
      }\nO que está escondido virá à tona quando esse ciclo virar.`,
      variant: 'sacred',
    },
    {
      id: 'closing',
      text: 'O seu céu está pronto.\nNavegue pelos temas,\nveja o que ele quer te mostrar.',
      variant: 'title',
    },
  ];

  void venus;
}

function ordinal(n: number): string {
  const map: Record<number, string> = {
    1: 'primeira',
    2: 'segunda',
    3: 'terceira',
    4: 'quarta',
    5: 'quinta',
    6: 'sexta',
    7: 'sétima',
    8: 'oitava',
    9: 'nona',
    10: 'décima',
    11: 'décima primeira',
    12: 'décima segunda',
  };
  return map[n] ?? `${n}ª`;
}
