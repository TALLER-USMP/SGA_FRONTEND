import { useState, useEffect } from "react";

interface DidacticResource {
  id: number;
  name: string;
  type: string;
}

interface MethodologyData {
  strategies: string;
  resources: DidacticResource[];
}

interface Step5Props {
  data: MethodologyData;
  onChange: (data: MethodologyData) => void;
}

export default function Step5({ data, onChange }: Step5Props) {
  const [resources, setResources] = useState<DidacticResource[]>([]);
  const [strategies, setStrategies] = useState<string>("");

  useEffect(() => {
    const mockResources: DidacticResource[] = [
      {
        id: 1,
        name: "Computadora, ecran, proyector de multimedia.",
        type: "Equipos",
      },
      {
        id: 2,
        name: "Material docente, pizarra, prácticas dirigidas de laboratorio, videos tutoriales, foros y textos base (ver fuentes de consulta).",
        type: "Materiales",
      },
      {
        id: 3,
        name: "Herramientas de gestión de documentos, Mentimeter, Miro.",
        type: "Software",
      },
    ];

    const mockStrategies = [
      "Método Expositivo – Interactivo: Comprende la exposición del docente y la interacción con el estudiante, empleando las herramientas disponibles en el aula virtual de la asignatura.",
      "Método de Discusión Guiada: Conducción del grupo para abordar situaciones y llegar a conclusiones y recomendaciones, empleando las herramientas disponibles en el aula virtual de la asignatura.",
      "Método de Demostración – Ejecución: Se utiliza para ejecutar, demostrar, practicar y retroalimentar lo expuesto, empleando las herramientas disponibles en el aula virtual de la asignatura.",
    ];

    const fetchMockData = async () => {
      await new Promise((resolve) => setTimeout(resolve, 400));

      const incoming = Array.isArray(data.resources) ? data.resources : [];
      const merged: DidacticResource[] = [...incoming];
      mockResources.forEach((m) => {
        const exists = merged.some(
          (r) => r.type === m.type && r.name === m.name,
        );
        if (!exists) merged.push(m);
      });

      const finalStrategies = data.strategies || mockStrategies.join(" || ");
      setResources(merged);
      setStrategies(finalStrategies);
      onChange({ resources: merged, strategies: finalStrategies });
    };

    fetchMockData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const grouped = resources.reduce<Record<string, string[]>>((acc, r) => {
    if (!acc[r.type]) acc[r.type] = [];
    acc[r.type].push(r.name.replace(/\.$/, ""));
    return acc;
  }, {});

  return (
    <div className="space-y-8 mr-5 ml-2 text-gray-800 text-sm leading-relaxed">
      {/* Estrategias Metodológicas */}
      <div>
        <h4 className="font-bold mb-3 text-base">
          5. Estrategias Metodológicas
        </h4>
        <div className="border rounded-lg p-4 ml-5 bg-white shadow-sm space-y-2">
          <ul className="list-none space-y-2">
            {strategies.split(" || ").map((s, i) => (
              <li
                key={i}
                className="text-justify leading-snug pl-4 relative"
                style={{
                  textIndent: "-0.6rem", // sangría colgante
                  marginLeft: "0.4rem", // espacio del punto
                }}
              >
                • {s}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Recursos Didácticos */}
      <div>
        <h4 className="font-bold mb-3 text-base">6. Recursos Didácticos</h4>
        <div className="border rounded-lg p-4 ml-5 bg-white shadow-sm space-y-2">
          {Object.entries(grouped).map(([type, names]) => (
            <p
              key={type}
              className="text-justify leading-snug pl-4 relative"
              style={{
                textIndent: "-0.6rem",
                marginLeft: "0.4rem",
              }}
            >
              • <b>{type}:</b> {names.join(", ")}.
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
