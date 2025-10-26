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
  director: [
    { to: "/", label: "Inicio" },
    { to: "/management", label: "Asignar docente" },
  ],
  indeterminado: [],
} as const;

export type RoleKey = keyof typeof sidebarMenusByRole;
