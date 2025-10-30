import React from "react";
import { useStepper } from "../hooks/use-steps";

export const StepsContext = React.createContext(
  {} as ReturnType<typeof useStepper>,
);

export const useSteps = () => React.useContext(StepsContext);
