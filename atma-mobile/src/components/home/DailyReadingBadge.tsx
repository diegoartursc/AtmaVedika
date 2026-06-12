/**
 * Atma Vedika — DailyReadingBadge
 *
 * Chip circular compacto no header da Home com o símbolo do planeta
 * regente do dia. Dot dourado pulsante quando há leitura nova.
 * Tap abre o DailyReadingSheet (texto completo).
 */

import { useEffect } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { Text } from '@/components/primitives/Text';
import { palette } from '@/theme/colors';
import { spring } from '@/theme/motion';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export interface DailyReadingBadgeProps {
  symbol: string;
  rulerColor: string;
  /** Texto curto — não exibido, mantido por compat (acessibilidade). */
  brief: string;
  isNew: boolean;
  onPress: () => void;
}

export function DailyReadingBadge({
  symbol,
  rulerColor,
  brief,
  isNew,
  onPress,
}: DailyReadingBadgeProps) {
  const pulse = useSharedValue(0);
  const press = useSharedValue(1);

  useEffect(() => {
    if (!isNew) return;
    pulse.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1300, easing: Easing.inOut(Easing.sin) }),
        withTiming(0, { duration: 1300, easing: Easing.inOut(Easing.sin) }),
      ),
      -1,
    );
  }, [isNew, pulse]);

  const dotStyle = useAnimatedStyle(() => ({
    opacity: 0.5 + pulse.value * 0.5,
    transform: [{ scale: 0.8 + pulse.value * 0.35 }],
  }));

  const containerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: press.value }],
  }));

  const handlePress = () => {
    Haptics.selectionAsync().catch(() => {});
    onPress();
  };

  return (
    <AnimatedPressable
      accessibilityRole="button"
      accessibilityLabel={`Leitura de hoje · ${brief}`}
      onPress={handlePress}
      onPressIn={() => {
        press.value = withSpring(0.9, spring.snap);
      }}
      onPressOut={() => {
        press.value = withSpring(1, spring.bounce);
      }}
      onHoverIn={() => {
        press.value = withSpring(1.06, spring.snap);
      }}
      onHoverOut={() => {
        press.value = withSpring(1, spring.bounce);
      }}
      style={[styles.badge, containerStyle]}
    >
      <Text
        style={[
          styles.symbol,
          { color: rulerColor, textShadowColor: rulerColor },
        ]}
      >
        {symbol}
      </Text>
      {isNew ? <Animated.View style={[styles.dot, dotStyle]} /> : null}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  badge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(212,175,55,0.32)',
    backgroundColor: 'rgba(212,175,55,0.06)',
  },
  symbol: {
    fontSize: 22,
    lineHeight: 26,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  dot: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 9,
    height: 9,
    borderRadius: 4.5,
    backgroundColor: palette.gold.glow,
    borderWidth: 1.5,
    borderColor: palette.void.abyss,
    shadowColor: palette.gold.pure,
    shadowOpacity: 0.9,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 0 },
  },
});
