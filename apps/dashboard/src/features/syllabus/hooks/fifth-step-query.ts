import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Paso 5: Estrategias Metodológicas

export interface EstrategiaMetodologica {
  titulo: string;
  descripcion: string;
}

export interface EstrategiasMetodologicasResponse {
  items: EstrategiaMetodologica[];
}

export interface EstrategiasMetodologicasData {
  estrategias_metodologicas: EstrategiaMetodologica[] | string;
}

interface ApiErrorResponse {
  message?: string;
  error?: string;
  [key: string]: unknown;
}

class FifthStepManager {
  private getApiBase(baseUrl?: string): string {
    const apiBase =
      baseUrl ??
      import.meta.env.VITE_API_BASE_URL ??
      "http://localhost:7071/api";
    return apiBase;
  }

  /**
   * Parsea el formato legacy de estrategias metodológicas
   * Formato: "Titulo1\bDescripcion1\tTitulo2\bDescripcion2"
   */
  private parseEstrategiasLegacy(text: string): EstrategiaMetodologica[] {
    if (!text || typeof text !== "string") return [];

    const items = text.split("\t").filter((item) => item.trim());
    return items.map((item) => {
      const [titulo, descripcion] = item.split("\b");
      return {
        titulo: titulo?.trim() || "",
        descripcion: descripcion?.trim() || "",
      };
    });
  }

  async fetchEstrategiasMetodologicas(
    syllabusId: number,
    baseUrl?: string,
  ): Promise<EstrategiasMetodologicasResponse> {
    const apiBase = this.getApiBase(baseUrl);
    const url = `${apiBase}/syllabus/${syllabusId}/estrategias_metodologicas`;

    const res = await fetch(url);
    if (res.status === 404) {
      return { items: [] };
    }
    if (!res.ok) {
      const t = await res.text();
      throw new Error(`${res.status} ${t}`);
    }

    const response = await res.json();

    // Extraer data si existe
    const data = response.data || response;

    // Si el backend retorna un array de objetos directamente
    if (Array.isArray(data)) {
      return { items: data };
    }

    // Si retorna un objeto con items
    if (data.items && Array.isArray(data.items)) {
      return data;
    }

    // Si retorna un string (formato legacy), parsearlo
    if (typeof data === "string") {
      return { items: this.parseEstrategiasLegacy(data) };
    }

    // Si retorna un objeto con estrategias_metodologicas
    if (data.estrategias_metodologicas) {
      if (Array.isArray(data.estrategias_metodologicas)) {
        return { items: data.estrategias_metodologicas };
      }
      if (typeof data.estrategias_metodologicas === "string") {
        return {
          items: this.parseEstrategiasLegacy(data.estrategias_metodologicas),
        };
      }
    }

    return { items: [] };
  }

  async updateEstrategiasMetodologicas(
    syllabusId: number,
    data: EstrategiasMetodologicasData,
    baseUrl?: string,
  ): Promise<{ message: string }> {
    const apiBase = this.getApiBase(baseUrl);
    const url = `${apiBase}/syllabus/${syllabusId}/estrategias_metodologicas`;

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

    return res.json();
  }

  async createEstrategiasMetodologicas(
    data: EstrategiasMetodologicasData,
    baseUrl?: string,
  ): Promise<{ message: string }> {
    const apiBase = this.getApiBase(baseUrl);
    const url = `${apiBase}/syllabus/estrategias_metodologicas`;

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

    return res.json();
  }
}

const fifthStepManager = new FifthStepManager();

// ========== HOOKS ==========

export const useEstrategiasMetodologicas = (syllabusId: number | null) => {
  const isValidId = syllabusId !== null && syllabusId > 0;
  return useQuery<EstrategiasMetodologicasResponse, Error>({
    queryKey: ["syllabus", syllabusId, "estrategias-metodologicas"],
    queryFn: () => fifthStepManager.fetchEstrategiasMetodologicas(syllabusId!),
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

export const useSaveEstrategiasMetodologicas = () => {
  const queryClient = useQueryClient();

  return useMutation<
    { message: string },
    Error,
    {
      syllabusId: number;
      data: EstrategiasMetodologicasData;
      isCreating: boolean;
    }
  >({
    mutationFn: ({ syllabusId, data, isCreating }) => {
      if (isCreating) {
        return fifthStepManager.createEstrategiasMetodologicas(data);
      } else {
        return fifthStepManager.updateEstrategiasMetodologicas(
          syllabusId,
          data,
        );
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [
          "syllabus",
          variables.syllabusId,
          "estrategias-metodologicas",
        ],
      });
    },
  });
};
