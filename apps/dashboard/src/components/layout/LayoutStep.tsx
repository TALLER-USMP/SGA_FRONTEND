import { useEffect, useState, type ReactNode } from "react";
import Stepper from "../ui/Stepper";
import { Button } from "../ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import StepWeeks from "../steps/StepWeeks"; // <-- Paso 2 (maquetado)

interface LayoutStepProps {
  currentStep?: number; // si CreateCourse controla el paso actual
  totalSteps?: number; // si CreateCourse define el total de pasos (p. ej. 9)
  title?: string;
  children?: ReactNode; // contenido del paso (de tus compas)
  onNext?: () => void;
  onPrevious?: () => void;
  onStepClick?: (step: number) => void;
}

export default function LayoutStep({
  currentStep: currentStepProp,
  totalSteps: totalStepsProp,
  title = "Editar Sílabos",
  children,
  onNext,
  onPrevious,
  onStepClick,
}: LayoutStepProps) {
  // Total de pasos: usa el que venga de arriba; si no, por defecto 9 (flujo del equipo)
  const totalSteps = typeof totalStepsProp === "number" ? totalStepsProp : 9;

  // Paso actual: respeta el que venga; si no, arranca en 2 para ver tu maquetado
  const [internalStep, setInternalStep] = useState<number>(
    typeof currentStepProp === "number" ? currentStepProp : 2,
  );

  useEffect(() => {
    if (typeof currentStepProp === "number") {
      setInternalStep(currentStepProp);
    }
  }, [currentStepProp]);

  // Contenido: en el paso 2 muestra tu StepWeeks; en los demás muestra lo que ya tenían (children)
  const content: ReactNode = internalStep === 2 ? <StepWeeks /> : children;

  const goPrev = () => {
    if (internalStep > 1) {
      const next = internalStep - 1;
      setInternalStep(next);
      onPrevious?.();
      onStepClick?.(next);
    }
  };

  const goNext = () => {
    if (internalStep < totalSteps) {
      const next = internalStep + 1;
      setInternalStep(next);
      onNext?.();
      onStepClick?.(next);
    }
  };

  const handleStepClick = (s: number) => {
    setInternalStep(s);
    onStepClick?.(s);
  };

  return (
    <div className="w-full px-4 py-6">
      <h1 className="text-3xl font-bold mb-8">{title}</h1>

      <Stepper
        currentStep={internalStep}
        totalSteps={totalSteps}
        onStepClick={handleStepClick}
      />

      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6 w-full">
        {content}
      </div>

      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          onClick={goPrev}
          disabled={internalStep === 1}
          className="flex items-center gap-2"
        >
          <ChevronLeft className="w-4 h-4" />
          Anterior
        </Button>

        <span className="text-sm text-gray-600">
          Paso {internalStep} de {totalSteps}
        </span>

        <Button
          onClick={goNext}
          disabled={internalStep === totalSteps}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
        >
          {internalStep === totalSteps ? "Finalizar" : "Siguiente"}
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
