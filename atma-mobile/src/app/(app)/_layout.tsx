/**
 * Atma Vedika — App Tabs (autenticado, pós-onboarding)
 *
 * Tabs do Expo Router SDK 56 (caminho `expo-router/js-tabs`).
 * Custom tab bar flutuante cósmica.
 */

import { Tabs } from 'expo-router/js-tabs';

import { CustomTabBar } from '@/components/navigation/CustomTabBar';
import { palette } from '@/theme/colors';

export default function AppLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: palette.void.abyss },
        animation: 'fade',
      }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tabs.Screen name="home" />
      <Tabs.Screen name="timeline" />
      <Tabs.Screen name="chat" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}
