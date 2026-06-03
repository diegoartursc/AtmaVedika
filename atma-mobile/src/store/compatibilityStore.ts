/**
 * Atma Vedika — Compatibility Store
 *
 * Lista de parceiros salvos pra análise de compatibilidade.
 * Persistido via AsyncStorage.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { PartnerLite, PartnerSeed } from '@/services/compatibility';
import { buildPartnerChart } from '@/services/compatibility';

export interface SavedPartner {
  id: string;
  seed: PartnerSeed;
  chart: PartnerLite;
  savedAt: number;
}

interface CompatibilityState {
  partners: SavedPartner[];
  addPartner: (seed: PartnerSeed) => SavedPartner;
  removePartner: (id: string) => void;
}

function randomId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export const useCompatibilityStore = create<CompatibilityState>()(
  persist(
    (set) => ({
      partners: [],

      addPartner: (seed) => {
        const partner: SavedPartner = {
          id: randomId(),
          seed,
          chart: buildPartnerChart(seed),
          savedAt: Date.now(),
        };
        set((state) => ({ partners: [...state.partners, partner] }));
        return partner;
      },

      removePartner: (id) =>
        set((state) => ({
          partners: state.partners.filter((p) => p.id !== id),
        })),
    }),
    {
      name: 'atma-vedika-compat',
      storage: createJSONStorage(() => AsyncStorage),
      version: 1,
    },
  ),
);
