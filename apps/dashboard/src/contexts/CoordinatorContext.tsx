/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

type ViewMode = "MICRO" | "MACRO";

interface CoordinatorContextType {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
}

const CoordinatorContext = createContext<CoordinatorContextType | undefined>(
  undefined,
);

export function CoordinatorProvider({ children }: { children: ReactNode }) {
  const [viewMode, setViewModeState] = useState<ViewMode>(() => {
    const saved = localStorage.getItem("coordinatorViewMode");
    return (saved as ViewMode) || "MICRO";
  });

  const setViewMode = (mode: ViewMode) => {
    setViewModeState(mode);
    localStorage.setItem("coordinatorViewMode", mode);
  };

  return (
    <CoordinatorContext.Provider value={{ viewMode, setViewMode }}>
      {children}
    </CoordinatorContext.Provider>
  );
}

export function useCoordinator() {
  const context = useContext(CoordinatorContext);
  if (context === undefined) {
    throw new Error("useCoordinator must be used within a CoordinatorProvider");
  }
  return context;
}
