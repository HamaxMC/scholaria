import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// middleware.ts - Versión simplificada para debug
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  console.log("Middleware: Procesando ruta:", pathname);

  // Permitir todas las rutas por ahora para debug
  // El control de acceso se hace en los componentes con useAuthGuard
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Excluir archivos estáticos y API
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
