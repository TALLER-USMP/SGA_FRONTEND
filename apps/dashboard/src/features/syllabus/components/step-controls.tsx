import type React from "react";
import { useSteps } from "../contexts/steps-context-provider";

const StepControls: React.FC<{
  onNextStep: () => void;
  hideControls?: boolean;
}> = ({ onNextStep, hideControls = false }) => {
  const { prevStep, isFirst, isLast, currentStep, allowedSteps } = useSteps();

  // Don't show controls if hideControls is true
  if (hideControls) {
    return null;
  }

  // Determinar si estamos en el último step permitido
  const lastAllowedStep =
    allowedSteps && allowedSteps.length > 0
      ? Math.max(...allowedSteps)
      : currentStep;

  const isLastAllowedStep = currentStep === lastAllowedStep;

  // El botón solo debe estar deshabilitado si NO es el último step permitido Y tampoco puede avanzar
  const isNextDisabled = !isLastAllowedStep && isLast;

  return (
    <div className="flex gap-2 justify-between w-full mt-6">
      <button
        onClick={prevStep}
        disabled={isFirst}
        className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50 hover:bg-gray-400 transition-colors"
      >
        Atrás
      </button>
      <button
        onClick={() => {
          onNextStep();
        }}
        disabled={isNextDisabled}
        className={`px-6 py-2 rounded disabled:opacity-50 transition-colors font-semibold ${
          isLastAllowedStep
            ? "bg-green-600 hover:bg-green-700 text-white shadow-lg"
            : "bg-blue-500 hover:bg-blue-600 text-white"
        }`}
      >
        {isLastAllowedStep ? "✓ Finalizar y Enviar a Revisión" : "Siguiente"}
      </button>
    </div>
  );
};

export default StepControls;
