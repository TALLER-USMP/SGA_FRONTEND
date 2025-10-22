import { useSteps } from "../../contexts/StepsContext";
import { Step } from "../common/Step";


/**
 * 1. maquetar formulario
 * 2. integrar api para guardar los datos de la sumulla usando tanstack query
 * 3. renderizar el siguiente paso si la llamada fue exitosa
 */
export default () => {
 const { nextStep } = useSteps();
 return (
  <Step step={2} onNextStep={() => nextStep()}>
   <h2 className="text-2xl font-semibold mb-2">Paso 2: </h2>
   El formulario va aqui
  </Step >
 )
}