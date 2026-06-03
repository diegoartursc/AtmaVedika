/**
 * Atma Vedika — ChatInput
 *
 * Input flutuante glass com botão de envio circular dourado.
 * Multilinha (cresce até 4 linhas) + contador de mensagens grátis.
 * Desabilita quando o usuário está sem mensagens ou Veda está respondendo.
 */

import { useState } from 'react';
import {
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { Text } from '@/components/primitives/Text';
import { palette, semantic } from '@/theme/colors';
import { radii } from '@/theme/radii';
import { spacing } from '@/theme/spacing';
import { spring } from '@/theme/motion';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export interface ChatInputProps {
  onSend: (text: string) => void;
  disabled?: boolean;
  isResponding?: boolean;
  freeRemaining?: number;
  isPremium?: boolean;
}

export function ChatInput({
  onSend,
  disabled,
  isResponding,
  freeRemaining,
  isPremium,
}: ChatInputProps) {
  const [text, setText] = useState('');
  const scale = useSharedValue(1);

  const canSend = text.trim().length > 0 && !disabled && !isResponding;

  const handleSend = () => {
    if (!canSend) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    onSend(text.trim());
    setText('');
  };

  const sendStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: canSend ? 1 : 0.35,
  }));

  return (
    <View style={styles.wrapper}>
      {!isPremium && typeof freeRemaining === 'number' && (
        <View style={styles.counterWrap}>
          <Text variant="ritual" color={semantic.textTertiary}>
            {freeRemaining > 0
              ? `${freeRemaining} pergunta${freeRemaining === 1 ? '' : 's'} grátis restante${freeRemaining === 1 ? '' : 's'}`
              : 'mensagens grátis esgotadas'}
          </Text>
        </View>
      )}

      <View style={styles.bar}>
        {Platform.OS === 'ios' ? (
          <BlurView intensity={50} tint="dark" style={StyleSheet.absoluteFill} />
        ) : (
          <View
            style={[
              StyleSheet.absoluteFill,
              { backgroundColor: 'rgba(11, 8, 32, 0.92)' },
            ]}
          />
        )}
        <View style={[StyleSheet.absoluteFill, styles.tint]} />
        <View style={[StyleSheet.absoluteFill, styles.border]} />

        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="pergunte qualquer coisa…"
          placeholderTextColor={semantic.textTertiary}
          editable={!disabled && !isResponding}
          multiline
          maxLength={500}
          style={styles.input}
          selectionColor={palette.gold.glow}
          cursorColor={palette.gold.glow}
          textAlignVertical="center"
        />

        <AnimatedPressable
          onPress={handleSend}
          onPressIn={() => {
            scale.value = withSpring(0.9, spring.snap);
          }}
          onPressOut={() => {
            scale.value = withSpring(1, spring.bounce);
          }}
          disabled={!canSend}
          style={[styles.sendBtn, sendStyle]}
        >
          <Text style={styles.sendIcon}>→</Text>
        </AnimatedPressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: spacing.lg,
  },
  counterWrap: {
    alignSelf: 'center',
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  bar: {
    minHeight: 52,
    borderRadius: radii.xl,
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingLeft: spacing.lg,
    paddingRight: spacing.xs,
    paddingVertical: spacing.xs,
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
  },
  tint: {
    backgroundColor: 'rgba(2,1,8,0.25)',
    borderRadius: radii.xl,
  },
  border: {
    borderRadius: radii.xl,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: semantic.border,
  },
  input: {
    flex: 1,
    color: semantic.textPrimary,
    fontSize: 15,
    fontFamily: 'Inter_400Regular',
    paddingVertical: spacing.sm,
    paddingRight: spacing.sm,
    maxHeight: 120,
    minHeight: 36,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: palette.gold.glow,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xxs,
    shadowColor: palette.gold.pure,
    shadowOpacity: 0.8,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 0 },
    elevation: 10,
  },
  sendIcon: {
    fontSize: 20,
    lineHeight: 22,
    color: palette.void.abyss,
    fontWeight: '700',
  },
});
