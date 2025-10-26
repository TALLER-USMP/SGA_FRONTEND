import { useState, useEffect, useRef } from "react";
import { useSteps } from "../../contexts/StepsContext";
import { Step } from "../common/Step";
import {
  useGetEstrategias,
  usePostEstrategias,
} from "../../hooks/api/FifthStepQuery";

export default function FifthStep() {
  const { nextStep } = useSteps();
  const syllabusId = localStorage.getItem("syllabusId") ?? "";
  const { data, isLoading, isError, error, refetch } =
    useGetEstrategias(syllabusId);
  const postMutation = usePostEstrategias();

  const defaultList = [
    "Método Expositivo – Interactivo. Comprende la exposición del docente y la interacción con el estudiante, empleando las herramientas disponibles en el aula virtual de la asignatura",
    "Método de Discusión Guiada. Conducción del grupo para abordar situaciones y llegar a conclusiones y recomendaciones, empleando las herramientas disponibles en el aula virtual de la asignatura",
    "Método de Demostración – Ejecución. Se utiliza para ejecutar, demostrar, practicar y retroalimentar lo expuesto, empleando las herramientas disponibles en el aula virtual de la asignatura",
  ];

  const [textValue, setTextValue] = useState<string>(() =>
    defaultList.join("\n\n"),
  );
  const [errorMsg, setErrorMsg] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (
      data?.estrategias &&
      Array.isArray(data.estrategias) &&
      data.estrategias.length > 0
    ) {
      setTextValue(data.estrategias.join("\n\n"));
    } else if (!data) {
      setTextValue(defaultList.join("\n\n"));
    }
  }, [data]);

  const handleSaveAndNext = async () => {
    setErrorMsg("");
    // Parse lines: split by one or more newlines, keep non-empty trimmed entries
    const lines = String(textValue)
      .split(/\r?\n+/)
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    if (!Array.isArray(lines) || lines.length === 0) {
      setErrorMsg(
        "Agrega al menos una estrategia metodológica antes de continuar.",
      );
      textareaRef.current?.focus();
      return;
    }

    if (!syllabusId) {
      setErrorMsg("Id del sílabo no encontrado. Completa el primer paso.");
      return;
    }

    try {
      await postMutation.mutateAsync({ syllabusId, estrategias: lines });
      await refetch();
      nextStep();
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : String(err));
    }
  };

  return (
    <Step step={5} onNextStep={handleSaveAndNext}>
      <div className="w-full max-w-4xl mx-auto px-8">
        {/* Header / Datos generales */}
        <div className="mb-6">
          <div className="flex items-center gap-3">
            <div className="text-lg font-bold text-black">1.</div>
            <h2 className="text-lg font-semibold text-black">
              Datos Generales
            </h2>
            <div className="ml-2 w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
              i
            </div>
          </div>
          <div className="mt-2 w-full bg-blue-50 border border-blue-100 rounded-md px-4 py-3 text-center font-semibold">
            {localStorage.getItem("syllabusNombre") || "TALLER DE PROYECTOS"}
          </div>
        </div>

        {/* Section title */}
        <div className="mb-4 flex items-center gap-3">
          <div className="text-lg font-bold text-black">5.</div>
          <h3 className="text-lg font-medium text-black">
            Estrategias metodológicas
          </h3>
          <div className="ml-2 w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
            i
          </div>
        </div>

        {/* Editable box: single textarea matching maquetado */}
        <div className="mb-6">
          <div className="border rounded-lg p-4 bg-white">
            {isLoading ? (
              <div className="text-gray-500 p-4">Cargando...</div>
            ) : isError ? (
              <div className="text-red-600 p-4">
                Error: {String(error?.message ?? error)}
              </div>
            ) : (
              <textarea
                ref={textareaRef}
                value={textValue}
                onChange={(e) => setTextValue(e.target.value)}
                rows={8}
                className="w-full resize-vertical min-h-[120px] bg-transparent outline-none px-2 py-2 text-gray-700"
                placeholder="Escribe cada estrategia en una línea o párrafo separado"
                aria-label="Estrategias metodológicas"
              />
            )}
          </div>
        </div>

        {/* Error / saving indicator */}
        {errorMsg && (
          <div className="text-red-600 text-sm mb-3">{errorMsg}</div>
        )}
        {postMutation.isPending && (
          <div className="text-blue-600 text-sm mb-3">Guardando...</div>
        )}
      </div>
    </Step>
  );
}
