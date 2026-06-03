/**
 * Atma Vedika — Onboarding Stack
 *
 * Stack dedicada com transição fade longa entre telas.
 * Sem header, sem swipe-back (controlado pelo design).
 */

import { Stack } from 'expo-router';

import { palette } from '@/theme/colors';

export default function OnboardingLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: palette.void.abyss },
        animation: 'fade',
        animationDuration: 700,
        gestureEnabled: false,
      }}
    />
  );
}
