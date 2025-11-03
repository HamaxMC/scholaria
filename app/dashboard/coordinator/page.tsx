"use client";

import { useAuthGuard } from "@/hooks/useAuthGuard";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function CoordinatorDashboard() {
  const { loading } = useAuthGuard({ allowedRoles: ["coordinator"] });

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>Horarios</CardTitle>
          <CardDescription>Gestión de horarios</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            No hay cambios pendientes en los horarios.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Profesores</CardTitle>
          <CardDescription>Gestión de profesores</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            No hay solicitudes pendientes.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Periodos Académicos</CardTitle>
          <CardDescription>Control de periodos</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Periodo actual: 2025-2
          </p>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Reportes Académicos</CardTitle>
          <CardDescription>Resumen de reportes</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            No hay reportes pendientes.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
