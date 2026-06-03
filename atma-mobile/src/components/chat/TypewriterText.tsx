/**
 * Atma Vedika — TypewriterText
 *
 * Renderiza um texto que está crescendo (streaming).
 * Quando `isStreaming`, exibe um cursor dourado pulsante no final.
 * Não anima caractere-a-caractere internamente — recebe o texto já fatiado
 * por `appendVedaChunk` no store (cada mudança de texto vem como re-render).
 */

import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  cancelAnimation,
} from 'react-native-reanimated';

import { Text } from '@/components/primitives/Text';
import { palette } from '@/theme/colors';
import { fontFamilies, fontSizes, lineHeights } from '@/theme/typography';

export interface TypewriterTextProps {
  text: string;
  isStreaming: boolean;
  color?: string;
}

export function TypewriterText({
  text,
  isStreaming,
  color = palette.silver.pure,
}: TypewriterTextProps) {
  const cursorOpacity = useSharedValue(0);

  useEffect(() => {
    if (isStreaming) {
      cursorOpacity.value = withRepeat(
        withTiming(1, {
          duration: 600,
          easing: Easing.inOut(Easing.sin),
        }),
        -1,
        true,
      );
    } else {
      cancelAnimation(cursorOpacity);
      cursorOpacity.value = withTiming(0, { duration: 200 });
    }
    return () => {
      cancelAnimation(cursorOpacity);
    };
  }, [isStreaming, cursorOpacity]);

  const cursorStyle = useAnimatedStyle(() => ({
    opacity: cursorOpacity.value,
  }));

  return (
    <View style={styles.row}>
      <Text variant="sacred" color={color}>
        {text}
      </Text>
      {isStreaming && (
        <Animated.View style={[styles.cursor, cursorStyle]} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    flexWrap: 'wrap',
  },
  cursor: {
    width: 8,
    height: fontSizes.bodyLarge * lineHeights.normal * 0.65,
    marginLeft: 3,
    marginBottom: 4,
    backgroundColor: palette.gold.glow,
    borderRadius: 1,
    // Faz suave o cursor não destacar demais
    shadowColor: palette.gold.pure,
    shadowOpacity: 0.6,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 0 },
  },
});

// Mantém referência para evitar tree-shake do fontFamilies se não usado abaixo
void fontFamilies;
