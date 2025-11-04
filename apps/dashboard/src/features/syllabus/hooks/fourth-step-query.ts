import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const getApiBase = (baseUrl?: string): string => {
  return (
    baseUrl ?? import.meta.env.VITE_API_BASE_URL ?? "http://localhost:7071/api"
  );
};

export interface CreateProgramacionBody {
  silaboId: number;
  numero: number;
  titulo: string;
  capacidadesText?: string;
  semanaInicio?: number;
  semanaFin?: number;
  contenidosConceptuales?: string;
  contenidosProcedimentales?: string;
  actividadesAprendizaje?: string;
  horasLectivasTeoria?: number;
  horasLectivasPractica?: number;
  horasNoLectivasTeoria?: number;
  horasNoLectivasPractica?: number;
}

export interface UpdateProgramacionBody {
  silaboId?: number;
  numero?: number;
  titulo?: string;
  capacidadesText?: string;
  semanaInicio?: number;
  semanaFin?: number;
  contenidosConceptuales?: string;
  contenidosProcedimentales?: string;
  actividadesAprendizaje?: string;
  horasLectivasTeoria?: number;
  horasLectivasPractica?: number;
  horasNoLectivasTeoria?: number;
  horasNoLectivasPractica?: number;
  [key: string]: unknown;
}

export interface ProgramacionResponse {
  id?: string | number;
  silaboId?: number;
  asignaturaId?: string | number;
  [key: string]: unknown;
}

function buildError(res: Response): Promise<Error> {
  return res
    .json()
    .then(
      (b: { message?: string }) =>
        new Error(b?.message || `Error ${res.status}`),
    )
    .catch(() => new Error(`Error ${res.status}`));
}

// GET: Obtener unidades por syllabusId
export const useGetProgramacion = (syllabusId: string) => {
  return useQuery<ProgramacionResponse[]>({
    queryKey: ["syllabus", syllabusId, "unidades"],
    queryFn: async () => {
      const apiBase = getApiBase();
      const res = await fetch(
        `${apiBase}/syllabus/${encodeURIComponent(syllabusId)}/unidades`,
      );
      if (res.status === 404) {
        return [];
      }
      if (!res.ok) throw await buildError(res);
      const response = await res.json();

      // Manejar diferentes formatos de respuesta
      if (response.data) {
        return Array.isArray(response.data) ? response.data : [];
      }
      return Array.isArray(response) ? response : [];
    },
    enabled: !!syllabusId && syllabusId !== "0",
    staleTime: 1000 * 60 * 5,
    retry: false,
    throwOnError: false,
  });
};

// POST: Crear nueva unidad
export const useCreateProgramacion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreateProgramacionBody) => {
      const apiBase = getApiBase();
      const res = await fetch(
        `${apiBase}/syllabus/${payload.silaboId}/unidades`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      if (!res.ok) throw await buildError(res);
      return (await res.json()) as ProgramacionResponse;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["syllabus", String(variables.silaboId), "unidades"],
      });
    },
  });
};

// PUT: Actualizar unidad existente
export const useUpdateProgramacion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string;
      payload: Partial<UpdateProgramacionBody>;
    }) => {
      const apiBase = getApiBase();
      const syllabusId = payload.silaboId;
      const res = await fetch(
        `${apiBase}/syllabus/${syllabusId}/unidades/${encodeURIComponent(id)}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      if (!res.ok) throw await buildError(res);
      return (await res.json()) as ProgramacionResponse;
    },
    onSuccess: (_, variables) => {
      if (variables.payload.silaboId) {
        queryClient.invalidateQueries({
          queryKey: [
            "syllabus",
            String(variables.payload.silaboId),
            "unidades",
          ],
        });
      }
    },
  });
};
