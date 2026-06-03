/**
 * Atma Vedika — CosmicBackground
 *
 * 4 camadas estratégicas que simulam um portal cósmico:
 *  1. Base gradient (abyss → twilight → abyss)
 *  2. Vertical purple wash sutil
 *  3. Radial glow primário (SVG — funciona web + native)
 *  4. Top + bottom vignettes (legibilidade)
 */

import { StyleSheet, View, useWindowDimensions, type ViewProps } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Defs, RadialGradient, Rect, Stop } from 'react-native-svg';

import { gradients, palette } from '@/theme/colors';

export interface CosmicBackgroundProps extends ViewProps {
  vignettes?: boolean;
  /** Intensidade do glow central (0..1). */
  glowIntensity?: number;
}

export function CosmicBackground({
  vignettes = true,
  glowIntensity = 1,
  style,
  children,
  ...rest
}: CosmicBackgroundProps) {
  const { width, height } = useWindowDimensions();
  const glowSize = Math.max(width, height) * 1.2;

  return (
    <View style={[styles.container, style]} {...rest}>
      {/* 1. Base cosmic gradient */}
      <LinearGradient
        colors={gradients.cosmicBackground}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      {/* 2. Vertical purple wash sutil */}
      <LinearGradient
        colors={['transparent', palette.mystic.aura, 'transparent']}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      {/* 3. Radial glow central via SVG (funciona web + native) */}
      {glowIntensity > 0 && (
        <View
          pointerEvents="none"
          style={[
            styles.glowWrap,
            {
              width: glowSize,
              height: glowSize,
              marginLeft: -glowSize / 2,
              marginTop: -glowSize / 2,
              opacity: glowIntensity * 0.55,
            },
          ]}
        >
          <Svg width={glowSize} height={glowSize} viewBox="0 0 100 100">
            <Defs>
              <RadialGradient id="cosmic" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                <Stop offset="0%" stopColor={palette.mystic.soul} stopOpacity={0.6} />
                <Stop offset="40%" stopColor={palette.mystic.cosmic} stopOpacity={0.35} />
                <Stop offset="75%" stopColor={palette.mystic.cosmic} stopOpacity={0.1} />
                <Stop offset="100%" stopColor={palette.mystic.cosmic} stopOpacity={0} />
              </RadialGradient>
            </Defs>
            <Rect x="0" y="0" width="100" height="100" fill="url(#cosmic)" />
          </Svg>
        </View>
      )}

      {vignettes && (
        <LinearGradient
          colors={gradients.topVignette}
          style={styles.topVignette}
          pointerEvents="none"
        />
      )}
      {vignettes && (
        <LinearGradient
          colors={gradients.bottomVignette}
          style={styles.bottomVignette}
          pointerEvents="none"
        />
      )}

      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.void.abyss,
    overflow: 'hidden',
  },
  glowWrap: {
    position: 'absolute',
    top: '50%',
    left: '50%',
  },
  topVignette: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 140,
  },
  bottomVignette: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 160,
  },
});
