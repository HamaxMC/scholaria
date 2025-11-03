import { User } from "./auth";

export interface Message {
  id: string;
  content: string;
  senderId: string;
  receiverId?: string;
  groupId?: string;
  timestamp: Date;
  read: boolean;
  attachments?: MessageAttachment[];
}

export interface MessageAttachment {
  id: string;
  type: "image" | "document" | "video";
  url: string;
  name: string;
  size: number;
}

export interface ChatGroup {
  id: string;
  name: string;
  description?: string;
  members: string[]; // Array of user IDs
  createdAt: Date;
  updatedAt: Date;
  lastMessage?: Message;
  type: "class" | "course" | "custom";
}

export interface Chat {
  id: string;
  participants: string[]; // Array of user IDs
  lastMessage?: Message;
  unreadCount: number;
  createdAt: Date;
  updatedAt: Date;
}
