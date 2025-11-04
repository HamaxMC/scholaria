"use client";

import { useAuthGuard } from "@/hooks/useAuthGuard";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// app/dashboard/student/page.tsx
export default function StudentDashboard() {
  // Proteger esta ruta solo para estudiantes
  const { loading, canRender } = useAuthGuard({
    allowedRoles: ["student"],
    require403Page: true,
  });

  console.log("StudentDashboard - Estado:", { loading, canRender });

  // Mostrar loader mientras verifica
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="glass-effect p-8 rounded-2xl">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  // No renderizar nada hasta que se verifique la autenticación
  if (!canRender) {
    console.log("StudentDashboard: No se puede renderizar aún");
    return null;
  }

  console.log("StudentDashboard: Renderizando contenido");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Dashboard del Estudiante
        </h1>
        <p className="text-muted-foreground">
          Bienvenido a tu panel de control
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Horario de Hoy</CardTitle>
            <CardDescription>Tus clases para hoy</CardDescription>
          </CardHeader>
          <CardContent>
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
            <p className="text-sm text-muted-foreground">
              No hay anuncios nuevos.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
