// src/features/syllabus/hooks/fifth-step-query.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

/** Tipos compartidos */
export interface MethodologicalStrategy {
  id: string;
  title: string;
  description: string;
}

export interface DidacticResource {
  id: string;
  title: string;
  description: string;
}

class SyllabusManager {
  private getBase(baseUrl?: string) {
    return (
      baseUrl ??
      import.meta.env.VITE_API_BASE_URL ??
      "http://localhost:7071/api"
    );
  }

  /* ---------- GET ---------- */
  async fetchMethodologicalStrategies(syllabusId: string, baseUrl?: string) {
    const apiBase = this.getBase(baseUrl);
    const url = `${apiBase}/syllabus/${encodeURIComponent(syllabusId)}/estrategias_metodologicas`;
    const res = await fetch(url, { method: "GET" });
    if (!res.ok) {
      const t = await res.text();
      throw new Error(`GET ${url} -> ${res.status} ${t}`);
    }
    return (await res.json()) as MethodologicalStrategy[];
  }

  async fetchDidacticResources(syllabusId: string, baseUrl?: string) {
    const apiBase = this.getBase(baseUrl);
    // si el backend expone otra ruta para GET, ajusta aquí. Probamos nombre sin _notas también.
    const urls = [
      `${apiBase}/syllabus/${encodeURIComponent(syllabusId)}/recursos_didacticos_notas`,
      `${apiBase}/syllabus/${encodeURIComponent(syllabusId)}/recursos_didacticos`,
    ];
    for (const url of urls) {
      const res = await fetch(url, { method: "GET" });
      if (res.ok) return (await res.json()) as DidacticResource[];
      if (res.status === 404) continue;
      const t = await res.text();
      throw new Error(`GET ${url} -> ${res.status} ${t}`);
    }
    throw new Error(
      `GET recursos: no route matched for syllabusId=${syllabusId}`,
    );
  }

  /* ---------- helper POST/PUT ---------- */
  private async postOrPut(url: string, method: "POST" | "PUT", body: unknown) {
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    return res;
  }

  /* ---------- SAVE estrategias ---------- */
  async saveMethodologicalStrategies(
    syllabusId: string,
    estrategias: MethodologicalStrategy[],
    baseUrl?: string,
  ): Promise<void> {
    const apiBase = this.getBase(baseUrl);
    const normalizedId = (syllabusId ?? "").trim();
    const hasId = normalizedId !== "" && /^\d+$/.test(normalizedId);

    // Prefer PUT /syllabus/{id}/estrategias_metodologicas with expected field name
    if (hasId) {
      const urlPut = `${apiBase}/syllabus/${encodeURIComponent(normalizedId)}/estrategias_metodologicas`;

      // Body expected by backend: { id: <id>, estrategias_metodologicas: [...] }
      let res = await this.postOrPut(urlPut, "PUT", {
        id: normalizedId,
        estrategias_metodologicas: estrategias,
      });
      if (res.ok) return;

      // If PUT rejected with 400 maybe it expects different shape: try with syllabusId key
      if (res.status === 400 || res.status === 422) {
        res = await this.postOrPut(urlPut, "PUT", {
          syllabusId: normalizedId,
          estrategias_metodologicas: estrategias,
        });
        if (res.ok) return;
      }

      // If not found, fall through to POST below
      if (res.status !== 404) {
        const t = await res.text();
        throw new Error(`PUT ${urlPut} -> ${res.status} ${t}`);
      }
    }

    // POST create route (body: { syllabusId, estrategias_metodologicas })
    const urlPost = `${apiBase}/syllabus/estrategias_metodologicas`;
    let resPost = await this.postOrPut(urlPost, "POST", {
      syllabusId: normalizedId,
      estrategias_metodologicas: estrategias,
    });
    if (resPost.ok) return;

    // fallback: POST array directly (unlikely for this backend but safe)
    resPost = await this.postOrPut(urlPost, "POST", estrategias);
    if (resPost.ok) return;

    const t = await resPost.text();
    throw new Error(`POST ${urlPost} -> ${resPost.status} ${t}`);
  }

  /* ---------- SAVE recursos ---------- */
  async saveDidacticResources(
    syllabusId: string,
    recursos: DidacticResource[],
    baseUrl?: string,
  ): Promise<void> {
    const apiBase = this.getBase(baseUrl);
    const normalizedId = (syllabusId ?? "").trim();
    const hasId = normalizedId !== "" && /^\d+$/.test(normalizedId);

    if (hasId) {
      const urlPut = `${apiBase}/syllabus/${encodeURIComponent(normalizedId)}/recursos_didacticos_notas`;

      // Backend expects: { id: <id>, recursos_didacticos_notas: [...] }
      let res = await this.postOrPut(urlPut, "PUT", {
        id: normalizedId,
        recursos_didacticos_notas: recursos,
      });
      if (res.ok) return;

      // fallback: try syllabusId key
      if (res.status === 400 || res.status === 422) {
        res = await this.postOrPut(urlPut, "PUT", {
          syllabusId: normalizedId,
          recursos_didacticos_notas: recursos,
        });
        if (res.ok) return;
      }

      if (res.status !== 404) {
        const t = await res.text();
        throw new Error(`PUT ${urlPut} -> ${res.status} ${t}`);
      }
    }

    const urlPost = `${apiBase}/syllabus/recursos_didacticos_notas`;
    let resPost = await this.postOrPut(urlPost, "POST", {
      syllabusId: normalizedId,
      recursos_didacticos_notas: recursos,
    });
    if (resPost.ok) return;

    // fallback: POST array directly
    resPost = await this.postOrPut(urlPost, "POST", recursos);
    if (resPost.ok) return;

    const t = await resPost.text();
    throw new Error(`POST ${urlPost} -> ${resPost.status} ${t}`);
  }
}

export const syllabusManager = new SyllabusManager();

/* ---------- Hooks (react-query) ---------- */

export const useMethodologicalStrategiesQuery = (syllabusId: string | null) => {
  const normalizedId = (syllabusId ?? "").trim();
  const isValidId = normalizedId !== "" && /^\d+$/.test(normalizedId);

  return useQuery<MethodologicalStrategy[], Error>({
    queryKey: [
      "syllabus",
      isValidId ? normalizedId : null,
      "estrategias_metodologicas",
    ],
    queryFn: () => syllabusManager.fetchMethodologicalStrategies(normalizedId),
    enabled: isValidId,
    retry: false,
  });
};

export const useDidacticResourcesQuery = (syllabusId: string | null) => {
  const normalizedId = (syllabusId ?? "").trim();
  const isValidId = normalizedId !== "" && /^\d+$/.test(normalizedId);

  return useQuery<DidacticResource[], Error>({
    queryKey: [
      "syllabus",
      isValidId ? normalizedId : null,
      "recursos_didacticos",
    ],
    queryFn: () => syllabusManager.fetchDidacticResources(normalizedId),
    enabled: isValidId,
    retry: false,
  });
};

export const useSaveMethodologicalStrategies = () => {
  const qc = useQueryClient();
  return useMutation<
    void,
    Error,
    { syllabusId: string; estrategias: MethodologicalStrategy[] }
  >({
    mutationFn: async (vars) => {
      return await syllabusManager.saveMethodologicalStrategies(
        vars.syllabusId,
        vars.estrategias,
      );
    },
    onSuccess: (_data, variables) => {
      const id = (variables.syllabusId ?? "").trim();
      if (id && /^\d+$/.test(id)) {
        qc.invalidateQueries({
          queryKey: ["syllabus", id, "estrategias_metodologicas"],
        });
      }
    },
  });
};

export const useSaveDidacticResources = () => {
  const qc = useQueryClient();
  return useMutation<
    void,
    Error,
    { syllabusId: string; recursos: DidacticResource[] }
  >({
    mutationFn: async (vars) => {
      return await syllabusManager.saveDidacticResources(
        vars.syllabusId,
        vars.recursos,
      );
    },
    onSuccess: (_data, variables) => {
      const id = (variables.syllabusId ?? "").trim();
      if (id && /^\d+$/.test(id)) {
        qc.invalidateQueries({
          queryKey: ["syllabus", id, "recursos_didacticos"],
        });
      }
    },
  });
};
