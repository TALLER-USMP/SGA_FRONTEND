import {
  useNavigate,
  useSearchParams,
  useParams,
  useLocation,
} from "react-router-dom";
import { ArrowLeft, Check, X, MessageSquare } from "lucide-react";
import { useEffect, useState } from "react";
import { useApproveSyllabus } from "../hooks/syllabus-review-query";
import { toast } from "sonner";
import { ReviewConfirmationModal } from "../components/review-confirmation-modal";
import { Button } from "../../../common/components/ui/button";

interface ReviewItem {
  status: "approved" | "rejected" | null;
  comment: string;
}

interface SectionSummary {
  id: string;
  name: string;
  hasApproved: boolean;
  hasRejected: boolean;
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
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [sections, setSections] = useState<SectionSummary[]>([]);
  const [reviewData, setReviewData] = useState<Record<string, ReviewItem>>({});
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<"approved" | "rejected">(
    "approved",
  );

  const approveMutation = useApproveSyllabus();

  const courseName = searchParams.get("courseName") || "Curso sin nombre";
  const courseCode = searchParams.get("courseCode") || "Código no disponible";
  const teacherName =
    searchParams.get("teacherName") || "Docente no disponible";
  const syllabusId = searchParams.get("syllabusId");

  useEffect(() => {
    // Cargar datos de revisión del sessionStorage
    const savedData = sessionStorage.getItem(`reviewData_${id}`);
    if (savedData) {
      try {
        const parsedData: Record<string, ReviewItem> = JSON.parse(savedData);
        setReviewData(parsedData);

        // Mapeo de fieldId a número de sección (puede devolver array para manejar casos donde un step mapea a múltiples secciones)
        // Ahora se usan IDs de paso: step-1, step-2, etc.
        // Nota: step-5 se usa para ambas secciones 5 y 6
        const getSections = (fieldId: string): string[] => {
          // Nuevo formato: step-X
          if (fieldId === "step-1") return ["1"];
          if (fieldId === "step-2") return ["2"];
          if (fieldId === "step-3") return ["3"];
          if (fieldId === "step-4") return ["4"];
          if (fieldId === "step-5") return ["5", "6"]; // Cubre ambas secciones
          if (fieldId === "step-6") return ["7"];
          if (fieldId === "step-7") return ["8"];
          if (fieldId === "step-8") return ["9"];

          // Mantener compatibilidad con formato antiguo (por si hay datos guardados)
          // Sección 1: Datos generales
          if (
            fieldId === "nombreAsignatura" ||
            fieldId.startsWith("codigo-") ||
            fieldId.startsWith("ciclo-") ||
            fieldId.startsWith("creditos-") ||
            fieldId.startsWith("horas-") ||
            fieldId.startsWith("prerequisitos-") ||
            fieldId.startsWith("docente-")
          )
            return ["1"];

          // Sección 2: Sumilla
          if (fieldId === "sumilla") return ["2"];

          // Sección 3: Competencias y componentes
          if (
            fieldId.startsWith("competencia-") ||
            fieldId.startsWith("componente-") ||
            fieldId.startsWith("contenido-actitudinal-")
          )
            return ["3"];

          // Sección 4: Programación del contenido
          if (fieldId.startsWith("unit-") && fieldId.includes("-week-"))
            return ["4"];

          // Sección 5: Estrategias metodológicas
          if (fieldId.startsWith("strategy-")) return ["5"];

          // Sección 6: Recursos didácticos
          if (fieldId.startsWith("resource-")) return ["6"];

          // Sección 7: Evaluación de aprendizaje
          if (
            fieldId === "evaluation-main-formula" ||
            fieldId.startsWith("evaluation-")
          )
            return ["7"];

          // Sección 8: Fuentes de consulta
          if (
            fieldId.startsWith("bibliography-") ||
            fieldId.startsWith("electronic-resource-")
          )
            return ["8"];

          // Sección 9: Resultados (outcomes)
          if (fieldId.startsWith("outcome-")) return ["9"];

          return []; // fieldId no reconocido
        };

        // Procesar cada sección para determinar si tiene aprobaciones y comentarios
        const processedSections = sectionDefinitions.map((section) => {
          // Filtrar solo los campos que pertenecen a esta sección
          const sectionFields = Object.entries(parsedData).filter(([fieldId]) =>
            getSections(fieldId).includes(section.id),
          );

          // Si no hay campos en esta sección, no mostrar nada
          if (sectionFields.length === 0) {
            return {
              ...section,
              hasApproved: false,
              hasRejected: false,
              hasComments: false,
            };
          }

          // Verificar si TODOS los campos de esta sección están aprobados
          const allApproved = sectionFields.every(
            ([, data]) => data.status === "approved",
          );

          // Verificar si ALGÚN campo de esta sección está rechazado
          const hasRejected = sectionFields.some(
            ([, data]) => data.status === "rejected",
          );

          // Verificar si hay comentarios en esta sección
          const hasComments = sectionFields.some(
            ([, data]) => data.comment && data.comment.trim() !== "",
          );

          return {
            ...section,
            hasApproved: allApproved && !hasRejected, // Solo verde si todos aprobados y ninguno rechazado
            hasRejected,
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
            hasRejected: false,
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
          hasRejected: false,
          hasComments: false,
        })),
      );
    }
  }, [id, location.key]); // Agregar location.key para detectar navegaciones

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleFinalize = async () => {
    if (!syllabusId) {
      toast.error("No se pudo identificar el sílabo");
      return;
    }

    // Determinar si el sílabo debe ser aprobado o desaprobado
    // Si hay alguna sección rechazada, se desaprueba
    const hasRejections = sections.some((section) => section.hasRejected);
    const estado = hasRejections ? "DESAPROBADO" : "VALIDADO";

    // Si hay rechazos, asegurarse de que cada campo rechazado tenga comentario.
    if (hasRejections) {
      const rejectedFields = Object.entries(reviewData).filter(
        ([, v]) => v.status === "rejected",
      );

      const missingComments = rejectedFields.some(([, v]) => {
        return !(v.comment && v.comment.trim().length > 0);
      });

      if (missingComments) {
        toast.error(
          "Por favor ingrese comentarios para los puntos marcados con 'X' antes de finalizar la desaprobación.",
        );
        return;
      }
    }

    try {
      await approveMutation.mutateAsync({
        syllabusId: parseInt(syllabusId),
        estado,
        reviewData,
      });

      // Mostrar modal con el resultado
      setModalType(hasRejections ? "rejected" : "approved");
      setShowModal(true);
      // Informar por UI que se envió la notificación al docente (si aplica)
      if (hasRejections) {
        toast.success("Revisión registrada. Se envió notificación al docente.");
      } else {
        toast.success("Revisión registrada. Sí­labo aprobado.");
      }
    } catch (error) {
      console.error("Error al finalizar revisión:", error);
      toast.error("Error al finalizar la revisión. Intente nuevamente.");
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    // Limpiar sessionStorage
    sessionStorage.removeItem(`reviewData_${id}`);
    // Navegar a la lista de sílabos con timestamp para forzar refresh
    navigate("/coordinator/review-syllabus?refresh=" + Date.now());
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

        {/* Resumen visual por secciones (estilo cajas como en el diseño) */}
        <div className="mb-8 space-y-3">
          {sections.map((section) => (
            <div
              key={section.id}
              className="flex items-center border border-gray-300 rounded-md overflow-hidden"
            >
              {/* Sección */}
              <div className="flex-1 px-6 py-4 text-sm text-gray-700">
                {section.id}. {section.name}
              </div>

              {/* Estado (check o cross) */}
              <div className="w-40 flex items-center justify-center px-4 py-4">
                {section.hasRejected ? (
                  <div className="w-8 h-8 bg-red-500 rounded flex items-center justify-center">
                    <X className="w-5 h-5 text-white" />
                  </div>
                ) : section.hasApproved ? (
                  <div className="w-8 h-8 bg-green-500 rounded flex items-center justify-center">
                    <Check className="w-5 h-5 text-white" />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded flex items-center justify-center opacity-0">
                    {/* placeholder to keep layout */}
                  </div>
                )}
              </div>

              {/* Comentarios */}
              <div className="w-24 flex items-center justify-center px-4 py-4">
                {section.hasComments ? (
                  <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-white" />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded flex items-center justify-center opacity-0">
                    {/* placeholder */}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Detalle de puntos observados y aprobados */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Detalle de revisión</h3>
          {Object.keys(reviewData).length === 0 ? (
            <div className="text-sm text-gray-500">
              No hay observaciones registradas.
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-red-600 mb-2">
                  Puntos observados
                </h4>
                {Object.entries(reviewData)
                  .filter(([, v]) => v.status === "rejected")
                  .map(([fieldId, v]) => (
                    <div
                      key={fieldId}
                      className="mb-3 p-3 border rounded-lg bg-red-50"
                    >
                      <div className="text-sm font-medium text-gray-800">
                        {fieldId}
                      </div>
                      <div className="text-sm text-gray-700 mt-1">
                        {v.comment}
                      </div>
                    </div>
                  ))}
              </div>

              <div>
                <h4 className="font-medium text-green-600 mb-2">
                  Puntos aprobados
                </h4>
                {Object.entries(reviewData)
                  .filter(([, v]) => v.status === "approved")
                  .map(([fieldId]) => (
                    <div
                      key={fieldId}
                      className="mb-2 p-2 border rounded bg-green-50 text-sm text-gray-800"
                    >
                      {fieldId}
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>

        {/* Botones de acción */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-200">
          <Button
            type="button"
            variant="outline"
            onClick={handleGoBack}
            className="gap-2"
          >
            <ArrowLeft size={20} />
            <span>Atrás</span>
          </Button>

          <Button
            type="button"
            variant="destructive"
            onClick={handleFinalize}
            disabled={approveMutation.isPending}
            size="lg"
          >
            {approveMutation.isPending ? "Finalizando..." : "Finalizar"}
          </Button>
        </div>

        {/* Modal de confirmación */}
        <ReviewConfirmationModal
          isOpen={showModal}
          type={modalType}
          onClose={handleCloseModal}
        />
      </div>
    </div>
  );
}
