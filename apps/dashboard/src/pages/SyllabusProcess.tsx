import StepsProvider from "../contexts/StepsContext";
import FirstStep from "../components/syllabus-process/FirstStep";
import SecondStep from "../components/syllabus-process/SecondStep";
import ThirdStep from "../components/syllabus-process/ThirdStep";
import FifthStep from "../components/syllabus-process/FifthStep";
import SixthStep from "../components/syllabus-process/SixthStep";

export default function SyllabusProcess() {
  return (
    <StepsProvider totalSteps={9}>
      <FirstStep />
      <SecondStep />
      <ThirdStep />
      <FifthStep />
      <SixthStep />
    </StepsProvider>
  );
}
