import { useState } from "react";
import { toast } from "sonner";
import { Download, Eye, Loader2 } from "lucide-react";
import {
  mockSyllabusData,
  mockGestionFinancieraData,
} from "../mocks/syllabus-mock-data";
import { syllabusPDFService } from "../services/syllabus-pdf-service";
import type { CompleteSyllabus } from "../types/complete-syllabus";

/**
 * Componente de prueba para generar PDFs usando datos MOCK
 * No requiere conexión al backend
 */
export function SyllabusPDFMockTest() {
  const [selectedMock, setSelectedMock] = useState<"taller" | "gestion">(
    "taller",
  );
  const [isGenerating, setIsGenerating] = useState(false);

  const mockData: Record<string, CompleteSyllabus> = {
    taller: mockSyllabusData,
    gestion: mockGestionFinancieraData,
  };

  const handleGeneratePDF = async () => {
    try {
      setIsGenerating(true);
      toast.info("Preparando PDF... Se abrirá el diálogo de impresión");

      const data = mockData[selectedMock];

      // 1. Cargar plantilla
      console.log("📄 Cargando plantilla...");
      const templateHtml =
        await syllabusPDFService.loadTemplate("htmlformatter.html");

      // 2. Llenar plantilla con datos mock
      console.log("✏️ Llenando plantilla con datos MOCK...");
      let filledHtml = syllabusPDFService.fillTemplate(templateHtml, data);

      // 3. Limpiar HTML: eliminar imágenes base64 innecesarias
      console.log("🧹 Limpiando HTML...");
      filledHtml = filledHtml.replace(
        /<img[^>]*src="data:image\/[^"]*"[^>]*>/gi,
        "",
      );

      // 4. Abrir en nueva ventana y usar el diálogo de impresión nativo del navegador
      console.log("�️ Abriendo ventana de impresión...");
      const printWindow = window.open("", "_blank");

      if (!printWindow) {
        throw new Error(
          "No se pudo abrir la ventana de impresión. Verifica que no esté bloqueada por el navegador.",
        );
      }

      // 5. Escribir el HTML en la nueva ventana
      printWindow.document.open();
      printWindow.document.write(filledHtml);
      printWindow.document.close();

      // 6. Esperar a que cargue completamente y luego abrir el diálogo de impresión
      printWindow.onload = () => {
        setTimeout(() => {
          console.log("✅ Abriendo diálogo de impresión...");
          printWindow.print();

          // Cerrar la ventana después de que el usuario complete la impresión
          // (el usuario puede cancelar o guardar como PDF)
          printWindow.onafterprint = () => {
            printWindow.close();
          };

          toast.success("Usa 'Guardar como PDF' en el diálogo de impresión");
          setIsGenerating(false);
        }, 500);
      };

      console.log("✅ Ventana de impresión abierta!");
    } catch (error) {
      console.error("❌ Error al generar PDF:", error);
      toast.error("Error al generar el PDF");
      setIsGenerating(false);
    }
  };

  const handlePreview = async () => {
    try {
      toast.info("Generando vista previa...");

      const data = mockData[selectedMock];

      // 1. Cargar plantilla
      const templateHtml =
        await syllabusPDFService.loadTemplate("htmlformatter.html");

      // 2. Llenar plantilla
      const filledHtml = syllabusPDFService.fillTemplate(templateHtml, data);

      const newWindow = window.open("", "_blank");
      if (newWindow) {
        newWindow.document.open();
        newWindow.document.writeln(filledHtml);
        newWindow.document.close();
        toast.success("Vista previa abierta en nueva ventana");
      } else {
        toast.error("No se pudo abrir la ventana de vista previa");
      }
    } catch (error) {
      console.error("Error al generar vista previa:", error);
      toast.error("Error al generar vista previa");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            🧪 Prueba de Generación de PDF (MOCK)
          </h2>
          <p className="text-gray-600">
            Genera PDFs usando datos de prueba sin necesidad de conexión al
            backend
          </p>
        </div>

        {/* Selector de datos mock */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Selecciona el sílabo de prueba:
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

        {/* Vista previa de datos */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold text-gray-800 mb-2">
            📋 Datos del sílabo seleccionado:
          </h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="font-medium">Asignatura:</span>{" "}
              {mockData[selectedMock].datosGenerales.nombreAsignatura}
            </div>
            <div>
              <span className="font-medium">Código:</span>{" "}
              {mockData[selectedMock].datosGenerales.codigoAsignatura}
            </div>
            <div>
              <span className="font-medium">Semestre:</span>{" "}
              {mockData[selectedMock].datosGenerales.semestreAcademico}
            </div>
            <div>
              <span className="font-medium">Créditos:</span>{" "}
              {mockData[selectedMock].datosGenerales.creditosTotales}
            </div>
            <div>
              <span className="font-medium">Docente:</span>{" "}
              {mockData[selectedMock].datosGenerales.docentes}
            </div>
            <div>
              <span className="font-medium">Ciclo:</span>{" "}
              {mockData[selectedMock].datosGenerales.ciclo}
            </div>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex gap-3">
          <button
            onClick={handleGeneratePDF}
            disabled={isGenerating}
            className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {isGenerating ? (
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

          <button
            onClick={handlePreview}
            disabled={isGenerating}
            className="flex items-center gap-2 px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 disabled:border-gray-400 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            <Eye className="w-5 h-5" />
            Vista Previa HTML
          </button>
        </div>

        {/* Información */}
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <h4 className="font-semibold text-green-900 mb-2">
            ✅ Ventajas del modo MOCK:
          </h4>
          <ul className="list-disc list-inside text-sm text-green-800 space-y-1">
            <li>No requiere conexión al backend</li>
            <li>Datos de prueba completos y realistas</li>
            <li>Perfecto para desarrollo y testing</li>
            <li>Genera PDFs inmediatamente</li>
            <li>Puedes ver cómo se verá el PDF final</li>
          </ul>
        </div>

        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-semibold text-blue-900 mb-2">
            📝 Cómo funciona:
          </h4>
          <ol className="list-decimal list-inside text-sm text-blue-800 space-y-1">
            <li>
              Selecciona un sílabo de prueba (Taller de Proyectos o Gestión
              Financiera)
            </li>
            <li>Haz clic en "Descargar PDF" para generar el archivo</li>
            <li>
              O usa "Vista Previa HTML" para ver el contenido antes de generar
            </li>
            <li>El PDF se descargará automáticamente con datos de prueba</li>
          </ol>
        </div>

        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h4 className="font-semibold text-yellow-900 mb-2">
            💡 Próximos pasos:
          </h4>
          <ul className="list-disc list-inside text-sm text-yellow-800 space-y-1">
            <li>
              Una vez que tengas datos reales en el backend, usa el componente
              normal
            </li>
            <li>
              Los datos mock están en{" "}
              <code className="bg-yellow-100 px-1 rounded">
                src/features/syllabus/mocks/syllabus-mock-data.ts
              </code>
            </li>
            <li>Puedes agregar más datos mock editando ese archivo</li>
            <li>
              La plantilla HTML se encuentra en{" "}
              <code className="bg-yellow-100 px-1 rounded">public/assets/</code>
            </li>
          </ul>
        </div>
      </div>

      {/* Código de ejemplo */}
      <div className="mt-8 bg-gray-900 rounded-lg p-6 text-white">
        <h3 className="text-lg font-semibold mb-4">
          💻 Datos MOCK disponibles:
        </h3>
        <pre className="text-sm overflow-x-auto">
          <code>{`import { mockSyllabusData, mockGestionFinancieraData } from "@/features/syllabus/mocks/syllabus-mock-data";

// Taller de Proyectos 2025-II
const tallerData = mockSyllabusData;

// Gestión Financiera 2024-I
const gestionData = mockGestionFinancieraData;

// Usar en tu código
console.log(tallerData.datosGenerales.nombreAsignatura);
// Output: "Taller de Proyectos"
`}</code>
        </pre>
      </div>
    </div>
  );
}
