// src/components/syllabus-process/FourthStep.tsx
import { useState, useEffect } from "react";
import { Step } from "../common/Step";
import { UnitSelector } from "../common/UnitSelector";
import { WeekSelector } from "../common/WeekSelector";

type Actividad = { nombre: string; horas: number };

export default function FourthStep() {
  const [unidadSeleccionada, setUnidadSeleccionada] = useState<number | "">("");
  const [semanaSeleccionada, setSemanaSeleccionada] = useState<number | "">("");
  const [horasDisponibles, setHorasDisponibles] = useState<number>(0);
  const [conceptual, setConceptual] = useState("");
  const [procedimental, setProcedimental] = useState("");
  const [actividades, setActividades] = useState<Actividad[]>([]);

  // Datos estáticos simulados (se reemplazarán por API más adelante)
  const unidades = [
    { id: 1, numero: 1, titulo: "Introducción" },
    { id: 2, numero: 2, titulo: "Intermedio" },
    { id: 3, numero: 3, titulo: "Avanzado" },
    { id: 4, numero: 4, titulo: "Proyecto Final" },
  ];

  const semanasPorUnidad: Record<number, number[]> = {
    1: [1, 2, 3, 4],
    2: [5, 6, 7, 8],
    3: [9, 10, 11, 12],
    4: [13, 14, 15, 16],
  };

  // Horas disponibles (simuladas por semana)
  const horasPorSemana: Record<number, number> = {
    1: 2,
    2: 3,
    3: 1,
    4: 2,
    5: 3,
    6: 2,
    7: 2,
    8: 3,
    9: 2,
    10: 3,
    11: 2,
    12: 1,
    13: 3,
    14: 2,
    15: 3,
    16: 2,
  };

  // Actualiza horas disponibles cuando cambia la semana seleccionada
  useEffect(() => {
    if (semanaSeleccionada !== "") {
      const numeroSemana = Number(semanaSeleccionada);
      const horas = horasPorSemana[numeroSemana] ?? 0;
      setHorasDisponibles(horas);
    } else {
      setHorasDisponibles(0);
    }
  }, [semanaSeleccionada]);

  // Manejo de actividades
  const handleAddActividad = () =>
    setActividades([...actividades, { nombre: "", horas: 1 }]);

  const handleRemoveActividad = (index: number) =>
    setActividades(actividades.filter((_, i) => i !== index));

  return (
    <Step step={4} onNextStep={() => console.log("Siguiente clickeado")}>
      <div className="bg-white rounded-lg p-6 text-[#1E1E1E]">
        {/* Selector de Unidades */}
        <UnitSelector
          unidades={unidades}
          unidadSeleccionada={unidadSeleccionada}
          onChange={(unidad) => {
            setUnidadSeleccionada(unidad);
            setSemanaSeleccionada("");
            setHorasDisponibles(0);
          }}
        />

        {/* Selector de Semanas y Horas */}
        {unidadSeleccionada !== "" && (
          <div className="mb-6">
            <h2 className="text-lg font-bold mb-2 text-left">4.1 Semanas</h2>
            <div className="flex flex-col lg:flex-row justify-between items-start gap-6">
              <WeekSelector
                semanas={semanasPorUnidad[Number(unidadSeleccionada)]}
                semanaSeleccionada={semanaSeleccionada}
                onChange={setSemanaSeleccionada}
              />
              <div className="flex flex-col gap-1 items-end">
                <span className="text-sm font-medium text-gray-600">
                  Horas disponibles
                </span>
                <div className="bg-black text-white rounded-md px-4 py-2 font-semibold text-sm">
                  {horasDisponibles} Horas
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Contenidos Conceptuales y Procedimentales */}
        <div className="grid md:grid-cols-2 gap-6 mt-6">
          <div>
            <label className="block text-base font-semibold mb-1 text-left">
              Contenidos conceptuales
            </label>
            <textarea
              value={conceptual}
              maxLength={400}
              onChange={(e) => setConceptual(e.target.value)}
              className="border border-gray-300 rounded-md w-full h-24 p-3 text-sm text-gray-700 resize-none"
            />
            <p className="text-right text-xs text-gray-400 mt-1">
              {conceptual.length}/400
            </p>
          </div>
          <div>
            <label className="block text-base font-semibold mb-1 text-left">
              Contenidos procedimentales
            </label>
            <textarea
              value={procedimental}
              maxLength={400}
              onChange={(e) => setProcedimental(e.target.value)}
              className="border border-gray-300 rounded-md w-full h-24 p-3 text-sm text-gray-700 resize-none"
            />
            <p className="text-right text-xs text-gray-400 mt-1">
              {procedimental.length}/400
            </p>
          </div>
        </div>

        {/* Actividades de Aprendizaje */}
        <div className="mb-6 mt-6">
          <h2 className="text-lg font-bold mb-4 text-left">
            4.2 Actividades de Aprendizaje
          </h2>
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 relative">
            {actividades.map((act, i) => (
              <div
                key={i}
                className="flex justify-between items-center bg-gray-200 rounded-full mb-2 p-2"
              >
                <input
                  type="text"
                  value={act.nombre}
                  onChange={(e) => {
                    const nuevas = [...actividades];
                    nuevas[i].nombre = e.target.value;
                    setActividades(nuevas);
                  }}
                  placeholder="Nombre de la actividad"
                  className="bg-transparent flex-1 px-2 text-sm text-gray-800 outline-none"
                />
                <div className="flex items-center gap-2">
                  <select
                    value={act.horas}
                    className="bg-gray-100 rounded-full text-sm font-semibold px-2 py-1"
                    onChange={(e) => {
                      const nuevas = [...actividades];
                      nuevas[i].horas = Number(e.target.value);
                      setActividades(nuevas);
                    }}
                  >
                    {[1, 2, 3].map((h) => (
                      <option key={h} value={h}>
                        {h}h
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => handleRemoveActividad(i)}
                    className="text-red-500 font-bold px-2"
                  >
                    X
                  </button>
                </div>
              </div>
            ))}
            <div className="flex justify-end mt-4">
              <button
                onClick={handleAddActividad}
                className="text-3xl text-gray-700 hover:text-black font-bold"
              >
                +
              </button>
            </div>
          </div>
        </div>
      </div>
    </Step>
  );
}
