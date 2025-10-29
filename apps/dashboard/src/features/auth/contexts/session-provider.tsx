import { useQuery } from "@tanstack/react-query";
import React from "react";
import { authService } from "../services/auth-service";
import { SessionContext } from "./session-context";

export const SessionProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [token, setToken] = React.useState<string | undefined>();

  React.useLayoutEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = urlParams.get("token");

    if (tokenFromUrl) {
      setToken(tokenFromUrl);
      // Limpiar la URL
      const clear = window.location.origin + window.location.pathname;
      window.history.replaceState({}, document.title, clear);
    }
  }, []);

  const getSession = useQuery({
    queryKey: ["session", token],
    queryFn: () => authService.fetchSession(token),
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });

  return (
    <SessionContext.Provider
      value={{
        user: getSession.data?.user,
        isLoading: getSession.isLoading,
        isError: getSession.isError,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};
