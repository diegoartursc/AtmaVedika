/**
 * Atma Vedika — User Store (Zustand)
 *
 * Estado global do usuário. Em produção, persiste via MMKV.
 * Por enquanto, segura em memória + mock.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { mockBirthChart } from '@/mocks/birthChart';
import type { BirthChart } from '@/types/chart';

export interface OnboardingFormData {
  name: string;
  birthDate: string;
  birthTime: string;
  birthPlace: string;
}

export type HouseSystem = 'whole-sign' | 'placidus' | 'equal';
export type Ayanamsa = 'lahiri' | 'krishnamurti' | 'raman';
export type ZodiacKind = 'sidereal' | 'tropical';
export type AppLanguage = 'pt' | 'en' | 'es';

export interface AppSettings {
  houseSystem: HouseSystem;
  ayanamsa: Ayanamsa;
  zodiac: ZodiacKind;
  language: AppLanguage;
  dailyNotifications: boolean;
}

interface UserState {
  isOnboarded: boolean;
  birthChart: BirthChart | null;
  freeMessagesRemaining: number;
  isPremium: boolean;

  /** Dados sendo coletados durante o onboarding. */
  onboarding: OnboardingFormData;

  /** True após o usuário ter visto o tutorial de gesto na Home. */
  hasSeenGestureHint: boolean;

  /** Data (YYYY-MM-DD) da última leitura diária consumida. */
  lastDailyReadAt: string | null;

  /** Configurações do app. */
  settings: AppSettings;

  setOnboarded: (value: boolean) => void;
  setBirthChart: (chart: BirthChart) => void;
  consumeMessage: () => void;
  upgradeToPremium: () => void;

  setOnboardingField: <K extends keyof OnboardingFormData>(
    key: K,
    value: OnboardingFormData[K],
  ) => void;
  resetOnboarding: () => void;
  /** Pré-preenche o form de onboarding com os dados do mapa atual (pra edição). */
  prefillOnboardingFromChart: () => void;
  dismissGestureHint: () => void;
  markDailyRead: (dateStr: string) => void;

  setSetting: <K extends keyof AppSettings>(
    key: K,
    value: AppSettings[K],
  ) => void;

  /** DEV: carrega mock instantâneo (atalho de desenvolvimento). */
  loadMock: () => void;
}

const DEFAULT_SETTINGS: AppSettings = {
  houseSystem: 'whole-sign',
  ayanamsa: 'lahiri',
  zodiac: 'sidereal',
  language: 'pt',
  dailyNotifications: true,
};

const EMPTY_ONBOARDING: OnboardingFormData = {
  name: '',
  birthDate: '',
  birthTime: '',
  birthPlace: '',
};

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      isOnboarded: false,
      birthChart: null,
      freeMessagesRemaining: 3,
      isPremium: false,
      onboarding: EMPTY_ONBOARDING,
      hasSeenGestureHint: false,
      lastDailyReadAt: null,
      settings: DEFAULT_SETTINGS,

      setOnboarded: (value) => set({ isOnboarded: value }),
      setBirthChart: (birthChart) => set({ birthChart, isOnboarded: true }),
      consumeMessage: () =>
        set((state) => ({
          freeMessagesRemaining: Math.max(0, state.freeMessagesRemaining - 1),
        })),
      upgradeToPremium: () => set({ isPremium: true }),

      setOnboardingField: (key, value) =>
        set((state) => ({
          onboarding: { ...state.onboarding, [key]: value },
        })),
      resetOnboarding: () =>
        set({
          onboarding: EMPTY_ONBOARDING,
          isOnboarded: false,
          birthChart: null,
          hasSeenGestureHint: false,
        }),
      prefillOnboardingFromChart: () =>
        set((state) => {
          if (!state.birthChart) return {};
          // birthDate vem como YYYY-MM-DD, convertemos pra DD/MM/AAAA
          const [y, m, d] = state.birthChart.birthDate.split('-');
          return {
            onboarding: {
              name: state.birthChart.userName,
              birthDate: `${d}/${m}/${y}`,
              birthTime: state.birthChart.birthTime,
              birthPlace: state.birthChart.birthPlace,
            },
          };
        }),
      dismissGestureHint: () => set({ hasSeenGestureHint: true }),
      markDailyRead: (dateStr) => set({ lastDailyReadAt: dateStr }),

      setSetting: (key, value) =>
        set((state) => ({
          settings: { ...state.settings, [key]: value },
        })),

      loadMock: () =>
        set({
          birthChart: mockBirthChart,
          isOnboarded: true,
        }),
    }),
    {
      name: 'atma-vedika-user',
      storage: createJSONStorage(() => AsyncStorage),
      // Não persistir loadMock — só dados de estado real
      partialize: (state) => ({
        isOnboarded: state.isOnboarded,
        birthChart: state.birthChart,
        freeMessagesRemaining: state.freeMessagesRemaining,
        isPremium: state.isPremium,
        onboarding: state.onboarding,
        hasSeenGestureHint: state.hasSeenGestureHint,
        lastDailyReadAt: state.lastDailyReadAt,
        settings: state.settings,
      }),
      version: 1,
    },
  ),
);
