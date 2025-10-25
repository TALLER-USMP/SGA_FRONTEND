import { useMutation } from "@tanstack/react-query";
import React from "react";
import { authService } from "../services/authService";
import { SessionContext } from "./SessionContext";

export const SessionProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const getSession = useMutation({
    mutationKey: ["session"],
    mutationFn: authService.fetchSession,
  });

  React.useLayoutEffect(() => {
    getSession.mutate();
  }, []);

  return (
    <SessionContext.Provider
      value={{
        user: undefined,
        isLoading: getSession.isPending,
        isError: getSession.isError,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};
