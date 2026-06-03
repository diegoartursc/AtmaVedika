/**
 * Atma Vedika — CustomTabBar
 *
 * Tab bar flutuante com glass effect.
 * Indicador dourado desliza com spring entre as tabs.
 *
 * Recebe BottomTabBarProps do Expo Router (compatível com <Tabs tabBar={...}>).
 */

import { useEffect } from 'react';
import {
  Platform,
  Pressable,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import Animated, {
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { BottomTabBarProps } from 'expo-router/js-tabs';

import { Text } from '@/components/primitives/Text';
import { TAB_ICONS, type TabRouteName } from './TabIcons';
import { palette, semantic } from '@/theme/colors';
import { duration, spring } from '@/theme/motion';
import { radii } from '@/theme/radii';
import { spacing } from '@/theme/spacing';

interface TabConfig {
  name: TabRouteName;
  label: string;
}

const TAB_META: Record<string, TabConfig> = {
  home: { name: 'home', label: 'mapa' },
  timeline: { name: 'timeline', label: 'ciclos' },
  chat: { name: 'chat', label: 'veda' },
  profile: { name: 'profile', label: 'perfil' },
};

const BAR_HEIGHT = 64;
const BAR_HORIZONTAL_MARGIN = 16;

export function CustomTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const barWidth = width - BAR_HORIZONTAL_MARGIN * 2;
  // Apenas as rotas que conhecemos (ignora "_layout" e afins)
  const visibleRoutes = state.routes.filter((r) => TAB_META[r.name]);
  const slotWidth = barWidth / visibleRoutes.length;

  // Acha o índice da rota ativa entre as rotas visíveis
  const activeName = state.routes[state.index]?.name;
  const activeIdx = Math.max(
    0,
    visibleRoutes.findIndex((r) => r.name === activeName),
  );

  const indicatorX = useSharedValue(activeIdx * slotWidth);

  useEffect(() => {
    indicatorX.value = withSpring(activeIdx * slotWidth, spring.sacred);
  }, [activeIdx, slotWidth, indicatorX]);

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: indicatorX.value }],
    width: slotWidth,
  }));

  return (
    <View
      pointerEvents="box-none"
      style={[
        styles.wrapper,
        { paddingBottom: Math.max(insets.bottom, spacing.md) },
      ]}
    >
      <View style={[styles.bar, { width: barWidth, height: BAR_HEIGHT }]}>
        {/* Background: glass on iOS, solid on Android */}
        {Platform.OS === 'ios' ? (
          <BlurView
            intensity={50}
            tint="dark"
            style={StyleSheet.absoluteFill}
          />
        ) : (
          <View
            style={[
              StyleSheet.absoluteFill,
              { backgroundColor: 'rgba(11, 8, 32, 0.92)' },
            ]}
          />
        )}
        <View style={[StyleSheet.absoluteFill, styles.barTint]} />
        <View style={[StyleSheet.absoluteFill, styles.barBorder]} />

        {/* Indicador dourado deslizante */}
        <Animated.View style={[styles.indicator, indicatorStyle]}>
          <View style={styles.indicatorPill} />
        </Animated.View>

        {/* Tabs */}
        <View style={styles.row}>
          {visibleRoutes.map((route, idx) => {
            const meta = TAB_META[route.name];
            if (!meta) return null;
            const isFocused = idx === activeIdx;
            const { options } = descriptors[route.key];

            const onPress = () => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });
              if (!isFocused && !event.defaultPrevented) {
                Haptics.selectionAsync().catch(() => {});
                navigation.navigate(route.name);
              }
            };

            const onLongPress = () => {
              navigation.emit({ type: 'tabLongPress', target: route.key });
            };

            return (
              <TabSlot
                key={route.key}
                meta={meta}
                width={slotWidth}
                focused={isFocused}
                accessibilityLabel={
                  options.tabBarAccessibilityLabel ?? meta.label
                }
                onPress={onPress}
                onLongPress={onLongPress}
              />
            );
          })}
        </View>
      </View>
    </View>
  );
}

interface TabSlotProps {
  meta: TabConfig;
  width: number;
  focused: boolean;
  accessibilityLabel: string;
  onPress: () => void;
  onLongPress: () => void;
}

function TabSlot({
  meta,
  width,
  focused,
  accessibilityLabel,
  onPress,
  onLongPress,
}: TabSlotProps) {
  const t = useSharedValue(focused ? 1 : 0);

  useEffect(() => {
    t.value = withTiming(focused ? 1 : 0, { duration: duration.base });
  }, [focused, t]);

  const iconWrapStyle = useAnimatedStyle(() => ({
    transform: [{ scale: interpolate(t.value, [0, 1], [1, 1.12]) }],
  }));

  const labelStyle = useAnimatedStyle(() => ({
    opacity: interpolate(t.value, [0, 1], [0.55, 1]),
    color: interpolateColor(
      t.value,
      [0, 1],
      [palette.silver.muted, palette.gold.glow],
    ),
  }));

  const Icon = TAB_ICONS[meta.name];

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      onLongPress={onLongPress}
      style={[styles.slot, { width }]}
      android_ripple={{ color: 'rgba(212,175,55,0.08)', borderless: true }}
    >
      <Animated.View style={iconWrapStyle}>
        <Icon size={22} progress={t} />
      </Animated.View>
      <View style={{ height: 4 }} />
      <Animated.Text style={[styles.label, labelStyle]}>
        {meta.label}
      </Animated.Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    zIndex: 100,
  },
  bar: {
    borderRadius: radii.pill,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.5,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 12 },
    elevation: 24,
  },
  barTint: {
    backgroundColor: 'rgba(2,1,8,0.25)',
    borderRadius: radii.pill,
  },
  barBorder: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: semantic.border,
    borderRadius: radii.pill,
  },
  row: {
    flexDirection: 'row',
    height: '100%',
    alignItems: 'center',
  },
  slot: {
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  symbol: {
    fontSize: 22,
    lineHeight: 24,
    textShadowColor: palette.gold.pure,
    textShadowOffset: { width: 0, height: 0 },
  },
  label: {
    fontSize: 9,
    letterSpacing: 2,
    textTransform: 'uppercase',
    fontWeight: '500',
  },
  indicator: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  indicatorPill: {
    position: 'absolute',
    top: 4,
    width: 32,
    height: 3,
    borderRadius: 999,
    backgroundColor: palette.gold.glow,
    shadowColor: palette.gold.pure,
    shadowOpacity: 0.9,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 0 },
  },
});

export const TAB_BAR_HEIGHT = BAR_HEIGHT + spacing.md;
