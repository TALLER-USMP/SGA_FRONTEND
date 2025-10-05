import { useState } from "react";

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

export default function Step5({ data }: Step5Props) {
  // Datos base (podrás reemplazarlos luego con datos desde la BD)
  const [resources] = useState<DidacticResource[]>(
    data.resources?.length
      ? data.resources
      : [
          {
            id: 1,
            name: "Computadora, ecran, proyector de multimedia.",
            type: "Equipo",
          },
          {
            id: 2,
            name: "Material docente, pizarra, prácticas de laboratorio, videos tutoriales, foros y textos base.",
            type: "Materiales",
          },
          {
            id: 3,
            name: "Herramientas de gestión de documentos, Mentimeter, Miro.",
            type: "Software",
          },
        ],
  );

  return (
    <div className="space-y-8 mr-5 ml-2 text-gray-800 text-sm leading-relaxed">
      {/* Estrategias Metodológicas */}
      <div>
        <h4 className="font-bold mb-3 text-base">
          5. Estrategias Metodológicas
        </h4>
        <div className="border rounded-lg p-4 ml-5 bg-white shadow-sm">
          <ul className="list-disc pl-6 space-y-1.5 text-justify">
            <li>
              <b>Método Expositivo – Interactivo:</b> Comprende la exposición
              del docente y la interacción con el estudiante, empleando las
              herramientas disponibles en el aula virtual de la asignatura.
            </li>
            <li>
              <b>Método de Discusión Guiada:</b> Conducción del grupo para
              abordar situaciones y llegar a conclusiones y recomendaciones,
              empleando las herramientas disponibles en el aula virtual de la
              asignatura.
            </li>
            <li>
              <b>Método de Demostración – Ejecución:</b> Se utiliza para
              ejecutar, demostrar, practicar y retroalimentar lo expuesto,
              empleando las herramientas disponibles en el aula virtual de la
              asignatura.
            </li>
          </ul>
        </div>
      </div>

      {/* Recursos Didácticos */}
      <div>
        <h4 className="font-bold mb-3 text-base">6. Recursos Didácticos</h4>
        <div className="border rounded-lg p-4 ml-5 bg-white shadow-sm">
          <ul className="list-disc pl-6 space-y-1.5 text-justify">
            {resources.map((res) => (
              <li key={res.id}>
                <b>{res.type}:</b> {res.name}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
