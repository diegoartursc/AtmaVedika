/**
 * Atma Vedika — ThemeIndicator
 *
 * Pontos verticais à direita indicam o TEMA ativo.
 * Pontos horizontais embaixo indicam a CAMADA/PÁGINA dentro do tema.
 *
 * Quando o tema atual tem >5 camadas (ex: 12 casas), os pontos
 * distantes desaparecem e um contador "N / M" aparece abaixo.
 */

import { StyleSheet, View } from 'react-native';
import Animated, {
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  type SharedValue,
} from 'react-native-reanimated';

import { Text } from '@/components/primitives/Text';
import { palette, semantic } from '@/theme/colors';
import { radii } from '@/theme/radii';
import { spacing } from '@/theme/spacing';

export interface ThemeIndicatorProps {
  themeCount: number;
  themeIdx: SharedValue<number>;
  layerCount: number;
  depthIdx: SharedValue<number>;
  /** Posição inteira da camada atual (espelhada do depthIdx no JS). */
  currentLayer: number;
}

const COUNTER_THRESHOLD = 5;

export function ThemeIndicator({
  themeCount,
  themeIdx,
  layerCount,
  depthIdx,
  currentLayer,
}: ThemeIndicatorProps) {
  const showCounter = layerCount > COUNTER_THRESHOLD;
  const displayLayer = Math.min(currentLayer + 1, layerCount);

  return (
    <>
      {/* Coluna de pontos verticais (temas) */}
      <View pointerEvents="none" style={styles.verticalCol}>
        {Array.from({ length: themeCount }, (_, i) => (
          <ThemeDot key={i} index={i} themeIdx={themeIdx} />
        ))}
      </View>

      {/* Linha de pontos horizontais (camadas) */}
      <View pointerEvents="none" style={styles.horizontalBlock}>
        <View style={styles.horizontalRow}>
          {Array.from({ length: layerCount }, (_, i) => (
            <LayerDot
              key={i}
              index={i}
              depthIdx={depthIdx}
              manyLayers={showCounter}
            />
          ))}
        </View>
        {showCounter && (
          <View style={styles.counter}>
            <Text variant="caption" color={semantic.textTertiary}>
              {displayLayer} / {layerCount}
            </Text>
          </View>
        )}
      </View>
    </>
  );
}

function ThemeDot({
  index,
  themeIdx,
}: {
  index: number;
  themeIdx: SharedValue<number>;
}) {
  const style = useAnimatedStyle(() => {
    const dist = Math.abs(themeIdx.value - index);
    return {
      height: interpolate(dist, [0, 1], [22, 4]),
      opacity: interpolate(dist, [0, 1, 2], [1, 0.35, 0.12]),
      backgroundColor: interpolateColor(
        dist,
        [0, 1],
        [palette.gold.glow, palette.silver.soft],
      ),
    };
  });

  return <Animated.View style={[styles.themeDot, style]} />;
}

function LayerDot({
  index,
  depthIdx,
  manyLayers,
}: {
  index: number;
  depthIdx: SharedValue<number>;
  manyLayers: boolean;
}) {
  const style = useAnimatedStyle(() => {
    const dist = Math.abs(depthIdx.value - index);
    if (manyLayers) {
      // Janela deslizante: ativo + 3 vizinhos de cada lado, demais somem.
      return {
        width: interpolate(dist, [0, 1, 3, 4], [22, 6, 4, 0]),
        opacity: interpolate(dist, [0, 1, 3, 4], [1, 0.5, 0.15, 0]),
        backgroundColor: interpolateColor(
          dist,
          [0, 1],
          [palette.gold.glow, palette.silver.soft],
        ),
        marginHorizontal: interpolate(dist, [0, 3, 4], [3, 2, 0]),
      };
    }
    return {
      width: interpolate(dist, [0, 1], [22, 4]),
      opacity: interpolate(dist, [0, 1], [1, 0.35]),
      backgroundColor: interpolateColor(
        dist,
        [0, 1],
        [palette.gold.glow, palette.silver.soft],
      ),
    };
  });

  return <Animated.View style={[styles.layerDot, style]} />;
}

const styles = StyleSheet.create({
  verticalCol: {
    position: 'absolute',
    right: spacing.md,
    top: '36%',
    gap: spacing.xs,
    alignItems: 'center',
    zIndex: 50,
  },
  themeDot: {
    width: 4,
    borderRadius: radii.pill,
  },
  horizontalBlock: {
    position: 'absolute',
    bottom: spacing.sm,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 50,
  },
  horizontalRow: {
    flexDirection: 'row',
    gap: spacing.xs,
    alignItems: 'center',
    justifyContent: 'center',
  },
  layerDot: {
    height: 4,
    borderRadius: radii.pill,
  },
  counter: {
    marginTop: spacing.sm,
  },
});
