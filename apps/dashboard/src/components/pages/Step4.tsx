import { useState } from "react";
import type { WeekData } from "./CreateCourse";

interface LearningActivity {
  id: number;
  nombre: string;
  horas: number;
}

interface Unidad {
  id: number;
  texto: string;
}

interface Step4Props {
  data: WeekData;
  onChange: (data: WeekData) => void;
}

export default function Step4({ data, onChange }: Step4Props) {
  const [semanaSeleccionada, setSemanaSeleccionada] = useState("Semana 1");
  const [actividades, setActividades] = useState<LearningActivity[]>([
    { id: 1, nombre: "Nueva actividad", horas: 2 },
  ]);

  // 🔹 Unidades
  const [showUnidades, setShowUnidades] = useState(false);
  const [unidadSeleccionada, setUnidadSeleccionada] = useState<Unidad>({
    id: 1,
    texto: "Unidad I: Diseño de Soluciones Innovadoras",
  });
  const unidades: Unidad[] = [
    { id: 1, texto: "Unidad I: Diseño de Soluciones Innovadoras" },
    { id: 2, texto: "Unidad II: Gestión de Proyectos" },
    { id: 3, texto: "Unidad III: Evaluación y Mejora Continua" },
  ];

  const semanas = ["Semana 1", "Semana 2", "Semana 3"];

  const handleActividadChange = (
    id: number,
    field: keyof LearningActivity,
    value: string | number
  ) => {
    setActividades((prev) =>
      prev.map((act) => (act.id === id ? { ...act, [field]: value } : act))
    );
  };

  const handleEliminarActividad = (id: number) => {
    setActividades((prev) => prev.filter((act) => act.id !== id));
  };

  const handleAgregarActividad = () => {
    const newId = actividades.length
      ? Math.max(...actividades.map((a) => a.id)) + 1
      : 1;
    setActividades([
      ...actividades,
      { id: newId, nombre: "Nueva actividad", horas: 1 },
    ]);
  };

  return (
    <div className="space-y-10 mr-5 ml-2">
      {/* 4. Unidad */}
      <div>
        <h4 className="font-bold mb-3">4. Unidades</h4>
        <div className="relative ml-4">
          <input
            type="text"
            value={unidadSeleccionada.texto}
            readOnly
            className="w-full p-4 ml-1 pr-12 rounded-lg border text-lg bg-gray-100 cursor-pointer"
            onClick={() => setShowUnidades((show) => !show)}
            style={{ userSelect: "none" }}
          />
          {/* Icono de flecha */}
          <span
            className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer"
            onClick={() => setShowUnidades((show) => !show)}
            tabIndex={0}
          >
            <svg width="24" height="24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="#aaa" />
              <path
                d="M8 12h8"
                stroke="#aaa"
                strokeWidth={2}
                strokeLinecap="round"
              />
            </svg>
          </span>

          {/* Dropdown */}
          {showUnidades && (
            <div className="absolute left-0 top-full w-full bg-white border rounded-lg shadow-lg mt-2 z-10">
              {unidades.map((u) => (
                <div
                  key={u.id}
                  className={`px-4 py-2 cursor-pointer hover:bg-red-50 ${
                    u.id === unidadSeleccionada.id ? "bg-red-100" : ""
                  }`}
                  onClick={() => {
                    setUnidadSeleccionada(u);
                    setShowUnidades(false);
                  }}
                >
                  {u.texto}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 4.1 Semanas */}
      <div>
        <h4 className="font-bold mb-4">4.1. Semanas</h4>
        <div className="flex justify-between items-end mb-1">
          <label className="pl-5 font-normal ml-2">Selecciona una semana</label>
          <span className="font-normal text-right">Horas disponibles</span>
        </div>
        <div className="flex justify-between items-end pl-5">
          <select
            value={semanaSeleccionada}
            onChange={(e) => setSemanaSeleccionada(e.target.value)}
            className="px-10 py-1.5 ml-2 rounded-lg bg-black text-white font-bold text-s min-w-[120px]"
          >
            {semanas.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <span className="bg-black text-white rounded-lg px-6 py-1.5 font-bold text-s">
            120 Horas
          </span>
        </div>
      </div>

      {/* Contenidos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ml-6">
        {/* Conceptuales */}
        <div className="bg-white border rounded-2xl shadow p-4 relative">
          <h3 className="font-medium mb-2">Contenidos Conceptuales</h3>
          <textarea
            value={data.conceptual}
            onChange={(e) => onChange({ ...data, conceptual: e.target.value })}
            rows={4}
            className="w-full border rounded-lg p-3 text-base resize-none outline-none"
            placeholder="Escribe aquí los contenidos conceptuales..."
            maxLength={400}
          />
          <p className="text-xs text-gray-500 text-right">
            {data.procedural.length}/400
          </p>
        </div>

        {/* Procedimentales */}
        <div className="bg-white border rounded-2xl shadow p-4 relative">
          <h3 className="font-medium mb-2">Contenidos Procedimentales</h3>
          <textarea
            value={data.procedural}
            onChange={(e) => onChange({ ...data, procedural: e.target.value })}
            rows={4}
            className="w-full border rounded-lg p-3 text-base resize-none outline-none"
            placeholder="Escribe aquí los contenidos procedimentales..."
            maxLength={400}
          />
          <p className="text-xs text-gray-500 text-right">
            {data.procedural.length}/400
          </p>
        </div>
      </div>

      {/* 4.2 Actividades */}
      <div>
        <h4 className="font-bold mb-4 ">4.2. Actividades de Aprendizaje</h4>
        <div className="bg-white border rounded-2xl shadow p-6 ml-7 relative">
          <div className="pt-2 flex flex-col items-center">
            <div className="grid grid-cols-[1fr_auto_auto] gap-x-8 w-full max-w-2xl">
              {actividades.map((actividad) => (
                <div key={actividad.id} className="contents">
                  {/* Nombre */}
                  <input
                    type="text"
                    value={actividad.nombre}
                    onChange={(e) =>
                      handleActividadChange(
                        actividad.id,
                        "nombre",
                        e.target.value
                      )
                    }
                    className="bg-gray-200 rounded-lg px-3 py-2 text-base w-full outline-none my-2"
                  />
                  {/* Selector de horas */}
                  <div className="flex items-center bg-gray-300 rounded-lg px-7 py-2 font-normal text-base text-gray-800 min-w-[80px] justify-between my-2">
                    <span>{actividad.horas} - h</span>
                    <span className="ml-2">
                      <svg
                        width="16"
                        height="16"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <path
                          d="M6 9l6 6 6-6"
                          stroke="#999"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  </div>
                  {/* Botón eliminar */}
                  <div className="flex items-center justify-center my-2">
                    <button
                      type="button"
                      className="bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-full w-9 h-9 flex items-center justify-center text-lg"
                      onClick={() => handleEliminarActividad(actividad.id)}
                    >
                      x
                    </button>
                  </div>
                </div>
              ))}
              {/* Botón agregar */}
              <div></div>
              <div></div>
              <div className="flex items-center justify-center my-2">
                <button
                  type="button"
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-full w-9 h-9 flex items-center justify-center text-lg"
                  onClick={handleAgregarActividad}
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
