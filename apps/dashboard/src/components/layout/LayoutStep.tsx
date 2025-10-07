import { useEffect, useState, type ReactNode } from "react";
import Stepper from "../ui/Stepper";
import { Button } from "../ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import StepWeeks from "../steps/StepWeeks"; // <-- Paso 2 (maquetado)

interface LayoutStepProps {
  // Los dejo opcionales para que no te rompa el tipado si otro sitio lo usa
  currentStep?: number;
  title?: string;
  children?: ReactNode; // no lo usamos aquí; se renderizan los steps internos
  onNext?: () => void;
  onPrevious?: () => void;
  onStepClick?: (step: number) => void;
}

export default function LayoutStep({
  currentStep: currentStepProp,
  title = "Editar Sílabos",
  onNext,
  onPrevious,
  onStepClick,
}: LayoutStepProps) {
  // Define aquí los pasos que muestra el wizard
  const steps: ReactNode[] = [
    <div key="1" />, // placeholder del Paso 1 (pon tu StepSumilla cuando lo tengas)
    <StepWeeks key="2" />, // <-- TU PASO 2 (maquetado)
    <div key="3" />, // placeholder del Paso 3 (pon el real cuando exista)
  ];

  // Si viene currentStep por props, lo respetamos; si no, arrancamos en 2 para ver tu maquetado
  const [internalStep, setInternalStep] = useState<number>(
    currentStepProp ?? 2,
  );

  useEffect(() => {
    if (typeof currentStepProp === "number") {
      setInternalStep(currentStepProp);
    }
  }, [currentStepProp]);

  const totalSteps = steps.length;

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
        {steps[internalStep - 1]}
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
