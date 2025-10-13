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

  // exclusive selections
  const [tipoEstudiosSelected, setTipoEstudiosSelected] = useState<
    "general" | "especifica" | "especialidad" | null
  >(null);
  const [modalidadSelected, setModalidadSelected] = useState<
    "presencial" | "semipresencial" | "aDistancia" | null
  >(null);

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

  // confirmed (accepted) hours
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

  // draft hours while the panel is open (edits are confirmed with Aceptar)
  const [draftHours, setDraftHours] = useState<Hours>(confirmedHours);

  const setDraftHour = (key: keyof Hours, value: number) => {
    setDraftHours((s) => ({ ...s, [key]: value }));
  };

  const [hoursOpen, setHoursOpen] = useState(false);

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
    <Step step={1} onNextStep={() => nextStep()}>
      <div className="p-6 bg-white rounded-md">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">1. Datos Generales</h2>
        </div>

        <div className="mb-6">
          <input
            name="nombreAsignatura"
            placeholder="TALLER DE PROYECTOS"
            defaultValue={""}
            className="w-full h-12 rounded-md border border-gray-300 bg-white px-3 text-lg"
          />
        </div>

        <div className="grid gap-4">
          {fields.map(([label, name]) => (
            <div
              key={name}
              className="grid grid-cols-[220px_16px_1fr] items-start gap-2"
            >
              <div className="text-sm text-gray-700">{label}</div>
              <div className="text-gray-400">-</div>
              <div>
                {name === "requisitos" ? (
                  <textarea
                    name={name}
                    rows={1}
                    className="w-full h-12 rounded-md border border-gray-300 px-3 py-2"
                  />
                ) : name === "creditos" ? (
                  <div className="flex gap-2">
                    <input
                      name="creditosTeoria"
                      placeholder="Teoría"
                      className="w-24 h-10 rounded-md border border-gray-300 px-2 text-center"
                    />
                    <input
                      name="creditosPractica"
                      placeholder="Práctica"
                      className="w-24 h-10 rounded-md border border-gray-300 px-2 text-center"
                    />
                    <input
                      name="creditosTotal"
                      placeholder="Total"
                      className="w-24 h-10 rounded-md border border-gray-300 px-2 text-center"
                    />
                  </div>
                ) : name === "horas" ? (
                  <div className="relative">
                    {/* combobox summary */}
                    <input
                      readOnly
                      onClick={() => setHoursOpen((s) => !s)}
                      value={`Teoría (${String(theoryTotal).padStart(2, "0")})  Práctica (${String(practiceTotal).padStart(2, "0")})  Total horas (${String(totalHours).padStart(2, "0")})`}
                      className="w-full border rounded px-3 py-2 cursor-pointer bg-white"
                    />

                    {hoursOpen && (
                      <div className="absolute z-20 mt-2 p-4 bg-white border rounded shadow-lg w-full">
                        <div className="grid grid-cols-2 gap-2">
                          <label className="text-sm">
                            Teoría lectiva presencial
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
                            Teoría lectiva a distancia
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
                            Teoría no lectiva presencial
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
                            Teoría no lectiva a distancia
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
                            Práctica lectiva presencial
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
                            Práctica lectiva a distancia
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
                            Práctica no lectiva presencial
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
                            Práctica no lectiva a distancia
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
                        onClick={() => setTipoEstudiosSelected("general")}
                        className={`px-3 py-1 border rounded ${tipoEstudiosSelected === "general" ? "bg-blue-600 text-white" : "bg-white text-gray-700"}`}
                      >
                        General{" "}
                        {tipoEstudiosSelected === "general" ? "(X)" : "( )"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setTipoEstudiosSelected("especifica")}
                        className={`px-3 py-1 border rounded ${tipoEstudiosSelected === "especifica" ? "bg-blue-600 text-white" : "bg-white text-gray-700"}`}
                      >
                        Especifica{" "}
                        {tipoEstudiosSelected === "especifica" ? "(X)" : "( )"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setTipoEstudiosSelected("especialidad")}
                        className={`px-3 py-1 border rounded ${tipoEstudiosSelected === "especialidad" ? "bg-blue-600 text-white" : "bg-white text-gray-700"}`}
                      >
                        Especialidad{" "}
                        {tipoEstudiosSelected === "especialidad"
                          ? "(X)"
                          : "( )"}
                      </button>
                    </div>
                    <input
                      type="hidden"
                      name="tipoEstudios"
                      value={tipoEstudiosSelected ?? ""}
                    />
                  </div>
                ) : name === "modalidad" ? (
                  <div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setModalidadSelected("presencial")}
                        className={`px-3 py-1 border rounded ${modalidadSelected === "presencial" ? "bg-blue-600 text-white" : "bg-white text-gray-700"}`}
                      >
                        Presencial{" "}
                        {modalidadSelected === "presencial" ? "(X)" : "( )"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setModalidadSelected("semipresencial")}
                        className={`px-3 py-1 border rounded ${modalidadSelected === "semipresencial" ? "bg-blue-600 text-white" : "bg-white text-gray-700"}`}
                      >
                        Semipresencial{" "}
                        {modalidadSelected === "semipresencial" ? "(X)" : "( )"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setModalidadSelected("aDistancia")}
                        className={`px-3 py-1 border rounded ${modalidadSelected === "aDistancia" ? "bg-blue-600 text-white" : "bg-white text-gray-700"}`}
                      >
                        A distancia{" "}
                        {modalidadSelected === "aDistancia" ? "(X)" : "( )"}
                      </button>
                    </div>
                    <input
                      type="hidden"
                      name="modalidad"
                      value={modalidadSelected ?? ""}
                    />
                  </div>
                ) : (
                  <input
                    name={name}
                    defaultValue={""}
                    className="w-full rounded-md border border-gray-300 bg-white px-3 py-2"
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Step>
  );
}
