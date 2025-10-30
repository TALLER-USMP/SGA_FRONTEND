import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Check, MessageSquare, X as XIcon } from "lucide-react";

interface SectionReview {
  id: string;
  name: string;
  status: "approved" | "rejected" | "pending";
  hasComments: boolean;
}

export default function ReviewSummary() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  // Mock data - reemplazar con datos del backend
  const syllabusData = {
    courseName: "Taller de Proyectos",
    courseCode: "09072108042",
    teacherName: "Norma Birginia Leon Lescano",
  };

  const sectionsReview: SectionReview[] = [
    {
      id: "1",
      name: "Datos Generales",
      status: "approved",
      hasComments: false,
    },
    { id: "2", name: "Sumilla", status: "approved", hasComments: true },
    {
      id: "3",
      name: "Competencias y Componentes",
      status: "approved",
      hasComments: false,
    },
    { id: "4", name: "Unidades", status: "approved", hasComments: true },
    {
      id: "5",
      name: "Estrategias Metodológicas",
      status: "approved",
      hasComments: false,
    },
    {
      id: "6",
      name: "Recursos Didácticos",
      status: "approved",
      hasComments: true,
    },
    {
      id: "7",
      name: "Evaluación del Aprendizaje",
      status: "approved",
      hasComments: false,
    },
    {
      id: "8",
      name: "Fuentes de Consulta",
      status: "approved",
      hasComments: true,
    },
    {
      id: "9",
      name: "Aporte de la Asignatura al logro de resultados",
      status: "approved",
      hasComments: false,
    },
  ];

  const handleFinalize = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    navigate("/coordinator/review-syllabus");
  };

  const handleGoBack = () => {
    navigate(`/coordinator/review-syllabus/${id}`);
  };

  const getStatusIcon = (status: string) => {
    if (status === "approved") {
      return <Check size={20} className="text-green-600" />;
    }
    if (status === "rejected") {
      return <XIcon size={20} className="text-red-600" />;
    }
    return null;
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="bg-white border border-gray-300 rounded-lg p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Resumen de Silabo en Revision
          </h1>
          <p className="text-lg text-gray-700 mb-1">
            {syllabusData.courseName}
          </p>
          <p className="text-sm text-gray-600">
            Docente: {syllabusData.teacherName}
          </p>
        </div>

        {/* Sections Review Table */}
        <div className="space-y-3 mb-8">
          {sectionsReview.map((section) => (
            <div
              key={section.id}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
            >
              <div className="flex items-center gap-3 flex-1">
                <span className="text-gray-800 font-medium">
                  {section.id}. {section.name}
                </span>
              </div>
              <div className="flex items-center gap-3">
                {getStatusIcon(section.status)}
                {section.hasComments && (
                  <MessageSquare size={20} className="text-blue-600" />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-200">
          <button
            onClick={handleGoBack}
            className="flex items-center gap-2 px-6 py-2.5 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Atrás</span>
          </button>
          <button
            onClick={handleFinalize}
            className="px-8 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Finalizar
          </button>
        </div>
      </div>

      {/* Success Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full mx-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check size={32} className="text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                ¡Revisión Exitosa!
              </h2>
              <p className="text-gray-600 mb-6">
                La revisión del sílabo ha sido completada exitosamente.
              </p>
              <button
                onClick={handleCloseModal}
                className="w-full px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                Aceptar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
