import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export interface SumillaResponse {
  id?: number;
  silaboId?: number;
  sumilla?: string;
  contenido?: string; // Nombre del campo en el backend
  palabrasClave?: string;
  version?: number;
  esActual?: boolean;
}

export interface SumillaData {
  sumilla: string;
}

interface ApiErrorResponse {
  message?: string;
  error?: string;
  [key: string]: unknown;
}

class SecondStepManager {
  async fetchSumilla(
    syllabusId: number,
    baseUrl?: string,
  ): Promise<SumillaResponse | null> {
    const apiBase =
      baseUrl ??
      import.meta.env.VITE_API_BASE_URL ??
      "http://localhost:7071/api";
    const url = `${apiBase}/syllabus/${syllabusId}/sumilla`;

    const res = await fetch(url);
    if (res.status === 404) {
      return null;
    }
    if (!res.ok) {
      const t = await res.text();
      throw new Error(`${res.status} ${t}`);
    }
    const response = await res.json();

    // El backend retorna un array: [{sumilla: "...", id: 1, silaboId: 1, ...}]
    // Extraemos el primer elemento si es array
    let data = response.content || response;

    if (Array.isArray(data) && data.length > 0) {
      data = data[0];
    }

    // Normalizar: el backend usa 'contenido' pero el frontend espera 'sumilla'
    if (data && typeof data === "object") {
      // Si viene 'contenido' del backend, mapearlo a 'sumilla'
      if ("contenido" in data && !("sumilla" in data)) {
        return { sumilla: data.contenido as string };
      }
    }

    return data;
  }

  async createSumilla(
    syllabusId: number,
    data: SumillaData,
    baseUrl?: string,
  ): Promise<{ message: string }> {
    const apiBase =
      baseUrl ??
      import.meta.env.VITE_API_BASE_URL ??
      "http://localhost:7071/api";
    const url = `${apiBase}/syllabus/${syllabusId}/sumilla`;

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const text = await res.text();
      try {
        const json = JSON.parse(text) as ApiErrorResponse;
        const apiMessage = json?.message || json?.error;
        if (apiMessage) throw new Error(apiMessage);
        throw new Error(JSON.stringify(json));
      } catch (parseError) {
        throw new Error(text || `Error ${res.status}` + parseError);
      }
    }

    const response = await res.json();
    return response;
  }

  async updateSumilla(
    syllabusId: number,
    data: SumillaData,
    baseUrl?: string,
  ): Promise<{ message: string }> {
    const apiBase =
      baseUrl ??
      import.meta.env.VITE_API_BASE_URL ??
      "http://localhost:7071/api";
    const url = `${apiBase}/syllabus/${syllabusId}/sumilla`;

    const res = await fetch(url, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const text = await res.text();
      try {
        const json = JSON.parse(text) as ApiErrorResponse;
        const apiMessage = json?.message || json?.error;
        if (apiMessage) throw new Error(apiMessage);
        throw new Error(JSON.stringify(json));
      } catch (parseError) {
        throw new Error(text || `Error ${res.status}` + parseError);
      }
    }

    const response = await res.json();
    return response;
  }
}

export const secondStepManager = new SecondStepManager();

export const useSumilla = (syllabusId: number | null) => {
  const isValidId = syllabusId !== null && syllabusId > 0;
  return useQuery<SumillaResponse | null, Error>({
    queryKey: ["syllabus", syllabusId, "sumilla"],
    queryFn: () => secondStepManager.fetchSumilla(syllabusId!),
    enabled: isValidId,
    retry: false,
    throwOnError: false,
    // Configuración de cache y refetch
    staleTime: 5 * 60 * 1000, // 5 minutos - los datos se consideran frescos durante este tiempo
    gcTime: 10 * 60 * 1000, // 10 minutos - tiempo que se mantiene en cache
    refetchOnWindowFocus: false, // No refetch al volver a la ventana
    refetchOnMount: false, // No refetch al montar si hay datos en cache
    refetchOnReconnect: false, // No refetch al reconectar internet
  });
};

export const useSaveSumilla = () => {
  const queryClient = useQueryClient();

  return useMutation<
    { message: string },
    Error,
    { syllabusId: number; data: SumillaData; isCreating: boolean }
  >({
    mutationFn: ({ syllabusId, data, isCreating }) => {
      if (isCreating) {
        return secondStepManager.createSumilla(syllabusId, data);
      } else {
        return secondStepManager.updateSumilla(syllabusId, data);
      }
    },
    onSuccess: (_, variables) => {
      // Invalidar cache para refetch los datos actualizados
      queryClient.invalidateQueries({
        queryKey: ["syllabus", variables.syllabusId, "sumilla"],
      });
    },
  });
};
