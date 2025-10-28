import { useQuery, useMutation } from "@tanstack/react-query";

export interface EstrategiaMetodologica {
  id?: string;
  syllabusId?: string;
  estrategias: string[];
}

const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:7071/api";

export const useGetEstrategias = (syllabusId: string | null) =>
  useQuery<EstrategiaMetodologica, Error>({
    queryKey: ["estrategias_metodologicas", syllabusId],
    queryFn: async () => {
      if (!syllabusId) throw new Error("syllabusId no puede estar vacío");
      const res = await fetch(
        `${API_BASE}/syllabus/${syllabusId}/estrategias_metodologicas`,
      );
      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(txt || "Error al obtener estrategias");
      }
      return res.json();
    },
    enabled: !!syllabusId && syllabusId.trim().length > 0,
  });

export const usePostEstrategias = () =>
  useMutation<void, Error, { syllabusId: string; estrategias: string[] }>({
    mutationFn: async ({ syllabusId, estrategias }) => {
      const res = await fetch(
        `${API_BASE}/syllabus/${syllabusId}/estrategias_metodologicas`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ estrategias_metodologicas: estrategias }),
        },
      );
      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(txt || "Error al guardar estrategias");
      }
    },
  });
