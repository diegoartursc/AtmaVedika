/**
 * Atma Vedika — ChatEmptyState
 *
 * Tela inicial do chat quando ainda não há mensagens.
 * Convite poético + 3 sugestões clicáveis baseadas no mapa do usuário.
 */

import { useEffect } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';

import { Text } from '@/components/primitives/Text';
import { palette, semantic } from '@/theme/colors';
import { duration } from '@/theme/motion';
import { radii } from '@/theme/radii';
import { spacing } from '@/theme/spacing';
import type { BirthChart } from '@/types/chart';

export interface ChatEmptyStateProps {
  chart: BirthChart;
  onSuggestion: (text: string) => void;
}

export function ChatEmptyState({ chart, onSuggestion }: ChatEmptyStateProps) {
  const suggestions = buildSuggestions(chart);

  const opacity = useSharedValue(0);
  const translateY = useSharedValue(12);

  useEffect(() => {
    opacity.value = withTiming(1, {
      duration: duration.deep,
      easing: Easing.bezier(0.16, 1, 0.3, 1),
    });
    translateY.value = withTiming(0, {
      duration: duration.deep,
      easing: Easing.bezier(0.16, 1, 0.3, 1),
    });
  }, [opacity, translateY]);

  const headerStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  const handlePress = (text: string) => {
    Haptics.selectionAsync().catch(() => {});
    onSuggestion(text);
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.header, headerStyle]}>
        <Text style={styles.symbol}>✦</Text>
        <View style={styles.gap} />
        <Text variant="display" color={semantic.textPrimary} align="center">
          Pergunte{'\n'}qualquer coisa.
        </Text>
        <View style={styles.gap} />
        <Text variant="sacred" color={semantic.textTertiary} align="center">
          Eu já sei tudo sobre você.{'\n'}
          Agora é a sua vez.
        </Text>
      </Animated.View>

      <View style={styles.suggestions}>
        {suggestions.map((suggestion, i) => (
          <SuggestionChip
            key={suggestion}
            text={suggestion}
            delay={400 + i * 220}
            onPress={() => handlePress(suggestion)}
          />
        ))}
      </View>
    </View>
  );
}

interface SuggestionChipProps {
  text: string;
  delay: number;
  onPress: () => void;
}

function SuggestionChip({ text, delay, onPress }: SuggestionChipProps) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(10);

  useEffect(() => {
    opacity.value = withDelay(
      delay,
      withTiming(1, {
        duration: duration.smooth,
        easing: Easing.bezier(0.16, 1, 0.3, 1),
      }),
    );
    translateY.value = withDelay(
      delay,
      withTiming(0, {
        duration: duration.smooth,
        easing: Easing.bezier(0.16, 1, 0.3, 1),
      }),
    );
  }, [delay, opacity, translateY]);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View style={style}>
      <Pressable
        onPress={onPress}
        android_ripple={{ color: palette.gold.whisper }}
        style={({ pressed }) => [
          styles.chip,
          { opacity: pressed ? 0.7 : 1 },
        ]}
      >
        <Text variant="bodyEmphasis" color={semantic.textPrimary} align="left">
          {text}
        </Text>
        <Text variant="ritual" color={semantic.textGold}>
          {'  →'}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

function buildSuggestions(chart: BirthChart): string[] {
  const moon = chart.moonNakshatra;
  const dasha = chart.vimshottariDasha;
  return [
    `Como vivo bem o nakshatra ${moon.name}?`,
    `O que minha Mahadasha de ${dasha.currentMahadasha} quer me mostrar?`,
    'Em que área da vida eu deveria me concentrar agora?',
  ];
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.cosmic,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.cosmic,
  },
  symbol: {
    fontSize: 64,
    lineHeight: 72,
    color: palette.gold.glow,
    textShadowColor: palette.gold.pure,
    textShadowRadius: 20,
    textShadowOffset: { width: 0, height: 0 },
  },
  gap: {
    height: spacing.lg,
  },
  suggestions: {
    gap: spacing.md,
  },
  chip: {
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
    borderRadius: radii.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: semantic.border,
    backgroundColor: 'rgba(212,175,55,0.04)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
