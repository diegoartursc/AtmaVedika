export const radii = {
  none: 0,
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 28,
  xxl: 36,
  pill: 999,
  circle: 9999,
} as const;

export type RadiusToken = keyof typeof radii;
