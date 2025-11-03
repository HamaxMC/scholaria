import { UserRole } from "@/types/auth";

export const roleNavigation: Record<
  UserRole,
  Array<{ href: string; label: string }>
> = {
  student: [
    { href: "/dashboard/student", label: "Inicio" },
    { href: "/dashboard/calendar", label: "Calendario" },
    { href: "/dashboard/messages", label: "Mensajes" },
    { href: "/dashboard/grades", label: "Calificaciones" },
    { href: "/dashboard/assignments", label: "Tareas" },
  ],
  teacher: [
    { href: "/dashboard/teacher", label: "Inicio" },
    { href: "/dashboard/calendar", label: "Calendario" },
    { href: "/dashboard/messages", label: "Mensajes" },
    { href: "/dashboard/grades/manage", label: "Calificaciones" },
    { href: "/dashboard/attendance", label: "Asistencia" },
  ],
  coordinator: [
    { href: "/dashboard/coordinator", label: "Inicio" },
    { href: "/dashboard/schedule", label: "Horarios" },
    { href: "/dashboard/teachers", label: "Profesores" },
    { href: "/dashboard/courses", label: "Cursos" },
    { href: "/dashboard/reports", label: "Reportes" },
  ],
  secretary: [
    { href: "/dashboard/secretary", label: "Inicio" },
    { href: "/dashboard/enrollment", label: "Matrículas" },
    { href: "/dashboard/certificates", label: "Certificados" },
    { href: "/dashboard/documents", label: "Documentos" },
    { href: "/dashboard/messages", label: "Mensajes" },
  ],
  parent: [
    { href: "/dashboard/parent", label: "Inicio" },
    { href: "/dashboard/children", label: "Mis Hijos" },
    { href: "/dashboard/messages", label: "Mensajes" },
    { href: "/dashboard/calendar", label: "Calendario" },
    { href: "/dashboard/payments", label: "Pagos" },
  ],
};
