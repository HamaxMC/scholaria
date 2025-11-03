import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";
import { getStorage, FirebaseStorage } from "firebase/storage";

// Usar valores hardcodeados para evitar problemas con las variables de entorno
const firebaseConfig = {
  apiKey: "AIzaSyCNYZi7zprXO1W_K61jbqo6X2RcI3uZAuo",
  authDomain: "scholaria-4af1e.firebaseapp.com",
  projectId: "scholaria-4af1e",
  storageBucket: "scholaria-4af1e.firebasestorage.app",
  messagingSenderId: "873810526745",
  appId: "1:873810526745:web:eceecc268122b350f96088",
  measurementId: "G-JM422760ZJ",
};

// Inicializar Firebase de manera segura
let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
let storage: FirebaseStorage;

try {
  // Inicializar Firebase solo una vez
  app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
  
  console.log("Firebase inicializado correctamente");
} catch (error) {
  console.error("Error al inicializar Firebase:", error);
  throw new Error("No se pudo inicializar Firebase. Verifica tu configuración.");
}

export { app, auth, db, storage };
