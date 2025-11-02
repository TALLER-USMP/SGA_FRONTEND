import React, { createContext, useContext, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

export type SyllabusMode = "create" | "edit";

interface SyllabusContextType {
  cursoCodigo: string | null;
  syllabusId: number | null;
  mode: SyllabusMode;
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

  // Parse syllabusId to number | null
  const syllabusId = useMemo(() => {
    const id = searchParams.get("id");
    return id ? parseInt(id, 10) : null;
  }, [searchParams]);

  // Get mode from URL params, default to "edit"
  const mode = useMemo(() => {
    const modeParam = searchParams.get("mode");
    return (modeParam === "create" ? "create" : "edit") as SyllabusMode;
  }, [searchParams]);

  const value = useMemo(
    () => ({
      cursoCodigo,
      syllabusId,
      mode,
      courseName,
      setCourseName,
    }),
    [cursoCodigo, syllabusId, mode, courseName],
  );

  return (
    <SyllabusContext.Provider value={value}>
      {children}
    </SyllabusContext.Provider>
  );
};
