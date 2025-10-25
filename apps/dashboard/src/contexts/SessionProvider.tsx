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
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token") ?? undefined;
    getSession.mutate(token, {
      onSuccess: () => {
        if (token) {
          const clear = window.location.origin + window.location.pathname;
          window.history.replaceState({}, document.title, clear);
        }
      },
    });
  }, []);

  return (
    <SessionContext.Provider
      value={{
        user: getSession.data?.user,
        isLoading: getSession.isPending,
        isError: getSession.isError,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};
