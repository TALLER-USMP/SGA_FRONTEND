import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const API_BASE = "http://localhost:7071";

interface ProgramacionData {
  id?: string;
  asignaturaId: string;
  unidades: Array<{
    numero: number;
    titulo: string;
    semanaInicio: number;
    semanaFin: number;
    contenidosConceptuales: string;
    contenidosProcedimentales: string;
  }>;
  semanas: Array<{
    numeroSemana: number;
    horasDisponibles: number;
    unidadNumero: number;
  }>;
  programacionGuardada: Array<{
    semanaNumero: number;
    nombreActividad: string;
    horasAsignadas: 1 | 2 | 3;
  }>;
}

// GET: Obtener programación por asignatura
export const useGetProgramacion = (asignaturaId: string) => {
  return useQuery({
    queryKey: ["programacion", asignaturaId],
    queryFn: async (): Promise<ProgramacionData> => {
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
    mutationFn: async (payload: Omit<ProgramacionData, "id">) => {
      const { data } = await axios.post(
        `${API_BASE}/api/programacion-contenidos`,
        payload,
      );
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["programacion", data.asignaturaId],
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
      payload: Partial<ProgramacionData>;
    }) => {
      const { data } = await axios.put(
        `${API_BASE}/api/programacion-contenidos/${id}`,
        payload,
      );
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["programacion", data.asignaturaId],
      });
    },
  });
};
