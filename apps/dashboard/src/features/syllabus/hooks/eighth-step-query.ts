import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Tipos para Resultados del Estudiante (Paso 8)
export interface StudentOutcome {
  id?: number;
  code?: string;
  description?: string;
  level?: "K" | "R" | "";
  codigo?: string;
  descripcion?: string;
  nivel?: "K" | "R" | "";
  [key: string]: unknown;
}

export interface ResultadosResponse {
  items?: StudentOutcome[];
  resultados?: StudentOutcome[];
  outcomes?: StudentOutcome[];
  [key: string]: unknown;
}

export interface ResultadosData {
  items?: StudentOutcome[];
  resultados?: StudentOutcome[];
  outcomes?: StudentOutcome[];
  [key: string]: unknown;
}

interface ApiErrorResponse {
  message?: string;
  error?: string;
  [key: string]: unknown;
}

class EighthStepManager {
  getApiBase(baseUrl?: string): string {
    return (
      baseUrl ??
      import.meta.env.VITE_API_BASE_URL ??
      "http://localhost:7071/api"
    );
  }

  async fetchResultados(
    syllabusId: number,
    baseUrl?: string,
  ): Promise<ResultadosResponse> {
    const apiBase = this.getApiBase(baseUrl);
    const url = `${apiBase}/syllabus/${syllabusId}/cronograma`;

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
      if (data.resultados) {
        return { items: data.resultados };
      }
      if (data.outcomes) {
        return { items: data.outcomes };
      }
      return { items: [] };
    }

    if (Array.isArray(response)) {
      return { items: response };
    }

    if (response.items) {
      return response;
    }

    if (response.resultados) {
      return { items: response.resultados };
    }

    if (response.outcomes) {
      return { items: response.outcomes };
    }

    return { items: [] };
  }

  async createResultados(
    syllabusId: number,
    data: ResultadosData,
    baseUrl?: string,
  ): Promise<{ message: string }> {
    const apiBase = this.getApiBase(baseUrl);
    const url = `${apiBase}/syllabus/${syllabusId}/cronograma`;

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

  async updateResultados(
    syllabusId: number,
    data: ResultadosData,
    baseUrl?: string,
  ): Promise<{ message: string }> {
    const apiBase = this.getApiBase(baseUrl);
    const url = `${apiBase}/syllabus/${syllabusId}/cronograma`;

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

const eighthStepManager = new EighthStepManager();

export const useResultados = (syllabusId: number | null) => {
  const isValidId = syllabusId !== null && syllabusId > 0;

  return useQuery<ResultadosResponse, Error>({
    queryKey: ["syllabus", syllabusId, "cronograma"],
    queryFn: () => eighthStepManager.fetchResultados(syllabusId!),
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

export const useSaveResultados = () => {
  const queryClient = useQueryClient();

  return useMutation<
    { message: string },
    Error,
    { syllabusId: number; data: ResultadosData; isCreating: boolean }
  >({
    mutationFn: ({ syllabusId, data, isCreating }) => {
      if (isCreating) {
        return eighthStepManager.createResultados(syllabusId, data);
      } else {
        return eighthStepManager.updateResultados(syllabusId, data);
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["syllabus", variables.syllabusId, "cronograma"],
      });
    },
  });
};
