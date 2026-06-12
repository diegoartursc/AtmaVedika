/**
 * Atma Vedika — ThemeLayerCard
 *
 * Renderiza UMA camada de um tema védico (versão panorâmica).
 * Composição:
 *   ritual → (subtitle) → visual (símbolo OU diamond OU 3D OU progressArc)
 *   → título → corpo curto → (métrica).
 *
 * Cards são apenas leitura — sem CTAs intrusivas. Veda fica na sua tab.
 */

import { useEffect, useMemo } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';

import { ProgressArc } from '@/components/effects/ProgressArc';
import { Text } from '@/components/primitives/Text';
import { NatalChart3DInline } from '@/components/profile/NatalChart3DInline';
import { VedicChartDiamond } from '@/components/profile/VedicChartDiamond';
import { buildDivisionalHouses } from '@/services/divisionalHouses';
import { palette, semantic } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import type { ThemeLayer, ThemeVisual } from '@/mocks/themes';
import type { BirthChart, HouseInfo } from '@/types/chart';

export interface ThemeLayerCardProps {
  layer: ThemeLayer;
  distance: SharedValue<number>;
  accent: string;
  symbol: string;
  /** Mapa natal — necessário para visuais que precisam de dados. */
  chart?: BirthChart;
  /** Casa atualmente selecionada (destaque do diamond). */
  selectedHouseNumber?: number | null;
  /** Callback ao tocar numa casa do diamond védico. */
  onHouseSelect?: (house: HouseInfo) => void;
}

export function ThemeLayerCard({
  layer,
  distance,
  accent,
  symbol,
  chart,
  selectedHouseNumber,
  onHouseSelect,
}: ThemeLayerCardProps) {
  const hasInteractiveVisual =
    layer.visual?.kind === 'vedicChart' || layer.visual?.kind === 'chart3d';

  const contentStyle = useAnimatedStyle(() => {
    const abs = Math.abs(distance.value);
    // Crossfade suave: no cruzamento (abs≈0.5) ambos cards ~0.4 →
    // nunca fica tela escura no meio do arraste. Parallax sutil no Y.
    return {
      opacity: interpolate(abs, [0, 0.5, 1], [1, 0.4, 0]),
      transform: [
        { scale: interpolate(abs, [0, 1], [1, 0.9]) },
        { translateY: interpolate(distance.value, [-1, 0, 1], [40, 0, 40]) },
      ],
    };
  });

  const displaySymbol = layer.symbolOverride ?? symbol;

  // Capa: layout teatral diferente
  if (layer.isCover) {
    return (
      <View style={styles.container}>
        <Animated.View style={[styles.animatedFill, contentStyle]}>
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            bounces={false}
          >
            <Text variant="ritual" color={accent} align="center">
              {layer.ritual}
            </Text>

            <View style={styles.gapLarge} />

            <Text
              style={[
                styles.coverSymbol,
                { color: accent, textShadowColor: accent },
              ]}
            >
              {displaySymbol}
            </Text>

            <View style={styles.gapLarge} />

            <Text variant="hero" color={semantic.textPrimary} align="center">
              {layer.title}
            </Text>

            {layer.body ? (
              <>
                <View style={styles.gapLarge} />
                <View style={styles.coverCaption}>
                  <Text variant="sacred" color={semantic.textTertiary} align="center">
                    {layer.body}
                  </Text>
                </View>
              </>
            ) : null}

            <View style={styles.gapLarge} />

            <SwipeHint accent={accent} />
          </ScrollView>
        </Animated.View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.animatedFill, contentStyle]}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
        <Text variant="ritual" color={accent} align="center">
          {layer.ritual}
        </Text>

        <View style={styles.gap} />

        {/* Visual: símbolo gigante OU widget interativo */}
        <View
          style={hasInteractiveVisual ? styles.interactiveSlot : styles.iconSlot}
        >
          {layer.visual ? (
            <RenderVisual
              visual={layer.visual}
              accent={accent}
              chart={chart}
              selectedHouseNumber={selectedHouseNumber}
              onHouseSelect={onHouseSelect}
            />
          ) : (
            <Text
              style={[
                styles.bigSymbol,
                {
                  color: accent,
                  textShadowColor: accent,
                },
              ]}
            >
              {displaySymbol}
            </Text>
          )}
        </View>

        <View style={styles.gapLarge} />

        <Text variant="display" color={semantic.textPrimary} align="center">
          {layer.title}
        </Text>

        {layer.subtitle ? (
          <>
            <View style={styles.gap} />
            <Text variant="body" color={semantic.textSecondary} align="center">
              {layer.subtitle}
            </Text>
          </>
        ) : null}

        {layer.body ? (
          <>
            <View style={styles.gapLarge} />
            <View style={styles.bodyWrap}>
              <View style={[styles.bodyAccent, { backgroundColor: accent }]} />
              <Text variant="sacred" color={semantic.textTertiary} align="center">
                {layer.body}
              </Text>
            </View>
          </>
        ) : null}

        {layer.metric ? (
          <>
            <View style={styles.gap} />
            <View style={styles.metric}>
              <Text variant="ritual" color={semantic.textTertiary} align="center">
                {layer.metric.label}
              </Text>
              <View style={styles.metricGap} />
              <Text variant="heading" color={accent} align="center">
                {layer.metric.value}
              </Text>
            </View>
          </>
        ) : null}
        </ScrollView>
      </Animated.View>
    </View>
  );
}

// ─── Swipe hint (apenas na capa) ─────────────────────

function SwipeHint({ accent }: { accent: string }) {
  const x = useSharedValue(0);

  useEffect(() => {
    x.value = withRepeat(
      withSequence(
        withTiming(0, { duration: 400 }),
        withTiming(10, { duration: 900, easing: Easing.inOut(Easing.quad) }),
        withTiming(0, { duration: 700 }),
      ),
      -1,
    );
  }, [x]);

  const arrowStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: x.value }],
  }));

  return (
    <View style={styles.swipeHint}>
      <Text variant="ritual" color={accent}>
        arraste pra começar
      </Text>
      <View style={{ width: spacing.sm }} />
      <Animated.Text style={[styles.swipeArrow, { color: accent }, arrowStyle]}>
        →
      </Animated.Text>
    </View>
  );
}

// ─── Visuais ──────────────────────────────────────────

interface RenderVisualProps {
  visual: ThemeVisual;
  accent: string;
  chart?: BirthChart;
  selectedHouseNumber?: number | null;
  onHouseSelect?: (house: HouseInfo) => void;
}

function RenderVisual({
  visual,
  accent,
  chart,
  selectedHouseNumber,
  onHouseSelect,
}: RenderVisualProps) {
  if (visual.kind === 'progressArc') {
    return (
      <ProgressArc
        progress={visual.progress}
        color={accent}
        centerLabel={visual.centerLabel}
        centerCaption={visual.centerCaption}
      />
    );
  }
  if (visual.kind === 'vedicChart') {
    return (
      <VedicChartRenderer
        chartKind={visual.chartKind}
        chart={chart}
        selectedHouseNumber={selectedHouseNumber}
        onHouseSelect={onHouseSelect}
      />
    );
  }
  if (visual.kind === 'chart3d') {
    if (!chart) return null;
    return <NatalChart3DInline chart={chart} />;
  }
  return null;
}

interface VedicChartRendererProps {
  chartKind: 'D1' | 'D9' | 'D10';
  chart?: BirthChart;
  selectedHouseNumber?: number | null;
  onHouseSelect?: (house: HouseInfo) => void;
}

function VedicChartRenderer({
  chartKind,
  chart,
  selectedHouseNumber,
  onHouseSelect,
}: VedicChartRendererProps) {
  const houses = useMemo<HouseInfo[]>(() => {
    if (!chart) return [];
    if (chartKind === 'D1') return chart.houses;
    const divisional =
      chartKind === 'D9' ? chart.divisionals.D9 : chart.divisionals.D10;
    return buildDivisionalHouses(divisional);
  }, [chart, chartKind]);

  if (houses.length === 0) return null;

  return (
    <VedicChartDiamond
      houses={houses}
      size={300}
      selectedHouseNumber={selectedHouseNumber ?? null}
      onHouseSelect={onHouseSelect}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacing.xl,
  },
  animatedFill: {
    flex: 1,
    width: '100%',
  },
  scroll: {
    flex: 1,
    width: '100%',
  },
  scrollContent: {
    flexGrow: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xl,
  },
  iconSlot: {
    minHeight: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  interactiveSlot: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  bigSymbol: {
    fontSize: 96,
    lineHeight: 110,
    opacity: 0.9,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 24,
  },
  coverSymbol: {
    fontSize: 140,
    lineHeight: 160,
    opacity: 0.95,
    textAlign: 'center',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 40,
  },
  coverCaption: {
    paddingHorizontal: spacing.md,
    maxWidth: 360,
  },
  swipeHint: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: 999,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(212,175,55,0.3)',
    backgroundColor: 'rgba(212,175,55,0.06)',
  },
  swipeArrow: {
    fontSize: 18,
    lineHeight: 20,
    textShadowColor: palette.gold.pure,
    textShadowRadius: 10,
    textShadowOffset: { width: 0, height: 0 },
  },
  gap: {
    height: spacing.md,
  },
  gapLarge: {
    height: spacing.xxl,
  },
  bodyWrap: {
    width: '100%',
    maxWidth: 640,
    alignItems: 'center',
    paddingHorizontal: spacing.xs,
  },
  bodyAccent: {
    width: 24,
    height: 1,
    marginBottom: spacing.lg,
    opacity: 0.6,
  },
  metric: {
    alignItems: 'center',
    paddingTop: spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: palette.silver.breath,
    paddingHorizontal: spacing.xl,
  },
  metricGap: {
    height: spacing.xs,
  },
});
