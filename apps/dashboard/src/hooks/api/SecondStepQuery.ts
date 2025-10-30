import { useQuery, useMutation } from "@tanstack/react-query";

export interface SumillaResponse {
  success: boolean;
  content: Array<{
    sumilla: string;
  }>;
}

interface ApiErrorResponse {
  message?: string;
  error?: string;
  [key: string]: unknown;
}

class SecondStepManager {
  async fetchSumilla(
    syllabusId: string,
    baseUrl?: string,
  ): Promise<SumillaResponse | null> {
    const apiBase =
      baseUrl ??
      import.meta.env.VITE_API_BASE_URL ??
      "http://localhost:7071/api";
    const url = `${apiBase}/syllabus/${encodeURIComponent(syllabusId)}/sumilla`;
    const res = await fetch(url);
    if (res.status === 404) {
      // Aún no hay sumilla registrada
      return null;
    }
    if (!res.ok) {
      const t = await res.text();
      throw new Error(`${res.status} ${t}`);
    }
    const data = (await res.json()) as SumillaResponse;
    return data;
  }

  async postSumilla(
    id: string,
    sumilla: string,
    baseUrl?: string,
  ): Promise<void> {
    const apiBase =
      baseUrl ??
      import.meta.env.VITE_API_BASE_URL ??
      "http://localhost:7071/api";
    const url = `${apiBase}/syllabus/${encodeURIComponent(id)}/sumilla`;
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sumilla }),
    });
    if (res.status === 200 || res.status === 201) return;

    // intentar parsear error JSON
    try {
      const json = (await res.json()) as ApiErrorResponse;
      const apiMessage = json?.message || json?.error;
      if (apiMessage) throw new Error(apiMessage);
      throw new Error(JSON.stringify(json));
    } catch {
      // fallback a texto simple
      try {
        const t = await res.text();
        throw new Error(t || `Error ${res.status}`);
      } catch {
        throw new Error(`Error desconocido: ${res.status}`);
      }
    }
  }

  async putSumilla(
    id: string,
    sumilla: string,
    baseUrl?: string,
  ): Promise<void> {
    const apiBase =
      baseUrl ??
      import.meta.env.VITE_API_BASE_URL ??
      "http://localhost:7071/api";
    const url = `${apiBase}/syllabus/${encodeURIComponent(id)}/sumilla`;
    const res = await fetch(url, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sumilla }),
    });
    if (res.status === 200 || res.status === 201) return;

    // intentar parsear error JSON
    try {
      const json = (await res.json()) as ApiErrorResponse;
      const apiMessage = json?.message || json?.error;
      if (apiMessage) throw new Error(apiMessage);
      throw new Error(JSON.stringify(json));
    } catch {
      // fallback a texto simple
      try {
        const t = await res.text();
        throw new Error(t || `Error ${res.status}`);
      } catch {
        throw new Error(`Error desconocido: ${res.status}`);
      }
    }
  }
}

export const secondStepManager = new SecondStepManager();

export const useSumilla = (syllabusId: string | null) => {
  const normalizedId = (syllabusId ?? "").trim();
  const isValidId = normalizedId !== "" && /^\d+$/.test(normalizedId);
  return useQuery<SumillaResponse | null, Error>({
    queryKey: ["syllabus", isValidId ? normalizedId : null, "sumilla"],
    queryFn: () => secondStepManager.fetchSumilla(normalizedId),
    enabled: isValidId,
    retry: false,
  });
};

export const useSaveSumilla = () => {
  return useMutation<
    void,
    Error,
    { id: string; sumilla: string; isUpdate: boolean }
  >({
    mutationFn: ({ id, sumilla, isUpdate }) =>
      isUpdate
        ? secondStepManager.putSumilla(id, sumilla)
        : secondStepManager.postSumilla(id, sumilla),
  });
};
