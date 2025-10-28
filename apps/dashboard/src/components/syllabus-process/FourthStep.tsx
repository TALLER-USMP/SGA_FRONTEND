import { useState, useEffect, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import {
  useGetProgramacion,
  useCreateProgramacion,
  useUpdateProgramacion,
} from "../../hooks/api/FourthStepQuery";
import { WeekSelector } from "../common/WeekSelector";
import { UnitSelector } from "../common/UnitSelector";
import { LearningActivities } from "../common/LearningActivities";

interface Unidad {
  numero: number;
  titulo: string;
  semanaInicio: number;
  semanaFin: number;
  contenidosConceptuales: string;
  contenidosProcedimentales: string;
}

interface Semana {
  numeroSemana: number;
  horasDisponibles: number;
  unidadNumero: number;
}

interface ActividadGuardada {
  semanaNumero: number;
  nombreActividad: string;
  horasAsignadas: 1 | 2 | 3;
}

interface ActividadEditable {
  id: number;
  nombre: string;
  horas: 1 | 2 | 3;
}

interface LocalProgramacion {
  [semana: number]: ActividadEditable[];
}

export const FourthStep: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const asignaturaId = searchParams.get("asignaturaId") || "1";
  const programacionId = searchParams.get("id");

  const { data, isLoading, error } = useGetProgramacion(asignaturaId);
  const { mutate: create, isPending: isCreating } = useCreateProgramacion();
  const { mutate: update, isPending: isUpdating } = useUpdateProgramacion();

  const [unidadSel, setUnidadSel] = useState<string>("");
  const [semanaSel, setSemanaSel] = useState<string>("");
  const [conceptuales, setConceptuales] = useState("");
  const [procedimentales, setProcedimentales] = useState("");
  const [programacionLocal, setProgramacionLocal] = useState<LocalProgramacion>(
    {},
  );

  // === VALIDACIONES ===
  const errores = useMemo(() => {
    const errs: string[] = [];

    if (conceptuales.trim() === "")
      errs.push("Contenidos conceptuales requeridos");
    if (conceptuales.length > 400)
      errs.push("Conceptuales: máx. 400 caracteres");

    if (procedimentales.trim() === "")
      errs.push("Contenidos procedimentales requeridos");
    if (procedimentales.length > 400)
      errs.push("Procedimentales: máx. 400 caracteres");

    Object.values(programacionLocal).forEach((acts: ActividadEditable[]) => {
      acts.forEach((a: ActividadEditable) => {
        if (a.nombre.trim() === "") {
          errs.push(`Actividad vacía en semana ${a.id}`);
        }
      });
    });

    return errs;
  }, [conceptuales, procedimentales, programacionLocal]);

  const esValido = useMemo(() => {
    if (!data) return false;

    const horasOk = data.semanas.every((s: Semana) => {
      const acts = programacionLocal[s.numeroSemana] || [];
      const usadas = acts.reduce(
        (sum: number, a: ActividadEditable) => sum + a.horas,
        0,
      );
      return usadas === s.horasDisponibles;
    });

    return horasOk && errores.length === 0;
  }, [data, programacionLocal, errores]);

  // Carga inicial
  useEffect(() => {
    if (!data || unidadSel) return;

    const primera = data.unidades[0]!;
    setUnidadSel(String(primera.numero));
    setConceptuales(primera.contenidosConceptuales || "");
    setProcedimentales(primera.contenidosProcedimentales || "");

    const map: LocalProgramacion = {};
    let nextId = 1;
    data.programacionGuardada.forEach((p: ActividadGuardada) => {
      if (!map[p.semanaNumero]) map[p.semanaNumero] = [];
      map[p.semanaNumero].push({
        id: nextId++,
        nombre: p.nombreActividad,
        horas: p.horasAsignadas,
      });
    });
    setProgramacionLocal(map);
  }, [data, unidadSel]);

  const semanasFiltradas = useMemo((): Semana[] => {
    if (!data || !unidadSel) return [];
    const unidad = data.unidades.find(
      (u: Unidad) => u.numero === Number(unidadSel),
    );
    if (!unidad) return [];
    return data.semanas.filter(
      (s: Semana) =>
        s.numeroSemana >= unidad.semanaInicio &&
        s.numeroSemana <= unidad.semanaFin,
    );
  }, [data, unidadSel]);

  useEffect(() => {
    if (!data || !unidadSel) return;
    const unidad = data.unidades.find(
      (u: Unidad) => u.numero === Number(unidadSel),
    );
    if (unidad) {
      setConceptuales(unidad.contenidosConceptuales || "");
      setProcedimentales(unidad.contenidosProcedimentales || "");
    }
  }, [unidadSel, data]);

  useEffect(() => {
    if (semanasFiltradas.length > 0 && !semanaSel) {
      setSemanaSel(String(semanasFiltradas[0].numeroSemana));
    } else if (
      semanaSel &&
      !semanasFiltradas.some(
        (s: Semana) => s.numeroSemana === Number(semanaSel),
      )
    ) {
      setSemanaSel("");
    }
  }, [semanasFiltradas, semanaSel]);

  const semanaActual = data?.semanas.find(
    (s: Semana) => s.numeroSemana === Number(semanaSel),
  );
  const horasDisponibles = semanaActual?.horasDisponibles || 0;
  const actividadesSemana = programacionLocal[Number(semanaSel)] || [];

  const handleSiguiente = () => {
    if (!esValido) {
      errores.forEach((err) => toast.error(err, { duration: 4000 }));
      toast.error("Completa todos los campos y horas", {
        duration: 5000,
        icon: "Warning",
      });
      return;
    }

    const programacionFinal = Object.entries(programacionLocal).flatMap(
      ([semana, acts]: [string, ActividadEditable[]]) =>
        acts.map((a) => ({
          semanaNumero: Number(semana),
          nombreActividad: a.nombre.trim(),
          horasAsignadas: a.horas,
        })),
    );

    const payload = {
      asignaturaId,
      unidades: data!.unidades.map((u: Unidad) => ({
        ...u,
        contenidosConceptuales:
          u.numero === Number(unidadSel)
            ? conceptuales.trim()
            : u.contenidosConceptuales,
        contenidosProcedimentales:
          u.numero === Number(unidadSel)
            ? procedimentales.trim()
            : u.contenidosProcedimentales,
      })),
      semanas: data!.semanas,
      programacionGuardada: programacionFinal,
    };

    const loadingToast = toast.loading("Guardando programación...");

    if (programacionId) {
      update(
        { id: programacionId, payload },
        {
          onSuccess: () => {
            toast.dismiss(loadingToast);
            toast.success("¡Programación actualizada!", { duration: 3000 });
            navigate(`/syllabus/step5?asignaturaId=${asignaturaId}`);
          },
          onError: () => {
            toast.dismiss(loadingToast);
            toast.error("Error al actualizar");
          },
        },
      );
    } else {
      create(payload, {
        onSuccess: (res: { id: string }) => {
          toast.dismiss(loadingToast);
          toast.success("¡Programación creada!", { duration: 3000 });
          navigate(`/syllabus/step5?asignaturaId=${asignaturaId}&id=${res.id}`);
        },
        onError: () => {
          toast.dismiss(loadingToast);
          toast.error("Error al crear");
        },
      });
    }
  };

  useEffect(() => {
    if (isLoading) toast.loading("Cargando...", { id: "load" });
    else toast.dismiss("load");
  }, [isLoading]);

  useEffect(() => {
    if (error) toast.error("Error al cargar datos", { duration: 5000 });
  }, [error]);

  if (isLoading)
    return <div className="p-8 text-center text-lg">Cargando...</div>;
  if (error || !data)
    return (
      <div className="p-8 text-red-600 text-center">Error al cargar datos</div>
    );

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="p-8 max-w-6xl mx-auto ml-4">
        <div className="mb-10">
          <h3 className="text-xl font-semibold mb-4">4. Unidades</h3>
          <UnitSelector
            value={unidadSel}
            onChange={setUnidadSel}
            unidades={data.unidades.map((u: Unidad) => ({
              numero: u.numero,
              titulo: u.titulo,
            }))}
          />
        </div>

        {unidadSel && (
          <>
            <div className="mb-10">
              <h3 className="text-xl font-semibold mb-6">4.1 Semanas</h3>

              <div className="flex justify-between items-center mb-8">
                <WeekSelector
                  value={semanaSel}
                  onChange={setSemanaSel}
                  semanas={semanasFiltradas}
                />
                <div className="bg-black text-white px-8 py-3 rounded-full font-medium text-base">
                  {horasDisponibles} Horas
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contenidos conceptuales{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={conceptuales}
                    onChange={(e) =>
                      setConceptuales(e.target.value.slice(0, 400))
                    }
                    className={`w-full p-4 border rounded-lg resize-none focus:ring-2 focus:ring-blue-500 ${
                      conceptuales.trim() === "" || conceptuales.length > 400
                        ? "border-red-500"
                        : ""
                    }`}
                    rows={5}
                    placeholder="Requerido. Máx. 400 caracteres"
                  />
                  <p
                    className={`text-xs text-right mt-1 ${conceptuales.length > 400 ? "text-red-500" : "text-gray-500"}`}
                  >
                    {conceptuales.length}/400
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contenidos procedimentales{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={procedimentales}
                    onChange={(e) =>
                      setProcedimentales(e.target.value.slice(0, 400))
                    }
                    className={`w-full p-4 border rounded-lg resize-none focus:ring-2 focus:ring-blue-500 ${
                      procedimentales.trim() === "" ||
                      procedimentales.length > 400
                        ? "border-red-500"
                        : ""
                    }`}
                    rows={5}
                    placeholder="Requerido. Máx. 400 caracteres"
                  />
                  <p
                    className={`text-xs text-right mt-1 ${procedimentales.length > 400 ? "text-red-500" : "text-gray-500"}`}
                  >
                    {procedimentales.length}/400
                  </p>
                </div>
              </div>
            </div>

            {semanaSel && (
              <div className="mb-12">
                <h3 className="text-xl font-semibold mb-6">
                  4.2 Actividades de Aprendizaje
                </h3>
                <div className="border rounded-lg p-6 bg-white">
                  <LearningActivities
                    actividades={actividadesSemana}
                    onChange={(acts) => {
                      setProgramacionLocal((prev) => ({
                        ...prev,
                        [Number(semanaSel)]: acts,
                      }));
                    }}
                    horasDisponibles={horasDisponibles}
                  />
                </div>
              </div>
            )}
          </>
        )}

        <div className="flex justify-between items-center pt-8 border-t">
          <button
            onClick={() => navigate(-1)}
            className="px-8 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition text-base"
          >
            Atrás
          </button>
          <button
            onClick={handleSiguiente}
            disabled={!esValido || isCreating || isUpdating}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg disabled:opacity-50 hover:bg-blue-700 transition text-base"
          >
            {isCreating || isUpdating ? "Guardando..." : "Siguiente"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FourthStep;
