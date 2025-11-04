import { useQuery } from "@tanstack/react-query";

const API_BASE_URL = "http://localhost:7071";

/**
 * Hook para obtener los datos de una sección específica del sílabo
 * @param syllabusId - ID del sílabo
 * @param sectionNumber - Número de la sección (1-9)
 */
export function useSyllabusSectionData(
  syllabusId: number | null,
  sectionNumber: string | null,
) {
  return useQuery({
    queryKey: ["syllabusSection", syllabusId, sectionNumber],
    queryFn: async () => {
      if (!syllabusId || !sectionNumber) {
        return null;
      }

      // Mapear el número de sección al endpoint correspondiente
      const endpointMap: Record<string, string> = {
        "1": "datos-generales",
        "2": "sumilla",
        "3": "competencias",
        "4": "unidades",
        "5": "estrategias-metodologicas",
        "6": "recursos-didacticos",
        "7": "evaluacion",
        "8": "bibliografia",
        "9": "cronograma",
      };

      const endpoint = endpointMap[sectionNumber];
      if (!endpoint) {
        throw new Error(
          `Endpoint no definido para la sección ${sectionNumber}`,
        );
      }

      const url = `${API_BASE_URL}/api/syllabus/${syllabusId}/${endpoint}`;
      console.log(`Fetching section data from: ${url}`);

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Error al obtener datos de la sección: ${response.status} - ${errorText}`,
        );
      }

      const data = await response.json();
      console.log(`Section ${sectionNumber} data:`, data);

      return data;
    },
    enabled: !!syllabusId && !!sectionNumber,
    staleTime: 1000 * 60 * 5, // 5 minutos
    retry: 2,
  });
}
