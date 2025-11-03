import { useState, useEffect, useRef } from "react";
import {
  Search,
  Download,
  Printer,
  ArrowLeft,
  X,
  Upload,
  FileDown,
} from "lucide-react";
import {
  useApprovedSyllabi,
  type ApprovedSyllabus as ApprovedSyllabusType,
} from "../hooks/use-approved-syllabus";
import { pdf } from "@react-pdf/renderer";
import { syllabusPDFService } from "../../syllabus/services/syllabus-pdf-service";
import { SyllabusPDFDocument } from "../../syllabus/components/SyllabusPDFDocument";
import type { CompleteSyllabus } from "../../syllabus/types/complete-syllabus";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../../common/hooks/use-toast";

export default function ApprovedSyllabus() {
  const navigate = useNavigate();
  const toast = useToast();

  const [searchCodigo, setSearchCodigo] = useState("");
  const [searchCurso, setSearchCurso] = useState("");
  const [fechaAprobacion, setFechaAprobacion] = useState("");
  const [isDownloadingPDF, setIsDownloadingPDF] = useState<number | null>(null);
  const [isPrinting, setIsPrinting] = useState<number | null>(null);

  // Estados para dropdowns
  const [showCodigoDropdown, setShowCodigoDropdown] = useState(false);
  const [showCursoDropdown, setShowCursoDropdown] = useState(false);

  // Sílabo seleccionado para descargar/imprimir
  const [selectedSyllabusId, setSelectedSyllabusId] = useState<number | null>(
    null,
  );

  // Refs para detectar clics fuera
  const codigoDropdownRef = useRef<HTMLDivElement>(null);
  const cursoDropdownRef = useRef<HTMLDivElement>(null);

  const {
    data: syllabi = [],
    isLoading,
    isError,
    error,
  } = useApprovedSyllabi();

  // Cerrar dropdowns al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        codigoDropdownRef.current &&
        !codigoDropdownRef.current.contains(event.target as Node)
      ) {
        setShowCodigoDropdown(false);
      }
      if (
        cursoDropdownRef.current &&
        !cursoDropdownRef.current.contains(event.target as Node)
      ) {
        setShowCursoDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filtrado por código
  const filteredByCodigo = syllabi.filter((syllabus) =>
    syllabus.codigo?.toLowerCase().includes(searchCodigo.toLowerCase()),
  );

  // Filtrado por curso
  const filteredByCurso = syllabi.filter((syllabus) =>
    syllabus.asignatura?.toLowerCase().includes(searchCurso.toLowerCase()),
  );

  // Filtrado combinado
  const filteredSyllabi = syllabi.filter((syllabus) => {
    const matchesCodigo = searchCodigo
      ? syllabus.codigo?.toLowerCase().includes(searchCodigo.toLowerCase())
      : true;
    const matchesCurso = searchCurso
      ? syllabus.asignatura?.toLowerCase().includes(searchCurso.toLowerCase())
      : true;
    const matchesFecha = fechaAprobacion
      ? syllabus.fechaAprobacion?.startsWith(fechaAprobacion)
      : true;
    return matchesCodigo && matchesCurso && matchesFecha;
  });

  const handleCodigoSelect = (syllabus: ApprovedSyllabusType) => {
    setSearchCodigo(syllabus.codigo);
    setSearchCurso(syllabus.asignatura);
    setSelectedSyllabusId(syllabus.id);
    setShowCodigoDropdown(false);
  };

  const handleCursoSelect = (syllabus: ApprovedSyllabusType) => {
    setSearchCodigo(syllabus.codigo);
    setSearchCurso(syllabus.asignatura);
    setSelectedSyllabusId(syllabus.id);
    setShowCursoDropdown(false);
  };

  const handleDownloadPDF = async () => {
    if (!selectedSyllabusId) {
      toast.error("Error", "Por favor selecciona un sílabo primero");
      return;
    }

    const selectedSyllabus = syllabi.find((s) => s.id === selectedSyllabusId);
    if (!selectedSyllabus) {
      toast.error("Error", "No se encontró el sílabo seleccionado");
      return;
    }

    setIsDownloadingPDF(selectedSyllabusId);
    try {
      const data: CompleteSyllabus =
        await syllabusPDFService.fetchCompleteSyllabus(selectedSyllabusId);

      const blob = await pdf(<SyllabusPDFDocument data={data} />).toBlob();

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `silabo-${selectedSyllabus.codigo}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success("Éxito", "PDF descargado correctamente");
    } catch (err) {
      console.error("Error al descargar PDF:", err);
      toast.error(
        "Error",
        "Error al generar el PDF. Por favor intenta nuevamente.",
      );
    } finally {
      setIsDownloadingPDF(null);
    }
  };

  const handlePrintPDF = async () => {
    if (!selectedSyllabusId) {
      toast.error("Error", "Por favor selecciona un sílabo primero");
      return;
    }

    setIsPrinting(selectedSyllabusId);
    try {
      const data: CompleteSyllabus =
        await syllabusPDFService.fetchCompleteSyllabus(selectedSyllabusId);

      const blob = await pdf(<SyllabusPDFDocument data={data} />).toBlob();
      const url = URL.createObjectURL(blob);

      const printWindow = window.open(url, "_blank");
      if (printWindow) {
        printWindow.addEventListener("load", () => {
          printWindow.print();
        });
      }

      toast.success("Éxito", "PDF abierto para imprimir");
    } catch (err) {
      console.error("Error al preparar impresión:", err);
      toast.error(
        "Error",
        "Error al preparar la impresión. Por favor intenta nuevamente.",
      );
    } finally {
      setIsPrinting(null);
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleExport = () => {
    toast.info("Exportar", "Función de exportar en desarrollo");
  };

  const handleImport = () => {
    navigate("/import-syllabus");
  };

  const handleNext = () => {
    navigate("/import-syllabus");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Cargando sílabos aprobados...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-600">
          Error al cargar sílabos: {error?.message}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-sm border border-red-600 p-8">
        {/* Header */}
        <div className="mb-6 border-b-2 border-red-600 pb-4">
          <h1 className="text-2xl font-bold text-gray-900">Sílabo Aprobados</h1>
        </div>

        {/* Botones de Exportar e Importar */}
        <div className="flex justify-end gap-3 mb-6">
          <button
            onClick={handleExport}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
          >
            <FileDown className="w-4 h-4" />
            Exportar
          </button>
          <button
            onClick={handleImport}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            Importar
          </button>
        </div>

        {/* Filtros de búsqueda */}
        <div className="space-y-4 mb-6">
          {/* Código */}
          <div className="relative" ref={codigoDropdownRef}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Código
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="09072108042"
                value={searchCodigo}
                onChange={(e) => {
                  setSearchCodigo(e.target.value);
                  setShowCodigoDropdown(true);
                }}
                onFocus={() => setShowCodigoDropdown(true)}
                className="w-full px-4 py-2 pr-20 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-2">
                <button className="p-1 hover:bg-gray-100 rounded">
                  <Search className="w-5 h-5 text-gray-600" />
                </button>
                {searchCodigo && (
                  <button
                    onClick={() => {
                      setSearchCodigo("");
                      setSearchCurso("");
                      setSelectedSyllabusId(null);
                    }}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <X className="w-5 h-5 text-gray-600" />
                  </button>
                )}
              </div>

              {/* Dropdown de códigos */}
              {showCodigoDropdown && filteredByCodigo.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {filteredByCodigo.slice(0, 10).map((syllabus) => (
                    <button
                      key={syllabus.id}
                      onClick={() => handleCodigoSelect(syllabus)}
                      className="w-full px-4 py-2 text-left hover:bg-gray-100 transition-colors border-b border-gray-100 last:border-b-0"
                    >
                      <div className="font-medium text-gray-900">
                        {syllabus.codigo}
                      </div>
                      <div className="text-sm text-gray-600">
                        {syllabus.asignatura}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Curso */}
          <div className="relative" ref={cursoDropdownRef}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Curso
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Diseño e implementacion de sistemas"
                value={searchCurso}
                onChange={(e) => {
                  setSearchCurso(e.target.value);
                  setShowCursoDropdown(true);
                }}
                onFocus={() => setShowCursoDropdown(true)}
                className="w-full px-4 py-2 pr-20 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-2">
                <button className="p-1 hover:bg-gray-100 rounded">
                  <Search className="w-5 h-5 text-gray-600" />
                </button>
                {searchCurso && (
                  <button
                    onClick={() => {
                      setSearchCurso("");
                      setSearchCodigo("");
                      setSelectedSyllabusId(null);
                    }}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <X className="w-5 h-5 text-gray-600" />
                  </button>
                )}
              </div>

              {/* Dropdown de cursos */}
              {showCursoDropdown && filteredByCurso.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {filteredByCurso.slice(0, 10).map((syllabus) => (
                    <button
                      key={syllabus.id}
                      onClick={() => handleCursoSelect(syllabus)}
                      className="w-full px-4 py-2 text-left hover:bg-gray-100 transition-colors border-b border-gray-100 last:border-b-0"
                    >
                      <div className="font-medium text-gray-900">
                        {syllabus.asignatura}
                      </div>
                      <div className="text-sm text-gray-600">
                        {syllabus.codigo}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Fecha de Aprobación */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fecha de Aprobacion
            </label>
            <div className="relative">
              <input
                type="date"
                value={fechaAprobacion}
                onChange={(e) => setFechaAprobacion(e.target.value)}
                className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
              {fechaAprobacion && (
                <button
                  onClick={() => setFechaAprobacion("")}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex justify-center gap-4 mb-6">
          <button
            onClick={handleDownloadPDF}
            disabled={!selectedSyllabusId || isDownloadingPDF !== null}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            {isDownloadingPDF ? "Descargando..." : "Descargar"}
          </button>

          <button
            onClick={handlePrintPDF}
            disabled={!selectedSyllabusId || isPrinting !== null}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Printer className="w-4 h-4" />
            {isPrinting ? "Imprimiendo..." : "Imprimir"}
          </button>
        </div>

        {/* Mensaje de no encontrado */}
        {filteredSyllabi.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>
              No se encontraron sílabos aprobados con los criterios de búsqueda
            </p>
          </div>
        )}

        {/* Botones de navegación */}
        <div className="flex justify-between items-center pt-6 border-t border-gray-200">
          <button
            onClick={handleGoBack}
            className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver
          </button>

          <button
            onClick={handleNext}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Siguiente &gt;
          </button>
        </div>
      </div>
    </div>
  );
}
