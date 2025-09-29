import { useState, useEffect, type ReactNode } from "react";
import Stepper from "../ui/Stepper";
import { Button } from "../ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface LayoutStepProps {
  currentStep: number;
  totalSteps: number;
  title: string;
  children: ReactNode;
  onNext?: () => void;
  onPrevious?: () => void;
  onStepClick?: (step: number) => void;
}

export default function LayoutStep({
  currentStep,
  totalSteps,
  title,
  children,
  onNext,
  onPrevious,
  onStepClick,
}: LayoutStepProps) {
  const [forceRender, setForceRender] = useState(0);

  // Forzar re-render cuando cambie el paso
  useEffect(() => {
    setForceRender((prev) => {
      console.log(
        `DEBUG useEffect: Step changed to ${currentStep}, forceRender: ${prev + 1}`,
      );
      return prev + 1;
    });
  }, [currentStep]);

  // Force additional re-render for last step
  useEffect(() => {
    if (currentStep === totalSteps) {
      console.log(
        `DEBUG: Reached final step ${currentStep}, forcing additional render`,
      );
      setTimeout(() => setForceRender((prev) => prev + 1), 10);
    }
  }, [currentStep, totalSteps]);

  const handleNext = () => {
    if (currentStep < totalSteps && onNext) {
      onNext();
      setTimeout(() => setForceRender((prev) => prev + 1), 0);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1 && onPrevious) {
      onPrevious();
      setTimeout(() => setForceRender((prev) => prev + 1), 0);
    }
  };

  const handleStepClick = (step: number) => {
    if (onStepClick) {
      onStepClick(step);
      setTimeout(() => setForceRender((prev) => prev + 1), 0);
    }
  };

  return (
    <div className="w-full px-4 py-6">
      <h1 className="text-3xl font-bold mb-8">{title}</h1>

      <Stepper
        key={`stepper-${currentStep}-${forceRender}`}
        currentStep={currentStep}
        totalSteps={totalSteps}
        onStepClick={handleStepClick}
      />

      <div
        key={`step-${currentStep}-${forceRender}`}
        className="bg-white rounded-lg shadow-sm border p-6 mb-6 w-full"
      >
        {children}
      </div>

      {/* Botones de navegación */}
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentStep === 1}
          className="flex items-center gap-2"
        >
          <ChevronLeft className="w-4 h-4" />
          Anterior
        </Button>

        <span className="text-sm text-gray-600">
          Paso {currentStep} de {totalSteps}
        </span>

        <Button
          onClick={handleNext}
          disabled={currentStep === totalSteps}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
          key={`btn-${currentStep}-${forceRender}`} // Force re-render
        >
          {/* DEBUG: currentStep={currentStep}, totalSteps={totalSteps} */}
          {(() => {
            let buttonText;
            if (currentStep === 9) {
              buttonText = "Finalizar";
            } else {
              buttonText = "Siguiente";
            }
            return buttonText;
          })()}
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
