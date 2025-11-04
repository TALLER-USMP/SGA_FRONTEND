import { useQuery } from "@tanstack/react-query";

const API_BASE_URL = "/api";

// Interfaces para los diferentes tipos de datos de secciones

// Sección 1: Datos Generales
export interface DatosGenerales {
  nombreAsignatura?: string;
  departamentoAcademico?: string;
  escuelaProfesional?: string;
  programaAcademico?: string;
  semestreAcademico?: string;
  tipoAsignatura?: string;
  tipoEstudios?: string;
  modalidad?: string;
  codigoAsignatura?: string;
  ciclo?: string;
  requisitos?: string;
  horasTeoria?: number;
  horasPractica?: number;
  horasLaboratorio?: number;
  horasTeoriaLectivaPresencial?: number;
  horasTeoriaLectivaDistancia?: number;
  horasTeoriaNoLectivaPresencial?: number;
  horasTeoriaNoLectivaDistancia?: number;
  horasPracticaLectivaPresencial?: number;
  horasPracticaLectivaDistancia?: number;
  horasPracticaNoLectivaPresencial?: number;
  horasPracticaNoLectivaDistancia?: number;
  creditosTeoria?: number;
  creditosPractica?: number;
  docentes?: string;
}

// Sección 2: Sumilla
export interface SumillaContent {
  sumilla: string;
}

export interface SumillaResponse {
  success: boolean;
  content: SumillaContent[];
}

// Sección 3: Competencias, Componentes y Actitudes
export interface CompetencyItem {
  id: number;
  silaboId: number;
  text: string;
  code: string;
  order: number;
}

export interface CompetenciesResponse {
  items: CompetencyItem[];
}

export interface AttitudeItem {
  id: number;
  silaboId: number;
  text: string;
  order: number;
  code: string;
}

export interface AttitudesResponse {
  items: AttitudeItem[];
}

export interface Section3Data {
  competencies: CompetencyItem[];
  components: string;
  attitudes: AttitudeItem[];
}

export type SectionData =
  | DatosGenerales
  | SumillaResponse
  | Section3Data
  | Record<string, unknown>;

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

      // Sección 3 requiere múltiples peticiones
      if (sectionNumber === "3") {
        const [competenciesRes, attitudesRes] = await Promise.all([
          fetch(`${API_BASE_URL}/syllabus/${syllabusId}/competencies`),
          fetch(`${API_BASE_URL}/syllabus/${syllabusId}/attitudes`),
        ]);

        if (!competenciesRes.ok || !attitudesRes.ok) {
          throw new Error("Error al obtener datos de la sección 3");
        }

        const [competenciesData, attitudesData] = await Promise.all([
          competenciesRes.json() as Promise<CompetenciesResponse>,
          attitudesRes.json() as Promise<AttitudesResponse>,
        ]);

        console.log("Section 3 data:", {
          competencies: competenciesData,
          attitudes: attitudesData,
        });

        return {
          competencies: competenciesData?.items || [],
          components: "", // Texto plano vacío por defecto
          attitudes: attitudesData?.items || [],
        } as Section3Data;
      }

      // Mapear el número de sección al endpoint correspondiente
      const endpointMap: Record<string, string> = {
        "1": "datos-generales",
        "2": "sumilla",
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

      const url = `${API_BASE_URL}/syllabus/${syllabusId}/${endpoint}`;
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

      const result = await response.json();
      console.log(`Section ${sectionNumber} data:`, result);

      // Sección 1: retorna datos directamente (sin wrapper)
      if (sectionNumber === "1") {
        return result as DatosGenerales;
      }

      // Sección 2: retorna toda la respuesta con estructura { success, content }
      if (sectionNumber === "2") {
        return result as SumillaResponse;
      }

      // Para otras secciones, si la respuesta tiene estructura { success, data }, extraer data
      if (result && typeof result === "object" && "data" in result) {
        return result.data;
      }

      return result;
    },
    enabled: !!syllabusId && !!sectionNumber,
    staleTime: 1000 * 60 * 5, // 5 minutos
    retry: 2,
  });
}
