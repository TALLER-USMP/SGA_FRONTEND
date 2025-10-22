// src/components/syllabus-process/FourthStep.tsx
import { useSteps } from "../../contexts/StepsContext";
import { Step } from "../common/Step";
import { useEffect, useState } from "react";

type Unidad = {
  id: number;
  numero: number;
  titulo: string;
};

type Semana = {
  id: number;
  semana: number;
  horas_disponibles: number;
};

type Actividad = { nombre: string; horas: number };

type DatosSemana = {
  contenidos_conceptuales: string;
  contenidos_procedimentales: string;
  actividades: Actividad[];
};

type FourthStepProps = {
  syllabusId?: number; // Prop opcional
};

export default function FourthStep({ syllabusId }: FourthStepProps) {
  const { nextStep } = useSteps();

  const [unidades, setUnidades] = useState<Unidad[]>([]);
  const [unidadSeleccionada, setUnidadSeleccionada] = useState<number | null>(
    null,
  );

  const [semanas, setSemanas] = useState<Semana[]>([]);
  const [semanaSeleccionada, setSemanaSeleccionada] = useState<number | null>(
    null,
  );

  const [horasDisponibles, setHorasDisponibles] = useState<number>(0);

  // Datos locales de todas las semanas por unidad
  const [datosLocales, setDatosLocales] = useState<Record<string, DatosSemana>>(
    {},
  );

  // Campos editables
  const [conceptual, setConceptual] = useState("");
  const [procedimental, setProcedimental] = useState("");
  const [actividades, setActividades] = useState<Actividad[]>([]);

  const [, setLoading] = useState<boolean>(false);

  // 🔹 Usar prop o fallback temporal
  const syllabusIdFinal = syllabusId || 8;

  // ------------------------------------------------------------
  // 🔹 Cargar unidades al montar
  // ------------------------------------------------------------
  useEffect(() => {
    const fetchUnidades = async () => {
      try {
        const res = await fetch(
          `http://localhost:7071/api/programacion-contenidos/${syllabusIdFinal}`,
        );
        const data = await res.json();
        setUnidades(data.unidades || []);
      } catch (err) {
        console.error("Error cargando unidades:", err);
      }
    };
    fetchUnidades();
  }, [syllabusIdFinal]);

  // ------------------------------------------------------------
  // 🔹 Cambiar unidad seleccionada
  // ------------------------------------------------------------
  useEffect(() => {
    if (!unidadSeleccionada) return;

    // Guardar cambios en la semana anterior
    if (semanaSeleccionada !== null) {
      const key = `${unidadSeleccionada}-${semanaSeleccionada}`;
      setDatosLocales({
        ...datosLocales,
        [key]: {
          contenidos_conceptuales: conceptual,
          contenidos_procedimentales: procedimental,
          actividades,
        },
      });
    }

    // Cargar semanas para la unidad seleccionada
    const fetchSemanas = async () => {
      try {
        const res = await fetch(
          `http://localhost:7071/api/programacion-contenidos/${syllabusIdFinal}?unidadId=${unidadSeleccionada}`,
        );
        const data = await res.json();
        setSemanas(data.semanas || []);
        setSemanaSeleccionada(null);
        setConceptual("");
        setProcedimental("");
        setActividades([]);
        setHorasDisponibles(0);
      } catch (err) {
        console.error("Error cargando semanas:", err);
      }
    };
    fetchSemanas();
  }, [unidadSeleccionada]);

  // ------------------------------------------------------------
  // 🔹 Cambiar semana seleccionada
  // ------------------------------------------------------------
  useEffect(() => {
    if (!unidadSeleccionada || !semanaSeleccionada) return;

    // Guardar datos de la semana anterior
    if (semanaSeleccionada !== null) {
      const key = `${unidadSeleccionada}-${semanaSeleccionada}`;
      const prev = datosLocales[key];
      if (prev) {
        setConceptual(prev.contenidos_conceptuales);
        setProcedimental(prev.contenidos_procedimentales);
        setActividades(prev.actividades);
        const semana = semanas.find((s) => s.semana === semanaSeleccionada);
        setHorasDisponibles(semana?.horas_disponibles || 0);
      } else {
        const semana = semanas.find((s) => s.semana === semanaSeleccionada);
        setHorasDisponibles(semana?.horas_disponibles || 0);
        setConceptual("");
        setProcedimental("");
        setActividades([]);
      }
    }
  }, [semanaSeleccionada]);

  // ------------------------------------------------------------
  // 🔹 Guardar datos en backend al hacer click en "Siguiente"
  // ------------------------------------------------------------
  const handleNextStep = async () => {
    try {
      setLoading(true);

      // Guardar la semana actual en local
      if (unidadSeleccionada && semanaSeleccionada !== null) {
        const key = `${unidadSeleccionada}-${semanaSeleccionada}`;
        setDatosLocales({
          ...datosLocales,
          [key]: {
            contenidos_conceptuales: conceptual,
            contenidos_procedimentales: procedimental,
            actividades,
          },
        });
      }

      // Transformar los datos locales a un array para enviar al backend
      const payload = Object.entries(datosLocales).map(([key, datos]) => {
        const [unidadIdStr, semanaStr] = key.split("-");
        return {
          unidad_id: Number(unidadIdStr),
          semana: Number(semanaStr),
          contenidos_conceptuales: datos.contenidos_conceptuales,
          contenidos_procedimentales: datos.contenidos_procedimentales,
          actividades_aprendizaje: JSON.stringify(datos.actividades),
        };
      });

      await fetch(`http://localhost:7071/api/programacion-contenidos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ syllabusId: syllabusIdFinal, data: payload }),
      });

      nextStep();
    } catch (err) {
      console.error("Error guardando programación:", err);
    } finally {
      setLoading(false);
    }
  };

  // ------------------------------------------------------------
  // 🔹
  // ------------------------------------------------------------
  return (
    <Step step={4} onNextStep={handleNextStep}>
      <div className="bg-white rounded-lg p-6 text-[#1E1E1E]">
        {/* Unidades */}
        <div className="mb-6">
          <h2 className="text-lg font-bold mb-2 text-left">4. Unidades</h2>
          <select
            value={unidadSeleccionada || ""}
            onChange={(e) => setUnidadSeleccionada(Number(e.target.value))}
            className="border border-gray-300 rounded-md px-3 py-2 w-full text-sm"
          >
            <option value="">Selecciona una unidad</option>
            {unidades.map((u) => (
              <option key={u.id} value={u.id}>
                {`Unidad ${u.numero}: ${u.titulo}`}
              </option>
            ))}
          </select>
        </div>

        {/* Semanas */}
        <div className="mb-6">
          <h2 className="text-lg font-bold mb-2 text-left">4.1 Semanas</h2>
          <div className="flex flex-col lg:flex-row justify-between items-start gap-6">
            <div className="flex flex-col gap-1 w-auto">
              <label className="text-sm font-semibold text-gray-700 text-left">
                Selecciona una semana
              </label>
              <select
                value={semanaSeleccionada || ""}
                onChange={(e) => setSemanaSeleccionada(Number(e.target.value))}
                className="border border-gray-300 rounded-md px-3 py-2 bg-black text-white text-sm w-auto"
              >
                <option value="">Selecciona</option>
                {semanas.map((s) => (
                  <option key={s.id} value={s.semana}>
                    Semana {s.semana}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1 items-end">
              <span className="text-sm font-medium text-gray-600">
                Horas disponibles
              </span>
              <div className="bg-black text-white rounded-md px-4 py-2 font-semibold text-sm">
                {horasDisponibles} Horas
              </div>
            </div>
          </div>

          {/* Contenidos */}
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
        </div>

        {/* Actividades */}
        <div className="mb-6">
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
                    const newActs = [...actividades];
                    newActs[i].nombre = e.target.value;
                    setActividades(newActs);
                  }}
                  placeholder="Nombre de la actividad"
                  className="bg-transparent flex-1 px-2 text-sm text-gray-800 outline-none"
                />
                <div className="flex items-center gap-2">
                  <select
                    value={act.horas}
                    className="bg-gray-100 rounded-full text-sm font-semibold px-2 py-1"
                    onChange={(e) => {
                      const newActs = [...actividades];
                      newActs[i].horas = Number(e.target.value);
                      setActividades(newActs);
                    }}
                  >
                    {[1, 2, 3, 4, 5].map((h) => (
                      <option key={h} value={h}>
                        {h}h
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() =>
                      setActividades(actividades.filter((_, idx) => idx !== i))
                    }
                    className="text-red-500 font-bold px-2"
                  >
                    X
                  </button>
                </div>
              </div>
            ))}

            <div className="flex justify-end mt-4">
              <button
                onClick={() =>
                  setActividades([...actividades, { nombre: "", horas: 1 }])
                }
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
