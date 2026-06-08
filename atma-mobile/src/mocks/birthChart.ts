/**
 * Atma Vedika — Mock realista de mapa natal
 *
 * Dados astronomicamente plausíveis para uma pessoa nascida em
 * São Paulo, 14/08/1993 às 06:42 (Ascendente em Leão).
 *
 * Permite desenvolver toda a UI sem precisar do backend nem Swiss Ephemeris.
 */

import type { BirthChart } from '@/types/chart';

export const mockBirthChart: BirthChart = {
  id: 'mock-chart-001',
  userName: 'Diego',
  birthDate: '1993-08-14',
  birthTime: '06:42',
  birthPlace: 'São Paulo, Brasil',
  latitude: -23.5505,
  longitude: -46.6333,

  ascendant: 'Leo',
  ascendantDegree: 12.4,

  planets: {
    Sun: {
      name: 'Sun',
      longitude: 141.6,
      sign: 'Leo',
      degree: 21.6,
      house: 1,
      retrograde: false,
    },
    Moon: {
      name: 'Moon',
      longitude: 247.3,
      sign: 'Sagittarius',
      degree: 7.3,
      house: 5,
      retrograde: false,
    },
    Mars: {
      name: 'Mars',
      longitude: 178.9,
      sign: 'Virgo',
      degree: 28.9,
      house: 2,
      retrograde: false,
    },
    Mercury: {
      name: 'Mercury',
      longitude: 152.4,
      sign: 'Leo',
      degree: 2.4,
      house: 1,
      retrograde: true,
    },
    Jupiter: {
      name: 'Jupiter',
      longitude: 188.2,
      sign: 'Libra',
      degree: 8.2,
      house: 3,
      retrograde: false,
    },
    Venus: {
      name: 'Venus',
      longitude: 119.7,
      sign: 'Cancer',
      degree: 29.7,
      house: 12,
      retrograde: false,
    },
    Saturn: {
      name: 'Saturn',
      longitude: 326.5,
      sign: 'Aquarius',
      degree: 26.5,
      house: 7,
      retrograde: true,
    },
    Rahu: {
      name: 'Rahu',
      longitude: 235.1,
      sign: 'Scorpio',
      degree: 25.1,
      house: 4,
      retrograde: false,
    },
    Ketu: {
      name: 'Ketu',
      longitude: 55.1,
      sign: 'Taurus',
      degree: 25.1,
      house: 10,
      retrograde: false,
    },
  },

  moonNakshatra: {
    name: 'Mula',
    index: 18,
    pada: 2,
    ruler: 'Ketu',
  },
  sunNakshatra: {
    name: 'Purva Phalguni',
    index: 10,
    pada: 4,
    ruler: 'Venus',
  },
  ascendantNakshatra: {
    name: 'Magha',
    index: 9,
    pada: 4,
    ruler: 'Ketu',
  },

  vimshottariDasha: {
    // Hoje (2026) cai no período do Sol (2020–2026), perto da virada pra Lua.
    currentMahadasha: 'Sun',
    currentAntardasha: 'Venus',
    mahadashaProgress: 0.97,
    periods: [
      {
        planet: 'Ketu',
        startDate: '1993-08-14',
        endDate: '2000-08-14',
        years: 7,
      },
      {
        planet: 'Venus',
        startDate: '2000-08-14',
        endDate: '2020-08-14',
        years: 20,
      },
      {
        planet: 'Sun',
        startDate: '2020-08-14',
        endDate: '2026-08-14',
        years: 6,
      },
      {
        planet: 'Moon',
        startDate: '2026-08-14',
        endDate: '2036-08-14',
        years: 10,
      },
      {
        planet: 'Mars',
        startDate: '2036-08-14',
        endDate: '2043-08-14',
        years: 7,
      },
      {
        planet: 'Rahu',
        startDate: '2043-08-14',
        endDate: '2061-08-14',
        years: 18,
      },
      {
        planet: 'Jupiter',
        startDate: '2061-08-14',
        endDate: '2077-08-14',
        years: 16,
      },
      {
        planet: 'Saturn',
        startDate: '2077-08-14',
        endDate: '2096-08-14',
        years: 19,
      },
      {
        planet: 'Mercury',
        startDate: '2096-08-14',
        endDate: '2113-08-14',
        years: 17,
      },
    ],
  },

  // ─── Casas (Whole Sign, ascendente Leão) ────────────────
  houses: [
    {
      number: 1,
      sign: 'Leo',
      signLord: 'Sun',
      planetsIn: ['Sun', 'Mercury'],
      bhavaName: 'Tanu Bhava',
      significance: 'corpo, personalidade, dharma físico',
    },
    {
      number: 2,
      sign: 'Virgo',
      signLord: 'Mercury',
      planetsIn: ['Mars'],
      bhavaName: 'Dhana Bhava',
      significance: 'riqueza acumulada, família próxima, voz',
    },
    {
      number: 3,
      sign: 'Libra',
      signLord: 'Venus',
      planetsIn: ['Jupiter'],
      bhavaName: 'Sahaja Bhava',
      significance: 'irmãos, coragem, comunicação',
    },
    {
      number: 4,
      sign: 'Scorpio',
      signLord: 'Mars',
      planetsIn: ['Rahu'],
      bhavaName: 'Sukha Bhava',
      significance: 'mãe, lar, paz interior',
    },
    {
      number: 5,
      sign: 'Sagittarius',
      signLord: 'Jupiter',
      planetsIn: ['Moon'],
      bhavaName: 'Putra Bhava',
      significance: 'filhos, criatividade, romance, intelecto',
    },
    {
      number: 6,
      sign: 'Capricorn',
      signLord: 'Saturn',
      planetsIn: [],
      bhavaName: 'Ari Bhava',
      significance: 'inimigos, dívidas, saúde, serviço',
    },
    {
      number: 7,
      sign: 'Aquarius',
      signLord: 'Saturn',
      planetsIn: ['Saturn'],
      bhavaName: 'Yuvati Bhava',
      significance: 'parceiro, casamento, sociedade',
    },
    {
      number: 8,
      sign: 'Pisces',
      signLord: 'Jupiter',
      planetsIn: [],
      bhavaName: 'Randhra Bhava',
      significance: 'transformação, herança, ocultismo',
    },
    {
      number: 9,
      sign: 'Aries',
      signLord: 'Mars',
      planetsIn: [],
      bhavaName: 'Dharma Bhava',
      significance: 'sentido, mestres, viagens largas',
    },
    {
      number: 10,
      sign: 'Taurus',
      signLord: 'Venus',
      planetsIn: ['Ketu'],
      bhavaName: 'Karma Bhava',
      significance: 'carreira, status, pai',
    },
    {
      number: 11,
      sign: 'Gemini',
      signLord: 'Mercury',
      planetsIn: [],
      bhavaName: 'Labha Bhava',
      significance: 'ganhos, amigos, esperanças',
    },
    {
      number: 12,
      sign: 'Cancer',
      signLord: 'Moon',
      planetsIn: ['Venus'],
      bhavaName: 'Vyaya Bhava',
      significance: 'libertação, perdas, espiritualidade',
    },
  ],

  // ─── Aspectos (drishti) — todos os 9 planetas ─────────────
  aspects: [
    // Sol em casa 1 → aspecta 7
    { from: 'Sun', toHouse: 7, aspectKind: 7, strength: 'full' },
    // Lua em casa 5 → aspecta 11
    { from: 'Moon', toHouse: 11, aspectKind: 7, strength: 'full' },
    // Mercúrio em casa 1 → aspecta 7
    { from: 'Mercury', toHouse: 7, aspectKind: 7, strength: 'full' },
    // Vênus em casa 12 → aspecta 6
    { from: 'Venus', toHouse: 6, aspectKind: 7, strength: 'full' },
    // Marte em casa 2 → aspecta 5 (4°), 8 (7°), 9 (8°)
    { from: 'Mars', toHouse: 5, aspectKind: 4, strength: 'full' },
    { from: 'Mars', toHouse: 8, aspectKind: 7, strength: 'full' },
    { from: 'Mars', toHouse: 9, aspectKind: 8, strength: 'full' },
    // Júpiter em casa 3 → aspecta 7 (5°), 9 (7°), 11 (9°)
    { from: 'Jupiter', toHouse: 7, aspectKind: 5, strength: 'full' },
    { from: 'Jupiter', toHouse: 9, aspectKind: 7, strength: 'full' },
    { from: 'Jupiter', toHouse: 11, aspectKind: 9, strength: 'full' },
    // Saturno em casa 7 → aspecta 9 (3°), 1 (7°), 4 (10°)
    { from: 'Saturn', toHouse: 9, aspectKind: 3, strength: 'full' },
    { from: 'Saturn', toHouse: 1, aspectKind: 7, strength: 'full' },
    { from: 'Saturn', toHouse: 4, aspectKind: 10, strength: 'full' },
    // Rahu em casa 4 → aspecta 8 (5°), 10 (7°), 12 (9°)
    { from: 'Rahu', toHouse: 8, aspectKind: 5, strength: 'full' },
    { from: 'Rahu', toHouse: 10, aspectKind: 7, strength: 'full' },
    { from: 'Rahu', toHouse: 12, aspectKind: 9, strength: 'full' },
    // Ketu em casa 10 → aspecta 2 (5°), 4 (7°), 6 (9°)
    { from: 'Ketu', toHouse: 2, aspectKind: 5, strength: 'full' },
    { from: 'Ketu', toHouse: 4, aspectKind: 7, strength: 'full' },
    { from: 'Ketu', toHouse: 6, aspectKind: 9, strength: 'full' },
  ],

  // ─── Cartas divisórias (resumos plausíveis) ───────────────
  divisionals: {
    D9: {
      kind: 'D9',
      ascendant: 'Aquarius',
      planetSigns: {
        Sun: 'Aries',
        Moon: 'Gemini',
        Mars: 'Capricorn',
        Mercury: 'Taurus',
        Jupiter: 'Pisces',
        Venus: 'Scorpio',
        Saturn: 'Libra',
        Rahu: 'Leo',
        Ketu: 'Aquarius',
      },
    },
    D10: {
      kind: 'D10',
      ascendant: 'Sagittarius',
      planetSigns: {
        Sun: 'Virgo',
        Moon: 'Pisces',
        Mars: 'Aries',
        Mercury: 'Libra',
        Jupiter: 'Cancer',
        Venus: 'Leo',
        Saturn: 'Capricorn',
        Rahu: 'Gemini',
        Ketu: 'Sagittarius',
      },
    },
  },
};
