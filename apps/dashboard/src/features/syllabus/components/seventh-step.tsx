import { useState, useEffect } from "react";
import { Step } from "./step";
import { useSteps } from "../contexts/steps-context-provider";
import { useSyllabusContext } from "../contexts/syllabus-context";
import { Plus, X } from "lucide-react";
import { toast } from "sonner";
import {
  useFuentesQuery,
  useCreateFuente,
  useDeleteFuente,
} from "../hooks/seventh-step-query";

// Tipos para la vista (manteniendo estructura original)
interface Bibliography {
  id: number;
  authors: string;
  year: string;
  title: string;
}

interface ElectronicResource {
  id: number;
  source: string;
  year: string;
  url: string;
}

export default function SeventhStep() {
  const { nextStep } = useSteps();
  const { syllabusId } = useSyllabusContext();

  // Queries y mutaciones
  const { data: fuentesFromApi = [], isLoading } = useFuentesQuery(syllabusId);
  const createMutation = useCreateFuente();
  const deleteMutation = useDeleteFuente();

  // Estados locales para la vista
  const [bibliographies, setBibliographies] = useState<Bibliography[]>([]);
  const [electronicResources, setElectronicResources] = useState<
    ElectronicResource[]
  >([]);

  // Sincronizar datos del API con el estado local
  useEffect(() => {
    if (fuentesFromApi.length > 0) {
      const biblio: Bibliography[] = [];
      const electronic: ElectronicResource[] = [];

      fuentesFromApi.forEach((fuente) => {
        if (fuente.tipo === "LIBRO" || fuente.tipo === "ART") {
          biblio.push({
            id: fuente.id,
            authors: fuente.autores,
            year: fuente.anio.toString(),
            title: fuente.titulo,
          });
        } else if (fuente.tipo === "WEB") {
          electronic.push({
            id: fuente.id,
            source: fuente.autores,
            year: fuente.anio.toString(),
            url: fuente.doiUrl || fuente.titulo,
          });
        }
      });

      setBibliographies(biblio);
      setElectronicResources(electronic);
    }
  }, [fuentesFromApi]);

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

  const handleAddBibliography = async () => {
    if (
      !syllabusId ||
      !newBiblio.authors ||
      !newBiblio.year ||
      !newBiblio.title
    ) {
      toast.error("Complete todos los campos");
      return;
    }

    try {
      const anio = parseInt(newBiblio.year);
      await createMutation.mutateAsync({
        silaboId: syllabusId,
        fuente: {
          tipo: "LIBRO",
          autores: newBiblio.authors,
          anio,
          titulo: newBiblio.title,
        },
      });

      setNewBiblio({ authors: "", year: "", title: "" });
      toast.success("Bibliografía agregada");
    } catch (error) {
      toast.error("Error al agregar bibliografía");
      console.log(error);
    }
  };

  const handleRemoveBibliography = async (id: number) => {
    if (!syllabusId) return;

    try {
      await deleteMutation.mutateAsync({ silaboId: syllabusId, fuenteId: id });
      toast.success("Bibliografía eliminada");
    } catch (error) {
      toast.error("Error al eliminar");
      console.log(error);
    }
  };

  const handleAddElectronic = async () => {
    if (!syllabusId || !newElectronic.source || !newElectronic.url) {
      toast.error("Complete los campos obligatorios");
      return;
    }

    try {
      const anio = newElectronic.year
        ? parseInt(newElectronic.year)
        : new Date().getFullYear();
      await createMutation.mutateAsync({
        silaboId: syllabusId,
        fuente: {
          tipo: "WEB",
          autores: newElectronic.source,
          anio,
          titulo: newElectronic.url,
          doiUrl: newElectronic.url,
        },
      });

      setNewElectronic({ source: "", year: "", url: "" });
      toast.success("Recurso electrónico agregado");
    } catch (error) {
      console.log(error);
      toast.error("Error al agregar recurso");
    }
  };

  const handleRemoveElectronic = async (id: number) => {
    if (!syllabusId) return;

    try {
      await deleteMutation.mutateAsync({ silaboId: syllabusId, fuenteId: id });
      toast.success("Recurso eliminado");
    } catch (error) {
      toast.error("Error al eliminar");
      console.log(error);
    }
  };

  if (isLoading) {
    return (
      <Step step={7} onNextStep={handleNextStep}>
        <div className="w-full max-w-6xl mx-auto p-6">
          <p className="text-center">Cargando datos...</p>
        </div>
      </Step>
    );
  }

  return (
    <Step step={7} onNextStep={handleNextStep}>
      <div className="w-full max-w-6xl mx-auto p-6 space-y-8">
        {/* Bibliografías */}
        <div>
          <h2 className="text-2xl font-bold mb-4">8.1. Bibliográficas</h2>
          <div className="space-y-3">
            {bibliographies.map((biblio) => (
              <div key={biblio.id}>
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
                    disabled={deleteMutation.isPending}
                  >
                    <X className="w-5 h-5 text-red-600" />
                  </button>
                </div>
              </div>
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
                disabled={createMutation.isPending}
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>

            {/* Botón agregar */}
            <button
              onClick={handleAddBibliography}
              className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-colors"
              disabled={createMutation.isPending}
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
              <div key={resource.id}>
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
                    disabled={deleteMutation.isPending}
                  >
                    <X className="w-5 h-5 text-red-600" />
                  </button>
                </div>
              </div>
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
                disabled={createMutation.isPending}
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>

            {/* Botón agregar */}
            <button
              onClick={handleAddElectronic}
              className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-colors"
              disabled={createMutation.isPending}
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
