/**
 * Atma Vedika — DailyReadingSheet
 *
 * Bottom sheet glass com a leitura completa do dia.
 * CTA "✓ marcar como lido" persiste no userStore (lastDailyReadAt).
 */

import { useEffect } from 'react';
import {
  Platform,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  View,
} from 'react-native';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { SacredButton } from '@/components/primitives/SacredButton';
import { Text } from '@/components/primitives/Text';
import { palette, semantic } from '@/theme/colors';
import { duration } from '@/theme/motion';
import { radii } from '@/theme/radii';
import { spacing } from '@/theme/spacing';
import type { DailyReading } from '@/services/dailyReading';

export interface DailyReadingSheetProps {
  visible: boolean;
  reading: DailyReading;
  isUnread: boolean;
  userName: string;
  onMarkRead: () => void;
  onDismiss: () => void;
}

export function DailyReadingSheet({
  visible,
  reading,
  isUnread,
  userName,
  onMarkRead,
  onDismiss,
}: DailyReadingSheetProps) {
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
    opacity: opacity.value * 0.5,
  }));
  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  if (!visible) return null;

  const firstName = userName.split(' ')[0];

  const handleMark = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    onMarkRead();
    onDismiss();
  };

  const handleShare = async () => {
    Haptics.selectionAsync().catch(() => {});
    try {
      const shareText =
        `${reading.title.replace('\n', ' ')}\n\n${reading.body}\n\n— Atma Vedika`;
      await Share.share({
        message: shareText,
        title: `Leitura de hoje · ${reading.symbol}`,
      });
    } catch {
      // share cancelado ou indisponível
    }
  };

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
            {reading.greeting}, {firstName.toLowerCase()}
          </Text>

          <View style={{ height: spacing.lg }} />

          <View style={styles.symbolRow}>
            <Text
              style={[
                styles.bigSymbol,
                {
                  color: reading.rulerColor,
                  textShadowColor: reading.rulerColor,
                },
              ]}
            >
              {reading.symbol}
            </Text>
          </View>

          <View style={{ height: spacing.md }} />

          <Text variant="display" color={semantic.textPrimary} align="center">
            {reading.title}
          </Text>

          <View style={{ height: spacing.xl }} />

          <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
            <Text variant="sacred" color={semantic.textPrimary}>
              {reading.body}
            </Text>
          </ScrollView>

          <View style={{ height: spacing.lg }} />

          <SacredButton
            label={isUnread ? '✓ marcar como lido' : 'fechar'}
            fullWidth
            onPress={isUnread ? handleMark : onDismiss}
          />

          <View style={{ height: spacing.md }} />

          <Pressable
            onPress={handleShare}
            style={({ pressed }) => [
              styles.shareBtn,
              pressed && styles.shareBtnPressed,
            ]}
          >
            <Text variant="ritual" color={semantic.textGold} align="center">
              ⌶  compartilhar
            </Text>
          </Pressable>
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
  symbolRow: {
    alignItems: 'center',
  },
  bigSymbol: {
    fontSize: 88,
    lineHeight: 96,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 22,
  },
  scroll: {
    maxHeight: 280,
  },
  scrollContent: {
    paddingBottom: spacing.lg,
  },
  shareBtn: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radii.pill,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(212,175,55,0.35)',
    alignSelf: 'center',
  },
  shareBtnPressed: {
    backgroundColor: 'rgba(212,175,55,0.08)',
  },
});

void palette;
