import { useState, useEffect, useRef } from "react";
import { useSteps } from "../contexts/steps-context-provider";
import { useSyllabusContext } from "../contexts/syllabus-context";
import { Step } from "./step";
import { X, Plus } from "lucide-react";
import { toast } from "sonner";
import {
  useThirdStepData,
  useUpdateCompetencias,
  useUpdateActitudes,
  useSaveCompetencias,
  useSaveComponentes,
  useSaveActitudes,
} from "../hooks/third-step-query";

interface CompetenciaItem {
  id: string;
  text: string;
  code: string;
}

interface ComponenteItem {
  id: string;
  text: string;
  code: string;
}

interface ContenidoActitudinalItem {
  id: string;
  text: string;
  code: string;
}

interface FormData {
  competencias: CompetenciaItem[];
  componentes: ComponenteItem[];
  contenidosActitudinales: ContenidoActitudinalItem[];
}

export default function ThirdStep() {
  const { nextStep } = useSteps();
  const { syllabusId, courseName } = useSyllabusContext();
  console.log("Syllabus ID in ThirdStep:", syllabusId, "Course:", courseName);

  // Obtener datos del backend
  const { data: thirdStepData, isLoading } = useThirdStepData(
    syllabusId ? Number(syllabusId) : null,
  );

  // Hooks de mutación - UPDATE (PUT)
  const updateCompetencias = useUpdateCompetencias();
  const updateActitudes = useUpdateActitudes();

  // Hooks de mutación - CREATE (POST)
  const createCompetencias = useSaveCompetencias();
  const createComponentes = useSaveComponentes(); // Componentes solo usa POST
  const createActitudes = useSaveActitudes();

  const [formData, setFormData] = useState<FormData>({
    competencias: [],
    componentes: [],
    contenidosActitudinales: [],
  });

  // Guardar datos originales para detectar cambios
  const originalDataRef = useRef<FormData>({
    competencias: [],
    componentes: [],
    contenidosActitudinales: [],
  });

  // Cargar datos del backend cuando estén disponibles
  useEffect(() => {
    if (thirdStepData) {
      console.log("📊 Datos del backend recibidos:", thirdStepData);

      const mappedData = {
        competencias: thirdStepData.competenciasPrincipales.map((item) => ({
          id: String(item.id || Date.now()),
          text: item.text,
          code: item.code || "",
        })),
        componentes: thirdStepData.componentes.map((item) => ({
          id: String(item.id || Date.now()),
          text: item.text,
          code: item.code || "",
        })),
        contenidosActitudinales: thirdStepData.actitudinales.map((item) => ({
          id: String(item.id || Date.now()),
          text: item.text,
          code: item.code || "",
        })),
      };

      console.log("✅ Datos mapeados para el formulario:", mappedData);
      setFormData(mappedData);
      originalDataRef.current = JSON.parse(JSON.stringify(mappedData)); // Deep copy
    }
  }, [thirdStepData]);

  // Add new item to a section
  const addItem = (section: keyof FormData) => {
    const newId = Date.now().toString();
    setFormData((prev) => ({
      ...prev,
      [section]: [...prev[section], { id: newId, text: "", code: "A" }],
    }));
  };

  // Remove item from a section
  const removeItem = (section: keyof FormData, id: string) => {
    setFormData((prev) => ({
      ...prev,
      [section]: prev[section].filter((item) => item.id !== id),
    }));
  };

  // Update item text
  const updateItem = (section: keyof FormData, id: string, text: string) => {
    setFormData((prev) => ({
      ...prev,
      [section]: prev[section].map((item) =>
        item.id === id ? { ...item, text } : item,
      ),
    }));
  };

  // Update item code
  const updateItemCode = (
    section: keyof FormData,
    id: string,
    code: string,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [section]: prev[section].map((item) =>
        item.id === id ? { ...item, code } : item,
      ),
    }));
  };

  // Detectar cambios comparando con datos originales
  const hasChanges = (section: keyof FormData): boolean => {
    const current = formData[section];
    const original = originalDataRef.current[section];
    return JSON.stringify(current) !== JSON.stringify(original);
  };

  // Submit handler - guardar cambios y avanzar
  const handleSubmit = async () => {
    if (!syllabusId) {
      toast.error("No se encontró el ID del sílabo");
      return;
    }

    const numSyllabusId = Number(syllabusId);
    const promises: Promise<{ message?: string }>[] = [];
    let toastId: string | number | undefined;

    try {
      // 1. Verificar y guardar COMPETENCIAS si hay cambios
      if (hasChanges("competencias")) {
        const hasOriginalData = originalDataRef.current.competencias.length > 0;
        console.log(
          `🔄 Detectados cambios en competencias, ${hasOriginalData ? "actualizando (PUT)" : "creando (POST)"}...`,
        );

        const competenciasPayload = {
          items: formData.competencias.map((item, index) => ({
            ...(item.id && !item.id.startsWith("temp-") && hasOriginalData
              ? { id: Number(item.id) }
              : {}),
            text: item.text,
            code: item.code || undefined,
            order: index + 1,
          })),
        };

        if (hasOriginalData) {
          // Usar PUT para sincronizar (crear, actualizar, eliminar)
          promises.push(
            updateCompetencias.mutateAsync({
              syllabusId: numSyllabusId,
              data: competenciasPayload,
            }),
          );
        } else {
          // Usar POST para crear por primera vez
          promises.push(
            createCompetencias.mutateAsync({
              syllabusId: numSyllabusId,
              data: competenciasPayload,
            }),
          );
        }
      }

      // 2. Verificar y guardar COMPONENTES si hay cambios
      // NOTA: El backend solo tiene POST, no PUT para componentes
      if (hasChanges("componentes")) {
        console.log(
          "🔄 Detectados cambios en componentes, guardando (POST)...",
        );

        const componentesPayload = {
          items: formData.componentes.map((item, index) => ({
            // No incluir id para POST
            text: item.text,
            code: item.code || undefined,
            order: index + 1,
          })),
        };

        promises.push(
          createComponentes.mutateAsync({
            syllabusId: numSyllabusId,
            data: componentesPayload,
          }),
        );
      }

      // 3. Verificar y guardar ACTITUDES si hay cambios
      if (hasChanges("contenidosActitudinales")) {
        const hasOriginalData =
          originalDataRef.current.contenidosActitudinales.length > 0;
        console.log(
          `🔄 Detectados cambios en actitudes, ${hasOriginalData ? "actualizando (PUT)" : "creando (POST)"}...`,
        );

        const actitudesPayload = {
          items: formData.contenidosActitudinales.map((item, index) => ({
            ...(item.id && !item.id.startsWith("temp-") && hasOriginalData
              ? { id: Number(item.id) }
              : {}),
            text: item.text,
            code: item.code || undefined,
            order: index + 1,
          })),
        };

        if (hasOriginalData) {
          promises.push(
            updateActitudes.mutateAsync({
              syllabusId: numSyllabusId,
              data: actitudesPayload,
            }),
          );
        } else {
          promises.push(
            createActitudes.mutateAsync({
              syllabusId: numSyllabusId,
              data: actitudesPayload,
            }),
          );
        }
      }

      // Ejecutar todas las peticiones en paralelo
      if (promises.length > 0) {
        toastId = toast.loading("Guardando cambios...");
        const results = await Promise.all(promises);

        // Cerrar el toast de loading
        toast.dismiss(toastId);

        // Mostrar resultados
        results.forEach((result) => {
          console.log("✅ Resultado:", result);
          toast.success(result.message || "Cambios guardados correctamente");
        });
      } else {
        console.log("ℹ️ No hay cambios para guardar");
        toast.info("No hay cambios para guardar");
      }

      // Avanzar al siguiente paso
      nextStep();
    } catch (error) {
      // Cerrar el toast de loading si existe
      if (toastId) {
        toast.dismiss(toastId);
      }

      console.error("❌ Error al guardar:", error);
      toast.error(
        error instanceof Error ? error.message : "Error al guardar los cambios",
      );
    }
  };

  return (
    <Step step={3} onNextStep={handleSubmit}>
      <div className="w-full p-6">
        {/* Datos Generales (resumen) */}
        <div className="mb-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="text-lg font-bold text-black">1.</div>
            <h3 className="text-lg font-medium text-black">Datos Generales</h3>
            <div className="ml-2 w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
              i
            </div>
          </div>
          <div className="w-full h-12 rounded-md px-4 flex items-center text-lg bg-blue-50 border border-blue-100">
            {courseName || "TALLER DE PROYECTOS"}
          </div>
        </div>

        {/* Indicador de carga */}
        {isLoading && (
          <div className="flex justify-center items-center py-8">
            <div className="text-gray-500">Cargando datos...</div>
          </div>
        )}

        {/* 3.1 Competencia */}
        <div className="mb-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4 text-left">
            3.1 Competencia
          </h3>
          <div className="space-y-3">
            {formData.competencias.map((item) => (
              <div key={item.id}>
                <div className="flex items-start gap-3">
                  <div className="flex-1">
                    <textarea
                      value={item.text}
                      onChange={(e) =>
                        updateItem("competencias", item.id, e.target.value)
                      }
                      className="w-full p-3 border border-gray-300 rounded-lg resize-none bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={2}
                      placeholder="Ingrese la competencia..."
                    />
                  </div>
                  <div className="w-24">
                    <input
                      type="text"
                      value={item.code}
                      onChange={(e) =>
                        updateItemCode("competencias", item.id, e.target.value)
                      }
                      className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
                      placeholder="Código"
                      maxLength={10}
                    />
                  </div>
                  <button
                    onClick={() => removeItem("competencias", item.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                    disabled={formData.competencias.length <= 1}
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
            ))}
            <div className="flex justify-end pt-2">
              <button
                onClick={() => addItem("competencias")}
                className="flex items-center gap-2 p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors"
              >
                <Plus size={20} />
                Agregar competencia
              </button>
            </div>
          </div>
        </div>

        {/* 3.2 Componentes */}
        <div className="mb-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4 text-left">
            3.2. Componentes
          </h3>
          <div className="space-y-3">
            {formData.componentes.map((item) => (
              <div key={item.id}>
                <div className="flex items-start gap-3">
                  <div className="flex-1">
                    <textarea
                      value={item.text}
                      onChange={(e) =>
                        updateItem("componentes", item.id, e.target.value)
                      }
                      className="w-full p-3 border border-gray-300 rounded-lg resize-none bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={2}
                      placeholder="Ingrese el componente..."
                    />
                  </div>
                  <div className="w-24">
                    <input
                      type="text"
                      value={item.code}
                      onChange={(e) =>
                        updateItemCode("componentes", item.id, e.target.value)
                      }
                      className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
                      placeholder="Código"
                      maxLength={10}
                    />
                  </div>
                  <button
                    onClick={() => removeItem("componentes", item.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                    disabled={formData.componentes.length <= 1}
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
            ))}
            <div className="flex justify-end pt-2">
              <button
                onClick={() => addItem("componentes")}
                className="flex items-center gap-2 p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors"
              >
                <Plus size={20} />
                Agregar componente
              </button>
            </div>
          </div>
        </div>

        {/* 3.3 Contenidos actitudinales */}
        <div className="mb-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4 text-left">
            3.3. Contenidos actitudinales
          </h3>
          <div className="space-y-3">
            {formData.contenidosActitudinales.map((item) => (
              <div key={item.id}>
                <div className="flex items-start gap-3">
                  <div className="flex-1">
                    <textarea
                      value={item.text}
                      onChange={(e) =>
                        updateItem(
                          "contenidosActitudinales",
                          item.id,
                          e.target.value,
                        )
                      }
                      className="w-full p-3 border border-gray-300 rounded-lg resize-none bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={2}
                      placeholder="Ingrese el contenido actitudinal..."
                    />
                  </div>
                  <div className="w-24">
                    <input
                      type="text"
                      value={item.code}
                      onChange={(e) =>
                        updateItemCode(
                          "contenidosActitudinales",
                          item.id,
                          e.target.value,
                        )
                      }
                      className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
                      placeholder="Código"
                      maxLength={10}
                    />
                  </div>
                  <button
                    onClick={() =>
                      removeItem("contenidosActitudinales", item.id)
                    }
                    className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
            ))}
            <div className="flex justify-end pt-2">
              <button
                onClick={() => addItem("contenidosActitudinales")}
                className="flex items-center gap-2 p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors"
              >
                <Plus size={20} />
                Agregar contenido actitudinal
              </button>
            </div>
          </div>
        </div>
      </div>
    </Step>
  );
}
