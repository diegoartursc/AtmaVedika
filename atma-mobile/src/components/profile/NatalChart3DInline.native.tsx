/**
 * Atma Vedika — NatalChart3DInline (native fallback)
 *
 * Three.js requer expo-gl no native (dev build). Aqui mostramos
 * apenas um quadrado escuro com símbolo — placeholder.
 */

import { StyleSheet, View } from 'react-native';

import { Text } from '@/components/primitives/Text';
import { palette, semantic } from '@/theme/colors';
import type { BirthChart } from '@/types/chart';

export interface NatalChart3DInlineProps {
  chart: BirthChart;
  size?: number;
}

export function NatalChart3DInline({ size = 320 }: NatalChart3DInlineProps) {
  return (
    <View style={[styles.box, { width: size, height: size }]}>
      <Text style={styles.symbol}>⊕</Text>
      <Text variant="caption" color={semantic.textTertiary} align="center">
        3D requer dev build
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(2,1,8,0.6)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(212,175,55,0.2)',
  },
  symbol: {
    fontSize: 64,
    color: palette.gold.glow,
    textShadowColor: palette.gold.pure,
    textShadowRadius: 18,
    textShadowOffset: { width: 0, height: 0 },
    marginBottom: 12,
  },
});
