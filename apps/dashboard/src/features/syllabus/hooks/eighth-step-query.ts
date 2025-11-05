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
    // Prefer the new contribution endpoint; fallback to cronograma for backward compat
    const contributionUrl = `${apiBase}/syllabus/${syllabusId}/contribution`;
    const cronogramaUrl = `${apiBase}/syllabus/${syllabusId}/cronograma`;

    // Try contribution endpoint first
    let res = await fetch(contributionUrl);
    if (res.status === 404) {
      // Try legacy endpoint
      res = await fetch(cronogramaUrl);
    }
    if (res.status === 404) {
      return { items: [] };
    }
    if (!res.ok) {
      const t = await res.text();
      throw new Error(`${res.status} ${t}`);
    }

    const response = (await res.json()) as Record<string, unknown>;

    // Manejar diferentes formatos de respuesta
    if (response.data) {
      const data = response.data as Record<string, unknown>;
      if (Array.isArray(data)) {
        return { items: data as StudentOutcome[] };
      }
      if ("items" in data) {
        return data as ResultadosResponse;
      }
      if ("resultados" in data) {
        return { items: data.resultados as StudentOutcome[] };
      }
      if ("outcomes" in data) {
        return { items: data.outcomes as StudentOutcome[] };
      }
      return { items: [] };
    }

    if (Array.isArray(response)) {
      return { items: response as StudentOutcome[] };
    }

    if ("items" in response) {
      return response as ResultadosResponse;
    }

    if ("resultados" in response) {
      return { items: response.resultados as StudentOutcome[] };
    }

    if ("outcomes" in response) {
      return { items: response.outcomes as StudentOutcome[] };
    }

    return { items: [] };
  }

  async createResultados(
    syllabusId: number,
    data: ResultadosData,
    baseUrl?: string,
  ): Promise<{ message: string }> {
    const apiBase = this.getApiBase(baseUrl);
    const url = `${apiBase}/syllabus/${syllabusId}/contribution`;

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      return res.json();
    }

    // If the batch POST fails (400), attempt to POST each outcome individually
    // Some backends expect a single contribution per request.
    const status = res.status;
    const text = await res.text();

    // Try to parse the server error to decide fallback
    let parsedError: ApiErrorResponse | null = null;
    try {
      parsedError = JSON.parse(text) as ApiErrorResponse;
    } catch {
      parsedError = null;
    }

    // If payload contains an outcomes array, attempt per-item POSTs
    const dataOutcomes = (data as ResultadosData).outcomes;
    if (
      Array.isArray(dataOutcomes) &&
      (status === 400 || status === 404 || status === 422)
    ) {
      const items: StudentOutcome[] = dataOutcomes;
      const results: Array<{ ok: boolean; status: number; body?: unknown }> =
        [];

      for (const it of items) {
        console.log("Procesando item individual:", it);
        // Asegurarnos de que la descripción y aporte_valor se envíen correctamente
        const description = it.description || ""; // Convertir undefined/null a string vacío
        const aporteValor = it.level === undefined ? "" : it.level; // Preservar "", "K", o "R"

        const singleBody: Record<string, unknown> = {
          syllabusId: Number(syllabusId),
          // El código del resultado del programa (1,2,3,etc)
          resultadoProgramaCodigo: String(it.id ?? ""),
          // La descripción del resultado del programa - asegurar que siempre se envíe
          resultadoProgramaDescripcion: description,
          // El valor del aporte (K/R/vacío) - asegurar que se preserve el valor exacto
          aporte_valor: aporteValor,
        };
        console.log("Body preparado para envío:", singleBody);
        // include id/order when present
        if (it.id !== undefined) singleBody.id = it.id;
        if (it.order !== undefined) singleBody.order = it.order;

        try {
          const r = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(singleBody),
          });
          const btext = await r.text();
          let bjson: unknown;
          try {
            bjson = JSON.parse(btext);
          } catch {
            bjson = btext;
          }
          results.push({ ok: r.ok, status: r.status, body: bjson });
        } catch (err) {
          results.push({ ok: false, status: 0, body: String(err) });
        }
      }

      // If at least one item succeeded, return success summary, otherwise throw aggregated error
      const anyOk = results.some((r) => r.ok);
      if (anyOk) {
        return {
          message: `Created ${results.filter((r) => r.ok).length} of ${results.length} contributions`,
        };
      }

      // No item succeeded -> throw aggregated error to surface server messages
      throw new Error(
        JSON.stringify({
          message: parsedError?.message ?? text ?? `Error ${status}`,
          results,
        }),
      );
    }

    // Otherwise, surface the original error
    try {
      const json = JSON.parse(text) as ApiErrorResponse;
      const apiMessage = json?.message || json?.error;
      if (apiMessage) throw new Error(apiMessage);
      throw new Error(JSON.stringify(json));
    } catch (error) {
      throw new Error(
        text || `Error ${res.status}` || `error: ${String(error)}`,
      );
    }
  }

  async updateResultados(
    syllabusId: number,
    data: ResultadosData,
    baseUrl?: string,
  ): Promise<{ message: string }> {
    const apiBase = this.getApiBase(baseUrl);
    const contributionUrl = `${apiBase}/syllabus/${syllabusId}/contribution`;
    const cronogramaUrl = `${apiBase}/syllabus/${syllabusId}/cronograma`;

    // Try PUT on contribution (if backend implements it), otherwise try PUT on legacy
    let res = await fetch(contributionUrl, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (res.status === 404) {
      // Try legacy endpoint PUT
      res = await fetch(cronogramaUrl, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    }

    // If the endpoint returns 404 for PUT, try creating instead (some backends
    // expose POST but not PUT for this resource)
    if (res.status === 404) {
      return this.createResultados(syllabusId, data, baseUrl);
    }

    if (!res.ok) {
      const text = await res.text();
      try {
        const json = JSON.parse(text) as ApiErrorResponse;
        const apiMessage = json?.message || json?.error;
        if (apiMessage) throw new Error(apiMessage);
        throw new Error(JSON.stringify(json));
      } catch (error) {
        throw new Error(
          text || `Error ${res.status}` || `error: ${String(error)}`,
        );
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
