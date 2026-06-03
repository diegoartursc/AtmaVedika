/**
 * Atma Vedika — PeriodInfoSheet
 *
 * Bottom sheet glass com detalhes de um período Mahadasha.
 * Aparece ao tocar num card da timeline (Ciclos).
 */

import { useEffect } from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';
import { BlurView } from 'expo-blur';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Text } from '@/components/primitives/Text';
import { palette, semantic } from '@/theme/colors';
import { duration } from '@/theme/motion';
import { radii } from '@/theme/radii';
import { spacing } from '@/theme/spacing';
import type { DashaPeriod, PlanetName } from '@/types/chart';

export type PeriodState = 'past' | 'current' | 'future';

export interface PeriodSheetData {
  period: DashaPeriod;
  state: PeriodState;
}

export interface PeriodInfoSheetProps {
  data: PeriodSheetData | null;
  onDismiss: () => void;
}

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

const PLANET_TAGLINE: Record<PlanetName, string> = {
  Sun: 'fase de autoridade, identidade pública, ego em construção.',
  Moon: 'fase emocional, da maternidade, do cuidado e da intuição.',
  Mars: 'fase de ação, conflito, esporte, ambição direta.',
  Mercury: 'fase mental — estudos, comunicação, escrita, análise.',
  Jupiter: 'fase de expansão, fé, mestres, conhecimento que cresce.',
  Venus: 'fase do prazer, da estética, dos vínculos, do dinheiro.',
  Saturn: 'fase de prova, responsabilidade, trabalho duro, maturação.',
  Rahu: 'fase de obsessão, ascensão social, fome inexplicável.',
  Ketu: 'fase de desapego, perda, espiritualidade silenciosa.',
};

const PLANET_NARRATIVE_BY_STATE: Record<
  PeriodState,
  (planet: PlanetName) => string
> = {
  past: (planet) =>
    `${PLANET_PT[planet]} já passou pela sua vida. As marcas ficam — boas e ruins. O que você é hoje carrega o que ${PLANET_PT[planet]} te ensinou.`,
  current: (planet) =>
    `Você está no Mahadasha de ${PLANET_PT[planet]}. Os últimos anos foram sobre isso, mesmo que você não tenha visto o nome. Tudo que acontece agora carrega esse tom.`,
  future: (planet) =>
    `${PLANET_PT[planet]} vai chegar. É bom saber antes — você pode se preparar pra fase que se aproxima.`,
};

export function PeriodInfoSheet({ data, onDismiss }: PeriodInfoSheetProps) {
  const insets = useSafeAreaInsets();
  const visible = data !== null;
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(80);

  useEffect(() => {
    opacity.value = withTiming(visible ? 1 : 0, {
      duration: duration.smooth,
      easing: Easing.bezier(0.16, 1, 0.3, 1),
    });
    translateY.value = withTiming(visible ? 0 : 80, {
      duration: duration.smooth,
      easing: Easing.bezier(0.16, 1, 0.3, 1),
    });
  }, [visible, opacity, translateY]);

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: opacity.value * 0.45,
  }));
  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  if (!data) return null;

  const { period, state } = data;
  const color = PLANET_COLOR[period.planet];
  const symbol = PLANET_SYMBOL[period.planet];
  const name = PLANET_PT[period.planet];

  return (
    <View pointerEvents="box-none" style={styles.fill}>
      <Animated.View
        style={[styles.backdrop, backdropStyle]}
        pointerEvents={visible ? 'auto' : 'none'}
      >
        <Pressable style={styles.fill} onPress={onDismiss} />
      </Animated.View>

      <Animated.View
        style={[styles.sheet, sheetStyle]}
        pointerEvents={visible ? 'auto' : 'none'}
      >
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

        <View
          style={[
            styles.content,
            { paddingBottom: insets.bottom + spacing.lg },
          ]}
        >
          <View style={styles.handle} />

          <View style={{ height: spacing.lg }} />

          <View style={styles.titleRow}>
            <Text
              style={[
                styles.bigSymbol,
                { color, textShadowColor: color },
              ]}
            >
              {symbol}
            </Text>
            <View style={{ width: spacing.lg }} />
            <View style={{ flex: 1 }}>
              <Text variant="ritual" color={semantic.textGold}>
                {stateLabel(state)}
              </Text>
              <View style={{ height: spacing.xxs }} />
              <Text variant="display" color={semantic.textPrimary}>
                Mahadasha{'\n'}de {name}
              </Text>
            </View>
          </View>

          <View style={{ height: spacing.xl }} />

          <View style={styles.statsRow}>
            <Stat label="duração" value={`${period.years} anos`} />
            <View style={styles.statsDivider} />
            <Stat label="início" value={formatDate(period.startDate)} />
            <View style={styles.statsDivider} />
            <Stat label="fim" value={formatDate(period.endDate)} />
          </View>

          <View style={{ height: spacing.lg }} />

          <View style={styles.taglineBlock}>
            <Text variant="ritual" color={semantic.textTertiary}>
              o que esse ciclo carrega
            </Text>
            <View style={{ height: spacing.sm }} />
            <Text variant="bodyEmphasis" color={semantic.textPrimary}>
              {PLANET_TAGLINE[period.planet]}
            </Text>
          </View>

          <View style={{ height: spacing.lg }} />

          <Text variant="sacred" color={semantic.textTertiary} align="left">
            {PLANET_NARRATIVE_BY_STATE[state](period.planet)}
          </Text>
        </View>
      </Animated.View>
    </View>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.stat}>
      <Text variant="ritual" color={semantic.textTertiary} align="center">
        {label}
      </Text>
      <View style={{ height: spacing.xs }} />
      <Text variant="bodyEmphasis" color={semantic.textPrimary} align="center">
        {value}
      </Text>
    </View>
  );
}

function stateLabel(s: PeriodState): string {
  switch (s) {
    case 'past':
      return 'já passou';
    case 'current':
      return 'em andamento';
    case 'future':
      return 'ainda vem';
  }
}

function formatDate(iso: string): string {
  const [y, m] = iso.split('-');
  return `${m}/${y}`;
}

const styles = StyleSheet.create({
  fill: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(2,1,8,1)',
    zIndex: 90,
  },
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    borderTopLeftRadius: radii.xl,
    borderTopRightRadius: radii.xl,
    overflow: 'hidden',
    zIndex: 100,
    shadowColor: '#000',
    shadowOpacity: 0.55,
    shadowRadius: 26,
    shadowOffset: { width: 0, height: -16 },
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
    paddingTop: spacing.sm,
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 3,
    borderRadius: 999,
    backgroundColor: 'rgba(245,244,240,0.3)',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bigSymbol: {
    fontSize: 64,
    lineHeight: 70,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
    minWidth: 70,
    textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: radii.lg,
    backgroundColor: 'rgba(212,175,55,0.05)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(212,175,55,0.18)',
  },
  stat: {
    flex: 1,
  },
  statsDivider: {
    width: StyleSheet.hairlineWidth,
    backgroundColor: palette.silver.breath,
    marginHorizontal: spacing.sm,
  },
  taglineBlock: {
    padding: spacing.md,
    borderRadius: radii.base,
    backgroundColor: 'rgba(124,58,237,0.06)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(124,58,237,0.2)',
  },
});
