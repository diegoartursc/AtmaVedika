/**
 * Atma Vedika — Natal Chart 3D Helpers
 *
 * Converte longitudes eclípticas em coordenadas 3D para a cena Three.js.
 * Cada planeta tem sua "casca orbital" (raio do anel) e tamanho próprios.
 *
 * Convenção:
 *   - Plano da eclíptica = plano XZ
 *   - Y = pequena variação opcional (por enquanto, 0)
 *   - Centro (0,0,0) = atma/self (não o Sol)
 */

import type { BirthChart, PlanetName } from '@/types/chart';

export interface PlanetVisual {
  /** Raio do anel orbital. */
  ringRadius: number;
  /** Raio da esfera do planeta. */
  sphereRadius: number;
  /** Cor base do material. */
  color: string;
  /** Cor de emissão (glow). */
  emissive: string;
  /** Símbolo Unicode tradicional. */
  symbol: string;
  /** Nome em português. */
  ptName: string;
}

export const PLANET_VISUAL: Record<PlanetName, PlanetVisual> = {
  Sun: {
    ringRadius: 1.5,
    sphereRadius: 0.55,
    color: '#FFB74D',
    emissive: '#FF8800',
    symbol: '☉',
    ptName: 'Sol',
  },
  Mercury: {
    ringRadius: 2.5,
    sphereRadius: 0.2,
    color: '#10B981',
    emissive: '#0A6F58',
    symbol: '☿',
    ptName: 'Mercúrio',
  },
  Venus: {
    ringRadius: 3.5,
    sphereRadius: 0.32,
    color: '#EC4899',
    emissive: '#A2266F',
    symbol: '♀',
    ptName: 'Vênus',
  },
  Moon: {
    ringRadius: 4.5,
    sphereRadius: 0.28,
    color: '#E8E6DD',
    emissive: '#88837A',
    symbol: '☽',
    ptName: 'Lua',
  },
  Mars: {
    ringRadius: 5.5,
    sphereRadius: 0.3,
    color: '#EF4444',
    emissive: '#A02D2D',
    symbol: '♂',
    ptName: 'Marte',
  },
  Jupiter: {
    ringRadius: 7,
    sphereRadius: 0.5,
    color: '#F59E0B',
    emissive: '#9A6606',
    symbol: '♃',
    ptName: 'Júpiter',
  },
  Saturn: {
    ringRadius: 8.5,
    sphereRadius: 0.45,
    color: '#3B82F6',
    emissive: '#1E4DA8',
    symbol: '♄',
    ptName: 'Saturno',
  },
  Rahu: {
    ringRadius: 9.8,
    sphereRadius: 0.22,
    color: '#6366F1',
    emissive: '#3A3E9B',
    symbol: '☊',
    ptName: 'Rahu',
  },
  Ketu: {
    ringRadius: 9.8,
    sphereRadius: 0.22,
    color: '#8B5CF6',
    emissive: '#5234A0',
    symbol: '☋',
    ptName: 'Ketu',
  },
};

export const PLANET_ORDER: PlanetName[] = [
  'Sun',
  'Mercury',
  'Venus',
  'Moon',
  'Mars',
  'Jupiter',
  'Saturn',
  'Rahu',
  'Ketu',
];

export interface PlanetPlacement {
  name: PlanetName;
  visual: PlanetVisual;
  /** Posição 3D [x, y, z]. */
  position: [number, number, number];
  /** Ângulo na órbita (radianos). */
  angle: number;
  /** Longitude eclíptica (graus). */
  longitude: number;
  /** Casa (1-12). */
  house: number;
  sign: string;
  degree: number;
  retrograde: boolean;
}

/** Converte um BirthChart em placements 3D dos 9 planetas. */
export function buildPlanetPlacements(chart: BirthChart): PlanetPlacement[] {
  return PLANET_ORDER.map((name) => {
    const planet = chart.planets[name];
    const visual = PLANET_VISUAL[name];
    // Ângulo na órbita: longitude eclíptica → radianos.
    // Subtraímos π/2 para que 0° (Áries) fique "à direita" do observador
    // (convenção comum em mapas védicos rotacionados).
    const angle = (planet.longitude * Math.PI) / 180 - Math.PI / 2;
    const x = visual.ringRadius * Math.cos(angle);
    const z = visual.ringRadius * Math.sin(angle);
    return {
      name,
      visual,
      position: [x, 0, z],
      angle,
      longitude: planet.longitude,
      house: planet.house,
      sign: planet.sign,
      degree: planet.degree,
      retrograde: planet.retrograde,
    };
  });
}
