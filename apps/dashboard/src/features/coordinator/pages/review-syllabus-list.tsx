import { useState, useEffect, useMemo } from "react";
import { Search } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  useSyllabusInReview,
  type SyllabusReview,
} from "../hooks/syllabus-review-query";

type SyllabusStatus = "ANALIZANDO" | "VALIDADO" | "DESAPROBADO" | "ASIGNADO";
type FilterStatus = "ALL" | SyllabusStatus;

export default function ReviewSyllabusList() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<FilterStatus>("ALL");

  // Obtener datos del backend
  const {
    data: syllabusListFromAPI,
    isLoading,
    isError,
    refetch,
  } = useSyllabusInReview();

  // Efecto para forzar refetch cuando vuelves de la página de resumen
  useEffect(() => {
    const refreshParam = searchParams.get("refresh");
    if (refreshParam) {
      refetch();
      // Limpiar el parámetro refresh de la URL sin recargar
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.delete("refresh");
      window.history.replaceState(
        {},
        "",
        `${window.location.pathname}${newSearchParams.toString() ? "?" + newSearchParams.toString() : ""}`,
      );
    }
  }, [searchParams, refetch]);

  // Usar solo datos del backend (sin fallback a mock)
  const syllabusList = useMemo(() => {
    return Array.isArray(syllabusListFromAPI) ? syllabusListFromAPI : [];
  }, [syllabusListFromAPI]);

  // Configuración de estados
  const statusConfig: Record<
    SyllabusStatus,
    { label: string; color: string; textColor: string; bgColor: string }
  > = {
    ASIGNADO: {
      label: "Asignado",
      color: "bg-blue-500",
      textColor: "text-blue-700",
      bgColor: "bg-blue-50",
    },
    ANALIZANDO: {
      label: "Analizado",
      color: "bg-yellow-500",
      textColor: "text-yellow-700",
      bgColor: "bg-yellow-50",
    },
    VALIDADO: {
      label: "Validado",
      color: "bg-green-500",
      textColor: "text-green-700",
      bgColor: "bg-green-50",
    },
    DESAPROBADO: {
      label: "Desaprobado",
      color: "bg-red-500",
      textColor: "text-red-700",
      bgColor: "bg-red-50",
    },
  };

  const filteredSyllabi = useMemo(() => {
    console.log("🔍 [FILTER] Recalculating filter", {
      totalSyllabi: syllabusList.length,
      selectedStatus,
      searchTerm,
    });

    const result = syllabusList.filter((syllabus) => {
      // Validar que el objeto syllabus existe y tiene las propiedades necesarias
      if (!syllabus || typeof syllabus !== "object") {
        return false;
      }

      // Validar que los campos existan antes de aplicar toLowerCase
      const courseName = syllabus.courseName?.toLowerCase() || "";
      const courseCode = syllabus.courseCode || "";
      const teacherName = syllabus.teacherName?.toLowerCase() || "";
      const searchLower = searchTerm.toLowerCase();

      // Filtro por búsqueda de texto
      const matchesSearch =
        !searchTerm || // Si no hay término de búsqueda, pasar todos
        courseName.includes(searchLower) ||
        courseCode.includes(searchTerm) ||
        teacherName.includes(searchLower);

      // Filtro por estado
      const matchesStatus =
        selectedStatus === "ALL" || syllabus.status === selectedStatus;

      const passes = matchesSearch && matchesStatus;

      // Debug individual
      if (selectedStatus !== "ALL") {
        console.log(
          `🔎 Checking syllabus: "${syllabus.courseName}" - Status: ${syllabus.status} - Passes: ${passes}`,
        );
      }

      return passes;
    });

    console.log(`✅ [FILTER] Result: ${result.length} syllabi passed filter`);
    if (selectedStatus !== "ALL") {
      console.log(
        `📋 [FILTER] Filtered courses:`,
        result.map((s) => `${s.courseName} (${s.status})`),
      );
    }

    return result;
  }, [syllabusList, selectedStatus, searchTerm]);

  const handleReviewSyllabus = (syllabus: SyllabusReview) => {
    // Debug: registrar navegación solicitada
    // Esto ayuda a verificar en la consola si el handler se ejecuta
    // y qué valores se están pasando.
    // handler called

    // Algunos items vienen con `id` vacío ('') pero contienen `syllabusId`.
    // Preferimos usar `id` (registro de revisión). Si está vacío, fallback a `syllabusId`.
    const routeId =
      syllabus.id && String(syllabus.id).trim() !== ""
        ? syllabus.id
        : String(syllabus.syllabusId || "");

    const url = `/coordinator/review-syllabus/${routeId}?docenteId=${syllabus.docenteId}&syllabusId=${syllabus.syllabusId}&courseName=${encodeURIComponent(
      syllabus.courseName,
    )}&courseCode=${encodeURIComponent(syllabus.courseCode)}&teacherName=${encodeURIComponent(
      syllabus.teacherName,
    )}`;

    if (!routeId) {
      // Si no hay id ni syllabusId, no navegar
      return;
    }

    navigate(url);
  };

  return (
    <div className="p-6 w-full mx-auto" style={{ maxWidth: "1600px" }}>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Revisión de Sílabos
        </h1>

        {/* Loading state - Solo mostrar si no hay datos en absoluto */}
        {isLoading && !syllabusList.length && (
          <div className="text-center py-12 text-gray-500">
            Cargando sílabos...
          </div>
        )}

        {/* Error state o usando mock data */}
        {(isError ||
          !syllabusListFromAPI ||
          syllabusListFromAPI.length === 0) && (
          <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-700">
              {isError
                ? "No se pudieron cargar los sílabos desde el servidor."
                : "El servidor no devolvió datos."}{" "}
              Mostrando datos de ejemplo.
            </p>
          </div>
        )}

        {/* Search Bar */}
        <div className="relative flex-1 max-w-md mb-6">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Buscar por curso, código o docente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
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
              {syllabusList.length}
            </span>
          </button>

          {(Object.keys(statusConfig) as SyllabusStatus[]).map((key) => {
            const cfg = statusConfig[key];
            const count = syllabusList.filter(
              (s) => s && s.status === key,
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

      {/* Syllabi List */}
      <div className="space-y-4">
        {(() => {
          console.log(
            "🎨 [RENDER] Rendering syllabi. Count to render:",
            filteredSyllabi.length,
          );
          return null;
        })()}
        {filteredSyllabi.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No se encontraron sílabos para los filtros seleccionados
          </div>
        )}
        {filteredSyllabi.map((syllabus) => (
          <a
            key={syllabus.id}
            href={`/coordinator/review-syllabus/${syllabus.id}?docenteId=${syllabus.docenteId}&syllabusId=${syllabus.syllabusId}&courseName=${encodeURIComponent(
              syllabus.courseName,
            )}&courseCode=${encodeURIComponent(syllabus.courseCode)}&teacherName=${encodeURIComponent(
              syllabus.teacherName,
            )}`}
            onClick={(e) => {
              e.preventDefault();
              handleReviewSyllabus(syllabus);
            }}
            className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer block"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 flex-1">
                <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                <div>
                  <h3 className="text-lg font-medium text-gray-800">
                    {syllabus.courseName || "Sin nombre"}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Código: {syllabus.courseCode || "N/A"}
                  </p>
                  <p className="text-sm text-gray-600">
                    Docente: {syllabus.teacherName || "No asignado"}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Enviado:{" "}
                    {syllabus.submittedDate
                      ? new Date(syllabus.submittedDate).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {(() => {
                  const cfg = statusConfig[syllabus.status];
                  if (!cfg) return null;
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
          </a>
        ))}
      </div>

      {filteredSyllabi.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No se encontraron sílabos que coincidan con tu búsqueda.
        </div>
      )}
    </div>
  );
}
