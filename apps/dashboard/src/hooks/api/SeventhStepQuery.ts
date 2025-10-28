import { useQuery, useMutation } from "@tanstack/react-query";

export interface EvaluacionSyllabus {
  evaluacion: string;
  ruleId?: number;
}

const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:7071/api";

export const useGetEvaluacion = (syllabusId: string | null) =>
  useQuery<EvaluacionSyllabus, Error>({
    queryKey: ["evaluacion", syllabusId],
    queryFn: async () => {
      if (!syllabusId) throw new Error("syllabusId no puede estar vacío");
      const res = await fetch(
        `${API_BASE}/syllabus/${encodeURIComponent(syllabusId)}/evaluacion`,
      );
      if (res.status === 404) {
        // No hay fórmula todavía para este sílabo: retornar vacío en vez de error
        return { evaluacion: "" };
      }
      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(txt || "Error al obtener la evaluación");
      }
      // Backend returns { id, formula } - normalize to { evaluacion }
      const json = (await res.json()) as { id?: number; formula?: string };
      return { evaluacion: json?.formula ?? "", ruleId: json?.id };
    },
    enabled: !!syllabusId && syllabusId.trim().length > 0,
  });

export const usePostEvaluacion = () =>
  useMutation<void, Error, { syllabusId: string; evaluacion: string }>({
    mutationFn: async ({ syllabusId, evaluacion }) => {
      const res = await fetch(
        `${API_BASE}/syllabus/${encodeURIComponent(syllabusId)}/evaluacion`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          // Backend likely expects { formula } as body key
          body: JSON.stringify({ formula: evaluacion }),
        },
      );
      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(txt || "Error al guardar la evaluación");
      }
    },
  });
