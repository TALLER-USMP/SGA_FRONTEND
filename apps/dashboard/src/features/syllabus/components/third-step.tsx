import { useState } from "react";
import { useSteps } from "../contexts/steps-context-provider";
import { useSyllabusContext } from "../contexts/syllabus-context";
import { Step } from "./step";
import { X, Plus } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../common/components/ui/select";

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

  // Generar opciones de códigos de la A a la Z
  const codeOptions = Array.from({ length: 26 }, (_, i) =>
    String.fromCharCode(65 + i),
  );

  const [formData, setFormData] = useState<FormData>({
    competencias: [
      {
        id: "1",
        text: "Elabora y gestiona proyectos de diversa índole, vinculados a profesión.",
        code: "G",
      },
      {
        id: "2",
        text: "Analizar un sistema complejo de computación y aplicar principios de computación y otras disciplinas relevantes para identificar soluciones.",
        code: "I",
      },
    ],
    componentes: [
      {
        id: "1",
        text: "Elabora trabajos de aplicación a proyectos vinculados a la especialidad",
        code: "A",
      },
      {
        id: "2",
        text: "Gestiona proyectos de diversa índole, vinculados a la especialidad",
        code: "B",
      },
    ],
    contenidosActitudinales: [
      { id: "1", text: "Búsqueda de la verdad.", code: "A" },
      { id: "2", text: "Compromiso ético en todo su quehacer.", code: "B" },
    ],
  });

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

  // Submit handler - prepare data for backend
  const handleSubmit = () => {
    const dataForBackend = {
      step: 3,
      title: "COMPETENCIAS Y SUS COMPONENTES COMPRENDIDOS EN LA ASIGNATURA",
      sections: {
        competencias: {
          title: "3.1 Competencia",
          items: formData.competencias
            .map((item) => item.text)
            .filter((text) => text.trim() !== ""),
        },
        componentes: {
          title: "3.2. Componentes",
          items: formData.componentes
            .map((item) => item.text)
            .filter((text) => text.trim() !== ""),
        },
        contenidosActitudinales: {
          title: "3.3. Contenidos actitudinales",
          items: formData.contenidosActitudinales
            .map((item) => item.text)
            .filter((text) => text.trim() !== ""),
        },
      },
      timestamp: new Date().toISOString(),
    };

    console.log("Data prepared for backend:", dataForBackend);
    nextStep();
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

        {/* 3.1 Competencia */}
        <div className="mb-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4 text-left">
            3.1 Competencia
          </h3>
          <div className="space-y-3">
            {formData.competencias.map((item) => (
              <div key={item.id} className="flex items-start gap-3">
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
                  <Select
                    value={item.code}
                    onValueChange={(value) =>
                      updateItemCode("competencias", item.id, value)
                    }
                  >
                    <SelectTrigger className="w-full bg-white">
                      <SelectValue placeholder="Código" />
                    </SelectTrigger>
                    <SelectContent>
                      {codeOptions.map((code) => (
                        <SelectItem key={code} value={code}>
                          {code}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <button
                  onClick={() => removeItem("competencias", item.id)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                  disabled={formData.competencias.length <= 1}
                >
                  <X size={20} />
                </button>
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
              <div key={item.id} className="flex items-start gap-3">
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
                  <Select
                    value={item.code}
                    onValueChange={(value) =>
                      updateItemCode("componentes", item.id, value)
                    }
                  >
                    <SelectTrigger className="w-full bg-white">
                      <SelectValue placeholder="Código" />
                    </SelectTrigger>
                    <SelectContent>
                      {codeOptions.map((code) => (
                        <SelectItem key={code} value={code}>
                          {code}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <button
                  onClick={() => removeItem("componentes", item.id)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                  disabled={formData.componentes.length <= 1}
                >
                  <X size={20} />
                </button>
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
              <div key={item.id} className="flex items-start gap-3">
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
                  <Select
                    value={item.code}
                    onValueChange={(value) =>
                      updateItemCode("contenidosActitudinales", item.id, value)
                    }
                  >
                    <SelectTrigger className="w-full bg-white">
                      <SelectValue placeholder="Código" />
                    </SelectTrigger>
                    <SelectContent>
                      {codeOptions.map((code) => (
                        <SelectItem key={code} value={code}>
                          {code}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <button
                  onClick={() => removeItem("contenidosActitudinales", item.id)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                  disabled={formData.contenidosActitudinales.length <= 1}
                >
                  <X size={20} />
                </button>
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
