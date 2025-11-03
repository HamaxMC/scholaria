"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
  onSnapshot,
} from "firebase/firestore";
import { User, UserRole } from "@/types/auth";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: Error | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Función para crear documento de usuario si no existe
async function createUserDocumentIfNeeded(
  firebaseUser: FirebaseUser
): Promise<void> {
  const userDocRef = doc(db, "users", firebaseUser.uid);

  try {
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      console.log(
        "Creando documento de usuario faltante para:",
        firebaseUser.uid
      );

      await setDoc(userDocRef, {
        email: firebaseUser.email,
        displayName:
          firebaseUser.displayName ||
          firebaseUser.email?.split("@")[0] ||
          "Usuario",
        photoURL: firebaseUser.photoURL,
        role: "student",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      console.log("Documento de usuario creado exitosamente");
    }
  } catch (error) {
    console.error("Error al asegurar documento de usuario:", error);
    throw error;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!auth) {
      console.error("Firebase auth no está inicializado");
      setError(new Error("Error de inicialización de Firebase"));
      setLoading(false);
      return;
    }

    console.log("Configurando listener de autenticación...");

    // Variable para almacenar el unsubscribe de Firestore
    let unsubscribeFirestore: (() => void) | null = null;

    const unsubscribeAuth = onAuthStateChanged(
      auth,
      async (firebaseUser: FirebaseUser | null) => {
        try {
          setError(null);

          // Limpiar listener anterior de Firestore si existe
          if (unsubscribeFirestore) {
            unsubscribeFirestore();
            unsubscribeFirestore = null;
          }

          if (firebaseUser) {
            console.log("Usuario autenticado:", firebaseUser.uid);

            // Asegurar que el documento existe
            await createUserDocumentIfNeeded(firebaseUser);

            // Usar onSnapshot para escuchar cambios en tiempo real
            const userDocRef = doc(db, "users", firebaseUser.uid);

            unsubscribeFirestore = onSnapshot(
              userDocRef,
              (docSnapshot) => {
                if (docSnapshot.exists()) {
                  const data = docSnapshot.data();

                  // Validar y asegurar rol válido
                  const validRoles: UserRole[] = [
                    "student",
                    "teacher",
                    "parent",
                    "coordinator",
                    "secretary",
                  ];
                  const userRole = validRoles.includes(data.role)
                    ? data.role
                    : "student";

                  const userData: User = {
                    uid: firebaseUser.uid,
                    email: firebaseUser.email ?? "",
                    displayName:
                      firebaseUser.displayName ||
                      data.displayName ||
                      firebaseUser.email?.split("@")[0] ||
                      "",
                    photoURL:
                      firebaseUser.photoURL || data.photoURL || undefined,
                    role: userRole,
                    createdAt: data.createdAt?.toDate?.() || new Date(),
                    updatedAt: data.updatedAt?.toDate?.() || new Date(),
                  };

                  console.log(
                    "✅ Datos de usuario cargados, rol:",
                    userData.role
                  );
                  setUser(userData);
                  setLoading(false);
                } else {
                  console.error("El documento de usuario no existe");
                  setError(new Error("Error al cargar perfil de usuario"));
                  setUser(null);
                  setLoading(false);
                }
              },
              (err) => {
                console.error("Error en snapshot de usuario:", err);
                setError(err as Error);
                setUser(null);
                setLoading(false);
              }
            );
          } else {
            console.log("No hay usuario autenticado");
            setUser(null);
            setLoading(false);
          }
        } catch (err) {
          console.error("Error en cambio de estado de autenticación:", err);
          setError(err as Error);
          setUser(null);
          setLoading(false);
        }
      },
      (err) => {
        console.error("Error en listener de autenticación:", err);
        setError(err as Error);
        setUser(null);
        setLoading(false);
      }
    );

    // Cleanup
    return () => {
      console.log("Limpiando listeners de autenticación");
      unsubscribeAuth();
      if (unsubscribeFirestore) {
        unsubscribeFirestore();
      }
    };
  }, []);

  const value: AuthContextType = {
    user,
    loading,
    error,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
