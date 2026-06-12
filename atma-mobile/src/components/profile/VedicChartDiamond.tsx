/**
 * Atma Vedika — VedicChartDiamond
 *
 * Mapa védico clássico (North Indian) em formato de losango/diamante.
 * 12 cells SVG navegáveis. Cada casa mostra signo + planetas.
 *
 * Layout:
 *   - Quadrado externo
 *   - 2 diagonais (TL→BR, TR→BL) cruzando no centro
 *   - 4 arestas do diamante interno (conectando midpoints dos lados)
 *   - 12 polígonos resultantes (4 casas kendra centrais + 8 triângulos cantos)
 *
 * Casa 1 (ascendente) sempre no topo central.
 */

import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Line, Polygon, Text as SvgText } from 'react-native-svg';

import { palette, semantic } from '@/theme/colors';
import { duration } from '@/theme/motion';
import type { HouseInfo, PlanetName } from '@/types/chart';

const AnimatedSvgText = Animated.createAnimatedComponent(SvgText);

// ─── Geometria dos 12 polígonos (coords 0..100) ─────────

interface HousePolygon {
  number: number;
  points: string;
  /** Centróide aproximado [x, y] para posicionar o texto. */
  centroid: [number, number];
  /** Posição relativa do label do signo (T = top, M = mid, etc.). */
  signLabelAt: [number, number];
}

const HOUSE_POLYGONS: HousePolygon[] = [
  // Casa 1 — topo central (kendra)
  { number: 1, points: '50,0 75,25 50,50 25,25', centroid: [50, 25], signLabelAt: [50, 7] },
  // Casa 2 — topo esquerdo (triângulo canto)
  { number: 2, points: '0,0 50,0 25,25', centroid: [27, 12], signLabelAt: [12, 6] },
  // Casa 3 — esquerda superior
  { number: 3, points: '0,0 25,25 0,50', centroid: [12, 27], signLabelAt: [6, 12] },
  // Casa 4 — esquerda central (kendra)
  { number: 4, points: '0,50 25,25 50,50 25,75', centroid: [25, 50], signLabelAt: [7, 50] },
  // Casa 5 — esquerda inferior
  { number: 5, points: '0,50 25,75 0,100', centroid: [12, 73], signLabelAt: [6, 88] },
  // Casa 6 — base esquerda
  { number: 6, points: '0,100 25,75 50,100', centroid: [27, 88], signLabelAt: [12, 94] },
  // Casa 7 — base central (kendra)
  { number: 7, points: '50,100 25,75 50,50 75,75', centroid: [50, 75], signLabelAt: [50, 93] },
  // Casa 8 — base direita
  { number: 8, points: '50,100 75,75 100,100', centroid: [73, 88], signLabelAt: [88, 94] },
  // Casa 9 — direita inferior
  { number: 9, points: '100,100 75,75 100,50', centroid: [88, 73], signLabelAt: [94, 88] },
  // Casa 10 — direita central (kendra)
  { number: 10, points: '100,50 75,75 50,50 75,25', centroid: [75, 50], signLabelAt: [93, 50] },
  // Casa 11 — direita superior
  { number: 11, points: '100,50 75,25 100,0', centroid: [88, 27], signLabelAt: [94, 12] },
  // Casa 12 — topo direito
  { number: 12, points: '100,0 75,25 50,0', centroid: [73, 12], signLabelAt: [88, 6] },
];

const SIGN_ABBR: Record<string, string> = {
  Aries: 'Ári',
  Taurus: 'Tou',
  Gemini: 'Gêm',
  Cancer: 'Cân',
  Leo: 'Leo',
  Virgo: 'Vir',
  Libra: 'Lib',
  Scorpio: 'Esc',
  Sagittarius: 'Sag',
  Capricorn: 'Cap',
  Aquarius: 'Aqu',
  Pisces: 'Pei',
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

// ─── Componente principal ────────────────────────────────

export interface VedicChartDiamondProps {
  houses: HouseInfo[];
  /** Tamanho do lado do quadrado em pixels. */
  size?: number;
  /** Casa atualmente selecionada (para destaque). */
  selectedHouseNumber?: number | null;
  /** Callback ao tocar numa casa. */
  onHouseSelect?: (house: HouseInfo) => void;
}

export function VedicChartDiamond({
  houses,
  size = 300,
  selectedHouseNumber,
  onHouseSelect,
}: VedicChartDiamondProps) {
  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size} viewBox="0 0 100 100">
        {/* Polígonos (clicáveis, com fill) */}
        {HOUSE_POLYGONS.map((hp) => (
          <Polygon
            key={`fill-${hp.number}`}
            points={hp.points}
            fill={
              selectedHouseNumber === hp.number
                ? 'rgba(232, 196, 103, 0.22)'
                : 'rgba(212, 175, 55, 0.04)'
            }
            stroke="rgba(212, 175, 55, 0.55)"
            strokeWidth={0.35}
            strokeLinejoin="round"
            onPress={() => {
              const house = houses[hp.number - 1];
              if (house) onHouseSelect?.(house);
            }}
          />
        ))}

        {/* Reforço visual da borda externa */}
        <Polygon
          points="0,0 100,0 100,100 0,100"
          fill="none"
          stroke="rgba(212, 175, 55, 0.7)"
          strokeWidth={0.5}
        />

        {/* Reforço visual do diamante interno */}
        <Polygon
          points="50,0 100,50 50,100 0,50"
          fill="none"
          stroke="rgba(212, 175, 55, 0.5)"
          strokeWidth={0.35}
        />

        {/* Sutil indicador no ponto central */}
        <Line x1="49" y1="50" x2="51" y2="50" stroke={palette.gold.glow} strokeWidth={0.4} strokeLinecap="round" />

        {/* Conteúdo de cada casa: número + signo + planetas */}
        {HOUSE_POLYGONS.map((hp) => {
          const house = houses[hp.number - 1];
          if (!house) return null;
          const isSelected = selectedHouseNumber === hp.number;
          return (
            <HouseLabel
              key={`label-${hp.number}`}
              polygon={hp}
              house={house}
              isSelected={isSelected}
            />
          );
        })}
      </Svg>

      <SelectedRing visible={selectedHouseNumber !== null && selectedHouseNumber !== undefined} />
    </View>
  );
}

// ─── Texto dentro de uma casa ──────────────────────────

interface HouseLabelProps {
  polygon: HousePolygon;
  house: HouseInfo;
  isSelected: boolean;
}

function HouseLabel({ polygon, house, isSelected }: HouseLabelProps) {
  const planets = house.planetsIn;
  const signAbbr = SIGN_ABBR[house.sign] ?? house.sign.slice(0, 3);

  // Posição dos planetas: linhas curtas centradas no centróide
  const cx = polygon.centroid[0];
  const cy = polygon.centroid[1];
  const planetCount = planets.length;
  const symbolSize = 4.5;
  const lineHeight = 5;

  // Pulso sutil nos planetas — onda passa pelas casas (delay por número da casa)
  const pulse = useSharedValue(0.7);
  useEffect(() => {
    if (planetCount === 0) return;
    pulse.value = withDelay(
      polygon.number * 200,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 1600, easing: Easing.inOut(Easing.sin) }),
          withTiming(0.7, { duration: 1600, easing: Easing.inOut(Easing.sin) }),
        ),
        -1,
      ),
    );
  }, [planetCount, polygon.number, pulse]);

  const planetAnimatedProps = useAnimatedProps(() => ({
    opacity: pulse.value,
  }));

  return (
    <>
      {/* Número da casa (canto opcional) */}
      <SvgText
        x={polygon.signLabelAt[0]}
        y={polygon.signLabelAt[1]}
        fontSize="2.4"
        fill={semantic.textTertiary}
        textAnchor="middle"
        fontFamily="Inter_500Medium"
      >
        {polygon.number}
      </SvgText>

      {/* Signo no centróide (acima dos planetas) */}
      <SvgText
        x={cx}
        y={cy - (planetCount > 0 ? lineHeight : 0)}
        fontSize="3.2"
        fill={isSelected ? palette.gold.bright : palette.silver.muted}
        textAnchor="middle"
        fontFamily="Inter_600SemiBold"
      >
        {signAbbr}
      </SvgText>

      {/* Planetas (em linha horizontal, com pulso sutil) */}
      {planets.length > 0 && (
        <AnimatedSvgText
          x={cx}
          y={cy + symbolSize * 1.3}
          fontSize={symbolSize}
          fill={planets.length === 1 ? PLANET_COLOR[planets[0]] : palette.silver.pure}
          textAnchor="middle"
          fontFamily="Inter_500Medium"
          animatedProps={planetAnimatedProps}
        >
          {planets.map((p) => PLANET_SYMBOL[p]).join(' ')}
        </AnimatedSvgText>
      )}
    </>
  );
}

// ─── Anel sutil de destaque na seleção ─────────────────

function SelectedRing({ visible }: { visible: boolean }) {
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withTiming(visible ? 1 : 0, {
      duration: duration.base,
      easing: Easing.bezier(0.16, 1, 0.3, 1),
    });
  }, [visible, opacity]);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View pointerEvents="none" style={[styles.selectionRing, style]} />
  );
}

const styles = StyleSheet.create({
  selectionRing: {
    position: 'absolute',
    top: -6,
    left: -6,
    right: -6,
    bottom: -6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(232, 196, 103, 0.5)',
    shadowColor: palette.gold.pure,
    shadowOpacity: 0.6,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 0 },
  },
});
