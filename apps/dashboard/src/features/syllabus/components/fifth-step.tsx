import {
  useMethodologicalStrategiesQuery,
  useDidacticResourcesQuery,
  useSaveMethodologicalStrategies,
  useSaveDidacticResources,
} from "../hooks/fifth-step-query";

import type {
  MethodologicalStrategy,
  DidacticResource,
} from "../hooks/fifth-step-query";

import { useEffect, useState } from "react";
import { Step } from "./step";
import { useSteps } from "../contexts/steps-context-provider";
import { useSyllabusContext } from "../contexts/syllabus-context";
import { X, Plus } from "lucide-react";

const initialStrategies: MethodologicalStrategy[] = [
  {
    id: "1",
    title: "Método Expositivo – Interactivo",
    description:
      "Comprende la exposición del docente y la interacción con el estudiante, empleando las herramientas disponibles en el aula virtual de la asignatura",
  },
  {
    id: "2",
    title: "Método de Discusión Guiada",
    description:
      "Conducción del grupo para abordar situaciones y llegar a conclusiones y recomendaciones, empleando las herramientas disponibles en el aula virtual de la asignatura",
  },
  {
    id: "3",
    title: "Método de Demostración – Ejecución",
    description:
      "Se utiliza para ejecutar, demostrar, practicar y retroalimentar lo expuesto, empleando las herramientas disponibles en el aula virtual de la asignatura",
  },
];

const initialDidacticResources: DidacticResource[] = [
  {
    id: "1",
    title: "Equipos",
    description: "Computadora, ecran, proyector de multimedia",
  },
  {
    id: "2",
    title: "Materiales",
    description:
      "Material docente, pizarra, prácticas dirigidas de laboratorio, videos tutoriales, foros y textos bases (ver fuentes de consultas)",
  },
  {
    id: "3",
    title: "Software",
    description: "Herramientas de gestión de documentos, Mentimeter, Miro",
  },
];

const extractErrorMessage = (err: unknown): string | undefined => {
  if (!err) return undefined;
  if (err instanceof Error) return err.message;
  if (typeof err === "string") return err;
  try {
    const s = JSON.stringify(err);
    return s === "{}" ? undefined : s;
  } catch {
    return undefined;
  }
};

export default function FifthStep() {
  const { nextStep } = useSteps();
  const { syllabusId } = useSyllabusContext();

  const [methodologicalStrategies, setMethodologicalStrategies] =
    useState<MethodologicalStrategy[]>(initialStrategies);
  const [didacticResources, setDidacticResources] = useState<
    DidacticResource[]
  >(initialDidacticResources);

  const {
    data: serverStrategies,
    isLoading: loadingStrategies,
    isError: isErrorStrategies,
    error: errorStrategies,
    refetch: refetchStrategies,
  } = useMethodologicalStrategiesQuery(syllabusId ?? null);

  const {
    data: serverResources,
    isLoading: loadingResources,
    isError: isErrorResources,
    error: errorResources,
    refetch: refetchResources,
  } = useDidacticResourcesQuery(syllabusId ?? null);

  const saveStrategiesMutation = useSaveMethodologicalStrategies();
  const saveResourcesMutation = useSaveDidacticResources();

  const saveStrategiesStatus = saveStrategiesMutation.status;
  const saveResourcesStatus = saveResourcesMutation.status;

  const saveStrategiesErrorMessage = extractErrorMessage(
    (saveStrategiesMutation as unknown as { error?: unknown }).error,
  );
  const saveResourcesErrorMessage = extractErrorMessage(
    (saveResourcesMutation as unknown as { error?: unknown }).error,
  );

  useEffect(() => {
    if (Array.isArray(serverStrategies) && serverStrategies.length > 0) {
      setMethodologicalStrategies(serverStrategies);
    }
  }, [serverStrategies]);

  useEffect(() => {
    if (Array.isArray(serverResources) && serverResources.length > 0) {
      setDidacticResources(serverResources);
    }
  }, [serverResources]);

  const addStrategy = () => {
    setMethodologicalStrategies((s) => [
      ...s,
      { id: Date.now().toString(), title: "", description: "" },
    ]);
  };
  const removeStrategy = (id: string) =>
    setMethodologicalStrategies((s) => s.filter((st) => st.id !== id));
  const updateStrategy = (
    id: string,
    field: "title" | "description",
    value: string,
  ) =>
    setMethodologicalStrategies((s) =>
      s.map((st) => (st.id === id ? { ...st, [field]: value } : st)),
    );

  const addResource = () =>
    setDidacticResources((r) => [
      ...r,
      { id: Date.now().toString(), title: "", description: "" },
    ]);
  const removeResource = (id: string) =>
    setDidacticResources((r) => r.filter((res) => res.id !== id));
  const updateResource = (
    id: string,
    field: "title" | "description",
    value: string,
  ) =>
    setDidacticResources((r) =>
      r.map((res) => (res.id === id ? { ...res, [field]: value } : res)),
    );

  const handleNextStep = async () => {
    console.log(
      "Guardando estrategias metodológicas...",
      methodologicalStrategies,
    );
    console.log("Guardando recursos didácticos...", didacticResources);

    const normalizedId = (syllabusId ?? "").trim();
    const isValidId = normalizedId !== "" && /^\d+$/.test(normalizedId);

    if (!isValidId) {
      console.warn("No syllabusId válido: no se realizará POST al backend.");
      nextStep();
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

      await Promise.all([refetchStrategies(), refetchResources()]);

      nextStep();
    } catch (err) {
      const msg = extractErrorMessage(err);
      console.error("Error guardando datos del paso 5:", msg ?? err);
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
            {isErrorStrategies && (
              <div className="mb-4 text-sm text-red-600">
                Error cargando estrategias: {errorStrategies?.message}
              </div>
            )}
            <div className="space-y-4">
              {methodologicalStrategies.map((strategy) => (
                <div key={strategy.id}>
                  <div className="p-4 border border-gray-200 rounded-lg space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="flex-1 space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Título
                          </label>
                          <input
                            type="text"
                            value={strategy.title}
                            onChange={(e) =>
                              updateStrategy(
                                strategy.id,
                                "title",
                                e.target.value,
                              )
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
                            value={strategy.description}
                            onChange={(e) =>
                              updateStrategy(
                                strategy.id,
                                "description",
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
                        onClick={() => removeStrategy(strategy.id)}
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
            {saveStrategiesStatus === "pending" && (
              <div className="mt-3">Guardando estrategias...</div>
            )}
            {saveStrategiesStatus === "error" && (
              <div className="mt-3 text-red-500">
                Error: {saveStrategiesErrorMessage}
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
            {isErrorResources && (
              <div className="mb-4 text-sm text-red-600">
                Error cargando recursos: {errorResources?.message}
              </div>
            )}
            <div className="space-y-4">
              {didacticResources.map((resource) => (
                <div key={resource.id}>
                  <div className="p-4 border border-gray-200 rounded-lg space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="flex-1 space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Título
                          </label>
                          <input
                            type="text"
                            value={resource.title}
                            onChange={(e) =>
                              updateResource(
                                resource.id,
                                "title",
                                e.target.value,
                              )
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
                            value={resource.description}
                            onChange={(e) =>
                              updateResource(
                                resource.id,
                                "description",
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
                        onClick={() => removeResource(resource.id)}
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
            {saveResourcesStatus === "pending" && (
              <div className="mt-3">Guardando recursos...</div>
            )}
            {saveResourcesStatus === "error" && (
              <div className="mt-3 text-red-500">
                Error: {saveResourcesErrorMessage}
              </div>
            )}
          </div>
        </div>
      </div>
    </Step>
  );
}
