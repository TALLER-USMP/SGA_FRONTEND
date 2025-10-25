export const sidebarMenusByRole = {
  docente: [
    { to: "/", label: "Inicio" },
    { to: "/MyAssignmentsTeacher", label: "Mis Asignaciones Docente" },
    { to: "/SyllabusManagement", label: "Mis Silabos" },
  ],
  coordinadora_academica: [
    { to: "/", label: "Inicio" },
    {
      to: "/MyAssignmentsCoordinadora",
      label: "Mis Asignaciones Coordinadora",
    },
  ],
  director: [
    { to: "/", label: "Inicio" },
    { to: "/management", label: "Asignar docente" },
  ],
  indeterminado: [],
} as const;

export type RoleKey = keyof typeof sidebarMenusByRole;
