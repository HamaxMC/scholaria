import { useState, useEffect } from "react";
import { useAuth } from "@/features/auth/auth-context";
import { messagingService } from "./messaging-service";
import type { Message, Chat, ChatGroup } from "@/types/messaging";

export function useMessaging() {
  const { user } = useAuth();
  const [chats, setChats] = useState<Chat[]>([]);
  const [groups, setGroups] = useState<ChatGroup[]>([]);
  const [currentMessages, setCurrentMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!user) return;

    // Subscribe to user's chats
    const unsubscribeChats = messagingService.subscribeToChats(
      user.uid,
      (updatedChats) => {
        setChats(updatedChats);
        setLoading(false);
      }
    );

    // Subscribe to user's groups
    const unsubscribeGroups = messagingService.subscribeToGroups(
      user.uid,
      (updatedGroups) => {
        setGroups(updatedGroups);
        setLoading(false);
      }
    );

    return () => {
      unsubscribeChats();
      unsubscribeGroups();
    };
  }, [user]);

  const sendMessage = async (
    content: string,
    receiverId?: string,
    groupId?: string
  ) => {
    if (!user) return;

    try {
      await messagingService.sendMessage(
        content,
        user.uid,
        receiverId,
        groupId
      );
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  const loadChatMessages = (chatId: string) => {
    if (!user) return;

    return messagingService.subscribeToMessages(chatId, (messages) => {
      setCurrentMessages(messages);
    });
  };

  const markMessagesAsRead = async (chatId: string) => {
    if (!user) return;

    try {
      await messagingService.markMessagesAsRead(chatId, user.uid);
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  return {
    chats,
    groups,
    currentMessages,
    loading,
    error,
    sendMessage,
    loadChatMessages,
    markMessagesAsRead,
  };
}
