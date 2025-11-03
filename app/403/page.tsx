"use client";

import { useAuth } from "@/features/auth/auth-context";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ShieldAlert, Home, ArrowLeft } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ForbiddenPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const handleGoHome = () => {
    if (user) {
      router.push(`/dashboard/${user.role}`);
    } else {
      router.push("/auth/login");
    }
  };

  const handleGoBack = () => {
    router.back();
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-muted/50 to-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10">
            <ShieldAlert className="h-10 w-10 text-destructive" />
          </div>
          <CardTitle className="text-3xl">Acceso Denegado</CardTitle>
          <CardDescription className="text-base">
            No tienes permisos para acceder a esta página
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          {user ? (
            <>
              <p className="text-sm text-muted-foreground">
                Tu cuenta (<strong>{user.email}</strong>) con rol de{" "}
                <strong className="capitalize">{user.role}</strong> no tiene
                acceso a este recurso.
              </p>
              <p className="text-sm text-muted-foreground">
                Si crees que esto es un error, contacta al administrador del
                sistema.
              </p>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">
              Necesitas iniciar sesión con una cuenta que tenga los permisos
              necesarios.
            </p>
          )}
        </CardContent>
        <CardFooter className="flex flex-col gap-3">
          <Button onClick={handleGoHome} className="w-full" size="lg">
            <Home className="mr-2 h-4 w-4" />
            {user ? "Ir a mi Dashboard" : "Ir al Inicio"}
          </Button>
          <Button
            onClick={handleGoBack}
            variant="outline"
            className="w-full"
            size="lg"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver Atrás
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

// Ubicación del archivo: app/403/page.tsx
