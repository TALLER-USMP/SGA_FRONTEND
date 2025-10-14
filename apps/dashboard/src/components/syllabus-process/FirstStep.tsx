import { useState } from "react";
import { useSteps } from "../../contexts/StepsContext";
import { Step } from "../common/Step";

type Hours = {
  theoryLectivePresencial: number;
  theoryLectiveDistancia: number;
  theoryNoLectivePresencial: number;
  theoryNoLectiveDistancia: number;
  practiceLectivePresencial: number;
  practiceLectiveDistancia: number;
  practiceNoLectivePresencial: number;
  practiceNoLectiveDistancia: number;
};

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

  const [form, setForm] = useState<FormState>({
    nombreAsignatura: "",
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
  });

  // hours state (kept as before)
  const [confirmedHours, setConfirmedHours] = useState<Hours>({
    theoryLectivePresencial: 0,
    theoryLectiveDistancia: 0,
    theoryNoLectivePresencial: 0,
    theoryNoLectiveDistancia: 0,
    practiceLectivePresencial: 0,
    practiceLectiveDistancia: 0,
    practiceNoLectivePresencial: 0,
    practiceNoLectiveDistancia: 0,
  });
  const [draftHours, setDraftHours] = useState<Hours>(confirmedHours);
  const setDraftHour = (key: keyof Hours, value: number) =>
    setDraftHours((s) => ({ ...s, [key]: value }));
  const [hoursOpen, setHoursOpen] = useState(false);

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

  const onChange = (name: string, value: string) =>
    setForm((s) => ({ ...s, [name]: value }));

  const validate = () => {
    const e: Record<string, string> = {};
    // required basic fields (typed)
    const required: Array<keyof FormState> = [
      "nombreAsignatura",
      "departamentoAcademico",
      "escuelaProfesional",
      "programaAcademico",
      "semestreAcademico",
      "tipoAsignatura",
      "tipoEstudios",
      "modalidad",
      "codigoAsignatura",
      "ciclo",
      "creditosTotal",
      "docentes",
    ];
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
    const e = validate();
    if (Object.keys(e).length === 0) nextStep();
    else {
      // focus first error field
      const firstKey = Object.keys(e)[0];
      const el = document.querySelector(
        `[name="${firstKey}"]`,
      ) as HTMLElement | null;
      if (el && typeof el.focus === "function") el.focus();
    }
  };

  const theoryTotal =
    confirmedHours.theoryLectivePresencial +
    confirmedHours.theoryLectiveDistancia +
    confirmedHours.theoryNoLectivePresencial +
    confirmedHours.theoryNoLectiveDistancia;

  const practiceTotal =
    confirmedHours.practiceLectivePresencial +
    confirmedHours.practiceLectiveDistancia +
    confirmedHours.practiceNoLectivePresencial +
    confirmedHours.practiceNoLectiveDistancia;

  const totalHours = theoryTotal + practiceTotal;

  const hourOptions = Array.from({ length: 11 }).map((_, i) =>
    String(i).padStart(2, "0"),
  );

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
          <div className="mb-6">
            <input
              name="nombreAsignatura"
              placeholder="TALLER DE PROYECTOS"
              value={form.nombreAsignatura}
              onChange={(e) => onChange("nombreAsignatura", e.target.value)}
              className={`w-full h-12 rounded-md px-3 text-lg bg-gray-50 ${errors["nombreAsignatura"] ? "border-red-500" : "border border-gray-300"}`}
            />
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
                className="grid grid-cols-[220px_24px_1fr] items-start gap-2 py-2 border-b last:border-b-0"
              >
                <div className="text-sm text-gray-700 flex items-center">
                  <div className="px-3 py-2 bg-gray-100 border border-gray-300 rounded w-full">
                    {label}
                  </div>
                </div>
                <div className="text-gray-400 flex items-center justify-center">
                  -
                </div>
                <div className="pl-2">
                  {name === "requisitos" ? (
                    <textarea
                      name={name}
                      value={String(form[name] ?? "")}
                      onChange={(e) => onChange(name, e.target.value)}
                      rows={1}
                      className={`w-full h-12 rounded-md px-3 py-2 bg-gray-50 ${errors[name] ? "border-red-500" : "border border-gray-300"}`}
                    />
                  ) : name === "creditos" ? (
                    <div className="flex gap-2">
                      <input
                        name="creditosTeoria"
                        value={form.creditosTeoria}
                        onChange={(e) =>
                          onChange("creditosTeoria", e.target.value)
                        }
                        placeholder="Teoría"
                        className={`w-24 h-10 rounded-md px-2 text-center bg-gray-50 ${errors["creditosTeoria"] ? "border-red-500" : "border border-gray-300"}`}
                      />
                      <input
                        name="creditosPractica"
                        value={form.creditosPractica}
                        onChange={(e) =>
                          onChange("creditosPractica", e.target.value)
                        }
                        placeholder="Práctica"
                        className={`w-24 h-10 rounded-md px-2 text-center bg-gray-50 ${errors["creditosPractica"] ? "border-red-500" : "border border-gray-300"}`}
                      />
                      <input
                        name="creditosTotal"
                        value={form.creditosTotal}
                        onChange={(e) =>
                          onChange("creditosTotal", e.target.value)
                        }
                        placeholder="Total"
                        className={`w-24 h-10 rounded-md px-2 text-center bg-gray-50 ${errors["creditosTotal"] ? "border-red-500" : "border border-gray-300"}`}
                      />
                      {errors["creditosTotal"] && (
                        <div className="text-red-600 text-sm mt-1">
                          {errors["creditosTotal"]}
                        </div>
                      )}
                    </div>
                  ) : name === "horas" ? (
                    <div className="relative">
                      {/* combobox summary */}
                      <input
                        readOnly
                        onClick={() => setHoursOpen((s) => !s)}
                        value={`Teoría (${String(theoryTotal).padStart(2, "0")})  Práctica (${String(practiceTotal).padStart(2, "0")})  Total horas (${String(totalHours).padStart(2, "0")})`}
                        className="w-full border rounded px-3 py-2 cursor-pointer bg-gray-50"
                      />

                      {hoursOpen && (
                        <div className="absolute z-20 mt-2 p-4 bg-white border rounded shadow-lg w-full">
                          <div className="grid grid-cols-2 gap-2">
                            <label className="text-sm">
                              Teoría lectiva presencial{" "}
                              <span className="ml-2 text-gray-500">
                                {draftHours.theoryLectivePresencial > 0
                                  ? "(X)"
                                  : "( )"}
                              </span>
                            </label>
                            <input
                              list="theoryLectivePresencial_list"
                              value={String(
                                draftHours.theoryLectivePresencial,
                              ).padStart(2, "0")}
                              onChange={(e) =>
                                setDraftHour(
                                  "theoryLectivePresencial",
                                  parseInt(e.target.value, 10) || 0,
                                )
                              }
                              className="border rounded px-2 py-1 w-24 text-center"
                            />
                            <datalist id="theoryLectivePresencial_list">
                              {hourOptions.map((o) => (
                                <option key={o} value={o} />
                              ))}
                            </datalist>

                            <label className="text-sm">
                              Teoría lectiva a distancia{" "}
                              <span className="ml-2 text-gray-500">
                                {draftHours.theoryLectiveDistancia > 0
                                  ? "(X)"
                                  : "( )"}
                              </span>
                            </label>
                            <input
                              list="theoryLectiveDistancia_list"
                              value={String(
                                draftHours.theoryLectiveDistancia,
                              ).padStart(2, "0")}
                              onChange={(e) =>
                                setDraftHour(
                                  "theoryLectiveDistancia",
                                  parseInt(e.target.value, 10) || 0,
                                )
                              }
                              className="border rounded px-2 py-1 w-24 text-center"
                            />
                            <datalist id="theoryLectiveDistancia_list">
                              {hourOptions.map((o) => (
                                <option key={o} value={o} />
                              ))}
                            </datalist>

                            <label className="text-sm">
                              Teoría no lectiva presencial{" "}
                              <span className="ml-2 text-gray-500">
                                {draftHours.theoryNoLectivePresencial > 0
                                  ? "(X)"
                                  : "( )"}
                              </span>
                            </label>
                            <input
                              list="theoryNoLectivePresencial_list"
                              value={String(
                                draftHours.theoryNoLectivePresencial,
                              ).padStart(2, "0")}
                              onChange={(e) =>
                                setDraftHour(
                                  "theoryNoLectivePresencial",
                                  parseInt(e.target.value, 10) || 0,
                                )
                              }
                              className="border rounded px-2 py-1 w-24 text-center"
                            />
                            <datalist id="theoryNoLectivePresencial_list">
                              {hourOptions.map((o) => (
                                <option key={o} value={o} />
                              ))}
                            </datalist>

                            <label className="text-sm">
                              Teoría no lectiva a distancia{" "}
                              <span className="ml-2 text-gray-500">
                                {draftHours.theoryNoLectiveDistancia > 0
                                  ? "(X)"
                                  : "( )"}
                              </span>
                            </label>
                            <input
                              list="theoryNoLectiveDistancia_list"
                              value={String(
                                draftHours.theoryNoLectiveDistancia,
                              ).padStart(2, "0")}
                              onChange={(e) =>
                                setDraftHour(
                                  "theoryNoLectiveDistancia",
                                  parseInt(e.target.value, 10) || 0,
                                )
                              }
                              className="border rounded px-2 py-1 w-24 text-center"
                            />
                            <datalist id="theoryNoLectiveDistancia_list">
                              {hourOptions.map((o) => (
                                <option key={o} value={o} />
                              ))}
                            </datalist>

                            <label className="text-sm">
                              Práctica lectiva presencial{" "}
                              <span className="ml-2 text-gray-500">
                                {draftHours.practiceLectivePresencial > 0
                                  ? "(X)"
                                  : "( )"}
                              </span>
                            </label>
                            <input
                              list="practiceLectivePresencial_list"
                              value={String(
                                draftHours.practiceLectivePresencial,
                              ).padStart(2, "0")}
                              onChange={(e) =>
                                setDraftHour(
                                  "practiceLectivePresencial",
                                  parseInt(e.target.value, 10) || 0,
                                )
                              }
                              className="border rounded px-2 py-1 w-24 text-center"
                            />
                            <datalist id="practiceLectivePresencial_list">
                              {hourOptions.map((o) => (
                                <option key={o} value={o} />
                              ))}
                            </datalist>

                            <label className="text-sm">
                              Práctica lectiva a distancia{" "}
                              <span className="ml-2 text-gray-500">
                                {draftHours.practiceLectiveDistancia > 0
                                  ? "(X)"
                                  : "( )"}
                              </span>
                            </label>
                            <input
                              list="practiceLectiveDistancia_list"
                              value={String(
                                draftHours.practiceLectiveDistancia,
                              ).padStart(2, "0")}
                              onChange={(e) =>
                                setDraftHour(
                                  "practiceLectiveDistancia",
                                  parseInt(e.target.value, 10) || 0,
                                )
                              }
                              className="border rounded px-2 py-1 w-24 text-center"
                            />
                            <datalist id="practiceLectiveDistancia_list">
                              {hourOptions.map((o) => (
                                <option key={o} value={o} />
                              ))}
                            </datalist>

                            <label className="text-sm">
                              Práctica no lectiva presencial{" "}
                              <span className="ml-2 text-gray-500">
                                {draftHours.practiceNoLectivePresencial > 0
                                  ? "(X)"
                                  : "( )"}
                              </span>
                            </label>
                            <input
                              list="practiceNoLectivePresencial_list"
                              value={String(
                                draftHours.practiceNoLectivePresencial,
                              ).padStart(2, "0")}
                              onChange={(e) =>
                                setDraftHour(
                                  "practiceNoLectivePresencial",
                                  parseInt(e.target.value, 10) || 0,
                                )
                              }
                              className="border rounded px-2 py-1 w-24 text-center"
                            />
                            <datalist id="practiceNoLectivePresencial_list">
                              {hourOptions.map((o) => (
                                <option key={o} value={o} />
                              ))}
                            </datalist>

                            <label className="text-sm">
                              Práctica no lectiva a distancia{" "}
                              <span className="ml-2 text-gray-500">
                                {draftHours.practiceNoLectiveDistancia > 0
                                  ? "(X)"
                                  : "( )"}
                              </span>
                            </label>
                            <input
                              list="practiceNoLectiveDistancia_list"
                              value={String(
                                draftHours.practiceNoLectiveDistancia,
                              ).padStart(2, "0")}
                              onChange={(e) =>
                                setDraftHour(
                                  "practiceNoLectiveDistancia",
                                  parseInt(e.target.value, 10) || 0,
                                )
                              }
                              className="border rounded px-2 py-1 w-24 text-center"
                            />
                            <datalist id="practiceNoLectiveDistancia_list">
                              {hourOptions.map((o) => (
                                <option key={o} value={o} />
                              ))}
                            </datalist>
                          </div>

                          <div className="flex items-center justify-between gap-3 mt-3">
                            <div className="flex gap-2 items-center"></div>
                            <div className="flex gap-2">
                              <button
                                type="button"
                                className="px-3 py-1 bg-blue-600 text-white rounded"
                                onClick={() => {
                                  setConfirmedHours(draftHours);
                                  setHoursOpen(false);
                                }}
                              >
                                Aceptar
                              </button>
                              <button
                                type="button"
                                className="px-3 py-1 border rounded"
                                onClick={() => {
                                  setDraftHours(confirmedHours);
                                  setHoursOpen(false);
                                }}
                              >
                                Cancelar
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : name === "tipoEstudios" ? (
                    <div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => onChange("tipoEstudios", "general")}
                          className={`px-3 py-1 border rounded ${form.tipoEstudios === "general" ? "bg-blue-600 text-white" : "bg-white text-gray-700"}`}
                        >
                          General{" "}
                          {form.tipoEstudios === "general" ? "(X)" : "( )"}
                        </button>
                        <button
                          type="button"
                          onClick={() => onChange("tipoEstudios", "especifica")}
                          className={`px-3 py-1 border rounded ${form.tipoEstudios === "especifica" ? "bg-blue-600 text-white" : "bg-white text-gray-700"}`}
                        >
                          Especifica{" "}
                          {form.tipoEstudios === "especifica" ? "(X)" : "( )"}
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            onChange("tipoEstudios", "especialidad")
                          }
                          className={`px-3 py-1 border rounded ${form.tipoEstudios === "especialidad" ? "bg-blue-600 text-white" : "bg-white text-gray-700"}`}
                        >
                          Especialidad{" "}
                          {form.tipoEstudios === "especialidad" ? "(X)" : "( )"}
                        </button>
                      </div>
                      <input
                        type="hidden"
                        name="tipoEstudios"
                        value={String(form.tipoEstudios ?? "")}
                      />
                      {errors["tipoEstudios"] && (
                        <div className="text-red-600 text-sm mt-1">
                          {errors["tipoEstudios"]}
                        </div>
                      )}
                    </div>
                  ) : name === "modalidad" ? (
                    <div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => onChange("modalidad", "presencial")}
                          className={`px-3 py-1 border rounded ${form.modalidad === "presencial" ? "bg-blue-600 text-white" : "bg-white text-gray-700"}`}
                        >
                          Presencial{" "}
                          {form.modalidad === "presencial" ? "(X)" : "( )"}
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            onChange("modalidad", "semipresencial")
                          }
                          className={`px-3 py-1 border rounded ${form.modalidad === "semipresencial" ? "bg-blue-600 text-white" : "bg-white text-gray-700"}`}
                        >
                          Semipresencial{" "}
                          {form.modalidad === "semipresencial" ? "(X)" : "( )"}
                        </button>
                        <button
                          type="button"
                          onClick={() => onChange("modalidad", "aDistancia")}
                          className={`px-3 py-1 border rounded ${form.modalidad === "aDistancia" ? "bg-blue-600 text-white" : "bg-white text-gray-700"}`}
                        >
                          A distancia{" "}
                          {form.modalidad === "aDistancia" ? "(X)" : "( )"}
                        </button>
                      </div>
                      <input
                        type="hidden"
                        name="modalidad"
                        value={String(form.modalidad ?? "")}
                      />
                      {errors["modalidad"] && (
                        <div className="text-red-600 text-sm mt-1">
                          {errors["modalidad"]}
                        </div>
                      )}
                    </div>
                  ) : (
                    <>
                      <input
                        name={name}
                        value={String(form[name] ?? "")}
                        onChange={(e) => onChange(name, e.target.value)}
                        className={`w-full rounded-md px-3 py-2 bg-white ${errors[name] ? "border-red-500" : "border border-gray-300"}`}
                      />
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
