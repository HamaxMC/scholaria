"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authService } from "@/features/auth/auth-service";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const { user, loading: authLoading } = useAuth();

  // Redirigir si el usuario ya está autenticado
  useEffect(() => {
    // Solo redirigir si NO estamos en proceso de autenticación
    if (!authLoading && user && !isAuthenticating) {
      console.log(
        "Usuario ya autenticado, redirigiendo a dashboard:",
        user.role
      );
      router.replace(`/dashboard/${user.role}`);
    }
  }, [user, authLoading, router, isAuthenticating]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsAuthenticating(true);

    try {
      // Solo autenticar - el contexto manejará el documento
      await authService.signInWithEmail(email, password);

      // NO redirigir aquí - dejar que el useEffect lo haga cuando el contexto se actualice
      console.log("Login exitoso, esperando actualización del contexto...");
    } catch (err: any) {
      console.error("Login error:", err);
      setIsAuthenticating(false);

      const firebaseErrorMessages: Record<string, string> = {
        "auth/invalid-email": "El correo ingresado no es válido.",
        "auth/user-disabled": "Esta cuenta ha sido deshabilitada.",
        "auth/user-not-found": "No existe una cuenta con ese correo.",
        "auth/wrong-password": "Contraseña incorrecta.",
        "auth/invalid-credential":
          "Credenciales inválidas. Verifica tu correo y contraseña.",
        "auth/too-many-requests":
          "Demasiados intentos fallidos. Intenta más tarde.",
        "auth/network-request-failed":
          "Error de conexión. Verifica tu internet.",
      };

      setError(
        firebaseErrorMessages[err.code] ||
          "Error al iniciar sesión. Por favor, intenta de nuevo."
      );
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setIsAuthenticating(true);

    try {
      // Solo autenticar - el contexto manejará el resto
      await authService.signInWithGoogle();

      // NO redirigir aquí - dejar que el useEffect lo haga
      console.log(
        "Google login exitoso, esperando actualización del contexto..."
      );
    } catch (err: any) {
      console.error("Google login error:", err);
      setIsAuthenticating(false);

      if (err.message === "popup-closed") {
        setError(
          "Cerraste la ventana de inicio de sesión. Por favor, intenta de nuevo."
        );
      } else if (err.message === "popup-blocked") {
        setError(
          "El navegador bloqueó la ventana emergente. Permite ventanas emergentes para este sitio."
        );
      } else if (err.message === "popup-cancelled") {
        setError("");
      } else {
        setError(
          "Error al iniciar sesión con Google. Por favor, intenta de nuevo."
        );
      }
    }
  };

  // Mostrar loader si está cargando el contexto O si ya hay usuario O si está autenticando
  if (authLoading || (user && !error) || (isAuthenticating && !error)) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-muted-foreground">
            {isAuthenticating ? "Autenticando..." : "Cargando..."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-muted/50 to-background p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Iniciar Sesión</CardTitle>
          <CardDescription>
            Ingresa tus credenciales para acceder al sistema
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Correo electrónico
              </label>
              <Input
                id="email"
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isAuthenticating}
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isAuthenticating}
                required
                autoComplete="current-password"
              />
            </div>

            {error && (
              <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={isAuthenticating}
            >
              {isAuthenticating ? "Iniciando sesión..." : "Iniciar Sesión"}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  O continúa con
                </span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleGoogleLogin}
              disabled={isAuthenticating}
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
              {isAuthenticating ? "Procesando..." : "Continuar con Google"}
            </Button>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <div className="flex flex-col gap-2 text-center text-sm">
              <Link
                href="/auth/reset-password"
                className="text-primary hover:underline"
              >
                ¿Olvidaste tu contraseña?
              </Link>
              <span>
                ¿No tienes una cuenta?{" "}
                <Link
                  href="/auth/register"
                  className="text-primary hover:underline"
                >
                  Regístrate
                </Link>
              </span>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
