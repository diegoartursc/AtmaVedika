/**
 * Atma Vedika — SacredButton
 *
 * Botão premium com haptics, scale press, glow respirando.
 * Variants: primary (dourado preenchido), ghost (contorno), text (sem fundo).
 */

import { useEffect } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  View,
  type PressableProps,
  type ViewStyle,
} from 'react-native';
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

import { Text } from './Text';
import { palette, semantic } from '@/theme/colors';
import { duration, spring } from '@/theme/motion';
import { radii } from '@/theme/radii';
import { spacing } from '@/theme/spacing';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export type SacredButtonVariant = 'primary' | 'ghost' | 'text';
export type SacredButtonSize = 'sm' | 'md' | 'lg';

export interface SacredButtonProps extends Omit<PressableProps, 'style' | 'children'> {
  label: string;
  variant?: SacredButtonVariant;
  size?: SacredButtonSize;
  loading?: boolean;
  /** Faz o botão pulsar suavemente (chama atenção). */
  breathing?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
}

export function SacredButton({
  label,
  variant = 'primary',
  size = 'md',
  loading = false,
  breathing = false,
  fullWidth = false,
  disabled,
  onPressIn,
  onPressOut,
  onPress,
  style,
  ...rest
}: SacredButtonProps) {
  const pressScale = useSharedValue(1);
  const breath = useSharedValue(1);
  const hover = useSharedValue(1);

  useEffect(() => {
    if (!breathing) {
      breath.value = 1;
      return;
    }
    breath.value = withRepeat(
      withSequence(
        withTiming(1.03, {
          duration: duration.cinematic,
          easing: Easing.inOut(Easing.sin),
        }),
        withTiming(0.99, {
          duration: duration.cinematic,
          easing: Easing.inOut(Easing.sin),
        }),
      ),
      -1,
      true,
    );
  }, [breath, breathing]);

  const handlePressIn = (e: Parameters<NonNullable<PressableProps['onPressIn']>>[0]) => {
    pressScale.value = withSpring(0.96, spring.snap);
    onPressIn?.(e);
  };

  const handlePressOut = (e: Parameters<NonNullable<PressableProps['onPressOut']>>[0]) => {
    pressScale.value = withSpring(1, spring.bounce);
    onPressOut?.(e);
  };

  const handlePress = (e: Parameters<NonNullable<PressableProps['onPress']>>[0]) => {
    if (disabled || loading) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    onPress?.(e);
  };

  const handleHoverIn = () => {
    hover.value = withSpring(1.04, spring.snap);
  };
  const handleHoverOut = () => {
    hover.value = withSpring(1, spring.bounce);
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pressScale.value * breath.value * hover.value }],
  }));

  const sizeStyle = SIZE_STYLES[size];
  const variantStyle = VARIANT_STYLES[variant];
  const labelColor = LABEL_COLOR[variant];

  return (
    <AnimatedPressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      onHoverIn={handleHoverIn}
      onHoverOut={handleHoverOut}
      disabled={disabled || loading}
      style={[
        styles.base,
        sizeStyle,
        variantStyle,
        fullWidth && styles.fullWidth,
        disabled && styles.disabled,
        animatedStyle,
        style,
      ]}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator color={labelColor} />
      ) : (
        <View style={styles.inner}>
          <Text
            variant="ritual"
            color={labelColor}
            style={SIZE_LABEL[size]}
          >
            {label}
          </Text>
        </View>
      )}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radii.pill,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  fullWidth: {
    alignSelf: 'stretch',
  },
  disabled: {
    opacity: 0.4,
  },
});

const SIZE_STYLES: Record<SacredButtonSize, ViewStyle> = {
  sm: { paddingVertical: spacing.md, paddingHorizontal: spacing.xl },
  md: { paddingVertical: spacing.lg, paddingHorizontal: spacing.xxxl },
  lg: { paddingVertical: spacing.xl, paddingHorizontal: spacing.cosmic },
};

const SIZE_LABEL: Record<SacredButtonSize, { fontSize: number }> = {
  sm: { fontSize: 10 },
  md: { fontSize: 11 },
  lg: { fontSize: 12 },
};

const VARIANT_STYLES: Record<SacredButtonVariant, ViewStyle> = {
  primary: {
    backgroundColor: palette.gold.glow,
    shadowColor: palette.gold.pure,
    shadowOpacity: 0.55,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 0 },
    elevation: 14,
  },
  ghost: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: semantic.border,
  },
  text: {
    backgroundColor: 'transparent',
  },
};

const LABEL_COLOR: Record<SacredButtonVariant, string> = {
  primary: palette.void.abyss,
  ghost: palette.gold.glow,
  text: palette.silver.muted,
};
