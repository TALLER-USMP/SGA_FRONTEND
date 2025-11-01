import { useState } from "react";
import { DownloadPDFButton } from "./download-pdf-button";

/**
 * Componente de ejemplo que muestra cómo usar el botón de descarga de PDF
 * Puedes integrar este componente en cualquier página donde necesites descargar el PDF del sílabo
 */
export function SyllabusPDFExample() {
  const [syllabusId, setSyllabusId] = useState<string>("1");

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Generar PDF del Sílabo
        </h2>

        <div className="mb-6">
          <label
            htmlFor="syllabusId"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            ID del Sílabo
          </label>
          <input
            id="syllabusId"
            type="number"
            value={syllabusId}
            onChange={(e) => setSyllabusId(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            placeholder="Ingrese el ID del sílabo"
          />
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Opciones de descarga:
            </h3>
            <div className="flex flex-wrap gap-3">
              {/* Botón principal */}
              <DownloadPDFButton
                syllabusId={Number(syllabusId)}
                variant="primary"
              />

              {/* Botón con vista previa */}
              <DownloadPDFButton
                syllabusId={Number(syllabusId)}
                variant="outline"
                showPreview={true}
              />
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">
              📝 Instrucciones:
            </h4>
            <ul className="list-disc list-inside text-sm text-blue-800 space-y-1">
              <li>Ingresa el ID del sílabo que deseas descargar</li>
              <li>
                Haz clic en "Descargar PDF" para generar y descargar el archivo
              </li>
              <li>
                Usa "Vista previa" para ver el HTML antes de generar el PDF
              </li>
              <li>
                El PDF se generará con el nombre del curso y semestre académico
              </li>
            </ul>
          </div>

          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h4 className="font-semibold text-yellow-900 mb-2">
              ⚠️ Notas importantes:
            </h4>
            <ul className="list-disc list-inside text-sm text-yellow-800 space-y-1">
              <li>
                Asegúrate de que el sílabo exista en el backend antes de
                intentar descargarlo
              </li>
              <li>
                La plantilla HTML debe estar en{" "}
                <code className="bg-yellow-100 px-1 rounded">
                  public/assets/
                </code>
              </li>
              <li>
                El proceso puede tardar unos segundos dependiendo del tamaño del
                sílabo
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Sección de código de ejemplo */}
      <div className="mt-8 bg-gray-900 rounded-lg p-6 text-white">
        <h3 className="text-lg font-semibold mb-4">
          💻 Ejemplo de uso en código:
        </h3>
        <pre className="text-sm overflow-x-auto">
          <code>{`import { DownloadPDFButton } from "@/features/syllabus";

// Uso básico
<DownloadPDFButton syllabusId={1} />

// Con opciones personalizadas
<DownloadPDFButton 
  syllabusId={1}
  variant="primary"
  showPreview={true}
  templateName="8.Taller-de-Proyectos-2025-II (1)-converted.html"
/>

// Usando el hook directamente
import { useSyllabusPDF } from "@/features/syllabus";

function MyComponent() {
  const { generatePDF, isGenerating } = useSyllabusPDF({
    onSuccess: () => console.log("PDF generado!"),
    onError: (err) => console.error(err)
  });

  return (
    <button onClick={() => generatePDF(1)}>
      {isGenerating ? "Generando..." : "Descargar"}
    </button>
  );
}`}</code>
        </pre>
      </div>
    </div>
  );
}
