/**
 * Atma Vedika — PaywallSheet
 *
 * Bottom sheet cinematográfico mostrado quando o usuário esgota
 * as 3 mensagens grátis. Glass effect, brand sagrada, CTA primário.
 */

import { useEffect } from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Text } from '@/components/primitives/Text';
import { SacredButton } from '@/components/primitives/SacredButton';
import { PulsingGlow } from '@/components/effects/PulsingGlow';
import { palette, semantic } from '@/theme/colors';
import { duration } from '@/theme/motion';
import { radii } from '@/theme/radii';
import { spacing } from '@/theme/spacing';

const BENEFITS = [
  'conversas ilimitadas com Veda',
  'leitura diária baseada no trânsito',
  'relatório anual personalizado',
  'mapa natal 3D para compartilhar',
];

export interface PaywallSheetProps {
  visible: boolean;
  onAccept: () => void;
  onDismiss: () => void;
}

export function PaywallSheet({
  visible,
  onAccept,
  onDismiss,
}: PaywallSheetProps) {
  const insets = useSafeAreaInsets();
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(60);

  useEffect(() => {
    if (visible) {
      opacity.value = withTiming(1, {
        duration: duration.smooth,
        easing: Easing.bezier(0.16, 1, 0.3, 1),
      });
      translateY.value = withTiming(0, {
        duration: duration.smooth,
        easing: Easing.bezier(0.16, 1, 0.3, 1),
      });
    } else {
      opacity.value = withTiming(0, { duration: duration.base });
      translateY.value = withTiming(60, { duration: duration.base });
    }
  }, [visible, opacity, translateY]);

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  if (!visible) return null;

  const handleAccept = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy).catch(() => {});
    onAccept();
  };

  return (
    <Animated.View
      pointerEvents={visible ? 'auto' : 'none'}
      style={[styles.backdrop, backdropStyle]}
    >
      <Pressable style={styles.dismissArea} onPress={onDismiss} />

      <Animated.View style={[styles.sheet, sheetStyle]}>
        {Platform.OS === 'ios' ? (
          <BlurView intensity={70} tint="dark" style={StyleSheet.absoluteFill} />
        ) : (
          <View
            style={[
              StyleSheet.absoluteFill,
              { backgroundColor: 'rgba(6, 4, 16, 0.96)' },
            ]}
          />
        )}
        <View style={[StyleSheet.absoluteFill, styles.tint]} />
        <View style={[StyleSheet.absoluteFill, styles.border]} />

        <PulsingGlow
          size={320}
          color={palette.gold.deep}
          intensity={0.18}
          top={120}
        />

        <View style={[styles.content, { paddingBottom: insets.bottom + spacing.xl }]}>
          <View style={styles.handle} />

          <View style={{ height: spacing.lg }} />

          <Text variant="ritual" color={semantic.textGold} align="center">
            ✦  você esgotou suas três perguntas  ✦
          </Text>

          <View style={{ height: spacing.lg }} />

          <Text variant="display" color={semantic.textPrimary} align="center">
            Continue ouvindo{'\n'}o que Veda tem a dizer.
          </Text>

          <View style={{ height: spacing.xl }} />

          <View style={styles.priceRow}>
            <Text variant="ritual" color={semantic.textTertiary}>
              R$
            </Text>
            <Text variant="cosmicTitle" color={palette.gold.glow}>
              39,90
            </Text>
            <Text variant="ritual" color={semantic.textTertiary}>
              /mês
            </Text>
          </View>

          <View style={{ height: spacing.xl }} />

          <View style={styles.benefits}>
            {BENEFITS.map((b) => (
              <View key={b} style={styles.benefitRow}>
                <Text variant="ritual" color={palette.gold.glow}>
                  ✦
                </Text>
                <Text variant="bodyEmphasis" color={semantic.textPrimary}>
                  {b}
                </Text>
              </View>
            ))}
          </View>

          <View style={{ height: spacing.xxxl }} />

          <SacredButton
            label="tornar-se vedika"
            fullWidth
            breathing
            onPress={handleAccept}
          />

          <View style={{ height: spacing.md }} />

          <Pressable onPress={onDismiss} style={styles.laterBtn}>
            <Text variant="ritual" color={semantic.textTertiary} align="center">
              talvez depois
            </Text>
          </Pressable>
        </View>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(2,1,8,0.6)',
    zIndex: 200,
    justifyContent: 'flex-end',
  },
  dismissArea: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  sheet: {
    overflow: 'hidden',
    borderTopLeftRadius: radii.xl,
    borderTopRightRadius: radii.xl,
    shadowColor: '#000',
    shadowOpacity: 0.6,
    shadowRadius: 30,
    shadowOffset: { width: 0, height: -20 },
  },
  tint: {
    backgroundColor: 'rgba(6,4,16,0.5)',
  },
  border: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(212,175,55,0.3)',
  },
  content: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    alignItems: 'center',
  },
  handle: {
    width: 40,
    height: 3,
    borderRadius: 999,
    backgroundColor: 'rgba(245,244,240,0.3)',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: spacing.xs,
  },
  benefits: {
    alignSelf: 'stretch',
    gap: spacing.md,
    paddingHorizontal: spacing.md,
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  laterBtn: {
    paddingVertical: spacing.md,
  },
});
