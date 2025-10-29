import { Step } from "./step";
import { useSteps } from "../contexts/steps-context-provider";

// Data mockeada
const methodologicalStrategies = [
  {
    id: 1,
    title: "Método Expositivo – Interactivo",
    description:
      "Comprende la exposición del docente y la interacción con el estudiante, empleando las herramientas disponibles en el aula virtual de la asignatura",
  },
  {
    id: 2,
    title: "Método de Discusión Guiada",
    description:
      "Conducción del grupo para abordar situaciones y llegar a conclusiones y recomendaciones, empleando las herramientas disponibles en el aula virtual de la asignatura",
  },
  {
    id: 3,
    title: "Método de Demostración – Ejecución",
    description:
      "Se utiliza para ejecutar, demostrar, practicar y retroalimentar lo expuesto, empleando las herramientas disponibles en el aula virtual de la asignatura",
  },
];

const didacticResources = {
  equipment: ["computadora", "ecran", "proyector de multimedia"],
  materials: [
    "Material docente",
    "pizarra",
    "prácticas dirigidas de laboratorio",
    "videos tutoriales",
    "foros y textos bases (ver fuentes de consultas)",
  ],
  software: ["Herramientas de gestión de documentos", "Mentimeter", "Miro"],
};

export default function FifthStep() {
  const { nextStep } = useSteps();

  const handleNextStep = () => {
    console.log("Avanzando al siguiente paso...");
    nextStep();
  };

  return (
    <Step step={5} onNextStep={handleNextStep}>
      <div className="w-full max-w-6xl mx-auto p-6 space-y-8">
        {/* Estrategias Metodológicas */}
        <div>
          <h2 className="text-2xl font-bold mb-4">
            5. Estrategias Metodológicas
          </h2>
          <div className="bg-white border border-gray-300 rounded-lg p-6">
            <ul className="space-y-4 list-disc list-inside text-gray-700">
              {methodologicalStrategies.map((strategy) => (
                <li key={strategy.id} className="leading-relaxed">
                  <span className="font-semibold">{strategy.title}.</span>{" "}
                  {strategy.description}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Recursos Didácticos */}
        <div>
          <h2 className="text-2xl font-bold mb-4">6. Recursos Didácticos</h2>
          <div className="bg-white border border-gray-300 rounded-lg p-6">
            <ul className="space-y-3 list-disc list-inside text-gray-700">
              <li className="leading-relaxed">
                <span className="font-semibold">Equipos:</span>{" "}
                {didacticResources.equipment.join(", ")}.
              </li>
              <li className="leading-relaxed">
                <span className="font-semibold">Materiales:</span>{" "}
                {didacticResources.materials.join(", ")}.
              </li>
              <li className="leading-relaxed">
                <span className="font-semibold">Software:</span>{" "}
                {didacticResources.software.join(", ")}.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </Step>
  );
}
