/**
 * Atma Vedika — ProgressArc
 *
 * Arco circular SVG mostrando progresso (0..1).
 * Glow dourado no ponteiro. Anel base sutil.
 * Animado: entra do 0 ao valor alvo com spring.
 */

import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedProps,
  useSharedValue,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import Svg, { Circle, Defs, RadialGradient, Stop } from 'react-native-svg';

import { Text } from '@/components/primitives/Text';
import { palette, semantic } from '@/theme/colors';
import { duration } from '@/theme/motion';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export interface ProgressArcProps {
  /** Progresso 0..1 */
  progress: number;
  /** Diâmetro total */
  size?: number;
  /** Cor do arco */
  color?: string;
  /** Espessura do anel */
  thickness?: number;
  /** Texto central principal (ex: "62%") */
  centerLabel?: string;
  /** Texto central secundário (pequeno acima) */
  centerCaption?: string;
}

export function ProgressArc({
  progress,
  size = 168,
  color = palette.gold.glow,
  thickness = 4,
  centerLabel,
  centerCaption,
}: ProgressArcProps) {
  const target = useSharedValue(0);
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    target.value = withTiming(progress, {
      duration: duration.cinematic,
      easing: Easing.bezier(0.16, 1, 0.3, 1),
    });
  }, [progress, target]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: circumference * (1 - target.value),
  }));

  return (
    <View style={[styles.wrapper, { width: size, height: size }]}>
      <Svg width={size} height={size} style={styles.svg}>
        <Defs>
          <RadialGradient
            id="halo"
            cx="50%"
            cy="50%"
            r="50%"
            fx="50%"
            fy="50%"
          >
            <Stop offset="0" stopColor={color} stopOpacity="0.4" />
            <Stop offset="1" stopColor={color} stopOpacity="0" />
          </RadialGradient>
        </Defs>

        {/* Aura central */}
        <Circle cx={size / 2} cy={size / 2} r={radius * 0.65} fill="url(#halo)" />

        {/* Anel base */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={palette.silver.breath}
          strokeWidth={thickness}
          fill="none"
        />

        {/* Arco de progresso */}
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={thickness}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={`${circumference} ${circumference}`}
          animatedProps={animatedProps}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>

      {(centerLabel || centerCaption) && (
        <View style={styles.center} pointerEvents="none">
          {centerCaption && (
            <Text
              variant="ritual"
              color={semantic.textTertiary}
              align="center"
            >
              {centerCaption}
            </Text>
          )}
          {centerLabel && (
            <Text variant="title" color={color} align="center">
              {centerLabel}
            </Text>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  svg: {
    position: 'absolute',
  },
  center: {
    alignItems: 'center',
  },
});
