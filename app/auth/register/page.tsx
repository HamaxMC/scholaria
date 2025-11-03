"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authService } from "@/features/auth/auth-service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UserRole } from "@/types/auth";
import { updateProfile } from "firebase/auth";
import { useAuth } from "@/hooks/useAuth";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    displayName: "",
    role: "student" as UserRole,
  });
  const [error, setError] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const { user, loading: authLoading } = useAuth();

  // Redirigir si el usuario ya está autenticado
  useEffect(() => {
    if (!authLoading && user && !isRegistering) {
      console.log(
        "Usuario ya autenticado, redirigiendo a dashboard:",
        user.role
      );
      router.replace(`/dashboard/${user.role}`);
    }
  }, [user, authLoading, router, isRegistering]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    // Validaciones
    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    if (formData.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    if (!formData.displayName.trim()) {
      setError("El nombre completo es requerido");
      return;
    }

    try {
      setIsRegistering(true);

      // Crear usuario
      const userCredential = await authService.signUpWithEmail(
        formData.email,
        formData.password,
        formData.displayName,
        formData.role
      );

      // Actualizar perfil con displayName
      await updateProfile(userCredential.user, {
        displayName: formData.displayName,
      });

      console.log("Registro exitoso, esperando actualización del contexto...");

      // NO redirigir aquí - dejar que el useEffect lo haga cuando el contexto se actualice
    } catch (err: any) {
      console.error("Registration error:", err);
      setIsRegistering(false);

      const firebaseErrorMessages: Record<string, string> = {
        "auth/email-already-in-use": "Este correo ya está registrado.",
        "auth/invalid-email": "El correo ingresado no es válido.",
        "auth/operation-not-allowed": "El registro está deshabilitado.",
        "auth/weak-password":
          "La contraseña es muy débil. Usa al menos 6 caracteres.",
        "auth/network-request-failed":
          "Error de conexión. Verifica tu internet.",
      };

      setError(
        firebaseErrorMessages[err.code] ||
          "Error al registrar el usuario. Por favor, intenta de nuevo."
      );
    }
  };

  const handleGoogleRegister = async () => {
    setError("");
    setIsRegistering(true);

    try {
      await authService.signInWithGoogle();
      console.log(
        "Registro con Google exitoso, esperando actualización del contexto..."
      );

      // NO redirigir aquí - dejar que el useEffect lo haga
    } catch (err: any) {
      console.error("Google register error:", err);
      setIsRegistering(false);

      if (err.message === "popup-closed") {
        setError(
          "Cerraste la ventana de registro. Por favor, intenta de nuevo."
        );
      } else if (err.message === "popup-blocked") {
        setError(
          "El navegador bloqueó la ventana emergente. Permite ventanas emergentes para este sitio."
        );
      } else if (err.message === "popup-cancelled") {
        setError("");
      } else {
        setError(
          "Error al registrarse con Google. Por favor, intenta de nuevo."
        );
      }
    }
  };

  // Mostrar loader si está cargando el contexto O si ya hay usuario O si está registrando
  if (authLoading || (user && !error) || (isRegistering && !error)) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-muted-foreground">
            {isRegistering ? "Registrando..." : "Cargando..."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-muted/50 to-background p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Registro</CardTitle>
          <CardDescription>Crea una nueva cuenta en el sistema</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="displayName" className="text-sm font-medium">
                Nombre completo
              </label>
              <Input
                id="displayName"
                value={formData.displayName}
                onChange={(e) =>
                  setFormData({ ...formData, displayName: e.target.value })
                }
                disabled={isRegistering}
                required
                autoComplete="name"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Correo electrónico
              </label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                disabled={isRegistering}
                required
                autoComplete="email"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Contraseña
              </label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                disabled={isRegistering}
                required
                autoComplete="new-password"
                minLength={6}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-sm font-medium">
                Confirmar contraseña
              </label>
              <Input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
                disabled={isRegistering}
                required
                autoComplete="new-password"
                minLength={6}
              />
            </div>

            {error && (
              <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isRegistering}>
              {isRegistering ? "Registrando..." : "Registrarse"}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  O regístrate con
                </span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleGoogleRegister}
              disabled={isRegistering}
            >
              <svg
                className="mr-2 h-4 w-4"
                aria-hidden="true"
                focusable="false"
                data-prefix="fab"
                data-icon="google"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 488 512"
              >
                <path
                  fill="currentColor"
                  d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
                ></path>
              </svg>
              {isRegistering ? "Procesando..." : "Continuar con Google"}
            </Button>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <div className="text-center text-sm">
              ¿Ya tienes una cuenta?{" "}
              <Link href="/auth/login" className="text-primary hover:underline">
                Inicia sesión
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
