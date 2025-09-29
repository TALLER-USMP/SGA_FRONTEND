import { useState } from "react";
import { ChevronRight, Plus } from "lucide-react";

interface ConsultationSourcesData {
  week: string;
  didacticResources: string;
  sources: string[];
}

interface Step7Props {
  data?: ConsultationSourcesData;
  onChange?: (data: ConsultationSourcesData) => void;
}

export default function Step7({ data, onChange }: Step7Props) {
  const [formData, setFormData] = useState<ConsultationSourcesData>(
    data || {
      week: "Semana 1",
      didacticResources: "",
      sources: ["", "", ""],
    },
  );

  const updateFormData = (newData: ConsultationSourcesData) => {
    setFormData(newData);
    if (onChange) {
      onChange(newData);
    }
  };

  const addSource = () => {
    const newData = {
      ...formData,
      sources: [...formData.sources, ""],
    };
    updateFormData(newData);
  };

  const removeSource = (index: number) => {
    const newData = {
      ...formData,
      sources: formData.sources.filter((_, i) => i !== index),
    };
    updateFormData(newData);
  };

  const updateSource = (index: number, value: string) => {
    const newData = {
      ...formData,
      sources: formData.sources.map((source, i) =>
        i === index ? value : source,
      ),
    };
    updateFormData(newData);
  };

  const updateWeek = (week: string) => {
    const newData = { ...formData, week };
    updateFormData(newData);
  };

  const updateDidacticResources = (didacticResources: string) => {
    const newData = { ...formData, didacticResources };
    updateFormData(newData);
  };

  return (
    <div className="space-y-6">
      <div className="text-lg font-semibold">7. Fuentes de consulta</div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Lado izquierdo */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Selecciona una semana
            </label>
            <div className="relative">
              <select
                value={formData.week}
                onChange={(e) => updateWeek(e.target.value)}
                className="w-full bg-black text-white p-3 rounded-lg appearance-none pr-10"
              >
                <option value="Semana 1">Semana 1</option>
                <option value="Semana 2">Semana 2</option>
                <option value="Semana 3">Semana 3</option>
                <option value="Semana 4">Semana 4</option>
              </select>
              <ChevronRight className="absolute right-3 top-1/2 transform -rotate-90 text-white w-4 h-4" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Recursos didácticos
            </label>
            <div className="relative">
              <textarea
                value={formData.didacticResources}
                onChange={(e) => updateDidacticResources(e.target.value)}
                className="w-full h-40 p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Escribe los recursos didácticos..."
              />
              <div className="absolute bottom-3 right-3">
                <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm">
                  i
                </span>
              </div>
              <div className="absolute bottom-2 right-12 text-xs text-gray-500">
                {formData.didacticResources.length}/400
              </div>
            </div>
          </div>
        </div>

        {/* Lado derecho */}
        <div>
          <label className="block text-sm font-medium mb-2">
            1. Fuentes de consulta
          </label>
          <div className="space-y-3">
            {formData.sources.map((source, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="text"
                  value={source}
                  onChange={(e) => updateSource(index, e.target.value)}
                  className="flex-1 p-3 bg-gray-200 rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={`Fuente de consulta ${index + 1}`}
                />
                <button
                  onClick={() => removeSource(index)}
                  className="p-2 text-gray-500 hover:text-red-500"
                >
                  <span className="text-xl">•</span>
                  <span className="text-xl">•</span>
                </button>
              </div>
            ))}

            <button
              onClick={addSource}
              className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-500 hover:text-blue-500 flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Agregar fuente
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
