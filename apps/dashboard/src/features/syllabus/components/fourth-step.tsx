import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { useSteps } from "../contexts/steps-context-provider";
import { useSyllabusContext } from "../contexts/syllabus-context";
import {
  useGetProgramacion,
  useCreateProgramacion,
  useUpdateProgramacion,
} from "../hooks/fourth-step-query";
import type {
  CreateProgramacionBody,
  UpdateProgramacionBody,
  ProgramacionResponse,
} from "../hooks/fourth-step-query";
import { UnitSelector } from "../../../common/unit-selector";
import { WeekSelector } from "../../../common/week-selector";
import { Step } from "./step";
import { LearningActivities } from "../../../common/learning-activities";
import type { ActividadEditable } from "../../../common/learning-activities";

interface Unidad {
  id?: string | number;
  numero?: number;
  titulo?: string;
  semanaInicio?: number;
  semanaFin?: number;
  semanas?: Array<{ numeroSemana: number; horasDisponibles?: number }>;
  contenidosConceptuales?: string;
  contenidosProcedimentales?: string;
  actividadesAprendizaje?: string[] | string;
  horasLectivasTeoria?: number;
  horasLectivasPractica?: number;
  horasNoLectivasTeoria?: number;
  horasNoLectivasPractica?: number;
  [key: string]: unknown;
}
// Tipo para datos por semana
interface DatosPorSemana {
  contenidosConceptuales: string;
  contenidosProcedimentales: string;
  actividadesAprendizaje: string[];
}

const FourthStep: React.FC = () => {
  const { cursoCodigo, syllabusId, mode } = useSyllabusContext();
  const [searchParams, setSearchParams] = useSearchParams();
  const silaboId = syllabusId ? Number(syllabusId) : 0;
  const { data, isLoading } = useGetProgramacion(cursoCodigo ?? "");
  const createProgramacion = useCreateProgramacion();
  const updateProgramacion = useUpdateProgramacion();
  const [selectedUnidad, setSelectedUnidad] = useState<number | null>(null);
  const [selectedSemana, setSelectedSemana] = useState<string>("");
  const [programacionForm, setProgramacionForm] = useState<
    Partial<ProgramacionResponse>
  >({});

  // Estado para almacenar cambios locales por semana

  const [cambiosLocales, setCambiosLocales] = useState<
    Record<string, DatosPorSemana>
  >({});

  const getSemanaKey = (unidad: number, semana: string) => {
    return `unidad_${unidad}_semana_${semana}`;
  };

  // Función para guardar datos locales de la semana actual
  const guardarDatosLocales = () => {
    if (!selectedUnidad || !selectedSemana) return;

    const unidadForm = programacionForm as Unidad;
    const key = getSemanaKey(selectedUnidad, selectedSemana);

    const actividadesArray = Array.isArray(unidadForm.actividadesAprendizaje)
      ? unidadForm.actividadesAprendizaje
      : typeof unidadForm.actividadesAprendizaje === "string"
        ? unidadForm.actividadesAprendizaje
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : [];

    setCambiosLocales((prev) => ({
      ...prev,
      [key]: {
        contenidosConceptuales: unidadForm.contenidosConceptuales || "",
        contenidosProcedimentales: unidadForm.contenidosProcedimentales || "",
        actividadesAprendizaje: actividadesArray,
      },
    }));
  };

  // Función para cargar datos locales de una semana
  const cargarDatosLocales = (unidad: number, semana: string) => {
    const key = getSemanaKey(unidad, semana);
    const datosGuardados = cambiosLocales[key];

    if (datosGuardados) {
      setProgramacionForm((prev) => ({
        ...prev,
        contenidosConceptuales: datosGuardados.contenidosConceptuales,
        contenidosProcedimentales: datosGuardados.contenidosProcedimentales,
        actividadesAprendizaje: datosGuardados.actividadesAprendizaje,
      }));
      return true;
    }
    return false;
  };

  useEffect(() => {
    if (Array.isArray(data) && data.length) {
      const first = data[0] as Unidad;
      setProgramacionForm(first);
      const num = Number(first.numero) || 1;
      setSelectedUnidad(num);
      setSelectedSemana(String(first.semanaInicio ?? ""));
    }
  }, [data]);

  // Si estamos en modo create pero el GET ya devolvió datos,
  // cambiamos automáticamente a modo edit y, si es posible, establecemos el id en la URL
  useEffect(() => {
    if (mode === "create" && Array.isArray(data) && data.length > 0) {
      const currentMode = searchParams.get("mode");
      const existingIdParam = searchParams.get("id");
      const derivedSyllabusId =
        syllabusId || (data[0] && (data[0] as ProgramacionResponse).silaboId);

      if (currentMode !== "edit") {
        const newParams: Record<string, string> = {
          codigo: cursoCodigo ?? "",
          mode: "edit",
        };
        if (derivedSyllabusId) newParams.id = String(derivedSyllabusId);
        setSearchParams(newParams);
        toast.info(
          "Se encontró programación existente. Cambiamos a modo edición.",
        );
      } else if (!existingIdParam && derivedSyllabusId) {
        // Si ya estamos en edit pero no hay id en la URL y lo podemos inferir
        setSearchParams({
          codigo: cursoCodigo ?? "",
          id: String(derivedSyllabusId),
          mode: "edit",
        });
      }
    }
  }, [mode, data, syllabusId, cursoCodigo, searchParams, setSearchParams]);
  // Efecto para cambiar de unidad
  useEffect(() => {
    if (!Array.isArray(data) || !selectedUnidad) return;
    const unit = data.find(
      (d: Unidad) => Number(d.numero) === Number(selectedUnidad),
    );
    if (unit) {
      setProgramacionForm(unit);
      if (unit.semanaInicio) setSelectedSemana(String(unit.semanaInicio));
    }
  }, [selectedUnidad, data]);

  // Efecto para guardar y cargar datos al cambiar de semana
  useEffect(() => {
    if (!selectedUnidad || !selectedSemana) return;

    // Intentar cargar datos locales primero
    const tieneLocal = cargarDatosLocales(selectedUnidad, selectedSemana);

    // Si no hay datos locales, cargar desde la unidad actual
    if (!tieneLocal && Array.isArray(data)) {
      const unit = data.find(
        (d: Unidad) => Number(d.numero) === Number(selectedUnidad),
      );
      if (unit) {
        setProgramacionForm(unit);
      }
    }
  }, [selectedSemana, selectedUnidad]);
  const allSemanas: Array<{
    numeroSemana: number;
    horasDisponibles?: number;
    unidadNumero?: number;
  }> = (() => {
    if (!data) return [];
    if (Array.isArray(data)) {
      const collected = data.flatMap(
        (d: Unidad) =>
          (d.semanas ?? []) as {
            numeroSemana: number;
            horasDisponibles?: number;
          }[],
      );
      if (collected && collected.length) return collected;
      return [];
    }
    const maybe = data as unknown as {
      semanas?: Array<{ numeroSemana: number; horasDisponibles?: number }>;
    };
    if (maybe.semanas) return maybe.semanas;
    return [];
  })();
  // Mapping fijo de unidades -> rango de semanas solicitado
  const unitWeekRanges: Record<number, [number, number]> = {
    1: [1, 4],
    2: [5, 8],
    3: [9, 12],
    4: [13, 16],
  };
  const weeksForSelectedUnit = (() => {
    if (!selectedUnidad) return [] as number[];
    const range = unitWeekRanges[selectedUnidad];
    if (!range) return [] as number[];
    const arr: number[] = [];
    for (let i = range[0]; i <= range[1]; i++) arr.push(i);
    return arr;
  })();
  const horasDisponiblesForSelectedWeek = (() => {
    const weekNum = Number(selectedSemana);
    if (!weekNum) return 0;
    const found = allSemanas.find((s) => Number(s.numeroSemana) === weekNum);
    if (found && typeof found.horasDisponibles === "number")
      return found.horasDisponibles;

    const unidad = programacionForm as Unidad;
    const sum =
      Number(unidad.horasLectivasTeoria ?? 0) +
      Number(unidad.horasLectivasPractica ?? 0) +
      Number(unidad.horasNoLectivasTeoria ?? 0) +
      Number(unidad.horasNoLectivasPractica ?? 0);

    const range = unitWeekRanges[Number(unidad.numero)] || [0, 0];
    const weeksCount = Math.max(1, range[1] - range[0] + 1);
    return Math.floor(sum / weeksCount);
  })();
  const { nextStep } = useSteps();

  const handleSave = async () => {
    try {
      // Validar que exista silaboId (se necesita para POST/PUT correctos)
      if (!silaboId || Number.isNaN(silaboId)) {
        toast.error(
          "Id del sílabo no encontrado. Completa el primer paso antes de continuar.",
        );
        return;
      }

      // Primero guardar los datos de la semana actual
      guardarDatosLocales();

      const unidadesConCambios = new Set<number>();

      // Identificar qué unidades tienen cambios
      Object.keys(cambiosLocales).forEach((key) => {
        const match = key.match(/unidad_(\d+)_semana_(\d+)/);
        if (match) {
          unidadesConCambios.add(Number(match[1]));
        }
      });

      // Determinar si debemos crear o actualizar según el modo y existencia de datos
      const hasProgramacion = Array.isArray(data) && data.length > 0;
      // Guía del paso 2 (sumilla):
      // - En modo "edit": GET + PUT siempre.
      // - En modo "create": hacer GET; si no retorna nada => POST; si retorna algo => PUT.
      const shouldCreate = mode === "create" && !hasProgramacion;

      // Por cada unidad, consolidar los cambios de todas sus semanas
      for (const numeroUnidad of Array.from(unidadesConCambios)) {
        const unidadData = Array.isArray(data)
          ? data.find((u: Unidad) => Number(u.numero) === numeroUnidad)
          : null;

        if (!unidadData) continue;

        const unidad = unidadData as Unidad;
        const range = unitWeekRanges[numeroUnidad];

        if (!range) continue;

        // Consolidar todas las actividades de todas las semanas de esta unidad
        const todasLasActividades: string[] = [];
        const contenidosConceptuales: string[] = [];
        const contenidosProcedimentales: string[] = [];

        for (let semana = range[0]; semana <= range[1]; semana++) {
          const key = getSemanaKey(numeroUnidad, String(semana));
          const datosSemana = cambiosLocales[key];

          if (datosSemana) {
            if (datosSemana.contenidosConceptuales) {
              contenidosConceptuales.push(datosSemana.contenidosConceptuales);
            }
            if (datosSemana.contenidosProcedimentales) {
              contenidosProcedimentales.push(
                datosSemana.contenidosProcedimentales,
              );
            }
            if (datosSemana.actividadesAprendizaje.length > 0) {
              todasLasActividades.push(...datosSemana.actividadesAprendizaje);
            }
          }
        }

        // Crear el string de actividades
        const actividadesString =
          todasLasActividades.length > 0
            ? todasLasActividades.join(" , ")
            : undefined;

        // Preparar el payload
        // Construir payloads comunes
        const updatePayload: Partial<UpdateProgramacionBody> = {
          silaboId,
          numero: numeroUnidad,
          titulo: unidad.titulo,
          capacidadesText: unidad.capacidadesText as string | undefined,
          semanaInicio: range[0],
          semanaFin: range[1],
          contenidosConceptuales:
            contenidosConceptuales.join("\n\n") ||
            unidad.contenidosConceptuales,

          contenidosProcedimentales:
            contenidosProcedimentales.join("\n\n") ||
            unidad.contenidosProcedimentales,
          actividadesAprendizaje: actividadesString,
          horasLectivasTeoria: unidad.horasLectivasTeoria,
          horasLectivasPractica: unidad.horasLectivasPractica,
          horasNoLectivasTeoria: unidad.horasNoLectivasTeoria,
          horasNoLectivasPractica: unidad.horasNoLectivasPractica,
        };
        const createBody: CreateProgramacionBody = {
          silaboId,
          numero: numeroUnidad,
          titulo: unidad.titulo || `Unidad ${numeroUnidad}`,
          capacidadesText: unidad.capacidadesText as string | undefined,
          semanaInicio: range[0],
          semanaFin: range[1],
          contenidosConceptuales:
            contenidosConceptuales.join("\n\n") || undefined,
          contenidosProcedimentales:
            contenidosProcedimentales.join("\n\n") || undefined,
          actividadesAprendizaje: actividadesString,
          horasLectivasTeoria: unidad.horasLectivasTeoria,
          horasLectivasPractica: unidad.horasLectivasPractica,
          horasNoLectivasTeoria: unidad.horasNoLectivasTeoria,
          horasNoLectivasPractica: unidad.horasNoLectivasPractica,
        };

        if (shouldCreate) {
          // Modo create y GET vacío: POST
          await createProgramacion.mutateAsync(createBody);
        } else {
          // Modo edit, o create con GET con datos: PUT
          if (unidad.id) {
            await updateProgramacion.mutateAsync({
              id: String(unidad.id),
              payload: updatePayload,
            });
          } else {
            // No hay id para actualizar: fallback seguro a crear y advertir
            toast.warning(
              `No se encontró registro para la Unidad ${numeroUnidad}. Se creará uno nuevo.`,
            );
            await createProgramacion.mutateAsync(createBody);
          }
        }
      }

      // Limpiar cambios locales después de guardar exitosamente
      setCambiosLocales({});

      nextStep();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Error guardando programación",
      );
    }
  };

  const handleSemanaChange = (nuevaSemana: string) => {
    guardarDatosLocales();

    setSelectedSemana(nuevaSemana);
  };

  const handleUnidadChange = (nuevaUnidad: number | null) => {
    if (nuevaUnidad === null) return;

    guardarDatosLocales();

    setSelectedUnidad(nuevaUnidad);
  };

  if (isLoading) return <div>Cargando...</div>;
  return (
    <Step step={4} onNextStep={handleSave}>
      <div className="mb-4 w-full">
        <h2 className="text-lg font-bold text-left w-full">4. Unidades</h2>
        <UnitSelector
          value={selectedUnidad}
          onChange={handleUnidadChange}
          options={
            Array.isArray(data)
              ? data.map((u) => ({
                  value: Number((u as Unidad).numero) || 0,
                  label:
                    (u as Unidad).titulo || `Unidad ${(u as Unidad).numero}`,
                }))
              : []
          }
        />
      </div>
      <div className="mt-2 w-full">
        <h3 className="text-lg font-bold text-left w-full">4.1 Semanas</h3>
      </div>
      <div className="flex items-center gap-4">
        <div>
          <WeekSelector
            value={selectedSemana}
            onChange={handleSemanaChange}
            semanas={weeksForSelectedUnit.map((n) => ({ numeroSemana: n }))}
            className="min-w-[150px] px-4 py-2 text-sm"
          />
        </div>
        <div className="ml-auto text-sm">
          <div className="text-gray-500">Horas disponibles</div>
          <div className="text-lg font-semibold">
            {horasDisponiblesForSelectedWeek} h
          </div>
        </div>
      </div>
      {/* Contenidos conceptuales y procedimentales */}
      <div className="mt-4 flex gap-4">
        <div className="w-1/2">
          <label className="block text-sm font-medium">
            Contenidos conceptuales
          </label>
          <textarea
            maxLength={400}
            value={(programacionForm as Unidad).contenidosConceptuales ?? ""}
            onChange={(e) =>
              setProgramacionForm((prev) => ({
                ...prev,
                contenidosConceptuales: e.target.value,
              }))
            }
            className="w-full p-2 border rounded"
            rows={6}
          />
          <div className="text-xs text-gray-500">
            {((programacionForm as Unidad).contenidosConceptuales ?? "").length}
            /400
          </div>
        </div>
        <div className="w-1/2">
          <label className="block text-sm font-medium">
            Contenidos procedimentales
          </label>
          <textarea
            maxLength={400}
            value={(programacionForm as Unidad).contenidosProcedimentales ?? ""}
            onChange={(e) =>
              setProgramacionForm((prev) => ({
                ...prev,
                contenidosProcedimentales: e.target.value,
              }))
            }
            className="w-full p-2 border rounded"
            rows={6}
          />
          <div className="text-xs text-gray-500">
            {
              ((programacionForm as Unidad).contenidosProcedimentales ?? "")
                .length
            }
            /400
          </div>
        </div>
      </div>
      <div className="mt-6 w-full">
        <h3 className="text-lg font-bold text-left w-full">
          4.2 Actividades de Aprendizaje
        </h3>
        {/* Actividades */}
        <div className="mt-4">
          <LearningActivities
            actividades={
              (() => {
                const raw = (programacionForm as Unidad).actividadesAprendizaje;
                if (!raw) return [] as ActividadEditable[];

                const arr: string[] = Array.isArray(raw)
                  ? raw
                  : String(raw)
                      .split(",")
                      .map((s) => s.trim())
                      .filter(Boolean);
                return arr.map((s, i) => ({
                  id: Date.now() + i,
                  nombre: s,
                  horas: 1,
                }));
              })() as ActividadEditable[]
            }
            horasDisponibles={horasDisponiblesForSelectedWeek}
            onChange={(acts: ActividadEditable[]) =>
              setProgramacionForm((prev) => ({
                ...prev,
                actividadesAprendizaje: acts.map((a) => a.nombre),
              }))
            }
            onLimitExceeded={(msg) => {
              toast.error(msg);
            }}
          />
        </div>
      </div>
    </Step>
  );
};
export default FourthStep;
