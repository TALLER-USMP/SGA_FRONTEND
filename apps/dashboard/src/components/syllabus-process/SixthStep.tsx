import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { useSteps } from "../../contexts/StepsContext";
import { useSyllabusContext } from "../../contexts/SyllabusContext";
import { Step } from "../common/Step";
import {
  useGetRecursos,
  usePostRecursos,
} from "../../hooks/api/SixthStepQuery";

export default function SixthStep() {
  const { nextStep } = useSteps();
  const [searchParams] = useSearchParams();
  const syllabusId = searchParams.get("id");
  const { courseName } = useSyllabusContext();
  const { data, isLoading, isError, error, refetch } =
    useGetRecursos(syllabusId);
  const postMutation = usePostRecursos();

  // Datos por defecto según el maquetado (se presentan como texto editable)
  const defaultRecursos = [
    {
      type: "Equipos",
      items: ["computadora, ecran, proyector de multimedia"],
    },
    {
      type: "Materiales",
      items: [
        "Material docente, pizarra, prácticas dirigidas de laboratorio, videos tutoriales, foros y textos bases (ver fuentes de consultas)",
      ],
    },
    {
      type: "Software",
      items: ["Herramientas de gestión de documentos, Mentimeter, Miro"],
    },
  ];

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [textValue, setTextValue] = useState<string>(() =>
    defaultRecursos.map((g) => `${g.type}: ${g.items.join(", ")}`).join("\n\n"),
  );
  const [apiError, setApiError] = useState("");

  useEffect(() => {
    if (
      data?.recursos &&
      Array.isArray(data.recursos) &&
      data.recursos.length > 0
    ) {
      const t = data.recursos
        .map((g) => `${g.type}: ${g.items.join(", ")}`)
        .join("\n\n");
      setTextValue(t);
    }
  }, [data]);

  const handleSaveAndNext = async () => {
    setApiError("");

    // Parse paragraphs separated by blank lines into groups
    const paragraphs = String(textValue)
      .split(/\r?\n\s*\r?\n/)
      .map((p) => p.trim())
      .filter((p) => p.length > 0);

    if (!Array.isArray(paragraphs) || paragraphs.length === 0) {
      setApiError("Agrega al menos un recurso didáctico antes de continuar.");
      textareaRef.current?.focus();
      return;
    }

    const recursosToSend = paragraphs.map((p) => {
      const m = p.match(/^\s*([^:\n]+)\s*:\s*(.+)$/);
      if (m) {
        const type = m[1].trim();
        const items = m[2]
          .split(/,\s*/)
          .map((it) => it.trim())
          .filter((it) => it.length > 0);
        return { type, items };
      }
      return { type: "General", items: [p] };
    });

    const anyItem = recursosToSend.some(
      (g) => Array.isArray(g.items) && g.items.length > 0,
    );
    if (!anyItem) {
      setApiError("El contenido no contiene recursos válidos.");
      textareaRef.current?.focus();
      return;
    }

    if (!syllabusId) {
      setApiError("Id del sílabo no encontrado. Completa el primer paso.");
      return;
    }

    try {
      await postMutation.mutateAsync({ syllabusId, recursos: recursosToSend });
      await refetch();
      nextStep();
    } catch (err: unknown) {
      setApiError(err instanceof Error ? err.message : String(err));
    }
  };

  return (
    <Step step={6} onNextStep={handleSaveAndNext}>
      <div className="w-full px-8">
        {/* Header */}
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

        {/* Recursos Section */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="text-lg font-bold text-black">6.</div>
            <h2 className="text-lg font-medium text-black">
              Recursos didácticos
            </h2>
            <div className="ml-2 w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
              i
            </div>
          </div>

          {/* Editable textarea matching maquetado (single field) */}
          <div className="border rounded-lg p-6 bg-white">
            {isLoading ? (
              <div className="text-gray-500">Cargando recursos...</div>
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
                placeholder={
                  "Escribe los recursos didácticos. Usa formato 'Tipo: item1, item2' en párrafos separados para agrupar."
                }
                aria-label="Recursos didácticos"
              />
            )}
          </div>
        </div>

        {/* Messages */}
        {apiError && (
          <div className="mt-4 text-sm text-red-600">{apiError}</div>
        )}
        {postMutation.isPending && (
          <div className="mt-4 text-sm text-blue-600">
            Guardando recursos...
          </div>
        )}
      </div>
    </Step>
  );
}
