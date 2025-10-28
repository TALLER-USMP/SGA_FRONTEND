// NineStep.tsx

import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSyllabusContext } from "../../contexts/SyllabusContext";
import { Step } from "../common/Step";
import { useQuery, useMutation } from "@tanstack/react-query";

// Nota: duplicamos la interfaz localmente para evitar dependencias de tipo
// que en algunos entornos del build daban problemas de resolución.
interface ProgramOutcomeContribution {
  silabo_id: number;
  resultado_programa_codigo: string;
  resultado_programa_descripcion: string;
  aporte_valor: string | null;
}

interface SubmitContributionsPayload {
  silabo_id: number;
  aportes: Array<{
    resultado_programa_codigo: string;
    aporte_valor: string | null;
  }>;
}

// Componente del Toast de Confirmación
const ConfirmationToast = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    if (!isOpen) {
      setCountdown(3);
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onClose();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl w-64 animate-fade-in">
        <div className="px-6 py-5 text-center">
          <h3 className="text-sm font-normal text-gray-900 leading-tight">
            La solicitud de revisión
            <br />
            fue enviada con éxito
          </h3>

          <div className="flex justify-center my-4">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <path
                d="M18 24L22 28L30 20"
                stroke="#000000"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <button
            onClick={onClose}
            className="w-full px-4 py-1.5 bg-red-600 text-white rounded text-sm font-medium hover:bg-red-700 transition-colors"
          >
            Finalizar
          </button>

          <p className="text-xs text-gray-500 mt-3">
            Redirigiendo en {countdown} segundo{countdown !== 1 ? "s" : ""}...
          </p>
        </div>
      </div>
    </div>
  );
};

/**
 * Paso 8/9: Aportes de la asignatura al logro de los resultados
 */
export default function NineStep() {
  const navigate = useNavigate();
  const { syllabusId, courseName } = useSyllabusContext();

  const [contributions, setContributions] = useState<Record<string, string>>(
    {},
  );
  const [learningOutcomes, setLearningOutcomes] = useState<
    ProgramOutcomeContribution[]
  >([]);
  const [isToastOpen, setIsToastOpen] = useState(false);
  const [apiError, setApiError] = useState("");

  // Load existing contributions via query (local implementation)
  const normalizedId = (syllabusId ?? "").trim();
  const isValidId = normalizedId !== "" && /^\d+$/.test(normalizedId);

  const { data, isLoading, isError, error } = useQuery<
    { aportes: ProgramOutcomeContribution[] } | null,
    Error
  >({
    queryKey: ["syllabus", isValidId ? normalizedId : null, "contributions"],
    queryFn: async () => {
      const apiBase =
        import.meta.env.VITE_API_BASE_URL ?? "http://localhost:7071/api";
      const res = await fetch(
        `${apiBase}/syllabus/${encodeURIComponent(normalizedId)}/aportes-resultados`,
      );
      if (!res.ok) {
        const t = await res.text();
        throw new Error(`${res.status} ${t}`);
      }
      return (await res.json()) as { aportes: ProgramOutcomeContribution[] };
    },
    enabled: isValidId,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  const submitContributions = useMutation<
    unknown,
    Error,
    SubmitContributionsPayload
  >({
    mutationFn: async (payload: SubmitContributionsPayload) => {
      const apiBase =
        import.meta.env.VITE_API_BASE_URL ?? "http://localhost:7071/api";
      const res = await fetch(
        `${apiBase}/syllabus/${payload.silabo_id}/contribution`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      if (!res.ok) {
        const t = await res.text();
        throw new Error(`${res.status} ${t}`);
      }
      return await res.json();
    },
    onSuccess: () => console.log("✅ Solicitud de revisión enviada con éxito"),
    onError: (err: Error) => console.error("❌ Error al enviar:", err.message),
  });

  useEffect(() => {
    if (isError) {
      setApiError(error?.message ?? "Error cargando aportes");
      return;
    }
    if (!data) return;

    if (data?.aportes) {
      setLearningOutcomes(data.aportes);

      // Cargar valores existentes en el estado
      const loaded: Record<string, string> = {};
      data.aportes.forEach((aporte: ProgramOutcomeContribution) => {
        loaded[aporte.resultado_programa_codigo] = aporte.aporte_valor || "";
      });
      setContributions(loaded);

      // Guardar en localStorage como backup
      try {
        localStorage.setItem(
          `syllabus:contributions:${syllabusId}`,
          JSON.stringify(loaded),
        );
      } catch {
        /* ignore */
      }
    }
  }, [data, isError, error, syllabusId]);

  // Manejar cambios en los dropdowns
  const handleContributionChange = (codigo: string, value: string) => {
    setContributions((prev) => ({
      ...prev,
      [codigo]: value,
    }));
  };

  // Validar y enviar
  const validateAndNext = async () => {
    setApiError("");

    const id = syllabusId;
    if (!id) {
      setApiError(
        "ID del sílabo no encontrado. Completa el primer paso antes de continuar.",
      );
      return;
    }

    // NOTE: server must validate course ownership; client-side checks removed for prod

    try {
      // Convertir el objeto a array para enviar
      const aportes = Object.entries(contributions).map(([codigo, valor]) => ({
        resultado_programa_codigo: codigo,
        aporte_valor: valor || null,
      }));

      await submitContributions.mutateAsync({
        silabo_id: Number(id),
        aportes,
      });

      // Production: state change should be handled by backend. No local-only updates here.

      // Mostrar toast de éxito
      setIsToastOpen(true);
    } catch (err: unknown) {
      if (err instanceof Error)
        setApiError(`Error al guardar los aportes: ${err.message}`);
      else setApiError(String(err));
    }
  };

  const handleToastClose = () => {
    setIsToastOpen(false);
    // Redirigir a la pantalla principal
    navigate("/mis-asignaciones");
  };

  return (
    <Step step={8} onNextStep={validateAndNext}>
      <div className="w-full">
        {isLoading && (
          <div className="mb-4 text-sm text-gray-700">
            Cargando aportes de la asignatura...
          </div>
        )}

        {/* Header: Datos Generales */}
        <div className="mb-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="text-lg font-bold text-black">1.</div>
            <h3 className="text-lg font-medium text-black">Datos Generales</h3>
            <div className="ml-2 w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
              i
            </div>
          </div>
          <div className="w-full h-12 rounded-md px-4 flex items-center text-lg bg-blue-50 border border-blue-100">
            {courseName || "TALLER DE PROYECTOS"}
          </div>
        </div>

        {/* Header: Aportes */}
        <div className="mb-4">
          <div className="flex items-center gap-3">
            <div className="text-lg font-bold text-black">8.</div>
            <h3 className="text-lg font-medium text-black">
              Aporte de la asignatura al logro de los resultados
            </h3>
            <div className="ml-2 w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
              i
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="mb-4 px-4 py-2 bg-gray-50 rounded border border-gray-200">
          <div className="flex gap-6 text-xs text-gray-700">
            <span>
              <strong>K =</strong> Clave
            </span>
            <span>
              <strong>R =</strong> Relacionado
            </span>
            <span>
              <strong>Recuadro vacío =</strong> No aplica
            </span>
          </div>
        </div>

        {/* Table */}
        <div className="grid gap-4">
          {learningOutcomes.map((outcome) => (
            <div
              key={outcome.resultado_programa_codigo}
              className="grid grid-cols-[60px_24px_1fr_120px] items-center gap-2 py-2 border-b last:border-b-0"
            >
              {/* Number */}
              <div className="text-sm text-gray-700 flex items-center">
                <div className="px-3 py-2 bg-gray-100 border border-gray-300 rounded w-full text-center font-medium">
                  {outcome.resultado_programa_codigo}
                </div>
              </div>

              {/* Separator */}
              <div className="text-gray-400 flex items-center justify-center">
                -
              </div>

              {/* Description */}
              <div className="pr-2">
                <div className="w-full rounded-md px-3 py-2 bg-gray-100 border border-gray-300 text-left text-sm">
                  {outcome.resultado_programa_descripcion}
                </div>
              </div>

              {/* Dropdown */}
              <div className="pr-2">
                <div className="relative">
                  <select
                    value={
                      contributions[outcome.resultado_programa_codigo] || ""
                    }
                    onChange={(e) =>
                      handleContributionChange(
                        outcome.resultado_programa_codigo,
                        e.target.value,
                      )
                    }
                    disabled={isLoading}
                    className={`w-full rounded-md px-3 py-2 pr-8 bg-white border border-gray-300 text-sm appearance-none cursor-pointer hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    <option value=""></option>
                    <option value="K">K</option>
                    <option value="R">R</option>
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mensaje si no hay resultados */}
        {!isLoading && learningOutcomes.length === 0 && (
          <div className="text-center py-8 text-gray-500 bg-gray-50 rounded border border-gray-200">
            No se encontraron resultados de programa para cargar.
          </div>
        )}

        {/* Error message */}
        {apiError && (
          <div className="text-red-600 text-sm mt-3">{apiError}</div>
        )}

        {/* Loading state */}
        {submitContributions.isPending && (
          <div className="text-sm text-blue-600 mt-3">
            Enviando solicitud de revisión...
          </div>
        )}
      </div>

      {/* Toast de confirmación */}
      <ConfirmationToast isOpen={isToastOpen} onClose={handleToastClose} />

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
      `}</style>
    </Step>
  );
}
