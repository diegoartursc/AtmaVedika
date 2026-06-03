/**
 * Atma Vedika — Entry / Splash Cinemático
 *
 * Primeira tela: cena cinematográfica de boas-vindas.
 * Brand + mantra + CTA pulsante entram em cascata.
 * Tocando "iniciar jornada" o usuário avança (mock por enquanto).
 */

import { useEffect } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CosmicBackground } from '@/components/effects/CosmicBackground';
import { PremiumParticles } from '@/components/effects/PremiumParticles';
import { PulsingGlow } from '@/components/effects/PulsingGlow';
import { Text } from '@/components/primitives/Text';
import { useUserStore } from '@/store/userStore';
import { palette, semantic } from '@/theme/colors';
import { duration } from '@/theme/motion';
import { spacing } from '@/theme/spacing';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function EntryScreen() {
  const router = useRouter();
  const resetOnboarding = useUserStore((s) => s.resetOnboarding);

  const handleEnter = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    resetOnboarding();
    router.push('/onboarding/welcome');
  };

  const brandOpacity = useSharedValue(0);
  const brandTranslate = useSharedValue(20);
  const mantraOpacity = useSharedValue(0);
  const ctaOpacity = useSharedValue(0);
  const ctaScale = useSharedValue(0.92);

  useEffect(() => {
    // Brand entra LENTAMENTE (cosmic = 2s) com bezier sagrado
    brandOpacity.value = withTiming(1, {
      duration: duration.cosmic,
      easing: Easing.bezier(0.16, 1, 0.3, 1),
    });
    brandTranslate.value = withTiming(0, {
      duration: duration.cosmic,
      easing: Easing.bezier(0.16, 1, 0.3, 1),
    });

    // Mantra aparece DEPOIS do brand — pausa contemplativa
    mantraOpacity.value = withDelay(
      duration.deep,
      withTiming(1, {
        duration: duration.cinematic,
        easing: Easing.inOut(Easing.sin),
      }),
    );

    // CTA chega por último, com tempo pra absorver a mantra
    ctaOpacity.value = withDelay(
      duration.cosmic + duration.smooth,
      withTiming(1, {
        duration: duration.deep,
        easing: Easing.bezier(0.16, 1, 0.3, 1),
      }),
    );

    // Respiração do CTA mais lenta — sensação meditativa
    ctaScale.value = withDelay(
      duration.cosmic + duration.smooth,
      withSequence(
        withTiming(1.02, {
          duration: duration.cinematic,
          easing: Easing.inOut(Easing.sin),
        }),
        withRepeat(
          withSequence(
            withTiming(0.97, { duration: 1800, easing: Easing.inOut(Easing.sin) }),
            withTiming(1.02, { duration: 1800, easing: Easing.inOut(Easing.sin) }),
          ),
          -1,
          true,
        ),
      ),
    );
  }, [brandOpacity, brandTranslate, mantraOpacity, ctaOpacity, ctaScale]);

  const brandStyle = useAnimatedStyle(() => ({
    opacity: brandOpacity.value,
    transform: [{ translateY: brandTranslate.value }],
  }));

  const mantraStyle = useAnimatedStyle(() => ({
    opacity: mantraOpacity.value,
  }));

  const ctaStyle = useAnimatedStyle(() => ({
    opacity: ctaOpacity.value,
    transform: [{ scale: ctaScale.value }],
  }));

  return (
    <CosmicBackground>
      <PulsingGlow size={420} color={palette.mystic.soul} intensity={0.15} top="38%" />
      <PulsingGlow size={260} color={palette.gold.deep} intensity={0.22} top="42%" />
      <PremiumParticles count={14} />

      <SafeAreaView style={styles.safe}>
        <View style={styles.spacer} />

        <Animated.View style={[styles.brandBlock, brandStyle]}>
          <Text variant="ritual" color={semantic.textGold} align="center">
            ✦  Conselheiro Védico  ✦
          </Text>
          <View style={styles.brandSpacer} />
          <Text variant="cosmicTitle" color={semantic.textPrimary} align="center">
            Atma{'\n'}Vedika
          </Text>
        </Animated.View>

        <View style={styles.spacer} />

        <Animated.View style={[styles.mantraBlock, mantraStyle]}>
          <Text variant="sacred" color={semantic.textTertiary} align="center">
            “Antes de você nascer, o céu já sabia quem você seria.”
          </Text>
        </Animated.View>

        <AnimatedPressable
          style={[styles.cta, ctaStyle]}
          onPress={handleEnter}
          android_ripple={{ color: palette.gold.whisper, borderless: false }}
        >
          <Text variant="ritual" color={palette.void.abyss} align="center">
            iniciar jornada
          </Text>
        </AnimatedPressable>
      </SafeAreaView>
    </CosmicBackground>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
  },
  spacer: {
    flex: 1,
  },
  brandBlock: {
    alignItems: 'center',
  },
  brandSpacer: {
    height: spacing.lg,
  },
  mantraBlock: {
    paddingHorizontal: spacing.xl,
    maxWidth: 340,
    marginBottom: spacing.cosmic,
  },
  cta: {
    marginBottom: spacing.xxxl,
    paddingHorizontal: spacing.xxxl,
    paddingVertical: spacing.lg,
    backgroundColor: palette.gold.glow,
    borderRadius: 999,
    shadowColor: palette.gold.pure,
    shadowOpacity: 0.6,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 0 },
    elevation: 12,
  },
});
