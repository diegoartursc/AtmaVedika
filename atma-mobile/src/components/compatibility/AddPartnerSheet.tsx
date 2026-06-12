/**
 * Atma Vedika — AddPartnerSheet
 *
 * Bottom sheet com form de 4 campos pra adicionar parceiro
 * pra comparação de mapas.
 */

import { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { BlurView } from 'expo-blur';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { SacredButton } from '@/components/primitives/SacredButton';
import { SacredInput } from '@/components/primitives/SacredInput';
import { Text } from '@/components/primitives/Text';
import { semantic } from '@/theme/colors';
import { duration } from '@/theme/motion';
import { radii } from '@/theme/radii';
import { spacing } from '@/theme/spacing';
import type { PartnerSeed } from '@/services/compatibility';

export interface AddPartnerSheetProps {
  visible: boolean;
  onAdd: (seed: PartnerSeed) => void;
  onDismiss: () => void;
}

export function AddPartnerSheet({
  visible,
  onAdd,
  onDismiss,
}: AddPartnerSheetProps) {
  const insets = useSafeAreaInsets();
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(80);

  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [place, setPlace] = useState('');

  useEffect(() => {
    if (!visible) {
      setName('');
      setDate('');
      setTime('');
      setPlace('');
    }
    opacity.value = withTiming(visible ? 1 : 0, {
      duration: duration.smooth,
      easing: Easing.bezier(0.16, 1, 0.3, 1),
    });
    translateY.value = withTiming(visible ? 0 : 80, {
      duration: duration.smooth,
      easing: Easing.bezier(0.16, 1, 0.3, 1),
    });
  }, [visible, opacity, translateY]);

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: opacity.value * 0.55,
  }));
  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  if (!visible) return null;

  const isValid =
    name.trim().length >= 2 &&
    /^\d{2}\/\d{2}\/\d{4}$/.test(date) &&
    /^\d{2}:\d{2}$/.test(time) &&
    place.trim().length >= 3;

  const handleSubmit = () => {
    if (!isValid) return;
    onAdd({
      name: name.trim(),
      birthDate: date,
      birthTime: time,
      birthPlace: place.trim(),
    });
    onDismiss();
  };

  return (
    <View pointerEvents="box-none" style={styles.fill}>
      <Animated.View
        style={[styles.backdrop, backdropStyle]}
        pointerEvents={visible ? 'auto' : 'none'}
      >
        <Pressable style={styles.fill} onPress={onDismiss} />
      </Animated.View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.kbAvoid}
        pointerEvents="box-none"
      >
        <Animated.View
          style={[styles.sheet, sheetStyle]}
          pointerEvents={visible ? 'auto' : 'none'}
        >
          {Platform.OS === 'ios' ? (
            <BlurView intensity={70} tint="dark" style={StyleSheet.absoluteFill} />
          ) : (
            <View
              style={[
                StyleSheet.absoluteFill,
                { backgroundColor: 'rgba(6, 4, 16, 0.96)' },
              ]}
            />
          )}
          <View style={[StyleSheet.absoluteFill, styles.tint]} />
          <View style={[StyleSheet.absoluteFill, styles.border]} />

          <View
            style={[
              styles.content,
              { paddingBottom: insets.bottom + spacing.lg },
            ]}
          >
            <View style={styles.handle} />

            <View style={{ height: spacing.lg }} />

            <Text variant="ritual" color={semantic.textGold} align="center">
              adicionar pessoa
            </Text>

            <View style={{ height: spacing.sm }} />

            <Text variant="caption" color={semantic.textTertiary} align="center">
              vamos cruzar o seu mapa com o dela.
            </Text>

            <View style={{ height: spacing.lg }} />

            <ScrollView
              style={styles.scroll}
              contentContainerStyle={styles.scrollContent}
              keyboardShouldPersistTaps="handled"
            >
              <SacredInput
                label="nome"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
                autoCorrect={false}
                valueSize="large"
              />
              <SacredInput
                label="dd / mm / aaaa"
                value={date}
                onChangeText={setDate}
                mask="date"
                valueSize="large"
              />
              <SacredInput
                label="hh : mm"
                value={time}
                onChangeText={setTime}
                mask="time"
                valueSize="large"
              />
              <SacredInput
                label="cidade, estado"
                value={place}
                onChangeText={setPlace}
                autoCapitalize="words"
                autoCorrect={false}
                valueSize="large"
              />
            </ScrollView>

            <View style={{ height: spacing.lg }} />

            <SacredButton
              label="comparar mapas"
              disabled={!isValid}
              breathing={isValid}
              fullWidth
              onPress={handleSubmit}
            />
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  fill: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(2,1,8,1)',
    zIndex: 90,
  },
  kbAvoid: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 100,
    justifyContent: 'flex-end',
  },
  sheet: {
    borderTopLeftRadius: radii.xl,
    borderTopRightRadius: radii.xl,
    overflow: 'hidden',
    maxHeight: '90%',
    shadowColor: '#000',
    shadowOpacity: 0.55,
    shadowRadius: 26,
    shadowOffset: { width: 0, height: -16 },
  },
  tint: {
    backgroundColor: 'rgba(6,4,16,0.5)',
  },
  border: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(212,175,55,0.3)',
  },
  content: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.sm,
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 3,
    borderRadius: 999,
    backgroundColor: 'rgba(245,244,240,0.3)',
  },
  scroll: {
    maxHeight: 380,
  },
  scrollContent: {
    paddingBottom: spacing.sm,
  },
});
