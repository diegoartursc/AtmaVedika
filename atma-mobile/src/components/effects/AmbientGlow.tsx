/**
 * Atma Vedika — AmbientGlow
 *
 * Glow radial cuja cor morfa entre os accents dos temas conforme
 * `themeIdx` (SharedValue) muda. SVG radialGradient (funciona em web e native).
 *
 * Posicionado atrás do conteúdo. Transparente nas bordas.
 */

import { useEffect, useMemo } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  Easing,
  interpolateColor,
  useAnimatedProps,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withRepeat,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';
import Svg, { Defs, RadialGradient, Rect, Stop } from 'react-native-svg';

import { duration } from '@/theme/motion';

const AnimatedStop = Animated.createAnimatedComponent(Stop);

export interface AmbientGlowProps {
  accents: string[];
  themeIdx: SharedValue<number>;
  /** Tamanho do glow em px (cobertura). Default 720. */
  size?: number;
  /** Pulso de respiração (0 desliga). */
  pulse?: number;
  /** Opacidade máxima do centro (0..1). Default 0.32 (sutil). */
  maxOpacity?: number;
}

export function AmbientGlow({
  accents,
  themeIdx,
  size = 720,
  pulse = 0.1,
  maxOpacity = 0.32,
}: AmbientGlowProps) {
  const breath = useSharedValue(0);
  const indices = useMemo(() => accents.map((_, i) => i), [accents]);

  useEffect(() => {
    if (pulse <= 0) {
      breath.value = 0;
      return;
    }
    breath.value = withRepeat(
      withTiming(1, {
        duration: duration.eternal,
        easing: Easing.inOut(Easing.sin),
      }),
      -1,
      true,
    );
  }, [pulse, breath]);

  // Cor interpolada (derivedValue para reusar nos Stops)
  const color = useDerivedValue(() =>
    interpolateColor(themeIdx.value, indices, accents),
  );

  const wrapperStyle = useAnimatedStyle(() => {
    const scale = 1 - pulse / 2 + breath.value * pulse;
    const opacity = (0.7 + breath.value * 0.3) * maxOpacity;
    return {
      transform: [{ scale }],
      opacity,
    };
  });

  const stopCenter = useAnimatedProps(() => ({
    stopColor: color.value,
    stopOpacity: 1,
  }));
  const stopMid = useAnimatedProps(() => ({
    stopColor: color.value,
    stopOpacity: 0.45,
  }));
  const stopEdge = useAnimatedProps(() => ({
    stopColor: color.value,
    stopOpacity: 0.1,
  }));
  const stopOuter = useAnimatedProps(() => ({
    stopColor: color.value,
    stopOpacity: 0,
  }));

  return (
    <Animated.View pointerEvents="none" style={[styles.wrap, wrapperStyle]}>
      <Svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        style={{ marginLeft: -size / 2, marginTop: -size / 2 } as object}
      >
        <Defs>
          <RadialGradient id="ag" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
            <AnimatedStop offset="0%" animatedProps={stopCenter} />
            <AnimatedStop offset="35%" animatedProps={stopMid} />
            <AnimatedStop offset="75%" animatedProps={stopEdge} />
            <AnimatedStop offset="100%" animatedProps={stopOuter} />
          </RadialGradient>
        </Defs>
        <Rect x="0" y="0" width="100" height="100" fill="url(#ag)" />
      </Svg>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    top: '50%',
    left: '50%',
  },
});
