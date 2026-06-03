/**
 * Atma Vedika — MessageBubble
 *
 * Mensagem do chat com 2 variants:
 *   • veda  → full-width, sem caixa, Playfair italic, símbolo ✦ esquerda
 *   • user  → alinhado à direita, caixa sutil dourada, Inter regular
 *
 * Entrada animada (fade + slide).
 */

import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { Text } from '@/components/primitives/Text';
import { TypewriterText } from './TypewriterText';
import { palette, semantic } from '@/theme/colors';
import { duration } from '@/theme/motion';
import { radii } from '@/theme/radii';
import { spacing } from '@/theme/spacing';
import type { ChatMessage } from '@/store/chatStore';

export interface MessageBubbleProps {
  message: ChatMessage;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(8);

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

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  if (message.role === 'veda') {
    return (
      <Animated.View style={[styles.vedaWrap, animatedStyle]}>
        <View style={styles.vedaSymbolWrap}>
          <Text style={styles.vedaSymbol}>✦</Text>
        </View>
        <View style={styles.vedaContent}>
          {message.content.length === 0 && message.streaming ? (
            <Text
              variant="sacred"
              color={semantic.textTertiary}
              style={styles.thinking}
            >
              veda está respondendo…
            </Text>
          ) : (
            <TypewriterText
              text={message.content}
              isStreaming={!!message.streaming}
              color={semantic.textPrimary}
            />
          )}
        </View>
      </Animated.View>
    );
  }

  return (
    <Animated.View style={[styles.userRow, animatedStyle]}>
      <View style={styles.userBubble}>
        <Text variant="body" color={semantic.textPrimary}>
          {message.content}
        </Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  vedaWrap: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  vedaSymbolWrap: {
    width: 24,
    paddingTop: 2,
    alignItems: 'center',
  },
  vedaSymbol: {
    fontSize: 18,
    lineHeight: 22,
    color: palette.gold.glow,
    textShadowColor: palette.gold.pure,
    textShadowRadius: 12,
    textShadowOffset: { width: 0, height: 0 },
  },
  vedaContent: {
    flex: 1,
  },
  thinking: {
    fontStyle: 'italic',
  },
  userRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  userBubble: {
    maxWidth: '82%',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radii.xl,
    borderTopRightRadius: radii.sm,
    backgroundColor: palette.gold.whisper,
    borderWidth: 1,
    borderColor: 'rgba(212,175,55,0.22)',
  },
});
