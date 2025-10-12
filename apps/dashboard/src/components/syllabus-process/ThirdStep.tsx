import { useSteps } from "../../contexts/StepsContext";
import { Step } from "../common/Step";


/**
 * Paso 1 crear secciones correspondientes
 * Paso 2 crear formularios reactivos por seccion
 * Paso 4 validar los inputs a ser necesario
 * Paso 5 integrar api usando tanstack query
 */
export default () => {
 const { nextStep } = useSteps();
 return (
  <Step step={3} onNextStep={() => nextStep()}>
   <h2 className="text-2xl font-semibold mb-2">Paso 3: </h2>
   El formulario va aqui
  </Step >
 )
}