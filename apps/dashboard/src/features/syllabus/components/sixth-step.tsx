import { useState } from "react";
import { Step } from "./step";
import { useSteps } from "../contexts/steps-context-provider";
import { ChevronDown } from "lucide-react";

// Tipos
interface Formula {
  id: string;
  name: string;
  formula: string;
  legend: { key: string; description: string }[];
}

// Data mockeada - Fórmulas disponibles
const availableFormulas: Formula[] = [
  {
    id: "1",
    name: "Fórmula Estándar",
    formula: "PF = (2*PE+EP+EF) / 4",
    legend: [
      { key: "EP", description: "Examen Parcial" },
      { key: "EF", description: "Examen Final" },
      { key: "PE", description: "Promedio de Evaluaciones" },
    ],
  },
  {
    id: "2",
    name: "Fórmula Alternativa 1",
    formula: "PF = (PE+EP+EF) / 3",
    legend: [
      { key: "EP", description: "Examen Parcial" },
      { key: "EF", description: "Examen Final" },
      { key: "PE", description: "Promedio de Evaluaciones" },
    ],
  },
  {
    id: "3",
    name: "Fórmula Alternativa 2",
    formula: "PF = (3*PE+2*EP+EF) / 6",
    legend: [
      { key: "EP", description: "Examen Parcial" },
      { key: "EF", description: "Examen Final" },
      { key: "PE", description: "Promedio de Evaluaciones" },
    ],
  },
];

const evaluationFormulas: Formula[] = [
  {
    id: "1",
    name: "Evaluación Estándar",
    formula: "PE = ((P1+P2+P3+P4−MN) /3 + W1) /2",
    legend: [
      { key: "P1, P2, P3, P4", description: "Evaluaciones de los entregables" },
      { key: "MN", description: "Menor nota" },
      { key: "W1", description: "Trabajo final" },
    ],
  },
  {
    id: "2",
    name: "Evaluación Alternativa 1",
    formula: "PE = (P1+P2+P3+P4) / 4",
    legend: [
      { key: "P1, P2, P3, P4", description: "Evaluaciones de los entregables" },
    ],
  },
  {
    id: "3",
    name: "Evaluación Alternativa 2",
    formula: "PE = ((P1+P2+P3+P4) / 4 + W1) / 2",
    legend: [
      { key: "P1, P2, P3, P4", description: "Evaluaciones de los entregables" },
      { key: "W1", description: "Trabajo final" },
    ],
  },
];

export default function SixthStep() {
  const { nextStep } = useSteps();
  const [selectedFinalFormula, setSelectedFinalFormula] = useState<string>("1");
  const [selectedEvaluationFormula, setSelectedEvaluationFormula] =
    useState<string>("1");

  const currentFinalFormula = availableFormulas.find(
    (f) => f.id === selectedFinalFormula,
  );
  const currentEvaluationFormula = evaluationFormulas.find(
    (f) => f.id === selectedEvaluationFormula,
  );

  const handleNextStep = () => {
    console.log("Guardando fórmulas seleccionadas...", {
      finalFormula: currentFinalFormula,
      evaluationFormula: currentEvaluationFormula,
    });
    nextStep();
  };

  return (
    <Step step={6} onNextStep={handleNextStep}>
      <div className="w-full max-w-6xl mx-auto p-6 space-y-8">
        <h2 className="text-2xl font-bold mb-6">
          7. Evaluación del Aprendizaje
        </h2>

        {/* Selector de Fórmula del Promedio Final */}
        <div className="bg-white border border-gray-300 rounded-lg p-6">
          <p className="text-gray-700 mb-4 font-semibold">
            Selecciona la fórmula para el promedio final (PF) de la asignatura:
          </p>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">
              Fórmula del Promedio Final
            </label>
            <div className="relative">
              <select
                value={selectedFinalFormula}
                onChange={(e) => setSelectedFinalFormula(e.target.value)}
                className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-4 py-3 pr-10 text-sm cursor-pointer hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {availableFormulas.map((formula) => (
                  <option key={formula.id} value={formula.id}>
                    {formula.name}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                <ChevronDown className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          </div>

          {currentFinalFormula && (
            <>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <p className="text-center text-xl font-bold text-gray-800">
                  {currentFinalFormula.formula}
                </p>
              </div>
              <div className="space-y-2 text-gray-700">
                <p className="font-semibold">Donde:</p>
                {currentFinalFormula.legend.map((item, index) => (
                  <p key={index}>
                    <span className="font-medium">{item.key}</span> ={" "}
                    {item.description}
                  </p>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Selector de Fórmula del Promedio de Evaluaciones */}
        <div className="bg-white border border-gray-300 rounded-lg p-6">
          <p className="text-gray-700 mb-4 font-semibold">
            Selecciona la fórmula para el promedio de evaluaciones (PE):
          </p>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">
              Fórmula del Promedio de Evaluaciones
            </label>
            <div className="relative">
              <select
                value={selectedEvaluationFormula}
                onChange={(e) => setSelectedEvaluationFormula(e.target.value)}
                className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-4 py-3 pr-10 text-sm cursor-pointer hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {evaluationFormulas.map((formula) => (
                  <option key={formula.id} value={formula.id}>
                    {formula.name}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                <ChevronDown className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          </div>

          {currentEvaluationFormula && (
            <>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <p className="text-center text-xl font-bold text-gray-800">
                  {currentEvaluationFormula.formula}
                </p>
              </div>
              <div className="space-y-2 text-gray-700">
                <p className="font-semibold">Donde:</p>
                {currentEvaluationFormula.legend.map((item, index) => (
                  <p key={index}>
                    <span className="font-medium">{item.key}</span> ={" "}
                    {item.description}
                  </p>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </Step>
  );
}
