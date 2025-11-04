import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { UseQueryOptions } from "@tanstack/react-query";

export interface SyllabusReview {
  id: string;
  courseName: string;
  courseCode: string;
  teacherName: string;
  docenteId: number;
  syllabusId: number;
  status: "ANALIZANDO" | "VALIDADO" | "DESAPROBADO" | "ASIGNADO";
  submittedDate: string;
}

export interface ReviewData {
  [fieldId: string]: {
    status: "approved" | "rejected" | null;
    comment: string;
  };
}

export interface ApproveRejectRequest {
  syllabusId: number;
  estado: "VALIDADO" | "DESAPROBADO";
  reviewData: ReviewData;
}

class SyllabusReviewManager {
  async fetchAllInReview(baseUrl?: string): Promise<SyllabusReview[]> {
    const apiBase =
      baseUrl ??
      import.meta.env.VITE_API_BASE_URL ??
      "http://localhost:7071/api";
    const url = `${apiBase}/syllabus/revision`;
    const res = await fetch(url);
    if (!res.ok) {
      const t = await res.text();
      throw new Error(`${res.status} ${t}`);
    }
    const json = await res.json();
    const rawData = Array.isArray(json) ? json : (json?.data ?? []);

    // respuesta cruda procesada

    // Mapear datos del backend al formato esperado de forma defensiva.
    return rawData.map((item: Record<string, unknown>) => {
      // Intentar localizar un id útil en varios campos posibles
      const possibleId =
        item.id ??
        item._id ??
        item.syllabusId ??
        item.silaboId ??
        item.silaboID ??
        item.idRevision ??
        "";

      const idStr = String(possibleId ?? "");

      // Para syllabusId preferimos campos numéricos conocidos
      const possibleSyllabusId =
        item.syllabusId ??
        item.silaboId ??
        item.id ??
        item.silaboID ??
        item.idSyllabus ??
        0;

      const syllabusIdNum = Number(possibleSyllabusId) || 0;

      const mapped = {
        id: idStr,
        courseName:
          (item.cursoNombre as string) ||
          (item.courseName as string) ||
          "Sin nombre",
        courseCode:
          (item.cursoCodigo as string) || (item.courseCode as string) || "N/A",
        teacherName:
          (item.nombreDocente as string) ||
          (item.teacherName as string) ||
          "No asignado",
        docenteId: Number(item.asignadoADocenteId ?? item.docenteId ?? 0) || 0,
        syllabusId: syllabusIdNum, // número identificador del sílabo
        status: ["ANALIZANDO", "VALIDADO", "DESAPROBADO", "ASIGNADO"].includes(
          String(item.estadoRevision),
        )
          ? (String(item.estadoRevision) as SyllabusReview["status"])
          : "ANALIZANDO",
        submittedDate: (item.createdAt as string) || new Date().toISOString(),
      } as SyllabusReview;

      return mapped;
    }) as SyllabusReview[];
  }

  async fetchReviewData(
    syllabusId: number,
    baseUrl?: string,
  ): Promise<ReviewData | null> {
    const apiBase =
      baseUrl ??
      import.meta.env.VITE_API_BASE_URL ??
      "http://localhost:7071/api";
    const url = `${apiBase}/syllabus/${syllabusId}/revision`;
    const res = await fetch(url);
    if (res.status === 404) {
      // No hay datos de revisión guardados
      return null;
    }
    if (!res.ok) {
      const t = await res.text();
      throw new Error(`${res.status} ${t}`);
    }
    return (await res.json()) as ReviewData;
  }

  async saveReviewData(
    syllabusId: number,
    reviewData: ReviewData,
    baseUrl?: string,
  ): Promise<void> {
    const apiBase =
      baseUrl ??
      import.meta.env.VITE_API_BASE_URL ??
      "http://localhost:7071/api";
    const url = `${apiBase}/syllabus/${syllabusId}/revision`;
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reviewData),
    });
    if (!res.ok) {
      const t = await res.text();
      throw new Error(`${res.status} ${t}`);
    }
  }

  async approveSyllabus(
    data: ApproveRejectRequest,
    baseUrl?: string,
  ): Promise<void> {
    const apiBase =
      baseUrl ??
      import.meta.env.VITE_API_BASE_URL ??
      "http://localhost:7071/api";
    const url = `${apiBase}/syllabus/${data.syllabusId}/aprobar`;
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        estado: data.estado,
        reviewData: data.reviewData,
      }),
    });
    if (!res.ok) {
      const t = await res.text();
      throw new Error(`${res.status} ${t}`);
    }
  }
}

export const syllabusReviewManager = new SyllabusReviewManager();

// Hook para obtener todos los sílabos en revisión
export const useSyllabusInReview = (
  options?: UseQueryOptions<SyllabusReview[], Error>,
) => {
  return useQuery<SyllabusReview[], Error>({
    queryKey: ["syllabus", "in-review"],
    queryFn: () => syllabusReviewManager.fetchAllInReview(),
    staleTime: 30_000, // 30 segundos
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    retry: false, // No reintentar en caso de error (como 403)
    ...options,
  });
};

// Hook para obtener datos de revisión de un sílabo específico
export const useReviewData = (
  syllabusId: number | null | undefined,
  options?: UseQueryOptions<ReviewData | null, Error>,
) => {
  return useQuery<ReviewData | null, Error>({
    queryKey: ["syllabus", syllabusId, "review-data"],
    queryFn: () => syllabusReviewManager.fetchReviewData(syllabusId as number),
    enabled: syllabusId !== null && syllabusId !== undefined,
    retry: false,
    staleTime: 10_000, // 10 segundos
    ...options,
  });
};

// Hook para guardar datos de revisión
export const useSaveReviewData = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      syllabusId,
      reviewData,
    }: {
      syllabusId: number;
      reviewData: ReviewData;
    }) => syllabusReviewManager.saveReviewData(syllabusId, reviewData),
    onSuccess: (_data, variables) => {
      // Invalidar la caché de review data para el sílabo específico
      queryClient.invalidateQueries({
        queryKey: ["syllabus", variables.syllabusId, "review-data"],
      });
    },
  });
};

// Hook para aprobar o desaprobar sílabo
export const useApproveSyllabus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ApproveRejectRequest) =>
      syllabusReviewManager.approveSyllabus(data),
    onSuccess: () => {
      // Invalidar la lista de sílabos en revisión
      queryClient.invalidateQueries({
        queryKey: ["syllabus", "in-review"],
      });
    },
  });
};
