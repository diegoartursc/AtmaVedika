/**
 * Atma Vedika — TabPlaceholder
 *
 * Tela coringa para tabs ainda não implementadas.
 * Visual cósmico coerente com o resto do app.
 */

import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Text } from '@/components/primitives/Text';
import { CosmicBackground } from '@/components/effects/CosmicBackground';
import { PremiumParticles } from '@/components/effects/PremiumParticles';
import { PulsingGlow } from '@/components/effects/PulsingGlow';
import { semantic } from '@/theme/colors';
import { spacing } from '@/theme/spacing';

export interface TabPlaceholderProps {
  symbol: string;
  ritual: string;
  title: string;
  body: string;
  comingPhase: string;
  glowColor: string;
}

export function TabPlaceholder({
  symbol,
  ritual,
  title,
  body,
  comingPhase,
  glowColor,
}: TabPlaceholderProps) {
  return (
    <CosmicBackground>
      <PulsingGlow size={420} color={glowColor} intensity={0.18} top="40%" />
      <PremiumParticles count={9} />

      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.content}>
          <Text style={styles.symbol}>{symbol}</Text>

          <View style={styles.gapLarge} />

          <Text variant="ritual" color={semantic.textGold} align="center">
            {ritual}
          </Text>
          <View style={styles.gap} />
          <Text variant="hero" color={semantic.textPrimary} align="center">
            {title}
          </Text>

          <View style={styles.gapLarge} />

          <Text variant="sacred" color={semantic.textTertiary} align="center">
            {body}
          </Text>
        </View>

        <View style={styles.bottom}>
          <View style={styles.divider} />
          <Text variant="caption" color={semantic.textTertiary} align="center">
            chega na {comingPhase}
          </Text>
        </View>
      </SafeAreaView>
    </CosmicBackground>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: spacing.cosmic,
  },
  symbol: {
    fontSize: 88,
    color: 'rgba(212,175,55,0.85)',
    textShadowColor: 'rgba(212,175,55,0.6)',
    textShadowRadius: 24,
    textShadowOffset: { width: 0, height: 0 },
  },
  gap: { height: spacing.md },
  gapLarge: { height: spacing.xxxl },
  bottom: {
    paddingBottom: spacing.cosmic + spacing.cosmic,
    alignItems: 'center',
  },
  divider: {
    width: 32,
    height: 1,
    backgroundColor: 'rgba(212,175,55,0.4)',
    marginBottom: spacing.md,
  },
});
