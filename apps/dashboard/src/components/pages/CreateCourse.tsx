import { useState } from "react";
import LayoutStep from "../layout/LayoutStep";
import Step7 from "./Step7";
import Step9 from "./Step9";
import Step4 from "./Step4";

// Interfaces para los datos de cada paso
interface ConsultationSourcesData {
  week: string;
  didacticResources: string;
  sources: string[];
}

interface ContributionsData {
  bibliography: string;
  contributionType: string;
  contributionsList: string[];
}

interface LearningActivity {
  name: string;
  hours: number;
}
export interface WeekData {
  week: string;
  conceptual: string;
  procedural: string;
  activities: LearningActivity[];
}
interface DidacticResources {
  resources: string;
  resourceType: string;
}

interface CourseFormData {
  generalData: {
    courseCode: string;
    courseName: string;
  };
  consultationSources: ConsultationSourcesData;
  contributions: ContributionsData;
  methodologicalStrategy: WeekData;
  didacticResources: DidacticResources;
}

const TOTAL_STEPS = 9;

export default function CreateCourse() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<CourseFormData>({
    generalData: {
      courseCode: "09013707052",
      courseName: "INGENIERIA DE SOFTWARE II",
    },
    consultationSources: {
      week: "Semana 1",
      didacticResources: "",
      sources: ["", "", ""],
    },
    methodologicalStrategy: {
      week: "Semana 1",
      conceptual: "",
      procedural: "",
      activities: [
        // { name: "Trabajo grupal en el proyecto", hours: 2 },
      ],
    },
    didacticResources: {
      resources: "",
      resourceType: "",
    },
    contributions: {
      bibliography:
        "Analizar un sistema complejo de computacion y aplicar principios de computacion y otras disciplinas relevantes para identificar soluciones",
      contributionType: "k= Clave R",
      contributionsList: [
        "Analizar un sistema complejo de computacion y aplicar principios de computacion y otras disciplinas relevantes para identificar soluciones",
        "Analizar un sistema complejo de computacion y aplicar principios de computacion y otras disciplinas relevantes para identificar soluciones",
        "Analizar un sistema complejo de computacion y aplicar principios de computacion y otras disciplinas relevantes para identificar soluciones",
      ],
    },
  });

  // Navegación entre pasos
  const handleNext = () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepClick = (step: number) => {
    setCurrentStep(step);
  };

  const handleStep4Change = (data: WeekData) => {
    setFormData((prev) => ({
      ...prev,
      methodologicalStrategy: data,
    }));
  };

  // Handlers para actualizar datos de cada paso
  const handleStep7Change = (data: ConsultationSourcesData) => {
    setFormData((prev) => ({
      ...prev,
      consultationSources: data,
    }));
  };

  const handleStep9Change = (data: ContributionsData) => {
    setFormData((prev) => ({
      ...prev,
      contributions: data,
    }));
  };

  // Renderizar el contenido de cada paso
  const renderStepContent = () => {
    switch (currentStep) {
      case 4:
        return (
          <Step4
            data={formData.methodologicalStrategy}
            onChange={handleStep4Change}
          />
        );
      case 7:
        return (
          <Step7
            data={formData.consultationSources}
            onChange={handleStep7Change}
          />
        );

      case 9:
        return (
          <Step9 data={formData.contributions} onChange={handleStep9Change} />
        );

      default:
        return (
          <div className="text-center py-20">
            <h3 className="text-xl font-semibold mb-4">Paso {currentStep}</h3>
            <p className="text-gray-600">
              Contenido del paso {currentStep} en desarrollo...
            </p>
          </div>
        );
    }
  };

  // DEBUG: Log current values
  console.log(
    `DEBUG CreateCourse: currentStep=${currentStep}, TOTAL_STEPS=${TOTAL_STEPS}`
  );

  return (
    <LayoutStep
      currentStep={currentStep}
      totalSteps={TOTAL_STEPS}
      title="Crear nuevo curso"
      onNext={handleNext}
      onPrevious={handlePrevious}
      onStepClick={handleStepClick}
    >
      {renderStepContent()}
    </LayoutStep>
  );
}
