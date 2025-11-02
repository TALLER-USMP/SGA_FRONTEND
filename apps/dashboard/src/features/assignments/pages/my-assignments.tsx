import { useState, useEffect } from "react";
import { Search, Eye, Edit, X, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { pdf, PDFViewer } from "@react-pdf/renderer";
import { useSession } from "../../auth/hooks/use-session";
import { useAssignments, type Assignment } from "../hooks/assignments-query";
import { syllabusPDFService } from "../../syllabus/services/syllabus-pdf-service";
import { SyllabusPDFDocument } from "../../syllabus/components/SyllabusPDFDocument";
import type { CompleteSyllabus } from "../../syllabus/types/complete-syllabus";

export default function MyAssignments() {
  const { user, isLoading: sessionLoading } = useSession();
  const docenteId = user?.id as number | string | undefined;
  const {
    data: assignments = [],
    isLoading,
    isError,
    error,
  } = useAssignments(docenteId);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAssignment, setSelectedAssignment] =
    useState<Assignment | null>(null);
  const [isDownloadingPDF, setIsDownloadingPDF] = useState(false);
  const [syllabusData, setSyllabusData] = useState<CompleteSyllabus | null>(
    null,
  );
  const [isLoadingSyllabus, setIsLoadingSyllabus] = useState(false);
  const [syllabusError, setSyllabusError] = useState<string | null>(null);
  type AssignmentStatus =
    | "APROBADO"
    | "ANALIZANDO"
    | "DESAPROBADO"
    | "ASIGNADO"
    | "NUEVO";
  type FilterStatus = "ALL" | AssignmentStatus;
  const [selectedStatus, setSelectedStatus] = useState<FilterStatus>("ALL");
  const navigate = useNavigate();

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
    NUEVO: {
      label: "Nuevo",
      color: "bg-purple-500",
      textColor: "text-purple-700",
      bgColor: "bg-purple-50",
    },
  };

  const filteredAssignments = assignments.filter((assignment: Assignment) => {
    const matchesSearch = assignment.cursoNombre
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      selectedStatus === "ALL" || assignment.estadoRevision === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const handleViewAssignment = (assignment: Assignment) => {
    setSelectedAssignment(assignment);
  };

  useEffect(() => {
    const loadSyllabusData = async () => {
      if (!selectedAssignment?.syllabusId) {
        setSyllabusData(null);
        return;
      }

      setIsLoadingSyllabus(true);
      setSyllabusError(null);
      try {
        console.log(
          `📥 Cargando sílabo ID: ${selectedAssignment.syllabusId}...`,
        );
        const data = await syllabusPDFService.fetchCompleteSyllabus(
          selectedAssignment.syllabusId,
        );
        setSyllabusData(data);
        console.log("✅ Datos del sílabo cargados");
      } catch (err) {
        const errorMsg =
          err instanceof Error ? err.message : "Error al cargar sílabo";
        setSyllabusError(errorMsg);
        console.error("❌ Error:", errorMsg);
      } finally {
        setIsLoadingSyllabus(false);
      }
    };

    loadSyllabusData();
  }, [selectedAssignment?.syllabusId]);

  const handleEditAssignment = (
    codigo: string,
    syllabusId?: number,
    estado?: string,
  ) => {
    if (estado === "NUEVO") {
      navigate(`/syllabus?codigo=${codigo}&mode=create`);
    } else if (syllabusId) {
      navigate(`/syllabus?codigo=${codigo}&id=${syllabusId}&mode=edit`);
    } else {
      navigate(`/syllabus?codigo=${codigo}&mode=edit`);
    }
  };

  const handleDownloadPDF = async () => {
    if (!syllabusData) {
      alert("No hay datos del sílabo cargados");
      return;
    }

    setIsDownloadingPDF(true);
    try {
      console.log("� Generando PDF para descarga...");
      const blob = await pdf(
        <SyllabusPDFDocument data={syllabusData} />,
      ).toBlob();

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `silabo-${selectedAssignment?.cursoNombre.replace(/\s+/g, "-")}.pdf`;
      link.click();
      URL.revokeObjectURL(url);

      console.log("✅ PDF descargado exitosamente");
    } catch (err) {
      console.error("❌ Error al generar PDF:", err);
      alert(
        "Error al generar PDF: " + (err instanceof Error ? err.message : ""),
      );
    } finally {
      setIsDownloadingPDF(false);
    }
  };

  const closeModal = () => {
    setSelectedAssignment(null);
    setSyllabusData(null);
    setSyllabusError(null);
  };

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
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Mis Asignaciones
        </h1>

        <div className="relative flex-1 max-w-md mb-6">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Buscar curso..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

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

      <div className="space-y-4">
        {filteredAssignments.map((assignment: Assignment) => (
          <div
            key={assignment.cursoCodigo}
            className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                <h3 className="text-lg font-medium text-gray-800">
                  {assignment.cursoNombre}
                </h3>
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

                {(assignment.estadoRevision === "DESAPROBADO" ||
                  assignment.estadoRevision === "ASIGNADO" ||
                  assignment.estadoRevision === "NUEVO") && (
                  <button
                    onClick={() =>
                      handleEditAssignment(
                        assignment.cursoCodigo,
                        assignment.syllabusId,
                        assignment.estadoRevision,
                      )
                    }
                    className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                    title={
                      assignment.estadoRevision === "NUEVO"
                        ? "Crear nuevo sílabo"
                        : assignment.estadoRevision === "DESAPROBADO"
                          ? "Corregir sílabo desaprobado"
                          : "Editar sílabo asignado"
                    }
                  >
                    <Edit size={18} />
                  </button>
                )}

                <button
                  onClick={() => handleViewAssignment(assignment)}
                  className="p-2 text-gray-500 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <Eye size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredAssignments.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No se encontraron asignaciones que coincidan con tu búsqueda.
        </div>
      )}

      {selectedAssignment && (
        <div className="fixed inset-0 bg-black/45 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl h-[90vh] p-6 relative flex flex-col">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors z-10"
            >
              <X size={24} />
            </button>

            <div className="mb-4 pr-10">
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                {selectedAssignment.cursoNombre}
              </h2>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span>
                  Estado:{" "}
                  <span className="font-medium">
                    {selectedAssignment.estadoRevision}
                  </span>
                </span>
                {selectedAssignment.syllabusId && (
                  <span>ID: {selectedAssignment.syllabusId}</span>
                )}
              </div>
            </div>

            <div className="flex-1 overflow-hidden flex flex-col">
              {isLoadingSyllabus && (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Cargando vista previa...</p>
                  </div>
                </div>
              )}

              {syllabusError && !isLoadingSyllabus && (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center text-red-500">
                    <div className="mb-4">
                      <div className="w-16 h-16 bg-red-100 rounded-lg mx-auto flex items-center justify-center">
                        <X size={32} className="text-red-500" />
                      </div>
                    </div>
                    <p className="text-lg font-medium">
                      Error al cargar sílabo
                    </p>
                    <p className="text-sm mt-2">{syllabusError}</p>
                  </div>
                </div>
              )}

              {!selectedAssignment.syllabusId && !isLoadingSyllabus && (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <div className="mb-4">
                      <div className="w-16 h-16 bg-gray-200 rounded-lg mx-auto flex items-center justify-center">
                        <Eye size={32} className="text-gray-400" />
                      </div>
                    </div>
                    <p className="text-lg font-medium">
                      No hay sílabo disponible
                    </p>
                    <p className="text-sm mt-2">
                      Este curso no tiene un sílabo asignado
                    </p>
                  </div>
                </div>
              )}

              {syllabusData && !isLoadingSyllabus && !syllabusError && (
                <div className="flex-1 border border-gray-300 rounded-lg overflow-hidden">
                  <PDFViewer
                    width="100%"
                    height="100%"
                    showToolbar={true}
                    className="rounded-lg"
                  >
                    <SyllabusPDFDocument data={syllabusData} />
                  </PDFViewer>
                </div>
              )}
            </div>

            {syllabusData && !syllabusError && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <button
                  onClick={handleDownloadPDF}
                  disabled={isDownloadingPDF}
                  className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold text-white transition-all ${
                    isDownloadingPDF
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 hover:shadow-lg"
                  }`}
                >
                  {isDownloadingPDF ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      <span>Generando PDF...</span>
                    </>
                  ) : (
                    <>
                      <Download size={18} />
                      <span>Descargar PDF</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
