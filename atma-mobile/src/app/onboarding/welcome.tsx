/**
 * Atma Vedika — Onboarding · Welcome
 *
 * Convite emocional. Posiciona o que vai acontecer:
 * "vou ler o céu do seu nascimento para te conhecer."
 */

import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import { useRouter } from 'expo-router';

import { Text } from '@/components/primitives/Text';
import { SacredButton } from '@/components/primitives/SacredButton';
import { OnboardingShell } from '@/features/onboarding/OnboardingShell';
import { palette, semantic } from '@/theme/colors';
import { duration } from '@/theme/motion';
import { spacing } from '@/theme/spacing';

export default function WelcomeScreen() {
  const router = useRouter();

  const titleAnim = useSharedValue(0);
  const subtitleAnim = useSharedValue(0);

  useEffect(() => {
    titleAnim.value = withTiming(1, {
      duration: duration.deep,
      easing: Easing.bezier(0.16, 1, 0.3, 1),
    });
    subtitleAnim.value = withDelay(
      duration.base,
      withTiming(1, { duration: duration.deep }),
    );
  }, [titleAnim, subtitleAnim]);

  const titleStyle = useAnimatedStyle(() => ({
    opacity: titleAnim.value,
    transform: [{ translateY: (1 - titleAnim.value) * 12 }],
  }));

  const subtitleStyle = useAnimatedStyle(() => ({
    opacity: subtitleAnim.value,
  }));

  return (
    <OnboardingShell
      step={0}
      footer={
        <SacredButton
          label="estou pronto"
          breathing
          onPress={() => router.push('/onboarding/birth-data')}
        />
      }
    >
      <View style={styles.container}>
        <View style={styles.spacer} />

        <Animated.View style={titleStyle}>
          <Text variant="ritual" color={semantic.textGold} align="center">
            ✦  Primeiro encontro  ✦
          </Text>
          <View style={styles.gap} />
          <Text variant="hero" color={semantic.textPrimary} align="center">
            Vou ler o céu{'\n'}do seu nascimento.
          </Text>
        </Animated.View>

        <View style={styles.gap} />
        <View style={styles.gap} />

        <Animated.View style={subtitleStyle}>
          <Text variant="bodyLarge" color={semantic.textTertiary} align="center">
            Não pra te dar previsões.{'\n'}
            Pra te dizer, em poucos minutos,{'\n'}
            quem você sempre foi.
          </Text>
        </Animated.View>

        <View style={styles.spacer} />

        <Animated.View style={subtitleStyle}>
          <View style={styles.divider} />
          <Text variant="caption" color={semantic.textTertiary} align="center">
            data · hora · local de nascimento
          </Text>
        </Animated.View>
      </View>
    </OnboardingShell>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  spacer: { flex: 1 },
  gap: { height: spacing.lg },
  divider: {
    width: 32,
    height: 1,
    backgroundColor: palette.gold.deep,
    alignSelf: 'center',
    marginBottom: spacing.md,
    opacity: 0.6,
  },
});
