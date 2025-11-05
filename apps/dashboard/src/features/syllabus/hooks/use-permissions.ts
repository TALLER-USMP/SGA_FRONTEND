import { useQuery } from "@tanstack/react-query";

export interface PermissionSection {
  numeroSeccion: number;
}

// Mapeo de numeroSeccion a step number
export const SECTION_TO_STEP_MAP: Record<number, number> = {
  1: 1, // Datos generales (siempre visible)
  2: 2, // Sumilla
  3: 3, // Competencias
  4: 4, // Programación del contenido
  5: 5, // Estrategias metodológicas (sección 5 o 6)
  6: 5, // Recursos didácticos (también step 5)
  7: 6, // Fórmula de evaluación
  8: 7, // Fuentes de consulta
  9: 8, // Resultados (outcomes)
};

class PermissionsManager {
  getApiBase(baseUrl?: string): string {
    return (
      baseUrl ??
      import.meta.env.VITE_API_BASE_URL ??
      "http://localhost:7071/api"
    );
  }

  async fetchPermissions(
    userId: number,
    baseUrl?: string,
  ): Promise<PermissionSection[]> {
    const apiBase = this.getApiBase(baseUrl);
    const url = `${apiBase}/permisos/${userId}`;

    const res = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error(`Error ${res.status}: Failed to fetch permissions`);
    }

    const data: PermissionSection[] = await res.json();
    return data;
  }

  /**
   * Convierte las secciones permitidas a números de step
   * @param sections Array de secciones permitidas
   * @returns Array de steps permitidos (sin duplicados, ordenados)
   */
  sectionsToSteps(sections: PermissionSection[]): number[] {
    // Siempre incluir step 1 (datos generales)
    const steps = new Set<number>([1]);

    sections.forEach((section) => {
      const step = SECTION_TO_STEP_MAP[section.numeroSeccion];
      if (step) {
        steps.add(step);
      }
    });

    return Array.from(steps).sort((a, b) => a - b);
  }
}

const permissionsManager = new PermissionsManager();

export const usePermissions = (userId: number | null) => {
  const isValidId = userId !== null && userId > 0;

  const query = useQuery<PermissionSection[], Error>({
    queryKey: ["permissions", userId],
    queryFn: () => permissionsManager.fetchPermissions(userId!),
    enabled: isValidId,
    retry: false,
    staleTime: 10 * 60 * 1000, // 10 minutos
    gcTime: 30 * 60 * 1000, // 30 minutos
  });

  // Convertir secciones a steps
  const allowedSteps = query.data
    ? permissionsManager.sectionsToSteps(query.data)
    : [1]; // Por defecto, solo step 1

  // Verificar si tiene permiso de edición para una sección específica
  const hasEditPermissionForSection = (sectionNumber: number): boolean => {
    if (!query.data) return false;
    return query.data.some(
      (section) => section.numeroSeccion === sectionNumber,
    );
  };

  return {
    ...query,
    allowedSteps,
    isStepAllowed: (step: number) => allowedSteps.includes(step),
    hasEditPermissionForSection,
  };
};
