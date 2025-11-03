import { useState } from "react";
import { Step } from "./step";
import { useSteps } from "../contexts/steps-context-provider";
import { Plus, X } from "lucide-react";
import { ReviewFieldWrapper } from "../../coordinator/components/review-field-wrapper";

// Tipos
interface Bibliography {
  id: string;
  authors: string;
  year: string;
  title: string;
}

interface ElectronicResource {
  id: string;
  source: string;
  year: string;
  url: string;
}

// Data mockeada
const mockBibliographies: Bibliography[] = [
  {
    id: "1",
    authors: "Chandrasekara, C., & Herath, P.",
    year: "2021",
    title:
      "Hands-on GitHub Actions: Implement CI/CD with GitHub Action Workflows for Your Applications.",
  },
  {
    id: "2",
    authors:
      "Guijarro Olivares, J., Caparrós Ramírez, J. J., & Cubero Luque, L.",
    year: "2019",
    title:
      "DevOps y seguridad cloud. Editorial UOC. https://elibro.net/es/lc/bibliotecafmh/titulos/128889",
  },
];

const mockElectronicResources: ElectronicResource[] = [
  {
    id: "1",
    source: "(AWS. (2023) )(AWS Educate. Amazon Web Services, Inc.)",
    year: "",
    url: "https://aws.amazon.com/es/education/awseducate/",
  },
  {
    id: "2",
    source: "Microsoft. (2023a). Microsoft Azure Portal | Microsoft Azure.",
    year: "",
    url: "https://azure.microsoft.com/es-es/get-started/azure-portal",
  },
];

export default function SeventhStep() {
  const { nextStep } = useSteps();
  const [bibliographies, setBibliographies] =
    useState<Bibliography[]>(mockBibliographies);
  const [electronicResources, setElectronicResources] = useState<
    ElectronicResource[]
  >(mockElectronicResources);

  // Estados para nuevos items
  const [newBiblio, setNewBiblio] = useState<Partial<Bibliography>>({
    authors: "",
    year: "",
    title: "",
  });
  const [newElectronic, setNewElectronic] = useState<
    Partial<ElectronicResource>
  >({
    source: "",
    year: "",
    url: "",
  });

  const handleNextStep = () => {
    console.log("Guardando bibliografías...", {
      bibliographies,
      electronicResources,
    });
    nextStep();
  };

  const handleAddBibliography = () => {
    if (newBiblio.authors && newBiblio.year && newBiblio.title) {
      const newItem: Bibliography = {
        id: Date.now().toString(),
        authors: newBiblio.authors,
        year: newBiblio.year,
        title: newBiblio.title,
      };
      setBibliographies([...bibliographies, newItem]);
      setNewBiblio({ authors: "", year: "", title: "" });
    }
  };

  const handleRemoveBibliography = (id: string) => {
    setBibliographies(bibliographies.filter((b) => b.id !== id));
  };

  const handleAddElectronic = () => {
    if (newElectronic.source && newElectronic.url) {
      const newItem: ElectronicResource = {
        id: Date.now().toString(),
        source: newElectronic.source,
        year: newElectronic.year || "",
        url: newElectronic.url,
      };
      setElectronicResources([...electronicResources, newItem]);
      setNewElectronic({ source: "", year: "", url: "" });
    }
  };

  const handleRemoveElectronic = (id: string) => {
    setElectronicResources(electronicResources.filter((e) => e.id !== id));
  };

  return (
    <Step step={7} onNextStep={handleNextStep}>
      <div className="w-full max-w-6xl mx-auto p-6 space-y-8">
        {/* Bibliografías */}
        <div>
          <h2 className="text-2xl font-bold mb-4">8.1. Bibliográficas</h2>
          <div className="space-y-3">
            {bibliographies.map((biblio) => (
              <ReviewFieldWrapper
                key={biblio.id}
                fieldId={`bibliography-${biblio.id}`}
                orientation="vertical"
              >
                <div className="flex items-center gap-3 bg-gray-100 rounded-lg p-3">
                  <div className="flex-1 flex items-center gap-3">
                    <div className="bg-gray-300 px-4 py-2 rounded-lg text-sm">
                      {biblio.authors}
                    </div>
                    <div className="bg-gray-300 px-3 py-2 rounded-lg text-sm">
                      ({biblio.year})
                    </div>
                    <div className="flex-1 bg-gray-300 px-4 py-2 rounded-lg text-sm">
                      {biblio.title}
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveBibliography(biblio.id)}
                    className="p-2 hover:bg-red-100 rounded-lg flex-shrink-0"
                  >
                    <X className="w-5 h-5 text-red-600" />
                  </button>
                </div>
              </ReviewFieldWrapper>
            ))}

            {/* Formulario para agregar nueva bibliografía */}
            <div className="flex items-center gap-3 bg-white border-2 border-dashed border-gray-300 rounded-lg p-3">
              <input
                type="text"
                placeholder="Autores"
                value={newBiblio.authors}
                onChange={(e) =>
                  setNewBiblio({ ...newBiblio, authors: e.target.value })
                }
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
              />
              <input
                type="text"
                placeholder="Año"
                value={newBiblio.year}
                onChange={(e) =>
                  setNewBiblio({ ...newBiblio, year: e.target.value })
                }
                className="w-24 px-3 py-2 border border-gray-300 rounded-lg"
              />
              <input
                type="text"
                placeholder="Título y detalles"
                value={newBiblio.title}
                onChange={(e) =>
                  setNewBiblio({ ...newBiblio, title: e.target.value })
                }
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
              />
              <button
                onClick={handleAddBibliography}
                className="p-2 bg-green-500 hover:bg-green-600 text-white rounded-lg flex-shrink-0"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>

            {/* Botón agregar */}
            <button
              onClick={handleAddBibliography}
              className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>Agregar bibliografía</span>
            </button>
          </div>
        </div>

        {/* Recursos Electrónicos */}
        <div>
          <h2 className="text-2xl font-bold mb-4">8.2. Electrónicas</h2>
          <div className="space-y-3">
            {electronicResources.map((resource) => (
              <ReviewFieldWrapper
                key={resource.id}
                fieldId={`electronic-resource-${resource.id}`}
                orientation="vertical"
              >
                <div className="flex items-center gap-3 bg-gray-100 rounded-lg p-3">
                  <div className="flex-1 flex items-center gap-3">
                    <div className="bg-gray-300 px-4 py-2 rounded-lg text-sm flex-1">
                      {resource.source}
                    </div>
                    <div className="flex-1 bg-gray-300 px-4 py-2 rounded-lg text-sm">
                      {resource.url}
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveElectronic(resource.id)}
                    className="p-2 hover:bg-red-100 rounded-lg flex-shrink-0"
                  >
                    <X className="w-5 h-5 text-red-600" />
                  </button>
                </div>
              </ReviewFieldWrapper>
            ))}

            {/* Formulario para agregar nuevo recurso electrónico */}
            <div className="flex items-center gap-3 bg-white border-2 border-dashed border-gray-300 rounded-lg p-3">
              <input
                type="text"
                placeholder="Fuente (Autor, año, título)"
                value={newElectronic.source}
                onChange={(e) =>
                  setNewElectronic({ ...newElectronic, source: e.target.value })
                }
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
              />
              <input
                type="text"
                placeholder="URL"
                value={newElectronic.url}
                onChange={(e) =>
                  setNewElectronic({ ...newElectronic, url: e.target.value })
                }
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
              />
              <button
                onClick={handleAddElectronic}
                className="p-2 bg-green-500 hover:bg-green-600 text-white rounded-lg flex-shrink-0"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>

            {/* Botón agregar */}
            <button
              onClick={handleAddElectronic}
              className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>Agregar recurso electrónico</span>
            </button>
          </div>
        </div>
      </div>
    </Step>
  );
}
