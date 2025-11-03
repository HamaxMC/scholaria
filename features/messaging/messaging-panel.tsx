"use client";

import { useState } from "react";
import { useMessaging } from "./use-messaging";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { formatDateTime } from "@/lib/utils";
import { Message } from "@/types/messaging";

export function MessagingPanel() {
  const { chats, groups, currentMessages, loading, sendMessage } =
    useMessaging();
  const [newMessage, setNewMessage] = useState("");
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedChatId) return;

    sendMessage(newMessage, selectedChatId);
    setNewMessage("");
  };

  if (loading) {
    return <div>Cargando mensajes...</div>;
  }

  return (
    <div className="grid grid-cols-12 gap-4 h-[calc(100vh-4rem)]">
      {/* Chats/Groups List */}
      <div className="col-span-3 border-r overflow-y-auto">
        <div className="p-4">
          <h2 className="font-semibold mb-4">Chats</h2>
          <div className="space-y-2">
            {chats.map((chat) => (
              <Card
                key={chat.id}
                className={`cursor-pointer transition-colors ${
                  selectedChatId === chat.id ? "bg-accent" : ""
                }`}
                onClick={() => setSelectedChatId(chat.id)}
              >
                <CardHeader className="p-3">
                  <CardTitle className="text-sm">
                    {chat.participants.join(", ")}
                  </CardTitle>
                  {chat.lastMessage && (
                    <p className="text-xs text-muted-foreground truncate">
                      {chat.lastMessage.content}
                    </p>
                  )}
                </CardHeader>
              </Card>
            ))}
          </div>

          <h2 className="font-semibold mb-4 mt-6">Grupos</h2>
          <div className="space-y-2">
            {groups.map((group) => (
              <Card
                key={group.id}
                className={`cursor-pointer transition-colors ${
                  selectedChatId === group.id ? "bg-accent" : ""
                }`}
                onClick={() => setSelectedChatId(group.id)}
              >
                <CardHeader className="p-3">
                  <CardTitle className="text-sm">{group.name}</CardTitle>
                  {group.lastMessage && (
                    <p className="text-xs text-muted-foreground truncate">
                      {group.lastMessage.content}
                    </p>
                  )}
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Messages Panel */}
      <div className="col-span-9 flex flex-col">
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {currentMessages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
        </div>

        {/* Message Input */}
        <div className="p-4 border-t">
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Escribe un mensaje..."
              className="flex-1"
            />
            <Button type="submit" disabled={!newMessage.trim()}>
              Enviar
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

function MessageBubble({ message }: { message: Message }) {
  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-sm font-medium">{message.senderId}</span>
        <span className="text-xs text-muted-foreground">
          {formatDateTime(message.timestamp)}
        </span>
      </div>
      <div className="bg-accent p-3 rounded-lg max-w-[80%]">
        <p className="text-sm">{message.content}</p>
      </div>
    </div>
  );
}
