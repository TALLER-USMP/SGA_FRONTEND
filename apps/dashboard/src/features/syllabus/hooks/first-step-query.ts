import { useQuery } from "@tanstack/react-query";

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
  horasTeoria?: number;
  horasPractica?: number;
  horasTotales?: number;
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

export const useSyllabusGeneral = (syllabusId: string | null) => {
  const normalizedId = (syllabusId ?? "").trim();
  const isValidId = normalizedId !== "" && /^\d+$/.test(normalizedId);

  return useQuery<SyllabusGeneral, Error>({
    queryKey: ["syllabus", isValidId ? normalizedId : null, "general"],
    queryFn: () => syllabusManager.fetchGeneral(normalizedId),
    enabled: isValidId,
    retry: false,
  });
};
