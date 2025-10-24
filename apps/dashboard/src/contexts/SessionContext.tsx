import { createContext } from "react";
import type HeaderProps from "../interfaces/headerProps";

interface SessionContextValue {
  user: HeaderProps["user"];
  isLoading: boolean;
  isError: boolean;
}

export const SessionContext = createContext<SessionContextValue | undefined>(
  undefined,
);
