import StepsProvider from "../contexts/steps-context";
import { SyllabusProvider } from "../contexts/syllabus-context";
import FirstStep from "../components/first-step";
import SecondStep from "../components/second-step";
import ThirdStep from "../components/third-step";
import FourthStep from "../components/fourth-step";
import FifthStep from "../components/fifth-step";
import SixthStep from "../components/sixth-step";
import SeventhStep from "../components/seventh-step";
import EighthStep from "../components/eighth-step";

export default function SyllabusProcess() {
  return (
    <SyllabusProvider>
      <StepsProvider totalSteps={8}>
        <FirstStep />
        <SecondStep />
        <ThirdStep />
        <FourthStep />
        <FifthStep />
        <SixthStep />
        <SeventhStep />
        <EighthStep />
      </StepsProvider>
    </SyllabusProvider>
  );
}
