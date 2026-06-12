/**
 * Atma Vedika — Typography System
 *
 * Display: Playfair Display (serif sagrada — títulos, números cósmicos)
 * Body: Inter (sans neutra — texto longo, UI)
 */

export const fontFamilies = {
  display: 'PlayfairDisplay_700Bold',
  displayItalic: 'PlayfairDisplay_400Regular_Italic',
  displayRegular: 'PlayfairDisplay_400Regular',
  body: 'Inter_400Regular',
  bodyMedium: 'Inter_500Medium',
  bodySemibold: 'Inter_600SemiBold',
  bodyBold: 'Inter_700Bold',
} as const;

export const fontSizes = {
  micro: 10,
  caption: 11,
  small: 13,
  body: 15,
  bodyLarge: 17,
  heading: 22,
  title: 28,
  display: 38,
  hero: 52,
  cosmic: 72,
} as const;

export const lineHeights = {
  tight: 1.1,
  snug: 1.25,
  normal: 1.5,
  relaxed: 1.7,
  cosmic: 1.9,
} as const;

export const letterSpacing = {
  cosmic: 2.4,
  wider: 2,
  wide: 1,
  normal: 0,
  tight: -0.3,
  tighter: -0.6,
} as const;

/** Estilos tipográficos pré-compostos (use sempre que possível). */
export const textStyles = {
  cosmicTitle: {
    fontFamily: fontFamilies.display,
    fontSize: fontSizes.cosmic,
    lineHeight: fontSizes.cosmic * lineHeights.tight,
    letterSpacing: letterSpacing.tighter,
  },
  hero: {
    fontFamily: fontFamilies.display,
    fontSize: fontSizes.hero,
    lineHeight: fontSizes.hero * lineHeights.tight,
    letterSpacing: letterSpacing.tighter,
  },
  display: {
    fontFamily: fontFamilies.display,
    fontSize: fontSizes.display,
    lineHeight: fontSizes.display * lineHeights.snug,
    letterSpacing: letterSpacing.tight,
  },
  title: {
    fontFamily: fontFamilies.display,
    fontSize: fontSizes.title,
    lineHeight: fontSizes.title * lineHeights.snug,
    letterSpacing: letterSpacing.tight,
  },
  heading: {
    fontFamily: fontFamilies.bodySemibold,
    fontSize: fontSizes.heading,
    lineHeight: fontSizes.heading * lineHeights.snug,
    letterSpacing: letterSpacing.tight,
  },
  bodyLarge: {
    fontFamily: fontFamilies.body,
    fontSize: fontSizes.bodyLarge,
    lineHeight: fontSizes.bodyLarge * lineHeights.relaxed,
    letterSpacing: letterSpacing.normal,
  },
  body: {
    fontFamily: fontFamilies.body,
    fontSize: fontSizes.body,
    lineHeight: fontSizes.body * lineHeights.relaxed,
    letterSpacing: letterSpacing.normal,
  },
  bodyEmphasis: {
    fontFamily: fontFamilies.bodyMedium,
    fontSize: fontSizes.body,
    lineHeight: fontSizes.body * lineHeights.relaxed,
    letterSpacing: letterSpacing.normal,
  },
  caption: {
    fontFamily: fontFamilies.body,
    fontSize: fontSizes.caption,
    lineHeight: fontSizes.caption * lineHeights.normal,
    letterSpacing: letterSpacing.wide,
  },
  // Estilo sagrado: ALL CAPS com tracking cósmico (use pra labels, brand)
  ritual: {
    fontFamily: fontFamilies.bodyMedium,
    fontSize: fontSizes.caption,
    lineHeight: fontSizes.caption * lineHeights.normal,
    letterSpacing: letterSpacing.cosmic,
    textTransform: 'uppercase' as const,
  },
  // Itálico contemplativo (citações)
  sacred: {
    fontFamily: fontFamilies.displayItalic,
    fontSize: fontSizes.bodyLarge,
    lineHeight: fontSizes.bodyLarge * lineHeights.cosmic,
    letterSpacing: letterSpacing.normal,
  },
} as const;

export type TextStyleName = keyof typeof textStyles;
