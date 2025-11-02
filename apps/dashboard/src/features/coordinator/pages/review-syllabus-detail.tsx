import { useState, useMemo, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
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

// Import permissions hook
import type { Permission } from "../hooks/permissions-query";

// Import step components
import FirstStep from "../../syllabus/components/first-step";
import SecondStep from "../../syllabus/components/second-step";
import ThirdStep from "../../syllabus/components/third-step";
import FourthStep from "../../syllabus/components/fourth-step";
import FifthStep from "../../syllabus/components/fifth-step";
import SixthStep from "../../syllabus/components/sixth-step";
import SeventhStep from "../../syllabus/components/seventh-step";
import EighthStep from "../../syllabus/components/eighth-step";

export default function ReviewSyllabusDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [selectedSection, setSelectedSection] = useState("1");
  const [reviewData, setReviewData] = useState<
    Record<string, { status: "approved" | "rejected" | null; comment: string }>
  >({});

  // Obtener parámetros de la URL
  // const docenteId = searchParams.get("docenteId"); // Para uso futuro con backend
  // const syllabusId = searchParams.get("syllabusId"); // Para uso futuro
  const courseName = searchParams.get("courseName") || "Curso sin nombre";
  const courseCode = searchParams.get("courseCode") || "Código no disponible";
  const teacherName =
    searchParams.get("teacherName") || "Docente no disponible";

  // Temporalmente deshabilitamos la integración con permisos del backend
  // para evitar problemas de logout al refrescar la página
  // TODO: Re-habilitar cuando el backend esté listo
  /*
  const docenteId = searchParams.get("docenteId");
  const {
    data: permissions = [],
    isLoading: permissionsLoading,
    isError: permissionsError,
  } = usePermissions(docenteId);
  */

  // Mock de permisos - todas las secciones permitidas por defecto
  const permissions: Permission[] = [];
  const permissionsLoading = false;
  const permissionsError = false;

  // Datos del curso desde los parámetros de URL
  const syllabusData = {
    courseName,
    courseCode,
    teacherName,
  };

  // Create a mock stepper context value
  // Mock de stepperValue para simular el contexto
  // Ajustamos el currentStep para que coincida con los step={} de los componentes
  const stepperValue = useMemo(() => {
    // Mapeo de sección ID a step number del componente
    const sectionToStepMap: Record<string, number> = {
      "1": 1,
      "2": 2,
      "3": 3,
      "4": 4,
      "5": 5,
      "6": 5, // FifthStep (step=5) se usa para ambas secciones 5 y 6
      "7": 6, // SixthStep (step=6)
      "8": 7, // SeventhStep (step=7)
      "9": 8, // EighthStep (step=8)
    };

    const currentStep = sectionToStepMap[selectedSection] || 1;

    return {
      currentStep,
      isFirst: currentStep === 1,
      isLast: currentStep === 8,
      nextStep: () => {},
      prevStep: () => {},
      goToStep: () => {},
      reset: () => {},
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
      [fieldId]: {
        ...prev[fieldId],
        comment,
        status: prev[fieldId]?.status || null,
      },
    }));
  };

  const handleGoBack = () => {
    navigate("/coordinator/review-syllabus");
  };

  // Calcular estadísticas de revisión
  const reviewStats = useMemo(() => {
    const fields = Object.values(reviewData);
    const approved = fields.filter((f) => f.status === "approved").length;
    const rejected = fields.filter((f) => f.status === "rejected").length;
    const withComments = fields.filter((f) => f.comment?.trim()).length;
    const total = fields.length;

    return { approved, rejected, withComments, total };
  }, [reviewData]);

  const handleFinalize = () => {
    // Guardar reviewData en sessionStorage para usarlo en el resumen
    sessionStorage.setItem(`reviewData_${id}`, JSON.stringify(reviewData));

    // Navegar al resumen con los parámetros
    navigate(
      `/coordinator/review-syllabus/${id}/summary?courseName=${encodeURIComponent(courseName)}&courseCode=${encodeURIComponent(courseCode)}&teacherName=${encodeURIComponent(teacherName)}`,
    );
  };

  // Definir IDs y nombres de secciones (sin componentes)
  const sectionDefinitions = useMemo(
    () => [
      { id: "1", name: "Datos Generales" },
      { id: "2", name: "Sumilla" },
      { id: "3", name: "Competencias y Componentes" },
      { id: "4", name: "Unidades" },
      { id: "5", name: "Estrategias Metodológicas" },
      { id: "6", name: "Recursos Didácticos" },
      { id: "7", name: "Evaluación del Aprendizaje" },
      { id: "8", name: "Fuentes de Consulta" },
      { id: "9", name: "Aporte de la Asignatura al logro de resultados" },
    ],
    [],
  );

  // Mapeo de componentes por ID (no memoizado)
  // La sección 5 y 6 comparten el mismo componente (FifthStep)
  const getComponentById = (id: string): React.ReactNode => {
    const componentMap: Record<string, React.ReactNode> = {
      "1": <FirstStep />,
      "2": <SecondStep />,
      "3": <ThirdStep />,
      "4": <FourthStep />,
      "5": <FifthStep />,
      "6": <FifthStep />, // Comparte con sección 5
      "7": <SixthStep />,
      "8": <SeventhStep />,
      "9": <EighthStep />,
    };
    return componentMap[id];
  };

  // Filtrar IDs de secciones según permisos asignados
  const allowedSectionIds = useMemo(() => {
    if (permissionsLoading || permissionsError || permissions.length === 0) {
      return sectionDefinitions.map((s) => s.id); // Mostrar todas si no hay permisos o hay error
    }

    return permissions.map((p) => String(p.numeroSeccion));
  }, [permissions, permissionsLoading, permissionsError, sectionDefinitions]);

  // Obtener las definiciones de secciones permitidas
  const allowedSections = useMemo(() => {
    return sectionDefinitions.filter((section) =>
      allowedSectionIds.includes(section.id),
    );
  }, [sectionDefinitions, allowedSectionIds]);

  // Actualizar la sección seleccionada cuando se carguen los permisos
  useEffect(() => {
    if (
      !permissionsLoading &&
      !permissionsError &&
      allowedSectionIds.length > 0
    ) {
      // Si la sección actual no está permitida, seleccionar la primera permitida
      if (!allowedSectionIds.includes(selectedSection)) {
        setSelectedSection(allowedSectionIds[0]);
      }
    }
  }, [
    allowedSectionIds,
    permissionsLoading,
    permissionsError,
    selectedSection,
  ]);

  const currentSection = allowedSections.find((s) => s.id === selectedSection);

  return (
    <SyllabusProvider>
      <ReviewModeProvider
        isReviewMode={true}
        onFieldReview={handleFieldReview}
        onFieldComment={handleFieldComment}
      >
        <StepsContext.Provider value={stepperValue}>
          <div className="p-6 w-full mx-auto" style={{ maxWidth: "1600px" }}>
            <div
              className="bg-white border border-gray-300 rounded-lg p-8"
              translate="no"
            >
              {/* Header */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex-1">
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

                  {/* Estadísticas */}
                  <div className="flex flex-col items-end gap-3">
                    {reviewStats.total > 0 && (
                      <div className="flex items-center gap-4 text-sm bg-gray-50 px-4 py-2 rounded-lg">
                        <div className="flex items-center gap-1">
                          <span className="font-medium text-green-600">
                            ✓ {reviewStats.approved}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="font-medium text-red-600">
                            ✗ {reviewStats.rejected}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="font-medium text-blue-600">
                            💬 {reviewStats.withComments}
                          </span>
                        </div>
                        <div className="text-gray-500">
                          Total: {reviewStats.total}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Section Selector */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Seleccionar Sección
                </label>
                {permissionsLoading ? (
                  <div className="text-gray-500 text-sm">
                    Cargando permisos...
                  </div>
                ) : permissionsError ? (
                  <div className="text-red-500 text-sm">
                    Error al cargar permisos
                  </div>
                ) : allowedSections.length === 0 ? (
                  <div className="text-yellow-600 text-sm bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                    No hay secciones con permisos de revisión asignados para
                    este docente.
                  </div>
                ) : (
                  <Select
                    value={selectedSection}
                    onValueChange={setSelectedSection}
                  >
                    <SelectTrigger
                      className="w-full"
                      translate="no"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <SelectValue placeholder="Seleccione una sección" />
                    </SelectTrigger>
                    <SelectContent
                      translate="no"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {allowedSections.map((section) => (
                        <SelectItem
                          key={section.id}
                          value={section.id}
                          translate="no"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                          }}
                        >
                          <span translate="no">
                            {section.id}. {section.name}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>

              {/* Current Section Content */}
              <div className="mb-8">
                {currentSection && (
                  <div className="syllabus-review-readonly">
                    {getComponentById(currentSection.id)}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                <button
                  type="button"
                  data-review-button="true"
                  onClick={handleGoBack}
                  className="flex items-center gap-2 px-6 py-2.5 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <ArrowLeft size={20} />
                  <span>Volver</span>
                </button>
                <button
                  type="button"
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
