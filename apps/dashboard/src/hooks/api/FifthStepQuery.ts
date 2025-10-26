import { useQuery, useMutation } from "@tanstack/react-query";

export interface EstrategiaMetodologica {
  id?: string;
  syllabusId?: string;
  estrategias: string[];
}

const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:7071/api";

export const useGetEstrategias = (syllabusId: string) =>
  useQuery<EstrategiaMetodologica, Error>({
    queryKey: ["estrategias_metodologicas", syllabusId],
    queryFn: async () => {
      const res = await fetch(
        `${API_BASE}/syllabus/${syllabusId}/estrategias_metodologicas`,
      );
      if (!res.ok) throw new Error("Error al obtener estrategias");
      return res.json();
    },
    enabled: !!syllabusId,
  });

export const usePostEstrategias = () =>
  useMutation<void, Error, { syllabusId: string; estrategias: string[] }>({
    mutationFn: async ({ syllabusId, estrategias }) => {
      const res = await fetch(
        `${API_BASE}/syllabus/${syllabusId}/estrategias_metodologicas`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ estrategias }),
        },
      );
      if (!res.ok) throw new Error("Error al guardar estrategias");
    },
  });
