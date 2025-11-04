import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSession } from "../../auth/hooks/use-session";
import type { Assignment } from "../../assignments/hooks/assignments-query";
import { useAllAssignments } from "../../assignments/hooks/assignments-query";
import { useCoordinator } from "../contexts/coordinator-context";
import { getRoleName } from "../../../common/constants/roles";

export default function PermissionsList() {
  const { user, isLoading: sessionLoading } = useSession();
  const navigate = useNavigate();

  // Validar que el usuario sea coordinadora
  useEffect(() => {
    if (!sessionLoading && user) {
      const roleName = getRoleName(user.role);
      if (roleName !== "coordinadora_academica") {
        navigate("/");
      }
    }
  }, [user, sessionLoading, navigate]);

  const {
    data: assignments = [],
    isLoading,
    isError,
    error,
  } = useAllAssignments();

  // Debug: verificar estructura de datos real
  useEffect(() => {
    if (assignments.length > 0) {
      console.log("✅ Assignments cargados:", assignments.length);
      console.log("✅ Áreas disponibles:", [
        ...new Set(assignments.map((a) => a.areaCurricular).filter(Boolean)),
      ]);
    }
  }, [assignments]);

  const {
    viewMode,
    setViewMode,
    setSelectedDocenteId,
    setSelectedSilaboId,
    setSelectedDocenteName,
    setSelectedDocenteEmail,
    setSelectedCourseName,
    setSelectedCourseCode,
  } = useCoordinator();

  const [searchTerm, setSearchTerm] = useState("");
  const [searchFilter, setSearchFilter] = useState<"curso" | "area">("curso");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  type AssignmentStatus =
    | "APROBADO"
    | "ANALIZANDO"
    | "DESAPROBADO"
    | "ASIGNADO";
  type FilterStatus = "ALL" | AssignmentStatus;
  const [selectedStatus, setSelectedStatus] = useState<FilterStatus>("ALL");

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".filter-dropdown-container")) {
        setShowFilterDropdown(false);
      }
    };

    if (showFilterDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showFilterDropdown]);

  const statusConfig: Record<
    AssignmentStatus,
    { label: string; color: string; textColor: string; bgColor: string }
  > = {
    APROBADO: {
      label: "Aprobado",
      color: "bg-green-500",
      textColor: "text-green-700",
      bgColor: "bg-green-50",
    },
    ANALIZANDO: {
      label: "Analizando",
      color: "bg-yellow-500",
      textColor: "text-yellow-700",
      bgColor: "bg-yellow-50",
    },
    DESAPROBADO: {
      label: "Desaprobado",
      color: "bg-red-500",
      textColor: "text-red-700",
      bgColor: "bg-red-50",
    },
    ASIGNADO: {
      label: "Asignado",
      color: "bg-blue-500",
      textColor: "text-blue-700",
      bgColor: "bg-blue-50",
    },
  };

  // Helper genérico para normalizar texto (quita acentos, controla chars, pasa a minúsculas)
  const normalize = (text?: string | null): string =>
    String(text ?? "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // remover diacríticos
      .trim();

  const filteredAssignments = assignments.filter((assignment: Assignment) => {
    const normalizedSearch = normalize(searchTerm);

    // Si no hay término de búsqueda, aceptar por defecto
    let matchesSearch = true;
    if (normalizedSearch !== "") {
      if (searchFilter === "curso") {
        // Buscar por nombre del sílabo y código de curso
        const courseText = `${assignment.cursoNombre ?? ""} ${assignment.cursoCodigo ?? ""}`;
        const normalizedCourse = normalize(courseText);
        matchesSearch = normalizedCourse.includes(normalizedSearch);

        // Debug: mostrar primer resultado de búsqueda
        if (assignments.indexOf(assignment) === 0) {
          console.log("🔍 Buscando en CURSO:", {
            searchTerm,
            normalizedSearch,
            courseText,
            normalizedCourse,
            match: matchesSearch,
          });
        }
      } else if (searchFilter === "area") {
        const areaText = assignment.areaCurricular ?? "";
        const normalizedArea = normalize(areaText);

        // Búsqueda flexible: coincide si el área contiene el término buscado
        matchesSearch = normalizedArea.includes(normalizedSearch);

        // Debug: mostrar primer resultado de búsqueda
        if (assignments.indexOf(assignment) === 0) {
          console.log("🔍 Buscando en ÁREA:", {
            searchTerm,
            normalizedSearch,
            areaText,
            normalizedArea,
            match: matchesSearch,
          });
        }
      }
    }

    const matchesStatus =
      selectedStatus === "ALL" || assignment.estadoRevision === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  // Log para debug de filtrado
  useEffect(() => {
    if (searchTerm) {
      console.log(
        `🔍 Filtrado: "${searchTerm}" (${searchFilter}) → ${filteredAssignments.length} de ${assignments.length} resultados`,
      );
    }
  }, [
    searchTerm,
    searchFilter,
    filteredAssignments.length,
    assignments.length,
  ]);

  if (sessionLoading || isLoading) {
    return (
      <div className="p-6 text-center text-gray-600">
        Cargando asignaciones...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 text-center text-red-500">
        Error: {error?.message}
      </div>
    );
  }

  return (
    <div className="p-6 w-full mx-auto" style={{ maxWidth: "1600px" }}>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Asignaturas</h1>
        {/* Debug badge: should appear if this component bundle is loaded */}
        <div className="flex items-center gap-4 mb-4">
          <div className="text-xs text-gray-400">
            Mostrando {filteredAssignments.length} de {assignments.length}{" "}
            cursos
          </div>
        </div>{" "}
        {/* Toggle Micro/Macro */}
        <div className="flex items-center gap-3 mb-6">
          <span
            className={`text-sm font-medium transition-colors ${viewMode === "MICRO" ? "text-gray-900" : "text-gray-400"}`}
          >
            Micro
          </span>
          <button
            onClick={() => {
              const newMode = viewMode === "MICRO" ? "MACRO" : "MICRO";
              setViewMode(newMode);
            }}
            className="relative inline-flex h-8 w-16 items-center rounded-full bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            style={{
              backgroundColor: viewMode === "MACRO" ? "#4B5563" : "#D1D5DB",
            }}
          >
            <span
              className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-lg transition-transform ${
                viewMode === "MACRO" ? "translate-x-9" : "translate-x-1"
              }`}
            />
          </button>
          <span
            className={`text-sm font-medium transition-colors ${viewMode === "MACRO" ? "text-gray-900" : "text-gray-400"}`}
          >
            Macro
          </span>
        </div>
        {/* Search Bar con Filtro integrado */}
        <div className="relative max-w-md mb-6 filter-dropdown-container">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder={`Buscar por ${searchFilter === "curso" ? "Nombre de Curso o Código" : "Área Curricular"}`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClick={() => setShowFilterDropdown(true)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />

            {/* Badge visible del filtro activo */}
            {searchTerm && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded pointer-events-none">
                {searchFilter === "curso" ? "🔍 Curso" : "🔍 Área"}
              </div>
            )}

            {/* Dropdown menu de filtros dentro del input */}
            {showFilterDropdown && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                <div className="px-3 py-2 border-b border-gray-200 bg-gray-50">
                  <span className="text-xs font-semibold text-gray-600 uppercase">
                    Filtrar por:
                  </span>
                </div>
                <button
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setSearchFilter("area");
                    setShowFilterDropdown(false);
                    setSearchTerm("");
                  }}
                  className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors flex items-center gap-3 ${searchFilter === "area" ? "bg-blue-50" : ""}`}
                >
                  <div
                    className={`w-3 h-3 rounded-full ${searchFilter === "area" ? "bg-green-500" : "bg-gray-300"}`}
                  ></div>
                  <span
                    className={`text-sm font-medium ${searchFilter === "area" ? "text-blue-700" : "text-gray-700"}`}
                  >
                    Área Curricular
                  </span>
                </button>
                <button
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setSearchFilter("curso");
                    setShowFilterDropdown(false);
                    setSearchTerm("");
                  }}
                  className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors flex items-center gap-3 ${searchFilter === "curso" ? "bg-blue-50" : ""}`}
                >
                  <div
                    className={`w-3 h-3 rounded-full ${searchFilter === "curso" ? "bg-green-500" : "bg-gray-300"}`}
                  ></div>
                  <span
                    className={`text-sm font-medium ${searchFilter === "curso" ? "text-blue-700" : "text-gray-700"}`}
                  >
                    Nombre de Curso
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>
        {/* Filtros por estado */}
        <div className="flex gap-2 mb-6 flex-wrap">
          <button
            onClick={() => setSelectedStatus("ALL")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              selectedStatus === "ALL"
                ? "bg-blue-500 text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <span className="text-sm">Todos</span>
            <span className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded-full text-black">
              {assignments.length}
            </span>
          </button>

          {(Object.keys(statusConfig) as AssignmentStatus[]).map((key) => {
            const cfg = statusConfig[key];
            const count = assignments.filter(
              (a) => a.estadoRevision === key,
            ).length;
            const isSelected = selectedStatus === key;
            return (
              <button
                key={key}
                onClick={() => setSelectedStatus(key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  isSelected
                    ? `${cfg.color} text-white shadow-md`
                    : `${cfg.bgColor} ${cfg.textColor} hover:shadow-sm`
                }`}
              >
                <div
                  className={`w-3 h-3 rounded-full ${isSelected ? "bg-white bg-opacity-30" : cfg.color}`}
                ></div>
                <span className="text-sm">{cfg.label}</span>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${isSelected ? "bg-white bg-opacity-20" : "bg-white bg-opacity-60"}`}
                >
                  <span className="text-black">{count}</span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Assignments List */}
      <div
        className="space-y-4"
        key={`list-${searchTerm}-${searchFilter}-${selectedStatus}`}
      >
        {filteredAssignments.map((assignment: Assignment) => (
          <div
            key={`${assignment.cursoCodigo}-${assignment.docenteId}`}
            className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer"
            onClick={() => {
              // Guardar toda la información en el contexto
              setSelectedDocenteId(assignment.docenteId);
              setSelectedSilaboId(assignment.syllabusId ?? null);
              setSelectedDocenteName(assignment.nombreDocente ?? "Docente");
              setSelectedDocenteEmail(assignment.docenteEmail ?? null);
              setSelectedCourseName(assignment.cursoNombre);
              setSelectedCourseCode(assignment.cursoCodigo);

              navigate(
                `/coordinator/permissions/manage?courseName=${encodeURIComponent(assignment.cursoNombre)}&teacherName=${encodeURIComponent(assignment.nombreDocente || "Docente")}&courseCode=${encodeURIComponent(assignment.cursoCodigo)}&teacherEmail=${encodeURIComponent(assignment.docenteEmail || "")}`,
              );
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                <div className="flex flex-col">
                  <h3 className="text-lg font-medium text-gray-800">
                    {assignment.cursoNombre}
                  </h3>
                  {assignment.nombreDocente && (
                    <p className="text-sm text-gray-500">
                      {assignment.nombreDocente}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3">
                {(() => {
                  const cfg = statusConfig[
                    assignment.estadoRevision as AssignmentStatus
                  ] ?? {
                    label: assignment.estadoRevision,
                    color: "bg-gray-400",
                    textColor: "text-gray-700",
                    bgColor: "bg-gray-100",
                  };
                  return (
                    <div
                      className={`flex items-center gap-2 px-2 py-1 rounded ${cfg.bgColor} ${cfg.textColor}`}
                    >
                      <div
                        className={`w-3 h-3 rounded-full ${cfg.color}`}
                      ></div>
                      <span className="text-xs font-semibold">{cfg.label}</span>
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredAssignments.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg mb-2">No se encontraron asignaciones</p>
          <p className="text-sm">
            Buscando: "{searchTerm}" en{" "}
            {searchFilter === "curso" ? "Nombre de Curso" : "Área Curricular"}
          </p>
        </div>
      )}
    </div>
  );
}
