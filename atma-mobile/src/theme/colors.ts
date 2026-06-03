/**
 * Atma Vedika — Cosmic Cinematic Palette
 *
 * Filosofia: cada cor evoca um estado cósmico.
 * Voids = backgrounds profundos (sensação de portal/abismo)
 * Gold = sabedoria ancestral, ouro raro
 * Mystic = portais, glows, transcendência
 * Astral = identidades planetárias (Jyotish)
 * Silver = corpo textual celeste
 */

export const palette = {
  // ─── Voids (backgrounds) ────────────────────────────────
  void: {
    abyss: '#020108',
    deep: '#060410',
    night: '#0B0820',
    twilight: '#13102B',
    veil: '#1C1640',
  },

  // ─── Sacred Gold (primary accent) ───────────────────────
  gold: {
    pure: '#D4AF37',
    glow: '#E8C467',
    bright: '#F5D77A',
    deep: '#8B6F1C',
    whisper: 'rgba(212, 175, 55, 0.08)',
    aura: 'rgba(232, 196, 103, 0.22)',
  },

  // ─── Mystic Purple (secondary accent, glows) ────────────
  mystic: {
    soul: '#7C3AED',
    deep: '#5B21B6',
    cosmic: '#2E1065',
    royal: '#4C1D95',
    glow: 'rgba(124, 58, 237, 0.18)',
    aura: 'rgba(124, 58, 237, 0.08)',
  },

  // ─── Silver (text/celestial) ────────────────────────────
  silver: {
    pure: '#F5F4F0',
    soft: '#E8E6DD',
    muted: '#A1A1AA',
    ghost: '#52525B',
    whisper: 'rgba(245, 244, 240, 0.45)',
    breath: 'rgba(245, 244, 240, 0.12)',
  },

  // ─── Ember (highlights, dasha endings) ──────────────────
  ember: {
    rose: '#F472B6',
    crimson: '#E11D48',
    glow: 'rgba(244, 114, 182, 0.2)',
  },

  // ─── Astral (planetary identities) ──────────────────────
  astral: {
    sun: '#FFB74D',
    moon: '#E8E6DD',
    mars: '#EF4444',
    mercury: '#10B981',
    jupiter: '#F59E0B',
    venus: '#EC4899',
    saturn: '#3B82F6',
    rahu: '#6366F1',
    ketu: '#8B5CF6',
  },
} as const;

/** Gradientes cinematográficos pré-compostos. */
export const gradients = {
  cosmicBackground: [
    palette.void.abyss,
    palette.void.deep,
    palette.void.twilight,
    palette.void.deep,
    palette.void.abyss,
  ] as const,

  goldShimmer: [
    'transparent',
    palette.gold.aura,
    palette.gold.pure,
    palette.gold.aura,
    'transparent',
  ] as const,

  mysticGlow: [
    'transparent',
    palette.mystic.aura,
    palette.mystic.glow,
    palette.mystic.aura,
    'transparent',
  ] as const,

  topVignette: ['rgba(2,1,8,0.95)', 'transparent'] as const,
  bottomVignette: ['transparent', 'rgba(2,1,8,0.95)'] as const,

  sacredTransition: [
    palette.void.abyss,
    palette.mystic.cosmic,
    palette.void.abyss,
  ] as const,
} as const;

/** Semântica (uso por intenção, não por cor literal). */
export const semantic = {
  background: palette.void.abyss,
  surface: palette.void.deep,
  surfaceElevated: palette.void.night,

  textPrimary: palette.silver.pure,
  textSecondary: palette.silver.muted,
  textTertiary: palette.silver.whisper,
  textGold: palette.gold.glow,

  accent: palette.gold.pure,
  accentSoft: palette.gold.whisper,

  divider: palette.silver.breath,
  border: 'rgba(212, 175, 55, 0.18)',
} as const;

export type Palette = typeof palette;
export type Gradients = typeof gradients;
export type Semantic = typeof semantic;
