import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Tipos para Recursos Didácticos (Paso 6)
export interface RecursoDidactico {
  id?: number;
  silaboId?: number;
  tipo?: string;
  descripcion?: string;
  [key: string]: unknown;
}

export interface RecursosDidacticosResponse {
  items?: RecursoDidactico[];
  recursos?: RecursoDidactico[];
  [key: string]: unknown;
}

export interface RecursosDidacticosData {
  recursos?: RecursoDidactico[];
  items?: RecursoDidactico[];
  [key: string]: unknown;
}

interface ApiErrorResponse {
  message?: string;
  error?: string;
  [key: string]: unknown;
}

class SixthStepManager {
  getApiBase(baseUrl?: string): string {
    return (
      baseUrl ??
      import.meta.env.VITE_API_BASE_URL ??
      "http://localhost:7071/api"
    );
  }

  async fetchRecursosDidacticos(
    syllabusId: number,
    baseUrl?: string,
  ): Promise<RecursosDidacticosResponse> {
    const apiBase = this.getApiBase(baseUrl);
    const url = `${apiBase}/syllabus/${syllabusId}/recursos-didacticos`;

    const res = await fetch(url);
    if (res.status === 404) {
      return { items: [] };
    }
    if (!res.ok) {
      const t = await res.text();
      throw new Error(`${res.status} ${t}`);
    }

    const response = await res.json();

    // Manejar diferentes formatos de respuesta
    if (response.data) {
      const data = response.data;
      if (Array.isArray(data)) {
        return { items: data };
      }
      if (data.items) {
        return data;
      }
      if (data.recursos) {
        return { items: data.recursos };
      }
      return { items: [] };
    }

    if (Array.isArray(response)) {
      return { items: response };
    }

    if (response.items) {
      return response;
    }

    if (response.recursos) {
      return { items: response.recursos };
    }

    return { items: [] };
  }

  async createRecursosDidacticos(
    syllabusId: number,
    data: RecursosDidacticosData,
    baseUrl?: string,
  ): Promise<{ message: string }> {
    const apiBase = this.getApiBase(baseUrl);
    const url = `${apiBase}/syllabus/${syllabusId}/recursos-didacticos`;

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
      } catch (_parseError) {
        throw new Error(text || `Error ${res.status}` || "error" + _parseError);
      }
    }

    return res.json();
  }

  async updateRecursosDidacticos(
    syllabusId: number,
    data: RecursosDidacticosData,
    baseUrl?: string,
  ): Promise<{ message: string }> {
    const apiBase = this.getApiBase(baseUrl);
    const url = `${apiBase}/syllabus/${syllabusId}/recursos-didacticos`;

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
      } catch (_parseError) {
        throw new Error(text || `Error ${res.status}` || "error" + _parseError);
      }
    }

    return res.json();
  }
}

const sixthStepManager = new SixthStepManager();

export const useRecursosDidacticos = (syllabusId: number | null) => {
  const isValidId = syllabusId !== null && syllabusId > 0;

  return useQuery<RecursosDidacticosResponse, Error>({
    queryKey: ["syllabus", syllabusId, "recursos-didacticos"],
    queryFn: () => sixthStepManager.fetchRecursosDidacticos(syllabusId!),
    enabled: isValidId,
    retry: false,
    throwOnError: false,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
};

export const useSaveRecursosDidacticos = () => {
  const queryClient = useQueryClient();

  return useMutation<
    { message: string },
    Error,
    { syllabusId: number; data: RecursosDidacticosData; isCreating: boolean }
  >({
    mutationFn: ({ syllabusId, data, isCreating }) => {
      if (isCreating) {
        return sixthStepManager.createRecursosDidacticos(syllabusId, data);
      } else {
        return sixthStepManager.updateRecursosDidacticos(syllabusId, data);
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["syllabus", variables.syllabusId, "recursos-didacticos"],
      });
    },
  });
};
