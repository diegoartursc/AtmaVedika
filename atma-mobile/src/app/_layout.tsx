/**
 * Atma Vedika — Root Layout
 *
 * Carrega fontes sagradas, instala providers e governa a Stack root.
 * Mantém native splash até as fontes estarem prontas (zero flicker).
 * No web, engaiola tudo numa coluna de celular centralizada (WebFrame).
 */

// IMPORTANTE: roda antes de qualquer outro módulo que meça a janela.
import '@/web/viewport';

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
import Head from 'expo-router/head';
import * as SplashScreen from 'expo-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  LogBox,
  Platform,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';

import { palette } from '@/theme/colors';
import { FRAME_MAX_WIDTH } from '@/web/viewport';

// Polish global de web (suavização de fonte, fallback sans, scrollbar/seleção).
// No native o import é ignorado pelo Expo.
import '@/global.css';

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
      <Head>
        <title>Atma Vedika</title>
        <meta
          name="description"
          content="Conselheiro védico — seu mapa natal Jyotish lido com profundidade."
        />
      </Head>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <StatusBar style="light" />
          <WebFrame>
            <Stack
              screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: palette.void.abyss },
                animation: 'fade',
                animationDuration: 600,
              }}
            />
          </WebFrame>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

/**
 * No web, centraliza o app numa coluna de largura de celular sobre o vazio
 * cósmico. A largura vem de useWindowDimensions já "engaiolada" pelo patch
 * em '@/web/viewport' (min(janela, FRAME_MAX_WIDTH)). No native, passthrough.
 */
function WebFrame({ children }: { children: React.ReactNode }) {
  const { width } = useWindowDimensions();

  if (Platform.OS !== 'web') return <>{children}</>;

  return (
    <View style={styles.webOuter}>
      <View style={[styles.webColumn, { width }]}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  webOuter: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: palette.void.abyss,
  },
  webColumn: {
    flex: 1,
    maxWidth: FRAME_MAX_WIDTH,
    overflow: 'hidden',
  },
});
