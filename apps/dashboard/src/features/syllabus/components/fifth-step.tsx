import {
  useMethodologicalStrategiesQuery,
  useDidacticResourcesQuery,
  useUpdateMethodologicalStrategies,
  useUpdateDidacticResources,
} from "../hooks/fifth-step-query";

import type {
  MethodologicalStrategy,
  DidacticResource,
} from "../hooks/fifth-step-query";

import { useEffect, useState } from "react";
import { Step } from "./step";
import { useSteps } from "../contexts/steps-context-provider";
import { useSyllabusContext } from "../contexts/syllabus-context";
import { useFinalizeSyllabus } from "../hooks/use-finalize-syllabus";
import { X, Plus } from "lucide-react";
import { toast } from "sonner";

export default function FifthStep() {
  const { nextStep } = useSteps();
  const { syllabusId } = useSyllabusContext();

  const [methodologicalStrategies, setMethodologicalStrategies] = useState<
    MethodologicalStrategy[] | undefined
  >(undefined);
  const [didacticResources, setDidacticResources] = useState<
    DidacticResource[] | undefined
  >(undefined);

  const { data: serverStrategies, isLoading: loadingStrategies } =
    useMethodologicalStrategiesQuery(syllabusId ? String(syllabusId) : null);

  const { data: serverResources, isLoading: loadingResources } =
    useDidacticResourcesQuery(syllabusId ? String(syllabusId) : null);

  const saveStrategiesMutation = useUpdateMethodologicalStrategies();
  const saveResourcesMutation = useUpdateDidacticResources();

  // Hook para finalizar el sílabo si es el último step
  const { isLastStep, finalizeSyllabus } = useFinalizeSyllabus({
    syllabusId,
    onBeforeFinalize: async () => {
      // Guardar datos del step 5 antes de finalizar
      const normalizedId = syllabusId ? String(syllabusId).trim() : "";
      const isValidId = normalizedId !== "" && /^\d+$/.test(normalizedId);

      if (!isValidId) {
        throw new Error("ID del syllabus no válido");
      }

      if (
        methodologicalStrategies === undefined ||
        didacticResources === undefined
      ) {
        throw new Error("Esperando datos del servidor...");
      }

      await Promise.all([
        saveStrategiesMutation.mutateAsync({
          syllabusId: normalizedId,
          estrategias: methodologicalStrategies,
        }),
        saveResourcesMutation.mutateAsync({
          syllabusId: normalizedId,
          recursos: didacticResources,
        }),
      ]);

      toast.success("Datos guardados correctamente");
    },
  });

  // Sincronizar con datos del servidor cuando lleguen
  useEffect(() => {
    if (serverStrategies !== undefined) {
      // Si el backend devuelve vacío, inicializar con un ítem por defecto
      setMethodologicalStrategies(
        serverStrategies.length > 0
          ? serverStrategies
          : [{ titulo: "", descripcion: "" }],
      );
    }
  }, [serverStrategies]);

  useEffect(() => {
    if (serverResources !== undefined) {
      // Si el backend devuelve vacío, inicializar con un ítem por defecto
      setDidacticResources(
        serverResources.length > 0
          ? serverResources
          : [{ titulo: "", descripcion: "" }],
      );
    }
  }, [serverResources]);

  const addStrategy = () => {
    setMethodologicalStrategies((s) => [
      ...(s || []),
      { titulo: "", descripcion: "" },
    ]);
  };
  const removeStrategy = (index: number) =>
    setMethodologicalStrategies((s) => (s || []).filter((_, i) => i !== index));
  const updateStrategy = (
    index: number,
    field: "titulo" | "descripcion",
    value: string,
  ) =>
    setMethodologicalStrategies((s) =>
      (s || []).map((st, i) => (i === index ? { ...st, [field]: value } : st)),
    );

  const addResource = () =>
    setDidacticResources((r) => [
      ...(r || []),
      { titulo: "", descripcion: "" },
    ]);
  const removeResource = (index: number) =>
    setDidacticResources((r) => (r || []).filter((_, i) => i !== index));
  const updateResource = (
    index: number,
    field: "titulo" | "descripcion",
    value: string,
  ) =>
    setDidacticResources((r) =>
      (r || []).map((res, i) =>
        i === index ? { ...res, [field]: value } : res,
      ),
    );

  const handleNextStep = async () => {
    // Si es el último step, ejecutar lógica de finalización
    if (isLastStep) {
      await finalizeSyllabus();
      return;
    }

    // Si no es el último step, guardar y avanzar normalmente
    const normalizedId = syllabusId ? String(syllabusId).trim() : "";
    const isValidId = normalizedId !== "" && /^\d+$/.test(normalizedId);

    if (!isValidId) {
      toast.error("ID del syllabus no válido");
      return;
    }

    // Validar que los datos hayan cargado antes de guardar
    if (
      methodologicalStrategies === undefined ||
      didacticResources === undefined
    ) {
      toast.error("Esperando datos del servidor...");
      return;
    }

    try {
      await Promise.all([
        saveStrategiesMutation.mutateAsync({
          syllabusId: normalizedId,
          estrategias: methodologicalStrategies,
        }),
        saveResourcesMutation.mutateAsync({
          syllabusId: normalizedId,
          recursos: didacticResources,
        }),
      ]);

      toast.success("Datos guardados correctamente");
      nextStep();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error desconocido";
      toast.error(`Error al guardar: ${errorMessage}`);
      console.error("Error guardando datos del paso 5:", err);
    }
  };

  return (
    <Step step={5} onNextStep={handleNextStep}>
      <div className="w-full p-6 space-y-8">
        {/* Estrategias Metodológicas */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="text-lg font-bold text-black">5.</div>
            <h2 className="text-lg font-semibold text-black">
              Estrategias Metodológicas
            </h2>
          </div>
          <div className="bg-white border border-gray-300 rounded-lg p-6">
            {loadingStrategies && (
              <div className="mb-4 text-sm text-gray-700">
                Cargando estrategias desde servidor...
              </div>
            )}
            {methodologicalStrategies === undefined ? (
              <div className="text-center py-8 text-gray-500">
                Cargando datos...
              </div>
            ) : (
              <div className="space-y-4">
                {methodologicalStrategies.map((strategy, index) => (
                  <div key={index}>
                    <div className="p-4 border border-gray-200 rounded-lg space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="flex-1 space-y-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Título
                            </label>
                            <input
                              type="text"
                              value={strategy.titulo}
                              onChange={(e) =>
                                updateStrategy(index, "titulo", e.target.value)
                              }
                              placeholder="Ingrese el título de la estrategia..."
                              className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Descripción
                            </label>
                            <textarea
                              value={strategy.descripcion}
                              onChange={(e) =>
                                updateStrategy(
                                  index,
                                  "descripcion",
                                  e.target.value,
                                )
                              }
                              placeholder="Ingrese la descripción de la estrategia..."
                              rows={3}
                              className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                        </div>
                        <button
                          onClick={() => removeStrategy(index)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                          disabled={methodologicalStrategies.length <= 1}
                        >
                          <X size={20} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                <button
                  onClick={addStrategy}
                  className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:text-blue-600 transition-colors text-gray-600"
                >
                  <Plus size={20} />
                  <span>Agregar estrategia metodológica</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Recursos Didácticos */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="text-lg font-bold text-black">6.</div>
            <h2 className="text-lg font-semibold text-black">
              Recursos Didácticos
            </h2>
          </div>
          <div className="bg-white border border-gray-300 rounded-lg p-6">
            {loadingResources && (
              <div className="mb-4 text-sm text-gray-700">
                Cargando recursos desde servidor...
              </div>
            )}
            {didacticResources === undefined ? (
              <div className="text-center py-8 text-gray-500">
                Cargando datos...
              </div>
            ) : (
              <div className="space-y-4">
                {didacticResources.map((resource, index) => (
                  <div key={index}>
                    <div className="p-4 border border-gray-200 rounded-lg space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="flex-1 space-y-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Título
                            </label>
                            <input
                              type="text"
                              value={resource.titulo}
                              onChange={(e) =>
                                updateResource(index, "titulo", e.target.value)
                              }
                              placeholder="Ingrese el título del recurso..."
                              className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Descripción
                            </label>
                            <textarea
                              value={resource.descripcion}
                              onChange={(e) =>
                                updateResource(
                                  index,
                                  "descripcion",
                                  e.target.value,
                                )
                              }
                              placeholder="Ingrese la descripción del recurso..."
                              rows={3}
                              className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                        </div>
                        <button
                          onClick={() => removeResource(index)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                          disabled={didacticResources.length <= 1}
                        >
                          <X size={20} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                <button
                  onClick={addResource}
                  className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:text-blue-600 transition-colors text-gray-600"
                >
                  <Plus size={20} />
                  <span>Agregar recurso didáctico</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Step>
  );
}
