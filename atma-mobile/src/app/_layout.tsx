/**
 * Atma Vedika — Root Layout
 *
 * Carrega fontes sagradas, instala providers e governa a Stack root.
 * Mantém native splash até as fontes estarem prontas (zero flicker).
 */

import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts as useInterFonts,
} from '@expo-google-fonts/inter';
import {
  PlayfairDisplay_400Regular,
  PlayfairDisplay_400Regular_Italic,
  PlayfairDisplay_700Bold,
  useFonts as usePlayfairFonts,
} from '@expo-google-fonts/playfair-display';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { LogBox, Platform } from 'react-native';

import { palette } from '@/theme/colors';

SplashScreen.preventAutoHideAsync().catch(() => {});

// Suprime warnings benignos no web (gesture-handler-2 propaga props RN-only).
LogBox.ignoreLogs([
  'Unknown event handler property',
  'Unexpected text node',
  'props.pointerEvents is deprecated',
  'shadow* style props are deprecated',
  'textShadow* style props are deprecated',
  'TouchableMixin is deprecated',
  'THREE.Clock',
  'THREE.WebGLRenderer: Context Lost',
]);

if (Platform.OS === 'web') {
  const SILENCED = [
    'Unknown event handler property',
    'Unexpected text node',
    'props.pointerEvents is deprecated',
    'shadow*',
    'textShadow*',
    'TouchableMixin is deprecated',
    'THREE.Clock',
    'THREE.WebGLRenderer: Context Lost',
  ];
  const wrap = (orig: (...args: unknown[]) => void) => (...args: unknown[]) => {
    const msg = args
      .map((a) => (typeof a === 'string' ? a : ''))
      .join(' ');
    if (SILENCED.some((s) => msg.includes(s))) return;
    orig(...args);
  };
  console.error = wrap(console.error.bind(console));
  console.warn = wrap(console.warn.bind(console));
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 1000 * 60 * 5 },
  },
});

export default function RootLayout() {
  const [interLoaded] = useInterFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  const [playfairLoaded] = usePlayfairFonts({
    PlayfairDisplay_400Regular,
    PlayfairDisplay_400Regular_Italic,
    PlayfairDisplay_700Bold,
  });

  const ready = interLoaded && playfairLoaded;

  useEffect(() => {
    if (ready) SplashScreen.hideAsync().catch(() => {});
  }, [ready]);

  if (!ready) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: palette.void.abyss }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <StatusBar style="light" />
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: palette.void.abyss },
              animation: 'fade',
              animationDuration: 600,
            }}
          />
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
