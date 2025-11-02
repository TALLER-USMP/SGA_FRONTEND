import { useState } from "react";
import { Search, Download, FileText } from "lucide-react";
import { useApprovedSyllabi } from "../hooks/use-approved-syllabus";
import { pdf } from "@react-pdf/renderer";
import { syllabusPDFService } from "../../syllabus/services/syllabus-pdf-service";
import { SyllabusPDFDocument } from "../../syllabus/components/SyllabusPDFDocument";
import type { CompleteSyllabus } from "../../syllabus/types/complete-syllabus";

export default function ApprovedSyllabi() {
  const [searchCodigo, setSearchCodigo] = useState("");
  const [searchAsignatura, setSearchAsignatura] = useState("");
  const [isDownloadingPDF, setIsDownloadingPDF] = useState<number | null>(null);

  const {
    data: syllabi = [],
    isLoading,
    isError,
    error,
  } = useApprovedSyllabi();

  // Filtrado por código o asignatura
  const filteredSyllabi = syllabi.filter((syllabus) => {
    const matchesCodigo = syllabus.codigo
      .toLowerCase()
      .includes(searchCodigo.toLowerCase());
    const matchesAsignatura = syllabus.asignatura
      .toLowerCase()
      .includes(searchAsignatura.toLowerCase());
    return matchesCodigo && matchesAsignatura;
  });

  const handleDownloadPDF = async (syllabusId: number, asignatura: string) => {
    if (!syllabusId) {
      alert("No hay ID de sílabo disponible");
      return;
    }

    setIsDownloadingPDF(syllabusId);
    try {
      console.log(`📥 Descargando sílabo ID: ${syllabusId}...`);
      const data: CompleteSyllabus =
        await syllabusPDFService.fetchCompleteSyllabus(syllabusId);

      console.log("📄 Generando PDF...");
      const blob = await pdf(<SyllabusPDFDocument data={data} />).toBlob();

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `silabo-${asignatura.replace(/\s+/g, "-")}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      console.log("✅ PDF descargado exitosamente");
    } catch (err) {
      console.error("❌ Error al descargar PDF:", err);
      alert("Error al generar el PDF. Por favor intenta nuevamente.");
    } finally {
      setIsDownloadingPDF(null);
    }
  };

  const handlePrintPDF = async (syllabusId: number) => {
    if (!syllabusId) {
      alert("No hay ID de sílabo disponible");
      return;
    }

    try {
      console.log(`🖨️ Preparando impresión del sílabo ID: ${syllabusId}...`);
      const data: CompleteSyllabus =
        await syllabusPDFService.fetchCompleteSyllabus(syllabusId);

      const blob = await pdf(<SyllabusPDFDocument data={data} />).toBlob();
      const url = URL.createObjectURL(blob);

      // Abrir en nueva ventana para imprimir
      const printWindow = window.open(url, "_blank");
      if (printWindow) {
        printWindow.addEventListener("load", () => {
          printWindow.print();
        });
      }

      console.log("✅ Ventana de impresión abierta");
    } catch (err) {
      console.error("❌ Error al preparar impresión:", err);
      alert("Error al preparar la impresión. Por favor intenta nuevamente.");
    }
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
    <div className="max-w-7xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Sílabos Aprobados
          </h1>
          <p className="text-gray-600">
            Lista de sílabos aprobados disponibles para descarga e impresión
          </p>
        </div>

        {/* Filtros de búsqueda */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar por código..."
              value={searchCodigo}
              onChange={(e) => setSearchCodigo(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar por asignatura..."
              value={searchAsignatura}
              onChange={(e) => setSearchAsignatura(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Contador de resultados */}
        <div className="mb-4 text-sm text-gray-600">
          Mostrando {filteredSyllabi.length} de {syllabi.length} sílabos
        </div>

        {/* Tabla de sílabos */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b-2 border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Código
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Asignatura
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha de Aprobación
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSyllabi.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    <FileText className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                    <p>No se encontraron sílabos aprobados</p>
                  </td>
                </tr>
              ) : (
                filteredSyllabi.map((syllabus) => (
                  <tr
                    key={syllabus.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {syllabus.codigo}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {syllabus.asignatura}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(syllabus.fechaAprobacion).toLocaleDateString(
                        "es-PE",
                        {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                        },
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() =>
                            handleDownloadPDF(
                              syllabus.syllabusId || syllabus.id,
                              syllabus.asignatura,
                            )
                          }
                          disabled={
                            isDownloadingPDF ===
                            (syllabus.syllabusId || syllabus.id)
                          }
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
                          title="Descargar PDF"
                        >
                          <Download className="w-4 h-4" />
                          {isDownloadingPDF ===
                          (syllabus.syllabusId || syllabus.id)
                            ? "Descargando..."
                            : "Descargar"}
                        </button>

                        <button
                          onClick={() =>
                            handlePrintPDF(syllabus.syllabusId || syllabus.id)
                          }
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                          title="Imprimir PDF"
                        >
                          <FileText className="w-4 h-4" />
                          Imprimir
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
