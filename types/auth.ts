import { UserCredential } from "firebase/auth";
import { DocumentData, QueryDocumentSnapshot } from "firebase/firestore";

export type UserRole =
  | "student"
  | "teacher"
  | "coordinator"
  | "secretary"
  | "parent";

export interface User {
  uid: string;
  email: string;
  displayName?: string;
  role: UserRole;
  photoURL?: string;
  phoneNumber?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthRedirectResult {
  result: UserCredential;
  userDoc: QueryDocumentSnapshot<DocumentData>;
}

export interface Student extends User {
  role: "student";
  grade: string;
  section: string;
  studentId: string;
  parentId: string;
}

export interface Teacher extends User {
  role: "teacher";
  subjects: string[];
  grades: string[];
}

export interface Coordinator extends User {
  role: "coordinator";
  department: string;
}

export interface Secretary extends User {
  role: "secretary";
  department: string;
}

export interface Parent extends User {
  role: "parent";
  children: string[]; // Array of student IDs
}
