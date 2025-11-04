import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/features/auth/auth-context"; // 👈 IMPORTANTE

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Sistema Académico",
  description:
    "Plataforma web educativa integral para instituciones académicas",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${inter.variable} antialiased`}
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="a"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            {" "}
            {/* 👈 Envuelve toda la app */}
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
