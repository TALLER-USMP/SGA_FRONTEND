import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../common/components/ui/select";

// Import contexts
import { SyllabusProvider } from "../../syllabus/contexts/syllabus-context";
import { StepsContext } from "../../syllabus/contexts/steps-context-provider";
import { ReviewModeProvider } from "../contexts/review-mode-context";

// Import step components
import FirstStep from "../../syllabus/components/first-step";
import SecondStep from "../../syllabus/components/second-step";
import ThirdStep from "../../syllabus/components/third-step";
import FourthStep from "../../syllabus/components/fourth-step";
import FifthStep from "../../syllabus/components/fifth-step";
import SixthStep from "../../syllabus/components/sixth-step";
import SeventhStep from "../../syllabus/components/seventh-step";
import EighthStep from "../../syllabus/components/eighth-step";

interface Section {
  id: string;
  name: string;
  component: React.ReactNode;
}

export default function ReviewSyllabusDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [selectedSection, setSelectedSection] = useState("1");
  const [reviewData, setReviewData] = useState<
    Record<string, { status: "approved" | "rejected" | null; comment: string }>
  >({});

  // Mock data - reemplazar con datos del backend
  const syllabusData = {
    courseName: "Taller de Proyectos",
    courseCode: "09072108042",
    teacherName: "Norma Birginia Leon Lescano",
  };

  // Create a mock stepper context value
  const stepperValue = useMemo(() => {
    const currentStep = parseInt(selectedSection);
    return {
      currentStep,
      isFirst: currentStep === 1,
      isLast: currentStep === 8,
      nextStep: () => {},
      prevStep: () => {},
      goToStep: (step: number) => setSelectedSection(step.toString()),
      reset: () => setSelectedSection("1"),
    };
  }, [selectedSection]);

  const handleFieldReview = (
    fieldId: string,
    status: "approved" | "rejected" | null,
  ) => {
    setReviewData((prev) => ({
      ...prev,
      [fieldId]: { ...prev[fieldId], status },
    }));
  };

  const handleFieldComment = (fieldId: string, comment: string) => {
    setReviewData((prev) => ({
      ...prev,
      [fieldId]: { ...prev[fieldId], comment },
    }));
  };

  const handleGoBack = () => {
    navigate("/coordinator/review-syllabus");
  };

  const handleFinalize = () => {
    // Aquí se podría guardar reviewData al backend
    console.log("Review data:", reviewData);
    navigate(`/coordinator/review-syllabus/${id}/summary`);
  };

  const sections: Section[] = [
    { id: "1", name: "Datos Generales", component: <FirstStep /> },
    { id: "2", name: "Sumilla", component: <SecondStep /> },
    { id: "3", name: "Competencias y Componentes", component: <ThirdStep /> },
    { id: "4", name: "Unidades", component: <FourthStep /> },
    { id: "5", name: "Estrategias Metodológicas", component: <FifthStep /> },
    { id: "6", name: "Recursos Didácticos", component: <FifthStep /> },
    { id: "7", name: "Evaluación del Aprendizaje", component: <SixthStep /> },
    { id: "8", name: "Fuentes de Consulta", component: <SeventhStep /> },
    {
      id: "9",
      name: "Aporte de la Asignatura al logro de resultados",
      component: <EighthStep />,
    },
  ];

  const currentSection = sections.find((s) => s.id === selectedSection);

  return (
    <SyllabusProvider>
      <ReviewModeProvider
        isReviewMode={true}
        onFieldReview={handleFieldReview}
        onFieldComment={handleFieldComment}
      >
        <StepsContext.Provider value={stepperValue}>
          <div className="p-6 max-w-6xl mx-auto">
            <div className="bg-white border border-gray-300 rounded-lg p-8">
              {/* Header */}
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-black mb-2">
                  Revisión de Sílabo
                </h1>
                <h2 className="text-xl font-semibold text-black mb-1">
                  {syllabusData.courseName}
                </h2>
                <p className="text-sm text-gray-600 mb-1">
                  Código: {syllabusData.courseCode}
                </p>
                <p className="text-sm text-gray-600">
                  Docente: {syllabusData.teacherName}
                </p>
              </div>

              {/* Section Selector */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Seleccionar Sección
                </label>
                <Select
                  value={selectedSection}
                  onValueChange={setSelectedSection}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Seleccione una sección" />
                  </SelectTrigger>
                  <SelectContent>
                    {sections.map((section) => (
                      <SelectItem key={section.id} value={section.id}>
                        {section.id}. {section.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Current Section Content */}
              <div className="mb-8">
                {currentSection && (
                  <div className="syllabus-review-readonly">
                    {currentSection.component}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                <button
                  data-review-button="true"
                  onClick={handleGoBack}
                  className="flex items-center gap-2 px-6 py-2.5 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <ArrowLeft size={20} />
                  <span>Volver</span>
                </button>
                <button
                  data-review-button="true"
                  onClick={handleFinalize}
                  className="px-8 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Finalizar Revisión
                </button>
              </div>
            </div>
          </div>
        </StepsContext.Provider>
      </ReviewModeProvider>
    </SyllabusProvider>
  );
}
