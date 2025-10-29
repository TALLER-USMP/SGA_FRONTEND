import { useState, useEffect } from "react";
import { Info } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { useCoordinator } from "../../contexts/CoordinatorContext";
import { useSession } from "../../contexts/useSession";
import { getRoleName } from "../../constants/roles";

interface SyllabusSection {
  id: number;
  title: string;
  isEnabled: boolean;
  hasInfo: boolean;
}

export default function SyllabusManagement() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const teacherName = searchParams.get("teacherName") || "Docente";
  const { user, isLoading: sessionLoading } = useSession();

  // Validar que el usuario sea coordinadora
  useEffect(() => {
    if (!sessionLoading && user) {
      const roleName = getRoleName(user.role);
      if (roleName !== "coordinadora_academica") {
        navigate("/");
      }
    }
  }, [user, sessionLoading, navigate]);

  const { viewMode } = useCoordinator();

  const [sections, setSections] = useState<SyllabusSection[]>([
    { id: 1, title: "Datos generales", isEnabled: false, hasInfo: true },
    { id: 2, title: "Sumilla", isEnabled: false, hasInfo: true },
    {
      id: 3,
      title: "Competencias y componentes",
      isEnabled: false,
      hasInfo: true,
    },
    {
      id: 4,
      title: "Programacion del contenido",
      isEnabled: false,
      hasInfo: false,
    },
    {
      id: 5,
      title: "Estrategias metodologicas",
      isEnabled: false,
      hasInfo: false,
    },
    { id: 6, title: "Recursos didacticos", isEnabled: false, hasInfo: false },
    {
      id: 7,
      title: "Evaluacion de aprendizaje",
      isEnabled: false,
      hasInfo: false,
    },
    { id: 8, title: "Fuentes de consulta", isEnabled: false, hasInfo: false },
    { id: 9, title: "Resultados (outcomes)", isEnabled: false, hasInfo: false },
  ]);

  const handleToggle = (id: number) => {
    // En modo MICRO, los primeros 3 están bloqueados
    if (viewMode === "MICRO" && id <= 3) {
      return;
    }

    setSections(
      sections.map((section) =>
        section.id === id
          ? { ...section, isEnabled: !section.isEnabled }
          : section,
      ),
    );
  };

  const isDisabled = (id: number) => {
    return viewMode === "MICRO" && id <= 3;
  };

  return (
    <div className="p-6 w-full mx-auto" style={{ maxWidth: "1400px" }}>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          I. Gestión de Secciones del Sílabo
        </h1>
        <p className="text-lg text-gray-700 font-medium">{teacherName}</p>
      </div>

      {/* Lista de secciones */}
      <div className="space-y-3">
        {sections.map((section) => {
          const disabled = isDisabled(section.id);
          return (
            <div
              key={section.id}
              className={`bg-white border border-gray-300 rounded-lg p-4 flex items-center justify-between hover:shadow-md transition-shadow ${
                disabled ? "opacity-50" : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-gray-700 font-medium">
                  {section.id}. {section.title}
                </span>
              </div>

              <div className="flex items-center gap-3">
                {/* Toggle Switch */}
                <button
                  onClick={() => handleToggle(section.id)}
                  disabled={disabled}
                  className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    disabled ? "cursor-not-allowed" : ""
                  }`}
                  style={{
                    backgroundColor: section.isEnabled ? "#4B5563" : "#D1D5DB",
                  }}
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition-transform ${
                      section.isEnabled ? "translate-x-8" : "translate-x-1"
                    }`}
                  />
                </button>

                {/* Info Icon */}
                {section.hasInfo && (
                  <button
                    className="p-1 text-blue-500 hover:text-blue-700 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      // TODO: Implementar modal de información de sección
                    }}
                  >
                    <Info size={20} />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Botones de navegación */}
      <div className="flex gap-2 justify-between w-full mt-8">
        <Button
          onClick={() => navigate(-1)}
          variant="outline"
          className="px-6 py-2"
        >
          Atrás
        </Button>
        <Button
          onClick={() => {
            // TODO: Validar que al menos una sección esté habilitada
            navigate(
              `/coordinator/send-to-teacher?teacherName=${encodeURIComponent(teacherName)}&courseCode=${searchParams.get("courseCode") || ""}`,
            );
          }}
          className="px-6 py-2"
        >
          Siguiente
        </Button>
      </div>
    </div>
  );
}
