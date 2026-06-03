/**
 * Atma Vedika — Mock Chart Service
 *
 * Simula o cálculo de mapa natal pelo backend.
 * Retorna o mock após delay realista (2.5s) com mensagens de progresso.
 */

import { mockBirthChart } from '@/mocks/birthChart';
import type { BirthChart } from '@/types/chart';
import type { OnboardingFormData } from '@/store/userStore';

export const calculationMantras = [
  'Alinhando os planetas do seu nascimento…',
  'Localizando seu nakshatra lunar…',
  'Calculando sua Vimshottari Dasha…',
  'Lendo os ciclos do seu karma…',
  'Decifrando seu mapa sagrado…',
] as const;

export async function mockCalculateBirthChart(
  data: OnboardingFormData,
  onProgress?: (mantraIndex: number) => void,
): Promise<BirthChart> {
  const totalDuration = 2800;
  const perMantra = Math.floor(totalDuration / calculationMantras.length);

  for (let i = 0; i < calculationMantras.length; i++) {
    onProgress?.(i);
    await new Promise((resolve) => setTimeout(resolve, perMantra));
  }

  // Personaliza o nome no mock
  return {
    ...mockBirthChart,
    userName: data.name || mockBirthChart.userName,
    birthPlace: data.birthPlace || mockBirthChart.birthPlace,
  };
}
