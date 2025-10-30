import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
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
// GET: Obtener programación por asignatura
export const useGetProgramacion = (asignaturaId: string) => {
  return useQuery({
    queryKey: ["programacion", asignaturaId],
    queryFn: async (): Promise<ProgramacionResponse[]> => {
      const { data } = await axios.get(
        `${API_BASE}/api/programacion-contenidos/${asignaturaId}`,
      );
      return data;
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
      const { data } = await axios.post(
        `${API_BASE}/api/programacion-contenidos/`,
        payload,
      );
      return data as ProgramacionResponse;
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
      const { data } = await axios.put(
        `${API_BASE}/api/programacion-contenidos/${id}`,
        payload,
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["programacion"],
        exact: false,
      });
    },
  });
};
