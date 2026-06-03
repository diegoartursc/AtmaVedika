/**
 * Atma Vedika — MessagesList
 *
 * Lista de mensagens do chat (FlatList inverted, scroll natural pra cima).
 * Auto-scroll suave quando novas mensagens chegam.
 */

import { useEffect, useRef } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';

import { MessageBubble } from './MessageBubble';
import { spacing } from '@/theme/spacing';
import type { ChatMessage } from '@/store/chatStore';

export interface MessagesListProps {
  messages: ChatMessage[];
  /** Padding inferior para não esconder atrás do input. */
  bottomInset: number;
  /** Padding superior para não esconder atrás do header. */
  topInset: number;
}

export function MessagesList({
  messages,
  bottomInset,
  topInset,
}: MessagesListProps) {
  // Invertemos a lista para usar com FlatList inverted=true (chat-style).
  const inverted = [...messages].reverse();
  const listRef = useRef<FlatList<ChatMessage>>(null);

  // Quando chega msg nova, scroll suave pro fim (visualmente: topo, porque inverted).
  useEffect(() => {
    if (messages.length === 0) return;
    requestAnimationFrame(() => {
      listRef.current?.scrollToOffset({ offset: 0, animated: true });
    });
  }, [messages.length]);

  return (
    <FlatList
      ref={listRef}
      data={inverted}
      keyExtractor={(m) => m.id}
      inverted
      renderItem={({ item }) => <MessageBubble message={item} />}
      contentContainerStyle={[
        styles.content,
        {
          paddingTop: bottomInset + spacing.lg,
          paddingBottom: topInset + spacing.lg,
        },
      ]}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
    />
  );
}

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
  },
  separator: {
    height: spacing.xs,
  },
});
