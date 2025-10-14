import { useState } from "react";
import { useSteps } from "../../contexts/StepsContext";
import { Step } from "../common/Step";

/**
 * Paso 2: formulario con validaciones básicas (no vacíos)
 */
export default function SecondStep() {
  const { nextStep } = useSteps();
  const [courseName, setCourseName] = useState("");
  const [summary, setSummary] = useState("");
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      // Simular guardado
      await new Promise((r) => setTimeout(r, 700));
    } finally {
      setSaving(false);
    }
  };

  const validateAndNext = () => {
    const newErrors: Record<string, string> = {};
    if (!courseName.trim()) newErrors.courseName = "Campo obligatorio";
    if (!summary.trim()) newErrors.summary = "Campo obligatorio";
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      nextStep();
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
      <h2 className="text-2xl font-semibold mb-4">1. Datos Generales</h2>

      <form onSubmit={handleSave} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nombre del curso
          </label>
          <input
            name="courseName"
            type="text"
            value={courseName}
            onChange={(e) => setCourseName(e.target.value)}
            placeholder="TALLER DE PROYECTOS"
            className={`w-full rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 ${errors.courseName ? "border-red-500" : "border border-gray-300"}`}
          />
          {errors.courseName && (
            <div className="text-red-600 text-sm mt-1">{errors.courseName}</div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            2. Sumilla
          </label>
          <textarea
            name="summary"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="Escribe la sumilla aquí..."
            rows={6}
            className={`w-full rounded-md px-3 py-2 bg-gray-50 resize-vertical focus:outline-none focus:ring-2 focus:ring-blue-400 ${errors.summary ? "border-red-500" : "border border-gray-300"}`}
          />
          {errors.summary && (
            <div className="text-red-600 text-sm mt-1">{errors.summary}</div>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex gap-3">
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-60"
              disabled={saving}
            >
              {saving ? "Guardando..." : "Guardar"}
            </button>

            <button
              type="button"
              onClick={() => validateAndNext()}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
            >
              Siguiente
            </button>
          </div>

          <span className="text-sm text-gray-500">
            Los cambios se guardan localmente (simulado)
          </span>
        </div>
      </form>
    </Step>
  );
}
