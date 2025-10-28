import { useQuery, useMutation } from "@tanstack/react-query";

export interface RecursoGroup {
  type: string;
  items: string[];
}

export interface RecursosDidacticos {
  id?: string;
  syllabusId?: string;
  recursos: RecursoGroup[];
}

const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:7071/api";

export const useGetRecursos = (syllabusId: string | null) =>
  useQuery<RecursosDidacticos, Error>({
    queryKey: ["recursos_didacticos", syllabusId],
    queryFn: async () => {
      if (!syllabusId) throw new Error("syllabusId no puede estar vacío");
      const res = await fetch(
        `${API_BASE}/syllabus/${encodeURIComponent(syllabusId)}/recursos_didacticos_notas`,
      );
      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(txt || "Error al obtener recursos didácticos");
      }
      return res.json();
    },
    enabled: !!syllabusId && syllabusId.trim().length > 0,
  });

export const usePostRecursos = () =>
  useMutation<void, Error, { syllabusId: string; recursos: RecursoGroup[] }>({
    mutationFn: async ({ syllabusId, recursos }) => {
      const res = await fetch(
        `${API_BASE}/syllabus/${encodeURIComponent(syllabusId)}/recursos_didacticos_notas`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ recursos_didacticos_notas: recursos }),
        },
      );
      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(txt || "Error al guardar recursos didácticos");
      }
    },
  });
