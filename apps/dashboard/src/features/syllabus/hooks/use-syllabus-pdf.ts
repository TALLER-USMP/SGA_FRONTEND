import { useState } from "react";
import html2canvas from "html2canvas-pro";
import { jsPDF } from "jspdf";
import { syllabusPDFService } from "../services/syllabus-pdf-service";

interface UseSyllabusPDFOptions {
  templateName?: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function useSyllabusPDF(options: UseSyllabusPDFOptions = {}) {
  const { templateName = "htmlformatter.html", onSuccess, onError } = options;

  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Genera el PDF del sílabo
   */
  const generatePDF = async (syllabusId: number, filename?: string) => {
    setIsGenerating(true);
    setError(null);

    try {
      // 1. Obtener datos completos del sílabo
      console.log(`📥 Obteniendo datos del sílabo ${syllabusId}...`);
      const syllabusData =
        await syllabusPDFService.fetchCompleteSyllabus(syllabusId);

      // 2. Cargar plantilla HTML
      console.log(`📄 Cargando plantilla ${templateName}...`);
      const htmlTemplate = await syllabusPDFService.loadTemplate(templateName);

      // 3. Llenar plantilla con datos
      console.log("✏️ Llenando plantilla con datos...");
      let filledHtml = syllabusPDFService.fillTemplate(
        htmlTemplate,
        syllabusData,
      );

      // 4. Limpiar HTML: eliminar imágenes base64 innecesarias
      console.log("🧹 Limpiando HTML...");
      filledHtml = filledHtml.replace(
        /<img[^>]*src="data:image\/[^"]*"[^>]*>/gi,
        "",
      );

      // 5. Crear un iframe COMPLETAMENTE AISLADO (sin Tailwind CSS)
      console.log("🖼️ Creando iframe aislado...");
      const iframe = document.createElement("iframe");
      iframe.style.cssText = `
        position: fixed !important;
        left: -99999px !important;
        top: -99999px !important;
        width: 210mm !important;
        height: 297mm !important;
        visibility: hidden !important;
        pointer-events: none !important;
        z-index: -99999 !important;
        border: none !important;
      `;
      document.body.appendChild(iframe);

      // 6. Escribir el HTML en el iframe (sin herencia de estilos de Tailwind)
      const iframeDoc =
        iframe.contentDocument || iframe.contentWindow?.document;
      if (!iframeDoc) {
        throw new Error("No se pudo acceder al documento del iframe");
      }

      iframeDoc.open();
      iframeDoc.write(filledHtml);
      iframeDoc.close();

      // 7. Esperar a que el iframe cargue completamente
      await new Promise((resolve) => setTimeout(resolve, 500));

      // 8. Generar PDF usando html2canvas-pro + jsPDF
      console.log("🔄 Generando PDF con html2canvas-pro...");
      const iframeBody = iframeDoc.body;

      // Capturar el contenido como canvas usando html2canvas-pro
      const canvas = await html2canvas(iframeBody, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        logging: false,
        windowWidth: iframeBody.scrollWidth,
        windowHeight: iframeBody.scrollHeight,
      });

      // Crear PDF con jsPDF
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      let position = 0;
      const imgData = canvas.toDataURL("image/jpeg", 0.98);

      // Agregar primera página
      pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Agregar páginas adicionales si es necesario
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Descargar PDF
      const pdfFilename =
        filename ||
        `silabo-${syllabusData.datosGenerales.nombreAsignatura?.replace(/\s+/g, "-") || syllabusId}-${syllabusData.datosGenerales.semestreAcademico || ""}.pdf`;
      pdf.save(pdfFilename);

      // 9. Limpiar
      setTimeout(() => {
        if (iframe && iframe.parentNode) {
          document.body.removeChild(iframe);
          console.log("🧹 Iframe limpiado");
        }
      }, 500);

      console.log("✅ PDF generado exitosamente!");
      setIsGenerating(false);
      onSuccess?.();
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      console.error("❌ Error al generar PDF:", error);
      setError(error);
      setIsGenerating(false);
      onError?.(error);
    }
  };

  /**
   * Previsualiza el HTML antes de generar el PDF (útil para debugging)
   */
  const previewHTML = async (syllabusId: number) => {
    try {
      const syllabusData =
        await syllabusPDFService.fetchCompleteSyllabus(syllabusId);
      const htmlTemplate = await syllabusPDFService.loadTemplate(templateName);
      const filledHtml = syllabusPDFService.fillTemplate(
        htmlTemplate,
        syllabusData,
      );

      // Abrir en nueva ventana
      const newWindow = window.open("", "_blank");
      if (newWindow) {
        newWindow.document.write(filledHtml);
        newWindow.document.close();
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      console.error("Error al previsualizar HTML:", error);
      setError(error);
    }
  };

  return {
    generatePDF,
    previewHTML,
    isGenerating,
    error,
  };
}
