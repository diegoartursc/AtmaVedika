/**
 * Atma Vedika — CelestialOrbit
 *
 * 3 anéis concêntricos girando em velocidades diferentes,
 * com pontos planetários orbitando. Usado em telas de cálculo.
 */

import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { palette } from '@/theme/colors';

export interface CelestialOrbitProps {
  size?: number;
}

export function CelestialOrbit({ size = 240 }: CelestialOrbitProps) {
  const r1 = useSharedValue(0);
  const r2 = useSharedValue(0);
  const r3 = useSharedValue(0);
  const pulse = useSharedValue(0);

  useEffect(() => {
    r1.value = withRepeat(
      withTiming(360, { duration: 18000, easing: Easing.linear }),
      -1,
    );
    r2.value = withRepeat(
      withTiming(-360, { duration: 26000, easing: Easing.linear }),
      -1,
    );
    r3.value = withRepeat(
      withTiming(360, { duration: 38000, easing: Easing.linear }),
      -1,
    );
    pulse.value = withRepeat(
      withTiming(1, { duration: 2400, easing: Easing.inOut(Easing.sin) }),
      -1,
      true,
    );
  }, [r1, r2, r3, pulse]);

  const ring1 = useAnimatedStyle(() => ({
    transform: [{ rotate: `${r1.value}deg` }],
  }));
  const ring2 = useAnimatedStyle(() => ({
    transform: [{ rotate: `${r2.value}deg` }],
  }));
  const ring3 = useAnimatedStyle(() => ({
    transform: [{ rotate: `${r3.value}deg` }],
  }));
  const core = useAnimatedStyle(() => ({
    transform: [{ scale: 0.92 + pulse.value * 0.16 }],
    opacity: 0.55 + pulse.value * 0.4,
  }));

  const s1 = size;
  const s2 = size * 0.72;
  const s3 = size * 0.44;
  const coreSize = size * 0.18;

  return (
    <View style={[styles.wrapper, { width: size, height: size }]}>
      {/* Ring 3 (outer) */}
      <Animated.View
        style={[
          ringStyle(s1, palette.mystic.glow, palette.mystic.soul, 1),
          ring3,
          styles.absolute,
        ]}
      >
        <View style={[styles.planet, planetPos(s1)]} />
      </Animated.View>

      {/* Ring 2 (mid) */}
      <Animated.View
        style={[
          ringStyle(s2, palette.gold.aura, palette.gold.glow, 1.5),
          ring2,
          styles.absolute,
        ]}
      >
        <View
          style={[
            styles.planet,
            planetPos(s2),
            { backgroundColor: palette.gold.glow, width: 6, height: 6 },
          ]}
        />
      </Animated.View>

      {/* Ring 1 (inner) */}
      <Animated.View
        style={[
          ringStyle(s3, palette.silver.breath, palette.silver.soft, 1),
          ring1,
          styles.absolute,
        ]}
      >
        <View
          style={[
            styles.planet,
            planetPos(s3),
            { backgroundColor: palette.silver.soft, width: 4, height: 4 },
          ]}
        />
      </Animated.View>

      {/* Core */}
      <Animated.View
        style={[
          styles.core,
          {
            width: coreSize,
            height: coreSize,
            borderRadius: coreSize / 2,
          },
          core,
        ]}
      />
    </View>
  );
}

const planetPos = (ringSize: number) => ({
  position: 'absolute' as const,
  top: -3,
  left: ringSize / 2 - 4,
});

const ringStyle = (
  size: number,
  borderColor: string,
  glowColor: string,
  borderWidth: number,
) => ({
  width: size,
  height: size,
  borderRadius: size / 2,
  borderWidth,
  borderColor,
  shadowColor: glowColor,
  shadowOpacity: 0.4,
  shadowRadius: 14,
  shadowOffset: { width: 0, height: 0 },
});

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  absolute: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  planet: {
    width: 8,
    height: 8,
    borderRadius: 999,
    backgroundColor: palette.mystic.soul,
    shadowColor: palette.mystic.soul,
    shadowOpacity: 0.9,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
  },
  core: {
    backgroundColor: palette.gold.glow,
    shadowColor: palette.gold.pure,
    shadowOpacity: 0.9,
    shadowRadius: 40,
    shadowOffset: { width: 0, height: 0 },
  },
});
