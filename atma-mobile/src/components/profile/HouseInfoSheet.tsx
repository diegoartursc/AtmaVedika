/**
 * Atma Vedika — HouseInfoSheet
 *
 * Bottom sheet glass que aparece quando o usuário toca numa casa
 * do VedicChartDiamond. Mostra: número, bhava, signo, regente,
 * planetas habitantes, aspectos recebidos, CTA pra Veda.
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
import { palette, semantic } from '@/theme/colors';
import { duration } from '@/theme/motion';
import { radii } from '@/theme/radii';
import { spacing } from '@/theme/spacing';
import type { BirthChart, HouseInfo, PlanetName } from '@/types/chart';

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

export interface HouseInfoSheetProps {
  house: HouseInfo | null;
  chart: BirthChart;
  onDismiss: () => void;
}

export function HouseInfoSheet({
  house,
  chart,
  onDismiss,
}: HouseInfoSheetProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const visible = house !== null;
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

  if (!house) return null;

  const incomingAspects = chart.aspects.filter((a) => a.toHouse === house.number);

  const handleAsk = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    const seed = `O que minha ${house.number}ª casa (${house.bhavaName}) revela sobre ${house.significance.split(',')[0]}?`;
    router.push({ pathname: '/(app)/chat', params: { seed } });
  };

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

          {/* Header: número grande + bhava */}
          <View style={styles.titleRow}>
            <Text style={styles.bigNumber}>{house.number}</Text>
            <View style={{ width: spacing.lg }} />
            <View style={{ flex: 1 }}>
              <Text variant="ritual" color={semantic.textGold}>
                {house.bhavaName.toLowerCase()}
              </Text>
              <View style={{ height: spacing.xxs }} />
              <Text variant="display" color={semantic.textPrimary}>
                {house.number}ª casa
              </Text>
            </View>
          </View>

          <View style={{ height: spacing.xl }} />

          {/* Stats: signo + regente */}
          <View style={styles.statsRow}>
            <Stat label="signo" value={SIGN_PT[house.sign] ?? house.sign} />
            <View style={styles.statsDivider} />
            <Stat label="regente" value={PLANET_PT[house.signLord]} />
          </View>

          {/* Planetas habitantes */}
          {house.planetsIn.length > 0 ? (
            <>
              <View style={{ height: spacing.lg }} />
              <View style={styles.planetsBlock}>
                <Text variant="ritual" color={semantic.textTertiary}>
                  planetas nesta casa
                </Text>
                <View style={{ height: spacing.sm }} />
                <View style={styles.planetsRow}>
                  {house.planetsIn.map((p) => (
                    <View key={p} style={styles.planetChip}>
                      <Text style={styles.planetSymbol}>
                        {PLANET_SYMBOL[p]}
                      </Text>
                      <Text variant="bodyEmphasis" color={semantic.textPrimary}>
                        {PLANET_PT[p]}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            </>
          ) : (
            <>
              <View style={{ height: spacing.lg }} />
              <Text variant="sacred" color={semantic.textTertiary} align="left">
                Sem planetas habitando — a leitura vem do regente do signo,{' '}
                {PLANET_PT[house.signLord]}.
              </Text>
            </>
          )}

          {/* Aspectos recebidos */}
          {incomingAspects.length > 0 && (
            <>
              <View style={{ height: spacing.lg }} />
              <View style={styles.aspectsBlock}>
                <Text variant="ritual" color={semantic.textTertiary}>
                  drishti recebidos
                </Text>
                <View style={{ height: spacing.sm }} />
                <Text
                  variant="bodyEmphasis"
                  color={semantic.textPrimary}
                  align="left"
                >
                  Aspectada por:{' '}
                  {incomingAspects.map((a) => PLANET_PT[a.from]).join(' · ')}
                </Text>
              </View>
            </>
          )}

          {/* Significado */}
          <View style={{ height: spacing.lg }} />
          <Text variant="sacred" color={semantic.textTertiary} align="left">
            Esta casa governa <Text variant="sacred" color={semantic.textPrimary}>{house.significance}</Text>.
          </Text>

          <View style={{ height: spacing.xl }} />

          <SacredButton
            label="perguntar pra veda"
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
  bigNumber: {
    fontSize: 72,
    lineHeight: 76,
    color: palette.gold.glow,
    fontFamily: 'PlayfairDisplay_700Bold',
    textShadowColor: palette.gold.pure,
    textShadowRadius: 20,
    textShadowOffset: { width: 0, height: 0 },
    minWidth: 76,
  },
  statsRow: {
    flexDirection: 'row',
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
  planetsBlock: {
    padding: spacing.md,
    borderRadius: radii.base,
    backgroundColor: 'rgba(212,175,55,0.05)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: semantic.border,
  },
  planetsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  planetChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radii.pill,
    backgroundColor: 'rgba(212,175,55,0.06)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: semantic.border,
  },
  planetSymbol: {
    fontSize: 16,
    color: palette.gold.glow,
  },
  aspectsBlock: {
    padding: spacing.md,
    borderRadius: radii.base,
    backgroundColor: 'rgba(124,58,237,0.06)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(124,58,237,0.2)',
  },
});
