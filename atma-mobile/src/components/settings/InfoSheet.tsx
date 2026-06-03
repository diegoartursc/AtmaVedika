/**
 * Atma Vedika — InfoSheet
 *
 * Bottom sheet glass para conteúdo textual longo (sobre, créditos, privacidade).
 */

import { useEffect } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { BlurView } from 'expo-blur';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Text } from '@/components/primitives/Text';
import { semantic } from '@/theme/colors';
import { duration } from '@/theme/motion';
import { radii } from '@/theme/radii';
import { spacing } from '@/theme/spacing';

export interface InfoSheetProps {
  visible: boolean;
  title: string;
  body: string;
  onDismiss: () => void;
}

export function InfoSheet({ visible, title, body, onDismiss }: InfoSheetProps) {
  const insets = useSafeAreaInsets();
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(80);

  useEffect(() => {
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
    opacity: opacity.value * 0.45,
  }));
  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  if (!visible) return null;

  return (
    <View pointerEvents="box-none" style={styles.fill}>
      <Animated.View
        style={[styles.backdrop, backdropStyle]}
        pointerEvents={visible ? 'auto' : 'none'}
      >
        <Pressable style={styles.fill} onPress={onDismiss} />
      </Animated.View>

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
            ✦  {title}  ✦
          </Text>

          <View style={{ height: spacing.lg }} />

          <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
            <Text variant="sacred" color={semantic.textPrimary}>
              {body}
            </Text>
          </ScrollView>
        </View>
      </Animated.View>
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
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    borderTopLeftRadius: radii.xl,
    borderTopRightRadius: radii.xl,
    overflow: 'hidden',
    zIndex: 100,
    maxHeight: '85%',
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
    maxHeight: '100%',
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 3,
    borderRadius: 999,
    backgroundColor: 'rgba(245,244,240,0.3)',
  },
  scroll: {
    maxHeight: 480,
  },
  scrollContent: {
    paddingBottom: spacing.xl,
  },
});
