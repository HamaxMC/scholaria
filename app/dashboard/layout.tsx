"use client";

import { useAuth } from "@/features/auth/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { roleNavigation } from "@/features/navigation/routes";
import { useLogout } from "@/hooks/useLogout";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// app/dashboard/layout.tsx
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const logout = useLogout();

  useEffect(() => {
    console.log("Dashboard layout - Estado:", {
      loading,
      hasUser: !!user,
      userRole: user?.role,
    });

    // Solo redirigir si ya terminó de cargar y no hay usuario
    if (!loading && !user) {
      console.log(
        "Dashboard layout: Usuario no autenticado, redirigiendo a login"
      );
      router.replace("/auth/login");
    } else if (!loading && user) {
      console.log("Dashboard layout: Usuario autenticado como", user.role);
    }
  }, [user, loading, router]);

  // Mostrar loader mientras carga
  if (loading) {
    console.log("Dashboard layout: Mostrando loader");
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  // No mostrar nada si no hay usuario (se está redirigiendo)
  if (!user) {
    console.log("Dashboard layout: Sin usuario, retornando null");
    return null;
  }

  console.log("Dashboard layout: Renderizando dashboard para", user.role);
  const navigation = user.role ? roleNavigation[user.role] : [];

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8">
      {/* Header con efecto glass */}
      <header className="glass-header sticky top-4 z-50 rounded-2xl mb-6">
        <div className="container flex h-16 items-center px-6">
          <Link href="/dashboard" className="mr-6 flex items-center space-x-2">
            <span className="font-bold text-lg">Sistema Académico</span>
          </Link>
          <nav className="flex flex-1 items-center space-x-6 text-sm font-medium">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="glass-subtle px-4 py-2 rounded-lg transition-colors hover:glass-effect"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="ml-auto flex items-center space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="glass-subtle relative h-10 w-10 rounded-full"
                >
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={user.photoURL || undefined}
                      alt={user.displayName || "Usuario"}
                    />
                    <AvatarFallback className="glass-effect">
                      {user.displayName?.[0]?.toUpperCase() ||
                        user.email[0]?.toUpperCase() ||
                        "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="glass-effect border-0"
              >
                <div className="flex items-center justify-start gap-2 p-3">
                  <div className="flex flex-col space-y-1 leading-none">
                    {user.displayName && (
                      <p className="font-medium">{user.displayName}</p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </div>
                <DropdownMenuItem onClick={() => router.push("/profile")}>
                  Perfil
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push("/settings")}>
                  Configuración
                </DropdownMenuItem>
                <DropdownMenuItem onClick={logout} className="text-destructive">
                  Cerrar sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Main Content - Con máximo ancho */}
      <main className="container max-w-7xl mx-auto">{children}</main>
    </div>
  );
}
