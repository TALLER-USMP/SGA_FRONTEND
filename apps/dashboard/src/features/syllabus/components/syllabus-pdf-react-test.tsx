import { useState } from "react";
import { toast } from "sonner";
import { Download, Eye, Loader2, FileText } from "lucide-react";
import { PDFDownloadLink, PDFViewer, pdf } from "@react-pdf/renderer";
import {
  mockSyllabusData,
  mockGestionFinancieraData,
} from "../mocks/syllabus-mock-data";
import { syllabusPDFService } from "../services/syllabus-pdf-service";
import { SyllabusPDFDocument } from "./SyllabusPDFDocument";
import type { CompleteSyllabus } from "../types/complete-syllabus";

/**
 * Componente mejorado para generar PDFs de ALTA CALIDAD usando @react-pdf/renderer
 * Genera PDFs nativos (no imágenes) con excelente calidad y formato
 */
export function SyllabusPDFReactTest() {
  const [selectedMock, setSelectedMock] = useState<"taller" | "gestion">(
    "taller",
  );
  const [showPDFPreview, setShowPDFPreview] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const mockData: Record<string, CompleteSyllabus> = {
    taller: mockSyllabusData,
    gestion: mockGestionFinancieraData,
  };

  const currentData = mockData[selectedMock];
  const filename = `silabo-${currentData.datosGenerales.nombreAsignatura?.replace(/\s+/g, "-")}.pdf`;

  // Función para descargar el PDF programáticamente
  const handleDownloadPDF = async () => {
    try {
      setIsDownloading(true);
      toast.info("Generando PDF de alta calidad...");

      // Generar el documento PDF
      const blob = await pdf(
        <SyllabusPDFDocument data={currentData} />,
      ).toBlob();

      // Crear URL y descargar
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      link.click();

      // Limpiar
      URL.revokeObjectURL(url);

      toast.success("PDF descargado exitosamente!");
      setIsDownloading(false);
    } catch (error) {
      console.error("Error al generar PDF:", error);
      toast.error("Error al generar el PDF");
      setIsDownloading(false);
    }
  };

  // Vista previa HTML (método anterior para comparar)
  const handlePreviewHTML = async () => {
    try {
      toast.info("Generando vista previa HTML...");

      const templateHtml =
        await syllabusPDFService.loadTemplate("htmlformatter.html");
      const filledHtml = syllabusPDFService.fillTemplate(
        templateHtml,
        currentData,
      );

      const newWindow = window.open("", "_blank");
      if (newWindow) {
        newWindow.document.open();
        newWindow.document.writeln(filledHtml);
        newWindow.document.close();
        toast.success("Vista previa HTML abierta");
      } else {
        toast.error("No se pudo abrir la ventana");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error al generar vista previa");
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            ⚡ Generación de PDF de Alta Calidad (react-pdf)
          </h2>
          <p className="text-gray-600">
            Genera PDFs nativos con excelente calidad usando @react-pdf/renderer
          </p>
        </div>

        {/* Selector de datos mock */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Selecciona el sílabo:
          </label>
          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="mockData"
                value="taller"
                checked={selectedMock === "taller"}
                onChange={(e) =>
                  setSelectedMock(e.target.value as "taller" | "gestion")
                }
                className="mr-2"
              />
              <span className="text-gray-700">Taller de Proyectos 2025-II</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="mockData"
                value="gestion"
                checked={selectedMock === "gestion"}
                onChange={(e) =>
                  setSelectedMock(e.target.value as "taller" | "gestion")
                }
                className="mr-2"
              />
              <span className="text-gray-700">Gestión Financiera 2024-I</span>
            </label>
          </div>
        </div>

        {/* Información del sílabo */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold text-gray-800 mb-2">📋 Información:</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="font-medium">Asignatura:</span>{" "}
              {currentData.datosGenerales.nombreAsignatura}
            </div>
            <div>
              <span className="font-medium">Código:</span>{" "}
              {currentData.datosGenerales.codigoAsignatura}
            </div>
            <div>
              <span className="font-medium">Semestre:</span>{" "}
              {currentData.datosGenerales.semestreAcademico}
            </div>
            <div>
              <span className="font-medium">Créditos:</span>{" "}
              {currentData.datosGenerales.creditosTotales}
            </div>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex gap-3 mb-6">
          {/* Botón de descarga directa */}
          <button
            onClick={handleDownloadPDF}
            disabled={isDownloading}
            className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {isDownloading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Generando...
              </>
            ) : (
              <>
                <Download className="w-5 h-5" />
                Descargar PDF (Alta Calidad)
              </>
            )}
          </button>

          {/* Botón PDFDownloadLink alternativo */}
          <PDFDownloadLink
            document={<SyllabusPDFDocument data={currentData} />}
            fileName={filename}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {({ loading }) =>
              loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Preparando...
                </>
              ) : (
                <>
                  <FileText className="w-5 h-5" />
                  Descarga Alternativa
                </>
              )
            }
          </PDFDownloadLink>

          {/* Vista previa PDF */}
          <button
            onClick={() => setShowPDFPreview(!showPDFPreview)}
            className="flex items-center gap-2 px-6 py-3 border-2 border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition-colors"
          >
            <Eye className="w-5 h-5" />
            {showPDFPreview ? "Ocultar Vista Previa" : "Vista Previa PDF"}
          </button>

          {/* Vista previa HTML (comparación) */}
          <button
            onClick={handlePreviewHTML}
            className="flex items-center gap-2 px-6 py-3 border-2 border-gray-600 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Eye className="w-5 h-5" />
            Vista HTML (Comparar)
          </button>
        </div>

        {/* Visor PDF integrado */}
        {showPDFPreview && (
          <div className="mt-6 border rounded-lg overflow-hidden">
            <div className="bg-gray-100 p-3 border-b">
              <h3 className="font-semibold text-gray-800">
                📄 Vista Previa del PDF
              </h3>
            </div>
            <div style={{ height: "800px" }}>
              <PDFViewer width="100%" height="100%">
                <SyllabusPDFDocument data={currentData} />
              </PDFViewer>
            </div>
          </div>
        )}

        {/* Ventajas */}
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <h4 className="font-semibold text-green-900 mb-2">
            ✅ Ventajas de @react-pdf/renderer:
          </h4>
          <ul className="list-disc list-inside text-sm text-green-800 space-y-1">
            <li>Genera PDFs nativos (no capturas de pantalla)</li>
            <li>Excelente calidad y formato profesional</li>
            <li>Texto seleccionable y búsquedable</li>
            <li>Tamaño de archivo más pequeño</li>
            <li>Mejor rendimiento que html2canvas</li>
            <li>Vista previa integrada en el navegador</li>
          </ul>
        </div>

        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-semibold text-blue-900 mb-2">🎯 Comparación:</h4>
          <div className="text-sm text-blue-800 space-y-2">
            <div>
              <strong>html2canvas + jsPDF:</strong> Convierte HTML → Imagen →
              PDF (baja calidad)
            </div>
            <div>
              <strong>@react-pdf/renderer:</strong> Genera PDF nativo
              directamente (alta calidad) ✅
            </div>
            <div>
              <strong>window.print():</strong> Usa motor del navegador (buena
              calidad pero requiere interacción)
            </div>
          </div>
        </div>

        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h4 className="font-semibold text-yellow-900 mb-2">💡 Uso:</h4>
          <ol className="list-decimal list-inside text-sm text-yellow-800 space-y-1">
            <li>
              Haz clic en "Descargar PDF (Alta Calidad)" para descarga directa
            </li>
            <li>O usa "Descarga Alternativa" para el método PDFDownloadLink</li>
            <li>
              Usa "Vista Previa PDF" para ver el documento antes de descargar
            </li>
            <li>Compara con "Vista HTML" para verificar el formato</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
