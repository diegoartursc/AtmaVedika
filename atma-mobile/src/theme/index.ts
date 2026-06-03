/**
 * Atma Vedika — Theme Entry Point
 *
 * Import único: `import { theme } from '@/theme'`
 */

import { palette, gradients, semantic } from './colors';
import { duration, easing, spring } from './motion';
import { radii } from './radii';
import { glow } from './shadows';
import { layout, spacing } from './spacing';
import {
  fontFamilies,
  fontSizes,
  letterSpacing,
  lineHeights,
  textStyles,
} from './typography';

export const theme = {
  palette,
  gradients,
  semantic,
  spacing,
  layout,
  radii,
  glow,
  duration,
  easing,
  spring,
  type: {
    families: fontFamilies,
    sizes: fontSizes,
    lineHeights,
    letterSpacing,
    styles: textStyles,
  },
} as const;

export type Theme = typeof theme;

export * from './colors';
export * from './motion';
export * from './radii';
export * from './shadows';
export * from './spacing';
export * from './typography';
