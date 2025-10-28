import React, { useEffect } from "react";
import { SyllabusProvider } from "../contexts/SyllabusContext";
import StepsProvider, { StepsContext } from "../contexts/StepsContext";
import NineStep from "../components/syllabus-process/NineStep";

// Small helper that moves the stepper to step 8 when mounted
const NineStepStarter: React.FC = () => {
  const steps = React.useContext(StepsContext);
  useEffect(() => {
    // go to step 8 (NineStep uses step={8})
    try {
      steps.goToStep(8);
    } catch {
      // ignore if context is not available
    }
  }, [steps]);

  return <NineStep />;
};

export default function NineStepDemo() {
  return (
    <SyllabusProvider>
      <StepsProvider totalSteps={9}>
        <NineStepStarter />
      </StepsProvider>
    </SyllabusProvider>
  );
}
