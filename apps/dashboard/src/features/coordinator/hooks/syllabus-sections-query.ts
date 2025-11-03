import { useQuery } from "@tanstack/react-query";

export interface SyllabusSection {
  id: number;
  silaboId: number;
  numeroSección: number;
}

// Hook para obtener las secciones disponibles de un sílabo en revisión
export const useSyllabusSections = (syllabusId: number | null) => {
  return useQuery<SyllabusSection[]>({
    queryKey: ["syllabus-sections", syllabusId],
    queryFn: async () => {
      if (!syllabusId) {
        throw new Error("syllabusId es requerido");
      }

      const response = await fetch(`/api/syllabus/revision/${syllabusId}`);

      if (!response.ok) {
        throw new Error("Error al obtener las secciones del sílabo");
      }

      const result = await response.json();

      console.log("Response from /api/syllabus/revision:", result);

      // Manejar diferentes formatos de respuesta
      // Si la respuesta tiene la estructura { success, message, data }
      if (result && typeof result === "object" && "data" in result) {
        if (!result.success) {
          throw new Error(result.message || "Error al obtener las secciones");
        }
        return Array.isArray(result.data) ? result.data : [];
      }

      // Si la respuesta es directamente un array
      if (Array.isArray(result)) {
        return result;
      }

      // Si no es ninguno de los casos anteriores, retornar array vacío
      console.warn("Formato de respuesta inesperado:", result);
      return [];
    },
    enabled: !!syllabusId && syllabusId > 0,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
};
