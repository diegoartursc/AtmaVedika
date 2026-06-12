/**
 * Atma Vedika — NatalChart3D (native fallback)
 *
 * Three.js requer expo-gl no native, que por sua vez exige um
 * dev build (não roda no Expo Go). Enquanto não montamos o dev
 * client, este fallback mostra uma mensagem.
 *
 * A versão web fica em NatalChart3D.tsx (mesmo nome de export).
 */

import { StyleSheet, View } from 'react-native';

import { Text } from '@/components/primitives/Text';
import { palette, semantic } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import type { PlanetPlacement } from '@/services/natalChart3d';
import type { BirthChart } from '@/types/chart';

export interface NatalChart3DProps {
  chart: BirthChart;
  selectedPlanetName: PlanetPlacement['name'] | null;
  onSelectPlanet: (planet: PlanetPlacement | null) => void;
}

export function NatalChart3D(_: NatalChart3DProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.symbol}>⊕</Text>
      <View style={{ height: spacing.lg }} />
      <Text variant="ritual" color={semantic.textGold} align="center">
        mapa 3D
      </Text>
      <View style={{ height: spacing.md }} />
      <Text variant="title" color={semantic.textPrimary} align="center">
        Disponível{'\n'}na versão web
      </Text>
      <View style={{ height: spacing.lg }} />
      <Text variant="sacred" color={semantic.textTertiary} align="center">
        A cena Three.js precisa de dev build nativo{'\n'}
        (expo-gl). Chega na próxima fase de empacotamento.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  symbol: {
    fontSize: 88,
    color: palette.gold.glow,
    textShadowColor: palette.gold.pure,
    textShadowRadius: 24,
    textShadowOffset: { width: 0, height: 0 },
  },
});
