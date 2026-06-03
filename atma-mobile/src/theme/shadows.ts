import { Platform } from 'react-native';

import { palette } from './colors';

/** Glows cósmicos (sombras coloridas que emanam). */
export const glow = {
  none: {},
  gold: Platform.select({
    ios: {
      shadowColor: palette.gold.pure,
      shadowOpacity: 0.55,
      shadowRadius: 20,
      shadowOffset: { width: 0, height: 0 },
    },
    android: { elevation: 12 },
    default: {},
  }) as object,

  goldSoft: Platform.select({
    ios: {
      shadowColor: palette.gold.pure,
      shadowOpacity: 0.3,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: 0 },
    },
    android: { elevation: 6 },
    default: {},
  }) as object,

  mystic: Platform.select({
    ios: {
      shadowColor: palette.mystic.soul,
      shadowOpacity: 0.6,
      shadowRadius: 30,
      shadowOffset: { width: 0, height: 0 },
    },
    android: { elevation: 15 },
    default: {},
  }) as object,

  mysticSoft: Platform.select({
    ios: {
      shadowColor: palette.mystic.soul,
      shadowOpacity: 0.35,
      shadowRadius: 18,
      shadowOffset: { width: 0, height: 0 },
    },
    android: { elevation: 8 },
    default: {},
  }) as object,

  deep: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOpacity: 0.5,
      shadowRadius: 24,
      shadowOffset: { width: 0, height: 12 },
    },
    android: { elevation: 20 },
    default: {},
  }) as object,
} as const;

export type GlowToken = keyof typeof glow;
