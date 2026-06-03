/**
 * Atma Vedika — SacredInput
 *
 * Input minimalista premium: sem caixa, só underline.
 * Label flutua pra cima quando focado / preenchido.
 * Glow dourado aparece no foco.
 */

import { useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  type TextInputProps,
  type ViewStyle,
} from 'react-native';
import Animated, {
  Easing,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { palette, semantic } from '@/theme/colors';
import { duration } from '@/theme/motion';
import { spacing } from '@/theme/spacing';
import { fontFamilies, fontSizes, letterSpacing } from '@/theme/typography';

export interface SacredInputProps extends Omit<TextInputProps, 'style'> {
  label: string;
  /** Aplica máscara comum: 'date' (DD/MM/AAAA), 'time' (HH:MM). */
  mask?: 'date' | 'time';
  /** Tamanho do texto do valor — 'cosmic' pra formulários teatrais. */
  valueSize?: 'normal' | 'large' | 'cosmic';
  containerStyle?: ViewStyle;
  autoFocusOnMount?: boolean;
}

const AnimatedView = Animated.View;

export function SacredInput({
  label,
  mask,
  valueSize = 'cosmic',
  containerStyle,
  autoFocusOnMount,
  value,
  onChangeText,
  ...rest
}: SacredInputProps) {
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);

  const focusAnim = useSharedValue(0);
  const hasValue = (value?.length ?? 0) > 0;

  useEffect(() => {
    focusAnim.value = withTiming(focused || hasValue ? 1 : 0, {
      duration: duration.base,
      easing: Easing.bezier(0.16, 1, 0.3, 1),
    });
  }, [focusAnim, focused, hasValue]);

  useEffect(() => {
    if (autoFocusOnMount) {
      // Delay para entrar depois da transição de tela
      const t = setTimeout(() => inputRef.current?.focus(), 350);
      return () => clearTimeout(t);
    }
  }, [autoFocusOnMount]);

  const labelStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: -focusAnim.value * 26 },
      { scale: 1 - focusAnim.value * 0.18 },
    ],
    color: interpolateColor(
      focusAnim.value,
      [0, 1],
      [palette.silver.whisper, palette.gold.glow],
    ),
    opacity: 0.4 + focusAnim.value * 0.6,
  }));

  const underlineStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      focusAnim.value,
      [0, 1],
      [palette.silver.breath, palette.gold.glow],
    ),
    transform: [{ scaleX: 0.5 + focusAnim.value * 0.5 }],
    shadowOpacity: focusAnim.value * 0.7,
  }));

  const handleChange = (raw: string) => {
    let next = raw;
    if (mask === 'date') next = formatDate(raw);
    else if (mask === 'time') next = formatTime(raw);
    onChangeText?.(next);
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <AnimatedView style={[styles.label, labelStyle]} pointerEvents="none">
        <Animated.Text style={styles.labelText}>{label}</Animated.Text>
      </AnimatedView>

      <TextInput
        ref={inputRef}
        value={value}
        onChangeText={handleChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        selectionColor={palette.gold.glow}
        cursorColor={palette.gold.glow}
        style={[
          styles.input,
          valueSize === 'cosmic' && styles.inputCosmic,
          valueSize === 'large' && styles.inputLarge,
        ]}
        placeholderTextColor={palette.silver.whisper}
        keyboardType={
          mask === 'date' || mask === 'time' ? 'number-pad' : rest.keyboardType
        }
        maxLength={mask === 'date' ? 10 : mask === 'time' ? 5 : rest.maxLength}
        {...rest}
      />

      <AnimatedView style={[styles.underline, underlineStyle]} />
    </View>
  );
}

// ─── Máscaras ─────────────────────────────────────────────

function formatDate(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 8);
  const parts = [
    digits.slice(0, 2),
    digits.slice(2, 4),
    digits.slice(4, 8),
  ].filter(Boolean);
  return parts.join('/');
}

function formatTime(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 4);
  const parts = [digits.slice(0, 2), digits.slice(2, 4)].filter(Boolean);
  return parts.join(':');
}

const styles = StyleSheet.create({
  container: {
    paddingTop: spacing.xl,
    paddingBottom: spacing.md,
    position: 'relative',
  },
  label: {
    position: 'absolute',
    top: spacing.xl + 6,
    left: 0,
    transformOrigin: 'left',
  },
  labelText: {
    fontFamily: fontFamilies.bodyMedium,
    fontSize: fontSizes.body,
    letterSpacing: letterSpacing.wide,
    color: palette.silver.whisper,
    textTransform: 'uppercase',
  },
  input: {
    fontFamily: fontFamilies.display,
    fontSize: fontSizes.title,
    color: semantic.textPrimary,
    paddingVertical: 0,
    paddingHorizontal: 0,
    minHeight: 38,
  },
  inputLarge: {
    fontSize: fontSizes.display,
  },
  inputCosmic: {
    fontSize: fontSizes.display,
    fontFamily: fontFamilies.display,
    letterSpacing: -0.3,
  },
  underline: {
    height: 1,
    marginTop: spacing.sm,
    shadowColor: palette.gold.pure,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 0 },
  },
});
