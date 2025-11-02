import { useNavigate, useSearchParams, useParams } from "react-router-dom";
import { ArrowLeft, Check, MessageSquare } from "lucide-react";
import { useEffect, useState } from "react";

interface ReviewItem {
  status: "approved" | "rejected" | null;
  comment: string;
}

interface SectionSummary {
  id: string;
  name: string;
  hasApproved: boolean;
  hasComments: boolean;
}

const sectionDefinitions = [
  { id: "1", name: "Datos generales" },
  { id: "2", name: "Sumilla" },
  { id: "3", name: "Competencias y componentes" },
  { id: "4", name: "Programación del contenido" },
  { id: "5", name: "Estrategias metodológicas" },
  { id: "6", name: "Recursos didácticos" },
  { id: "7", name: "Evaluación de aprendizaje" },
  { id: "8", name: "Fuentes de consulta" },
  { id: "9", name: "Resultados (outcomes)" },
];

export default function ReviewSyllabusSummary() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [sections, setSections] = useState<SectionSummary[]>([]);

  const courseName = searchParams.get("courseName") || "Curso sin nombre";
  const courseCode = searchParams.get("courseCode") || "Código no disponible";
  const teacherName =
    searchParams.get("teacherName") || "Docente no disponible";

  useEffect(() => {
    // Cargar datos de revisión del sessionStorage
    const savedData = sessionStorage.getItem(`reviewData_${id}`);
    if (savedData) {
      try {
        const reviewData: Record<string, ReviewItem> = JSON.parse(savedData);

        // Procesar cada sección para determinar si tiene aprobaciones y comentarios
        const processedSections = sectionDefinitions.map((section) => {
          // Contar campos con aprobación o comentarios
          const fields = Object.entries(reviewData);

          const hasApproved = fields.some(
            ([, data]) => data.status === "approved",
          );

          const hasComments = fields.some(
            ([, data]) => data.comment && data.comment.trim() !== "",
          );

          return {
            ...section,
            hasApproved,
            hasComments,
          };
        });

        setSections(processedSections);
      } catch (error) {
        console.error("Error al cargar datos de revisión:", error);
        setSections(
          sectionDefinitions.map((s) => ({
            ...s,
            hasApproved: false,
            hasComments: false,
          })),
        );
      }
    } else {
      // Si no hay datos guardados, mostrar todas las secciones sin marcas
      setSections(
        sectionDefinitions.map((s) => ({
          ...s,
          hasApproved: false,
          hasComments: false,
        })),
      );
    }
  }, [id]);

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleApprove = () => {
    alert("Sílabo aprobado exitosamente");
    navigate("/coordinator/review-syllabus");
  };

  const handleReject = () => {
    alert("Sílabo desaprobado");
    navigate("/coordinator/review-syllabus");
  };

  return (
    <div className="p-6 w-full mx-auto" style={{ maxWidth: "1000px" }}>
      <div className="bg-white border border-gray-300 rounded-lg p-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-black mb-4">
            Resumen de Sílabo en Revisión
          </h1>
          <div className="space-y-1 text-sm text-gray-600">
            <p>
              <span className="font-medium">Curso:</span> {courseName}
            </p>
            <p>
              <span className="font-medium">Código:</span> {courseCode}
            </p>
            <p>
              <span className="font-medium">Docente:</span> {teacherName}
            </p>
          </div>
        </div>

        {/* Tabla de resumen */}
        <div className="mb-8 border border-gray-300 rounded-lg overflow-hidden">
          <table className="w-full">
            <tbody>
              {sections.map((section) => (
                <tr
                  key={section.id}
                  className="border-b border-gray-300 last:border-b-0"
                >
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {section.id}. {section.name}
                  </td>
                  <td className="px-6 py-4 w-24 text-center">
                    {section.hasApproved && (
                      <div className="flex justify-center">
                        <div className="w-8 h-8 bg-green-500 rounded flex items-center justify-center">
                          <Check className="w-5 h-5 text-white" />
                        </div>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 w-24 text-center">
                    {section.hasComments && (
                      <div className="flex justify-center">
                        <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center">
                          <MessageSquare className="w-5 h-5 text-white" />
                        </div>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Botones de acción */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={handleGoBack}
            className="flex items-center gap-2 px-6 py-2.5 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Volver</span>
          </button>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={handleReject}
              className="px-8 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Desaprobar
            </button>
            <button
              type="button"
              onClick={handleApprove}
              className="px-8 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Aprobar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
