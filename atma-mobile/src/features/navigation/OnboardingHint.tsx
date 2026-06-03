/**
 * Atma Vedika — OnboardingHint
 *
 * Card sólido centralizado que ensina os gestos. Aparece na 1ª vez
 * que o usuário entra na Home, ocupando a tela inteira com backdrop
 * preto opaco (não mais translúcido — evitamos misturar com cards atrás).
 *
 * Auto-dismiss em 6.5s ou no primeiro gesto/tap.
 */

import { useEffect } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { Text } from '@/components/primitives/Text';
import { palette, semantic } from '@/theme/colors';
import { duration } from '@/theme/motion';
import { radii } from '@/theme/radii';
import { spacing } from '@/theme/spacing';

const AUTO_DISMISS_MS = 6500;

export interface OnboardingHintProps {
  visible: boolean;
  onDismiss: () => void;
}

export function OnboardingHint({ visible, onDismiss }: OnboardingHintProps) {
  const opacity = useSharedValue(0);
  const vBounce = useSharedValue(0);
  const hBounce = useSharedValue(0);

  useEffect(() => {
    if (!visible) {
      opacity.value = withTiming(0, { duration: duration.smooth });
      return;
    }

    opacity.value = withTiming(1, {
      duration: duration.smooth,
      easing: Easing.bezier(0.16, 1, 0.3, 1),
    });

    vBounce.value = withRepeat(
      withSequence(
        withTiming(-8, { duration: 900, easing: Easing.inOut(Easing.quad) }),
        withTiming(8, { duration: 900, easing: Easing.inOut(Easing.quad) }),
        withTiming(0, { duration: 500, easing: Easing.inOut(Easing.quad) }),
      ),
      -1,
    );

    hBounce.value = withDelay(
      400,
      withRepeat(
        withSequence(
          withTiming(-10, { duration: 900, easing: Easing.inOut(Easing.quad) }),
          withTiming(10, { duration: 900, easing: Easing.inOut(Easing.quad) }),
          withTiming(0, { duration: 500, easing: Easing.inOut(Easing.quad) }),
        ),
        -1,
      ),
    );

    const timer = setTimeout(onDismiss, AUTO_DISMISS_MS);
    return () => clearTimeout(timer);
  }, [visible, opacity, vBounce, hBounce, onDismiss]);

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const vArrowStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: vBounce.value }],
  }));

  const hArrowStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: hBounce.value }],
  }));

  if (!visible) return null;

  return (
    <Animated.View
      pointerEvents={visible ? 'auto' : 'none'}
      style={[styles.overlay, overlayStyle]}
    >
      <Pressable style={styles.dismissArea} onPress={onDismiss} />

      <View style={styles.card}>
        <Text variant="ritual" color={semantic.textGold} align="center">
          ✦  como ler seu mapa  ✦
        </Text>

        <View style={styles.headerGap} />

        <Text variant="display" color={semantic.textPrimary} align="center">
          Navegue pelos{'\n'}temas do céu.
        </Text>

        <View style={styles.headerGap} />

        {/* Linha vertical (↕) */}
        <View style={styles.gestureRow}>
          <Animated.Text style={[styles.arrow, vArrowStyle]}>↕</Animated.Text>
          <View style={{ width: spacing.lg }} />
          <View style={styles.gestureText}>
            <Text variant="bodyEmphasis" color={semantic.textPrimary}>
              deslize ↑ ↓
            </Text>
            <View style={{ height: 2 }} />
            <Text variant="caption" color={semantic.textTertiary}>
              troca o capítulo
            </Text>
            <View style={{ height: 2 }} />
            <Text variant="caption" color={semantic.textTertiary}>
              mapa · casas · planetas · aspectos…
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Linha horizontal (↔) */}
        <View style={styles.gestureRow}>
          <Animated.Text style={[styles.arrow, hArrowStyle]}>↔</Animated.Text>
          <View style={{ width: spacing.lg }} />
          <View style={styles.gestureText}>
            <Text variant="bodyEmphasis" color={semantic.textPrimary}>
              deslize ← →
            </Text>
            <View style={{ height: 2 }} />
            <Text variant="caption" color={semantic.textTertiary}>
              vira a página
            </Text>
            <View style={{ height: 2 }} />
            <Text variant="caption" color={semantic.textTertiary}>
              casa 1 · casa 2 · casa 3…
            </Text>
          </View>
        </View>

        <View style={styles.headerGap} />

        <Text variant="caption" color={semantic.textTertiary} align="center">
          no computador, use as setas do teclado.
        </Text>

        <View style={styles.tapHint}>
          <Text variant="ritual" color={semantic.textGold} align="center">
            toque pra começar
          </Text>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(2,1,8,0.92)',
    zIndex: 100,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  dismissArea: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  card: {
    width: '100%',
    maxWidth: 380,
    padding: spacing.xl,
    borderRadius: radii.xl,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(212,175,55,0.35)',
    backgroundColor: 'rgba(11,8,32,0.9)',
    alignItems: 'stretch',
    shadowColor: palette.gold.pure,
    shadowOpacity: 0.25,
    shadowRadius: 40,
    shadowOffset: { width: 0, height: 0 },
  },
  headerGap: {
    height: spacing.lg,
  },
  gestureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  gestureText: {
    flex: 1,
  },
  arrow: {
    fontSize: 38,
    width: 46,
    textAlign: 'center',
    color: palette.gold.glow,
    textShadowColor: palette.gold.pure,
    textShadowRadius: 14,
    textShadowOffset: { width: 0, height: 0 },
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: palette.silver.breath,
    opacity: 0.6,
    marginVertical: spacing.xs,
  },
  tapHint: {
    marginTop: spacing.lg,
    paddingTop: spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: palette.silver.breath,
  },
});
