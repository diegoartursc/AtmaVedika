/**
 * Atma Vedika — Birth Chart Types
 *
 * Modela um mapa natal védico completo (Jyotish).
 */

export type PlanetName =
  | 'Sun'
  | 'Moon'
  | 'Mars'
  | 'Mercury'
  | 'Jupiter'
  | 'Venus'
  | 'Saturn'
  | 'Rahu'
  | 'Ketu';

export type SignName =
  | 'Aries'
  | 'Taurus'
  | 'Gemini'
  | 'Cancer'
  | 'Leo'
  | 'Virgo'
  | 'Libra'
  | 'Scorpio'
  | 'Sagittarius'
  | 'Capricorn'
  | 'Aquarius'
  | 'Pisces';

export type NakshatraName =
  | 'Ashwini'
  | 'Bharani'
  | 'Krittika'
  | 'Rohini'
  | 'Mrigashira'
  | 'Ardra'
  | 'Punarvasu'
  | 'Pushya'
  | 'Ashlesha'
  | 'Magha'
  | 'Purva Phalguni'
  | 'Uttara Phalguni'
  | 'Hasta'
  | 'Chitra'
  | 'Swati'
  | 'Vishakha'
  | 'Anuradha'
  | 'Jyeshtha'
  | 'Mula'
  | 'Purva Ashadha'
  | 'Uttara Ashadha'
  | 'Shravana'
  | 'Dhanishta'
  | 'Shatabhisha'
  | 'Purva Bhadrapada'
  | 'Uttara Bhadrapada'
  | 'Revati';

export interface PlanetPosition {
  name: PlanetName;
  /** Longitude eclíptica 0-360°. */
  longitude: number;
  sign: SignName;
  /** Grau dentro do signo (0-30). */
  degree: number;
  /** Casa (1-12). */
  house: number;
  retrograde: boolean;
}

export interface NakshatraInfo {
  name: NakshatraName;
  index: number;
  /** Pada (1-4). */
  pada: number;
  /** Planeta regente do nakshatra. */
  ruler: PlanetName;
}

export interface DashaPeriod {
  planet: PlanetName;
  startDate: string;
  endDate: string;
  years: number;
}

export interface VimshottariDasha {
  currentMahadasha: PlanetName;
  currentAntardasha: PlanetName;
  /** Progresso do mahadasha vigente (0-1). */
  mahadashaProgress: number;
  periods: DashaPeriod[];
}

/** Informação de uma das 12 casas (bhavas) védicas. */
export interface HouseInfo {
  /** 1..12 */
  number: number;
  /** Signo na cúspide (Whole Sign). */
  sign: SignName;
  /** Regente do signo da cúspide. */
  signLord: PlanetName;
  /** Planetas habitando esta casa. */
  planetsIn: PlanetName[];
  /** Nome sânscrito da bhava (Tanu, Dhana, Sahaja...). */
  bhavaName: string;
  /** Significados primários (texto curto). */
  significance: string;
}

export type AspectStrength = 'full' | 'partial';

/** Aspecto (drishti) lançado por um planeta para uma casa. */
export interface AspectInfo {
  from: PlanetName;
  /** Casa alvo (1..12). */
  toHouse: number;
  /** 3, 4, 5, 7, 8, 9, 10 — número da casa adiante (aspecto védico). */
  aspectKind: number;
  strength?: AspectStrength;
}

/** Resumo de uma carta divisória (D9, D10...). */
export interface DivisionalChartLite {
  kind: 'D9' | 'D10';
  ascendant: SignName;
  /** Posição dos 9 planetas (signo na divisional). */
  planetSigns: Record<PlanetName, SignName>;
}

export interface BirthChart {
  id: string;
  userName: string;
  birthDate: string;
  birthTime: string;
  birthPlace: string;
  latitude: number;
  longitude: number;
  ascendant: SignName;
  ascendantDegree: number;
  planets: Record<PlanetName, PlanetPosition>;
  moonNakshatra: NakshatraInfo;
  sunNakshatra: NakshatraInfo;
  ascendantNakshatra: NakshatraInfo;
  vimshottariDasha: VimshottariDasha;

  /** 12 casas no esquema Whole Sign. */
  houses: HouseInfo[];
  /** Aspectos especiais védicos dos planetas principais. */
  aspects: AspectInfo[];
  /** Cartas divisórias (resumos). */
  divisionals: {
    D9: DivisionalChartLite;
    D10: DivisionalChartLite;
  };
}
