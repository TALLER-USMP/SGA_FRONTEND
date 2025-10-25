import StepsProvider from "../contexts/StepsContext";
import FirstStep from "../components/syllabus-process/FirstStep";
import SecondStep from "../components/syllabus-process/SecondStep";
import ThirdStep from "../components/syllabus-process/ThirdStep";
import FourthStep from "../components/syllabus-process/FourthStep";

export default function SyllabusProcess() {
  return (
    <StepsProvider totalSteps={9}>
      <FirstStep />
      <SecondStep />
      <ThirdStep />
      <FourthStep />
    </StepsProvider>
  );
}
