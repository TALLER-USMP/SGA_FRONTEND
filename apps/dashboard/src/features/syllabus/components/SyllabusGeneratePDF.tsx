import { useState } from "react";
import { toast } from "sonner";
import { Download, Eye, Loader2 } from "lucide-react";
import { PDFDownloadLink, PDFViewer, pdf } from "@react-pdf/renderer";
import { mockSyllabusData } from "../mocks/syllabus-mock-data";
import { SyllabusPDFDocument } from "./SyllabusPDFDocument";
import type { CompleteSyllabus } from "../types/complete-syllabus";

interface SyllabusGeneratePDFProps {
  /** Datos del sílabo a generar. Si no se proporciona, usa el mock por defecto */
  data?: CompleteSyllabus;
  /** Nombre del archivo PDF a descargar */
  fileName?: string;
  /** Mostrar vista previa del PDF */
  showPreview?: boolean;
}

/**
 * Componente optimizado para generar PDFs de alta calidad usando @react-pdf/renderer
 * Genera PDFs nativos (no imágenes) directamente desde los datos del sílabo
 */
export function SyllabusGeneratePDF({
  data = mockSyllabusData,
  fileName,
  showPreview = false,
}: SyllabusGeneratePDFProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [showPDFPreview, setShowPDFPreview] = useState(showPreview);

  const pdfFileName =
    fileName ||
    `silabo-${data.datosGenerales.nombreAsignatura?.replace(/\s+/g, "-")}.pdf`;

  // Función para descargar el PDF programáticamente
  const handleDownloadPDF = async () => {
    try {
      setIsDownloading(true);
      toast.info("Generando PDF de alta calidad...");

      // Generar el documento PDF
      const blob = await pdf(<SyllabusPDFDocument data={data} />).toBlob();

      // Crear URL y descargar
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = pdfFileName;
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

  return (
    <div className="space-y-4">
      {/* Botones de acción */}
      <div className="flex flex-wrap gap-3">
        {/* Botón de descarga directa */}
        <button
          onClick={handleDownloadPDF}
          disabled={isDownloading}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {isDownloading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Generando...
            </>
          ) : (
            <>
              <Download className="w-5 h-5" />
              Descargar PDF
            </>
          )}
        </button>

        {/* Botón de descarga alternativo (PDFDownloadLink) */}
        <PDFDownloadLink
          document={<SyllabusPDFDocument data={data} />}
          fileName={pdfFileName}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          {({ loading }) =>
            loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Preparando...
              </>
            ) : (
              <>
                <Download className="w-5 h-5" />
                Descarga Alternativa
              </>
            )
          }
        </PDFDownloadLink>

        {/* Botón de vista previa */}
        <button
          onClick={() => setShowPDFPreview(!showPDFPreview)}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <Eye className="w-5 h-5" />
          {showPDFPreview ? "Ocultar" : "Vista Previa"}
        </button>
      </div>

      {/* Visor PDF integrado */}
      {showPDFPreview && (
        <div className="border rounded-lg overflow-hidden">
          <div className="bg-gray-100 p-3 border-b">
            <h3 className="font-semibold text-gray-800">
              📄 Vista Previa del PDF
            </h3>
          </div>
          <div style={{ height: "800px" }}>
            <PDFViewer width="100%" height="100%">
              <SyllabusPDFDocument data={data} />
            </PDFViewer>
          </div>
        </div>
      )}

      {/* Información del sílabo */}
      <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <h4 className="font-semibold text-gray-900 mb-2">
          📋 Información del Sílabo:
        </h4>
        <div className="text-sm text-gray-700 space-y-1">
          <div>
            <strong>Asignatura:</strong> {data.datosGenerales.nombreAsignatura}
          </div>
          <div>
            <strong>Código:</strong> {data.datosGenerales.codigoAsignatura}
          </div>
          <div>
            <strong>Semestre:</strong> {data.datosGenerales.semestreAcademico}
          </div>
          <div>
            <strong>Docente:</strong> {data.datosGenerales.docentes}
          </div>
          <div>
            <strong>Créditos:</strong> {data.datosGenerales.creditosTotales}
          </div>
        </div>
      </div>
    </div>
  );
}
