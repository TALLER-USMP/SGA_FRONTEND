export const roleNames: Record<number, string> = {
  1: "docente",
  2: "indeterminado",
  3: "coordinadora_academica",
  4: "director_escuela",
} as const;

export type RoleKey = keyof typeof roleNames;
export type RoleName = (typeof roleNames)[RoleKey];

export function getRoleName(role?: number): RoleName | undefined {
  return role ? roleNames[role as RoleKey] : undefined;
}
