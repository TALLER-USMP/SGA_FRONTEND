import { useState } from "react";
import { Plus } from "lucide-react";

interface ContributionsData {
  bibliography: string;
  contributionType: string;
  contributionsList: string[];
}

interface Step9Props {
  data?: ContributionsData;
  onChange?: (data: ContributionsData) => void;
}

export default function Step9({ data, onChange }: Step9Props) {
  const [formData, setFormData] = useState<ContributionsData>(
    data || {
      bibliography:
        "Analizar un sistema complejo de computacion y aplicar principios de computacion y otras disciplinas relevantes para identificar soluciones",
      contributionType: "k= Clave R",
      contributionsList: [
        "Analizar un sistema complejo de computacion y aplicar principios de computacion y otras disciplinas relevantes para identificar soluciones",
        "Analizar un sistema complejo de computacion y aplicar principios de computacion y otras disciplinas relevantes para identificar soluciones",
        "Analizar un sistema complejo de computacion y aplicar principios de computacion y otras disciplinas relevantes para identificar soluciones",
      ],
    },
  );

  const updateFormData = (newData: ContributionsData) => {
    setFormData(newData);
    if (onChange) {
      onChange(newData);
    }
  };

  const addContribution = () => {
    const newData = {
      ...formData,
      contributionsList: [...formData.contributionsList, ""],
    };
    updateFormData(newData);
  };

  const removeContribution = (index: number) => {
    const newData = {
      ...formData,
      contributionsList: formData.contributionsList.filter(
        (_, i) => i !== index,
      ),
    };
    updateFormData(newData);
  };

  const updateContribution = (index: number, value: string) => {
    const newData = {
      ...formData,
      contributionsList: formData.contributionsList.map((contribution, i) =>
        i === index ? value : contribution,
      ),
    };
    updateFormData(newData);
  };

  const updateBibliography = (bibliography: string) => {
    const newData = { ...formData, bibliography };
    updateFormData(newData);
  };

  const updateContributionType = (contributionType: string) => {
    const newData = { ...formData, contributionType };
    updateFormData(newData);
  };

  return (
    <div className="space-y-4 w-full">
      <div className="text-lg font-semibold">
        9. Aportes de la asignatura al logro de resultados
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Lado izquierdo */}
        <div className="space-y-4 lg:col-span-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Bibliografia
            </label>
            <div className="relative">
              <textarea
                value={formData.bibliography}
                onChange={(e) => updateBibliography(e.target.value)}
                className="w-full h-32 p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Analizar un sistema complejo de computacion y aplicar principios de computacion y otras disciplinas relevantes para identificar soluciones"
              />
              <div className="absolute bottom-2 right-2 text-xs text-gray-500">
                {formData.bibliography.length}/400
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Tipo de Aporte
            </label>
            <div className="relative">
              <select
                value={formData.contributionType}
                onChange={(e) => updateContributionType(e.target.value)}
                className="w-full bg-black text-white p-3 rounded-lg appearance-none pr-10"
              >
                <option value="k= Clave R">k= Clave R</option>
                <option value="k= Clave V">k= Clave V</option>
                <option value="k= Clave A">k= Clave A</option>
              </select>
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white text-sm">
                V
              </span>
            </div>

            <button
              onClick={addContribution}
              className="mt-3 flex items-center gap-2 text-blue-500 hover:text-blue-600"
            >
              <Plus className="w-4 h-4" />
              Agregar Aporte
            </button>
          </div>
        </div>

        {/* Lado derecho */}
        <div className="lg:col-span-8">
          <label className="block text-sm font-medium mb-2">
            Lista de Aportes de la Asignatura
          </label>
          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
            {formData.contributionsList.map((contribution, index) => (
              <div key={index} className="flex items-start gap-2">
                <textarea
                  value={contribution}
                  onChange={(e) => updateContribution(index, e.target.value)}
                  className="flex-1 p-2 bg-gray-200 rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none min-h-[50px] text-sm"
                  placeholder="Analizar un sistema complejo de computacion y aplicar principios de computacion y otras disciplinas relevantes para identificar soluciones"
                />
                <div className="flex flex-col items-center gap-1 pt-2">
                  <span className="text-xs text-gray-500">k= Clave R</span>
                  <button
                    onClick={() => removeContribution(index)}
                    className="p-1 text-gray-500 hover:text-red-500"
                  >
                    <span className="text-xl">•</span>
                    <span className="text-xl">•</span>
                  </button>
                </div>
              </div>
            ))}

            <button
              onClick={addContribution}
              className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-500 hover:text-blue-500 flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Agregar Aporte
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
