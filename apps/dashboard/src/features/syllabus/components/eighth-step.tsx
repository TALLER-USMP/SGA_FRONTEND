import { useState, useEffect, useRef } from "react";
import { Step } from "./step";
import { useSteps } from "../contexts/steps-context-provider";
import { ChevronDown } from "lucide-react";
import { useResultados, useSaveResultados } from "../hooks/eighth-step-query";
import { useSyllabusContext } from "../contexts/syllabus-context";
import { toast } from "sonner";

import type { StudentOutcome as BackendStudentOutcome } from "../hooks/eighth-step-query";
import type { ResultadosData } from "../hooks/eighth-step-query";

// Tipo local para StudentOutcome con campos requeridos
interface StudentOutcome {
  id: number;
  code: string;
  description: string;
  level: "K" | "R" | "";
}

// Tipo para el item de payload que se envía al backend
interface OutcomePayloadItem extends BackendStudentOutcome {
  id: number;
  resultadoProgramaCodigo: string;
  resultadoProgramaDescripcion: string;
  aporte_valor: string;
  [key: string]: unknown;
}

// Data mockeada (se usa como fallback si no hay datos del backend)
const mockStudentOutcomes: StudentOutcome[] = [
  {
    id: 1,
    code: "K",
    description:
      "Analizar un sistema complejo de computación aplicar principios de computación y otras disciplinas relevantes",
    level: "",
  },
  { id: 2, code: "R", description: "Diseñar implementar y evaluar", level: "" },
  {
    id: 3,
    code: "",
    description: "Comunicación efectiva en una variedad",
    level: "",
  },
  {
    id: 4,
    code: "",
    description: "Reconoce la responsabilidad profesional",
    level: "",
  },
  {
    id: 5,
    code: "",
    description: "Trabajo de manera efectiva como miembro líder o un equipos",
    level: "",
  },
  { id: 6, code: "", description: "Brindar soporte a la entrega", level: "" },
  { id: 7, code: "", description: "Aprendizaje continuo", level: "" },
];

export default function EighthStep() {
  const { nextStep } = useSteps();
  const { syllabusId } = useSyllabusContext();

  // Query + mutación
  const resultadosQuery = useResultados(syllabusId ? Number(syllabusId) : null);
  const saveResultados = useSaveResultados();

  // Estado local
  const [outcomes, setOutcomes] =
    useState<StudentOutcome[]>(mockStudentOutcomes);
  const originalRef = useRef<StudentOutcome[]>(mockStudentOutcomes);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Cargar datos del backend cuando estén disponibles
  useEffect(() => {
    const responseItems = resultadosQuery.data?.items ?? [];

    // Si no hay datos, usar mock
    if (responseItems.length === 0) {
      setOutcomes(mockStudentOutcomes);
      originalRef.current = mockStudentOutcomes;
      return;
    }

    // Mapear items del backend a formato local
    const mappedItems = responseItems.map((it, idx): StudentOutcome => {
      const mockOutcome = mockStudentOutcomes[idx];
      return {
        id: Number(it.id ?? idx + 1),
        code: it.codigo ?? it.code ?? "",
        description: mockOutcome ? mockOutcome.description : "",
        level: (it.aporte_valor ??
          it.nivel ??
          it.level ??
          "") as StudentOutcome["level"],
      };
    });

    setOutcomes(mappedItems);
    originalRef.current = mappedItems;
  }, [resultadosQuery.data]);

  const hasChanges = () => {
    if (!originalRef.current) return true;
    const orig = originalRef.current;
    if (orig.length !== outcomes.length) return true;
    for (let i = 0; i < outcomes.length; i++) {
      const a = outcomes[i];
      const b = orig[i];
      if (a.level !== b.level) return true;
    }
    return false;
  };

  const handleNextStep = async () => {
    // Si no hay syllabusId, solo avanzar
    if (!syllabusId) {
      nextStep();
      return;
    }

    // Si no hay cambios, avanzar
    if (!hasChanges()) {
      nextStep();
      return;
    }

    // Debug logs
    const currentOutcomes: StudentOutcome[] = [...outcomes];
    console.log("Estado actual de outcomes:", currentOutcomes);
    console.log("Mock outcomes para referencia:", mockStudentOutcomes);

    // Mapear los outcomes al formato que espera el backend
    const mappedOutcomes: OutcomePayloadItem[] = outcomes.map(
      (o: StudentOutcome): OutcomePayloadItem => {
        // Buscar la descripción en mockStudentOutcomes si está vacía
        const mockOutcome = mockStudentOutcomes.find((m) => m.id === o.id);
        const description = o.description || (mockOutcome?.description ?? "");

        // Para aporte_valor, preservar explícitamente "", "K", o "R"
        const aporteValor = o.level ?? "";

        const item: OutcomePayloadItem = {
          id: o.id,
          resultadoProgramaCodigo: String(o.id),
          resultadoProgramaDescripcion: description,
          aporte_valor: aporteValor,
        };
        console.log(`Preparando outcome ${o.id}:`, {
          original: o,
          mockData: mockOutcome,
          finalItem: item,
        });
        return item;
      },
    );

    // Preparar payload inicial
    const payload = {
      syllabusId: Number(syllabusId),
      outcomes: mappedOutcomes,
    };
    console.log("Payload completo:", JSON.stringify(payload, null, 2));

    let toastId: string | number | undefined;
    try {
      toastId = toast.loading("Guardando aportes...");
      const isCreating =
        !originalRef.current || originalRef.current.length === 0;
      // Preparar payload según el formato que espera ResultadosData
      const backendData: ResultadosData = {
        items: payload.outcomes,
        outcomes: payload.outcomes,
        syllabusId: Number(syllabusId),
      };

      await saveResultados.mutateAsync({
        syllabusId: Number(syllabusId),
        data: backendData,
        isCreating,
      });
      toast.dismiss(toastId);
      toast.success("Aportes guardados correctamente");
      // Mostrar modal de éxito
      setShowSuccessModal(true);
      // Restaurar la lista inicial sin registros (7 aportes vacíos)
      setOutcomes(mockStudentOutcomes);
      originalRef.current = mockStudentOutcomes;
    } catch (error) {
      if (toastId) toast.dismiss(toastId);
      console.error("Error guardando aportes:", error);
      let msg = "Error guardando aportes";
      if (error instanceof Error) msg = error.message;
      toast.error(msg);
    }
  };

  const handleLevelChange = (id: number, level: StudentOutcome["level"]) => {
    setOutcomes((prev: StudentOutcome[]) =>
      prev.map((outcome: StudentOutcome) =>
        outcome.id === id ? { ...outcome, level } : outcome,
      ),
    );
  };

  const handleConfirmSuccess = () => {
    setShowSuccessModal(false);
    // Después de confirmar, redirigir a Mis asignaciones (URL absoluta)
    window.location.href = "http://localhost:5002/mis-asignaciones";
  };

  return (
    <Step step={8} onNextStep={handleNextStep}>
      <div className="w-full max-w-6xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-4">
          9. Aporte de la Asignatura al logro de resultados
        </h2>

        {/* Descripción */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
          <p className="text-gray-700 leading-relaxed">
            El aporte de la asignatura al logro de los Resultados del Estudiante
            (Student Outcomes) en la formación del graduado en Ingeniería de
            Computación y Sistemas, se establece en la tabla siguiente:
          </p>
        </div>

        {/* Leyenda */}
        <div className="bg-gray-100 border border-gray-300 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-center gap-8 text-sm">
            <div className="flex items-center gap-2">
              <span className="font-semibold">K =</span>
              <span>Clave</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold">R =</span>
              <span>Relacionado</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold">Recuadro vacío =</span>
              <span>No aplica</span>
            </div>
          </div>
        </div>

        {/* Tabla de Student Outcomes */}
        <div className="space-y-6">
          <div className="bg-white border border-gray-300 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-300">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold w-12">
                    #
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">
                    Descripción
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-semibold w-32">
                    Nivel
                  </th>
                </tr>
              </thead>
              <tbody>
                {outcomes.map((outcome, index) => (
                  <tr
                    key={outcome.id}
                    className={`border-b border-gray-200 ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50"
                    }`}
                  >
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {outcome.id}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {outcome.description}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-center">
                        <div className="relative">
                          <select
                            value={outcome.level}
                            onChange={(e) =>
                              handleLevelChange(
                                outcome.id,
                                e.target.value as "K" | "R" | "",
                              )
                            }
                            className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-10 text-sm cursor-pointer hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="">-</option>
                            <option value="K">K</option>
                            <option value="R">R</option>
                          </select>
                          <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                            <ChevronDown className="w-4 h-4 text-gray-400" />
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Información adicional */}
        <div className="mt-6 text-sm text-gray-600">
          <p>
            * Selecciona el nivel de aporte de la asignatura para cada resultado
            del estudiante.
          </p>
        </div>
      </div>
      {/* Success modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-2xl w-11/12 max-w-sm p-6 text-center">
            <div className="flex justify-center -mt-12">
              <div className="bg-white rounded-full p-4 shadow-md">
                {/* Check icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 text-green-600"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
            <h3 className="text-xl font-semibold mt-4">
              Su solicitud fue enviada con éxito
            </h3>
            <p className="text-gray-600 mt-2 mb-6">
              Gracias — su aporte fue registrado.
            </p>
            <div className="flex justify-center">
              <button
                onClick={handleConfirmSuccess}
                className="px-6 py-3 bg-red-600 text-white rounded-full font-semibold hover:bg-red-700"
              >
                Finalizar
              </button>
            </div>
          </div>
        </div>
      )}
    </Step>
  );
}
