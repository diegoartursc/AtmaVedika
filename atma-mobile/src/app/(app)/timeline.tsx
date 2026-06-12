/**
 * Atma Vedika — Tab Ciclos
 *
 * Timeline horizontal da Vimshottari Dasha.
 * Cada mahadasha period vira um card com nome do planeta, anos,
 * datas. Período atual é destacado com glow dourado.
 */

import { useEffect, useRef, useState } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { CosmicBackground } from '@/components/effects/CosmicBackground';
import { PulsingGlow } from '@/components/effects/PulsingGlow';
import { Text } from '@/components/primitives/Text';
import { TAB_BAR_HEIGHT } from '@/components/navigation/CustomTabBar';
import {
  PeriodInfoSheet,
  type PeriodSheetData,
} from '@/components/profile/PeriodInfoSheet';
import { InfoSheet } from '@/components/settings/InfoSheet';
import { mockBirthChart } from '@/mocks/birthChart';
import { useUserStore } from '@/store/userStore';
import { palette, semantic } from '@/theme/colors';
import { radii } from '@/theme/radii';
import { spacing } from '@/theme/spacing';
import type { DashaPeriod, PlanetName } from '@/types/chart';

const VIMSHOTTARI_INFO = `O que é a Vimshottari Dasha?

A Vimshottari é o sistema de previsão temporal mais usado na astrologia védica. Ela divide a vida em 9 períodos planetários consecutivos — cada um regido por um planeta diferente. Você nasce já dentro de um deles e atravessa os outros conforme o tempo passa.

Por que 9 períodos?

Porque são 9 grahas no Jyotish — os 7 visíveis (Sol, Lua, Marte, Mercúrio, Júpiter, Vênus, Saturno) mais Rahu e Ketu (os dois pontos lunares). Cada um carrega uma vibração específica, e a Vimshottari dá a cada um seu turno de governar sua vida.

Por que durações diferentes?

Cada planeta tem um número fixo de anos atribuído pela tradição (Brihat Parashara Hora Shastra). Esses números somam 120 anos no total:

· Ketu — 7 anos
· Vênus — 20 anos
· Sol — 6 anos
· Lua — 10 anos
· Marte — 7 anos
· Rahu — 18 anos
· Júpiter — 16 anos
· Saturno — 19 anos
· Mercúrio — 17 anos

Os planetas mais lentos no céu (Saturno, Rahu, Júpiter) ganham períodos maiores. Os mais rápidos (Sol, Marte) ganham períodos menores. Isso reflete o ritmo natural de cada um.

Como isso afeta sua vida?

Cada Mahadasha pinta uma fase inteira. Quando você está no Mahadasha de Vênus, por exemplo, o que rege são prazer, vínculos, beleza, dinheiro fácil. Quando muda pra Sol, vira identidade, autoridade, foco no que é seu.

A virada entre uma Mahadasha e outra pode ser sentida como uma reorientação interna profunda — meses antes da data oficial, algo já começa a mudar.

Onde começa a sua?

A Vimshottari não começa em todos do zero. Depende do nakshatra (constelação) onde sua Lua estava no nascimento. Cada nakshatra é regido por um planeta, e esse planeta dita o ciclo inicial — você nasce já com parte dele consumida.

Como ler na prática

Olhe primeiro pra qual planeta rege seu ciclo atual. Depois pense: o que esse planeta significa pra mim? A vida dos últimos anos foi sobre isso. A virada pro próximo planeta vai trazer um novo capítulo — que tipo de mudança ele anuncia?`;

const PLANET_PT: Record<PlanetName, string> = {
  Sun: 'Sol',
  Moon: 'Lua',
  Mars: 'Marte',
  Mercury: 'Mercúrio',
  Jupiter: 'Júpiter',
  Venus: 'Vênus',
  Saturn: 'Saturno',
  Rahu: 'Rahu',
  Ketu: 'Ketu',
};

const PLANET_SYMBOL: Record<PlanetName, string> = {
  Sun: '☉',
  Moon: '☽',
  Mars: '♂',
  Mercury: '☿',
  Jupiter: '♃',
  Venus: '♀',
  Saturn: '♄',
  Rahu: '☊',
  Ketu: '☋',
};

const PLANET_COLOR: Record<PlanetName, string> = {
  Sun: '#FFB74D',
  Moon: '#E8E6DD',
  Mars: '#EF4444',
  Mercury: '#10B981',
  Jupiter: '#F59E0B',
  Venus: '#EC4899',
  Saturn: '#3B82F6',
  Rahu: '#6366F1',
  Ketu: '#8B5CF6',
};

const CARD_WIDTH = 180;
const CARD_GAP = 12;

export default function TimelineScreen() {
  const chart = useUserStore((s) => s.birthChart) ?? mockBirthChart;
  const insets = useSafeAreaInsets();
  const listRef = useRef<FlatList<DashaPeriod>>(null);
  const [selected, setSelected] = useState<PeriodSheetData | null>(null);
  const [infoVisible, setInfoVisible] = useState(false);

  const dasha = chart.vimshottariDasha;
  const periods = dasha.periods;
  const currentIdx = periods.findIndex(
    (p) => p.planet === dasha.currentMahadasha,
  );

  const handleSelect = (period: DashaPeriod, index: number) => {
    Haptics.selectionAsync().catch(() => {});
    const state: PeriodSheetData['state'] =
      index === currentIdx
        ? 'current'
        : index < currentIdx
          ? 'past'
          : 'future';
    setSelected({ period, state });
  };

  useEffect(() => {
    if (currentIdx < 0) return;
    const t = setTimeout(() => {
      listRef.current?.scrollToIndex({
        index: currentIdx,
        animated: true,
        viewPosition: 0.1,
      });
    }, 400);
    return () => clearTimeout(t);
  }, [currentIdx]);

  const pct = Math.round(dasha.mahadashaProgress * 100);
  const current = periods[currentIdx];

  return (
    <CosmicBackground glowIntensity={0.4} vignettes>
      <PulsingGlow size={400} color={palette.astral.saturn} intensity={0.18} top="32%" />

      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.header}>
          <View style={styles.headerTopRow}>
            <Text variant="ritual" color={semantic.textGold}>
              vimshottari
            </Text>
            <Pressable
              onPress={() => {
                Haptics.selectionAsync().catch(() => {});
                setInfoVisible(true);
              }}
              style={({ pressed }) => [
                styles.infoBtn,
                pressed && styles.infoBtnPressed,
              ]}
              accessibilityRole="button"
              accessibilityLabel="o que é vimshottari"
            >
              <Text style={styles.infoIcon}>i</Text>
            </Pressable>
          </View>
          <View style={{ height: spacing.sm }} />
          <Text variant="display" color={semantic.textPrimary}>
            Seus ciclos.
          </Text>
          <View style={{ height: spacing.xs }} />
          <Text variant="body" color={semantic.textTertiary}>
            os 9 períodos planetários que pintam sua vida.
          </Text>
        </View>

        {current ? (
          <View style={styles.currentBlock}>
            <Text variant="ritual" color={semantic.textTertiary}>
              período atual
            </Text>
            <View style={{ height: spacing.sm }} />
            <View style={styles.currentRow}>
              <Text
                style={[
                  styles.currentSymbol,
                  {
                    color: PLANET_COLOR[current.planet],
                    textShadowColor: PLANET_COLOR[current.planet],
                  },
                ]}
              >
                {PLANET_SYMBOL[current.planet]}
              </Text>
              <View style={{ width: spacing.lg }} />
              <View style={{ flex: 1 }}>
                <Text variant="heading" color={semantic.textPrimary}>
                  Mahadasha de {PLANET_PT[current.planet]}
                </Text>
                <View style={{ height: spacing.xxs }} />
                <Text variant="caption" color={semantic.textTertiary}>
                  {formatRange(current)} · {current.years} anos
                </Text>
              </View>
            </View>

            <View style={{ height: spacing.md }} />
            <View style={styles.progressTrack}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${pct}%` },
                ]}
              />
            </View>
            <View style={{ height: spacing.xs }} />
            <Text variant="caption" color={semantic.textTertiary}>
              {pct}% concluído
            </Text>
          </View>
        ) : null}

        <View style={styles.timelineBlock}>
          <Text variant="ritual" color={semantic.textTertiary} style={styles.timelineLabel}>
            linha do tempo
          </Text>
          <FlatList
            ref={listRef}
            data={periods}
            keyExtractor={(p) => p.planet + p.startDate}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.timelineList}
            ItemSeparatorComponent={() => <View style={{ width: CARD_GAP }} />}
            getItemLayout={(_, index) => ({
              length: CARD_WIDTH + CARD_GAP,
              offset: (CARD_WIDTH + CARD_GAP) * index,
              index,
            })}
            renderItem={({ item, index }) => (
              <PeriodCard
                period={item}
                state={
                  index === currentIdx
                    ? 'current'
                    : index < currentIdx
                      ? 'past'
                      : 'future'
                }
                onPress={() => handleSelect(item, index)}
              />
            )}
          />
        </View>

        <View
          style={[
            styles.footer,
            { paddingBottom: TAB_BAR_HEIGHT + insets.bottom + spacing.lg },
          ]}
        >
          <View style={styles.divider} />
          <Text variant="caption" color={semantic.textTertiary} align="center">
            toque num ciclo pra entender o que ele carrega
          </Text>
        </View>
      </SafeAreaView>

      <PeriodInfoSheet
        data={selected}
        onDismiss={() => setSelected(null)}
      />

      <InfoSheet
        visible={infoVisible}
        title="o que é vimshottari?"
        body={VIMSHOTTARI_INFO}
        onDismiss={() => setInfoVisible(false)}
      />
    </CosmicBackground>
  );
}

interface PeriodCardProps {
  period: DashaPeriod;
  state: 'past' | 'current' | 'future';
  onPress: () => void;
}

function PeriodCard({ period, state, onPress }: PeriodCardProps) {
  const color = PLANET_COLOR[period.planet];
  const symbol = PLANET_SYMBOL[period.planet];
  const name = PLANET_PT[period.planet];

  const opacity = state === 'past' ? 0.55 : state === 'future' ? 0.85 : 1;
  const isCurrent = state === 'current';

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        { opacity: pressed ? opacity * 0.7 : opacity },
        isCurrent && styles.cardCurrent,
      ]}
    >
      {isCurrent ? (
        <View
          pointerEvents="none"
          style={[
            styles.cardGlow,
            { borderColor: color, shadowColor: color },
          ]}
        />
      ) : null}
      <Text
        style={[
          styles.cardSymbol,
          { color, textShadowColor: color },
          isCurrent && styles.cardSymbolCurrent,
        ]}
      >
        {symbol}
      </Text>
      <View style={{ height: spacing.xs }} />
      <Text variant="heading" color={semantic.textPrimary} align="center">
        {name}
      </Text>
      <View style={{ height: spacing.xxs }} />
      <Text variant="caption" color={semantic.textTertiary} align="center">
        {period.years} anos
      </Text>
      <View style={{ height: spacing.sm }} />
      <Text variant="ritual" color={semantic.textTertiary} align="center">
        {yearOf(period.startDate)} → {yearOf(period.endDate)}
      </Text>
    </Pressable>
  );
}

function formatRange(p: DashaPeriod): string {
  return `${yearOf(p.startDate)} – ${yearOf(p.endDate)}`;
}

function yearOf(iso: string): string {
  return iso.split('-')[0];
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  infoBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(212,175,55,0.4)',
    backgroundColor: 'rgba(212,175,55,0.05)',
  },
  infoBtnPressed: {
    backgroundColor: 'rgba(212,175,55,0.18)',
  },
  infoIcon: {
    fontSize: 13,
    lineHeight: 14,
    color: palette.gold.glow,
    fontStyle: 'italic',
    fontWeight: '600',
  },
  currentBlock: {
    marginHorizontal: spacing.xl,
    marginTop: spacing.xl,
    padding: spacing.lg,
    borderRadius: radii.lg,
    backgroundColor: 'rgba(212,175,55,0.06)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(212,175,55,0.22)',
  },
  currentRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currentSymbol: {
    fontSize: 44,
    lineHeight: 48,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 14,
  },
  progressTrack: {
    height: 4,
    backgroundColor: palette.silver.breath,
    borderRadius: 999,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: palette.gold.glow,
    borderRadius: 999,
  },
  timelineBlock: {
    marginTop: spacing.xxxl,
  },
  timelineLabel: {
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.md,
  },
  timelineList: {
    paddingHorizontal: spacing.xl,
  },
  card: {
    width: CARD_WIDTH,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.md,
    borderRadius: radii.lg,
    backgroundColor: 'rgba(11,8,32,0.6)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(212,175,55,0.16)',
    alignItems: 'center',
  },
  cardCurrent: {
    backgroundColor: 'rgba(212,175,55,0.08)',
    borderColor: 'rgba(232,196,103,0.5)',
  },
  cardGlow: {
    position: 'absolute',
    top: -4,
    left: -4,
    right: -4,
    bottom: -4,
    borderRadius: radii.lg + 4,
    borderWidth: 1,
    shadowOpacity: 0.6,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 0 },
  },
  cardSymbol: {
    fontSize: 36,
    lineHeight: 40,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  cardSymbolCurrent: {
    textShadowRadius: 22,
  },
  footer: {
    marginTop: 'auto',
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
