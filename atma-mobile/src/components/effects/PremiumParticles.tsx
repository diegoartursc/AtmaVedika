/**
 * Atma Vedika — PremiumParticles
 *
 * Partículas cósmicas flutuando (estilo cinematográfico).
 * Cada partícula tem trajetória, velocidade e opacidade próprias.
 *
 * Renderizadas via Reanimated (UI thread, 60-120fps).
 * Para volumes >50 partículas, migrar para Skia.
 */

import { useMemo } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { palette } from '@/theme/colors';

interface ParticleSeed {
  startX: number;
  endX: number;
  startY: number;
  endY: number;
  size: number;
  duration: number;
  delay: number;
  color: string;
}

function seedParticles(
  count: number,
  screenW: number,
  screenH: number,
): ParticleSeed[] {
  // Paleta refinada — mais dourado, menos azul. Sensação áurica.
  const colors = [
    palette.gold.glow,
    palette.gold.bright,
    palette.gold.aura,
    palette.silver.pure,
  ];

  return Array.from({ length: count }, (_, i) => {
    const r1 = ((i * 73) % 100) / 100;
    const r2 = ((i * 137 + 41) % 100) / 100;
    const r3 = ((i * 211 + 89) % 100) / 100;
    const r4 = ((i * 311 + 17) % 100) / 100;

    return {
      startX: r1 * screenW,
      endX: r2 * screenW,
      startY: screenH + 20 + r3 * 100,
      endY: -80 - r4 * 100,
      // Partículas mais variáveis em tamanho — algumas grandes pra destaque
      size: 1.2 + r3 * 4.5,
      // Mais lentas — sensação contemplativa
      duration: 14000 + r4 * 10000,
      delay: r2 * 8000,
      color: colors[i % colors.length],
    };
  });
}

interface ParticleProps {
  seed: ParticleSeed;
}

function Particle({ seed }: ParticleProps) {
  const progress = useSharedValue(0);

  // ✨ inicia a animação dentro do worklet (sem useEffect)
  if (progress.value === 0) {
    progress.value = withDelay(
      seed.delay,
      withRepeat(
        withTiming(1, {
          duration: seed.duration,
          easing: Easing.bezier(0.4, 0, 0.6, 1),
        }),
        -1,
        false,
      ),
    );
  }

  const animatedStyle = useAnimatedStyle(() => {
    const x = seed.startX + (seed.endX - seed.startX) * progress.value;
    const y = seed.startY + (seed.endY - seed.startY) * progress.value;

    // fade in/out suave nos extremos
    const opacity =
      progress.value < 0.15
        ? progress.value / 0.15
        : progress.value > 0.85
          ? (1 - progress.value) / 0.15
          : 1;

    return {
      transform: [{ translateX: x }, { translateY: y }],
      // Opacity um pouco menor mas com glow mais intenso = sensação luminosa
      opacity: opacity * 0.65,
    };
  });

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.particle,
        {
          width: seed.size,
          height: seed.size,
          borderRadius: seed.size / 2,
          backgroundColor: seed.color,
          shadowColor: seed.color,
        },
        animatedStyle,
      ]}
    />
  );
}

export interface PremiumParticlesProps {
  count?: number;
}

export function PremiumParticles({ count = 12 }: PremiumParticlesProps) {
  const { width, height } = useWindowDimensions();
  const seeds = useMemo(
    () => seedParticles(count, width, height),
    [count, width, height],
  );

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {seeds.map((seed, i) => (
        <Particle key={i} seed={seed} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  particle: {
    position: 'absolute',
    top: 0,
    left: 0,
    // Glow mais intenso — partículas viram pequenos sóis
    shadowOpacity: 0.9,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 0 },
  },
});
