/**
 * Atma Vedika — Testes dos serviços puros de Jyotish
 *
 * Cobre a integridade da base de conhecimento (vedic-knowledge),
 * a montagem dos blocos (veda-compendium) e regressões já corrigidas:
 *  • "próximo Mahadasha" deve ser o cronológico, não o primeiro != atual
 *  • textos em prosa, sem rótulos "Dom:/Sombra:/Definição:"
 *  • registro "você" (nunca "tu/teu") em todos os textos do Veda
 */

import { describe, expect, it } from 'vitest';

import { mockBirthChart } from '@/mocks/birthChart';
import { buildFirstReading } from '@/services/firstReading';
import { buildVedaReply } from '@/services/mockVedaService';
import {
  formatDatePt,
  getCurrentDashaBlock,
  getFullCompendiumReading,
} from '@/services/veda-compendium';
import { buildVedaSystemPrompt } from '@/services/veda-prompt';
import {
  DASHA_THEMES,
  NAKSHATRA_MEANINGS,
  PLANET_ARCHETYPES,
} from '@/services/vedic-knowledge';
import type { NakshatraName, PlanetName } from '@/types/chart';

// ─── Base de conhecimento ────────────────────────────────────

describe('vedic-knowledge', () => {
  it('os 27 regentes de nakshatra seguem a sequência Vimshottari', () => {
    const sequence: PlanetName[] = [
      'Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury',
    ];
    const order: NakshatraName[] = [
      'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra',
      'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni',
      'Uttara Phalguni', 'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha',
      'Jyeshtha', 'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana',
      'Dhanishta', 'Shatabhisha', 'Purva Bhadrapada', 'Uttara Bhadrapada',
      'Revati',
    ];
    order.forEach((nak, i) => {
      expect(NAKSHATRA_MEANINGS[nak].ruler, nak).toBe(sequence[i % 9]);
    });
  });

  it('as durações dos 9 Mahadashas somam 120 anos', () => {
    const total = Object.values(DASHA_THEMES).reduce(
      (sum, d) => sum + d.duration,
      0,
    );
    expect(total).toBe(120);
  });

  it('exaltação e debilitação dos 7 planetas clássicos estão corretas', () => {
    const canonical: Record<string, [string, string]> = {
      Sun: ['Aries', 'Libra'],
      Moon: ['Taurus', 'Scorpio'],
      Mars: ['Capricorn', 'Cancer'],
      Mercury: ['Virgo', 'Pisces'],
      Jupiter: ['Cancer', 'Capricorn'],
      Venus: ['Pisces', 'Virgo'],
      Saturn: ['Libra', 'Aries'],
    };
    for (const [planet, [exalt, debil]] of Object.entries(canonical)) {
      const arch = PLANET_ARCHETYPES[planet as PlanetName];
      expect(arch.exaltation, planet).toBe(exalt);
      expect(arch.debilitation, planet).toBe(debil);
    }
  });
});

// ─── Compêndio ───────────────────────────────────────────────

describe('veda-compendium', () => {
  it('o próximo Mahadasha é o cronológico, não o primeiro diferente do atual', () => {
    // Regressão: .find(p => p.planet !== current) retornava Ketu (1993, passado).
    const block = getCurrentDashaBlock(mockBirthChart);
    expect(block.body).toContain('entra Lua');
    expect(block.body).not.toContain('entra Ketu');
  });

  it('formatDatePt converte ISO para extenso pt-BR', () => {
    expect(formatDatePt('2026-08-14')).toBe('14 de agosto de 2026');
    expect(formatDatePt('1993-01-01')).toBe('1 de janeiro de 1993');
    expect(formatDatePt('não-é-data')).toBe('não-é-data');
  });

  it('a leitura completa cobre 9 planetas, 12 casas e corpos não vazios', () => {
    const r = getFullCompendiumReading(mockBirthChart);
    expect(r.planets).toHaveLength(9);
    expect(r.houses).toHaveLength(12);
    const all = [
      r.moonNakshatra, r.sunNakshatra, r.ascendantNakshatra, r.dasha,
      ...r.planets, ...r.houses, ...r.yogas,
      ...Object.values(r.lifeAreas),
    ];
    for (const block of all) {
      expect(block.body.length, block.id).toBeGreaterThan(40);
    }
  });

  it('os blocos são prosa — sem rótulos de ficha de dados', () => {
    // Regressão: textos exibiam "Dom:", "Sombra:", "Definição:", "Efeito:".
    const r = getFullCompendiumReading(mockBirthChart);
    const all = [
      r.moonNakshatra, r.sunNakshatra, r.ascendantNakshatra, r.dasha,
      ...r.planets, ...r.houses, ...r.yogas,
      ...Object.values(r.lifeAreas),
    ];
    const forbidden = /^(Dom|Sombra|Definição|Efeito|Ativação|Regente|Signo|Graus):/m;
    for (const block of all) {
      expect(block.body, block.id).not.toMatch(forbidden);
    }
  });

  it('detecta Raj Yoga e Dhana Yoga no mapa mock', () => {
    const r = getFullCompendiumReading(mockBirthChart);
    const titles = r.yogas.map((y) => y.title);
    expect(titles).toContain('Raj Yoga');
    expect(titles).toContain('Dhana Yoga');
  });
});

// ─── Voz do app (registro "você") ────────────────────────────

describe('voz do Veda', () => {
  const TU = /\b(tu|teu|tua|teus|tuas)\b/i;

  it('respostas do chat usam "você", nunca "tu"', () => {
    const prompts = [
      'como está meu mahadasha?',
      'fala da minha lua e nakshatra',
      'e saturno?',
      'o que rahu significa pra mim?',
      'como vai meu amor e relacionamento?',
      'qual meu propósito e carreira?',
      'estou com medo e ansiedade',
      'qualquer outra pergunta',
    ];
    for (const p of prompts) {
      expect(buildVedaReply(p, mockBirthChart), p).not.toMatch(TU);
    }
  });

  it('primeira leitura e system prompt não usam "tu"', () => {
    for (const stanza of buildFirstReading(mockBirthChart)) {
      expect(stanza.text, stanza.id).not.toMatch(TU);
    }
    expect(buildVedaSystemPrompt(mockBirthChart)).not.toMatch(/usando "você" ou "tu"/);
  });
});

// ─── Primeira leitura ────────────────────────────────────────

describe('firstReading', () => {
  it('gera 7 estrofes com texto', () => {
    const stanzas = buildFirstReading(mockBirthChart);
    expect(stanzas).toHaveLength(7);
    for (const s of stanzas) {
      expect(s.text.length, s.id).toBeGreaterThan(10);
    }
  });
});
