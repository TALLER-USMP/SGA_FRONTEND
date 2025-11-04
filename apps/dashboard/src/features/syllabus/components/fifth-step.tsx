import { useState } from "react";
import { Step } from "./step";
import { useSteps } from "../contexts/steps-context-provider";
import { X, Plus } from "lucide-react";

// Tipos
interface MethodologicalStrategy {
  id: string;
  title: string;
  description: string;
}

// Data inicial
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

// Tipos para recursos didácticos
interface DidacticResource {
  id: string;
  title: string;
  description: string;
}

// Data inicial de recursos didácticos
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

export default function FifthStep() {
  const { nextStep } = useSteps();
  const [methodologicalStrategies, setMethodologicalStrategies] =
    useState<MethodologicalStrategy[]>(initialStrategies);
  const [didacticResources, setDidacticResources] = useState<
    DidacticResource[]
  >(initialDidacticResources);

  const handleNextStep = () => {
    console.log(
      "Guardando estrategias metodológicas...",
      methodologicalStrategies,
    );
    console.log("Guardando recursos didácticos...", didacticResources);
    nextStep();
  };

  // Funciones para estrategias metodológicas
  const addStrategy = () => {
    const newStrategy: MethodologicalStrategy = {
      id: Date.now().toString(),
      title: "",
      description: "",
    };
    setMethodologicalStrategies([...methodologicalStrategies, newStrategy]);
  };

  const removeStrategy = (id: string) => {
    setMethodologicalStrategies(
      methodologicalStrategies.filter((strategy) => strategy.id !== id),
    );
  };

  const updateStrategy = (
    id: string,
    field: "title" | "description",
    value: string,
  ) => {
    setMethodologicalStrategies(
      methodologicalStrategies.map((strategy) =>
        strategy.id === id ? { ...strategy, [field]: value } : strategy,
      ),
    );
  };

  // Funciones para recursos didácticos
  const addResource = () => {
    const newResource: DidacticResource = {
      id: Date.now().toString(),
      title: "",
      description: "",
    };
    setDidacticResources([...didacticResources, newResource]);
  };

  const removeResource = (id: string) => {
    setDidacticResources(
      didacticResources.filter((resource) => resource.id !== id),
    );
  };

  const updateResource = (
    id: string,
    field: "title" | "description",
    value: string,
  ) => {
    setDidacticResources(
      didacticResources.map((resource) =>
        resource.id === id ? { ...resource, [field]: value } : resource,
      ),
    );
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
          </div>
        </div>
      </div>
    </Step>
  );
}
