import { useState, useEffect } from "react";
import { Info } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useCoordinator } from "../contexts/coordinator-context";
import { useSession } from "../../auth/hooks/use-session";
import { getRoleName } from "../../../common/constants/roles";
import { usePermissions, useSavePermissions } from "../hooks/permissions-query";

interface SyllabusSection {
  id: number;
  title: string;
  isEnabled: boolean;
  hasInfo: boolean;
}

export default function PermissionsManage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const teacherName = searchParams.get("teacherName") || "Docente";
  const courseCode = searchParams.get("courseCode") || "";
  const teacherEmail = searchParams.get("teacherEmail") || "";
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

  const { viewMode, selectedDocenteId, selectedSilaboId } = useCoordinator();

  // Obtener permisos del backend
  const { data: permissions = [], isLoading: permissionsLoading } =
    usePermissions(selectedDocenteId);

  // Mutation para guardar permisos
  const savePermissionsMutation = useSavePermissions();

  // Validar que haya información del docente
  useEffect(() => {
    if (!selectedDocenteId || !selectedSilaboId) {
      console.warn(
        "No se encontró información del docente o sílabo. Redirigiendo...",
      );
      // Podríamos redireccionar, pero por ahora solo advertimos
    }
  }, [selectedDocenteId, selectedSilaboId]);

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

  // Actualizar secciones cuando se cargan los permisos
  useEffect(() => {
    if (!permissionsLoading) {
      setSections((prevSections) =>
        prevSections.map((section) => ({
          ...section,
          isEnabled: permissions.some((p) => p.numeroSeccion === section.id),
        })),
      );
    }
  }, [permissions, permissionsLoading]);

  const handleToggle = (id: number) => {
    // En modo MICRO, los primeros 3 están bloqueados
    if (viewMode === "MICRO" && id <= 3) {
      return;
    }

    setSections((prevSections) =>
      prevSections.map((section) =>
        section.id === id
          ? { ...section, isEnabled: !section.isEnabled }
          : section,
      ),
    );
  };

  const isDisabled = (id: number) => {
    return viewMode === "MICRO" && id <= 3;
  };

  const handleSave = async () => {
    // Validar que haya un docenteId y silaboId
    if (!selectedDocenteId || !selectedSilaboId) {
      alert("Error: No se encontró información del docente o sílabo");
      return;
    }

    // Obtener las secciones habilitadas
    const enabledSections = sections
      .filter((section) => section.isEnabled)
      .map((section) => ({ numeroSeccion: section.id }));

    try {
      // Guardar permisos (puede ser un array vacío si no hay permisos)
      await savePermissionsMutation.mutateAsync({
        silaboId: selectedSilaboId,
        docenteId: selectedDocenteId,
        permisos: enabledSections,
      });

      // Navegar a la siguiente pantalla
      navigate(
        `/coordinator/send-email?courseCode=${encodeURIComponent(courseCode)}&teacherEmail=${encodeURIComponent(teacherEmail)}`,
      );
    } catch (error) {
      console.error("Error al guardar permisos:", error);
      alert("Error al guardar los permisos. Por favor, intente de nuevo.");
    }
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
        <button
          onClick={() => navigate(-1)}
          className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Atrás
        </button>
        <button
          onClick={handleSave}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={savePermissionsMutation.isPending || permissionsLoading}
        >
          {savePermissionsMutation.isPending ? "Guardando..." : "Siguiente"}
        </button>
      </div>
    </div>
  );
}
