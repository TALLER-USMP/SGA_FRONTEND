import React from "react";

interface UseStepperOptions {
  initialStep?: number;
  totalSteps: number;
}

export function useStepper({ initialStep = 1, totalSteps }: UseStepperOptions) {
  const [currentStep, setCurrentStep] = React.useState(initialStep);

  const nextStep = React.useCallback(() => {
    setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
  }, [totalSteps]);

  const prevStep = React.useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  }, []);

  const goToStep = React.useCallback(
    (step: number) => {
      if (step >= 1 && step <= totalSteps) {
        setCurrentStep(step);
      }
    },
    [totalSteps],
  );

  const reset = React.useCallback(() => {
    setCurrentStep(initialStep);
  }, [initialStep]);

  return {
    currentStep,
    isFirst: currentStep === 1,
    isLast: currentStep === totalSteps,
    nextStep,
    prevStep,
    goToStep,
    reset,
  };
}
