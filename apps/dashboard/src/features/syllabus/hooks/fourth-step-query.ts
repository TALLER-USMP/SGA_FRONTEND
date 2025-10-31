import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const API_BASE = "http://localhost:7071";

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

// GET: Obtener programación por asignatura
export const useGetProgramacion = (asignaturaId: string) => {
  return useQuery<ProgramacionResponse[]>({
    queryKey: ["programacion", asignaturaId],
    queryFn: async () => {
      const res = await fetch(
        `${API_BASE}/api/programacion-contenidos/${encodeURIComponent(asignaturaId)}`,
      );
      if (!res.ok) throw await buildError(res);
      return (await res.json()) as ProgramacionResponse[];
    },
    enabled: !!asignaturaId,
    staleTime: 1000 * 60 * 5,
  });
};

// POST: Crear nueva programación
export const useCreateProgramacion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreateProgramacionBody) => {
      const res = await fetch(`${API_BASE}/api/programacion-contenidos/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw await buildError(res);
      return (await res.json()) as ProgramacionResponse;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["programacion"],
        exact: false,
      });
    },
  });
};

// PUT: Actualizar programación existente
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
      const res = await fetch(
        `${API_BASE}/api/programacion-contenidos/${encodeURIComponent(id)}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      if (!res.ok) throw await buildError(res);
      return (await res.json()) as ProgramacionResponse;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["programacion"],
        exact: false,
      });
    },
  });
};
