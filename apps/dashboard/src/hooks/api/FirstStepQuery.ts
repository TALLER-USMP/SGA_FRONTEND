import { useQuery } from "@tanstack/react-query";
import type { UseQueryOptions } from "@tanstack/react-query";

export interface SyllabusGeneral {
  nombreAsignatura?: string;
  departamentoAcademico?: string;
  escuelaProfesional?: string;
  programaAcademico?: string;
  semestreAcademico?: string;
  tipoAsignatura?: string;
  tipoEstudios?: string;
  modalidad?: string;
  codigoAsignatura?: string;
  ciclo?: string;
  requisitos?: string;
  creditosTeoria?: number;
  creditosPractica?: number;
  creditosTotales?: number;
  docentes?: string;
  // The backend may use different field names depending on source/version.
  horasTeoria?: number;
  horasPractica?: number;
  horasTotales?: number;
  // Alternative names seen in some responses
  horasTeoriaLectivaPresencial?: number;
  horasPracticaLectivaPresencial?: number;
  horasTotalesLectivaPresencial?: number;
}

class SyllabusManager {
  async fetchGeneral(syllabusId: string, baseUrl?: string) {
    const apiBase =
      baseUrl ??
      import.meta.env.VITE_API_BASE_URL ??
      "http://localhost:7071/api";
    const res = await fetch(
      `${apiBase}/syllabus/${encodeURIComponent(syllabusId)}/datos-generales`,
    );
    if (!res.ok) {
      const t = await res.text();
      throw new Error(`${res.status} ${t}`);
    }
    return (await res.json()) as SyllabusGeneral;
  }
}

export const syllabusManager = new SyllabusManager();

export const useSyllabusGeneral = (
  syllabusId: string | null,
  options?: UseQueryOptions<SyllabusGeneral, Error>,
) => {
  return useQuery<SyllabusGeneral, Error>({
    queryKey: ["syllabus", syllabusId, "general"],
    queryFn: () => syllabusManager.fetchGeneral(syllabusId ?? ""),
    enabled: !!syllabusId,
    retry: false,
    ...options,
  });
};
