import { useQuery } from "@tanstack/react-query";
import type { UseQueryOptions } from "@tanstack/react-query";

export interface Assignment {
  cursoCodigo: string;
  cursoNombre: string;
  estadoRevision: string;
  docenteId: number;
  syllabusId?: number;
}

class AssignmentsManager {
  async fetchByDocente(docenteId: number | string, baseUrl?: string) {
    const apiBase =
      baseUrl ??
      import.meta.env.VITE_API_BASE_URL ??
      "http://localhost:7071/api";
    const url = `${apiBase}/assignments/?idDocente=${encodeURIComponent(String(docenteId))}`;
    try {
      const res = await fetch(url);
      if (!res.ok) {
        const t = await res.text();
        throw new Error(`${res.status} ${t}`);
      }
      const json = await res.json();
      const data = Array.isArray(json) ? json : json?.data;
      return (data ?? []) as Assignment[];
    } catch {
      // Fallback local: intentar cargar assignments desde localStorage
      try {
        const raw = localStorage.getItem("assignments_mock");
        if (!raw) return [] as Assignment[];
        const parsed = JSON.parse(raw) as Assignment[];
        // filtrar por docenteId
        return parsed.filter((a) => String(a.docenteId) === String(docenteId));
      } catch {
        return [] as Assignment[];
      }
    }
  }
}

export const assignmentsManager = new AssignmentsManager();

export const useAssignments = (
  docenteId: number | string | null | undefined,
  options?: UseQueryOptions<Assignment[], Error>,
) => {
  return useQuery<Assignment[], Error>({
    queryKey: ["assignments", docenteId],
    queryFn: () =>
      assignmentsManager.fetchByDocente(docenteId as number | string),
    enabled: docenteId !== null && docenteId !== undefined,
    retry: false,
    staleTime: 60_000,
    ...options,
  });
};

// Función auxiliar para actualizar el estado de una asignación en localStorage
export const updateLocalAssignmentStatus = (
  cursoCodigo: string,
  newStatus: string,
) => {
  try {
    const raw = localStorage.getItem("assignments_mock");
    const list: Assignment[] = raw ? JSON.parse(raw) : [];
    const updated = list.map((a) =>
      a.cursoCodigo === cursoCodigo ? { ...a, estadoRevision: newStatus } : a,
    );
    localStorage.setItem("assignments_mock", JSON.stringify(updated));
  } catch {
    // ignore
  }
};
