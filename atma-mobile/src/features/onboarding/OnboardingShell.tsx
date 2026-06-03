/**
 * Atma Vedika — OnboardingShell
 *
 * Wrapper padrão para cada tela de onboarding.
 *  • Background cósmico
 *  • SafeArea + paddings padronizados
 *  • StepProgress no topo (opcional)
 *  • Entrada animada (fade + translateY)
 *  • Slot inferior para CTA
 */

import { useEffect, type ReactNode } from 'react';
import { Keyboard, StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CosmicBackground } from '@/components/effects/CosmicBackground';
import { PremiumParticles } from '@/components/effects/PremiumParticles';
import { PulsingGlow } from '@/components/effects/PulsingGlow';
import { palette } from '@/theme/colors';
import { duration } from '@/theme/motion';
import { spacing } from '@/theme/spacing';
import { StepProgress } from './StepProgress';

export interface OnboardingShellProps {
  children: ReactNode;
  /** CTA fixo no rodapé (botões). */
  footer?: ReactNode;
  /** Progresso global (Welcome=0, Birth=1, Calculating=2, Reading=3). */
  step?: number;
  totalSteps?: number;
  /** Habilita partículas/glow (default true; desliga em Calculating). */
  ambient?: boolean;
  /** Cor do glow primário (default mystic). */
  glowColor?: string;
  /** Toca aqui pra esconder teclado (UX). */
  dismissKeyboardOnTap?: boolean;
}

export function OnboardingShell({
  children,
  footer,
  step,
  totalSteps = 4,
  ambient = true,
  glowColor = palette.mystic.soul,
  dismissKeyboardOnTap = true,
}: OnboardingShellProps) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(16);

  useEffect(() => {
    opacity.value = withTiming(1, {
      duration: duration.smooth,
      easing: Easing.bezier(0.16, 1, 0.3, 1),
    });
    translateY.value = withTiming(0, {
      duration: duration.smooth,
      easing: Easing.bezier(0.16, 1, 0.3, 1),
    });
  }, [opacity, translateY]);

  const contentStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <CosmicBackground>
      {ambient && (
        <>
          <PulsingGlow size={420} color={glowColor} intensity={0.15} top="35%" />
          <PulsingGlow
            size={240}
            color={palette.gold.deep}
            intensity={0.2}
            top="40%"
          />
          <PremiumParticles count={10} />
        </>
      )}

      <SafeAreaView
        edges={['top', 'bottom']}
        style={styles.safe}
        onTouchStart={dismissKeyboardOnTap ? Keyboard.dismiss : undefined}
      >
        {step !== undefined && (
          <View style={styles.header}>
            <StepProgress total={totalSteps} current={step} />
          </View>
        )}

        <Animated.View style={[styles.body, contentStyle]}>
          {children}
        </Animated.View>

        {footer && <View style={styles.footer}>{footer}</View>}
      </SafeAreaView>
    </CosmicBackground>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    paddingHorizontal: spacing.xl,
  },
  header: {
    paddingTop: spacing.sm,
    paddingBottom: spacing.lg,
  },
  body: {
    flex: 1,
  },
  footer: {
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
    alignItems: 'center',
  },
});
