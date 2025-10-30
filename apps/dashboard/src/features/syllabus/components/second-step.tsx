import { useState, useEffect } from "react";
import { useSaveSumilla, useSumilla } from "../hooks/second-step-query";
import { useSteps } from "../contexts/steps-context-provider";
import { useSyllabusContext } from "../contexts/syllabus-context";
import { Step } from "./step";

/**
 * Paso 2: formulario con validaciones básicas (no vacíos)
 */
export default function SecondStep() {
  const { nextStep } = useSteps();
  const { syllabusId, courseName } = useSyllabusContext();
  const [summary, setSummary] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState("");

  // Load existing sumilla via query
  const { data, isLoading, isError, error } = useSumilla(syllabusId);
  const saveSumilla = useSaveSumilla();

  useEffect(() => {
    if (isError) {
      setApiError(error?.message ?? "Error cargando sumilla");
      return;
    }
    if (!data) return;
    if (data?.sumilla) {
      setSummary(data.sumilla);
      try {
        localStorage.setItem("datos_sumilla", data.sumilla);
      } catch {
        /* ignore */
      }
    }
  }, [data, isError, error]);

  // No need to define a raw mutation here, useSaveSumilla above

  const validateAndNext = async () => {
    const newErrors: Record<string, string> = {};
    if (!summary.trim()) newErrors.summary = "Campo obligatorio";
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      setApiError("");
      const id = syllabusId;
      if (!id) {
        setApiError(
          "Id del sílabo no encontrado. Completa el primer paso antes de continuar.",
        );
        return;
      }
      try {
        await saveSumilla.mutateAsync({ id, sumilla: summary });
        nextStep();
      } catch (err: unknown) {
        if (err instanceof Error)
          setApiError(`Error al guardar la sumilla: ${err.message}`);
        else setApiError(String(err));
      }
    } else {
      // enfocar primer campo con error
      if (newErrors.summary) {
        const el = document.querySelector(
          'textarea[name="summary"]',
        ) as HTMLElement | null;
        if (el && typeof el.focus === "function") el.focus();
      }
    }
  };

  return (
    <Step step={2} onNextStep={validateAndNext}>
      <div className="w-full">
        {isLoading && (
          <div className="mb-4 text-sm text-gray-700">Cargando sumilla...</div>
        )}

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

        <div className="mb-2">
          <div className="flex items-center gap-3">
            <div className="text-lg font-bold text-black">2.</div>
            <h3 className="text-lg font-medium text-black">Sumilla</h3>
            <div className="ml-2 w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
              i
            </div>
          </div>
        </div>

        <div>
          <textarea
            name="summary"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="Escribe la sumilla aquí..."
            rows={8}
            disabled={isLoading}
            className={`w-full min-h-[160px] rounded-lg px-4 py-4 bg-white border resize-vertical focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.summary ? "border-red-500" : "border-gray-300"} ${isLoading ? "opacity-50 cursor-not-allowed bg-gray-100" : ""}`}
          />
          {errors.summary && (
            <div className="text-red-600 text-sm mt-1">{errors.summary}</div>
          )}
        </div>

        {apiError && (
          <div className="text-red-600 text-sm mt-3">{apiError}</div>
        )}

        {saveSumilla.isPending && (
          <div className="text-sm text-blue-600 mt-3">Guardando sumilla...</div>
        )}
      </div>
    </Step>
  );
}
