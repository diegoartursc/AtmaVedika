/**
 * Atma Vedika — Spacing (4pt grid)
 *
 * Usar SEMPRE estes tokens, nunca valores literais.
 * Cosmic & void = espaços teatrais para profundidade.
 */

export const spacing = {
  none: 0,
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 40,
  cosmic: 64,
  void: 96,
  abyss: 128,
} as const;

export const layout = {
  screenPaddingX: spacing.lg,
  screenPaddingTop: spacing.cosmic,
  cardPadding: spacing.xl,
  cardGap: spacing.base,
  sectionGap: spacing.xxxl,
} as const;

export type SpacingToken = keyof typeof spacing;
