import { useQuery } from "@tanstack/react-query";

export interface ApprovedSyllabus {
  id: number;
  codigo: string;
  asignatura: string;
  fechaAprobacion: string;
  ciclo?: number;
  escuela?: string;
  docente?: string;
  syllabusId?: number;
}

interface BackendSyllabusResponse {
  id: number;
  cursoCodigo: string;
  cursoNombre: string;
  estadoRevision: string;
  fechaAprobacion?: string;
  ciclo?: number;
  escuelaProfesional?: string;
  docenteNombre?: string;
  syllabusId?: number;
}

async function fetchApprovedSyllabi(): Promise<ApprovedSyllabus[]> {
  const apiBase =
    import.meta.env.VITE_API_BASE_URL ?? "http://localhost:7071/api";
  const url = `${apiBase}/assignments`;

  const res = await fetch(url, {
    credentials: "include", // Para enviar cookie sessionSGA
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Error ${res.status}: ${text}`);
  }

  const data: BackendSyllabusResponse[] = await res.json();

  // Filtrar solo los aprobados y mapear
  return data
    .filter((item) => item.estadoRevision === "APROBADO")
    .map((item) => ({
      id: item.id,
      codigo: item.cursoCodigo,
      asignatura: item.cursoNombre,
      fechaAprobacion: item.fechaAprobacion || "N/A",
      ciclo: item.ciclo,
      escuela: item.escuelaProfesional,
      docente: item.docenteNombre,
      syllabusId: item.syllabusId,
    }));
}

export function useApprovedSyllabi() {
  return useQuery<ApprovedSyllabus[], Error>({
    queryKey: ["syllabi", "approved"],
    queryFn: fetchApprovedSyllabi,
    staleTime: 2 * 60 * 1000, // 2 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
    refetchOnWindowFocus: false,
    retry: 1,
  });
}
