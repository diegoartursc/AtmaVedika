/**
 * Atma Vedika — TikTokNavigator
 *
 * Motor de gestos 2D estilo TikTok:
 *   ↕  vertical    → troca de TEMA (snap, reset depth para 0)
 *   ↔  horizontal  → troca de CAMADA dentro do tema atual
 *
 * Fluidez: o fade/scale dos cards acompanha o dedo em tempo real
 * (live distance), há resistência (rubber-band) nas bordas, e o
 * glow de fundo morfa de cor conforme o arraste.
 *
 * Suporta teclado (web): setas ↑↓←→ disparam os mesmos snaps.
 */

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Platform,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
  type SharedValue,
} from 'react-native-reanimated';

import { ThemeIndicator } from './ThemeIndicator';
import { ThemeLayerCard } from './ThemeLayerCard';
import { AmbientGlow } from '@/components/effects/AmbientGlow';
import type { VedicTheme } from '@/mocks/themes';
import type { BirthChart, HouseInfo } from '@/types/chart';

export interface TikTokNavigatorProps {
  themes: VedicTheme[];
  chart?: BirthChart;
  selectedHouseNumber?: number | null;
  onHouseSelect?: (house: HouseInfo) => void;
  onFirstGesture?: () => void;
  /** Disparado ao mudar o tema atual (espelhado no JS). */
  onThemeChange?: (themeIndex: number) => void;
  bottomInset?: number;
  topInset?: number;
}

const SNAP_VELOCITY = 140;
const SNAP_RATIO = 0.06;
const AXIS_LOCK_THRESHOLD = 12;
/** Glide suave, sem bounce visível (ratio ~0.82). */
const SNAP_SPRING = { mass: 1, damping: 22, stiffness: 180 };
/** Resistência ao arrastar além dos limites (0 = trava, 1 = livre). */
const EDGE_RESISTANCE = 0.28;

function clamp(value: number, min: number, max: number): number {
  'worklet';
  return Math.max(min, Math.min(max, value));
}

function selectionHaptic() {
  Haptics.selectionAsync().catch(() => {});
}

export function TikTokNavigator({
  themes,
  chart,
  selectedHouseNumber,
  onHouseSelect,
  onFirstGesture,
  onThemeChange,
  bottomInset = 0,
  topInset = 0,
}: TikTokNavigatorProps) {
  const { width, height } = useWindowDimensions();
  const viewportH = height - bottomInset - topInset;

  const themeIdx = useSharedValue(0);
  const depthIdx = useSharedValue(0);
  const dragX = useSharedValue(0);
  const dragY = useSharedValue(0);
  const axis = useSharedValue<'none' | 'x' | 'y'>('none');
  const gestureUsed = useSharedValue(false);

  const [currentTheme, setCurrentTheme] = useState(0);
  const [currentLayer, setCurrentLayer] = useState(0);
  const currentLayerCount = themes[currentTheme]?.layers.length ?? 1;

  // Posições "live" — incluem o offset do arraste. É o que faz o
  // conteúdo acompanhar o dedo em tempo real.
  const liveTheme = useDerivedValue(
    () => themeIdx.value - dragY.value / viewportH,
  );
  const liveDepth = useDerivedValue(
    () => depthIdx.value - dragX.value / width,
  );

  useAnimatedReaction(
    () => Math.round(themeIdx.value),
    (rounded, prev) => {
      if (rounded !== prev) {
        runOnJS(setCurrentTheme)(rounded);
        if (onThemeChange) runOnJS(onThemeChange)(rounded);
      }
    },
  );

  useAnimatedReaction(
    () => Math.round(depthIdx.value),
    (rounded, prev) => {
      if (rounded !== prev) runOnJS(setCurrentLayer)(rounded);
    },
  );

  const fireFirstGesture = useCallback(() => {
    if (onFirstGesture) onFirstGesture();
  }, [onFirstGesture]);

  // ─── Step API (compartilhada entre pan e teclado) ──────
  const stepTheme = useCallback(
    (dir: 1 | -1) => {
      const current = Math.round(themeIdx.value);
      const next = Math.max(0, Math.min(themes.length - 1, current + dir));
      if (next === current) return;
      themeIdx.value = withSpring(next, SNAP_SPRING);
      depthIdx.value = withSpring(0, SNAP_SPRING);
      selectionHaptic();
    },
    [themes.length, themeIdx, depthIdx],
  );

  const stepLayer = useCallback(
    (dir: 1 | -1) => {
      const t = Math.round(themeIdx.value);
      const layers = themes[t]?.layers.length ?? 1;
      const current = Math.round(depthIdx.value);
      const next = Math.max(0, Math.min(layers - 1, current + dir));
      if (next === current) return;
      depthIdx.value = withSpring(next, SNAP_SPRING);
      selectionHaptic();
    },
    [themes, themeIdx, depthIdx],
  );

  // ─── Keyboard nav (web) ─────────────────────────────────
  useEffect(() => {
    if (Platform.OS !== 'web') return;
    if (typeof window === 'undefined') return;
    const handler = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowDown':
        case 'PageDown':
          e.preventDefault();
          stepTheme(1);
          gestureUsed.value = true;
          fireFirstGesture();
          break;
        case 'ArrowUp':
        case 'PageUp':
          e.preventDefault();
          stepTheme(-1);
          gestureUsed.value = true;
          fireFirstGesture();
          break;
        case 'ArrowRight':
          e.preventDefault();
          stepLayer(1);
          gestureUsed.value = true;
          fireFirstGesture();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          stepLayer(-1);
          gestureUsed.value = true;
          fireFirstGesture();
          break;
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [stepTheme, stepLayer, gestureUsed, fireFirstGesture]);

  // ─── Pan gesture ────────────────────────────────────────
  const pan = Gesture.Pan()
    .onStart(() => {
      axis.value = 'none';
    })
    .onUpdate((e) => {
      const ax = Math.abs(e.translationX);
      const ay = Math.abs(e.translationY);
      // Lock axis quando uma direção dominar
      if (axis.value === 'none' && Math.max(ax, ay) > AXIS_LOCK_THRESHOLD) {
        axis.value = ax > ay ? 'x' : 'y';
        if (!gestureUsed.value) {
          gestureUsed.value = true;
          runOnJS(fireFirstGesture)();
        }
      }

      if (axis.value === 'y') {
        let ty = e.translationY;
        // Resistência nas bordas (primeiro tema puxando ↓, último puxando ↑)
        const cur = Math.round(themeIdx.value);
        const atTop = cur === 0 && ty > 0;
        const atBottom = cur === themes.length - 1 && ty < 0;
        if (atTop || atBottom) ty *= EDGE_RESISTANCE;
        dragY.value = ty;
        dragX.value = 0;
      } else if (axis.value === 'x') {
        let tx = e.translationX;
        const curD = Math.round(depthIdx.value);
        const layers = themes[Math.round(themeIdx.value)]?.layers.length ?? 1;
        const atStart = curD === 0 && tx > 0;
        const atEnd = curD === layers - 1 && tx < 0;
        if (atStart || atEnd) tx *= EDGE_RESISTANCE;
        dragX.value = tx;
        dragY.value = 0;
      }
    })
    .onEnd((e) => {
      const axisLocal = axis.value;
      axis.value = 'none';

      if (axisLocal === 'y') {
        const distance = e.translationY;
        const velocity = e.velocityY;
        const advance =
          Math.abs(velocity) > SNAP_VELOCITY ||
          Math.abs(distance) > viewportH * SNAP_RATIO;
        if (advance) {
          const dir = distance + velocity * 0.15 < 0 ? 1 : -1;
          const current = Math.round(themeIdx.value);
          const next = clamp(current + dir, 0, themes.length - 1);
          if (next !== current) {
            themeIdx.value = withSpring(next, SNAP_SPRING);
            depthIdx.value = withSpring(0, SNAP_SPRING);
            runOnJS(selectionHaptic)();
          }
        }
        dragY.value = withSpring(0, SNAP_SPRING);
      } else if (axisLocal === 'x') {
        const distance = e.translationX;
        const velocity = e.velocityX;
        const t = Math.round(themeIdx.value);
        const layers = themes[t]?.layers.length ?? 1;
        const advance =
          Math.abs(velocity) > SNAP_VELOCITY ||
          Math.abs(distance) > width * SNAP_RATIO;
        if (advance) {
          const dir = distance + velocity * 0.15 < 0 ? 1 : -1;
          const current = Math.round(depthIdx.value);
          const next = clamp(current + dir, 0, layers - 1);
          if (next !== current) {
            depthIdx.value = withSpring(next, SNAP_SPRING);
            runOnJS(selectionHaptic)();
          }
        }
        dragX.value = withSpring(0, SNAP_SPRING);
      } else {
        dragX.value = withSpring(0, SNAP_SPRING);
        dragY.value = withSpring(0, SNAP_SPRING);
      }
    })
    .onFinalize(() => {
      axis.value = 'none';
    });

  const containerStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: -themeIdx.value * viewportH + dragY.value }],
  }));

  const accents = useMemo(() => themes.map((t) => t.accent), [themes]);

  return (
    <View style={[styles.viewport, { height: viewportH }]}>
      {/* Glow morfa de cor acompanhando o arraste (liveTheme) */}
      <AmbientGlow accents={accents} themeIdx={liveTheme} />

      <GestureDetector gesture={pan}>
        <Animated.View style={[styles.stack, containerStyle]}>
          {themes.map((theme, ti) => (
            <ThemeSlot
              key={theme.id}
              theme={theme}
              ti={ti}
              themeIdx={themeIdx}
              depthIdx={depthIdx}
              dragX={dragX}
              liveTheme={liveTheme}
              liveDepth={liveDepth}
              width={width}
              height={viewportH}
              chart={chart}
              selectedHouseNumber={selectedHouseNumber}
              onHouseSelect={onHouseSelect}
            />
          ))}
        </Animated.View>
      </GestureDetector>

      <ThemeIndicator
        themeCount={themes.length}
        themeIdx={themeIdx}
        layerCount={currentLayerCount}
        depthIdx={depthIdx}
        currentLayer={currentLayer}
      />
    </View>
  );
}

interface ThemeSlotProps {
  theme: VedicTheme;
  ti: number;
  themeIdx: SharedValue<number>;
  depthIdx: SharedValue<number>;
  dragX: SharedValue<number>;
  liveTheme: SharedValue<number>;
  liveDepth: SharedValue<number>;
  width: number;
  height: number;
  chart?: BirthChart;
  selectedHouseNumber?: number | null;
  onHouseSelect?: (house: HouseInfo) => void;
}

function ThemeSlot({
  theme,
  ti,
  themeIdx,
  depthIdx,
  dragX,
  liveTheme,
  liveDepth,
  width,
  height,
  chart,
  selectedHouseNumber,
  onHouseSelect,
}: ThemeSlotProps) {
  const wrapperStyle = useAnimatedStyle(() => ({
    top: ti * height,
  }));

  const railStyle = useAnimatedStyle(() => {
    const rounded = Math.round(themeIdx.value);
    const isCurrent = rounded === ti;
    const offset = isCurrent
      ? -depthIdx.value * width + dragX.value
      : -depthIdx.value * width;
    return {
      transform: [{ translateX: offset }],
    };
  });

  return (
    <Animated.View
      style={[
        styles.themeSlot,
        { width, height },
        wrapperStyle,
      ]}
    >
      <Animated.View
        style={[
          styles.rail,
          { width: width * theme.layers.length, height },
          railStyle,
        ]}
      >
        {theme.layers.map((layer, li) => (
          <LayerSlot
            key={layer.id}
            layer={layer}
            ti={ti}
            li={li}
            accent={theme.accent}
            symbol={theme.symbol}
            liveTheme={liveTheme}
            liveDepth={liveDepth}
            width={width}
            chart={chart}
            selectedHouseNumber={selectedHouseNumber}
            onHouseSelect={onHouseSelect}
          />
        ))}
      </Animated.View>
    </Animated.View>
  );
}

interface LayerSlotProps {
  layer: VedicTheme['layers'][number];
  ti: number;
  li: number;
  accent: string;
  symbol: string;
  liveTheme: SharedValue<number>;
  liveDepth: SharedValue<number>;
  width: number;
  chart?: BirthChart;
  selectedHouseNumber?: number | null;
  onHouseSelect?: (house: HouseInfo) => void;
}

function LayerSlot({
  layer,
  ti,
  li,
  accent,
  symbol,
  liveTheme,
  liveDepth,
  width,
  chart,
  selectedHouseNumber,
  onHouseSelect,
}: LayerSlotProps) {
  // Distância LIVE — acompanha o dedo. Eixo dominante decide o fade.
  const distance = useDerivedValue(() => {
    const dT = liveTheme.value - ti;
    const dL = liveDepth.value - li;
    const d = Math.abs(dT) > Math.abs(dL) ? dT : dL;
    return Math.max(-1.5, Math.min(1.5, d));
  });

  return (
    <View style={[styles.layerSlot, { width }]}>
      <ThemeLayerCard
        layer={layer}
        distance={distance}
        accent={accent}
        symbol={symbol}
        chart={chart}
        selectedHouseNumber={selectedHouseNumber}
        onHouseSelect={onHouseSelect}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  viewport: {
    width: '100%',
    overflow: 'hidden',
  },
  stack: {
    width: '100%',
    height: '100%',
  },
  themeSlot: {
    position: 'absolute',
    left: 0,
    overflow: 'hidden',
  },
  rail: {
    flexDirection: 'row',
  },
  layerSlot: {
    height: '100%',
  },
});
