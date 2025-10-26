import { useQuery, useMutation } from "@tanstack/react-query";

export interface EvaluacionSyllabus {
  id?: string;
  syllabusId?: string;
  evaluacion: string;
}

const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:7071/api";

export const useGetEvaluacion = (syllabusId: string) =>
  useQuery<EvaluacionSyllabus, Error>({
    queryKey: ["evaluacion", syllabusId],
    queryFn: async () => {
      const res = await fetch(
        `${API_BASE}/syllabus/${encodeURIComponent(syllabusId)}/evaluacion`,
      );
      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(txt || "Error al obtener la evaluación");
      }
      return res.json();
    },
    enabled: !!syllabusId,
  });

export const usePostEvaluacion = () =>
  useMutation<void, Error, { syllabusId: string; evaluacion: string }>({
    mutationFn: async ({ syllabusId, evaluacion }) => {
      // El backend acepta POST /syllabus/evaluacion con body { syllabusId, evaluacion }
      const res = await fetch(`${API_BASE}/syllabus/evaluacion`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ syllabusId, evaluacion }),
      });
      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(txt || "Error al guardar la evaluación");
      }
    },
  });
