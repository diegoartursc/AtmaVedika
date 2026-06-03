/**
 * Atma Vedika — Tab Veda (placeholder)
 *
 * O chat real com IA (Claude/GPT) consome tokens. Por enquanto,
 * essa aba é uma promessa visual — a infra do chat existe em
 * components/chat/* e será religada quando integrarmos com a API.
 */

import { StyleSheet, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { CosmicBackground } from '@/components/effects/CosmicBackground';
import { PulsingGlow } from '@/components/effects/PulsingGlow';
import { Text } from '@/components/primitives/Text';
import { TAB_BAR_HEIGHT } from '@/components/navigation/CustomTabBar';
import { palette, semantic } from '@/theme/colors';
import { radii } from '@/theme/radii';
import { spacing } from '@/theme/spacing';

export default function ChatScreen() {
  const insets = useSafeAreaInsets();

  return (
    <CosmicBackground glowIntensity={0.45} vignettes>
      <PulsingGlow size={420} color={palette.gold.deep} intensity={0.2} top="40%" />

      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.content}>
          <Text style={styles.symbol}>✦</Text>

          <View style={{ height: spacing.xl }} />

          <Text variant="ritual" color={semantic.textGold} align="center">
            ✦  veda  ✦
          </Text>

          <View style={{ height: spacing.md }} />

          <Text variant="display" color={semantic.textPrimary} align="center">
            Em silêncio,{'\n'}aguardando.
          </Text>

          <View style={{ height: spacing.xl }} />

          <Text variant="sacred" color={semantic.textTertiary} align="center">
            Veda é a conversa com a sua história astrológica.{'\n'}
            Vai ligar quando a IA estiver pronta —{'\n'}
            no fim do MVP, antes do lançamento.
          </Text>

          <View style={{ height: spacing.xxxl }} />

          <View style={styles.statusChip}>
            <View style={styles.statusDot} />
            <Text variant="caption" color={semantic.textTertiary}>
              próxima fase
            </Text>
          </View>
        </View>

        <View
          style={[
            styles.footer,
            { paddingBottom: TAB_BAR_HEIGHT + insets.bottom + spacing.lg },
          ]}
        >
          <View style={styles.divider} />
          <Text variant="caption" color={semantic.textTertiary} align="center">
            por agora, explore seu mapa nas outras abas.
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
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  symbol: {
    fontSize: 88,
    lineHeight: 96,
    color: palette.gold.glow,
    textShadowColor: palette.gold.pure,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 24,
  },
  statusChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radii.pill,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: palette.gold.deep,
    backgroundColor: 'rgba(212,175,55,0.05)',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: palette.gold.glow,
    shadowColor: palette.gold.pure,
    shadowOpacity: 0.8,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 0 },
  },
  footer: {
    alignItems: 'center',
  },
  divider: {
    width: 32,
    height: 1,
    backgroundColor: palette.gold.deep,
    marginBottom: spacing.sm,
    opacity: 0.6,
  },
});
