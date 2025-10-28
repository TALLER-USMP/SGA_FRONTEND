export const sidebarMenusByRole = {
  docente: [
    { to: "/", label: "Inicio" },
    { to: "/mis-asignaciones", label: "Mis Asignaciones" },
  ],
  coordinadora_academica: [
    { to: "/", label: "Inicio" },
    {
      to: "/mis-asignaciones",
      label: "Mis Asignaciones",
    },
  ],
  director_escuela: [
    { to: "/", label: "Inicio" },
    { to: "/silabus", label: "Silabus" },
    { to: "/management", label: "Asignar Docente" },
  ],
  indeterminado: [],
} as const;

export type RoleKey = keyof typeof sidebarMenusByRole;
