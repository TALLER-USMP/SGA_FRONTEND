import { useSteps } from "../../contexts/StepsContext";
import StepControls from "./StepControls";

type StepProps = {
 step: number;
 onNextStep: () => void;
 children: React.ReactNode;
};

export const Step = ({ step, children, onNextStep }: StepProps) => {
 const { currentStep } = useSteps();
 if (currentStep !== step) return null;
 return <div className="text-center h-full flex items-center flex-col justify-center">
  <div className="h-full w-full">
   {children}
  </div>
  <StepControls onNextStep={onNextStep} />
 </div >
};