import {
  collection,
  query,
  where,
  orderBy,
  limit,
  addDoc,
  updateDoc,
  doc,
  getDocs,
  onSnapshot,
  Timestamp,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Message, Chat, ChatGroup } from "@/types/messaging";

export const messagingService = {
  // Send a new message
  async sendMessage(
    content: string,
    senderId: string,
    receiverId?: string,
    groupId?: string
  ) {
    try {
      const messageData = {
        content,
        senderId,
        receiverId,
        groupId,
        timestamp: serverTimestamp(),
        read: false,
      };

      const docRef = await addDoc(collection(db, "messages"), messageData);

      // Update last message in chat or group
      if (receiverId) {
        const chatQuery = query(
          collection(db, "chats"),
          where("participants", "array-contains-any", [senderId, receiverId])
        );
        const chatSnapshot = await getDocs(chatQuery);

        if (!chatSnapshot.empty) {
          const chatDoc = chatSnapshot.docs[0];
          await updateDoc(doc(db, "chats", chatDoc.id), {
            lastMessage: messageData,
            updatedAt: serverTimestamp(),
          });
        }
      }

      return docRef.id;
    } catch (error) {
      console.error("Error sending message:", error);
      throw error;
    }
  },

  // Get messages for a chat
  subscribeToMessages(chatId: string, callback: (messages: Message[]) => void) {
    const messagesQuery = query(
      collection(db, "messages"),
      where("chatId", "==", chatId),
      orderBy("timestamp", "desc"),
      limit(50)
    );

    return onSnapshot(messagesQuery, (snapshot) => {
      const messages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        timestamp: (doc.data().timestamp as Timestamp).toDate(),
      })) as Message[];

      callback(messages);
    });
  },

  // Get user's chats
  subscribeToChats(userId: string, callback: (chats: Chat[]) => void) {
    const chatsQuery = query(
      collection(db, "chats"),
      where("participants", "array-contains", userId),
      orderBy("updatedAt", "desc")
    );

    return onSnapshot(chatsQuery, (snapshot) => {
      const chats = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: (doc.data().createdAt as Timestamp).toDate(),
        updatedAt: (doc.data().updatedAt as Timestamp).toDate(),
      })) as Chat[];

      callback(chats);
    });
  },

  // Get user's groups
  subscribeToGroups(userId: string, callback: (groups: ChatGroup[]) => void) {
    const groupsQuery = query(
      collection(db, "groups"),
      where("members", "array-contains", userId),
      orderBy("updatedAt", "desc")
    );

    return onSnapshot(groupsQuery, (snapshot) => {
      const groups = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: (doc.data().createdAt as Timestamp).toDate(),
        updatedAt: (doc.data().updatedAt as Timestamp).toDate(),
      })) as ChatGroup[];

      callback(groups);
    });
  },

  // Mark messages as read
  async markMessagesAsRead(chatId: string, userId: string) {
    const messagesQuery = query(
      collection(db, "messages"),
      where("chatId", "==", chatId),
      where("receiverId", "==", userId),
      where("read", "==", false)
    );

    const snapshot = await getDocs(messagesQuery);
    const batch = db.batch();

    snapshot.docs.forEach((doc) => {
      batch.update(doc.ref, { read: true });
    });

    await batch.commit();
  },
};
