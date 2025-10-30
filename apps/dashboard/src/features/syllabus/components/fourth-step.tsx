import { useState } from "react";
import { Step } from "./step";
import { useSteps } from "../contexts/steps-context-provider";
import { ChevronDown, ChevronUp, Plus, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../common/components/ui/select";

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
  const [units, setUnits] = useState<Unit[]>(mockUnits);
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
    setUnits((prevUnits) =>
      prevUnits.map((unit) => {
        if (unit.id === selectedUnit) {
          return {
            ...unit,
            weeks: unit.weeks.map((week) => {
              if (week.id === selectedWeek) {
                const newActivity: Activity = {
                  id: Date.now().toString(),
                  name: "",
                  hours: 1,
                };
                return {
                  ...week,
                  activities: [...week.activities, newActivity],
                };
              }
              return week;
            }),
          };
        }
        return unit;
      }),
    );
  };

  const handleRemoveActivity = (activityId: string) => {
    setUnits((prevUnits) =>
      prevUnits.map((unit) => {
        if (unit.id === selectedUnit) {
          return {
            ...unit,
            weeks: unit.weeks.map((week) => {
              if (week.id === selectedWeek) {
                return {
                  ...week,
                  activities: week.activities.filter(
                    (act) => act.id !== activityId,
                  ),
                };
              }
              return week;
            }),
          };
        }
        return unit;
      }),
    );
  };

  const handleUpdateActivityHours = (activityId: string, hours: number) => {
    setUnits((prevUnits) =>
      prevUnits.map((unit) => {
        if (unit.id === selectedUnit) {
          return {
            ...unit,
            weeks: unit.weeks.map((week) => {
              if (week.id === selectedWeek) {
                return {
                  ...week,
                  activities: week.activities.map((act) =>
                    act.id === activityId ? { ...act, hours } : act,
                  ),
                };
              }
              return week;
            }),
          };
        }
        return unit;
      }),
    );
  };

  const handleUpdateActivityName = (activityId: string, name: string) => {
    setUnits((prevUnits) =>
      prevUnits.map((unit) => {
        if (unit.id === selectedUnit) {
          return {
            ...unit,
            weeks: unit.weeks.map((week) => {
              if (week.id === selectedWeek) {
                return {
                  ...week,
                  activities: week.activities.map((act) =>
                    act.id === activityId ? { ...act, name } : act,
                  ),
                };
              }
              return week;
            }),
          };
        }
        return unit;
      }),
    );
  };

  return (
    <Step step={4} onNextStep={handleNextStep}>
      <div className="w-full p-6">
        {/* Título alineado a la izquierda */}
        <div className="flex items-center gap-3 mb-6">
          <div className="text-lg font-bold text-black">4.</div>
          <h2 className="text-lg font-semibold text-black">Unidades</h2>
        </div>

        {/* Selector de Unidad */}
        <div className="mb-6">
          {units.map((unit) => (
            <div key={unit.id} className="mb-2">
              <button
                onClick={() => {
                  setSelectedUnit(unit.id);
                  setExpandedUnit(expandedUnit === unit.id ? null : unit.id);
                }}
                className="w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors"
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
              <div className="flex items-center gap-3 mb-4">
                <div className="text-base font-bold text-black">4.1.</div>
                <h3 className="text-base font-semibold text-black">Semanas</h3>
              </div>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Selecciona una semana
                  </label>
                  <Select
                    value={selectedWeek.toString()}
                    onValueChange={(value) => setSelectedWeek(Number(value))}
                  >
                    <SelectTrigger className="w-full bg-white">
                      <SelectValue placeholder="Selecciona una semana" />
                    </SelectTrigger>
                    <SelectContent>
                      {currentUnit.weeks.map((week) => (
                        <SelectItem key={week.id} value={week.id.toString()}>
                          {week.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-shrink-0">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Horas disponibles
                  </label>
                  <div className="px-6 py-2 bg-blue-600 text-white rounded-lg text-center font-bold">
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contenidos conceptuales
                    </label>
                    <textarea
                      value={currentWeek.conceptualContent}
                      readOnly
                      className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg resize-none bg-gray-100 text-gray-600"
                      placeholder="Contenidos conceptuales..."
                    />
                    <div className="text-right text-sm text-gray-500 mt-1">
                      {currentWeek.conceptualContent.length}/400
                    </div>
                  </div>

                  {/* Contenidos Procedimentales */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contenidos Procedimentales
                    </label>
                    <textarea
                      value={currentWeek.proceduralContent}
                      readOnly
                      className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg resize-none bg-gray-100 text-gray-600"
                      placeholder="Contenidos procedimentales..."
                    />
                    <div className="text-right text-sm text-gray-500 mt-1">
                      {currentWeek.proceduralContent.length}/400
                    </div>
                  </div>
                </div>

                {/* Actividades de Aprendizaje */}
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="text-base font-bold text-black">4.2.</div>
                    <h3 className="text-base font-semibold text-black">
                      Actividades de Aprendizaje
                    </h3>
                  </div>
                  <div className="space-y-3">
                    {currentWeek.activities.map((activity) => (
                      <div
                        key={activity.id}
                        className="flex items-center gap-3"
                      >
                        <input
                          type="text"
                          value={activity.name}
                          onChange={(e) =>
                            handleUpdateActivityName(
                              activity.id,
                              e.target.value,
                            )
                          }
                          placeholder="Nombre de la actividad..."
                          className="flex-1 px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <Select
                          value={activity.hours.toString()}
                          onValueChange={(value) =>
                            handleUpdateActivityHours(
                              activity.id,
                              Number(value),
                            )
                          }
                        >
                          <SelectTrigger className="w-28 bg-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from(
                              { length: HOURS_PER_WEEK + 1 },
                              (_, i) => i,
                            ).map((hour) => (
                              <SelectItem key={hour} value={hour.toString()}>
                                {hour}h
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <button
                          onClick={() => handleRemoveActivity(activity.id)}
                          className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                          disabled={currentWeek.activities.length <= 1}
                        >
                          <X className="w-5 h-5 text-red-600" />
                        </button>
                      </div>
                    ))}

                    {/* Botón Agregar Actividad */}
                    <button
                      onClick={handleAddActivity}
                      className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:text-blue-600 transition-colors text-gray-600"
                    >
                      <Plus className="w-5 h-5" />
                      <span>Agregar actividad</span>
                    </button>
                  </div>

                  {/* Indicador de horas */}
                  <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="text-sm text-gray-700">
                      <span className="font-semibold">Horas usadas:</span>{" "}
                      {usedHours}/{HOURS_PER_WEEK}
                      <span className="ml-2 text-blue-600">
                        ({availableHours} horas disponibles)
                      </span>
                    </div>
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
