/**
 * Atma Vedika — CompatibilitySheet
 *
 * Bottom sheet com leitura completa de compatibilidade entre 2 mapas.
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

import { Text } from '@/components/primitives/Text';
import { palette, semantic } from '@/theme/colors';
import { duration } from '@/theme/motion';
import { radii } from '@/theme/radii';
import { spacing } from '@/theme/spacing';
import type { CompatibilityReading } from '@/services/compatibility';

export interface CompatibilitySheetProps {
  reading: CompatibilityReading | null;
  onDismiss: () => void;
}

const BAND_ACCENT: Record<CompatibilityReading['band'], string> = {
  rare: '#FFB74D',
  strong: '#10B981',
  good: '#7C3AED',
  challenge: '#F472B6',
};

export function CompatibilitySheet({
  reading,
  onDismiss,
}: CompatibilitySheetProps) {
  const insets = useSafeAreaInsets();
  const visible = reading !== null;
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

  if (!reading) return null;

  const accent = BAND_ACCENT[reading.band];

  const handleShare = async () => {
    Haptics.selectionAsync().catch(() => {});
    try {
      const text =
        `Compatibilidade · ${reading.score.total}/100\n` +
        `${reading.headline}\n\n` +
        `Você + ${reading.partner.name}\n\n` +
        `${reading.body}\n\n— Atma Vedika`;
      await Share.share({ message: text, title: 'Compatibilidade védica' });
    } catch {
      // cancelado
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
            ✦  compatibilidade  ✦
          </Text>

          <View style={{ height: spacing.sm }} />

          <Text variant="caption" color={semantic.textTertiary} align="center">
            você  +  {reading.partner.name.toLowerCase()}
          </Text>

          <View style={{ height: spacing.lg }} />

          {/* Score grande */}
          <View style={styles.scoreCircle}>
            <Text
              style={[
                styles.scoreNumber,
                { color: accent, textShadowColor: accent },
              ]}
            >
              {reading.score.total}
            </Text>
            <Text variant="caption" color={semantic.textTertiary}>
              em 100
            </Text>
          </View>

          <View style={{ height: spacing.lg }} />

          <Text variant="display" color={semantic.textPrimary} align="center">
            {reading.headline}
          </Text>

          <View style={{ height: spacing.lg }} />

          {/* Barras das 4 dimensões */}
          <View style={styles.dimensions}>
            <Dim label="atma" value={reading.score.atma} accent={accent} />
            <Dim label="manas" value={reading.score.manas} accent={accent} />
            <Dim label="kama" value={reading.score.kama} accent={accent} />
            <Dim label="gana" value={reading.score.gana} accent={accent} />
          </View>

          <View style={{ height: spacing.lg }} />

          <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
            <Text variant="sacred" color={semantic.textPrimary}>
              {reading.body}
            </Text>
          </ScrollView>

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

function Dim({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent: string;
}) {
  return (
    <View style={styles.dim}>
      <View style={styles.dimHeader}>
        <Text variant="ritual" color={semantic.textTertiary}>
          {label}
        </Text>
        <Text variant="caption" color={accent}>
          {value}
        </Text>
      </View>
      <View style={styles.dimTrack}>
        <View
          style={[
            styles.dimFill,
            { width: `${value}%`, backgroundColor: accent },
          ]}
        />
      </View>
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
    maxHeight: '92%',
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
  scoreCircle: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
  },
  scoreNumber: {
    fontSize: 72,
    lineHeight: 78,
    fontFamily: 'PlayfairDisplay_700Bold',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 18,
  },
  dimensions: {
    gap: spacing.sm,
  },
  dim: {
    gap: 4,
  },
  dimHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dimTrack: {
    height: 4,
    borderRadius: 999,
    backgroundColor: palette.silver.breath,
    overflow: 'hidden',
  },
  dimFill: {
    height: '100%',
    borderRadius: 999,
  },
  scroll: {
    maxHeight: 220,
  },
  scrollContent: {
    paddingBottom: spacing.lg,
  },
  shareBtn: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: 999,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(212,175,55,0.35)',
    alignSelf: 'center',
  },
  shareBtnPressed: {
    backgroundColor: 'rgba(212,175,55,0.08)',
  },
});
