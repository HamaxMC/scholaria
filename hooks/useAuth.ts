// Re-export the `useAuth` hook from the AuthProvider context so imports
// of `@/hooks/useAuth` remain working but there is a single source of truth.
export { useAuth } from "@/features/auth/auth-context";
