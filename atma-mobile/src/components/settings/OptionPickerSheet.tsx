/**
 * Atma Vedika — OptionPickerSheet
 *
 * Bottom sheet glass com lista de opções selecionáveis.
 * Usado em configurações pra escolher sistema de casas, ayanamsa, etc.
 */

import { useEffect } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';
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

export interface PickerOption<V extends string> {
  value: V;
  label: string;
  caption?: string;
}

export interface OptionPickerSheetProps<V extends string> {
  visible: boolean;
  title: string;
  subtitle?: string;
  options: PickerOption<V>[];
  selected: V;
  onSelect: (value: V) => void;
  onDismiss: () => void;
}

export function OptionPickerSheet<V extends string>({
  visible,
  title,
  subtitle,
  options,
  selected,
  onSelect,
  onDismiss,
}: OptionPickerSheetProps<V>) {
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

  const handleSelect = (value: V) => {
    Haptics.selectionAsync().catch(() => {});
    onSelect(value);
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
            {title}
          </Text>

          {subtitle ? (
            <>
              <View style={{ height: spacing.xs }} />
              <Text variant="caption" color={semantic.textTertiary} align="center">
                {subtitle}
              </Text>
            </>
          ) : null}

          <View style={{ height: spacing.xl }} />

          <ScrollView
            style={styles.list}
            contentContainerStyle={{ paddingBottom: spacing.sm }}
          >
            {options.map((opt, idx) => {
              const isSelected = opt.value === selected;
              return (
                <Pressable
                  key={opt.value}
                  onPress={() => handleSelect(opt.value)}
                  style={({ pressed }) => [
                    styles.row,
                    idx === options.length - 1 && styles.rowLast,
                    isSelected && styles.rowSelected,
                    pressed && styles.rowPressed,
                  ]}
                >
                  <View style={styles.rowBody}>
                    <Text
                      variant="bodyEmphasis"
                      color={
                        isSelected ? palette.gold.glow : semantic.textPrimary
                      }
                    >
                      {opt.label}
                    </Text>
                    {opt.caption ? (
                      <>
                        <View style={{ height: 2 }} />
                        <Text variant="caption" color={semantic.textTertiary}>
                          {opt.caption}
                        </Text>
                      </>
                    ) : null}
                  </View>
                  <View
                    style={[
                      styles.radio,
                      isSelected && styles.radioSelected,
                    ]}
                  >
                    {isSelected ? <View style={styles.radioDot} /> : null}
                  </View>
                </Pressable>
              );
            })}
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
    maxHeight: '80%',
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
  list: {
    maxHeight: 420,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(245,244,240,0.06)',
    minHeight: 56,
  },
  rowLast: {
    borderBottomWidth: 0,
  },
  rowPressed: {
    backgroundColor: 'rgba(212,175,55,0.05)',
  },
  rowSelected: {
    backgroundColor: 'rgba(212,175,55,0.06)',
  },
  rowBody: {
    flex: 1,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: palette.silver.muted,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.md,
  },
  radioSelected: {
    borderColor: palette.gold.glow,
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: palette.gold.glow,
    shadowColor: palette.gold.pure,
    shadowOpacity: 0.8,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 0 },
  },
});
