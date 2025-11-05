import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Tipos para Bibliografía (Paso 7)
export interface Bibliography {
  id?: string | number;
  authors?: string;
  year?: string;
  title?: string;
  autores?: string;
  anio?: string;
  titulo?: string;
  [key: string]: unknown;
}

export interface ElectronicResource {
  id?: string | number;
  source?: string;
  year?: string;
  url?: string;
  fuente?: string;
  anio?: string;
  enlace?: string;
  [key: string]: unknown;
}

export interface BibliografiaResponse {
  bibliografias?: Bibliography[];
  recursosElectronicos?: ElectronicResource[];
  items?: Bibliography[];
  recursos?: ElectronicResource[];
  [key: string]: unknown;
}

export interface BibliografiaData {
  bibliografias?: Bibliography[];
  recursosElectronicos?: ElectronicResource[];
  [key: string]: unknown;
}

interface ApiErrorResponse {
  message?: string;
  error?: string;
  [key: string]: unknown;
}

class SeventhStepManager {
  getApiBase(baseUrl?: string): string {
    return (
      baseUrl ??
      import.meta.env.VITE_API_BASE_URL ??
      "http://localhost:7071/api"
    );
  }

  async fetchBibliografia(
    syllabusId: number,
    baseUrl?: string,
  ): Promise<BibliografiaResponse> {
    const apiBase = this.getApiBase(baseUrl);
    const url = `${apiBase}/syllabus/${syllabusId}/bibliografia`;

    const res = await fetch(url);
    if (res.status === 404) {
      return { bibliografias: [], recursosElectronicos: [] };
    }
    if (!res.ok) {
      const t = await res.text();
      throw new Error(`${res.status} ${t}`);
    }

    const response = await res.json();

    // Manejar diferentes formatos de respuesta
    if (response.data) {
      const data = response.data;
      return {
        bibliografias: data.bibliografias || data.items || [],
        recursosElectronicos: data.recursosElectronicos || data.recursos || [],
      };
    }

    if (response.bibliografias || response.recursosElectronicos) {
      return {
        bibliografias: response.bibliografias || [],
        recursosElectronicos: response.recursosElectronicos || [],
      };
    }

    if (response.items || response.recursos) {
      return {
        bibliografias: response.items || [],
        recursosElectronicos: response.recursos || [],
      };
    }

    return { bibliografias: [], recursosElectronicos: [] };
  }

  async createBibliografia(
    syllabusId: number,
    data: BibliografiaData,
    baseUrl?: string,
  ): Promise<{ message: string }> {
    const apiBase = this.getApiBase(baseUrl);
    const url = `${apiBase}/syllabus/${syllabusId}/bibliografia`;

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

  async updateBibliografia(
    syllabusId: number,
    data: BibliografiaData,
    baseUrl?: string,
  ): Promise<{ message: string }> {
    const apiBase = this.getApiBase(baseUrl);
    const url = `${apiBase}/syllabus/${syllabusId}/bibliografia`;

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

const seventhStepManager = new SeventhStepManager();

export const useBibliografia = (syllabusId: number | null) => {
  const isValidId = syllabusId !== null && syllabusId > 0;

  return useQuery<BibliografiaResponse, Error>({
    queryKey: ["syllabus", syllabusId, "bibliografia"],
    queryFn: () => seventhStepManager.fetchBibliografia(syllabusId!),
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

export const useSaveBibliografia = () => {
  const queryClient = useQueryClient();

  return useMutation<
    { message: string },
    Error,
    { syllabusId: number; data: BibliografiaData; isCreating: boolean }
  >({
    mutationFn: ({ syllabusId, data, isCreating }) => {
      if (isCreating) {
        return seventhStepManager.createBibliografia(syllabusId, data);
      } else {
        return seventhStepManager.updateBibliografia(syllabusId, data);
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["syllabus", variables.syllabusId, "bibliografia"],
      });
    },
  });
};
