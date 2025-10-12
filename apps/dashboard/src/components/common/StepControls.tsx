import type React from "react";
import { useSteps } from "../../contexts/StepsContext";

const StepControls: React.FC<{ onNextStep: () => void; }> = ({ onNextStep }) => {
 const { prevStep, isFirst, isLast } = useSteps();
 return (
  <div className="flex gap-2 justify-between w-full mt-6">
   <button
    onClick={prevStep}
    disabled={isFirst}
    className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
   >
    Atrás
   </button>
   <button
    onClick={() => {
     onNextStep()
    }}
    disabled={isLast}
    className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
   >
    Siguiente
   </button>
  </div>
 );
};


export default StepControls;