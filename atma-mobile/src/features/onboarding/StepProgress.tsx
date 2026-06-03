/**
 * Atma Vedika — StepProgress
 *
 * Indicador minimalista de progresso (4 pontos sutis).
 * Ponto ativo vira linha dourada que respira.
 */

import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { palette } from '@/theme/colors';
import { duration } from '@/theme/motion';
import { radii } from '@/theme/radii';
import { spacing } from '@/theme/spacing';

export interface StepProgressProps {
  total: number;
  current: number; // 0-indexed
}

export function StepProgress({ total, current }: StepProgressProps) {
  return (
    <View style={styles.row}>
      {Array.from({ length: total }, (_, i) => (
        <Dot key={i} active={i === current} past={i < current} />
      ))}
    </View>
  );
}

function Dot({ active, past }: { active: boolean; past: boolean }) {
  const width = useSharedValue(6);
  const opacity = useSharedValue(0.25);

  useEffect(() => {
    const targetWidth = active ? 28 : 6;
    const targetOpacity = active ? 1 : past ? 0.6 : 0.18;

    width.value = withTiming(targetWidth, {
      duration: duration.base,
      easing: Easing.bezier(0.16, 1, 0.3, 1),
    });
    opacity.value = withTiming(targetOpacity, { duration: duration.base });
  }, [active, past, width, opacity]);

  const style = useAnimatedStyle(() => ({
    width: width.value,
    opacity: opacity.value,
    backgroundColor: active ? palette.gold.glow : palette.silver.soft,
  }));

  return <Animated.View style={[styles.dot, style]} />;
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    justifyContent: 'center',
  },
  dot: {
    height: 4,
    borderRadius: radii.pill,
  },
});
