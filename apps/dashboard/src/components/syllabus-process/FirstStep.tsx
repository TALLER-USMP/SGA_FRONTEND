import { useState, useEffect } from "react";
import { useSteps } from "../../contexts/StepsContext";
import { Step } from "../common/Step";

export default function FirstStep() {
  const { nextStep } = useSteps();
  // Controlled form state
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
    try {
      return {
        nombreAsignatura:
          localStorage.getItem("syllabusNombre") || "TALLER DE PROYECTOS",
        departamentoAcademico:
          localStorage.getItem("datos_departamentoAcademico") || "",
        escuelaProfesional:
          localStorage.getItem("datos_escuelaProfesional") || "",
        programaAcademico:
          localStorage.getItem("datos_programaAcademico") || "",
        semestreAcademico:
          localStorage.getItem("datos_semestreAcademico") || "",
        tipoAsignatura: localStorage.getItem("datos_tipoAsignatura") || "",
        tipoEstudios: localStorage.getItem("datos_tipoEstudios") || "",
        modalidad: localStorage.getItem("datos_modalidad") || "",
        codigoAsignatura: localStorage.getItem("datos_codigoAsignatura") || "",
        ciclo: localStorage.getItem("datos_ciclo") || "",
        requisitos: localStorage.getItem("datos_requisitos") || "",
        creditosTeoria: localStorage.getItem("datos_creditosTeoria") || "",
        creditosPractica: localStorage.getItem("datos_creditosPractica") || "",
        creditosTotal: localStorage.getItem("datos_creditosTotal") || "",
        docentes: localStorage.getItem("datos_docentes") || "",
      } as FormState;
    } catch (e) {
      void e;
      return {
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
      } as FormState;
    }
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string>("");

  // Totals for display — initialized from localStorage
  const [theoryTotal, setTheoryTotal] = useState<number>(
    Number(localStorage.getItem("datos_theoryTotal") ?? 0),
  );
  const [practiceTotal, setPracticeTotal] = useState<number>(
    Number(localStorage.getItem("datos_practiceTotal") ?? 0),
  );
  const [totalHours, setTotalHours] = useState<number>(
    Number(
      localStorage.getItem("datos_totalHours") ?? theoryTotal + practiceTotal,
    ),
  );

  useEffect(() => {
    // Fetch datos generales from backend if syllabusId exists
    const id = localStorage.getItem("syllabusId");
    if (!id) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      setApiError("");
      try {
        const res = await fetch(
          `http://localhost:7071/api/syllabus/7/datos-generales`,
        );
        if (!res.ok) {
          const txt = await res.text();
          throw new Error(`${res.status} ${txt}`);
        }
        const json = await res.json();
        if (cancelled) return;
        // Map backend JSON to form fields
        setForm((s) => ({
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
        }));

        // hours totals
        const tTheory = Number(
          json.horasTeoria ?? json.horasTeoriaLectivaPresencial ?? 0,
        );
        const tPractice = Number(
          json.horasPractica ?? json.horasPracticaLectivaPresencial ?? 0,
        );
        const tTotal = Number(
          json.horasTotales ?? json.horasTotales ?? tTheory + tPractice,
        );
        setTheoryTotal(tTheory);
        setPracticeTotal(tPractice);
        setTotalHours(tTotal);

        // persist into localStorage for other steps
        try {
          const nameToStore =
            json.nombreAsignatura ??
            localStorage.getItem("syllabusNombre") ??
            "";
          localStorage.setItem("syllabusNombre", nameToStore);
          localStorage.setItem(
            "datos_departamentoAcademico",
            json.departamentoAcademico ?? "",
          );
          localStorage.setItem(
            "datos_escuelaProfesional",
            json.escuelaProfesional ?? "",
          );
          localStorage.setItem(
            "datos_programaAcademico",
            json.programaAcademico ?? "",
          );
          localStorage.setItem(
            "datos_semestreAcademico",
            json.semestreAcademico ?? "",
          );
          localStorage.setItem(
            "datos_tipoAsignatura",
            json.tipoAsignatura ?? "",
          );
          localStorage.setItem("datos_tipoEstudios", json.tipoEstudios ?? "");
          localStorage.setItem("datos_modalidad", json.modalidad ?? "");
          localStorage.setItem(
            "datos_codigoAsignatura",
            json.codigoAsignatura ?? "",
          );
          localStorage.setItem("datos_ciclo", json.ciclo ?? "");
          localStorage.setItem("datos_requisitos", json.requisitos ?? "");
          localStorage.setItem(
            "datos_creditosTeoria",
            json.creditosTeoria != null ? String(json.creditosTeoria) : "",
          );
          localStorage.setItem(
            "datos_creditosPractica",
            json.creditosPractica != null ? String(json.creditosPractica) : "",
          );
          localStorage.setItem(
            "datos_creditosTotal",
            json.creditosTotales != null ? String(json.creditosTotales) : "",
          );
          localStorage.setItem("datos_docentes", json.docentes ?? "");
          localStorage.setItem("datos_theoryTotal", String(tTheory));
          localStorage.setItem("datos_practiceTotal", String(tPractice));
          localStorage.setItem("datos_totalHours", String(tTotal));
        } catch (e) {
          void e;
        }
      } catch (err: unknown) {
        if (err instanceof Error) setApiError(err.message);
        else setApiError(String(err));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Hours shown as read-only summary (sourced from localStorage if present)

  // validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  const fields: Array<[string, string]> = [
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
  ];

  // First step fields are read-only in the UI; form is hydrated from localStorage

  const validate = () => {
    const e: Record<string, string> = {};
    // Note: Datos generales están bloqueados para el docente. Sólo validamos mínimamente.
    const required: Array<keyof FormState> = ["nombreAsignatura"];
    for (const k of required) {
      if (!String(form[k] ?? "").trim()) e[String(k)] = "Campo obligatorio";
    }

    // creditos must be numeric
    const numericFields: Array<keyof FormState> = [
      "creditosTeoria",
      "creditosPractica",
      "creditosTotal",
    ];
    for (const k of numericFields) {
      const v = String(form[k] ?? "").trim();
      if (v && isNaN(Number(v))) e[String(k)] = "Debe ser un número";
    }

    // at least one tipoEstudios / modalidad selection
    if (!form.tipoEstudios)
      e.tipoEstudios = e.tipoEstudios ?? "Selecciona un tipo de estudios";
    if (!form.modalidad) e.modalidad = e.modalidad ?? "Selecciona modalidad";

    setErrors(e);
    return e;
  };

  const validateAndNext = () => {
    // Ejecutar validación mínima (por ejemplo, nombre)
    const e = validate();
    if (Object.keys(e).length > 0) {
      const firstKey = Object.keys(e)[0];
      const el = document.querySelector(
        `[name="${firstKey}"]`,
      ) as HTMLElement | null;
      if (el && typeof el.focus === "function") el.focus();
      return;
    }

    // Datos generales son de solo lectura. Aseguramos que exista un syllabusId y syllabusNombre
    try {
      // ensure syllabusNombre is stored
      const name =
        String(form.nombreAsignatura ?? "").trim() || "TALLER DE PROYECTOS";
      localStorage.setItem("syllabusNombre", name);
      // ensure syllabusId exists
      let id = localStorage.getItem("syllabusId");
      if (!id) {
        // generate simple id (timestamp)
        id = `syllabus-${Date.now()}`;
        localStorage.setItem("syllabusId", id);
      }
      // persist also the datos_ fields for possible later use
      try {
        localStorage.setItem(
          "datos_departamentoAcademico",
          String(form.departamentoAcademico ?? ""),
        );
        localStorage.setItem(
          "datos_escuelaProfesional",
          String(form.escuelaProfesional ?? ""),
        );
        localStorage.setItem(
          "datos_programaAcademico",
          String(form.programaAcademico ?? ""),
        );
        localStorage.setItem(
          "datos_semestreAcademico",
          String(form.semestreAcademico ?? ""),
        );
        localStorage.setItem(
          "datos_tipoAsignatura",
          String(form.tipoAsignatura ?? ""),
        );
        localStorage.setItem(
          "datos_tipoEstudios",
          String(form.tipoEstudios ?? ""),
        );
        localStorage.setItem("datos_modalidad", String(form.modalidad ?? ""));
        localStorage.setItem(
          "datos_codigoAsignatura",
          String(form.codigoAsignatura ?? ""),
        );
        localStorage.setItem("datos_ciclo", String(form.ciclo ?? ""));
        localStorage.setItem("datos_requisitos", String(form.requisitos ?? ""));
        localStorage.setItem(
          "datos_creditosTeoria",
          String(form.creditosTeoria ?? ""),
        );
        localStorage.setItem(
          "datos_creditosPractica",
          String(form.creditosPractica ?? ""),
        );
        localStorage.setItem(
          "datos_creditosTotal",
          String(form.creditosTotal ?? ""),
        );
        localStorage.setItem("datos_docentes", String(form.docentes ?? ""));
      } catch (e) {
        void e;
      }
    } catch (e) {
      void e;
    }
    nextStep();
  };

  // hour totals computed above

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
          {loading && (
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
            {/* Nombre asignatura mostrado como texto plano en caja */}
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
