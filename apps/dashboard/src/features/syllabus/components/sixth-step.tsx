import { useState, useEffect } from "react";
import { Step } from "./step";
import { useSteps } from "../contexts/steps-context-provider";
import { useSyllabusContext } from "../contexts/syllabus-context";
import { toast } from "sonner";
import { useFormulaQuery } from "../hooks/sixth-step-query";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../common/components/ui/select";

// Tipos
interface Legend {
  key: string;
  description: string;
}

interface SubFormula {
  variable: string;
  name: string;
  formula: string;
  legend: Legend[];
}

interface MainFormula {
  id: string;
  name: string;
  formula: string;
  legend: Legend[];
  subFormulas: SubFormula[];
}

// Data mockeada - Fórmulas principales disponibles
// En producción, esto vendría del backend con las subfórmulas ya desglosadas
const availableFormulas: MainFormula[] = [
  {
    id: "1",
    name: "Fórmula Estándar",
    formula: "PF = (2*PE + PL + EP + EF) / 5",
    legend: [
      { key: "PF", description: "Promedio Final" },
      { key: "PE", description: "Promedio de Evaluaciones" },
      { key: "PL", description: "Promedio de Laboratorios" },
      { key: "EP", description: "Examen Parcial" },
      { key: "EF", description: "Examen Final" },
    ],
    subFormulas: [
      {
        variable: "PE",
        name: "Promedio de Evaluaciones",
        formula: "PE = ((P1+P2+P3+P4−MN) / 3 + W1) / 2",
        legend: [
          {
            key: "P1, P2, P3, P4",
            description: "Evaluaciones de los entregables",
          },
          { key: "MN", description: "Menor nota" },
          { key: "W1", description: "Trabajo final" },
        ],
      },
      {
        variable: "PL",
        name: "Promedio de Laboratorios",
        formula: "PL = (L1+L2+L3+L4) / 4",
        legend: [
          { key: "L1, L2, L3, L4", description: "Notas de laboratorios" },
        ],
      },
    ],
  },
  {
    id: "2",
    name: "Fórmula Alternativa 1",
    formula: "PF = (PE + EP + EF) / 3",
    legend: [
      { key: "PF", description: "Promedio Final" },
      { key: "PE", description: "Promedio de Evaluaciones" },
      { key: "EP", description: "Examen Parcial" },
      { key: "EF", description: "Examen Final" },
    ],
    subFormulas: [
      {
        variable: "PE",
        name: "Promedio de Evaluaciones",
        formula: "PE = (P1+P2+P3+P4) / 4",
        legend: [
          {
            key: "P1, P2, P3, P4",
            description: "Evaluaciones de los entregables",
          },
        ],
      },
    ],
  },
  {
    id: "3",
    name: "Fórmula Alternativa 2",
    formula: "PF = (3*PE + 2*PL + EP + EF) / 7",
    legend: [
      { key: "PF", description: "Promedio Final" },
      { key: "PE", description: "Promedio de Evaluaciones" },
      { key: "PL", description: "Promedio de Laboratorios" },
      { key: "EP", description: "Examen Parcial" },
      { key: "EF", description: "Examen Final" },
    ],
    subFormulas: [
      {
        variable: "PE",
        name: "Promedio de Evaluaciones",
        formula: "PE = ((P1+P2+P3+P4) / 4 + W1) / 2",
        legend: [
          {
            key: "P1, P2, P3, P4",
            description: "Evaluaciones de los entregables",
          },
          { key: "W1", description: "Trabajo final" },
        ],
      },
      {
        variable: "PL",
        name: "Promedio de Laboratorios",
        formula: "PL = ((L1+L2+L3+L4−MN) / 3)",
        legend: [
          { key: "L1, L2, L3, L4", description: "Notas de laboratorios" },
          { key: "MN", description: "Menor nota" },
        ],
      },
    ],
  },
];

export default function SixthStep() {
  const { nextStep } = useSteps();
  const { syllabusId } = useSyllabusContext();
  const [selectedFormula, setSelectedFormula] = useState<string>("1");

  // Intentar cargar fórmula del API
  const { data: formulaFromApi, isLoading } = useFormulaQuery(syllabusId);

  // Si hay fórmula del API, mostrar mensaje en consola
  useEffect(() => {
    if (formulaFromApi) {
      console.log("Fórmula cargada desde API:", formulaFromApi);
      toast.success("Fórmula cargada desde el servidor");
    }
  }, [formulaFromApi]);

  const currentFormula = availableFormulas.find(
    (f) => f.id === selectedFormula,
  );

  const handleNextStep = () => {
    console.log("Guardando fórmula seleccionada...", {
      formula: currentFormula,
      fromApi: formulaFromApi,
    });
    nextStep();
  };

  if (isLoading) {
    return (
      <Step step={6} onNextStep={handleNextStep}>
        <div className="w-full p-6">
          <p className="text-center">Cargando fórmula de evaluación...</p>
        </div>
      </Step>
    );
  }

  return (
    <Step step={6} onNextStep={handleNextStep}>
      <div className="w-full p-6 space-y-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="text-lg font-bold text-black">7.</div>
          <h2 className="text-lg font-semibold text-black">
            Evaluación del Aprendizaje
          </h2>
        </div>

        {/* Selector de Fórmula Principal */}
        <div className="bg-white border border-gray-300 rounded-lg p-6">
          <p className="text-gray-700 mb-4 font-semibold">
            Selecciona la fórmula para el promedio final (PF) de la asignatura:
          </p>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fórmula del Promedio Final
            </label>
            <Select value={selectedFormula} onValueChange={setSelectedFormula}>
              <SelectTrigger className="w-full bg-white">
                <SelectValue placeholder="Selecciona una fórmula" />
              </SelectTrigger>
              <SelectContent>
                {availableFormulas.map((formula) => (
                  <SelectItem key={formula.id} value={formula.id}>
                    {formula.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {currentFormula && (
            <>
              {/* Fórmula Principal */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <p className="text-center text-xl font-bold text-gray-800">
                  {currentFormula.formula}
                </p>
              </div>

              {/* Leyenda de la Fórmula Principal */}
              <div className="space-y-2 text-gray-700 mb-6">
                <p className="font-semibold">Donde:</p>
                {currentFormula.legend.map((item, index) => (
                  <p key={index} className="ml-4">
                    <span className="font-medium">{item.key}</span> ={" "}
                    {item.description}
                  </p>
                ))}
              </div>

              {/* Fórmulas Desglosadas */}
              {currentFormula.subFormulas.length > 0 && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Fórmulas Desglosadas
                  </h3>
                  <div className="space-y-6">
                    {currentFormula.subFormulas.map((subFormula, index) => (
                      <div
                        key={index}
                        className="bg-gray-50 border border-gray-200 rounded-lg p-4"
                      >
                        <h4 className="font-semibold text-gray-800 mb-2">
                          {subFormula.name}
                        </h4>
                        <div className="bg-white border border-gray-300 rounded-lg p-3 mb-3">
                          <p className="text-center text-lg font-bold text-gray-800">
                            {subFormula.formula}
                          </p>
                        </div>
                        <div className="space-y-1 text-sm text-gray-700">
                          <p className="font-semibold">Donde:</p>
                          {subFormula.legend.map((item, legendIndex) => (
                            <p key={legendIndex} className="ml-4">
                              <span className="font-medium">{item.key}</span> ={" "}
                              {item.description}
                            </p>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </Step>
  );
}
