/**
 * Atma Vedika — Onboarding · First Reading
 *
 * Reveal teatral da primeira leitura.
 * Cada estrofe entra com fade + translateY, espaçadas no tempo.
 * No fim, CTA "Conversar com Veda".
 */

import { useEffect, useMemo } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';

import { Text } from '@/components/primitives/Text';
import { SacredButton } from '@/components/primitives/SacredButton';
import { OnboardingShell } from '@/features/onboarding/OnboardingShell';
import { buildFirstReading, type ReadingStanza } from '@/services/firstReading';
import { useUserStore } from '@/store/userStore';
import { mockBirthChart } from '@/mocks/birthChart';
import { palette, semantic } from '@/theme/colors';
import { duration } from '@/theme/motion';
import { spacing } from '@/theme/spacing';

const STANZA_INTERVAL = 900;

export default function ReadingScreen() {
  const router = useRouter();
  const birthChart = useUserStore((s) => s.birthChart) ?? mockBirthChart;
  const setOnboarded = useUserStore((s) => s.setOnboarded);

  const stanzas = useMemo(() => buildFirstReading(birthChart), [birthChart]);
  const ctaOpacity = useSharedValue(0);

  useEffect(() => {
    ctaOpacity.value = withDelay(
      stanzas.length * STANZA_INTERVAL + 600,
      withTiming(1, { duration: duration.smooth }),
    );
  }, [stanzas.length, ctaOpacity]);

  const ctaStyle = useAnimatedStyle(() => ({
    opacity: ctaOpacity.value,
    transform: [{ translateY: (1 - ctaOpacity.value) * 12 }],
  }));

  const handleEnter = () => {
    setOnboarded(true);
    router.replace('/(app)/home');
  };

  return (
    <OnboardingShell
      step={3}
      glowColor={palette.gold.deep}
      footer={
        <Animated.View style={[styles.ctaWrap, ctaStyle]}>
          <SacredButton
            label="navegar no meu mapa"
            breathing
            onPress={handleEnter}
          />
        </Animated.View>
      }
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text variant="ritual" color={semantic.textGold} align="center">
            Primeira leitura
          </Text>
        </View>

        {stanzas.map((stanza, i) => (
          <Stanza key={stanza.id} stanza={stanza} delay={i * STANZA_INTERVAL} />
        ))}

        <View style={styles.tail} />
      </ScrollView>
    </OnboardingShell>
  );
}

interface StanzaProps {
  stanza: ReadingStanza;
  delay: number;
}

function Stanza({ stanza, delay }: StanzaProps) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(16);

  useEffect(() => {
    opacity.value = withDelay(
      delay,
      withTiming(1, {
        duration: duration.deep,
        easing: Easing.bezier(0.16, 1, 0.3, 1),
      }),
    );
    translateY.value = withDelay(
      delay,
      withTiming(0, {
        duration: duration.deep,
        easing: Easing.bezier(0.16, 1, 0.3, 1),
      }),
    );
  }, [delay, opacity, translateY]);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View style={[styles.stanza, style]}>
      <Text
        variant={stanza.variant}
        color={semantic.textPrimary}
        align="center"
      >
        {stanza.text}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingVertical: spacing.xl,
    alignItems: 'center',
  },
  header: {
    marginBottom: spacing.cosmic,
  },
  stanza: {
    maxWidth: 640,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.lg,
    alignItems: 'center',
  },
  ctaWrap: {
    width: '100%',
    alignItems: 'center',
  },
  tail: {
    height: spacing.cosmic,
  },
});
