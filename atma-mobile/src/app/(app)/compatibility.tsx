/**
 * Atma Vedika — Tela de Compatibilidade
 *
 * Lista de parceiros salvos + opção de adicionar novo + sheets
 * pra adicionar/visualizar resultado.
 *
 * Acessada via Perfil ou rota direta.
 */

import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { AddPartnerSheet } from '@/components/compatibility/AddPartnerSheet';
import { CompatibilitySheet } from '@/components/compatibility/CompatibilitySheet';
import { CosmicBackground } from '@/components/effects/CosmicBackground';
import { PulsingGlow } from '@/components/effects/PulsingGlow';
import { SacredButton } from '@/components/primitives/SacredButton';
import { Text } from '@/components/primitives/Text';
import { TAB_BAR_HEIGHT } from '@/components/navigation/CustomTabBar';
import { mockBirthChart } from '@/mocks/birthChart';
import {
  buildCompatibility,
  type CompatibilityReading,
  type PartnerSeed,
} from '@/services/compatibility';
import {
  useCompatibilityStore,
  type SavedPartner,
} from '@/store/compatibilityStore';
import { useUserStore } from '@/store/userStore';
import { palette, semantic } from '@/theme/colors';
import { radii } from '@/theme/radii';
import { spacing } from '@/theme/spacing';

const BAND_LABEL: Record<CompatibilityReading['band'], string> = {
  rare: 'encontro raro',
  strong: 'forte conexão',
  good: 'compatibilidade saudável',
  challenge: 'desafio que ensina',
};

const BAND_COLOR: Record<CompatibilityReading['band'], string> = {
  rare: '#FFB74D',
  strong: '#10B981',
  good: '#7C3AED',
  challenge: '#F472B6',
};

export default function CompatibilityScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const chart = useUserStore((s) => s.birthChart) ?? mockBirthChart;
  const partners = useCompatibilityStore((s) => s.partners);
  const addPartner = useCompatibilityStore((s) => s.addPartner);
  const removePartner = useCompatibilityStore((s) => s.removePartner);

  const [addOpen, setAddOpen] = useState(false);
  const [selectedReading, setSelectedReading] =
    useState<CompatibilityReading | null>(null);

  const readings = useMemo(
    () => partners.map((p) => ({ partner: p, reading: buildCompatibility(chart, p.chart) })),
    [partners, chart],
  );

  const handleAdd = (seed: PartnerSeed) => {
    const saved = addPartner(seed);
    const reading = buildCompatibility(chart, saved.chart);
    setSelectedReading(reading);
  };

  return (
    <CosmicBackground glowIntensity={0.4} vignettes>
      <PulsingGlow size={420} color={palette.ember.rose} intensity={0.18} top="22%" />

      <SafeAreaView style={styles.safe} edges={['top']}>
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: TAB_BAR_HEIGHT + insets.bottom + spacing.xxxl },
          ]}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <Pressable onPress={() => router.back()} hitSlop={20}>
              <Text variant="ritual" color={semantic.textTertiary}>
                ‹  voltar
              </Text>
            </Pressable>
          </View>

          <View style={{ height: spacing.lg }} />

          <View style={styles.titleBlock}>
            <Text variant="ritual" color={semantic.textGold} align="center">
              ✦  compatibilidade  ✦
            </Text>
            <View style={{ height: spacing.sm }} />
            <Text variant="display" color={semantic.textPrimary} align="center">
              Compare seu céu{'\n'}com o de alguém.
            </Text>
            <View style={{ height: spacing.md }} />
            <Text variant="sacred" color={semantic.textTertiary} align="center">
              vamos cruzar atma, mente, desejo e temperamento.
            </Text>
          </View>

          <View style={{ height: spacing.xxxl }} />

          {/* Lista de parceiros ou empty state */}
          {readings.length === 0 ? (
            <View style={styles.emptyBlock}>
              <Text style={styles.emptySymbol}>♥</Text>
              <View style={{ height: spacing.md }} />
              <Text variant="bodyEmphasis" color={semantic.textPrimary} align="center">
                Nenhuma comparação ainda.
              </Text>
              <View style={{ height: spacing.xs }} />
              <Text variant="caption" color={semantic.textTertiary} align="center">
                adicione a pessoa que você quer entender melhor.
              </Text>
            </View>
          ) : (
            <View style={styles.list}>
              {readings.map(({ partner, reading }) => (
                <PartnerCard
                  key={partner.id}
                  partner={partner}
                  reading={reading}
                  onPress={() => setSelectedReading(reading)}
                  onRemove={() => removePartner(partner.id)}
                />
              ))}
            </View>
          )}

          <View style={{ height: spacing.xxxl }} />

          <SacredButton
            label="+ adicionar pessoa"
            fullWidth
            onPress={() => setAddOpen(true)}
          />
        </ScrollView>
      </SafeAreaView>

      <AddPartnerSheet
        visible={addOpen}
        onAdd={handleAdd}
        onDismiss={() => setAddOpen(false)}
      />

      <CompatibilitySheet
        reading={selectedReading}
        onDismiss={() => setSelectedReading(null)}
      />
    </CosmicBackground>
  );
}

function PartnerCard({
  partner,
  reading,
  onPress,
  onRemove,
}: {
  partner: SavedPartner;
  reading: CompatibilityReading;
  onPress: () => void;
  onRemove: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        { opacity: pressed ? 0.7 : 1 },
      ]}
    >
      <View style={{ flex: 1 }}>
        <Text variant="bodyEmphasis" color={semantic.textPrimary}>
          {partner.seed.name}
        </Text>
        <View style={{ height: 2 }} />
        <Text variant="caption" color={semantic.textTertiary}>
          {partner.seed.birthDate} · {partner.seed.birthPlace}
        </Text>
        <View style={{ height: spacing.xs }} />
        <Text variant="caption" color={BAND_COLOR[reading.band]}>
          {BAND_LABEL[reading.band]}
        </Text>
      </View>

      <View style={styles.cardScore}>
        <Text
          style={[
            styles.cardScoreNumber,
            { color: BAND_COLOR[reading.band] },
          ]}
        >
          {reading.score.total}
        </Text>
        <Pressable
          onPress={onRemove}
          hitSlop={12}
          style={styles.removeBtn}
        >
          <Text style={styles.removeIcon}>×</Text>
        </Pressable>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scrollContent: {
    paddingHorizontal: spacing.xl,
  },
  header: {
    paddingTop: spacing.sm,
  },
  titleBlock: {
    paddingTop: spacing.xl,
    alignItems: 'center',
  },
  emptyBlock: {
    alignItems: 'center',
    paddingVertical: spacing.cosmic,
    paddingHorizontal: spacing.xl,
    borderRadius: radii.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(212,175,55,0.18)',
    backgroundColor: 'rgba(212,175,55,0.04)',
  },
  emptySymbol: {
    fontSize: 56,
    color: 'rgba(244,114,182,0.85)',
    textShadowColor: 'rgba(244,114,182,0.6)',
    textShadowRadius: 22,
    textShadowOffset: { width: 0, height: 0 },
  },
  list: {
    gap: spacing.md,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    borderRadius: radii.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(212,175,55,0.18)',
    backgroundColor: 'rgba(11,8,32,0.6)',
  },
  cardScore: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  cardScoreNumber: {
    fontSize: 32,
    lineHeight: 36,
    fontFamily: 'PlayfairDisplay_700Bold',
  },
  removeBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(244,114,182,0.1)',
  },
  removeIcon: {
    fontSize: 18,
    color: palette.ember.rose,
    lineHeight: 18,
  },
});
