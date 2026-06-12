/**
 * Atma Vedika — Divisional Houses Helper
 *
 * Deriva um array de 12 HouseInfo de uma DivisionalChartLite (D9/D10),
 * para que o VedicChartDiamond consiga renderizar as cartas divisórias
 * com o mesmo formato do D1.
 *
 * Convenção:
 *   - Casa 1 = ascendente da divisional
 *   - Demais casas seguem a ordem zodiacal a partir do ascendente
 *   - Planetas habitam a casa correspondente ao signo onde estão na divisional
 */

import type {
  DivisionalChartLite,
  HouseInfo,
  PlanetName,
  SignName,
} from '@/types/chart';

const SIGNS_IN_ORDER: SignName[] = [
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

const SIGN_LORD: Record<SignName, PlanetName> = {
  Aries: 'Mars',
  Taurus: 'Venus',
  Gemini: 'Mercury',
  Cancer: 'Moon',
  Leo: 'Sun',
  Virgo: 'Mercury',
  Libra: 'Venus',
  Scorpio: 'Mars',
  Sagittarius: 'Jupiter',
  Capricorn: 'Saturn',
  Aquarius: 'Saturn',
  Pisces: 'Jupiter',
};

const BHAVA: { name: string; significance: string }[] = [
  { name: 'Tanu Bhava', significance: 'corpo, personalidade, dharma físico' },
  { name: 'Dhana Bhava', significance: 'riqueza acumulada, família próxima, voz' },
  { name: 'Sahaja Bhava', significance: 'irmãos, coragem, comunicação' },
  { name: 'Sukha Bhava', significance: 'mãe, lar, paz interior' },
  { name: 'Putra Bhava', significance: 'filhos, criatividade, romance, intelecto' },
  { name: 'Ari Bhava', significance: 'inimigos, dívidas, saúde, serviço' },
  { name: 'Yuvati Bhava', significance: 'parceiro, casamento, sociedade' },
  { name: 'Randhra Bhava', significance: 'transformação, herança, ocultismo' },
  { name: 'Dharma Bhava', significance: 'sentido, mestres, viagens largas' },
  { name: 'Karma Bhava', significance: 'carreira, status, pai' },
  { name: 'Labha Bhava', significance: 'ganhos, amigos, esperanças' },
  { name: 'Vyaya Bhava', significance: 'libertação, perdas, espiritualidade' },
];

/** Constrói 12 HouseInfo a partir de uma carta divisória. */
export function buildDivisionalHouses(
  divisional: DivisionalChartLite,
): HouseInfo[] {
  const startIdx = SIGNS_IN_ORDER.indexOf(divisional.ascendant);

  // Mapa reverso: signo → planetas que estão nele
  const planetsBySign = new Map<SignName, PlanetName[]>();
  (Object.entries(divisional.planetSigns) as [PlanetName, SignName][]).forEach(
    ([planet, sign]) => {
      const list = planetsBySign.get(sign) ?? [];
      list.push(planet);
      planetsBySign.set(sign, list);
    },
  );

  return Array.from({ length: 12 }, (_, i) => {
    const houseNumber = i + 1;
    const sign = SIGNS_IN_ORDER[(startIdx + i) % 12];
    const bhava = BHAVA[i];
    return {
      number: houseNumber,
      sign,
      signLord: SIGN_LORD[sign],
      planetsIn: planetsBySign.get(sign) ?? [],
      bhavaName: bhava.name,
      significance: bhava.significance,
    };
  });
}
