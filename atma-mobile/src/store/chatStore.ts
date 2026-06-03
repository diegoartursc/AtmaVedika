/**
 * Atma Vedika — Chat Store (Zustand)
 *
 * Gerencia o histórico de mensagens do chat com Veda.
 * Mensagens em memória (persistência via MMKV vem na Fase 11).
 *
 * Streaming: quando Veda responde, a última mensagem é marcada
 * `streaming: true` e seu conteúdo cresce por chunks.
 */

import { create } from 'zustand';

export type MessageRole = 'user' | 'veda';

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: number;
  /** True enquanto o conteúdo ainda está crescendo (typewriter). */
  streaming?: boolean;
}

interface ChatState {
  messages: ChatMessage[];
  /** Indica que o app está esperando OU recebendo resposta. */
  isResponding: boolean;

  appendUser: (content: string) => string;
  startVedaResponse: () => string;
  appendVedaChunk: (id: string, chunk: string) => void;
  finishVedaResponse: (id: string) => void;
  resetChat: () => void;
}

function randomId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  isResponding: false,

  appendUser: (content) => {
    const id = randomId();
    set((state) => ({
      messages: [
        ...state.messages,
        {
          id,
          role: 'user',
          content: content.trim(),
          timestamp: Date.now(),
        },
      ],
    }));
    return id;
  },

  startVedaResponse: () => {
    const id = randomId();
    set((state) => ({
      isResponding: true,
      messages: [
        ...state.messages,
        {
          id,
          role: 'veda',
          content: '',
          timestamp: Date.now(),
          streaming: true,
        },
      ],
    }));
    return id;
  },

  appendVedaChunk: (id, chunk) =>
    set((state) => ({
      messages: state.messages.map((m) =>
        m.id === id ? { ...m, content: m.content + chunk } : m,
      ),
    })),

  finishVedaResponse: (id) =>
    set((state) => ({
      isResponding: false,
      messages: state.messages.map((m) =>
        m.id === id ? { ...m, streaming: false } : m,
      ),
    })),

  resetChat: () => set({ messages: [], isResponding: false }),
}));
