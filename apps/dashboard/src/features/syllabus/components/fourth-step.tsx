import { useState } from "react";
import { Step } from "./step";
import { useSteps } from "../contexts/steps-context-provider";
import { ChevronDown, ChevronUp, Plus, X } from "lucide-react";

// Tipos
interface Activity {
  id: string;
  name: string;
  hours: number;
}

interface Week {
  id: number;
  name: string;
  conceptualContent: string;
  proceduralContent: string;
  activities: Activity[];
}

interface Unit {
  id: string;
  name: string;
  weeks: Week[];
}

// Data mockeada
const HOURS_PER_WEEK = 10;

const mockUnits: Unit[] = [
  {
    id: "1",
    name: "Unidad I: DISEÑO DE SOLUCIONES INNOVADORAS",
    weeks: [
      {
        id: 1,
        name: "Semana 1",
        conceptualContent:
          "El taller y sus objetivos generales. El modelo de trabajo. Planteamiento del problema. El pensamiento de diseño y sus técnicas. Las necesidades del público objetivo y del entorno para entender a los usuarios.",
        proceduralContent:
          "El taller y sus objetivos generales. El modelo de trabajo. Planteamiento del problema. El pensamiento de diseño y sus técnicas. Las necesidades del público objetivo y del entorno para entender a los usuarios.",
        activities: [
          { id: "1", name: "Trabajo grupal en el proyecto", hours: 2 },
          { id: "2", name: "Expone el proyecto final", hours: 2 },
          { id: "3", name: "Reunión de coordinación diaria", hours: 3 },
          { id: "4", name: "Crea informe final de proyecto", hours: 3 },
        ],
      },
      {
        id: 2,
        name: "Semana 2",
        conceptualContent: "Metodologías ágiles y gestión de proyectos.",
        proceduralContent: "Aplicación práctica de metodologías ágiles.",
        activities: [
          { id: "5", name: "Sprint planning", hours: 2 },
          { id: "6", name: "Daily standup", hours: 1 },
        ],
      },
      {
        id: 3,
        name: "Semana 3",
        conceptualContent: "Prototipado y validación de soluciones.",
        proceduralContent: "Creación de prototipos funcionales.",
        activities: [
          { id: "7", name: "Desarrollo de prototipo", hours: 4 },
          { id: "8", name: "Testing con usuarios", hours: 2 },
        ],
      },
      {
        id: 4,
        name: "Semana 4",
        conceptualContent: "Presentación y evaluación de proyectos.",
        proceduralContent: "Preparación de presentación final.",
        activities: [
          { id: "9", name: "Preparación de presentación", hours: 3 },
          { id: "10", name: "Presentación final", hours: 2 },
        ],
      },
    ],
  },
];

export default function FourthStep() {
  const { nextStep } = useSteps();
  const [units] = useState<Unit[]>(mockUnits);
  const [selectedUnit, setSelectedUnit] = useState<string>(units[0]?.id || "");
  const [selectedWeek, setSelectedWeek] = useState<number>(1);
  const [expandedUnit, setExpandedUnit] = useState<string | null>(
    units[0]?.id || null,
  );

  const currentUnit = units.find((u) => u.id === selectedUnit);
  const currentWeek = currentUnit?.weeks.find((w) => w.id === selectedWeek);

  // Calcular horas usadas en la semana actual
  const usedHours =
    currentWeek?.activities.reduce((sum, act) => sum + act.hours, 0) || 0;
  const availableHours = HOURS_PER_WEEK - usedHours;

  const handleNextStep = () => {
    // Aquí iría la lógica de guardado
    console.log("Guardando programación de contenidos...", units);
    nextStep();
  };

  const handleAddActivity = () => {
    console.log("Agregar nueva actividad");
    // Lógica para agregar actividad
  };

  const handleRemoveActivity = (activityId: string) => {
    console.log("Eliminar actividad:", activityId);
    // Lógica para eliminar actividad
  };

  const handleUpdateActivityHours = (activityId: string, hours: number) => {
    console.log("Actualizar horas de actividad:", activityId, hours);
    // Lógica para actualizar horas
  };

  return (
    <Step step={4} onNextStep={handleNextStep}>
      <div className="w-full max-w-6xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-6">4. Unidades</h2>

        {/* Selector de Unidad */}
        <div className="mb-6">
          {units.map((unit) => (
            <div key={unit.id} className="mb-2">
              <button
                onClick={() => {
                  setSelectedUnit(unit.id);
                  setExpandedUnit(expandedUnit === unit.id ? null : unit.id);
                }}
                className="w-full flex items-center justify-between px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <span className="font-medium text-left">{unit.name}</span>
                {expandedUnit === unit.id ? (
                  <ChevronUp className="w-5 h-5" />
                ) : (
                  <ChevronDown className="w-5 h-5" />
                )}
              </button>
            </div>
          ))}
        </div>

        {/* Contenido de la unidad seleccionada */}
        {expandedUnit && currentUnit && (
          <div className="space-y-6">
            {/* Selector de Semanas */}
            <div>
              <h3 className="text-xl font-semibold mb-4">4.1. Semanas</h3>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-2">
                    Selecciona una semana
                  </label>
                  <select
                    value={selectedWeek}
                    onChange={(e) => setSelectedWeek(Number(e.target.value))}
                    className="w-full px-4 py-2 bg-black text-white rounded-lg"
                  >
                    {currentUnit.weeks.map((week) => (
                      <option key={week.id} value={week.id}>
                        {week.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex-shrink-0">
                  <label className="block text-sm font-medium mb-2">
                    Horas disponibles
                  </label>
                  <div className="px-6 py-2 bg-black text-white rounded-lg text-center font-bold">
                    {HOURS_PER_WEEK} Horas
                  </div>
                </div>
              </div>
            </div>

            {/* Contenidos */}
            {currentWeek && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  {/* Contenidos Conceptuales */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Contenidos conceptuales
                    </label>
                    <textarea
                      value={currentWeek.conceptualContent}
                      readOnly
                      className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg resize-none bg-gray-50"
                      placeholder="Contenidos conceptuales..."
                    />
                    <div className="text-right text-sm text-gray-500 mt-1">
                      {currentWeek.conceptualContent.length}/400
                    </div>
                  </div>

                  {/* Contenidos Procedimentales */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Contenidos Procedimentales
                    </label>
                    <textarea
                      value={currentWeek.proceduralContent}
                      readOnly
                      className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg resize-none bg-gray-50"
                      placeholder="Contenidos procedimentales..."
                    />
                    <div className="text-right text-sm text-gray-500 mt-1">
                      {currentWeek.proceduralContent.length}/400
                    </div>
                  </div>
                </div>

                {/* Actividades de Aprendizaje */}
                <div>
                  <h3 className="text-xl font-semibold mb-4">
                    4.2. Actividades de Aprendizaje
                  </h3>
                  <div className="space-y-3">
                    {currentWeek.activities.map((activity) => (
                      <div
                        key={activity.id}
                        className="flex items-center gap-3"
                      >
                        <input
                          type="text"
                          value={activity.name}
                          readOnly
                          className="flex-1 px-4 py-2 bg-gray-200 rounded-lg"
                        />
                        <select
                          value={activity.hours}
                          onChange={(e) =>
                            handleUpdateActivityHours(
                              activity.id,
                              Number(e.target.value),
                            )
                          }
                          className="w-24 px-3 py-2 bg-gray-200 rounded-lg text-center"
                        >
                          {Array.from(
                            { length: HOURS_PER_WEEK + 1 },
                            (_, i) => i,
                          ).map((hour) => (
                            <option key={hour} value={hour}>
                              {hour} - h
                            </option>
                          ))}
                        </select>
                        <button className="p-2 hover:bg-gray-100 rounded-lg">
                          <ChevronDown className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleRemoveActivity(activity.id)}
                          className="p-2 hover:bg-red-100 rounded-lg"
                        >
                          <X className="w-5 h-5 text-red-600" />
                        </button>
                      </div>
                    ))}

                    {/* Botón Agregar Actividad */}
                    <button
                      onClick={handleAddActivity}
                      className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-colors"
                    >
                      <Plus className="w-5 h-5" />
                      <span>Agregar actividad</span>
                    </button>
                  </div>

                  {/* Indicador de horas */}
                  <div className="mt-4 text-sm text-gray-600">
                    Horas usadas: {usedHours}/{HOURS_PER_WEEK} ({availableHours}{" "}
                    horas disponibles)
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </Step>
  );
}
