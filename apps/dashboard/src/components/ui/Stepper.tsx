import { cn } from "../../lib/utils";

interface StepperProps {
  currentStep: number;
  totalSteps: number;
  onStepClick?: (step: number) => void;
}

export default function Stepper({
  currentStep,
  totalSteps,
  onStepClick,
}: StepperProps) {
  const steps = Array.from({ length: totalSteps }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-center mb-8">
      {steps.map((step, index) => (
        <div key={step} className="flex items-center">
          <div
            className={cn(
              "w-12 h-12 rounded-full flex items-center justify-center text-lg font-semibold transition-all cursor-pointer",
              step === currentStep
                ? "bg-red-500 text-white"
                : step < currentStep
                  ? "bg-gray-400 text-white"
                  : "bg-gray-200 text-gray-600 hover:bg-gray-300"
            )}
            onClick={() => onStepClick?.(step)}
          >
            {step}
          </div>
          {index < steps.length - 1 && (
            <div
              className={cn(
                "w-8 h-1 mx-2",
                step < currentStep ? "bg-gray-400" : "bg-gray-200"
              )}
            />
          )}
        </div>
      ))}
    </div>
  );
}
