/**
 * Atma Vedika — Tab Mapa
 *
 * Feed cósmico com 8 temas védicos navegáveis via gestos TikTok-style.
 * Header mostra o nome do capítulo atual em destaque.
 */

import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CosmicBackground } from '@/components/effects/CosmicBackground';
import { DailyReadingBadge } from '@/components/home/DailyReadingBadge';
import { DailyReadingSheet } from '@/components/home/DailyReadingSheet';
import { Text } from '@/components/primitives/Text';
import { TAB_BAR_HEIGHT } from '@/components/navigation/CustomTabBar';
import { HouseInfoSheet } from '@/components/profile/HouseInfoSheet';
import { OnboardingHint } from '@/features/navigation/OnboardingHint';
import { TikTokNavigator } from '@/features/navigation/TikTokNavigator';
import { buildVedicThemes } from '@/mocks/themes';
import { mockBirthChart } from '@/mocks/birthChart';
import {
  buildDailyReading,
  isDailyReadingFresh,
} from '@/services/dailyReading';
import { useUserStore } from '@/store/userStore';
import { semantic } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import type { HouseInfo } from '@/types/chart';

const HEADER_HEIGHT = 92;

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const chart = useUserStore((s) => s.birthChart) ?? mockBirthChart;
  const hasSeenHint = useUserStore((s) => s.hasSeenGestureHint);
  const dismissHint = useUserStore((s) => s.dismissGestureHint);
  const lastDailyReadAt = useUserStore((s) => s.lastDailyReadAt);
  const markDailyRead = useUserStore((s) => s.markDailyRead);

  const themes = useMemo(() => buildVedicThemes(chart), [chart]);
  const dailyReading = useMemo(() => buildDailyReading(chart), [chart]);
  const isDailyUnread = isDailyReadingFresh(lastDailyReadAt);

  const [selectedHouse, setSelectedHouse] = useState<HouseInfo | null>(null);
  const [currentThemeIdx, setCurrentThemeIdx] = useState(0);
  const [dailyVisible, setDailyVisible] = useState(false);

  const topInset = insets.top + HEADER_HEIGHT;
  const bottomInset = TAB_BAR_HEIGHT + Math.max(insets.bottom, spacing.md);

  const currentTheme = themes[currentThemeIdx] ?? themes[0];
  const firstName = chart.userName.split(' ')[0];

  return (
    <CosmicBackground vignettes>
      {/* Header flutuante: nome do capítulo + saudação pequena */}
      <View
        pointerEvents="box-none"
        style={[
          styles.header,
          { paddingTop: insets.top + spacing.sm, height: topInset },
        ]}
      >
        <View style={styles.headerLeft}>
          <Text variant="ritual" color={semantic.textGold}>
            ✦  {currentTheme.shortName}  ✦
          </Text>
          <View style={{ height: spacing.xxs }} />
          <Text variant="caption" color={semantic.textTertiary}>
            olá, {firstName} · {currentThemeIdx + 1}/{themes.length}
          </Text>
        </View>

        <DailyReadingBadge
          symbol={dailyReading.symbol}
          rulerColor={dailyReading.rulerColor}
          brief={dailyReading.brief}
          isNew={isDailyUnread}
          onPress={() => setDailyVisible(true)}
        />
      </View>

      <View
        style={[styles.navigatorWrap, { marginTop: topInset, marginBottom: bottomInset }]}
      >
        <TikTokNavigator
          themes={themes}
          chart={chart}
          selectedHouseNumber={selectedHouse?.number ?? null}
          onHouseSelect={setSelectedHouse}
          topInset={topInset}
          bottomInset={bottomInset}
          onFirstGesture={dismissHint}
          onThemeChange={setCurrentThemeIdx}
        />
      </View>

      <OnboardingHint visible={!hasSeenHint} onDismiss={dismissHint} />

      <HouseInfoSheet
        house={selectedHouse}
        chart={chart}
        onDismiss={() => setSelectedHouse(null)}
      />

      <DailyReadingSheet
        visible={dailyVisible}
        reading={dailyReading}
        isUnread={isDailyUnread}
        userName={chart.userName}
        onMarkRead={() => markDailyRead(dailyReading.date)}
        onDismiss={() => setDailyVisible(false)}
      />
    </CosmicBackground>
  );
}

const styles = StyleSheet.create({
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: spacing.xl,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    zIndex: 60,
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    paddingBottom: 2,
  },
  navigatorWrap: {
    flex: 1,
  },
});

