import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useSteps } from "../../contexts/StepsContext";
import { useSyllabusContext } from "../../contexts/SyllabusContext";
import { Step } from "../common/Step";
import {
  useGetEvaluacion,
  usePostEvaluacion,
} from "../../hooks/api/SeventhStepQuery";

export default function SeventhStep() {
  const { nextStep } = useSteps();
  const [searchParams] = useSearchParams();
  const syllabusId = searchParams.get("id");
  const { courseName } = useSyllabusContext();
  const { data, isLoading, isError, error, refetch } =
    useGetEvaluacion(syllabusId);
  const postMutation = usePostEvaluacion();

  const defaultText = [
    "El promedio final (PF) de la asignatura se obtiene con la siguiente fórmula:",
    "PF = (2*PE + EP + EF) / 4",
    "Donde:",
    "EP = Examen Parcial",
    "EF = Examen Final",
    "PE = Promedio de Evaluaciones",
    "",
    "El promedio de evaluaciones (PE) se obtiene de la siguiente manera:",
    "PE = ((P1 + P2 + P3 + P4 - MN) / 3 + W1) / 2",
    "Donde:",
    "P1, P2, P3, P4 = Evaluaciones de los entregables",
    "MN = Menor nota",
    "W1 = Trabajo final",
  ].join("\n");

  const [textValue, setTextValue] = useState<string>(() => defaultText);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (
      data?.evaluacion &&
      typeof data.evaluacion === "string" &&
      data.evaluacion.trim().length > 0
    ) {
      setTextValue(data.evaluacion);
    } else if (!data) {
      setTextValue(defaultText);
    }
  }, [data]);

  const handleSaveAndNext = async () => {
    setErrorMsg("");
    const v = String(textValue ?? "").trim();
    if (!v) {
      setErrorMsg("El campo de evaluación no puede quedar vacío.");
      textareaRef.current?.focus();
      return;
    }

    if (!syllabusId) {
      setErrorMsg("Id del sílabo no encontrado. Completa el primer paso.");
      return;
    }

    try {
      await postMutation.mutateAsync({ syllabusId, evaluacion: v });
      await refetch();
      nextStep();
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : String(err));
    }
  };

  return (
    <Step step={7} onNextStep={handleSaveAndNext}>
      <div className="w-full px-8">
        {/* Header / Datos generales */}
        <div className="mb-6">
          <div className="flex items-center gap-3">
            <div className="text-lg font-bold text-black">1.</div>
            <h2 className="text-lg font-medium text-black">Datos Generales</h2>
            <div className="ml-2 w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
              i
            </div>
          </div>
          <div className="mt-2 w-full bg-blue-50 border border-blue-100 rounded-md px-4 py-2 text-left">
            {courseName || "TALLER DE PROYECTOS"}
          </div>
        </div>

        {/* Evaluación Section */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="text-lg font-bold text-black">7.</div>
            <h2 className="text-lg font-medium text-black">
              Evaluación de aprendizaje
            </h2>
            <div className="ml-2 w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
              i
            </div>
          </div>

          {/* Editable textarea matching maquetado (single field) */}
          <div className="border rounded-lg p-6 bg-white">
            {isLoading ? (
              <div className="text-gray-500">Cargando evaluación...</div>
            ) : isError ? (
              <div className="text-red-600">
                Error: {String(error?.message ?? error)}
              </div>
            ) : (
              <textarea
                ref={textareaRef}
                value={textValue}
                onChange={(e) => setTextValue(e.target.value)}
                rows={8}
                className="w-full resize-vertical min-h-[120px] bg-transparent outline-none px-2 py-1 text-gray-700"
                placeholder="Describe la evaluación de aprendizaje aquí..."
                aria-label="Evaluación de aprendizaje"
              />
            )}
          </div>
        </div>

        {/* Messages */}
        {errorMsg && (
          <div className="mt-4 text-sm text-red-600">{errorMsg}</div>
        )}
        {postMutation.isPending && (
          <div className="mt-4 text-sm text-blue-600">
            Guardando evaluación...
          </div>
        )}
      </div>
    </Step>
  );
}
