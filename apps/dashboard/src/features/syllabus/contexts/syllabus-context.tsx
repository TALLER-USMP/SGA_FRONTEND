import React, { createContext, useContext, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

interface SyllabusContextType {
  cursoCodigo: string | null;
  syllabusId: string | null;
  courseName: string;
  setCourseName: (name: string) => void;
}

const SyllabusContext = createContext<SyllabusContextType | undefined>(
  undefined,
);

// eslint-disable-next-line react-refresh/only-export-components
export const useSyllabusContext = () => {
  const context = useContext(SyllabusContext);
  if (!context) {
    throw new Error(
      "useSyllabusContext must be used within a SyllabusProvider",
    );
  }
  return context;
};

interface SyllabusProviderProps {
  children: React.ReactNode;
}

export const SyllabusProvider: React.FC<SyllabusProviderProps> = ({
  children,
}) => {
  const [searchParams] = useSearchParams();
  const [courseName, setCourseName] = useState<string>("");

  const cursoCodigo = useMemo(() => searchParams.get("codigo"), [searchParams]);
  const syllabusId = useMemo(() => searchParams.get("id"), [searchParams]);

  const value = useMemo(
    () => ({
      cursoCodigo,
      syllabusId,
      courseName,
      setCourseName,
    }),
    [cursoCodigo, syllabusId, courseName],
  );

  return (
    <SyllabusContext.Provider value={value}>
      {children}
    </SyllabusContext.Provider>
  );
};
