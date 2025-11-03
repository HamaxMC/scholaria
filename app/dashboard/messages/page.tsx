"use client";

import { MessagingPanel } from "@/features/messaging/messaging-panel";
import { useAuthGuard } from "@/hooks/useAuthGuard";

export default function MessagesPage() {
  const { loading } = useAuthGuard();

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Mensajes</h1>
      <MessagingPanel />
    </div>
  );
}
