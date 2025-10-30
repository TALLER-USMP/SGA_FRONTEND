import { useState, useEffect, useMemo } from "react";
import { useSteps } from "../../contexts/StepsContext";
import { useSyllabusContext } from "../../contexts/SyllabusContext";
import { Step } from "../common/Step";
import { useSyllabusGeneral } from "../../hooks/api/FirstStepQuery";
import type { SyllabusGeneral } from "../../hooks/api/FirstStepQuery";

export default function FirstStep() {
  const { nextStep } = useSteps();
  const { syllabusId, setCourseName } = useSyllabusContext();

  const draftKey = syllabusId ? `syllabus:general:${syllabusId}` : null;

  type FormState = {
    nombreAsignatura: string;
    departamentoAcademico: string;
    escuelaProfesional: string;
    programaAcademico: string;
    semestreAcademico: string;
    tipoAsignatura: string;
    tipoEstudios: string | ("general" | "especifica" | "especialidad");
    modalidad: string | ("presencial" | "semipresencial" | "aDistancia");
    codigoAsignatura: string;
    ciclo: string;
    requisitos: string;
    creditosTeoria: string;
    creditosPractica: string;
    creditosTotal: string;
    docentes: string;
    [key: string]:
      | string
      | ("general" | "especifica" | "especialidad")
      | ("presencial" | "semipresencial" | "aDistancia");
  };

  const [form, setForm] = useState<FormState>(() => {
    const base: FormState = {
      nombreAsignatura: "TALLER DE PROYECTOS",
      departamentoAcademico: "",
      escuelaProfesional: "",
      programaAcademico: "",
      semestreAcademico: "",
      tipoAsignatura: "",
      tipoEstudios: "",
      modalidad: "",
      codigoAsignatura: "",
      ciclo: "",
      requisitos: "",
      creditosTeoria: "",
      creditosPractica: "",
      creditosTotal: "",
      docentes: "",
    };
    if (!draftKey) return base;
    try {
      const raw = localStorage.getItem(draftKey);
      if (!raw) return base;
      const draft = JSON.parse(raw) as Partial<FormState> & {
        theoryTotal?: number;
        practiceTotal?: number;
        totalHours?: number;
      };
      return { ...base, ...draft } as FormState;
    } catch {
      return base;
    }
  });

  const [apiError, setApiError] = useState<string>("");

  const [theoryTotal, setTheoryTotal] = useState<number>(0);
  const [practiceTotal, setPracticeTotal] = useState<number>(0);
  const [totalHours, setTotalHours] = useState<number>(0);

  const { data, isLoading, isError, error } = useSyllabusGeneral(syllabusId);

  useEffect(() => {
    if (isError) {
      setApiError(error?.message ?? "Error fetching syllabus");
      return;
    }
    if (!data) return;

    const json: SyllabusGeneral = data;

    const tTheory = Number(json.horasTeoria ?? 0);
    const tPractice = Number(json.horasPractica ?? 0);
    const tTotal = Number(json.horasTotales ?? tTheory + tPractice);
    setTheoryTotal(tTheory);
    setPracticeTotal(tPractice);
    setTotalHours(tTotal);

    // Propagar nombre de asignatura a contexto
    if (json.nombreAsignatura) setCourseName(json.nombreAsignatura);

    // Actualizar form y guardar borrador sin depender de 'form' en deps
    setForm((s) => {
      const next = {
        ...s,
        nombreAsignatura: json.nombreAsignatura ?? s.nombreAsignatura,
        departamentoAcademico:
          json.departamentoAcademico ?? s.departamentoAcademico,
        escuelaProfesional: json.escuelaProfesional ?? s.escuelaProfesional,
        programaAcademico: json.programaAcademico ?? s.programaAcademico,
        semestreAcademico: json.semestreAcademico ?? s.semestreAcademico,
        tipoAsignatura: json.tipoAsignatura ?? s.tipoAsignatura,
        tipoEstudios: json.tipoEstudios ?? s.tipoEstudios,
        modalidad: json.modalidad ?? s.modalidad,
        codigoAsignatura: json.codigoAsignatura ?? s.codigoAsignatura,
        ciclo: json.ciclo ?? s.ciclo,
        requisitos: json.requisitos ?? s.requisitos,
        creditosTeoria:
          json.creditosTeoria != null
            ? String(json.creditosTeoria)
            : s.creditosTeoria,
        creditosPractica:
          json.creditosPractica != null
            ? String(json.creditosPractica)
            : s.creditosPractica,
        creditosTotal:
          json.creditosTotales != null
            ? String(json.creditosTotales)
            : s.creditosTotal,
        docentes: json.docentes ?? s.docentes,
      } as typeof s;

      if (draftKey) {
        try {
          const draft = {
            ...next,
            theoryTotal: tTheory,
            practiceTotal: tPractice,
            totalHours: tTotal,
          } as Record<string, unknown>;
          localStorage.setItem(draftKey, JSON.stringify(draft));
        } catch {
          /* ignore */
        }
      }
      return next;
    });
  }, [data, isError, error, draftKey, setCourseName]);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const fields: Array<[string, string]> = useMemo(
    () => [
      ["Departamento Académico", "departamentoAcademico"],
      ["Escuela Profesional", "escuelaProfesional"],
      ["Programa académico", "programaAcademico"],
      ["Semestre Académico", "semestreAcademico"],
      ["Tipo de asignatura", "tipoAsignatura"],
      ["Tipo de estudios", "tipoEstudios"],
      ["Modalidad de la asignatura", "modalidad"],
      ["Código de la asignatura", "codigoAsignatura"],
      ["Ciclo", "ciclo"],
      ["Requisitos", "requisitos"],
      ["Cantidad de horas", "horas"],
      ["Cantidad de Créditos", "creditos"],
      ["Docente(s)", "docentes"],
    ],
    [],
  );

  const validate = () => {
    const e: Record<string, string> = {};
    const required: Array<keyof FormState> = ["nombreAsignatura"];
    for (const k of required) {
      if (!String(form[k] ?? "").trim()) e[String(k)] = "Campo obligatorio";
    }

    const numericFields: Array<keyof FormState> = [
      "creditosTeoria",
      "creditosPractica",
      "creditosTotal",
    ];
    for (const k of numericFields) {
      const v = String(form[k] ?? "").trim();
      if (v && isNaN(Number(v))) e[String(k)] = "Debe ser un número";
    }

    if (!form.tipoEstudios)
      e.tipoEstudios = e.tipoEstudios ?? "Selecciona un tipo de estudios";
    if (!form.modalidad) e.modalidad = e.modalidad ?? "Selecciona modalidad";

    setErrors(e);
    return e;
  };

  const validateAndNext = () => {
    const e = validate();
    if (Object.keys(e).length > 0) {
      const firstKey = Object.keys(e)[0];
      const el = document.querySelector(
        `[name="${firstKey}"]`,
      ) as HTMLElement | null;
      if (el && typeof el.focus === "function") el.focus();
      return;
    }

    // Guardar borrador como un solo JSON (opcional, no bloqueante)
    if (draftKey) {
      try {
        const name =
          String(form.nombreAsignatura ?? "").trim() || "TALLER DE PROYECTOS";
        const draft = {
          ...form,
          nombreAsignatura: name,
          theoryTotal,
          practiceTotal,
          totalHours,
        };
        localStorage.setItem(draftKey, JSON.stringify(draft));
      } catch {
        // ignore
      }
    }

    // TanStack Query en SecondStep se encargará automáticamente del fetch
    nextStep();
  };

  return (
    <Step step={1} onNextStep={validateAndNext}>
      <div className="bg-white rounded-md overflow-visible shadow-sm">
        <div className="bg-white px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="text-lg font-bold text-black">1.</div>
            <h2 className="text-lg font-semibold text-black">
              Datos Generales
            </h2>
            <div className="ml-2 w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
              i
            </div>
          </div>
        </div>
        <div className="p-6">
          {isLoading && (
            <div className="mb-4 text-sm text-gray-700">
              Cargando datos generales...
            </div>
          )}
          {apiError && (
            <div className="mb-4 text-sm text-red-600">
              Error cargando datos: {apiError}
            </div>
          )}
          <div className="mb-6">
            <div className="w-full h-12 rounded-md px-4 flex items-center text-lg bg-blue-50 border border-blue-100">
              {form.nombreAsignatura || "TALLER DE PROYECTOS"}
            </div>
            {errors["nombreAsignatura"] && (
              <div className="text-red-600 text-sm mt-1">
                {errors["nombreAsignatura"]}
              </div>
            )}
          </div>

          <div className="grid gap-4">
            {fields.map(([label, name]) => (
              <div
                key={name}
                className="grid grid-cols-[250px_24px_1fr] items-start gap-2 py-2 border-b last:border-b-0"
              >
                <div className="text-sm text-gray-700 flex items-center">
                  <div className="px-3 py-2 bg-gray-100 border border-gray-300 rounded w-full text-center">
                    {label}
                  </div>
                </div>
                <div className="text-gray-400 flex items-center justify-left">
                  -
                </div>
                <div className="pr-2">
                  {name === "requisitos" ? (
                    <div
                      className={`w-full min-h-[44px] rounded-md px-3 py-2 bg-gray-100 text-left whitespace-pre-line ${errors[name] ? "border-red-500" : "border border-gray-300"}`}
                    >
                      {String(form[name] ?? "")
                        .split(",")
                        .map((req) => req.trim())
                        .filter((req) => req)
                        .join("\n")}
                    </div>
                  ) : name === "creditos" ? (
                    <div className="flex gap-2">
                      <div className="flex-1 rounded-md px-3 py-2 bg-gray-100 border border-gray-300 text-center">
                        Teoría (
                        {String(form.creditosTeoria || "").padStart(2, "0")})
                      </div>
                      <div className="flex-1 rounded-md px-3 py-2 bg-gray-100 border border-gray-300 text-center">
                        Práctica (
                        {String(form.creditosPractica || "").padStart(2, "0")})
                      </div>
                      <div className="flex-1 rounded-md px-3 py-2 bg-gray-100 border border-gray-300 text-center">
                        Total créditos (
                        {String(form.creditosTotal || "").padStart(2, "0")})
                      </div>
                    </div>
                  ) : name === "horas" ? (
                    <div className="w-full rounded px-3 py-2 bg-gray-100 border border-gray-300 text-left">
                      {`Teoría (${String(theoryTotal).padStart(2, "0")}) Práctica (${String(practiceTotal).padStart(2, "0")}) Total horas (${String(totalHours).padStart(2, "0")})`}
                    </div>
                  ) : name === "tipoEstudios" ? (
                    <div className="flex gap-2">
                      <div className="flex-1 rounded-md px-3 py-2 bg-gray-100 border border-gray-300 text-center">
                        General (
                        {form.tipoEstudios === "general" ||
                        form.tipoEstudios?.toLowerCase() === "general"
                          ? "X"
                          : " "}
                        )
                      </div>
                      <div className="flex-1 rounded-md px-3 py-2 bg-gray-100 border border-gray-300 text-center">
                        Específica (
                        {form.tipoEstudios === "especifica" ||
                        form.tipoEstudios?.toLowerCase() === "específica" ||
                        form.tipoEstudios?.toLowerCase() === "especifica"
                          ? "X"
                          : " "}
                        )
                      </div>
                      <div className="flex-1 rounded-md px-3 py-2 bg-gray-100 border border-gray-300 text-center">
                        Especialidad (
                        {form.tipoEstudios === "especialidad" ||
                        form.tipoEstudios?.toLowerCase() === "especialidad"
                          ? "X"
                          : " "}
                        )
                      </div>
                    </div>
                  ) : name === "modalidad" ? (
                    <div className="flex gap-2">
                      <div className="flex-1 rounded-md px-3 py-2 bg-gray-100 border border-gray-300 text-center">
                        Presencial (
                        {form.modalidad === "presencial" ||
                        form.modalidad?.toLowerCase() === "presencial"
                          ? "X"
                          : " "}
                        )
                      </div>
                      <div className="flex-1 rounded-md px-3 py-2 bg-gray-100 border border-gray-300 text-center">
                        Semipresencial (
                        {form.modalidad === "semipresencial" ||
                        form.modalidad?.toLowerCase() === "semipresencial"
                          ? "X"
                          : " "}
                        )
                      </div>
                      <div className="flex-1 rounded-md px-3 py-2 bg-gray-100 border border-gray-300 text-center">
                        A distancia (
                        {form.modalidad === "aDistancia" ||
                        form.modalidad?.toLowerCase() === "a distancia"
                          ? "X"
                          : " "}
                        )
                      </div>
                    </div>
                  ) : (
                    <>
                      <div
                        className={`w-full rounded-md px-3 py-2 bg-gray-100 text-left ${errors[name] ? "border-red-500" : "border border-gray-300"}`}
                      >
                        {String(form[name] ?? "")}
                      </div>
                      {errors[name] && (
                        <div className="text-red-600 text-sm mt-1">
                          {errors[name]}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Step>
  );
}
