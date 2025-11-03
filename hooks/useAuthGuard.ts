import { useAuth } from "@/features/auth/auth-context";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import { UserRole } from "@/types/auth";

interface UseAuthGuardOptions {
  allowedRoles?: UserRole[];
  redirectTo?: string;
  require403Page?: boolean; // Si false, redirige al dashboard del usuario
}

export function useAuthGuard(options: UseAuthGuardOptions = {}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const {
    allowedRoles,
    redirectTo = "/auth/login",
    require403Page = true,
  } = options;

  // Memoizar el string de roles para evitar re-renders innecesarios
  const allowedRolesString = useMemo(
    () => allowedRoles?.join(",") || "",
    [allowedRoles]
  );

  // Calcular si el usuario está autorizado
  const isAuthorized = useMemo(() => {
    if (loading) return false;
    if (!user) return false;
    if (!allowedRoles) return true;
    return allowedRoles.includes(user.role);
  }, [user, loading, allowedRolesString]);

  // Determinar si se puede renderizar el componente
  const canRender = useMemo(() => {
    return !loading && user && isAuthorized;
  }, [loading, user, isAuthorized]);

  useEffect(() => {
    // No hacer nada mientras está cargando
    if (loading) return;

    // Si no hay usuario, redirigir al login
    if (!user) {
      console.log(
        "useAuthGuard: Usuario no autenticado, redirigiendo a",
        redirectTo
      );
      router.replace(redirectTo);
      return;
    }

    // Si hay roles permitidos y el usuario no tiene permiso
    if (allowedRoles && !allowedRoles.includes(user.role)) {
      if (require403Page) {
        console.log("useAuthGuard: Usuario no autorizado, redirigiendo a 403");
        router.replace("/403");
      } else {
        // Redirigir al dashboard del rol del usuario
        console.log(`useAuthGuard: Redirigiendo a dashboard/${user.role}`);
        router.replace(`/dashboard/${user.role}`);
      }
    }
  }, [user, loading, router, redirectTo, allowedRolesString, require403Page]);

  return {
    user,
    loading,
    isAuthorized,
    canRender
  };
}
