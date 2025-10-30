import { useState } from "react";
import { Step } from "./step";
import { useSteps } from "../contexts/steps-context-provider";
import { ChevronDown } from "lucide-react";

// Tipos
interface StudentOutcome {
  id: number;
  code: string;
  description: string;
  level: "K" | "R" | "";
}

// Data mockeada
const mockStudentOutcomes: StudentOutcome[] = [
  {
    id: 1,
    code: "K",
    description:
      "Analizar un sistema complejo de computación aplicar principios de computación y otras disciplinas relevantes",
    level: "",
  },
  {
    id: 2,
    code: "R",
    description: "Diseñar implementar y evaluar",
    level: "",
  },
  {
    id: 3,
    code: "",
    description: "Comunicación efectiva en una variedad",
    level: "",
  },
  {
    id: 4,
    code: "",
    description: "Reconoce la responsabilidad profesional",
    level: "",
  },
  {
    id: 5,
    code: "",
    description: "Trabajo de manera efectiva como miembro líder o un equipos",
    level: "",
  },
  {
    id: 6,
    code: "",
    description: "Brindar soporte a la entrega",
    level: "",
  },
  {
    id: 7,
    code: "",
    description: "Aprendizaje continuo",
    level: "",
  },
];

export default function EighthStep() {
  const { nextStep } = useSteps();
  const [outcomes, setOutcomes] =
    useState<StudentOutcome[]>(mockStudentOutcomes);

  const handleNextStep = () => {
    console.log("Guardando aportes al logro de resultados...", outcomes);
    nextStep();
  };

  const handleLevelChange = (id: number, level: "K" | "R" | "") => {
    setOutcomes(
      outcomes.map((outcome) =>
        outcome.id === id ? { ...outcome, level } : outcome,
      ),
    );
  };

  return (
    <Step step={8} onNextStep={handleNextStep}>
      <div className="w-full max-w-6xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-4">
          9. Aporte de la Asignatura al logro de resultados
        </h2>

        {/* Descripción */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
          <p className="text-gray-700 leading-relaxed">
            El aporte de la asignatura al logro de los Resultados del Estudiante
            (Student Outcomes) en la formación del graduado en Ingeniería de
            Computación y Sistemas, se establece en la tabla siguiente:
          </p>
        </div>

        {/* Leyenda */}
        <div className="bg-gray-100 border border-gray-300 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-center gap-8 text-sm">
            <div className="flex items-center gap-2">
              <span className="font-semibold">K =</span>
              <span>Clave</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold">R =</span>
              <span>Relacionado</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold">Recuadro vacío =</span>
              <span>No aplica</span>
            </div>
          </div>
        </div>

        {/* Tabla de Student Outcomes */}
        <div className="bg-white border border-gray-300 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-300">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold w-12">
                  #
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold">
                  Descripción
                </th>
                <th className="px-4 py-3 text-center text-sm font-semibold w-32">
                  Nivel
                </th>
              </tr>
            </thead>
            <tbody>
              {outcomes.map((outcome, index) => (
                <tr
                  key={outcome.id}
                  className={`border-b border-gray-200 ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  }`}
                >
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {outcome.id}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {outcome.description}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-center">
                      <div className="relative">
                        <select
                          value={outcome.level}
                          onChange={(e) =>
                            handleLevelChange(
                              outcome.id,
                              e.target.value as "K" | "R" | "",
                            )
                          }
                          className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-10 text-sm cursor-pointer hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">-</option>
                          <option value="K">K</option>
                          <option value="R">R</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                          <ChevronDown className="w-4 h-4 text-gray-400" />
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Información adicional */}
        <div className="mt-6 text-sm text-gray-600">
          <p>
            * Selecciona el nivel de aporte de la asignatura para cada resultado
            del estudiante.
          </p>
        </div>
      </div>
    </Step>
  );
}
