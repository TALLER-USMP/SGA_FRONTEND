import { useState, useEffect, useCallback } from "react";
import { pdf } from "@react-pdf/renderer";
import { SyllabusPDFDocument } from "./SyllabusPDFDocument";
import { syllabusPDFService } from "../services/syllabus-pdf-service";
import type { CompleteSyllabus } from "../types/complete-syllabus";

interface SyllabusGeneratePDFBackendProps {
  syllabusId?: number;
  fileName?: string;
}

export function SyllabusGeneratePDFBackend({
  syllabusId = 1,
  fileName = "silabo.pdf",
}: SyllabusGeneratePDFBackendProps) {
  const [syllabusData, setSyllabusData] = useState<CompleteSyllabus | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const loadSyllabusData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      console.log(`📥 Cargando sílabo ID: ${syllabusId} desde el backend...`);
      const data = await syllabusPDFService.fetchCompleteSyllabus(syllabusId);
      setSyllabusData(data);
      console.log("✅ Datos cargados:", data);
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "Error al cargar datos";
      setError(errorMsg);
      console.error("❌ Error:", errorMsg);
    } finally {
      setIsLoading(false);
    }
  }, [syllabusId]);

  useEffect(() => {
    loadSyllabusData();
  }, [loadSyllabusData]);

  const handleDownloadDirect = async () => {
    if (!syllabusData) {
      alert("No hay datos cargados");
      return;
    }

    setIsGenerating(true);
    try {
      console.log("🔄 Generando PDF...");
      const blob = await pdf(
        <SyllabusPDFDocument data={syllabusData} />,
      ).toBlob();

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      link.click();
      URL.revokeObjectURL(url);

      console.log("✅ PDF descargado exitosamente");
    } catch (err) {
      console.error("❌ Error al generar PDF:", err);
      alert(
        "Error al generar PDF: " + (err instanceof Error ? err.message : ""),
      );
    } finally {
      setIsGenerating(false);
    }
  };

  // Mostrar loading mientras se cargan los datos
  if (isLoading || !syllabusData) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando datos del backend...</p>
          <p className="text-sm text-gray-500 mt-2">Sílabo ID: {syllabusId}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg
                className="h-6 w-6 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-medium text-red-800">
                Error al cargar datos
              </h3>
              <p className="mt-2 text-sm text-red-700">{error}</p>
              <button
                onClick={loadSyllabusData}
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Reintentar
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Verificación de seguridad: asegurar que syllabusData existe antes de renderizar
  if (!syllabusData || !syllabusData.datosGenerales) {
    return (
      <div className="p-8 text-center text-gray-500">
        No hay datos disponibles
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Generar PDF desde Backend
          </h2>
          <div className="flex items-center gap-2">
            <p className="text-gray-600">Datos cargados desde el API</p>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
              Sílabo ID: {syllabusId}
            </span>
          </div>
        </div>

        {/* Información del Sílabo */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">
            Información del Sílabo
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-semibold text-gray-700">Asignatura:</span>
              <p className="text-gray-900">
                {syllabusData.datosGenerales.nombreAsignatura || "N/A"}
              </p>
            </div>
            <div>
              <span className="font-semibold text-gray-700">Código:</span>
              <p className="text-gray-900">
                {syllabusData.datosGenerales.codigoAsignatura || "N/A"}
              </p>
            </div>
            <div>
              <span className="font-semibold text-gray-700">Semestre:</span>
              <p className="text-gray-900">
                {syllabusData.datosGenerales.semestreAcademico || "N/A"}
              </p>
            </div>
            <div>
              <span className="font-semibold text-gray-700">Docente:</span>
              <p className="text-gray-900">
                {syllabusData.datosGenerales.docentes || "N/A"}
              </p>
            </div>
            <div>
              <span className="font-semibold text-gray-700">Créditos:</span>
              <p className="text-gray-900">
                Teoría: {syllabusData.datosGenerales.creditosTeoria || 0} |
                Práctica: {syllabusData.datosGenerales.creditosPractica || 0} |
                Total: {syllabusData.datosGenerales.creditosTotales || 0}
              </p>
            </div>
            <div>
              <span className="font-semibold text-gray-700">
                Unidades Didácticas:
              </span>
              <p className="text-gray-900">
                {syllabusData.unidadesDidacticas?.length || 0} unidades
              </p>
            </div>
            <div>
              <span className="font-semibold text-gray-700">Competencias:</span>
              <p className="text-gray-900">
                {syllabusData.competenciasCurso?.length || 0} competencias
              </p>
            </div>
            <div>
              <span className="font-semibold text-gray-700">Fuentes:</span>
              <p className="text-gray-900">
                {syllabusData.fuentes?.length || 0} fuentes
              </p>
            </div>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={handleDownloadDirect}
            disabled={isGenerating}
            className={`flex-1 px-6 py-3 rounded-lg font-semibold text-white transition-all ${
              isGenerating
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 hover:shadow-lg"
            }`}
          >
            {isGenerating ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                Generando PDF...
              </span>
            ) : (
              "📥 Descargar PDF (Backend Data)"
            )}
          </button>

          <button
            onClick={loadSyllabusData}
            className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg transition-colors"
          >
            🔄 Recargar Datos
          </button>
        </div>

        {/* Información adicional */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            <strong>Nota:</strong> Este componente consume datos reales del
            backend usando el endpoint{" "}
            <code className="bg-gray-100 px-2 py-1 rounded text-xs">
              /api/syllabus/{syllabusId}/complete
            </code>
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Generación de PDF usando @react-pdf/renderer con SyllabusPDFDocument
          </p>
        </div>
      </div>
    </div>
  );
}
