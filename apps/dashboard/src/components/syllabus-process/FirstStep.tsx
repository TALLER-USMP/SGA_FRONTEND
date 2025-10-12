import { useSteps } from "../../contexts/StepsContext"
import { Step } from "../common/Step"



/**
 * TODO:
 * 1. Implementar api para obtener datos generales del syllabus paso 1
 * 2. rellenar los campos del formulario con dichos datos los inputs deben de estar desactivados.
 */
export default () => {
 const { nextStep } = useSteps();
 return (
  <Step step={1} onNextStep={() => nextStep()}>
   <h2 className="text-2xl font-semibold mb-2">Paso 1: </h2>
   El formulario va aqui
  </Step >
 )
}