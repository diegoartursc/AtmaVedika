/**
 * Atma Vedika — Web viewport frame
 *
 * Um app de celular esticado na largura inteira de um navegador desktop
 * parece quebrado/amador. Aqui a gente "engaiola" a largura reportada por
 * `Dimensions` / `useWindowDimensions` numa coluna de tamanho de celular —
 * assim TODO componente (inclusive o motor de gestos TikTok, que mede a
 * janela diretamente) se dimensiona dentro da coluna. O layout raiz então
 * centraliza essa coluna sobre o vazio cósmico.
 *
 * No native nada disso roda — é passthrough total.
 */

import { Dimensions, Platform } from 'react-native';

/** Largura máxima da coluna no web (≈ um celular grande). */
export const FRAME_MAX_WIDTH = 460;

interface WinDims {
  width: number;
  height: number;
  scale: number;
  fontScale: number;
}

function clampWindow<T extends { width: number }>(win: T): T {
  if (win == null) return win;
  const innerW =
    typeof window !== 'undefined' && window.innerWidth
      ? window.innerWidth
      : win.width;
  const width = Math.min(innerW, FRAME_MAX_WIDTH);
  if (width === win.width) return win;
  return { ...win, width };
}

if (Platform.OS === 'web') {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const D = Dimensions as any;

  const origGet = D.get.bind(D);
  D.get = (dim: string) => {
    const val = origGet(dim);
    return dim === 'window' ? clampWindow(val as WinDims) : val;
  };

  // useWindowDimensions usa o payload do evento (não Dimensions.get) no
  // resize — então precisamos engaiolar o payload também, mapeando o
  // handler original → embrulhado pra remoção funcionar.
  type ChangeHandler = (dims: { window: WinDims; screen: WinDims }) => void;
  const wrapped = new WeakMap<object, ChangeHandler>();

  const origAdd = D.addEventListener.bind(D);
  D.addEventListener = (type: string, handler: ChangeHandler) => {
    if (type !== 'change') return origAdd(type, handler);
    const w: ChangeHandler = (dims) =>
      handler({ ...dims, window: clampWindow(dims.window) });
    wrapped.set(handler as unknown as object, w);
    return origAdd(type, w);
  };

  if (typeof D.removeEventListener === 'function') {
    const origRemove = D.removeEventListener.bind(D);
    D.removeEventListener = (type: string, handler: ChangeHandler) => {
      const w = wrapped.get(handler as unknown as object) ?? handler;
      return origRemove(type, w);
    };
  }
}
