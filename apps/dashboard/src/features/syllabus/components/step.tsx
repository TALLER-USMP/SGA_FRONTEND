import { useSteps } from "../contexts/steps-context-provider";
import StepControls from "./step-controls";

type StepProps = {
  step: number;
  onNextStep: () => void;
  children: React.ReactNode;
  hideControls?: boolean;
};

export const Step = ({
  step,
  children,
  onNextStep,
  hideControls = false,
}: StepProps) => {
  const { currentStep } = useSteps();
  if (currentStep !== step) return null;
  return (
    <div className="h-full flex flex-col justify-center">
      <div className="h-full w-full">{children}</div>
      <StepControls onNextStep={onNextStep} hideControls={hideControls} />
    </div>
  );
};
