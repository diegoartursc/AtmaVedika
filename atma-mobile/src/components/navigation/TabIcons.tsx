/**
 * Atma Vedika — TabIcons
 *
 * Ícones SVG autorais pras 4 tabs.
 *  • Mapa     — diamante védico (4 triângulos)
 *  • Ciclos   — meia-lua (fase lunar / ciclo)
 *  • Veda     — sparkle 4 pontas (sagrado)
 *  • Perfil   — círculo com atma no centro
 *
 * Cada ícone aceita size + color + glow.
 */

import Animated, {
  interpolateColor,
  useAnimatedProps,
  type SharedValue,
} from 'react-native-reanimated';
import Svg, { Circle, Path } from 'react-native-svg';

import { palette } from '@/theme/colors';

const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export interface TabIconProps {
  /** Tamanho em pixels (default 22). */
  size?: number;
  /** SharedValue 0..1 (0 = inativo, 1 = ativo). */
  progress: SharedValue<number>;
}

const COLOR_RANGE = [palette.silver.muted, palette.gold.glow] as const;

// ─── Mapa ─────────────────────────────────────────────

export function MapaIcon({ size = 24, progress }: TabIconProps) {
  const animatedProps = useAnimatedProps(() => ({
    stroke: interpolateColor(progress.value, [0, 1], [...COLOR_RANGE]),
  }));
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      {/* Diamante exterior */}
      <AnimatedPath
        d="M12 2 L22 12 L12 22 L2 12 Z"
        fill="none"
        strokeWidth={1.5}
        strokeLinejoin="round"
        animatedProps={animatedProps}
      />
      {/* Cruz interna */}
      <AnimatedPath
        d="M12 2 L12 22 M2 12 L22 12"
        fill="none"
        strokeWidth={1}
        animatedProps={animatedProps}
      />
    </Svg>
  );
}

// ─── Ciclos ───────────────────────────────────────────

export function CiclosIcon({ size = 24, progress }: TabIconProps) {
  const strokeProps = useAnimatedProps(() => ({
    stroke: interpolateColor(progress.value, [0, 1], [...COLOR_RANGE]),
  }));
  const fillProps = useAnimatedProps(() => ({
    fill: interpolateColor(progress.value, [0, 1], [...COLOR_RANGE]),
  }));
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      {/* Círculo de fundo */}
      <AnimatedCircle
        cx={12}
        cy={12}
        r={9.25}
        fill="none"
        strokeWidth={1.5}
        animatedProps={strokeProps}
      />
      {/* Meia-lua preenchida (lado direito) */}
      <AnimatedPath
        d="M12 2.75 A 9.25 9.25 0 0 1 12 21.25 Z"
        animatedProps={fillProps}
      />
    </Svg>
  );
}

// ─── Veda ─────────────────────────────────────────────

export function VedaIcon({ size = 24, progress }: TabIconProps) {
  const fillProps = useAnimatedProps(() => ({
    fill: interpolateColor(progress.value, [0, 1], [...COLOR_RANGE]),
  }));
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      {/* Sparkle de 4 pontas */}
      <AnimatedPath
        d="M12 2 C12.4 8.4 15.6 11.6 22 12 C15.6 12.4 12.4 15.6 12 22 C11.6 15.6 8.4 12.4 2 12 C8.4 11.6 11.6 8.4 12 2 Z"
        animatedProps={fillProps}
      />
    </Svg>
  );
}

// ─── Perfil ───────────────────────────────────────────

export function PerfilIcon({ size = 24, progress }: TabIconProps) {
  const strokeProps = useAnimatedProps(() => ({
    stroke: interpolateColor(progress.value, [0, 1], [...COLOR_RANGE]),
  }));
  const fillProps = useAnimatedProps(() => ({
    fill: interpolateColor(progress.value, [0, 1], [...COLOR_RANGE]),
  }));
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      {/* Círculo externo (corpo) */}
      <AnimatedCircle
        cx={12}
        cy={12}
        r={9.25}
        fill="none"
        strokeWidth={1.5}
        animatedProps={strokeProps}
      />
      {/* Atma central */}
      <AnimatedCircle cx={12} cy={12} r={2.5} animatedProps={fillProps} />
    </Svg>
  );
}

export const TAB_ICONS = {
  home: MapaIcon,
  timeline: CiclosIcon,
  chat: VedaIcon,
  profile: PerfilIcon,
} as const;

export type TabRouteName = keyof typeof TAB_ICONS;
