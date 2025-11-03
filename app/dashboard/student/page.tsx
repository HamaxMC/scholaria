"use client";

import { useAuthGuard } from "@/hooks/useAuthGuard";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function StudentDashboard() {
  // Proteger esta ruta solo para estudiantes
  const { user, canRender } = useAuthGuard({
    allowedRoles: ["student"],
    require403Page: true
  });
  
  // No renderizar nada hasta que se verifique la autenticación
  if (!canRender) return null;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>Horario de Hoy</CardTitle>
          <CardDescription>Tus clases para hoy</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Add schedule component here */}
          <p className="text-sm text-muted-foreground">
            No hay clases programadas para hoy.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tareas Pendientes</CardTitle>
          <CardDescription>Actividades por entregar</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Add assignments component here */}
          <p className="text-sm text-muted-foreground">
            No hay tareas pendientes.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Calificaciones Recientes</CardTitle>
          <CardDescription>Últimas notas registradas</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Add grades component here */}
          <p className="text-sm text-muted-foreground">
            No hay calificaciones recientes.
          </p>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Anuncios</CardTitle>
          <CardDescription>Información importante</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Add announcements component here */}
          <p className="text-sm text-muted-foreground">
            No hay anuncios nuevos.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
