import { useQuery } from "@tanstack/react-query";
import type { UseQueryOptions } from "@tanstack/react-query";

export interface Assignment {
  cursoCodigo: string;
  cursoNombre: string;
  estadoRevision: string;
  docenteId: number;
  nombreDocente?: string; // ← Backend usa "nombreDocente"
  areaCurricular?: string;
  syllabusId?: number;
}

class AssignmentsManager {
  async fetchByDocente(docenteId: number | string, baseUrl?: string) {
    const apiBase =
      baseUrl ??
      import.meta.env.VITE_API_BASE_URL ??
      "http://localhost:7071/api";
    const url = `${apiBase}/assignments/?idDocente=${encodeURIComponent(String(docenteId))}`;
    const res = await fetch(url);
    if (!res.ok) {
      const t = await res.text();
      throw new Error(`${res.status} ${t}`);
    }
    const json = await res.json();
    const data = Array.isArray(json) ? json : json?.data;
    return (data ?? []) as Assignment[];
  }

  async fetchAll(baseUrl?: string) {
    const apiBase =
      baseUrl ??
      import.meta.env.VITE_API_BASE_URL ??
      "http://localhost:7071/api";
    const url = `${apiBase}/assignments`;
    console.log("🔍 Fetching all assignments from:", url);
    const res = await fetch(url);
    if (!res.ok) {
      const t = await res.text();
      console.error("❌ Error fetching assignments:", res.status, t);
      throw new Error(`${res.status} ${t}`);
    }
    const json = await res.json();
    console.log("📦 Response from API:", json);
    console.log("📊 Is Array?", Array.isArray(json));
    console.log("📊 Has data property?", json?.data);
    const data = Array.isArray(json) ? json : json?.data;
    console.log("✅ Final assignments array:", data);
    console.log("📈 Total assignments found:", data?.length ?? 0);
    return (data ?? []) as Assignment[];
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

export const useAllAssignments = (
  options?: UseQueryOptions<Assignment[], Error>,
) => {
  return useQuery<Assignment[], Error>({
    queryKey: ["assignments", "all"],
    queryFn: () => assignmentsManager.fetchAll(),
    retry: false,
    staleTime: 60_000,
    ...options,
  });
};
