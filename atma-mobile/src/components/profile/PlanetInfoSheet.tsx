/**
 * Atma Vedika — PlanetInfoSheet
 *
 * Bottom sheet glass que aparece quando o usuário toca num planeta da cena 3D.
 * Mostra dados do planeta no mapa + atalho "perguntar pra Veda".
 */

import { useEffect } from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Text } from '@/components/primitives/Text';
import { SacredButton } from '@/components/primitives/SacredButton';
import { PLANET_ARCHETYPES } from '@/services/vedic-knowledge';
import { palette, semantic } from '@/theme/colors';
import { duration } from '@/theme/motion';
import { radii } from '@/theme/radii';
import { spacing } from '@/theme/spacing';
import type { PlanetPlacement } from '@/services/natalChart3d';
import type { BirthChart } from '@/types/chart';

export interface PlanetInfoSheetProps {
  planet: PlanetPlacement | null;
  chart: BirthChart;
  onDismiss: () => void;
}

export function PlanetInfoSheet({
  planet,
  chart,
  onDismiss,
}: PlanetInfoSheetProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const visible = planet !== null;
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
    opacity: opacity.value * 0.4,
  }));

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  if (!planet) return null;

  const aspects = chart.aspects.filter((a) => a.from === planet.name);
  const house = chart.houses[planet.house - 1];

  const handleAsk = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    const seed = `O que ${planet.visual.ptName} em ${signPt(planet.sign)} casa ${planet.house} significa pra mim?`;
    router.push({ pathname: '/(app)/chat', params: { seed } });
  };

  return (
    <View pointerEvents="box-none" style={styles.fill}>
      <Animated.View style={[styles.backdrop, backdropStyle]} pointerEvents={visible ? 'auto' : 'none'}>
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

        <View style={[styles.content, { paddingBottom: insets.bottom + spacing.lg }]}>
          <View style={styles.handle} />

          <View style={{ height: spacing.lg }} />

          <View style={styles.titleRow}>
            <Text
              style={[styles.bigSymbol, { color: planet.visual.color, textShadowColor: planet.visual.emissive }]}
            >
              {planet.visual.symbol}
            </Text>
            <View style={{ width: spacing.lg }} />
            <View style={{ flex: 1 }}>
              <Text variant="ritual" color={semantic.textGold}>
                {planet.retrograde ? 'retrógrado' : 'direto'}
              </Text>
              <View style={{ height: spacing.xxs }} />
              <Text variant="display" color={semantic.textPrimary}>
                {planet.visual.ptName}
              </Text>
            </View>
          </View>

          <View style={{ height: spacing.xl }} />

          <View style={styles.statsRow}>
            <Stat label="signo" value={signPt(planet.sign)} />
            <View style={styles.statsDivider} />
            <Stat label="grau" value={`${planet.degree.toFixed(1)}°`} />
            <View style={styles.statsDivider} />
            <Stat label="casa" value={`${planet.house}ª`} />
          </View>

          {house && (
            <>
              <View style={{ height: spacing.lg }} />
              <Text
                variant="sacred"
                color={semantic.textTertiary}
                align="left"
              >
                Na <Text variant="sacred" color={semantic.textPrimary}>{house.bhavaName}</Text> — {house.significance}.
              </Text>
            </>
          )}

          <View style={{ height: spacing.lg }} />
          <View style={styles.archetypeBlock}>
            <Text variant="ritual" color={semantic.textTertiary}>
              arquétipo · compêndio védico
            </Text>
            <View style={{ height: spacing.sm }} />
            <Text variant="bodyEmphasis" color={planet.visual.color} align="left">
              {PLANET_ARCHETYPES[planet.name].keyword}
            </Text>
            <View style={{ height: spacing.xs }} />
            <Text variant="caption" color={semantic.textSecondary} align="left">
              {PLANET_ARCHETYPES[planet.name].governs}
            </Text>
            <View style={{ height: spacing.sm }} />
            <Text variant="caption" color={semantic.textTertiary} align="left">
              Sombra: {PLANET_ARCHETYPES[planet.name].shadow}
            </Text>
          </View>

          {aspects.length > 0 && (
            <>
              <View style={{ height: spacing.lg }} />
              <View style={styles.aspectsBlock}>
                <Text variant="ritual" color={semantic.textTertiary}>
                  aspectos · drishti
                </Text>
                <View style={{ height: spacing.sm }} />
                <Text
                  variant="bodyEmphasis"
                  color={semantic.textPrimary}
                  align="left"
                >
                  {planet.visual.ptName} aspecta:{' '}
                  {aspects.map((a) => `${ordinal(a.toHouse)} casa`).join(' · ')}
                </Text>
              </View>
            </>
          )}

          <View style={{ height: spacing.xl }} />

          <SacredButton
            label={`perguntar sobre ${planet.visual.ptName.toLowerCase()}`}
            fullWidth
            onPress={handleAsk}
          />
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
      <Text variant="heading" color={semantic.textPrimary} align="center">
        {value}
      </Text>
    </View>
  );
}

const SIGN_PT: Record<string, string> = {
  Aries: 'Áries',
  Taurus: 'Touro',
  Gemini: 'Gêmeos',
  Cancer: 'Câncer',
  Leo: 'Leão',
  Virgo: 'Virgem',
  Libra: 'Libra',
  Scorpio: 'Escorpião',
  Sagittarius: 'Sagitário',
  Capricorn: 'Capricórnio',
  Aquarius: 'Aquário',
  Pisces: 'Peixes',
};

function signPt(sign: string): string {
  return SIGN_PT[sign] ?? sign;
}

function ordinal(n: number): string {
  return `${n}ª`;
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
    alignItems: 'stretch',
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
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
    paddingVertical: spacing.md,
  },
  stat: {
    flex: 1,
  },
  statsDivider: {
    width: StyleSheet.hairlineWidth,
    backgroundColor: palette.silver.breath,
    marginHorizontal: spacing.md,
  },
  aspectsBlock: {
    padding: spacing.md,
    borderRadius: radii.base,
    backgroundColor: 'rgba(212,175,55,0.05)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: semantic.border,
  },
  archetypeBlock: {
    padding: spacing.md,
    borderRadius: radii.base,
    backgroundColor: 'rgba(245,244,240,0.03)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(245,244,240,0.08)',
  },
});
