import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useSteps } from "../../contexts/StepsContext";
import { Step } from "../common/Step";

/**
 * Paso 2: formulario con validaciones básicas (no vacíos)
 */
export default function SecondStep() {
  const { nextStep } = useSteps();
  const [courseName, setCourseName] = useState<string>(() => {
    try {
      return localStorage.getItem("syllabusNombre") ?? "";
    } catch {
      return "";
    }
  });
  const [summary, setSummary] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState("");

  // Mutation: PUT /syllabus/{id}/sumilla
  const putSumillaMutation = useMutation<
    void,
    Error,
    { id: string; sumilla: string }
  >({
    mutationFn: async ({ id, sumilla }: { id: string; sumilla: string }) => {
      const res = await fetch(
        `http://localhost:7071/api/syllabus/${id}/sumilla`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sumilla }),
        },
      );
      if (res.status === 200) return;
      try {
        const json = await res.json();
        const j = json as Record<string, unknown>;
        const msg =
          (j &&
            ((j["message"] as string | undefined) ||
              (j["error"] as string | undefined))) ??
          JSON.stringify(json);
        throw new Error(String(msg));
      } catch {
        try {
          const txt = await res.text();
          throw new Error(`${res.status} ${txt}`);
        } catch {
          throw new Error(`Error desconocido: ${res.status}`);
        }
      }
    },
  });

  const validateAndNext = async () => {
    const newErrors: Record<string, string> = {};
    if (!courseName.trim()) newErrors.courseName = "Campo obligatorio";
    if (!summary.trim()) newErrors.summary = "Campo obligatorio";
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      setApiError("");
      const id = localStorage.getItem("syllabusId");
      if (!id) {
        setApiError(
          "Id del sílabo no encontrado. Completa el primer paso antes de continuar.",
        );
        return;
      }
      try {
        await putSumillaMutation.mutateAsync({ id, sumilla: summary });
        nextStep();
      } catch (err: unknown) {
        if (err instanceof Error)
          setApiError(`Error al guardar la sumilla: ${err.message}`);
        else setApiError(String(err));
      }
    } else {
      // enfocar primer campo con error
      if (newErrors.courseName) {
        const el = document.querySelector(
          '[name="courseName"]',
        ) as HTMLElement | null;
        if (el && typeof el.focus === "function") el.focus();
      } else if (newErrors.summary) {
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
        <div className="mb-4">
          <div className="flex items-center gap-3">
            <div className="text-lg font-bold text-black">1.</div>
            <h3 className="text-lg font-medium text-black">Datos Generales</h3>
            <div className="ml-2 w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
              i
            </div>
          </div>
          <input
            name="courseName"
            type="text"
            value={courseName}
            onChange={(e) => setCourseName(e.target.value)}
            placeholder="TALLER DE PROYECTOS"
            className={`w-full mt-2 h-10 rounded-full px-4 text-sm bg-blue-50 border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-200 ${errors.courseName ? "ring-2 ring-red-400" : ""}`}
          />
          {errors.courseName && (
            <div className="text-red-600 text-sm mt-1">{errors.courseName}</div>
          )}
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
            className={`w-full min-h-[160px] rounded-lg px-4 py-4 bg-gray-100 resize-vertical focus:outline-none focus:ring-2 focus:ring-blue-200 ${errors.summary ? "ring-2 ring-red-400" : "border border-gray-200"}`}
          />
          {errors.summary && (
            <div className="text-red-600 text-sm mt-1">{errors.summary}</div>
          )}
        </div>

        {apiError && (
          <div className="text-red-600 text-sm mt-3">{apiError}</div>
        )}
      </div>
    </Step>
  );
}
