/**
 * Atma Vedika — Onboarding · Calculating
 *
 * Cena de cálculo do mapa natal.
 * Anéis girando + mantras trocando + glow profundo.
 * Após mock resolver, navega pra reading.
 */

import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { Text } from '@/components/primitives/Text';
import { CelestialOrbit } from '@/features/onboarding/CelestialOrbit';
import { OnboardingShell } from '@/features/onboarding/OnboardingShell';
import {
  calculationMantras,
  mockCalculateBirthChart,
} from '@/services/mockChartService';
import { useUserStore } from '@/store/userStore';
import { palette, semantic } from '@/theme/colors';
import { duration } from '@/theme/motion';
import { spacing } from '@/theme/spacing';

export default function CalculatingScreen() {
  const router = useRouter();
  const onboarding = useUserStore((s) => s.onboarding);
  const setBirthChart = useUserStore((s) => s.setBirthChart);
  const [mantraIndex, setMantraIndex] = useState(0);

  // Trigger cálculo on mount
  useEffect(() => {
    let cancelled = false;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft).catch(() => {});

    mockCalculateBirthChart(onboarding, (i) => {
      if (!cancelled) setMantraIndex(i);
    })
      .then((chart) => {
        if (cancelled) return;
        setBirthChart(chart);
        // Pequena pausa cinematográfica antes do reveal
        setTimeout(() => {
          if (!cancelled) router.replace('/onboarding/reading');
        }, 500);
      })
      .catch(() => {
        if (!cancelled) router.replace('/onboarding/reading');
      });

    return () => {
      cancelled = true;
    };
  }, [onboarding, setBirthChart, router]);

  return (
    <OnboardingShell ambient={false} glowColor={palette.gold.deep}>
      <View style={styles.container}>
        <View style={styles.spacer} />

        <CelestialOrbit size={260} />

        <View style={styles.gapLarge} />

        <Text variant="ritual" color={semantic.textGold} align="center">
          Calculando seu mapa natal
        </Text>

        <View style={styles.gap} />

        <View style={styles.mantraSlot}>
          {calculationMantras.map((mantra, i) => (
            <MantraLine
              key={i}
              text={mantra}
              active={i === mantraIndex}
              past={i < mantraIndex}
            />
          ))}
        </View>

        <View style={styles.spacer} />
      </View>
    </OnboardingShell>
  );
}

interface MantraLineProps {
  text: string;
  active: boolean;
  past: boolean;
}

function MantraLine({ text, active, past }: MantraLineProps) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(8);

  useEffect(() => {
    // Todos os mantras dividem o mesmo slot absoluto — só o ativo pode
    // ficar visível, senão o anterior "vaza" por trás (opacidade residual).
    opacity.value = withTiming(active ? 1 : 0, {
      duration: duration.smooth,
      easing: Easing.bezier(0.16, 1, 0.3, 1),
    });
    translateY.value = withTiming(active ? 0 : 8, {
      duration: duration.smooth,
      easing: Easing.bezier(0.16, 1, 0.3, 1),
    });
  }, [active, past, opacity, translateY]);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View style={[styles.mantraLine, style]}>
      <Text variant="sacred" color={semantic.textPrimary} align="center">
        {text}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  spacer: { flex: 1 },
  gap: { height: spacing.lg },
  gapLarge: { height: spacing.cosmic },
  mantraSlot: {
    height: 80,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  mantraLine: {
    position: 'absolute',
    paddingHorizontal: spacing.lg,
  },
});
