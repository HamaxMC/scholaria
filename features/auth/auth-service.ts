import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  User as FirebaseUser,
} from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { User, UserRole } from "@/types/auth";

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: "select_account",
});

// Helper para crear o actualizar documento de usuario
async function ensureUserDocument(user: FirebaseUser): Promise<void> {
  const userDocRef = doc(db, "users", user.uid);
  const userDoc = await getDoc(userDocRef);

  if (!userDoc.exists()) {
    // Crear nuevo documento
    await setDoc(userDocRef, {
      email: user.email,
      displayName: user.displayName || user.email?.split("@")[0],
      photoURL: user.photoURL,
      role: "student",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    console.log("User document created for:", user.uid);
  } else {
    // Actualizar última conexión
    await setDoc(
      userDocRef,
      {
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );

    console.log("User document updated for:", user.uid);
  }
}

export const authService = {
  // Email & Password Sign In
  async signInWithEmail(email: string, password: string) {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Asegurar que el documento existe
      await ensureUserDocument(userCredential.user);

      return userCredential;
    } catch (error) {
      console.error("Error signing in with email:", error);
      throw error;
    }
  },

  // Google Sign In con mejor manejo
  async signInWithGoogle() {
    try {
      googleProvider.addScope("email");
      googleProvider.addScope("profile");

      const result = await signInWithPopup(auth, googleProvider);

      // IMPORTANTE: Asegurar que el documento se crea ANTES de retornar
      await ensureUserDocument(result.user);

      // Pequeña espera para asegurar consistencia
      await new Promise((resolve) => setTimeout(resolve, 500));

      return result;
    } catch (error: any) {
      console.error("Error signing in with Google:", error);

      // Manejar errores específicos
      if (error.code === "auth/popup-closed-by-user") {
        throw new Error("popup-closed");
      } else if (error.code === "auth/popup-blocked") {
        throw new Error("popup-blocked");
      } else if (error.code === "auth/cancelled-popup-request") {
        throw new Error("popup-cancelled");
      }

      throw error;
    }
  },

  // Sign Up with Email
  async signUpWithEmail(
    email: string,
    password: string,
    displayName: string,
    role: UserRole = "student"
  ) {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Crear documento de usuario en Firestore
      await setDoc(doc(db, "users", userCredential.user.uid), {
        email,
        displayName,
        photoURL: null,
        role,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      console.log(
        "User registered and document created:",
        userCredential.user.uid
      );

      return userCredential;
    } catch (error) {
      console.error("Error signing up with email:", error);
      throw error;
    }
  },

  // Sign Out
  async signOut() {
    try {
      await signOut(auth);
      console.log("User signed out successfully");
    } catch (error) {
      console.error("Error signing out:", error);
      throw error;
    }
  },

  // Password Reset
  async sendPasswordResetEmail(email: string) {
    try {
      await sendPasswordResetEmail(auth, email);
      console.log("Password reset email sent to:", email);
    } catch (error) {
      console.error("Error sending password reset email:", error);
      throw error;
    }
  },

  // Get User Profile
  async getUserProfile(uid: string): Promise<User | null> {
    try {
      const userDoc = await getDoc(doc(db, "users", uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        return {
          uid,
          email: data.email,
          displayName: data.displayName,
          photoURL: data.photoURL,
          role: data.role,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        } as User;
      }
      return null;
    } catch (error) {
      console.error("Error fetching user profile:", error);
      throw error;
    }
  },

  // Subscribe to Auth State Changes
  onAuthStateChanged(callback: (user: FirebaseUser | null) => void) {
    return onAuthStateChanged(auth, callback);
  },
};
