import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// Componente Switch personalizado
interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

function Switch({ checked, onChange }: SwitchProps) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        checked ? "bg-blue-600" : "bg-gray-300"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          checked ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}

interface SectionPermission {
  id: string;
  name: string;
  enabled: boolean;
}

export default function PermissionsManage() {
  // const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Mock data - reemplazar con datos del backend
  const [teacherName] = useState("Norma Birginia Leon Lescano");
  const [courseName] = useState("Taller de Proyectos");

  const [sections, setSections] = useState<SectionPermission[]>([
    { id: "1", name: "Datos Generales", enabled: false },
    { id: "2", name: "Sumilla", enabled: false },
    { id: "3", name: "Competencias y Componentes", enabled: false },
    { id: "4", name: "Unidades", enabled: false },
    { id: "5", name: "Estrategias Metodológicas", enabled: false },
    { id: "6", name: "Recursos Didácticos", enabled: false },
    { id: "7", name: "Evaluación del Aprendizaje", enabled: false },
    { id: "8", name: "Fuentes de Consulta", enabled: false },
    {
      id: "9",
      name: "Aporte de la Asignatura al logro de resultados",
      enabled: false,
    },
  ]);

  const handleToggle = (sectionId: string) => {
    setSections((prev) =>
      prev.map((section) =>
        section.id === sectionId
          ? { ...section, enabled: !section.enabled }
          : section,
      ),
    );
  };

  const handleSave = () => {
    console.log("Guardando permisos:", sections);
    // Aquí iría la llamada al backend
    navigate("/coordinator/permissions");
  };

  const handleGoBack = () => {
    navigate("/coordinator/permissions");
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="bg-white border border-gray-300 rounded-lg p-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-black mb-2">
            1. Gestión de Secciones del Silabo
          </h1>
          <h2 className="text-xl font-semibold text-black mb-4">
            {teacherName}
          </h2>
          <p className="text-gray-600">{courseName}</p>
        </div>

        {/* Sections List */}
        <div className="space-y-3 mb-8">
          {sections.map((section, index) => (
            <div
              key={section.id}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
            >
              <span className="text-gray-800">
                {index + 1}. {section.name}
              </span>
              <Switch
                checked={section.enabled}
                onChange={() => handleToggle(section.id)}
              />
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-6">
          <button
            onClick={handleGoBack}
            className="flex items-center gap-2 px-6 py-2.5 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Atrás</span>
          </button>
          <button
            onClick={handleSave}
            className="px-8 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Siguiente &gt;
          </button>
        </div>
      </div>
    </div>
  );
}
