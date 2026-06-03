/**
 * Atma Vedika — PulsingGlow
 *
 * Glow circular pulsante feito com SVG radialGradient — funciona
 * IGUAL no web e no native (sem depender de shadow/box-shadow).
 *
 * Usado pra ancorar telas: splash, leituras especiais, mahadasha.
 */

import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Defs, RadialGradient, Rect, Stop } from 'react-native-svg';

import { palette } from '@/theme/colors';
import { duration } from '@/theme/motion';

export interface PulsingGlowProps {
  /** Tamanho do glow em pixels. */
  size?: number;
  /** Cor base. */
  color?: string;
  /** Intensidade da pulsação (0.05 = sutil, 0.3 = dramático). */
  intensity?: number;
  /** Opacidade máxima do centro do gradiente. */
  maxOpacity?: number;
  /** Posição. */
  top?: number | string;
  left?: number | string;
}

export function PulsingGlow({
  size = 320,
  color = palette.mystic.soul,
  intensity = 0.18,
  maxOpacity = 0.55,
  top = '40%',
  left = '50%',
}: PulsingGlowProps) {
  const breath = useSharedValue(0);

  useEffect(() => {
    breath.value = withRepeat(
      withTiming(1, {
        duration: duration.eternal,
        easing: Easing.inOut(Easing.sin),
      }),
      -1,
      true,
    );
  }, [breath]);

  const animatedStyle = useAnimatedStyle(() => {
    const scale = 1 - intensity / 2 + breath.value * intensity;
    const opacity = (0.45 + breath.value * 0.55) * maxOpacity;
    return {
      transform: [{ scale }],
      opacity,
    };
  });

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.glow,
        {
          width: size,
          height: size,
          marginLeft: -(typeof size === 'number' ? size : 0) / 2,
          marginTop: -(typeof size === 'number' ? size : 0) / 2,
          top: top as number,
          left: left as number,
        },
        animatedStyle,
      ]}
    >
      <Svg width={size} height={size} viewBox="0 0 100 100">
        <Defs>
          <RadialGradient id="pg" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
            <Stop offset="0%" stopColor={color} stopOpacity={1} />
            <Stop offset="35%" stopColor={color} stopOpacity={0.55} />
            <Stop offset="70%" stopColor={color} stopOpacity={0.15} />
            <Stop offset="100%" stopColor={color} stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Rect x="0" y="0" width="100" height="100" fill="url(#pg)" />
      </Svg>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  glow: {
    position: 'absolute',
  },
});
