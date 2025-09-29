import { useState } from "react";
import Stepper from "../ui/Stepper";
import { Button } from "../ui/button";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";

interface CourseFormData {
  generalData: {
    courseCode: string;
    courseName: string;
  };
  consultationSources: {
    week: string;
    didacticResources: string;
    sources: string[];
  };
  contributions: {
    bibliography: string;
    contributionType: string;
    contributionsList: string[];
  };
}

const TOTAL_STEPS = 9;

export default function CreateCourse() {
  const [currentStep, setCurrentStep] = useState(9); // Empezamos en paso 9 como muestra la imagen
  const [formData, setFormData] = useState<CourseFormData>({
    generalData: {
      courseCode: "09013707052",
      courseName: "INGENIERIA DE SOFTWARE II",
    },
    consultationSources: {
      week: "Semana 1",
      didacticResources: "",
      sources: ["", "", ""],
    },
    contributions: {
      bibliography:
        "Analizar un sistema complejo de computacion y aplicar principios de computacion y otras disciplinas relevantes para identificar soluciones",
      contributionType: "k= Clave R",
      contributionsList: [
        "Analizar un sistema complejo de computacion y aplicar principios de computacion y otras disciplinas relevantes para identificar soluciones",
        "Analizar un sistema complejo de computacion y aplicar principios de computacion y otras disciplinas relevantes para identificar soluciones",
        "Analizar un sistema complejo de computacion y aplicar principios de computacion y otras disciplinas relevantes para identificar soluciones",
        "Analizar un sistema complejo de computacion y aplicar principios de computacion y otras disciplinas relevantes para identificar soluciones",
        "Analizar un sistema complejo de computacion y aplicar principios de computacion y otras disciplinas relevantes para identificar soluciones",
      ],
    },
  });

  const handleNext = () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepClick = (step: number) => {
    setCurrentStep(step);
  };

  const addSource = () => {
    setFormData((prev) => ({
      ...prev,
      consultationSources: {
        ...prev.consultationSources,
        sources: [...prev.consultationSources.sources, ""],
      },
    }));
  };

  const removeSource = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      consultationSources: {
        ...prev.consultationSources,
        sources: prev.consultationSources.sources.filter((_, i) => i !== index),
      },
    }));
  };

  const updateSource = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      consultationSources: {
        ...prev.consultationSources,
        sources: prev.consultationSources.sources.map((source, i) =>
          i === index ? value : source
        ),
      },
    }));
  };

  const addContribution = () => {
    setFormData((prev) => ({
      ...prev,
      contributions: {
        ...prev.contributions,
        contributionsList: [...prev.contributions.contributionsList, ""],
      },
    }));
  };

  const removeContribution = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      contributions: {
        ...prev.contributions,
        contributionsList: prev.contributions.contributionsList.filter(
          (_, i) => i !== index
        ),
      },
    }));
  };

  const updateContribution = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      contributions: {
        ...prev.contributions,
        contributionsList: prev.contributions.contributionsList.map(
          (contribution, i) => (i === index ? value : contribution)
        ),
      },
    }));
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-lg font-semibold">
              <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm">
                i
              </span>
              1. Datos Generales
            </div>

            <div>
              <input
                type="text"
                value={`${formData.generalData.courseName} COD: ${formData.generalData.courseCode}`}
                onChange={(e) => {
                  const value = e.target.value;
                  const codMatch = value.match(/COD:\s*(\w+)/);
                  const courseName = value.split(" COD:")[0];

                  setFormData((prev) => ({
                    ...prev,
                    generalData: {
                      courseName,
                      courseCode: codMatch
                        ? codMatch[1]
                        : prev.generalData.courseCode,
                    },
                  }));
                }}
                className="w-full p-4 border border-gray-300 rounded-lg text-gray-600 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Nombre del curso COD: código"
              />
            </div>
          </div>
        );

      case 7:
        return (
          <div className="space-y-6">
            <div className="text-lg font-semibold">7. Fuentes de consulta</div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Lado izquierdo */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Selecciona una semana
                  </label>
                  <div className="relative">
                    <select
                      value={formData.consultationSources.week}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          consultationSources: {
                            ...prev.consultationSources,
                            week: e.target.value,
                          },
                        }))
                      }
                      className="w-full bg-black text-white p-3 rounded-lg appearance-none pr-10"
                    >
                      <option value="Semana 1">Semana 1</option>
                      <option value="Semana 2">Semana 2</option>
                      <option value="Semana 3">Semana 3</option>
                      <option value="Semana 4">Semana 4</option>
                    </select>
                    <ChevronRight className="absolute right-3 top-1/2 transform -rotate-90 text-white w-4 h-4" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Recursos didácticos
                  </label>
                  <div className="relative">
                    <textarea
                      value={formData.consultationSources.didacticResources}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          consultationSources: {
                            ...prev.consultationSources,
                            didacticResources: e.target.value,
                          },
                        }))
                      }
                      className="w-full h-40 p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Escribe los recursos didácticos..."
                    />
                    <div className="absolute bottom-3 right-3">
                      <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm">
                        i
                      </span>
                    </div>
                    <div className="absolute bottom-2 right-12 text-xs text-gray-500">
                      100/400
                    </div>
                  </div>
                </div>
              </div>

              {/* Lado derecho */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  1. Fuentes de consulta
                </label>
                <div className="space-y-3">
                  {formData.consultationSources.sources.map((source, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={source}
                        onChange={(e) => updateSource(index, e.target.value)}
                        className="flex-1 p-3 bg-gray-200 rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder={`Fuente de consulta ${index + 1}`}
                      />
                      <button
                        onClick={() => removeSource(index)}
                        className="p-2 text-gray-500 hover:text-red-500"
                      >
                        <span className="text-xl">•</span>
                        <span className="text-xl">•</span>
                      </button>
                    </div>
                  ))}

                  <button
                    onClick={addSource}
                    className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-500 hover:text-blue-500 flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Agregar fuente
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case 9:
        return (
          <div className="space-y-6">
            <div className="text-lg font-semibold">
              9. Aportes de la asignatura al logro de resultados
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Lado izquierdo */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Bibliografia
                  </label>
                  <div className="relative">
                    <textarea
                      value={formData.contributions.bibliography}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          contributions: {
                            ...prev.contributions,
                            bibliography: e.target.value,
                          },
                        }))
                      }
                      className="w-full h-40 p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Analizar un sistema complejo de computacion y aplicar principios de computacion y otras disciplinas relevantes para identificar soluciones"
                    />
                    <div className="absolute bottom-2 right-2 text-xs text-gray-500">
                      100/400
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Tipo de Aporte
                  </label>
                  <div className="relative">
                    <select
                      value={formData.contributions.contributionType}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          contributions: {
                            ...prev.contributions,
                            contributionType: e.target.value,
                          },
                        }))
                      }
                      className="w-full bg-black text-white p-3 rounded-lg appearance-none pr-10"
                    >
                      <option value="k= Clave R">k= Clave R</option>
                      <option value="k= Clave V">k= Clave V</option>
                      <option value="k= Clave A">k= Clave A</option>
                    </select>
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white text-sm">
                      V
                    </span>
                  </div>

                  <button
                    onClick={addContribution}
                    className="mt-3 flex items-center gap-2 text-blue-500 hover:text-blue-600"
                  >
                    <Plus className="w-4 h-4" />
                    Agregar Aporte
                  </button>
                </div>
              </div>

              {/* Lado derecho */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Lista de Aportes de la Asignatura
                </label>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {formData.contributions.contributionsList.map(
                    (contribution, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <textarea
                          value={contribution}
                          onChange={(e) =>
                            updateContribution(index, e.target.value)
                          }
                          className="flex-1 p-3 bg-gray-200 rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none min-h-[60px]"
                          placeholder="Analizar un sistema complejo de computacion y aplicar principios de computacion y otras disciplinas relevantes para identificar soluciones"
                        />
                        <div className="flex flex-col items-center gap-1 pt-2">
                          <span className="text-xs text-gray-500">
                            k= Clave R
                          </span>
                          <button
                            onClick={() => removeContribution(index)}
                            className="p-1 text-gray-500 hover:text-red-500"
                          >
                            <span className="text-xl">•</span>
                            <span className="text-xl">•</span>
                          </button>
                        </div>
                      </div>
                    )
                  )}

                  <button
                    onClick={addContribution}
                    className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-500 hover:text-blue-500 flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Agregar Aporte
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center py-20">
            <h3 className="text-xl font-semibold mb-4">Paso {currentStep}</h3>
            <p className="text-gray-600">
              Contenido del paso {currentStep} en desarrollo...
            </p>
          </div>
        );
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Crear nuevo curso</h1>

      <Stepper
        currentStep={currentStep}
        totalSteps={TOTAL_STEPS}
        onStepClick={handleStepClick}
      />

      <div className="bg-white rounded-lg shadow-sm border p-8 mb-8">
        {renderStepContent()}
      </div>

      {/* Botones de navegación */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentStep === 1}
          className="flex items-center gap-2"
        >
          <ChevronLeft className="w-4 h-4" />
          Atrás
        </Button>

        <Button
          onClick={handleNext}
          disabled={currentStep === TOTAL_STEPS}
          className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600"
        >
          Siguiente
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
